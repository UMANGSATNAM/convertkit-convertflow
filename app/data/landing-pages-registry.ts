export interface LandingPageSectionDef {
  componentId: string;
  role: string;
  title: string;
}

export interface LandingPageDefinition {
  id: string;
  name: string;
  niche: string;
  nicheLabel: string;
  badge: string;
  tagline: string;
  description: string;
  accentColor: string;
  heroImg: string;
  stats: string;
  conversionFeatures: string[];
  palette: {
    background: string;
    text: string;
    primary: string;
    accent: string;
  };
  announcement: string;
  header: string;
  footer: string;
  sections: LandingPageSectionDef[];
}

export const D2C_LANDING_PAGES: LandingPageDefinition[] = [
  // ── 1. LUMIÈRE · Organic Skincare & Clean Beauty ──────────────────────────
  {
    id: "landing-skincare",
    name: "LUMIÈRE · Organic Skincare & Clean Beauty",
    niche: "beauty",
    nicheLabel: "Beauty & Skincare",
    badge: "✨ 100% ORGANIC & CLINICAL PROOF",
    tagline: "Cellular hydration meets cold-pressed botanical oils",
    description: "Award-winning organic skincare storefront featuring a 14-day clinical radiance proof slider, interactive category bubbles, serum bundle builder, Us vs Them comparison matrix, and verified buyer reviews.",
    accentColor: "#C97A63",
    heroImg: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=85",
    stats: "4.92★ (3,400+ Verified Reviews) · 68% Repeat Customer Rate",
    conversionFeatures: [
      "14-Day Clinical Before/After Proof Slider",
      "Interactive Category Story Bubbles",
      "Quick-Add Serum Product Cards",
      "Morning & Evening Ritual Bundle (FBT)",
      "Us vs Conventional Skincare Comparison Matrix",
      "Summer Hydration Vault 25% Off Bento Offer",
      "Sticky Dynamic Add-to-Cart Bar",
      "Objection-Buster FAQ Accordion"
    ],
    palette: {
      background: "#FDFBF7",
      text: "#1C1917",
      primary: "#C97A63",
      accent: "#EADBC8"
    },
    announcement: "announcement-marquee",
    header: "header-sticky-glass",
    footer: "footer-newsletter-focus",
    sections: [
      { componentId: "hero-editorial-brand", role: "hero", title: "Botanical Cellular Radiance Hero" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "Clean Formula Pledges & Press Coverage" },
      { componentId: "category-story-bubbles", role: "categories", title: "Shop by Botanical Concern" },
      { componentId: "product-card-quickadd", role: "products", title: "Award-Winning Botanical Serums" },
      { componentId: "cf-before-after-slider", role: "proof", title: "14-Day Clinical Radiance Proof" },
      { componentId: "pdp-bundle-fbt", role: "bundle", title: "Morning & Evening Ritual 2-Step Bundle" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Why Choose Lumière Over Conventional Brands" },
      { componentId: "offer-bento-grid", role: "offer", title: "Summer Hydration Vault 25% Off" },
      { componentId: "cf-verified-reviews", role: "reviews", title: "Verified Customer Reviews" },
      { componentId: "pdp-sticky-atc", role: "sticky-atc", title: "Sticky Instant Purchase Bar" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Clean Ingredients & Sensitivities FAQ" }
    ]
  },

  // ── 2. KINETIC · High-Performance Streetwear ──────────────────────────────
  {
    id: "landing-streetwear",
    name: "KINETIC · Heavyweight Technical Streetwear",
    niche: "streetwear",
    nicheLabel: "Streetwear & Apparel",
    badge: "🔥 480GSM FRENCH TERRY & WATERPROOF NYLON",
    tagline: "Architectural silhouettes engineered for urban exploration",
    description: "High-voltage dark streetwear showcase with live drop countdown, technical 480GSM fabric breakdown, lookbook masonry, comparison table, and instant sticky checkout.",
    accentColor: "#22C55E",
    heroImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=85",
    stats: "Drop 07 Sold Out in 8 Minutes · 50,000+ Discord Community",
    conversionFeatures: [
      "Drop 08 Live Ticking Urgency Timer",
      "Technical 480GSM Fabric Breakdown",
      "Editorial Lookbook Masonry Gallery",
      "Instant Hover Size-Picker Cards",
      "Heavyweight vs Fast Fashion Comparison",
      "Sticky Dynamic Add-to-Cart Bar",
      "VIP Vault Drop Access Offer"
    ],
    palette: {
      background: "#09090B",
      text: "#FAFAFA",
      primary: "#22C55E",
      accent: "#27272A"
    },
    announcement: "announcement-countdown",
    header: "header-megamenu",
    footer: "footer-multi-column",
    sections: [
      { componentId: "hero-split-luxury", role: "hero", title: "Drop 08 Heavyweight Technical Outerwear" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "Fabric Specs & Hypebeast Press" },
      { componentId: "category-masonry-lookbook", role: "categories", title: "Core Disciplines & Outerwear" },
      { componentId: "product-card-badge-sale", role: "products", title: "Limited Run 480GSM Hoodies" },
      { componentId: "pdp-bundle-fbt", role: "bundle", title: "Complete Streetwear Layering Kit" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "480GSM Heavyweight vs Fast Fashion Fleece" },
      { componentId: "offer-countdown-sale", role: "offer", title: "VIP Access Drop Countdown 30% Off" },
      { componentId: "cf-verified-reviews", role: "reviews", title: "Verified Buyer Fit Reviews" },
      { componentId: "pdp-sticky-atc", role: "sticky-atc", title: "Sticky Instant Purchase Bar" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Sizing & International Customs FAQ" }
    ]
  },

  // ── 3. AURELIA · Haute Horlogerie & Fine Jewellery ────────────────────────
  {
    id: "landing-jewelry",
    name: "AURELIA · Heritage Diamonds & Swiss Horology",
    niche: "jewelry",
    nicheLabel: "Luxury Jewelry & Watches",
    badge: "👑 GIA CERTIFIED CONFLICT-FREE DIAMONDS",
    tagline: "A century of master lapidary art and timeless luxury",
    description: "Prestige luxury storefront with centered serif monogram navigation, macro brilliance photography, bespoke bridal concierge, white-glove armored delivery guarantee, and private appointments.",
    accentColor: "#D4AF37",
    heroImg: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=85",
    stats: "100% Conflict-Free Sourcing · Lifetime Lapidary Warranty",
    conversionFeatures: [
      "Diamond Carat & Metal Selector",
      "Private Salon Consultation Booking",
      "White-Glove Armored Courier Assurance",
      "Hallmark Authenticity Guarantee",
      "Dual-Poster Bespoke Bridal Showcase",
      "Sticky Concierge Add-to-Cart Bar"
    ],
    palette: {
      background: "#0C0A09",
      text: "#F5F5F4",
      primary: "#D4AF37",
      accent: "#1C1917"
    },
    announcement: "announcement-countdown",
    header: "header-centered-brand",
    footer: "footer-minimal-centered",
    sections: [
      { componentId: "hero-split-luxury", role: "hero", title: "Heritage Solitaire & Pavé Diamond Collection" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "GIA Conflict-Free Guarantee & Robb Report Press" },
      { componentId: "category-minimal-tiles", role: "categories", title: "Curated High Jewellery Suites" },
      { componentId: "product-card-minimal", role: "products", title: "Hand-Set Solitaires & Masterpieces" },
      { componentId: "pdp-bundle-fbt", role: "bundle", title: "Earring & Necklace Diamond Suite" },
      { componentId: "offer-dual-poster", role: "offer", title: "Bespoke Bridal Salon Private Invitation" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Ethical Lab & Mined Diamonds vs Mass Market" },
      { componentId: "cf-verified-reviews", role: "reviews", title: "Verified Collector Testimonials" },
      { componentId: "pdp-sticky-atc", role: "sticky-atc", title: "Sticky Concierge Purchase Bar" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Insured Armored Transit & Resizing FAQ" }
    ]
  },

  // ── 4. NEXUS · Spatial Audio & Cyber Electronics ──────────────────────────
  {
    id: "landing-audio-tech",
    name: "NEXUS · Next-Gen Spatial Audio & Cyber Tech",
    niche: "electronics",
    nicheLabel: "Audio Tech & Electronics",
    badge: "⚡ 48HR PLAYTIME · ZERO-LATENCY DSP",
    tagline: "Acoustic engineering tuned for audiophiles and pro creators",
    description: "Cutting-edge dark cyber audio landing page featuring 3D driver explode views, side-by-side spec comparison table, companion mobile app showcase, developer discount, and sticky checkout.",
    accentColor: "#06B6D4",
    heroImg: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85",
    stats: "50,000+ Units Shipped · 99.4% Latency-Free Audio Score",
    conversionFeatures: [
      "Exploded 3D Acoustic Driver View",
      "Side-by-Side Industry Spec Matrix",
      "Instant Tech Voucher Coupon Strip",
      "Companion iOS/Android App Portal",
      "Multi-Point Bluetooth 5.4 Switcher",
      "Sticky Dynamic Add-to-Cart Bar"
    ],
    palette: {
      background: "#0B0F19",
      text: "#F8FAFC",
      primary: "#06B6D4",
      accent: "#1E293B"
    },
    announcement: "announcement-marquee",
    header: "header-sticky-glass",
    footer: "footer-ecommerce-app",
    sections: [
      { componentId: "hero-high-conversion", role: "hero", title: "Nexus Pro Wireless Over-Ear Spatial Sound" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "Lossless DSP Specs & TechRadar Recommendations" },
      { componentId: "category-bento-cards", role: "categories", title: "Audio Ecosystem & DAC Amps" },
      { componentId: "product-card-quickadd", role: "products", title: "Hardware Flagships & Studio Monitors" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Nexus Pro DSP vs Traditional Flagships" },
      { componentId: "pdp-bundle-fbt", role: "bundle", title: "Nexus Pro + Hard Travel Case + DAC" },
      { componentId: "offer-coupon-strip", role: "offer", title: "Developer Promo Code: CYBER25" },
      { componentId: "cf-verified-reviews", role: "reviews", title: "Audiophile & Producer Reviews" },
      { componentId: "pdp-sticky-atc", role: "sticky-atc", title: "Sticky Instant Purchase Bar" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Firmware Updates & Bluetooth 5.4 FAQ" }
    ]
  },

  // ── 5. VERDANT · Nootropic Wellness & Botanical Adaptogens ────────────────
  {
    id: "landing-wellness",
    name: "VERDANT · Nootropic Wellness & Botanical Health",
    niche: "wellness",
    nicheLabel: "Wellness & Supplements",
    badge: "🌿 100% USDA ORGANIC & 3RD-PARTY LAB TESTED",
    tagline: "Clinical adaptogens for deep sleep, all-day focus, and cellular longevity",
    description: "High-trust supplement landing page with transparent sourcing maps, physician endorsements, bundle savings calculator, before/after cognitive proof, and risk-free 60-day guarantee.",
    accentColor: "#4A7C59",
    heroImg: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=85",
    stats: "Over 1.2M Daily Doses Served · 98% Bio-Availability",
    conversionFeatures: [
      "Third-Party Certificate of Analysis",
      "Interactive Routine Quiz Builder",
      "Morning + Night Dual Bundle Saver (FBT)",
      "30-Day Cognitive Vitality Proof Slider",
      "Functional Doctor Endorsements",
      "Sticky Dynamic Subscribe & Save Bar"
    ],
    palette: {
      background: "#F7F6F2",
      text: "#1E3A2F",
      primary: "#4A7C59",
      accent: "#E8EDE0"
    },
    announcement: "announcement-marquee",
    header: "header-promo-embedded",
    footer: "footer-newsletter-focus",
    sections: [
      { componentId: "hero-editorial-brand", role: "hero", title: "Daily Bio-Available Nootropic Tonics" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "USDA Organic & 3rd-Party Lab Certifications" },
      { componentId: "category-story-bubbles", role: "categories", title: "Shop by Desired Health Outcome" },
      { componentId: "product-card-trust", role: "products", title: "Clinically Validated Adaptogen Elixirs" },
      { componentId: "cf-before-after-slider", role: "proof", title: "30-Day Cognitive Vitality & Focus Proof" },
      { componentId: "pdp-bundle-fbt", role: "bundle", title: "Morning Focus + Deep Sleep Duo (Save $22)" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Wildcrafted Botanical Extract vs Synthetic Pills" },
      { componentId: "offer-discount-ribbon", role: "offer", title: "Complimentary Amber Jar With Starter Kit" },
      { componentId: "cf-verified-reviews", role: "reviews", title: "Verified Customer Health Reviews" },
      { componentId: "pdp-sticky-atc", role: "sticky-atc", title: "Sticky Subscribe & Save Bar" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Dosage, Cycle Timing & Purity FAQ" }
    ]
  },

  // ── 6. NORDIC LIVING · Scandinavian Furniture & Warm Decor ────────────────
  {
    id: "landing-nordic-home",
    name: "NORDIC LIVING · Scandinavian Furniture & Living",
    niche: "home",
    nicheLabel: "Home Decor & Furniture",
    badge: "🛋 FSC-CERTIFIED SOLID EUROPEAN OAK",
    tagline: "Thoughtful Scandinavian proportions crafted for mindful sanctuaries",
    description: "Serene Scandinavian interior storefront featuring interactive 'Shop the Room' lookbooks, fabric swatch postal ordering, solid hardwood joinery, white-glove setup, and sticky reserve.",
    accentColor: "#B88E72",
    heroImg: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=85",
    stats: "10-Year Frame Warranty · 100% OEKO-TEX Certified Fabrics",
    conversionFeatures: [
      "Interactive 'Shop the Room' Tags",
      "Free Fabric Swatch Home Kit Box",
      "White-Glove Room Delivery & Assembly",
      "Solid Hardwood Joinery Certifications",
      "Architectural Digest Press Review",
      "Sticky Dynamic Add-to-Cart Bar"
    ],
    palette: {
      background: "#F9F8F6",
      text: "#2B2927",
      primary: "#B88E72",
      accent: "#EFECE6"
    },
    announcement: "announcement-countdown",
    header: "header-minimal-inline",
    footer: "footer-multi-column",
    sections: [
      { componentId: "hero-minimal-clean", role: "hero", title: "The Stockholm Modular Living Series" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "Solid European Oak & Architectural Digest Press" },
      { componentId: "category-minimal-tiles", role: "categories", title: "Explore Rooms & Curated Living Spaces" },
      { componentId: "product-card-minimal", role: "products", title: "Signature Seating & Ambient Lighting" },
      { componentId: "offer-dual-poster", role: "offer", title: "Order Free Fabric & Wood Swatch Box" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Hand-Joined Hardwood vs Flat-Pack Particle Board" },
      { componentId: "pdp-bundle-fbt", role: "bundle", title: "Armchair + Wool Throw + Side Table Bundle" },
      { componentId: "cf-verified-reviews", role: "reviews", title: "Homeowner & Designer Testimonials" },
      { componentId: "pdp-sticky-atc", role: "sticky-atc", title: "Sticky Instant Reserve Bar" },
      { componentId: "cf-faq-accordion", role: "faq", title: "White-Glove Delivery & Assembly FAQ" }
    ]
  },

  // ── 7. ZEST & CO. · Cold-Brew & Functional Sparkling Beverages ────────────
  {
    id: "landing-beverages",
    name: "ZEST & CO. · Artisanal Cold-Brew & Tonics",
    niche: "beverage",
    nicheLabel: "D2C Food & Beverage",
    badge: "🍊 0G SUGAR · REAL FRUIT · FRESH ON ICE",
    tagline: "Cold-extracted single-origin coffee infused with organic citrus",
    description: "High-energy beverage store with custom variety pack builder, flavor wheel tasting notes, ice-chilled courier delivery, TikTok viral taste test highlights, and sticky checkout.",
    accentColor: "#FF5722",
    heroImg: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=85",
    stats: "2,500,000+ Cans Sipped · 100% Recyclable Aluminum",
    conversionFeatures: [
      "Custom 12-Pack Flavor Box Builder",
      "Aroma & Acidity Tasting Notes",
      "Eco-Insulated Cold Shipping Pledges",
      "Subscribe for 15% Off & Free Can Holder",
      "Store Locator & Stockist Map",
      "Sticky Dynamic Add-to-Cart Bar"
    ],
    palette: {
      background: "#FFFDF7",
      text: "#1F1A17",
      primary: "#FF5722",
      accent: "#FFE9D6"
    },
    announcement: "announcement-marquee",
    header: "header-megamenu",
    footer: "footer-trust-badges",
    sections: [
      { componentId: "hero-split-luxury", role: "hero", title: "Single-Origin Nitro Cold-Brew on Ice" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "0g Sugar, Real Fruit & Food & Wine Best in Class" },
      { componentId: "category-slider-rail", role: "categories", title: "Explore Brews, Tonics & Sparkling Teas" },
      { componentId: "product-card-swatches", role: "products", title: "Variety Packs & Ready-to-Drink Cans" },
      { componentId: "offer-bento-grid", role: "offer", title: "Build Your 12-Can Taster Box for $28" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Cold-Extracted Arabica vs Sugar-Packed Energy Drinks" },
      { componentId: "pdp-bundle-fbt", role: "bundle", title: "12-Can Case + Insulated Thermal Tumbler" },
      { componentId: "cf-verified-reviews", role: "reviews", title: "Customer Tasting Reviews" },
      { componentId: "pdp-sticky-atc", role: "sticky-atc", title: "Sticky Instant Purchase Bar" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Shelf Life, Caffeine Levels & Cold Delivery FAQ" }
    ]
  },

  // ── 8. APEX PERFORMANCE · Elite Athletic Wear & Conditioning ──────────────
  {
    id: "landing-fitness",
    name: "APEX PERFORMANCE · Elite Athletic Conditioning Gear",
    niche: "fitness",
    nicheLabel: "Fitness & Activewear",
    badge: "⚡ AEROMESH™ 4-WAY COMPRESSION",
    tagline: "Engineered for record breakers, weightlifters, and marathon runners",
    description: "Aggressive athletic landing page equipped with 30-day wear trial pledge, lab thermal breathability maps, size recommendation engine, athlete PR reels, and sticky checkout.",
    accentColor: "#F59E0B",
    heroImg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&q=85",
    stats: "15 Olympic Athletes Endorsed · 30-Day Sweat Trial Guarantee",
    conversionFeatures: [
      "Thermal Breathability Heat-Map Proof",
      "Squat-Proof 4-Way Stretch Pledges",
      "Quick-Add Performance Size Selector",
      "Complete Conditioning Training Kit (FBT)",
      "Athlete PR Showcase Video Reels",
      "Sticky Dynamic Add-to-Cart Bar"
    ],
    palette: {
      background: "#121212",
      text: "#FAFAFA",
      primary: "#F59E0B",
      accent: "#1F1F1F"
    },
    announcement: "announcement-marquee",
    header: "header-sticky-glass",
    footer: "footer-multi-column",
    sections: [
      { componentId: "hero-video-poster", role: "hero", title: "Velocity Seamless 4-Way Compression Series" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "AeroMesh™ Technology & Men's Health Gear of the Year" },
      { componentId: "category-story-bubbles", role: "categories", title: "Shop by Sport Discipline" },
      { componentId: "product-card-badge-sale", role: "products", title: "Competition-Grade Apparel & Shorts" },
      { componentId: "pdp-bundle-fbt", role: "bundle", title: "Complete Athlete Conditioning Kit (Save $34)" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "AeroMesh Compression vs Cheap Polyester Activewear" },
      { componentId: "offer-countdown-sale", role: "offer", title: "Pre-Season Training Kit Bundle 30% Off" },
      { componentId: "cf-verified-reviews", role: "reviews", title: "CrossFit & Marathon Runner Reviews" },
      { componentId: "pdp-sticky-atc", role: "sticky-atc", title: "Sticky Instant Purchase Bar" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Size Matching, Squat Proofing & Sweat Trial FAQ" }
    ]
  },

  // ── 9. PAWS & TAIL · Holistic Pet Nutrition & Accessories ─────────────────
  {
    id: "landing-pet-care",
    name: "PAWS & TAIL · Holistic Pet Nutrition & Wellness",
    niche: "pets",
    nicheLabel: "Pet Care & Nutrition",
    badge: "🐾 100% HUMAN-GRADE INGREDIENTS · VET CERTIFIED",
    tagline: "Wholesome freeze-dried raw meals dogs crave and vets recommend",
    description: "Heartwarming, high-conversion pet food storefront featuring a breed meal calculator, before/after coat transformation photos, picky eater guarantee, and monthly auto-ship discount.",
    accentColor: "#D97706",
    heroImg: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1200&q=85",
    stats: "150,000+ Happy Tails · 4.96★ Average Pet Parent Rating",
    conversionFeatures: [
      "Breed & Weight Calorie Calculator",
      "100% Clean Human-Grade Meat Pledges",
      "Before/After Coat Health & Shine Proof",
      "Picky Eater Empty Bowl Guarantee",
      "Subscribe & Save 25% On Auto-Ship",
      "Sticky Dynamic Add-to-Cart Bar"
    ],
    palette: {
      background: "#FDFBF7",
      text: "#2D3A2F",
      primary: "#D97706",
      accent: "#F5EBE1"
    },
    announcement: "announcement-marquee",
    header: "header-promo-embedded",
    footer: "footer-trust-badges",
    sections: [
      { componentId: "hero-high-conversion", role: "hero", title: "Pasture-Raised Freeze-Dried Raw Superfood" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "100% Human-Grade Meat & PetMD Veterinarian Approved" },
      { componentId: "category-bento-cards", role: "categories", title: "Meal Toppers, Raw Bites & Dental Chews" },
      { componentId: "product-card-trust", role: "products", title: "Best-Selling Raw Superfood Blends" },
      { componentId: "cf-before-after-slider", role: "proof", title: "Coat Shine & Digestion Vitality Transformation" },
      { componentId: "pdp-bundle-fbt", role: "bundle", title: "Starter Raw Box + Omega-3 Salmon Oil Booster" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Freeze-Dried Raw Superfood vs High-Heat Extruded Kibble" },
      { componentId: "offer-coupon-strip", role: "offer", title: "Code HAPPYTAIL for 30% Off Your First Box" },
      { componentId: "cf-verified-reviews", role: "reviews", title: "Happy Pet Parents Reviews" },
      { componentId: "pdp-sticky-atc", role: "sticky-atc", title: "Sticky Subscribe Dog Box Bar" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Food Transitioning & Breed Calorie FAQ" }
    ]
  },

  // ── 10. ATELIER TERRA · Handcrafted Stoneware & Ceramic Living ───────────
  {
    id: "landing-ceramics",
    name: "ATELIER TERRA · Handcrafted Stoneware & Studio Living",
    niche: "artisan",
    nicheLabel: "Artisan & Handcrafted Goods",
    badge: "🏺 1280°C WOOD KILN FIRED · FOOD SAFE GLAZES",
    tagline: "Small-batch ceramic vessels shaped slowly by master potters",
    description: "Poetic artisanal storefront celebrating slow-living ceramics with drop notifications, individual glaze variation showcases, microwave/dishwasher safety, and studio gift wrapping.",
    accentColor: "#C26D53",
    heroImg: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1200&q=85",
    stats: "Small Batch of 250 Pieces Per Kiln Firing · Zero Plastic Packaging",
    conversionFeatures: [
      "Studio Kiln Firing Drop Ticker",
      "Unique Glaze & Clay Provenance Details",
      "Lead-Free Dishwasher Safe Seals",
      "Gift-Ready Studio Box Packaging",
      "Dual-Poster Dinnerware Set for Two Offer",
      "Sticky Dynamic Add-to-Cart Bar"
    ],
    palette: {
      background: "#FBF8F4",
      text: "#362E2B",
      primary: "#C26D53",
      accent: "#EFE8DE"
    },
    announcement: "announcement-countdown",
    header: "header-centered-brand",
    footer: "footer-minimal-centered",
    sections: [
      { componentId: "hero-editorial-brand", role: "hero", title: "Small-Batch Ceramic Vessels Shaped by Hand" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "1280°C High-Fire Stoneware & Kinfolk Magazine Feature" },
      { componentId: "category-story-bubbles", role: "categories", title: "Vessels, Dinnerware & Pour-Overs" },
      { componentId: "product-card-minimal", role: "products", title: "Studio Kiln Drop 04 Pieces" },
      { componentId: "offer-dual-poster", role: "offer", title: "Artisan Dinnerware Set for Two Gift Box" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Studio Kiln Stoneware vs Factory Ceramic Moulds" },
      { componentId: "pdp-bundle-fbt", role: "bundle", title: "Pour-Over Dripper + Hand-Thrown Coffee Mug" },
      { componentId: "cf-verified-reviews", role: "reviews", title: "Studio Collector Reviews" },
      { componentId: "pdp-sticky-atc", role: "sticky-atc", title: "Sticky Instant Reserve Bar" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Microwave Safety & Break-Free Transit FAQ" }
    ]
  }
];

export function getLandingPageById(id: string): LandingPageDefinition | undefined {
  return D2C_LANDING_PAGES.find(p => p.id === id);
}
