import fs from 'fs';
import path from 'path';

const regPath = path.resolve('app/data/templates/theme-engine/registry.json');
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const bespokeRoyal = [
  { id: 'd2c-royal-announcement', file: 'components/bespoke-d2c/royal-couture/d2c-royal-announcement.liquid', type: 'announcement', visualStyle: 'luxury', category: 'announcement' },
  { id: 'd2c-royal-header', file: 'components/bespoke-d2c/royal-couture/d2c-royal-header.liquid', type: 'header', visualStyle: 'luxury', category: 'header' },
  { id: 'd2c-royal-hero', file: 'components/bespoke-d2c/royal-couture/d2c-royal-hero.liquid', type: 'hero', visualStyle: 'luxury', category: 'hero' },
  { id: 'd2c-royal-marquee', file: 'components/bespoke-d2c/royal-couture/d2c-royal-marquee.liquid', type: 'marquee', visualStyle: 'luxury', category: 'custom' },
  { id: 'd2c-royal-category-tiles', file: 'components/bespoke-d2c/royal-couture/d2c-royal-category-tiles.liquid', type: 'category-tiles', visualStyle: 'luxury', category: 'collection' },
  { id: 'd2c-royal-bestsellers-tabs', file: 'components/bespoke-d2c/royal-couture/d2c-royal-bestsellers-tabs.liquid', type: 'bestsellers-tabs', visualStyle: 'luxury', category: 'product-grid' },
  { id: 'd2c-royal-shoppable-reels', file: 'components/bespoke-d2c/royal-couture/d2c-royal-shoppable-reels.liquid', type: 'reels', visualStyle: 'luxury', category: 'ugc' },
  { id: 'd2c-royal-featured-drop', file: 'components/bespoke-d2c/royal-couture/d2c-royal-featured-drop.liquid', type: 'featured-drop', visualStyle: 'luxury', category: 'product-page' },
  { id: 'd2c-royal-lookbook-grid', file: 'components/bespoke-d2c/royal-couture/d2c-royal-lookbook-grid.liquid', type: 'lookbook', visualStyle: 'luxury', category: 'ugc' },
  { id: 'd2c-royal-fabric-tech', file: 'components/bespoke-d2c/royal-couture/d2c-royal-fabric-tech.liquid', type: 'fabric-tech', visualStyle: 'luxury', category: 'trust' },
  { id: 'd2c-royal-bundle-builder', file: 'components/bespoke-d2c/royal-couture/d2c-royal-bundle-builder.liquid', type: 'bundle-builder', visualStyle: 'luxury', category: 'bundle-builder' },
  { id: 'd2c-royal-promo-banner', file: 'components/bespoke-d2c/royal-couture/d2c-royal-promo-banner.liquid', type: 'promo-banner', visualStyle: 'luxury', category: 'custom' },
  { id: 'd2c-royal-ugc-community', file: 'components/bespoke-d2c/royal-couture/d2c-royal-ugc-community.liquid', type: 'ugc-community', visualStyle: 'luxury', category: 'ugc' },
  { id: 'd2c-royal-trust-badges', file: 'components/bespoke-d2c/royal-couture/d2c-royal-trust-badges.liquid', type: 'trust-badges', visualStyle: 'luxury', category: 'trust' },
  { id: 'd2c-royal-press-strip', file: 'components/bespoke-d2c/royal-couture/d2c-royal-press-strip.liquid', type: 'press-strip', visualStyle: 'luxury', category: 'trust' },
  { id: 'd2c-royal-reviews', file: 'components/bespoke-d2c/royal-couture/d2c-royal-reviews.liquid', type: 'reviews', visualStyle: 'luxury', category: 'testimonials' },
  { id: 'd2c-royal-brand-story', file: 'components/bespoke-d2c/royal-couture/d2c-royal-brand-story.liquid', type: 'brand-story', visualStyle: 'luxury', category: 'brand-story' },
  { id: 'd2c-royal-faq', file: 'components/bespoke-d2c/royal-couture/d2c-royal-faq.liquid', type: 'faq', visualStyle: 'luxury', category: 'faq' },
  { id: 'd2c-royal-vip-perks', file: 'components/bespoke-d2c/royal-couture/d2c-royal-vip-perks.liquid', type: 'vip-perks', visualStyle: 'luxury', category: 'trust' },
  { id: 'd2c-royal-newsletter', file: 'components/bespoke-d2c/royal-couture/d2c-royal-newsletter.liquid', type: 'newsletter', visualStyle: 'luxury', category: 'newsletter' },
  { id: 'd2c-royal-footer', file: 'components/bespoke-d2c/royal-couture/d2c-royal-footer.liquid', type: 'footer', visualStyle: 'luxury', category: 'footer' },
  { id: 'd2c-royal-popup-consultation', file: 'components/bespoke-d2c/royal-couture/d2c-royal-popup-consultation.liquid', type: 'popup-consultation', visualStyle: 'luxury', category: 'popup' }
];

const existing = new Set(reg.components.map((c: any) => c.componentId));

for (const b of bespokeRoyal) {
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
      niche: 'clothing',
      family: 'Luxury',
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
      niche: 'clothing',
      family: 'Luxury',
      sizeBytes: size,
      version: '1.0.0'
    });
  }
}

fs.writeFileSync(regPath, JSON.stringify(reg, null, 2));
console.log('Successfully registered all 22 bespoke Royal Couture components in registry.json! Total components in registry:', reg.components.length);
