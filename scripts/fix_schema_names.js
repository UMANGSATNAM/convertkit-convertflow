const fs = require('fs');
const path = require('path');

const map = {
  'Bundle Builder Electronics': 'Bundle Builder (Elec)',
  'Collection Banner (Luxury)': 'Collection Banner (Lux)',
  'Sustainability Badge Beauty': 'Sustainability Badges',
  'Luxury Trust & Value Props': 'Luxury Value Props',
  'Header Transparent Overlay': 'Header Overlay'
};

function fixDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== '.gemini') {
        fixDir(full);
      }
    } else if (f.endsWith('.liquid')) {
      let content = fs.readFileSync(full, 'utf8');
      let changed = false;
      for (const [oldName, newName] of Object.entries(map)) {
        if (content.includes(`"name": "${oldName}"`) || content.includes(`"name":"${oldName}"`)) {
          content = content.replace(new RegExp(`"name"\\s*:\\s*"${oldName}"`, 'g'), `"name": "${newName}"`);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(full, content, 'utf8');
        console.log('Updated schema name in:', full);
      }
    }
  }
}

fixDir('app');
