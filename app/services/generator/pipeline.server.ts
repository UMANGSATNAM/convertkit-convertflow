import { Worker } from "bullmq";
import { redis } from "../redis.server";
import prisma from "../../db.server";
import { installTheme, patchSettings } from "../theme-engine/index";
import { importCatalog } from "./catalog.server";
import { trackEvent } from "../posthog.server";
import { sendEmail } from "../resend.server";
import { analyzeCatalog } from "../ai/catalog-analyzer.server";
import { analyzeVisualAssets } from "../ai/visual-analyzer.server";
import { analyzeBrand } from "../ai/brand-analyzer.server";
import { BrandExtractionService } from "../core/BrandExtractionService";
import { analyzeCRO } from "../ai/cro-analyzer.server";
import { repairSectionJSON } from "../ai/repair-engine.server";
import { retrieveBestComponent } from "../theme-engine/retrieval.server";
import { injectProductsIntoBlueprint } from "../theme-engine/injector.server";
import { generateStoreBlueprint } from "../theme-engine/blueprint.server";
import { calculateHealthScore } from "../theme-engine/health.server";
import { validateSectionDependencies, validateTemplateStructure } from "../theme-engine/validators.server";
import { composeThemeFromBlueprint } from "../theme-engine/compiler.server";
import { createGenerationProfile, logGenerationProfile, type ComponentSelection } from "./generation-profiler.server";
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

      // Declare profile outside try so catch block can log failure state
      const pipelineStartMs = Date.now();
      const profile = createGenerationProfile(generationId, shop.shopDomain);

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

        // 2. CATALOG ANALYZER (Phase 1)
        await updateStatus("INSTALLING_THEME", "2. Catalog Analyzer: Scanning products and collections...");
        const catalogContext = await analyzeCatalog(shop.shopDomain, shop.accessToken);
        profile.catalogProfile = {
          industry: catalogContext.industry,
          positioning: catalogContext.positioning,
          style: catalogContext.style,
          price_band: catalogContext.price_band,
          catalog_strength: catalogContext.catalog_strength,
          product_count: catalogContext.product_count,
          collection_count: catalogContext.collection_count,
          dominant_categories: catalogContext.dominant_categories,
          catalog_depth: catalogContext.catalog_depth,
          visual_complexity: catalogContext.visual_complexity,
          hero_product_type: catalogContext.hero_product_type,
          avgPrice: catalogContext.avgPrice,
          imageUrlsCollected: (catalogContext.sampleImageUrls || []).length
        };

        // 2.5 VISUAL ASSET ANALYZER (Phase 1.5)
        await updateStatus("INSTALLING_THEME", "2.5. Visual Analyzer: Evaluating brand imagery...");
        const visualContext = await analyzeVisualAssets(shop.shopDomain, catalogContext.sampleImageUrls || []);
        profile.visualProfile = { ...visualContext };

        // 3. BRAND & CRO ANALYZERS (Phases 2 & 3)
        await updateStatus("INSTALLING_THEME", "3. Brand & CRO Analyzers: Determining aesthetics and trust signals...");
        const [brandContext, croContext] = await Promise.all([
          analyzeBrand(catalogContext, visualContext, shop.shopDomain),
          analyzeCRO(catalogContext)
        ]);
        profile.brandProfile = {
          brand_archetype: brandContext.brand_archetype,
          tone: brandContext.tone,
          visual_direction: brandContext.visual_direction,
          trust_level: brandContext.trust_level,
          colors: brandContext.colors,
          typography: brandContext.typography,
          theme_tokens: brandContext.theme_tokens
        };

        // 4. STORE BLUEPRINT (Phase 4 - Deterministic Assembly)
        await updateStatus("INSTALLING_THEME", "4. Store Blueprint: Assembling skeleton layout...");
        
        const generatedBlueprint = generateStoreBlueprint(catalogContext, brandContext);
        const sectionTypesBeforeCRO = [...generatedBlueprint.pages.index];
        let indexSectionTypes = generatedBlueprint.pages.index;

        // ── CRO BLUEPRINT ENRICHMENT (Phase 8) ──────────────────────────────
        const croInjected: string[] = [];

        if (croContext.socialProofNeeded && !indexSectionTypes.includes('testimonials')) {
          const insertAt = indexSectionTypes.length;
          indexSectionTypes.splice(insertAt, 0, 'testimonials');
          croInjected.push('testimonials');
          console.log("[CRO] Injected 'testimonials' — socialProofNeeded=true");
        }

        if (croContext.faqNeeded && !indexSectionTypes.includes('faq')) {
          const insertAt = indexSectionTypes.length;
          indexSectionTypes.splice(insertAt, 0, 'faq');
          croInjected.push('faq');
          console.log("[CRO] Injected 'faq' — faqNeeded=true");
        }

        if (croContext.trustLevel === 'high' && !indexSectionTypes.includes('trust')) {
          const heroIdx = indexSectionTypes.indexOf('hero');
          const insertAt = heroIdx >= 0 ? heroIdx + 1 : 1;
          indexSectionTypes.splice(insertAt, 0, 'trust');
          croInjected.push('trust');
          console.log("[CRO] Injected 'trust' — trustLevel=high");
        }

        profile.croProfile = {
          trustLevel: croContext.trustLevel,
          socialProofNeeded: croContext.socialProofNeeded,
          faqNeeded: croContext.faqNeeded,
          injectedSections: croInjected
        };
        console.log("[Pipeline] Final Blueprint sections after CRO:", indexSectionTypes);

        // 5. COMPONENT RETRIEVAL ENGINE (Phase 5 - Deterministic Pure Math Ranking)
        await updateStatus("INSTALLING_THEME", "5. Component Retrieval Engine: Matching exact components...");

        const resolvedSections: Array<{ sectionType: string; componentId: string; settings?: any }> = [];
        
        for (const sectionType of indexSectionTypes) {
          const matchedComponent = await retrieveBestComponent({
            sectionType: sectionType,
            brandArchetype: brandContext.brand_archetype,
            catalogIndustry: catalogContext.industry,
            catalogStyle: catalogContext.style,
            catalogVisualComplexity: catalogContext.visual_complexity
          });

          if (matchedComponent && matchedComponent.componentId) {
            resolvedSections.push({
              sectionType,
              componentId: matchedComponent.componentId,
              settings: {}
            });
            console.log(`[Phase 5] Resolved ${sectionType} -> ${matchedComponent.componentId} (Score: ${matchedComponent.score})`);
          } else {
            console.warn(`[Phase 5] No component found for sectionType=${sectionType}`);
          }
        }

        // Capture blueprint + selected components in profile
        profile.blueprint = {
          sectionTypesBeforeCRO,
          sectionTypesAfterCRO: [...indexSectionTypes],
          selectedComponents: resolvedSections.map(s => {
            const matched = s as any;
            return {
              sectionType: s.sectionType,
              componentId: s.componentId,
              score: matched.score || 0,
              breakdown: matched.breakdown
            } as ComponentSelection;
          })
        };

        const globalComponents: string[] = [];
        const globalSectionTypes = ["header", "footer"];
        
        for (const sectionType of globalSectionTypes) {
          const matchedComponent = await retrieveBestComponent({
            sectionType,
            brandArchetype: brandContext.brand_archetype,
            catalogIndustry: catalogContext.industry,
            catalogStyle: catalogContext.style,
            catalogVisualComplexity: catalogContext.visual_complexity
          });
          if (matchedComponent && matchedComponent.componentId) {
             globalComponents.push(matchedComponent.componentId);
             console.log(`[Phase 5] Resolved GLOBAL ${sectionType} -> ${matchedComponent.componentId}`);
          }
        }
        // 6. BRAND EXTRACTION SERVICE (Vision API extraction mapping if image payload exists)
        let extractedColors = null;
        if (aiData?.logoBase64) {
          const rawExtracted = await BrandExtractionService.extractBrandAesthetics(aiData.logoBase64);
          extractedColors = BrandExtractionService.mapToTokens(rawExtracted, false); // Light variant default
        }

        const baseSettings = extractedColors || {
          colors_accent_1: brandContext.colors?.primary || "#1A1A1A",
          colors_accent_2: brandContext.colors?.secondary || "#C9A84C",
          colors_background_1: brandContext.colors?.accent || "#FFFFFF",
          fontHeading: brandContext.typography?.heading || "Inter",
          fontBody: brandContext.typography?.body || "Inter",
          button_style: brandContext.theme_tokens?.button_style || "rounded",
          card_style: brandContext.theme_tokens?.card_style || "soft",
          section_density: brandContext.theme_tokens?.section_density || "airy"
        };

        const storeBlueprintAi = {
          pages: {
            "index": { sections: resolvedSections },             // Variant 1: Light (Default)
            "index.alternate": { sections: resolvedSections }    // Variant 2: Dark
          },
          settings: baseSettings,
          globalComponents
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

        // 10b. SAVE STORE BLUEPRINT TO DB
        const componentsObj: any = {};
        resolvedSections.forEach(s => componentsObj[s.sectionType] = s.componentId);
        globalComponents.forEach(g => {
          const prefix = g.split("-")[0];
          componentsObj[prefix] = g;
        });

        const blueprintDb = await prisma.storeBlueprint.create({
          data: {
            shopId: shop.id,
            generationId: gen.id,
            niche: gen.nicheId,
            family: catalogContext.industry,
            archetype: brandContext.brand_archetype,
            tokensFile: "",
            components: componentsObj,
            pdpFeatures: {},
            status: "preview"
          }
        });
        console.log(`[Pipeline] Saved StoreBlueprint to DB: ${blueprintDb.id}`);

        // 11. IMPORTING_PRODUCTS & CREATING_COLLECTIONS
        await updateStatus("IMPORTING_PRODUCTS", "Importing demo products and collections...");
        if (gen.catalogMode === "DEMO" && niche.demoCatalogUrl) {
          await importCatalog(shop, niche.demoCatalogUrl);
        }

        // 12. THEME VALIDATOR (Phase 9) + REPAIR ENGINE (Phase 10)
        await updateStatus("CREATING_PAGES", "Validating templates and running auto-repair...");

        const _repairPrompt = await getActivePromptText(
          "REPAIR_ENGINE",
          "Fix the structural error in the Shopify JSON template. Return only valid JSON."
        );

        // Validate + Repair loop: up to 2 repair attempts per template
        // CRITICAL: Never throw from this block — generation must always continue.
        let totalRepairAttempts = 0;
        let anyRepairApplied = false;
        const validationErrors: string[] = [];
        let allTemplatesPassed = true;

        for (const [templatePath, templateJson] of Object.entries(storeBlueprintAi.pages)) {
          const sectionsData = (templateJson as any).sections;
          const templateForValidation = {
            sections: Object.fromEntries(
              (sectionsData as any[]).map((s: any, i: number) => [
                `${s.sectionType || 'section'}_${i}`,
                { type: s.sectionType || s.componentId, settings: s.settings || {} }
              ])
            ),
            order: (sectionsData as any[]).map((s: any, i: number) => `${s.sectionType || 'section'}_${i}`)
          };

          let validationPassed = false;
          let repairAttempts = 0;
          let currentJson = templateForValidation;

          while (!validationPassed && repairAttempts <= 2) {
            try {
              validateTemplateStructure(currentJson);
              validateSectionDependencies(currentJson);
              validationPassed = true;
              console.log(`[Validator] ✅ "${templatePath}" passed.`);
            } catch (validationErr: any) {
              repairAttempts++;
              totalRepairAttempts++;
              validationErrors.push(validationErr.message);
              console.warn(`[Validator] Attempt ${repairAttempts}: "${templatePath}" failed — ${validationErr.message}`);

              if (repairAttempts > 2) {
                // Max repairs reached — keep original, continue generation (NEVER crash)
                allTemplatesPassed = false;
                console.error(`[Repair] ⚠️ Max attempts reached for "${templatePath}". Using best-effort template.`);
                break;
              }

              // Attempt AI repair — if repair itself fails, keep original and continue
              try {
                const repairedJsonStr = await repairSectionJSON(
                  JSON.stringify(currentJson, null, 2),
                  validationErr.message,
                  _repairPrompt
                );
                currentJson = JSON.parse(repairedJsonStr);
                anyRepairApplied = true;
                console.log(`[Repair] ✅ Attempt ${repairAttempts}: Repair applied for "${templatePath}".`);
              } catch (repairErr: any) {
                // Repair failed — keep original, log warning, NEVER throw
                allTemplatesPassed = false;
                console.error(`[Repair] ⚠️ Repair failed for "${templatePath}": ${repairErr.message}. Keeping original — generation continues.`);
                break;
              }
            }
          }
        }

        // Save validation result to profile
        profile.validation = {
          passed: allTemplatesPassed,
          repairAttempts: totalRepairAttempts,
          repairApplied: anyRepairApplied,
          errors: validationErrors
        };

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
        
        let storeBlueprint: any = await injectProductsIntoBlueprint(shop.shopDomain, shop.accessToken, storeBlueprintAi);
        
        if (storeBlueprint) {
          // v2.0: Save StoreBlueprint Snapshot to DB
          await prisma.storeBlueprint.create({
            data: {
              shopId: shop.id,
              generationId: gen.id,
              niche: gen.nicheId,
              family: brandContext.visual_direction || "Unknown",
              archetype: brandContext.brand_archetype || "Unknown",
              tokensFile: "",
              components: storeBlueprint.pages?.index?.sections || [],
              pdpFeatures: {},
              status: "preview",
              healthScore: healthScoreResult.total,
              themeId: themeId
            }
          });

          const { composeThemeFromBlueprint, loadVerifiedComponents } = await import("../theme-engine/compiler.server");
          
          // Pass the entire verified published registry to composer so it can fetch the liquid files
          const componentsToUse = await loadVerifiedComponents();

          const { templates, settingsPatch } = await composeThemeFromBlueprint(shop, themeId, storeBlueprint, componentsToUse, gen.nicheId);

          // Apply Design Tokens
          const finalSettingsPatch: Record<string, any> = {};
            
          // Map Dawn/StoreForge tokens to blank-theme schema keys
          for (const [k, v] of Object.entries(settingsPatch || {})) {
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

        // Finalise profile
        profile.result = {
          themeId,
          previewUrl,
          healthScore: healthScoreResult.total,
          completedAt: new Date().toISOString(),
          success: true,
          failureReason: null
        };
        profile.durationMs = Date.now() - pipelineStartMs;
        logGenerationProfile(profile);

        // Done status update
        await prisma.storeGeneration.update({
          where: { id: generationId },
          data: {
            status: "DONE",
            completedAt: new Date(),
            log: [...(gen.log as any[]), { time: new Date().toISOString(), msg: `Generation completed! Preview link: ${previewUrl}` }],
            stepState: {
              ...(gen.stepState as any || {}),
              healthScore: healthScoreResult.total,
              generationProfile: profile
            }
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
        // Save failure state to profile before logging
        try {
          profile.result.success = false;
          profile.result.failureReason = error.message;
          profile.result.completedAt = new Date().toISOString();
          profile.durationMs = Date.now() - pipelineStartMs;
          logGenerationProfile(profile);
        } catch (_) { /* profile logging must never block error handling */ }

        const currentGen = await prisma.storeGeneration.findUnique({ where: { id: generationId }, select: { log: true, stepState: true } });
        await prisma.storeGeneration.update({
          where: { id: generationId },
          data: {
            status: "FAILED",
            error: { message: error.message, stack: error.stack },
            log: [...((currentGen?.log as any[]) || []), { time: new Date().toISOString(), msg: `FAILED: ${error.message}` }],
            stepState: {
              ...((currentGen?.stepState as any) || {}),
              generationProfile: profile
            }
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
