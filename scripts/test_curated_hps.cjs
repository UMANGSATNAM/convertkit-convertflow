const fs = require('fs');
const path = require('path');

const engineDir = path.join(__dirname, '../app/data/templates/theme-engine');
const registry = JSON.parse(fs.readFileSync(path.join(engineDir, 'registry.json'), 'utf8'));
const regMap = new Map((registry.components || registry).map(c => [c.componentId, c.liquidPath]));

// Add alias for header-tech-v1 if needed
regMap.set('header-tech-v1', 'components/header/header-tech-v1.liquid');

const list = [
  // 1. Streetwear
  {
    id: "streetwear-cyber-home",
    announcement: "announcement-bold-v1",
    header: "header-bold-v1",
    footer: "footer-bold-v1",
    sections: [
      "hp22-marquee",
      "hero-bold-v1",
      "hp22-usp",
      "hp22-category-tiles",
      "hp22-bestsellers",
      "hp22-offer-banner",
      "hp22-ugc-reels",
      "hp22-brand-story",
      "grid-featured-lookbook-v1",
      "hp22-instagram",
      "hp22-press-logos",
      "hp22-testimonials",
      "hp22-bundle-offer",
      "hp22-founder-note",
      "hp22-faq",
      "hp22-newsletter",
      "hp20-18-footer-promo",
      "popup-spin-wheel-v1"
    ]
  },
  // 2. Ethnic
  {
    id: "ethnic-royal-home",
    announcement: "announcement-luxury-v1",
    header: "hp7-header",
    footer: "footer-luxury-mega-v1",
    sections: [
      "hp7-marquee",
      "hp7-hero",
      "hp7-usp",
      "collection-luxury-v1",
      "hp7-bestsellers",
      "story-materials-showcase-v1",
      "hp7-offer-banner",
      "grid-luxury-v1",
      "hp7-15-instagram-grid",
      "hp7-testimonials",
      "hp7-press-logos",
      "trust-before-after-luxury-v1",
      "banner-countdown-luxury-v1",
      "hp7-faq",
      "newsletter-minimal-v1",
      "hp20-18-footer-promo",
      "popup-spin-wheel-v1"
    ]
  },
  // 3. Nordic Minimal
  {
    id: "apparel-minimal-home",
    announcement: "announcement-minimal-v1",
    header: "hp10-header",
    footer: "footer-minimal-v1",
    sections: [
      "hp10-marquee",
      "hp10-hero",
      "hp10-usp",
      "collection-minimal-v1",
      "hp10-bestsellers",
      "hp10-image-with-text",
      "brand-story-minimal-v1",
      "hp10-comparison-table",
      "grid-minimal-v1",
      "hp10-instagram",
      "hp10-testimonials",
      "hp10-press-logos",
      "trust-badges-v1",
      "hp10-faq",
      "hp10-newsletter",
      "hp10-featured-blog",
      "popup-exit-intent-luxury-v1"
    ]
  },
  // 4. Beauty Organic
  {
    id: "beauty-organic-home",
    announcement: "announcement-natural-v1",
    header: "header-natural-v1",
    footer: "footer-natural-v1",
    sections: [
      "hp1-marquee",
      "hp1-hero",
      "hp1-usp",
      "hp1-category-tiles",
      "hp1-bestsellers",
      "hp1-brand-story",
      "hp1-ugc-reels",
      "trust-before-after-luxury-v1",
      "collection-natural-v1",
      "hp1-bundle-offer",
      "hp1-founder-note",
      "hp1-instagram",
      "hp1-testimonials",
      "hp1-press-logos",
      "hp1-faq",
      "hp1-newsletter",
      "popup-exit-intent-luxury-v1"
    ]
  },
  // 5. Clinical Derma
  {
    id: "beauty-clinical-home",
    announcement: "announcement-tech-v1",
    header: "hp14-header",
    footer: "footer-tech-v1",
    sections: [
      "hp14-marquee",
      "hp14-hero",
      "hp14-usp",
      "hp14-featured-products",
      "hp14-bestsellers",
      "hp14-comparison-table",
      "hp14-brand-story",
      "trust-stats-v1",
      "grid-tech-v1",
      "collection-tech-v1",
      "hp14-instagram",
      "hp14-testimonial",
      "banner-countdown-luxury-v1",
      "trust-badges-v1",
      "hp14-faq",
      "hp14-newsletter",
      "hp14-blog-posts",
      "popup-spin-wheel-v1"
    ]
  },
  // 6. Glamour Studio
  {
    id: "beauty-glamour-home",
    announcement: "announcement-luxury-v1",
    header: "hp19-header",
    footer: "footer-luxury-mega-v1",
    sections: [
      "hp19-marquee",
      "hp19-hero",
      "hp19-usp",
      "hp19-category-tiles",
      "hp19-bestsellers",
      "collection-slider-luxury-v1",
      "hp19-offer-banner",
      "hp19-brand-story",
      "grid-luxury-v1",
      "modal-shoppable-video-luxury-v1",
      "hp19-founder-note",
      "hp19-instagram",
      "hp19-testimonials",
      "hp19-press-logos",
      "hp19-bundle-offer",
      "hp19-faq",
      "hp19-newsletter",
      "popup-exit-intent-luxury-v1"
    ]
  },
  // 7. Jewellery Heritage
  {
    id: "jewellery-heritage-home",
    announcement: "announcement-luxury-v1",
    header: "hp8-header",
    footer: "hp8-footer",
    sections: [
      "hp8-marquee",
      "hp8-hero",
      "hp8-usp",
      "collection-luxury-v1",
      "hp8-bestsellers",
      "story-materials-showcase-v1",
      "hp8-offer-banner",
      "grid-jewellery-showcase-v1",
      "trust-before-after-luxury-v1",
      "hp8-instagram",
      "hp8-testimonials",
      "hp8-press-logos",
      "banner-countdown-luxury-v1",
      "hp8-faq",
      "newsletter-minimal-v1",
      "hp20-18-footer-promo",
      "popup-exit-intent-luxury-v1"
    ]
  },
  // 8. Diamond Modern
  {
    id: "jewellery-diamond-home",
    announcement: "announcement-luxury-v1",
    header: "hp9-header",
    footer: "hp9-footer",
    sections: [
      "hp9-marquee",
      "hp9-hero",
      "hp9-usp",
      "hp9-collection-list",
      "hp9-bestsellers",
      "hp9-comparison-table",
      "hp9-brand-story",
      "grid-jewellery-showcase-v1",
      "collection-slider-luxury-v1",
      "trust-stats-v1",
      "trust-badges-v1",
      "hp9-instagram",
      "hp9-testimonials",
      "hp9-press-logos",
      "hp9-featured-blog",
      "hp9-faq",
      "popup-exit-intent-luxury-v1"
    ]
  },
  // 9. Silver Artisan
  {
    id: "jewellery-silver-home",
    announcement: "announcement-natural-v1",
    header: "hp11-header",
    footer: "hp11-footer",
    sections: [
      "hp11-marquee",
      "hp11-hero",
      "hp11-usp",
      "collection-natural-v1",
      "hp11-bestsellers",
      "hp11-comparison-table",
      "story-brand-editorial-v1",
      "grid-jewellery-showcase-v1",
      "hp11-instagram",
      "hp11-testimonials",
      "hp11-press-logos",
      "trust-badges-v1",
      "hp11-faq",
      "hp11-newsletter",
      "hp11-featured-blog",
      "hp11-contact-form",
      "popup-exit-intent-luxury-v1"
    ]
  },
  // 10. Tech Cyber
  {
    id: "tech-cyber-home",
    announcement: "announcement-tech-v1",
    header: "hp12-header",
    footer: "hp12-footer",
    sections: [
      "hp12-marquee",
      "hp12-hero",
      "hp12-usp",
      "collection-tech-v1",
      "hp12-bestsellers",
      "hp12-lookbook",
      "hp12-comparison-table",
      "hp12-brand-story",
      "trust-stats-v1",
      "grid-tech-v1",
      "hp12-instagram",
      "testimonials-tech-v1",
      "social-proof-press-v1",
      "trust-badges-v1",
      "hp12-faq",
      "hp12-newsletter",
      "hp12-blog-posts",
      "popup-spin-wheel-v1"
    ]
  }
];

let allValid = true;
for (const comp of list) {
  const checkList = [
    { type: 'announcement', id: comp.announcement },
    { type: 'header', id: comp.header },
    { type: 'footer', id: comp.footer },
    ...comp.sections.map(s => ({ type: 'section', id: s }))
  ];

  for (const item of checkList) {
    if (!regMap.has(item.id)) {
      console.error(`[FAIL] Comp "${comp.id}" has missing ${item.type}: "${item.id}"`);
      allValid = false;
    } else {
      const p = path.join(engineDir, regMap.get(item.id));
      if (!fs.existsSync(p)) {
        console.error(`[FAIL] File missing on disk for "${item.id}": ${p}`);
        allValid = false;
      }
    }
  }
}

if (allValid) {
  console.log(`[SUCCESS] All 10 Homepages (${list.length}) are 100% valid! Every single component and file exists.`);
}
