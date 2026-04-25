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

    // ── Step 3: Build landing page with 6 sidebar sections ────────────────
    const landingLiquidFile = `cf-${templateId}-landing.liquid`;
    const landingFilePath = path.join(SECTIONS_DIR, landingLiquidFile);
    let landingContent;
    try {
      landingContent = fs.readFileSync(landingFilePath, 'utf-8');
    } catch {
      return json({ success: false, error: `Landing section not found for template: ${templateId}` }, { status: 400 });
    }

    // Upload landing (hero) section
    filesToUpsert.push({
      filename: `sections/${landingLiquidFile}`,
      body: { type: 'TEXT', value: landingContent },
    });

    // Build the multi-section index.json for the home page
    const heroKey = `cf_${templateId}_hero`.replace(/-/g, '_');
    const landingJson = {
      layout: 'convertflow',
      sections: {
        [heroKey]: {
          type: `cf-${templateId}-landing`,
          settings: userSettings,
        },
        cf_features: {
          type: 'cf-shared-features',
          settings: {},
          blocks: {
            b1: { type: 'feature', settings: { icon: 'A', title: 'Free Delivery', subtitle: 'On orders above Rs.999' } },
            b2: { type: 'feature', settings: { icon: 'B', title: 'Easy Returns', subtitle: '30-day hassle-free' } },
            b3: { type: 'feature', settings: { icon: 'C', title: '100% Authentic', subtitle: 'Certified genuine products' } },
            b4: { type: 'feature', settings: { icon: 'D', title: 'Secure Checkout', subtitle: 'SSL encrypted payment' } },
          },
          blocks_order: ['b1', 'b2', 'b3', 'b4'],
        },
        cf_products: {
          type: 'cf-shared-products',
          settings: {
            heading: userSettings.prod_heading || 'Featured Products',
            subheading: userSettings.prod_sub || 'Handpicked for you',
          },
        },
        cf_testimonials: {
          type: 'cf-shared-testimonials',
          settings: {},
          blocks: {
            t1: { type: 'review', settings: { rating: 5, text: 'Absolutely love the quality! Will definitely order again.', author: 'Priya S.', meta: 'Verified Buyer' } },
            t2: { type: 'review', settings: { rating: 5, text: 'Fast shipping and beautiful packaging. Exceeded all expectations!', author: 'Rahul M.', meta: 'Verified Buyer' } },
            t3: { type: 'review', settings: { rating: 5, text: 'Best purchase this year. Highly recommended!', author: 'Ananya K.', meta: 'Verified Buyer' } },
          },
          blocks_order: ['t1', 't2', 't3'],
        },
        cf_newsletter: {
          type: 'cf-shared-newsletter',
          settings: {
            heading: userSettings.nl_h || 'Join Our Community',
            subtext: userSettings.nl_sub || 'Subscribe for exclusive offers and updates.',
          },
        },
        cf_footer: {
          type: 'cf-shared-footer',
          settings: {},
          blocks: {
            f1: { type: 'link_column', settings: { heading: 'Shop', link1_text: 'All Products', link2_text: 'Collections', link3_text: 'New Arrivals' } },
            f2: { type: 'link_column', settings: { heading: 'Help', link1_text: 'Shipping Policy', link2_text: 'Returns', link3_text: 'Contact Us' } },
            f3: { type: 'link_column', settings: { heading: 'Legal', link1_text: 'Privacy Policy', link2_text: 'Terms of Service' } },
          },
          blocks_order: ['f1', 'f2', 'f3'],
        },
      },
      order: [heroKey, 'cf_features', 'cf_products', 'cf_testimonials', 'cf_newsletter', 'cf_footer'],
    };

    filesToUpsert.push({
      filename: 'templates/index.json',
      body: { type: 'TEXT', value: JSON.stringify(landingJson, null, 2) },
    });
    injectedPageNames.push('Landing / Home Page (6 sections)');

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
