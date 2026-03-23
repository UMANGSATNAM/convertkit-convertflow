import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { shopifyFetchWithRetry } from "../lib/shopify-fetch.server.js";

/**
 * GET  /api/convertflow/settings?themeId=xxx&sectionId=xxx
 * PUT  /api/convertflow/settings { sectionId, settingId, value, themeId }
 *
 * Reads/writes section settings from the theme's config/settings_data.json.
 */

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const themeId = url.searchParams.get("themeId");
  const sectionId = url.searchParams.get("sectionId");

  if (!themeId) return json({ error: "themeId required" }, { status: 400 });

  const shopDomain = session.shop;
  const token = session.accessToken;

  try {
    const resp = await shopifyFetchWithRetry(
      `https://${shopDomain}/admin/api/2025-01/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent("config/settings_data.json")}`,
      { headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" } }
    );

    if (!resp.ok) throw new Error(`Failed: ${resp.status}`);
    const body = await resp.json();
    const settingsData = JSON.parse(body.asset?.value || "{}");

    if (sectionId) {
      const sectionSettings = settingsData?.current?.sections?.[sectionId] || {};
      return json({ success: true, sectionId, settings: sectionSettings });
    }

    return json({ success: true, settings: settingsData?.current?.sections || {} });
  } catch (error) {
    console.error("Settings GET error:", error);
    return json({ error: error.message }, { status: 500 });
  }
};

export const action = async ({ request }) => {
  if (request.method !== "PUT" && request.method !== "DELETE" && request.method !== "PATCH") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { session } = await authenticate.admin(request);
    const shopDomain = session.shop;
    const token = session.accessToken;
    const { themeId, settings, templateKey, sectionId, order, globalSettings, insertIndex } = await request.json();

    if (!themeId) {
      return json({ error: "themeId required" }, { status: 400 });
    }

    const assetUrl = `https://${shopDomain}/admin/api/2025-01/themes/${themeId}/assets.json`;

    // 1. Fetch config/settings_data.json
    const sdResp = await shopifyFetchWithRetry(
      `${assetUrl}?asset[key]=${encodeURIComponent("config/settings_data.json")}`,
      { headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" } }
    );

    let sd = { current: { sections: {} } };
    if (sdResp.ok) {
      const getBody = await sdResp.json();
      sd = JSON.parse(getBody.asset?.value || "{}");
    }

    // 2. Fetch active template file (e.g. templates/index.json)
    let tpl = null;
    if (templateKey) {
      const tResp = await shopifyFetchWithRetry(
        `${assetUrl}?asset[key]=${encodeURIComponent(templateKey)}`,
        { headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" } }
      );
      if (tResp.ok) {
        const getBody = await tResp.json();
        tpl = JSON.parse(getBody.asset?.value || "{}");
      }
    }

    let sdUpdated = false;
    let tplUpdated = false;

    // PATCH: Handle drag-and-drop reordering
    if (request.method === "PATCH") {
      if (tpl && order) {
        tpl.order = order;
        tplUpdated = true;
      }
    }

    // DELETE: Handle remove section
    if (request.method === "DELETE") {
      if (sectionId) {
        if (tpl && tpl.sections && tpl.sections[sectionId]) {
          delete tpl.sections[sectionId];
          tpl.order = tpl.order.filter(id => id !== sectionId);
          tplUpdated = true;
        } else if (sd.current?.sections?.[sectionId]) {
          delete sd.current.sections[sectionId];
          sdUpdated = true;
        }
      }
    }

    // PUT: Route updates
    if (request.method === "PUT") {
      if (globalSettings) {
        if (!sd.current) sd.current = {};
        for (const [k, v] of Object.entries(globalSettings)) {
          sd.current[k] = v;
        }
        sdUpdated = true;
      }

      if (settings) {
        for (const [instanceId, instanceSettings] of Object.entries(settings)) {
          if (sd.current?.sections?.[instanceId]) {
            // Exists in settings_data.json
            sd.current.sections[instanceId] = { ...sd.current.sections[instanceId], ...instanceSettings };
            sdUpdated = true;
          } else if (tpl && tpl.sections && tpl.sections[instanceId]) {
            // Exists in JSON template
            tpl.sections[instanceId] = { ...tpl.sections[instanceId], ...instanceSettings };
            tplUpdated = true;
          } else {
            // Treat as new - guess by name
            if (instanceId.includes("header") || instanceId.includes("footer") || instanceId.includes("announcement")) {
              if (!sd.current) sd.current = {};
              if (!sd.current.sections) sd.current.sections = {};
              sd.current.sections[instanceId] = instanceSettings;
              sdUpdated = true;
            } else if (tpl) {
              if (!tpl.sections) tpl.sections = {};
              tpl.sections[instanceId] = instanceSettings;
              if (tpl.order && !tpl.order.includes(instanceId)) {
                if (typeof insertIndex === 'number') {
                  tpl.order.splice(insertIndex, 0, instanceId);
                } else {
                  tpl.order.push(instanceId);
                }
              }
              tplUpdated = true;
            }
          }
        }
      }
    }

    // 4. Save updates back to Shopify
    if (sdUpdated) {
      const putResp = await shopifyFetchWithRetry(assetUrl, {
        method: "PUT",
        headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" },
        body: JSON.stringify({
          asset: { key: "config/settings_data.json", value: JSON.stringify(sd) },
        }),
      });
      if (!putResp.ok) throw new Error("Failed to save settings_data");
    }

    if (tplUpdated && templateKey && tpl) {
      const putResp = await shopifyFetchWithRetry(assetUrl, {
        method: "PUT",
        headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" },
        body: JSON.stringify({
          asset: { key: templateKey, value: JSON.stringify(tpl) },
        }),
      });
      if (!putResp.ok) throw new Error("Failed to save template " + templateKey);
    }

    return json({ success: true, themeId });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return json({ error: error.message }, { status: 500 });
  }
};
