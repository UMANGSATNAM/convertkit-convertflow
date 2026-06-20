import { ExtractedStoreData, analyzeStoreScreenshot } from "../ai/vision.server";

export class BrandExtractionService {
  /**
   * Extracts brand colors and typography from an image base64 (e.g. logo or moodboard).
   * Falls back to a deterministic minimal palette if extraction fails.
   */
  static async extractBrandAesthetics(imageBase64: string, mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" = "image/jpeg"): Promise<ExtractedStoreData> {
    try {
      console.log("[BrandExtractionService] Analyzing image via Vision API...");
      const extractedData = await analyzeStoreScreenshot(imageBase64, mediaType);
      return extractedData;
    } catch (error) {
      console.error("[BrandExtractionService] Extraction failed, falling back to defaults", error);
      return {
        colors: {
          primary: "#1A1A1A",
          secondary: "#C9A84C",
          background: "#FFFFFF",
          text: "#111111"
        },
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
      colors_accent_1: extractedData.colors.primary || "#1A1A1A",
      colors_accent_2: extractedData.colors.secondary || "#C9A84C",
      colors_background_1: extractedData.colors.background || "#FFFFFF",
      colors_text_1: extractedData.colors.text || "#111111",
      colors_surface: "#F4F4F4"         // Standard light surface
    };
  }
}
