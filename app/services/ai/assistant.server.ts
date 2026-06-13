import { Anthropic } from "@anthropic-ai/sdk";
import prisma from "../../db.server";
import { applyHealthFix } from "../health/fixers.server";
import { runHealthScan } from "../health/scanner.server";
import { patchSettings, restoreSnapshot } from "../generator/theme-engine";
import { campaignsQueue } from "../generator/campaign-worker.server";

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
  }
];

export async function processUserMessage(request: Request, shopId: string, shopDomain: string, message: string) {
  console.log(`[AI] Processing message for shop ${shopId}: ${message}`);

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop) throw new Error("Shop not found");

  // 1. Quotas & Guardrails
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentLogs = await prisma.aiActionLog.aggregate({
    where: { shopId, createdAt: { gte: thirtyDaysAgo } },
    _sum: { tokensIn: true, tokensOut: true }
  });
  
  const totalTokens = (recentLogs._sum.tokensIn || 0) + (recentLogs._sum.tokensOut || 0);
  const tokenLimit = shop.plan === "PRO" ? 500000 : 10000;

  if (totalTokens > tokenLimit) {
    return {
      text: `⚠️ **Quota Exceeded.** You have used ${totalTokens} tokens this month (Limit: ${tokenLimit}). Please upgrade your plan to continue using the AI Assistant.`,
      toolCalls: []
    };
  }

  // Format the request for Anthropic
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: `You are the StoreForge AI assistant. You help merchants customize their Shopify store.
      CRITICAL INSTRUCTIONS:
      1. NEVER output raw Liquid code or CSS in your chat response.
      2. ALWAYS use the provided tools to make changes directly to the store.
      3. Be concise and professional.
      4. If the user asks for something outside of the tools' capabilities, explain what you *can* do.`,
      messages: [{ role: "user", content: message }],
      tools: tools as any
    });

    const textContent = response.content.find((c: any) => c.type === "text") as any;
    const toolCalls = response.content.filter((c: any) => c.type === "tool_use") as any[];

    // Log the request
    await prisma.aiActionLog.create({
      data: {
        shopId,
        prompt: message,
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
            data: {
              shopId, templateKey, title, handle,
              productIds: "[]", offer: "{}"
            }
          });
          // apply immediately
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
