import prisma from "../app/db.server.js";

async function checkThemes() {
  const shop = await prisma.shop.findFirst({ where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" } });
  if (!shop) throw new Error("Shop not found");
  
  const response = await fetch(`https://${shop.shopDomain}/admin/api/2024-01/themes.json`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": shop.accessToken || ""
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch themes: ${response.statusText}`);
  }
  
  const themes = await response.json();
  console.log("Themes:");
  themes.themes.forEach((t: any) => console.log(`ID: ${t.id} | Role: ${t.role} | Name: ${t.name}`));
}

checkThemes().catch(console.error);
