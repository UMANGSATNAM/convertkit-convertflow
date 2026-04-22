import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { LIQUID_SECTIONS } from "../liquidSections.js";

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

  // ── Electronics (placeholder — template pending) ─────────────────────────
  electronics:          { label: "Tech & Electronics" },

  // ── Home Décor (placeholder) ──────────────────────────────────────────────
  "home-decor":         { label: "Home Décor" },

  // ── Pet Supplies (placeholder) ────────────────────────────────────────────
  "pet-supplies":       { label: "Pet Supplies" },

  // ── Luxury Watches (placeholder) ─────────────────────────────────────────
  "luxury-watches":     { label: "Luxury Watches" },

  // ── Outdoor Gear (placeholder) ───────────────────────────────────────────
  "outdoor-gear":       { label: "Outdoor Gear" },

  // ── Organic Food (placeholder) ───────────────────────────────────────────
  "organic-food":       { label: "Organic Food" },

  // ── Fitness Supplements (placeholder) ────────────────────────────────────
  "fitness-supplements":{ label: "Fitness Supplements" },

  // ── Baby Apparel (placeholder) ───────────────────────────────────────────
  "baby-apparel":       { label: "Baby Apparel" },

  // ── Coffee Roasters (placeholder) ────────────────────────────────────────
  "coffee-roasters":    { label: "Coffee Roasters" },

  // ── Beauty & Cosmetics (placeholder) ─────────────────────────────────────
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

    // ── Step 3: Iterate through page types and look up bundled liquid content ──
    for (const page of PAGE_MAPPINGS) {
      const sectionKey = `cf-${templateId}-${page.id}`;
      const liquidContent = LIQUID_SECTIONS[sectionKey];

      if (!liquidContent) {
        // Section not yet built for this page type — skip silently
        continue;
      }
      
      // Push liquid chunk to sections/
      filesToUpsert.push({
        filename: `sections/${liquidFileName}`,
        body: { type: "TEXT", value: liquidContent }
      });
      
      // Push compiled schema to templates/*.json
      const sectionKey = `convertflow_${templateId}_${page.id.replace(/-/g, '_')}`;
      const sectionType = `cf-${templateId}-${page.id}`;
      
      const tplJson = {
        layout: "convertflow",
        sections: { [sectionKey]: { type: sectionType, settings: {} } },
        order: [sectionKey],
      };
      
      filesToUpsert.push({
        filename: `templates/${page.filename}`,
        body: { type: "TEXT", value: JSON.stringify(tplJson, null, 2) }
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
