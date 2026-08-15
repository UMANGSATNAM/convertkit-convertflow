import prisma from "../app/db.server.js";
import fs from "fs";
import path from "path";

async function main() {
  try {
    const shop = await prisma.shop.findFirst({
      where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" }
    });
    if (!shop) throw new Error("Shop not found");

    // We know the product ID from GraphQL is gid://shopify/Product/9701588467941
    // The REST ID is just 9701588467941
    const productId = "9701588467941";
    
    // Read the local asset
    const imagePath = path.join(process.cwd(), "dev-theme-peri", "assets", "placeholder-beauty-hero-1.jpg");
    const base64Image = fs.readFileSync(imagePath).toString("base64");

    console.log("Uploading via REST API...");
    const response = await fetch(`https://${shop.shopDomain}/admin/api/2024-01/products/${productId}/images.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shop.accessToken
      },
      body: JSON.stringify({
        image: {
          attachment: base64Image,
          filename: "aurelle-serum.jpg"
        }
      })
    });

    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
    
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
