import fs from 'fs';
import path from 'path';

const regPath = path.resolve('app/data/templates/theme-engine/registry.json');
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const bespokePolki = [
  { id: 'd2c-polki-announcement', file: 'components/bespoke-d2c/royal-polki/d2c-polki-announcement.liquid', type: 'announcement', visualStyle: 'luxury', category: 'announcement' },
  { id: 'd2c-polki-header', file: 'components/bespoke-d2c/royal-polki/d2c-polki-header.liquid', type: 'header', visualStyle: 'luxury', category: 'header' },
  { id: 'd2c-polki-hero', file: 'components/bespoke-d2c/royal-polki/d2c-polki-hero.liquid', type: 'hero', visualStyle: 'luxury', category: 'hero' },
  { id: 'd2c-polki-marquee', file: 'components/bespoke-d2c/royal-polki/d2c-polki-marquee.liquid', type: 'marquee', visualStyle: 'luxury', category: 'custom' },
  { id: 'd2c-polki-category-tiles', file: 'components/bespoke-d2c/royal-polki/d2c-polki-category-tiles.liquid', type: 'category-tiles', visualStyle: 'luxury', category: 'collection' },
  { id: 'd2c-polki-bestsellers-tabs', file: 'components/bespoke-d2c/royal-polki/d2c-polki-bestsellers-tabs.liquid', type: 'bestsellers-tabs', visualStyle: 'luxury', category: 'product-grid' },
  { id: 'd2c-polki-shoppable-reels', file: 'components/bespoke-d2c/royal-polki/d2c-polki-shoppable-reels.liquid', type: 'reels', visualStyle: 'luxury', category: 'ugc' },
  { id: 'd2c-polki-featured-drop', file: 'components/bespoke-d2c/royal-polki/d2c-polki-featured-drop.liquid', type: 'featured-drop', visualStyle: 'luxury', category: 'product-page' },
  { id: 'd2c-polki-lookbook-grid', file: 'components/bespoke-d2c/royal-polki/d2c-polki-lookbook-grid.liquid', type: 'lookbook', visualStyle: 'luxury', category: 'ugc' },
  { id: 'd2c-polki-fabric-tech', file: 'components/bespoke-d2c/royal-polki/d2c-polki-fabric-tech.liquid', type: 'fabric-tech', visualStyle: 'luxury', category: 'trust' },
  { id: 'd2c-polki-bundle-builder', file: 'components/bespoke-d2c/royal-polki/d2c-polki-bundle-builder.liquid', type: 'bundle-builder', visualStyle: 'luxury', category: 'bundle-builder' },
  { id: 'd2c-polki-promo-banner', file: 'components/bespoke-d2c/royal-polki/d2c-polki-promo-banner.liquid', type: 'promo-banner', visualStyle: 'luxury', category: 'custom' },
  { id: 'd2c-polki-ugc-community', file: 'components/bespoke-d2c/royal-polki/d2c-polki-ugc-community.liquid', type: 'ugc-community', visualStyle: 'luxury', category: 'ugc' },
  { id: 'd2c-polki-trust-badges', file: 'components/bespoke-d2c/royal-polki/d2c-polki-trust-badges.liquid', type: 'trust-badges', visualStyle: 'luxury', category: 'trust' },
  { id: 'd2c-polki-press-strip', file: 'components/bespoke-d2c/royal-polki/d2c-polki-press-strip.liquid', type: 'press-strip', visualStyle: 'luxury', category: 'trust' },
  { id: 'd2c-polki-reviews', file: 'components/bespoke-d2c/royal-polki/d2c-polki-reviews.liquid', type: 'reviews', visualStyle: 'luxury', category: 'testimonials' },
  { id: 'd2c-polki-brand-story', file: 'components/bespoke-d2c/royal-polki/d2c-polki-brand-story.liquid', type: 'brand-story', visualStyle: 'luxury', category: 'brand-story' },
  { id: 'd2c-polki-faq', file: 'components/bespoke-d2c/royal-polki/d2c-polki-faq.liquid', type: 'faq', visualStyle: 'luxury', category: 'faq' },
  { id: 'd2c-polki-vip-perks', file: 'components/bespoke-d2c/royal-polki/d2c-polki-vip-perks.liquid', type: 'vip-perks', visualStyle: 'luxury', category: 'trust' },
  { id: 'd2c-polki-newsletter', file: 'components/bespoke-d2c/royal-polki/d2c-polki-newsletter.liquid', type: 'newsletter', visualStyle: 'luxury', category: 'newsletter' },
  { id: 'd2c-polki-footer', file: 'components/bespoke-d2c/royal-polki/d2c-polki-footer.liquid', type: 'footer', visualStyle: 'luxury', category: 'footer' },
  { id: 'd2c-polki-popup-consultation', file: 'components/bespoke-d2c/royal-polki/d2c-polki-popup-consultation.liquid', type: 'popup-consultation', visualStyle: 'luxury', category: 'popup' }
];

const existing = new Set(reg.components.map((c: any) => c.componentId));

for (const b of bespokePolki) {
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
      family: 'Heritage Jewellery',
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
      family: 'Heritage Jewellery',
      sizeBytes: size,
      version: '1.0.0'
    });
  }
}

fs.writeFileSync(regPath, JSON.stringify(reg, null, 2));
console.log('Successfully registered all 22 bespoke Royal Polki components in registry.json! Total components in registry:', reg.components.length);
