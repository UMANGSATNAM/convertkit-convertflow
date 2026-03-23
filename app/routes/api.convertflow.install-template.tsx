import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { fetchAsset } from "../lib/convertflow.server.js";
import { shopifyFetchWithRetry } from "../lib/shopify-fetch.server.js";
import { getTemplateById } from "../data/convertkit-templates";

export const action = async ({ request }: { request: Request }) => {
  try {
    const { admin, session } = await authenticate.admin(request);
    const shopDomain = session.shop;
    const token = session.accessToken;
    const { themeId, templateId, templateKey, insertIndex } = await request.json();

    if (!themeId || !templateId || !templateKey) {
      return json({ error: "themeId, templateId, templateKey required" }, { status: 400 });
    }

    const ckTemplate = getTemplateById(templateId);
    if (!ckTemplate) {
      return json({ error: "Template not found: " + templateId }, { status: 404 });
    }

    const assetUrl = `https://${shopDomain}/admin/api/2025-01/themes/${themeId}/assets.json`;

    // 1. Create the new section liquid file
    const newSectionKey = `sections/ck-${templateId}.liquid`;
    const fullLiquidCode = `${ckTemplate.liquidCode}
{% schema %}
${ckTemplate.schemaCode}
{% endschema %}
{% style %}
${ckTemplate.cssCode}
{% endstyle %}
`;

    const putAssetResp = await shopifyFetchWithRetry(assetUrl, {
      method: "PUT",
      headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" },
      body: JSON.stringify({
        asset: { key: newSectionKey, value: fullLiquidCode }
      })
    });

    if (!putAssetResp || !putAssetResp.ok) {
      const err = putAssetResp ? await putAssetResp.json() : "Unknown error";
      throw new Error("Failed to create section file: " + JSON.stringify(err));
    }

    // 2. Fetch the target JSON template
    let tpl: any;
    try {
      const tplRaw = await fetchAsset(admin as any, session, themeId, templateKey);
      tpl = JSON.parse(tplRaw);
    } catch (e) {
      throw new Error("Target template not found: " + templateKey);
    }

    if (!tpl.sections) tpl.sections = {};
    if (!tpl.order) tpl.order = [];

    // 3. Generate a dynamic instance ID
    const newInstanceId = `ck_${templateId}_${Math.random().toString(36).slice(-6)}`;

    tpl.sections[newInstanceId] = {
      type: `ck-${templateId}`,
      settings: {}
    };

    // 4. Inject into order at specified index
    if (typeof insertIndex === 'number' && insertIndex >= 0 && insertIndex <= tpl.order.length) {
      tpl.order.splice(insertIndex, 0, newInstanceId);
    } else {
      tpl.order.push(newInstanceId);
    }

    // 5. Save modified JSON template back
    const putTplResp = await shopifyFetchWithRetry(assetUrl, {
      method: "PUT",
      headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" },
      body: JSON.stringify({
        asset: { key: templateKey, value: JSON.stringify(tpl) }
      })
    });

    if (!putTplResp || !putTplResp.ok) {
      throw new Error("Failed to save updated JSON template");
    }

    return json({ success: true, instanceId: newInstanceId });

  } catch (error: any) {
    console.error("Install template action error:", error);
    return json({ error: error.message }, { status: 500 });
  }
};
