import { Queue, Worker } from "bullmq";
import { redis } from "./redis.server";
import { sendWhatsappMessage } from "../services/integrations/whatsapp.server";
import prisma from "../db.server";

// Generic Background Jobs Queue
export const backgroundJobsQueue = new Queue("background-jobs", {
  connection: redis as any,
});

// Webhooks Queue
export const webhooksQueue = new Queue("webhooks", {
  connection: redis as any,
});

// WhatsApp Jobs Queue
export const whatsappQueue = new Queue("whatsapp-jobs", {
  connection: redis as any,
});

// Create workers if needed
const backgroundJobsWorker = new Worker(
  "background-jobs",
  async (job) => {
    console.log(`Processing background job ${job.id} of type ${job.name}`);
  },
  { connection: redis as any }
);

const webhooksWorker = new Worker(
  "webhooks",
  async (job) => {
    console.log(`Processing webhook job ${job.id} of type ${job.name}`);
  },
  { connection: redis as any }
);

const whatsappWorker = new Worker(
  "whatsapp-jobs",
  async (job) => {
    console.log(`Processing WhatsApp job ${job.id} of type ${job.name}`);
    
    if (job.name === "abandoned_cart_recovery") {
      const { cartId, stage } = job.data;
      
      const cart = await prisma.abandonedCart.findUnique({
        where: { id: cartId },
        include: { merchant: true }
      });
      
      if (!cart || cart.recovered) {
        console.log(`Cart ${cartId} is already recovered or not found.`);
        return;
      }
      
      if (!cart.customerPhone) {
        console.log(`Cart ${cartId} has no phone number.`);
        return;
      }
      
      let templateName = "";
      let delayForNextStage = 0;
      
      if (stage === 1) {
        templateName = "abandoned_cart_15m";
        delayForNextStage = 2 * 60 * 60 * 1000; // 2 hours
      } else if (stage === 2) {
        templateName = "abandoned_cart_2h";
        delayForNextStage = 22 * 60 * 60 * 1000; // 22 hours (making it 24h total)
      } else if (stage === 3) {
        templateName = "abandoned_cart_24h";
        // Final stage, no more delays
      }
      
      if (templateName) {
        try {
          const checkoutUrl = `https://${cart.merchant.shopDomain}/cart/${cart.shopifyCheckoutToken}`;
          // In a real scenario, this checkout URL would be constructed directly from Shopify's checkout URL stored in DB
          
          await sendWhatsappMessage(
            cart.merchantId,
            cart.customerPhone,
            templateName,
            "en",
            [
              {
                type: "body",
                parameters: [
                  { type: "text", text: cart.cartTotal.toString() }
                ]
              },
              {
                type: "button",
                sub_type: "url",
                index: "0",
                parameters: [
                  { type: "text", text: `cart/${cart.shopifyCheckoutToken}` } // Depending on template configuration
                ]
              }
            ]
          );
          
          // Update the cart recovery stage
          await prisma.abandonedCart.update({
            where: { id: cart.id },
            data: { 
              recoveryStage: stage,
              lastMessageSentAt: new Date()
            }
          });
          
          // Schedule next stage if needed
          if (stage < 3) {
            await whatsappQueue.add(
              "abandoned_cart_recovery",
              { cartId: cart.id, stage: stage + 1 },
              { delay: delayForNextStage }
            );
          }
          
        } catch (error) {
          console.error(`Failed to process abandoned cart ${cartId} stage ${stage}:`, error);
        }
      }
    }
  },
  { connection: redis as any }
);

whatsappWorker.on("completed", (job) => {
  console.log(`WhatsApp Job ${job.id} completed!`);
});

whatsappWorker.on("failed", (job, err) => {
  console.error(`WhatsApp Job ${job?.id} failed with ${err.message}`);
});
