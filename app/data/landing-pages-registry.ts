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
  // ── 1. LUMIÈRE · Clean Cellular Skincare (Rhode & Glossier Standard) ───────────
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
      "Cold-Pressed vs Synthetic Fillers Matrix",
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

  // ── 2. KINETIC · Heavyweight 480GSM Technical Streetwear ───────────────────
  {
    id: "landing-streetwear",
    name: "KINETIC · Heavyweight 480GSM Streetwear",
    niche: "streetwear",
    nicheLabel: "Streetwear & Technical Apparel",
    badge: "🔥 480GSM LOOPBACK & MILL-TESTED WATERPROOF NYLON",
    tagline: "Architectural silhouettes engineered for urban exploration",
    description: "Represent Clo and Fear of God inspired luxury streetwear funnel with limited batch drop ticker, technical fabric breakdown, 3-piece layering kit, and verified fit reviews.",
    accentColor: "#22C55E",
    heroImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=85",
    stats: "Drop 08 Sold Out in 8 Minutes · 50,000+ Discord Community",
    conversionFeatures: [
      "Drop 08 Urgency & Limited-Batch Proof",
      "3-Piece Complete Streetwear Layering Kit",
      "Heavyweight 480GSM vs Fast Fashion Fleece Matrix",
      "Real Wearer Fit UGC & Silhouette Photos",
      "Sticky Instant Add-to-Bag Bar"
    ],
    palette: {
      background: "#09090B",
      text: "#FAFAFA",
      primary: "#22C55E",
      accent: "#27272A"
    },
    announcement: "announcement-countdown",
    header: "header-sticky-glass",
    footer: "footer-multi-column",
    sections: [
      { componentId: "cf-hero-editorial", role: "hero", title: "Drop 08 Technical Heavyweight Outerwear" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "Fabric Specs & Hypebeast Endorsements" },
      { componentId: "cf-bundle-builder", role: "bundle", title: "Drop 08 Layering Essentials Kit" },
      { componentId: "cf-before-after-slider", role: "proof", title: "Zero-Shrink Wash Test & Wind Tunnel Proof" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "480GSM Loopback vs Cheap Polyester Fleece" },
      { componentId: "cf-ugc-review-wall", role: "ugc", title: "Fit & Silhouette Reviews" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Sizing Guide & International Customs FAQ" },
      { componentId: "cf-sticky-atc", role: "sticky-atc", title: "Sticky Instant Drop Reservation Dock" }
    ],
    contentOverrides: {
      hero: {
        eyebrow: "DROP 08 · LIMITED BATCH OF 400",
        heading: "Architectural Cut in 480GSM Heavyweight Cotton.",
        subtext: "Pre-shrunk custom-milled loopback French terry designed for lifetime wear. Millimeter-accurate draping with zero synthetic blend.",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=85",
        pressOutlet: "GQ MAGAZINE",
        pressQuote: "Redefining post-luxury streetwear with uncompromising fabric weight and architectural proportions.",
        socialProof: "4.98★ by 8,900+ Discord Members"
      },
      bundle: {
        badge: "Complete Layering Kit",
        heading: "Drop 08 Core 3-Piece Capsule",
        subtext: "Bundle the Vintage Boxy Tee, Heavyweight Loopback Hoodie, and Waterproof Utility Pant.",
        bundlePrice: "$240.00",
        comparePrice: "$320.00",
        steps: [
          { title: "Boxy Vintage Wash Tee (280GSM)", description: "Double-needle collar stitch with drop shoulders.", price: "$55.00", benefitTag: "100% Combed Cotton", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80" },
          { title: "Heavyweight Loopback Hoodie (480GSM)", description: "Double-lined architectural hood that stands up.", price: "$125.00", benefitTag: "480GSM Custom Knit", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80" },
          { title: "Modular Technical Cargo Pant", description: "Water-repellent ripstop with concealed cinch cuffs.", price: "$140.00", benefitTag: "DWR Waterproof", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80" }
        ]
      },
      sticky: {
        title: "Drop 08 Heavyweight Layering Capsule",
        price: "$240.00",
        comparePrice: "$320.00",
        saveText: "SAVE 25%",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=120&q=80"
      }
    }
  },

  // ── 3. AURELIA · Haute Horlogerie & Ethical Diamonds ──────────────────────
  {
    id: "landing-jewelry",
    name: "AURELIA · Heritage Diamonds & Swiss Horology",
    niche: "jewelry",
    nicheLabel: "Luxury Fine Jewelry & Watches",
    badge: "👑 GIA CERTIFIED CONFLICT-FREE DIAMONDS",
    tagline: "A century of master lapidary art and timeless luxury",
    description: "High-fashion fine jewelry storytelling page inspired by Cartier and Mejuri. Featuring GIA diamond brilliance proof, bespoke bridal suite, and white-glove insured courier transit.",
    accentColor: "#D4AF37",
    heroImg: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=85",
    stats: "100% Conflict-Free Sourcing · Lifetime Lapidary Warranty",
    conversionFeatures: [
      "Conflict-Free GIA Certificate of Authenticity",
      "3-Piece Diamond Bridal & Evening Suite",
      "Solid 18K Gold vs Plated Brass Matrix",
      "Collector Testimonial Wall",
      "Armored Courier Transit Guarantee"
    ],
    palette: {
      background: "#0C0A09",
      text: "#F5F5F4",
      primary: "#D4AF37",
      accent: "#1C1917"
    },
    announcement: "announcement-marquee",
    header: "header-centered-brand",
    footer: "footer-minimal-centered",
    sections: [
      { componentId: "cf-hero-editorial", role: "hero", title: "Heritage Solitaire Diamond Hero" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "GIA Conflict-Free Guarantee & Robb Report Press" },
      { componentId: "cf-bundle-builder", role: "bundle", title: "The Heritage Diamond Bridal Suite" },
      { componentId: "cf-before-after-slider", role: "proof", title: "Microscopic Diamond Facet Brilliance" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Solid 18K Gold & VVS1 Diamonds vs Plated Fashion Jewelry" },
      { componentId: "cf-ugc-review-wall", role: "ugc", title: "Collector Stories & Bridal Moments" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Armored Shipping & Free Resizing FAQ" },
      { componentId: "cf-sticky-atc", role: "sticky-atc", title: "Sticky Concierge Reservation Dock" }
    ],
    contentOverrides: {
      hero: {
        eyebrow: "GIA CERTIFIED MASTER LAPIDARY",
        heading: "A Century of Conflict-Free Brilliance.",
        subtext: "Hand-set VVS1 diamonds in solid 18k recycled gold. Crafted by third-generation Swiss master goldsmiths.",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=85",
        pressOutlet: "ROBB REPORT",
        pressQuote: "A monumental achievement in sustainable high jewellery. Flawless brilliance without the historic markups.",
        socialProof: "4.99★ by 2,800+ Fine Collectors"
      },
      bundle: {
        badge: "The Signature Suite",
        heading: "Curated 3-Piece High Jewellery Suite",
        subtext: "Complete matching set featuring the Solitaire Pendant, Pavé Huggies, and Eternity Band.",
        bundlePrice: "$1,150.00",
        comparePrice: "$1,450.00",
        steps: [
          { title: "Aurelia Solitaire Pendant (1.2ct)", description: "Conflict-free VVS1 round brilliant cut in recycled 18k solid gold.", price: "$520.00", benefitTag: "GIA Certified", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80" },
          { title: "Pavé Diamond Huggies (Pair)", description: "Micro-prong set brilliant melee diamonds designed for effortless daily wear.", price: "$380.00", benefitTag: "Solid 18K Gold", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80" },
          { title: "Flawless Eternity Band", description: "Continuous band of hand-selected diamonds offering 360-degree light refraction.", price: "$550.00", benefitTag: "Hand-Finished", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80" }
        ]
      },
      sticky: {
        title: "Aurelia Signature Diamond Suite",
        price: "$1,150.00",
        comparePrice: "$1,450.00",
        saveText: "SAVE $300",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=120&q=80"
      }
    }
  },

  // ── 4. NEXUS · Next-Gen Spatial Audio & Cyber Hardware ────────────────────
  {
    id: "landing-audio-tech",
    name: "NEXUS · Spatial Audio & Cyber Hardware",
    niche: "electronics",
    nicheLabel: "Cyber Audio & Pro Hardware",
    badge: "⚡ 0.8MS ZERO-LATENCY DSP · 48HR BATTERY",
    tagline: "Acoustic engineering tuned for audiophiles and pro creators",
    description: "Teenage Engineering inspired dark cyber audio funnel with 40mm Beryllium driver benchmarks, 3-piece audiophile desktop kit, and side-by-side codec comparison table.",
    accentColor: "#06B6D4",
    heroImg: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=85",
    stats: "50,000+ Units Shipped · 99.8% Latency-Free Audio Score",
    conversionFeatures: [
      "Lossless Beryllium 40mm Driver Benchmarks",
      "3-Piece Studio Audiophile Bundle (Headphones + Stand + DAC)",
      "Zero-Latency Bluetooth 5.4 vs Traditional Codecs",
      "Producer & Sound Designer UGC Wall",
      "Sticky Dynamic Add-to-Bag Dock"
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
      { componentId: "cf-hero-editorial", role: "hero", title: "Nexus Pro Spatial Audio Hero" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "DSP Specs & Wired Recommendation" },
      { componentId: "cf-bundle-builder", role: "bundle", title: "Nexus Studio Pro Desktop Kit" },
      { componentId: "cf-before-after-slider", role: "proof", title: "Active Noise Cancellation Spectrum Proof" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Nexus Pro DSP vs Traditional Flagships" },
      { componentId: "cf-ugc-review-wall", role: "ugc", title: "Sound Engineers & Creator Reviews" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Firmware Updates & Bluetooth 5.4 FAQ" },
      { componentId: "cf-sticky-atc", role: "sticky-atc", title: "Sticky Instant Audio Dock" }
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
      bundle: {
        badge: "The Creator Ecosystem",
        heading: "Complete Studio Desktop Bundle",
        subtext: "Nexus Pro Over-Ear Headphones + CNC Aluminum Stand + 32-Bit/384kHz Hi-Res USB-C DAC Amp.",
        bundlePrice: "$319.00",
        comparePrice: "$399.00",
        steps: [
          { title: "Nexus Pro Wireless Headphones", description: "40mm Beryllium drivers with 0.8ms ultra-low latency spatial DSP.", price: "$269.00", benefitTag: "0.8ms Latency", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80" },
          { title: "CNC Billet Aluminum Desktop Stand", description: "Weighted anti-slip base with precision-milled headphone contour cradle.", price: "$65.00", benefitTag: "Solid Aluminum", image: "https://images.unsplash.com/photo-1584679109597-c656b19974c9?w=600&q=80" },
          { title: "Hi-Res 32-Bit USB-C DAC Amp", description: "Lossless 384kHz decoding with dedicated discrete dual amplifier stages.", price: "$65.00", benefitTag: "32-Bit/384kHz", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80" }
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

  // ── 5. VERDANT · Nootropic Adaptogens & Cellular Longevity ────────────────
  {
    id: "landing-wellness",
    name: "VERDANT · Nootropic Wellness & Adaptogens",
    niche: "wellness",
    nicheLabel: "Clinical Wellness & Longevity",
    badge: "🌿 100% USDA ORGANIC · 3RD-PARTY LAB TESTED",
    tagline: "Clinical adaptogens for deep sleep, all-day focus, and cellular longevity",
    description: "AG1 and Seed-inspired high-trust wellness funnel featuring transparent lab certificates of analysis, morning + evening cognitive routine builder, and 60-day empty-jar guarantee.",
    accentColor: "#4A7C59",
    heroImg: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=85",
    stats: "1.2M+ Daily Doses Served · 98% Bio-Availability Score",
    conversionFeatures: [
      "Third-Party Lab Certificate of Analysis",
      "Morning Focus + Evening Sleep Synergy Kit",
      "Organic Fruiting Body vs Mycelium Grain Matrix",
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
    footer: "footer-newsletter-focus",
    sections: [
      { componentId: "cf-hero-editorial", role: "hero", title: "Daily Bio-Available Nootropic Hero" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "USDA Organic & Clean Label Certifications" },
      { componentId: "cf-bundle-builder", role: "bundle", title: "Circadian Rhythm AM/PM Synergy Kit" },
      { componentId: "cf-before-after-slider", role: "proof", title: "30-Day Cognitive Vitality & Focus Trial" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Wildcrafted Extracts vs Synthetic Pill Fillers" },
      { componentId: "cf-ugc-review-wall", role: "ugc", title: "Physician & Daily Ritualist Reviews" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Dosage, Purity & Cycling Timing FAQ" },
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
      bundle: {
        badge: "The Circadian Routine",
        heading: "AM Focus + PM Sleep Synergy Bundle",
        subtext: "Morning Clarity Lions Mane Elixir + Evening Reishi Calming Tonic + UV Glass Amber Jar.",
        bundlePrice: "$78.00",
        comparePrice: "$120.00",
        steps: [
          { title: "Morning Clarity Lion's Mane Tonic", description: "Wildcrafted dual-extracted fruiting bodies to enhance alpha brainwaves.", price: "$38.00", benefitTag: "100% Fruiting Body", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80" },
          { title: "Evening Reishi Restorative Nectar", description: "Calming triterpenes and adaptogens for slow-wave REM sleep architecture.", price: "$42.00", benefitTag: "Red Reishi Extract", image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&q=80" },
          { title: "Miron UV Violet Glass Jar + Gold Spoon", description: "Protects delicate bio-compounds from photochemical degradation.", price: "$40.00", benefitTag: "Biophotonic Glass", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80" }
        ]
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

  // ── 6. NORDIC LIVING · Scandinavian Solid Hardwood Furniture ──────────────
  {
    id: "landing-nordic-home",
    name: "NORDIC LIVING · Scandinavian Furniture & Living",
    niche: "home",
    nicheLabel: "Home Decor & Furniture",
    badge: "🛋 FSC-CERTIFIED SOLID EUROPEAN OAK",
    tagline: "Thoughtful Scandinavian proportions crafted for mindful sanctuaries",
    description: "Ferm Living and Muuto inspired luxury interior landing page featuring solid oak joinery guarantees, free fabric swatch box, and room bundle savings.",
    accentColor: "#B88E72",
    heroImg: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=85",
    stats: "10-Year Frame Warranty · 100% OEKO-TEX Certified Fabrics",
    conversionFeatures: [
      "Solid FSC-Certified European Oak Joinery",
      "The Stockholm Modular Living Room Bundle",
      "Hand-Joined Hardwood vs Flat-Pack Particle Board",
      "Homeowner & Architect Reviews",
      "White-Glove Delivery & Assembly Assurance"
    ],
    palette: {
      background: "#F9F8F6",
      text: "#2B2927",
      primary: "#B88E72",
      accent: "#EFECE6"
    },
    announcement: "announcement-marquee",
    header: "header-sticky-glass",
    footer: "footer-multi-column",
    sections: [
      { componentId: "cf-hero-editorial", role: "hero", title: "Stockholm Modular Living Series Hero" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "FSC Hardwood & Architectural Digest Press" },
      { componentId: "cf-bundle-builder", role: "bundle", title: "The Complete Living Sanctuary Suite" },
      { componentId: "cf-before-after-slider", role: "proof", title: "Daylight Room Warmth Transformation" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Solid Hardwood vs Flat-Pack Particle Board" },
      { componentId: "cf-ugc-review-wall", role: "ugc", title: "Interior Designers & Homeowner Spaces" },
      { componentId: "cf-faq-accordion", role: "faq", title: "White-Glove In-Home Assembly FAQ" },
      { componentId: "cf-sticky-atc", role: "sticky-atc", title: "Sticky Instant Reservation Dock" }
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
      },
      bundle: {
        badge: "The Living Suite",
        heading: "The Stockholm Modular Sanctuary Suite",
        subtext: "Solid Oak Lounge Chair + Hand-Woven Bouclé Throw + Cantilever Side Table.",
        bundlePrice: "$790.00",
        comparePrice: "$1,040.00",
        steps: [
          { title: "Stockholm Solid Oak Lounge Chair", description: "Sculpted ergonomic back with traditional mortise-and-tenon joints.", price: "$490.00", benefitTag: "Solid European Oak", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" },
          { title: "Hand-Woven Bouclé Wool Throw", description: "High-loft Icelandic wool spun for breathable warmth and cloud softness.", price: "$180.00", benefitTag: "OEKO-TEX Pure Wool", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80" },
          { title: "Cantilever Side Pedestal Table", description: "Single-slab oak top with brushed steel hardware and natural wax oil.", price: "$370.00", benefitTag: "FSC-Certified", image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80" }
        ]
      },
      sticky: {
        title: "Stockholm Solid Oak Living Suite",
        price: "$790.00",
        comparePrice: "$1,040.00",
        saveText: "SAVE $250",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&q=80"
      }
    }
  },

  // ── 7. ZEST & CO. · Artisanal Cold-Brew & Tonics on Ice ───────────────────
  {
    id: "landing-beverages",
    name: "ZEST & CO. · Artisanal Cold-Brew & Tonics",
    niche: "beverage",
    nicheLabel: "D2C Craft Food & Beverage",
    badge: "🍊 0G SUGAR · REAL FRUIT · FRESH ON ICE",
    tagline: "Cold-extracted single-origin coffee infused with organic citrus",
    description: "Liquid Death and Olipop inspired high-energy beverage funnel with 24-can variety pack builder, zero-sugar comparison matrix, and insulated cold delivery assurance.",
    accentColor: "#FF5722",
    heroImg: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1600&q=85",
    stats: "2,500,000+ Cans Sipped · 100% Recyclable Aluminum",
    conversionFeatures: [
      "Slow 24-Hour Cold-Extraction Brewing",
      "Build-Your-Own 24-Can Variety Taster Case",
      "0g Sugar Arabica vs Scorched Gas Station Energy Drinks",
      "Taste Test Viral Video & UGC Wall",
      "Sticky Cold-Pack Checkout Bar"
    ],
    palette: {
      background: "#FFFDF7",
      text: "#1F1A17",
      primary: "#FF5722",
      accent: "#FFE9D6"
    },
    announcement: "announcement-marquee",
    header: "header-sticky-glass",
    footer: "footer-trust-badges",
    sections: [
      { componentId: "cf-hero-editorial", role: "hero", title: "Single-Origin Nitro Cold-Brew Hero" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "0g Sugar & Food & Wine Best in Class" },
      { componentId: "cf-bundle-builder", role: "bundle", title: "24-Can Mixed Citrus Cold-Brew Taster" },
      { componentId: "cf-before-after-slider", role: "proof", title: "Clean Caffeine vs Energy Drink Crash" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Slow Cold-Extraction vs Sugary Energy Cans" },
      { componentId: "cf-ugc-review-wall", role: "ugc", title: "Customer Taste Tests & Barista Proof" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Cold Shipping & Shelf-Life FAQ" },
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

  // ── 8. APEX PERFORMANCE · Seamless 4-Way Compression Gear ────────────────
  {
    id: "landing-fitness",
    name: "APEX PERFORMANCE · Elite Athletic Conditioning",
    niche: "fitness",
    nicheLabel: "Fitness & Performance Activewear",
    badge: "⚡ AEROMESH™ 4-WAY SEAMLESS COMPRESSION",
    tagline: "Engineered for record breakers, weightlifters, and marathon runners",
    description: "Gymshark and Alo Yoga inspired performance activewear landing page with thermal breathability proof, complete 3-piece conditioning kit, and 30-day sweat trial guarantee.",
    accentColor: "#F59E0B",
    heroImg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1600&q=85",
    stats: "15 Olympic Athletes Endorsed · 30-Day Sweat Trial Guarantee",
    conversionFeatures: [
      "Thermal Breathability & Anti-Chafe Lab Proof",
      "Complete 3-Piece Athlete Conditioning Kit",
      "AeroMesh™ Hydrophobic Microfiber vs Cheap Polyester",
      "CrossFit & Marathoner UGC Wall",
      "Sticky Instant Workout Kit Checkout Dock"
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
      { componentId: "cf-hero-editorial", role: "hero", title: "Velocity 4-Way Compression Hero" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "AeroMesh™ Specs & Men's Health Gear Winner" },
      { componentId: "cf-bundle-builder", role: "bundle", title: "Complete Athlete Conditioning Kit" },
      { componentId: "cf-before-after-slider", role: "proof", title: "Thermal Heat Dissipation & Recovery Proof" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "AeroMesh Compression vs Cheap Polyester" },
      { componentId: "cf-ugc-review-wall", role: "ugc", title: "Athlete PR & Squat-Proof Reviews" },
      { componentId: "cf-faq-accordion", role: "faq", title: "30-Day Sweat Trial & Sizing FAQ" },
      { componentId: "cf-sticky-atc", role: "sticky-atc", title: "Sticky Performance Kit Dock" }
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
      bundle: {
        badge: "The Conditioning Capsule",
        heading: "Complete Athlete Conditioning 3-Piece Kit",
        subtext: "AeroMesh Compression Top + 7-Inch Lined Training Short + Graduated Recovery Tight.",
        bundlePrice: "$148.00",
        comparePrice: "$200.00",
        steps: [
          { title: "AeroMesh™ Seamless Compression Top", description: "Graduated compression zones stabilize core and accelerate blood oxygen.", price: "$58.00", benefitTag: "Anti-Chafe Mesh", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80" },
          { title: "7\" 4-Way Technical Training Short", description: "Featherweight outer shell with integrated bounce-free phone liner.", price: "$64.00", benefitTag: "4-Way Stretch", image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80" },
          { title: "Apex High-Density Recovery Roller", description: "Targeted myofascial release trigger grid for rapid post-workout relief.", price: "$78.00", benefitTag: "Eco-EPP High Density", image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80" }
        ]
      },
      sticky: {
        title: "Apex Athlete Conditioning 3-Piece Kit",
        price: "$148.00",
        comparePrice: "$200.00",
        saveText: "SAVE $52",
        image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=120&q=80"
      }
    }
  },

  // ── 9. PAWS & TAIL · Freeze-Dried Human-Grade Pet Superfood ───────────────
  {
    id: "landing-pet-care",
    name: "PAWS & TAIL · Holistic Pet Nutrition",
    niche: "pets",
    nicheLabel: "Pet Nutrition & Superfoods",
    badge: "🐾 100% HUMAN-GRADE INGREDIENTS · VET CERTIFIED",
    tagline: "Wholesome freeze-dried raw meals dogs crave and vets recommend",
    description: "Sundays and Farmer's Dog inspired pet wellness page with coat transformation proof, picky eater empty-bowl guarantee, and complete raw starter kit builder.",
    accentColor: "#D97706",
    heroImg: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1600&q=85",
    stats: "150,000+ Happy Tails · 4.96★ Average Pet Parent Rating",
    conversionFeatures: [
      "100% USDA Pasture-Raised Meat Pledges",
      "Raw Freeze-Dried Superfood Starter Kit",
      "Raw Nutrition vs High-Heat Extruded Burnt Kibble",
      "Pet Parent Coat & Digestion UGC Wall",
      "Picky Eater Empty-Bowl Guarantee"
    ],
    palette: {
      background: "#FDFBF7",
      text: "#2D3A2F",
      primary: "#D97706",
      accent: "#F5EBE1"
    },
    announcement: "announcement-marquee",
    header: "header-sticky-glass",
    footer: "footer-trust-badges",
    sections: [
      { componentId: "cf-hero-editorial", role: "hero", title: "Freeze-Dried Raw Superfood Hero" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "100% Human Grade & PetMD Approved" },
      { componentId: "cf-bundle-builder", role: "bundle", title: "Complete Raw Starter Box" },
      { componentId: "cf-before-after-slider", role: "proof", title: "Coat Shine & Digestion Vitality Transformation" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Freeze-Dried Raw vs High-Heat Extruded Kibble" },
      { componentId: "cf-ugc-review-wall", role: "ugc", title: "Happy Pet Parents & Healthy Pups" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Food Transitioning & Calorie FAQ" },
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
      bundle: {
        badge: "The Starter System",
        heading: "Complete Raw Superfood Starter Box",
        subtext: "Freeze-Dried Raw Beef Box + Wild Alaskan Salmon Oil Booster + Dental Superfood Chews.",
        bundlePrice: "$79.00",
        comparePrice: "$104.00",
        steps: [
          { title: "Pasture-Raised Beef & Salmon Feast", description: "90% meat, organs, and bone gently freeze-dried to retain active enzymes.", price: "$48.00", benefitTag: "100% Human Grade", image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80" },
          { title: "Wild Alaskan Salmon Oil Pump", description: "Rich EPA & DHA Omega-3s promote mirror-shine coat and joint mobility.", price: "$28.00", benefitTag: "Wild Alaskan Catch", image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&q=80" },
          { title: "Probiotic Dental Enzyme Chews", description: "Clinically reduces plaque build-up and freshen breath naturally.", price: "$28.00", benefitTag: "Vet Formulated", image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&q=80" }
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

  // ── 10. ATELIER TERRA · Handcrafted Stoneware & Ceramic Living ───────────
  {
    id: "landing-ceramics",
    name: "ATELIER TERRA · Handcrafted Stoneware Living",
    niche: "artisan",
    nicheLabel: "Handcrafted Artisan Ceramics",
    badge: "🏺 1280°C WOOD KILN FIRED · FOOD SAFE GLAZES",
    tagline: "Small-batch ceramic vessels shaped slowly by master potters",
    description: "Kinfolk and Toast-inspired poetic artisanal storefront celebrating slow-living ceramics with drop notifications, high-fire vitrified stoneware guarantees, and studio gift packaging.",
    accentColor: "#C26D53",
    heroImg: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1600&q=85",
    stats: "Small Batch of 250 Pieces Per Kiln Firing · Zero Plastic Packaging",
    conversionFeatures: [
      "1280°C Wood-Kiln High-Fire Vitrified Pledges",
      "Artisan Morning Coffee & Pour-Over Ritual Suite",
      "Hand-Thrown Ceramic vs Mass Factory Moulds Matrix",
      "Collector & Studio Spaces UGC Wall",
      "Break-Free Armored Transit Guarantee"
    ],
    palette: {
      background: "#FBF8F4",
      text: "#362E2B",
      primary: "#C26D53",
      accent: "#EFE8DE"
    },
    announcement: "announcement-marquee",
    header: "header-centered-brand",
    footer: "footer-minimal-centered",
    sections: [
      { componentId: "cf-hero-editorial", role: "hero", title: "Small-Batch Hand-Thrown Ceramics Hero" },
      { componentId: "cf-trust-press-bar", role: "trust", title: "1280°C High-Fire & Kinfolk Magazine Feature" },
      { componentId: "cf-bundle-builder", role: "bundle", title: "Morning Studio Pour-Over & Mug Suite" },
      { componentId: "cf-before-after-slider", role: "proof", title: "Handmade Glaze Depth in Studio Light" },
      { componentId: "cf-comparison-matrix", role: "comparison", title: "Studio Kiln Stoneware vs Factory Moulds" },
      { componentId: "cf-ugc-review-wall", role: "ugc", title: "Collector Kitchens & Morning Rituals" },
      { componentId: "cf-faq-accordion", role: "faq", title: "Dishwasher Safety & Transit Guarantee FAQ" },
      { componentId: "cf-sticky-atc", role: "sticky-atc", title: "Sticky Studio Piece Reservation Dock" }
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
      },
      sticky: {
        title: "Atelier Terra Studio Pour-Over Suite",
        price: "$118.00",
        comparePrice: "$155.00",
        saveText: "SAVE $37",
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=120&q=80"
      }
    }
  }
];

export function getLandingPageById(id: string): LandingPageDefinition | undefined {
  return D2C_LANDING_PAGES.find(p => p.id === id);
}
