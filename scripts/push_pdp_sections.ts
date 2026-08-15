import prisma from "../app/db.server.js";
import { upsertThemeFilesBatched } from "../app/services/theme-engine/index.js";
import { graphqlRequest, restRequest } from "../app/services/shopify-api.server.js";
import fs from "fs";
import path from "path";

const allNiches = [
  "beauty", "fashion", "tech", "health", "fmcg",
  "jewelry", "pet", "home", "fitness", "auto",
  "kids", "coffee", "gaming", "eco", "artisan"
];

async function main() {
  console.log("Reading 150 Niche PDP sections and 15 preview templates...");
  
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

  // Read all pdp-*.liquid files
  const sectionsDir = path.join(process.cwd(), "dev-theme-peri", "sections");
  const sectionFiles = fs.readdirSync(sectionsDir).filter(f => f.startsWith("pdp-") && f.endsWith(".liquid"));

  for (const file of sectionFiles) {
    const content = fs.readFileSync(path.join(sectionsDir, file), "utf-8");
    filesToUpload[`sections/${file}`] = content;
  }

  // Read 15 niche preview templates
  const templatesDir = path.join(process.cwd(), "dev-theme-peri", "templates");
  allNiches.forEach(niche => {
    const tmpl = `page.pdp-${niche}-preview.json`;
    if (fs.existsSync(path.join(templatesDir, tmpl))) {
      filesToUpload[`templates/${tmpl}`] = fs.readFileSync(path.join(templatesDir, tmpl), "utf-8");
    }
  });

  console.log(`Uploading ${Object.keys(filesToUpload).length} files to Shopify theme ${themeId}...`);
  await upsertThemeFilesBatched(shop, themeId, filesToUpload);

  // Now create/update Shopify Page resources for all 15 niches
  console.log("\nCreating 15 Shopify Page entries for Niche PDP Preview URLs...");
  const existingPages = await restRequest(shop.shopDomain, shop.accessToken, "GET", "pages.json");

  for (const niche of allNiches) {
    const handle = `pdp-${niche}-preview`;
    const template_suffix = `pdp-${niche}-preview`;
    const title = `${niche.toUpperCase()} PDP Suite (10 Designs)`;

    const found = existingPages.pages?.find((p: any) => p.handle === handle);
    if (found) {
      console.log(`Page '${handle}' exists. Updating template suffix...`);
      await restRequest(shop.shopDomain, shop.accessToken, "PUT", `pages/${found.id}.json`, {
        page: { id: found.id, template_suffix }
      });
    } else {
      console.log(`Creating page '${handle}'...`);
      await restRequest(shop.shopDomain, shop.accessToken, "POST", "pages.json", {
        page: { title, handle, template_suffix, body_html: "" }
      });
    }
  }

  console.log("\n=======================================================");
  console.log("SUCCESS! All 150 PDP Sections & 15 Niche Preview Pages uploaded to Shopify.");
  console.log(`Theme ID: ${themeId}`);
  console.log("=======================================================");
}

main().catch(console.error);
