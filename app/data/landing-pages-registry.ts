export interface LandingPageSectionDef {
  componentId: string;
  role: string;
  title: string;
}

export interface LandingPageContentOverrides {
  hero?: {
    eyebrow?: string;
    heading?: string;
    subtext?: string;
    image?: string;
    pressOutlet?: string;
    pressQuote?: string;
    buttonLabel1?: string;
    buttonLabel2?: string;
    socialProof?: string;
  };
  bundle?: {
    badge?: string;
    heading?: string;
    subtext?: string;
    bundlePrice?: string;
    comparePrice?: string;
    steps?: Array<{
      title: string;
      description: string;
      price: string;
      benefitTag: string;
      image: string;
    }>;
  };
  proof?: {
    badge?: string;
    heading?: string;
    subtext?: string;
    imgBefore?: string;
    imgAfter?: string;
    stat1Num?: string;
    stat1Text?: string;
    stat2Num?: string;
    stat2Text?: string;
    stat3Num?: string;
    stat3Text?: string;
  };
  matrix?: {
    ourName?: string;
    theirName?: string;
    rows?: Array<{
      feature: string;
      usCheck: boolean;
      themCheck: boolean;
    }>;
  };
  ugc?: {
    heading?: string;
    subtext?: string;
    cards?: Array<{
      concernTag: string;
      quote: string;
      productName: string;
      author: string;
      location: string;
      image: string;
    }>;
  };
  sticky?: {
    title?: string;
    price?: string;
    comparePrice?: string;
    saveText?: string;
    image?: string;
    buttonText?: string;
  };
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
  contentOverrides?: LandingPageContentOverrides;
}

export const D2C_LANDING_PAGES: LandingPageDefinition[] = [
  // ── 1. LUMIÈRE · Clean Cellular Skincare (Rhode & Glossier Routine Funnel) ─────
  {
    id: "landing-skincare",
    name: "LUMIÈRE · Organic Cellular Skincare",
    niche: "beauty",
    nicheLabel: "Beauty & Clean Skincare",
    badge: "✨ 100% ORGANIC & CLINICAL TRIAL BACKED",
    tagline: "Cellular hydration meets cold-pressed bioactive botanicals",
    description: "Rhode-inspired clean skincare landing page featuring an editorial hero with above-the-fold social proof, 3-step routine bundle builder, 14-day clinical before/after slider, and unvarnished UGC customer proof.",
    accentColor: "#C97A63",
    heroImg: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&q=85",
    stats: "4.95★ (14,200+ Verified Buyers) · 96% Hydration Score",
    conversionFeatures: [
      "Above-The-Fold Social Proof & Vogue Press Hook",
      "3-Step Synergistic Daily Routine Builder (Save 38%)",
      "14-Day GPU Clip-Path Clinical Proof Slider",
      "Cold-Pressed Bioactives vs Synthetic Fillers Matrix",
      "Real Customer Concern-Tagged UGC Wall",
      "Bottom-Docked Sticky ATC Conversion Bar"
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
      { componentId: "cf-hero-editorial", role: "hero", title: "Botanical Cellular Radiance Hero" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "Clean Formula Pledges & Press Coverage" },
      { componentId: "cf-bundle-builder", role: "bundle", title: "3-Step Daily Radiance Routine Builder" },
      { componentId: "cf-before-after-slider", role: "proof", title: "14-Day Clinical Barrier Restoration" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Cold-Pressed Bioactives vs Synthetic Fillers" },
      { componentId: "cf-ugc-review-wall", role: "ugc", title: "Real Customer Results & Concern Tags" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Sensitive Skin & Formula Purity FAQ" },
      { componentId: "cf-sticky-atc", role: "sticky-atc", title: "Sticky Instant Conversion Dock" }
    ],
    contentOverrides: {
      hero: {
        eyebrow: "CLINICAL GRADE BIO-FERMENTS",
        heading: "Cellular Radiance Meets Cold-Pressed Botanicals.",
        subtext: "Clinically proven to restore skin barrier hydration by 96% in 14 days. Zero synthetic fillers, zero compromises.",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&q=85",
        pressOutlet: "VOGUE",
        pressQuote: "The single most transformative botanical formula we tested all year. Results were visible within 48 hours.",
        socialProof: "4.95★ by 14,200+ Buyers"
      },
      bundle: {
        badge: "The Complete Daily Ritual",
        heading: "3 Steps to Peak Cellular Radiance",
        subtext: "Layered synergy formulated to activate, restore, and seal in lasting hydration with zero greasy residue.",
        bundlePrice: "$88.00",
        comparePrice: "$144.00",
        steps: [
          { title: "Cellular Bio-Active Cleanser", description: "Gentle milk cleanser removes pollutants while preserving lipid moisture.", price: "$38.00", benefitTag: "pH 5.5 Balanced", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80" },
          { title: "Cellular Radiance Bio-Serum", description: "Multi-depth peptide complex restores elasticity, hydration, and bounce.", price: "$58.00", benefitTag: "Hexapeptide-8", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80" },
          { title: "Botanical Lipid Barrier Balm", description: "Locks in moisture barrier for 48 hours of continuous antioxidant defense.", price: "$48.00", benefitTag: "Ceramide NP", image: "https://images.unsplash.com/photo-1608248597359-07f2a71f00a4?w=600&q=80" }
        ]
      },
      sticky: {
        title: "Cellular Radiance Complete Ritual",
        price: "$88.00",
        comparePrice: "$144.00",
        saveText: "SAVE 38%",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120&q=80"
      }
    }
  },

  // ── 2. KINETIC · Heavyweight 480GSM Streetwear (Represent & Fear of God Drop Funnel)
  {
    id: "landing-streetwear",
    name: "KINETIC · Heavyweight 480GSM Streetwear",
    niche: "streetwear",
    nicheLabel: "Streetwear & Technical Apparel",
    badge: "🔥 480GSM LOOPBACK & MILL-TESTED WATERPROOF NYLON",
    tagline: "Architectural silhouettes engineered for urban exploration",
    description: "Represent Clo and Fear of God inspired luxury streetwear funnel with limited batch drop ticker, technical fabric breakdown, multi-tabbed capsule hero, and verified fit reviews.",
    accentColor: "#22C55E",
    heroImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=85",
    stats: "Drop 08 Sold Out in 8 Minutes · 50,000+ Discord Community",
    conversionFeatures: [
      "Limited Batch Drop 08 Ticker & Status Marquee",
      "Multi-Tabbed Technical Capsule Hero",
      "480GSM Architectural Cut Manifesto",
      "Drop 08 Limited Batch Capsule Grid",
      "French Terry Fabric Spotlight & Zoom",
      "Mill-Spec Construction Pledges Grid"
    ],
    palette: {
      background: "#09090B",
      text: "#FAFAFA",
      primary: "#22C55E",
      accent: "#18181B"
    },
    announcement: "fb04-announcement_streetwear",
    header: "fb04-header_streetwear",
    footer: "fb04-footer_streetwear",
    sections: [
      { componentId: "fb04-hero-tabs_streetwear", role: "hero", title: "Drop 08 Architectural Capsule Hero" },
      { componentId: "fb04-marquee_streetwear", role: "ticker", title: "480GSM Heavyweight Loopback Ticker" },
      { componentId: "fb04-manifesto_streetwear", role: "manifesto", title: "Architectural Cut & Fit Manifesto" },
      { componentId: "fb04-new-drops_streetwear", role: "collection", title: "Drop 08 Limited Batch Capsule Grid" },
      { componentId: "fb04-product-spotlight_streetwear", role: "spotlight", title: "Loopback Terry Technical Breakdown" },
      { componentId: "fb04-category-tiles_streetwear", role: "categories", title: "Heavy Hoodies, Cargos & Boxy Tees" },
      { componentId: "fb04-trust-grid_streetwear", role: "trust", title: "Mill-Spec Quality & Express Global Courier" },
      { componentId: "fb04-cta-banner_streetwear", role: "cta", title: "Limited Batch Reservation Banner" }
    ]
  },

  // ── 3. AURELIA · Haute Horlogerie & Ethical Diamonds (Cartier & CaratLane Concierge)
  {
    id: "landing-jewelry",
    name: "AURELIA · Heritage Diamonds & Swiss Horology",
    niche: "jewelry",
    nicheLabel: "Luxury Fine Jewelry & Watches",
    badge: "👑 GIA CERTIFIED CONFLICT-FREE DIAMONDS",
    tagline: "A century of master lapidary art and timeless luxury",
    description: "High-fashion fine jewelry storytelling page inspired by Cartier and Mejuri. Featuring GIA diamond brilliance proof, bespoke bridal suite, try-at-home concierge, and white-glove insured courier transit.",
    accentColor: "#D4AF37",
    heroImg: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=85",
    stats: "100% Conflict-Free Sourcing · Lifetime Lapidary Warranty",
    conversionFeatures: [
      "Conflict-Free GIA Certificate of Authenticity",
      "Interactive 1.2ct VVS1 Solitaire Feature",
      "Complimentary White-Glove In-Home Consultation",
      "Interactive Carat & Occasion Selector",
      "Solitaires, Bands & Huggies Tabbed Showcase",
      "Sparkle Light Reflection Video Wall"
    ],
    palette: {
      background: "#0C0A09",
      text: "#F5F5F4",
      primary: "#D4AF37",
      accent: "#1C1917"
    },
    announcement: "caratlane-announcement",
    header: "caratlane-header",
    footer: "caratlane-footer",
    sections: [
      { componentId: "caratlane-hero", role: "hero", title: "Haute Solitaire Diamond Cinematic Hero" },
      { componentId: "caratlane-featured-solitaire", role: "spotlight", title: "GIA Certified Conflict-Free Solitaire" },
      { componentId: "caratlane-try-at-home", role: "experience", title: "Complimentary White-Glove In-Home Trial" },
      { componentId: "caratlane-gift-finder", role: "finder", title: "Interactive Carat & Occasion Selector" },
      { componentId: "caratlane-bestsellers-tabs", role: "bestsellers", title: "Solitaires, Eternity Bands & Huggies" },
      { componentId: "caratlane-reels", role: "reels", title: "Sparkle Light Reflection Video Wall" },
      { componentId: "caratlane-trust-badges", role: "trust", title: "GIA Certified, Insured Armored Transit" },
      { componentId: "caratlane-reviews", role: "reviews", title: "Collector Stories & Bridal Moments" }
    ]
  },

  // ── 4. NEXUS · Next-Gen Spatial Audio & Hardware (Nothing Tech & Sonos Style) ──
  {
    id: "landing-audio-tech",
    name: "NEXUS · Spatial Audio & Cyber Hardware",
    niche: "electronics",
    nicheLabel: "Cyber Audio & Pro Hardware",
    badge: "⚡ 0.8MS ZERO-LATENCY DSP · 48HR BATTERY",
    tagline: "Lossless 32-bit acoustic fidelity without wires",
    description: "Nothing Tech and Sonos inspired precision hardware engineering landing page featuring exploded 3D driver teardowns, lossless 32-bit DSP benchmarks, and studio gear desktop bundles.",
    accentColor: "#38BDF8",
    heroImg: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=85",
    stats: "32,000+ Studio Units Deployed · 0.8ms Ultra-Low Latency",
    conversionFeatures: [
      "Exploded 40mm Beryllium Driver Hardware Teardown",
      "Studio Hardware Desktop Gear Ecosystem",
      "Lossless 32-Bit DSP vs Compressed Bluetooth Matrix",
      "Aircraft-Grade CNC Aluminum Materials Breakdown",
      "Precision Audio Stat Counters (0.8ms, 48hr, 384kHz)",
      "Sticky Instant Audio Hardware Dock"
    ],
    palette: {
      background: "#0B0F19",
      text: "#F8FAFC",
      primary: "#38BDF8",
      accent: "#1E293B"
    },
    announcement: "hp51-marquee",
    header: "header-tech-v1",
    footer: "footer-tech-v1",
    sections: [
      { componentId: "hero-tech-v1", role: "hero", title: "Flagship Acoustic Driver Hardware Hero" },
      { componentId: "pdp-tech-flagship", role: "pdp", title: "Exploded 40mm Beryllium Driver & 0.8ms DSP Teardown" },
      { componentId: "grid-tech-v1", role: "grid", title: "Nexus Pro Headphones, CNC Stand & Hi-Res DAC Amp" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Lossless 32-Bit DSP vs Traditional Compressed Bluetooth" },
      { componentId: "story-materials-showcase-v1", role: "materials", title: "Aircraft Aluminum & Memory Foam Acoustic Isolation" },
      { componentId: "hp7-10-stats-counter", role: "stats", title: "0.8ms Latency · 48hr Battery · 384kHz Decoding" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Firmware Updates & Bluetooth 5.4 Codecs FAQ" },
      { componentId: "cf-sticky-atc", role: "sticky-atc", title: "Sticky Audio Hardware Dock" }
    ],
    contentOverrides: {
      hero: {
        eyebrow: "LOSSLESS 32-BIT SPATIAL DSP",
        heading: "Studio Acoustic Fidelity Without Wires.",
        subtext: "Custom-tuned 40mm Beryllium diaphragms deliver 0.8ms ultra-low latency and 48 hours of continuous studio playback.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=85",
        pressOutlet: "WIRED",
        pressQuote: "The lowest-latency wireless acoustic driver on the market today. Crushes flagships twice its price.",
        socialProof: "4.96★ by 32,000+ Audiophiles"
      },
      matrix: {
        ourName: "Nexus Pro DSP",
        theirName: "Generic Bluetooth",
        rows: [
          { feature: "0.8ms Ultra-Low Latency DSP", usCheck: true, themCheck: false },
          { feature: "Lossless 32-Bit / 384kHz DAC", usCheck: true, themCheck: false },
          { feature: "40mm Solid Beryllium Diaphragm", usCheck: true, themCheck: false },
          { feature: "48-Hour Continuous Studio Battery", usCheck: true, themCheck: false },
          { feature: "CNC Milled Billet Aluminum Chasis", usCheck: true, themCheck: false }
        ]
      },
      sticky: {
        title: "Nexus Pro Studio Audio Suite",
        price: "$319.00",
        comparePrice: "$399.00",
        saveText: "SAVE $80",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&q=80"
      }
    }
  },

  // ── 5. VERDANT · Nootropic Adaptogens & Cellular Longevity (AG1 & Seed Funnel) ──
  {
    id: "landing-wellness",
    name: "VERDANT · Nootropic Wellness & Adaptogens",
    niche: "wellness",
    nicheLabel: "Clinical Wellness & Longevity",
    badge: "🌿 100% USDA ORGANIC · 3RD-PARTY LAB TESTED",
    tagline: "Clinical adaptogens for deep sleep, all-day focus, and cellular longevity",
    description: "AG1 and Seed-inspired high-trust wellness funnel featuring transparent lab certificates of analysis, circadian morning + evening cognitive routine builder, and 60-day empty-jar guarantee.",
    accentColor: "#4A7C59",
    heroImg: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=85",
    stats: "1.2M+ Daily Doses Served · 98% Bio-Availability Score",
    conversionFeatures: [
      "Third-Party Lab Certificate of Analysis",
      "Circadian Morning Focus + Evening Sleep Synergy Kit",
      "Wildcrafted Fruiting Body vs Mycelium Grain Story",
      "30-Day Cognitive Vitality & Focus Trial Slider",
      "Doctor & Biohacker Verified Testimonials",
      "Sticky Dynamic Auto-Ship / Order Dock"
    ],
    palette: {
      background: "#F7F6F2",
      text: "#1E3A2F",
      primary: "#4A7C59",
      accent: "#E8EDE0"
    },
    announcement: "announcement-marquee",
    header: "header-sticky-glass",
    footer: "footer-natural-v1",
    sections: [
      { componentId: "hero-natural-v1", role: "hero", title: "Daily Bio-Available Nootropic Hero" },
      { componentId: "brand-story-natural-v1", role: "story", title: "Wildcrafted Fruiting Bodies vs Mycelium Grain" },
      { componentId: "hp1-bundle-offer", role: "bundle", title: "Circadian Rhythm AM/PM Synergy Kit" },
      { componentId: "cf-before-after-slider", role: "proof", title: "30-Day Cognitive Vitality & Focus Trial" },
      { componentId: "grid-natural-v1", role: "grid", title: "Bioactive Adaptogen Elixirs & UV Amber Jars" },
      { componentId: "cf-ugc-review-wall", role: "ugc", title: "Physician & Daily Ritualist Reviews" },
      { componentId: "trust-badges-v1", role: "trust", title: "USDA Organic, Non-GMO, 60-Day Guarantee" },
      { componentId: "cf-sticky-atc", role: "sticky-atc", title: "Sticky Subscribe & Save Bar" }
    ],
    contentOverrides: {
      hero: {
        eyebrow: "100% ORGANIC BIO-AVAILABLE EXTRACTS",
        heading: "Daily Tonics for Deep Focus & Restorative Sleep.",
        subtext: "Clinical-strength adaptogenic mushrooms and nootropic botanicals formulated to eliminate brain fog and support cellular recovery.",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=85",
        pressOutlet: "FORBES",
        pressQuote: "The only daily adaptogen blend that eliminated afternoon cognitive dips without caffeine crashes.",
        socialProof: "4.96★ by 24,000+ Daily Ritualists"
      },
      proof: {
        badge: "30-Day Clinical Trial",
        heading: "Noticeable Focus & Sleep Architecture",
        subtext: "Measured improvements in REM sleep duration and subjective afternoon energy.",
        imgBefore: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
        imgAfter: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
        stat1Num: "+44%",
        stat1Text: "Deep Slow-Wave REM Sleep",
        stat2Num: "98%",
        stat2Text: "Reported Zero Caffeine Crashes",
        stat3Num: "3.2x",
        stat3Text: "Alpha Wave Cognitive Focus"
      },
      sticky: {
        title: "Verdant AM/PM Adaptogen Kit",
        price: "$78.00",
        comparePrice: "$120.00",
        saveText: "SAVE 35%",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=120&q=80"
      }
    }
  },

  // ── 6. NORDIC LIVING · Scandinavian Furniture & Interior Sanctuaries (Ferm Living / Muuto)
  {
    id: "landing-nordic-home",
    name: "NORDIC LIVING · Scandinavian Furniture & Living",
    niche: "home",
    nicheLabel: "Home Decor & Furniture",
    badge: "🛋 FSC-CERTIFIED SOLID EUROPEAN OAK",
    tagline: "Thoughtful Scandinavian proportions crafted for mindful sanctuaries",
    description: "Ferm Living and Muuto inspired luxury interior landing page featuring split architectural space photography, shoppable living lookbook, traditional mortise-and-tenon woodcraft, and white-glove delivery.",
    accentColor: "#B88E72",
    heroImg: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=85",
    stats: "10-Year Frame Warranty · 100% OEKO-TEX Certified Fabrics",
    conversionFeatures: [
      "Split Architectural Living Space & Lounge Chair Hero",
      "Stockholm Living Sanctuary Lookbook Grid",
      "Traditional Mortise-and-Tenon Woodcraft Story",
      "Lounge Chairs, Solid Oak Tables & Bouclé Throws Bento",
      "Solid European Hardwood vs Flat-Pack Particle Board",
      "Architect & Interior Designer Review Feature"
    ],
    palette: {
      background: "#FAF7F2",
      text: "#1C1917",
      primary: "#B88E72",
      accent: "#EFE8DE"
    },
    announcement: "announcement-marquee",
    header: "header-minimal-inline",
    footer: "footer-minimal-centered",
    sections: [
      { componentId: "hero-split-luxury", role: "hero", title: "Stockholm Living Sanctuary Split Hero" },
      { componentId: "grid-featured-lookbook-v1", role: "lookbook", title: "Curated Living Sanctuary Lookbook" },
      { componentId: "brand-story-luxury-v1", role: "story", title: "Traditional Mortise & Tenon Woodcraft Story" },
      { componentId: "offer-bento-grid", role: "bento", title: "Lounge Chairs, Solid Oak Tables & Bouclé Throws" },
      { componentId: "story-materials-showcase-v1", role: "materials", title: "Solid European Oak vs Flat-Pack Particle Board" },
      { componentId: "trust-featured-review-luxury-v1", role: "review", title: "Architect & Interior Designer Testimonial" },
      { componentId: "cf-faq-accordion", role: "faq", title: "White-Glove In-Home Assembly FAQ" }
    ],
    contentOverrides: {
      hero: {
        eyebrow: "FSC CERTIFIED EUROPEAN HARDWOOD",
        heading: "Mindful Proportions in Solid European Oak.",
        subtext: "Hand-joined mortise-and-tenon craftsmanship engineered for lifetime sanctuaries. Finished with natural organic wax oils.",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=85",
        pressOutlet: "ARCHITECTURAL DIGEST",
        pressQuote: "Heirloom craftsmanship built for the contemporary home. Proportions that breathe calm into any interior.",
        socialProof: "4.94★ by 6,200+ Homeowners"
      }
    }
  },

  // ── 7. ZEST & CO. · Cold-Brew & Tonics on Ice (Liquid Death & Olipop Style) ─────
  {
    id: "landing-beverages",
    name: "ZEST & CO. · Artisanal Cold-Brew & Tonics",
    niche: "beverage",
    nicheLabel: "D2C Craft Food & Beverage",
    badge: "🍊 0G SUGAR · REAL FRUIT · FRESH ON ICE",
    tagline: "Cold-extracted single-origin coffee infused with organic citrus",
    description: "Liquid Death and Olipop inspired high-energy beverage funnel with bold can typography, flavor bento cards, 24-can variety pack customizer, zero-sugar comparison matrix, and viral TikTok wall.",
    accentColor: "#FF5722",
    heroImg: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1600&q=85",
    stats: "2,500,000+ Cans Sipped · 100% Recyclable Aluminum",
    conversionFeatures: [
      "Explosive High-Contrast Cold-Brew Can Hero",
      "Interactive Flavor Bento Cards (Blood Orange, Yuzu, Nitro)",
      "Build-Your-Own 24-Can Variety Taster Case",
      "0g Sugar Arabica vs Scorched Gas Station Energy Drinks",
      "TikTok & Customer Unboxing Social Wall",
      "Summer Cold-Pack Drop Countdown & Discount Strip"
    ],
    palette: {
      background: "#FFFDF7",
      text: "#1F1A17",
      primary: "#FF5722",
      accent: "#FFE9D6"
    },
    announcement: "hp51-marquee",
    header: "header-bold-v1",
    footer: "footer-bold-v1",
    sections: [
      { componentId: "hero-bold-v1", role: "hero", title: "Explosive Nitro Cold Brew Can Hero" },
      { componentId: "category-bento-cards", role: "flavors", title: "Blood Orange, Sparkling Yuzu & Nitro Cold Brew" },
      { componentId: "cf-bundle-builder", role: "bundle", title: "Build-Your-Own 24-Can Variety Taster Box" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "0g Sugar Arabica vs Scorched Energy Drinks" },
      { componentId: "hp7-15-instagram-grid", role: "social", title: "TikTok Taste Tests & Customer Cans on Ice" },
      { componentId: "offer-countdown-sale", role: "sale", title: "Summer Cold-Pack Drop Special Discount" },
      { componentId: "trust-badges-v1", role: "trust", title: "Cold-Chain Insured Delivery · 100% Recyclable" },
      { componentId: "cf-sticky-atc", role: "sticky-atc", title: "Sticky Cold-Case Order Bar" }
    ],
    contentOverrides: {
      hero: {
        eyebrow: "SLOW 24-HOUR COLD EXTRACTION",
        heading: "Single-Origin Arabica Infused with Citrus on Ice.",
        subtext: "Crisp, bright, and completely sugar-free. Crafted with direct-trade beans and organic cold-pressed citrus peels.",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1600&q=85",
        pressOutlet: "FOOD & WINE",
        pressQuote: "The cleanest, brightest ready-to-drink coffee innovation of the decade. Unmatched morning clarity.",
        socialProof: "4.92★ by 48,000+ Daily Sippers"
      },
      bundle: {
        badge: "The Taster Box",
        heading: "Build Your 24-Can Taster Case",
        subtext: "12 Cans Blood Orange Cold-Brew + 12 Cans Sparkling Yuzu Tonic + Insulated Thermal Tumbler.",
        bundlePrice: "$86.00",
        comparePrice: "$116.00",
        steps: [
          { title: "Single-Origin Nitro Cold Brew (12-Pack)", description: "24-hour steeped Ethiopian Yirgacheffe with natural floral citrus notes.", price: "$48.00", benefitTag: "0g Sugar · Arabica", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80" },
          { title: "Sparkling Yuzu Citrus Tonic (12-Pack)", description: "Crisp mountain spring water infused with organic cold-pressed yuzu peel.", price: "$42.00", benefitTag: "Real Fruit Peel", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80" },
          { title: "Double-Wall Insulated Matte Tumbler", description: "Keeps cold brew frost-chilled for 18 hours without condensation.", price: "$26.00", benefitTag: "18/8 Stainless Steel", image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&q=80" }
        ]
      },
      sticky: {
        title: "Zest & Co. 24-Can Taster Case",
        price: "$86.00",
        comparePrice: "$116.00",
        saveText: "SAVE $30",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=120&q=80"
      }
    }
  },

  // ── 8. APEX PERFORMANCE · Seamless 4-Way Activewear (Gymshark & Alo Funnel) ─────
  {
    id: "landing-fitness",
    name: "APEX PERFORMANCE · Elite Athletic Conditioning",
    niche: "fitness",
    nicheLabel: "Fitness & Performance Activewear",
    badge: "⚡ AEROMESH™ 4-WAY SEAMLESS COMPRESSION",
    tagline: "Engineered for record breakers, weightlifters, and marathon runners",
    description: "Gymshark and Alo Yoga inspired performance activewear landing page with dynamic athlete conditioning hero, AeroMesh™ heat dissipation spotlight, 3-piece conditioning kit, and 30-day sweat trial.",
    accentColor: "#F59E0B",
    heroImg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1600&q=85",
    stats: "15 Olympic Athletes Endorsed · 30-Day Sweat Trial Guarantee",
    conversionFeatures: [
      "Dynamic High-Velocity Athlete Training Hero",
      "AeroMesh™ Heat Dissipation & Anti-Chafe Spotlight",
      "Complete 3-Piece Athlete Conditioning Kit (FBT)",
      "Thermal Muscle Heat Dissipation Recovery Slider",
      "Olympic Athlete High-Intensity Conditioning Grid",
      "CrossFit & Marathoner Heavy Squat-Proof Reviews"
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
      { componentId: "hp20-01-hero", role: "hero", title: "Dynamic High-Velocity Conditioning Hero" },
      { componentId: "hp51-product-spotlight", role: "spotlight", title: "AeroMesh™ Heat Dissipation & Anti-Chafe Mesh" },
      { componentId: "pdp-bundle-fbt", role: "bundle", title: "Complete 3-Piece Conditioning Athlete Kit" },
      { componentId: "cf-before-after-slider", role: "proof", title: "Thermal Muscle Heat Dissipation & Recovery" },
      { componentId: "grid-bold-v1", role: "grid", title: "Olympic Athlete Conditioning Drops" },
      { componentId: "cf-ugc-review-wall", role: "ugc", title: "Athlete PR & Squat-Proof Reviews" },
      { componentId: "cf-faq-accordion", role: "faq", title: "30-Day Sweat Trial & Sizing FAQ" }
    ],
    contentOverrides: {
      hero: {
        eyebrow: "AEROMESH™ 4-WAY RECOVERY KNIT",
        heading: "Engineered for Record Breakers & Heavy Lifters.",
        subtext: "Targeted graduated compression accelerates muscular oxygenation and eliminates chafing through intense conditioning sessions.",
        image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1600&q=85",
        pressOutlet: "MEN'S HEALTH",
        pressQuote: "Zero chafing, zero slip, and genuine medical-grade compression that stands up to 500lb squats.",
        socialProof: "4.97★ by 19,000+ Athletes"
      },
      proof: {
        badge: "Thermal Imaging Proof",
        heading: "Accelerated Muscle Recovery & Cool-Down",
        subtext: "Infrared thermal testing reveals 3.4x faster heat dissipation under peak lactate threshold.",
        imgBefore: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
        imgAfter: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80",
        stat1Num: "-4.2°C",
        stat1Text: "Skin Temperature Under Strain",
        stat2Num: "100%",
        stat2Text: "Squat-Proof Opacity Test",
        stat3Num: "4-Way",
        stat3Text: "Seamless Medical Elasticity"
      }
    }
  },

  // ── 9. PAWS & TAIL · Freeze-Dried Pet Superfood (The Farmer's Dog & Sundays) ───
  {
    id: "landing-pet-care",
    name: "PAWS & TAIL · Holistic Pet Nutrition",
    niche: "pets",
    nicheLabel: "Pet Nutrition & Superfoods",
    badge: "🐾 100% HUMAN-GRADE INGREDIENTS · VET CERTIFIED",
    tagline: "Wholesome freeze-dried raw meals dogs crave and vets recommend",
    description: "Sundays and Farmer's Dog inspired pet wellness page with heartwarming storytelling raw food hero, coat transformation proof, raw starter box bundle, founder letter, and picky-eater empty bowl guarantee.",
    accentColor: "#D97706",
    heroImg: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1600&q=85",
    stats: "150,000+ Happy Tails · 4.96★ Average Pet Parent Rating",
    conversionFeatures: [
      "Heartwarming Storytelling Raw Superfood Hero",
      "14-Day Dull Coat to Glossy Vitality Proof Slider",
      "Complete Raw Starter Box Bundle Offer",
      "Gently Freeze-Dried vs High-Heat Extruded Kibble",
      "Personal Letter from Holistic Vet Dr. Aris",
      "Picky Eater Empty-Bowl Guarantee"
    ],
    palette: {
      background: "#FDFBF7",
      text: "#2D3A2F",
      primary: "#D97706",
      accent: "#F5EBE1"
    },
    announcement: "announcement-marquee",
    header: "header-centered-brand",
    footer: "footer-trust-badges",
    sections: [
      { componentId: "hero-storytelling-luxury-v2", role: "hero", title: "Heartwarming Raw Pet Nutrition Hero" },
      { componentId: "cf-before-after-slider", role: "proof", title: "Coat Shine & Digestion Vitality Transformation" },
      { componentId: "hp7-bundle-offer", role: "bundle", title: "Complete Raw Superfood Starter Box" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Freeze-Dried Raw vs High-Heat Extruded Kibble" },
      { componentId: "hp1-founder-note", role: "letter", title: "A Letter from Holistic Vet Dr. Aris" },
      { componentId: "cf-ugc-review-wall", role: "ugc", title: "Happy Pet Parents & Healthy Pups" },
      { componentId: "trust-badges-v1", role: "trust", title: "100% Human Grade · USDA Sourced Pledges" },
      { componentId: "cf-sticky-atc", role: "sticky-atc", title: "Sticky Subscribe Dog Box Bar" }
    ],
    contentOverrides: {
      hero: {
        eyebrow: "100% USDA HUMAN-GRADE RAW NUTRITION",
        heading: "Pasture-Raised Meals Dogs Crave & Vets Trust.",
        subtext: "Gently freeze-dried to lock in natural enzymes, vitamins, and protein without high-heat processing or chemical preservatives.",
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1600&q=85",
        pressOutlet: "PETMD",
        pressQuote: "Transformed our test dogs' coat shine and energy levels in two weeks. Total nutritional transparency.",
        socialProof: "4.96★ by 150,000+ Happy Tails"
      },
      proof: {
        badge: "14-Day Coat & Digestion Trial",
        heading: "Glossy Coat & Energetic Bounce",
        subtext: "Real transformations observed in clinical feeding trials with zero synthetic fillers.",
        imgBefore: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&q=80",
        imgAfter: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80",
        stat1Num: "94%",
        stat1Text: "Firmer Stools & Better Digestion",
        stat2Num: "2 Weeks",
        stat2Text: "Noticeable Coat Shine",
        stat3Num: "100%",
        stat3Text: "Empty Bowls Cleaned Every Meal"
      },
      matrix: {
        ourName: "Paws & Tail Raw",
        theirName: "Extruded Kibble",
        rows: [
          { feature: "100% USDA Pasture-Raised Meat", usCheck: true, themCheck: false },
          { feature: "Gently Freeze-Dried (Raw Enzymes)", usCheck: true, themCheck: false },
          { feature: "Zero High-Heat Carbohydrate Fillers", usCheck: true, themCheck: false },
          { feature: "Omega-3 Wild Alaskan Salmon Oil", usCheck: true, themCheck: false },
          { feature: "Veterinarian Formulated & Approved", usCheck: true, themCheck: true }
        ]
      },
      sticky: {
        title: "Paws & Tail Raw Superfood Starter Kit",
        price: "$79.00",
        comparePrice: "$104.00",
        saveText: "SAVE $25",
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=120&q=80"
      }
    }
  },

  // ── 10. ATELIER TERRA · Handcrafted Stoneware (East Fork & Toast Studio Funnel) ──
  {
    id: "landing-ceramics",
    name: "ATELIER TERRA · Handcrafted Stoneware Living",
    niche: "artisan",
    nicheLabel: "Handcrafted Artisan Ceramics",
    badge: "🏺 1280°C WOOD KILN FIRED · FOOD SAFE GLAZES",
    tagline: "Small-batch ceramic vessels shaped slowly by master potters",
    description: "East Fork and Toast-inspired poetic artisanal storefront celebrating slow-living ceramics with wheel-thrown potter hero, 36-hour wood kiln documentary story, morning pour-over ritual suite, and zero-breakage guarantee.",
    accentColor: "#C26D53",
    heroImg: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1600&q=85",
    stats: "Small Batch of 250 Pieces Per Kiln Firing · Zero Plastic Packaging",
    conversionFeatures: [
      "Wheel-Thrown Master Potter Flame Kiln Hero",
      "The 36-Hour Anagama Wood-Kiln Firing Story",
      "Morning Studio Pour-Over & Fluted Mug Suite",
      "Natural Wood Ash, Iron Oxide & River Clay Swatches",
      "Morning Ritual Kitchen Counter Lookbook",
      "100% Plastic-Free & Zero-Breakage Transit Guarantee"
    ],
    palette: {
      background: "#FBF8F4",
      text: "#362E2B",
      primary: "#C26D53",
      accent: "#EFE8DE"
    },
    announcement: "announcement-marquee",
    header: "header-transparent-overlay-v1",
    footer: "footer-luxury-mega-v1",
    sections: [
      { componentId: "hero-luxury-editorial-v1", role: "hero", title: "Wheel-Thrown Master Potter Flame Kiln Hero" },
      { componentId: "hp1-brand-story", role: "documentary", title: "The 36-Hour Anagama Wood-Kiln Firing Story" },
      { componentId: "cf-bundle-builder", role: "bundle", title: "Morning Studio Pour-Over & Fluted Mug Suite" },
      { componentId: "story-materials-showcase-v1", role: "materials", title: "Wood Ash, Iron Oxide & Raw River Clay" },
      { componentId: "hp7-09-shoppable-lookbook", role: "lookbook", title: "Morning Ritual Kitchen Counter Lookbook" },
      { componentId: "cf-ugc-review-wall", role: "ugc", title: "Collector Kitchens & Morning Rituals" },
      { componentId: "trust-badges-v1", role: "trust", title: "100% Plastic-Free · Zero-Breakage Armored Shipping" }
    ],
    contentOverrides: {
      hero: {
        eyebrow: "1280°C WOOD KILN HIGH-FIRE STONEWARE",
        heading: "Small-Batch Ceramic Vessels Shaped by Hand.",
        subtext: "Each vessel is wheel-thrown from locally sourced raw stoneware, dipped in organic iron-rich glazes, and wood-fired over 36 hours.",
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1600&q=85",
        pressOutlet: "KINFOLK",
        pressQuote: "Tactile perfection. Each piece carries the subtle thumbprint of the potter and the unique soul of the wood kiln.",
        socialProof: "4.98★ by 4,100+ Studio Collectors"
      },
      bundle: {
        badge: "The Morning Ritual",
        heading: "Handcrafted Studio Pour-Over Suite",
        subtext: "Stoneware Dripper & Server Carafe + Fluted Coffee Mug + Hand-Carved Oak Coaster Pair.",
        bundlePrice: "$118.00",
        comparePrice: "$155.00",
        steps: [
          { title: "Handmade Stoneware Pour-Over Dripper", description: "1280°C wood-fired ceramic ribs extract optimal aromatic coffee bloom.", price: "$52.00", benefitTag: "Wood-Kiln Fired", image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80" },
          { title: "Wabi-Sabi Fluted Studio Mug (340ml)", description: "Wheel-thrown ergonomic handle with natural matte iron-dip glaze.", price: "$38.00", benefitTag: "Hand-Thrown", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80" },
          { title: "Hand-Carved Reclaimed Oak Serving Tray", description: "Charred Japanese yakisugi finish with organic beeswax protection.", price: "$65.00", benefitTag: "Reclaimed Oak", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80" }
        ]
      }
    }
  }
];

export function getLandingPageById(id: string): LandingPageDefinition | undefined {
  return D2C_LANDING_PAGES.find(p => p.id === id);
}
