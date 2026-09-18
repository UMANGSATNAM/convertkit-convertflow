import fs from 'fs';
import path from 'path';

const themeEngineBase = path.resolve('app/data/templates/theme-engine');
const registryFile = path.join(themeEngineBase, 'registry.json');

const sections = [
  // 1. Announcement (2)
  {
    componentId: 'announcement-marquee',
    category: 'announcement',
    sectionType: 'announcement-marquee',
    liquidRel: 'components/announcement/announcement-marquee.liquid',
    family: 'Announcement Bars',
    visualStyle: 'marquee-ticker',
    industryTags: ['all', 'retail', 'fashion'],
    styleTags: ['modern', 'marquee', 'infinite-scroll']
  },
  {
    componentId: 'announcement-countdown',
    category: 'announcement',
    sectionType: 'announcement-countdown',
    liquidRel: 'components/announcement/announcement-countdown.liquid',
    family: 'Announcement Bars',
    visualStyle: 'urgency-countdown',
    industryTags: ['all', 'flash-sale', 'promo'],
    styleTags: ['countdown', 'coupon', 'urgency']
  },

  // 2. Hero (5)
  {
    componentId: 'hero-split-luxury',
    category: 'hero',
    sectionType: 'hero-split-luxury',
    liquidRel: 'components/hero/hero-split-luxury.liquid',
    family: 'Hero Banners',
    visualStyle: 'split-luxury',
    industryTags: ['luxury', 'fashion', 'jewelry'],
    styleTags: ['editorial', '50-50', 'premium']
  },
  {
    componentId: 'hero-editorial-brand',
    category: 'hero',
    sectionType: 'hero-editorial-brand',
    liquidRel: 'components/hero/hero-editorial-brand.liquid',
    family: 'Hero Banners',
    visualStyle: 'editorial-glass',
    industryTags: ['lifestyle', 'apparel', 'beauty'],
    styleTags: ['full-bleed', 'manifesto', 'glassmorphism']
  },
  {
    componentId: 'hero-high-conversion',
    category: 'hero',
    sectionType: 'hero-high-conversion',
    liquidRel: 'components/hero/hero-high-conversion.liquid',
    family: 'Hero Banners',
    visualStyle: 'social-proof',
    industryTags: ['ecommerce', 'supplements', 'gadgets'],
    styleTags: ['high-conversion', 'reviews', 'trust']
  },
  {
    componentId: 'hero-video-poster',
    category: 'hero',
    sectionType: 'hero-video-poster',
    liquidRel: 'components/hero/hero-video-poster.liquid',
    family: 'Hero Banners',
    visualStyle: 'ambient-hotspot',
    industryTags: ['modern', 'furniture', 'streetwear'],
    styleTags: ['hotspot', 'video', 'interactive']
  },
  {
    componentId: 'hero-minimal-clean',
    category: 'hero',
    sectionType: 'hero-minimal-clean',
    liquidRel: 'components/hero/hero-minimal-clean.liquid',
    family: 'Hero Banners',
    visualStyle: 'scandinavian-minimal',
    industryTags: ['minimal', 'decor', 'boutique'],
    styleTags: ['clean', 'pills', 'light']
  },

  // 3. PDP & Sticky ATC (5)
  {
    componentId: 'pdp-sticky-atc',
    category: 'product-page',
    sectionType: 'pdp-sticky-atc',
    liquidRel: 'components/product-page/pdp-sticky-atc.liquid',
    family: 'PDP & Sticky ATC',
    visualStyle: 'sticky-bar',
    industryTags: ['ecommerce', 'retail', 'mobile'],
    styleTags: ['sticky', 'quick-atc', 'conversion']
  },
  {
    componentId: 'pdp-trust-tabs',
    category: 'product-page',
    sectionType: 'pdp-trust-tabs',
    liquidRel: 'components/product-page/pdp-trust-tabs.liquid',
    family: 'PDP & Sticky ATC',
    visualStyle: 'accordion-specs',
    industryTags: ['apparel', 'electronics', 'beauty'],
    styleTags: ['tabs', 'accordion', 'trust']
  },
  {
    componentId: 'pdp-stock-urgency',
    category: 'product-page',
    sectionType: 'pdp-stock-urgency',
    liquidRel: 'components/product-page/pdp-stock-urgency.liquid',
    family: 'PDP & Sticky ATC',
    visualStyle: 'urgency-meter',
    industryTags: ['dropshipping', 'deals', 'apparel'],
    styleTags: ['stock-meter', 'live-viewers', 'scarcity']
  },
  {
    componentId: 'pdp-swatch-gallery',
    category: 'product-page',
    sectionType: 'pdp-swatch-gallery',
    liquidRel: 'components/product-page/pdp-swatch-gallery.liquid',
    family: 'PDP & Sticky ATC',
    visualStyle: 'color-swatches',
    industryTags: ['fashion', 'apparel', 'shoes'],
    styleTags: ['swatches', 'sizes', 'gallery']
  },
  {
    componentId: 'pdp-bundle-fbt',
    category: 'product-page',
    sectionType: 'pdp-bundle-fbt',
    liquidRel: 'components/product-page/pdp-bundle-fbt.liquid',
    family: 'PDP & Sticky ATC',
    visualStyle: 'frequently-bought-together',
    industryTags: ['cross-sell', 'aov', 'bundles'],
    styleTags: ['bundle', 'upsell', 'fbt']
  },

  // 4. Offer & Poster (5)
  {
    componentId: 'offer-bento-grid',
    category: 'offer',
    sectionType: 'offer-bento-grid',
    liquidRel: 'components/offer/offer-bento-grid.liquid',
    family: 'Offer & Poster Banners',
    visualStyle: 'bento-promo',
    industryTags: ['sales', 'campaigns', 'holidays'],
    styleTags: ['bento', '3-cards', 'grid']
  },
  {
    componentId: 'offer-coupon-strip',
    category: 'offer',
    sectionType: 'offer-coupon-strip',
    liquidRel: 'components/offer/offer-coupon-strip.liquid',
    family: 'Offer & Poster Banners',
    visualStyle: 'coupon-ticket',
    industryTags: ['promotions', 'discounts', 'coupons'],
    styleTags: ['ticket', 'click-to-copy', 'strip']
  },
  {
    componentId: 'offer-dual-poster',
    category: 'offer',
    sectionType: 'offer-dual-poster',
    liquidRel: 'components/offer/offer-dual-poster.liquid',
    family: 'Offer & Poster Banners',
    visualStyle: 'editorial-split-posters',
    industryTags: ['fashion', 'seasonal', 'editorial'],
    styleTags: ['posters', 'dual', 'lifestyle']
  },
  {
    componentId: 'offer-countdown-sale',
    category: 'offer',
    sectionType: 'offer-countdown-sale',
    liquidRel: 'components/offer/offer-countdown-sale.liquid',
    family: 'Offer & Poster Banners',
    visualStyle: 'countdown-box',
    industryTags: ['black-friday', 'flash-sale', 'clearance'],
    styleTags: ['timer', 'countdown', 'progress']
  },
  {
    componentId: 'offer-discount-ribbon',
    category: 'offer',
    sectionType: 'offer-discount-ribbon',
    liquidRel: 'components/offer/offer-discount-ribbon.liquid',
    family: 'Offer & Poster Banners',
    visualStyle: 'deal-ribbon',
    industryTags: ['ecommerce', 'urgency', 'promotions'],
    styleTags: ['ribbon', 'cta', 'pulse']
  },

  // 5. Categories (5)
  {
    componentId: 'category-story-bubbles',
    category: 'categories',
    sectionType: 'category-story-bubbles',
    liquidRel: 'components/categories/category-story-bubbles.liquid',
    family: 'Category & Collection Grids',
    visualStyle: 'instagram-stories',
    industryTags: ['mobile-first', 'apparel', 'cosmetics'],
    styleTags: ['stories', 'circular', 'avatars']
  },
  {
    componentId: 'category-bento-cards',
    category: 'categories',
    sectionType: 'category-bento-cards',
    liquidRel: 'components/categories/category-bento-cards.liquid',
    family: 'Category & Collection Grids',
    visualStyle: 'asymmetric-bento',
    industryTags: ['lifestyle', 'accessories', 'luxury'],
    styleTags: ['bento', 'collections', 'curated']
  },
  {
    componentId: 'category-minimal-tiles',
    category: 'categories',
    sectionType: 'category-minimal-tiles',
    liquidRel: 'components/categories/category-minimal-tiles.liquid',
    family: 'Category & Collection Grids',
    visualStyle: 'scandinavian-tiles',
    industryTags: ['interior', 'minimal', 'nordic'],
    styleTags: ['4-column', 'clean', 'zoom']
  },
  {
    componentId: 'category-masonry-lookbook',
    category: 'categories',
    sectionType: 'category-masonry-lookbook',
    liquidRel: 'components/categories/category-masonry-lookbook.liquid',
    family: 'Category & Collection Grids',
    visualStyle: 'editorial-masonry',
    industryTags: ['fashion', 'streetwear', 'curated'],
    styleTags: ['magazine', 'lookbook', 'masonry']
  },
  {
    componentId: 'category-slider-rail',
    category: 'categories',
    sectionType: 'category-slider-rail',
    liquidRel: 'components/categories/category-slider-rail.liquid',
    family: 'Category & Collection Grids',
    visualStyle: 'horizontal-rail',
    industryTags: ['large-catalog', 'retail', 'clothing'],
    styleTags: ['slider', 'touch', 'arrows']
  },

  // 6. Product Cards (5)
  {
    componentId: 'product-card-quickadd',
    category: 'product-card',
    sectionType: 'product-card-quickadd',
    liquidRel: 'components/product-card/product-card-quickadd.liquid',
    family: 'Product Cards',
    visualStyle: 'hover-flip-size',
    industryTags: ['apparel', 'footwear', 'retail'],
    styleTags: ['quick-add', 'size-picker', 'hover-flip']
  },
  {
    componentId: 'product-card-swatches',
    category: 'product-card',
    sectionType: 'product-card-swatches',
    liquidRel: 'components/product-card/product-card-swatches.liquid',
    family: 'Product Cards',
    visualStyle: 'dynamic-color-dots',
    industryTags: ['fashion', 'cosmetics', 'accessories'],
    styleTags: ['swatches', 'interactive-color', 'card']
  },
  {
    componentId: 'product-card-trust',
    category: 'product-card',
    sectionType: 'product-card-trust',
    liquidRel: 'components/product-card/product-card-trust.liquid',
    family: 'Product Cards',
    visualStyle: 'social-proof-installments',
    industryTags: ['watches', 'electronics', 'premium'],
    styleTags: ['stars', 'reviews', 'installments']
  },
  {
    componentId: 'product-card-badge-sale',
    category: 'product-card',
    sectionType: 'product-card-badge-sale',
    liquidRel: 'components/product-card/product-card-badge-sale.liquid',
    family: 'Product Cards',
    visualStyle: 'flash-deal-meter',
    industryTags: ['clearance', 'deals', 'gadgets'],
    styleTags: ['sale-badge', 'stock-meter', 'countdown']
  },
  {
    componentId: 'product-card-minimal',
    category: 'product-card',
    sectionType: 'product-card-minimal',
    liquidRel: 'components/product-card/product-card-minimal.liquid',
    family: 'Product Cards',
    visualStyle: 'boutique-wishlist',
    industryTags: ['ceramics', 'minimal', 'lifestyle'],
    styleTags: ['wishlist', 'clean-borderless', 'quick-add']
  },

  // 7. Headers (5)
  {
    componentId: 'header-megamenu',
    category: 'header',
    sectionType: 'header-megamenu',
    liquidRel: 'components/header/header-megamenu.liquid',
    family: 'Headers',
    visualStyle: 'mega-menu-dropdown',
    industryTags: ['large-store', 'fashion', 'department'],
    styleTags: ['megamenu', 'search', 'cart-badge']
  },
  {
    componentId: 'header-centered-brand',
    category: 'header',
    sectionType: 'header-centered-brand',
    liquidRel: 'components/header/header-centered-brand.liquid',
    family: 'Headers',
    visualStyle: 'centered-split-nav',
    industryTags: ['luxury', 'jewelry', 'boutique'],
    styleTags: ['centered-logo', 'symmetrical', 'elegant']
  },
  {
    componentId: 'header-sticky-glass',
    category: 'header',
    sectionType: 'header-sticky-glass',
    liquidRel: 'components/header/header-sticky-glass.liquid',
    family: 'Headers',
    visualStyle: 'frosted-glass-capsule',
    industryTags: ['tech', 'd2c', 'modern'],
    styleTags: ['sticky', 'glassmorphism', 'capsule']
  },
  {
    componentId: 'header-minimal-inline',
    category: 'header',
    sectionType: 'header-minimal-inline',
    liquidRel: 'components/header/header-minimal-inline.liquid',
    family: 'Headers',
    visualStyle: 'scandinavian-inline',
    industryTags: ['boutique', 'minimal', 'studio'],
    styleTags: ['single-line', 'clean-type', 'drawer']
  },
  {
    componentId: 'header-promo-embedded',
    category: 'header',
    sectionType: 'header-promo-embedded',
    liquidRel: 'components/header/header-promo-embedded.liquid',
    family: 'Headers',
    visualStyle: 'promo-strip-whatsapp',
    industryTags: ['global-shipping', 'high-volume', 'd2c'],
    styleTags: ['whatsapp', 'search-box', 'promo-top']
  },

  // 8. Footers (5)
  {
    componentId: 'footer-multi-column',
    category: 'footer',
    sectionType: 'footer-multi-column',
    liquidRel: 'components/footer/footer-multi-column.liquid',
    family: 'Footers',
    visualStyle: '4-column-newsletter',
    industryTags: ['all', 'ecommerce', 'retail'],
    styleTags: ['4-column', 'newsletter', 'payment-badges']
  },
  {
    componentId: 'footer-newsletter-focus',
    category: 'footer',
    sectionType: 'footer-newsletter-focus',
    liquidRel: 'components/footer/footer-newsletter-focus.liquid',
    family: 'Footers',
    visualStyle: 'vip-discount-capture',
    industryTags: ['d2c', 'growth', 'apparel'],
    styleTags: ['discount-incentive', 'lead-capture', 'vip']
  },
  {
    componentId: 'footer-minimal-centered',
    category: 'footer',
    sectionType: 'footer-minimal-centered',
    liquidRel: 'components/footer/footer-minimal-centered.liquid',
    family: 'Footers',
    visualStyle: 'centered-payments',
    industryTags: ['minimal', 'boutique', 'studio'],
    styleTags: ['centered', 'social-pills', 'clean']
  },
  {
    componentId: 'footer-trust-badges',
    category: 'footer',
    sectionType: 'footer-trust-badges',
    liquidRel: 'components/footer/footer-trust-badges.liquid',
    family: 'Footers',
    visualStyle: '4-guarantee-pillars',
    industryTags: ['buyer-protection', 'secure', 'ecommerce'],
    styleTags: ['trust-pillars', 'money-back', 'ssl-badge']
  },
  {
    componentId: 'footer-ecommerce-app',
    category: 'footer',
    sectionType: 'footer-ecommerce-app',
    liquidRel: 'components/footer/footer-ecommerce-app.liquid',
    family: 'Footers',
    visualStyle: 'mobile-app-download',
    industryTags: ['omnichannel', 'app-promo', 'retail'],
    styleTags: ['app-store', 'google-play', 'currency-switcher']
  }
];

const wantedIds = new Set(sections.map(s => s.componentId));

const raw = JSON.parse(fs.readFileSync(registryFile, 'utf8'));

// 1. Mark all existing non-37 components as ARCHIVED
let archivedCount = 0;
for (const comp of raw.components) {
  if (!wantedIds.has(comp.componentId)) {
    comp.status = 'ARCHIVED';
    archivedCount++;
  }
}
console.log(`Marked ${archivedCount} legacy components as ARCHIVED in registry.json`);

// 2. Add or update the 37 pristine sections
for (const s of sections) {
  const existingIdx = raw.components.findIndex((c) => c.componentId === s.componentId);
  const entry = {
    componentId: s.componentId,
    type: s.category,
    category: s.category,
    sectionType: s.sectionType,
    liquidPath: s.liquidRel,
    filePath: s.liquidRel,
    metaPath: '',
    visualStyle: s.visualStyle,
    family: s.family,
    archetypes: ['premium', 'universal'],
    compatibleSlots: [],
    status: 'PUBLISHED',
    version: '2',
    designDirection: s.visualStyle,
    layoutVariant: s.visualStyle,
    isUniversal: true,
    industryTags: s.industryTags,
    styleTags: s.styleTags
  };

  if (existingIdx >= 0) {
    raw.components[existingIdx] = { ...raw.components[existingIdx], ...entry };
    console.log(`  Updated ${s.componentId}`);
  } else {
    raw.components.unshift(entry);
    console.log(`  Added ${s.componentId}`);
  }
}

// 3. Save registry.json
fs.writeFileSync(registryFile, JSON.stringify(raw, null, 2), 'utf8');

const pubCount = raw.components.filter(c => c.status === 'PUBLISHED').length;
console.log(`\nRegistry.json updated successfully!`);
console.log(`Total components: ${raw.components.length}`);
console.log(`PUBLISHED components: ${pubCount} (Expected: 37)`);
console.log(`ARCHIVED components: ${raw.components.length - pubCount}`);
