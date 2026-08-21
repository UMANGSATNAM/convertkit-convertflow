import { redirect, type LoaderFunctionArgs } from "@remix-run/node";

/**
 * The old "Build your store" screen, now pointing at PageKit.
 *
 * ## Why it was retired rather than fixed in place
 *
 * Two defects in its apply path could not be fixed without changing what the
 * screen was:
 *
 *   1. Previewing a home page wrote the live one. `applyComposition` excluded
 *      the index page from variant staging — `options.variant && !isIndexPage`
 *      — so staging a preview replaced the real `templates/index.json` and the
 *      real header and footer groups. Merely scrolling the grid rewrote the
 *      merchant's store, and the last design previewed beat the one they
 *      applied. That is the "I applied HP-51 but the middle is HP-9" report.
 *
 *   2. Its thumbnails were a stock photo from the template's `heroImg` field,
 *      the same image on most cards. Nothing on the screen showed the design.
 *
 * Both of those are gone in PageKit: previews are real, staged as alternate
 * templates that shoppers never see, and applying is explicit.
 *
 * All 51 designs this screen offered are still available — `pages.ts` adapts
 * `STORE_PAGE_TEMPLATES` rather than duplicating it, so there is one list and
 * nothing was lost.
 *
 * The redirect keeps existing links and bookmarks working.
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const target = new URL("/app/pagekit", url.origin);

  // Carry the embedded-app parameters over, or App Bridge loses the session and
  // the merchant lands on a blank frame.
  for (const key of ["shop", "host", "embedded", "id_token", "session"]) {
    const value = url.searchParams.get(key);
    if (value) target.searchParams.set(key, value);
  }

  return redirect(target.pathname + target.search);
};
