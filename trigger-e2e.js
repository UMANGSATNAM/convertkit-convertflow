import { Queue } from "bullmq";
import Redis from "ioredis";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

async function main() {
  console.log("Starting DB connection...");
  let shop = await prisma.shop.findFirst();
  if (!shop) {
    console.log("No shop found, creating dummy shop...");
    shop = await prisma.shop.create({
      data: {
        shopDomain: "e2e-test-store.myshopify.com",
        accessToken: "dummy-token",
        plan: "PRO"
      }
    });
  }

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

  const gen = await prisma.storeGeneration.create({
    data: {
      shopId: shop.id,
      nicheId: niche.id,
      catalogMode: "EMPTY",
      status: "QUEUED",
      aiPayload: {
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

  const generatorQueue = new Queue("generator", { connection: redis });
  await generatorQueue.add("generate-store", { generationId: gen.id });
  
  console.log("Job added to queue successfully! If the worker is running, it will process it.");
  process.exit(0);
}

main().catch(console.error);
