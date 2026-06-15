import { GoogleGenAI } from "@google/genai";
import { BusinessBlueprint } from "./business.server";
import { BrandBlueprint } from "./brand.server";

export interface StoreBlueprint {
  pages: {
    index: Array<{ sectionType: string; goal: string }>;
    product: Array<{ sectionType: string; goal: string }>;
    collection: Array<{ sectionType: string; goal: string }>;
  };
  globalSettings: Record<string, any>;
}

export async function generateStoreBlueprint(
  businessBlueprint: BusinessBlueprint,
  brandBlueprint: BrandBlueprint,
  promptText: string
): Promise<StoreBlueprint> {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set.");
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const finalPrompt = `
    ${promptText}
    
    Context:
    Business Message: ${businessBlueprint.coreMessage}
    Value Prop: ${businessBlueprint.valueProposition}
    Aesthetic: ${brandBlueprint.aestheticStyle}
    
    Return valid JSON matching this schema:
    {
      "pages": {
        "index": [{ "sectionType": "hero|trust|grid|banner|faq", "goal": "conversion|awareness|trust" }],
        "product": [{ "sectionType": "main|reviews|recommendations", "goal": "string" }],
        "collection": [{ "sectionType": "grid|filters|banner", "goal": "string" }]
      },
      "globalSettings": {}
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as StoreBlueprint;
  } catch (error) {
    console.error("Failed to generate Store Blueprint:", error);
    return {
      pages: {
        index: [
          { sectionType: "hero", goal: "conversion" },
          { sectionType: "trust", goal: "trust" },
          { sectionType: "grid", goal: "conversion" }
        ],
        product: [],
        collection: []
      },
      globalSettings: {}
    };
  }
}
