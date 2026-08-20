const fs = require('fs');
const content = fs.readFileSync('preview-homepages.html', 'utf8');
const idx = content.indexOf('id="hp-v51"');
if (idx !== -1) {
  console.log(content.slice(idx, idx + 2000));
} else {
  console.log('hp-v51 block not found!');
}
