const fs = require('fs');
const path = require('path');

const snippetsDir = 'i:\\converflow app\\dev-theme-peri\\snippets';

for (let i = 1; i <= 70; i++) {
  const filename = `card-v${i}.liquid`;
  const filepath = path.join(snippetsDir, filename);

  if (!fs.existsSync(filepath)) continue;

  let content = fs.readFileSync(filepath, 'utf8');

  // Check if rating already exists in this snippet
  if (content.includes('rating') || content.includes('★') || content.includes('star')) {
    console.log(`card-v${i}.liquid already has rating`);
    continue;
  }

  const prefix = `cv${i}`;

  const ratingHtml = `
      <!-- Star Rating Row -->
      <div class="${prefix}-rating" style="display: flex; align-items: center; gap: 4px; margin: 4px 0 6px;">
        <span style="color: #F59E0B; font-size: 12px; letter-spacing: 1px;">★★★★★</span>
        <span style="font-size: 12px; font-weight: 700; color: #111827;">4.9</span>
        <span style="font-size: 11px; color: #6B7280;">(128)</span>
      </div>`;

  // Insert after title links or title divs
  const titleRegex = new RegExp(`(<a href="[^"]*" class="${prefix}-title"[^>]*>[\\s\\S]*?<\\/a>|<div class="${prefix}-title"[^>]*>[\\s\\S]*?<\\/div>)`, 'g');

  if (titleRegex.test(content)) {
    content = content.replace(titleRegex, `$1\n${ratingHtml}`);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Added rating to card-v${i}.liquid`);
  } else {
    console.log(`Could not find title pattern in card-v${i}.liquid`);
  }
}

console.log('Finished adding ratings to all card snippets!');
