import { graphqlRequest } from "./app/services/shopify-api.server.js";
import prisma from "./app/db.server.js";

async function main() {
  const shop = await prisma.shop.findFirst({ where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" } });
  if (!shop) throw new Error("no shop");

  const query = `
    query {
      themes(first: 5) {
        nodes {
          id
          name
          role
          createdAt
        }
      }
    }
  `;
  const res = await graphqlRequest(shop.shopDomain, shop.accessToken, query);
  const latestTheme = res.data.themes.nodes[0];
  console.log(`Latest Theme ID: ${latestTheme.id}`);
  console.log(`Latest Theme Name: ${latestTheme.name}`);
  
  // Format the ID correctly for the preview URL
  const numericId = latestTheme.id.split('/').pop();
  console.log(`PREVIEW URL: https://peri-beauty-bcuauhsj.myshopify.com/?preview_theme_id=${numericId}`);
}

main().catch(console.error);
