import prisma from "../app/db.server.js";
import { upsertThemeFilesBatched } from "../app/services/theme-engine/index.js";
import { graphqlRequest } from "../app/services/shopify-api.server.js";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Reading footer sections...");
  
  const shop = await prisma.shop.findFirst({
    where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" }
  });
  if (!shop) throw new Error("Shop not found in DB");

  // Get themes list
  const query = `
    query {
      themes(first: 10) {
        nodes {
          id
          name
          role
        }
      }
    }
  `;
  const data = await graphqlRequest(shop.shopDomain, shop.accessToken, query);
  const mainTheme = data.themes.nodes.find((t: any) => t.role === "MAIN") || data.themes.nodes[0];
  const themeId = mainTheme.id.split('/').pop()!;

  console.log(`Target Shopify Theme: ${mainTheme.name} (Role: ${mainTheme.role}, ID: ${themeId})`);

  const filesToUpload: Record<string, string> = {};

  // Read all footer-*.liquid files
  const sectionsDir = path.join(process.cwd(), "dev-theme-peri", "sections");
  const sectionFiles = fs.readdirSync(sectionsDir).filter(f => f.startsWith("footer-") && f.endsWith(".liquid"));

  for (const file of sectionFiles) {
    const content = fs.readFileSync(path.join(sectionsDir, file), "utf-8");
    filesToUpload[`sections/${file}`] = content;
  }

  console.log(`Uploading ${Object.keys(filesToUpload).length} footer files to Shopify theme ${themeId}...`);
  await upsertThemeFilesBatched(shop, themeId, filesToUpload);

  console.log("\n=======================================================");
  console.log("SUCCESS! Footer sections uploaded to Shopify.");
  console.log(`Theme ID: ${themeId}`);
  console.log("=======================================================");
}

main().catch(console.error);
