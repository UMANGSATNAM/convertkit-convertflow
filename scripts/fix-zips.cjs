const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const themesDir = path.join(__dirname, '..', 'public', 'themes');
const tempDir = path.join(require('os').tmpdir(), 'theme-repack');

// Delete temp dir if exists
try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
fs.mkdirSync(tempDir, { recursive: true });

const themes = [
  'luxe-fashion-theme-v1.zip',
  'velocity-streetwear-theme-v1.zip',
  'asian-footwears-shopify-theme-v3.zip'
];

for (const theme of themes) {
  const zipPath = path.join(themesDir, theme);
  const outDir = path.join(tempDir, theme.replace('.zip', ''));
  fs.mkdirSync(outDir, { recursive: true });
  
  console.log(`Extracting ${theme}...`);
  try {
    execSync(`tar -xf "${zipPath}" -C "${outDir}"`);
  } catch (err) {
    console.error(`Failed to extract ${theme}`);
    continue;
  }
  
  // Find any directory starting with "{" and delete it
  const items = fs.readdirSync(outDir);
  for (const item of items) {
    if (item.startsWith('{')) {
      console.log(`Removing typo folder: ${item}`);
      fs.rmSync(path.join(outDir, item), { recursive: true, force: true });
    }
  }

  // Create a clean archive using tar inside the cleaned directory
  console.log(`Archiving clean ${theme}...`);
  const finalZipPath = path.join(themesDir, theme.replace('-v3', '-v4').replace('-v1', '-v2'));
  try {
    // Windows tar creates zip using -a flag
    execSync(`tar -a -c -f "${finalZipPath}" *`, { cwd: outDir });
    console.log(`Successfully created ${finalZipPath}\n`);
  } catch (err) {
    console.error(`Failed to archive ${theme}`);
  }
}
