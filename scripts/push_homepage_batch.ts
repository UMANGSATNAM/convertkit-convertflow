import prisma from "../app/db.server.js";
import { upsertThemeFilesBatched } from "../app/services/theme-engine/index.js";
import { graphqlRequest } from "../app/services/shopify-api.server.js";
import fs from "fs";
import path from "path";

async function main() {
  const start = parseInt(process.argv[2] || "1", 10);
  const end = parseInt(process.argv[3] || "10", 10);

  console.log(`🚀 Uploading Homepage Sections hp-v${start} to hp-v${end} to Shopify...`);
  
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

  const filesToUpload: Record<string, string> = {};

  const sectionsDir = path.join(process.cwd(), "dev-theme-peri", "sections");
  const templatesDir = path.join(process.cwd(), "dev-theme-peri", "templates");

  for (let i = start; i <= end; i++) {
    const secFile = `hp-v${i}.liquid`;
    const secPath = path.join(sectionsDir, secFile);
    if (fs.existsSync(secPath)) {
      filesToUpload[`sections/${secFile}`] = fs.readFileSync(secPath, "utf-8");
    }

    const tmplFile = `page.hp-v${i}.json`;
    const tmplPath = path.join(templatesDir, tmplFile);
    if (fs.existsSync(tmplPath)) {
      filesToUpload[`templates/${tmplFile}`] = fs.readFileSync(tmplPath, "utf-8");
    }

    const indexTmplFile = `index.hp-v${i}.json`;
    const indexTmplPath = path.join(templatesDir, indexTmplFile);
    if (fs.existsSync(indexTmplPath)) {
      filesToUpload[`templates/${indexTmplFile}`] = fs.readFileSync(indexTmplPath, "utf-8");
    }
  }

  const fileCount = Object.keys(filesToUpload).length;

  for (const theme of targetThemes) {
    const themeId = theme.id.split('/').pop()!;
    console.log(`📦 Syncing ${fileCount} files to Theme "${theme.name}" (${themeId})...`);
    await upsertThemeFilesBatched(shop, themeId, filesToUpload);
  }

  console.log(`\n=======================================================`);
  console.log(`✅ SUCCESS! Uploaded hp-v${start}..hp-v${end} to ALL Store Themes!`);
  console.log(`Sample Preview URL: https://${shop.shopDomain}/pages/hp-v2`);
  console.log(`=======================================================`);
}

main().catch(console.error);
