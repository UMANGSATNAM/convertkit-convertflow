import * as fs from 'fs/promises';
import * as path from 'path';

const BASE = path.join(process.cwd(), 'app/data/templates/theme-engine/base-theme');
const COMP = path.join(process.cwd(), 'app/data/templates/theme-engine/components');

async function processDir(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDir(fullPath);
    } else if (fullPath.endsWith('.liquid')) {
      let content = await fs.readFile(fullPath, 'utf-8');
      let changed = false;

      // Replace generic color: var(--surface); with color: #ffffff;
      if (content.includes('color: var(--surface);')) {
        content = content.replace(/color:\s*var\(--surface\);/g, 'color: #ffffff;');
        changed = true;
      }
      // Replace cod-badge special case
      if (content.includes('color: var(--color-background, var(--surface));')) {
        content = content.replace(/color:\s*var\(--color-background,\s*var\(--surface\)\);/g, 'color: #ffffff;');
        changed = true;
      }
      // Replace announcement bar default
      if (content.includes("default: 'var(--surface)'")) {
        content = content.replace(/default:\s*'var\(--surface\)'/g, "default: '#ffffff'");
        changed = true;
      }

      if (changed) {
        await fs.writeFile(fullPath, content);
        console.log(`Fixed text color in ${fullPath}`);
      }
    }
  }
}

async function main() {
  await processDir(BASE);
  await processDir(COMP);
  console.log("Text color fix complete.");
}

main().catch(console.error);
