import { Queue } from "bullmq";
import { redis } from "./app/redis.server.js";
import prisma from "./app/db.server.js";

async function main() {
  const shop = await prisma.shop.findFirst({ where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" } });
  if (!shop) throw new Error("no shop");

  // get a recent generation id
  const recentGen = await prisma.storeGeneration.findFirst({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" }
  });
  if (!recentGen) throw new Error("no generation found");

  console.log(`Triggering new generation based on: ${recentGen.id}`);
  
  // Create a new generation record
  const newGen = await prisma.storeGeneration.create({
    data: {
      shopId: shop.id,
      nicheId: recentGen.nicheId,
      catalogMode: recentGen.catalogMode,
      aiPayload: recentGen.aiPayload || {},
      status: "PENDING",
      log: []
    }
  });

  const queue = new Queue("generator-local", { connection: redis as any });
  await queue.add("generate", { generationId: newGen.id });
  console.log(`Job added to queue! New Generation ID: ${newGen.id}`);
  
  // Wait a bit and check status
  let attempts = 0;
  while(attempts < 60) {
    await new Promise(r => setTimeout(r, 2000));
    const g = await prisma.storeGeneration.findUnique({ where: { id: newGen.id } });
    console.log(`Status: ${g?.status}`);
    if (g?.status === "DONE" || g?.status === "FAILED") {
       console.log(`Finished with status: ${g.status}`);
       if (g.themeId) {
         console.log(`Preview URL: https://${shop.shopDomain}?preview_theme_id=${g.themeId}`);
       }
       if (g.error) {
         console.error("Error:", g.error);
       }
       break;
    }
    attempts++;
  }
  process.exit(0);
}
main().catch(console.error);
