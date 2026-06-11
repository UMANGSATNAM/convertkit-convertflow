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
  // In reality, fetch conversation history from DB
  console.log(`[AI] Processing message for shop ${shopId}: ${message}`);

  // Mocking Anthropic response for scaffolding
  const response = {
    text: "I can help with that. Let me prepare a preview for you.",
    toolCalls: [
      { name: "patch_design", input: { primaryColor: "#FF5733" } }
    ]
  };

  await prisma.aiActionLog.create({
    data: {
      shopId,
      prompt: message,
      tools: response.toolCalls,
      applied: false,
      tokensIn: 150,
      tokensOut: 50
    }
  });

  return response;
}
