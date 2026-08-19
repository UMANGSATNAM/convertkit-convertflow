import fs from 'fs';
import path from 'path';
import { COMPOSITIONS } from '../app/data/page-compositions';
import { buildStorePalette, applyStorePalette } from '../app/services/theme-engine/palette.server';

const ENGINE = path.resolve('app/data/templates/theme-engine');
const reg = JSON.parse(fs.readFileSync(path.join(ENGINE, 'registry.json'), 'utf8'));
const compMap = new Map(reg.components.map((c: any) => [c.componentId, c.liquidPath]));

const comp = COMPOSITIONS.find(c => c.id === 'streetwear-cyber-home')!;

const files: Record<string, string> = {};
const sections: Record<string, any> = {};
const order: string[] = [];

let idx = 1;
for (const s of comp.sections) {
  const liquidPath = compMap.get(s.componentId)!;
  files[`sections/${s.componentId}.liquid`] = fs.readFileSync(path.join(ENGINE, liquidPath), 'utf8');
  const key = `section_${String(idx).padStart(2, '0')}_${s.componentId.replace(/[^a-zA-Z0-9]/g, '_')}`;
  sections[key] = { type: s.componentId, settings: s.settings || {} };
  order.push(key);
  idx++;
}
files['templates/index.json'] = JSON.stringify({ sections, order }, null, 2);

console.log('BEFORE PALETTE apply:');
console.log('section_01 settings:', JSON.stringify(sections['section_01_d2c_streetwear_hero'].settings));

const targetPalette = {
  background: '#09090b',
  text: '#ffffff',
  accent: '#ff5500',
  surface: '#18181b',
};

const stats = applyStorePalette(files, buildStorePalette(targetPalette));
console.log('PALETTE STATS:', stats);

const afterDoc = JSON.parse(files['templates/index.json']);
console.log('\nAFTER PALETTE apply:');
for (const k of afterDoc.order) {
  console.log(`  ${k} -> settings:`, afterDoc.sections[k].settings);
}
