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

  // Build the absolute base URL that Shopify can reach.
  // Priority 1: SHOPIFY_APP_URL env var (clean any stray quotes)
  // Priority 2: X-Forwarded-Host + X-Forwarded-Proto (used by Railway/Cloudflare proxies)
  // Priority 3: Fallback to request.url host
  let baseUrl = (process.env.SHOPIFY_APP_URL || "").replace(/['"]/g, "").replace(/\/$/, "");

  if (!baseUrl.startsWith("http")) {
    // Try forwarded headers from the proxy (Railway sets these)
    const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
    if (forwardedHost) {
      baseUrl = `${forwardedProto}://${forwardedHost}`.replace(/\/$/, "");
    } else {
      const reqUrl = new URL(request.url);
      baseUrl = `${reqUrl.protocol}//${reqUrl.host}`;
    }
  }

  const fullThemeUrl = `${baseUrl}${themePath.startsWith("/") ? themePath : "/" + themePath}`;
  console.log("[THEME INSTALL] base:", baseUrl, "| full URL:", fullThemeUrl);

  try {
    const MUTATION = `
      mutation themeCreate($source: URL!, $name: String!, $role: ThemeRole!) {
        themeCreate(source: $source, name: $name, role: $role) {
          theme {
            id
            name
            role
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await admin.graphql(MUTATION, {
      variables: {
        source: fullThemeUrl,
        name: themeName,
        role: "UNPUBLISHED",
      },
    });

    const body = await response.json();

    if (body.data?.themeCreate?.userErrors?.length > 0) {
      return json({ error: body.data.themeCreate.userErrors[0].message }, { status: 400 });
    }

    if (!body.data?.themeCreate?.theme) {
       return json({ error: "Failed to create theme via GraphQL" }, { status: 400 });
    }

    return json({ success: true, theme: body.data.themeCreate.theme });
  } catch (error) {
    console.error("Install ready theme error:", error.message);
    return json({ error: `Failed to install theme: ${error.message}` }, { status: 500 });
  }
};
