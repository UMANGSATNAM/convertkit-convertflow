import fs from 'fs';
import path from 'path';

const regPath = path.resolve('app/data/templates/theme-engine/registry.json');
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const bespokeMinimal = [
  { id: 'd2c-minimal-announcement', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-announcement.liquid', type: 'announcement', visualStyle: 'minimal', category: 'announcement' },
  { id: 'd2c-minimal-header', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-header.liquid', type: 'header', visualStyle: 'minimal', category: 'header' },
  { id: 'd2c-minimal-hero', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-hero.liquid', type: 'hero', visualStyle: 'minimal', category: 'hero' },
  { id: 'd2c-minimal-marquee', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-marquee.liquid', type: 'marquee', visualStyle: 'minimal', category: 'custom' },
  { id: 'd2c-minimal-category-tiles', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-category-tiles.liquid', type: 'category-tiles', visualStyle: 'minimal', category: 'collection' },
  { id: 'd2c-minimal-bestsellers-tabs', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-bestsellers-tabs.liquid', type: 'bestsellers-tabs', visualStyle: 'minimal', category: 'product-grid' },
  { id: 'd2c-minimal-shoppable-reels', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-shoppable-reels.liquid', type: 'reels', visualStyle: 'minimal', category: 'ugc' },
  { id: 'd2c-minimal-featured-drop', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-featured-drop.liquid', type: 'featured-drop', visualStyle: 'minimal', category: 'product-page' },
  { id: 'd2c-minimal-lookbook-grid', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-lookbook-grid.liquid', type: 'lookbook', visualStyle: 'minimal', category: 'ugc' },
  { id: 'd2c-minimal-fabric-tech', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-fabric-tech.liquid', type: 'fabric-tech', visualStyle: 'minimal', category: 'trust' },
  { id: 'd2c-minimal-bundle-builder', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-bundle-builder.liquid', type: 'bundle-builder', visualStyle: 'minimal', category: 'bundle-builder' },
  { id: 'd2c-minimal-promo-banner', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-promo-banner.liquid', type: 'promo-banner', visualStyle: 'minimal', category: 'custom' },
  { id: 'd2c-minimal-ugc-community', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-ugc-community.liquid', type: 'ugc-community', visualStyle: 'minimal', category: 'ugc' },
  { id: 'd2c-minimal-trust-badges', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-trust-badges.liquid', type: 'trust-badges', visualStyle: 'minimal', category: 'trust' },
  { id: 'd2c-minimal-press-strip', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-press-strip.liquid', type: 'press-strip', visualStyle: 'minimal', category: 'trust' },
  { id: 'd2c-minimal-reviews', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-reviews.liquid', type: 'reviews', visualStyle: 'minimal', category: 'testimonials' },
  { id: 'd2c-minimal-brand-story', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-brand-story.liquid', type: 'brand-story', visualStyle: 'minimal', category: 'brand-story' },
  { id: 'd2c-minimal-faq', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-faq.liquid', type: 'faq', visualStyle: 'minimal', category: 'faq' },
  { id: 'd2c-minimal-vip-perks', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-vip-perks.liquid', type: 'vip-perks', visualStyle: 'minimal', category: 'trust' },
  { id: 'd2c-minimal-newsletter', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-newsletter.liquid', type: 'newsletter', visualStyle: 'minimal', category: 'newsletter' },
  { id: 'd2c-minimal-footer', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-footer.liquid', type: 'footer', visualStyle: 'minimal', category: 'footer' },
  { id: 'd2c-minimal-popup-fit', file: 'components/bespoke-d2c/minimal-menswear/d2c-minimal-popup-fit.liquid', type: 'popup-fit', visualStyle: 'minimal', category: 'popup' }
];

const existing = new Set(reg.components.map((c: any) => c.componentId));

for (const b of bespokeMinimal) {
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
      family: 'Minimal',
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
      family: 'Minimal',
      sizeBytes: size,
      version: '1.0.0'
    });
  }
}

fs.writeFileSync(regPath, JSON.stringify(reg, null, 2));
console.log('Successfully registered all 22 bespoke Minimal Menswear components in registry.json! Total components in registry:', reg.components.length);
