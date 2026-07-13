import { ExtractedStoreData, analyzeStoreScreenshot } from "../ai/vision.server";

export class BrandExtractionService {
  /**
   * Extracts brand colors and typography from an image base64 (e.g. logo or moodboard).
   * Falls back to a deterministic minimal palette if extraction fails.
   */
  static async extractBrandAesthetics(imageBase64: string, mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" = "image/jpeg", industry: string = "default"): Promise<ExtractedStoreData & { extractionFailed?: boolean }> {
    try {
      console.log("[BrandExtractionService] Analyzing image via Vision API...");
      const extractedData = await analyzeStoreScreenshot(imageBase64, mediaType);
      
      console.log(`[BrandExtractionService] 🟢 SUCCESS! Extracted Brand DNA:`);
      console.log(`   Archetype: ${extractedData.archetype} | Tone: ${extractedData.tone}`);
      console.log(`   Colors: Primary=${extractedData.colors?.primary}, Secondary=${extractedData.colors?.secondary}, Accent=${extractedData.colors?.accent}, Background=${extractedData.colors?.background}`);
      console.log(`   Fonts: Heading=${extractedData.typography?.headingFont}, Body=${extractedData.typography?.bodyFont}`);
      
      return extractedData;
    } catch (error) {
      console.error("[BrandExtractionService] 🔴 WARNING: Brand aesthetics extraction failed. Using deterministic niche-based fallback.", error);
      
      const fallbacks: Record<string, any> = {
        jewellery: { primary: "#C9A84C", secondary: "#F4F1EB", background: "#FAF9F6", text: "#2A2A2A" },
        beauty: { primary: "#E8C8C8", secondary: "#F8F1F1", background: "#FCFAFA", text: "#3B3333" },
        clothing: { primary: "#4A5568", secondary: "#E2E8F0", background: "#F7FAFC", text: "#1A202C" },
        grooming: { primary: "#2D3748", secondary: "#E2E8F0", background: "#F7FAFC", text: "#1A202C" },
        default: { primary: "#1A1A1A", secondary: "#C9A84C", background: "#FFFFFF", text: "#111111" }
      };
      
      const fallbackColors = fallbacks[industry] || fallbacks.default;

      return {
        extractionFailed: true,
        colors: fallbackColors,
        typography: {
          headingFont: "Inter",
          bodyFont: "Inter"
        },
        sections: []
      };
    }
  }

  /**
   * Maps extracted raw colors to our internal Theme Tokens architecture.
   */
  static mapToTokens(extractedData: ExtractedStoreData, isDarkVariant: boolean = false) {
    if (isDarkVariant) {
      return {
        colors_accent_1: extractedData.colors.primary || "#C9A84C",
        colors_accent_2: extractedData.colors.secondary || "#E8CC7A",
        colors_background_1: "#12141A", // True dark mode background
        colors_text_1: "#F9F9F9",       // Light text on dark
        colors_surface: "#1A1C23"       // Slightly lighter dark card
      };
    }

    return {
      colors_accent_1: extractedData.colors.secondary || extractedData.colors.text || "#1A1A1A",   // Main Text
      colors_accent_2: extractedData.colors.primary || extractedData.colors.accent || "#C9A84C",    // CTA/Accent
      colors_background_1: (extractedData.colors.background && extractedData.colors.background.startsWith("#")) ? extractedData.colors.background : "#FFFFFF",                            // Background (never use accent)
      colors_text_1: extractedData.colors.secondary || extractedData.colors.text || "#111111",      // Body Text
      colors_surface: "#F4F4F4",                                                                    // Surface
      fontHeading: extractedData.typography?.headingFont || "Inter",
      fontBody: extractedData.typography?.bodyFont || "Inter"
    };
  }
}
