import prisma from "./app/db.server.js";
import { initGeneratorWorker } from "./app/services/generator/pipeline.server.js";
import { Queue } from "bullmq";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

async function manual() {
  const shop = await prisma.shop.findFirst({ where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" } });
  if (!shop) throw new Error("no shop");

  const recentGen = await prisma.storeGeneration.findFirst({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" }
  });
  
  if (!recentGen) throw new Error("no generation found");
  
  console.log(`Setting up worker...`);
  initGeneratorWorker();
  
  const newGen = await prisma.storeGeneration.create({
    data: {
      shopId: shop.id,
      nicheId: recentGen.nicheId,
      catalogMode: recentGen.catalogMode,
      aiPayload: {
        logoBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        business: { name: "Test", industry: "jewellery", valueProposition: "Testing" }
      },
      status: "QUEUED",
      log: []
    }
  });
  
  console.log(`Adding to queue... generationId: ${newGen.id}`);
  const queue = new Queue("generator-local", { connection: redis as any });
  await queue.add("generate", { generationId: newGen.id });
  
  console.log(`Waiting for worker to process...`);
  let attempts = 0;
  while(attempts < 120) {
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

manual().catch(console.error);
