const fs = require('fs');
const path = require('path');

const engineComponentsDir = path.join(__dirname, '..', 'app', 'data', 'templates', 'theme-engine', 'components');
const devPeriSectionsDir = path.join(__dirname, '..', 'dev-theme-peri', 'sections');
const registryPath = path.join(__dirname, '..', 'app', 'data', 'templates', 'theme-engine', 'registry.json');

const hp51Files = [
  'hp51-announcement.liquid',
  'hp51-header.liquid',
  'hp51-hero-tabs.liquid',
  'hp51-new-drops.liquid',
  'hp51-brand-story.liquid',
  'hp51-manifesto.liquid',
  'hp51-marquee.liquid',
  'hp51-product-spotlight.liquid',
  'hp51-cta-banner.liquid',
  'hp51-trust-grid.liquid',
  'hp51-category-tiles.liquid',
  'hp51-newsletter.liquid',
  'hp51-footer.liquid'
];

hp51Files.forEach(file => {
  const src = path.join(devPeriSectionsDir, file);
  const dest = path.join(engineComponentsDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  ✓ Copied ${file} -> components/${file}`);
  }
});

// Update registry.json with hp51-* IDs
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
let componentsList = Array.isArray(registry) ? registry : registry.components || [];

hp51Files.forEach(file => {
  const compId = file.replace('.liquid', '');
  const entry = {
    componentId: compId,
    name: compId.toUpperCase(),
    category: compId.includes('header') ? 'header' : compId.includes('footer') ? 'footer' : compId.includes('announcement') ? 'announcement' : 'custom',
    liquidPath: `components/${file}`
  };
  const idx = componentsList.findIndex(item => item.componentId === compId);
  if (idx !== -1) {
    componentsList[idx] = entry;
  } else {
    componentsList.push(entry);
  }
});

if (Array.isArray(registry)) {
  fs.writeFileSync(registryPath, JSON.stringify(componentsList, null, 2), 'utf8');
} else {
  registry.components = componentsList;
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf8');
}

console.log('✅ Registered all hp51-* components directly in theme-engine components & registry.json!');
