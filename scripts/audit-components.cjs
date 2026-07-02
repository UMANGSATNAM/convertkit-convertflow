const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'app', 'services', 'theme-engine', 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.liquid'));

let shortFiles = [];
files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  const lines = content.split('\n').length;
  if (lines < 100) shortFiles.push({ name: f, lines });
});
shortFiles.sort((a, b) => a.lines - b.lines);

const groups = {};
shortFiles.forEach(f => {
  const type = f.name.split('_')[0];
  if (!groups[type]) groups[type] = [];
  groups[type].push(f);
});

console.log('=== BY COMPONENT TYPE ===');
Object.entries(groups)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([type, items]) => {
    console.log(`\n${type} (${items.length}):`);
    items.forEach(i => console.log(`  ${i.lines}L: ${i.name}`));
  });
