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
          // Check if it has `image_url ` immediately followed by a letter/quote without colon
          if (line.match(/\|\s*image_url\s+[a-zA-Z'"]/)) {
            console.error(`Violation in ${full}:${idx + 1} -> ${line.trim()}`);
            count++;
          }
        }
      });
    }
  }
  return count;
}

const total = check('app');
if (total > 0) {
  console.error(`Found ${total} malformed image_url violations.`);
  process.exit(1);
} else {
  console.log('SUCCESS: All image_url filter calls across the entire app directory are properly formatted with colons!');
}
