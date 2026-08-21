/**
 * Fetches the page a merchant would see and reports what actually rendered.
 *
 * ## Why this is the important file
 *
 * Every structural check in this project has passed at least once while the page
 * was broken. The theme uploaded, the JSON validated, the sections existed on
 * disk — and the storefront showed a header, a footer and white space. Nothing
 * upstream of the rendered HTML can tell you that happened.
 *
 * So after applying, this asks the store for the page and counts, per section,
 * whether it produced any markup. A section that uploaded cleanly and rendered
 * nothing is the failure this project keeps hitting, and this is the only place
 * it is visible.
 */

export interface SectionReport {
  key: string;
  type: string;
  /** Characters of visible text the section produced. */
  text: number;
  /** Elements it produced. */
  nodes: number;
  rendered: boolean;
}

export interface VerifyResult {
  ok: boolean;
  status: number;
  url: string;
  /** Set when the store is behind a password and the fetch got the login form. */
  passwordProtected: boolean;
  sections: SectionReport[];
  empty: string[];
  /** Liquid errors Shopify printed into the page. */
  liquidErrors: string[];
  bytes: number;
  error?: string;
}

/**
 * Shopify wraps each section in `<div id="shopify-section-{key}">`, so the
 * rendered output can be attributed back to the section that produced it.
 */
function sliceSections(html: string): Array<{ key: string; inner: string }> {
  const out: Array<{ key: string; inner: string }> = [];
  const re = /<(div|section|header|footer)[^>]*\bid="shopify-section-([^"]+)"[^>]*>/g;

  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const key = m[2];
    const start = m.index + m[0].length;

    // Take everything up to the next section wrapper. Counting nested tags to
    // find the exact close is fragile on real-world markup, and for "did this
    // render anything" the next-wrapper boundary is accurate enough.
    re.lastIndex = start;
    const next = re.exec(html);
    const end = next ? next.index : html.length;
    re.lastIndex = next ? next.index : html.length;

    out.push({ key, inner: html.slice(start, end) });
    if (next) re.lastIndex = next.index;
  }
  return out;
}

function visibleText(fragment: string): string {
  return fragment
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function storefrontCookie(shopDomain: string, password: string): Promise<string | null> {
  try {
    const res = await fetch(`https://${shopDomain}/password`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ form_type: "storefront_password", utf8: "✓", password }),
      redirect: "manual",
    });
    const match = (res.headers.get("set-cookie") || "").match(/storefront_digest=([^;]+)/);
    return match ? `storefront_digest=${match[1]}` : null;
  } catch {
    return null;
  }
}

export async function verifyPage(
  shopDomain: string,
  opts: {
    themeId?: string;
    path?: string;
    /** Section keys that were written, so a missing one is reported rather than ignored. */
    expect?: Array<{ key: string; type: string }>;
    storefrontPassword?: string;
  } = {}
): Promise<VerifyResult> {
  const url = new URL(opts.path || "/", `https://${shopDomain}`);
  if (opts.themeId) url.searchParams.set("preview_theme_id", opts.themeId);
  // Shopify caches storefront pages; a verification that reads a cached copy
  // would report the previous design as the current one.
  url.searchParams.set("_pk", String(Date.now()));

  const headers: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
    Accept: "text/html,application/xhtml+xml",
    "Cache-Control": "no-cache",
  };
  if (opts.storefrontPassword) {
    const cookie = await storefrontCookie(shopDomain, opts.storefrontPassword);
    if (cookie) headers.Cookie = cookie;
  }

  let html = "";
  let status = 0;
  try {
    const res = await fetch(url.toString(), { headers, redirect: "follow" });
    status = res.status;
    html = await res.text();
  } catch (err: any) {
    return {
      ok: false, status: 0, url: url.toString(), passwordProtected: false,
      sections: [], empty: [], liquidErrors: [], bytes: 0,
      error: `Could not reach the storefront: ${err.message}`,
    };
  }

  // The password form comes back with a 200, so the status cannot detect it.
  const passwordProtected =
    /name=["']password["']/.test(html) && /storefront_password|form_type/.test(html);
  if (passwordProtected) {
    return {
      ok: false, status, url: url.toString(), passwordProtected: true,
      sections: [], empty: [], liquidErrors: [], bytes: html.length,
      error: "The store is password protected, so the page could not be read.",
    };
  }

  // Shopify prints Liquid errors into the page rather than failing the request.
  const liquidErrors = [
    ...new Set(
      (html.match(/Liquid error[^<]{0,160}/g) || []).map(s => s.trim())
    ),
  ];

  const slices = sliceSections(html);
  const byKey = new Map(slices.map(s => [s.key, s.inner]));

  const expected = opts.expect ?? slices.map(s => ({ key: s.key, type: s.key }));
  const sections: SectionReport[] = expected.map(e => {
    const inner = byKey.get(e.key) ?? "";
    const text = visibleText(inner).length;
    const nodes = (inner.match(/<[a-z][^>]*>/gi) || []).length;
    return {
      key: e.key,
      type: e.type,
      text,
      nodes,
      // A wrapper plus a stylesheet is not a rendered section. The threshold is
      // deliberately low so a genuinely minimal band still counts.
      rendered: text > 12 || nodes > 6,
    };
  });

  const empty = sections.filter(s => !s.rendered).map(s => s.type);

  return {
    ok: status === 200 && empty.length === 0 && liquidErrors.length === 0,
    status,
    url: url.toString(),
    passwordProtected: false,
    sections,
    empty,
    liquidErrors,
    bytes: html.length,
  };
}

/** A sentence for the UI, said plainly. */
export function describeVerification(v: VerifyResult): string {
  if (v.error) return v.error;
  if (v.liquidErrors.length) {
    return `${v.liquidErrors.length} Liquid error(s) on the page: ${v.liquidErrors[0]}`;
  }
  if (v.empty.length) {
    return `${v.sections.length - v.empty.length} of ${v.sections.length} sections rendered. These produced nothing: ${v.empty.join(", ")}.`;
  }
  return `All ${v.sections.length} sections rendered.`;
}
