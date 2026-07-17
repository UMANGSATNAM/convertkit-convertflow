import prisma from "../app/db.server.js";
import { BrandExtractionService } from "../app/services/core/BrandExtractionService.js";
import { generateStoreBlueprint } from "../app/services/theme-engine/blueprint.server.js";
import { retrieveBestComponent } from "../app/services/theme-engine/retrieval.server.js";
import { compileTheme } from "../app/services/theme-engine/compiler.server.js";
import { installTheme, upsertThemeFilesBatched, publishTheme } from "../app/services/theme-engine/index.js";
import { analyzeCatalog } from "../app/services/ai/catalog-analyzer.server.js";
import { analyzeVisualAssets } from "../app/services/ai/visual-analyzer.server.js";
import { ContentGenerationService } from "../app/services/core/ContentGenerationService.js";
import { restRequest } from "../app/services/shopify-api.server.js";
import { ImageAssignmentService } from "../app/services/theme-engine/image-assignment.server.js";
import { NICHE_PLACEHOLDER_PACKS } from "../app/data/placeholders/index.js";

async function main() {
  console.log("================================================================================");
  console.log("  REAL END-TO-END PIPELINE RUN: PERI-BEAUTY (DNA ORDER & FULL COMPONENT RESOLUTION)");
  console.log("================================================================================\n");

  try {
    // 1. Fetch Shop record from DB
    const shop = await prisma.shop.findFirst({
      where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" }
    });

    if (!shop) {
      throw new Error("Shop peri-beauty-bcuauhsj.myshopify.com not found in database!");
    }
    console.log(`[DB] Found Shop: ${shop.shopDomain} (ID: ${shop.id})`);

    // 1.1 Fetch Real Catalog & Visual Intelligence from Shopify
    console.log("\n--- PIPELINE STEP 1.1: Fetch Real Catalog & Visual Intelligence from Shopify ---");
    const realCatalog = await analyzeCatalog(shop.shopDomain, shop.accessToken || "");
    const visualContext = await analyzeVisualAssets(shop.shopDomain, realCatalog.sampleImageUrls || []);
    console.log(`[Catalog Intelligence] Retrieved ${realCatalog.sampleImageUrls.length} real product images, ${realCatalog.rawProducts?.length || 0} products, ${realCatalog.rawCollections?.length || 0} collections.`);

    // 2. Prepare Brand & Catalog Context for Peri-Beauty (Small catalog + High price -> Luxury Editorial)
    const catalogContext = {
      ...realCatalog,
      industry: "beauty",
      positioning: "luxury",
      style: "luxury",
      price_band: "high",
      catalog_strength: 85,
      product_count: realCatalog.rawProducts?.length || 12,
      collection_count: realCatalog.rawCollections?.length || 3,
      dominant_categories: ["skincare", "serums", "creams"],
      catalog_depth: "medium",
      visual_complexity: "minimal"
    } as any;

    const brandContext = {
      brand_name: "Peri-Beauty",
      brand_archetype: "editorial_luxury",
      trust_level: "high",
      colors: {
        primary: "#800020",
        secondary: "#1A1A1A",
        background: "#FAF9F6",
        text: "#111111",
        accent: "#C9002B"
      },
      typography: {
        heading: "Playfair Display",
        body: "Inter"
      },
      theme_tokens: {
        button_style: "rounded",
        card_style: "soft",
        section_density: "airy"
      }
    } as any;

    // 3. Step 1 of Pipeline: BrandExtractionService Boundary Token Mapping
    console.log("\n--- PIPELINE STEP 1: Brand Extraction Service Mapping ---");
    const extractedPayload = {
      archetype: "LUXURY_EDITORIAL",
      tone: "Sophisticated, warm, premium beauty",
      colors: brandContext.colors,
      typography: {
        headingFont: "Playfair Display",
        bodyFont: "Inter"
      }
    };
    const tokensFromExtraction = BrandExtractionService.mapToTokens(extractedPayload, false);
    console.log("[BrandExtractionService.mapToTokens()] Output boundary tokens:");
    console.log(JSON.stringify(tokensFromExtraction, null, 2));

    // 4. Step 2 of Pipeline: Generate Blueprint using DNA-driven section order
    console.log("\n--- PIPELINE STEP 2: Generate Blueprint via generateStoreBlueprint() ---");
    const rawBlueprint = generateStoreBlueprint(catalogContext, brandContext);
    const indexSectionTypes = rawBlueprint.pages.index;
    console.log(`[Blueprint Generator] DNA-driven index sections emitted (${indexSectionTypes.length}):`);
    console.log(JSON.stringify(indexSectionTypes, null, 2));

    // 5. Step 3 of Pipeline: Component Retrieval Engine (Exact Ranking & Resolution)
    console.log("\n--- PIPELINE STEP 3: Component Retrieval Engine Resolution ---");
    const resolvedSections: Array<{ sectionType: string; componentId: string; settings?: any }> = [];
    
    for (const sectionType of indexSectionTypes) {
      const matchedComponent = await retrieveBestComponent({
        sectionType: sectionType,
        brandArchetype: brandContext.brand_archetype,
        catalogIndustry: catalogContext.industry,
        catalogStyle: catalogContext.style,
        catalogVisualComplexity: catalogContext.visual_complexity,
        exclude: resolvedSections.map(s => s.componentId)
      });

      if (matchedComponent && matchedComponent.componentId) {
        resolvedSections.push({
          sectionType,
          componentId: matchedComponent.componentId,
          settings: {}
        });
        console.log(`✅ Resolved [${sectionType}] -> ${matchedComponent.componentId} (Score: ${matchedComponent.score})`);
      } else {
        console.warn(`⚠️ No approved component found for sectionType=${sectionType}`);
      }
    }

    // Also retrieve global header and footer
    const globalComponents: Array<{ sectionType: string; componentId: string; settings?: any }> = [];
    for (const sectionType of ["header", "footer"]) {
      const matchedComponent = await retrieveBestComponent({
        sectionType,
        brandArchetype: brandContext.brand_archetype,
        catalogIndustry: catalogContext.industry,
        catalogStyle: catalogContext.style,
        catalogVisualComplexity: catalogContext.visual_complexity
      });
      if (matchedComponent && matchedComponent.componentId) {
        globalComponents.push({
          sectionType,
          componentId: matchedComponent.componentId,
          settings: {}
        });
        console.log(`✅ Resolved GLOBAL [${sectionType}] -> ${matchedComponent.componentId} (Score: ${matchedComponent.score})`);
      }
    }

    // Build final comprehensive blueprint for compiler
    const fullBlueprint = {
      pages: {
        index: {
          sections: resolvedSections
        }
      },
      globalSections: globalComponents,
      settings: {
        ...tokensFromExtraction,
        designDirection: "LUXURY",
        card_style: "soft",
        button_style: "rounded"
      },
      catalogProfile: catalogContext
    } as any;

    // 5.5 Step 3.5 of Pipeline: Image & Content Assignment Engine (Dynamic Role-Based Wiring)
    console.log("\n--- PIPELINE STEP 3.5: Image & Content Assignment Engine ---");
    
    const candidateUrls = realCatalog.sampleImageUrls || [];
    const classifiedImages = await ImageAssignmentService.classifyImages(candidateUrls);
    console.log(`[ImageAssignmentService] Classify complete. Roles:`, classifiedImages.map(c => `${c.role} (${c.qualityScore})`));

    const usedImageUrls = new Set<string>();

    const rawProducts = realCatalog.rawProducts && realCatalog.rawProducts.length > 0
      ? realCatalog.rawProducts.filter(p => !p.title?.toLowerCase().includes("gift") && !p.vendor?.toLowerCase().includes("snowboard"))
      : [
          { title: "Luminous Cellular Elixir", handle: "luminous-cellular-elixir", price: 4500, imageUrl: fallbackBeautyImages[1] },
          { title: "Botanical Night Repair Cream", handle: "botanical-night-repair-cream", price: 3800, imageUrl: fallbackBeautyImages[2] },
          { title: "Antioxidant Radiance Serum", handle: "antioxidant-radiance-serum", price: 4200, imageUrl: fallbackBeautyImages[3] }
        ];

    // Assign Images & Real Product Handles by slot role
    for (const sec of fullBlueprint.pages.index.sections) {
      if (!sec.settings) sec.settings = {};
      
      const activeNiche = (catalogContext.industry as any) || "beauty";
      if (sec.componentId === "hero-luxury-editorial-v1") {
        sec.settings.bg_image = ImageAssignmentService.getBestMatchForRole(classifiedImages, ["hero_lifestyle", "lookbook_editorial"], usedImageUrls, activeNiche);
        console.log(`🖼️ Assigned Hero bg_image: ${sec.settings.bg_image || "(Omitted for clean gradient fallback)"}`);
      }
      else if (sec.componentId === "grid-featured-lookbook-v1") {
        sec.settings.image = ImageAssignmentService.getBestMatchForRole(classifiedImages, ["lookbook_editorial", "hero_lifestyle"], usedImageUrls, activeNiche);
        sec.blocks = [
          { id: "hotspot-1", type: "hotspot", settings: { top: 38, left: 42, product: rawProducts[0]?.handle || "" } },
          { id: "hotspot-2", type: "hotspot", settings: { top: 65, left: 58, product: rawProducts[1]?.handle || rawProducts[0]?.handle || "" } }
        ];
        console.log(`🖼️ Assigned Lookbook image: ${sec.settings.image} + 2 product hotspots (${rawProducts[0]?.handle}, ${rawProducts[1]?.handle})`);
      }
      else if (sec.componentId === "story-materials-showcase-v1") {
        sec.blocks = [
          { id: "mat-1", type: "material", settings: { image: ImageAssignmentService.getBestMatchForRole(classifiedImages, ["texture_ingredient", "lookbook_editorial"], usedImageUrls, activeNiche), title: "Cold-Pressed Botanical Elixirs", text: "Distilled at low temperatures to preserve living antioxidants, essential lipids, and cellular vitality." } },
          { id: "mat-2", type: "material", settings: { image: ImageAssignmentService.getBestMatchForRole(classifiedImages, ["texture_ingredient", "lookbook_editorial"], usedImageUrls, activeNiche), title: "Ethically Sourced Bio-Actives", text: "Formulated with clinically proven bio-compatible compounds harvested through sustainable agricultural partnerships." } },
          { id: "mat-3", type: "material", settings: { image: ImageAssignmentService.getBestMatchForRole(classifiedImages, ["texture_ingredient", "lookbook_editorial"], usedImageUrls, activeNiche), title: "UV-Protective Glass Vessels", text: "Housed in custom violet glass bottles designed to shield delicate botanical formulas from light degradation." } }
        ];
        console.log(`🖼️ Assigned Craftsmanship materials showcase 3 blocks with role-matched texture/ingredient shots`);
      }
      else if (sec.componentId === "social-proof-press-v1") {
        sec.blocks = [
          { id: "logo-1", type: "logo", settings: { text: "VOGUE" } },
          { id: "logo-2", type: "logo", settings: { text: "FORBES" } },
          { id: "logo-3", type: "logo", settings: { text: "GQ" } },
          { id: "logo-4", type: "logo", settings: { text: "ELLE" } },
          { id: "logo-5", type: "logo", settings: { text: "VANITY FAIR" } }
        ];
        console.log(`📰 Assigned 5 clean press logos (no duplicates)`);
      }
      else if (sec.componentId === "testimonials-luxury-marquee-v1") {
        // Blocks will be dynamically generated by ContentGenerationService
        console.log(`✨ Testimonials luxury marquee blocks will be generated dynamically`);
      }
      else if (sec.componentId === "faq_luxury_v1") {
        // Blocks will be dynamically generated by ContentGenerationService
        console.log(`❔ FAQ luxury blocks will be generated dynamically`);
      }
    }

    // Invoke ContentGenerationService
    console.log("\n--- PIPELINE STEP 3.6: ContentGenerationService (Dynamic Claude Copy) ---");
    const contentInput = {
      shopDomain: shop.shopDomain,
      storeName: "Peri-Beauty",
      industry: catalogContext.industry,
      brandArchetype: brandContext.brand_archetype,
      tone: brandContext.tone_of_voice || "Elegant & Scientific",
      blueprint: fullBlueprint,
      catalogSummary: {
        totalProducts: catalogContext.product_count || 12,
        topCategories: catalogContext.dominant_categories || ["skincare", "serums"],
        priceRange: `₹${catalogContext.priceRange?.min || 1500} - ₹${catalogContext.priceRange?.max || 6500}`,
        heroProduct: rawProducts[0]?.title || "Luminous Cellular Elixir",
        topProducts: rawProducts.map(p => p.title)
      }
    };

    const copyResult = await ContentGenerationService.generateStoreContent(contentInput);
    console.log("\n--- RAW CLAUDE COPY GENERATION JSON RESULT ---");
    console.log(JSON.stringify(copyResult.content, null, 2));
    
    ContentGenerationService.injectContentIntoBlueprint(fullBlueprint, copyResult.content);
    console.log(`✅ Injected AI generated copy into ${Object.keys(copyResult.content).length} sections!`);

    // 6. Step 4 of Pipeline: Deterministic Theme Compiler
    console.log("\n--- PIPELINE STEP 4: Compile Theme Bundle via compileTheme() ---");
    const compiled = await compileTheme(fullBlueprint, undefined as any, catalogContext);
    const filesToUpload = compiled.filesToUpload;
    
    // Inject active niche placeholder pack images as theme assets
    const activeNiche = (catalogContext.industry as any) || "beauty";
    console.log(`[Compiler] Injecting ${activeNiche} niche placeholder images into theme assets...`);
    const nichePack = NICHE_PLACEHOLDER_PACKS[activeNiche] || NICHE_PLACEHOLDER_PACKS["beauty"];
    for (const img of nichePack) {
      // Shopify API accepts URLs for binary assets, so we pass the URL directly
      filesToUpload[`assets/${img.id}`] = img.url;
    }

    const totalFiles = Object.keys(filesToUpload).length;
    console.log(`[Compiler] Compilation finished successfully! Total bundle file count: ${totalFiles}`);
    if (totalFiles <= 101) {
      console.warn(`[WARNING] Bundle file count (${totalFiles}) is not >101. Checking why...`);
    } else {
      console.log(`🎉 SUCCESS! Bundle expanded beyond 101 files to ${totalFiles} files due to newly resolved components and injected assets!`);
    }

    // 7. Step 5 of Pipeline: Install NEW theme on Shopify & Upload Files
    console.log("\n--- PIPELINE STEP 5: Create Fresh Theme & Upload Bundle ---");
    try {
      const themesData = await restRequest(shop.shopDomain, shop.accessToken, "GET", "themes.json");
      const testThemes = (themesData.themes || []).filter((t: any) => t.role !== "main" && t.name.includes("Peri-Beauty v2.0 Live"));
      if (testThemes.length > 3) {
        console.log(`[Shopify] Pruning ${testThemes.length - 1} old test themes to avoid 20-theme store limit...`);
        for (const t of testThemes.slice(1)) {
          try { await restRequest(shop.shopDomain, shop.accessToken, "DELETE", `themes/${t.id}.json`); } catch (e) {}
        }
      }
    } catch (e) {}

    const themeName = `Peri-Beauty v2.0 Live [Luxury E2E]`;
    console.log(`[Shopify] Calling installTheme() to create NEW theme: "${themeName}"...`);
    const { themeId } = await installTheme(shop, themeName, "");
    console.log(`[Shopify] Created fresh unpublished theme ID: ${themeId} (AVOIDING old test-data 162683617509!)`);

    console.log(`[Shopify] Uploading ${totalFiles} compiled files to fresh theme ID ${themeId}...`);
    await upsertThemeFilesBatched(shop, themeId, filesToUpload);
    console.log(`[Shopify] ✅ All ${totalFiles} files uploaded successfully to theme ${themeId}!`);

    console.log(`[Shopify] Publishing theme ${themeId} as MAIN theme...`);
    await publishTheme(shop, themeId.toString());
    console.log(`[Shopify] ✅ Theme ${themeId} published LIVE!`);

    // 8. Output Proof Pack
    console.log("\n================================================================================");
    console.log("🔴 PROOF PACK & INSPECTION FOR USER");
    console.log("================================================================================");
    
    console.log("\n1. dedupe verdicts / token outputs:");
    console.log("Extracted keys mapped to CSS resolver keys:", Object.keys(tokensFromExtraction));
    console.log(`fontHeading: "${tokensFromExtraction.fontHeading}", fontBody: "${tokensFromExtraction.fontBody}"`);

    console.log("\n2. Exact components resolved and included in theme bundle:");
    resolvedSections.concat(globalComponents).forEach((s, idx) => {
      console.log(`   ${idx + 1}. [${s.sectionType}] -> ${s.componentId}`);
    });

    console.log("\n3. Exact generated assets/niche-tokens.css in bundle:");
    console.log("--------------------------------------------------------------------------------");
    console.log(filesToUpload["assets/niche-tokens.css"]);
    console.log("--------------------------------------------------------------------------------");

    console.log("\n4. Button & Text Color Hierarchy checks:");
    const baseTokensCss = filesToUpload["assets/base-tokens.css"] || "";
    const binMatch = baseTokensCss.match(/\.shopify-payment-button__button--unbranded[\s\S]*?\}/);
    console.log("   - Buy-It-Now button rule:", binMatch ? binMatch[0].trim() : "Not found!");

    const mainProductLiquid = filesToUpload["sections/main-product.liquid"] || "";
    const atcMatch = mainProductLiquid.match(/\.btn-add\s*\{[\s\S]*?\}/);
    console.log("   - Add-To-Cart (.btn-add) rule:", atcMatch ? atcMatch[0].trim() : "Not found!");

    console.log("\n================================================================================");
    console.log(`✅ RUN COMPLETE. New Theme ID: ${themeId} (${themeName})`);
    console.log("================================================================================\n");

  } catch (err: any) {
    console.error(`[Fatal Error in Pipeline Run] ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  }
}

main();
