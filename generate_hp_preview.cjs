const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, 'dev-theme-peri', 'sections');
const templatesDir = path.join(__dirname, 'dev-theme-peri', 'templates');
const outputFile = path.join(__dirname, 'preview-homepages.html');

// Mock images
const MOCK_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800&q=80',
  product: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80',
  ],
  lifestyle: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80',
  video: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80',
};

function getHPVersions() {
  // Find all index.hp-v*.json templates and group them
  const templateFiles = fs.readdirSync(templatesDir)
    .filter(f => f.match(/^index\.hp-v\d+\.json$/))
    .sort((a, b) => {
      const numA = parseInt(a.match(/v(\d+)/)[1]);
      const numB = parseInt(b.match(/v(\d+)/)[1]);
      return numA - numB;
    });

  const versions = {};

  for (const tf of templateFiles) {
    const versionMatch = tf.match(/hp-v(\d+)/);
    if (!versionMatch) continue;
    const vNum = parseInt(versionMatch[1]);

    try {
      const templateContent = JSON.parse(fs.readFileSync(path.join(templatesDir, tf), 'utf8'));
      if (templateContent.sections && templateContent.order) {
        const sectionTypes = templateContent.order.map(key => templateContent.sections[key]?.type).filter(Boolean);
        versions[vNum] = { file: tf, sectionTypes };
      }
    } catch (e) {
      // Skip invalid JSON
    }
  }

  return versions;
}

function processLiquid(content, sectionId, schemaDefaults) {
  // Replace section.settings
  content = content.replace(/{{\s*section\.settings\.([a-zA-Z0-9_]+)\s*}}/g, (match, key) => {
    return schemaDefaults[key] !== undefined ? schemaDefaults[key] : '';
  });

  // Replace section.id
  content = content.replace(/{{\s*section\.id\s*}}/g, sectionId);

  // Replace block loops with preset data
  // Simple: just expand block content with defaults
  content = content.replace(/{%\s*for\s+block\s+in\s+section\.blocks[^%]*%}([\s\S]*?){%\s*endfor\s*%}/g,
    (match, loopBody) => {
      // Replace block.settings with placeholder text
      let expanded = '';
      for (let i = 0; i < 3; i++) {
        let instance = loopBody;
        instance = instance.replace(/{{\s*block\.settings\.([a-zA-Z0-9_]+)\s*}}/g, (m, key) => {
          const defaults = {
            title: ['Quality Materials', 'Fast Shipping', 'Eco Friendly', 'Premium Design', 'APPAREL'][i % 5],
            text: 'Crafted with care and attention to every detail.',
            quote: ['Absolutely love this brand!', 'Best purchase I\'ve made all year.', 'Stunning quality, highly recommend.'][i % 3],
            author: ['Alex M.', 'Sarah J.', 'James T.'][i % 3],
            handle: ['@stylish_alex', '@sarah.vibes', '@james.cool'][i % 3],
            question: ['What materials do you use?', 'How fast is shipping?', 'What\'s your return policy?'][i % 3],
            answer: '<p>We ensure the highest quality standards across all our products.</p>',
            image: MOCK_IMAGES.product[i % 4],
            text_fallback: ['VOGUE', 'GQ', 'ELLE', 'WSJ'][i % 4],
            link: '#',
          };
          return defaults[key] || key;
        });
        instance = instance.replace(/{{\s*block\.shopify_attributes\s*}}/g, '');
        instance = instance.replace(/{{\s*forloop\.index\s*}}/g, String(i + 1));
        expanded += instance;
      }
      return expanded;
    }
  );

  // Replace collection/product loops
  content = content.replace(/{%\s*for\s+product\s+in\s+collection\.products[^%]*%}([\s\S]*?){%\s*endfor\s*%}/g,
    (match, loopBody) => {
      let expanded = '';
      for (let i = 0; i < 4; i++) {
        let instance = loopBody;
        instance = instance.replace(/{{\s*product\.title\s*}}/g, ['Noir Essence', 'Velvet Touch', 'Shadow Line', 'Crystal Edge'][i]);
        instance = instance.replace(/{{\s*product\.url\s*}}/g, '#');
        instance = instance.replace(/{{\s*product\.price\s*\|\s*money[^}]*}}/g, ['$49', '$79', '$125', '$95'][i]);
        instance = instance.replace(/{{\s*product\.featured_image\s*\|[^}]*}}/g, MOCK_IMAGES.product[i]);
        instance = instance.replace(/{{\s*product\.title\s*\|\s*escape\s*}}/g, 'Product');
        expanded += instance;
      }
      return expanded;
    }
  );

  // Replace placeholder_svg_tag with actual placeholder image
  content = content.replace(/{{\s*'([^']+)'\s*\|\s*placeholder_svg_tag[^}]*}}/g,
    (match, type) => `<div style="width:100%;height:100%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:14px;">${type}</div>`
  );

  // Handle remaining for loops with simple expansion
  content = content.replace(/{%\s*for\s+i\s+in\s+\(1\.\.(\d+)\)\s*%}([\s\S]*?){%\s*endfor\s*%}/g,
    (match, count, body) => {
      let expanded = '';
      for (let i = 1; i <= Math.min(parseInt(count), 6); i++) {
        let instance = body;
        instance = instance.replace(/{{\s*i\s*}}/g, String(i));
        instance = instance.replace(/{{\s*forloop\.index\s*}}/g, String(i));
        expanded += instance;
      }
      return expanded;
    }
  );

  // Replace image URLs
  content = content.replace(/{{\s*section\.settings\.image\s*\|\s*image_url[^}]*}}/g, MOCK_IMAGES.hero);
  content = content.replace(/{{\s*block\.settings\.image\s*\|\s*image_url[^}]*}}/g, MOCK_IMAGES.product[0]);
  content = content.replace(/{{\s*[^}]*image_url[^}]*}}/g, MOCK_IMAGES.product[0]);

  // Strip conditional blocks (keep the "if" branch content)
  content = content.replace(/{%\s*if\s+[^%]+%}([\s\S]*?)(?:{%\s*else\s*%}[\s\S]*?)?{%\s*endif\s*%}/g, '$1');
  content = content.replace(/{%\s*unless\s+[^%]+%}([\s\S]*?){%\s*endunless\s*%}/g, '$1');

  // Strip assign tags
  content = content.replace(/{%\s*assign\s+[^%]+%}/g, '');

  // Replace form tags with div
  content = content.replace(/{%\s*form\s+'([^']+)'[^%]*%}/g, '<div class="mock-form">');
  content = content.replace(/{%\s*endform\s*%}/g, '</div>');

  // Strip remaining Liquid tags
  content = content.replace(/{%[^%]+%}/g, '');

  // Clean remaining {{ }} tags
  content = content.replace(/{{[^}]+}}/g, '');

  return content;
}

function main() {
  const versions = getHPVersions();
  const versionNums = Object.keys(versions).map(Number).sort((a, b) => a - b);

  // Determine which versions have actual section files
  const allSectionFiles = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.liquid'));

  const validVersions = versionNums.filter(v => {
    const prefix = `hp${v}-`;
    return allSectionFiles.some(f => f.startsWith(prefix));
  });

  console.log(`Found ${validVersions.length} HP versions with section files: ${validVersions.join(', ')}`);

  // Design aesthetics per version (for the TOC)
  const aesthetics = {
    1: 'Original',      2: 'Variant A',      3: 'Variant B',      4: 'Variant C',
    5: 'Variant D',     6: 'Variant E',      19: 'V19 Style',     20: 'V20 Style',
    21: 'V21 Style',    22: 'V22 Style',     23: 'V23 Style',     24: 'V24 Style',
    25: 'V25 Style',    26: 'V26 Style',     27: 'V27 Style',     28: 'V28 Style',
    29: 'V29 Style',    30: 'V30 Style',     31: 'V31 Style',     32: 'V32 Style',
    33: 'V33 Style',    34: 'V34 Style',     35: 'V35 Style',     36: 'V36 Style',
    37: 'V37 Minimal',  38: 'V38 Style',
    39: 'Soft Aura / Glassmorphism',
    40: 'Swiss Typographic',
    41: 'Neobrutalism',
    42: 'Editorial Noir / Dark Luxe',
  };

  let navLinks = '';
  let sectionsHTML = '';

  for (const vNum of validVersions) {
    const prefix = `hp${vNum}-`;
    let vSectionFiles = allSectionFiles.filter(f => f.startsWith(prefix));

    // Sort according to index.hp-v*.json template order if available
    const templatePath = path.join(templatesDir, `index.hp-v${vNum}.json`);
    if (fs.existsSync(templatePath)) {
      try {
        const tObj = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
        if (tObj.order && tObj.sections) {
          const orderedTypes = tObj.order.map(k => tObj.sections[k]?.type).filter(Boolean);
          const orderedFiles = [];
          // Header & announcement first
          if (fs.existsSync(path.join(sectionsDir, `hp${vNum}-announcement.liquid`))) {
            orderedFiles.push(`hp${vNum}-announcement.liquid`);
          }
          if (fs.existsSync(path.join(sectionsDir, `hp${vNum}-header.liquid`))) {
            orderedFiles.push(`hp${vNum}-header.liquid`);
          }
          // Body sections from template order
          orderedTypes.forEach(t => {
            const fName = `${t}.liquid`;
            if (fs.existsSync(path.join(sectionsDir, fName)) && !orderedFiles.includes(fName)) {
              orderedFiles.push(fName);
            }
          });
          // Footer last
          if (fs.existsSync(path.join(sectionsDir, `hp${vNum}-footer.liquid`)) && !orderedFiles.includes(`hp${vNum}-footer.liquid`)) {
            orderedFiles.push(`hp${vNum}-footer.liquid`);
          }
          if (orderedFiles.length > 0) {
            vSectionFiles = orderedFiles;
          }
        }
      } catch (e) {}
    }

    if (vSectionFiles.length === 0) continue;


    const label = aesthetics[vNum] || `HP-v${vNum}`;
    navLinks += `<a href="#hp-v${vNum}" class="nav-pill">${vNum}</a>`;

    sectionsHTML += `
      <div class="version-block" id="hp-v${vNum}">
        <div class="version-header">
          <h2>HP-v${vNum} — ${label}</h2>
          <span class="section-count">${vSectionFiles.length} sections</span>
        </div>
    `;

    for (const sFile of vSectionFiles) {
      let content = fs.readFileSync(path.join(sectionsDir, sFile), 'utf8');
      const sectionId = `hp${vNum}_${sFile.replace('.liquid', '').replace(prefix, '')}`;
      const cleanName = sFile.replace('.liquid', '').toUpperCase();

      // Extract schema
      let schemaDefaults = {};
      const schemaMatch = content.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
      if (schemaMatch) {
        try {
          const schemaObj = JSON.parse(schemaMatch[1]);
          if (schemaObj.settings) {
            schemaObj.settings.forEach(s => {
              if (s.default !== undefined) schemaDefaults[s.id] = s.default;
            });
          }
        } catch (e) { /* skip */ }
        content = content.replace(schemaMatch[0], '');
      }

      // Extract <style> from {%- style -%} ... {%- endstyle -%}
      let styleContent = '';
      const styleMatch = content.match(/{%-?\s*style\s*-?%}([\s\S]*?){%-?\s*endstyle\s*-?%}/);
      if (styleMatch) {
        styleContent = styleMatch[1];
        content = content.replace(styleMatch[0], '');
      }

      // Process liquid
      styleContent = processLiquid(styleContent, sectionId, schemaDefaults);
      content = processLiquid(content, sectionId, schemaDefaults);

      // Extract <script> blocks and re-inject
      let scripts = '';
      content = content.replace(/<script>([\s\S]*?)<\/script>/g, (match, body) => {
        scripts += `<script>${body}</script>`;
        return '';
      });

      sectionsHTML += `
        <div class="section-card" id="${sectionId}">
          <div class="section-label">${cleanName}</div>
          <style>${styleContent}</style>
          <div id="shopify-section-${sectionId}">
            ${content}
          </div>
          ${scripts}
        </div>
      `;
    }

    sectionsHTML += `</div><!-- end version-block -->`;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Homepage Templates Preview — HP-v1 to HP-v${validVersions[validVersions.length - 1]}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
    background: #0e0e12;
    color: #e0e0e0;
  }

  .top-bar {
    position: sticky;
    top: 0;
    z-index: 99999;
    background: rgba(14,14,18,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 15px 20px;
  }

  .top-bar h1 {
    margin: 0 0 12px;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
  }

  .nav-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .nav-pill {
    display: inline-block;
    padding: 5px 14px;
    background: rgba(255,255,255,0.06);
    color: #aaa;
    font-size: 13px;
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.2s;
  }
  .nav-pill:hover {
    background: rgba(255,255,255,0.12);
    color: #fff;
  }

  .version-block {
    max-width: 1600px;
    margin: 60px auto;
    padding: 0 20px;
  }

  .version-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .version-header h2 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: #fff;
  }

  .section-count {
    font-size: 14px;
    color: #888;
  }

  .section-card {
    margin-bottom: 10px;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    position: relative;
  }

  .section-label {
    background: #1a1a22;
    color: #888;
    font-size: 12px;
    font-family: monospace;
    padding: 6px 16px;
    letter-spacing: 1px;
  }

  /* Reset for previewed sections */
  .section-card img { max-width: 100%; height: auto; display: block; }
  .section-card a { color: inherit; }
</style>
</head>
<body>

<div class="top-bar">
  <h1>🏠 Homepage Templates Preview (${validVersions.length} versions, ${validVersions.reduce((sum, v) => sum + allSectionFiles.filter(f => f.startsWith('hp' + v + '-')).length, 0)} total sections)</h1>
  <div class="nav-pills">
    ${navLinks}
  </div>
</div>

${sectionsHTML}

</body>
</html>`;

  fs.writeFileSync(outputFile, html, 'utf8');
  console.log(`✅ Generated preview-homepages.html with ${validVersions.length} HP versions!`);
  console.log(`   Open it in your browser: file:///${outputFile.replace(/\\/g, '/')}`);
}

main();
