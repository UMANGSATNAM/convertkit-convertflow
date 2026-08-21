const fs = require('fs');

const compContent = fs.readFileSync('app/data/page-compositions.ts', 'utf8');
const compIds = compContent.match(/id:\s*"([^"]+)"/g) || [];
console.log('--- COMPOSITIONS in app/data/page-compositions.ts ---');
compIds.forEach(id => console.log('  ', id));

const tempContent = fs.readFileSync('app/data/page-templates.ts', 'utf8');
const tempIds = tempContent.match(/id:\s*"([^"]+)"/g) || [];
console.log('\n--- TEMPLATES in app/data/page-templates.ts (Total: ' + tempIds.length + ') ---');
tempIds.slice(0, 10).forEach(id => console.log('  ', id));
console.log('  ...');
tempIds.slice(-5).forEach(id => console.log('  ', id));
