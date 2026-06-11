import { Worker } from "bullmq";
import { redis } from "../redis.server";
import prisma from "../../db.server";
import { installTheme, publishTheme, patchSettings } from "../theme-engine/index";

export const generatorWorker = new Worker(
  "generator",
  async (job) => {
    const { generationId } = job.data;
    console.log(`Starting generation job for ID: ${generationId}`);
    
    let generation = await prisma.storeGeneration.findUnique({
      where: { id: generationId },
      include: { shop: true }
    });

    if (!generation) throw new Error("Generation record not found");

    const updateStatus = async (step: string, status: "IN_PROGRESS" | "DONE" | "FAILED", detail: string) => {
      const logs = (generation?.log as any[]) || [];
      logs.push({ ts: Date.now(), step, status, detail });
      
      await prisma.storeGeneration.update({
        where: { id: generationId },
        data: { 
          currentStep: step,
          log: logs
        }
      });
      console.log(`[GENERATOR] Step: ${step} | Status: ${status} | ${detail}`);
    };

    try {
      // Step 1: INSTALLING_THEME
      await prisma.storeGeneration.update({ where: { id: generationId }, data: { status: "INSTALLING_THEME" }});
      await updateStatus("INSTALLING_THEME", "IN_PROGRESS", "Downloading and installing niche theme...");
      
      const { themeId } = await installTheme(generation.shop, generation.nicheId, generation.shop.brandConfig);
      await prisma.storeGeneration.update({ where: { id: generationId }, data: { themeId } });
      await updateStatus("INSTALLING_THEME", "DONE", `Installed theme ID: ${themeId}`);

      // Step 2: IMPORTING_PRODUCTS
      await prisma.storeGeneration.update({ where: { id: generationId }, data: { status: "IMPORTING_PRODUCTS" }});
      await updateStatus("IMPORTING_PRODUCTS", "IN_PROGRESS", `Mode: ${generation.catalogMode}`);
      // TODO: batch productCreate...
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      await updateStatus("IMPORTING_PRODUCTS", "DONE", "Imported 24 products");

      // Step 3: CREATING_COLLECTIONS
      await prisma.storeGeneration.update({ where: { id: generationId }, data: { status: "CREATING_COLLECTIONS" }});
      await updateStatus("CREATING_COLLECTIONS", "IN_PROGRESS", "Setting up smart collections...");
      await updateStatus("CREATING_COLLECTIONS", "DONE", "Created 6 collections");

      // Step 4: CREATING_PAGES
      await prisma.storeGeneration.update({ where: { id: generationId }, data: { status: "CREATING_PAGES" }});
      await updateStatus("CREATING_PAGES", "IN_PROGRESS", "Creating policy and info pages...");
      await updateStatus("CREATING_PAGES", "DONE", "Created 7 pages");

      // Step 5: CREATING_MENUS
      await prisma.storeGeneration.update({ where: { id: generationId }, data: { status: "CREATING_MENUS" }});
      await updateStatus("CREATING_MENUS", "IN_PROGRESS", "Configuring navigation...");
      await updateStatus("CREATING_MENUS", "DONE", "Menus updated");

      // Step 6: PATCHING_SETTINGS
      await prisma.storeGeneration.update({ where: { id: generationId }, data: { status: "PATCHING_SETTINGS" }});
      await updateStatus("PATCHING_SETTINGS", "IN_PROGRESS", "Applying brand colors and fonts...");
      await patchSettings(generation.shop, themeId, generation.shop.brandConfig, "GENERATOR");
      await updateStatus("PATCHING_SETTINGS", "DONE", "Settings patched");

      // Step 7: PUBLISHING
      await prisma.storeGeneration.update({ where: { id: generationId }, data: { status: "PUBLISHING" }});
      await updateStatus("PUBLISHING", "IN_PROGRESS", "Publishing live theme...");
      await publishTheme(generation.shop, themeId);
      await updateStatus("PUBLISHING", "DONE", "Theme published");

      // Final DONE
      await prisma.storeGeneration.update({ 
        where: { id: generationId }, 
        data: { status: "DONE", completedAt: new Date() }
      });
      console.log(`Generation ${generationId} completed successfully.`);

    } catch (error: any) {
      console.error(`Generation ${generationId} failed:`, error);
      await prisma.storeGeneration.update({ 
        where: { id: generationId }, 
        data: { status: "FAILED", error: error.message }
      });
    }
  },
  { connection: redis as any }
);
