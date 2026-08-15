import prisma from "../app/db.server.js";
import { upsertThemeFilesBatched } from "../app/services/theme-engine/index.js";
import { graphqlRequest } from "../app/services/shopify-api.server.js";
import fs from "fs";
import path from "path";

async function main() {
  const hpVersion = process.argv[2] || "hp-v1";
  console.log(`🚀 Uploading ${hpVersion} Section and Template to Shopify...`);
  
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

  const secPath = path.join(process.cwd(), "dev-theme-peri", "sections", `${hpVersion}.liquid`);
  if (fs.existsSync(secPath)) {
    filesToUpload[`sections/${hpVersion}.liquid`] = fs.readFileSync(secPath, "utf-8");
  }

  const tmplPath = path.join(process.cwd(), "dev-theme-peri", "templates", `page.${hpVersion}.json`);
  if (fs.existsSync(tmplPath)) {
    filesToUpload[`templates/page.${hpVersion}.json`] = fs.readFileSync(tmplPath, "utf-8");
  }

  for (const theme of targetThemes) {
    const themeId = theme.id.split('/').pop()!;
    console.log(`📦 Syncing ${hpVersion} to Theme "${theme.name}" (${themeId})...`);
    await upsertThemeFilesBatched(shop, themeId, filesToUpload);
  }

  console.log(`\n✅ SUCCESS! Uploaded ${hpVersion} to ALL Store Themes!`);
  console.log(`Preview URL: https://${shop.shopDomain}/pages/${hpVersion}`);
}

main().catch(console.error);
