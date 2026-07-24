import { graphqlRequest } from "./app/services/shopify-api.server.js";
import prisma from "./app/db.server.js";

async function main() {
  const shop = await prisma.shop.findFirst({ where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" } });
  if (!shop) throw new Error("no shop");

  const query = `
    query {
      products(first: 10) {
        nodes {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
          media(first: 5) {
            nodes {
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
  console.log(JSON.stringify(res.data.products.nodes, null, 2));
}

main().catch(console.error);
