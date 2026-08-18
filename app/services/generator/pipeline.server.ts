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
import { ContentGenerationService } from "../core/ContentGenerationService";
import { analyzeCRO } from "../ai/cro-analyzer.server";
import { repairSectionJSON } from "../ai/repair-engine.server";
import { retrieveBestComponent } from "../theme-engine/retrieval.server";
import { injectProductsIntoBlueprint } from "../theme-engine/injector.server";
import { generateStoreBlueprint } from "../theme-engine/blueprint.server";
import { calculateHealthScore } from "../theme-engine/health.server";
import { validateSectionDependencies, validateTemplateStructure } from "../theme-engine/validators.server";
import { composeThemeFromBlueprint } from "../theme-engine/compiler.server";
import { loadNicheDesignTokens } from "../theme-engine/niche-tokens.server";
import { createNavigationAndPages } from "./navigation.server";
import { ImageAssignmentService } from "../theme-engine/image-assignment.server";
import { createGenerationProfile, logGenerationProfile, type ComponentSelection } from "./generation-profiler.server";
import fs from "fs/promises";
import path from "path";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 255, g: 255, b: 255 };
}

function getLuminance(r: number, g: number, b: number) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(hex1: string, hex2: string) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (lightest + 0.05) / (darkest + 0.05);
}

let generatorWorker: Worker | undefined;

export function initGeneratorWorker() {
  if (generatorWorker) return;

  generatorWorker = new Worker(
    "generator",
    async (job: Job) => {
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

        // Style family lock: the first resolved section — the hero — sets the
        // design family for the entire store. Every later lookup is constrained
        // to it, which is what makes the finished store read as one brand
        // instead of a set of individually-good but unrelated sections.
        let lockedFamily: string | undefined;

        // Store-wide uniqueness: a component used anywhere is never used again.
        //
        // Exclusion used to be scoped to a single page, and the global chrome had
        // no exclusion at all. The result was the same newsletter block appearing
        // on the homepage, the 404, the collection list, the about page and the
        // FAQ, and the same trust strip on the homepage, cart, about and contact
        // pages. A store that repeats itself reads as generated; a real theme
        // uses each design once.
        //
        // With 1,711 components and roughly 25 slots to fill there is no
        // shortage, so this almost never binds — but when a family genuinely runs
        // out of a type, an exact repeat is better than a missing section, so the
        // lookup retries without the uniqueness constraint and says so.
        const usedComponentIds = new Set<string>();

        /**
         * The single place a component is chosen. Every slot in the store —
         * homepage, page templates, global chrome — goes through here, so the
         * family lock and the uniqueness rule cannot be forgotten at one call
         * site the way they were before.
         */
        const resolveUnique = async (
          sectionType: string,
          label: string,
          extraExclude: string[] = []
        ) => {
          const query = {
            sectionType,
            brandArchetype: brandContext.brand_archetype,
            catalogIndustry: catalogContext.industry,
            catalogStyle: catalogContext.style,
            catalogVisualComplexity: catalogContext.visual_complexity,
            lockFamily: lockedFamily
          };

          // Tried in order, each giving up one guarantee. Earlier tiers produce
          // the better store; later ones exist so a slot is never left empty.
          // Uniqueness is given up last, because a store that repeats the same
          // block on five pages is the thing that reads as machine-made. A
          // section borrowed from a neighbouring family is far less noticeable
          // than the same newsletter three times.
          const attempts: Array<{ why: string; params: any }> = [
            { why: "", params: { ...query, exclude: [...usedComponentIds, ...extraExclude] } },
            {
              why: `no unused component in family "${lockedFamily ?? "any"}" — borrowing from another family to keep it unique`,
              params: { ...query, lockFamily: undefined, exclude: [...usedComponentIds, ...extraExclude] }
            },
            {
              why: `no unused component anywhere — reusing a design already in this store`,
              params: { ...query, exclude: extraExclude }
            }
          ];

          // The chrome and the page main slots are structural. A store with no
          // header, no footer or no cart drawer is broken, not merely plainer —
          // and that is exactly what the score threshold produced on a real run,
          // rejecting the best footer because it scored 45 against a floor of 50.
          // For these, any component beats none.
          const ESSENTIAL = new Set([
            "header", "footer", "announcement", "cart-drawer",
            "product-page", "collection-page"
          ]);
          if (ESSENTIAL.has(sectionType)) {
            attempts.push({
              why: `nothing cleared the score threshold — taking the best available so the store is not missing its ${sectionType}`,
              params: { ...query, lockFamily: undefined, exclude: extraExclude, minScore: 0 }
            });
          }

          let matched = null;
          for (const attempt of attempts) {
            matched = await retrieveBestComponent(attempt.params);
            if (matched?.componentId) {
              if (attempt.why) console.warn(`[Phase 5] ${label} "${sectionType}": ${attempt.why} — using ${matched.componentId}.`);
              break;
            }
          }

          if (!matched?.componentId) {
            console.warn(`[Phase 5] No component found for ${label} sectionType=${sectionType}`);
            return null;
          }

          if (!lockedFamily && matched.family) {
            lockedFamily = matched.family;
            console.log(`[Phase 5] Style family locked to "${lockedFamily}" by ${matched.componentId}`);
          }

          usedComponentIds.add(matched.componentId);
          return matched;
        };

        for (const sectionType of indexSectionTypes) {
          const matchedComponent = await resolveUnique(sectionType, "INDEX");
          if (matchedComponent) {
            resolvedSections.push({
              sectionType,
              componentId: matchedComponent.componentId,
              settings: {},
              // Carried so the generation profile can report it. Without this
              // the profile read `score=0` for every component, which made a
              // slot that barely scraped past the threshold indistinguishable
              // from a strong match.
              score: matchedComponent.score,
              breakdown: (matchedComponent as any).breakdown
            } as any);
            console.log(`[Phase 5] Resolved ${sectionType} -> ${matchedComponent.componentId} (Score: ${matchedComponent.score})`);
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

        // Resolve the product and collection page templates the same way as the
        // homepage. Without this the PDP and collection layouts in the registry
        // are never picked and every generated store falls back to the base theme.
        // Component types that are complete pages in their own right. A PDP
        // layout already contains the gallery, buy box, reviews and related
        // products; a collection layout already contains the banner, filters,
        // sort and grid. Anything appended below one renders a visible second
        // copy of the same page, so these are resolved exclusively.
        const FULL_PAGE_TYPES = new Set(["product-page", "collection-page"]);

        const resolvePage = async (sectionTypes: string[], label: string) => {
          const out: Array<{ sectionType: string; componentId: string; settings?: any }> = [];
          for (const sectionType of sectionTypes) {
            if (out.length && FULL_PAGE_TYPES.has(out[0].sectionType)) {
              console.warn(
                `[Phase 5] Skipping ${label} "${sectionType}" — "${out[0].sectionType}" is a full page layout and cannot be stacked on.`
              );
              continue;
            }
            const matched = await resolveUnique(sectionType, label, out.map(s => s.componentId));
            if (matched?.componentId) {
              out.push({ sectionType, componentId: matched.componentId, settings: {} });
              console.log(`[Phase 5] Resolved ${label} ${sectionType} -> ${matched.componentId}`);
            }
          }
          return out;
        };

        // Resolve every page the blueprint declares, not just product and
        // collection. Each key becomes `templates/<key>.json`; the supporting
        // pages append below the chassis `main-*` section their template already
        // carries, so the cart keeps its line items and search keeps its results.
        const resolvedPages: Record<string, Array<{ sectionType: string; componentId: string; settings?: any }>> = {};
        for (const [pageKey, sectionTypes] of Object.entries(generatedBlueprint.pages)) {
          if (pageKey === "index") continue; // already resolved above
          const sections = await resolvePage((sectionTypes as string[]) ?? [], pageKey.toUpperCase());
          if (sections.length > 0) resolvedPages[pageKey] = sections;
        }

        const productSections = resolvedPages.product ?? [];
        const collectionSections = resolvedPages.collection ?? [];
        console.log(
          `[Phase 5] Pages resolved: ${Object.entries(resolvedPages)
            .map(([k, v]) => `${k}(${v.length})`)
            .join(", ") || "none"}`
        );

        const globalComponents: string[] = [];
        const globalSectionTypes = generatedBlueprint.globals ?? ["announcement", "header", "footer"];

        for (const sectionType of globalSectionTypes) {
          const matchedComponent = await resolveUnique(sectionType, "GLOBAL");
          if (matchedComponent) {
            globalComponents.push(matchedComponent.componentId);
            console.log(`[Phase 5] Resolved GLOBAL ${sectionType} -> ${matchedComponent.componentId}`);
          }
        }

        // Prove the uniqueness rule actually held, rather than assuming it did.
        // Counted from what was resolved, not from the set that enforced it — a
        // check that reads the same structure it is validating proves nothing.
        {
          const everySelection = [
            ...resolvedSections.map(s => s.componentId),
            ...Object.values(resolvedPages).flatMap(sections => sections.map(s => s.componentId)),
            ...globalComponents
          ];
          const seen = new Map<string, number>();
          for (const id of everySelection) seen.set(id, (seen.get(id) || 0) + 1);
          const repeated = [...seen.entries()].filter(([, n]) => n > 1);

          console.log(
            `[Phase 5] Store composed from ${seen.size} distinct components across ${everySelection.length} slots` +
            `${lockedFamily ? ` — family "${lockedFamily}"` : ""}.`
          );
          if (repeated.length > 0) {
            console.warn(
              `[Phase 5] ${repeated.length} component(s) used more than once: ` +
              repeated.map(([id, n]) => `${id} x${n}`).join(", ")
            );
          }
        }
        // 6. BRAND EXTRACTION SERVICE (Vision API extraction mapping if image payload exists)
        let extractedColors = null;
        if (aiData?.logoBase64) {
          const rawExtracted = await BrandExtractionService.extractBrandAesthetics(aiData.logoBase64, "image/jpeg", catalogContext.industry);
          if (rawExtracted.extractionFailed) {
            console.warn(`\n\n======================================================`);
            console.warn(`[WARNING] Brand Extraction Failed! Using fallback for: ${catalogContext.industry}`);
            console.warn(`======================================================\n\n`);
          }
          extractedColors = BrandExtractionService.mapToTokens(rawExtracted, false); // Light variant default
        }

        // Where colour comes from, in order of confidence:
        //   1. the merchant's own logo, read by the vision model
        //   2. the brand context inferred from their catalogue
        //   3. the niche's design tokens
        //
        // Step 3 used to be plain white with near-black text, which is why every
        // store without a logo came out looking like the same blank template. A
        // jewellery store now falls back to warm white and antique gold, a
        // streetwear store to white and signal red.
        const nicheTokens = loadNicheDesignTokens(gen.nicheId, catalogContext.industry);
        if (nicheTokens) {
          console.log(`[Design Tokens] Niche palette for "${nicheTokens.source}": ${nicheTokens.background} / ${nicheTokens.text} / ${nicheTokens.accent}`);
        }

        const fallbackSettings = {
          colors_background_1: brandContext.colors?.background || nicheTokens?.background || "#FFFFFF",
          colors_accent_1: brandContext.colors?.primary || nicheTokens?.accent || "#111111",
          colors_accent_2: brandContext.colors?.accent || nicheTokens?.accent || "#C9A84C",
          colors_text_1: brandContext.colors?.text || nicheTokens?.text || "#111111",
          colors_surface: nicheTokens?.surface || "#F4F4F4",
          fontHeading: brandContext.typography?.heading || nicheTokens?.fontHeading || "Inter",
          fontBody: brandContext.typography?.body || nicheTokens?.fontBody || "Inter",
          button_style: brandContext.theme_tokens?.button_style || nicheTokens?.button_style || "rounded",
          card_style: brandContext.theme_tokens?.card_style || nicheTokens?.card_style || "soft",
          section_density: brandContext.theme_tokens?.section_density || nicheTokens?.section_density || "airy"
        };

        const baseSettings: Record<string, any> = extractedColors
          ? { ...fallbackSettings, ...extractedColors }
          : { ...fallbackSettings };

        // Classify the merchant's own photographs so the compiler can place them
        // into section image slots.
        //
        // These URLs were already being collected and counted — one run logged
        // "imageUrls collected: 10" — but nothing consumed them, so every image
        // slot stayed empty and Shopify drew its placeholder line art instead.
        const merchantImageUrls: string[] = (catalogContext as any).sampleImageUrls || [];
        if (merchantImageUrls.length > 0) {
          try {
            const classified = await ImageAssignmentService.classifyImages(merchantImageUrls);
            baseSettings.classifiedImages = classified;
            const byRole = classified.reduce((acc: Record<string, number>, c: any) => {
              acc[c.role] = (acc[c.role] || 0) + 1;
              return acc;
            }, {});
            console.log(
              `[Images] Classified ${classified.length} of ${merchantImageUrls.length} merchant image(s): ` +
              Object.entries(byRole).map(([r, n]) => `${r}=${n}`).join(", ")
            );
          } catch (imgErr: any) {
            // Falling back to the niche placeholder pack is handled downstream;
            // a classification failure must not stop the store being built.
            console.warn(`[Images] Classification failed: ${imgErr.message}. Falling back to the niche placeholder pack.`);
            baseSettings.classifiedImages = [];
          }
        } else {
          console.warn(`[Images] The catalogue returned no image URLs — sections will use the niche placeholder pack.`);
          baseSettings.classifiedImages = [];
        }

        // Contrast is no longer repaired by discarding the brand. The palette
        // builder in the compiler nudges a failing colour toward black or white
        // in small steps until it clears WCAG, which keeps the hue — an accent
        // that is slightly too light becomes a deeper version of itself instead
        // of turning into #111111. This log is left in place so a weak brand
        // pairing is still visible in the generation record.
        const contrastRatio = getContrast(baseSettings.colors_background_1, baseSettings.colors_text_1);
        if (contrastRatio < 4.5) {
          console.warn(
            `[Color Guard] Brand background ${baseSettings.colors_background_1} and text ${baseSettings.colors_text_1} ` +
            `contrast at only ${contrastRatio.toFixed(2)}:1. The palette builder will darken or lighten the text to reach 4.5:1.`
          );
        }

        const storeBlueprintAi = {
          pages: {
            "index": { sections: resolvedSections },
            ...Object.fromEntries(
              Object.entries(resolvedPages).map(([pageKey, sections]) => [pageKey, { sections }])
            )
          },
          settings: baseSettings,
          globalComponents
        };
        console.log("Store Blueprint assembled with sections:", resolvedSections.length);

        // 9b. GENERATE & INJECT NICHE COPY (SECTION INSTANCE KEYED)
        await updateStatus("INSTALLING_THEME", "Crafting culturally tailored Indian D2C copy...");
        
        let copyResult: any;
        let injectionSuccess = false;
        let generationAttempts = 0;
        
        while (!injectionSuccess && generationAttempts < 3) {
          generationAttempts++;
          try {
            copyResult = await ContentGenerationService.generateStoreContent({
              shopDomain: shop.shopDomain,
              storeName: shop.name || "Store",
              industry: catalogContext.industry || "General",
              brandArchetype: brandContext.brand_archetype,
              tone: brandContext.tone_of_voice,
              blueprint: storeBlueprintAi,
              catalogSummary: {
                totalProducts: catalogContext.productCount || 10,
                topCategories: catalogContext.categories || [],
                priceRange: catalogContext.priceRange,
                heroProduct: catalogContext.heroProduct,
                topProducts: catalogContext.topProducts || []
              }
            });
            await ContentGenerationService.injectContentIntoBlueprint(storeBlueprintAi, copyResult.content, resolvedSections);
            injectionSuccess = true;
          } catch (err: any) {
             console.error(`[Pipeline] Content generation/injection error on attempt ${generationAttempts}: ${err.message}`);
             if (copyResult?.cacheKey) {
                console.log(`[Pipeline] Flushing cache key ${copyResult.cacheKey} due to compliance violation.`);
                const { redis } = await import("../redis.server.js");
                await redis.del(copyResult.cacheKey);
             }
             if (generationAttempts >= 3) {
                throw new Error(`Failed to inject AI copy into blueprint after 3 attempts: ${err.message}`);
             }
          }
        }
        
        console.log("[Pipeline] Store content generated and injected into storeBlueprintAi. Fallback used:", copyResult?.isFallback);

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
          await importCatalog(shop, niche.demoCatalogUrl, gen.nicheId);
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

          const { templates, settingsPatch, filesToUpload } = await composeThemeFromBlueprint(shop, themeId, storeBlueprint, componentsToUse, gen.nicheId);

          // Automated Integrity Verification
          await updateStatus("INSTALLING_THEME", "Verifying deployed theme integrity...");
          const { scanAssets } = await import("../theme-engine/index");
          const assetScan = await scanAssets(shop, themeId);
          const remoteKeys = new Set(assetScan.files.map((f: any) => f.key));
          const expectedKeys = Object.keys(filesToUpload);

          const missingFiles = expectedKeys.filter(k => !remoteKeys.has(k));
          const extraneousFiles = [...remoteKeys].filter(k => !filesToUpload.hasOwnProperty(k));

          if (missingFiles.length > 0 || extraneousFiles.length > 0) {
            throw new Error(`Theme integrity verification failed. Missing files: ${missingFiles.length > 0 ? missingFiles.join(", ") : 'none'}. Extraneous files: ${extraneousFiles.length > 0 ? extraneousFiles.join(", ") : 'none'}. Expected ${expectedKeys.length} files, found ${remoteKeys.size} remote files.`);
          }
          console.log(`[Pipeline] Theme integrity verified: Exact match of ${expectedKeys.length} files.`);

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

        // 15.5 NAVIGATION AND SUPPORTING PAGES
        //
        // Runs after the theme is uploaded, because the pages it creates point
        // at `templates/page.about.json` and friends, which only exist once the
        // compiler has written them.
        //
        // This step used to be missing entirely: `createNavigationAndPages` was
        // defined but had no call site anywhere in the app. Generated stores
        // therefore had no About, Contact or FAQ page, and an empty main menu —
        // the designed page templates were uploaded and then never reachable.
        await updateStatus("CREATING_PAGES", "Creating store pages and navigation...");
        try {
          const navResult = await createNavigationAndPages(shop, niche);
          console.log(
            `[Pipeline] Navigation ready: ${navResult.pages.length} page(s), ${navResult.collections} collection link(s).`
          );
        } catch (navErr: any) {
          // A store missing its About page is worth shipping; one missing its
          // theme is not. Never fail generation here.
          console.warn(`[Pipeline] Navigation setup failed: ${navErr.message}. Theme is unaffected.`);
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
