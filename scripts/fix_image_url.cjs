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

      // Replace instances like:
      // | image_url crop: 'center' -> | image_url: crop: 'center'
      // | image_url width: 600 -> | image_url: width: 600
      // | image_url height: 400 -> | image_url: height: 400
      // | image_url 'master' -> | image_url
      // | image_url: 'master' -> | image_url
      // | image_url: '600x' -> | image_url: width: 600

      // 1. Fix old size strings like | image_url: '600x' or | image_url '600x'
      content = content.replace(/\|\s*image_url(:?\s*)['"](\d+)x['"]/g, '| image_url: width: $2');
      content = content.replace(/\|\s*image_url(:?\s*)['"]x(\d+)['"]/g, '| image_url: height: $2');
      content = content.replace(/\|\s*image_url(:?\s*)['"](\d+)x(\d+)['"]/g, '| image_url: width: $2, height: $3');
      content = content.replace(/\|\s*image_url(:?\s*)['"]master['"]/g, '| image_url');

      // 2. Fix missing colon before named arguments (width:, height:, crop:, format:)
      // e.g. | image_url crop: 'center' -> | image_url: crop: 'center'
      content = content.replace(/\|\s*image_url\s+(width:|height:|crop:|format:)/g, '| image_url: $1');

      if (content !== original) {
        fs.writeFileSync(full, content, 'utf8');
        console.log('Fixed malformed image_url calls in:', full);
        fixedCount++;
      }
    }
  }
  return fixedCount;
}

const total = fixDir('app');
console.log(`Total files fixed: ${total}`);
