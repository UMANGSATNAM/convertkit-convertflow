const fs = require('fs');
const path = require('path');

const files = ['app/services/ai/claude.server.ts', 'app/services/ai/assistant.server.ts', 'app/services/ai/vision.server.ts'];
for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/claude-3-haiku-20240307/g, 'claude-3-5-sonnet-20241022');
    fs.writeFileSync(file, content);
    console.log('Updated model string in ' + file);
  }
}

const seedPath = 'prisma/seed_components.ts';
if (fs.existsSync(seedPath)) {
  let seed = fs.readFileSync(seedPath, 'utf8');
  // replace liquidPath: "components/ with liquidPath: "theme-template/sections/
  seed = seed.replace(/liquidPath: "components\//g, 'liquidPath: "theme-template/sections/');
  fs.writeFileSync(seedPath, seed);
  console.log('Updated seed_components.ts paths');
}

// Copy components to theme-template/sections
const componentsDir = 'components';
const targetDir = 'theme-template/sections';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

if (fs.existsSync(componentsDir)) {
  const filesToCopy = fs.readdirSync(componentsDir).filter(f => f.endsWith('.liquid'));
  for (const file of filesToCopy) {
    const src = path.join(componentsDir, file);
    const dest = path.join(targetDir, file);
    fs.copyFileSync(src, dest);
  }
  console.log(`Copied ${filesToCopy.length} files to ${targetDir}`);
}
