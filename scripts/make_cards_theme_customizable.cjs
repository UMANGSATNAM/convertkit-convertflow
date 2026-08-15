const fs = require('fs');
const path = require('path');

const sectionsDir = 'i:\\converflow app\\dev-theme-peri\\sections';
const snippetsDir = 'i:\\converflow app\\dev-theme-peri\\snippets';

console.log('🚀 Updating all 70 Product Grid sections and Card snippets for full Shopify Theme Customizer control...');

for (let i = 1; i <= 70; i++) {
  const secFile = `pc-v${i}.liquid`;
  const snipFile = `card-v${i}.liquid`;
  const secPath = path.join(sectionsDir, secFile);
  const snipPath = path.join(snippetsDir, snipFile);

  // 1. UPDATE SECTION SCHEMA & RENDER TAGS
  if (fs.existsSync(secPath)) {
    let secContent = fs.readFileSync(secPath, 'utf8');

    // Add rating_value and rating_count to schema if missing
    const schemaMatch = secContent.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
    if (schemaMatch) {
      try {
        const json = JSON.parse(schemaMatch[1]);
        let updatedSchema = false;

        // Ensure settings array exists
        json.settings = json.settings || [];

        // Check if rating_value setting exists
        const hasRatingVal = json.settings.some(s => s.id === 'rating_value');
        if (!hasRatingVal) {
          json.settings.push({
            type: 'text',
            id: 'rating_value',
            label: 'Rating Value (e.g. 4.9)',
            default: '4.9'
          });
          updatedSchema = true;
        }

        const hasRatingCnt = json.settings.some(s => s.id === 'rating_count');
        if (!hasRatingCnt) {
          json.settings.push({
            type: 'text',
            id: 'rating_count',
            label: 'Rating Count (e.g. 128)',
            default: '128'
          });
          updatedSchema = true;
        }

        const hasShowRating = json.settings.some(s => s.id === 'show_rating');
        if (!hasShowRating) {
          json.settings.push({
            type: 'checkbox',
            id: 'show_rating',
            label: 'Show star rating',
            default: true
          });
          updatedSchema = true;
        }

        if (updatedSchema) {
          const newSchemaStr = JSON.stringify(json, null, 2);
          secContent = secContent.replace(/\{%\s*schema\s*%\}[\s\S]*?\{%\s*endschema\s*%\}/, `{% schema %}\n${newSchemaStr}\n{% endschema %}`);
        }
      } catch (e) {
        console.error(`Error parsing schema in ${secFile}:`, e.message);
      }
    }

    // Replace render tags to pass customizer settings into snippet
    const renderRegex1 = new RegExp(`\\{% render 'card-v${i}', product: product %\\}`, 'g');
    const renderRegex2 = new RegExp(`\\{% render 'card-v${i}', product: nil %\\}`, 'g');

    const renderReplacement1 = `{% render 'card-v${i}', product: product, show_rating: section.settings.show_rating, rating_value: section.settings.rating_value, rating_count: section.settings.rating_count %}`;
    const renderReplacement2 = `{% render 'card-v${i}', product: nil, show_rating: section.settings.show_rating, rating_value: section.settings.rating_value, rating_count: section.settings.rating_count %}`;

    secContent = secContent.replace(renderRegex1, renderReplacement1).replace(renderRegex2, renderReplacement2);

    fs.writeFileSync(secPath, secContent, 'utf8');
  }

  // 2. UPDATE CARD SNIPPET TO USE DYNAMIC SETTINGS
  if (fs.existsSync(snipPath)) {
    let snipContent = fs.readFileSync(snipPath, 'utf8');
    const prefix = `cv${i}`;

    // Add top Liquid variable assignments at the beginning of snippet if not present
    if (!snipContent.includes('r_val')) {
      const topAssigns = `{% assign card_r_show = show_rating %}\n{% if card_r_show == nil %}{% assign card_r_show = true %}{% endif %}\n{% assign card_r_val = rating_value | default: card_prod.metafields.reviews.rating.value | default: '4.9' %}\n{% assign card_r_cnt = rating_count | default: card_prod.metafields.reviews.rating_count.value | default: '128' %}\n`;
      snipContent = topAssigns + snipContent;
    }

    // Replace rating box HTML to use Liquid variables card_r_show, card_r_val, card_r_cnt
    const oldRatingRegex = new RegExp(`<div class="${prefix}-rating-box"[^>]*>[\\s\\S]*?<\\/div>`, 'g');
    
    const dynamicRatingHtml = `{% if card_r_show != false %}
      <div class="${prefix}-rating-box" style="display: flex; align-items: center; gap: 4px; margin: 4px 0 6px;">
        <span style="color: #F59E0B; font-size: 12px; letter-spacing: 1px;">★★★★★</span>
        <span style="font-size: 12px; font-weight: 700; color: #111827;">{{ card_r_val }}</span>
        <span style="font-size: 11px; color: #6B7280;">({{ card_r_cnt }})</span>
      </div>
    {% endif %}`;

    if (oldRatingRegex.test(snipContent)) {
      snipContent = snipContent.replace(oldRatingRegex, dynamicRatingHtml);
      fs.writeFileSync(snipPath, snipContent, 'utf8');
    }
  }
}

console.log('✅ All 70 sections and card snippets updated for Theme Customizer rating control!');
