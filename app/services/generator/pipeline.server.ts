import { Worker } from "bullmq";
import { redis } from "../redis.server";
import { prisma } from "../../db.server";
import { installTheme, patchSettings, publishTheme } from "../theme-engine/index";
import { importCatalog } from "./catalog.server";
import { createNavigationAndPages } from "./navigation.server";

// Keep track of the worker instance
let generatorWorker: Worker | undefined;

export function initGeneratorWorker() {
  if (generatorWorker) return;

  generatorWorker = new Worker(
    "generator",
    async (job) => {
      const { generationId } = job.data;
      const gen = await prisma.storeGeneration.findUnique({
        where: { id: generationId },
        include: { shop: true }
      });

      if (!gen) throw new Error("Generation record not found");
      const shop = gen.shop;

      try {
        const updateStatus = async (status: any, logMsg: string) => {
          const currentLog = gen.log as any[];
          await prisma.storeGeneration.update({
            where: { id: generationId },
            data: {
              status,
              log: [...currentLog, { time: new Date().toISOString(), msg: logMsg }]
            }
          });
        };

        const niche = await prisma.niche.findUnique({ where: { id: gen.nicheId } });
        if (!niche) throw new Error("Niche not found");

        // 1. INSTALLING_THEME
        await updateStatus("INSTALLING_THEME", "Downloading and installing base theme...");
        const themeId = await installTheme(shop, niche.themeZipUrl, `StoreForge ${niche.name}`);
        
        await prisma.storeGeneration.update({
          where: { id: generationId },
          data: { themeId }
        });

        // 2. IMPORTING_PRODUCTS & CREATING_COLLECTIONS
        await updateStatus("IMPORTING_PRODUCTS", "Importing demo products and collections...");
        if (gen.catalogMode === "DEMO") {
          await importCatalog(shop, niche.demoCatalogUrl);
        }
        
        // 3. CREATING_PAGES & CREATING_MENUS
        await updateStatus("CREATING_PAGES", "Creating pages and navigation menus...");
        await createNavigationAndPages(shop, niche);

        // 4. PATCHING_SETTINGS
        await updateStatus("PATCHING_SETTINGS", "Applying brand colors and typography...");
        await patchSettings(shop, themeId, niche.settingsBase as any);

        // 5. PUBLISHING
        await updateStatus("PUBLISHING", "Publishing final storefront...");
        await publishTheme(shop, themeId);

        // 6. DONE
        await prisma.storeGeneration.update({
          where: { id: generationId },
          data: {
            status: "DONE",
            completedAt: new Date(),
            log: [...(gen.log as any[]), { time: new Date().toISOString(), msg: "Generation completed successfully!" }]
          }
        });

      } catch (error: any) {
        await prisma.storeGeneration.update({
          where: { id: generationId },
          data: {
            status: "FAILED",
            error: { message: error.message, stack: error.stack },
            log: [...(gen.log as any[]), { time: new Date().toISOString(), msg: `FAILED: ${error.message}` }]
          }
        });
        throw error;
      }
    },
    { connection: redis as any }
  );

  console.log("🛠️  Store Generator Worker initialized.");
}

// Auto-start the worker if we are not in a purely test environment
if (process.env.NODE_ENV !== "test") {
  initGeneratorWorker();
}
