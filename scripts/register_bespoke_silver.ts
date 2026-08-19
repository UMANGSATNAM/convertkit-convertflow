import fs from 'fs';
import path from 'path';

const regPath = path.resolve('app/data/templates/theme-engine/registry.json');
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const bespokeSilver = [
  { id: 'd2c-silver-announcement', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-announcement.liquid', type: 'announcement', visualStyle: 'warm', category: 'announcement' },
  { id: 'd2c-silver-header', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-header.liquid', type: 'header', visualStyle: 'warm', category: 'header' },
  { id: 'd2c-silver-hero', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-hero.liquid', type: 'hero', visualStyle: 'warm', category: 'hero' },
  { id: 'd2c-silver-marquee', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-marquee.liquid', type: 'marquee', visualStyle: 'warm', category: 'custom' },
  { id: 'd2c-silver-category-tiles', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-category-tiles.liquid', type: 'category-tiles', visualStyle: 'warm', category: 'collection' },
  { id: 'd2c-silver-bestsellers-tabs', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-bestsellers-tabs.liquid', type: 'bestsellers-tabs', visualStyle: 'warm', category: 'product-grid' },
  { id: 'd2c-silver-shoppable-reels', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-shoppable-reels.liquid', type: 'reels', visualStyle: 'warm', category: 'ugc' },
  { id: 'd2c-silver-featured-drop', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-featured-drop.liquid', type: 'featured-drop', visualStyle: 'warm', category: 'product-page' },
  { id: 'd2c-silver-lookbook-grid', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-lookbook-grid.liquid', type: 'lookbook', visualStyle: 'warm', category: 'ugc' },
  { id: 'd2c-silver-fabric-tech', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-fabric-tech.liquid', type: 'fabric-tech', visualStyle: 'warm', category: 'trust' },
  { id: 'd2c-silver-bundle-builder', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-bundle-builder.liquid', type: 'bundle-builder', visualStyle: 'warm', category: 'bundle-builder' },
  { id: 'd2c-silver-promo-banner', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-promo-banner.liquid', type: 'promo-banner', visualStyle: 'warm', category: 'custom' },
  { id: 'd2c-silver-ugc-community', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-ugc-community.liquid', type: 'ugc-community', visualStyle: 'warm', category: 'ugc' },
  { id: 'd2c-silver-trust-badges', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-trust-badges.liquid', type: 'trust-badges', visualStyle: 'warm', category: 'trust' },
  { id: 'd2c-silver-press-strip', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-press-strip.liquid', type: 'press-strip', visualStyle: 'warm', category: 'trust' },
  { id: 'd2c-silver-reviews', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-reviews.liquid', type: 'reviews', visualStyle: 'warm', category: 'testimonials' },
  { id: 'd2c-silver-brand-story', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-brand-story.liquid', type: 'brand-story', visualStyle: 'warm', category: 'brand-story' },
  { id: 'd2c-silver-faq', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-faq.liquid', type: 'faq', visualStyle: 'warm', category: 'faq' },
  { id: 'd2c-silver-vip-perks', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-vip-perks.liquid', type: 'vip-perks', visualStyle: 'warm', category: 'trust' },
  { id: 'd2c-silver-newsletter', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-newsletter.liquid', type: 'newsletter', visualStyle: 'warm', category: 'newsletter' },
  { id: 'd2c-silver-footer', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-footer.liquid', type: 'footer', visualStyle: 'warm', category: 'footer' },
  { id: 'd2c-silver-popup-gift', file: 'components/bespoke-d2c/artisan-silver/d2c-silver-popup-gift.liquid', type: 'popup-gift', visualStyle: 'warm', category: 'popup' }
];

const existing = new Set(reg.components.map((c: any) => c.componentId));

for (const b of bespokeSilver) {
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
      family: 'Artisan Silver',
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
      family: 'Artisan Silver',
      sizeBytes: size,
      version: '1.0.0'
    });
  }
}

fs.writeFileSync(regPath, JSON.stringify(reg, null, 2));
console.log('Successfully registered all 22 bespoke Artisan Silver components in registry.json! Total components in registry:', reg.components.length);
