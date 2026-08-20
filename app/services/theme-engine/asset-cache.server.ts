import crypto from "crypto";
import { uploadAsset } from "./index";

// In-memory asset checksum cache
const localAssetCache = new Map<string, string>();

export function calculateChecksum(content: string): string {
  return crypto.createHash("md5").update(content).digest("hex");
}

/**
 * Uploads an asset to Shopify.
 * Critical files (templates/*.json, sections/*.json, sections/*.liquid) are ALWAYS uploaded
 * so Shopify OS 2.0 theme editor never renders blank pages.
 */
export async function uploadAssetWithCache(
  shop: any,
  themeId: string,
  assetKey: string,
  content: string
): Promise<boolean> {
  const cacheKey = `${shop.shopDomain}_${themeId}_${assetKey}`;
  const checksum = calculateChecksum(content);
  
  const isCriticalFile =
    assetKey.startsWith("templates/") ||
    assetKey.startsWith("sections/") ||
    assetKey.endsWith(".json");

  const existingChecksum = localAssetCache.get(cacheKey);
  
  if (!isCriticalFile && existingChecksum === checksum) {
    console.log(`[Asset Cache Hit] Skipping unchanged non-critical asset: ${assetKey}`);
    return false;
  }

  // Upload to Shopify
  if (process.env.MOCK_SHOPIFY === "true") {
    console.log(`[Mock Upload Cache] Skip upload to Shopify for: ${assetKey}`);
  } else {
    await uploadAsset(shop, themeId, assetKey, content);
  }
  
  // Update cache
  localAssetCache.set(cacheKey, checksum);
  
  return true;
}

export function seedAssetCache(
  shopDomain: string,
  themeId: string,
  assetKey: string,
  content: string
) {
  const cacheKey = `${shopDomain}_${themeId}_${assetKey}`;
  const checksum = calculateChecksum(content);
  localAssetCache.set(cacheKey, checksum);
}
