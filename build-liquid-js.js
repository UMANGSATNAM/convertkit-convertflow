/**
 * build-liquid-js.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reads all Shopify Liquid section files and bundles them into
 * app/liquidSections.js so the inject API can import them directly
 * instead of relying on runtime filesystem path resolution.
 *
 * Run: node build-liquid-js.js
 */

import fs from 'fs';
import path from 'path';

const SECTIONS_DIR = path.resolve('./extensions/convertkit-sections/sections');
const OUT_FILE     = path.resolve('./app/liquidSections.js');

const files = fs.readdirSync(SECTIONS_DIR)
  .filter(f => f.endsWith('.liquid'))
  .sort();

// Build the export object: key = "cf-{id}-{page}" (filename without .liquid)
let out = 'export const LIQUID_SECTIONS = {\n';

for (const file of files) {
  const key     = file.replace('.liquid', '');
  const content = fs.readFileSync(path.join(SECTIONS_DIR, file), 'utf-8');
  // Escape backticks and template literal markers
  const escaped = content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

  out += `  ${JSON.stringify(key)}: \`${escaped}\`,\n`;
}

out += '};\n';

fs.writeFileSync(OUT_FILE, out, 'utf-8');
console.log(`✅ liquidSections.js written — ${files.length} sections bundled.`);
