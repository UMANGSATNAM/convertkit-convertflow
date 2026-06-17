import { ComponentRegistry } from "@prisma/client";
import { uploadAssetWithCache } from "./asset-cache.server";
import * as fs from "fs/promises";
import * as path from "path";

export interface BlueprintSection {
  componentId: string;
  settings?: Record<string, any>;
  blocks?: Record<string, any>;
}

export interface StoreBlueprint {
  pages: {
    [pageHandle: string]: {
      sections: BlueprintSection[];
    }
  };
  settings: Record<string, any>;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/**
 * Upload a single liquid file with retry on SSL/network errors.
 * Returns true if uploaded, false if skipped/failed (non-fatal).
 */
async function uploadLiquidWithRetry(
  shop: any,
  themeId: string,
  shopifyAssetKey: string,
  liquidContent: string,
  maxRetries = 5
): Promise<boolean> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const uploaded = await uploadAssetWithCache(shop, themeId, shopifyAssetKey, liquidContent);
      if (uploaded) {
        console.log(`[Composer] Uploaded: ${shopifyAssetKey}`);
      } else {
        console.log(`[Composer] Cache hit (no change): ${shopifyAssetKey}`);
      }
      return true;
    } catch (err: any) {
      // Check both direct error and cause (Node.js 18+ fetch wraps in cause)
      const rootErr = err.cause || err;
      const isRetryable =
        rootErr.code === "EPROTO" ||
        rootErr.code === "ECONNRESET" ||
        rootErr.code === "ETIMEDOUT" ||
        (rootErr.message && rootErr.message.includes("SSL")) ||
        (err.message && err.message.includes("EPROTO")) ||
        (err.message && err.message.includes("SSL"));

      if (isRetryable && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 3000 + Math.random() * 1000;
        console.warn(
          `[Composer] SSL/Network error uploading ${shopifyAssetKey}. Retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries})`
        );
        await sleep(delay);
        continue;
      }
      // Non-retryable or last attempt: log and continue (don't crash the pipeline)
      console.error(
        `[Composer] WARN: Failed to upload ${shopifyAssetKey} after ${attempt + 1} attempts: ${err.message}. Continuing...`
      );
      return false;
    }
  }
  return false;
}

/**
 * The Theme Composer takes the Store Blueprint and the matched components from the registry.
 * It does two things:
 * 1. Generates the `index.json` (and other templates) — this ALWAYS runs.
 * 2. Uploads the necessary `.liquid` files to the Shopify theme — failures here are non-fatal.
 */
export async function composeThemeFromBlueprint(
  shop: any,
  themeId: string,
  blueprint: StoreBlueprint,
  components: ComponentRegistry[]
) {
  const templates: Record<string, any> = {};

  // Track which liquid files we need to upload
  const componentsToUpload = new Set<string>();

  for (const [pageHandle, pageData] of Object.entries(blueprint.pages)) {
    const templateJson: any = {
      sections: {},
      order: []
    };

    pageData.sections.forEach((section, index) => {
      // Find the component in the registry
      const component = components.find(c => c.componentId === section.componentId);
      if (!component) {
        console.warn(`[Composer] Component ${section.componentId} not found in registry. Skipping.`);
        return;
      }

      const sectionKey = `${component.componentId}_${index}`;
      
      templateJson.sections[sectionKey] = {
        type: component.componentId, // Maps to sections/{componentId}.liquid
        settings: section.settings || {},
        blocks: section.blocks || {}
      };
      
      templateJson.order.push(sectionKey);
      componentsToUpload.add(component.componentId);
    });

    const templatePath = `templates/${pageHandle}.json`;
    templates[templatePath] = templateJson;
    console.log(`[Composer] Built template ${templatePath} with ${templateJson.order.length} sections: ${templateJson.order.join(", ")}`);
  }

  // Upload the required liquid files — failures are NON-FATAL (template JSON is what matters)
  let uploadedCount = 0;
  for (const componentId of componentsToUpload) {
    const component = components.find(c => c.componentId === componentId);
    if (component && component.liquidPath) {
      try {
        const fullPath = path.resolve(process.cwd(), component.liquidPath);
        const liquidContent = await fs.readFile(fullPath, "utf-8");
        const shopifyAssetKey = `sections/${component.componentId}.liquid`;

        const success = await uploadLiquidWithRetry(shop, themeId, shopifyAssetKey, liquidContent);
        if (success) uploadedCount++;

        // Spacing between uploads to avoid Cloudflare rate limits
        await sleep(500);
      } catch (err: any) {
        console.error(`[Composer] Could not read liquid file for ${componentId}: ${err.message}`);
      }
    }
  }

  console.log(`[Composer] Liquid uploads complete: ${uploadedCount}/${componentsToUpload.size}`);
  return { templates, settingsPatch: blueprint.settings };
}
