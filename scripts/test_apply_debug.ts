import fs from 'fs';
import path from 'path';
import { COMPOSITIONS } from '../app/data/page-compositions';

const ENGINE = path.resolve('app/data/templates/theme-engine');
const reg = JSON.parse(fs.readFileSync(path.join(ENGINE, 'registry.json'), 'utf8'));
const known = new Map(reg.components.map((c: any) => [c.componentId, c.liquidPath]));

for (const comp of COMPOSITIONS.slice(0, 2)) {
  console.log(`\n========================================`);
  console.log(`COMPOSITION: ${comp.id} (${comp.name})`);
  console.log(`Sections count: ${comp.sections.length}`);
  
  const sections: Record<string, any> = {};
  const order: string[] = [];
  const missingFiles: string[] = [];

  let sectionIndex = 1;
  for (const spec of comp.sections) {
    const liquidPath = known.get(spec.componentId);
    if (!liquidPath) {
      missingFiles.push(spec.componentId);
      continue;
    }
    const safeId = spec.componentId.replace(/[^a-zA-Z0-9]/g, "_");
    const key = `section_${String(sectionIndex).padStart(2, "0")}_${safeId}`;
    sections[key] = { type: spec.componentId, settings: {} };
    order.push(key);
    sectionIndex++;
  }

  console.log(`Total sections in template: ${order.length}`);
  console.log(`Missing components:`, missingFiles);
  console.log(`Sample section keys in index.json:`, order.slice(0, 5));
}
