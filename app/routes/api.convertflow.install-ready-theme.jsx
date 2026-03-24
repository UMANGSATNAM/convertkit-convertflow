import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

/**
 * API Route: /api/convertflow/install-ready-theme
 * Installs a zip file theme to the Shopify store via the Themes REST API.
 */
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const themePath = formData.get("themePath"); // e.g. /themes/asian-footwears-shopify-theme-v2.zip
  const themeName = formData.get("themeName");

  if (!themePath || !themeName) {
    return json({ error: "Missing theme path or name" }, { status: 400 });
  }

  // Determine the base URL of this request to build the full absolute URL required by Shopify
  const url = new URL(request.url);
  const fullThemeUrl = `${url.protocol}//${url.host}${themePath}`;

  try {
    const response = await admin.rest.post({
      path: "themes",
      data: {
        theme: {
          name: themeName,
          src: fullThemeUrl,
          role: "unpublished"
        }
      }
    });

    const data = await response.json();
    if (data.errors) {
       return json({ error: JSON.stringify(data.errors) }, { status: 400 });
    }

    return json({ success: true, theme: data.theme });
  } catch (error) {
    console.error("Install ready theme error:", error.message);
    return json({ error: `Failed to install theme: ${error.message}` }, { status: 500 });
  }
};
