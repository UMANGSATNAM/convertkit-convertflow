import { Worker } from "bullmq";
import { redis } from "./redis.server";
import prisma from "../db.server";

let webhookWorker: Worker;

if (process.env.NODE_ENV === "production" || !(global as any).__webhookWorker) {
  webhookWorker = new Worker(
    "webhooks",
    async (job) => {
      const { topic, shop, payload, webhookId } = job.data;
      console.log(`[Webhook Worker] Processing ${topic} for ${shop} (Job: ${job.id})`);

      try {
        switch (topic) {
          case "APP_UNINSTALLED":
          case "SHOP_REDACT":
            console.log(`[Webhook Worker] Redacting shop: ${shop}`);
            await prisma.shop.deleteMany({
              where: { shopDomain: shop },
            });
            break;

          case "CUSTOMERS_DATA_REQUEST":
            console.log(`[Webhook Worker] Customer data request for ${shop}: ${payload?.customer?.id}`);
            // We don't store PII, nothing to export
            break;

          case "CUSTOMERS_REDACT":
            console.log(`[Webhook Worker] Customer redact request for ${shop}: ${payload?.customer?.id}`);
            // We don't store PII, nothing to redact
            break;

          default:
            console.log(`[Webhook Worker] Unhandled topic: ${topic}`);
            break;
        }
      } catch (error) {
        console.error(`[Webhook Worker] Error processing ${topic}:`, error);
        throw error;
      }
    },
    { connection: redis as any, concurrency: 5 }
  );

  webhookWorker.on("completed", (job) => {
    console.log(`[Webhook Worker] Job ${job.id} completed.`);
  });

  webhookWorker.on("failed", (job, err) => {
    console.error(`[Webhook Worker] Job ${job?.id} failed:`, err);
  });

  if (process.env.NODE_ENV !== "production") {
    (global as any).__webhookWorker = webhookWorker;
  }
} else {
  webhookWorker = (global as any).__webhookWorker;
}

export { webhookWorker };
