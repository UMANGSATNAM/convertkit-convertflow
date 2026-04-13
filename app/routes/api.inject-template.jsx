import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import fs from "node:fs";
import path from "node:path";

/**
 * API Route: Inject ALL ConvertFlow Pilgrim pages into the active Shopify theme
 *
 * Injects:
 *  - Landing Page  → sections/cf-pilgrim-landing.liquid + templates/index.json
 *  - Product Page  → sections/cf-pilgrim-product.liquid + templates/product.json
 *  - Cart Page     → sections/cf-pilgrim-cart.liquid    + templates/cart.json
 */
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  try {
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
    const liquidLanding = fs.readFileSync(path.join(sectionsDir, "cf-pilgrim-landing.liquid"), "utf-8");
    const liquidProduct = fs.readFileSync(path.join(sectionsDir, "cf-pilgrim-product.liquid"), "utf-8");
    const liquidCart    = fs.readFileSync(path.join(sectionsDir, "cf-pilgrim-cart.liquid"),    "utf-8");

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

    // Helper to parse template or return minimal default
    const parseTemplate = (filename, defaultVal) => {
      const node = fileNodes.find((n) => n.filename === filename);
      try { return JSON.parse(node?.body?.content ?? "{}"); } catch { return defaultVal; }
    };

    // ── Step 4: Update each template JSON ────────────────────────────────
    // Landing page (homepage)
    const indexTpl = parseTemplate("templates/index.json", { sections: {}, order: [] });
    const LANDING_KEY = "convertflow_pilgrim";
    if (!indexTpl.sections) indexTpl.sections = {};
    if (!indexTpl.order) indexTpl.order = Object.keys(indexTpl.sections);
    indexTpl.sections[LANDING_KEY] = { type: "cf-pilgrim-landing", settings: {} };
    if (!indexTpl.order.includes(LANDING_KEY)) indexTpl.order.unshift(LANDING_KEY);

    // Product page
    const productTpl = parseTemplate("templates/product.json", { sections: {}, order: [] });
    const PRODUCT_KEY = "convertflow_product";
    if (!productTpl.sections) productTpl.sections = {};
    if (!productTpl.order) productTpl.order = Object.keys(productTpl.sections);
    productTpl.sections[PRODUCT_KEY] = { type: "cf-pilgrim-product", settings: {} };
    if (!productTpl.order.includes(PRODUCT_KEY)) productTpl.order.unshift(PRODUCT_KEY);

    // Cart page
    const cartTpl = parseTemplate("templates/cart.json", { sections: {}, order: [] });
    const CART_KEY = "convertflow_cart";
    if (!cartTpl.sections) cartTpl.sections = {};
    if (!cartTpl.order) cartTpl.order = Object.keys(cartTpl.sections);
    cartTpl.sections[CART_KEY] = { type: "cf-pilgrim-cart", settings: {} };
    if (!cartTpl.order.includes(CART_KEY)) cartTpl.order.unshift(CART_KEY);

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
          // Liquid section files
          { filename: "sections/cf-pilgrim-landing.liquid", body: { type: "TEXT", value: liquidLanding } },
          { filename: "sections/cf-pilgrim-product.liquid", body: { type: "TEXT", value: liquidProduct } },
          { filename: "sections/cf-pilgrim-cart.liquid",    body: { type: "TEXT", value: liquidCart } },
          // Template JSON files
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
