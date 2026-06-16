import { CatalogContext } from "./catalog-analyzer.server";
import { generateStructuredJson } from "./claude.server";

export interface BrandContext {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  style: string;
}

/**
 * Analyzes brand aesthetics with prioritized inputs.
 * Uses Anthropic Claude to determine the perfect design style and hex color palette
 * based on the catalog's metadata.
 */
export async function analyzeBrand(catalogData: CatalogContext, shopDomain: string): Promise<BrandContext> {
  // Step 1: Ideally we would fetch the Logo asset from Shopify here.
  // Step 2: Ideally we would fetch existing theme settings colors here.
  
  const systemInstruction = `
    You are a Senior Brand Strategist for an Elite Shopify Agency.
    Your job is to determine the best 'style' and 'color palette' for a brand based on their catalog data.
    
    You must output ONLY valid JSON matching this schema:
    {
      "style": "string (MUST BE exactly one of: 'luxury', 'minimal', 'modern', 'bold')",
      "primaryColor": "string (hex code)",
      "secondaryColor": "string (hex code)",
      "accentColor": "string (hex code)"
    }

    Guidelines for style:
    - luxury: High price tier, low product count, tags like premium/gold. Colors often Black/Gold/White.
    - minimal: Average/high price, clean products, skincare, home. Colors often Whites/Beiges/Muted tones.
    - modern: Tech, gadgets, high product count. Colors often Apple Blue, Whites, light greys.
    - bold: Streetwear, sales, low prices. Colors often strong Reds, Blacks, high contrast.
  `;

  const userPrompt = JSON.stringify({
    shopDomain,
    industry: catalogData.industry,
    subcategory: catalogData.subcategory,
    priceTier: catalogData.priceTier,
    avgPrice: catalogData.avgPrice,
    tags: catalogData.tags,
    imagesPerProduct: catalogData.imagesPerProduct
  });

  let aiResult = {
    style: "minimal",
    primaryColor: "#222222",
    secondaryColor: "#ffffff",
    accentColor: "#cccccc"
  };

  try {
    aiResult = await generateStructuredJson<typeof aiResult>(systemInstruction, userPrompt);
    
    // Ensure the style is one of our supported ones
    const validStyles = ["luxury", "minimal", "modern", "bold"];
    if (!validStyles.includes(aiResult.style)) {
      aiResult.style = "minimal";
    }
  } catch (err) {
    console.error("Claude failed in brand analyzer, falling back to defaults.", err);
  }

  return {
    primaryColor: aiResult.primaryColor,
    secondaryColor: aiResult.secondaryColor,
    accentColor: aiResult.accentColor,
    style: aiResult.style
  };
}
