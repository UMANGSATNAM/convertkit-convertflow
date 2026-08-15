const fs = require('fs');
let c = fs.readFileSync('scripts/footer_templates.mjs', 'utf8');
c = c.replace(/\\`/g, '`');
c = c.replace(/\\\$/g, '$');
fs.writeFileSync('scripts/footer_templates.mjs', c);
console.log('Fixed');
