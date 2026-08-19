import fs from 'fs';
import path from 'path';

const regPath = path.resolve('app/data/templates/theme-engine/registry.json');
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const bespokeAudio = [
  { id: 'd2c-audio-announcement', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-announcement.liquid', type: 'announcement', visualStyle: 'cyber', category: 'announcement' },
  { id: 'd2c-audio-header', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-header.liquid', type: 'header', visualStyle: 'cyber', category: 'header' },
  { id: 'd2c-audio-hero', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-hero.liquid', type: 'hero', visualStyle: 'cyber', category: 'hero' },
  { id: 'd2c-audio-marquee', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-marquee.liquid', type: 'marquee', visualStyle: 'cyber', category: 'custom' },
  { id: 'd2c-audio-category-tiles', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-category-tiles.liquid', type: 'category-tiles', visualStyle: 'cyber', category: 'collection' },
  { id: 'd2c-audio-bestsellers-tabs', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-bestsellers-tabs.liquid', type: 'bestsellers-tabs', visualStyle: 'cyber', category: 'product-grid' },
  { id: 'd2c-audio-shoppable-reels', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-shoppable-reels.liquid', type: 'reels', visualStyle: 'cyber', category: 'ugc' },
  { id: 'd2c-audio-featured-drop', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-featured-drop.liquid', type: 'featured-drop', visualStyle: 'cyber', category: 'product-page' },
  { id: 'd2c-audio-lookbook-grid', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-lookbook-grid.liquid', type: 'lookbook', visualStyle: 'cyber', category: 'ugc' },
  { id: 'd2c-audio-fabric-tech', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-fabric-tech.liquid', type: 'fabric-tech', visualStyle: 'cyber', category: 'trust' },
  { id: 'd2c-audio-bundle-builder', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-bundle-builder.liquid', type: 'bundle-builder', visualStyle: 'cyber', category: 'bundle-builder' },
  { id: 'd2c-audio-promo-banner', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-promo-banner.liquid', type: 'promo-banner', visualStyle: 'cyber', category: 'custom' },
  { id: 'd2c-audio-ugc-community', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-ugc-community.liquid', type: 'ugc-community', visualStyle: 'cyber', category: 'ugc' },
  { id: 'd2c-audio-trust-badges', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-trust-badges.liquid', type: 'trust-badges', visualStyle: 'cyber', category: 'trust' },
  { id: 'd2c-audio-press-strip', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-press-strip.liquid', type: 'press-strip', visualStyle: 'cyber', category: 'trust' },
  { id: 'd2c-audio-reviews', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-reviews.liquid', type: 'reviews', visualStyle: 'cyber', category: 'testimonials' },
  { id: 'd2c-audio-brand-story', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-brand-story.liquid', type: 'brand-story', visualStyle: 'cyber', category: 'brand-story' },
  { id: 'd2c-audio-faq', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-faq.liquid', type: 'faq', visualStyle: 'cyber', category: 'faq' },
  { id: 'd2c-audio-vip-perks', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-vip-perks.liquid', type: 'vip-perks', visualStyle: 'cyber', category: 'trust' },
  { id: 'd2c-audio-newsletter', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-newsletter.liquid', type: 'newsletter', visualStyle: 'cyber', category: 'newsletter' },
  { id: 'd2c-audio-footer', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-footer.liquid', type: 'footer', visualStyle: 'cyber', category: 'footer' },
  { id: 'd2c-audio-popup-bass', file: 'components/bespoke-d2c/cyber-audio/d2c-audio-popup-bass.liquid', type: 'popup-bass', visualStyle: 'cyber', category: 'popup' }
];

const existing = new Set(reg.components.map((c: any) => c.componentId));

for (const b of bespokeAudio) {
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
      niche: 'electronics',
      family: 'Cyber Electronics',
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
      niche: 'electronics',
      family: 'Cyber Electronics',
      sizeBytes: size,
      version: '1.0.0'
    });
  }
}

fs.writeFileSync(regPath, JSON.stringify(reg, null, 2));
console.log('Successfully registered all 22 bespoke Cyber Audio components in registry.json! Total components in registry:', reg.components.length);
