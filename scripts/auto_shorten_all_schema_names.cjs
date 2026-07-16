const fs = require('fs');
const path = require('path');

const exactMap = {
  'VIP Appointment Booking (Luxury)': 'VIP Booking (Lux)',
  'Certification & Authority (Luxury)': 'Cert Badges (Lux)',
  'Compatibility Checker Electronics': 'Compatibility Check',
  'Craftsmanship Story (Luxury)': 'Craftsmanship (Lux)',
  'Dosage Calculator Supplements': 'Dosage Calculator',
  'Featured Collection Luxury': 'Featured Coll (Lux)',
  'Gift Packaging & Unboxing (Luxury)': 'Gift Packaging (Lux)',
  'Material Care Guide (Luxury)': 'Material Care (Lux)',
  'Luxury Product Showcase Grid': 'Luxury Showcase Grid',
  'Bundle Builder Electronics': 'Bundle Builder (Elec)',
  'Collection Banner (Luxury)': 'Collection Banner (Lux)',
  'Sustainability Badge Beauty': 'Sustainability Badges',
  'Luxury Trust & Value Props': 'Luxury Value Props',
  'Header Transparent Overlay': 'Header Overlay'
};

function shorten(str) {
  if (!str) return str;
  if (str.length <= 25) return str;
  if (exactMap[str]) return exactMap[str];
  // Intelligent truncation if not in exactMap
  let cleaned = str.replace(/\([^)]*\)/g, '').trim();
  if (cleaned.length <= 25 && cleaned.length > 0) return cleaned;
  return str.substring(0, 25).trim();
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== '.gemini') {
        processDir(full);
      }
    } else if (f.endsWith('.liquid')) {
      let content = fs.readFileSync(full, 'utf8');
      const match = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
      if (match) {
        try {
          const json = JSON.parse(match[1]);
          let updated = false;

          if (json.name && json.name.length > 25) {
            json.name = shorten(json.name);
            updated = true;
          }
          if (json.blocks && Array.isArray(json.blocks)) {
            for (const b of json.blocks) {
              if (b.name && b.name.length > 25) {
                b.name = shorten(b.name);
                updated = true;
              }
            }
          }
          if (json.presets && Array.isArray(json.presets)) {
            for (const p of json.presets) {
              if (p.name && p.name.length > 25) {
                p.name = shorten(p.name);
                updated = true;
              }
            }
          }

          if (updated) {
            const newJsonStr = JSON.stringify(json, null, 2);
            const newSchemaBlock = `{% schema %}\n${newJsonStr}\n{% endschema %}`;
            content = content.replace(/\{%\s*schema\s*%\}[\s\S]*?\{%\s*endschema\s*%\}/, newSchemaBlock);
            fs.writeFileSync(full, content, 'utf8');
            console.log('Fixed schema names in:', full);
          }
        } catch (e) {
          console.error('Failed to parse schema JSON in:', full, e.message);
        }
      }
    }
  }
}

processDir('app');
