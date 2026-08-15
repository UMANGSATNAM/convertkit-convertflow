import { graphqlRequest } from "../app/services/shopify-api.server.js";
import prisma from "../app/db.server.js";

async function main() {
  const shop = await prisma.shop.findFirst({
    where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" }
  });
  if (!shop) throw new Error("Shop not found");

  const query = `
    query {
      productByHandle(handle: "aurelle-celestial-radiance-serum") {
        id
        title
        media(first: 10) {
          edges {
            node {
              id
              status
              ... on MediaImage {
                image {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;
  const res = await graphqlRequest(shop.shopDomain, shop.accessToken, query);
  console.log(JSON.stringify(res.productByHandle.media.edges, null, 2));
}

main().catch(console.error);
