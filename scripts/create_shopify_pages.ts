import prisma from "../app/db.server.js";
import { restRequest } from "../app/services/shopify-api.server.js";

async function main() {
  console.log("Checking and creating Shopify pages...");
  
  const shop = await prisma.shop.findFirst({
    where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" }
  });
  if (!shop) throw new Error("Shop not found");

  const pagesToCreate = [
    { title: "Offers Preview 1", handle: "offers-preview", template_suffix: "offers-preview" },
    { title: "Offers Preview 2", handle: "offers-preview-2", template_suffix: "offers-preview-2" },
    { title: "Offers Preview 3", handle: "offers-preview-3", template_suffix: "offers-preview-3" }
  ];

  // Fetch existing pages
  const existingPages = await restRequest(shop.shopDomain, shop.accessToken, "GET", "pages.json");
  console.log(`Existing pages count: ${existingPages.pages?.length || 0}`);

  for (const item of pagesToCreate) {
    const found = existingPages.pages?.find((p: any) => p.handle === item.handle);
    if (found) {
      console.log(`Page '${item.handle}' exists (ID: ${found.id}). Updating template suffix to '${item.template_suffix}'...`);
      await restRequest(shop.shopDomain, shop.accessToken, "PUT", `pages/${found.id}.json`, {
        page: {
          id: found.id,
          template_suffix: item.template_suffix
        }
      });
    } else {
      console.log(`Creating page '${item.handle}' with template suffix '${item.template_suffix}'...`);
      await restRequest(shop.shopDomain, shop.accessToken, "POST", "pages.json", {
        page: {
          title: item.title,
          handle: item.handle,
          template_suffix: item.template_suffix,
          body_html: ""
        }
      });
    }
  }

  console.log("\n=======================================================");
  console.log("SUCCESS! All 3 Shopify pages created and linked to template suffixes.");
  console.log("=======================================================");
}

main().catch(console.error);
