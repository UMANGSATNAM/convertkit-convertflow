import fs from 'fs';
import path from 'path';

const regPath = path.resolve('app/data/templates/theme-engine/registry.json');
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const bespokeClinical = [
  { id: 'd2c-clinical-announcement', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-announcement.liquid', type: 'announcement', visualStyle: 'clean', category: 'announcement' },
  { id: 'd2c-clinical-header', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-header.liquid', type: 'header', visualStyle: 'clean', category: 'header' },
  { id: 'd2c-clinical-hero', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-hero.liquid', type: 'hero', visualStyle: 'clean', category: 'hero' },
  { id: 'd2c-clinical-marquee', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-marquee.liquid', type: 'marquee', visualStyle: 'clean', category: 'custom' },
  { id: 'd2c-clinical-category-tiles', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-category-tiles.liquid', type: 'category-tiles', visualStyle: 'clean', category: 'collection' },
  { id: 'd2c-clinical-bestsellers-tabs', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-bestsellers-tabs.liquid', type: 'bestsellers-tabs', visualStyle: 'clean', category: 'product-grid' },
  { id: 'd2c-clinical-shoppable-reels', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-shoppable-reels.liquid', type: 'reels', visualStyle: 'clean', category: 'ugc' },
  { id: 'd2c-clinical-featured-drop', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-featured-drop.liquid', type: 'featured-drop', visualStyle: 'clean', category: 'product-page' },
  { id: 'd2c-clinical-lookbook-grid', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-lookbook-grid.liquid', type: 'lookbook', visualStyle: 'clean', category: 'ugc' },
  { id: 'd2c-clinical-fabric-tech', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-fabric-tech.liquid', type: 'fabric-tech', visualStyle: 'clean', category: 'trust' },
  { id: 'd2c-clinical-bundle-builder', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-bundle-builder.liquid', type: 'bundle-builder', visualStyle: 'clean', category: 'bundle-builder' },
  { id: 'd2c-clinical-promo-banner', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-promo-banner.liquid', type: 'promo-banner', visualStyle: 'clean', category: 'custom' },
  { id: 'd2c-clinical-ugc-community', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-ugc-community.liquid', type: 'ugc-community', visualStyle: 'clean', category: 'ugc' },
  { id: 'd2c-clinical-trust-badges', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-trust-badges.liquid', type: 'trust-badges', visualStyle: 'clean', category: 'trust' },
  { id: 'd2c-clinical-press-strip', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-press-strip.liquid', type: 'press-strip', visualStyle: 'clean', category: 'trust' },
  { id: 'd2c-clinical-reviews', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-reviews.liquid', type: 'reviews', visualStyle: 'clean', category: 'testimonials' },
  { id: 'd2c-clinical-brand-story', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-brand-story.liquid', type: 'brand-story', visualStyle: 'clean', category: 'brand-story' },
  { id: 'd2c-clinical-faq', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-faq.liquid', type: 'faq', visualStyle: 'clean', category: 'faq' },
  { id: 'd2c-clinical-vip-perks', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-vip-perks.liquid', type: 'vip-perks', visualStyle: 'clean', category: 'trust' },
  { id: 'd2c-clinical-newsletter', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-newsletter.liquid', type: 'newsletter', visualStyle: 'clean', category: 'newsletter' },
  { id: 'd2c-clinical-footer', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-footer.liquid', type: 'footer', visualStyle: 'clean', category: 'footer' },
  { id: 'd2c-clinical-popup-routine', file: 'components/bespoke-d2c/clinical-actives/d2c-clinical-popup-routine.liquid', type: 'popup-routine', visualStyle: 'clean', category: 'popup' }
];

const existing = new Set(reg.components.map((c: any) => c.componentId));

for (const b of bespokeClinical) {
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
      family: 'Clinical',
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
      family: 'Clinical',
      sizeBytes: size,
      version: '1.0.0'
    });
  }
}

fs.writeFileSync(regPath, JSON.stringify(reg, null, 2));
console.log('Successfully registered all 22 bespoke Clinical Actives components in registry.json! Total components in registry:', reg.components.length);
