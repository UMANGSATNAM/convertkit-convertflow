const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '..', 'app', 'data', 'templates', 'theme-engine', 'registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

const fb04Components = [
  {
    componentId: 'fb04-announcement_streetwear',
    name: 'FB04 Announcement Bar',
    category: 'announcement',
    liquidPath: 'components/fb04-streetwear/fb04-announcement_streetwear.liquid'
  },
  {
    componentId: 'fb04-header_streetwear',
    name: 'FB04 Header (Streetwear)',

    category: 'header',
    liquidPath: 'components/fb04-streetwear/fb04-header_streetwear.liquid',
    presets: { brand_name: 'RAWBLOX' }
  },
  {
    componentId: 'fb04-hero-tabs_streetwear',
    name: 'FB04 Hero Tabs (Streetwear)',
    category: 'hero',
    liquidPath: 'components/fb04-streetwear/fb04-hero-tabs_streetwear.liquid'
  },
  {
    componentId: 'fb04-new-drops_streetwear',
    name: 'FB04 New Drops (Streetwear)',
    category: 'product-grid',
    liquidPath: 'components/fb04-streetwear/fb04-new-drops_streetwear.liquid'
  },
  {
    componentId: 'fb04-brand-story_streetwear',
    name: 'FB04 Brand Story (Streetwear)',
    category: 'brand-story',
    liquidPath: 'components/fb04-streetwear/fb04-brand-story_streetwear.liquid'
  },
  {
    componentId: 'fb04-manifesto_streetwear',
    name: 'FB04 Manifesto (Streetwear)',
    category: 'brand-story',
    liquidPath: 'components/fb04-streetwear/fb04-manifesto_streetwear.liquid'
  },
  {
    componentId: 'fb04-marquee_streetwear',
    name: 'FB04 Marquee (Streetwear)',
    category: 'custom',
    liquidPath: 'components/fb04-streetwear/fb04-marquee_streetwear.liquid'
  },
  {
    componentId: 'fb04-product-spotlight_streetwear',
    name: 'FB04 Product Spotlight (Streetwear)',
    category: 'product-page',
    liquidPath: 'components/fb04-streetwear/fb04-product-spotlight_streetwear.liquid'
  },
  {
    componentId: 'fb04-cta-banner_streetwear',
    name: 'FB04 Dark CTA Banner',
    category: 'custom',
    liquidPath: 'components/fb04-streetwear/fb04-cta-banner_streetwear.liquid'
  },
  {
    componentId: 'fb04-trust-grid_streetwear',
    name: 'FB04 Trust Grid',
    category: 'trust',
    liquidPath: 'components/fb04-streetwear/fb04-trust-grid_streetwear.liquid'
  },
  {
    componentId: 'fb04-category-tiles_streetwear',
    name: 'FB04 Category Tiles',
    category: 'collection',
    liquidPath: 'components/fb04-streetwear/fb04-category-tiles_streetwear.liquid'
  },
  {
    componentId: 'fb04-newsletter_streetwear',
    name: 'FB04 Newsletter',
    category: 'newsletter',
    liquidPath: 'components/fb04-streetwear/fb04-newsletter_streetwear.liquid'
  },
  {
    componentId: 'fb04-footer_streetwear',
    name: 'FB04 Footer (Streetwear)',
    category: 'footer',
    liquidPath: 'components/fb04-streetwear/fb04-footer_streetwear.liquid',
    presets: { brand_name: 'RAWBLOX' }
  }
];

let componentsList = Array.isArray(registry) ? registry : registry.components || [];

fb04Components.forEach(c => {
  const existingIdx = componentsList.findIndex(item => item.componentId === c.componentId);
  if (existingIdx !== -1) {
    componentsList[existingIdx] = c;
  } else {
    componentsList.push(c);
  }
});

if (Array.isArray(registry)) {
  fs.writeFileSync(registryPath, JSON.stringify(componentsList, null, 2), 'utf8');
} else {
  registry.components = componentsList;
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf8');
}

console.log(`✅ Registered ${fb04Components.length} fb04 components in theme-engine registry.json!`);
