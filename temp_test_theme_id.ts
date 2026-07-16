import { graphqlRequest } from "./app/services/shopify-api.server.js";
import prisma from "./app/db.server.js";

async function main() {
  const shop = await prisma.shop.findFirst({ where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" } });
  if (!shop) throw new Error("no shop");

  const query = `
    query {
      themes(first: 1) {
        nodes {
          id
          name
        }
      }
    }
  `;
  const res = await graphqlRequest(shop.shopDomain, shop.accessToken, query);
  console.log(JSON.stringify(res, null, 2));
}

main().catch(console.error);
