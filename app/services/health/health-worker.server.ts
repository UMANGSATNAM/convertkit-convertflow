import { Worker, Queue } from "bullmq";
import { redis } from "../redis.server";
import prisma from "../../db.server";

export const healthQueue = new Queue("health", { connection: redis as any });

// Setup a weekly cron job
healthQueue.add("weekly-health-scan", {}, { 
  repeat: { pattern: "0 0 * * 0" } // Every Sunday at midnight
});

export const healthWorker = new Worker(
  "health",
  async (job) => {
    if (job.name === "weekly-health-scan") {
      console.log("[CRON] Running weekly health scan for all active stores...");
      
      const shops = await prisma.shop.findMany({ 
        where: { uninstalledAt: null }
      });

      for (const shop of shops) {
        console.log(`[CRON] Scanning shop: ${shop.shopDomain}`);
        // We would call runHealthScan here.
        // For PRO plan, we would automatically call applyHealthFix for specific issues.
        if (shop.plan === "PRO") {
           console.log(`[CRON] Auto-fixing heavy images and alt tags for PRO shop: ${shop.shopDomain}`);
        }
      }
    }
  },
  { connection: redis as any }
);
