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
  if (request.method !== "PUT") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { session } = await authenticate.admin(request);
    const shopDomain = session.shop;
    const token = session.accessToken;
    const { sectionId, settingId, value, themeId } = await request.json();

    if (!sectionId || !settingId || !themeId) {
      return json({ error: "sectionId, settingId, and themeId are required" }, { status: 400 });
    }

    const assetUrl = `https://${shopDomain}/admin/api/2025-01/themes/${themeId}/assets.json`;

    // Read current settings_data.json
    const getResp = await shopifyFetchWithRetry(
      `${assetUrl}?asset[key]=${encodeURIComponent("config/settings_data.json")}`,
      { headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" } }
    );

    if (!getResp.ok) throw new Error(`Failed to read settings: ${getResp.status}`);
    const getBody = await getResp.json();
    const settingsData = JSON.parse(getBody.asset?.value || "{}");

    // Update the specific setting
    if (!settingsData.current) settingsData.current = {};
    if (!settingsData.current.sections) settingsData.current.sections = {};
    if (!settingsData.current.sections[sectionId]) settingsData.current.sections[sectionId] = {};

    settingsData.current.sections[sectionId][settingId] = value;

    // Push updated settings_data.json
    const putResp = await shopifyFetchWithRetry(assetUrl, {
      method: "PUT",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        asset: { key: "config/settings_data.json", value: JSON.stringify(settingsData) },
      }),
    });

    if (!putResp.ok) {
      const errText = await putResp.text();
      throw new Error(`Failed to save settings: ${putResp.status} ${errText}`);
    }

    return json({ success: true, sectionId, settingId, value });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return json({ error: error.message }, { status: 500 });
  }
};
