const fs = require('fs');
const path = require('path');

const sectionsDir = 'i:\\converflow app\\dev-theme-peri\\sections';
const files = fs.readdirSync(sectionsDir).filter(f => f.startsWith('pc-v') && f.endsWith('.liquid'));

let count = 0;

files.forEach(file => {
  const match = file.match(/^pc-v(\d+)\.liquid$/);
  if (!match) return;
  const num = match[1];
  const filePath = path.join(sectionsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match the fallback loop inside {% else %}
  const regex = new RegExp(`(\\{% else %\\}\\s*\\{% for i in \\(1\\.\\.limit_num\\) %\\}\\s*)<div class="pcv${num}__card">[\\s\\S]*?\\{% endfor %\\}`, 'g');
  
  if (regex.test(content)) {
    const replacement = `{% else %}\n        {% for i in (1..limit_num) %}\n          {% render 'card-v${num}', product: nil %}\n        {% endfor %}`;
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Total sections updated: ${count}`);
