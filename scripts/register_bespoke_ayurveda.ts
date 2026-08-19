import fs from 'fs';
import path from 'path';

const regPath = path.resolve('app/data/templates/theme-engine/registry.json');
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const bespokeAyurveda = [
  { id: 'd2c-ayurveda-announcement', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-announcement.liquid', type: 'announcement', visualStyle: 'organic', category: 'announcement' },
  { id: 'd2c-ayurveda-header', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-header.liquid', type: 'header', visualStyle: 'organic', category: 'header' },
  { id: 'd2c-ayurveda-hero', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-hero.liquid', type: 'hero', visualStyle: 'organic', category: 'hero' },
  { id: 'd2c-ayurveda-marquee', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-marquee.liquid', type: 'marquee', visualStyle: 'organic', category: 'custom' },
  { id: 'd2c-ayurveda-category-tiles', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-category-tiles.liquid', type: 'category-tiles', visualStyle: 'organic', category: 'collection' },
  { id: 'd2c-ayurveda-bestsellers-tabs', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-bestsellers-tabs.liquid', type: 'bestsellers-tabs', visualStyle: 'organic', category: 'product-grid' },
  { id: 'd2c-ayurveda-shoppable-reels', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-shoppable-reels.liquid', type: 'reels', visualStyle: 'organic', category: 'ugc' },
  { id: 'd2c-ayurveda-featured-drop', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-featured-drop.liquid', type: 'featured-drop', visualStyle: 'organic', category: 'product-page' },
  { id: 'd2c-ayurveda-lookbook-grid', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-lookbook-grid.liquid', type: 'lookbook', visualStyle: 'organic', category: 'ugc' },
  { id: 'd2c-ayurveda-fabric-tech', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-fabric-tech.liquid', type: 'fabric-tech', visualStyle: 'organic', category: 'trust' },
  { id: 'd2c-ayurveda-bundle-builder', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-bundle-builder.liquid', type: 'bundle-builder', visualStyle: 'organic', category: 'bundle-builder' },
  { id: 'd2c-ayurveda-promo-banner', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-promo-banner.liquid', type: 'promo-banner', visualStyle: 'organic', category: 'custom' },
  { id: 'd2c-ayurveda-ugc-community', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-ugc-community.liquid', type: 'ugc-community', visualStyle: 'organic', category: 'ugc' },
  { id: 'd2c-ayurveda-trust-badges', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-trust-badges.liquid', type: 'trust-badges', visualStyle: 'organic', category: 'trust' },
  { id: 'd2c-ayurveda-press-strip', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-press-strip.liquid', type: 'press-strip', visualStyle: 'organic', category: 'trust' },
  { id: 'd2c-ayurveda-reviews', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-reviews.liquid', type: 'reviews', visualStyle: 'organic', category: 'testimonials' },
  { id: 'd2c-ayurveda-brand-story', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-brand-story.liquid', type: 'brand-story', visualStyle: 'organic', category: 'brand-story' },
  { id: 'd2c-ayurveda-faq', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-faq.liquid', type: 'faq', visualStyle: 'organic', category: 'faq' },
  { id: 'd2c-ayurveda-vip-perks', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-vip-perks.liquid', type: 'vip-perks', visualStyle: 'organic', category: 'trust' },
  { id: 'd2c-ayurveda-newsletter', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-newsletter.liquid', type: 'newsletter', visualStyle: 'organic', category: 'newsletter' },
  { id: 'd2c-ayurveda-footer', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-footer.liquid', type: 'footer', visualStyle: 'organic', category: 'footer' },
  { id: 'd2c-ayurveda-popup-dosha', file: 'components/bespoke-d2c/clean-ayurveda/d2c-ayurveda-popup-dosha.liquid', type: 'popup-dosha', visualStyle: 'organic', category: 'popup' }
];

const existing = new Set(reg.components.map((c: any) => c.componentId));

for (const b of bespokeAyurveda) {
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
      family: 'Organic',
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
      family: 'Organic',
      sizeBytes: size,
      version: '1.0.0'
    });
  }
}

fs.writeFileSync(regPath, JSON.stringify(reg, null, 2));
console.log('Successfully registered all 22 bespoke Clean Ayurveda components in registry.json! Total components in registry:', reg.components.length);
