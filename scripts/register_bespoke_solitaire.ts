import fs from 'fs';
import path from 'path';

const regPath = path.resolve('app/data/templates/theme-engine/registry.json');
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const bespokeSolitaire = [
  { id: 'd2c-solitaire-announcement', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-announcement.liquid', type: 'announcement', visualStyle: 'clean', category: 'announcement' },
  { id: 'd2c-solitaire-header', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-header.liquid', type: 'header', visualStyle: 'clean', category: 'header' },
  { id: 'd2c-solitaire-hero', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-hero.liquid', type: 'hero', visualStyle: 'clean', category: 'hero' },
  { id: 'd2c-solitaire-marquee', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-marquee.liquid', type: 'marquee', visualStyle: 'clean', category: 'custom' },
  { id: 'd2c-solitaire-category-tiles', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-category-tiles.liquid', type: 'category-tiles', visualStyle: 'clean', category: 'collection' },
  { id: 'd2c-solitaire-bestsellers-tabs', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-bestsellers-tabs.liquid', type: 'bestsellers-tabs', visualStyle: 'clean', category: 'product-grid' },
  { id: 'd2c-solitaire-shoppable-reels', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-shoppable-reels.liquid', type: 'reels', visualStyle: 'clean', category: 'ugc' },
  { id: 'd2c-solitaire-featured-drop', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-featured-drop.liquid', type: 'featured-drop', visualStyle: 'clean', category: 'product-page' },
  { id: 'd2c-solitaire-lookbook-grid', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-lookbook-grid.liquid', type: 'lookbook', visualStyle: 'clean', category: 'ugc' },
  { id: 'd2c-solitaire-fabric-tech', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-fabric-tech.liquid', type: 'fabric-tech', visualStyle: 'clean', category: 'trust' },
  { id: 'd2c-solitaire-bundle-builder', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-bundle-builder.liquid', type: 'bundle-builder', visualStyle: 'clean', category: 'bundle-builder' },
  { id: 'd2c-solitaire-promo-banner', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-promo-banner.liquid', type: 'promo-banner', visualStyle: 'clean', category: 'custom' },
  { id: 'd2c-solitaire-ugc-community', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-ugc-community.liquid', type: 'ugc-community', visualStyle: 'clean', category: 'ugc' },
  { id: 'd2c-solitaire-trust-badges', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-trust-badges.liquid', type: 'trust-badges', visualStyle: 'clean', category: 'trust' },
  { id: 'd2c-solitaire-press-strip', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-press-strip.liquid', type: 'press-strip', visualStyle: 'clean', category: 'trust' },
  { id: 'd2c-solitaire-reviews', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-reviews.liquid', type: 'reviews', visualStyle: 'clean', category: 'testimonials' },
  { id: 'd2c-solitaire-brand-story', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-brand-story.liquid', type: 'brand-story', visualStyle: 'clean', category: 'brand-story' },
  { id: 'd2c-solitaire-faq', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-faq.liquid', type: 'faq', visualStyle: 'clean', category: 'faq' },
  { id: 'd2c-solitaire-vip-perks', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-vip-perks.liquid', type: 'vip-perks', visualStyle: 'clean', category: 'trust' },
  { id: 'd2c-solitaire-newsletter', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-newsletter.liquid', type: 'newsletter', visualStyle: 'clean', category: 'newsletter' },
  { id: 'd2c-solitaire-footer', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-footer.liquid', type: 'footer', visualStyle: 'clean', category: 'footer' },
  { id: 'd2c-solitaire-popup-tryathome', file: 'components/bespoke-d2c/modern-solitaire/d2c-solitaire-popup-tryathome.liquid', type: 'popup-tryathome', visualStyle: 'clean', category: 'popup' }
];

const existing = new Set(reg.components.map((c: any) => c.componentId));

for (const b of bespokeSolitaire) {
  const fullPath = path.resolve('app/data/templates/theme-engine', b.file);
  if (!fs.existsSync(fullPath)) {
    console.error('File not found:', fullPath);
    continue;
  }
  const size = fs.statSync(fullPath).size;

  if (existing.has(b.id)) {
    const idx = reg.components.findIndex((c: any) => c.componentId === b.id);
    reg.components[idx] = {
      componentId: b.id,
      liquidPath: b.file,
      category: b.category,
      sectionType: b.type,
      visualStyle: b.visualStyle,
      niche: 'jewellery',
      family: 'Modern Fine Jewellery',
      sizeBytes: size,
      version: '1.0.0'
    };
  } else {
    reg.components.push({
      componentId: b.id,
      liquidPath: b.file,
      category: b.category,
      sectionType: b.type,
      visualStyle: b.visualStyle,
      niche: 'jewellery',
      family: 'Modern Fine Jewellery',
      sizeBytes: size,
      version: '1.0.0'
    });
  }
}

fs.writeFileSync(regPath, JSON.stringify(reg, null, 2));
console.log('Successfully registered all 22 bespoke Modern Solitaire components in registry.json! Total components in registry:', reg.components.length);
