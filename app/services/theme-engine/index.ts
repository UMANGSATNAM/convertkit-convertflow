import { createSnapshot, fetchSnapshotContent } from "./snapshot.server";
import { restRequest } from "../shopify-api.server";

async function getActiveThemeId(shopDomain: string, accessToken: string) {
  const data = await restRequest(shopDomain, accessToken, "GET", "themes.json");
  const activeTheme = data.themes.find((t: any) => t.role === "main");
  if (!activeTheme) throw new Error("No active theme found");
  return activeTheme.id;
}

async function uploadAsset(shop: any, themeId: string, key: string, value: string) {
  const actualThemeId = themeId === "active" ? await getActiveThemeId(shop.shopDomain, shop.accessToken) : themeId;
  await restRequest(shop.shopDomain, shop.accessToken, "PUT", `themes/${actualThemeId}/assets.json`, {
    asset: { key, value }
  });
}

// We will use the Shopify Admin API for these actions
export async function installTheme(shop: any, nicheId: string, brandConfig: any): Promise<{ themeId: string }> {
  // 1. Trigger Theme Create via ZIP URL from Niche
  // 2. Poll until processing is complete
  console.log(`Installing theme for niche: ${nicheId}`);
  // Mock return
  return { themeId: "mock_theme_123" };
}

export async function publishTheme(shop: any, themeId: string) {
  console.log(`Publishing theme: ${themeId}`);
  // Call Shopify themePublish API
}

export async function patchSettings(shop: any, themeId: string, patch: any, reason: string = "API"): Promise<{ snapshotId: string }> {
  console.log(`Patching settings for theme: ${themeId}`);
  
  // 1. Read existing settings_data.json
  const existingSettings = await readFile(shop, themeId, "config/settings_data.json");
  
  // 2. Snapshot old settings
  const snapshot = await createSnapshot(shop.id, themeId, "SETTINGS", "config/settings_data.json", existingSettings, reason);
  
  // 3. Deep-merge patch
  const parsedSettings = existingSettings ? JSON.parse(existingSettings) : { current: {} };
  
  // Shopify Dawn stores colors in parsedSettings.current
  const newSettings = { ...parsedSettings };
  if (!newSettings.current) newSettings.current = {};
  
  // Apply patches
  for (const [key, value] of Object.entries(patch)) {
    newSettings.current[key] = value;
  }
  
  // 4. Write back
  await uploadAsset(shop, themeId, "config/settings_data.json", JSON.stringify(newSettings, null, 2));
  
  return { snapshotId: snapshot.id };
}

export async function writeTemplate(shop: any, themeId: string, path: string, jsonContent: any, reason: string = "API"): Promise<{ snapshotId: string }> {
  console.log(`Writing template ${path} to theme: ${themeId}`);
  let existingContent = "{}";
  try {
    existingContent = await readFile(shop, themeId, path);
  } catch (e) {
    console.log("Template doesn't exist yet, creating new one.");
  }
  
  const snapshot = await createSnapshot(shop.id, themeId, "TEMPLATE", path, existingContent, reason);
  
  await uploadAsset(shop, themeId, path, JSON.stringify(jsonContent, null, 2));
  
  return { snapshotId: snapshot.id };
}

export async function readFile(shop: any, themeId: string, path: string): Promise<string> {
  const actualThemeId = themeId === "active" ? await getActiveThemeId(shop.shopDomain, shop.accessToken) : themeId;
  const data = await restRequest(shop.shopDomain, shop.accessToken, "GET", `themes/${actualThemeId}/assets.json?asset[key]=${path}`);
  return data.asset?.value || "{}";
}

export async function restoreSnapshot(shop: any, snapshotId: string) {
  // 1. Find snapshot in DB
  // 2. Fetch content from R2
  // 3. uploadAsset(shop, themeId, path, content)
}

export async function scanAssets(shop: any, themeId: string): Promise<any> {
  // Call Shopify Asset list API to check sizes, etc.
  return { totalSize: 1024, files: [] };
}

export function addAppBlockDeepLink(themeId: string, blockHandle: string, target: string): string {
  // Construct Shopify deep link url for the theme editor
  return `https://admin.shopify.com/store/placeholder/themes/${themeId}/editor?addAppBlockId=${blockHandle}&target=${target}`;
}
