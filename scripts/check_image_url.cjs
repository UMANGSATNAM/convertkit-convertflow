const fs = require('fs');
const path = require('path');

function check(dir) {
  let count = 0;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== '.gemini') {
        count += check(full);
      }
    } else if (f.endsWith('.liquid')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('image_url')) {
          // Check if it has `image_url ` instead of `image_url:` or `image_url: width:` etc.
          if (line.match(/\|\s*image_url(\s+[^:]|\s*$)/) || line.includes('image_url crop:') || line.includes('image_url width:') || line.includes("image_url '")) {
            console.log(`${full}:${idx + 1} -> ${line.trim()}`);
            count++;
          }
        }
      });
    }
  }
  return count;
}

const total = check('app');
console.log(`Total malformed image_url occurrences found: ${total}`);
