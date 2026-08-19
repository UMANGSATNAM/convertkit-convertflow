import fs from 'fs';
import path from 'path';

const regPath = path.resolve('app/data/templates/theme-engine/registry.json');
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const bespokeGlam = [
  { id: 'd2c-glam-announcement', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-announcement.liquid', type: 'announcement', visualStyle: 'glam', category: 'announcement' },
  { id: 'd2c-glam-header', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-header.liquid', type: 'header', visualStyle: 'glam', category: 'header' },
  { id: 'd2c-glam-hero', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-hero.liquid', type: 'hero', visualStyle: 'glam', category: 'hero' },
  { id: 'd2c-glam-marquee', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-marquee.liquid', type: 'marquee', visualStyle: 'glam', category: 'custom' },
  { id: 'd2c-glam-category-tiles', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-category-tiles.liquid', type: 'category-tiles', visualStyle: 'glam', category: 'collection' },
  { id: 'd2c-glam-bestsellers-tabs', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-bestsellers-tabs.liquid', type: 'bestsellers-tabs', visualStyle: 'glam', category: 'product-grid' },
  { id: 'd2c-glam-shoppable-reels', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-shoppable-reels.liquid', type: 'reels', visualStyle: 'glam', category: 'ugc' },
  { id: 'd2c-glam-featured-drop', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-featured-drop.liquid', type: 'featured-drop', visualStyle: 'glam', category: 'product-page' },
  { id: 'd2c-glam-lookbook-grid', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-lookbook-grid.liquid', type: 'lookbook', visualStyle: 'glam', category: 'ugc' },
  { id: 'd2c-glam-fabric-tech', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-fabric-tech.liquid', type: 'fabric-tech', visualStyle: 'glam', category: 'trust' },
  { id: 'd2c-glam-bundle-builder', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-bundle-builder.liquid', type: 'bundle-builder', visualStyle: 'glam', category: 'bundle-builder' },
  { id: 'd2c-glam-promo-banner', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-promo-banner.liquid', type: 'promo-banner', visualStyle: 'glam', category: 'custom' },
  { id: 'd2c-glam-ugc-community', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-ugc-community.liquid', type: 'ugc-community', visualStyle: 'glam', category: 'ugc' },
  { id: 'd2c-glam-trust-badges', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-trust-badges.liquid', type: 'trust-badges', visualStyle: 'glam', category: 'trust' },
  { id: 'd2c-glam-press-strip', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-press-strip.liquid', type: 'press-strip', visualStyle: 'glam', category: 'trust' },
  { id: 'd2c-glam-reviews', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-reviews.liquid', type: 'reviews', visualStyle: 'glam', category: 'testimonials' },
  { id: 'd2c-glam-brand-story', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-brand-story.liquid', type: 'brand-story', visualStyle: 'glam', category: 'brand-story' },
  { id: 'd2c-glam-faq', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-faq.liquid', type: 'faq', visualStyle: 'glam', category: 'faq' },
  { id: 'd2c-glam-vip-perks', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-vip-perks.liquid', type: 'vip-perks', visualStyle: 'glam', category: 'trust' },
  { id: 'd2c-glam-newsletter', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-newsletter.liquid', type: 'newsletter', visualStyle: 'glam', category: 'newsletter' },
  { id: 'd2c-glam-footer', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-footer.liquid', type: 'footer', visualStyle: 'glam', category: 'footer' },
  { id: 'd2c-glam-popup-shade', file: 'components/bespoke-d2c/velvet-glam/d2c-glam-popup-shade.liquid', type: 'popup-shade', visualStyle: 'glam', category: 'popup' }
];

const existing = new Set(reg.components.map((c: any) => c.componentId));

for (const b of bespokeGlam) {
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
      niche: 'beauty',
      family: 'Glamour',
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
      niche: 'beauty',
      family: 'Glamour',
      sizeBytes: size,
      version: '1.0.0'
    });
  }
}

fs.writeFileSync(regPath, JSON.stringify(reg, null, 2));
console.log('Successfully registered all 22 bespoke Velvet Glam components in registry.json! Total components in registry:', reg.components.length);
