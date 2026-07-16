import fs from 'fs';
import path from 'path';

const p = path.join(process.cwd(), 'app/data/templates/theme-engine/base-theme/chassis-manifest.json');
const manifest = JSON.parse(fs.readFileSync(p, 'utf8'));
manifest.files.push({ file: 'base-theme/templates/gift_card.liquid', hash: '' });
fs.writeFileSync(p, JSON.stringify(manifest, null, 2));
