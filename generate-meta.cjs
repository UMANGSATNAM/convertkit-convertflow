const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, 'app/data/templates/theme-engine/component-registry/registry.json');
const registryStr = fs.readFileSync(registryPath, 'utf8');

// Parse string using Function to allow comments
const registry = new Function('return ' + registryStr)();

let count = 0;

for (const comp of registry.components) {
  // Extract all properties except liquidPath and metaPath
  const { liquidPath, metaPath, ...metaData } = comp;
  
  // Construct the absolute path for the meta file
  const absoluteMetaPath = path.join(__dirname, 'app/data/templates/theme-engine', metaPath);
  
  // Write the file
  fs.writeFileSync(absoluteMetaPath, JSON.stringify(metaData, null, 2), 'utf8');
  count++;
}

console.log(`Successfully generated ${count} .meta.json sidecar files.`);
