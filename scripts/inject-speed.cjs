const fs = require('fs');
const path = require('path');

const SECTIONS_DIR = path.join(__dirname, '../theme-template/sections');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.liquid')) {
      callback(dirPath);
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const isHero = path.basename(filePath).includes('hero');
  let originalContent = content;

  // Find all <img ...> tags
  content = content.replace(/<img\s([^>]+)>/gi, (match, attrs) => {
    // Check if it already has loading or fetchpriority
    let newAttrs = attrs;
    if (isHero) {
      if (!/fetchpriority=/i.test(newAttrs)) {
        newAttrs += ' fetchpriority="high"';
      }
    } else {
      if (!/loading=/i.test(newAttrs)) {
        newAttrs += ' loading="lazy"';
      }
    }
    return `<img ${newAttrs.trim()}>`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`🚀 Injected speed optimizations into ${path.basename(filePath)}`);
  }
}

function run() {
  walkDir(SECTIONS_DIR, processFile);
  console.log('Speed injection complete.');
}

run();
