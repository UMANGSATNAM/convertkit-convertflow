#!/usr/bin/env node
/**
 * Fetch the generated storefront and check what a shopper would actually see.
 *
 * Every structural gate in this repo has passed at least once while the rendered
 * page was broken. The `color_modify` incident is the clearest case: 115/115
 * tests green, schema JSON valid, Liquid balanced — and every affected section
 * shipped `rgba(17, 24, 39, )`, which browsers drop entirely.
 *
 * So this script does not look at the bundle. It requests the real pages over
 * HTTP and reads the HTML that comes back.
 *
 * Usage:
 *   node scripts/verify_storefront.cjs https://your-store.myshopify.com
 *   node scripts/verify_storefront.cjs https://your-store.myshopify.com --theme 123456789
 *   node scripts/verify_storefront.cjs https://your-store.myshopify.com --password hunter2
 *
 * `--theme` previews an unpublished theme. `--password` is the storefront
 * password for a store that is not yet public.
 *
 * Exit code 0 = clean, 1 = problems found, 2 = could not reach the store.
 */

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http"));
const themeId = args[args.indexOf("--theme") + 1];
const storefrontPassword = args.includes("--password") ? args[args.indexOf("--password") + 1] : null;

if (!base) {
  console.error("Usage: node scripts/verify_storefront.cjs <store-url> [--theme <id>] [--password <pw>]");
  process.exit(2);
}

/** Copy that must never reach a shopper. */
const PLACEHOLDER_TEXT = [
  "YOUR BRAND", "Your Brand", "yourbrand", "@yourbrand",
  "Jane Doe", "John Doe", "Eleanor Vance",
  "Lorem ipsum", "lorem ipsum",
  "Jewelry Item", "Product Name Here", "Sample Product",
  "Shop Iberian Terracotta", "Botanical Ritual",
  "example.com", "Placeholder", "PLACEHOLDER",
  "TODO", "FIXME", "undefined", "[object Object]",
];

/** CSS that a browser silently discards, usually from a bad bulk replacement. */
const BROKEN_CSS = [
  /rgba?\([^)]*,\s*\)/,          // rgba(17, 24, 39, ) — alpha dropped
  /:\s*;/,                        // empty declaration
  /var\(--[a-z0-9-]*\s*\)/i,     // var() with no fallback and no name
  /#[0-9a-f]{1,2}\b(?![0-9a-f])/i, // truncated hex
];

const PAGES = [
  { path: "/", label: "home" },
  { path: "/collections/all", label: "collection" },
  { path: "/cart", label: "cart" },
  { path: "/search?q=a", label: "search" },
  { path: "/this-page-does-not-exist-xyz", label: "404", expect: 404 },
];

function stripNonVisible(html) {
  // Placeholder words legitimately appear inside schema JSON, scripts and
  // comments. Only what renders counts.
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
}

function visibleText(html) {
  return stripNonVisible(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchPage(pathname) {
  const url = new URL(pathname, base);
  if (themeId) url.searchParams.set("preview_theme_id", themeId);

  const headers = { "User-Agent": "storeforge-verify/1.0" };
  if (storefrontPassword) headers["Cookie"] = `storefront_digest=${storefrontPassword}`;

  const res = await fetch(url.toString(), { headers, redirect: "follow" });
  const body = await res.text();
  return { status: res.status, body, url: url.toString() };
}

const problems = [];
const notes = [];

function record(page, severity, message) {
  (severity === "problem" ? problems : notes).push(`[${page}] ${message}`);
}

async function checkPage(page) {
  let res;
  try {
    res = await fetchPage(page.path);
  } catch (err) {
    record(page.label, "problem", `could not fetch: ${err.message}`);
    return;
  }

  const expected = page.expect || 200;
  if (res.status !== expected) {
    record(page.label, "problem", `HTTP ${res.status}, expected ${expected} (${res.url})`);
    if (res.status === 401 || res.status === 402) return;
  }

  const html = res.body;

  if (html.length < 2000) {
    record(page.label, "problem", `response is only ${html.length} bytes — page is probably empty`);
    return;
  }

  // Storefront password interstitial rather than the real page.
  if (/name="password"/.test(html) && /storefront/i.test(html)) {
    record(page.label, "problem", "got the storefront password page — pass --password to see the real store");
    return;
  }

  const text = visibleText(html);

  for (const needle of PLACEHOLDER_TEXT) {
    if (text.includes(needle)) {
      const at = text.indexOf(needle);
      record(page.label, "problem", `placeholder copy visible: "${needle}" … ${text.slice(Math.max(0, at - 40), at + 60).trim()}`);
    }
  }

  const styleBlocks = (html.match(/<style[\s\S]*?<\/style>/gi) || []).join("\n");
  for (const pattern of BROKEN_CSS) {
    const hit = styleBlocks.match(pattern);
    if (hit) record(page.label, "problem", `invalid CSS a browser will drop: "${hit[0]}"`);
  }

  // No stylesheet at all means the upload was incomplete — the symptom that
  // made an earlier generated store look unstyled in screenshots.
  if (!/<link[^>]+rel=["']stylesheet/i.test(html) && styleBlocks.length < 200) {
    record(page.label, "problem", "no stylesheet and almost no inline CSS — theme assets may not have finished uploading");
  }

  // Two complete product or collection layouts on one URL was a real bug here.
  const addToCartForms = (html.match(/action="[^"]*\/cart\/add/g) || []).length;
  if (page.label === "product" && addToCartForms > 1) {
    record(page.label, "problem", `${addToCartForms} add-to-cart forms — the page is rendering more than one PDP`);
  }

  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1Count > 1) record(page.label, "note", `${h1Count} <h1> elements — usually means two page layouts are stacked`);
  if (h1Count === 0 && page.label !== "404") record(page.label, "note", "no <h1> on the page");

  // Currency consistency: a store mixing symbols is showing unconverted prices.
  const symbols = new Set();
  for (const [sym, re] of [["₹", /₹\s?\d/], ["$", /\$\s?\d/], ["£", /£\s?\d/], ["€", /€\s?\d/]]) {
    if (re.test(text)) symbols.add(sym);
  }
  if (symbols.size > 1) {
    record(page.label, "problem", `more than one currency symbol on the page: ${[...symbols].join(" ")}`);
  }

  if (page.label === "collection") {
    const productLinks = new Set(html.match(/href="[^"]*\/products\/[^"?#]+/g) || []);
    if (productLinks.size === 0) {
      record(page.label, "problem", "no product links — the collection grid rendered empty or as placeholder cards");
    } else {
      record(page.label, "note", `${productLinks.size} distinct products linked`);
    }
  }

  if (page.label === "404") {
    const productLinks = new Set(html.match(/href="[^"]*\/products\/[^"?#]+/g) || []);
    if (productLinks.size === 0) record(page.label, "note", "404 page offers no products — a bounce with nothing to recover it");
  }

  record(page.label, "note", `ok — ${(html.length / 1024).toFixed(0)}kb`);
}

(async () => {
  console.log(`Checking ${base}${themeId ? ` (preview theme ${themeId})` : ""}\n`);

  for (const page of PAGES) {
    await checkPage(page);
  }

  // The product page needs a real handle, taken from the collection page.
  try {
    const coll = await fetchPage("/collections/all");
    const handle = (coll.body.match(/href="[^"]*\/products\/([^"?#]+)/) || [])[1];
    if (handle) {
      await checkPage({ path: `/products/${handle}`, label: "product" });
    } else {
      record("product", "note", "skipped — no product handle found on /collections/all");
    }
  } catch (err) {
    record("product", "note", `skipped — ${err.message}`);
  }

  if (notes.length) {
    console.log("Notes:");
    for (const n of notes) console.log(`  ${n}`);
    console.log("");
  }

  if (problems.length === 0) {
    console.log("No problems found in the rendered pages.");
    console.log("This checks copy, CSS validity, currency and duplicate layouts — it cannot");
    console.log("tell you whether the store looks good. Open it and look at it.");
    process.exit(0);
  }

  console.log(`${problems.length} problem(s):`);
  for (const p of problems) console.log(`  ! ${p}`);
  process.exit(1);
})();
