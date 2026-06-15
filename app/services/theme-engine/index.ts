import { createSnapshot, fetchSnapshotContent } from "./snapshot.server";
import { graphqlRequest, restRequest } from "../shopify-api.server";
import { validateSettingsPatch, validateTemplateStructure } from "./validators.server";
import crypto from "crypto";
import { SnapReason } from "@prisma/client";

function normalizeSnapReason(reason: string): SnapReason {
  const upper = reason.toUpperCase();
  if (upper.includes("DESIGN")) return SnapReason.DESIGN_STUDIO;
  if (upper.includes("GENERATOR")) return SnapReason.GENERATOR;
  if (upper.includes("HEALTH")) return SnapReason.HEALTH_FIX;
  if (upper.includes("CAMPAIGN")) return SnapReason.CAMPAIGN;
  if (upper.includes("MANUAL")) return SnapReason.MANUAL;
  return SnapReason.AI; // fallback
}

async function getActiveThemeId(shopDomain: string, accessToken: string) {
  const data = await restRequest(shopDomain, accessToken, "GET", "themes.json");
  const activeTheme = data.themes.find((t: any) => t.role === "main");
  if (!activeTheme) throw new Error("No active theme found");
  return activeTheme.id.toString();
}

/**
 * Calculates MD5 checksum of a string
 */
function calculateChecksum(content: string): string {
  return crypto.createHash("md5").update(content).digest("hex");
}

export async function uploadAsset(shop: any, themeId: string, key: string, value: string) {
  const actualThemeId = themeId === "active" ? await getActiveThemeId(shop.shopDomain, shop.accessToken) : themeId;
  
  // themeFilesUpsert using GraphQL is safer, but REST is fine for single files. 
  // We'll use REST here for simplicity of single file upload, but could use themeFilesUpsert
  await restRequest(shop.shopDomain, shop.accessToken, "PUT", `themes/${actualThemeId}/assets.json`, {
    asset: { key, value }
  }, true); // serialize mutations
}

export async function installTheme(shop: any, themeName: string, sourceUrl: string): Promise<{ themeId: string }> {
  console.log(`Installing theme ${themeName} from ${sourceUrl}`);
  
  const query = `
    mutation themeCreate($source: URL!, $name: String!) {
      themeCreate(source: $source, name: $name) {
        theme {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await graphqlRequest(shop.shopDomain, shop.accessToken, query, { source: sourceUrl, name: themeName }, true);
  if (data.themeCreate?.userErrors?.length > 0) {
    throw new Error(`Failed to create theme: ${data.themeCreate.userErrors[0].message}`);
  }

  const themeIdGid = data.themeCreate.theme.id;
  const themeId = themeIdGid.split('/').pop();

  // Poll until processing is complete
  const pollQuery = `
    query getTheme($id: ID!) {
      theme(id: $id) {
        processing
      }
    }
  `;

  const startTime = Date.now();
  const timeoutMs = 5 * 60 * 1000; // 5 minutes

  while (Date.now() - startTime < timeoutMs) {
    const pollData = await graphqlRequest(shop.shopDomain, shop.accessToken, pollQuery, { id: themeIdGid });
    if (!pollData.theme?.processing) {
      return { themeId };
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  throw new Error("Theme creation timed out");
}

export async function publishTheme(shop: any, themeId: string) {
  console.log(`Publishing theme: ${themeId}`);
  const query = `
    mutation themePublish($id: ID!) {
      themePublish(id: $id) {
        theme {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const data = await graphqlRequest(shop.shopDomain, shop.accessToken, query, { id: `gid://shopify/Theme/${themeId}` }, true);
  if (data.themePublish?.userErrors?.length > 0) {
    throw new Error(`Failed to publish theme: ${data.themePublish.userErrors[0].message}`);
  }
}

export async function patchSettings(shop: any, themeId: string, patch: any, reason: string = "API"): Promise<{ snapshotId: string }> {
  console.log(`Patching settings for theme: ${themeId}`);
  
  // 1. Validate Patch
  await validateSettingsPatch(shop, themeId, patch);

  // 2. Read existing
  const existingSettings = await readFile(shop, themeId, "config/settings_data.json");
  
  // 3. Snapshot
  const snapshot = await createSnapshot(shop.id, themeId, "SETTINGS", "config/settings_data.json", existingSettings, normalizeSnapReason(reason));
  
  // 4. Merge
  const parsedSettings = existingSettings ? JSON.parse(existingSettings) : { current: {} };
  const newSettings = { ...parsedSettings };
  if (!newSettings.current) newSettings.current = {};
  
  for (const [key, value] of Object.entries(patch)) {
    newSettings.current[key] = value;
  }
  
  // 5. Write
  await uploadAsset(shop, themeId, "config/settings_data.json", JSON.stringify(newSettings, null, 2));
  
  return { snapshotId: snapshot.id };
}

export async function writeTemplate(shop: any, themeId: string, path: string, jsonContent: any, reason: string = "API"): Promise<{ snapshotId: string }> {
  console.log(`Writing template ${path} to theme: ${themeId}`);
  
  // 1. Validate structure
  validateTemplateStructure(jsonContent);

  let existingContent = "{}";
  try {
    existingContent = await readFile(shop, themeId, path);
  } catch (e) {
    // Template might not exist yet
  }
  
  // 2. Snapshot
  const snapshot = await createSnapshot(shop.id, themeId, "TEMPLATE", path, existingContent, normalizeSnapReason(reason));
  
  // 3. Write
  await uploadAsset(shop, themeId, path, JSON.stringify(jsonContent, null, 2));
  
  return { snapshotId: snapshot.id };
}

export async function readFile(shop: any, themeId: string, path: string): Promise<string> {
  const actualThemeId = themeId === "active" ? await getActiveThemeId(shop.shopDomain, shop.accessToken) : themeId;
  
  try {
    const data = await restRequest(shop.shopDomain, shop.accessToken, "GET", `themes/${actualThemeId}/assets.json?asset[key]=${path}`);
    return data.asset?.value || "{}";
  } catch (e: any) {
    if (e.message.includes("404")) return "{}";
    throw e;
  }
}

export async function restoreSnapshot(shop: any, themeId: string, path: string, r2Key: string) {
  console.log(`Restoring snapshot ${r2Key} for ${path}`);
  const content = await fetchSnapshotContent(r2Key);
  await uploadAsset(shop, themeId, path, content);
}

export async function scanAssets(shop: any, themeId: string): Promise<{ totalSize: number, files: any[] }> {
  const actualThemeId = themeId === "active" ? await getActiveThemeId(shop.shopDomain, shop.accessToken) : themeId;
  const data = await restRequest(shop.shopDomain, shop.accessToken, "GET", `themes/${actualThemeId}/assets.json`);
  
  const files = data.assets || [];
  const totalSize = files.reduce((acc: number, f: any) => acc + (f.size || 0), 0);
  
  return { totalSize, files };
}

export function addAppBlockDeepLink(shopDomain: string, themeId: string, blockHandle: string, target: string = "template"): string {
  return `https://${shopDomain}/admin/themes/${themeId}/editor?addAppBlockId=${blockHandle}&target=${target}`;
}
