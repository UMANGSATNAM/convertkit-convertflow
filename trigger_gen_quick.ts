import { Queue } from "bullmq";
import { PrismaClient } from "@prisma/client";
import IORedis from "ioredis";

const prisma = new PrismaClient();
const redis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");

async function main() {
  const shop = await prisma.shop.findFirst({ where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" } });
  if (!shop) throw new Error("no shop");

  const recentGen = await prisma.storeGeneration.findFirst({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" }
  });

  const newGen = await prisma.storeGeneration.create({
    data: {
      shopId: shop.id,
      nicheId: recentGen.nicheId,
      catalogMode: recentGen.catalogMode,
      aiPayload: recentGen.aiPayload || {},
      status: "QUEUED",
      log: []
    }
  });

  const queue = new Queue("generator-local", { connection: redis });
  await queue.add("generate", { generationId: newGen.id });
  console.log(`Job added to queue! New Generation ID: ${newGen.id}`);
  
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
       break;
    }
    attempts++;
  }
  process.exit(0);
}
main().catch(console.error);
