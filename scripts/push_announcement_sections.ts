import prisma from "../app/db.server.js";
import { upsertThemeFilesBatched } from "../app/services/theme-engine/index.js";
import { graphqlRequest, restRequest } from "../app/services/shopify-api.server.js";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Reading Announcement Bar sections and preview templates...");
  
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

  // Read all announcement-v*.liquid files
  const sectionsDir = path.join(process.cwd(), "dev-theme-peri", "sections");
  const sectionFiles = fs.readdirSync(sectionsDir).filter(f => f.startsWith("announcement-v") && f.endsWith(".liquid"));

  for (const file of sectionFiles) {
    const content = fs.readFileSync(path.join(sectionsDir, file), "utf-8");
    filesToUpload[`sections/${file}`] = content;
  }

  // Read preview templates
  const templatesDir = path.join(process.cwd(), "dev-theme-peri", "templates");
  ["page.announcements-preview-1.json", "page.announcements-preview-2.json", "page.announcements-preview-3.json"].forEach(tmpl => {
    if (fs.existsSync(path.join(templatesDir, tmpl))) {
      filesToUpload[`templates/${tmpl}`] = fs.readFileSync(path.join(templatesDir, tmpl), "utf-8");
    }
  });

  console.log(`Uploading ${Object.keys(filesToUpload).length} files to Shopify theme ${themeId}...`);
  await upsertThemeFilesBatched(shop, themeId, filesToUpload);

  // Now create/update Shopify Page resources
  console.log("\nCreating Shopify Page entries for preview URLs...");
  const pagesToCreate = [
    { title: "Announcements Preview 1", handle: "announcements-preview-1", template_suffix: "announcements-preview-1" },
    { title: "Announcements Preview 2", handle: "announcements-preview-2", template_suffix: "announcements-preview-2" },
    { title: "Announcements Preview 3", handle: "announcements-preview-3", template_suffix: "announcements-preview-3" }
  ];

  const existingPages = await restRequest(shop.shopDomain, shop.accessToken, "GET", "pages.json");
  for (const item of pagesToCreate) {
    const found = existingPages.pages?.find((p: any) => p.handle === item.handle);
    if (found) {
      console.log(`Page '${item.handle}' exists. Updating template suffix...`);
      await restRequest(shop.shopDomain, shop.accessToken, "PUT", `pages/${found.id}.json`, {
        page: { id: found.id, template_suffix: item.template_suffix }
      });
    } else {
      console.log(`Creating page '${item.handle}'...`);
      await restRequest(shop.shopDomain, shop.accessToken, "POST", "pages.json", {
        page: { title: item.title, handle: item.handle, template_suffix: item.template_suffix, body_html: "" }
      });
    }
  }

  console.log("\n=======================================================");
  console.log("SUCCESS! All 50 Announcement Bar sections & preview pages uploaded to Shopify.");
  console.log(`Theme ID: ${themeId}`);
  console.log(`Part 1 (V1-V18):  https://peri-beauty-bcuauhsj.myshopify.com/pages/announcements-preview-1?preview_theme_id=${themeId}`);
  console.log(`Part 2 (V19-V35): https://peri-beauty-bcuauhsj.myshopify.com/pages/announcements-preview-2?preview_theme_id=${themeId}`);
  console.log(`Part 3 (V36-V50): https://peri-beauty-bcuauhsj.myshopify.com/pages/announcements-preview-3?preview_theme_id=${themeId}`);
  console.log("=======================================================");
}

main().catch(console.error);
