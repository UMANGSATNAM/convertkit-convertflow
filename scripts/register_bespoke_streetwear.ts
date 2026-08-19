import fs from 'fs';
import path from 'path';

const regPath = path.resolve('app/data/templates/theme-engine/registry.json');
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const bespokeStreetwear = [
  { id: 'd2c-streetwear-announcement', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-announcement.liquid', type: 'announcement', visualStyle: 'neo-brutalist', category: 'announcement' },
  { id: 'd2c-streetwear-header', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-header.liquid', type: 'header', visualStyle: 'neo-brutalist', category: 'header' },
  { id: 'd2c-streetwear-hero', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-hero.liquid', type: 'hero', visualStyle: 'neo-brutalist', category: 'hero' },
  { id: 'd2c-streetwear-marquee', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-marquee.liquid', type: 'marquee', visualStyle: 'neo-brutalist', category: 'custom' },
  { id: 'd2c-streetwear-drop-ticker', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-drop-ticker.liquid', type: 'ticker', visualStyle: 'neo-brutalist', category: 'trust' },
  { id: 'd2c-streetwear-category-tiles', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-category-tiles.liquid', type: 'category-tiles', visualStyle: 'neo-brutalist', category: 'collection' },
  { id: 'd2c-streetwear-bestsellers-tabs', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-bestsellers-tabs.liquid', type: 'bestsellers-tabs', visualStyle: 'neo-brutalist', category: 'product-grid' },
  { id: 'd2c-streetwear-shoppable-reels', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-shoppable-reels.liquid', type: 'reels', visualStyle: 'neo-brutalist', category: 'ugc' },
  { id: 'd2c-streetwear-featured-drop', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-featured-drop.liquid', type: 'featured-drop', visualStyle: 'neo-brutalist', category: 'product-page' },
  { id: 'd2c-streetwear-lookbook-grid', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-lookbook-grid.liquid', type: 'lookbook', visualStyle: 'neo-brutalist', category: 'ugc' },
  { id: 'd2c-streetwear-fabric-tech', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-fabric-tech.liquid', type: 'fabric-tech', visualStyle: 'neo-brutalist', category: 'trust' },
  { id: 'd2c-streetwear-bundle-builder', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-bundle-builder.liquid', type: 'bundle-builder', visualStyle: 'neo-brutalist', category: 'bundle-builder' },
  { id: 'd2c-streetwear-promo-banner', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-promo-banner.liquid', type: 'promo-banner', visualStyle: 'neo-brutalist', category: 'custom' },
  { id: 'd2c-streetwear-ugc-community', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-ugc-community.liquid', type: 'ugc-community', visualStyle: 'neo-brutalist', category: 'ugc' },
  { id: 'd2c-streetwear-trust-badges', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-trust-badges.liquid', type: 'trust-badges', visualStyle: 'neo-brutalist', category: 'trust' },
  { id: 'd2c-streetwear-press-strip', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-press-strip.liquid', type: 'press-strip', visualStyle: 'neo-brutalist', category: 'trust' },
  { id: 'd2c-streetwear-reviews', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-reviews.liquid', type: 'reviews', visualStyle: 'neo-brutalist', category: 'testimonials' },
  { id: 'd2c-streetwear-brand-story', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-brand-story.liquid', type: 'brand-story', visualStyle: 'neo-brutalist', category: 'brand-story' },
  { id: 'd2c-streetwear-faq', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-faq.liquid', type: 'faq', visualStyle: 'neo-brutalist', category: 'faq' },
  { id: 'd2c-streetwear-vip-perks', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-vip-perks.liquid', type: 'vip-perks', visualStyle: 'neo-brutalist', category: 'trust' },
  { id: 'd2c-streetwear-newsletter', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-newsletter.liquid', type: 'newsletter', visualStyle: 'neo-brutalist', category: 'newsletter' },
  { id: 'd2c-streetwear-footer', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-footer.liquid', type: 'footer', visualStyle: 'neo-brutalist', category: 'footer' },
  { id: 'd2c-streetwear-popup-spin', file: 'components/bespoke-d2c/streetwear/d2c-streetwear-popup-spin.liquid', type: 'popup-spin', visualStyle: 'neo-brutalist', category: 'popup' }
];

const existing = new Set(reg.components.map((c: any) => c.componentId));

for (const b of bespokeStreetwear) {
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
      family: 'Streetwear',
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
      family: 'Streetwear',
      sizeBytes: size,
      version: '1.0.0'
    });
  }
}

fs.writeFileSync(regPath, JSON.stringify(reg, null, 2));
console.log('Successfully registered all 23 bespoke streetwear components in registry.json! Total components in registry:', reg.components.length);
