import fs from 'fs';
import path from 'path';

const pdps = fs.readdirSync(path.join(process.cwd(), 'dev-theme-peri', 'sections'))
    .filter(f => f.startsWith('pdp-') && f.endsWith('.liquid'))
    .map(f => f.replace('.liquid', ''));

let content = '<div style="padding: 50px; background: #000; color: #0f0; font-family: monospace; text-align: center;"><h1>ALL 340 PDP PREVIEWS</h1><p>Scroll down to view every single PDP generated.</p></div>\n';

pdps.forEach(p => {
    content += `<div style="padding: 20px; background: #222; color: #fff; font-family: sans-serif; text-align: center; border-top: 5px solid #ff00ff; margin-top: 50px;"><h2>${p}</h2></div>\n{% section '${p}' %}\n`;
});

fs.writeFileSync(path.join(process.cwd(), 'dev-theme-peri', 'templates', 'page.all-pdps.liquid'), content);
console.log('Created page.all-pdps.liquid');
