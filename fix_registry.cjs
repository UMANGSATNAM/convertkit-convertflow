const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const ENGINE = path.join(ROOT, 'app/data/templates/theme-engine');
const REGISTRY = path.join(ENGINE, 'registry.json');
const COMPONENTS = path.join(ENGINE, 'components');

const orphans = [
   "components/trust/why-choose-us-commerce-v2.liquid",
   "components/trust/trust-luxury-pillars-v1.liquid",
   "components/trust/cta-band-commerce-v2.liquid",
   "components/testimonials/testimonials-luxury-marquee-v1.liquid",
   "components/testimonials/testimonials-commerce-v2.liquid",
   "components/product-grid/grid-masonry-gallery-luxury-v1.liquid",
   "components/product-grid/featured-categories-commerce-v2.liquid",
   "components/product-grid/deals-commerce-v2.liquid",
   "components/newsletter/newsletter-luxury-v1.liquid",
   "components/hero/hero-split-v1.liquid",
   "components/hero/hero-split-reverse-v2.liquid",
   "components/hero/hero-product-v5.liquid",
   "components/hero/hero-fullbleed-v3.liquid",
   "components/hero/hero-centered-v4.liquid",
   "components/hero/hero-centered-v4-fallback.liquid",
   "components/hero/hero-asymmetric-v6.liquid",
   "components/header/announcement-bar-v2.liquid",
   "components/brand-story/story-timeline-luxury-v1.liquid",
   "components/brand-story/info-process-steps-luxury-v1.liquid",
   "components/announcement/announcement-commerce-v2.liquid"
];

let deletedFiles = 0;

for (const orphan of orphans) {
  const liquidPath = path.join(ENGINE, orphan);
  if (fs.existsSync(liquidPath)) {
    fs.rmSync(liquidPath);
    deletedFiles++;
  }
  
  const metaPath = liquidPath.replace('.liquid', '.meta.json');
  if (fs.existsSync(metaPath)) {
    fs.rmSync(metaPath);
    deletedFiles++;
  }
}
console.log(`Deleted ${deletedFiles} orphan files.`);

const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf-8'));
let updatedCount = 0;

for (const comp of registry.components) {
  if (comp.type === 'header' || comp.type === 'footer') {
    if (comp.sectionType === 'header' || comp.sectionType === 'footer') {
      comp.sectionType = comp.componentId;
      
      // Also update the meta.json file if it exists
      if (comp.metaPath) {
        const metaFile = path.join(ENGINE, comp.metaPath);
        if (fs.existsSync(metaFile)) {
          const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
          meta.sectionType = comp.componentId;
          fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
        }
      }
      
      updatedCount++;
    }
  }
}

console.log(`Updated ${updatedCount} components in registry.`);
fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 2));
