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

    // ── Step 4: Update each template JSON ────────────────────────────────
    const indexTpl = parseTemplate("templates/index.json", { sections: {}, order: [] });
    if (!indexTpl.sections) indexTpl.sections = {};
    if (!indexTpl.order) indexTpl.order = Object.keys(indexTpl.sections);
    indexTpl.sections[tplConfig.landing.key] = { type: tplConfig.landing.type, settings: {} };
    if (!indexTpl.order.includes(tplConfig.landing.key)) indexTpl.order.unshift(tplConfig.landing.key);

    const productTpl = parseTemplate("templates/product.json", { sections: {}, order: [] });
    if (!productTpl.sections) productTpl.sections = {};
    if (!productTpl.order) productTpl.order = Object.keys(productTpl.sections);
    productTpl.sections[tplConfig.product.key] = { type: tplConfig.product.type, settings: {} };
    if (!productTpl.order.includes(tplConfig.product.key)) productTpl.order.unshift(tplConfig.product.key);

    const cartTpl = parseTemplate("templates/cart.json", { sections: {}, order: [] });
    if (!cartTpl.sections) cartTpl.sections = {};
    if (!cartTpl.order) cartTpl.order = Object.keys(cartTpl.sections);
    cartTpl.sections[tplConfig.cart.key] = { type: tplConfig.cart.type, settings: {} };
    if (!cartTpl.order.includes(tplConfig.cart.key)) cartTpl.order.unshift(tplConfig.cart.key);

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
          { filename: `sections/${tplConfig.landing.file}`, body: { type: "TEXT", value: liquidLanding } },
          { filename: `sections/${tplConfig.product.file}`, body: { type: "TEXT", value: liquidProduct } },
          { filename: `sections/${tplConfig.cart.file}`,    body: { type: "TEXT", value: liquidCart } },
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
