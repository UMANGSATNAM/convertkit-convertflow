import { CatalogContext } from "./catalog-analyzer.server";
import { generateStructuredJson } from "./claude.server";

export interface CROContext {
  trustLevel: "low" | "medium" | "high";
  socialProofNeeded: boolean;
  faqNeeded: boolean;
}

/**
 * Analyzes the required CRO elements using Anthropic Claude
 * based on the Catalog Analysis.
 */
export async function analyzeCRO(catalogData: CatalogContext): Promise<CROContext> {
  const systemInstruction = `
    You are a Senior Conversion Rate Optimization (CRO) Expert for E-commerce.
    Your job is to determine the optimal trust signals needed for a store based on its catalog context.
    
    You must output ONLY valid JSON matching this schema:
    {
      "trustLevel": "string (MUST BE 'low', 'medium', or 'high')",
      "socialProofNeeded": boolean,
      "faqNeeded": boolean
    }

    Guidelines:
    - High trustLevel & faqNeeded = true: For Premium/high-priced goods (Luxury, Electronics), or if catalog score is low (needs compensation).
    - socialProofNeeded = true: Almost always true for Beauty, Fashion, Health, or if it's a value/trend product (TikTok style).
    - Low trustLevel: Only if it's a very cheap, high-impulse buy item where heavy trust badges might look spammy.
  `;

  const userPrompt = JSON.stringify({
    industry: catalogData.industry,
    dominant_categories: catalogData.dominant_categories,
    price_band: catalogData.price_band,
    avgPrice: catalogData.avgPrice,
    catalog_strength: catalogData.catalog_strength
  });

  let aiResult = {
    trustLevel: "medium" as "low" | "medium" | "high",
    socialProofNeeded: false,
    faqNeeded: false
  };

  try {
    aiResult = await generateStructuredJson<typeof aiResult>(systemInstruction, userPrompt);
    
    if (!["low", "medium", "high"].includes(aiResult.trustLevel)) {
      aiResult.trustLevel = "medium";
    }
  } catch (err) {
    console.error("Claude failed in CRO analyzer, falling back to defaults.", err);
  }

  return {
    trustLevel: aiResult.trustLevel,
    socialProofNeeded: aiResult.socialProofNeeded,
    faqNeeded: aiResult.faqNeeded
  };
}
