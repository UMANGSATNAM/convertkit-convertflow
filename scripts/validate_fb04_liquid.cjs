const fs = require('fs');
const path = require('path');

const fbDir = path.join(__dirname, '..', 'app', 'data', 'templates', 'theme-engine', 'components', 'fb04-streetwear');
const files = fs.readdirSync(fbDir).filter(f => f.endsWith('.liquid'));

console.log(`Checking ${files.length} Liquid files in ${fbDir}...\n`);

let hasErrors = false;

files.forEach(file => {
  const filePath = path.join(fbDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Check Schema JSON parsing
  const match = content.match(/{% schema %}([\s\S]*?){% endschema %}/);
  if (!match) {
    console.error(`❌ ${file}: Missing {% schema %} tag!`);
    hasErrors = true;
  } else {
    try {
      JSON.parse(match[1]);
      console.log(`  ✓ ${file}: Schema JSON is valid.`);
    } catch (e) {
      console.error(`❌ ${file}: Schema JSON Syntax Error!`, e.message);
      hasErrors = true;
    }
  }

  // 2. Check for unmatched liquid tags (if/endif, for/endfor)
  const ifCount = (content.match(/{%-?\s*if\b/g) || []).length;
  const endifCount = (content.match(/{%-?\s*endif\b/g) || []).length;
  if (ifCount !== endifCount) {
    console.error(`❌ ${file}: Unmatched if/endif! (${ifCount} if vs ${endifCount} endif)`);
    hasErrors = true;
  }

  const forCount = (content.match(/{%-?\s*for\b/g) || []).length;
  const endforCount = (content.match(/{%-?\s*endfor\b/g) || []).length;
  if (forCount !== endforCount) {
    console.error(`❌ ${file}: Unmatched for/endfor! (${forCount} for vs ${endforCount} endfor)`);
    hasErrors = true;
  }
});

if (!hasErrors) {
  console.log('\n🎉 ALL 13 LIQUID FILES HAVE VALID JSON SCHEMAS & MATCHED LIQUID TAGS!');
}
