import fs from 'fs';

const files = [
  'lp-electronics.html',
  'lp-home-decor.html',
  'lp-pet-supplies.html',
  'lp-luxury-watches.html',
  'lp-outdoor-gear.html',
  'lp-organic-food.html',
  'lp-fitness-supplements.html',
  'lp-baby-apparel.html',
  'lp-coffee-roasters.html',
  'lp-beauty-cosmetics.html'
];

let out = 'export const TEMPLATE_HTMLS = {\n';
for (let f of files) {
  let content = fs.readFileSync(f, 'utf-8');
  let key = f.replace('lp-', '').replace('.html', '');
  out += `  "${key}": \`${content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,\n`;
}
out += '};\n';

fs.writeFileSync('app/templatesHtml.js', out);
console.log('Templates HTMLs generated successfully!');
