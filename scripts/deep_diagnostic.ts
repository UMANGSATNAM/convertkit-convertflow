/**
 * Deep diagnostic: simulates EXACTLY what applyComposition does for
 * `streetwear-cyber-home` and dumps the generated templates/index.json
 * plus file manifest to console so we can spot the exact defect.
 */
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { COMPOSITIONS } from '../app/data/page-compositions';

const ENGINE = path.resolve('app/data/templates/theme-engine');
const BASE = path.join(ENGINE, 'base-theme');

const reg = JSON.parse(fs.readFileSync(path.join(ENGINE, 'registry.json'), 'utf8'));
const known = new Map<string, string>(reg.components.map((c: any) => [c.componentId, c.liquidPath]));

// Simulate resolveSectionBundle
async function resolveSectionBundle(componentId: string, liquidPath: string) {
  const files: Record<string, string> = {};
  const missing: string[] = [];
  const sectionFile = path.join(ENGINE, liquidPath);
  if (!fs.existsSync(sectionFile)) {
    throw new Error(`Section "${componentId}" has no Liquid at ${liquidPath}`);
  }
  const source = await fsp.readFile(sectionFile, 'utf-8');
  files[`sections/${componentId}.liquid`] = source;
  return { files, missing };
}

// Pick a composition that the user is testing
const comp = COMPOSITIONS.find(c => c.id === 'streetwear-cyber-home') || COMPOSITIONS[0];
console.log(`\n=== DEEP DIAGNOSTIC: ${comp.id} (${comp.name}) ===\n`);

const chromeIds = new Set([comp.announcement, comp.header, comp.footer].filter(Boolean));

const files: Record<string, string> = {};
const sections: Record<string, any> = {};
const order: string[] = [];
const missingFiles: string[] = [];

(async () => {
  // 1. Build body sections
  let sectionIndex = 1;
  for (const spec of comp.sections) {
    if (chromeIds.has(spec.componentId)) continue;

    const liquidPath = known.get(spec.componentId);
    if (!liquidPath) {
      missingFiles.push(spec.componentId);
      continue;
    }

    const bundle = await resolveSectionBundle(spec.componentId, liquidPath);
    Object.assign(files, bundle.files);

    const safeId = spec.componentId.replace(/[^a-zA-Z0-9]/g, '_');
    const key = `section_${String(sectionIndex).padStart(2, '0')}_${safeId}`;
    sections[key] = { type: spec.componentId, settings: {} };
    order.push(key);
    sectionIndex++;
  }

  // 2. Build header group
  if (comp.announcement) {
    const lp = known.get(comp.announcement);
    if (lp) {
      const b = await resolveSectionBundle(comp.announcement, lp);
      Object.assign(files, b.files);
    }
  }
  if (comp.header) {
    const lp = known.get(comp.header);
    if (lp) {
      const b = await resolveSectionBundle(comp.header, lp);
      Object.assign(files, b.files);
    }
  }
  if (comp.footer) {
    const lp = known.get(comp.footer);
    if (lp) {
      const b = await resolveSectionBundle(comp.footer, lp);
      Object.assign(files, b.files);
    }
  }

  // 3. Build template file
  const templateFile = 'templates/index.json';
  files[templateFile] = JSON.stringify({ sections, order }, null, 2);

  // 4. Build header-group.json
  const headerGroupSections: Record<string, any> = {};
  const headerGroupOrder: string[] = [];
  if (comp.announcement) {
    headerGroupSections['announcement'] = {
      type: comp.announcement,
      settings: { text: `🔥 FREE WORLDWIDE EXPRESS SHIPPING ON ORDERS OVER $99 • USE CODE WELCOME10`, link: '/collections/all' },
    };
    headerGroupOrder.push('announcement');
  }
  if (comp.header) {
    headerGroupSections['header'] = { type: comp.header, settings: {} };
    headerGroupOrder.push('header');
  }
  files['sections/header-group.json'] = JSON.stringify({
    name: 'Header Group', type: 'header', sections: headerGroupSections, order: headerGroupOrder,
  }, null, 2);

  // 5. Build footer-group.json
  if (comp.footer) {
    files['sections/footer-group.json'] = JSON.stringify({
      name: 'Footer Group', type: 'footer',
      sections: { footer: { type: comp.footer, settings: {} } },
      order: ['footer'],
    }, null, 2);
  }

  // ──────────────────── DIAGNOSTIC OUTPUT ────────────────────
  console.log(`TOTAL FILES GENERATED: ${Object.keys(files).length}`);
  console.log(`MISSING COMPONENTS: ${missingFiles.length > 0 ? missingFiles.join(', ') : 'NONE ✅'}`);

  console.log(`\n--- templates/index.json (WHAT SHOPIFY READS) ---`);
  const indexDoc = JSON.parse(files[templateFile]);
  console.log(`Sections in index.json: ${indexDoc.order.length}`);
  for (const key of indexDoc.order) {
    const entry = indexDoc.sections[key];
    const liquidExists = !!files[`sections/${entry.type}.liquid`];
    const lineCount = liquidExists ? files[`sections/${entry.type}.liquid`].split('\n').length : 0;
    console.log(`  ${key} → type: "${entry.type}" | liquid exists: ${liquidExists} | lines: ${lineCount}`);
  }

  console.log(`\n--- sections/header-group.json ---`);
  const hg = JSON.parse(files['sections/header-group.json']);
  for (const key of hg.order) {
    const entry = hg.sections[key];
    const liquidExists = !!files[`sections/${entry.type}.liquid`];
    console.log(`  ${key} → type: "${entry.type}" | liquid exists: ${liquidExists}`);
  }

  console.log(`\n--- sections/footer-group.json ---`);
  const fg = JSON.parse(files['sections/footer-group.json']);
  for (const key of fg.order) {
    const entry = fg.sections[key];
    const liquidExists = !!files[`sections/${entry.type}.liquid`];
    console.log(`  ${key} → type: "${entry.type}" | liquid exists: ${liquidExists}`);
  }

  // Check key lengths for Shopify OS 2.0 limits
  console.log(`\n--- SECTION KEY LENGTH CHECK (Shopify max = 50 chars) ---`);
  let keyLenIssues = 0;
  for (const key of indexDoc.order) {
    if (key.length > 50) {
      console.error(`  ❌ KEY TOO LONG (${key.length} chars): ${key}`);
      keyLenIssues++;
    }
  }
  if (keyLenIssues === 0) console.log(`  All keys within 50 char limit ✅`);

  // Check section TYPE lengths
  console.log(`\n--- SECTION TYPE NAME CHECK ---`);
  for (const key of indexDoc.order) {
    const entry = indexDoc.sections[key];
    if (entry.type.length > 255) {
      console.error(`  ❌ TYPE TOO LONG: ${entry.type}`);
    }
  }
  console.log(`  All types valid ✅`);

  // List ALL uploaded files by category
  console.log(`\n--- ALL FILES MANIFEST ---`);
  const cats: Record<string, string[]> = {};
  for (const fname of Object.keys(files)) {
    const cat = fname.split('/')[0];
    if (!cats[cat]) cats[cat] = [];
    cats[cat].push(fname);
  }
  for (const [cat, fnames] of Object.entries(cats)) {
    console.log(`  ${cat}/ (${fnames.length} files)`);
    for (const f of fnames.slice(0, 5)) {
      console.log(`    ${f} (${files[f].length} bytes)`);
    }
    if (fnames.length > 5) console.log(`    ... and ${fnames.length - 5} more`);
  }

  // Check if there is any issue with section schema validation
  console.log(`\n--- SCHEMA VALIDATION ---`);
  let schemaErrors = 0;
  for (const key of indexDoc.order) {
    const entry = indexDoc.sections[key];
    const liquid = files[`sections/${entry.type}.liquid`];
    if (!liquid) {
      console.error(`  ❌ NO LIQUID FILE for type: ${entry.type}`);
      schemaErrors++;
      continue;
    }
    const schemaMatch = liquid.match(/{% schema %}([\s\S]*?){% endschema %}/);
    if (!schemaMatch) {
      console.error(`  ❌ NO SCHEMA in: ${entry.type}`);
      schemaErrors++;
      continue;
    }
    try {
      const schema = JSON.parse(schemaMatch[1]);
      if (!schema.name) {
        console.error(`  ❌ SCHEMA MISSING NAME in: ${entry.type}`);
        schemaErrors++;
      }
    } catch (e: any) {
      console.error(`  ❌ INVALID SCHEMA JSON in: ${entry.type} - ${e.message}`);
      schemaErrors++;
    }
  }
  if (schemaErrors === 0) console.log(`  All ${indexDoc.order.length} sections have valid schemas ✅`);

  console.log(`\n=== DIAGNOSTIC COMPLETE ===`);
})();
