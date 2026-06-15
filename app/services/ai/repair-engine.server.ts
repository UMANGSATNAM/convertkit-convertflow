import { GoogleGenAI } from "@google/genai";

export async function repairSectionJSON(
  brokenJsonStr: string,
  errorMessage: string,
  promptText: string
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set.");
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const finalPrompt = `
    ${promptText}
    
    Context:
    The following Shopify Liquid/JSON section failed validation.
    
    Error Message:
    ${errorMessage}
    
    Broken JSON:
    ${brokenJsonStr}
    
    Return ONLY the corrected JSON. Do not include markdown code block syntax.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt
    });

    const text = response.text || "";
    // Clean up any markdown code blocks if the AI ignored instructions
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Verify it's parseable before returning
    JSON.parse(cleaned);
    return cleaned;
  } catch (error) {
    console.error("Failed to repair JSON:", error);
    // If repair fails, return the original or throw. Returning original string for now.
    return brokenJsonStr;
  }
}
