const fs = require('fs');
const path = require('path');

const engineDir = path.join(__dirname, '../app/data/templates/theme-engine');
const registry = JSON.parse(fs.readFileSync(path.join(engineDir, 'registry.json'), 'utf8'));
const regMap = new Map((registry.components || registry).map(c => [c.componentId, c.liquidPath]));

console.log('Total registry components:', regMap.size);

const compSrc = fs.readFileSync(path.join(__dirname, '../app/data/page-compositions.ts'), 'utf8');

const idRegex = /componentId:\s*["']([^"']+)["']/g;
const headerRegex = /header:\s*["']([^"']+)["']/g;
const footerRegex = /footer:\s*["']([^"']+)["']/g;

const idMatches = [];
let match;
while ((match = idRegex.exec(compSrc)) !== null) idMatches.push(match[1]);
while ((match = headerRegex.exec(compSrc)) !== null) idMatches.push(match[1]);
while ((match = footerRegex.exec(compSrc)) !== null) idMatches.push(match[1]);

const allUsed = [...new Set(idMatches)];
console.log('Unique components used in page-compositions.ts:', allUsed.length);

const missing = [];
for (const id of allUsed) {
  if (!regMap.has(id)) {
    missing.push({ id, reason: 'Not in registry' });
  } else {
    const liquidRel = regMap.get(id);
    const fullPath = path.join(engineDir, liquidRel);
    if (!fs.existsSync(fullPath)) {
      missing.push({ id, reason: 'File not on disk: ' + liquidRel });
    }
  }
}

console.log('Missing/broken components (' + missing.length + '):', JSON.stringify(missing, null, 2));
