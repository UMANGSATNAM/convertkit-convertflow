const fs = require('fs');
const path = require('path');

const themeDir = 'i:\\converflow app\\dev-theme-peri';
let count = 0;

function cleanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') cleanDir(fullPath);
    } else if (f.endsWith('.json')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.trim().startsWith('/*')) {
        // Remove leading block comment
        content = content.replace(/^\/\*[\s\S]*?\*\/\s*/, '');
        fs.writeFileSync(fullPath, content, 'utf8');
        count++;
        console.log(`Cleaned comment header from: ${fullPath}`);
      }
    }
  }
}

cleanDir(themeDir);
console.log(`Cleaned comment headers from ${count} JSON files!`);
