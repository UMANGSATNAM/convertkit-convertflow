import { publishTheme } from "../app/services/theme-engine/index";
import { restRequest, graphqlRequest } from "../app/services/shopify-api.server";

async function test() {
  const shop = {
    shopDomain: "uwyhex-nb.myshopify.com",
    accessToken: "shpat_fake" // We don't have the real one, but we can see the exact error
  };
  
  const query = `
    mutation themePublish($id: ID!) {
      themePublish(id: $id) {
        theme {
          id
        }
      }
    }
  `;
  try {
    await graphqlRequest(shop.shopDomain, shop.accessToken, query, { id: "gid://shopify/Theme/123" });
  } catch(e) {
    console.log("GraphQL Error:", e);
  }
}
test();
