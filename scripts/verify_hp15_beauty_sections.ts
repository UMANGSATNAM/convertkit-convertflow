import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('app/data/templates/theme-engine/registry.json', 'utf8'));
const regMap = new Map(reg.components.map((c: any) => [c.componentId, c.liquidPath]));

const hp15List = [
  'hp15-hero', 'hp15-marquee', 'hp15-category-pills', 'hp15-category-tiles',
  'hp15-bestsellers', 'hp15-featured-collection', 'hp15-offer-banner',
  'hp15-brand-story', 'hp15-founder-note', 'hp15-bundle-offer',
  'hp15-press-logos', 'hp15-testimonials', 'hp15-ugc-reels', 'hp15-usp',
  'hp15-faq', 'hp15-newsletter', 'hp15-video-banner', 'hp15-instagram'
];

console.log('=== CHECKING HP15 BEAUTY SECTIONS ===');
for (const id of hp15List) {
  console.log(`${id}: ${regMap.has(id) ? '✅ OK -> ' + regMap.get(id) : '❌ MISSING'}`);
}
