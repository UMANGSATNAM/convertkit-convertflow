import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

/**
 * API Route: Inject ConvertFlow section into the active Shopify theme
 * 
 * This reads the active theme's homepage template (templates/index.json),
 * adds our "CF: Pilgrim Landing Page" section to it, and writes it back.
 */
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  try {
    // Step 1: Get the active published theme
    const themesResponse = await admin.rest.get({ path: "themes" });
    const themesData = await themesResponse.json();
    const activeTheme = themesData.themes.find((t) => t.role === "main");

    if (!activeTheme) {
      return json({ success: false, error: "No active theme found" }, { status: 400 });
    }

    const themeId = activeTheme.id;

    // Step 2: Read the current homepage template
    let templateData;
    try {
      const assetResponse = await admin.rest.get({
        path: `themes/${themeId}/assets`,
        query: { "asset[key]": "templates/index.json" },
      });
      const assetJson = await assetResponse.json();
      templateData = JSON.parse(assetJson.asset.value);
    } catch (e) {
      // If no index.json exists, create a basic one
      templateData = {
        sections: {
          main: { type: "main-page", settings: {} },
        },
        order: ["main"],
      };
    }

    // Step 3: Add our ConvertFlow section (if not already present)
    const sectionKey = "convertflow_pilgrim";
    
    if (!templateData.sections[sectionKey]) {
      templateData.sections[sectionKey] = {
        type: "cf-pilgrim-landing",
        settings: {},
        blocks: {},
      };

      // Add to the order array (at the top, before main content)
      if (!templateData.order) {
        templateData.order = Object.keys(templateData.sections);
      }
      
      // Insert at the beginning
      if (!templateData.order.includes(sectionKey)) {
        templateData.order.unshift(sectionKey);
      }
    }

    // Step 4: Write the updated template back to the theme
    const putResponse = await admin.rest.put({
      path: `themes/${themeId}/assets`,
      data: {
        asset: {
          key: "templates/index.json",
          value: JSON.stringify(templateData, null, 2),
        },
      },
    });

    if (putResponse.ok) {
      const shopResponse = await admin.rest.get({ path: "shop" });
      const shopData = await shopResponse.json();
      const shopDomain = shopData.shop.domain;

      return json({
        success: true,
        themeId,
        themeName: activeTheme.name,
        shopDomain,
        editorUrl: `https://${shopDomain}/admin/themes/${themeId}/editor`,
      });
    } else {
      const errBody = await putResponse.text();
      return json({ success: false, error: errBody }, { status: 500 });
    }
  } catch (error) {
    console.error("Inject error:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
};
