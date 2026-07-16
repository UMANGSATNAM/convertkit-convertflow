const fs = require('fs');
const path = require('path');

function fixDir(dir) {
  let fixedCount = 0;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== '.gemini') {
        fixedCount += fixDir(full);
      }
    } else if (f.endsWith('.liquid')) {
      let content = fs.readFileSync(full, 'utf8');
      let original = content;

      // Look for {{ condition ? trueVal : falseVal }}
      // We can replace lines or specific matches
      const lines = content.split('\n');
      const newLines = lines.map((line, idx) => {
        if (line.includes('{{') && line.includes('?') && line.includes(':')) {
          // Check if it's a JS ternary inside {{ ... }}
          // e.g. {{ section.settings.text_alignment == 'center' ? '0 auto 2.5rem auto' : '0 0 2.5rem 0' }}
          const match = line.match(/\{\{\s*([^{}?]+?)\s*\?\s*(['"][^'"]*['"]|[^:]+?)\s*:\s*(['"][^'"]*['"]|[^}]+?)\s*\}\}/);
          if (match) {
            const cond = match[1].trim();
            const trueVal = match[2].trim().replace(/^['"]|['"]$/g, '');
            const falseVal = match[3].trim().replace(/^['"]|['"]$/g, '');
            const replacement = `{% if ${cond} %}${trueVal}{% else %}${falseVal}{% endif %}`;
            console.log(`Fixing ternary at ${full}:${idx + 1}`);
            console.log(`  Old: ${match[0]}`);
            console.log(`  New: ${replacement}`);
            return line.replace(match[0], replacement);
          }
        }
        return line;
      });

      content = newLines.join('\n');
      if (content !== original) {
        fs.writeFileSync(full, content, 'utf8');
        fixedCount++;
      }
    }
  }
  return fixedCount;
}

const total = fixDir('app');
console.log(`Total files fixed for JS ternary inside {{ }}: ${total}`);
