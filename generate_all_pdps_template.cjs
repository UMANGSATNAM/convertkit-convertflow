const fs = require('fs');
const path = require('path');
const sectionsDir = path.join(__dirname, 'dev-theme-peri', 'sections');
const files = fs.readdirSync(sectionsDir).filter(f => f.startsWith('pdp-') && f.endsWith('.liquid'));
const lines = files.map(f => `{% section '${f.replace('.liquid', '')}' %}`);
const outputPath = path.join(__dirname, 'dev-theme-peri', 'templates', 'collection.all-pdps.liquid');
fs.writeFileSync(outputPath, lines.join('\n'));
console.log('Created collection.all-pdps.liquid with ' + lines.length + ' sections.');
