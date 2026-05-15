import fs from 'fs';

// Read the new template
const content = fs.readFileSync('lp-jewellery-heritage.html', 'utf-8');

// Escape for template literal embedding
const escaped = content
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$/g, '\\$');

// Read existing templatesHtml.js
let existing = fs.readFileSync('app/templatesHtml.js', 'utf-8');

// Insert the new entry at the top
const newEntry = `  "jewellery-heritage": \`${escaped}\`,\n`;
existing = existing.replace('export const TEMPLATE_HTMLS = {\n', `export const TEMPLATE_HTMLS = {\n${newEntry}`);

fs.writeFileSync('app/templatesHtml.js', existing);
console.log('Done! jewellery-heritage template added.');
