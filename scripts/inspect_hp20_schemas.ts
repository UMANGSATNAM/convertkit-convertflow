import fs from 'fs';
import path from 'path';

const regPath = 'app/data/templates/theme-engine/registry.json';
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
const regMap = new Map(reg.components.map((c: any) => [c.componentId, c.liquidPath]));

const hp20List = [
  'hp20-hero', 'hp20-marquee', 'hp20-category-pills', 'hp20-category-tiles',
  'hp20-bestsellers', 'hp20-featured-collection', 'hp20-offer-banner',
  'hp20-brand-story', 'hp20-founder-note', 'hp20-bundle-offer',
  'hp20-press-logos', 'hp20-testimonials', 'hp20-ugc-reels', 'hp20-usp',
  'hp20-faq', 'hp20-newsletter', 'hp20-video-banner', 'hp20-instagram',
  'caratlane-footer'
];

console.log('=== INSPECTING HP20 BLOCK TYPES IN SCHEMAS ===');
for (const id of hp20List) {
  const rel = regMap.get(id);
  if (!rel) continue;
  const full = path.join('app/data/templates/theme-engine', rel);
  if (!fs.existsSync(full)) continue;
  const content = fs.readFileSync(full, 'utf8');
  const m = content.match(/{% schema %}([\s\S]*?){% endschema %}/);
  if (m) {
    try {
      const parsed = JSON.parse(m[1]);
      const allowedBlocks = (parsed.blocks || []).map((b: any) => b.type);
      console.log(`${id}: allowed block types ->`, allowedBlocks);
    } catch (e: any) {
      console.error(`Error parsing schema for ${id}:`, e.message);
    }
  }
}
