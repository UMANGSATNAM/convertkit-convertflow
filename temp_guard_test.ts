import { BrandExtractionService } from "./app/services/core/BrandExtractionService.js";
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 255, g: 255, b: 255 };
}

function getLuminance(r: number, g: number, b: number) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
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

// Emulate Mustard background #C9A227 and White text #FFFFFF
const baseSettings = {
  colors_background_1: "#C9A227",
  colors_accent_1: "#FFFFFF"
};
const contrastRatio = getContrast(baseSettings.colors_background_1, baseSettings.colors_accent_1);

if (contrastRatio < 4.5) {
  console.warn(`[Color Guard] Invalid contrast (${contrastRatio.toFixed(2)}) for derived background ${baseSettings.colors_background_1} and text ${baseSettings.colors_accent_1}. Falling back to safe defaults.`);
  baseSettings.colors_background_1 = "#FFFFFF";
  baseSettings.colors_accent_1 = "#111111";
} else {
  console.log(`[Color Guard] Passed contrast (${contrastRatio.toFixed(2)}) for background ${baseSettings.colors_background_1} and text ${baseSettings.colors_accent_1}.`);
}

// Emulate dark background #111111 and White text #FFFFFF
const darkSettings = {
  colors_background_1: "#111111",
  colors_accent_1: "#FFFFFF"
};
const darkContrast = getContrast(darkSettings.colors_background_1, darkSettings.colors_accent_1);

if (darkContrast < 4.5) {
  console.warn(`[Color Guard] Invalid contrast (${darkContrast.toFixed(2)}) for derived background ${darkSettings.colors_background_1} and text ${darkSettings.colors_accent_1}. Falling back to safe defaults.`);
} else {
  console.log(`[Color Guard] Passed contrast (${darkContrast.toFixed(2)}) for background ${darkSettings.colors_background_1} and text ${darkSettings.colors_accent_1}.`);
}
