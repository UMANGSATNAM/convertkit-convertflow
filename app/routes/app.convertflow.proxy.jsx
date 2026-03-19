import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import fs from "node:fs";
import path from "node:path";
import { shopifyFetchWithRetry } from "../lib/shopify-fetch.server.js";

/**
 * GET /app/convertflow/proxy?shop=xxx&path=/some-path
 * Server-side HTML proxy that:
 * 1. Checks if store is password protected (returns JSON error if so)
 * 2. Fetches the merchant's STOREFRONT page (public site, not admin)
 * 3. Rewrites all relative URLs to absolute
 * 4. Rewrites internal navigation links to stay in the proxy
 * 5. Injects the inspector.js script inline before </body>
 * 6. Serves modified HTML from the app's own origin (same-origin iframe)
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

  // ── Step 1: Check if store is password protected ──
  try {
    const shopResp = await shopifyFetchWithRetry(`https://${shopDomain}/admin/api/2025-01/shop.json`, {
      headers: { "X-Shopify-Access-Token": token },
    });
    if (shopResp.ok) {
      const shopData = await shopResp.json();
      if (shopData.shop?.password_enabled) {
        return json({
          error: "PASSWORD_PROTECTED",
          shopDomain,
          customDomain: shopData.shop.domain || shopDomain,
        }, {
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  } catch (e) {
    // Non-fatal — continue and try to fetch anyway
    console.warn("Shop check failed:", e.message);
  }

  // ── Step 2: Try to fetch storefront with storefront access token ──
  let storefrontToken = null;
  try {
    const tokensResp = await shopifyFetchWithRetry(
      `https://${shopDomain}/admin/api/2025-01/storefront_access_tokens.json`,
      { headers: { "X-Shopify-Access-Token": token } }
    );
    if (tokensResp.ok) {
      const tokensData = await tokensResp.json();
      const tokens = tokensData.storefront_access_tokens || [];
      if (tokens.length > 0) {
        storefrontToken = tokens[0].access_token;
      }
    }
  } catch (e) {
    // Non-fatal
  }

  // ── Step 3: Fetch the storefront page ──
  try {
    const storeUrl = `https://${shopDomain}${pagePath}`;
    const fetchHeaders = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
    };

    // Add storefront token if available
    if (storefrontToken) {
      fetchHeaders["X-Shopify-Storefront-Access-Token"] = storefrontToken;
    }

    // First try with manual redirect handling
    const resp = await fetch(storeUrl, {
      method: "GET",
      redirect: "manual",
      headers: fetchHeaders,
    });

    // Handle redirects
    if (resp.status === 301 || resp.status === 302 || resp.status === 307 || resp.status === 308) {
      const location = resp.headers.get("location") || "";

      // Redirect to accounts.shopify.com or password page = protected store
      if (location.includes("accounts.shopify.com") || location.includes("/password")) {
        return json({
          error: "PASSWORD_PROTECTED",
          shopDomain,
          redirectTo: location,
        }, {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Follow other redirects (e.g. www → non-www, HTTP → HTTPS)
      const followResp = await fetch(location, {
        headers: fetchHeaders,
        redirect: "follow",
      });

      if (!followResp.ok) {
        return new Response(
          errorPage(`Store returned ${followResp.status} after redirect`),
          { headers: { "Content-Type": "text/html; charset=utf-8" } }
        );
      }

      return processAndServe(await followResp.text(), shopDomain);
    }

    if (!resp.ok) {
      return new Response(
        errorPage(`Store returned ${resp.status}: ${resp.statusText}`),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    return processAndServe(await resp.text(), shopDomain);
  } catch (err) {
    console.error("Proxy error:", err);
    return new Response(errorPage(`Proxy error: ${err.message}`), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
};

/**
 * Process HTML: rewrite URLs, rewrite navigation, inject inspector, serve.
 */
function processAndServe(html, shopDomain) {
  // ── Rewrite relative URLs to absolute ──
  html = html.replace(
    /((?:src|href|action|poster|data-src)\s*=\s*["'])\/((?!\/)[^"']*["'])/gi,
    `$1https://${shopDomain}/$2`
  );

  // srcset="/..." — each URL in the comma-separated list
  html = html.replace(/srcset\s*=\s*"([^"]*)"/gi, (match, srcset) => {
    const rewritten = srcset.replace(
      /\/((?!\/)[^\s,]+)/g,
      `https://${shopDomain}/$1`
    );
    return `srcset="${rewritten}"`;
  });

  // url(/...) in inline styles and style tags
  html = html.replace(
    /url\(\s*['"]?\/((?!\/)[^'")]+)['"]?\s*\)/gi,
    `url(https://${shopDomain}/$1)`
  );

  // ── Rewrite internal navigation links to proxy ──
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

  // ── Inject inspector script inline before </body> ──
  const inspectorScript = getInspectorScript();
  html = html.replace(
    /<\/body>/i,
    `<script id="__ck_inspector">${inspectorScript}</script></body>`
  );

  // ── Remove Content-Security-Policy ──
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
