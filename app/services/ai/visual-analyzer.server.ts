import { generateStructuredJson } from "./claude.server";

export interface VisualContext {
  image_style: string;
  brightness: string;
  background_type: string;
  visual_quality: string;
  people_present: boolean;
  image_quality_score: number;
}

/**
 * Phase 1.5: Visual Asset Analyzer
 * Analyzes the merchant's real product image URLs to bridge Catalog and Brand intelligence.
 * Now passes actual CDN URLs so Claude can reason about the visual language accurately.
 */
export async function analyzeVisualAssets(
  shopDomain: string,
  sampleImageUrls: string[]
): Promise<VisualContext> {
  
  const systemInstruction = `
    You are a Senior Art Director for a premium Shopify agency.
    You will be given a list of product image URLs from a merchant's Shopify store.
    Your job is to infer the visual quality, style, and brand photographic direction from these images.
    
    You must output ONLY valid JSON matching this EXACT schema:
    {
      "image_style": "string (MUST be one of: editorial, lifestyle, flatlay, user_generated, product_only, mixed)",
      "brightness": "string (MUST be one of: dark, light, high_contrast, moody, neutral)",
      "background_type": "string (MUST be one of: studio, outdoor, context, mixed, white)",
      "visual_quality": "string (MUST be one of: high, medium, low)",
      "people_present": boolean,
      "image_quality_score": "number (0-100 — 100 = professional editorial, 60 = standard, below 40 = user generated/low quality)"
    }

    Guidelines:
    - "editorial": Fashion/beauty images with intentional lighting and styling.
    - "lifestyle": People using products in natural settings.
    - "flatlay": Products arranged on flat surface (typical in beauty, jewellery).
    - "user_generated": Casual phone photos, unpolished.
    - "product_only": Clean product-only shots (common in electronics, home).
    - "people_present": true if the images show models or lifestyle subjects.
    - "image_quality_score": Professional studio photography = 85-100, polished brand = 65-85, average = 40-65, poor = 0-40.
  `;

  // Pass real URLs so Claude can evaluate the actual visual content
  const userPrompt = JSON.stringify({
    shopDomain,
    imageCount: sampleImageUrls.length,
    // Pass up to 15 real CDN URLs for analysis
    imageUrls: sampleImageUrls.slice(0, 15)
  });

  let aiResult: VisualContext = {
    image_style: "lifestyle",
    brightness: "light",
    background_type: "studio",
    visual_quality: "medium",
    people_present: false,
    image_quality_score: 60
  };

  try {
    const result = await generateStructuredJson<VisualContext>(systemInstruction, userPrompt);
    if (result?.image_style) {
      aiResult = result;
      // Clamp image_quality_score to valid range
      aiResult.image_quality_score = Math.min(100, Math.max(0, aiResult.image_quality_score ?? 60));
    }
  } catch (err) {
    console.error("[VisualAnalyzer] Claude failed — falling back to safe defaults.", err);
  }

  console.log(`[VisualAnalyzer] Result for ${shopDomain}:`, aiResult);
  return aiResult;
}
