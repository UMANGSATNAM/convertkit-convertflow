import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import fs from "node:fs";
import path from "node:path";

/**
 * API Route: Inject ConvertFlow section into the active Shopify theme
 *
 * Steps:
 * 1. Find the active (MAIN) theme
 * 2. Upload cf-pilgrim-landing.liquid to sections/ in the theme
 * 3. Read templates/index.json and add our section key
 * 4. Write updated index.json back
 */
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  try {
    // ── Step 1: Get active theme ──────────────────────────────────────────
    const themesRes = await admin.graphql(`
      query { themes(first: 10) { nodes { id name role } } }
    `);
    const { data: themesData } = await themesRes.json();
    const mainTheme = themesData.themes.nodes.find((t) => t.role === "MAIN");
    if (!mainTheme) {
      return json({ success: false, error: "No active theme found" }, { status: 400 });
    }

    // ── Step 2: Read our liquid file from the extension ───────────────────
    const liquidPath = path.resolve(
      process.cwd(),
      "extensions/convertkit-sections/sections/cf-pilgrim-landing.liquid"
    );
    const liquidContent = fs.readFileSync(liquidPath, "utf-8");

    // ── Step 3: Upload the section file + update index.json in one batch ──
    // First read the current index.json
    const indexRes = await admin.graphql(`
      query($id: ID!) {
        theme(id: $id) {
          files(filenames: ["templates/index.json"], first: 1) {
            nodes {
              filename
              body { ... on OnlineStoreThemeFileBodyText { content } }
            }
          }
        }
      }
    `, { variables: { id: mainTheme.id } });

    const { data: indexData } = await indexRes.json();
    let template = { sections: {}, order: [] };
    try {
      const raw = indexData?.theme?.files?.nodes?.[0]?.body?.content;
      if (raw) template = JSON.parse(raw);
    } catch (_) { /* use default */ }

    // Add our section if not already present
    const KEY = "convertflow_pilgrim";
    if (!template.sections[KEY]) {
      template.sections[KEY] = { type: "cf-pilgrim-landing", settings: {} };
    }
    if (!template.order) template.order = Object.keys(template.sections);
    if (!template.order.includes(KEY)) template.order.unshift(KEY);

    // ── Step 4: Upload both files at once via themeFilesUpsert ───────────
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
          // Upload the Liquid section file
          {
            filename: "sections/cf-pilgrim-landing.liquid",
            body: { type: "TEXT", value: liquidContent },
          },
          // Update the homepage template to include it
          {
            filename: "templates/index.json",
            body: { type: "TEXT", value: JSON.stringify(template, null, 2) },
          },
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

    // ── Step 5: Return success with editor link ───────────────────────────
    const shopRes = await admin.graphql(`query { shop { myshopifyDomain } }`);
    const { data: shopData } = await shopRes.json();
    const domain = shopData.shop.myshopifyDomain;
    const numericId = mainTheme.id.split("/").pop();

    return json({
      success: true,
      themeName: mainTheme.name,
      editorUrl: `https://${domain}/admin/themes/${numericId}/editor`,
      previewUrl: `https://${domain}/?preview_theme_id=${numericId}`,
    });
  } catch (err) {
    console.error("[inject-template] Error:", err);
    return json({ success: false, error: err.message }, { status: 500 });
  }
};
