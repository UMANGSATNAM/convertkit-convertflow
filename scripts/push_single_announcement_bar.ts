import prisma from "../app/db.server.js";
import { upsertThemeFilesBatched } from "../app/services/theme-engine/index.js";
import { graphqlRequest } from "../app/services/shopify-api.server.js";
import fs from "fs";
import path from "path";

async function main() {
  const abVersion = process.argv[2] || "ab-v1";
  console.log(`🚀 Uploading ${abVersion}.liquid Section to Shopify...`);
  
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

  const secPath = path.join(process.cwd(), "dev-theme-peri", "sections", `${abVersion}.liquid`);
  if (fs.existsSync(secPath)) {
    filesToUpload[`sections/${abVersion}.liquid`] = fs.readFileSync(secPath, "utf-8");
  } else {
    throw new Error(`File ${secPath} does not exist!`);
  }

  for (const theme of targetThemes) {
    const themeId = theme.id.split('/').pop()!;
    console.log(`📦 Syncing ${abVersion}.liquid to Theme "${theme.name}" (${themeId})...`);
    await upsertThemeFilesBatched(shop, themeId, filesToUpload);
  }

  console.log(`\n=======================================================`);
  console.log(`✅ SUCCESS! Uploaded ${abVersion}.liquid to ALL Store Themes!`);
  console.log(`=======================================================`);
}

main().catch(console.error);
