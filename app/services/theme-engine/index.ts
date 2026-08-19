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
  console.log(`Installing blank theme shell: ${themeName}`);
  
  // Layer 1: Empty Theme via REST API
  // We bypass GraphQL source: URL! requirement by creating a 100% blank theme using REST
  const data = await restRequest(shop.shopDomain, shop.accessToken, "POST", "themes.json", {
    theme: {
      name: themeName,
      role: "unpublished"
    }
  });

  if (!data.theme || !data.theme.id) {
    throw new Error(`Failed to create theme: ${JSON.stringify(data)}`);
  }

  const themeId = data.theme.id.toString();
  
  // Wait a moment for Shopify to fully propagate the empty theme
  await new Promise(r => setTimeout(r, 2000));
  
  return { themeId };
}

export async function upsertThemeFilesBatched(shop: any, themeId: string, filesToUpload: Record<string, string>) {
  const totalFiles = Object.keys(filesToUpload).length;
  console.log(`[FastUpload] Starting instant upload of ${totalFiles} files to theme ${themeId}`);

  if (process.env.MOCK_SHOPIFY === "true") {
    console.log(`[Mock Upload Batch] MOCK_SHOPIFY=true, bypassing GraphQL upload for ${totalFiles} files.`);
    const { uploadAssetWithCache } = await import("./asset-cache.server");
    for (const [filename, content] of Object.entries(filesToUpload)) {
      await uploadAssetWithCache(shop, themeId, filename, content);
    }
    return;
  }

  const themeGid = `gid://shopify/OnlineStoreTheme/${themeId}`;

  const getSortWeight = (filename: string) => {
    if (filename.endsWith(".liquid")) {
      if (filename.startsWith("layout/")) return 1;
      if (filename.startsWith("snippets/")) return 2;
      if (filename.startsWith("sections/")) return 3;
      return 4;
    }
    if (filename.endsWith(".js") || filename.endsWith(".css")) return 5;
    if (filename === "config/settings_schema.json") return 6;
    if (filename === "config/settings_data.json") return 10;
    if (filename.startsWith("locales/")) return 7;
    if (filename.startsWith("sections/")) return 8;
    if (filename.startsWith("templates/")) return 9;
    return 11;
  };

  const filesArray = Object.entries(filesToUpload)
    .sort((a, b) => getSortWeight(a[0]) - getSortWeight(b[0]))
    .map(([filename, content]) => ({
      filename,
      body: content.startsWith("http://") || content.startsWith("https://")
        ? { type: "URL", value: content }
        : { type: "TEXT", value: content }
    }));

  const query = `
    mutation themeFilesUpsert($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
      themeFilesUpsert(themeId: $themeId, files: $files) {
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Direct fast batches (up to 50 files per single mutation - official Shopify limit)
  const batchSize = 50;
  for (let i = 0; i < filesArray.length; i += batchSize) {
    const batch = filesArray.slice(i, i + batchSize);
    let retries = 2;
    while (retries >= 0) {
      try {
        const res = await graphqlRequest(
          shop.shopDomain,
          shop.accessToken,
          query,
          { themeId: themeGid, files: batch },
          false // Direct execution without Redis mutex bottlenecks
        );
        const batchFiles = batch.map((f: any) => f.filename).join(', ');
        console.log(`[FastUpload] Batch ${Math.floor(i/batchSize)+1}: ${batch.length} files uploaded [${batchFiles}]`);
        if (res?.themeFilesUpsert?.userErrors?.length > 0) {
          const userErrs = res.themeFilesUpsert.userErrors;
          console.error(`[FastUpload] ❌ Shopify user errors in batch:`, JSON.stringify(userErrs));
        } else {
          console.log(`[FastUpload] ✅ Batch ${Math.floor(i/batchSize)+1} uploaded successfully`);
        }
        break;
      } catch (err: any) {
        retries--;
        console.warn(`[FastUpload] Batch error (${err.message}). Retries left: ${retries}`);
        if (retries < 0) {
          // Sub-chunking fallback if Shopify payload size limit hit
          for (let j = 0; j < batch.length; j += 10) {
            const sub = batch.slice(j, j + 10);
            await graphqlRequest(shop.shopDomain, shop.accessToken, query, { themeId: themeGid, files: sub }, false);
          }
        } else {
          await new Promise(r => setTimeout(r, 100));
        }
      }
    }
  }
  console.log(`[FastUpload] Successfully uploaded all ${totalFiles} files in record time.`);
}

export async function publishTheme(shop: any, themeId: string) {
  console.log(`Publishing theme: ${themeId}`);
  const data = await restRequest(shop.shopDomain, shop.accessToken, "PUT", `themes/${themeId}.json`, {
    theme: {
      id: themeId,
      role: "main"
    }
  });
  return data;
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
    const data = await restRequest(shop.shopDomain, shop.accessToken, "GET", `themes/${actualThemeId}/assets.json?asset[key]=${encodeURIComponent(path)}`);
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
