import { Worker } from "bullmq";
import { redis } from "../redis.server";
import prisma from "../../db.server";
import { installTheme, patchSettings, publishTheme } from "../theme-engine/index";
import { importCatalog } from "./catalog.server";
import { createNavigationAndPages } from "./navigation.server";
import { trackEvent } from "../posthog.server";
import { sendEmail } from "../resend.server";

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
        trackEvent(shop.shopDomain, "Store Generation Started", { nicheId: gen.nicheId });
        await updateStatus("INSTALLING_THEME", "Downloading and installing base theme...");
        const installRes: any = await installTheme(shop, niche.themeZipUrl, `StoreForge ${niche.name}`);
        const themeId: string = typeof installRes === "string" ? installRes : installRes?.themeId;
        
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
        
        // TODO: S3.5 Screenshot - Call screenshot service to capture the homepage
        // const screenshotUrl = await captureScreenshot(`https://${shop.shopDomain}?preview_theme_id=${themeId}`);
        
        await prisma.storeGeneration.update({
          where: { id: generationId },
          data: {
            status: "DONE",
            completedAt: new Date(),
            log: [...(gen.log as any[]), { time: new Date().toISOString(), msg: "Generation completed successfully!" }]
          }
        });

        trackEvent(shop.shopDomain, "Store Generation Completed", { nicheId: gen.nicheId, themeId });

        if (shop.email) {
          await sendEmail({
            to: shop.email,
            subject: "Your StoreForge generation is complete! 🎉",
            html: `<p>Your store generation for the <strong>${niche.name}</strong> niche is complete.</p><p>Check it out in your Shopify Admin!</p>`,
            text: `Your store generation for the ${niche.name} niche is complete. Check it out in your Shopify Admin!`
          }).catch(console.error);
        }

      } catch (error: any) {
        await prisma.storeGeneration.update({
          where: { id: generationId },
          data: {
            status: "FAILED",
            error: { message: error.message, stack: error.stack },
            log: [...(gen.log as any[]), { time: new Date().toISOString(), msg: `FAILED: ${error.message}` }]
          }
        });

        trackEvent(shop.shopDomain, "Store Generation Failed", { 
          nicheId: gen.nicheId, 
          error: error.message 
        });

        if (shop.email) {
          await sendEmail({
            to: shop.email,
            subject: "StoreForge generation failed ❌",
            html: `<p>Unfortunately, your store generation failed.</p><p>Error: ${error.message}</p><p>Please try again or contact support.</p>`,
            text: `Unfortunately, your store generation failed. Error: ${error.message}. Please try again or contact support.`
          }).catch(console.error);
        }

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
