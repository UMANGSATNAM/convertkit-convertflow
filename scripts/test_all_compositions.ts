import fs from 'fs';
import path from 'path';
import { COMPOSITIONS } from '../app/data/page-compositions';

const ENGINE = path.resolve('app/data/templates/theme-engine');
const reg = JSON.parse(fs.readFileSync(path.join(ENGINE, 'registry.json'), 'utf8'));
const compMap = new Map(reg.components.map((c: any) => [c.componentId, c.liquidPath]));

async function testCompositionUpload(compId: string) {
  const comp = COMPOSITIONS.find(c => c.id === compId);
  if (!comp) {
    console.error(`Composition not found: ${compId}`);
    return;
  }

  console.log(`\n==================================================`);
  console.log(`TESTING COMPOSITION APPLY: ${comp.id}`);
  console.log(`==================================================`);

  const files: Record<string, string> = {};
  const sections: Record<string, any> = {};
  const order: string[] = [];

  let idx = 1;
  for (const s of comp.sections) {
    const liquidPath = compMap.get(s.componentId);
    if (!liquidPath) {
      console.error(`❌ NO LIQUID PATH FOR: ${s.componentId}`);
      continue;
    }
    const fullP = path.join(ENGINE, liquidPath);
    if (!fs.existsSync(fullP)) {
      console.error(`❌ FILE NOT FOUND: ${fullP}`);
      continue;
    }
    files[`sections/${s.componentId}.liquid`] = fs.readFileSync(fullP, 'utf8');

    const key = `section_${String(idx).padStart(2, '0')}_${s.componentId.replace(/[^a-zA-Z0-9]/g, '_')}`;
    sections[key] = { type: s.componentId, settings: s.settings || {} };
    order.push(key);
    idx++;
  }

  // Header and Footer groups
  if (comp.announcement) {
    const lp = compMap.get(comp.announcement);
    if (lp) files[`sections/${comp.announcement}.liquid`] = fs.readFileSync(path.join(ENGINE, lp), 'utf8');
  }
  if (comp.header) {
    const lp = compMap.get(comp.header);
    if (lp) files[`sections/${comp.header}.liquid`] = fs.readFileSync(path.join(ENGINE, lp), 'utf8');
  }
  if (comp.footer) {
    const lp = compMap.get(comp.footer);
    if (lp) files[`sections/${comp.footer}.liquid`] = fs.readFileSync(path.join(ENGINE, lp), 'utf8');
  }

  const indexJson = { sections, order };
  files['templates/index.json'] = JSON.stringify(indexJson, null, 2);

  const headerGroupSections: Record<string, any> = {};
  const headerGroupOrder: string[] = [];
  if (comp.announcement) {
    headerGroupSections['announcement'] = { type: comp.announcement, settings: {} };
    headerGroupOrder.push('announcement');
  }
  if (comp.header) {
    headerGroupSections['header'] = { type: comp.header, settings: {} };
    headerGroupOrder.push('header');
  }
  files['sections/header-group.json'] = JSON.stringify({
    name: 'Header Group', type: 'header', sections: headerGroupSections, order: headerGroupOrder
  }, null, 2);

  const footerGroup = {
    name: 'Footer Group',
    type: 'footer',
    sections: {
      footer: { type: comp.footer, settings: {} }
    },
    order: ['footer']
  };
  files['sections/footer-group.json'] = JSON.stringify(footerGroup, null, 2);

  console.log(`Total sections in index.json: ${order.length}`);
  console.log(`Total liquid files uploaded: ${Object.keys(files).filter(k => k.startsWith('sections/') && k.endsWith('.liquid')).length}`);
  console.log(`templates/index.json bytes: ${files['templates/index.json'].length}`);
  console.log(`sections/header-group.json bytes: ${files['sections/header-group.json'].length}`);
  console.log(`sections/footer-group.json bytes: ${files['sections/footer-group.json'].length}`);
  
  console.log(`Order list in index.json:`);
  order.forEach((k, i) => {
    console.log(`  ${i+1}. ${k} -> type: ${sections[k].type}`);
  });
}

(async () => {
  for (const c of COMPOSITIONS.filter(c => c.pageType === 'index')) {
    await testCompositionUpload(c.id);
  }
})();
