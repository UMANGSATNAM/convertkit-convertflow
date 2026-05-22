const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/templatesHtml.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\\`/g, '`');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed escaped backticks in templatesHtml.js');
