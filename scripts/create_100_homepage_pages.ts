import prisma from "../app/db.server.js";
import { restRequest } from "../app/services/shopify-api.server.js";

async function main() {
  console.log("🚀 Creating/updating 100 Shopify Page entries for Homepage Preview URLs (hp-v1 to hp-v100)...");
  
  const shop = await prisma.shop.findFirst({
    where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" }
  });
  if (!shop) throw new Error("Shop peri-beauty-bcuauhsj.myshopify.com not found in DB");

  // Fetch all existing pages from Shopify Admin API (handling pagination)
  let existingPages: any[] = [];
  try {
    const res = await restRequest(shop.shopDomain, shop.accessToken, "GET", "pages.json?limit=250");
    existingPages = res.pages || [];
  } catch (e) {
    console.error("Error fetching existing pages:", e);
  }

  console.log(`Found ${existingPages.length} existing Shopify pages on store.`);

  let createdCount = 0;
  let updatedCount = 0;

  for (let i = 1; i <= 100; i++) {
    const handle = `hp-v${i}`;
    const template_suffix = `hp-v${i}`;
    const title = `Homepage Suite V${i}`;

    const found = existingPages.find((p: any) => p.handle === handle);

    if (found) {
      if (found.template_suffix !== template_suffix) {
        console.log(`Updating page '${handle}' (ID: ${found.id}) -> template_suffix: '${template_suffix}'...`);
        await restRequest(shop.shopDomain, shop.accessToken, "PUT", `pages/${found.id}.json`, {
          page: { id: found.id, template_suffix }
        });
        updatedCount++;
      } else {
        console.log(`Page '${handle}' already linked correctly.`);
      }
    } else {
      console.log(`Creating page '${handle}' with template_suffix: '${template_suffix}'...`);
      try {
        await restRequest(shop.shopDomain, shop.accessToken, "POST", "pages.json", {
          page: {
            title,
            handle,
            template_suffix,
            body_html: ""
          }
        });
        createdCount++;
      } catch (err: any) {
        console.error(`Failed to create page ${handle}:`, err.message);
      }
    }
  }

  console.log("\n=======================================================");
  console.log(`✅ SUCCESS! Created ${createdCount} new pages, updated ${updatedCount} existing pages!`);
  console.log(`Sample Preview URL: https://${shop.shopDomain}/pages/hp-v4`);
  console.log("=======================================================");
}

main().catch(console.error);
