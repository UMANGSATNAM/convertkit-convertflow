import fs from 'fs';
import path from 'path';

const liquid = fs.readFileSync('app/data/templates/theme-engine/components/product-page/pdp-sticky-atc.liquid', 'utf8');

let html = liquid;
html = html.replace(/{% schema %}[\s\S]*?{% endschema %}/g, '');
html = html.replace(/{% comment %}[\s\S]*?{% endcomment %}/g, '');
html = html.replace(/{%-?\s*style\s*-?%}/g, '<style>');
html = html.replace(/{%-?\s*endstyle\s*-?%}/g, '</style>');
html = html.replace(/{%-?\s*javascript\s*-?%}/g, '<script>');
html = html.replace(/{%-?\s*endjavascript\s*-?%}/g, '</script>');
html = html.replace(/\{\{\s*section\.id\s*\}\}/g, 's_1');
html = html.replace(/\{\{\s*[^|}]+\|\s*default:\s*['"]([^'"]+)['"]\s*\}\}/g, '$1');
html = html.replace(/{%-?[\s\S]*?-?%}/g, '');

console.log('Result start (first 300 chars):');
console.log(html.slice(0, 300));
console.log('Does it have <style>?', html.includes('<style>'));
console.log('Does it have </style>?', html.includes('</style>'));
