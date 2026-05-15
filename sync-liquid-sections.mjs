// sync-liquid-sections.mjs
// Reads all .liquid files from sections dir and rebuilds liquidSections.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SECTIONS_DIR = path.resolve(__dirname, './extensions/convertkit-sections/sections');
const OUT_FILE = path.resolve(__dirname, './app/liquidSections.js');

const files = fs.readdirSync(SECTIONS_DIR).filter(f => f.endsWith('.liquid')).sort();
console.log(`Found ${files.length} liquid sections. Rebuilding liquidSections.js...`);

const parts = ['export const LIQUID_SECTIONS = {'];

for (const file of files) {
  const key = file.replace('.liquid', '');
  const content = fs.readFileSync(path.join(SECTIONS_DIR, file), 'utf-8');
  // Escape backticks and template literal dollar signs
  const escaped = content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
  parts.push(`  ${JSON.stringify(key)}: \`${escaped}\`,`);
}

parts.push('};\n');

fs.writeFileSync(OUT_FILE, parts.join('\n'), 'utf-8');
console.log(`✅ Done! ${OUT_FILE} updated with ${files.length} sections.`);
