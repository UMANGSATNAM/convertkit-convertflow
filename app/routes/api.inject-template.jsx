import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import fs from "node:fs";
import path from "node:path";

/**
 * Template configuration map.
 * Each template set defines which Liquid section files to inject
 * and the section type keys used inside the template JSONs.
 */
const TEMPLATES = {
  pilgrim: {
    label: "Pilgrim Beauty",
    landing:  { file: "cf-pilgrim-landing.liquid",  type: "cf-pilgrim-landing",  key: "convertflow_pilgrim" },
    product:  { file: "cf-pilgrim-product.liquid",  type: "cf-pilgrim-product",  key: "convertflow_product" },
    cart:     { file: "cf-pilgrim-cart.liquid",     type: "cf-pilgrim-cart",     key: "convertflow_cart" },
  },
  tanishq: {
    label: "Tanishq Jewellery",
    landing:  { file: "cf-tanishq-landing.liquid",  type: "cf-tanishq-landing",  key: "convertflow_tanishq" },
    product:  { file: "cf-tanishq-product.liquid",  type: "cf-tanishq-product",  key: "convertflow_tanishq_product" },
    cart:     { file: "cf-tanishq-cart.liquid",     type: "cf-tanishq-cart",     key: "convertflow_tanishq_cart" },
  },
};

/**
 * API Route: Inject ConvertFlow template pages into the active Shopify theme
 *
 * Accepts a `template` form field to select which template set to inject.
 * Defaults to "pilgrim" for backward compatibility.
 *
 * Injects:
 *  - Landing Page  → sections/{template}-landing.liquid + templates/index.json
 *  - Product Page  → sections/{template}-product.liquid + templates/product.json
 *  - Cart Page     → sections/{template}-cart.liquid    + templates/cart.json
 */
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  try {
    // Parse template selection from form data
    const formData = await request.formData();
    const templateId = formData.get("template") || "pilgrim";
    const tplConfig = TEMPLATES[templateId];

    if (!tplConfig) {
      return json({ success: false, error: `Unknown template: ${templateId}` }, { status: 400 });
    }

    // ── Step 1: Find the active (MAIN) theme ─────────────────────────────
    const themesRes = await admin.graphql(`
      query { themes(first: 10) { nodes { id name role } } }
    `);
    const { data: themesData } = await themesRes.json();
    const mainTheme = themesData.themes.nodes.find((t) => t.role === "MAIN");
    if (!mainTheme) {
      return json({ success: false, error: "No active theme found" }, { status: 400 });
    }

    const sectionsDir = path.resolve(
      process.cwd(),
      "extensions/convertkit-sections/sections"
    );

    // ── Step 2: Read all three Liquid files ──────────────────────────────
    const liquidLanding = fs.readFileSync(path.join(sectionsDir, tplConfig.landing.file), "utf-8");
    const liquidProduct = fs.readFileSync(path.join(sectionsDir, tplConfig.product.file), "utf-8");
    const liquidCart    = fs.readFileSync(path.join(sectionsDir, tplConfig.cart.file),    "utf-8");

    // ── Step 3: Read current templates ───────────────────────────────────
    const tplRes = await admin.graphql(`
      query($id: ID!) {
        theme(id: $id) {
          files(
            filenames: ["templates/index.json", "templates/product.json", "templates/cart.json"]
            first: 3
          ) {
            nodes {
              filename
              body { ... on OnlineStoreThemeFileBodyText { content } }
            }
          }
        }
      }
    `, { variables: { id: mainTheme.id } });

    const { data: tplData } = await tplRes.json();
    const fileNodes = tplData?.theme?.files?.nodes ?? [];

    const parseTemplate = (filename, defaultVal) => {
      const node = fileNodes.find((n) => n.filename === filename);
      try { return JSON.parse(node?.body?.content ?? "{}"); } catch { return defaultVal; }
    };

    // ── Step 4: Build FULL replacement templates (only our section, no theme header/footer) ──
    const buildFullTemplate = (sectionKey, sectionType, layout = "convertflow") => ({
      layout,
      sections: { [sectionKey]: { type: sectionType, settings: {} } },
      order: [sectionKey],
    });

    const indexTpl   = buildFullTemplate(tplConfig.landing.key, tplConfig.landing.type);
    const productTpl = buildFullTemplate(tplConfig.product.key, tplConfig.product.type);
    const cartTpl    = buildFullTemplate(tplConfig.cart.key,    tplConfig.cart.type);

    // ── Step 4b: Custom layout — minimal Shopify shell without theme header/footer ──
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

    // ── Step 5: Upload everything in one batch ────────────────────────────
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
        files: [
          // Custom layout (no theme header/footer)
          { filename: "layout/convertflow.liquid", body: { type: "TEXT", value: convertflowLayout } },
          // Liquid section files
          { filename: `sections/${tplConfig.landing.file}`, body: { type: "TEXT", value: liquidLanding } },
          { filename: `sections/${tplConfig.product.file}`, body: { type: "TEXT", value: liquidProduct } },
          { filename: `sections/${tplConfig.cart.file}`,    body: { type: "TEXT", value: liquidCart } },
          // Template JSON files (full replacement)
          { filename: "templates/index.json",   body: { type: "TEXT", value: JSON.stringify(indexTpl, null, 2) } },
          { filename: "templates/product.json", body: { type: "TEXT", value: JSON.stringify(productTpl, null, 2) } },
          { filename: "templates/cart.json",    body: { type: "TEXT", value: JSON.stringify(cartTpl, null, 2) } },
        ],
      },
    });

    const { data: upsertData } = await upsertRes.json();
    const errors = upsertData?.themeFilesUpsert?.userErrors ?? [];

    if (errors.length > 0) {
      return json(
        { success: false, error: errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    // ── Step 6: Return success with links ────────────────────────────────
    const shopRes = await admin.graphql(`query { shop { myshopifyDomain } }`);
    const { data: shopData } = await shopRes.json();
    const domain = shopData.shop.myshopifyDomain;
    const numericId = mainTheme.id.split("/").pop();

    return json({
      success: true,
      templateLabel: tplConfig.label,
      themeName: mainTheme.name,
      pages: ["Landing Page", "Product Page", "Cart Page"],
      editorUrl: `https://${domain}/admin/themes/${numericId}/editor`,
      previewUrl: `https://${domain}/?preview_theme_id=${numericId}`,
      cartUrl:    `https://${domain}/cart`,
    });

  } catch (err) {
    console.error("[inject-template] Error:", err);
    return json({ success: false, error: err.message }, { status: 500 });
  }
};
