const fs = require('fs');
const path = require('path');

const engineDir = path.join(__dirname, '../app/data/templates/theme-engine');
const registry = JSON.parse(fs.readFileSync(path.join(engineDir, 'registry.json'), 'utf8'));
const regMap = new Map((registry.components || registry).map(c => [c.componentId, c]));

const compSrc = fs.readFileSync(path.join(__dirname, '../app/data/page-compositions.ts'), 'utf8');

// Require ts-node or run with babel/sucrase or evaluate
const { execSync } = require('child_process');

console.log('=== Checking all 10 Homepages ===');
