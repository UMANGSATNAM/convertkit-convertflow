import prisma from "../app/db.server.js";
import fs from "fs";

async function getIndexJson() {
  const shop = await prisma.shop.findFirst({ where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" } });
  if (!shop) throw new Error("Shop not found");
  
  const themeId = 162900803813;
  const assetKey = "templates/index.json";
  
  const response = await fetch(`https://${shop.shopDomain}/admin/api/2024-01/themes/${themeId}/assets.json?asset[key]=${assetKey}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": shop.accessToken || ""
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch asset: ${response.statusText}`);
  }
  
  const data = await response.json();
  fs.writeFileSync("live_index_dump.json", JSON.stringify(JSON.parse(data.asset.value), null, 2));
  console.log("Dumped templates/index.json to live_index_dump.json");
}

getIndexJson().catch(console.error);
