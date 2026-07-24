import { generateStoreContent } from "../app/services/core/ContentGenerationService";
import { getBlueprintForStore } from "../app/services/core/StoreDNAEngine";
import prisma from "../app/db.server";
import fs from "fs";

async function runFallback() {
  // Clear API keys to force fallback
  process.env.ANTHROPIC_API_KEY = "";
  process.env.OPENAI_API_KEY = "";
  process.env.CLAUDE_API_KEY = "";
  
  const shopDomain = "peri-beauty-bcuauhsj.myshopify.com";
  
  const blueprint = await getBlueprintForStore(shopDomain);
  const result = await generateStoreContent(shopDomain, blueprint, "beauty_luxury");
  
  console.log("--- FALLBACK JSON OUTPUT ---");
  console.log(JSON.stringify(result, null, 2));
}

runFallback().catch(console.error);
