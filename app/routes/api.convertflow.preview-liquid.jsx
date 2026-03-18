import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

/**
 * POST /api/convertflow/preview-liquid
 * Pushes Liquid code to a hidden preview theme, waits for Shopify to process,
 * then fetches the rendered HTML using Shopify's section rendering API.
 * Body: { liquidCode, cssCode, sectionId, themeId }
 */
export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { admin, session } = await authenticate.admin(request);
    const shopDomain = session.shop;
    const token = session.accessToken;
    const { liquidCode, cssCode, sectionId, themeId } = await request.json();

    if (!liquidCode || !sectionId) {
      return json({ success: false, error: "liquidCode and sectionId are required" }, { status: 400 });
    }

    // ── Step 1: Get or create the preview theme ──
    const previewThemeId = await getOrCreatePreviewTheme(shopDomain, token);

    // ── Step 2: Push liquid code to preview theme ──
    const combinedCode = cssCode
      ? `<style>${cssCode}</style>\n${liquidCode}`
      : liquidCode;

    const pushUrl = `https://${shopDomain}/admin/api/2025-01/themes/${previewThemeId}/assets.json`;
    const pushResp = await fetch(pushUrl, {
      method: "PUT",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        asset: {
          key: `sections/${sectionId}.liquid`,
          value: combinedCode,
        },
      }),
    });

    if (!pushResp.ok) {
      const errText = await pushResp.text();
      throw new Error(`Failed to push to preview theme: ${pushResp.status} ${errText}`);
    }

    // ── Step 3: Wait for Shopify to process ──
    await new Promise((r) => setTimeout(r, 1200));

    // ── Step 4: Fetch rendered HTML ──
    const renderUrl = `https://${shopDomain}/?section_id=${sectionId}&preview_theme_id=${previewThemeId}&_ck=${Date.now()}`;
    const renderResp = await fetch(renderUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 ConvertKit-Preview/1.0",
        Accept: "text/html",
      },
    });

    let renderedHtml = "";
    if (renderResp.ok) {
      renderedHtml = await renderResp.text();
    } else {
      console.error("Render fetch failed:", renderResp.status);
      renderedHtml = `<div style="padding:20px;color:#dc2626;font-family:sans-serif">
        <p>Preview render failed (${renderResp.status}). The code was pushed but Shopify couldn't render it.</p>
      </div>`;
    }

    return json({
      success: true,
      html: renderedHtml,
      sectionId,
      previewThemeId,
    });
  } catch (error) {
    console.error("Preview liquid error:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
};

/**
 * Get or create the hidden preview theme.
 * Idempotent: never creates duplicates.
 */
async function getOrCreatePreviewTheme(shopDomain, token) {
  const PREVIEW_THEME_NAME = "ConvertKit Preview (Do Not Delete)";
  const baseUrl = `https://${shopDomain}/admin/api/2025-01`;

  // Check existing themes
  const themesResp = await fetch(`${baseUrl}/themes.json`, {
    headers: { "X-Shopify-Access-Token": token },
  });

  if (!themesResp.ok) {
    throw new Error(`Failed to list themes: ${themesResp.status}`);
  }

  const themesData = await themesResp.json();
  const existing = themesData.themes.find((t) => t.name === PREVIEW_THEME_NAME);

  if (existing) {
    return String(existing.id);
  }

  // Create unpublished preview theme
  const createResp = await fetch(`${baseUrl}/themes.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      theme: {
        name: PREVIEW_THEME_NAME,
        role: "unpublished",
      },
    }),
  });

  if (!createResp.ok) {
    const errText = await createResp.text();
    throw new Error(`Failed to create preview theme: ${createResp.status} ${errText}`);
  }

  const createData = await createResp.json();
  const newId = String(createData.theme.id);

  // Wait for Shopify to finish processing theme creation
  await new Promise((r) => setTimeout(r, 3000));

  return newId;
}
