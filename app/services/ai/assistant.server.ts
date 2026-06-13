import { Anthropic } from "@anthropic-ai/sdk";
import prisma from "../../db.server";
import { applyHealthFix } from "../health/fixers.server";
import { runHealthScan } from "../health/scanner.server";
import { patchSettings, restoreSnapshot } from "../theme-engine/index";
import { campaignsQueue } from "../generator/campaign-worker.server";
import { authenticate, PLAN_PRO, PLAN_GROWTH, PLAN_ENTERPRISE } from "../../shopify.server";
import { analyzeStoreScreenshot } from "./vision.server";
import { generatorQueue } from "../queue.server";

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
  const shopId = shop.id;

  let textOutput = "";
  let toolCallsOutput: any[] = [];

  if (imageBase64 && imageType) {
    try {
      const extractedLayout = await analyzeStoreScreenshot(imageBase64, imageType as any);
      await prisma.storeGeneration.create({
        data: {
          shopId,
          nicheId: "custom-chatbot",
          catalogMode: "EMPTY",
          aiPayload: extractedLayout as any
        }
      });
    } catch (e) {
      console.error("Failed to analyze image with vision:", e);
    }
  }

  const pendingGenerations = await prisma.storeGeneration.findMany({
    where: { shopId, nicheId: "custom-chatbot", status: "QUEUED" },
    orderBy: { createdAt: 'desc' },
    take: 1
  });
  
  const hasPendingStore = pendingGenerations.length > 0;
  const SYSTEM_PROMPT = `You are the StoreForge AI assistant. You help merchants customize their Shopify store, and you can build entire stores from screenshots.
      CRITICAL INSTRUCTIONS:
      - If the user provides a screenshot and asks to build a store, acknowledge the design and ask for any specific details (like their industry or target audience).
      - If the user asks you to build the store and you already have enough information (or they just say "Okay" / "Go ahead"), YOU MUST CALL THE \`generate_store_from_context\` TOOL to start the generation.
      - NEVER say "I will start building" without calling the tool.
      - NEVER output raw Liquid code or CSS in your chat response.
      - ALWAYS use the provided tools to make changes directly to the store.
      
      Current state: ${hasPendingStore ? "A layout has been extracted from a screenshot and is pending generation. The user just needs to confirm." : "No pending store layouts. The user can upload a screenshot."}`;

  if (gemini) {
    const tools = [{
      functionDeclarations: [
        {
          name: "generate_store_from_context",
          description: "Trigger the AI store generation pipeline using the previously uploaded screenshot and context.",
          parameters: {
            type: "object",
            properties: {
              nicheId: { type: "string", description: "The industry/niche of the store (e.g. fashion, electronics)" },
              instructions: { type: "string", description: "Any extra instructions" }
            }
          }
        }
      ]
    }];

    const contents: any[] = [{ role: "user", parts: [{ text: message }] }];
    if (imageBase64 && imageType) {
      contents[0].parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: imageType
        }
      });
    }

    const response = await gemini.models.generateContent({
      model: "gemini-1.5-pro",
      systemInstruction: SYSTEM_PROMPT,
      tools: tools as any,
      contents
    });

    textOutput = response.text || "";
    if (response.functionCalls && response.functionCalls.length > 0) {
      for (const call of response.functionCalls) {
        toolCallsOutput.push({ name: call.name, input: call.args });
      }
    }
  } else if (openai) {
    const tools = [{
      type: "function",
      function: {
        name: "generate_store_from_context",
        description: "Trigger the AI store generation pipeline using the previously uploaded screenshot and context.",
        parameters: { type: "object", properties: { nicheId: { type: "string" }, instructions: { type: "string" } } }
      }
    }];

    const messages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];
    if (imageBase64 && imageType) {
      messages.push({
        role: "user",
        content: [{ type: "text", text: message }, { type: "image_url", image_url: { url: `data:${imageType};base64,${imageBase64}` } }]
      });
    } else {
      messages.push({ role: "user", content: message });
    }

    const response = await openai.chat.completions.create({ model: "gpt-4o", messages, tools: tools as any });
    const choice = response.choices[0];
    textOutput = choice?.message?.content || "";
    if (choice?.message?.tool_calls) {
      for (const call of choice.message.tool_calls) {
        toolCallsOutput.push({ name: call.function.name, input: JSON.parse(call.function.arguments) });
      }
    }
  } else if (anthropic) {
    const contentArr: any[] = [];
    if (imageBase64 && imageType) {
      contentArr.push({ type: "image", source: { type: "base64", media_type: imageType as any, data: imageBase64 } });
    }
    contentArr.push({ type: "text", text: message });

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: [
        {
          name: "generate_store_from_context",
          description: "Trigger the AI store generation pipeline using the previously uploaded screenshot and context.",
          input_schema: {
            type: "object",
            properties: {
              nicheId: { type: "string", description: "The industry/niche of the store (e.g. fashion, electronics)" },
              instructions: { type: "string", description: "Any extra instructions" }
            }
          }
        }
      ],
      messages: [{ role: "user", content: contentArr }]
    });

    const textContent = response.content.find((c: any) => c.type === "text") as any;
    if (textContent) {
      textOutput = textContent.text;
    }
    
    const toolCalls = response.content.filter((c: any) => c.type === "tool_use") as any[];
    for (const call of toolCalls) {
      toolCallsOutput.push({ name: call.name, input: call.input });
    }

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
          // await restoreSnapshot(shopDomain, snapshotId); // AI does not have context for 4 args
        }
        else if (call.name === "generate_store_from_context") {
          // Find the stashed generation record
          if (pendingGenerations.length > 0) {
            const genId = pendingGenerations[0].id;
            // Update it to trigger the pipeline
            await prisma.storeGeneration.update({
              where: { id: genId },
              data: { nicheId: "ai-custom" } // "ai-custom" is what pipeline.server.ts expects
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
