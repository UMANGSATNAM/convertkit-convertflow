const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '..', 'app', 'data', 'templates', 'theme-engine', 'registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const list = Array.isArray(registry) ? registry : registry.components || [];
const known = new Map(list.map(c => [c.componentId, c.liquidPath]));

console.log('Total registered components:', known.size);

const fb04Components = [
  'fb04-announcement_streetwear',
  'fb04-header_streetwear',
  'fb04-hero-tabs_streetwear',
  'fb04-new-drops_streetwear',
  'fb04-brand-story_streetwear',
  'fb04-manifesto_streetwear',
  'fb04-marquee_streetwear',
  'fb04-product-spotlight_streetwear',
  'fb04-cta-banner_streetwear',
  'fb04-trust-grid_streetwear',
  'fb04-category-tiles_streetwear',
  'fb04-newsletter_streetwear',
  'fb04-footer_streetwear'
];

let allFound = true;
fb04Components.forEach(id => {
  const p = known.get(id);
  if (!p) {
    console.error(`❌ Component "${id}" NOT found in registry!`);
    allFound = false;
  } else {
    const fullP = path.join(__dirname, '..', 'app', 'data', 'templates', 'theme-engine', p);
    if (!fs.existsSync(fullP)) {
      console.error(`❌ Liquid file for "${id}" does not exist at ${fullP}`);
      allFound = false;
    } else {
      console.log(`  ✓ ${id} -> ${p}`);
    }
  }
});

if (allFound) {
  console.log('\n🎉 ALL 13 FB04 COMPONENTS ARE FULLY REGISTERED AND LIQUID FILES EXIST!');
}
