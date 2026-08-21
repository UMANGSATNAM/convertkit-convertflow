const fs = require('fs');
const html = fs.readFileSync('preview-homepages.html', 'utf8');

const target = 'id="hp-v51"';
const idx = html.indexOf(target, 5000); // Search after nav links
console.log('hp-v51 section block index:', idx);

if (idx !== -1) {
  console.log('Snippet of HP51 content in preview-homepages.html:\n');
  console.log(html.substring(idx - 50, idx + 1500));
}
