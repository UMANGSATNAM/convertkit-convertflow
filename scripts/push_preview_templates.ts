import prisma from "../app/db.server.js";
import { graphqlRequest } from "../app/services/shopify-api.server.js";
import fs from "fs";
import path from "path";

async function main() {
  const shop = await prisma.shop.findFirst({
    where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" }
  });
  if (!shop) throw new Error("Shop not found");

  const query = `
    query {
      themes(first: 10) { nodes { id name role } }
    }
  `;
  const data = await graphqlRequest(shop.shopDomain, shop.accessToken, query);
  const mainTheme = data.themes.nodes.find((t: any) => t.role === "MAIN") || data.themes.nodes[0];
  const themeId = mainTheme.id.split('/').pop()!;

  const templatesDir = path.join(process.cwd(), "dev-theme-peri", "templates");
  const templateFiles = fs.readdirSync(templatesDir).filter(f => f.startsWith("collection.preview-") && f.endsWith(".json"));

  for (const file of templateFiles) {
    const content = fs.readFileSync(path.join(templatesDir, file), "utf-8");
    
    const mutation = `
      mutation themeFilesUpsert($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
          themeFilesUpsert(themeId: $themeId, files: $files) {
              upsertedThemeFiles { filename }
              userErrors { field message }
          }
      }
    `;
    
    try {
      const response = await fetch(`https://${shop.shopDomain}/admin/api/2024-01/graphql.json`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': shop.accessToken
          },
          body: JSON.stringify({
              query: mutation,
              variables: {
                  themeId: `gid://shopify/OnlineStoreTheme/${themeId}`,
                  files: [{
                      filename: `templates/${file}`,
                      body: { type: "TEXT", value: content }
                  }]
              }
          })
      });
      const result = await response.json();
      if (result.data?.themeFilesUpsert?.userErrors?.length > 0) {
          console.error(`Failed ${file}: ${result.data.themeFilesUpsert.userErrors[0].message}`);
      } else {
          console.log(`Success: ${file}`);
      }
    } catch(e) {
      console.error(`Error on ${file}:`, e.message);
    }
  }
}

main().catch(console.error);
