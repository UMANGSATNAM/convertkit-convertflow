import { resolveSections, bundleFor } from '../app/pagekit/registry.server.ts';
import fs from 'fs';

const sections = [
  'announcement-marquee', 'announcement-countdown',
  'hero-split-luxury', 'hero-editorial-brand', 'hero-high-conversion', 'hero-video-poster', 'hero-minimal-clean',
  'pdp-sticky-atc', 'pdp-trust-tabs', 'pdp-stock-urgency', 'pdp-swatch-gallery', 'pdp-bundle-fbt',
  'offer-bento-grid', 'offer-coupon-strip', 'offer-dual-poster', 'offer-countdown-sale', 'offer-discount-ribbon',
  'category-story-bubbles', 'category-bento-cards', 'category-minimal-tiles', 'category-masonry-lookbook', 'category-slider-rail',
  'product-card-quickadd', 'product-card-swatches', 'product-card-trust', 'product-card-badge-sale', 'product-card-minimal',
  'header-megamenu', 'header-centered-brand', 'header-sticky-glass', 'header-minimal-inline', 'header-promo-embedded',
  'footer-multi-column', 'footer-newsletter-focus', 'footer-minimal-centered', 'footer-trust-badges', 'footer-ecommerce-app'
];

async function testAll() {
  console.log(`Testing section resolution for all ${sections.length} sections...`);
  let errors = 0;
  for (const id of sections) {
    const res = await resolveSections([id]);
    if (!res.ok || res.resolved.length === 0) {
      console.error(`❌ Failed to resolve ${id}: unknown=${res.unknown}, missing=${res.fileMissing}`);
      errors++;
    } else {
      const sec = res.resolved[0];
      if (!sec.source || sec.source.length < 50) {
        console.error(`❌ Empty or too short source for ${id}`);
        errors++;
      }
    }
  }

  if (errors === 0) {
    console.log(`✅ All ${sections.length} sections resolved perfectly!`);
  } else {
    console.error(`❌ Found ${errors} errors.`);
  }
}

testAll().catch(console.error);
