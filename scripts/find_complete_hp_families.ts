import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('app/data/templates/theme-engine/registry.json', 'utf8'));
const regIds = new Set(reg.components.map((c: any) => c.componentId));

console.log('=== SCANNING HP FAMILIES IN REGISTRY ===');
for (let i = 1; i <= 70; i++) {
  const prefix = `hp${i}-`;
  const matching = [...regIds].filter(id => id.startsWith(prefix));
  if (matching.length >= 10) {
    console.log(`hp${i}: ${matching.length} sections ->`, matching);
  }
}
