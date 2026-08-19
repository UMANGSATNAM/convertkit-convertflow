import fs from 'fs';
import path from 'path';
import { COMPOSITIONS } from '../app/data/page-compositions';

const regPath = path.resolve('app/data/templates/theme-engine/registry.json');
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
const compMap = new Map(reg.components.map((c: any) => [c.componentId, c.liquidPath]));

console.log(`Checking ${COMPOSITIONS.length} compositions...`);

let totalSections = 0;
let missingCount = 0;

for (const comp of COMPOSITIONS) {
  const allIds = [comp.announcement, comp.header, comp.footer, ...comp.sections.map(s => s.componentId)].filter(Boolean) as string[];
  totalSections += allIds.length;
  let compMissing = 0;
  for (const id of allIds) {
    const p = compMap.get(id);
    if (!p) {
      console.error(`  ❌ MISSING REGISTRY ENTRY: [${comp.id}] -> ${id}`);
      missingCount++;
      compMissing++;
    } else {
      const fullPath = path.resolve('app/data/templates/theme-engine', p);
      if (!fs.existsSync(fullPath)) {
        console.error(`  ❌ MISSING LIQUID FILE: [${comp.id}] -> ${p} (${id})`);
        missingCount++;
        compMissing++;
      }
    }
  }
  if (compMissing === 0) {
    console.log(`  ✅ ${comp.id}: all ${allIds.length} sections valid.`);
  }
}

console.log(`\nTotal sections checked: ${totalSections}, Total missing: ${missingCount}`);
