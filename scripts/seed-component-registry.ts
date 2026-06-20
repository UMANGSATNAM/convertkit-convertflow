import fs from 'fs';
import path from 'path';

const SECTIONS_DIR = path.join(process.cwd(), 'theme-template', 'sections');
const METADATA_DIR = path.join(process.cwd(), 'theme-template', 'metadata');

const PRIORITY_SECTIONS: string[] = []; // Not needed anymore, all are published

function walkDir(dir: string, callback: (filePath: string) => void) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.liquid')) {
      callback(dirPath);
    }
  });
}

function getCategoryFromPath(filePath: string): string {
  const relPath = path.relative(SECTIONS_DIR, filePath);
  const parts = relPath.split(path.sep);
  if (parts.length > 1) {
    return parts[0];
  }
  // Fallback heuristics
  const name = path.basename(filePath, '.liquid');
  if (name.startsWith('header') || name.startsWith('footer')) return 'headers-footers';
  if (name.startsWith('hero') || name.startsWith('banner')) return 'heroes';
  if (name.includes('grid') || name.includes('collection')) return 'product-grids';
  if (name.startsWith('trust') || name.startsWith('features')) return 'trust';
  if (name.startsWith('content')) return 'content';
  return 'general';
}

async function main() {
  if (!fs.existsSync(METADATA_DIR)) {
    fs.mkdirSync(METADATA_DIR, { recursive: true });
  }

  const allSections: string[] = [];
  walkDir(SECTIONS_DIR, (filePath) => {
    allSections.push(filePath);
  });

  let publishedCount = 0;
  let draftCount = 0;

  for (const filePath of allSections) {
    const fileName = path.basename(filePath);
    const category = getCategoryFromPath(filePath);
    const baseName = path.basename(filePath, '.liquid');
    
    const status = 'PUBLISHED';

    publishedCount++;

    const metadata = {
      id: baseName,
      name: baseName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      file_name: fileName,
      category: category,
      status: status,
      schema_type: "section",
      supported_presets: ["dark-luxury", "ivory-minimal", "bold-editorial", "warm-premium", "clean-modern", "earthy-organic"]
    };

    const metaPath = path.join(METADATA_DIR, `${baseName}.json`);
    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2), 'utf-8');
  }

  // Also create a master registry JSON just in case the engine wants to load it all at once
  const masterRegistryPath = path.join(METADATA_DIR, '_component_registry.json');
  const masterRegistry = allSections.map(filePath => {
    const fileName = path.basename(filePath);
    return {
      id: path.basename(filePath, '.liquid'),
      file_name: fileName,
      status: 'PUBLISHED'
    };
  });

  fs.writeFileSync(masterRegistryPath, JSON.stringify({ components: masterRegistry }, null, 2), 'utf-8');

  console.log(`✅ Seeded Component Registry successfully.`);
  console.log(`📊 Published (Priority): ${publishedCount}`);
  console.log(`📊 Drafts: ${draftCount}`);
  console.log(`Total: ${publishedCount + draftCount}`);
}

main().catch(console.error);
