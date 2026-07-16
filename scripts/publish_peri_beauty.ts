import { graphqlRequest } from "../app/services/shopify-api.server.js";
import prisma from "../app/db.server.js";
import { publishTheme } from "../app/services/theme-engine/index.js";

async function main() {
  const shop = await prisma.shop.findFirst({ where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" } });
  if (!shop) throw new Error("Shop not found in database");

  const query = `
    query {
      themes(first: 5, sortKey: UPDATED_AT, reverse: true) {
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
  console.log(`Current Role: ${latestTheme.role}`);

  const numericId = latestTheme.id.split('/').pop()!;

  console.log(`Publishing theme ${numericId} as MAIN theme...`);
  const publishQuery = `
    mutation themePublish($id: ID!) {
      themePublish(id: $id) {
        theme {
          id
          role
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const pubRes = await graphqlRequest(shop.shopDomain, shop.accessToken, publishQuery, { id: latestTheme.id }, true);
    if (pubRes.themePublish?.userErrors?.length > 0) {
      console.warn("GraphQL themePublish returned userError:", pubRes.themePublish.userErrors[0].message);
      console.log("Trying REST publishTheme fallback...");
      await publishTheme(shop, numericId);
    } else {
      console.log("Published via GraphQL successfully:", pubRes.themePublish?.theme);
    }
  } catch (err: any) {
    console.warn("GraphQL error, falling back to REST publishTheme:", err.message);
    await publishTheme(shop, numericId);
  }

  console.log(`\nSUCCESS! Theme is now live at: https://${shop.shopDomain}`);
}

main().catch(console.error);
