import prisma from "../app/db.server.js";
import { upsertThemeFilesBatched } from "../app/services/theme-engine/index.js";
import { graphqlRequest } from "../app/services/shopify-api.server.js";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Starting upload of ALL 70 Product Cards (sections, snippets & templates) to Shopify...");
  
  const shop = await prisma.shop.findFirst({
    where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" }
  });
  if (!shop) throw new Error("Shop peri-beauty-bcuauhsj.myshopify.com not found in DB");

  // Query Shopify to get MAIN theme ID
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
  console.log(`Targeting ${targetThemes.length} themes on store:`, targetThemes.map((t: any) => `${t.name} (${t.id})`));

  const filesToUpload: Record<string, string> = {};

  // 1. Read all snippets/card-v*.liquid (v1 to v70)
  const snippetsDir = path.join(process.cwd(), "dev-theme-peri", "snippets");
  for (let i = 1; i <= 70; i++) {
    const filename = `card-v${i}.liquid`;
    const filepath = path.join(snippetsDir, filename);
    if (fs.existsSync(filepath)) {
      filesToUpload[`snippets/${filename}`] = fs.readFileSync(filepath, "utf-8");
    }
  }

  // 2. Read all sections/pc-v*.liquid (v1 to v70)
  const sectionsDir = path.join(process.cwd(), "dev-theme-peri", "sections");
  for (let i = 1; i <= 70; i++) {
    const filename = `pc-v${i}.liquid`;
    const filepath = path.join(sectionsDir, filename);
    if (fs.existsSync(filepath)) {
      filesToUpload[`sections/${filename}`] = fs.readFileSync(filepath, "utf-8");
    }
  }

  // 3. Read all templates/collection.pc-v*.json and collection.v*.json
  const templatesDir = path.join(process.cwd(), "dev-theme-peri", "templates");
  for (let i = 1; i <= 70; i++) {
    const tmpl1 = `collection.pc-v${i}.json`;
    const tmpl2 = `collection.v${i}.json`;
    if (fs.existsSync(path.join(templatesDir, tmpl1))) {
      filesToUpload[`templates/${tmpl1}`] = fs.readFileSync(path.join(templatesDir, tmpl1), "utf-8");
    }
    if (fs.existsSync(path.join(templatesDir, tmpl2))) {
      filesToUpload[`templates/${tmpl2}`] = fs.readFileSync(path.join(templatesDir, tmpl2), "utf-8");
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
  console.log(`✅ SUCCESS! Uploaded ${fileCount} Product Card files to ALL Store Themes!`);
  console.log(`Preview URL: https://${shop.shopDomain}/collections/all?view=pc-v1`);
  console.log("=======================================================");
}

main().catch(err => {
  console.error("❌ Upload failed:", err);
  process.exit(1);
});
