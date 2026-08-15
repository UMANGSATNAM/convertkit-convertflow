const fs = require('fs');
const path = require('path');

const niches = {
  artisan: { primary: '#8b5a2b', bg: '#fdfbf7', text: '#3e2723' },
  auto: { primary: '#d32f2f', bg: '#1c1c1c', text: '#f5f5f5' },
  beauty: { primary: '#e91e63', bg: '#fff0f5', text: '#4a148c' },
  coffee: { primary: '#5d4037', bg: '#efebe9', text: '#3e2723' },
  eco: { primary: '#2e7d32', bg: '#f1f8e9', text: '#1b5e20' },
  fashion: { primary: '#000000', bg: '#ffffff', text: '#212121' },
  fitness: { primary: '#ff6d00', bg: '#212121', text: '#fafafa' },
  fmcg: { primary: '#1976d2', bg: '#ffffff', text: '#0d47a1' },
  gaming: { primary: '#6200ea', bg: '#121212', text: '#e0e0e0' },
  health: { primary: '#009688', bg: '#e0f2f1', text: '#004d40' },
  home: { primary: '#795548', bg: '#f5f5f5', text: '#3e2723' },
  homedecor: { primary: '#fbc02d', bg: '#fffde7', text: '#212121' },
  jewelry: { primary: '#cda434', bg: '#000000', text: '#ffffff' },
  kids: { primary: '#ffeb3b', bg: '#e3f2fd', text: '#0277bd' },
  pet: { primary: '#ff9800', bg: '#fff8e1', text: '#bf360c' },
  pets: { primary: '#ff9800', bg: '#fff8e1', text: '#bf360c' },
  tech: { primary: '#00bcd4', bg: '#263238', text: '#eceff1' }
};

const inputDir = path.join(__dirname, 'extensions', 'sf-sections', 'blocks');
const outputDir = path.join(__dirname, 'dev-theme-peri', 'sections');

async function main() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const baseFiles = [];
  for (let i = 1; i <= 20; i++) {
    const filePath = path.join(inputDir, `product-${i}.liquid`);
    if (fs.existsSync(filePath)) {
      baseFiles.push({ variant: i, content: fs.readFileSync(filePath, 'utf8') });
    }
  }

  let generatedCount = 0;

  for (const [niche, colors] of Object.entries(niches)) {
    for (const base of baseFiles) {
      let liquidContent = base.content;
      const schemaMatch = liquidContent.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
      
      if (schemaMatch) {
        let schemaStr = schemaMatch[1];
        try {
          const schemaObj = JSON.parse(schemaStr);
          
          const sectionName = `PDP ${niche.charAt(0).toUpperCase() + niche.slice(1)} V${base.variant}`;
          
          // Modify schema
          schemaObj.name = sectionName;
          delete schemaObj.target;
          schemaObj.presets = [{ name: sectionName }];
          
          // Modify colors in schema defaults
          if (schemaObj.settings) {
            schemaObj.settings.forEach(setting => {
              if (setting.type === 'color') {
                if (setting.id === 'primary_color') setting.default = colors.primary;
                if (setting.id === 'bg_color') setting.default = colors.bg;
                if (setting.id === 'text_color' || setting.id === 'heading_color') setting.default = colors.text;
              }
            });
          }

          const newSchemaStr = `{% schema %}\n${JSON.stringify(schemaObj, null, 2)}\n{% endschema %}`;
          liquidContent = liquidContent.replace(schemaMatch[0], newSchemaStr);
          
        } catch (e) {
          console.error(`Error parsing schema for variant ${base.variant}:`, e);
        }
      }

      const outPath = path.join(outputDir, `pdp-${niche}-v${base.variant}.liquid`);
      fs.writeFileSync(outPath, liquidContent, 'utf8');
      generatedCount++;
    }
  }

  console.log(`Successfully generated ${generatedCount} PDP files.`);
}

main().catch(console.error);
