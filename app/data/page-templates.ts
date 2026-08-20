export type StorePageCategory = "home" | "product" | "collection" | "landing" | "cart";

export interface StorePageTemplate {
  id: string;
  name: string;
  category: StorePageCategory;
  pageType: "index" | "product" | "collection" | "page" | "cart";
  niche: string;
  family: string;
  styleTag: string;
  accentColor: string;
  description: string;
  heroImg: string;
  badge: string;
  usageCount: string;
  announcement?: string;
  header?: string;
  footer?: string;
  sections: Array<{ componentId: string; settings?: Record<string, any> }>;
}

export const STORE_PAGE_TEMPLATES: StorePageTemplate[] = [
  // ── 1. HOME PAGES ────────────────────────────────────────────────────────
  {
    id: "jewellery-diamond-home",
    name: "CaratLane Modern Solitaire Gold & Diamonds",
    category: "home",
    pageType: "index",
    niche: "jewellery",
    family: "Modern Fine Jewellery",
    styleTag: "💎 Certified Gold & Solitaires",
    accentColor: "#d4af37",
    description: "10X CaratLane fine jewelry benchmark: live gold rate ticker, doorstep try-at-home booking, 4Cs diamond certification matrix, transparent price breakdown, and shoppable reels.",
    heroImg: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    badge: "✨ 100% BIS HALLMARKED • IGI CERTIFIED",
    usageCount: "Used on 4,180 D2C stores",
    announcement: "caratlane-announcement",
    header: "caratlane-header",
    footer: "caratlane-footer",
    sections: [
      { componentId: "hp20-hero" },
      { componentId: "hp20-marquee" },
      { componentId: "hp20-category-pills" },
      { componentId: "hp20-category-tiles" },
      { componentId: "hp20-bestsellers" },
      { componentId: "hp20-featured-collection" },
      { componentId: "hp20-offer-banner" },
      { componentId: "hp20-brand-story" },
      { componentId: "hp20-founder-note" },
      { componentId: "hp20-bundle-offer" },
      { componentId: "hp20-press-logos" },
      { componentId: "hp20-testimonials" },
      { componentId: "hp20-ugc-reels" },
      { componentId: "hp20-usp" },
      { componentId: "hp20-faq" },
      { componentId: "hp20-newsletter" },
      { componentId: "hp20-video-banner" },
      { componentId: "hp20-instagram" },
    ],
  },
  {
    id: "beauty-rose-gradient-home",
    name: "Rhode / Glossier Soft Pink & White Gradient Beauty (Home Page 2)",
    category: "home",
    pageType: "index",
    niche: "beauty",
    family: "Soft Pink & Botanical Glow",
    styleTag: "🌸 Soft Pink & Rose Glow Gradient",
    accentColor: "#db2777",
    description: "10X Rhode & Glossier benchmark: soft pink & white gradient, hyaluronic hydration matrix, clinical before & after, shoppable reels, and VIP glow club.",
    heroImg: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    badge: "🌸 CLINICALLY DERMATOLOGIST TESTED",
    usageCount: "Used on 6,290 Beauty D2C stores",
    announcement: "caratlane-announcement",
    header: "caratlane-header",
    footer: "caratlane-footer",
    sections: [
      { componentId: "hp64-hero" },
      { componentId: "hp64-marquee" },
      { componentId: "hp64-category-pills" },
      { componentId: "hp64-bestsellers" },
      { componentId: "hp64-featured-collection" },
      { componentId: "hp64-offer-banner" },
      { componentId: "hp64-brand-story" },
      { componentId: "hp64-features-grid" },
      { componentId: "hp64-comparison-table" },
      { componentId: "hp64-instashop-gallery" },
      { componentId: "hp64-press-logos" },
      { componentId: "hp64-testimonials" },
      { componentId: "hp64-ugc-reels" },
      { componentId: "hp64-trust-badges" },
      { componentId: "hp64-usp" },
      { componentId: "hp64-faq" },
      { componentId: "hp64-newsletter" },
      { componentId: "hp64-video-banner" },
    ],
  },

  // ── 2. PRODUCT PAGES (PDP) ────────────────────────────────────────────────
  {
    id: "caratlane-solitaire-pdp",
    name: "CaratLane High-Converting Solitaire Product Page",
    category: "product",
    pageType: "product",
    niche: "jewellery",
    family: "Product Detail Page",
    styleTag: "🏷️ Sticky ATC + 4Cs Matrix",
    accentColor: "#d4af37",
    description: "100X CRO Fine Jewelry PDP: sticky mobile add-to-bag bar, 4Cs diamond clarity scale, live gold rate breakdown, pincode doorstep trial checker, and verified buyer photo reviews.",
    heroImg: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    badge: "⚡ HIGH-CONVERTING PDP",
    usageCount: "Used on 3,420 D2C stores",
    announcement: "caratlane-announcement",
    header: "caratlane-header",
    footer: "caratlane-footer",
    sections: [
      { componentId: "caratlane-pdp-main" },
      { componentId: "caratlane-trust-badges" },
      { componentId: "caratlane-pdp-reviews" },
      { componentId: "caratlane-pdp-recommendations" },
      { componentId: "caratlane-faq" },
    ],
  },

  // ── 3. COLLECTION PAGES (PLP) ─────────────────────────────────────────────
  {
    id: "caratlane-jewellery-plp",
    name: "CaratLane Luxury Fine Jewelry Collection Page",
    category: "collection",
    pageType: "collection",
    niche: "jewellery",
    family: "Product Listing Page",
    styleTag: "🛍️ Metal Tone Filters + Quick Add",
    accentColor: "#d4af37",
    description: "High-yield collection listing page: interactive metal tone pills (14K/18K Yellow/Rose/White Gold), price & carat filters, quick add-to-bag drawers, and category banner.",
    heroImg: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80",
    badge: "🛍️ SMART FILTER PLP",
    usageCount: "Used on 2,890 D2C stores",
    announcement: "caratlane-announcement",
    header: "caratlane-header",
    footer: "caratlane-footer",
    sections: [
      { componentId: "caratlane-plp-header" },
      { componentId: "caratlane-plp-grid" },
      { componentId: "caratlane-trust-badges" },
      { componentId: "caratlane-faq" },
    ],
  },

  // ── 4. LANDING PAGES ──────────────────────────────────────────────────────
  {
    id: "caratlane-festive-landing",
    name: "CaratLane Festive Diamond Festival Campaign Page",
    category: "landing",
    pageType: "page",
    niche: "jewellery",
    family: "Festive Sales Landing",
    styleTag: "🚀 Urgent Countdown + Flat 25% Off",
    accentColor: "#d4af37",
    description: "High-converting campaign landing page built for festive promotions, influencer launches, and VIP discount drops with live stock countdown and home trial booking.",
    heroImg: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    badge: "🔥 100X CAMPAIGN LANDING",
    usageCount: "Used on 5,120 D2C stores",
    announcement: "caratlane-announcement",
    header: "caratlane-header",
    footer: "caratlane-footer",
    sections: [
      { componentId: "caratlane-landing-festive" },
      { componentId: "caratlane-marquee" },
      { componentId: "caratlane-bestsellers-tabs" },
      { componentId: "caratlane-try-at-home" },
      { componentId: "caratlane-reviews" },
      { componentId: "caratlane-newsletter" },
    ],
  },

  // ── 5. CART PAGES & DRAWERS ───────────────────────────────────────────────
  {
    id: "caratlane-smart-cart",
    name: "CaratLane 100X Conversion Slide Cart & Cart Page",
    category: "cart",
    pageType: "cart",
    niche: "jewellery",
    family: "Cart & Checkout",
    styleTag: "🛒 Free Gift Progress + Insured Transit",
    accentColor: "#d4af37",
    description: "Conversion-optimized cart page featuring free insured shipping progress bar, instant coupon application, 1-click upsell add-ons, and doorstep delivery guarantee.",
    heroImg: "https://images.unsplash.com/photo-1611591475141-89d554a93cf4?w=800&q=80",
    badge: "🛒 SMART SLIDE CART",
    usageCount: "Used on 6,430 D2C stores",
    announcement: "caratlane-announcement",
    header: "caratlane-header",
    footer: "caratlane-footer",
    sections: [
      { componentId: "caratlane-cart-drawer" },
      { componentId: "caratlane-trust-badges" },
    ],
  },
];
