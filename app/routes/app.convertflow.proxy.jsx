import { authenticate } from "../../shopify.server";
import fs from "node:fs";
import path from "node:path";

/**
 * GET /app/convertflow/proxy?shop=xxx&path=/some-path
 * Server-side HTML proxy that:
 * 1. Fetches the merchant's store page server-side
 * 2. Rewrites all relative URLs to absolute
 * 3. Rewrites internal nav links to go through this proxy
 * 4. Injects the inspector.js script inline before </body>
 * 5. Serves the modified HTML from the app's own origin (same-origin iframe)
 */
export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const shopDomain = url.searchParams.get("shop") || session.shop;
  const pagePath = url.searchParams.get("path") || "/";

  if (!shopDomain) {
    return new Response(errorPage("Missing shop domain"), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  try {
    const storeUrl = `https://${shopDomain}${pagePath}`;
    const resp = await fetch(storeUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
    });

    if (!resp.ok) {
      return new Response(
        errorPage(`Store returned ${resp.status}: ${resp.statusText}`),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    let html = await resp.text();

    // ── Rewrite relative URLs to absolute ──
    // src="/...", href="/...", action="/..."
    html = html.replace(
      /((?:src|href|action|poster|data-src|data-srcset)\s*=\s*["'])\/((?!\/)[^"']*["'])/gi,
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
    // href="https://{shopDomain}/..." → href="/app/convertflow/proxy?shop=...&path=/..."
    const proxyBase = `/app/convertflow/proxy?shop=${encodeURIComponent(shopDomain)}&path=`;
    const escapedDomain = shopDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    html = html.replace(
      new RegExp(`(href\\s*=\\s*["'])https://${escapedDomain}(/[^"'#]*)`, "gi"),
      (match, prefix, storePath) => {
        // Don't rewrite asset URLs (CDN, images, CSS, JS)
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

    // ── Remove Content-Security-Policy that blocks our injection ──
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
  } catch (err) {
    console.error("Proxy error:", err);
    return new Response(errorPage(`Proxy error: ${err.message}`), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
};

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
  // Fallback: return minimal script that signals ready
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
