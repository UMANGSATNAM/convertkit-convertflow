import fs from 'fs';
import path from 'path';

const regPath = path.resolve('app/data/templates/theme-engine/registry.json');
const raw = JSON.parse(fs.readFileSync(regPath, 'utf8'));

let fixed = 0;
raw.components = raw.components.map((c: any) => {
  const cat = c.type || c.category || 'custom';
  const type = c.type || c.category || 'custom';
  const status = c.status || 'production';
  const metaPath = c.metaPath || '';
  const liquidPath = c.liquidPath || c.filePath || '';
  const filePath = c.filePath || c.liquidPath || '';

  fixed++;
  return {
    ...c,
    type,
    category: cat,
    status,
    metaPath,
    liquidPath,
    filePath,
    version: String(c.version || '1')
  };
});

fs.writeFileSync(regPath, JSON.stringify(raw, null, 2));
console.log(`Normalized all ${raw.components.length} components in registry.json!`);
