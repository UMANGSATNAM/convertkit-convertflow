import { ComponentRegistry } from "@prisma/client";
import { uploadAssetWithCache } from "./asset-cache.server";
import * as fs from "fs/promises";
import * as path from "path";
import { ValidationError } from "./validators.server";

export interface BlueprintSection {
  componentId: string;
  settings?: Record<string, any>;
  blocks?: Record<string, any>;
}

export interface StoreBlueprintData {
  pages: {
    [pageHandle: string]: {
      sections: BlueprintSection[];
    }
  };
  globalComponents?: string[];
  tokensFile?: string;
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
/**
 * Helper to recursively read all files in a directory and return a map of relative Shopify asset paths to their string contents.
 */
async function readDirRecursive(dirPath: string, baseDir: string): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        const subResult = await readDirRecursive(fullPath, baseDir);
        Object.assign(result, subResult);
      } else {
        const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
        const content = await fs.readFile(fullPath, "utf-8");
        result[relPath] = content;
      }
    }
  } catch (err: any) {
    console.warn(`[readDirRecursive] Error reading directory ${dirPath}: ${err.message}`);
  }
  return result;
}

/**
 * The Theme Composer takes the Store Blueprint and the matched components from the registry.
 * It compiles the core files, niche files, and database sections into a single merged in-memory theme map.
 * Then it runs 3 safety validation checks before performing a single-batch upload to Shopify.
 */
export async function composeThemeFromBlueprint(
  shop: any,
  themeId: string,
  blueprint: StoreBlueprintData,
  components: ComponentRegistry[],
  nicheId: string
) {
  const filesToUpload: Record<string, string> = {};

  // Step 1: Read Core
  const coreDir = path.resolve(process.cwd(), "app/data/templates/theme-engine/core");
  const coreFiles = await readDirRecursive(coreDir, coreDir);
  Object.assign(filesToUpload, coreFiles);

  // Step 2: Overwrite with Niche (REMOVED in V2 architecture since niches folder is deleted)

  // Step 3: Generate Dynamic Niche Tokens CSS (Phase 6 Composition)
  const settings = blueprint.settings || {};
  if (settings.__empty_tokens) {
    filesToUpload["assets/niche-tokens.css"] = "";
  } else {
    filesToUpload["assets/niche-tokens.css"] = `/* Dynamically Generated StoreForge Theme Tokens */
:root {
  --color-background: ${settings.colors_background_1 || '#ffffff'};
  --color-text: ${settings.colors_accent_1 || '#1a1a1a'};
  --color-accent: ${settings.colors_accent_2 || '#008060'};
  --color-border: #e2e8f0;
  --font-heading-family: '${settings.fontHeading || 'Inter'}', sans-serif;
  --font-body-family: '${settings.fontBody || 'Inter'}', sans-serif;
  --card-radius: ${settings.card_style === 'soft' ? '12px' : settings.card_style === 'rounded' ? '24px' : '0px'};
  --button-radius: ${settings.button_style === 'pill' ? '50px' : settings.button_style === 'rounded' ? '8px' : '0px'};
  --section-padding-y: ${settings.section_density === 'airy' ? '80px' : settings.section_density === 'tight' ? '40px' : '60px'};
}`;
  }
  console.log(`[Composer] Generated dynamic CSS tokens from AI brand context.`);

  // Step 4: Inject Registry Sections & JSON Templates
  const resolvedComponents: ComponentRegistry[] = [];
  const templates: Record<string, any> = {};

  if (blueprint.globalComponents) {
    blueprint.globalComponents.forEach(componentId => {
      const component = components.find(c => c.componentId === componentId);
      if (component && !resolvedComponents.some(c => c.componentId === component.componentId)) {
        resolvedComponents.push(component);
      }
    });
  }

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

      const sectionType = component.sectionType || component.componentId;
      const sectionKey = `${sectionType}_${index}`;

      templateJson.sections[sectionKey] = {
        type: sectionType, // Maps to sections/{sectionType}.liquid
        settings: section.settings || {},
        blocks: section.blocks || {}
      };

      templateJson.order.push(sectionKey);
      
      if (!resolvedComponents.some(c => c.componentId === component.componentId)) {
        resolvedComponents.push(component);
      }
    });

    const templatePath = `templates/${pageHandle}.json`;
    templates[templatePath] = templateJson;
    filesToUpload[templatePath] = JSON.stringify(templateJson, null, 2);
    console.log(`[Composer] Built template ${templatePath} with ${templateJson.order.length} sections`);
  }

  // Read and inject liquid files for all resolved components
  for (const component of resolvedComponents) {
    if (component.liquidPath || component.filePath) {
      try {
        const engineDir = path.resolve(process.cwd(), "app/data/templates/theme-engine");
        // Check if liquidPath is already absolute or relative to root
        let fullPath = "";
        if (component.liquidPath.startsWith("app/")) {
          fullPath = path.resolve(process.cwd(), component.liquidPath);
        } else {
          fullPath = path.resolve(engineDir, component.liquidPath || component.filePath);
        }
        const liquidContent = await fs.readFile(fullPath, "utf-8");
        const sectionType = component.sectionType || component.componentId;
        const targetKey = `sections/${sectionType}.liquid`;
        filesToUpload[targetKey] = liquidContent;
      } catch (err: any) {
        console.error(`[Composer] Could not read liquid file for ${component.componentId}: ${err.message}`);
      }
    }
  }

  // --- SAFETY VALIDATION CHECKS ---

  // Check 1: Required Files Verification
  const requiredKeys = [
    "layout/theme.liquid",
    "layout/password.liquid",
    "config/settings_schema.json",
    "config/settings_data.json",
    "locales/en.default.json",
    "assets/cart.js",
    "assets/variant-swap.js",
    "assets/theme.js"
  ];
  requiredKeys.push("assets/niche-tokens.css");
  for (const key of requiredKeys) {
    if (filesToUpload[key] === undefined) {
      throw new ValidationError(`Required theme file missing: ${key}`);
    }
  }

  // Check 2: Missing Section Verification
  for (const [pageHandle, pageData] of Object.entries(blueprint.pages)) {
    for (const section of pageData.sections) {
      const component = components.find(c => c.componentId === section.componentId);
      if (component) {
        const sectionType = component.sectionType || component.componentId;
        const targetKey = `sections/${sectionType}.liquid`;
        if (!filesToUpload[targetKey]) {
          throw new ValidationError(`Section file missing in merged theme: ${targetKey}`);
        }
      }
    }
  }

  // Check 3: Empty Tokens Verification
  const tokensContent = filesToUpload["assets/niche-tokens.css"];
  if (!tokensContent || !tokensContent.trim()) {
    throw new ValidationError("Niche tokens stylesheet is empty or invalid");
  }

  // --- SINGLE-BATCH UPLOAD ---
  let uploadedCount = 0;
  const keysToUpload = Object.keys(filesToUpload).sort((a, b) => {
    const getPriority = (key: string): number => {
      if (
        key.startsWith("layout/") ||
        key.startsWith("assets/") ||
        key.startsWith("snippets/") ||
        key.startsWith("locales/")
      ) {
        return 1;
      }
      if (key.startsWith("sections/")) {
        return 2;
      }
      if (key.startsWith("templates/")) {
        return 3;
      }
      if (key.startsWith("config/")) {
        return 4;
      }
      return 5;
    };
    return getPriority(a) - getPriority(b);
  });
  for (const assetKey of keysToUpload) {
    const content = filesToUpload[assetKey];
    const success = await uploadLiquidWithRetry(shop, themeId, assetKey, content);
    if (success) {
      uploadedCount++;
    }
    // Respect spacing delay of 500ms between calls to prevent rate limits
    await sleep(500);
  }

  console.log(`[Composer] Batch upload complete: ${uploadedCount}/${keysToUpload.length} files uploaded.`);

  return { templates, settingsPatch: blueprint.settings };
}
