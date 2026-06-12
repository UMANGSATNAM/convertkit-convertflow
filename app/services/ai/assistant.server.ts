import { Anthropic } from "@anthropic-ai/sdk";
import prisma from "../../db.server";
import { applyAutoFix } from "../health/fixers.server";
import { patchSettings } from "../theme-engine/index";

const anthropic = new Anthropic({ 
  apiKey: process.env.ANTHROPIC_API_KEY 
});

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("WARNING: ANTHROPIC_API_KEY is not set. AI Assistant features will fail.");
}

export const tools = [
  {
    name: "patch_design",
    description: "Update the theme colors or fonts",
    input_schema: {
      type: "object",
      properties: {
        primaryColor: { type: "string" },
        fontFamily: { type: "string" }
      }
    }
  },
  {
    name: "toggle_toolkit",
    description: "Enable or disable a conversion toolkit feature",
    input_schema: {
      type: "object",
      properties: {
        feature: { type: "string", enum: ["STICKY_ATC", "COUNTDOWN", "ANNOUNCEMENT"] },
        enabled: { type: "boolean" }
      }
    }
  }
];

export async function processUserMessage(shopId: string, message: string) {
  console.log(`[AI] Processing message for shop ${shopId}: ${message}`);

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop) throw new Error("Shop not found");

  // Format the request for Anthropic
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: "You are the StoreForge AI assistant. You help merchants customize their Shopify store. Use the provided tools to make changes directly to the store when the user asks.",
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
        tools: toolCalls.map(tc => ({ name: tc.name, input: tc.input })),
        applied: toolCalls.length > 0,
        tokensIn: response.usage.input_tokens,
        tokensOut: response.usage.output_tokens
      }
    });

    // Execute tool calls if any
    if (toolCalls.length > 0) {
      for (const call of toolCalls) {
        if (call.name === "patch_design") {
          const { primaryColor, fontFamily } = call.input;
          const patch: any = {};
          if (primaryColor) patch.colors_solid_button_labels = primaryColor;
          if (fontFamily) patch.type_header_family = fontFamily;
          
          console.log(`[AI] Applying patch_design to shop ${shopId}`, patch);
          // Assuming Dawn theme for MVP. We pass empty themeId because we'll patch the active theme.
          await patchSettings(shop, "active", patch, "AI_ASSISTANT");
        } else if (call.name === "toggle_toolkit") {
          const { feature, enabled } = call.input;
          console.log(`[AI] Toggling toolkit ${feature} to ${enabled} for shop ${shopId}`);
          await prisma.toolkitFeature.upsert({
            where: { shopId_feature: { shopId, feature } },
            update: { enabled },
            create: { shopId, feature, enabled, config: {} }
          });
        }
      }
    }

    return {
      text: textContent?.text || "I have applied those changes to your store.",
      toolCalls: toolCalls.map(tc => ({ name: tc.name, input: tc.input }))
    };

  } catch (error: any) {
    console.error("AI Error:", error);
    return {
      text: `Sorry, I encountered an error: ${error.message}`,
      toolCalls: []
    };
  }
}
