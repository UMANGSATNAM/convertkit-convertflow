import prisma from "./app/db.server.js";
import { restRequest } from "./app/services/shopify-api.server.js";

async function main() {
  const shop = await prisma.shop.findFirst({ where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" } });
  if (!shop) throw new Error("no shop");

  console.log(`Found shop: ${shop.shopDomain}`);
  
  try {
    const data = await restRequest(shop.shopDomain, shop.accessToken, "GET", "themes.json");
    console.log(`Total themes: ${data.themes.length}`);
    for (const theme of data.themes) {
      console.log(`- ID: ${theme.id} | Name: ${theme.name} | Role: ${theme.role} | Created: ${theme.created_at}`);
    }
  } catch (err: any) {
    console.error("Error fetching themes:", err.message);
  }
}

main().catch(console.error);
