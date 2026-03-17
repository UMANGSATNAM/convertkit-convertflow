import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { listThemes, listThemeSections } from "../lib/convertflow.server";

/**
 * GET /api/convertflow-themes
 *   — returns all themes
 * GET /api/convertflow-themes?themeId=123
 *   — returns section file keys for that theme
 */
export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const url = new URL(request.url);
  const themeId = url.searchParams.get("themeId");

  try {
    if (themeId) {
      const sections = await listThemeSections(admin, themeId);
      return json({ sections });
    }
    const themes = await listThemes(admin);
    return json({ themes });
  } catch (err) {
    console.error("ConvertFlow themes API error:", err.message);
    return json({ error: err.message }, { status: 500 });
  }
};
