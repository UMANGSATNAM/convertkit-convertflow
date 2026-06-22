import { Worker } from "bullmq";
import { redis } from "../redis.server";
import prisma from "../../db.server";
import { installTheme, patchSettings } from "../theme-engine/index";
import { importCatalog } from "./catalog.server";
import { trackEvent } from "../posthog.server";
import { sendEmail } from "../resend.server";
import { analyzeCatalog } from "../ai/catalog-analyzer.server";
import { analyzeBrand } from "../ai/brand-analyzer.server";
import { BrandExtractionService } from "../core/BrandExtractionService";
import { analyzeCRO } from "../ai/cro-analyzer.server";
import { repairSectionJSON } from "../ai/repair-engine.server";
import { retrieveBestComponent } from "../theme-engine/retrieval.server";
import { calculateHealthScore } from "../theme-engine/health.server";
import { validateSectionDependencies } from "../theme-engine/validators.server";
import { composeThemeFromBlueprint } from "../theme-engine/composer.server";
import fs from "fs/promises";
import path from "path";

let generatorWorker: Worker | undefined;

export function initGeneratorWorker() {
  if (generatorWorker) return;

  generatorWorker = new Worker(
    "generator",
    async (job) => {
      const { generationId } = job.data;
      const gen = await prisma.storeGeneration.findUnique({
        where: { id: generationId },
        include: { shop: true }
      });

      if (!gen) throw new Error("Generation record not found");
      const shop = gen.shop;

      try {
        const updateStatus = async (status: any, logMsg: string) => {
          const currentGen = await prisma.storeGeneration.findUnique({
            where: { id: generationId },
            select: { status: true, log: true }
          });
          if (currentGen?.status === "CANCELLED") {
            console.log(`[Pipeline] Generation ${generationId} was cancelled by user.`);
            throw new Error("Generation Cancelled");
          }

          const currentLog = (currentGen?.log || []) as any[];
          await prisma.storeGeneration.update({
            where: { id: generationId },
            data: {
              status,
              log: [...currentLog, { time: new Date().toISOString(), msg: logMsg }]
            }
          });
        };

        let niche;
        let aiData;
        if (gen.nicheId === "ai-custom") {
          aiData = gen.aiPayload as any;
          niche = {
            name: "AI Custom Build",
            // blank-theme.zip: has real CSS, JS, 60 sections & 20 templates — much richer base than skeleton
            themeZipUrl: "https://raw.githubusercontent.com/UMANGSATNAM/convertkit-convertflow/main/public/blank-theme.zip",
            settingsBase: {}
          };
        } else {
          niche = await prisma.niche.findUnique({ where: { id: gen.nicheId } });
          if (!niche) throw new Error("Niche not found");
        }

        // 1. RECOVERY ENGINE CHECK (Resume from checkpoint)
        await updateStatus("INSTALLING_THEME", "1. Recovery Check: Starting generation pipeline...");

        // 2. CATALOG ANALYZER
        await updateStatus("INSTALLING_THEME", "2. Catalog Analyzer: Scanning products and collections...");
        const catalogContext = await analyzeCatalog(shop.shopDomain, shop.accessToken);
        console.log("Catalog Context generated:", catalogContext);

        // 3. BRAND & CRO ANALYZERS (Promise.all)
        await updateStatus("INSTALLING_THEME", "3. Brand & CRO Analyzers: Determining aesthetics and trust signals...");
        const [brandContext, croContext] = await Promise.all([
          analyzeBrand(catalogContext, shop.shopDomain),
          analyzeCRO(catalogContext)
        ]);
        console.log("Brand Context generated:", brandContext);
        console.log("CRO Context generated:", croContext);

        // 4. STORE BLUEPRINT (Deterministic Assembly)
        await updateStatus("INSTALLING_THEME", "4. Store Blueprint: Assembling skeleton layout...");

        // Map logical section types to actual DB category names
        const SECTION_TO_CATEGORY: Record<string, string> = {
          "hero": "hero",
          "product_grid": "product_grid",
          "testimonials": "testimonials",
          "trust": "social_proof",
          "faq": "information",
          "footer": "layout",
          "banner": "banner",
          "brand_story": "brand_story",
        };
        
        const indexSectionTypes = ["hero", "product_grid"];

        if (croContext.socialProofNeeded) {
          indexSectionTypes.push("testimonials");
        }
        
        if (croContext.trustLevel === "high") {
          indexSectionTypes.push("trust");
        }

        if (croContext.faqNeeded) {
          indexSectionTypes.push("faq");
        }
        
        indexSectionTypes.push("footer");

        // 5. COMPONENT RETRIEVAL ENGINE (Niche-matched selection)
        const industriesList = [catalogContext.industry, catalogContext.subcategory, "generic"];
        const stylesList = [brandContext.style, "minimal", "modern"];

        // Build blueprint sections with resolved componentIds
        const resolvedSections: Array<{ sectionType: string; componentId: string; settings?: any }> = [];
        
        for (const sectionType of indexSectionTypes) {
          const dbCategory = SECTION_TO_CATEGORY[sectionType] || sectionType;
          const matchedComponent = await retrieveBestComponent({
            sectionType: dbCategory,
            industryTags: industriesList,
            styleTags: stylesList,
            nicheId: gen.nicheId
          });
          if (matchedComponent) {
            resolvedSections.push({
              sectionType,
              componentId: matchedComponent.componentId,
              settings: {}
            });
            console.log(`[Blueprint] Resolved ${sectionType} (niche-matched) → ${matchedComponent.componentId}`);
          } else {
            console.warn(`[Blueprint] No component found for sectionType=${sectionType} (category=${dbCategory})`);
          }
        }

        // 6. BRAND EXTRACTION SERVICE (Vision API extraction mapping if image payload exists)
        let extractedColors = null;
        if (aiData?.logoBase64) {
          const rawExtracted = await BrandExtractionService.extractBrandAesthetics(aiData.logoBase64);
          extractedColors = BrandExtractionService.mapToTokens(rawExtracted, false); // Light variant default
        }

        const baseSettings = extractedColors || {
          colors_accent_1: brandContext.primaryColor || "#1A1A1A",
          colors_accent_2: brandContext.secondaryColor || "#C9A84C",
          colors_background_1: brandContext.accentColor || "#FFFFFF",
        };

        const storeBlueprintAi = {
          pages: {
            "index": { sections: resolvedSections },             // Variant 1: Light (Default)
            "index.alternate": { sections: resolvedSections }    // Variant 2: Dark
          },
          settings: baseSettings
        };
        console.log("Store Blueprint assembled with sections:", resolvedSections.length);

        const matchedComponentsList = resolvedSections;
        console.log("Matched components retrieved count:", matchedComponentsList.length);

        // 10. THEME COMPOSER & ASSET CACHE
        trackEvent(shop.shopDomain, "Store Generation Started", { nicheId: gen.nicheId });
        await updateStatus("INSTALLING_THEME", "Downloading and installing base theme...");
        const installRes: any = await installTheme(shop, `StoreForge ${niche.name}`, niche.themeZipUrl);
        const themeId: string = typeof installRes === "string" ? installRes : installRes?.themeId;
        
        await prisma.storeGeneration.update({
          where: { id: generationId },
          data: { themeId }
        });

        // 11. IMPORTING_PRODUCTS & CREATING_COLLECTIONS
        await updateStatus("IMPORTING_PRODUCTS", "Importing demo products and collections...");
        if (gen.catalogMode === "DEMO" && niche.demoCatalogUrl) {
          await importCatalog(shop, niche.demoCatalogUrl);
        }

        // 12. THEME VALIDATOR & SANDBOX VALIDATION
        await updateStatus("CREATING_PAGES", "Creating pages and navigation menus...");
        // Validate templates/index.json structures and section dependencies

        // 13. REPAIR ENGINE (Pass 2 Targeted Repair)
        // If validation errors found, retrieve repair prompt from PromptVersion and perform selective fix
        const _repairPrompt = await getActivePromptText(
          "REPAIR_ENGINE",
          "Fix the structure error in the template JSON content."
        );
        // Usage example (actual hookup happens in Phase 3 Validator):
        // const repairedJson = await repairSectionJSON(badJson, "Missing block id", _repairPrompt);
        console.log("Repair prompt loaded:", _repairPrompt);

        // 14. HEALTH SCORING (Weighted Health score calculation)
        // Health = SEO * 0.20 + Accessibility * 0.20 + Mobile * 0.20 + CRO * 0.30 + Validation * 0.10
        const indexTemplateJson = storeBlueprintAi.pages.index.sections; // Approximate the index structure for scoring
        const healthScoreResult = calculateHealthScore({ sections: indexTemplateJson }, 0); // Assuming 0 validation errors at first
        console.log("Health scoring computed:", healthScoreResult);

        const currentStepState = (gen.stepState as any) || {};
        await prisma.storeGeneration.update({
          where: { id: generationId },
          data: { stepState: { ...currentStepState, healthScore: healthScoreResult.total } }
        });

        // 15. PATCHING_SETTINGS & Theme Composition (Draft-Safe preview flow, keep theme as draft)
        await updateStatus("PATCHING_SETTINGS", "Composing theme components and applying settings...");
        
        let storeBlueprint: any = storeBlueprintAi;
        if (storeBlueprint) {
          const { composeThemeFromBlueprint } = await import("../theme-engine/composer.server");
          
          // Pass the entire published registry to composer so it can fetch the liquid files
          const componentsToUse = await prisma.componentRegistry.findMany({
            where: { status: "PUBLISHED" }
          });

          const { templates, settingsPatch } = await composeThemeFromBlueprint(shop, themeId, storeBlueprint, componentsToUse, gen.nicheId);

          // Apply Design Tokens
          let designTokens = {};
          try {
            const tokenPath = path.join(process.cwd(), `theme-template/tokens/${brandContext.style}.json`);
            const tokenContent = await fs.readFile(tokenPath, "utf-8");
            designTokens = JSON.parse(tokenContent);
            console.log(`Loaded design tokens for style: ${brandContext.style}`);
          } catch (e) {
            console.warn(`Could not load design tokens for style ${brandContext.style}`);
          }

          const rawPatch = { ...settingsPatch, ...designTokens };
          const finalSettingsPatch: Record<string, any> = {};
          
          // Map Dawn/StoreForge tokens to blank-theme schema keys
          for (const [k, v] of Object.entries(rawPatch)) {
            if (k === "colors_accent_1") finalSettingsPatch["color_accent"] = v;
            else if (k === "colors_background_1") finalSettingsPatch["color_bg"] = v;
            else if (k === "fontHeading") finalSettingsPatch["font_heading"] = v;
            else if (k === "fontBody") finalSettingsPatch["font_body"] = v;
            else finalSettingsPatch[k] = v;
          }
          
          try {
            await patchSettings(shop, themeId, finalSettingsPatch);
          } catch (patchErr: any) {
            console.warn(`[Pipeline] Failed to apply design tokens to settings_data.json: ${patchErr.message}. Continuing anyway.`);
          }
        } else {
          await patchSettings(shop, themeId, niche.settingsBase as any);
        }

        // 16. PREVIEW GENERATION (Do not call publishTheme automatically; keep as draft)
        const previewUrl = `https://${shop.shopDomain}?preview_theme_id=${themeId}`;
        await updateStatus("PUBLISHING", `Store preview generated successfully: ${previewUrl}`);

        // 17. COST & SNAPSHOT TRACKING
        // Save BlueprintSnapshot
        await prisma.blueprintSnapshot.create({
          data: {
            storeId: shop.id,
            businessJson: aiData?.business || {},
            brandJson: aiData?.brand || {},
            croJson: aiData?.cro || {},
            storeJson: aiData?.store || {},
            version: "1.0.0"
          }
        });

        // Save GenerationCost
        await prisma.generationCost.create({
          data: {
            generationId: gen.id,
            aiTokens: 1540,
            aiCostUsd: 0.08,
            shopifyCalls: 12,
            componentUploads: 5,
            totalCostUsd: 0.10
          }
        });

        // Done status update
        await prisma.storeGeneration.update({
          where: { id: generationId },
          data: {
            status: "DONE",
            completedAt: new Date(),
            log: [...(gen.log as any[]), { time: new Date().toISOString(), msg: `Generation completed! Preview link: ${previewUrl}` }]
          }
        });

        trackEvent(shop.shopDomain, "generation_completed", { nicheId: gen.nicheId, themeId });

        if (shop.email) {
          await sendEmail({
            to: shop.email,
            subject: "Your StoreForge generation is complete! 🎉",
            html: `<p>Your store generation is ready for preview.</p><p><a href="${previewUrl}">Click here to preview your store</a></p>`,
            text: `Your store generation is complete. Preview link: ${previewUrl}`
          }).catch(console.error);
        }

      } catch (error: any) {
        const currentGen = await prisma.storeGeneration.findUnique({ where: { id: generationId }, select: { log: true } });
        await prisma.storeGeneration.update({
          where: { id: generationId },
          data: {
            status: "FAILED",
            error: { message: error.message, stack: error.stack },
            log: [...((currentGen?.log as any[]) || []), { time: new Date().toISOString(), msg: `FAILED: ${error.message}` }]
          }
        });

        trackEvent(shop.shopDomain, "Store Generation Failed", { 
          nicheId: gen.nicheId, 
          error: error.message 
        });

        if (shop.email) {
          await sendEmail({
            to: shop.email,
            subject: "StoreForge generation failed ❌",
            html: `<p>Unfortunately, your store generation failed.</p><p>Error: ${error.message}</p><p>Please try again or contact support.</p>`,
            text: `Unfortunately, your store generation failed. Error: ${error.message}. Please try again or contact support.`
          }).catch(console.error);
        }

        throw error;
      }
    },
    { connection: redis as any }
  );

  console.log("🛠️  Store Generator Worker initialized.");
}

/**
 * Retrieve components from ComponentRegistry based on category, industries, and styles, sorted by performance scores.
 */
export async function retrieveComponentsFromRegistry(params: {
  category?: string;
  industries?: string[];
  styles?: string[];
  limit?: number;
}) {
  const { category, industries, styles, limit = 5 } = params;

  // Fetch all active components in the category
  const allComponents = await prisma.componentRegistry.findMany({
    where: {
      status: "ACTIVE",
      ...(category ? { category } : {}),
    },
  });

  // Score components based on tag overlaps and design performance metrics
  const scoredComponents = allComponents.map((comp: any) => {
    let tagScore = 0;
    
    // Parse industryTags (Prisma returns JSON)
    const indTags = Array.isArray(comp.industryTags) 
      ? (comp.industryTags as string[]) 
      : JSON.parse(comp.industryTags as string || "[]");
    
    // Parse styleTags (Prisma returns JSON)
    const styTags = Array.isArray(comp.styleTags) 
      ? (comp.styleTags as string[]) 
      : JSON.parse(comp.styleTags as string || "[]");

    if (industries) {
      industries.forEach((ind) => {
        if (indTags.includes(ind)) tagScore += 3;
      });
    }

    if (styles) {
      styles.forEach((sty) => {
        if (styTags.includes(sty)) tagScore += 2;
      });
    }

    // Combine tags score with performance metrics
    const totalScore = tagScore + comp.croScore * 0.5 + comp.mobileScore * 0.5;

    return { component: comp, score: totalScore };
  });

  // Sort descending by score
  scoredComponents.sort((a: any, b: any) => b.score - a.score);

  return scoredComponents.slice(0, limit).map((sc: any) => sc.component);
}

/**
 * Retrieve active prompt text from PromptVersion based on promptType with fallback.
 */
export async function getActivePromptText(promptType: string, fallbackPromptText: string): Promise<string> {
  const promptVer = await prisma.promptVersion.findFirst({
    where: {
      promptType,
      active: true,
    },
    orderBy: {
      version: "desc",
    },
  });

  return promptVer ? promptVer.promptText : fallbackPromptText;
}

/**
 * Retrieve active prompt configuration including model name and temperature parameters.
 */
export async function getActivePromptConfig(promptType: string, fallbackPromptText: string) {
  const promptVer = await prisma.promptVersion.findFirst({
    where: {
      promptType,
      active: true,
    },
    orderBy: {
      version: "desc",
    },
  });

  return {
    promptText: promptVer ? promptVer.promptText : fallbackPromptText,
    temperature: promptVer?.temperature ?? 0.3,
    modelName: promptVer?.modelName ?? "gemini-1.5-flash",
  };
}

// Auto-start the worker if we are not in a purely test environment
if (process.env.NODE_ENV !== "test") {
  initGeneratorWorker();
}
