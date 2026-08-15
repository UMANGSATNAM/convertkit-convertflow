const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'dev-theme-peri', 'sections');
const files = fs.readdirSync(dir).filter(f => f.startsWith('offer-v') && f.endsWith('.liquid'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/"name":\s*"Offer V(\d+): ([^"]+)"/g, (match, p1, p2) => {
    let cleanName = p2.split(':')[0].trim();
    if (cleanName.length > 12) {
      cleanName = cleanName.substring(0, 12).trim();
    }
    const finalName = `Offer V${p1}: ${cleanName}`;
    console.log(`Original: ${match} => Final (${finalName.length} chars): "${finalName}"`);
    return `"name": "${finalName}"`;
  });
  
  fs.writeFileSync(filePath, content);
});

console.log("All schema section names successfully shortened!");
