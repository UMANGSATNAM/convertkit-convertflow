const fs = require('fs');
const path = require('path');

const snippetsDir = 'i:\\converflow app\\dev-theme-peri\\snippets';

let count = 0;

for (let i = 1; i <= 70; i++) {
  const filename = `card-v${i}.liquid`;
  const filepath = path.join(snippetsDir, filename);

  if (!fs.existsSync(filepath)) continue;

  let content = fs.readFileSync(filepath, 'utf8');
  const prefix = `cv${i}`;

  // Check if rating-box HTML is already in content
  if (content.includes(`${prefix}-rating-box`)) {
    continue;
  }

  const ratingHtml = `
      <div class="${prefix}-rating-box" style="display: flex; align-items: center; gap: 4px; margin: 4px 0 6px;">
        <span style="color: #F59E0B; font-size: 12px; letter-spacing: 1px;">★★★★★</span>
        <span style="font-size: 12px; font-weight: 700; color: #111827;">4.9</span>
        <span style="font-size: 11px; color: #6B7280;">(128)</span>
      </div>`;

  let updated = false;

  // Insert after all occurrences of class="${prefix}-title"
  // Match <a> or <div> titles
  const regex = new RegExp(`(<(a|div)[^>]*class="${prefix}-title"[^>]*>[\\s\\S]*?<\\/\\2>)`, 'g');

  if (regex.test(content)) {
    content = content.replace(regex, `$1\n${ratingHtml}`);
    fs.writeFileSync(filepath, content, 'utf8');
    count++;
    console.log(`Injected rating into card-v${i}.liquid`);
  } else {
    console.warn(`Could not match title in card-v${i}.liquid`);
  }
}

console.log(`Successfully injected ratings into ${count} card snippets!`);
