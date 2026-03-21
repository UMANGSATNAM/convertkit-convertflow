import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { getTemplateById } from "../data/convertkit-templates";
import { shopifyFetchWithRetry } from "../lib/shopify-fetch.server.js";

/**
 * POST /api/convertflow/inject
 * Injects a ConvertKit template section into the merchant's live theme.
 * Body: { templateId, themeId }
 */
export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { session } = await authenticate.admin(request);
    const shopDomain = session.shop;
    const token = session.accessToken;
    const { templateId, themeId } = await request.json();

    if (!templateId || !themeId) {
      return json({ error: "templateId and themeId are required" }, { status: 400 });
    }

    const template = getTemplateById(templateId);
    if (!template) {
      return json({ error: `Template "${templateId}" not found` }, { status: 404 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sectionFilename = `${template.category}-ck-${timestamp}`;
    const assetKey = `sections/${sectionFilename}.liquid`;

    // Build complete section file
    let fileContent = template.liquidCode;
    if (template.cssCode) {
      fileContent += `\n\n{% style %}\n${template.cssCode}\n{% endstyle %}`;
    }
    if (template.schemaCode) {
      fileContent += `\n\n{% schema %}\n${template.schemaCode}\n{% endschema %}`;
    }

    // Save backup before injection
    const shop = await prisma.shop.findUnique({ where: { shopDomain } });
    if (shop) {
      try {
        await prisma.libraryItem.create({
          data: {
            shopId: shop.id,
            name: `Inject: ${template.name}`,
            description: `ConvertKit template injection backup`,
            tags: "inject,backup",
            liquidCode: template.liquidCode,
            cssCode: template.cssCode || "",
            schemaCode: template.schemaCode || "",
          },
        });
      } catch (e) {
        console.warn("Backup save failed (non-fatal):", e.message);
      }
    }

    // Push section file to theme via Assets API
    const pushUrl = `https://${shopDomain}/admin/api/2025-01/themes/${themeId}/assets.json`;
    const pushResp = await shopifyFetchWithRetry(pushUrl, {
      method: "PUT",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        asset: { key: assetKey, value: fileContent },
      }),
    });

    if (!pushResp.ok) {
      const errText = await pushResp.text();
      throw new Error(`Failed to push section: ${pushResp.status} ${errText}`);
    }

    // Try to add section to the template JSON
    try {
      const templateJsonKey = "templates/index.json";
      const templateResp = await shopifyFetchWithRetry(
        `https://${shopDomain}/admin/api/2025-01/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(templateJsonKey)}`,
        { headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" } }
      );

      if (templateResp.ok) {
        const templateData = await templateResp.json();
        const templateJson = JSON.parse(templateData.asset?.value || "{}");

        // Add new section to the template
        if (templateJson.sections) {
          templateJson.sections[sectionFilename] = { type: sectionFilename, settings: {} };
        }
        if (Array.isArray(templateJson.order)) {
          templateJson.order.push(sectionFilename);
        }

        // Push updated template JSON
        await shopifyFetchWithRetry(pushUrl, {
          method: "PUT",
          headers: {
            "X-Shopify-Access-Token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            asset: { key: templateJsonKey, value: JSON.stringify(templateJson, null, 2) },
          }),
        });
      }
    } catch (e) {
      console.warn("Template JSON update failed (section still pushed):", e.message);
    }

    return json({
      success: true,
      newSectionKey: assetKey,
      sectionFilename,
      templateName: template.name,
    });
  } catch (error) {
    console.error("Inject error:", error);
    return json({ error: error.message }, { status: 500 });
  }
};
