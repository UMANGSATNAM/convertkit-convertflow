import fs from 'fs';
import path from 'path';

const regPath = path.resolve('app/data/templates/theme-engine/registry.json');
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const clothingComps = [
  { componentId: 'hp-clothing-hero', type: 'hero', liquidPath: 'components/bespoke-d2c/clothing/hp-clothing-hero.liquid', name: 'Clothing Streetwear Hero' },
  { componentId: 'hp-clothing-marquee', type: 'announcement', liquidPath: 'components/bespoke-d2c/clothing/hp-clothing-marquee.liquid', name: 'Clothing Marquee Ticker' },
  { componentId: 'hp-clothing-categories', type: 'collection', liquidPath: 'components/bespoke-d2c/clothing/hp-clothing-categories.liquid', name: 'Clothing Category Grid' },
  { componentId: 'hp-clothing-bestsellers', type: 'product-grid', liquidPath: 'components/bespoke-d2c/clothing/hp-clothing-bestsellers.liquid', name: 'Clothing Bestsellers' },
  { componentId: 'hp-clothing-lookbook', type: 'ugc', liquidPath: 'components/bespoke-d2c/clothing/hp-clothing-lookbook.liquid', name: 'Clothing Lookbook Grid' },
  { componentId: 'hp-clothing-fabric-specs', type: 'trust', liquidPath: 'components/bespoke-d2c/clothing/hp-clothing-fabric-specs.liquid', name: 'Clothing Fabric Specs' },
  { componentId: 'hp-clothing-bundle', type: 'bundle', liquidPath: 'components/bespoke-d2c/clothing/hp-clothing-bundle.liquid', name: 'Clothing Bundle Builder' },
  { componentId: 'hp-clothing-trust-badges', type: 'trust', liquidPath: 'components/bespoke-d2c/clothing/hp-clothing-trust-badges.liquid', name: 'Clothing Trust Badges' },
  { componentId: 'hp-clothing-testimonials', type: 'testimonials', liquidPath: 'components/bespoke-d2c/clothing/hp-clothing-testimonials.liquid', name: 'Clothing Reviews' },
  { componentId: 'hp-clothing-faq', type: 'faq', liquidPath: 'components/bespoke-d2c/clothing/hp-clothing-faq.liquid', name: 'Clothing FAQ Accordion' },
  { componentId: 'hp-clothing-newsletter', type: 'newsletter', liquidPath: 'components/bespoke-d2c/clothing/hp-clothing-newsletter.liquid', name: 'Clothing VIP Newsletter' },
];

let added = 0;
for (const comp of clothingComps) {
  if (!reg.components.some((c: any) => c.componentId === comp.componentId)) {
    reg.components.push(comp);
    added++;
  }
}

fs.writeFileSync(regPath, JSON.stringify(reg, null, 2), 'utf8');
console.log(`Registered ${added} clothing components in registry.json! Total components: ${reg.components.length}`);
