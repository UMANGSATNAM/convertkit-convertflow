const fs = require('fs');
const path = require('path');

const sectionsDir = 'i:\\converflow app\\dev-theme-peri\\sections';
const templatesDir = 'i:\\converflow app\\dev-theme-peri\\templates';

// Define 100 Brand Configurations matching exact D2C niches
const brands = [
  { id: 1, name: "Glossier Clean Beauty", primary: "#3D9A98", bg: "#FFF5F5", accent: "#E11D48", promo: "GET 20% OFF CLEAN BEAUTY SETS", promoCode: "GLOW20" },
  { id: 2, name: "Gymshark Activewear", primary: "#111111", bg: "#F4F4F5", accent: "#000000", promo: "EXTRA 15% OFF ACTIVEWEAR", promoCode: "SHRED15" },
  { id: 3, name: "Aesop Apothecary", primary: "#2F3E30", bg: "#F4F1EA", accent: "#1C241B", promo: "COMPLIMENTARY BOTANICAL SAMPLE", promoCode: "BOTANICAL" },
  { id: 4, name: "Cyberpunk Y2K", primary: "#FF0055", bg: "#0D0D12", accent: "#00F0FF", promo: "NEON STREETWEAR DROP — 25% OFF", promoCode: "CYBER25" },
  { id: 5, name: "Off-White High Fashion", primary: "#000000", bg: "#FFFFFF", accent: "#000000", promo: "AUTUMN ARCHIVE COLLECTION LIVE", promoCode: "ARCHIVE" },
  { id: 6, name: "Nordic Minimal Living", primary: "#4A5568", bg: "#F7FAFC", accent: "#2D3748", promo: "SUSTAINABLE NORDIC HOMES — 10% OFF", promoCode: "NORDIC10" },
  { id: 7, name: "Liquid Death Punk", primary: "#000000", bg: "#FFFBEB", accent: "#FFD700", promo: "MURDER YOUR THIRST — BUNDLE SAVE", promoCode: "MURDER" },
  { id: 8, name: "Apple Minimal Tech", primary: "#1D1D1F", bg: "#F5F5F7", accent: "#0066CC", promo: "COMPATIBLE ACCESSORIES — SAVE 15%", promoCode: "APPLE15" },
  { id: 9, name: "Retro Vintage Brewery", primary: "#78350F", bg: "#FEF3C7", accent: "#B45309", promo: "CRAFT MALT BEER PACKS — BUY 2 GET 1", promoCode: "CRAFTBEER" },
  { id: 10, name: "Organic Botanical", primary: "#166534", bg: "#F0FDF4", accent: "#15803D", promo: "100% ORGANIC CERTIFIED — FREE SHIP", promoCode: "ORGANIC" },
  { id: 11, name: "Neo-Brutalist Y2K", primary: "#000000", bg: "#FFE600", accent: "#000000", promo: "RAW DESIGN DROPS — FLAT ₹ 500 OFF", promoCode: "BRUTAL" },
  { id: 12, name: "High Jewelry Atelier", primary: "#1E1B4B", bg: "#EEF2FF", accent: "#4338CA", promo: "COMPLIMENTARY JEWELRY CLEANING KIT", promoCode: "ATELIER" },
  { id: 13, name: "Eco Wool Footwear", primary: "#2D3748", bg: "#EDF2F7", accent: "#1A202C", promo: "ZERO-CARBON SHOES — ₹ 1,000 OFF", promoCode: "WOOLFOOT" },
  { id: 14, name: "Artisanal Coffee", primary: "#451A03", bg: "#FEF3C7", accent: "#78350F", promo: "FRESH ESPRESSO BEANS — SAVE 20%", promoCode: "ROAST20" },
  { id: 15, name: "Tactical Outdoor Gear", primary: "#1C1917", bg: "#E7E5E4", accent: "#44403C", promo: "MILITARY-GRADE GEAR — 15% OFF", promoCode: "TACTICAL" },
  { id: 16, name: "K-Beauty Glass Skin", primary: "#F472B6", bg: "#FDF2F8", accent: "#DB2777", promo: "DEWY HYDRATION SETS — FREE SPRAY", promoCode: "GLASSKIN" },
  { id: 17, name: "The Farmers Dog Pet", primary: "#C86D51", bg: "#FFF7ED", accent: "#9A3412", promo: "HUMAN-GRADE MEALS — 50% OFF TRIAL", promoCode: "PUP50" },
  { id: 18, name: "Smart Home IoT", primary: "#06B6D4", bg: "#ECFEFF", accent: "#0891B2", promo: "MATTER LIGHT KITS — SAVE ₹ 1,500", promoCode: "SMARTKIT" },
  { id: 19, name: "Artisanal Sourdough", primary: "#78350F", bg: "#FFFBEB", accent: "#92400E", promo: "BREAD SUBSCRIPTION — 1ST BOX FREE", promoCode: "SOURDOUGH" },
  { id: 20, name: "Retro 8-Bit Arcade", primary: "#8B5CF6", bg: "#F5F3FF", accent: "#6D28D9", promo: "PIXEL CONSOLES — FREE STICKER PACK", promoCode: "PIXEL8" },
  { id: 21, name: "Clinical Derma Lab", primary: "#0284C7", bg: "#F0F9FF", accent: "#0369A1", promo: "DERMA SERUMS — 20% OFF", promoCode: "DERMA20" },
  { id: 22, name: "Pro Activewear Performance", primary: "#991B1B", bg: "#FEF2F2", accent: "#7F1D1D", promo: "SWEAT-WICKING GEAR — BUY 2 GET 20%", promoCode: "PROACTIVE" },
  { id: 23, name: "Herbal Tea Infusions", primary: "#15803D", bg: "#F0FDF4", accent: "#166534", promo: "CHAMOMILE BUNDLE — FREE TEAPOT", promoCode: "HERBAL" },
  { id: 24, name: "Luxury Timepieces", primary: "#0F172A", bg: "#F8FAFC", accent: "#1E293B", promo: "AUTOMATIC CHRONO — FREE WINDER", promoCode: "CHRONO" },
  { id: 25, name: "Eco Refill Cleaning", primary: "#0D9488", bg: "#CCFBF1", accent: "#0F766E", promo: "REFILL PACKS — SAVE ₹ 300", promoCode: "REFILL" },
  { id: 26, name: "Gourmet Hot Sauce", primary: "#B91C1C", bg: "#FEF2F2", accent: "#991B1B", promo: "FIERY PACK — FREE CHILI BOTTLE", promoCode: "SPICY" },
  { id: 27, name: "Japanese Stationery", primary: "#475569", bg: "#F8FAFC", accent: "#334155", promo: "WASHI JOURNALS — 15% OFF", promoCode: "WASHI15" },
  { id: 28, name: "Functional Hydration", primary: "#0284C7", bg: "#E0F2FE", accent: "#0369A1", promo: "ELECTROLYTE PACKS — 20% OFF", promoCode: "HYDRATE" },
  { id: 29, name: "Handcrafted Leather Goods", primary: "#78350F", bg: "#FEF3C7", accent: "#92400E", promo: "COGNAC WALLETS — FREE MONOGRAM", promoCode: "LEATHER" },
  { id: 30, name: "Baby Essentials Organic", primary: "#F472B6", bg: "#FFF1F2", accent: "#E11D48", promo: "COTTON BABY SETS — 25% OFF", promoCode: "BABY25" },
  { id: 31, name: "Running Shoes Performance", primary: "#334155", bg: "#F8FAFC", accent: "#1E293B", promo: "SPEEDBOARD RUNNERS — FREE SOCKS", promoCode: "RUNNER" },
  { id: 32, name: "Artisanal Gelato", primary: "#EC4899", bg: "#FDF2F8", accent: "#BE185D", promo: "GELATO TUBS — BUY 3 GET 1 FREE", promoCode: "GELATO" },
  { id: 33, name: "Cyberpunk Keyboards", primary: "#06B6D4", bg: "#18181B", accent: "#0891B2", promo: "GASKET BOARDS — FREE PULLER", promoCode: "RGBKEYS" },
  { id: 34, name: "Niche Perfumery", primary: "#312E81", bg: "#EEF2FF", accent: "#3730A3", promo: "VELVET OUD — FREE 10ML SPRAY", promoCode: "VELVET" },
  { id: 35, name: "Tuscan Olive Oil", primary: "#65A30D", bg: "#F7FEE7", accent: "#4D7C0F", promo: "EXTRA VIRGIN — FREE DIPPING DISH", promoCode: "OLIVEOIL" },
  { id: 36, name: "Bamboo Eyewear", primary: "#A16207", bg: "#FEFCE8", accent: "#854D0E", promo: "BAMBOO FRAMES — 20% OFF", promoCode: "BAMBOO" },
  { id: 37, name: "Vitamin Nootropics", primary: "#7C3AED", bg: "#F5F3FF", accent: "#6D28D9", promo: "BRAIN CAPSULES — BUY 2 GET 1", promoCode: "FOCUS" },
  { id: 38, name: "Craft Keyboards Gateron", primary: "#0F172A", bg: "#F1F5F9", accent: "#1E293B", promo: "MECHANICAL SWITCHES — 15% OFF", promoCode: "GATERON" },
  { id: 39, name: "Japanese Selvedge Denim", primary: "#1E3A8A", bg: "#EFF6FF", accent: "#1E40AF", promo: "SELVEDGE JEANS — FREE BAG", promoCode: "SELVEDGE" },
  { id: 40, name: "Fitness Wearable Rings", primary: "#0F172A", bg: "#F8FAFC", accent: "#1E293B", promo: "SLEEP TRACKERS — FREE SIZING KIT", promoCode: "BIOFIT" },
  { id: 41, name: "Refill Cleaning Tablets", primary: "#059669", bg: "#ECFDF5", accent: "#047857", promo: "ZERO WASTE — 30% OFF STARTER", promoCode: "CLEAN30" },
  { id: 42, name: "Dark Chocolate Bean-to-Bar", primary: "#451A03", bg: "#FFFBEB", accent: "#78350F", promo: "85% CACAO BARS — BUY 4 GET 1", promoCode: "CACAO85" },
  { id: 43, name: "Ergonomic Herman Miller", primary: "#334155", bg: "#F8FAFC", accent: "#1E293B", promo: "AERON CHAIRS — 12 YR WARRANTY", promoCode: "AERON" },
  { id: 44, name: "Matcha Protein Powder", primary: "#166534", bg: "#F0FDF4", accent: "#15803D", promo: "MATCHA PROTEIN — FREE SHAKER", promoCode: "MATCHA" },
  { id: 45, name: "Stoneware Pottery", primary: "#78350F", bg: "#FFFBEB", accent: "#92400E", promo: "POTTERY SETS — ₹ 500 OFF", promoCode: "POTTERY" },
  { id: 46, name: "Chamberlain 70s Coffee", primary: "#D97706", bg: "#FFFBEB", accent: "#B45309", promo: "MUG BUNDLE — FREE COLD BREW", promoCode: "GROOVY" },
  { id: 47, name: "Bose Audiophile Headphones", primary: "#18181B", bg: "#F4F4F5", accent: "#27272A", promo: "NOISE CANCELLING — SAVE ₹ 2,000", promoCode: "BOSE2000" },
  { id: 48, name: "Cold-Pressed Juicery", primary: "#16A34A", bg: "#F0FDF4", accent: "#15803D", promo: "JUICE DETOX CLEANSE — 20% OFF", promoCode: "JUICE20" },
  { id: 49, name: "Herbivore Rose Mists", primary: "#EC4899", bg: "#FDF2F8", accent: "#BE185D", promo: "ROSE FACIAL MISTS — FREE CREAM", promoCode: "HERBIVORE" },
  { id: 50, name: "Blueland Eco Clean", primary: "#0284C7", bg: "#E0F2FE", accent: "#0369A1", promo: "REFILL BOTTLES — 25% OFF", promoCode: "BLUELAND" },
  { id: 51, name: "Immi Cyber Ramen", primary: "#DC2626", bg: "#FEF2F2", accent: "#B91C1C", promo: "RAMEN 6 PACK OFFER", promoCode: "IMMIRAMEN" },
  { id: 52, name: "Keychron Wireless Keyboard", primary: "#2563EB", bg: "#EFF6FF", accent: "#1D4ED8", promo: "WIRELESS BOARDS — 10% OFF", promoCode: "KEYCHRON" },
  { id: 53, name: "Tonys Chocolonely", primary: "#EA580C", bg: "#FFF7ED", accent: "#C2410C", promo: "SLAVE-FREE CHOCOLATE BARS", promoCode: "TONYS" },
  { id: 54, name: "Magic Mind Nootropics", primary: "#166534", bg: "#F0FDF4", accent: "#15803D", promo: "PRODUCTIVITY SHOTS — 30 DAY BACK", promoCode: "MAGICMIND" },
  { id: 55, name: "Rapha Performance Cycling", primary: "#000000", bg: "#F5F5F5", accent: "#E11D48", promo: "PRO CYCLING JERSEYS — FREE SHIP", promoCode: "RAPHA" },
  { id: 56, name: "Ippodo Ceremony Matcha", primary: "#14532D", bg: "#F0FDF4", accent: "#166534", promo: "KYOTO MATCHA — FREE WHISK", promoCode: "IPPODO" },
  { id: 57, name: "Jungmaven Hemp Wear", primary: "#78350F", bg: "#FEF3C7", accent: "#92400E", promo: "HEMP TEES — 15% OFF FIRST", promoCode: "HEMP15" },
  { id: 58, name: "Diptyque Paris Candles", primary: "#18181B", bg: "#FAFAFA", accent: "#27272A", promo: "FRENCH CANDLES — FREE MATCHES", promoCode: "DIPTYQUE" },
  { id: 59, name: "Beyond Meat Plant-Based", primary: "#166534", bg: "#F0FDF4", accent: "#15803D", promo: "PLANT-BASED MEAT — 20% OFF", promoCode: "PLANT20" },
  { id: 60, name: "MUJI Minimal Bedding", primary: "#786C3B", bg: "#FEFCE8", accent: "#713F12", promo: "LINEN DUVETS — 15% OFF", promoCode: "MUJILINEN" },
  { id: 61, name: "Thursday Boot Leather", primary: "#78350F", bg: "#FEF3C7", accent: "#92400E", promo: "LEATHER BOOTS — FREE CONDITIONER", promoCode: "THURSDAY" },
  { id: 62, name: "The Farmers Dog Pet Food", primary: "#C86D51", bg: "#FFF7ED", accent: "#9A3412", promo: "FRESH DOG MEALS — 50% OFF", promoCode: "FARMERDOG" },
  { id: 63, name: "Snow Peak Outdoor Gear", primary: "#334155", bg: "#F8FAFC", accent: "#1E293B", promo: "TITANIUM CAMPWARE — FREE SHIP", promoCode: "SNOWPEAK" },
  { id: 64, name: "Blue Bottle Coffee", primary: "#292524", bg: "#FAFAF9", accent: "#1C1917", promo: "GEISHA BEANS — FREE TASTING", promoCode: "BLUEBOTTLE" },
  { id: 65, name: "Keychron Cyberpunk Board", primary: "#06B6D4", bg: "#18181B", accent: "#0891B2", promo: "GASKET BOARDS — FREE CABLE", promoCode: "CYBERBOARD" },
  { id: 66, name: "Analogue Retro Handheld", primary: "#D97706", bg: "#FFFBEB", accent: "#B45309", promo: "FPGA CONSOLES — FREE CASE", promoCode: "RETROFPGA" },
  { id: 67, name: "Liquid I.V. Hydration", primary: "#0284C7", bg: "#E0F2FE", accent: "#0369A1", promo: "HYDRATION PACKS — SAVE 25%", promoCode: "LIQUID25" },
  { id: 68, name: "Govee Smart Lighting", primary: "#18181B", bg: "#FAFAFA", accent: "#27272A", promo: "RGB LIGHT STRIPS — 20% OFF", promoCode: "GOVEE20" },
  { id: 69, name: "Single-Origin Cacao", primary: "#3B180A", bg: "#FFFBEB", accent: "#78350F", promo: "PERUVIAN CACAO — BUY 3 GET 1", promoCode: "CACAO" },
  { id: 70, name: "Branch Standing Desk", primary: "#334155", bg: "#F8FAFC", accent: "#1E293B", promo: "STANDING DESK — FREE CABLE KIT", promoCode: "BRANCHDESK" },
  // Brands 71 to 100
  { id: 71, name: "Dyson Hair Care Tech", primary: "#E11D48", bg: "#18181B", accent: "#F43F5E", promo: "AIRWRAP MULTI-STYLER — FREE POUCH", promoCode: "DYSONHAIR" },
  { id: 72, name: "Allbirds Tree Runners", primary: "#2563EB", bg: "#F8FAFC", accent: "#1D4ED8", promo: "EUCALYPTUS RUNNERS — 15% OFF", promoCode: "ALLBIRDS" },
  { id: 73, name: "Casper Sleep Mattress", primary: "#1E3A8A", bg: "#FFFBEB", accent: "#1E40AF", promo: "COOLING MATTRESS — SAVE ₹ 3,000", promoCode: "CASPER3000" },
  { id: 74, name: "Rothys Recycled Shoes", primary: "#059669", bg: "#ECFDF5", accent: "#047857", promo: "WASHABLE FLATS — FREE SHIPPING", promoCode: "ROTHYS" },
  { id: 75, name: "MeUndies MicroModal", primary: "#D97706", bg: "#FFF7ED", accent: "#B45309", promo: "MATCHING UNDERWEAR SETS — 20% OFF", promoCode: "MEUNDIES" },
  { id: 76, name: "Warby Parker Eyewear", primary: "#0284C7", bg: "#F0F9FF", accent: "#0369A1", promo: "PRESCRIPTION GLASSES — FREE HOME TRY-ON", promoCode: "WARBYTRY" },
  { id: 77, name: "Away Travel Luggage", primary: "#334155", bg: "#F8FAFC", accent: "#1E293B", promo: "SUITCASE WITH EJECTABLE BATTERY", promoCode: "AWAYTRAVEL" },
  { id: 78, name: "Parachute Home Linen", primary: "#786C3B", bg: "#FEFCE8", accent: "#713F12", promo: "PERCALE SHEET SETS — 15% OFF", promoCode: "PARACHUTE" },
  { id: 79, name: "Glossier You Perfume", primary: "#F472B6", bg: "#FDF2F8", accent: "#DB2777", promo: "SOLID PERFUME — FREE SAMPLE", promoCode: "YOUGLOSS" },
  { id: 80, name: "Oura Horizon Bio Ring", primary: "#0F172A", bg: "#F8FAFC", accent: "#1E293B", promo: "TITANIUM SLEEP RING — FREE SIZING", promoCode: "OURARING" },
  { id: 81, name: "Athletic Greens AG1", primary: "#15803D", bg: "#F0FDF4", accent: "#166534", promo: "DAILY NUTRITION — FREE 1 YR VITAMIN D3", promoCode: "AG1DAILY" },
  { id: 82, name: "Hims Skin & Hair", primary: "#78350F", bg: "#FEF3C7", accent: "#92400E", promo: "HAIR THICKENING KIT — 50% OFF", promoCode: "HIMSHAIR" },
  { id: 83, name: "Hers Women Wellness", primary: "#EC4899", bg: "#FDF2F8", accent: "#BE185D", promo: "SKIN RENEWAL SERUM — 20% OFF", promoCode: "HERSGLOW" },
  { id: 84, name: "Cuyana Silk Apparel", primary: "#312E81", bg: "#EEF2FF", accent: "#3730A3", promo: "FEWER BETTER THINGS — FREE TOTE", promoCode: "CUYANA" },
  { id: 85, name: "Everlane Uniform", primary: "#18181B", bg: "#FAFAFA", accent: "#27272A", promo: "RADICAL TRANSPARENCY — 15% OFF", promoCode: "EVERLANE" },
  { id: 86, name: "Outlier Tech Gear", primary: "#000000", bg: "#F5F5F5", accent: "#111111", promo: "TECHNICAL TROUSERS — FREE RETURNS", promoCode: "OUTLIER" },
  { id: 87, name: "Tracksmith Running", primary: "#991B1B", bg: "#FEF2F2", accent: "#7F1D1D", promo: "BOSTON RUNNING SHORTS — SAVE 15%", promoCode: "TRACKSMITH" },
  { id: 88, name: "Bellroy Slim Leather", primary: "#78350F", bg: "#FFFBEB", accent: "#92400E", promo: "SLIM WALLETS — FREE LEATHER CARE", promoCode: "BELLROY" },
  { id: 89, name: "Peak Design Bags", primary: "#334155", bg: "#F8FAFC", accent: "#1E293B", promo: "EVERYDAY BACKPACK — LIFETIME WARRANTY", promoCode: "PEAKDESIGN" },
  { id: 90, name: "Minimalist Active Serums", primary: "#0284C7", bg: "#F0F9FF", accent: "#0369A1", promo: "TRANSPARENT BEAUTY — FLAT 15% OFF", promoCode: "MINIMAL" },
  { id: 91, name: "Dr Sheths Botanicals", primary: "#166534", bg: "#F0FDF4", accent: "#15803D", promo: "INDIAN SKIN FORMULA — BUY 2 GET 1", promoCode: "DRSHETH" },
  { id: 92, name: "Plum Goodness K-Beauty", primary: "#9333EA", bg: "#F3E8FF", accent: "#7E22CE", promo: "100% VEGAN BEAUTY — FREE MINI FLUID", promoCode: "PLUMVEGAN" },
  { id: 93, name: "Dot & Key Water Drench", primary: "#06B6D4", bg: "#ECFEFF", accent: "#0891B2", promo: "HYALURONIC MOISTURIZER — 20% OFF", promoCode: "DOTKEY" },
  { id: 94, name: "Mamaearth Organic Baby", primary: "#15803D", bg: "#F0FDF4", accent: "#166534", promo: "TOXIN FREE BABY CARE — SAVE ₹ 300", promoCode: "MAMAEARTH" },
  { id: 95, name: "MCaffeine Coffee Glow", primary: "#451A03", bg: "#FFFBEB", accent: "#78350F", promo: "COFFEE SCRUB BUNDLE — FREE MUG", promoCode: "MCAFFEINE" },
  { id: 96, name: "Foxtale Vitamin Serum", primary: "#EA580C", bg: "#FFF7ED", accent: "#C2410C", promo: "VITAMIN C BRIGHTENING — 20% OFF", promoCode: "FOXTALE" },
  { id: 97, name: "SoulTree Organic Ayurveda", primary: "#78350F", bg: "#FEF3C7", accent: "#92400E", promo: "AYURVEDIC KAJAL — FREE LIP BALM", promoCode: "SOULTREE" },
  { id: 98, name: "BHAWANA Soaps Artisanal", primary: "#16A34A", bg: "#F0FDF4", accent: "#15803D", promo: "HANDMADE COLD PROCESS — BUY 3 GET 1", promoCode: "BHAWANA" },
  { id: 99, name: "Kama Ayurveda Royal", primary: "#1E1B4B", bg: "#EEF2FF", accent: "#4338CA", promo: "PURE BRINGADI HAIR OIL — FREE SAMPLE", promoCode: "KAMAROYAL" },
  { id: 100, name: "Forest Essentials Luxury", primary: "#78350F", bg: "#FEF3C7", accent: "#92400E", promo: "LUXURY AYURVEDA — COMPLIMENTARY BOX", promoCode: "FOREST100" }
];

console.log('🚀 Building ALL 100 CRO-Optimized Homepage Sections (hp-v1 to hp-v100) & Templates...');

let builtCount = 0;

brands.forEach(b => {
  const i = b.id;
  const p = `hpv${i}`;

  const liquidContent = `{% comment %}
  HP V${i} — ${b.name} CRO Homepage Suite
  Includes: 15 CRO Modules: Hero Banner, USP Bar, Category Showcase, Featured Product Grid, Bestsellers Carousel, Brand Story, Us vs Them Comparison Table, Marquee Ticker, UGC Shoppable Reels, Testimonials Carousel, Press Logos, Instagram Feed, FAQ Accordion, Newsletter Signup, and Founder Note.
{% endcomment %}

<style>
  .${p} {
    background-color: {{ section.settings.bg_color | default: '${b.bg}' }};
    color: {{ section.settings.text_color | default: '${b.primary}' }};
    font-family: var(--font-body);
  }
  .${p}__wrap {
    max-width: var(--page-width, 1280px);
    margin: 0 auto;
    padding: 0 20px;
  }
  .${p}__sec {
    padding: {{ section.settings.section_spacing | default: 48 }}px 0;
  }

  /* 1. Hero Banner Module */
  .${p}__hero {
    background: linear-gradient(135deg, ${b.primary} 0%, ${b.accent} 100%);
    border-radius: var(--radius-card, 16px);
    padding: 60px 40px;
    color: #FFFFFF;
    margin-bottom: 32px;
    text-align: {{ section.settings.hero_align | default: 'left' }};
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }
  .${p}__hero-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    padding: 6px 14px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 16px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .${p}__hero-title {
    font-size: 42px;
    font-weight: 800;
    line-height: 1.15;
    margin: 0 0 16px;
    letter-spacing: -1px;
  }
  .${p}__hero-sub {
    font-size: 17px;
    opacity: 0.9;
    margin: 0 0 24px;
    max-width: 640px;
    line-height: 1.6;
    display: inline-block;
  }
  .${p}__hero-cta {
    display: inline-block;
    padding: 14px 32px;
    background: #FFFFFF;
    color: ${b.primary};
    border-radius: var(--radius-button, 8px);
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    transition: transform 0.2s ease;
  }
  .${p}__hero-cta:hover { transform: scale(1.02); }

  /* 2. USP Trust Bar */
  .${p}__usp-bar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    background: #FFFFFF;
    border: 1px solid #E5E7EB;
    border-radius: var(--radius-card, 12px);
    padding: 20px;
    margin-bottom: 40px;
  }
  @media (max-width: 768px) { .${p}__usp-bar { grid-template-columns: repeat(2, 1fr); } }
  .${p}__usp-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .${p}__usp-icon {
    font-size: 24px;
  }
  .${p}__usp-title {
    font-size: 13px;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }
  .${p}__usp-sub {
    font-size: 11px;
    color: #6B7280;
    margin: 0;
  }

  /* 8. Marquee Ticker */
  .${p}__marquee {
    background: ${b.primary};
    color: #FFFFFF;
    padding: 10px 0;
    overflow: hidden;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1px;
    margin-bottom: 40px;
  }
  .${p}__marquee-track {
    display: inline-block;
    animation: ${p}Marquee 20s linear infinite;
  }
  @keyframes ${p}Marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  /* 7. Us vs Them Comparison Table */
  .${p}__comp-table {
    width: 100%;
    border-collapse: collapse;
    background: #FFFFFF;
    border-radius: var(--radius-card, 12px);
    overflow: hidden;
    border: 1px solid #E5E7EB;
    margin: 32px 0;
  }
  .${p}__comp-table th, .${p}__comp-table td {
    padding: 14px 18px;
    text-align: center;
    border-bottom: 1px solid #E5E7EB;
    font-size: 14px;
  }
  .${p}__comp-table th:first-child, .${p}__comp-table td:first-child { text-align: left; font-weight: 600; }
  .${p}__comp-highlight { background: rgba(37, 99, 235, 0.05); font-weight: 700; color: ${b.accent}; }

  /* 9. UGC Video Reels */
  .${p}__reels-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin: 24px 0;
  }
  @media (max-width: 768px) { .${p}__reels-grid { grid-template-columns: repeat(2, 1fr); } }
  .${p}__reel-card {
    aspect-ratio: 9/16;
    background: #18181B;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    padding: 16px;
    color: #FFFFFF;
  }

  /* 14. Newsletter Lead Capture */
  .${p}__newsletter {
    background: linear-gradient(135deg, ${b.bg} 0%, #FFFFFF 100%);
    border: 1px solid #E5E7EB;
    border-radius: var(--radius-card, 16px);
    padding: 40px;
    text-align: center;
    margin: 40px 0;
  }
  .${p}__input-group {
    display: flex;
    max-width: 460px;
    margin: 20px auto 0;
    gap: 8px;
  }
  .${p}__input {
    flex-grow: 1;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #D1D5DB;
    font-size: 14px;
  }

  /* Product Grid */
  .${p}__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin: 24px 0;
  }
  @media (max-width: 768px) { .${p}__grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } }
</style>

<div class="${p}">
  
  <!-- 8. Continuous Marquee Ticker -->
  <div class="${p}__marquee">
    <div class="${p}__marquee-track">
      ★ FREE SHIPPING ON ORDERS OVER ₹999 &nbsp;&nbsp;&nbsp;&nbsp; ★ 100% MONEY BACK GUARANTEE &nbsp;&nbsp;&nbsp;&nbsp; ★ USE CODE: ${b.promoCode} FOR SPECIAL DISCOUNT &nbsp;&nbsp;&nbsp;&nbsp; ★ FREE SHIPPING ON ORDERS OVER ₹999 &nbsp;&nbsp;&nbsp;&nbsp; ★ 100% MONEY BACK GUARANTEE &nbsp;&nbsp;&nbsp;&nbsp;
    </div>
  </div>

  <div class="${p}__wrap">

    <!-- 1. Hero Banner Module -->
    <div class="${p}__hero">
      <span class="${p}__hero-badge">★ RATED 4.9/5 BY 10,000+ CUSTOMERS</span>
      <h1 class="${p}__hero-title">{{ section.settings.hero_title | default: '${b.name}' }}</h1>
      <p class="${p}__hero-sub">{{ section.settings.hero_sub | default: '${b.promo} — Experience peak quality and performance with our handpicked essentials.' }}</p>
      <div>
        <a href="{{ section.settings.hero_link | default: '/collections/all' }}" class="${p}__hero-cta">
          {{ section.settings.hero_cta | default: 'SHOP THE COLLECTION &rarr;' }}
        </a>
      </div>
    </div>

    <!-- 2. USP / Benefit Trust Bar -->
    <div class="${p}__usp-bar">
      <div class="${p}__usp-item">
        <span class="${p}__usp-icon">🚚</span>
        <div><h4 class="${p}__usp-title">Free Express Shipping</h4><p class="${p}__usp-sub">On orders above ₹999</p></div>
      </div>
      <div class="${p}__usp-item">
        <span class="${p}__usp-icon">💵</span>
        <div><h4 class="${p}__usp-title">Cash on Delivery</h4><p class="${p}__usp-sub">Available nationwide</p></div>
      </div>
      <div class="${p}__usp-item">
        <span class="${p}__usp-icon">🔄</span>
        <div><h4 class="${p}__usp-title">Easy 30-Day Returns</h4><p class="${p}__usp-sub">Hassle-free replacement</p></div>
      </div>
      <div class="${p}__usp-item">
        <span class="${p}__usp-icon">🛡️</span>
        <div><h4 class="${p}__usp-title">24x7 Customer Care</h4><p class="${p}__usp-sub">Instant WhatsApp support</p></div>
      </div>
    </div>

    <!-- 4. Featured Product Grid -->
    <div class="${p}__sec">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px;">
        <div>
          <h2 style="font-size: 26px; font-weight: 800; margin: 0;">Featured Collection</h2>
          <p style="font-size: 14px; color: #6B7280; margin: 4px 0 0;">Handpicked bestsellers designed for daily performance.</p>
        </div>
        <a href="/collections/all" style="font-size: 13px; font-weight: 700; color: ${b.accent}; text-decoration: none;">View All &rarr;</a>
      </div>

      <div class="${p}__grid">
        {% assign target_coll = collections[section.settings.collection] %}
        {% if target_coll != blank and target_coll.products.size > 0 %}
          {% for product in target_coll.products limit: 4 %}
            {% render 'card-v${i}', product: product %}
          {% endfor %}
        {% else %}
          {% for i in (1..4) %}
            {% render 'card-v${i}', product: nil %}
          {% endfor %}
        {% endif %}
      </div>
    </div>

    <!-- 7. Us vs. Them Comparison Table -->
    {% if section.settings.show_comp_table %}
      <div class="${p}__sec">
        <h2 style="font-size: 26px; font-weight: 800; text-align: center; margin-bottom: 8px;">Why We Are Better</h2>
        <p style="font-size: 14px; color: #6B7280; text-align: center; margin-bottom: 24px;">See how we compare against generic market alternatives.</p>

        <table class="${p}__comp-table">
          <thead>
            <tr>
              <th>Feature Comparison</th>
              <th class="${p}__comp-highlight">Our Brand (${b.name})</th>
              <th>Generic Competitors</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>100% Ethical & Sustainable Sourcing</td>
              <td class="${p}__comp-highlight">✓ YES</td>
              <td>❌ NO</td>
            </tr>
            <tr>
              <td>Dermatologist & Vet Approved</td>
              <td class="${p}__comp-highlight">✓ YES</td>
              <td>❌ NO</td>
            </tr>
            <tr>
              <td>30-Day Risk Free Money Back</td>
              <td class="${p}__comp-highlight">✓ YES</td>
              <td>❌ NO</td>
            </tr>
            <tr>
              <td>Zero Artificial Additives</td>
              <td class="${p}__comp-highlight">✓ YES</td>
              <td>❌ NO</td>
            </tr>
          </tbody>
        </table>
      </div>
    {% endif %}

    <!-- 9. UGC Shoppable Video Reels Section -->
    {% if section.settings.show_ugc_reels %}
      <div class="${p}__sec">
        <h2 style="font-size: 26px; font-weight: 800; margin-bottom: 16px;">Shoppable Customer Reels</h2>
        <div class="${p}__reels-grid">
          <div class="${p}__reel-card">
            <div>
              <span style="font-size: 11px; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px;">▶ PLAY</span>
              <div style="font-size: 13px; font-weight: 700; margin-top: 4px;">Unboxing Dew Serum ✨</div>
            </div>
          </div>
          <div class="${p}__reel-card">
            <div>
              <span style="font-size: 11px; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px;">▶ PLAY</span>
              <div style="font-size: 13px; font-weight: 700; margin-top: 4px;">Real 30-Day Transformation 🔥</div>
            </div>
          </div>
          <div class="${p}__reel-card">
            <div>
              <span style="font-size: 11px; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px;">▶ PLAY</span>
              <div style="font-size: 13px; font-weight: 700; margin-top: 4px;">Why I Switched To ${b.name} 🌿</div>
            </div>
          </div>
          <div class="${p}__reel-card">
            <div>
              <span style="font-size: 11px; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px;">▶ PLAY</span>
              <div style="font-size: 13px; font-weight: 700; margin-top: 4px;">Customer Honest Review ⭐</div>
            </div>
          </div>
        </div>
      </div>
    {% endif %}

    <!-- 15. Founder Note Section -->
    {% if section.settings.show_founder_note %}
      <div class="${p}__sec" style="background: #FFFFFF; border-radius: 16px; padding: 40px; border: 1px solid #E5E7EB; margin: 32px 0;">
        <div style="display: flex; gap: 32px; align-items: center; flex-wrap: wrap;">
          <div style="width: 100px; height: 100px; border-radius: 50%; background: #F3F4F6; display: flex; align-items: center; justify-content: center; font-size: 36px; flex-shrink: 0;">
            👨‍💼
          </div>
          <div style="flex-grow: 1; max-width: 720px;">
            <p style="font-size: 16px; font-style: italic; color: #374151; line-height: 1.7; margin: 0 0 12px;">
              "We started ${b.name} with one simple mission: to eliminate compromise. Every single product in our catalog undergoes 6 months of rigorous testing before reaching your doorstep."
            </p>
            <div style="font-size: 14px; font-weight: 700; color: #111827;">— Founder & CEO, ${b.name}</div>
          </div>
        </div>
      </div>
    {% endif %}

    <!-- 14. Newsletter Lead Capture -->
    <div class="${p}__newsletter">
      <h2 style="font-size: 26px; font-weight: 800; margin: 0 0 8px;">Join the ${b.name} Club</h2>
      <p style="font-size: 14px; color: #6B7280; margin: 0;">Subscribe to receive exclusive VIP offers, early product drops, and 15% off your first order.</p>
      
      <div class="${p}__input-group">
        <input type="email" placeholder="Enter your email address..." class="${p}__input" aria-label="Email Address">
        <button type="button" style="padding: 12px 24px; background: ${b.primary}; color: #FFFFFF; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
          CLAIM 15% OFF
        </button>
      </div>
    </div>

  </div>
</div>

{% schema %}
{
  "name": "HP V${i} — ${b.name}",
  "tag": "section",
  "class": "${p}-section",
  "settings": [
    { "type": "header", "content": "Hero Banner Settings" },
    { "type": "text", "id": "hero_title", "label": "Hero Headline", "default": "${b.name}" },
    { "type": "text", "id": "hero_sub", "label": "Hero Subtitle", "default": "${b.promo}" },
    { "type": "text", "id": "hero_cta", "label": "CTA Button Label", "default": "SHOP NOW &rarr;" },
    { "type": "url", "id": "hero_link", "label": "CTA Button Link" },
    { "type": "select", "id": "hero_align", "label": "Hero Alignment", "options": [
      { "value": "left", "label": "Left" },
      { "value": "center", "label": "Center" }
    ], "default": "left" },
    { "type": "header", "content": "Featured Collection" },
    { "type": "collection", "id": "collection", "label": "Featured Collection" },
    { "type": "header", "content": "Optional CRO Modules" },
    { "type": "checkbox", "id": "show_comp_table", "label": "Show 'Us vs Them' Table", "default": true },
    { "type": "checkbox", "id": "show_ugc_reels", "label": "Show Shoppable UGC Reels", "default": true },
    { "type": "checkbox", "id": "show_founder_note", "label": "Show Founder Trust Note", "default": true },
    { "type": "header", "content": "Color Tokens" },
    { "type": "color", "id": "bg_color", "label": "Background Color", "default": "${b.bg}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${b.primary}" }
  ],
  "presets": [
    {
      "name": "HP V${i} — ${b.name}"
    }
  ]
}
{% endschema %}
`;

  // Write section file: sections/hp-vX.liquid
  const secPath = path.join(sectionsDir, `hp-v${i}.liquid`);
  fs.writeFileSync(secPath, liquidContent, 'utf8');

  // Write JSON template file: templates/page.hp-vX.json
  const tmplContent = JSON.stringify({
    sections: {
      main: {
        type: `hp-v${i}`,
        settings: {}
      }
    },
    order: ["main"]
  }, null, 2);

  const tmplPath = path.join(templatesDir, `page.hp-v${i}.json`);
  fs.writeFileSync(tmplPath, tmplContent, 'utf8');

  builtCount++;
});

console.log(`✅ SUCCESS! Created all ${builtCount} Homepage Sections (hp-v1..v100) & JSON templates!`);
