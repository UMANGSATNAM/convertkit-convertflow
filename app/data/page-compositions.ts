export type PageType = "index" | "product" | "collection" | "cart" | "cart-drawer";

export interface CompositionSection {
  componentId: string;
  /** Written into the template as-is. Palette and product wiring run after. */
  settings?: Record<string, any>;
}

export interface PageComposition {
  id: string;
  name: string;
  pageType: PageType;
  niche: string;
  family: string;
  archetype?: string;
  styleBadge?: string;
  accentColor?: string;
  /** One line a merchant can judge the design by before previewing it. */
  description: string;
  sections: CompositionSection[];
  /**
   * Chrome that lives in section groups rather than the page template.
   */
  announcement?: string;
  header?: string;
  footer?: string;
}

export const PAGE_TABS: Array<{ id: PageType; label: string }> = [
  { id: "index", label: "Home page" },
  { id: "product", label: "Product page" },
  { id: "collection", label: "Collection page" },
  { id: "cart", label: "Cart page" },
  { id: "cart-drawer", label: "Cart drawer" },
];

/**
 * The catalogue of curated, top-tier D2C page designs.
 *
 * 10 Curated, Top-Tier D2C Homepages covering:
 * - 3 Clothing Archetypes (Cyber Streetwear, Royal Heritage Ethnic, Nordic Clean Minimal)
 * - 3 Beauty Archetypes (Botanical Organic Glow, Clinical Derma Lab, Luxury Glamour Studio)
 * - 3 Jewellery Archetypes (Royal Polki Gold, Modern Solitaire Diamond, Artisan Silver 925)
 * - 1 Tech Archetype (Cyber Dark Minimal Electronics)
 */
export const COMPOSITIONS: PageComposition[] = [
  // ── 1. CLOTHING (3 D2C Archetypes) ───────────────────────────────────────
  {
    id: "streetwear-cyber-home",
    name: "Cyber Streetwear D2C",
    pageType: "index",
    niche: "clothing",
    family: "Streetwear",
    archetype: "cyber-brutalist",
    styleBadge: "High Energy Drops",
    accentColor: "#f59e0b",
    description:
      "High-energy cyber streetwear homepage: live drop ticker, bold hero, shoppable reels, lookbook grid, VIP rewards, and dark brutalist aesthetics.",
    announcement: "announcement-bold-v1",
    header: "header-bold-v1",
    footer: "footer-bold-v1",
    sections: [
      { componentId: "hp22-marquee" },
      { componentId: "hero-bold-v1" },
      { componentId: "hp22-usp" },
      { componentId: "hp22-category-tiles" },
      { componentId: "hp22-bestsellers" },
      { componentId: "hp22-offer-banner" },
      { componentId: "hp22-ugc-reels" },
      { componentId: "hp22-brand-story" },
      { componentId: "grid-featured-lookbook-v1" },
      { componentId: "hp22-instagram" },
      { componentId: "hp22-press-logos" },
      { componentId: "hp22-testimonials" },
      { componentId: "hp22-bundle-offer" },
      { componentId: "hp22-founder-note" },
      { componentId: "hp22-faq" },
      { componentId: "hp22-newsletter" },
      { componentId: "hp20-18-footer-promo" },
      { componentId: "popup-spin-wheel-v1" },
    ],
  },
  {
    id: "ethnic-royal-home",
    name: "Royal Heritage & Ethnic Luxe",
    pageType: "index",
    niche: "clothing",
    family: "Luxury",
    archetype: "royal-heritage",
    styleBadge: "Royal Heritage Couture",
    accentColor: "#d97706",
    description:
      "Grand royal ethnic couture homepage: gold announcement, royal marquee, craftsmanship story, bridal lookbook, and heritage luxury styling.",
    announcement: "announcement-luxury-v1",
    header: "hp7-header",
    footer: "footer-luxury-mega-v1",
    sections: [
      { componentId: "hp7-marquee" },
      { componentId: "hp7-hero" },
      { componentId: "hp7-usp" },
      { componentId: "collection-luxury-v1" },
      { componentId: "hp7-bestsellers" },
      { componentId: "story-materials-showcase-v1" },
      { componentId: "hp7-offer-banner" },
      { componentId: "grid-luxury-v1" },
      { componentId: "hp7-15-instagram-grid" },
      { componentId: "hp7-testimonials" },
      { componentId: "hp7-press-logos" },
      { componentId: "trust-before-after-luxury-v1" },
      { componentId: "banner-countdown-luxury-v1" },
      { componentId: "hp7-faq" },
      { componentId: "newsletter-minimal-v1" },
      { componentId: "hp20-18-footer-promo" },
      { componentId: "popup-spin-wheel-v1" },
    ],
  },
  {
    id: "apparel-minimal-home",
    name: "Minimalist Nordic Casual",
    pageType: "index",
    niche: "clothing",
    family: "Minimal",
    archetype: "nordic-clean",
    styleBadge: "Sustainable Clean",
    accentColor: "#059669",
    description:
      "Clean Scandinavian minimalism: split hero, eco-fabric badges, bestseller tabs, slow fashion manifesto, and editorial lookbook.",
    announcement: "announcement-minimal-v1",
    header: "hp10-header",
    footer: "footer-minimal-v1",
    sections: [
      { componentId: "hp10-marquee" },
      { componentId: "hp10-hero" },
      { componentId: "hp10-usp" },
      { componentId: "collection-minimal-v1" },
      { componentId: "hp10-bestsellers" },
      { componentId: "hp10-image-with-text" },
      { componentId: "brand-story-minimal-v1" },
      { componentId: "hp10-comparison-table" },
      { componentId: "grid-minimal-v1" },
      { componentId: "hp10-instagram" },
      { componentId: "hp10-testimonials" },
      { componentId: "hp10-press-logos" },
      { componentId: "trust-badges-v1" },
      { componentId: "hp10-faq" },
      { componentId: "hp10-newsletter" },
      { componentId: "hp10-featured-blog" },
      { componentId: "popup-exit-intent-luxury-v1" },
    ],
  },

  // ── 2. BEAUTY (3 D2C Archetypes) ─────────────────────────────────────────
  {
    id: "beauty-organic-home",
    name: "Botanical & Organic Glow",
    pageType: "index",
    niche: "beauty",
    family: "Natural",
    archetype: "organic-glow",
    styleBadge: "100% Clean Botanical",
    accentColor: "#10b981",
    description:
      "Earth-toned botanical beauty homepage: clean ingredient matrix, routine kit builder, clinical before/afters, and dermatologist verified seals.",
    announcement: "announcement-natural-v1",
    header: "header-natural-v1",
    footer: "footer-natural-v1",
    sections: [
      { componentId: "hp1-marquee" },
      { componentId: "hp1-hero" },
      { componentId: "hp1-usp" },
      { componentId: "hp1-category-tiles" },
      { componentId: "hp1-bestsellers" },
      { componentId: "hp1-brand-story" },
      { componentId: "hp1-ugc-reels" },
      { componentId: "trust-before-after-luxury-v1" },
      { componentId: "collection-natural-v1" },
      { componentId: "hp1-bundle-offer" },
      { componentId: "hp1-founder-note" },
      { componentId: "hp1-instagram" },
      { componentId: "hp1-testimonials" },
      { componentId: "hp1-press-logos" },
      { componentId: "hp1-faq" },
      { componentId: "hp1-newsletter" },
      { componentId: "popup-exit-intent-luxury-v1" },
    ],
  },
  {
    id: "beauty-clinical-home",
    name: "Clinical Derma Lab Skincare",
    pageType: "index",
    niche: "beauty",
    family: "Tech",
    archetype: "clinical-derma",
    styleBadge: "Medical Dermatologist",
    accentColor: "#2563eb",
    description:
      "High-credibility clinical skincare homepage: active ingredient matrix, dermatologist endorsements, clinical trial stats, and ingredient guide.",
    announcement: "announcement-tech-v1",
    header: "hp14-header",
    footer: "footer-tech-v1",
    sections: [
      { componentId: "hp14-marquee" },
      { componentId: "hp14-hero" },
      { componentId: "hp14-usp" },
      { componentId: "hp14-featured-products" },
      { componentId: "hp14-bestsellers" },
      { componentId: "hp14-comparison-table" },
      { componentId: "hp14-brand-story" },
      { componentId: "trust-stats-v1" },
      { componentId: "grid-tech-v1" },
      { componentId: "collection-tech-v1" },
      { componentId: "hp14-instagram" },
      { componentId: "hp14-testimonial" },
      { componentId: "banner-countdown-luxury-v1" },
      { componentId: "trust-badges-v1" },
      { componentId: "hp14-faq" },
      { componentId: "hp14-newsletter" },
      { componentId: "hp14-blog-posts" },
      { componentId: "popup-spin-wheel-v1" },
    ],
  },
  {
    id: "beauty-glamour-home",
    name: "Luxury Glamour Studio",
    pageType: "index",
    niche: "beauty",
    family: "Luxury",
    archetype: "glamour-editorial",
    styleBadge: "Editorial Haute Parfumerie",
    accentColor: "#ec4899",
    description:
      "Ultra-luxury cosmetics and haute perfumery homepage: fragrance notes pyramid, high-fashion assets, red carpet lookbook, and VIP unboxing.",
    announcement: "announcement-luxury-v1",
    header: "hp19-header",
    footer: "footer-luxury-mega-v1",
    sections: [
      { componentId: "hp19-marquee" },
      { componentId: "hp19-hero" },
      { componentId: "hp19-usp" },
      { componentId: "hp19-category-tiles" },
      { componentId: "hp19-bestsellers" },
      { componentId: "collection-slider-luxury-v1" },
      { componentId: "hp19-offer-banner" },
      { componentId: "hp19-brand-story" },
      { componentId: "grid-luxury-v1" },
      { componentId: "modal-shoppable-video-luxury-v1" },
      { componentId: "hp19-founder-note" },
      { componentId: "hp19-instagram" },
      { componentId: "hp19-testimonials" },
      { componentId: "hp19-press-logos" },
      { componentId: "hp19-bundle-offer" },
      { componentId: "hp19-faq" },
      { componentId: "hp19-newsletter" },
      { componentId: "popup-exit-intent-luxury-v1" },
    ],
  },

  // ── 3. JEWELLERY (3 D2C Archetypes) ──────────────────────────────────────
  {
    id: "jewellery-heritage-home",
    name: "Royal Heritage Polki & Gold",
    pageType: "index",
    niche: "jewellery",
    family: "Luxury",
    archetype: "heritage-polki-gold",
    styleBadge: "Bridal Heirloom Polki",
    accentColor: "#b45309",
    description:
      "Exquisite bridal gold & uncut polki jewellery homepage: BIS 916 hallmark certification, royal trousseau guide, and artisan video showcases.",
    announcement: "announcement-luxury-v1",
    header: "hp8-header",
    footer: "hp8-footer",
    sections: [
      { componentId: "hp8-marquee" },
      { componentId: "hp8-hero" },
      { componentId: "hp8-usp" },
      { componentId: "collection-luxury-v1" },
      { componentId: "hp8-bestsellers" },
      { componentId: "story-materials-showcase-v1" },
      { componentId: "hp8-offer-banner" },
      { componentId: "grid-jewellery-showcase-v1" },
      { componentId: "trust-before-after-luxury-v1" },
      { componentId: "hp8-instagram" },
      { componentId: "hp8-testimonials" },
      { componentId: "hp8-press-logos" },
      { componentId: "banner-countdown-luxury-v1" },
      { componentId: "hp8-faq" },
      { componentId: "newsletter-minimal-v1" },
      { componentId: "hp20-18-footer-promo" },
      { componentId: "popup-exit-intent-luxury-v1" },
    ],
  },
  {
    id: "jewellery-diamond-home",
    name: "Modern Solitaire & Fine Diamond",
    pageType: "index",
    niche: "jewellery",
    family: "Luxury",
    archetype: "modern-solitaire",
    styleBadge: "Certified Lab Diamonds",
    accentColor: "#0284c7",
    description:
      "Contemporary fine diamond jewellery homepage: interactive 4Cs guide, GIA/IGI lab certification seals, sparkle gallery, and lifetime warranty.",
    announcement: "announcement-luxury-v1",
    header: "hp9-header",
    footer: "hp9-footer",
    sections: [
      { componentId: "hp9-marquee" },
      { componentId: "hp9-hero" },
      { componentId: "hp9-usp" },
      { componentId: "hp9-collection-list" },
      { componentId: "hp9-bestsellers" },
      { componentId: "hp9-comparison-table" },
      { componentId: "hp9-brand-story" },
      { componentId: "grid-jewellery-showcase-v1" },
      { componentId: "collection-slider-luxury-v1" },
      { componentId: "trust-stats-v1" },
      { componentId: "trust-badges-v1" },
      { componentId: "hp9-instagram" },
      { componentId: "hp9-testimonials" },
      { componentId: "hp9-press-logos" },
      { componentId: "hp9-featured-blog" },
      { componentId: "hp9-faq" },
      { componentId: "popup-exit-intent-luxury-v1" },
    ],
  },
  {
    id: "jewellery-silver-home",
    name: "Artisan Handcrafted Silver 925",
    pageType: "index",
    niche: "jewellery",
    family: "Natural",
    archetype: "artisan-silver",
    styleBadge: "925 Pure Silver",
    accentColor: "#64748b",
    description:
      "Bohemian artisan 925 solid sterling silver homepage: silversmith masterclass, anti-tarnish guarantee, community stacking guide, and care tips.",
    announcement: "announcement-natural-v1",
    header: "hp11-header",
    footer: "hp11-footer",
    sections: [
      { componentId: "hp11-marquee" },
      { componentId: "hp11-hero" },
      { componentId: "hp11-usp" },
      { componentId: "collection-natural-v1" },
      { componentId: "hp11-bestsellers" },
      { componentId: "hp11-comparison-table" },
      { componentId: "story-brand-editorial-v1" },
      { componentId: "grid-jewellery-showcase-v1" },
      { componentId: "hp11-instagram" },
      { componentId: "hp11-testimonials" },
      { componentId: "hp11-press-logos" },
      { componentId: "trust-badges-v1" },
      { componentId: "hp11-faq" },
      { componentId: "hp11-newsletter" },
      { componentId: "hp11-featured-blog" },
      { componentId: "hp11-contact-form" },
      { componentId: "popup-exit-intent-luxury-v1" },
    ],
  },

  // ── 4. TECH / GADGETS (1 D2C Archetype) ──────────────────────────────────
  {
    id: "tech-cyber-home",
    name: "Cyber Dark Minimal Electronics",
    pageType: "index",
    niche: "tech",
    family: "Tech",
    archetype: "cyber-minimal-audio",
    styleBadge: "Pro Audio & Gear",
    accentColor: "#10b981",
    description:
      "High-performance pro tech homepage: technical acoustic specs matrix, sound frequency breakdown, 360-view exploded chassis, and unboxing reel grid.",
    announcement: "announcement-tech-v1",
    header: "hp12-header",
    footer: "hp12-footer",
    sections: [
      { componentId: "hp12-marquee" },
      { componentId: "hp12-hero" },
      { componentId: "hp12-usp" },
      { componentId: "collection-tech-v1" },
      { componentId: "hp12-bestsellers" },
      { componentId: "hp12-lookbook" },
      { componentId: "hp12-comparison-table" },
      { componentId: "hp12-brand-story" },
      { componentId: "trust-stats-v1" },
      { componentId: "grid-tech-v1" },
      { componentId: "hp12-instagram" },
      { componentId: "testimonials-tech-v1" },
      { componentId: "social-proof-press-v1" },
      { componentId: "trust-badges-v1" },
      { componentId: "hp12-faq" },
      { componentId: "hp12-newsletter" },
      { componentId: "hp12-blog-posts" },
      { componentId: "popup-spin-wheel-v1" },
    ],
  },

  // ── Product, Collection, Cart & Cart Drawer ──────────────────────────────
  {
    id: "product-conversion-luxe",
    name: "High-Converting Product Page",
    pageType: "product",
    niche: "universal",
    family: "Luxury",
    styleBadge: "Sticky ATC & Bundles",
    accentColor: "#2563eb",
    description: "Product page with trust badges, video reviews, sticky add to cart, and dynamic bundles.",
    announcement: "announcement-bold-v1",
    header: "header-bold-v1",
    footer: "footer-bold-v1",
    sections: [
      { componentId: "trust-badges-v1" },
      { componentId: "trust-before-after-luxury-v1" },
      { componentId: "hp22-faq" },
    ],
  },
  {
    id: "collection-filter-grid",
    name: "Editorial Collection Showcase",
    pageType: "collection",
    niche: "universal",
    family: "Minimal",
    styleBadge: "Smart Filters",
    accentColor: "#059669",
    description: "High-speed collection grid with category pills, lookbooks, and promotional banners.",
    announcement: "announcement-minimal-v1",
    header: "hp10-header",
    footer: "footer-minimal-v1",
    sections: [
      { componentId: "grid-minimal-v1" },
      { componentId: "collection-slider-luxury-v1" },
    ],
  },
  {
    id: "cart-drawer-upsell",
    name: "High-AOV Cart Drawer",
    pageType: "cart-drawer",
    niche: "universal",
    family: "Tech",
    styleBadge: "Tiered Free Shipping",
    accentColor: "#f59e0b",
    description: "Slide-out cart drawer with free shipping progress bar and 1-click upsells.",
    sections: [
      { componentId: "trust-badges-v1" },
      { componentId: "popup-exit-intent-luxury-v1" },
    ],
  },
];

export function compositionsFor(pageType: PageType, niche?: string): PageComposition[] {
  return COMPOSITIONS.filter(
    c => c.pageType === pageType && (!niche || c.niche === niche || c.niche === "universal")
  );
}
