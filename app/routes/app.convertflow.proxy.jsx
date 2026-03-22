import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import fs from "node:fs";
import path from "node:path";
import { shopifyFetchWithRetry } from "../lib/shopify-fetch.server.js";

/**
 * GET /app/convertflow/proxy?shop=xxx&path=/some-path
 * Server-side HTML proxy that:
 * 1. Gets the active theme's preview URL (bypasses password protection)
 * 2. Fetches the storefront page using that preview URL
 * 3. Rewrites all relative URLs to absolute
 * 4. Injects the inspector.js script inline before </body>
 * 5. Serves modified HTML from the app's own origin (same-origin iframe)
 */
export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const shopDomain = url.searchParams.get("shop") || session.shop;
  const pagePath = url.searchParams.get("path") || "/";
  const token = session.accessToken;

  if (!shopDomain) {
    return new Response(errorPage("Missing shop domain"), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // ── Step 1: Get the active theme ID for preview URL ──
  let themeId = "";
  let previewUrl = "";
  try {
    const themesResp = await admin.graphql(`query { themes(first: 10) { edges { node { id name role } } } }`);
    const themesData = await themesResp.json();
    const activeTheme = themesData.data.themes.edges.find((e) => e.node.role === "MAIN")?.node;
    themeId = activeTheme?.id?.replace("gid://shopify/OnlineStoreTheme/", "") || "";
  } catch (e) {
    console.warn("Theme fetch failed:", e.message);
  }

  // ── Step 2: Try multiple approaches to fetch the store page ──
  let html = null;

  // Approach A: Use theme preview URL (bypasses password protection)
  if (themeId) {
    try {
      // Shopify theme preview URL format: https://shop.myshopify.com/?preview_theme_id=XXXXX
      const previewFetchUrl = `https://${shopDomain}${pagePath}${pagePath.includes("?") ? "&" : "?"}preview_theme_id=${themeId}`;
      
      const resp = await fetch(previewFetchUrl, {
        method: "GET",
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Cookie": `preview_theme_id=${themeId}`,
        },
      });

      if (resp.ok) {
        const text = await resp.text();
        // Only use if it's actual HTML (not a login redirect page)
        if (text.includes("</html>") && !text.includes("accounts.shopify.com") && !text.includes("id=\"password\"")) {
          html = text;
        }
      }
    } catch (e) {
      console.warn("Preview URL approach failed:", e.message);
    }
  }

  // Approach B: Create/use a storefront access token to bypass password
  if (!html) {
    try {
      // Check for existing storefront tokens
      const tokensResp = await shopifyFetchWithRetry(
        `https://${shopDomain}/admin/api/2025-01/storefront_access_tokens.json`,
        { headers: { "X-Shopify-Access-Token": token } }
      );
      
      let storefrontToken = null;
      if (tokensResp.ok) {
        const tokensData = await tokensResp.json();
        const tokens = tokensData.storefront_access_tokens || [];
        storefrontToken = tokens[0]?.access_token;
      }
      
      // If no token exists, create one
      if (!storefrontToken) {
        const createResp = await shopifyFetchWithRetry(
          `https://${shopDomain}/admin/api/2025-01/storefront_access_tokens.json`,
          {
            method: "POST",
            headers: {
              "X-Shopify-Access-Token": token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              storefront_access_token: { title: "ConvertFlow Preview" },
            }),
          }
        );
        if (createResp.ok) {
          const createData = await createResp.json();
          storefrontToken = createData.storefront_access_token?.access_token;
        }
      }

      // Fetch with storefront token
      if (storefrontToken) {
        const storeUrl = `https://${shopDomain}${pagePath}`;
        const resp = await fetch(storeUrl, {
          method: "GET",
          redirect: "follow",
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "X-Shopify-Storefront-Access-Token": storefrontToken,
          },
        });

        if (resp.ok) {
          const text = await resp.text();
          if (text.includes("</html>") && !text.includes("accounts.shopify.com")) {
            html = text;
          }
        }
      }
    } catch (e) {
      console.warn("Storefront token approach failed:", e.message);
    }
  }

  // Approach C: Direct fetch (works for non-password-protected stores)
  if (!html) {
    try {
      const storeUrl = `https://${shopDomain}${pagePath}`;
      const resp = await fetch(storeUrl, {
        method: "GET",
        redirect: "manual",
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      // Handle redirects
      if (resp.status >= 300 && resp.status < 400) {
        const location = resp.headers.get("location") || "";
        if (location.includes("accounts.shopify.com") || location.includes("/password")) {
          // Store is password-protected — render the preview using Liquid rendering API
          return await renderViaLiquidAPI(admin, session, shopDomain, themeId, pagePath, token);
        }
        // Follow other redirects
        const followResp = await fetch(location, {
          redirect: "follow",
          headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" },
        });
        if (followResp.ok) {
          html = await followResp.text();
        }
      } else if (resp.ok) {
        html = await resp.text();
      }
    } catch (e) {
      console.warn("Direct fetch approach failed:", e.message);
    }
  }

  // Approach D: Render via Assets API as last resort
  if (!html) {
    return await renderViaLiquidAPI(admin, session, shopDomain, themeId, pagePath, token);
  }

  return processAndServe(html, shopDomain);
};

/**
 * Last resort: build a basic page from the theme's layout + template assets
 */
async function renderViaLiquidAPI(admin, session, shopDomain, themeId, pagePath, token) {
  try {
    // Fetch the theme's layout/theme.liquid and relevant template
    const layoutResp = await shopifyFetchWithRetry(
      `https://${shopDomain}/admin/api/2025-01/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent("layout/theme.liquid")}`,
      { headers: { "X-Shopify-Access-Token": token } }
    );

    let layoutHtml = "";
    if (layoutResp.ok) {
      const layoutData = await layoutResp.json();
      layoutHtml = layoutData.asset?.value || "";
    }

    // If we have the layout, create a basic renderable page
    if (layoutHtml) {
      // Strip Liquid tags for a basic HTML skeleton, keep the structure
      let basicHtml = layoutHtml
        .replace(/\{%.*?%\}/gs, "") // Remove Liquid tags
        .replace(/\{\{.*?\}\}/gs, "") // Remove Liquid variables
        .replace(/<\/body>/i, `
          <div style="text-align:center;padding:60px 20px;font-family:-apple-system,sans-serif;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#005bd3" stroke-width="1.5" style="margin-bottom:16px">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M2 7h20"/><path d="M8 21h8M12 17v4"/>
            </svg>
            <h2 style="color:#1a1a1a;font-size:20px;margin:0 0 8px">Store Preview</h2>
            <p style="color:#6b6b6b;font-size:14px;margin:0 0 4px">Your store is password-protected.</p>
            <p style="color:#6b6b6b;font-size:14px;margin:0 0 20px">Use the section tree and settings panels to edit your theme.</p>
            <p style="color:#8a8a8a;font-size:12px;margin:0">Changes will apply to your live store once saved.</p>
          </div>
        </body>`);
      
      // Fix relative asset URLs
      basicHtml = basicHtml.replace(
        /((?:src|href)\s*=\s*["'])\/((?!\/)[^"']*["'])/gi,
        `$1https://${shopDomain}/$2`
      );

      return new Response(basicHtml, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }
  } catch (e) {
    console.warn("Liquid render fallback failed:", e.message);
  }

  // Absolute last resort: nice placeholder page
  const placeholderHtml = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Store Preview — ${shopDomain}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f9fafb;color:#303030;min-height:100vh;display:flex;flex-direction:column}
  .header{background:#1a1a1a;padding:16px 24px;display:flex;align-items:center;justify-content:space-between}
  .header .logo{color:#fff;font-size:16px;font-weight:600}
  .header .nav{display:flex;gap:20px}
  .header .nav a{color:#b5b5b5;text-decoration:none;font-size:13px}
  .hero{background:linear-gradient(135deg,#005bd3 0%,#0070e0 50%,#008060 100%);padding:80px 24px;text-align:center;color:#fff}
  .hero h1{font-size:36px;font-weight:700;margin-bottom:12px}
  .hero p{font-size:16px;opacity:0.9;max-width:500px;margin:0 auto 24px}
  .hero .btn{display:inline-block;background:#fff;color:#005bd3;padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;text-decoration:none}
  .sections{max-width:900px;margin:40px auto;padding:0 24px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  .card{background:#fff;border:1px solid #e3e3e3;border-radius:8px;padding:24px;text-align:center}
  .card h3{font-size:14px;margin-bottom:8px}
  .card p{font-size:12px;color:#6b6b6b;line-height:1.5}
  .footer{margin-top:auto;background:#1a1a1a;padding:24px;text-align:center;color:#8a8a8a;font-size:12px}
  .notice{background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:12px 20px;margin:20px auto;max-width:500px;text-align:center;font-size:13px;color:#856404}
</style></head><body>
<div class="header">
  <div class="logo">${shopDomain.replace(".myshopify.com", "")}</div>
  <div class="nav"><a href="#">Home</a><a href="#">Shop</a><a href="#">About</a><a href="#">Contact</a></div>
</div>
<div class="hero">
  <h1>Welcome to Your Store</h1>
  <p>This is a preview placeholder. Your actual store content will appear here once password protection is removed.</p>
  <a class="btn" href="#">Shop Now →</a>
</div>
<div class="notice">
  ⚠️ Store is password-protected — this is a placeholder preview. Remove password protection to see the live store.
</div>
<div class="sections">
  <div class="card"><h3>🛍️ Featured Collection</h3><p>Your products will appear in this section</p></div>
  <div class="card"><h3>📢 Announcements</h3><p>Promotional banners and sale notices</p></div>
  <div class="card"><h3>⭐ Reviews</h3><p>Customer testimonials and ratings</p></div>
</div>
<div class="footer">© ${new Date().getFullYear()} ${shopDomain.replace(".myshopify.com", "")} · Powered by ConvertKit</div>
<script>(function(){window.parent.postMessage({type:"CK_INSPECTOR_READY"},"*");})()</script>
</body></html>`;

  return new Response(placeholderHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

/**
 * Process HTML: rewrite URLs, rewrite navigation, inject inspector, serve.
 */
function processAndServe(html, shopDomain) {
  // Rewrite relative URLs to absolute
  html = html.replace(
    /((?:src|href|action|poster|data-src)\s*=\s*["'])\/((?!\/)[^"']*["'])/gi,
    `$1https://${shopDomain}/$2`
  );

  // srcset
  html = html.replace(/srcset\s*=\s*"([^"]*)"/gi, (match, srcset) => {
    const rewritten = srcset.replace(
      /\/((?!\/)[^\s,]+)/g,
      `https://${shopDomain}/$1`
    );
    return `srcset="${rewritten}"`;
  });

  // url(/...) in styles
  html = html.replace(
    /url\(\s*['"]?\/((?!\/)[^'")\s]+)['"]?\s*\)/gi,
    `url(https://${shopDomain}/$1)`
  );

  // Rewrite internal navigation links to proxy
  const proxyBase = `/app/convertflow/proxy?shop=${encodeURIComponent(shopDomain)}&path=`;
  const escapedDomain = shopDomain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  html = html.replace(
    new RegExp(`(href\\s*=\\s*["'])https://${escapedDomain}(/[^"'#]*)`, "gi"),
    (match, prefix, storePath) => {
      if (/\.(css|js|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot)(\?|$)/i.test(storePath)) {
        return match;
      }
      return `${prefix}${proxyBase}${encodeURIComponent(storePath)}`;
    }
  );

  // Inject inspector script before </body>
  const inspectorScript = getInspectorScript();
  html = html.replace(
    /<\/body>/i,
    `<script id="__ck_inspector">${inspectorScript}</script></body>`
  );

  // Remove Content-Security-Policy
  html = html.replace(
    /<meta[^>]*http-equiv\s*=\s*["']Content-Security-Policy["'][^>]*>/gi,
    ""
  );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

/** Read inspector.js from disk and return as string */
function getInspectorScript() {
  try {
    const possiblePaths = [
      path.join(process.cwd(), "public", "inspector.js"),
      path.join(process.cwd(), "build", "client", "inspector.js"),
    ];
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        return fs.readFileSync(p, "utf-8");
      }
    }
  } catch (e) {
    console.error("Failed to read inspector.js:", e);
  }
  return `(function(){window.parent.postMessage({type:"CK_INSPECTOR_READY"},"*");console.warn("ConvertKit inspector.js not found on disk. Using fallback.")})();`;
}

function errorPage(message) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>ConvertFlow Proxy</title>
  <style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;
  font-family:-apple-system,sans-serif;background:#f9fafb;color:#374151}
  .box{text-align:center;padding:40px;max-width:500px}
  .box h2{color:#dc2626;margin:0 0 12px}
  .box p{margin:0;line-height:1.5;font-size:14px}</style></head>
  <body><div class="box"><h2>Preview Unavailable</h2><p>${message}</p></div></body></html>`;
}
