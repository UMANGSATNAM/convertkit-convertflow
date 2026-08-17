import { graphqlRequest } from "../shopify-api.server";

/**
 * Creates the supporting pages and the main navigation menu for a generated store.
 *
 * ## Why this was rewritten
 *
 * The previous version was never called from anywhere — it had no call sites in
 * the whole app — and even if it had been, it could not have worked:
 *
 *   - It read `niche.pagesPreset[lang]`, which `prisma/seed.ts` seeds as `[]`
 *     for every niche, so the loop body never ran.
 *   - `pageCreate` was called without `templateSuffix`, so a created page would
 *     have used the default `page.json` and never the designed
 *     `page.about.json` / `page.contact.json` / `page.faq.json` templates.
 *   - The page body was "This is the auto-generated About page for your new
 *     store." — placeholder copy written straight into a merchant's store.
 *   - Menus were not created at all, only logged, so a generated store had no
 *     navigation links whatsoever.
 *
 * Everything is idempotent: generation is re-runnable, so an existing page or
 * menu is updated rather than duplicated.
 */

interface PageSpec {
  handle: string;
  title: string;
  /** Must match a `templates/page.<suffix>.json` produced by the compiler. */
  templateSuffix: string;
  body: (brand: string) => string;
}

const PAGES: PageSpec[] = [
  {
    handle: "about",
    title: "About Us",
    templateSuffix: "about",
    // The template's sections carry the real story copy. This body is the
    // fallback that shows if the theme is switched, so it says something true
    // about the store rather than announcing that it was auto-generated.
    body: (brand) =>
      `<p>${brand} was built around a simple idea: make things worth keeping, and be straight with the people who buy them.</p>`,
  },
  {
    handle: "contact",
    title: "Contact",
    templateSuffix: "contact",
    body: (brand) =>
      `<p>Questions about an order, a product, or a return? Send us a message and someone from ${brand} will get back to you.</p>`,
  },
  {
    handle: "faq",
    title: "FAQ",
    templateSuffix: "faq",
    body: () =>
      `<p>Answers to the questions we are asked most often — shipping, returns, sizing and care.</p>`,
  },
];

async function findPageByHandle(shop: any, handle: string): Promise<string | null> {
  try {
    const res = await graphqlRequest(
      shop.shopDomain,
      shop.accessToken,
      `query pageByHandle($q: String!) {
        pages(first: 1, query: $q) { nodes { id handle } }
      }`,
      { q: `handle:${handle}` }
    );
    const node = res?.pages?.nodes?.[0];
    return node?.handle === handle ? node.id : null;
  } catch (err: any) {
    console.warn(`[Navigation] Could not look up page "${handle}": ${err.message}`);
    return null;
  }
}

/** Creates the three supporting pages, or updates them if they already exist. */
async function createPages(shop: any, brandName: string): Promise<Record<string, string>> {
  const created: Record<string, string> = {};

  for (const spec of PAGES) {
    const existingId = await findPageByHandle(shop, spec.handle);

    try {
      if (existingId) {
        // Only the template link is forced. A merchant may have rewritten the
        // body, and overwriting their copy on every regeneration would be
        // worse than leaving a stale sentence in place.
        const res = await graphqlRequest(
          shop.shopDomain,
          shop.accessToken,
          `mutation pageUpdate($id: ID!, $page: PageUpdateInput!) {
            pageUpdate(id: $id, page: $page) {
              page { id handle }
              userErrors { field message }
            }
          }`,
          { id: existingId, page: { templateSuffix: spec.templateSuffix } }
        );
        const errs = res?.pageUpdate?.userErrors || [];
        if (errs.length) {
          console.warn(`[Navigation] pageUpdate "${spec.handle}": ${errs.map((e: any) => e.message).join("; ")}`);
        } else {
          created[spec.handle] = existingId;
          console.log(`[Navigation] Page "${spec.handle}" linked to template page.${spec.templateSuffix}`);
        }
      } else {
        const res = await graphqlRequest(
          shop.shopDomain,
          shop.accessToken,
          `mutation pageCreate($page: PageCreateInput!) {
            pageCreate(page: $page) {
              page { id handle }
              userErrors { field message }
            }
          }`,
          {
            page: {
              title: spec.title,
              handle: spec.handle,
              body: spec.body(brandName),
              templateSuffix: spec.templateSuffix,
              isPublished: true,
            },
          }
        );
        const errs = res?.pageCreate?.userErrors || [];
        if (errs.length) {
          console.warn(`[Navigation] pageCreate "${spec.handle}": ${errs.map((e: any) => e.message).join("; ")}`);
        } else {
          created[spec.handle] = res.pageCreate.page.id;
          console.log(`[Navigation] Created page "${spec.handle}" using template page.${spec.templateSuffix}`);
        }
      }
    } catch (err: any) {
      console.warn(`[Navigation] Page "${spec.handle}" failed: ${err.message}`);
    }
  }

  return created;
}

interface MenuItemInput {
  title: string;
  type: string;
  url?: string;
}

/**
 * Writes the main menu.
 *
 * Every item uses the HTTP type with a relative URL rather than a typed
 * resource reference. Typed items need the resource's global id and fail the
 * whole mutation if any one id is stale, which on a freshly generated store —
 * where collections were created moments earlier — is a real risk. Relative
 * URLs cannot go stale in that way.
 */
async function writeMenu(shop: any, collections: Array<{ handle: string; title: string }>, pages: Record<string, string>) {
  const items: MenuItemInput[] = [{ title: "Home", type: "HTTP", url: "/" }];

  for (const c of collections.slice(0, 5)) {
    items.push({ title: c.title, type: "HTTP", url: `/collections/${c.handle}` });
  }
  if (collections.length === 0) {
    items.push({ title: "Shop All", type: "HTTP", url: "/collections/all" });
  }

  if (pages.about) items.push({ title: "About", type: "HTTP", url: "/pages/about" });
  if (pages.faq) items.push({ title: "FAQ", type: "HTTP", url: "/pages/faq" });
  if (pages.contact) items.push({ title: "Contact", type: "HTTP", url: "/pages/contact" });

  try {
    const existing = await graphqlRequest(
      shop.shopDomain,
      shop.accessToken,
      `query { menus(first: 20) { nodes { id handle title } } }`
    );
    const mainMenu = (existing?.menus?.nodes || []).find((m: any) => m.handle === "main-menu");

    if (mainMenu) {
      const res = await graphqlRequest(
        shop.shopDomain,
        shop.accessToken,
        `mutation menuUpdate($id: ID!, $title: String!, $handle: String!, $items: [MenuItemUpdateInput!]!) {
          menuUpdate(id: $id, title: $title, handle: $handle, items: $items) {
            menu { id handle }
            userErrors { field message }
          }
        }`,
        { id: mainMenu.id, title: mainMenu.title || "Main menu", handle: "main-menu", items }
      );
      const errs = res?.menuUpdate?.userErrors || [];
      if (errs.length) console.warn(`[Navigation] menuUpdate: ${errs.map((e: any) => e.message).join("; ")}`);
      else console.log(`[Navigation] Main menu updated with ${items.length} links.`);
    } else {
      const res = await graphqlRequest(
        shop.shopDomain,
        shop.accessToken,
        `mutation menuCreate($title: String!, $handle: String!, $items: [MenuItemCreateInput!]!) {
          menuCreate(title: $title, handle: $handle, items: $items) {
            menu { id handle }
            userErrors { field message }
          }
        }`,
        { title: "Main menu", handle: "main-menu", items }
      );
      const errs = res?.menuCreate?.userErrors || [];
      if (errs.length) console.warn(`[Navigation] menuCreate: ${errs.map((e: any) => e.message).join("; ")}`);
      else console.log(`[Navigation] Main menu created with ${items.length} links.`);
    }
  } catch (err: any) {
    // A store with no menu is poor but usable; failing generation over it would
    // throw away an otherwise complete theme.
    console.warn(`[Navigation] Menu write failed: ${err.message}. The theme is fine; navigation links are missing.`);
  }
}

/**
 * Entry point. Safe to call more than once for the same shop.
 */
export async function createNavigationAndPages(shop: any, niche: any) {
  console.log(`[Navigation] Setting up pages and menu for ${shop.shopDomain}`);

  // The merchant's own store name, which is what the theme renders via
  // `{{ shop.name }}`. Using the niche name instead would put "Activewear" in
  // the body copy of a store called Peri Beauty.
  let brand = niche?.name || "This store";
  try {
    const res = await graphqlRequest(shop.shopDomain, shop.accessToken, `query { shop { name } }`);
    if (res?.shop?.name) brand = res.shop.name;
  } catch (err: any) {
    console.warn(`[Navigation] Could not read the shop name: ${err.message}. Using "${brand}".`);
  }

  const pages = await createPages(shop, brand);

  let collections: Array<{ handle: string; title: string }> = [];
  try {
    const res = await graphqlRequest(
      shop.shopDomain,
      shop.accessToken,
      `query { collections(first: 10, sortKey: UPDATED_AT, reverse: true) {
        nodes { handle title productsCount { count } }
      } }`
    );
    collections = (res?.collections?.nodes || [])
      .filter((c: any) => (c.productsCount?.count ?? 0) > 0)
      .map((c: any) => ({ handle: c.handle, title: c.title }));
  } catch (err: any) {
    console.warn(`[Navigation] Could not read collections for the menu: ${err.message}`);
  }

  await writeMenu(shop, collections, pages);

  return { pages: Object.keys(pages), collections: collections.length };
}
