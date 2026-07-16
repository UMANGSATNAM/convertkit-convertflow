import { restRequest } from "./app/services/shopify-api.server.js";
import prisma from "./app/db.server.js";

async function main() {
  const shop = await prisma.shop.findFirst({ where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" } });
  if (!shop) throw new Error("no shop");

  const data = await restRequest(shop.shopDomain, shop.accessToken, "GET", "themes.json");
  const themes = data.themes.filter(t => t.role !== "main");
  console.log(`Found ${themes.length} unpublished themes to delete.`);
  for (const t of themes) {
    try {
      await restRequest(shop.shopDomain, shop.accessToken, "DELETE", `themes/${t.id}.json`);
      console.log(`Deleted ${t.id}`);
    } catch (e) {
      console.log(`Failed to delete ${t.id}: ${e.message}`);
    }
  }
}
main().catch(console.error);
