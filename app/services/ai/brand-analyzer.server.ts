import { CatalogContext } from "./catalog-analyzer.server";

export interface BrandContext {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  style: string;
}

/**
 * Analyzes brand aesthetics with prioritized inputs.
 * For MVP, we use deterministic fallbacks based on industry if
 * we cannot scrape a logo or existing theme settings.
 */
export async function analyzeBrand(catalogData: CatalogContext, shopDomain: string): Promise<BrandContext> {
  // Step 1: Ideally we would fetch the Logo asset from Shopify here.
  // Step 2: Ideally we would fetch existing theme settings colors here.
  
  // Fallback default colors based on the highest scored style later
  let primaryColor = "#000000";
  let secondaryColor = "#ffffff";
  let accentColor = "#cccccc";

  // --- BRAND STYLE WEIGHTED SCORING ENGINE ---
  let scores = {
    luxury: 0,
    minimal: 0,
    modern: 0,
    bold: 0
  };

  // 1. Price Weight (40%)
  // luxury > $500, minimal $100-$500, modern $50-$200, bold < $100 (streetwear/sale)
  if (catalogData.avgPrice > 500) scores.luxury += 40;
  else if (catalogData.avgPrice > 150) scores.minimal += 40;
  else if (catalogData.avgPrice > 50) scores.modern += 40;
  else scores.bold += 40;

  // 2. Product Images (20%)
  // High image count per product indicates high-end or modern tech
  if (catalogData.imagesPerProduct > 4) scores.luxury += 20;
  else if (catalogData.imagesPerProduct >= 2 && catalogData.imagesPerProduct <= 4) scores.modern += 20;
  else scores.minimal += 20; // 1 or 0 images leans minimal

  // 3. Product Count (20%)
  // Small catalog often leans minimal or luxury. Huge catalog leans modern (tech/retail).
  if (catalogData.productCount < 10) scores.luxury += 20;
  else if (catalogData.productCount < 30) scores.minimal += 20;
  else if (catalogData.productCount < 80) scores.bold += 20;
  else scores.modern += 20;

  // 4. Tags (20%)
  const allTags = catalogData.tags.join(" ").toLowerCase();
  if (allTags.includes("premium") || allTags.includes("exclusive") || allTags.includes("gold")) scores.luxury += 20;
  if (allTags.includes("sale") || allTags.includes("streetwear") || allTags.includes("hype")) scores.bold += 20;
  if (allTags.includes("tech") || allTags.includes("gadget") || allTags.includes("smart")) scores.modern += 20;
  if (allTags.includes("clean") || allTags.includes("simple") || allTags.includes("organic")) scores.minimal += 20;

  // Determine highest score
  let style = "minimal";
  let highestScore = -1;
  for (const [key, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      style = key;
    }
  }

  // Set colors based on the winning style (fallback if no theme settings grabbed)
  switch (style) {
    case "luxury":
      primaryColor = "#1a1a1a";
      secondaryColor = "#ffffff";
      accentColor = "#d4af37"; // Gold
      break;
    case "minimal":
      primaryColor = "#222222";
      secondaryColor = "#fafafa";
      accentColor = "#888888";
      break;
    case "modern":
      primaryColor = "#0071e3"; // Apple Blue
      secondaryColor = "#f5f5f7";
      accentColor = "#ff9900";
      break;
    case "bold":
      primaryColor = "#000000";
      secondaryColor = "#ffffff";
      accentColor = "#ff0000"; // Red
      break;
  }

  // If we needed LLM for extreme edge cases, we'd call it here.

  return {
    primaryColor,
    secondaryColor,
    accentColor,
    style
  };
}
