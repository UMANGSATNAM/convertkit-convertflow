import fs from 'fs';
import path from 'path';

const regPath = 'app/data/templates/theme-engine/registry.json';
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
const regMap = new Map(reg.components.map((c: any) => [c.componentId, c.liquidPath]));

console.log('=== CHECKING HP20 SECTIONS IN REGISTRY ===');
const hp20List = [
  'hp20-hero', 'hp20-marquee', 'hp20-category-pills', 'hp20-category-tiles',
  'hp20-bestsellers', 'hp20-featured-collection', 'hp20-offer-banner',
  'hp20-brand-story', 'hp20-founder-note', 'hp20-bundle-offer',
  'hp20-press-logos', 'hp20-testimonials', 'hp20-ugc-reels', 'hp20-usp',
  'hp20-faq', 'hp20-newsletter', 'hp20-video-banner', 'hp20-instagram'
];

for (const id of hp20List) {
  console.log(`${id}: ${regMap.has(id) ? '✅ OK -> ' + regMap.get(id) : '❌ MISSING'}`);
}
