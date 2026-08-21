const fs = require('fs');
const path = require('path');

// Let's read registry.json and build the exact templates/index.json that applyComposition generates for hp-v51-home!

const registryPath = path.join(__dirname, '..', 'app', 'data', 'templates', 'theme-engine', 'registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const list = Array.isArray(registry) ? registry : registry.components || [];
const known = new Map(list.map(c => [c.componentId, c.liquidPath]));

const hpV51Sections = [
  "fb04-hero-tabs_streetwear",
  "fb04-new-drops_streetwear",
  "fb04-brand-story_streetwear",
  "fb04-manifesto_streetwear",
  "fb04-marquee_streetwear",
  "fb04-product-spotlight_streetwear",
  "fb04-cta-banner_streetwear",
  "fb04-trust-grid_streetwear",
  "fb04-category-tiles_streetwear",
  "fb04-newsletter_streetwear"
];

console.log("Checking liquid file resolution for hp-v51-home sections:\n");

let missing = 0;
hpV51Sections.forEach((comp, idx) => {
  const relP = known.get(comp);
  if (!relP) {
    console.error(`❌ MISSING IN REGISTRY: ${comp}`);
    missing++;
    return;
  }
  const absP = path.join(__dirname, '..', 'app', 'data', 'templates', 'theme-engine', relP);
  if (!fs.existsSync(absP)) {
    console.error(`❌ FILE NOT FOUND AT PATH: ${absP}`);
    missing++;
  } else {
    console.log(`  ✓ Section ${idx + 1}: ${comp} -> ${relP}`);
  }
});

console.log(`\nResult: ${hpV51Sections.length - missing}/${hpV51Sections.length} sections resolved.`);
