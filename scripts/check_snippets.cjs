const fs = require('fs');
const path = require('path');

const engineDir = path.join(__dirname, '../app/data/templates/theme-engine');
const baseDir = path.join(engineDir, 'base-theme');
const registry = JSON.parse(fs.readFileSync(path.join(engineDir, 'registry.json'), 'utf8'));
const regMap = new Map((registry.components || registry).map(c => [c.componentId, c.liquidPath]));

const compSrc = fs.readFileSync(path.join(__dirname, '../app/data/page-compositions.ts'), 'utf8');
const idRegex = /componentId:\s*["']([^"']+)["']/g;
const headerRegex = /header:\s*["']([^"']+)["']/g;
const footerRegex = /footer:\s*["']([^"']+)["']/g;

const allUsed = new Set();
let match;
while ((match = idRegex.exec(compSrc)) !== null) allUsed.add(match[1]);
while ((match = headerRegex.exec(compSrc)) !== null) allUsed.add(match[1]);
while ((match = footerRegex.exec(compSrc)) !== null) allUsed.add(match[1]);

console.log('Testing all', allUsed.size, 'components for missing snippets and assets...');

const missingSnippets = new Set();
const missingAssets = new Set();

for (const compId of allUsed) {
  const relPath = regMap.get(compId);
  if (!relPath) continue;
  const fullPath = path.join(engineDir, relPath);
  if (!fs.existsSync(fullPath)) continue;

  const content = fs.readFileSync(fullPath, 'utf8');
  
  // Check snippet renders
  const renderMatches = [...content.matchAll(/\{%-?\s*(?:render|include)\s+'([^']+)'/g)];
  for (const rm of renderMatches) {
    const snipName = rm[1];
    const snipPath = path.join(baseDir, 'snippets', `${snipName}.liquid`);
    if (!fs.existsSync(snipPath)) {
      missingSnippets.add(`${compId} -> snippets/${snipName}.liquid`);
    }
  }

  // Check assets
  const assetMatches = [...content.matchAll(/'([A-Za-z0-9_.\-]+\.(?:js|css|svg|png|jpg|woff2?))'\s*\|\s*asset_url/g)];
  for (const am of assetMatches) {
    const assetName = am[1];
    const assetPath = path.join(baseDir, 'assets', assetName);
    if (!fs.existsSync(assetPath)) {
      missingAssets.add(`${compId} -> assets/${assetName}`);
    }
  }
}

console.log('Missing Snippets count:', missingSnippets.size);
if (missingSnippets.size > 0) {
  console.log(Array.from(missingSnippets));
}

console.log('Missing Assets count:', missingAssets.size);
if (missingAssets.size > 0) {
  console.log(Array.from(missingAssets));
}
