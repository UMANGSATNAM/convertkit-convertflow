import * as fs from 'fs';
import * as path from 'path';

function main() {
  const filePath = path.resolve(process.cwd(), 'app/data/templates/theme-engine/component-registry/registry.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const types = new Set(data.components.map((c: any) => c.type));
  console.log("Unique component types in registry.json:", Array.from(types));
  
  // Show first component of each type
  const typeMap: Record<string, string> = {};
  for (const c of data.components) {
    if (!typeMap[c.type]) {
      typeMap[c.type] = c.componentId;
    }
  }
  console.log("Sample component IDs by type:", typeMap);
}
main();
