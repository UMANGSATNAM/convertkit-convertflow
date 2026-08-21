const fs = require('fs');
const path = require('path');

const ENGINE = path.resolve('app/data/templates/theme-engine');
const registryPath = path.join(ENGINE, 'registry.json');
const raw = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const list = Array.isArray(raw) ? raw : raw.components || [];
const known = new Map(list.map(c => [c.componentId, c.liquidPath]));

// Auto-scan
function scanDir(dir, relBase = 'components') {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(relBase, entry.name).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        scanDir(fullPath, relPath);
      } else if (entry.isFile() && entry.name.endsWith('.liquid')) {
        const compId = entry.name.replace(/\.liquid$/, '');
        if (!known.has(compId)) {
          known.set(compId, relPath);
        }
      }
    }
  } catch {}
}
scanDir(path.join(ENGINE, 'components'));

console.log('Known total components:', known.size);

const hp51Sections = [
  'hp51-hero-tabs',
  'hp51-new-drops',
  'hp51-brand-story',
  'hp51-manifesto',
  'hp51-marquee',
  'hp51-product-spotlight',
  'hp51-cta-banner',
  'hp51-trust-grid',
  'hp51-category-tiles',
  'hp51-newsletter'
];

hp51Sections.forEach(id => {
  const p = known.get(id);
  const exists = p && fs.existsSync(path.join(ENGINE, p));
  console.log(`Section [${id}] -> path: ${p} | exists: ${exists}`);
});
