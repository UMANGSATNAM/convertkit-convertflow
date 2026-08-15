const fs = require('fs');
const path = require('path');

const sectionsDir = 'i:\\converflow app\\dev-theme-peri\\sections';
const templatesDir = 'i:\\converflow app\\dev-theme-peri\\templates';

// Define 70 Brand Configurations matching exact D2C niches
const brands = [
  { id: 1, name: "Glossier Clean Beauty", primary: "#3D9A98", bg: "#FFF5F5", accent: "#E11D48", promo: "GET 20% OFF CLEAN BEAUTY SETS", promoCode: "GLOW20" },
  { id: 2, name: "Gymshark Activewear", primary: "#111111", bg: "#F4F4F5", accent: "#000000", promo: "EXTRA 15% OFF ACTIVEWEAR", promoCode: "SHRED15" },
  { id: 3, name: "Aesop Apothecary", primary: "#2F3E30", bg: "#F4F1EA", accent: "#1C241B", promo: "COMPLIMENTARY BOTANICAL SAMPLE WITH EVERY ORDER", promoCode: "BOTANICAL" },
  { id: 4, name: "Cyberpunk Y2K", primary: "#FF0055", bg: "#0D0D12", accent: "#00F0FF", promo: "NEON STREETWEAR DROP — FLAT 25% OFF", promoCode: "CYBER25" },
  { id: 5, name: "Off-White High Fashion", primary: "#000000", bg: "#FFFFFF", accent: "#000000", promo: "AUTUMN ARCHIVE COLLECTION NOW LIVE", promoCode: "ARCHIVE" },
  { id: 6, name: "Nordic Minimal Living", primary: "#4A5568", bg: "#F7FAFC", accent: "#2D3748", promo: "SUSTAINABLE NORDIC HOMES — 10% OFF", promoCode: "NORDIC10" },
  { id: 7, name: "Liquid Death Punk", primary: "#000000", bg: "#FFFBEB", accent: "#FFD700", promo: "MURDER YOUR THIRST — 6 PACK BUNDLE DISCOUNT", promoCode: "MURDER" },
  { id: 8, name: "Apple Minimal Tech", primary: "#1D1D1F", bg: "#F5F5F7", accent: "#0066CC", promo: "COMPATIBLE ACCESSORIES — SAVE 15%", promoCode: "APPLE15" },
  { id: 9, name: "Retro Vintage Brewery", primary: "#78350F", bg: "#FEF3C7", accent: "#B45309", promo: "CRAFT MALT BEER PACKS — BUY 2 GET 1 FREE", promoCode: "CRAFTBEER" },
  { id: 10, name: "Organic Botanical", primary: "#166534", bg: "#F0FDF4", accent: "#15803D", promo: "100% ORGANIC CERTIFIED — FREE SHIPPING", promoCode: "ORGANIC" },
  { id: 11, name: "Neo-Brutalist Y2K", primary: "#000000", bg: "#FFE600", accent: "#000000", promo: "RAW DESIGN DROPS — FLAT ₹ 500 OFF", promoCode: "BRUTAL" },
  { id: 12, name: "High Jewelry Atelier", primary: "#1E1B4B", bg: "#EEF2FF", accent: "#4338CA", promo: "COMPLIMENTARY JEWELRY CLEANING KIT", promoCode: "ATELIER" },
  { id: 13, name: "Eco Wool Footwear", primary: "#2D3748", bg: "#EDF2F7", accent: "#1A202C", promo: "ZERO-CARBON FOOTPRINT SHOES — ₹ 1,000 OFF", promoCode: "WOOLFOOT" },
  { id: 14, name: "Artisanal Coffee", primary: "#451A03", bg: "#FEF3C7", accent: "#78350F", promo: "FRESHLY ROASTED ESPRESSO BEANS — SAVE 20%", promoCode: "ROAST20" },
  { id: 15, name: "Tactical Outdoor Gear", primary: "#1C1917", bg: "#E7E5E4", accent: "#44403C", promo: "MILITARY-GRADE EXPEDITION GEAR — 15% OFF", promoCode: "TACTICAL" },
  { id: 16, name: "K-Beauty Glass Skin", primary: "#F472B6", bg: "#FDF2F8", accent: "#DB2777", promo: "DEWY HYDRATION SETS — FREE ESSENCE SPRAY", promoCode: "GLASSKIN" },
  { id: 17, name: "The Farmers Dog Pet", primary: "#C86D51", bg: "#FFF7ED", accent: "#9A3412", promo: "HUMAN-GRADE VET FORMULATED MEALS — 50% OFF TRIAL", promoCode: "PUP50" },
  { id: 18, name: "Smart Home IoT", primary: "#06B6D4", bg: "#ECFEFF", accent: "#0891B2", promo: "MATTER-ENABLED LIGHT KITS — SAVE ₹ 1,500", promoCode: "SMARTKIT" },
  { id: 19, name: "Artisanal Sourdough", primary: "#78350F", bg: "#FFFBEB", accent: "#92400E", promo: "FRESH BREAD SUBSCRIPTION — 1ST BOX FREE", promoCode: "SOURDOUGH" },
  { id: 20, name: "Retro 8-Bit Arcade", primary: "#8B5CF6", bg: "#F5F3FF", accent: "#6D28D9", promo: "PIXEL CONSOLES — FREE RETRO STICKER PACK", promoCode: "PIXEL8" },
  { id: 21, name: "Clinical Derma Lab", primary: "#0284C7", bg: "#F0F9FF", accent: "#0369A1", promo: "DERMATOLOGIST APPROVED SERUMS — 20% OFF", promoCode: "DERMA20" },
  { id: 22, name: "Pro Activewear Performance", primary: "#991B1B", bg: "#FEF2F2", accent: "#7F1D1D", promo: "SWEAT-WICKING APPAREL — BUY 2 GET 20% OFF", promoCode: "PROACTIVE" },
  { id: 23, name: "Herbal Tea Infusions", primary: "#15803D", bg: "#F0FDF4", accent: "#166534", promo: "ORGANIC CHAMOMILE BUNDLE — FREE TEAPOT", promoCode: "HERBAL" },
  { id: 24, name: "Luxury Timepieces", primary: "#0F172A", bg: "#F8FAFC", accent: "#1E293B", promo: "AUTOMATIC CHRONOGRAPHS — FREE WATCH WINDER", promoCode: "CHRONO" },
  { id: 25, name: "Eco Refill Cleaning", primary: "#0D9488", bg: "#CCFBF1", accent: "#0F766E", promo: "ZERO-PLASTIC REFILL PACKS — SAVE ₹ 300", promoCode: "REFILL" },
  { id: 26, name: "Gourmet Hot Sauce", primary: "#B91C1C", bg: "#FEF2F2", accent: "#991B1B", promo: "FIERY TRIPLE PACK — FREE CHILI OIL BOTTLE", promoCode: "SPICY" },
  { id: 27, name: "Japanese Stationery", primary: "#475569", bg: "#F8FAFC", accent: "#334155", promo: "MINIMALIST WASHI JOURNALS — FLAT 15% OFF", promoCode: "WASHI15" },
  { id: 28, name: "Functional Hydration", primary: "#0284C7", bg: "#E0F2FE", accent: "#0369A1", promo: "ELECTROLYTE MULTIPLIER PACKS — 20% OFF", promoCode: "HYDRATE" },
  { id: 29, name: "Handcrafted Leather Goods", primary: "#78350F", bg: "#FEF3C7", accent: "#92400E", promo: "FULL-GRAIN COGNAC WALLETS — FREE MONOGRAMMING", promoCode: "LEATHER" },
  { id: 30, name: "Baby Essentials Organic", primary: "#F472B6", bg: "#FFF1F2", accent: "#E11D48", promo: "NEWBORN ORGANIC COTTON SETS — 25% OFF", promoCode: "BABY25" },
  { id: 31, name: "Running Shoes Performance", primary: "#334155", bg: "#F8FAFC", accent: "#1E293B", promo: "SPEEDBOARD CUSHIONED RUNNERS — FREE SOCKS", promoCode: "RUNNER" },
  { id: 32, name: "Artisanal Gelato", primary: "#EC4899", bg: "#FDF2F8", accent: "#BE185D", promo: "GELATO TUBS — BUY 3 GET 1 FREE DESSERT", promoCode: "GELATO" },
  { id: 33, name: "Cyberpunk Keyboards", primary: "#06B6D4", bg: "#18181B", accent: "#0891B2", promo: "RGB GASKET MOUNT BOARDS — FREE KEYCAP PULLER", promoCode: "RGBKEYS" },
  { id: 34, name: "Niche Perfumery", primary: "#312E81", bg: "#EEF2FF", accent: "#3730A3", promo: "HANDMADE VELVET OUD — COMPLIMENTARY 10ML SPRAY", promoCode: "VELVET" },
  { id: 35, name: "Tuscan Olive Oil", primary: "#65A30D", bg: "#F7FEE7", accent: "#4D7C0F", promo: "COLD PRESSED EXTRA VIRGIN — FREE DIPPING DISH", promoCode: "OLIVEOIL" },
  { id: 36, name: "Bamboo Eyewear", primary: "#A16207", bg: "#FEFCE8", accent: "#854D0E", promo: "POLARIZED BAMBOO FRAMES — 20% OFF", promoCode: "BAMBOO" },
  { id: 37, name: "Vitamin Nootropics", primary: "#7C3AED", bg: "#F5F3FF", accent: "#6D28D9", promo: "BRAIN FOCUS CAPSULES — BUY 2 GET 1 FREE", promoCode: "FOCUS" },
  { id: 38, name: "Craft Keyboards Gateron", primary: "#0F172A", bg: "#F1F5F9", accent: "#1E293B", promo: "HOT-SWAP MECHANICAL SWITCHES — 15% OFF", promoCode: "GATERON" },
  { id: 39, name: "Japanese Selvedge Denim", primary: "#1E3A8A", bg: "#EFF6FF", accent: "#1E40AF", promo: "RAW SELVEDGE JEANS — FREE DENIM BAG", promoCode: "SELVEDGE" },
  { id: 40, name: "Fitness Wearable Rings", primary: "#0F172A", bg: "#F8FAFC", accent: "#1E293B", promo: "TITANIUM SLEEP TRACKERS — FREE SIZING KIT", promoCode: "BIOFIT" },
  { id: 41, name: "Refill Cleaning Tablets", primary: "#059669", bg: "#ECFDF5", accent: "#047857", promo: "ZERO WASTE TABLETS — 30% OFF STARTER KIT", promoCode: "CLEAN30" },
  { id: 42, name: "Dark Chocolate Bean-to-Bar", primary: "#451A03", bg: "#FFFBEB", accent: "#78350F", promo: "85% SINGLE ORIGIN BARS — BUY 4 GET 1 FREE", promoCode: "CACAO85" },
  { id: 43, name: "Ergonomic Herman Miller", primary: "#334155", bg: "#F8FAFC", accent: "#1E293B", promo: "AERON ERGONOMIC CHAIRS — 12 YEAR WARRANTY", promoCode: "AERON" },
  { id: 44, name: "Matcha Protein Powder", primary: "#166534", bg: "#F0FDF4", accent: "#15803D", promo: "CEREMONIAL MATCHA PROTEIN — FREE SHAKER", promoCode: "MATCHA" },
  { id: 45, name: "Stoneware Pottery", primary: "#78350F", bg: "#FFFBEB", accent: "#92400E", promo: "HAND-THROWN POTTERY SETS — ₹ 500 COUPON", promoCode: "POTTERY" },
  { id: 46, name: "Chamberlain 70s Coffee", primary: "#D97706", bg: "#FFFBEB", accent: "#B45309", promo: "GROOVY MUG BUNDLE — FREE COLD BREW BAGS", promoCode: "GROOVY" },
  { id: 47, name: "Bose Audiophile Headphones", primary: "#18181B", bg: "#F4F4F5", accent: "#27272A", promo: "NOISE CANCELLING HEADPHONES — SAVE ₹ 2,000", promoCode: "BOSE2000" },
  { id: 48, name: "Cold-Pressed Juicery", primary: "#16A34A", bg: "#F0FDF4", accent: "#15803D", promo: "3-DAY JUICE DETOX CLEANSE — 20% OFF", promoCode: "JUICE20" },
  { id: 49, name: "Herbivore Rose Mists", primary: "#EC4899", bg: "#FDF2F8", accent: "#BE185D", promo: "ROSE QUARTZ FACIAL MISTS — FREE GLOW CREAM", promoCode: "HERBIVORE" },
  { id: 50, name: "Blueland Eco Clean", primary: "#0284C7", bg: "#E0F2FE", accent: "#0369A1", promo: "STAINLESS STEEL REFILL BOTTLES — 25% OFF", promoCode: "BLUELAND" },
  { id: 51, name: "Immi Cyber Ramen", primary: "#DC2626", bg: "#FEF2F2", accent: "#B91C1C", promo: "LOW-CARB HIGH-PROTEIN RAMEN — 6 PACK OFFER", promoCode: "IMMIRAMEN" },
  { id: 52, name: "Keychron Wireless Keyboard", primary: "#2563EB", bg: "#EFF6FF", accent: "#1D4ED8", promo: "MAC & WINDOWS WIRELESS BOARDS — 10% OFF", promoCode: "KEYCHRON" },
  { id: 53, name: "Tonys Chocolonely", primary: "#EA580C", bg: "#FFF7ED", accent: "#C2410C", promo: "100% SLAVE-FREE CHOCOLATE BARS — BUY 5 BARS", promoCode: "TONYS" },
  { id: 54, name: "Magic Mind Nootropics", primary: "#166534", bg: "#F0FDF4", accent: "#15803D", promo: "PRODUCTIVITY SHOTS — 30 DAY MONEY BACK", promoCode: "MAGICMIND" },
  { id: 55, name: "Rapha Performance Cycling", primary: "#000000", bg: "#F5F5F5", accent: "#E11D48", promo: "PRO TEAM CYCLING JERSEYS — FREE SHIPPING", promoCode: "RAPHA" },
  { id: 56, name: "Ippodo Ceremony Matcha", primary: "#14532D", bg: "#F0FDF4", accent: "#166534", promo: "KYOTO SINGLE ORIGIN MATCHA — COMPLIMENTARY WHISK", promoCode: "IPPODO" },
  { id: 57, name: "Jungmaven Hemp Wear", primary: "#78350F", bg: "#FEF3C7", accent: "#92400E", promo: "100% ORGANIC HEMP TEES — 15% OFF FIRST ORDER", promoCode: "HEMP15" },
  { id: 58, name: "Diptyque Paris Candles", primary: "#18181B", bg: "#FAFAFA", accent: "#27272A", promo: "FRENCH SOY CANDLES — COMPLIMENTARY MATCHBOX", promoCode: "DIPTYQUE" },
  { id: 59, name: "Beyond Meat Plant-Based", primary: "#166534", bg: "#F0FDF4", accent: "#15803D", promo: "100% PLANT-BASED MEAT PACKS — FLAT 20% OFF", promoCode: "PLANT20" },
  { id: 60, name: "MUJI Minimal Bedding", primary: "#786C3B", bg: "#FEFCE8", accent: "#713F12", promo: "100% ORGANIC WASHED LINEN DUVETS — 15% OFF", promoCode: "MUJILINEN" },
  { id: 61, name: "Thursday Boot Leather", primary: "#78350F", bg: "#FEF3C7", accent: "#92400E", promo: "GOODYEAR WELT LEATHER BOOTS — FREE LEATHER CONDITIONER", promoCode: "THURSDAY" },
  { id: 62, name: "The Farmers Dog Pet Food", primary: "#C86D51", bg: "#FFF7ED", accent: "#9A3412", promo: "HUMAN-GRADE FRESH DOG MEALS — 50% OFF TRIAL", promoCode: "FARMERDOG" },
  { id: 63, name: "Snow Peak Outdoor Gear", primary: "#334155", bg: "#F8FAFC", accent: "#1E293B", promo: "ULTRALIGHT TITANIUM CAMPWARE — FREE SHIPPING", promoCode: "SNOWPEAK" },
  { id: 64, name: "Blue Bottle Coffee", primary: "#292524", bg: "#FAFAF9", accent: "#1C1917", promo: "SINGLE-ORIGIN GEISHA BEANS — COMPLIMENTARY TASTING", promoCode: "BLUEBOTTLE" },
  { id: 65, name: "Keychron Cyberpunk Board", primary: "#06B6D4", bg: "#18181B", accent: "#0891B2", promo: "HOT-SWAPPABLE GASKET BOARDS — FREE COILED CABLE", promoCode: "CYBERBOARD" },
  { id: 66, name: "Analogue Retro Handheld", primary: "#D97706", bg: "#FFFBEB", accent: "#B45309", promo: "FPGA RETRO CONSOLES — FREE PROTECTIVE CASE", promoCode: "RETROFPGA" },
  { id: 67, name: "Liquid I.V. Hydration", primary: "#0284C7", bg: "#E0F2FE", accent: "#0369A1", promo: "RAPID HYDRATION MULTIPLIER PACKS — SAVE 25%", promoCode: "LIQUID25" },
  { id: 68, name: "Govee Smart Lighting", primary: "#18181B", bg: "#FAFAFA", accent: "#27272A", promo: "MATTER & APPLE HOME RGB LIGHT STRIPS — 20% OFF", promoCode: "GOVEE20" },
  { id: 69, name: "Single-Origin Cacao", primary: "#3B180A", bg: "#FFFBEB", accent: "#78350F", promo: "ETHICAL PERUVIAN SINGLE ORIGIN — BUY 3 GET 1 FREE", promoCode: "CACAO" },
  { id: 70, name: "Branch Standing Desk", primary: "#334155", bg: "#F8FAFC", accent: "#1E293B", promo: "DUAL-MOTOR STANDING DESK — FREE CABLE MANAGEMENT", promoCode: "BRANCHDESK" }
];

console.log('🚀 Building 70 Unique Collection Page Sections (cp-v1 to cp-v70) & Templates...');

let builtCount = 0;

brands.forEach(b => {
  const i = b.id;
  const p = `cpv${i}`;

  const liquidContent = `{% comment %}
  CP V${i} — ${b.name} D2C Collection Page Section
  Includes: Hero Header, Sub-collection chips, Filter + Sort Bar, Product Grid with card-v${i}, In-Grid Promo Tile every 8 products, Bottom SEO Text Block, and Pagination
{% endcomment %}

<style>
  .${p} {
    background-color: {{ section.settings.bg_color | default: '${b.bg}' }};
    color: {{ section.settings.text_color | default: '${b.primary}' }};
    padding: {{ section.settings.padding_top | default: 40 }}px 0 {{ section.settings.padding_bottom | default: 60 }}px;
    font-family: var(--font-body);
  }
  .${p}__wrap {
    max-width: var(--page-width, 1280px);
    margin: 0 auto;
    padding: 0 20px;
  }

  /* Collection Hero Header */
  .${p}__hero {
    background: {{ section.settings.hero_bg | default: '#FFFFFF' }};
    border-radius: var(--radius-card, 16px);
    padding: 36px 32px;
    margin-bottom: 24px;
    border: 1px solid {{ section.settings.border_color | default: '#E5E7EB' }};
    text-align: {{ section.settings.hero_align | default: 'left' }};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  }
  .${p}__hero-title {
    font-size: 32px;
    font-weight: 800;
    color: {{ section.settings.text_color | default: '${b.primary}' }};
    margin: 0 0 10px;
    letter-spacing: -0.5px;
  }
  .${p}__hero-sub {
    font-size: 15px;
    color: {{ section.settings.sub_color | default: '#6B7280' }};
    margin: 0;
    max-width: 720px;
    line-height: 1.6;
    display: inline-block;
  }

  /* Sub-collection Category Chips */
  .${p}__chips-box {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 8px;
    margin-bottom: 24px;
    scrollbar-width: none;
  }
  .${p}__chips-box::-webkit-scrollbar { display: none; }
  .${p}__chip {
    padding: 8px 18px;
    background: #FFFFFF;
    border: 1px solid {{ section.settings.border_color | default: '#E5E7EB' }};
    border-radius: 99px;
    font-size: 13px;
    font-weight: 600;
    color: {{ section.settings.text_color | default: '${b.primary}' }};
    text-decoration: none;
    white-space: nowrap;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .${p}__chip.active, .${p}__chip:hover {
    background: ${b.accent};
    color: #FFFFFF;
    border-color: ${b.accent};
  }

  /* Filter & Sort Bar */
  .${p}__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    background: #FFFFFF;
    border-radius: var(--radius-button, 10px);
    border: 1px solid {{ section.settings.border_color | default: '#E5E7EB' }};
    margin-bottom: 28px;
    gap: 16px;
    flex-wrap: wrap;
  }
  .${p}__filter-group {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .${p}__filter-select {
    padding: 8px 14px;
    border-radius: 6px;
    border: 1px solid #D1D5DB;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    background: #FFFFFF;
    cursor: pointer;
  }

  /* Product Grid */
  .${p}__grid {
    display: grid;
    grid-template-columns: repeat({{ section.settings.cols_desktop | default: 4 }}, 1fr);
    gap: {{ section.settings.grid_gap | default: 24 }}px;
  }
  @media (max-width: 1024px) {
    .${p}__grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 768px) {
    .${p}__grid { grid-template-columns: repeat({{ section.settings.cols_mobile | default: 2 }}, 1fr); gap: 16px; }
  }

  /* In-Grid Promo Banner Tile (Inserts every 8 products) */
  .${p}__promo-tile {
    grid-column: span 1;
    background: linear-gradient(135deg, ${b.primary} 0%, ${b.accent} 100%);
    border-radius: var(--radius-card, 16px);
    padding: 24px;
    color: #FFFFFF;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;
  }
  .${p}__promo-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 10px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    align-self: flex-start;
    margin-bottom: 12px;
  }
  .${p}__promo-title {
    font-size: 20px;
    font-weight: 800;
    line-height: 1.3;
    margin: 0 0 10px;
  }
  .${p}__promo-code-box {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .${p}__promo-btn {
    width: 100%;
    padding: 10px;
    background: #FFFFFF;
    color: ${b.primary};
    border-radius: var(--radius-button, 8px);
    font-size: 13px;
    font-weight: 700;
    text-align: center;
    text-decoration: none;
    display: block;
  }

  /* Bottom SEO Text Block */
  .${p}__seo-block {
    margin-top: 50px;
    background: #FFFFFF;
    border-radius: var(--radius-card, 12px);
    padding: 32px;
    border: 1px solid {{ section.settings.border_color | default: '#E5E7EB' }};
  }
  .${p}__seo-title {
    font-size: 22px;
    font-weight: 700;
    color: {{ section.settings.text_color | default: '${b.primary}' }};
    margin: 0 0 12px;
  }
  .${p}__seo-content {
    font-size: 14px;
    color: #4B5563;
    line-height: 1.7;
    max-height: 90px;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  .${p}__seo-block.expanded .${p}__seo-content {
    max-height: 1000px;
  }
  .${p}__seo-toggle {
    margin-top: 12px;
    background: none;
    border: none;
    color: ${b.accent};
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
  }
</style>

<div class="${p}">
  <div class="${p}__wrap">
    
    <!-- 1. Collection Hero Banner Header -->
    <div class="${p}__hero">
      <h1 class="${p}__hero-title">
        {% if collection.title != blank %}{{ collection.title | escape }}{% else %}{{ section.settings.title | default: '${b.name}' }}{% endif %}
      </h1>
      <div class="${p}__hero-sub">
        {% if collection.description != blank %}{{ collection.description }}{% else %}{{ section.settings.subheading | default: 'Discover our premium handcrafted collection designed for modern living.' }}{% endif %}
      </div>
    </div>

    <!-- 2. Sub-Collection Chips / Quick Category Tabs -->
    {% if section.settings.show_chips %}
      <div class="${p}__chips-box">
        <a href="#" class="${p}__chip active">All Products</a>
        <a href="#" class="${p}__chip">Best Sellers</a>
        <a href="#" class="${p}__chip">New Arrivals</a>
        <a href="#" class="${p}__chip">Special Offers</a>
        <a href="#" class="${p}__chip">Trending Now</a>
      </div>
    {% endif %}

    <!-- 3. Filter + Sort Controls Bar -->
    <div class="${p}__toolbar">
      <div class="${p}__filter-group">
        <span style="font-size: 13px; font-weight: 700; color: #374151;">Filters:</span>
        <select class="${p}__filter-select">
          <option>Price: All</option>
          <option>Under ₹1,000</option>
          <option>₹1,000 - ₹3,000</option>
          <option>Above ₹3,000</option>
        </select>
        <select class="${p}__filter-select">
          <option>Availability: All</option>
          <option>In Stock Only</option>
        </select>
        <select class="${p}__filter-select">
          <option>Size: All</option>
          <option>Small</option>
          <option>Medium</option>
          <option>Large</option>
        </select>
      </div>

      <div class="${p}__filter-group">
        <span style="font-size: 13px; font-weight: 700; color: #374151;">Sort By:</span>
        <select class="${p}__filter-select">
          <option>Featured</option>
          <option>Best Selling</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest</option>
        </select>
      </div>
    </div>

    <!-- 4. Product Grid (with In-Grid Promo Tile every 8 products) -->
    <div class="${p}__grid">
      {% assign target_coll = collections[section.settings.collection] %}
      {% assign limit_num = section.settings.products_per_page | default: 12 %}

      {% if target_coll != blank and target_coll.products.size > 0 %}
        {% for product in target_coll.products limit: limit_num %}
          {% render 'card-v${i}', product: product %}

          {% comment %} Insert In-Grid Promo Banner Card after 8th product {% endcomment %}
          {% if forloop.index == 8 and section.settings.show_promo_tile %}
            <div class="${p}__promo-tile">
              <div>
                <span class="${p}__promo-badge">SPECIAL OFFER</span>
                <h3 class="${p}__promo-title">${b.promo}</h3>
              </div>
              <div>
                <div class="${p}__promo-code-box">
                  <span>USE CODE:</span>
                  <span style="letter-spacing: 1px;">${b.promoCode}</span>
                </div>
                <a href="/discount/${b.promoCode}" class="${p}__promo-btn">CLAIM DISCOUNT</a>
              </div>
            </div>
          {% endif %}
        {% endfor %}
      {% else %}
        {% comment %} Fallback Demo Mode {% endcomment %}
        {% for i in (1..limit_num) %}
          {% render 'card-v${i}', product: nil %}

          {% if forloop.index == 8 and section.settings.show_promo_tile %}
            <div class="${p}__promo-tile">
              <div>
                <span class="${p}__promo-badge">SPECIAL OFFER</span>
                <h3 class="${p}__promo-title">${b.promo}</h3>
              </div>
              <div>
                <div class="${p}__promo-code-box">
                  <span>USE CODE:</span>
                  <span style="letter-spacing: 1px;">${b.promoCode}</span>
                </div>
                <a href="/discount/${b.promoCode}" class="${p}__promo-btn">CLAIM DISCOUNT</a>
              </div>
            </div>
          {% endif %}
        {% endfor %}
      {% endif %}
    </div>

    <!-- 5. Bottom Expandable SEO Text Block -->
    {% if section.settings.show_seo_block %}
      <div class="${p}__seo-block" id="${p}-seo-block">
        <h2 class="${p}__seo-title">{{ section.settings.seo_title | default: 'About Our Collection' }}</h2>
        <div class="${p}__seo-content">
          <p>{{ section.settings.seo_text | default: 'Explore our complete range of high-performance products crafted with sustainable materials and cutting-edge design. Designed to deliver exceptional durability, comfort, and style for daily use.' }}</p>
          <p>Our commitment to quality ensures every item meets rigorous international standards. Shop with confidence backed by fast express delivery and easy 30-day hassle-free returns.</p>
        </div>
        <button type="button" class="${p}__seo-toggle" onclick="document.getElementById('${p}-seo-block').classList.toggle('expanded'); this.textContent = document.getElementById('${p}-seo-block').classList.contains('expanded') ? 'Read Less ↑' : 'Read More ↓';">
          Read More ↓
        </button>
      </div>
    {% endif %}

  </div>
</div>

{% schema %}
{
  "name": "CP V${i} — ${b.name}",
  "tag": "section",
  "class": "${p}-section",
  "settings": [
    { "type": "header", "content": "Collection Settings" },
    { "type": "collection", "id": "collection", "label": "Collection" },
    { "type": "range", "id": "products_per_page", "label": "Products per page", "min": 4, "max": 24, "step": 4, "default": 12 },
    { "type": "header", "content": "Grid Layout" },
    { "type": "range", "id": "cols_desktop", "label": "Desktop Columns", "min": 2, "max": 5, "default": 4 },
    { "type": "select", "id": "cols_mobile", "label": "Mobile Columns", "options": [
      { "value": "1", "label": "1 Column" },
      { "value": "2", "label": "2 Columns" }
    ], "default": "2" },
    { "type": "header", "content": "Hero Banner" },
    { "type": "text", "id": "title", "label": "Collection Title", "default": "${b.name}" },
    { "type": "text", "id": "subheading", "label": "Collection Subheading", "default": "Handcrafted essentials designed for modern living." },
    { "type": "select", "id": "hero_align", "label": "Hero Alignment", "options": [
      { "value": "left", "label": "Left" },
      { "value": "center", "label": "Center" }
    ], "default": "left" },
    { "type": "header", "content": "Features & In-Grid Promo" },
    { "type": "checkbox", "id": "show_chips", "label": "Show Sub-collection Chips", "default": true },
    { "type": "checkbox", "id": "show_promo_tile", "label": "Show In-Grid Promo Card", "default": true },
    { "type": "text", "id": "promo_code", "label": "Promo Code", "default": "${b.promoCode}" },
    { "type": "header", "content": "SEO Text Block" },
    { "type": "checkbox", "id": "show_seo_block", "label": "Show Bottom SEO Text Block", "default": true },
    { "type": "text", "id": "seo_title", "label": "SEO Section Title", "default": "About Our Collection" },
    { "type": "header", "content": "Colors & Spacing" },
    { "type": "color", "id": "bg_color", "label": "Background Color", "default": "${b.bg}" },
    { "type": "color", "id": "hero_bg", "label": "Hero Card Background", "default": "#FFFFFF" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "${b.primary}" },
    { "type": "color", "id": "border_color", "label": "Border Color", "default": "#E5E7EB" },
    { "type": "range", "id": "padding_top", "label": "Top Padding (px)", "min": 0, "max": 100, "step": 4, "default": 40 },
    { "type": "range", "id": "padding_bottom", "label": "Bottom Padding (px)", "min": 0, "max": 100, "step": 4, "default": 60 }
  ],
  "presets": [
    {
      "name": "CP V${i} — ${b.name}"
    }
  ]
}
{% endschema %}
`;

  // Write section file: sections/cp-vX.liquid
  const secPath = path.join(sectionsDir, `cp-v${i}.liquid`);
  fs.writeFileSync(secPath, liquidContent, 'utf8');

  // Write JSON template file: templates/collection.cp-vX.json
  const tmplContent = JSON.stringify({
    sections: {
      main: {
        type: `cp-v${i}`,
        settings: {}
      }
    },
    order: ["main"]
  }, null, 2);

  const tmplPath = path.join(templatesDir, `collection.cp-v${i}.json`);
  fs.writeFileSync(tmplPath, tmplContent, 'utf8');

  builtCount++;
});

console.log(`✅ SUCCESS! Created all ${builtCount} Collection Page Sections (cp-v1..v70) & JSON templates!`);
