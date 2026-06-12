import { Worker, Queue } from "bullmq";
import { redis } from "../redis.server";
import prisma from "../../db.server";
import { writeTemplate, restoreSnapshot } from "../theme-engine/index";
import { campaignTemplates } from "../campaigns.server";

export const campaignsQueue = new Queue("campaigns", { connection: redis as any });

let campaignWorker: Worker | undefined;

export function initCampaignWorker() {
  if (campaignWorker) return;

  campaignWorker = new Worker(
    "campaigns",
    async (job) => {
      const { type, campaignId } = job.data;
      
      const campaign = await prisma.campaignPage.findUnique({
        where: { id: campaignId },
        include: { shop: true }
      });

      if (!campaign) throw new Error(`Campaign not found: ${campaignId}`);
      const shop = campaign.shop;

      if (type === "apply-campaign") {
        console.log(`Applying campaign: ${campaign.title} for ${shop.shopDomain}`);
        
        const templateData = campaignTemplates[campaign.templateKey];
        if (!templateData) throw new Error("Invalid campaign template key");

        // Overwrite the homepage index.json with the campaign template
        // writeTemplate takes a snapshot of the existing template automatically
        const { snapshotId } = await writeTemplate(shop, "active", "templates/index.json", templateData.json, "CAMPAIGN");
        
        await prisma.campaignPage.update({
          where: { id: campaign.id },
          data: { 
            status: "PUBLISHED", 
            publishedAt: new Date(),
            themeTemplate: snapshotId // store the snapshot ID so we can restore it later
          }
        });

      } else if (type === "revert-campaign") {
        console.log(`Reverting campaign: ${campaign.title} for ${shop.shopDomain}`);
        
        // Find the snapshot that was taken when the campaign was applied
        if (!campaign.themeTemplate) throw new Error("No snapshot ID found to revert to");
        
        const snapshot = await prisma.themeSnapshot.findUnique({
          where: { id: campaign.themeTemplate }
        });

        if (!snapshot) throw new Error("Snapshot not found");

        // Restore it
        await restoreSnapshot(shop, "active", "templates/index.json", snapshot.r2Key);

        await prisma.campaignPage.update({
          where: { id: campaign.id },
          data: { 
            status: "ARCHIVED", 
            archivedAt: new Date()
          }
        });
      }
    },
    { connection: redis as any }
  );

  console.log("🛠️  Campaign Worker initialized.");
}

// Auto-start the worker if we are not in a purely test environment
if (process.env.NODE_ENV !== "test") {
  initCampaignWorker();
}
