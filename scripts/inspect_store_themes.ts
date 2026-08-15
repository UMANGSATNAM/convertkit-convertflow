import prisma from "../app/db.server.js";
import { graphqlRequest } from "../app/services/shopify-api.server.js";

async function main() {
  const shop = await prisma.shop.findFirst({
    where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" }
  });
  if (!shop) throw new Error("Shop not found");

  const query = `
    query {
      themes(first: 25) {
        nodes {
          id
          name
          role
          createdAt
          updatedAt
        }
      }
    }
  `;
  const data = await graphqlRequest(shop.shopDomain, shop.accessToken, query);
  console.log("All themes on peri-beauty-bcuauhsj.myshopify.com:");
  console.log(JSON.stringify(data.themes.nodes, null, 2));
}

main().catch(console.error);
