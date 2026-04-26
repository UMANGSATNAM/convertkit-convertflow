import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve sections dir relative to THIS file — works in Railway, local, and Docker
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SECTIONS_DIR = path.resolve(__dirname, "../../extensions/convertkit-sections/sections");

/**
 * Application dynamic page mappings.
 * These align with the Shopify standardized template JSON routes.
 */
const PAGE_MAPPINGS = [
  { id: "404", filename: "404.json", name: "404 Error Page" },
  { id: "account", filename: "customers/account.json", name: "Customer Account" },
  { id: "article", filename: "article.json", name: "Article Page" },
  { id: "blog", filename: "blog.json", name: "Blog Page" },
  { id: "cart", filename: "cart.json", name: "Cart Page" },
  { id: "collection", filename: "collection.json", name: "Collection Page" },
  { id: "landing", filename: "index.json", name: "Landing/Home Page" },
  { id: "list-collections", filename: "list-collections.json", name: "List Collections" },
  { id: "login", filename: "customers/login.json", name: "Customer Login" },
  { id: "order", filename: "customers/order.json", name: "Customer Order" },
  { id: "page", filename: "page.json", name: "Standard Page" },
  { id: "product", filename: "product.json", name: "Product Page" },
  { id: "register", filename: "customers/register.json", name: "Customer Register" },
  { id: "search", filename: "search.json", name: "Search Results" }
];

/**
 * Template configuration map.
 */
const TEMPLATES = {
  // ── Original 3 ──────────────────────────────────────────────────────────
  pilgrim:              { label: "Pilgrim Beauty" },
  tanishq:              { label: "Tanishq Jewellery" },
  caratlane:            { label: "CaratLane Clone" },

  // ── Jewellery ────────────────────────────────────────────────────────────
  "jewellery-heritage": { label: "Meenakshi Heritage Jewellers" },

  // ── Fashion & Apparel ────────────────────────────────────────────────────
  "fashion-clothing":   { label: "VŌLT Fashion" },

  // ── Footwear ─────────────────────────────────────────────────────────────
  footwear:             { label: "Solera Footwear" },

  // ── Ayurveda / Health ────────────────────────────────────────────────────
  "ayurveda-wellness":  { label: "Ayurva Wellness" },

  // ── Tech Accessories ─────────────────────────────────────────────────────
  "mobile-accessories": { label: "STACKD Accessories" },

  // ── Kids Toys ────────────────────────────────────────────────────────────
  "kids-toys":          { label: "PlayBox Kids" },

  // ── Home Furniture ───────────────────────────────────────────────────────
  "home-furniture":     { label: "Haven Furniture" },

  // ── Food Delivery ────────────────────────────────────────────────────────
  "food-delivery":      { label: "Veda Eats" },

  // ── Electronics ──────────────────────────────────────────────────────────
  electronics:          { label: "Tech & Electronics" },

  // ── Home Décor ───────────────────────────────────────────────────────────
  "home-decor":         { label: "Home Décor" },

  // ── Pet Supplies ─────────────────────────────────────────────────────────
  "pet-supplies":       { label: "Pet Supplies" },

  // ── Luxury Watches ───────────────────────────────────────────────────────
  "luxury-watches":     { label: "Luxury Watches" },

  // ── Outdoor Gear ─────────────────────────────────────────────────────────
  "outdoor-gear":       { label: "Outdoor Gear" },

  // ── Organic Food ─────────────────────────────────────────────────────────
  "organic-food":       { label: "Organic Food" },

  // ── Fitness Supplements ───────────────────────────────────────────────────
  "fitness-supplements":{ label: "Fitness Supplements" },

  // ── Baby Apparel ─────────────────────────────────────────────────────────
  "baby-apparel":       { label: "Baby Apparel" },

  // ── Coffee Roasters ──────────────────────────────────────────────────────
  "coffee-roasters":    { label: "Coffee Roasters" },

  // ── Beauty & Cosmetics ────────────────────────────────────────────────────
  "beauty-cosmetics":   { label: "Beauty & Cosmetics" },
};

/**
 * API Route: Inject ConvertFlow template pages into the active Shopify theme
 *
 * Accepts a `template` form field to select which template set to inject.
 * Defaults to "caratlane".
 *
 * Injects layout and 14 full page templates natively.
 */
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  try {
    // Parse template selection from form data
    const formData = await request.formData();
    const templateId = formData.get("template") || "caratlane";
    const tplConfig = TEMPLATES[templateId];

    // Extract all user-customized settings from the form
    const userSettings = {};
    const SETTING_KEYS = [
      "ann_text", "hero_tag", "hero_h1", "hero_sub", "hero_cta", "hero_cta2",
      "prod_heading", "prod_sub", "nl_h", "nl_sub",
    ];
    for (const key of SETTING_KEYS) {
      const val = formData.get(key);
      if (val !== null && val !== undefined && val !== "") {
        userSettings[key] = val;
      }
    }

    if (!tplConfig) {
      return json({ success: false, error: `Unknown template: ${templateId}` }, { status: 400 });
    }

    // ── Step 1: Find the active (MAIN) theme ─────────────────────────────
    const themesRes = await admin.graphql(`
      query { themes(first: 10) { nodes { id name role } } }
    `);
    const { data: themesData } = await themesRes.json();
    const mainTheme = themesData.themes.nodes.find((t) => t.role === "MAIN" || (typeof t.role === 'string' && t.role.toLowerCase() === "main"));
    
    if (!mainTheme) {
      const availableThemes = themesData.themes.nodes.map(t => `${t.name} (${t.role})`).join(', ');
      console.error("[inject-template] No MAIN theme. Available:", availableThemes);
      return json({ 
        success: false, 
        error: `No active theme found. Available: ${availableThemes || 'None'}` 
      }, { status: 400 });
    }

    // ── Step 2: Custom layout — minimal Shopify shell without theme header/footer ──
    const convertflowLayout = `<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, height=device-height, minimum-scale=1.0">
  <title>{{ page_title }}{% if current_tags %} &ndash; tagged "{{ current_tags | join: ', ' }}"{% endif %}{% if current_page != 1 %} &ndash; Page {{ current_page }}{% endif %}{% unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless %}</title>
  {{ content_for_header }}
  <style>body{margin:0;padding:0;}</style>
</head>
<body>
  {{ content_for_layout }}
</body>
</html>`;

    // Initialize filesToUpsert with the custom layout file
    const filesToUpsert = [
      { filename: "layout/convertflow.liquid", body: { type: "TEXT", value: convertflowLayout } }
    ];
    
    const injectedPageNames = [];

    // Shared section file names
    const SHARED_SECTIONS = [
      'cf-shared-products',
      'cf-shared-features',
      'cf-shared-testimonials',
      'cf-shared-newsletter',
      'cf-shared-footer',
    ];

    // Upload shared sections
    for (const name of SHARED_SECTIONS) {
      const filePath = path.join(SECTIONS_DIR, `${name}.liquid`);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        filesToUpsert.push({
          filename: `sections/${name}.liquid`,
          body: { type: 'TEXT', value: content },
        });
      } catch { /* skip if missing */ }
    }

    // ── Step 3: Build landing page with sidebar sections ────────────────
    
    // Auto-generated configuration defining the specific perfectly-split HTML modular sections per template
    const customTemplateConfigs = {
  "jewellery-heritage": [
    { "key": "promo-bar", "filename": "cf-jewellery-heritage-promo-bar", "type": "cf-jewellery-heritage-promo-bar" },
    { "key": "header", "filename": "cf-jewellery-heritage-header", "type": "cf-jewellery-heritage-header" },
    { "key": "hero", "filename": "cf-jewellery-heritage-hero", "type": "cf-jewellery-heritage-hero" },
    { "key": "collections", "filename": "cf-jewellery-heritage-collections", "type": "cf-jewellery-heritage-collections" },
    { "key": "collection", "filename": "cf-jewellery-heritage-collection", "type": "cf-jewellery-heritage-collection" },
    { "key": "section", "filename": "cf-jewellery-heritage-section", "type": "cf-jewellery-heritage-section" },
    { "key": "feature", "filename": "cf-jewellery-heritage-feature", "type": "cf-jewellery-heritage-feature" },
    { "key": "newsletter", "filename": "cf-jewellery-heritage-newsletter", "type": "cf-jewellery-heritage-newsletter" },
    { "key": "footer", "filename": "cf-jewellery-heritage-footer", "type": "cf-jewellery-heritage-footer" }
  ],
  "fashion-clothing": [
    { "key": "promo", "filename": "cf-fashion-clothing-promo", "type": "cf-fashion-clothing-promo" },
    { "key": "header", "filename": "cf-fashion-clothing-header", "type": "cf-fashion-clothing-header" },
    { "key": "hero", "filename": "cf-fashion-clothing-hero", "type": "cf-fashion-clothing-hero" },
    { "key": "marquee", "filename": "cf-fashion-clothing-marquee", "type": "cf-fashion-clothing-marquee" },
    { "key": "shop", "filename": "cf-fashion-clothing-shop", "type": "cf-fashion-clothing-shop" },
    { "key": "editorial", "filename": "cf-fashion-clothing-editorial", "type": "cf-fashion-clothing-editorial" },
    { "key": "grid", "filename": "cf-fashion-clothing-grid", "type": "cf-fashion-clothing-grid" },
    { "key": "footer", "filename": "cf-fashion-clothing-footer", "type": "cf-fashion-clothing-footer" }
  ],
  "footwear": [
    { "key": "announcement", "filename": "cf-footwear-announcement", "type": "cf-footwear-announcement" },
    { "key": "header", "filename": "cf-footwear-header", "type": "cf-footwear-header" },
    { "key": "hero", "filename": "cf-footwear-hero", "type": "cf-footwear-hero" },
    { "key": "logos", "filename": "cf-footwear-logos", "type": "cf-footwear-logos" },
    { "key": "section", "filename": "cf-footwear-section", "type": "cf-footwear-section" },
    { "key": "collection", "filename": "cf-footwear-collection", "type": "cf-footwear-collection" },
    { "key": "footer", "filename": "cf-footwear-footer", "type": "cf-footwear-footer" }
  ],
  "ayurveda-wellness": [
    { "key": "nav", "filename": "cf-ayurveda-wellness-nav", "type": "cf-ayurveda-wellness-nav" },
    { "key": "hero", "filename": "cf-ayurveda-wellness-hero", "type": "cf-ayurveda-wellness-hero" },
    { "key": "usp", "filename": "cf-ayurveda-wellness-usp", "type": "cf-ayurveda-wellness-usp" },
    { "key": "products", "filename": "cf-ayurveda-wellness-products", "type": "cf-ayurveda-wellness-products" },
    { "key": "ingredients", "filename": "cf-ayurveda-wellness-ingredients", "type": "cf-ayurveda-wellness-ingredients" },
    { "key": "testi", "filename": "cf-ayurveda-wellness-testi", "type": "cf-ayurveda-wellness-testi" },
    { "key": "footer", "filename": "cf-ayurveda-wellness-footer", "type": "cf-ayurveda-wellness-footer" }
  ],
  "mobile-accessories": [
    { "key": "header", "filename": "cf-mobile-accessories-header", "type": "cf-mobile-accessories-header" },
    { "key": "hero", "filename": "cf-mobile-accessories-hero", "type": "cf-mobile-accessories-hero" },
    { "key": "section", "filename": "cf-mobile-accessories-section", "type": "cf-mobile-accessories-section" },
    { "key": "marquee", "filename": "cf-mobile-accessories-marquee", "type": "cf-mobile-accessories-marquee" },
    { "key": "pdp", "filename": "cf-mobile-accessories-pdp", "type": "cf-mobile-accessories-pdp" },
    { "key": "footer", "filename": "cf-mobile-accessories-footer", "type": "cf-mobile-accessories-footer" },
    { "key": "script", "filename": "cf-mobile-accessories-script", "type": "cf-mobile-accessories-script" }
  ],
  "kids-toys": [
    { "key": "top-bar", "filename": "cf-kids-toys-top-bar", "type": "cf-kids-toys-top-bar" },
    { "key": "header", "filename": "cf-kids-toys-header", "type": "cf-kids-toys-header" },
    { "key": "hero", "filename": "cf-kids-toys-hero", "type": "cf-kids-toys-hero" },
    { "key": "age-groups", "filename": "cf-kids-toys-age-groups", "type": "cf-kids-toys-age-groups" },
    { "key": "shop", "filename": "cf-kids-toys-shop", "type": "cf-kids-toys-shop" },
    { "key": "values", "filename": "cf-kids-toys-values", "type": "cf-kids-toys-values" },
    { "key": "footer", "filename": "cf-kids-toys-footer", "type": "cf-kids-toys-footer" }
  ],
  "home-furniture": [
    { "key": "top", "filename": "cf-home-furniture-top", "type": "cf-home-furniture-top" },
    { "key": "header", "filename": "cf-home-furniture-header", "type": "cf-home-furniture-header" },
    { "key": "hero", "filename": "cf-home-furniture-hero", "type": "cf-home-furniture-hero" },
    { "key": "features", "filename": "cf-home-furniture-features", "type": "cf-home-furniture-features" },
    { "key": "collections", "filename": "cf-home-furniture-collections", "type": "cf-home-furniture-collections" },
    { "key": "about", "filename": "cf-home-furniture-about", "type": "cf-home-furniture-about" },
    { "key": "footer", "filename": "cf-home-furniture-footer", "type": "cf-home-furniture-footer" }
  ],
  "food-delivery": [
    { "key": "top", "filename": "cf-food-delivery-top", "type": "cf-food-delivery-top" },
    { "key": "header", "filename": "cf-food-delivery-header", "type": "cf-food-delivery-header" },
    { "key": "hero", "filename": "cf-food-delivery-hero", "type": "cf-food-delivery-hero" },
    { "key": "cuisine", "filename": "cf-food-delivery-cuisine", "type": "cf-food-delivery-cuisine" },
    { "key": "menu", "filename": "cf-food-delivery-menu", "type": "cf-food-delivery-menu" },
    { "key": "trust", "filename": "cf-food-delivery-trust", "type": "cf-food-delivery-trust" },
    { "key": "footer", "filename": "cf-food-delivery-footer", "type": "cf-food-delivery-footer" }
  ],
  "electronics": [
    { "key": "top", "filename": "cf-electronics-top", "type": "cf-electronics-top" },
    { "key": "header", "filename": "cf-electronics-header", "type": "cf-electronics-header" },
    { "key": "nav", "filename": "cf-electronics-nav", "type": "cf-electronics-nav" },
    { "key": "hero", "filename": "cf-electronics-hero", "type": "cf-electronics-hero" },
    { "key": "categories", "filename": "cf-electronics-categories", "type": "cf-electronics-categories" },
    { "key": "deals", "filename": "cf-electronics-deals", "type": "cf-electronics-deals" },
    { "key": "features", "filename": "cf-electronics-features", "type": "cf-electronics-features" },
    { "key": "footer", "filename": "cf-electronics-footer", "type": "cf-electronics-footer" }
  ],
  "home-decor": [
    { "key": "top", "filename": "cf-home-decor-top", "type": "cf-home-decor-top" },
    { "key": "header", "filename": "cf-home-decor-header", "type": "cf-home-decor-header" },
    { "key": "hero", "filename": "cf-home-decor-hero", "type": "cf-home-decor-hero" },
    { "key": "section", "filename": "cf-home-decor-section", "type": "cf-home-decor-section" },
    { "key": "room", "filename": "cf-home-decor-room", "type": "cf-home-decor-room" },
    { "key": "footer", "filename": "cf-home-decor-footer", "type": "cf-home-decor-footer" },
    { "key": "script", "filename": "cf-home-decor-script", "type": "cf-home-decor-script" }
  ],
  "pet-supplies": [
    { "key": "top-bar", "filename": "cf-pet-supplies-top-bar", "type": "cf-pet-supplies-top-bar" },
    { "key": "header", "filename": "cf-pet-supplies-header", "type": "cf-pet-supplies-header" },
    { "key": "nav", "filename": "cf-pet-supplies-nav", "type": "cf-pet-supplies-nav" },
    { "key": "hero", "filename": "cf-pet-supplies-hero", "type": "cf-pet-supplies-hero" },
    { "key": "pets", "filename": "cf-pet-supplies-pets", "type": "cf-pet-supplies-pets" },
    { "key": "section", "filename": "cf-pet-supplies-section", "type": "cf-pet-supplies-section" },
    { "key": "footer", "filename": "cf-pet-supplies-footer", "type": "cf-pet-supplies-footer" },
    { "key": "script", "filename": "cf-pet-supplies-script", "type": "cf-pet-supplies-script" }
  ],
  "luxury-watches": [
    { "key": "header", "filename": "cf-luxury-watches-header", "type": "cf-luxury-watches-header" },
    { "key": "hero", "filename": "cf-luxury-watches-hero", "type": "cf-luxury-watches-hero" },
    { "key": "collections", "filename": "cf-luxury-watches-collections", "type": "cf-luxury-watches-collections" },
    { "key": "horology", "filename": "cf-luxury-watches-horology", "type": "cf-luxury-watches-horology" },
    { "key": "footer", "filename": "cf-luxury-watches-footer", "type": "cf-luxury-watches-footer" }
  ],
  "outdoor-gear": [
    { "key": "top-bar", "filename": "cf-outdoor-gear-top-bar", "type": "cf-outdoor-gear-top-bar" },
    { "key": "header", "filename": "cf-outdoor-gear-header", "type": "cf-outdoor-gear-header" },
    { "key": "sub-nav", "filename": "cf-outdoor-gear-sub-nav", "type": "cf-outdoor-gear-sub-nav" },
    { "key": "hero", "filename": "cf-outdoor-gear-hero", "type": "cf-outdoor-gear-hero" },
    { "key": "section", "filename": "cf-outdoor-gear-section", "type": "cf-outdoor-gear-section" },
    { "key": "impact-banner", "filename": "cf-outdoor-gear-impact-banner", "type": "cf-outdoor-gear-impact-banner" },
    { "key": "footer", "filename": "cf-outdoor-gear-footer", "type": "cf-outdoor-gear-footer" }
  ],
  "fitness-supplements": [
    { "key": "promo-bar", "filename": "cf-fitness-supplements-promo-bar", "type": "cf-fitness-supplements-promo-bar" },
    { "key": "header", "filename": "cf-fitness-supplements-header", "type": "cf-fitness-supplements-header" },
    { "key": "hero", "filename": "cf-fitness-supplements-hero", "type": "cf-fitness-supplements-hero" },
    { "key": "ticker", "filename": "cf-fitness-supplements-ticker", "type": "cf-fitness-supplements-ticker" },
    { "key": "section", "filename": "cf-fitness-supplements-section", "type": "cf-fitness-supplements-section" },
    { "key": "stats", "filename": "cf-fitness-supplements-stats", "type": "cf-fitness-supplements-stats" },
    { "key": "footer", "filename": "cf-fitness-supplements-footer", "type": "cf-fitness-supplements-footer" }
  ],
  "baby-apparel": [
    { "key": "top-notice", "filename": "cf-baby-apparel-top-notice", "type": "cf-baby-apparel-top-notice" },
    { "key": "header", "filename": "cf-baby-apparel-header", "type": "cf-baby-apparel-header" },
    { "key": "hero", "filename": "cf-baby-apparel-hero", "type": "cf-baby-apparel-hero" },
    { "key": "quick-shop", "filename": "cf-baby-apparel-quick-shop", "type": "cf-baby-apparel-quick-shop" },
    { "key": "shop-section", "filename": "cf-baby-apparel-shop-section", "type": "cf-baby-apparel-shop-section" },
    { "key": "gift-banner", "filename": "cf-baby-apparel-gift-banner", "type": "cf-baby-apparel-gift-banner" },
    { "key": "footer", "filename": "cf-baby-apparel-footer", "type": "cf-baby-apparel-footer" }
  ],
  "coffee-roasters": [
    { "key": "promo", "filename": "cf-coffee-roasters-promo", "type": "cf-coffee-roasters-promo" },
    { "key": "header", "filename": "cf-coffee-roasters-header", "type": "cf-coffee-roasters-header" },
    { "key": "hero", "filename": "cf-coffee-roasters-hero", "type": "cf-coffee-roasters-hero" },
    { "key": "taste-band", "filename": "cf-coffee-roasters-taste-band", "type": "cf-coffee-roasters-taste-band" },
    { "key": "shop", "filename": "cf-coffee-roasters-shop", "type": "cf-coffee-roasters-shop" },
    { "key": "roastery", "filename": "cf-coffee-roasters-roastery", "type": "cf-coffee-roasters-roastery" },
    { "key": "club", "filename": "cf-coffee-roasters-club", "type": "cf-coffee-roasters-club" },
    { "key": "footer", "filename": "cf-coffee-roasters-footer", "type": "cf-coffee-roasters-footer" }
  ],
  "beauty-cosmetics": [
    { "key": "promo", "filename": "cf-beauty-cosmetics-promo", "type": "cf-beauty-cosmetics-promo" },
    { "key": "header", "filename": "cf-beauty-cosmetics-header", "type": "cf-beauty-cosmetics-header" },
    { "key": "hero", "filename": "cf-beauty-cosmetics-hero", "type": "cf-beauty-cosmetics-hero" },
    { "key": "shop", "filename": "cf-beauty-cosmetics-shop", "type": "cf-beauty-cosmetics-shop" },
    { "key": "ingredients", "filename": "cf-beauty-cosmetics-ingredients", "type": "cf-beauty-cosmetics-ingredients" },
    { "key": "footer", "filename": "cf-beauty-cosmetics-footer", "type": "cf-beauty-cosmetics-footer" },
    { "key": "sticky-atc", "filename": "cf-beauty-cosmetics-sticky-atc", "type": "cf-beauty-cosmetics-sticky-atc" },
    { "key": "script", "filename": "cf-beauty-cosmetics-script", "type": "cf-beauty-cosmetics-script" }
  ],
  "mens-grooming": [
    { "key": "nav", "filename": "cf-mens-grooming-nav", "type": "cf-mens-grooming-nav" },
    { "key": "hero", "filename": "cf-mens-grooming-hero", "type": "cf-mens-grooming-hero" },
    { "key": "marquee", "filename": "cf-mens-grooming-marquee", "type": "cf-mens-grooming-marquee" },
    { "key": "bento", "filename": "cf-mens-grooming-bento", "type": "cf-mens-grooming-bento" },
    { "key": "features", "filename": "cf-mens-grooming-features", "type": "cf-mens-grooming-features" },
    { "key": "pdp-section", "filename": "cf-mens-grooming-pdp-section", "type": "cf-mens-grooming-pdp-section" },
    { "key": "testi", "filename": "cf-mens-grooming-testi", "type": "cf-mens-grooming-testi" },
    { "key": "extra-feats", "filename": "cf-mens-grooming-extra-feats", "type": "cf-mens-grooming-extra-feats" },
    { "key": "tech-strip", "filename": "cf-mens-grooming-tech-strip", "type": "cf-mens-grooming-tech-strip" },
    { "key": "cta-banner", "filename": "cf-mens-grooming-cta-banner", "type": "cf-mens-grooming-cta-banner" },
    { "key": "final-strip", "filename": "cf-mens-grooming-final-strip", "type": "cf-mens-grooming-final-strip" },
    { "key": "footer", "filename": "cf-mens-grooming-footer", "type": "cf-mens-grooming-footer" }
  ]
};

    let landingJson = { layout: 'convertflow', sections: {}, order: [] };
    
    // If we have custom perfectly-split sections for this template (which we now do for almost all)
    if (customTemplateConfigs[templateId] || templateId === 'organic-food') {
      
      let sectionsConfig = customTemplateConfigs[templateId];
      
      // Fallback manual organic food mapping (since we made it manually)
      if (templateId === 'organic-food') {
        sectionsConfig = [
          { "key": "hero", "filename": "cf-organic-food-hero", "type": "cf-organic-food-hero" },
          { "key": "categories", "filename": "cf-organic-food-categories", "type": "cf-organic-food-categories" },
          { "key": "products", "filename": "cf-organic-food-products", "type": "cf-organic-food-products" },
          { "key": "banner", "filename": "cf-organic-food-banner", "type": "cf-organic-food-banner" },
          { "key": "footer", "filename": "cf-organic-food-footer", "type": "cf-organic-food-footer" }
        ];
      }
      
      for (const sec of sectionsConfig) {
        try {
          const content = fs.readFileSync(path.join(SECTIONS_DIR, `${sec.filename}.liquid`), 'utf-8');
          filesToUpsert.push({ filename: `sections/${sec.filename}.liquid`, body: { type: 'TEXT', value: content } });
          
          landingJson.sections[sec.key] = {
            type: sec.type,
            settings: {}
          };
          landingJson.order.push(sec.key);
        } catch(e) {
          console.warn(`Failed to read custom section ${sec.filename}`);
        }
      }
      
      injectedPageNames.push(`Landing Page (${sectionsConfig.length} Perfect Sections)`);
    } else {
      // DEFAULT BEHAVIOR FOR ANY MISSING TEMPLATES
      const landingLiquidFile = `cf-${templateId}-landing.liquid`;
      const landingFilePath = path.join(SECTIONS_DIR, landingLiquidFile);
      let landingContent;
      try {
        landingContent = fs.readFileSync(landingFilePath, 'utf-8');
      } catch {
        return json({ success: false, error: `Landing section not found for template: ${templateId}` }, { status: 400 });
      }

      filesToUpsert.push({ filename: `sections/${landingLiquidFile}`, body: { type: 'TEXT', value: landingContent } });

      const heroKey = `cf_${templateId}_hero`.replace(/-/g, '_');
      landingJson.sections = {
        [heroKey]: { type: `cf-${templateId}-landing`, settings: userSettings },
      };
      landingJson.order = [heroKey];
      injectedPageNames.push('Landing Page (1 Monolithic Section)');
    }

    filesToUpsert.push({
      filename: 'templates/index.json',
      body: { type: 'TEXT', value: JSON.stringify(landingJson, null, 2) },
    });

    // ── Step 4: Product, Cart, Collection pages (single section each) ──────
    const OTHER_PAGES = [
      { id: 'product',    filename: 'product.json',    name: 'Product Page' },
      { id: 'cart',       filename: 'cart.json',        name: 'Cart Page' },
      { id: 'collection', filename: 'collection.json',  name: 'Collection Page' },
    ];

    for (const page of OTHER_PAGES) {
      const liquidFileName = `cf-${templateId}-${page.id}.liquid`;
      const liquidFilePath = path.join(SECTIONS_DIR, liquidFileName);
      let liquidContent;
      try {
        liquidContent = fs.readFileSync(liquidFilePath, 'utf-8');
      } catch { continue; }

      filesToUpsert.push({
        filename: `sections/${liquidFileName}`,
        body: { type: 'TEXT', value: liquidContent },
      });

      const sectionKey = `convertflow_${templateId}_${page.id}`;
      const sectionType = `cf-${templateId}-${page.id}`;
      filesToUpsert.push({
        filename: `templates/${page.filename}`,
        body: {
          type: 'TEXT',
          value: JSON.stringify({
            layout: 'convertflow',
            sections: { [sectionKey]: { type: sectionType, settings: userSettings } },
            order: [sectionKey],
          }, null, 2),
        },
      });
      injectedPageNames.push(page.name);
    }

    // ── Step 4: Upload everything in one batch ────────────────────────────
    if (filesToUpsert.length <= 1) { // Only Layout exists
        return json({ success: false, error: "No section files found to inject! Wait for development." }, { status: 400 });
    }

    const upsertRes = await admin.graphql(`
      mutation Upsert($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
        themeFilesUpsert(themeId: $themeId, files: $files) {
          upsertedThemeFiles { filename }
          userErrors { field message }
        }
      }
    `, {
      variables: {
        themeId: mainTheme.id,
        files: filesToUpsert,
      },
    });

    const { data: upsertData } = await upsertRes.json();
    const errors = upsertData?.themeFilesUpsert?.userErrors ?? [];

    if (errors.length > 0) {
      console.error("[inject-template] GraphQL themeFilesUpsert Errors:", errors);
      return json(
        { success: false, error: errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    // ── Step 5: Return success with links ────────────────────────────────
    const shopRes = await admin.graphql(`query { shop { myshopifyDomain } }`);
    const { data: shopData } = await shopRes.json();
    const domain = shopData.shop.myshopifyDomain;
    const numericId = mainTheme.id.split("/").pop();

    return json({
      success: true,
      templateLabel: tplConfig.label,
      themeName: mainTheme.name,
      pages: injectedPageNames,
      editorUrl: `https://${domain}/admin/themes/${numericId}/editor`,
      previewUrl: `https://${domain}/?preview_theme_id=${numericId}`,
      cartUrl:    `https://${domain}/cart`,
    });

  } catch (err) {
    console.error("[inject-template] Error:", err);
    return json({ success: false, error: err.message }, { status: 500 });
  }
};
