import { retrieveBestComponent } from './app/services/theme-engine/retrieval.server.js';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 255, g: 255, b: 255 };
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (lightest + 0.05) / (darkest + 0.05);
}

async function runTests() {
  console.log("--- TEST (a) Contrast Guard Updates ---");
  const contrastRatio = getContrast("#C9A227", "#C9A227");
  console.log(`Contrast for #C9A227 (Mustard) on #C9A227: ${contrastRatio.toFixed(2)} (< 4.5? ${contrastRatio < 4.5})`);
  
  const goodContrast = getContrast("#FFFFFF", "#111111");
  console.log(`Contrast for #FFFFFF on #111111: ${goodContrast.toFixed(2)} (> 4.5? ${goodContrast > 4.5})`);

  const darkPassContrast = getContrast("#1A1A1A", "#FFFFFF");
  console.log(`Contrast for #1A1A1A on #FFFFFF: ${darkPassContrast.toFixed(2)} (> 4.5? ${darkPassContrast > 4.5})`);
  
  console.log("\n--- TEST (b) Dedup Guard Minimum Score ---");
  try {
     const matchedComponent = await retrieveBestComponent({
       sectionType: "featured-collection",
       brandArchetype: "Creator",
       catalogIndustry: "Jewellery",
       catalogStyle: "Minimal",
       catalogVisualComplexity: "Low",
       exclude: ["grid-minimal-v1", "grid-luxury-v1"]
     });
     console.log("Matched component after excluding high scorers:", matchedComponent ? matchedComponent.componentId : "null (Skipped)");
  } catch (e) {
     console.log("Error running retrieveBestComponent:", e.message);
  }
}
runTests();
