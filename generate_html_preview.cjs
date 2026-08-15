const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, 'dev-theme-peri', 'sections');
const outputFile = path.join(__dirname, 'preview.html');

async function main() {
  const files = fs.readdirSync(sectionsDir).filter(f => f.startsWith('pdp-') && f.endsWith('.liquid'));
  
  if (files.length === 0) {
    console.error('No generated PDP files found in dev-theme-peri/sections.');
    return;
  }

  let htmlOutput = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>All 340 PDP Previews</title>
<style>
  body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; background: #f0f0f0; }
  .preview-header { background: #222; color: #fff; padding: 20px; text-align: center; margin-bottom: 50px; font-size: 24px; position: sticky; top: 0; z-index: 99999; border-bottom: 4px solid #4ade80; }
  .preview-container { background: #fff; margin: 0 auto 100px auto; max-width: 1400px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; position: relative; border: 1px solid #ddd; }
  .preview-title { background: #f8fafc; padding: 15px 20px; border-bottom: 1px solid #e2e8f0; font-weight: bold; font-size: 18px; color: #334155; }
  
  /* Fallback resets for the PDP blocks */
  img { max-width: 100%; height: auto; }
</style>
</head>
<body>
<div class="preview-header">340 Premium PDP Designs - Local Preview</div>
`;

  let index = 1;
  for (const file of files) {
    const filePath = path.join(sectionsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const sectionId = `preview_${index}`;

    // 1. Extract and Parse Schema for Defaults
    let schemaDefaults = {};
    const schemaMatch = content.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
    if (schemaMatch) {
      try {
        const schemaObj = JSON.parse(schemaMatch[1]);
        if (schemaObj.settings) {
          schemaObj.settings.forEach(setting => {
            if (setting.default !== undefined) {
              schemaDefaults[setting.id] = setting.default;
            }
          });
        }
      } catch (e) {
        console.error(`Error parsing schema in ${file}`);
      }
      // Remove schema from HTML
      content = content.replace(schemaMatch[0], '');
    }

    // 2. Replace Schema variables
    content = content.replace(/{{\s*section\.settings\.([a-zA-Z0-9_]+)\s*}}/g, (match, key) => {
      return schemaDefaults[key] !== undefined ? schemaDefaults[key] : '';
    });

    // 3. Replace section.id
    content = content.replace(/{{\s*section\.id\s*}}/g, sectionId);

    // 4. Replace Product variables
    const cleanFileName = file.replace('.liquid', '').toUpperCase();
    content = content.replace(/{{\s*product\.title\s*}}/g, `Premium ${cleanFileName}`);
    content = content.replace(/{{\s*product\.vendor\s*}}/g, 'Peri Beauty Brand');
    content = content.replace(/{{\s*product\.description\s*}}/g, '<p>This is a premium high-quality mock description generated for previewing purposes. It elegantly showcases the layout structure, typography, and spacing of this specific PDP design without needing to connect to a live Shopify store.</p><ul><li>Premium Quality</li><li>Ethically Sourced</li><li>Highly Durable</li></ul>');
    content = content.replace(/{{\s*product\.handle\s*}}/g, `mock-handle-${index}`);

    // Price replacements
    content = content.replace(/{{\s*current_variant\.price\s*\|\s*money\s*}}/g, '$49.99');
    content = content.replace(/{{\s*current_variant\.compare_at_price\s*\|\s*money\s*}}/g, '$79.99');
    content = content.replace(/{{\s*cart\.currency\.symbol\s*}}/g, '$');
    
    // Media Loops (Very hacky but effective for visual preview)
    const mockImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    
    // Replace the specific variant loop in the select
    content = content.replace(/{%\s*for\s*variant\s*in\s*product\.variants\s*%}([\s\S]*?){%\s*endfor\s*%}/, 
      `<option value="1">Small / Red - $49.99</option>
       <option value="2">Medium / Blue - $49.99</option>
       <option value="3">Large / Black - $49.99</option>`
    );
    
    // Replace the media gallery loop
    content = content.replace(/{%\s*for\s*media\s*in\s*product\.media\s*%}([\s\S]*?){%\s*endfor\s*%}/g, 
      (match, loopContent) => {
        return loopContent.replace(/{{\s*media\s*\|\s*image_url[^}]*}}/g, mockImage)
                          .replace(/{{\s*media\.preview_image\s*\|\s*image_url[^}]*}}/g, mockImage)
                          .replace(/{{\s*media\.preview_image\.alt[^}]*}}/g, 'Mock Image')
                          .repeat(4); // 4 images in gallery
      }
    );

    // Fallbacks for any remaining image filters if loops weren't perfect
    content = content.replace(/{{[^}]+image_url[^}]+}}/g, mockImage);

    // Strip remaining Liquid logic
    content = content.replace(/{%\s*if\s+current_variant\.available\s*%}(.*?){%\s*else\s*%}(.*?){%\s*endif\s*%}/gs, '$1');
    content = content.replace(/{%[^%]+%}/g, ''); // Strip remaining {% ... %} tags

    // Wrap in container
    htmlOutput += `
<div class="preview-container" id="${cleanFileName}">
  <div class="preview-title">#${index} - ${cleanFileName}</div>
  ${content}
</div>
`;
    
    index++;
  }

  htmlOutput += `
</body>
</html>
`;

  fs.writeFileSync(outputFile, htmlOutput, 'utf8');
  console.log(`Successfully generated preview.html containing ${files.length} PDPs!`);
}

main().catch(console.error);
