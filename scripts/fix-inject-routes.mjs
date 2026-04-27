// fix-inject-routes.mjs
// Reads actual .liquid files on disk and rebuilds customTemplateConfigs
// to exactly match what files exist. Then patches api.inject-template.jsx.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SECTIONS_DIR = path.join(ROOT, 'extensions/convertkit-sections/sections');

// Templates to process (all 21 niche templates)
const TEMPLATE_IDS = [
  'jewellery-heritage',
  'fashion-clothing',
  'footwear',
  'ayurveda-wellness',
  'mobile-accessories',
  'kids-toys',
  'home-furniture',
  'food-delivery',
  'electronics',
  'home-decor',
  'pet-supplies',
  'luxury-watches',
  'outdoor-gear',
  'organic-food',
  'fitness-supplements',
  'baby-apparel',
  'coffee-roasters',
  'beauty-cosmetics',
  'mens-grooming',
  'activewear',
  'streetwear',
  'personal-care',
];

// Section types to EXCLUDE from landing page (they have their own inject logic)
const EXCLUDED_SUFFIXES = ['-landing', '-product', '-cart', '-collection'];

const configs = {};

for (const tplId of TEMPLATE_IDS) {
  const prefix = `cf-${tplId}-`;
  const files = fs.readdirSync(SECTIONS_DIR)
    .filter(f => f.startsWith(prefix) && f.endsWith('.liquid'))
    .map(f => f.replace('.liquid', ''))
    .filter(name => !EXCLUDED_SUFFIXES.some(s => name.endsWith(s)))
    .sort();

  if (files.length === 0) continue;

  configs[tplId] = files.map(filename => {
    const key = filename.replace(prefix, '');
    return { key, filename, type: filename };
  });
}

// Output as JS object literal
let out = 'const customTemplateConfigs = {\n';
for (const [tplId, sections] of Object.entries(configs)) {
  out += `  "${tplId}": [\n`;
  for (const sec of sections) {
    out += `    { key: "${sec.key}", filename: "${sec.filename}", type: "${sec.type}" },\n`;
  }
  out += `  ],\n`;
}
out += '};\n';

console.log('=== GENERATED customTemplateConfigs ===\n');
console.log(out);

// Save to file for reference
fs.writeFileSync(path.join(ROOT, 'auto-split-routes-fixed.txt'), out, 'utf-8');
console.log('\n✅ Saved to auto-split-routes-fixed.txt');

// Count
let total = 0;
for (const s of Object.values(configs)) total += s.length;
console.log(`\n📦 ${Object.keys(configs).length} templates × avg ${(total/Object.keys(configs).length).toFixed(1)} sections = ${total} total`);
