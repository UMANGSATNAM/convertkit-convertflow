import fs from 'fs/promises';
import path from 'path';

const ENGINE = path.resolve('app/data/templates/theme-engine');

async function testScan() {
  const registryPath = path.join(ENGINE, 'registry.json');
  const raw = JSON.parse(await fs.readFile(registryPath, 'utf-8'));
  const list = Array.isArray(raw) ? raw : raw.components || [];
  const known = new Map<string, string>(list.map((c: any) => [c.componentId, c.liquidPath]));

  console.log(`Initial known components from registry.json: ${known.size}`);

  const componentsDir = path.join(ENGINE, 'components');
  async function scanDir(dir: string, relBase = 'components') {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.join(relBase, entry.name).replace(/\\/g, '/');
        if (entry.isDirectory()) {
          await scanDir(fullPath, relPath);
        } else if (entry.isFile() && entry.name.endsWith('.liquid')) {
          const compId = entry.name.replace(/\.liquid$/, '');
          if (!known.has(compId)) {
            known.set(compId, relPath);
          }
        }
      }
    } catch {}
  }
  await scanDir(componentsDir);

  console.log(`Total known components after scanning disk: ${known.size}`);
  
  // Test lookup for bespoke components
  const testIds = [
    'd2c-streetwear-hero',
    'd2c-streetwear-category-tiles',
    'd2c-audio-hero',
    'd2c-silver-hero',
    'd2c-royal-hero'
  ];

  for (const id of testIds) {
    console.log(`Lookup [${id}] -> ${known.get(id) || '❌ NOT FOUND'}`);
  }
}

testScan();
