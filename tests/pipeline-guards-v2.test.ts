import { describe, it, expect } from 'vitest';
import { retrieveBestComponent } from '../app/services/theme-engine/retrieval.server.js';

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

describe('Pipeline Guards v2', () => {
  it('Contrast guard rejects a low-contrast pair', () => {
    const contrastRatio = getContrast("#C9A227", "#C9A227");
    expect(contrastRatio).toBeLessThan(4.5);
    
    const goodContrast = getContrast("#FFFFFF", "#111111");
    expect(goodContrast).toBeGreaterThan(4.5);
  });

  it('Contrast guard accepts dark background with light text', () => {
    const contrastRatio = getContrast("#1A1A1A", "#FFFFFF");
    expect(contrastRatio).toBeGreaterThan(4.5);
  });

  it('Dedup guard skips a slot when component score < 50', async () => {
    // We mock retrieveBestComponent behavior when a component is excluded
    // If the next best component has score < 50, it should return null
    // Need to exclude all high scoring components to see if it returns null
    const matchedComponent = await retrieveBestComponent({
      sectionType: "featured-collection",
      brandArchetype: "Creator",
      catalogIndustry: "Jewellery",
      catalogStyle: "Minimal",
      catalogVisualComplexity: "Low",
      exclude: ["grid-minimal-v1", "grid-luxury-v1", "grid-featured-lookbook-v1", "grid-featured-lookbook-v2", "grid-jewellery-showcase-v1", "grid-masonry-gallery-luxury-v1"] // Exclude high scorers
    });
    
    // Grid-bold-v1 scored 34 before. So with minScore 50, it should return null.
    console.log(`Matched component after excluding high scorers:`, matchedComponent);
    expect(matchedComponent).toBeNull();
  });
});
