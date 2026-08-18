import { generateStructuredJson } from "../ai/claude.server";
import { NICHE_PLACEHOLDER_PACKS, NichePackName } from "../../data/placeholders/index.js";

export type ImageRole = 
  | "hero_lifestyle" 
  | "texture_ingredient" 
  | "lookbook_editorial" 
  | "portrait_avatar" 
  | "product_cutout" 
  | "other";

export interface ClassifiedImage {
  url: string;
  role: ImageRole;
  qualityScore: number;
  description?: string;
}

/**
 * Phase 3.5: Intelligent Image Role Classification & Slot Assignment
 * Classifies merchant/sample image URLs by architectural role and matches them
 * with strict intent rules. Enforces a 3-tier fallback hierarchy:
 * Tier 1: Merchant's real catalog matching the role
 * Tier 2: Niche-curated placeholder pack matching the role
 * Tier 3: Empty string ("") triggering clean typography/CSS fallbacks
 */
export class ImageAssignmentService {
  /**
   * Classify a batch of image URLs by their visual intent / slot role using Claude.
   */
  static async classifyImages(imageUrls: string[]): Promise<ClassifiedImage[]> {
    if (!imageUrls || imageUrls.length === 0) return [];

    const systemInstruction = `
      You are a Senior Art Director and Visual Curator for a luxury Shopify theme engine.
      You will be given a list of image URLs from a store or asset catalog.
      Your job is to classify EACH image URL into exactly ONE of these architectural roles:
      
      - "hero_lifestyle": Wide, atmospheric, high-mood editorial or landscape shot suitable for a full-bleed homepage background banner. No isolated product cutouts on plain white.
      - "texture_ingredient": Botanical smears, oil droplets, skincare cream texture, raw ingredients, or artistic macro flatlays.
      - "lookbook_editorial": Lifestyle shot featuring a person/model or luxury vanity setting using/displaying the products.
      - "portrait_avatar": A clear headshot/portrait photo of a real human being (for review avatars).
      - "product_cutout": Isolated product shot on plain white or transparent studio background.
      - "other": Gift cards, logos, icons, banners with text overlay, or low-quality/irrelevant shots.

      Refer to each image by the index it was given. Do NOT repeat the URL back —
      the URLs are long and echoing 25 of them is what previously truncated the
      reply mid-string and lost the whole classification.

      Return ONLY valid JSON matching this schema:
      {
        "classified": [
          {
            "i": "number (the index of the image being classified)",
            "role": "hero_lifestyle | texture_ingredient | lookbook_editorial | portrait_avatar | product_cutout | other",
            "qualityScore": "number (0-100)"
          }
        ]
      }
    `;

    const batch = imageUrls.slice(0, 25);
    const userPrompt = JSON.stringify({
      imageCount: batch.length,
      images: batch.map((url, i) => ({ i, url }))
    });

    try {
      const result = await generateStructuredJson<{ classified: Array<{ i: number; role: ImageRole; qualityScore: number }> }>(
        systemInstruction,
        userPrompt,
        3000
      );

      if (result?.classified && Array.isArray(result.classified)) {
        const mapped = result.classified
          .filter(c => typeof c?.i === "number" && batch[c.i])
          .map(c => ({
            url: batch[c.i],
            role: c.role,
            qualityScore: typeof c.qualityScore === "number" ? c.qualityScore : 50,
          }));

        if (mapped.length > 0) {
          if (mapped.length < batch.length) {
            console.warn(
              `[ImageAssignmentService] Model classified ${mapped.length} of ${batch.length} images; ` +
              `the rest fall back to heuristics.`
            );
          }
          return mapped;
        }
      }
    } catch (err) {
      console.error("[ImageAssignmentService] Classification failed, falling back to heuristics.", err);
    }

    // Heuristic fallback if Claude unreachable
    return imageUrls.map(url => {
      const lower = url.toLowerCase();
      let role: ImageRole = "product_cutout";
      if (lower.includes("dropper") || lower.includes("vanity") || lower.includes("1522337360788")) role = "hero_lifestyle";
      else if (lower.includes("smear") || lower.includes("texture") || lower.includes("1571781926291") || lower.includes("oil")) role = "texture_ingredient";
      else if (lower.includes("lifestyle") || lower.includes("1512496015851") || lower.includes("lookbook")) role = "lookbook_editorial";
      else if (lower.includes("avatar") || lower.includes("headshot") || lower.includes("person") || lower.includes("face") || lower.includes("400")) role = "portrait_avatar";
      else if (lower.includes("gift") || lower.includes("snowboard")) role = "other";
      return { url, role, qualityScore: 75 };
    });
  }

  /**
   * Helper to format raw URLs into valid Shopify OS 2.0 image_picker references (shopify://shop_images/...)
   */
  static toShopifyImageRef(url: string): string {
    if (!url) return "";
    if (url.startsWith("shopify://")) return url;
    const cleanFilename = url.split("/").pop()?.split("?")[0];
    if (!cleanFilename) return "";
    return `shopify://shop_images/${cleanFilename}`;
  }

  /**
   * Retrieve the best matching image URL for a given slot role enforcing 3-Tier Hierarchy:
   * 1. Merchant's catalog matching role
   * 2. Niche placeholder pack matching role
   * 3. Empty string ("") for clean typography/CSS fallbacks
   */
  static getBestMatchForRole(
    merchantClassified: ClassifiedImage[],
    desiredRoles: ImageRole[],
    usedUrls: Set<string> = new Set(),
    niche: NichePackName = "beauty",
    slotName: string = "unnamed-slot"
  ): string {
    // Tier 1: Merchant Catalog Match
    for (const desiredRole of desiredRoles) {
      const matches = merchantClassified
        .filter(img => img.role === desiredRole && !usedUrls.has(img.url))
        .sort((a, b) => b.qualityScore - a.qualityScore);

      if (matches.length > 0) {
        usedUrls.add(matches[0].url);
        const ref = this.toShopifyImageRef(matches[0].url);
        console.log(`[ImageAssignment] Slot: ${slotName} | Tier: 1 (Catalog) | Role: ${desiredRole} | Image: ${ref}`);
        return ref;
      }
    }

    // Tier 2: Niche Placeholder Pack Match
    const nichePack = NICHE_PLACEHOLDER_PACKS[niche] || NICHE_PLACEHOLDER_PACKS["beauty"];
    for (const desiredRole of desiredRoles) {
      const matches = nichePack.filter(img => img.role === desiredRole && !usedUrls.has(img.url));
      if (matches.length > 0) {
        usedUrls.add(matches[0].url);
        const ref = this.toShopifyImageRef(matches[0].url);
        console.log(`[ImageAssignment] Slot: ${slotName} | Tier: 2 (Placeholder Pack) | Role: ${desiredRole} | Image: ${ref}`);
        return ref;
      }
    }

    // Tier 3: Typography / CSS Fallback (omit image)
    console.log(`[ImageAssignment] Slot: ${slotName} | Tier: 3 (Empty/Fallback) | Roles: ${desiredRoles.join(', ')} | Image: None`);
    return "";
  }
}

