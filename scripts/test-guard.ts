import { BrandExtractionService } from '../app/services/core/BrandExtractionService.js';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(hex1: string, hex2: string) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (lightest + 0.05) / (darkest + 0.05);
}

async function run() {
  const rawExtracted = await BrandExtractionService.extractBrandAesthetics("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "image/png", "jewellery");
  console.log("Raw Extracted:", rawExtracted);
  
  let extractedColors = BrandExtractionService.mapToTokens(rawExtracted, false);
  console.log("\nMapped Tokens:", extractedColors);
  
  const baseSettings = extractedColors || {
    colors_background_1: "#FFFFFF",
    colors_accent_1: "#111111",
    colors_accent_2: "#C9A84C"
  };
  
  // Example dark theme injection for test
  baseSettings.colors_background_1 = "#111111"; 
  baseSettings.colors_accent_1 = "#C9A227"; // mustard text
  
  const contrastRatio = getContrast(baseSettings.colors_background_1, baseSettings.colors_accent_1);
  
  if (contrastRatio < 4.5) {
    console.warn(`[Color Guard] Invalid contrast (${contrastRatio.toFixed(2)}) for derived background ${baseSettings.colors_background_1} and text ${baseSettings.colors_accent_1}. Falling back to safe defaults.`);
    baseSettings.colors_background_1 = "#FFFFFF";
    baseSettings.colors_accent_1 = "#111111";
  } else {
    console.log(`[Color Guard] Contrast (${contrastRatio.toFixed(2)}) for derived background ${baseSettings.colors_background_1} and text ${baseSettings.colors_accent_1} is valid.`);
  }
}
run().catch(console.error);
