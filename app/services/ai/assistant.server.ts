import { Anthropic } from "@anthropic-ai/sdk";
import prisma from "../../db.server";
import { applyHealthFix } from "../health/fixers.server";
import { runHealthScan } from "../health/scanner.server";
import { patchSettings, restoreSnapshot } from "../theme-engine/index";
import { campaignsQueue } from "../generator/campaign-worker.server";
import { authenticate, PLAN_PRO, PLAN_GROWTH, PLAN_ENTERPRISE } from "../../shopify.server";
import { analyzeStoreScreenshot } from "./vision.server";
import { generatorQueue } from "../generator/pipeline.server";

const anthropic = new Anthropic({ 
  apiKey: process.env.ANTHROPIC_API_KEY || "dummy-key" // fallback if not set to avoid crash on boot
});

export const tools = [
  {
    name: "change_theme_colors",
    description: "Update the theme primary or secondary colors.",
    input_schema: {
      type: "object",
      properties: {
        primaryColor: { type: "string", description: "Hex code for primary color e.g. #FF0000" },
        secondaryColor: { type: "string", description: "Hex code for secondary color e.g. #00FF00" }
      }
    }
  },
  {
    name: "change_typography",
    description: "Update the theme fonts.",
    input_schema: {
      type: "object",
      properties: {
        fontFamily: { type: "string", description: "Font family name e.g. 'Inter', 'Roboto'" }
      }
    }
  },
  {
    name: "toggle_toolkit_feature",
    description: "Enable or disable a conversion toolkit feature (e.g. STICKY_ATC, TRUST_BADGES).",
    input_schema: {
      type: "object",
      properties: {
        feature: { type: "string", enum: ["STICKY_ATC", "COUNTDOWN", "ANNOUNCEMENT", "TRUST_BADGES", "SIZE_CHART", "PINCODE", "WHATSAPP", "BUNDLES"] },
        enabled: { type: "boolean" }
      },
      required: ["feature", "enabled"]
    }
  },
  {
    name: "install_library_section",
    description: "Install a section from the StoreForge library to the theme.",
    input_schema: {
      type: "object",
      properties: {
        sectionId: { type: "string", description: "The ID of the section to install e.g. 'hero-1', 'trust-4'" }
      },
      required: ["sectionId"]
    }
  },
  {
    name: "generate_campaign",
    description: "Generate a new campaign page and apply it immediately.",
    input_schema: {
      type: "object",
      properties: {
        templateKey: { type: "string", enum: ["diwali", "eoss", "launch", "wedding", "rakhi", "valentine", "national"] },
        title: { type: "string", description: "Title of the campaign" }
      },
      required: ["templateKey", "title"]
    }
  },
  {
    name: "run_health_scan",
    description: "Run a full store health scan for Performance, SEO, and Compliance.",
    input_schema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "fix_health_issue",
    description: "Automatically fix a specific health issue found during a scan.",
    input_schema: {
      type: "object",
      properties: {
        issueId: { type: "string", description: "The ID of the issue to fix e.g. 'missing-trust-badges'" }
      },
      required: ["issueId"]
    }
  },
  {
    name: "restore_snapshot",
    description: "Restore the theme to a previous state using a snapshot ID.",
    input_schema: {
      type: "object",
      properties: {
        snapshotId: { type: "string" }
      },
      required: ["snapshotId"]
    }
  },
  {
    name: "generate_store_from_context",
    description: "Trigger the AI Store Generation pipeline. Use this when the user has uploaded a screenshot and given the 'okay' to build the store.",
    input_schema: {
      type: "object",
      properties: {
        storeName: { type: "string", description: "The name of the store to generate." },
        visualRequirements: { type: "string", description: "A summary of the layout, sections, colors, and typography requested." }
      },
      required: ["storeName", "visualRequirements"]
    }
  }
];

export async function processUserMessage(request: Request, shopId: string, shopDomain: string, message: string, base64Image: string | null = null, mediaType: string | null = null) {
  console.log(`[AI] Processing message for shop ${shopId}: ${message}`);

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop) throw new Error("Shop not found");

  const { billing } = await authenticate.admin(request);
  const planCheck = await billing.check({
    plans: [PLAN_PRO, PLAN_GROWTH, PLAN_ENTERPRISE],
    isTest: true,
  });
  const hasActivePayment = planCheck.hasActivePayment;

  // 1. Quotas & Guardrails
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentLogs = await prisma.aiActionLog.aggregate({
    where: { shopId, createdAt: { gte: thirtyDaysAgo } },
    _sum: { tokensIn: true, tokensOut: true }
  });
  
  const totalTokens = (recentLogs._sum.tokensIn || 0) + (recentLogs._sum.tokensOut || 0);
  const tokenLimit = hasActivePayment ? 500000 : 10000;

  if (totalTokens > tokenLimit) {
    return {
      text: `⚠️ **Quota Exceeded.** You have used ${totalTokens} tokens this month (Limit: ${tokenLimit}). Please upgrade your plan to continue using the AI Assistant.`,
      toolCalls: []
    };
  }

  // Construct the message array. If we have an image, we pass it as a multimodal block.
  let contentBlocks: any[] = [];
  if (base64Image && mediaType) {
    // We need to validate mediaType is image/jpeg, image/png, image/gif, or image/webp
    let validMediaType = mediaType;
    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(mediaType)) {
      validMediaType = "image/jpeg"; // fallback
    }
    
    contentBlocks.push({
      type: "image",
      source: {
        type: "base64",
        media_type: validMediaType,
        data: base64Image
      }
    });
    
    // TEMPORARY OPTIMIZATION: If they upload an image, extract layout immediately and stash it in context 
    // so we don't have to resend the base64 string on the next turn.
    try {
      const extractedLayout = await analyzeStoreScreenshot(base64Image, validMediaType);
      contentBlocks.push({
        type: "text",
        text: `[SYSTEM CONTEXT: I have analyzed the uploaded image. Here is the JSON structure I extracted. Keep this in mind when I say 'okay' to generate the store: ${JSON.stringify(extractedLayout)}]`
      });
      // Stash this layout in the DB temporarily
      await prisma.storeGeneration.create({
        data: {
          shopId,
          niche: "custom-chatbot",
          status: "pending",
          aiPayload: extractedLayout
        }
      });
    } catch (e) {
      console.error("Failed to pre-analyze image:", e);
    }
  }
  
  if (message.trim()) {
    contentBlocks.push({ type: "text", text: message });
  }

  // Fetch recent generations to find the stashed layout if generate_store_from_context is called without a new image
  const pendingGenerations = await prisma.storeGeneration.findMany({
    where: { shopId, niche: "custom-chatbot", status: "pending" },
    orderBy: { createdAt: 'desc' },
    take: 1
  });

  if (pendingGenerations.length > 0 && !base64Image) {
    // inject a reminder of the stashed layout into the prompt so Claude knows it exists
    contentBlocks.unshift({
      type: "text",
      text: `[SYSTEM CONTEXT: You have a pending store layout extracted from a previous image upload. If the user asks to generate the store, you can call generate_store_from_context.]`
    });
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      system: `You are the StoreForge AI assistant. You help merchants customize their Shopify store, and you can build entire stores from screenshots.
      CRITICAL INSTRUCTIONS:
      1. If the user uploads an image and asks to build a store, acknowledge the design, summarize what you see, and ask for their final confirmation ("Okay") to proceed.
      2. If they give confirmation, call the 'generate_store_from_context' tool.
      3. NEVER output raw Liquid code or CSS in your chat response.
      4. ALWAYS use the provided tools to make changes directly to the store.
      5. Be concise and professional.`,
      messages: [{ role: "user", content: contentBlocks }],
      tools: tools as any
    });

    const textContent = response.content.find((c: any) => c.type === "text") as any;
    const toolCalls = response.content.filter((c: any) => c.type === "tool_use") as any[];

    // Log the request
    await prisma.aiActionLog.create({
      data: {
        shopId,
        prompt: message || "Uploaded Image",
        toolCalls: JSON.stringify(toolCalls.map(tc => ({ name: tc.name, input: tc.input }))),
        applied: toolCalls.length > 0,
        tokensIn: response.usage.input_tokens,
        tokensOut: response.usage.output_tokens
      }
    });

    // Mock themeId for AI actions (since we're interacting directly without explicit theme selection)
    const mockThemeId = "123456789";
    const executedTools = [];

    // Execute tool calls if any
    if (toolCalls.length > 0) {
      for (const call of toolCalls) {
        executedTools.push({ name: call.name, input: call.input });
        
        if (call.name === "change_theme_colors") {
          const { primaryColor, secondaryColor } = call.input;
          const patch: any = {};
          if (primaryColor) patch.colors_solid_button_labels = primaryColor;
          if (secondaryColor) patch.colors_accent_1 = secondaryColor;
          await patchSettings(shopDomain, "active", patch, "AI");
        } 
        else if (call.name === "change_typography") {
          const { fontFamily } = call.input;
          const patch: any = { type_header_family: fontFamily };
          await patchSettings(shopDomain, "active", patch, "AI");
        } 
        else if (call.name === "toggle_toolkit_feature") {
          const { feature, enabled } = call.input;
          await prisma.toolkitFeature.upsert({
            where: { shopId_feature: { shopId, feature } },
            update: { enabled },
            create: { shopId, feature, enabled, config: {} }
          });
        }
        else if (call.name === "install_library_section") {
          const { sectionId } = call.input;
          await prisma.installedSection.create({
            data: { shopId, sectionKey: sectionId, themeId: mockThemeId, addedVia: "AI" }
          });
        }
        else if (call.name === "generate_campaign") {
          const { templateKey, title } = call.input;
          const handle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          const campaign = await prisma.campaignPage.create({
            data: { shopId, templateKey, title, handle, productIds: "[]", offer: "{}" }
          });
          await campaignsQueue.add("apply-campaign", { type: "apply-campaign", campaignId: campaign.id });
        }
        else if (call.name === "run_health_scan") {
          await runHealthScan(request, shopId, shopDomain, "MANUAL");
        }
        else if (call.name === "fix_health_issue") {
          const { issueId } = call.input;
          await applyHealthFix(shopId, shopDomain, mockThemeId, issueId);
        }
        else if (call.name === "restore_snapshot") {
          const { snapshotId } = call.input;
          await restoreSnapshot(shopDomain, snapshotId);
        }
        else if (call.name === "generate_store_from_context") {
          // Find the stashed generation record
          if (pendingGenerations.length > 0) {
            const genId = pendingGenerations[0].id;
            // Update it to trigger the pipeline
            await prisma.storeGeneration.update({
              where: { id: genId },
              data: { niche: "ai-custom" } // "ai-custom" is what pipeline.server.ts expects
            });
            
            // Queue the generation job
            await generatorQueue.add("generate", {
              generationId: genId,
              shopId: shopId,
              shopDomain: shopDomain,
              niche: "ai-custom"
            });
          } else {
             console.error("Called generate_store_from_context but no pending generation was found!");
          }
        }
      }
    }

    return {
      text: textContent?.text || "I have executed those actions for you.",
      toolCalls: executedTools
    };

  } catch (error: any) {
    console.error("AI Error:", error);
    return {
      text: `Sorry, I encountered an error: ${error.message}`,
      toolCalls: []
    };
  }
}
