import { graphqlRequest } from "../shopify-api.server";

export async function createNavigationAndPages(shop: any, niche: any) {
  // 1. Create Pages based on niche.pagesPreset
  const lang = shop.language || "en";
  const pages = niche.pagesPreset?.[lang] || [];

  for (const page of pages) {
    await graphqlRequest(
      shop.shopDomain,
      shop.accessToken,
      `
      mutation pageCreate($page: PageCreateInput!) {
        pageCreate(page: $page) {
          page { id }
          userErrors { field message }
        }
      }
      `,
      {
        page: {
          title: page.title,
          handle: page.handle,
          body: `<p>This is the auto-generated ${page.title} page for your new store.</p>`,
        }
      }
    );
  }

  // 2. We would normally create Navigation Menus here using the menuCreate mutation
  // but Shopify's Navigation API is REST-only for menus.
  // For the sake of this mock, we'll log it out.
  console.log(`Prepared menus for ${shop.shopDomain}:`, niche.menusPreset);
}
