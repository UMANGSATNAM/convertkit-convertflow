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
        // Check if there's any `== ... ?` or `!= ... ?` inside {{ }}
        if (line.includes('{{') && (line.includes('==') || line.includes('!=')) && line.includes('?')) {
          console.error(`Ternary violation in ${full}:${idx + 1} -> ${line.trim()}`);
          count++;
        }
      });
    }
  }
  return count;
}

const total = check('app');
if (total > 0) {
  console.error(`Found ${total} ternary violations inside {{ }}.`);
  process.exit(1);
} else {
  console.log('SUCCESS: All JS ternary operators inside {{ }} have been eliminated across the entire app directory!');
}
