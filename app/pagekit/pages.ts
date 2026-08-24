/**
 * The page catalogue.
 *
 * One object per design. `sections` is the page top to bottom. Every id is
 * resolved before anything is written — first from the engine registry, then
 * from `dev-theme-peri/sections`, so a section authored a minute ago works
 * without a sync step. `npm run pagekit:check` runs the same resolution over
 * every page here and fails the build if any id resolves nowhere.
 *
 * That check is the point. `hp-v1-home` listed nine sections that existed in no
 * registry, applied "successfully", and rendered as a header and a footer with
 * nothing between them — no error on screen, none in the log.
 *
 * Adding a design means adding an object here. Nothing else.
 */

export type PageType = "index" | "product" | "collection" | "cart";

export interface PageDefinition {
  id: string;
  name: string;
  pageType: PageType;
  /** One line a merchant can judge it by before applying. */
  description: string;
  /** What it was designed for, shown as a tag. */
  niche: string;
  /** Top to bottom. */
  sections: string[];
  /** Sits in the header group, above the header. */
  announcement?: string;
  /**
   * Section groups are shared by every template in a theme, so these are
   * applied only on a real apply, never on a preview variant — otherwise
   * previewing one design would change the header on all of them.
   */
  header?: string;
  footer?: string;
  heroImg?: string;
  styleTag?: string;
}

export const PAGES: PageDefinition[] = [
  // --- 15 ULTRA CRO-OPTIMIZED GLOBAL NICHE PRODUCT PAGES (PP-1 to PP-15) ---
  {
    id: "pp-1-beauty-dermal",
    name: "Beauty & Dermal Skincare PDP",
    pageType: "product",
    description: "Ultra-converting beauty product page with clinical trial badges, color swatches, volume options & sticky cart.",
    niche: "Beauty & skincare",
    header: "header",
    announcement: "announcement-bar",
    sections: [
      "main-product-cro",
      "product-bundle-upsell",
      "product-spec-matrix",
      "product-ugc-reviews",
      "product-sticky-cart"
    ],
    footer: "footer"
  },
  {
    id: "pp-2-streetwear-heavy",
    name: "Heavyweight Streetwear PDP",
    pageType: "product",
    description: "Heavyweight drop product page with interactive size pill selector, sizing table & sticky buy bar.",
    niche: "Streetwear & apparel",
    header: "header",
    announcement: "announcement-bar",
    sections: [
      "main-product-cro",
      "main-product-cro",
      "product-bundle-upsell",
      "product-ugc-reviews",
      "product-sticky-cart"
    ],
    footer: "footer"
  },
  {
    id: "pp-3-jewellery-diamond",
    name: "Luxury Diamonds & Fine Jewellery PDP",
    pageType: "product",
    description: "High-end jewellery product page with karat selector, metal finish swatches & material proof.",
    niche: "Jewellery",
    header: "header",
    announcement: "announcement-bar",
    sections: [
      "main-product-cro",
      "product-spec-matrix",
      "product-spec-matrix",
      "product-ugc-reviews",
      "product-sticky-cart"
    ],
    footer: "footer"
  },
  {
    id: "pp-4-tech-cyber",
    name: "Cyber Techwear & Electronics PDP",
    pageType: "product",
    description: "Spec-focused electronics page with benchmark comparison table, warranty badge & sticky add-to-cart.",
    niche: "Tech & electronics",
    header: "header",
    announcement: "announcement-bar",
    sections: [
      "main-product-cro",
      "product-spec-matrix",
      "product-spec-matrix",
      "product-ugc-reviews",
      "product-sticky-cart"
    ],
    footer: "footer"
  },
  {
    id: "pp-5-denim-heritage",
    name: "Vintage Heavyweight Denim PDP",
    pageType: "product",
    description: "Textured vintage denim product page with cotton weight specs, fit guide & customer reviews.",
    niche: "Denim & apparel",
    header: "header",
    announcement: "announcement-bar",
    sections: [
      "main-product-cro",
      "product-spec-matrix",
      "product-bundle-upsell",
      "product-ugc-reviews",
      "product-sticky-cart"
    ],
    footer: "footer"
  },
  {
    id: "pp-6-supplements-clinical",
    name: "Clinical Wellness & Supplements PDP",
    pageType: "product",
    description: "Bio-active clinical supplement page with doctor endorsement, dosage calculator & bundle savings.",
    niche: "Supplements & health",
    header: "header",
    announcement: "announcement-bar",
    sections: [
      "main-product-cro",
      "product-spec-matrix",
      "product-ugc-reviews",
      "product-ugc-reviews",
      "product-sticky-cart"
    ],
    footer: "footer"
  },
  {
    id: "pp-7-activewear-apex",
    name: "Athletic Gym & Performance Fit PDP",
    pageType: "product",
    description: "Performance gym wear product page with sweat-wick tech specs, motion video reel & sticky checkout.",
    niche: "Activewear",
    header: "header",
    announcement: "announcement-bar",
    sections: [
      "main-product-cro",
      "main-product-cro",
      "product-bundle-upsell",
      "product-ugc-reviews",
      "product-sticky-cart"
    ],
    footer: "footer"
  },
  {
    id: "pp-8-superfood-organic",
    name: "Natural Superfood & Farm Wellness PDP",
    pageType: "product",
    description: "Farm-to-table superfood page with nutrition facts table, organic certification & bundle discount.",
    niche: "Food & wellness",
    header: "header",
    announcement: "announcement-bar",
    sections: [
      "main-product-cro",
      "product-bundle-upsell",
      "product-spec-matrix",
      "product-ugc-reviews",
      "product-sticky-cart"
    ],
    footer: "footer"
  },
  {
    id: "pp-9-minimal-decor",
    name: "Modern Interior Furniture PDP",
    pageType: "product",
    description: "Minimal interior product page with dimension blueprints, material swatches & UGC room photos.",
    niche: "Home & decor",
    header: "header",
    announcement: "announcement-bar",
    sections: [
      "main-product-cro",
      "product-spec-matrix",
      "product-spec-matrix",
      "product-ugc-reviews",
      "product-sticky-cart"
    ],
    footer: "footer"
  },
  {
    id: "pp-10-eyewear-luxury",
    name: "Designer Eyewear & Sunglasses PDP",
    pageType: "product",
    description: "High-fashion eyewear page with lens tint selector, UV protection specs & face shape guide.",
    niche: "Eyewear & fashion",
    header: "header",
    announcement: "announcement-bar",
    sections: [
      "main-product-cro",
      "product-spec-matrix",
      "product-bundle-upsell",
      "product-ugc-reviews",
      "product-sticky-cart"
    ],
    footer: "footer"
  },
  {
    id: "pp-11-fragrance-parfum",
    name: "Artisanal Eau de Parfum PDP",
    pageType: "product",
    description: "Artisanal fragrance product page with scent pyramid notes, longevity ratings & sample pack bundle.",
    niche: "Fragrance & parfum",
    header: "header",
    announcement: "announcement-bar",
    sections: [
      "main-product-cro",
      "product-spec-matrix",
      "product-spec-matrix",
      "product-ugc-reviews",
      "product-sticky-cart"
    ],
    footer: "footer"
  },
  {
    id: "pp-12-footwear-sole",
    name: "Ergonomic Sole Sneaker Drop PDP",
    pageType: "product",
    description: "Ergonomic footwear page with arch support specs, shoe size converter & sneakerhead drop timer.",
    niche: "Footwear & sneakers",
    header: "header",
    announcement: "announcement-bar",
    sections: [
      "main-product-cro",
      "main-product-cro",
      "product-bundle-upsell",
      "product-ugc-reviews",
      "product-sticky-cart"
    ],
    footer: "footer"
  },
  {
    id: "pp-13-baby-organic",
    name: "Certified Organic Baby Essentials PDP",
    pageType: "product",
    description: "Non-toxic organic baby product page with pediatrician seal, safety certs & subscription option.",
    niche: "Baby & kids",
    header: "header",
    announcement: "announcement-bar",
    sections: [
      "main-product-cro",
      "product-spec-matrix",
      "product-bundle-upsell",
      "product-ugc-reviews",
      "product-sticky-cart"
    ],
    footer: "footer"
  },
  {
    id: "pp-14-pet-nutrition",
    name: "Vet Approved Pet Care & Nutrition PDP",
    pageType: "product",
    description: "Veterinary approved pet food page with weight breed chart, natural ingredients & auto-ship delivery.",
    niche: "Pet care",
    header: "header",
    announcement: "announcement-bar",
    sections: [
      "main-product-cro",
      "product-spec-matrix",
      "product-bundle-upsell",
      "product-ugc-reviews",
      "product-sticky-cart"
    ],
    footer: "footer"
  },
  {
    id: "pp-15-coffee-roastery",
    name: "Single-Origin Artisanal Coffee PDP",
    pageType: "product",
    description: "Single-origin roast product page with grind size selector, roast level meter & fresh bean delivery.",
    niche: "Coffee & roastery",
    header: "header",
    announcement: "announcement-bar",
    sections: [
      "main-product-cro",
      "product-bundle-upsell",
      "product-spec-matrix",
      "product-ugc-reviews",
      "product-sticky-cart"
    ],
    footer: "footer"
  },

  // ── Home ───────────────────────────────────────────────────────────────
  {
    id: "peri-beauty",
    name: "Peri Beauty",
    pageType: "index",
    niche: "Beauty & skincare",
    description:
      "Soft hero, ingredient story, then bestsellers and reviews. Built for skincare and cosmetics.",
    header: "header-natural-v1",
    footer: "footer-natural-v1",
    sections: [
      "hp1-marquee",
      "hp1-hero",
      "hp1-usp",
      "hp1-category-tiles",
      "hp1-featured-collection",
      "hp1-founder-note",
      "hp1-brand-story",
      "hp1-bestsellers",
      "hp1-offer-banner",
      "hp1-testimonials",
      "hp1-ugc-reels",
      "hp1-press-logos",
      "hp1-faq",
      "hp1-newsletter",
    ],
  },
  {
    id: "rawblox-streetwear",
    name: "RAWBLOX — Urban Drop",
    pageType: "index",
    niche: "Streetwear",
    description:
      "Tabbed hero into a drop grid, manifesto, then proof. Built for streetwear releases.",
    header: "hp51-header",
    footer: "hp51-footer",
    sections: [
      "hp51-marquee",
      "hp51-hero-tabs",
      "hp51-new-drops",
      "hp51-category-tiles",
      "hp51-brand-story",
      "hp51-product-spotlight",
      "hp51-manifesto",
      "hp51-trust-grid",
      "hp51-cta-banner",
      "hp51-newsletter",
    ],
  },
  {
    id: "volt-streetwear-active",
    name: "VOLT — Heavyweight Streetwear",
    pageType: "index",
    niche: "Streetwear & Activewear",
    description:
      "450GSM cotton drop grid, marquee ticker, video reels, and heavy typography. Built for urban streetwear brands.",
    header: "hp51-header",
    footer: "hp51-footer",
    sections: [
      "hp2-hero",
      "hp2-usp",
      "hp2-marquee",
      "hp2-featured-collection",
      "hp2-category-pills",
      "hp2-bestsellers",
      "hp2-brand-story",
      "hp2-bundle-offer",
      "hp2-category-tiles",
      "hp2-offer-banner",
      "hp2-ugc-reels",
      "hp2-testimonials",
      "hp2-press-logos",
      "hp2-instagram",
      "hp2-faq",
      "hp2-founder-note",
      "hp2-newsletter",
    ],
  },
  {
    id: "maison-couture",
    name: "Maison — High Fashion & Luxury",
    pageType: "index",
    niche: "Luxury Apparel",
    description:
      "High fashion aesthetic, transparent header, large lookbook, and gold accent styling for couture brands.",
    header: "header-luxury-v1",
    footer: "footer-luxury-v1",
    sections: [
      "hp4-hero",
      "hp4-marquee",
      "hp4-usp",
      "hp4-category-tiles",
      "hp4-featured-collection",
      "hp4-category-pills",
      "hp4-brand-story",
      "hp4-bundle-offer",
      "hp4-bestsellers",
      "hp4-offer-banner",
      "hp4-ugc-reels",
      "hp4-press-logos",
      "hp4-testimonials",
      "hp4-instagram",
      "hp4-faq",
      "hp4-newsletter",
    ],
  },
  {
    id: "nordic-minimal-apparel",
    name: "Nordic — Minimal Clothing & Basics",
    pageType: "index",
    niche: "Minimal Apparel",
    description:
      "Clean, airy layout with generous whitespace, subtle category pills, and sustainable brand storytelling.",
    header: "header-minimal-v1",
    footer: "footer-minimal-v1",
    sections: [
      "hp6-hero",
      "hp6-marquee",
      "hp6-usp",
      "hp6-category-pills",
      "hp6-featured-collection",
      "hp6-category-tiles",
      "hp6-brand-story",
      "hp6-bestsellers",
      "hp6-offer-banner",
      "hp6-testimonials",
      "hp6-ugc-reels",
      "hp6-faq",
      "hp6-newsletter",
    ],
  },
  {
    id: "vintage-denim-co",
    name: "Heritage — Heavyweight Denim & Apparel",
    pageType: "index",
    niche: "Denim & Apparel",
    description:
      "Textured vintage look with craft storytelling, fit guide tiles, customer UGC gallery, and heritage footer.",
    header: "hp10-header",
    footer: "hp10-footer",
    sections: [
      "hp10-announcement-bar",
      "hp10-hero",
      "hp10-usp",
      "hp10-press-logos",
      "hp10-category-pills",
      "hp10-collection-list",
      "hp10-featured-products",
      "hp10-image-with-text",
      "hp10-rich-text",
      "hp10-testimonials",
      "hp10-instagram",
      "hp10-faq",
      "hp10-newsletter",
    ],
  },
  {
    id: "urban-monochrome-drop",
    name: "Monochrome — Urban Oversized Drops",
    pageType: "index",
    niche: "Urban Clothing",
    description:
      "Monochrome dark aesthetic, scrolling text ticker, oversized collection grid, and social proof reels.",
    header: "hp18-header",
    footer: "hp18-footer",
    sections: [
      "hp18-announcement-bar",
      "hp18-hero",
      "hp18-usp",
      "hp18-marquee",
      "hp18-category-pills",
      "hp18-collection-list",
      "hp18-featured-products",
      "hp18-image-with-text",
      "hp18-testimonial",
      "hp18-instagram",
      "hp18-scrolling-text",
      "hp18-faq",
      "hp18-newsletter",
    ],
  },
  {
    id: "d2c-archetype",
    name: "D2C Archetype",
    pageType: "index",
    niche: "Direct to consumer",
    description:
      "The full conversion stack: proof above the fold, two product bands, comparison, reviews, FAQ.",
    header: "header-bold-v1",
    footer: "footer-bold-v1",
    sections: [
      "hp50-marquee",
      "hp50-hero",
      "hp50-press-logos",
      "hp50-category-pills",
      "hp50-usp",
      "hp50-featured-collection",
      "hp50-brand-story",
      "hp50-bestsellers",
      "hp50-offer-banner",
      "hp50-comparison-table",
      "hp50-testimonials",
      "hp50-ugc-reels",
      "hp50-faq",
      "hp50-newsletter",
    ],
  },
  {
    id: "atelier-luxury",
    name: "Atelier",
    pageType: "index",
    niche: "Luxury & fashion",
    description:
      "Editorial and unhurried. Announcement, marquee, hero, categories, story, reviews, signup.",
    header: "hp19-header",
    footer: "footer-luxury-mega-v1",
    sections: [
      "hp19-announcement-bar",
      "hp19-marquee",
      "hp19-hero",
      "hp19-usp",
      "hp19-category-tiles",
      "hp19-featured-collection",
      "hp19-offer-banner",
      "hp19-brand-story",
      "hp19-bestsellers",
      "hp19-founder-note",
      "hp19-instagram",
      "hp19-testimonials",
      "hp19-press-logos",
      "hp19-faq",
      "hp19-newsletter",
    ],
  },
  {
    id: "caratlane-jewellery",
    name: "Carat — Fine Jewellery",
    pageType: "index",
    niche: "Jewellery",
    description:
      "Gift finder, solitaire feature and try-at-home. Built around considered, high-value purchases.",
    header: "caratlane-header",
    footer: "caratlane-footer",
    sections: [
      "caratlane-announcement",
      "caratlane-marquee",
      "caratlane-hero",
      "caratlane-categories",
      "caratlane-featured-solitaire",
      "caratlane-bestsellers-tabs",
      "caratlane-gift-finder",
      "caratlane-try-at-home",
      "caratlane-trust-badges",
      "caratlane-reviews",
      "caratlane-reels",
      "caratlane-faq",
      "caratlane-newsletter",
    ],
  },
  {
    id: "editorial-brutalist",
    name: "Editorial Brutalist",
    pageType: "index",
    niche: "Design-led brands",
    description:
      "Type-first and deliberately loud. Parallax, mosaic, lookbook and a stats counter.",
    header: "hp7-header",
    footer: "hp7-18-mega-footer",
    sections: [
      "hp7-01-announcement-bar",
      "hp7-02-hero-editorial",
      "hp7-03-marquee-brutalist",
      "hp7-04-editorial-columns",
      "hp7-05-product-spotlight",
      "hp7-06-parallax-image",
      "hp7-07-collection-mosaic",
      "hp7-09-shoppable-lookbook",
      "hp7-10-stats-counter",
      "hp7-08-testimonial-cards",
      "hp7-12-logo-ticker",
      "hp7-15-instagram-grid",
      "hp7-13-faq-accordion",
      "hp7-16-newsletter-editorial",
    ],
  },
  {
    id: "bento-modern",
    name: "Bento Modern",
    pageType: "index",
    niche: "Lifestyle & homeware",
    description:
      "A bento tile grid does the merchandising, with video and social proof underneath.",
    header: "hp8-header",
    footer: "hp8-footer",
    sections: [
      "hp8-announcement-bar",
      "hp8-hero",
      "hp8-marquee",
      "hp8-bento-tiles",
      "hp8-usp",
      "hp8-featured-products",
      "hp8-video-section",
      "hp8-brand-story",
      "hp8-bestsellers",
      "hp8-offer-banner",
      "hp8-testimonials",
      "hp8-instagram",
      "hp8-press-logos",
      "hp8-faq",
    ],
  },
  {
    id: "tech-flagship",
    name: "Tech Flagship",
    pageType: "index",
    niche: "Electronics & gadgets",
    description:
      "Spec-led. Image banner, comparison table, blog and a contact form for pre-sales questions.",
    header: "hp9-header",
    footer: "hp9-footer",
    sections: [
      "hp9-announcement-bar",
      "hp9-hero",
      "hp9-scrolling-text",
      "hp9-usp",
      "hp9-featured-products",
      "hp9-image-banner",
      "hp9-image-with-text",
      "hp9-comparison-table",
      "hp9-video",
      "hp9-bestsellers",
      "hp9-testimonials",
      "hp9-press-logos",
      "hp9-featured-blog",
      "hp9-faq",
      "hp9-newsletter",
    ],
  },
  {
    id: "lookbook-lifestyle",
    name: "Lookbook",
    pageType: "index",
    niche: "Apparel",
    description:
      "Shot-driven. Lookbook and guarantee bands framing the product grid, blog at the foot.",
    header: "hp12-header",
    footer: "hp12-footer",
    sections: [
      "hp12-announcement-bar",
      "hp12-hero",
      "hp12-marquee",
      "hp12-category-pills",
      "hp12-featured-products",
      "hp12-lookbook",
      "hp12-image-with-text",
      "hp12-guarantee",
      "hp12-bestsellers",
      "hp12-comparison-table",
      "hp12-testimonial",
      "hp12-instagram",
      "hp12-blog-posts",
      "hp12-faq",
      "hp12-newsletter",
    ],
  },
  {
    id: "organic-botanica",
    name: "Organic Botanica",
    pageType: "index",
    niche: "Food, wellness & naturals",
    description:
      "Warm and unhurried, with a countdown, gallery and map for brands that sell somewhere real.",
    header: "header-natural-v1",
    footer: "hp20-18-footer-promo",
    sections: [
      "hp20-01-hero",
      "hp20-02-marquee",
      "hp20-03-featured-collection",
      "hp20-04-image-with-text",
      "hp20-05-logo-list",
      "hp20-17-countdown",
      "hp20-06-rich-text",
      "hp20-07-video-banner",
      "hp20-09-collection-list",
      "hp20-08-testimonials",
      "hp20-16-gallery",
      "hp20-12-blog-posts",
      "hp20-13-faq",
      "hp20-15-map",
      "hp20-10-newsletter",
    ],
  },
  {
    id: "wellness-clinical",
    name: "Clinical Wellness",
    pageType: "index",
    niche: "Supplements & health",
    description:
      "Evidence-forward: features grid, comparison, trust badges and reviews before the signup.",
    header: "header-minimal-v1",
    footer: "footer-minimal-v1",
    sections: [
      "hp45-marquee",
      "hp45-hero",
      "hp45-usp",
      "hp45-press-logos",
      "hp45-featured-collection",
      "hp45-features-grid",
      "hp45-brand-story",
      "hp45-video-banner",
      "hp45-comparison-table",
      "hp45-bestsellers",
      "hp45-trust-badges",
      "hp45-testimonials",
      "hp45-instashop-gallery",
      "hp45-offer-banner",
      "hp45-faq",
      "hp45-newsletter",
    ],
  },
  {
    id: "hpv6-conversion",
    name: "Conversion Six",
    pageType: "index",
    niche: "General retail",
    description:
      "A safe, complete default: logos, value props, shoppable image, video, reviews, blog, signup.",
    header: "header-commerce-v2",
    footer: "hpv6-18-footer",
    sections: [
      "hpv6-01-announcement",
      "hpv6-02-hero",
      "hpv6-03-logo-list",
      "hpv6-04-value-props",
      "hpv6-05-featured-collection",
      "hpv6-06-image-with-text",
      "hpv6-07-marquee",
      "hpv6-09-shoppable-image",
      "hpv6-10-video-banner",
      "hpv6-13-product-highlight",
      "hpv6-11-collection-list",
      "hpv6-08-testimonial-slider",
      "hpv6-12-text-columns",
      "hpv6-15-blog-posts",
      "hpv6-16-instagram-feed",
      "hpv6-14-accordion-faq",
      "hpv6-17-newsletter",
    ],
  },

  // ── Product ────────────────────────────────────────────────────────────
  // These are single full-page sections rather than stacks: each one is a
  // complete product page including gallery, buy box and the bands below it.
  {
    id: "product-skincare",
    name: "Skincare PDP",
    pageType: "product",
    niche: "Beauty & skincare",
    description: "Ingredient list, routine steps and reviews under a soft gallery.",
    sections: ["pdp-v1"],
  },
  {
    id: "product-apparel",
    name: "Apparel PDP",
    pageType: "product",
    niche: "Apparel",
    description: "Size guidance and fit notes beside a large gallery. Built for clothing.",
    sections: ["pdp-v5"],
  },
  {
    id: "product-activewear",
    name: "Activewear PDP",
    pageType: "product",
    niche: "Activewear",
    description: "Performance claims and material breakdown, with a sticky buy bar on mobile.",
    sections: ["pdp-v12"],
  },
  {
    id: "product-funnel",
    name: "Mega Funnel PDP",
    pageType: "product",
    niche: "Direct to consumer",
    description: "The long-form page: bundles, comparison, guarantee and reviews stacked.",
    sections: ["pdp-v20"],
  },
  {
    id: "product-tactical",
    name: "Tactical PDP",
    pageType: "product",
    niche: "Gear & outdoors",
    description: "Dark, spec-heavy layout for tools, gear and equipment.",
    sections: ["pdp-v33"],
  },
  {
    id: "product-jewellery",
    name: "Jewellery PDP",
    pageType: "product",
    niche: "Jewellery",
    description: "Certification, sizing and try-at-home, with recommendations below.",
    sections: ["caratlane-pdp-main", "caratlane-pdp-reviews", "caratlane-pdp-recommendations"],
  },

  // ── Collection ─────────────────────────────────────────────────────────
  {
    id: "collection-clean",
    name: "Clean Grid",
    pageType: "collection",
    niche: "Beauty & skincare",
    description: "Light, roomy product grid with filters in a sidebar.",
    sections: ["cp-v1"],
  },
  {
    id: "collection-nordic",
    name: "Nordic Minimal",
    pageType: "collection",
    niche: "Lifestyle & homeware",
    description: "Restrained typography, generous whitespace, two columns on mobile.",
    sections: ["cp-v6"],
  },
  {
    id: "collection-artisanal",
    name: "Artisanal",
    pageType: "collection",
    niche: "Food & drink",
    description: "Warm, textured grid for makers and small-batch catalogues.",
    sections: ["cp-v14"],
  },
  {
    id: "collection-performance",
    name: "Performance",
    pageType: "collection",
    niche: "Activewear",
    description: "Dense grid with quick-add and colour swatches on the card.",
    sections: ["cp-v55"],
  },
];

// ── The designs that already existed ─────────────────────────────────────

import { STORE_PAGE_TEMPLATES } from "../data/page-templates";

/**
 * Adapts the 51 designs from the old builder into page definitions.
 *
 * They are adapted rather than copied so there is one list, not two that drift.
 * The old screen offered these with a stock photo for a thumbnail and an apply
 * path that wrote the live home page during preview; the designs themselves are
 * fine, and every one of them passes `pagekit:check`.
 *
 * `pageType` is narrowed here because the old list also carries types PageKit
 * does not apply, and silently mapping those to "index" would put a cart design
 * on someone's home page.
 */
const ADAPTED: PageDefinition[] = (STORE_PAGE_TEMPLATES as any[])
  .filter(t => ["index", "product", "collection", "cart"].includes(t?.pageType))
  .map(t => ({
    id: t.id,
    name: t.name,
    pageType: t.pageType as PageType,
    niche: t.niche || "General retail",
    description: t.description || "",
    sections: (t.sections || []).map((s: any) => s.componentId).filter(Boolean),
    announcement: t.announcement || undefined,
    header: t.header || undefined,
    footer: t.footer || undefined,
    heroImg: t.heroImg || undefined,
    styleTag: t.styleTag || undefined,
  }))
  .filter(p => p.sections.length > 0);

/** Hand-authored first, then the adapted ones. Ids are unique across both. */
export const ALL_PAGES: PageDefinition[] = [
  ...PAGES,
  ...ADAPTED.filter(a => !PAGES.some(p => p.id === a.id)),
];

export function pagesFor(pageType: PageType): PageDefinition[] {
  return ALL_PAGES.filter(p => p.pageType === pageType);
}

export function pageById(id: string): PageDefinition | undefined {
  return ALL_PAGES.find(p => p.id === id);
}

/** Tabs, in the order they are shown. Only types that have designs appear. */
export const PAGE_TYPES: Array<{ id: PageType; label: string }> = [
  { id: "index", label: "Home" },
  { id: "product", label: "Product" },
  { id: "collection", label: "Collection" },
];
