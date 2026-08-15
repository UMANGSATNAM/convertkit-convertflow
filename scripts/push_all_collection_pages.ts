import prisma from "../app/db.server.js";
import { upsertThemeFilesBatched } from "../app/services/theme-engine/index.js";
import { graphqlRequest } from "../app/services/shopify-api.server.js";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Starting upload of ALL 70 Collection Page Sections & Templates to Shopify...");
  
  const shop = await prisma.shop.findFirst({
    where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" }
  });
  if (!shop) throw new Error("Shop peri-beauty-bcuauhsj.myshopify.com not found in DB");

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
  const targetThemes = data.themes.nodes.filter((t: any) => t.role === "MAIN" || t.role === "DEVELOPMENT");
  console.log(`Targeting ${targetThemes.length} themes:`, targetThemes.map((t: any) => `${t.name} (${t.id})`));

  const filesToUpload: Record<string, string> = {};

  // 1. Read all sections/cp-v*.liquid (v1 to v70)
  const sectionsDir = path.join(process.cwd(), "dev-theme-peri", "sections");
  for (let i = 1; i <= 70; i++) {
    const filename = `cp-v${i}.liquid`;
    const filepath = path.join(sectionsDir, filename);
    if (fs.existsSync(filepath)) {
      filesToUpload[`sections/${filename}`] = fs.readFileSync(filepath, "utf-8");
    }
  }

  // 2. Read all templates/collection.cp-v*.json (v1 to v70)
  const templatesDir = path.join(process.cwd(), "dev-theme-peri", "templates");
  for (let i = 1; i <= 70; i++) {
    const filename = `collection.cp-v${i}.json`;
    const filepath = path.join(templatesDir, filename);
    if (fs.existsSync(filepath)) {
      filesToUpload[`templates/${filename}`] = fs.readFileSync(filepath, "utf-8");
    }
  }

  const fileCount = Object.keys(filesToUpload).length;

  for (const theme of targetThemes) {
    const themeId = theme.id.split('/').pop()!;
    console.log(`\n📦 Uploading ${fileCount} files to Theme "${theme.name}" (${themeId})...`);
    await upsertThemeFilesBatched(shop, themeId, filesToUpload);
    console.log(`✅ Upload complete for Theme "${theme.name}" (${themeId})!`);
  }

  console.log("\n=======================================================");
  console.log(`✅ SUCCESS! Uploaded ${fileCount} Collection Page files to ALL Store Themes!`);
  console.log(`Preview URL: https://${shop.shopDomain}/collections/all?view=cp-v1`);
  console.log("=======================================================");
}

main().catch(err => {
  console.error("❌ Upload failed:", err);
  process.exit(1);
});
