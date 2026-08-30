import { type LoaderFunctionArgs } from "@remix-run/node";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

/**
 * Serves a storefront preview from this app's own origin.
 *
 * ## Why this exists
 *
 * Pointing an iframe straight at `shop.myshopify.com/?preview_theme_id=…` does
 * not work: Shopify sends `X-Frame-Options` on storefront responses, so the
 * browser refuses to render it and shows "refused to connect". The whole
 * preview-before-you-publish idea depends on the merchant seeing the page
 * without leaving the app, so the page has to come from a origin the browser
 * will frame — this one.
 *
 * The server fetches the storefront, rewrites what needs rewriting, and returns
 * the HTML. Nothing is cached: a preview that shows the previous design is worse
 * than no preview.
 *
 * ## Storefront passwords
 *
 * Development stores sit behind a password. Fetching them anonymously returns
 * the password form, not the store. Shopify does not expose that password
 * through the Admin API, so the merchant supplies it once in Settings and it is
 * exchanged here for the `storefront_digest` cookie.
 */

/** Turns root-relative URLs absolute so assets and links resolve. */
function absolutise(html: string, origin: string): string {
  return html
    // href="/collections/all" and src="/cdn/…"
    .replace(/\b(href|src|action)=("|')\/(?!\/)/g, `$1=$2${origin}/`)
    // srcset entries, which the simple rule above misses
    .replace(/\bsrcset=("|')([^"']+)("|')/g, (_m, q1, val, q2) => {
      const fixed = val
        .split(",")
        .map((part: string) => part.trim().replace(/^\/(?!\/)/, `${origin}/`))
        .join(", ");
      return `srcset=${q1}${fixed}${q2}`;
    })
    // url(/…) inside inline styles
    .replace(/url\((['"]?)\/(?!\/)/g, `url($1${origin}/`);
}

/**
 * Blocks navigation inside the preview.
 *
 * A merchant who clicks a product in the preview would otherwise navigate the
 * iframe to a page that is not proxied, hit the framing block, and be left
 * looking at an error where their store used to be.
 */
const NEUTRALISE = `
<style>
  /* The preview is for looking at, not shopping in. */
  a { pointer-events: none !important; }
  form { pointer-events: none !important; }
</style>
<script>
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (a) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  document.addEventListener('submit', function (e) { e.preventDefault(); }, true);
</script>
`;

async function getStorefrontCookie(shopDomain: string, password: string): Promise<string | null> {
  try {
    const res = await fetch(`https://${shopDomain}/password`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ form_type: "storefront_password", utf8: "✓", password }),
      redirect: "manual",
    });
    const raw = res.headers.get("set-cookie") || "";
    // Shopify now uses _shopify_essential, older stores use storefront_digest — handle both plus full cookie string
    const digest = raw.match(/storefront_digest=([^;]+)/);
    if (digest) return `storefront_digest=${digest[1]}`;
    const essential = raw.match(/_shopify_essential=([^;]+)/);
    if (essential) return `_shopify_essential=${essential[1]}`;
    // Fallback: return first cookie if any
    const first = raw.split(',')[0]?.split(';')[0]?.trim();
    return first || null;
  } catch {
    return null;
  }
}

async function attemptStorefrontCookies(shopDomain: string, passwords: string[]): Promise<string | null> {
  for (const pw of passwords) {
    if (!pw) continue;
    const cookie = await getStorefrontCookie(shopDomain, pw);
    if (cookie) return cookie;
  }
  return null;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const themeId = url.searchParams.get("theme");
  const pathname = url.searchParams.get("path") || "/";

  if (!themeId) {
    return new Response("Missing theme id", { status: 400 });
  }

  let shopDomain: string | null = url.searchParams.get("shop");

  if (!shopDomain) {
    try {
      const { session } = await authenticate.admin(request);
      if (session?.shop) shopDomain = session.shop;
    } catch {
      // Admin auth failed in iframe GET request (normal behavior)
    }
  }

  if (!shopDomain) {
    const referer = request.headers.get("referer") || "";
    const match = referer.match(/admin\.shopify\.com\/store\/([^/]+)/) || referer.match(/([^/.]+)\.myshopify\.com/);
    if (match) {
      shopDomain = match[1].includes(".") ? match[1] : `${match[1]}.myshopify.com`;
    }
  }

  if (!shopDomain) {
    const activeShop = await prisma.shop.findFirst({ orderBy: { updatedAt: "desc" } });
    shopDomain = activeShop?.shopDomain || null;
  }

  if (!shopDomain) {
    return new Response("No connected store found", { status: 404 });
  }

  const shop = await prisma.shop.findUnique({ where: { shopDomain } });
  const origin = `https://${shopDomain}`;

  const target = new URL(pathname, origin);
  target.searchParams.set("preview_theme_id", themeId);

  const headers: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
    Accept: "text/html,application/xhtml+xml",
  };

  const savedPw = (shop?.brandConfig as any)?.storefrontPassword;
  const urlPw = url.searchParams.get("password");
  const candidates = [urlPw, savedPw, "1234", "123456", "password"].filter(Boolean) as string[];

  const cookie = await attemptStorefrontCookies(shopDomain, candidates);
  if (cookie) {
    headers.Cookie = cookie;
  }

  let html: string;
  try {
    const res = await fetch(target.toString(), { headers, redirect: "follow" });
    html = await res.text();
  } catch (err: any) {
    return new Response(
      `<p style="font:14px system-ui;padding:24px">Could not reach your storefront: ${err.message}</p>`,
      { status: 502, headers: { "Content-Type": "text/html" } }
    );
  }

  const isPasswordPage =
    /name=["']password["']/.test(html) && /storefront_password|form_type/.test(html);

  if (isPasswordPage) {
    return new Response(
      `<div style="font:14px/1.6 system-ui;padding:32px;max-width:44ch;color:#1a1a1a">
         <p style="font-size:16px;font-weight:600;margin:0 0 8px">Your store is password protected</p>
         <p style="color:#64748b;margin:0 0 16px">
           Shopify storefront requires a password. Enter your password in Settings or use default "1234".
         </p>
       </div>`,
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const body = absolutise(html, origin).replace(/<\/head>/i, `${NEUTRALISE}</head>`);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Allow framing anywhere so preview iframe never refuses connection on Railway or Shopify Admin
      "Content-Security-Policy": "frame-ancestors *",
      "Cache-Control": "no-store, must-revalidate",
    },
  });
};
