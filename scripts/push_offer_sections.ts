import prisma from "../app/db.server.js";
import { upsertThemeFilesBatched } from "../app/services/theme-engine/index.js";
import { graphqlRequest } from "../app/services/shopify-api.server.js";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Reading offer sections and preview templates...");
  
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

  // Read all offer-v*.liquid files
  const sectionsDir = path.join(process.cwd(), "dev-theme-peri", "sections");
  const sectionFiles = fs.readdirSync(sectionsDir).filter(f => f.startsWith("offer-v") && f.endsWith(".liquid"));

  for (const file of sectionFiles) {
    const content = fs.readFileSync(path.join(sectionsDir, file), "utf-8");
    filesToUpload[`sections/${file}`] = content;
  }

  // Read preview templates
  const templatesDir = path.join(process.cwd(), "dev-theme-peri", "templates");
  ["page.offers-preview.json", "page.offers-preview-2.json", "page.offers-preview-3.json"].forEach(tmpl => {
    if (fs.existsSync(path.join(templatesDir, tmpl))) {
      filesToUpload[`templates/${tmpl}`] = fs.readFileSync(path.join(templatesDir, tmpl), "utf-8");
    }
  });

  console.log(`Uploading ${Object.keys(filesToUpload).length} files to Shopify theme ${themeId}...`);
  await upsertThemeFilesBatched(shop, themeId, filesToUpload);

  console.log("\n=======================================================");
  console.log("SUCCESS! All 50 Offer Banner sections & templates uploaded to Shopify.");
  console.log(`Theme ID: ${themeId}`);
  console.log(`Part 1 (V1-V20):   https://peri-beauty-bcuauhsj.myshopify.com/pages/offers-preview?preview_theme_id=${themeId}`);
  console.log(`Part 2 (V21-V35):  https://peri-beauty-bcuauhsj.myshopify.com/pages/offers-preview-2?preview_theme_id=${themeId}`);
  console.log(`Part 3 (V36-V50):  https://peri-beauty-bcuauhsj.myshopify.com/pages/offers-preview-3?preview_theme_id=${themeId}`);
  console.log("=======================================================");
}

main().catch(console.error);
