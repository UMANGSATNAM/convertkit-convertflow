import { GoogleGenAI } from "@google/genai";
import { CatalogContext } from "../catalog-analyzer.server";

export interface BusinessBlueprint {
  targetAudience: string;
  coreMessage: string;
  positioning: string;
  valueProposition: string;
}

export async function generateBusinessBlueprint(
  catalogContext: CatalogContext,
  nicheInput: string,
  promptText: string
): Promise<BusinessBlueprint> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const finalPrompt = `
    ${promptText}
    
    Context:
    Niche: ${nicheInput}
    Product Count: ${catalogContext.productCount}
    Vendors: ${catalogContext.vendors.join(", ")}
    Product Types: ${catalogContext.productTypes.join(", ")}
    Price Range: $${catalogContext.priceRange.min} - $${catalogContext.priceRange.max}
    
    Output strictly as valid JSON matching this interface:
    {
      "targetAudience": "string",
      "coreMessage": "string",
      "positioning": "string",
      "valueProposition": "string"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as BusinessBlueprint;
  } catch (error) {
    console.error("Failed to generate Business Blueprint:", error);
    // Fallback deterministic
    return {
      targetAudience: "General shoppers interested in " + nicheInput,
      coreMessage: "High quality products at competitive prices.",
      positioning: "Value-focused",
      valueProposition: "Discover the best selection of " + catalogContext.productTypes[0]
    };
  }
}
