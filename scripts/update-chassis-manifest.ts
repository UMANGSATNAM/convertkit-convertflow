import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const baseDir = process.cwd();
const themeEngineDir = path.join(baseDir, 'app/data/templates/theme-engine');
const chassisManifestPath = path.join(themeEngineDir, 'base-theme/chassis-manifest.json');

function calculateHash(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Normalize line endings to avoid cross-platform hash mismatches
  const normalizedContent = content.replace(/\r\n/g, '\n');
  return crypto.createHash('sha256').update(normalizedContent).digest('hex');
}

function updateManifest() {
  if (!fs.existsSync(chassisManifestPath)) {
    console.error(`Manifest not found at ${chassisManifestPath}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(chassisManifestPath, 'utf-8'));
  const list = manifest.files || [];
  
  const updatedFiles = [];
  
  for (const item of list) {
    const filePathRel = typeof item === 'string' ? item : item.file;
    const fullPath = path.join(themeEngineDir, filePathRel);
    
    if (fs.existsSync(fullPath)) {
      const hash = calculateHash(fullPath);
      updatedFiles.push({
        file: filePathRel.replace(/\\/g, '/'),
        hash
      });
    } else {
      console.warn(`[Warning] File not found on disk, skipping: ${filePathRel}`);
    }
  }

  manifest.files = updatedFiles;
  
  fs.writeFileSync(chassisManifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`[Manifest] Successfully updated hashes for ${updatedFiles.length} chassis files.`);
}

updateManifest();
