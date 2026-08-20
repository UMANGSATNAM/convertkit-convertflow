const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'app', 'data');
const dstDir = path.join(__dirname, '..', 'dev-theme-peri', 'sections');

const map = {
  'fb04-hero-tabs_streetwear.liquid': 'hp51-hero-tabs.liquid',
  'fb04-new-drops_streetwear.liquid': 'hp51-new-drops.liquid',
  'fb04-brand-story_streetwear.liquid': 'hp51-brand-story.liquid',
  'fb04-manifesto_streetwear.liquid': 'hp51-manifesto.liquid',
  'fb04-marquee_streetwear.liquid': 'hp51-marquee.liquid',
  'fb04-product-spotlight_streetwear.liquid': 'hp51-product-spotlight.liquid',
  'fb04-cta-banner_streetwear.liquid': 'hp51-cta-banner.liquid',
  'fb04-trust-grid_streetwear.liquid': 'hp51-trust-grid.liquid',
  'fb04-category-tiles_streetwear.liquid': 'hp51-category-tiles.liquid',
  'fb04-newsletter_streetwear.liquid': 'hp51-newsletter.liquid',
  'fb04-header_streetwear.liquid': 'hp51-header.liquid',
  'fb04-footer_streetwear.liquid': 'hp51-footer.liquid'
};

for (const [src, dst] of Object.entries(map)) {
  const srcPath = path.join(srcDir, src);
  const dstPath = path.join(dstDir, dst);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, dstPath);
    console.log(`Copied ${src} -> ${dst}`);
  } else {
    console.warn(`Source file missing: ${srcPath}`);
  }
}
