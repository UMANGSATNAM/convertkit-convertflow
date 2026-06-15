import crypto from "crypto";
import { uploadAsset } from "./index";

// A simple in-memory cache for the MVP to prevent duplicate uploads.
// Key format: `${shopDomain}_${themeId}_${assetKey}`
// Value: MD5 checksum of the file content
const localAssetCache = new Map<string, string>();

export function calculateChecksum(content: string): string {
  return crypto.createHash("md5").update(content).digest("hex");
}

/**
 * Uploads an asset only if it has changed.
 * This saves Shopify API limits and speeds up generation.
 */
export async function uploadAssetWithCache(
  shop: any,
  themeId: string,
  assetKey: string,
  content: string
): Promise<boolean> {
  const cacheKey = `${shop.shopDomain}_${themeId}_${assetKey}`;
  const checksum = calculateChecksum(content);
  
  const existingChecksum = localAssetCache.get(cacheKey);
  
  if (existingChecksum === checksum) {
    console.log(`[Asset Cache Hit] Skipping upload for ${assetKey}`);
    return false; // Did not upload
  }

  // Upload to Shopify
  await uploadAsset(shop, themeId, assetKey, content);
  
  // Update cache
  localAssetCache.set(cacheKey, checksum);
  
  return true; // Uploaded
}

/**
 * Pre-populates the cache if we just fetched a theme or know its state.
 */
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
