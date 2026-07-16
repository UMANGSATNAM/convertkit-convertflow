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
      const match = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
      if (match) {
        try {
          const json = JSON.parse(match[1]);
          if (json.name && json.name.length > 25) {
            console.error(`Violation in ${full} - Section name (${json.name.length} chars): "${json.name}"`);
            count++;
          }
          if (json.blocks && Array.isArray(json.blocks)) {
            for (const b of json.blocks) {
              if (b.name && b.name.length > 25) {
                console.error(`Violation in ${full} - Block name (${b.name.length} chars): "${b.name}"`);
                count++;
              }
            }
          }
          if (json.presets && Array.isArray(json.presets)) {
            for (const p of json.presets) {
              if (p.name && p.name.length > 25) {
                console.error(`Violation in ${full} - Preset name (${p.name.length} chars): "${p.name}"`);
                count++;
              }
            }
          }
        } catch (e) {}
      }
    }
  }
  return count;
}

const total = check('app');
if (total > 0) {
  console.error(`Found ${total} schema name violations (> 25 chars).`);
  process.exit(1);
} else {
  console.log('SUCCESS: All section names, block names, and preset names are <= 25 characters across the entire app directory!');
}
