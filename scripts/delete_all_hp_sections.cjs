const fs = require('fs');
const path = require('path');

const sectionsDir = 'i:\\converflow app\\dev-theme-peri\\sections';
const templatesDir = 'i:\\converflow app\\dev-theme-peri\\templates';

console.log('🗑️ Deleting all hp-v1 to hp-v100 sections and templates for a fresh clean slate...');

let deletedSections = 0;
let deletedTemplates = 0;

for (let i = 1; i <= 100; i++) {
  const secPath = path.join(sectionsDir, `hp-v${i}.liquid`);
  if (fs.existsSync(secPath)) {
    fs.unlinkSync(secPath);
    deletedSections++;
  }

  const tmplPath = path.join(templatesDir, `page.hp-v${i}.json`);
  if (fs.existsSync(tmplPath)) {
    fs.unlinkSync(tmplPath);
    deletedTemplates++;
  }
}

console.log(`\n=======================================================`);
console.log(`✅ CLEANUP SUCCESS! Deleted ${deletedSections} section files and ${deletedTemplates} template files.`);
console.log(`Ready for clean, hand-crafted batch-by-batch execution!`);
console.log(`=======================================================`);
