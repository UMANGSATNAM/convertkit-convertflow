const fs = require('fs');
const path = require('path');

const engineDir = path.join(__dirname, '../app/data/templates/theme-engine');
const registry = JSON.parse(fs.readFileSync(path.join(engineDir, 'registry.json'), 'utf8'));
const regMap = new Map((registry.components || registry).map(c => [c.componentId, c.liquidPath]));

if (!regMap.has('header-tech-v1') && regMap.has('header-centered-v1')) {
  regMap.set('header-tech-v1', regMap.get('header-centered-v1'));
}

const compSrc = fs.readFileSync(path.join(__dirname, '../app/data/page-compositions.ts'), 'utf8');

// Check all components used across all compositions
const idRegex = /componentId:\s*["']([^"']+)["']/g;
const annRegex = /announcement:\s*["']([^"']+)["']/g;
const headRegex = /header:\s*["']([^"']+)["']/g;
const footRegex = /footer:\s*["']([^"']+)["']/g;

const allUsed = new Set();
let match;
while ((match = idRegex.exec(compSrc)) !== null) allUsed.add(match[1]);
while ((match = annRegex.exec(compSrc)) !== null) allUsed.add(match[1]);
while ((match = headRegex.exec(compSrc)) !== null) allUsed.add(match[1]);
while ((match = footRegex.exec(compSrc)) !== null) allUsed.add(match[1]);

console.log(`Total components tested: ${allUsed.size}`);

let missingCount = 0;
for (const id of allUsed) {
  if (!regMap.has(id)) {
    console.error(`[ERROR] Component not in registry: ${id}`);
    missingCount++;
  } else {
    const liquidRel = regMap.get(id);
    const fullPath = path.join(engineDir, liquidRel);
    if (!fs.existsSync(fullPath)) {
      console.error(`[ERROR] File missing on disk: ${fullPath} for ID ${id}`);
      missingCount++;
    }
  }
}

if (missingCount === 0) {
  console.log(`\n🎉 SUCCESS: All ${allUsed.size} components verified! Zero missing components.`);
} else {
  console.error(`\n❌ FAILED: ${missingCount} components missing.`);
}
