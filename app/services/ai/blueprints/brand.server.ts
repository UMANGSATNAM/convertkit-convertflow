import { GoogleGenAI } from "@google/genai";
import { BusinessBlueprint } from "./business.server";
import { CompetitorContext } from "../competitor-analyzer.server";

export interface BrandBlueprint {
  typographyHierarchy: {
    headings: string;
    body: string;
  };
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  aestheticStyle: string; // e.g., "minimal", "luxury", "playful"
  contrastScore?: number; // programmatic
}

// Basic contrast ratio checker
function getLuminance(hex: string) {
  let rgb = hex.replace("#", "");
  if (rgb.length === 3) rgb = rgb.split("").map(c => c + c).join("");
  const r = parseInt(rgb.substring(0, 2), 16) / 255;
  const g = parseInt(rgb.substring(2, 4), 16) / 255;
  const b = parseInt(rgb.substring(4, 6), 16) / 255;
  
  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1: string, hex2: string) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (lightest + 0.05) / (darkest + 0.05);
}

export async function generateBrandBlueprint(
  businessBlueprint: BusinessBlueprint,
  competitorContext: CompetitorContext,
  promptText: string
): Promise<BrandBlueprint> {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set.");
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const finalPrompt = `
    ${promptText}
    
    Context:
    Business Positioning: ${businessBlueprint.positioning}
    Target Audience: ${businessBlueprint.targetAudience}
    Competitor Patterns: ${competitorContext.layoutPatterns.join(", ")}
    
    Return valid JSON matching this schema:
    {
      "typographyHierarchy": {
        "headings": "string (font name)",
        "body": "string (font name)"
      },
      "colorPalette": {
        "primary": "hex string",
        "secondary": "hex string",
        "accent": "hex string",
        "background": "hex string",
        "text": "hex string"
      },
      "aestheticStyle": "string"
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
    
    const blueprint = JSON.parse(text) as BrandBlueprint;
    
    // Auto-calculate contrast score (Primary vs Background, Text vs Background)
    const ratioText = getContrastRatio(blueprint.colorPalette.text, blueprint.colorPalette.background);
    const ratioPrimary = getContrastRatio(blueprint.colorPalette.primary, blueprint.colorPalette.background);
    
    blueprint.contrastScore = Math.min(ratioText, ratioPrimary);
    
    return blueprint;
  } catch (error) {
    console.error("Failed to generate Brand Blueprint:", error);
    return {
      typographyHierarchy: { headings: "Inter", body: "Inter" },
      colorPalette: { primary: "#000000", secondary: "#444444", accent: "#FF0000", background: "#FFFFFF", text: "#111111" },
      aestheticStyle: "minimal",
      contrastScore: 21
    };
  }
}
