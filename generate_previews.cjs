const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, 'dev-theme-peri', 'sections');
const outputFile = path.join(__dirname, 'preview_niches.html');

// Pick footers to preview
const filesToPreview = [
  { name: 'Footer V01 - E-Commerce Classic', file: 'footer-v01.liquid' },
  { name: 'Footer V02 - Split Screen', file: 'footer-v02.liquid' },
  { name: 'Footer V03 - Trust Pillar', file: 'footer-v03.liquid' },
  { name: 'Footer V04 - Centered Brand Hub', file: 'footer-v04.liquid' },
  { name: 'Footer V05 - Social Heavy', file: 'footer-v05.liquid' },
  { name: 'Footer V06 - Tech SaaS', file: 'footer-v06.liquid' },
  { name: 'Footer V07 - Bento Box', file: 'footer-v07.liquid' },
  { name: 'Footer V08 - Mega Minimal', file: 'footer-v08.liquid' },
  { name: 'Footer V09 - Content / SEO', file: 'footer-v09.liquid' },
  { name: 'Footer V10 - Editorial', file: 'footer-v10.liquid' },
  { name: 'Footer V11 - App Showcase', file: 'footer-v11.liquid' },
  { name: 'Footer V12 - Eco Sustainable', file: 'footer-v12.liquid' },
  { name: 'Footer V13 - Dark Luxury', file: 'footer-v13.liquid' },
  { name: 'Footer V14 - Horizontal', file: 'footer-v14.liquid' },
  { name: 'Footer V15 - Support Centric', file: 'footer-v15.liquid' },
  { name: 'Footer V16 - Animated Marquee', file: 'footer-v16.liquid' },
  { name: 'Footer V17 - Modern Corporate', file: 'footer-v17.liquid' },
  { name: 'Footer V18 - Video BG', file: 'footer-v18.liquid' },
  { name: 'Footer V19 - Creative Studio', file: 'footer-v19.liquid' },
  { name: 'Footer V20 - Mega Menu', file: 'footer-v20.liquid' }
];

let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Footer Previews V01-V10</title>
  <style>
    body { margin: 0; padding: 0; font-family: sans-serif; background: #e5e5e5; }
    .niche-header { 
      background: #18181b; color: white; padding: 20px; 
      font-size: 24px; font-weight: bold; text-align: center;
      position: relative; z-index: 9999;
      margin-top: 50px;
    }
    .preview-container { 
      margin-bottom: 50px; 
      overflow: hidden; 
      position: relative; 
      background: #fff;
    }
  </style>
</head>
<body>
`;

for (const item of filesToPreview) {
  const filePath = path.join(sectionsDir, item.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove schema
    content = content.replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g, '');
    
    // Replace liquid variables with their defaults
    content = content.replace(/{{\s*section\.settings\.[a-zA-Z0-9_]+\s*\|\s*default:\s*'([^']+)'\s*}}/g, '$1');
    content = content.replace(/{{\s*section\.settings\.[a-zA-Z0-9_]+\s*\|\s*default:\s*"([^"]+)"\s*}}/g, '$1');
    
    // Any remaining liquid tags just strip them
    content = content.replace(/{%.*?%}/g, '');
    content = content.replace(/{{.*?}}/g, '');

    htmlContent += `
      <div class="niche-header">${item.name}</div>
      <div class="preview-container" id="${item.file.replace('.liquid', '')}">
        ${content}
      </div>
    `;
  } else {
    console.warn(`Warning: ${filePath} does not exist`);
  }
}

htmlContent += `
</body>
</html>
`;

fs.writeFileSync(outputFile, htmlContent);
console.log('Preview HTML generated at:', outputFile);
