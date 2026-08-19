const fs = require('fs');
const path = require('path');

const engineDir = path.join(__dirname, '../app/data/templates/theme-engine');
const registry = JSON.parse(fs.readFileSync(path.join(engineDir, 'registry.json'), 'utf8'));
const regMap = new Map((registry.components || registry).map(c => [c.componentId, c]));

const compSrc = fs.readFileSync(path.join(__dirname, '../app/data/page-compositions.ts'), 'utf8');

// Parse COMPOSITIONS by evaluating or extracting JSON
// Let's print out what each of the 10 homepages has
console.log('=== Checking Registry for all Homepage references ===');

// Check header-tech-v1 in registry
console.log('header-tech-v1 in regMap?', regMap.has('header-tech-v1'));
console.log('header-centered-v1 in regMap?', regMap.has('header-centered-v1'));
console.log('hp14-header in regMap?', regMap.has('hp14-header'));
