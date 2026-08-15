const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, 'dev-theme-peri', 'sections');
const outputFile = path.join(__dirname, 'preview-elite.html');

const eliteFiles = [
  'pdp-ultra-1-apple.liquid',
  'pdp-ultra-2-dyson.liquid',
  'pdp-ultra-3-glossier.liquid',
  'pdp-ultra-4-nike.liquid',
  'pdp-ultra-5-rolex.liquid'
];

async function main() {
  let htmlOutput = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>1000Cr Elite PDP Previews</title>
  <style>
    body { margin: 0; padding: 0; font-family: sans-serif; background: #000; }
    .nav-bar { position: sticky; top: 0; z-index: 9999; background: #111; padding: 15px 30px; display: flex; justify-content: center; gap: 20px; border-bottom: 1px solid #333; }
    .nav-bar a { color: #fff; text-decoration: none; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; padding: 10px 20px; border: 1px solid #333; border-radius: 20px; transition: 0.3s; }
    .nav-bar a:hover { background: #fff; color: #000; }
    .section-separator { padding: 40px; background: #000; text-align: center; color: #666; text-transform: uppercase; letter-spacing: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="nav-bar">
    <a href="#pdp-ultra-1-apple">1. Apple (Minimalist)</a>
    <a href="#pdp-ultra-2-dyson">2. Dyson (Engineered)</a>
    <a href="#pdp-ultra-3-glossier">3. Glossier (Editorial)</a>
    <a href="#pdp-ultra-4-nike">4. Nike (Brutalist)</a>
    <a href="#pdp-ultra-5-rolex">5. Rolex (Heritage)</a>
  </div>
`;

  for (const filename of eliteFiles) {
    const filePath = path.join(sectionsDir, filename);
    if(!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove schema block
    content = content.replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g, '');
    
    // Extract default values from schema to use in CSS
    const schemaMatch = fs.readFileSync(filePath, 'utf8').match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
    let defaults = {};
    if (schemaMatch && schemaMatch[1]) {
      try {
        const schema = JSON.parse(schemaMatch[1]);
        if (schema.settings) {
          schema.settings.forEach(s => {
            if (s.id && s.default !== undefined) {
              defaults[s.id] = s.default;
            }
          });
        }
      } catch (e) {
        console.error(`Error parsing schema for ${filename}:`, e.message);
      }
    }

    // Replace settings variables with defaults
    content = content.replace(/{{[^\}]+section\.settings\.([a-zA-Z0-9_]+)[^\}]+default:\s*'([^']+)'[^\}]+}}/g, (match, key, def) => {
      return defaults[key] || def;
    });

    // We built the templates with a fallback specifically for when product == blank. 
    // In our local preview, we'll force the fallback to render by removing the if p == blank logic
    // and ONLY keeping the contents of the if p == blank block.
    
    // Find the blocks
    const fallbackRegex = /{%-\s*if\s*p\s*==\s*blank\s*-%}([\s\S]*?){%-\s*else\s*-%}/;
    const fallbackMatch = content.match(fallbackRegex);
    
    if (fallbackMatch && fallbackMatch[1]) {
       // Extract just the CSS/Styles at top and the fallback mock
       const styleRegex = /(<link[^>]+>[\s\S]*?{% style %}[\s\S]*?{% endstyle %})/;
       const styleMatch = content.match(styleRegex);
       
       const sectionId = filename.replace('.liquid', '');
       let finalSectionHtml = `\n<div id="${sectionId}" class="section-separator">-- ${sectionId} --</div>\n`;
       
       if (styleMatch) {
         let styles = styleMatch[1].replace(/{% style %}/g, '<style>').replace(/{% endstyle %}/g, '</style>');
         styles = styles.replace(/{{ section\.id }}/g, sectionId);
         finalSectionHtml += styles;
       }
       
       // Wrap the fallback match in the outer div
       let fallbackHtml = fallbackMatch[1].replace(/{{ section\.id }}/g, sectionId);
       
       // Re-construct the outer div because the regex chops it out
       // Actually wait, looking at the code, the {% if p == blank %} is INSIDE the <div class="sf-ultra-...">
       // So we need to match the outer div and inject the fallback HTML into it.
       
       const outerDivMatch = content.match(/(<div class="sf-ultra-[^>]+>[\s\S]*?<div class="sf-[^>]+container">)/);
       const outerEndMatch = content.match(/(<\/div>\s*<\/div>\s*<script>[\s\S]*?<\/script>)/);
       
       if (outerDivMatch) {
           let outerStart = outerDivMatch[1].replace(/{{ section\.id }}/g, sectionId);
           let scripts = "";
           // we don't need the liquid variants script for the dummy preview, it's mostly CSS/HTML showcase
           finalSectionHtml += outerStart + fallbackHtml + "</div></div>";
       } else {
           finalSectionHtml += fallbackHtml;
       }
       
       htmlOutput += finalSectionHtml;
    } else {
       console.log("No fallback found for", filename);
    }
  }

  htmlOutput += `
</body>
</html>`;

  fs.writeFileSync(outputFile, htmlOutput);
  console.log(`Successfully generated ${outputFile}`);
}

main();
