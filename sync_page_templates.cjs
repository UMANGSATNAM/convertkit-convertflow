const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'dev-theme-peri', 'templates');

// Find all index.hp-v*.json files
const files = fs.readdirSync(templatesDir);
let count = 0;

files.forEach(file => {
  if (file.startsWith('index.hp-v') && file.endsWith('.json')) {
    const hpSuffix = file.replace('index.', ''); // e.g. hp-v43.json
    const pageFileName = `page.${hpSuffix}`;
    const indexPath = path.join(templatesDir, file);
    const pagePath = path.join(templatesDir, pageFileName);
    
    // Copy index template to page template so /pages/contact?view=hp-v{N} works natively
    const content = fs.readFileSync(indexPath, 'utf8');
    fs.writeFileSync(pagePath, content, 'utf8');
    count++;
  }
});

console.log(`Successfully synced ${count} page.hp-v*.json templates!`);
