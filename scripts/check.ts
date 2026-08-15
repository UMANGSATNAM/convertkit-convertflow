import { graphqlRequest } from "../app/services/shopify-api.server.js";
import prisma from "../app/db.server.js";

async function main() {
  try {
    const shop = await prisma.shop.findFirst({
      where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" }
    });
    if (!shop) throw new Error("Shop not found");

    const query = `
      query {
        productByHandle(handle: "aurelle-celestial-radiance-serum") {
          id
          title
          featuredImage { url }
          media(first: 10) {
            edges {
              node {
                id status mediaErrors { code message }
                ... on MediaImage { image { url } }
              }
            }
          }
        }
      }
    `;
    const res = await graphqlRequest(shop.shopDomain, shop.accessToken, query);
    console.log(JSON.stringify(res, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
