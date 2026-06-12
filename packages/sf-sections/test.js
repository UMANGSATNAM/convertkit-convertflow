import fs from 'fs';
import path from 'path';

const sectionsDir = path.join(process.cwd(), 'sections');
let hasError = false;

function testSections() {
  if (!fs.existsSync(sectionsDir)) {
    console.log('No sections directory found.');
    return;
  }

  const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.liquid'));
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(sectionsDir, file), 'utf-8');
    const schemaMatch = content.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
    
    if (!schemaMatch) {
      console.error(`❌ [${file}] Missing {% schema %} tag.`);
      hasError = true;
      continue;
    }
    
    try {
      const parsed = JSON.parse(schemaMatch[1]);
      if (!parsed.name) {
         console.error(`❌ [${file}] Schema missing "name".`);
         hasError = true;
      } else {
         console.log(`✅ [${file}] Valid schema (${parsed.name}).`);
      }
    } catch (e) {
      console.error(`❌ [${file}] Invalid JSON in schema:`, e.message);
      hasError = true;
    }
  }

  if (hasError) {
    console.error('Section validation failed.');
    process.exit(1);
  } else {
    console.log('All sections valid.');
  }
}

testSections();
