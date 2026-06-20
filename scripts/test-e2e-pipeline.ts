import "dotenv/config";
import { Queue, Worker } from "bullmq";
import { redis } from "../app/services/redis.server.js";
import prisma from "../app/db.server.js";
import { initGeneratorWorker } from "../app/services/generator/pipeline.server.js";

async function runE2E() {
  console.log("Starting End-to-End Test for StoreForge Generator...");

  // 1. Find or create a shop
  // 1. Find the real shop
  const shop = await prisma.shop.findFirst({
    where: { shopDomain: "uwyhex-nb.myshopify.com" }
  });

  if (!shop || !shop.accessToken) {
    throw new Error("Could not find the real shop uwyhex-nb.myshopify.com with a valid access token in the DB");
  }
  
  // 2. Find or create a niche
  let niche = await prisma.niche.findFirst({ where: { id: "test-niche" } });
  if (!niche) {
    niche = await prisma.niche.create({
      data: {
        id: "test-niche",
        name: "Test Niche",
        nameHi: "Test Niche Hi",
        themeZipUrl: "https://raw.githubusercontent.com/UMANGSATNAM/convertkit-convertflow/main/public/blank-theme.zip",
        themeVersion: "1.0.0",
        previewImages: [],
        demoStoreUrl: "",
        demoCatalogUrl: "",
        pagesPreset: {},
        menusPreset: {},
        settingsBase: {},
        palettePresets: {},
        fontPairs: {},
        campaignFit: {},
        active: true,
      }
    });
  }

  // 3. Create a StoreGeneration record
  const gen = await prisma.storeGeneration.create({
    data: {
      shopId: shop.id,
      nicheId: niche.id,
      catalogMode: "EMPTY",
      status: "QUEUED",
      aiPayload: {
        // Mocking a payload with logoBase64 to test BrandExtractionService
        logoBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        business: {
          name: "E2E Test Store",
          industry: "Fashion",
          valueProposition: "Testing the pipeline"
        }
      }
    }
  });

  console.log(`Created generation record: ${gen.id}`);

  // 4. Initialize the generator worker (this attaches it to BullMQ)
  initGeneratorWorker();

  // 5. Add job to Queue
  const generatorQueue = new Queue("generator", { connection: redis as any });
  await generatorQueue.add("generate-store", { generationId: gen.id });
  
  console.log("Job added to queue. Waiting for pipeline to execute...");

  // Wait for the pipeline to finish by polling the DB
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      const current = await prisma.storeGeneration.findUnique({ where: { id: gen.id } });
      if (current?.status === "DONE" || current?.status === "FAILED") {
        clearInterval(interval);
        console.log(`\n--- PIPELINE FINISHED WITH STATUS: ${current.status} ---`);
        
        // Print the logs
        const logs = current.log as any[];
        logs.forEach(l => console.log(`[${l.time}] ${l.msg}`));
        
        if (current.status === "DONE") {
          resolve("SUCCESS");
        } else {
          console.error("\nError Details:", current.error);
          reject(new Error("Pipeline failed."));
        }
      } else {
        process.stdout.write(".");
      }
    }, 2000);
  });
}

runE2E().then(() => {
  console.log("\n✅ E2E Test Completed Successfully!");
  process.exit(0);
}).catch(err => {
  console.error("\n❌ E2E Test Failed!", err);
  process.exit(1);
});
