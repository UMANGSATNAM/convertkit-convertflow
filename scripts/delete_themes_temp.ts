import prisma from "../app/db.server.js";

async function deleteOldThemes() {
  const shop = await prisma.shop.findFirst({ where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" } });
  if (!shop) throw new Error("Shop not found");
  
  const oldThemeIds = [162813706469, 162818752741, 162820325605, 162683617509];
  
  for (const id of oldThemeIds) {
    console.log(`Deleting theme ${id}...`);
    const response = await fetch(`https://${shop.shopDomain}/admin/api/2024-01/themes/${id}.json`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shop.accessToken || ""
      }
    });
    if (!response.ok) {
      console.warn(`Failed to delete theme ${id}: ${response.statusText}`);
    } else {
      console.log(`Successfully deleted theme ${id}`);
    }
  }
}

deleteOldThemes().catch(console.error);
