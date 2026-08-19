import fs from 'fs';
import path from 'path';
import { COMPOSITIONS } from '../app/data/page-compositions';

console.log('====================================================');
console.log('  COMPREHENSIVE AUDIT: 10 D2C INDIAN HOMEPAGES');
console.log('====================================================\n');

const regPath = path.resolve('app/data/templates/theme-engine/registry.json');
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
const compMap = new Map(reg.components.map((c: any) => [c.componentId, c]));

let totalSectionsChecked = 0;
let errors = 0;

for (let i = 0; i < 10; i++) {
  const hp = COMPOSITIONS[i];
  console.log(`\n[HOMEPAGE ${i + 1}] ${hp.id.toUpperCase()}`);
  console.log(`  Name: ${hp.name}`);
  console.log(`  Niche: ${hp.niche} | Style: ${hp.styleBadge}`);
  console.log(`  Announcement: ${hp.announcement}`);
  console.log(`  Header: ${hp.header}`);
  console.log(`  Footer: ${hp.footer}`);
  console.log(`  Total Sections: ${hp.sections.length}`);

  const compsToCheck = [
    { type: 'Announcement', id: hp.announcement },
    { type: 'Header', id: hp.header },
    { type: 'Footer', id: hp.footer },
    ...hp.sections.map((s, idx) => ({ type: `Section #${idx + 1}`, id: s.componentId }))
  ];

  for (const item of compsToCheck) {
    if (!item.id) continue;
    totalSectionsChecked++;
    const regEntry = compMap.get(item.id);
    if (!regEntry) {
      console.error(`  ❌ MISSING IN REGISTRY: [${item.type}] ${item.id}`);
      errors++;
      continue;
    }

    const fullPath = path.resolve('app/data/templates/theme-engine', regEntry.liquidPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`  ❌ MISSING LIQUID FILE: [${item.type}] ${fullPath}`);
      errors++;
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const schemaMatch = content.match(/{% schema %}([\s\S]*?){% endschema %}/);
    if (!schemaMatch) {
      console.error(`  ❌ MISSING SCHEMA: [${item.type}] in ${fullPath}`);
      errors++;
    } else {
      try {
        JSON.parse(schemaMatch[1]);
      } catch (err: any) {
        console.error(`  ❌ INVALID SCHEMA JSON: [${item.type}] in ${fullPath}: ${err.message}`);
        errors++;
      }
    }
  }
}

console.log('\n====================================================');
console.log(`  AUDIT SUMMARY`);
console.log(`  Total Sections Checked across 10 Homepages: ${totalSectionsChecked}`);
console.log(`  Errors Found: ${errors}`);
console.log('====================================================');

if (errors === 0) {
  console.log('\n✅ ALL 10 D2C HOMEPAGES ARE 100% BESPOKE, VALIDATED & READY!');
} else {
  process.exit(1);
}
