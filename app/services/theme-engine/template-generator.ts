import { StoreBlueprintData } from "./compiler.server";
import { ComponentRegistry } from "@prisma/client";
import { loadVerifiedComponents } from "./compiler.server";
import { ValidationError, validateTemplateStructure, validateSectionDependencies } from "./validators.server";
import path from "path";

/**
 * Stage 3: Component Template Generator
 * 
 * Dynamically generates Shopify JSON templates (e.g. index.json, product.json, collection.json)
 * based on the architectural blueprint.
 * 
 * Rules enforced:
 * 1. SSOT Compliance: Only loads components via `loadVerifiedComponents()` or verified registry list.
 * 2. Chassis Base-Theme Safety: Mutates templates only in the in-memory bundle (`filesToUpload`),
 *    preserving disk chassis files.
 * 3. Mandatory Primary Section Preservation: Ensures `main-product` is preserved on `product` page
 *    and `main-collection` on `collection` page.
 * 4. Deterministic Keys: Uses `${componentId}-${counter}` format for all appended sections.
 * 5. Child Block Support: Constructs `blocks` and `block_order` for nested block configurations.
 */
function sanitizeRichtextSettings(settings: Record<string, any>, compId: string): Record<string, any> {
  if (!settings || typeof settings !== "object") return settings;
  const sanitized: Record<string, any> = { ...settings };
  const RICHTEXT_KEYS = ["subtext", "quote", "richtext", "content"];
  const isBrandStory = compId.includes("story") || compId.includes("brand-story");
  
  for (const [k, v] of Object.entries(sanitized)) {
    if (typeof v === "string" && v.trim().length > 0) {
      const isKnownRichtextKey = RICHTEXT_KEYS.includes(k) || (isBrandStory && k === "text");
      if (isKnownRichtextKey && !/^\s*<(p|ul|ol|h[1-6])/i.test(v)) {
        sanitized[k] = `<p>${v.trim()}</p>`;
      }
    }
  }
  return sanitized;
}

export async function generateTemplates(
  blueprint: StoreBlueprintData,
  filesToUpload: Record<string, string>,
  registryComponents?: ComponentRegistry[]
): Promise<ComponentRegistry[]> {
  const components = registryComponents || await loadVerifiedComponents();
  const usedComponents: ComponentRegistry[] = [];

  const pages = blueprint.pages || {};

  for (const [pageHandle, pageData] of Object.entries(pages)) {
    const templatePath = `templates/${pageHandle}.json`;
    let templateJson: any;

    // Load base chassis template from filesToUpload if present
    if (filesToUpload[templatePath]) {
      try {
        templateJson = JSON.parse(filesToUpload[templatePath]);
      } catch (err: any) {
        throw new ValidationError(
          `[TemplateGenerator] Invalid JSON in base chassis template "${templatePath}": ${err.message}`
        );
      }
    } else {
      templateJson = { sections: {}, order: [] };
    }

    const newSections: Record<string, any> = {};
    const newOrder: string[] = [];

    // Some registry components are entire pages rather than blocks on a page. A
    // `product-page` component contains the gallery, buy box, variant picker,
    // sticky add-to-cart, reviews and related products all by itself.
    //
    // When the blueprint resolves one of those, it must REPLACE the chassis
    // `main-product` section, not sit below it. Appending it instead is what
    // rendered two complete, differently-designed product pages stacked on one
    // URL — the chassis PDP followed by the designed one.
    //
    // The component is looked up by sectionType rather than by an id convention
    // so that renaming a component cannot silently reintroduce the duplicate.
    const sectionsList: any[] = pageData.sections || [];
    const consumedAsMain = new Set<string>();

    const findFullPageComponent = (wantedType: string) => {
      for (const section of sectionsList) {
        if (!section.componentId) continue;
        const comp = components.find(c => c.componentId === section.componentId);
        if (comp && (comp as any).sectionType === wantedType) return { section, comp };
      }
      return null;
    };

    // Rule 3: Ensure mandatory primary chassis sections are preserved or initialized
    if (pageHandle === "product") {
      let mainKey = "main";
      let mainSection = null;
      if (templateJson.sections && templateJson.order) {
        for (const key of templateJson.order) {
          const sec = templateJson.sections[key];
          if (sec && (sec.type === "main-product" || key === "main")) {
            mainKey = key;
            mainSection = sec;
            break;
          }
        }
      }
      if (!mainSection) {
        mainSection = {
          type: "main-product",
          // Every block type below must be declared in the {% schema %} of
          // base-theme/sections/main-product.liquid, or ProductValidator
          // rejects the generated template.
          blocks: {
            breadcrumbs: { type: "breadcrumbs", settings: {} },
            vendor: { type: "vendor", settings: {} },
            title: { type: "title", settings: {} },
            rating: { type: "rating", settings: {} },
            short_desc: { type: "short_desc", settings: {} },
            product_bullets: { type: "product_bullets", settings: {} },
            price: { type: "price", settings: {} },
            variant_picker: { type: "variant_picker", settings: { picker_type: "button" } },
            stock_status: { type: "stock_status", settings: {} },
            quantity_selector: { type: "quantity_selector", settings: {} },
            buy_buttons: { type: "buy_buttons", settings: { show_dynamic_checkout: true } },
            free_shipping_bar: { type: "free_shipping_bar", settings: {} },
            pincode_checker: { type: "pincode_checker", settings: {} },
            key_benefits: { type: "key_benefits", settings: {} },
            spec_tiles: { type: "spec_tiles", settings: {} },
            trust_badges: { type: "trust_badges", settings: {} },
            tabs: { type: "tabs", settings: {} },
            reviews_section: { type: "reviews_section", settings: {} }
          },
          block_order: [
            "breadcrumbs", "vendor", "title", "rating", "short_desc",
            "product_bullets", "price", "variant_picker", "stock_status",
            "quantity_selector", "buy_buttons", "free_shipping_bar",
            "pincode_checker", "key_benefits", "spec_tiles", "trust_badges",
            "tabs", "reviews_section"
          ],
          settings: {
            enable_sticky_info: true,
            enable_image_zoom: true
          }
        };
      }
      if (pageData.mainSectionType || pageData.mainComponentId) {
        mainSection.type = pageData.mainSectionType || pageData.mainComponentId;
      }

      // A designed PDP from the library takes over the main slot entirely. It
      // carries no chassis blocks because it is not block-based — every part of
      // the buy box is built into its own Liquid.
      const fullPdp = findFullPageComponent("product-page");
      if (fullPdp) {
        consumedAsMain.add(fullPdp.section.componentId);
        if (!usedComponents.some(c => c.componentId === fullPdp.comp.componentId)) {
          usedComponents.push(fullPdp.comp);
        }
        mainSection = {
          type: fullPdp.comp.componentId,
          settings: sanitizeRichtextSettings(fullPdp.section.settings || {}, fullPdp.comp.componentId)
        };
        console.log(`[TemplateGenerator] product template main slot -> ${fullPdp.comp.componentId} (replaces main-product chassis)`);
      }

      newSections[mainKey] = mainSection;
      newOrder.push(mainKey);
    } else if (pageHandle === "collection") {
      let mainKey = "main";
      let mainSection = null;
      if (templateJson.sections && templateJson.order) {
        for (const key of templateJson.order) {
          const sec = templateJson.sections[key];
          if (sec && (sec.type === "main-collection" || key === "main")) {
            mainKey = key;
            mainSection = sec;
            break;
          }
        }
      }
      if (!mainSection) {
        mainSection = {
          type: "main-collection",
          settings: {
            products_per_page: 16,
            enable_filtering: true,
            enable_sorting: true
          }
        };
      }
      // A designed collection layout takes over the main slot, exactly as a
      // designed PDP does on the product template.
      //
      // These sections originally capped their grid with `limit:` and had no
      // pagination, which would have truncated the catalogue — so they were kept
      // off this template. They now wrap their grid in `{% paginate %}` and fall
      // back to the collection the shopper is on, so they are real collection
      // pages and belong here.
      const fullCollection = findFullPageComponent("collection-page");
      if (fullCollection) {
        consumedAsMain.add(fullCollection.section.componentId);
        if (!usedComponents.some(c => c.componentId === fullCollection.comp.componentId)) {
          usedComponents.push(fullCollection.comp);
        }
        mainSection = {
          type: fullCollection.comp.componentId,
          settings: sanitizeRichtextSettings(fullCollection.section.settings || {}, fullCollection.comp.componentId)
        };
        console.log(`[TemplateGenerator] collection template main slot -> ${fullCollection.comp.componentId} (replaces main-collection chassis)`);
      }

      newSections[mainKey] = mainSection;
      newOrder.push(mainKey);
    } else {
      // Every other template — cart, search, 404, blog, article, page,
      // list-collections — ships a chassis `main-*` section that does the actual
      // work of the page: the line items and checkout button, the search
      // results, the article body.
      //
      // `templateJson.sections` is replaced wholesale further down, so anything
      // not copied into `newSections` here is deleted. Before this branch
      // existed, adding any of these handles to the blueprint silently produced
      // a cart page with no cart on it.
      const existingOrder: string[] = Array.isArray(templateJson.order) ? templateJson.order : [];
      for (const key of existingOrder) {
        const sec = templateJson.sections?.[key];
        if (!sec) continue;
        const isMain = key === "main" || (typeof sec.type === "string" && sec.type.startsWith("main-"));
        if (!isMain) continue;
        newSections[key] = sec;
        newOrder.push(key);
      }
      if (newOrder.length === 0 && existingOrder.length > 0) {
        console.warn(
          `[TemplateGenerator] "${templatePath}" has sections but none named main-*; ` +
          `blueprint sections will be the whole page.`
        );
      }
    }

    // Rule 4 & 5: Append page sections defined in blueprint using deterministic counter keys
    const counterMap = new Map<string, number>();

    for (const section of sectionsList) {
      if (!section.componentId) continue;
      // Already placed in the main slot, or deliberately dropped. Appending it
      // here is precisely the duplicate-page bug.
      if (consumedAsMain.has(section.componentId)) continue;

      const comp = components.find(c => c.componentId === section.componentId);
      if (!comp) {
        throw new ValidationError(
          `[TemplateGenerator] Unregistered component referenced in blueprint for page '${pageHandle}': "${section.componentId}"`
        );
      }

      if (!usedComponents.some(c => c.componentId === comp.componentId)) {
        usedComponents.push(comp);
      }

      const sectionType = comp.componentId;
      const cleanId = section.componentId.replace(/[^a-z0-9-]/gi, "-");
      const currentCount = (counterMap.get(cleanId) || 0) + 1;
      counterMap.set(cleanId, currentCount);
      const sectionKey = `${cleanId}-${currentCount}`;

      const sectionObj: any = {
        type: sectionType,
        settings: sanitizeRichtextSettings(section.settings || {}, comp.componentId)
      };

      // Support child blocks if defined in blueprint
      if (section.blocks) {
        if (Array.isArray(section.blocks)) {
          sectionObj.blocks = {};
          sectionObj.block_order = [];
          section.blocks.forEach((blk: any, idx: number) => {
            const blkKey = blk.id || `block-${idx + 1}`;
            sectionObj.blocks[blkKey] = {
              type: blk.type || "text",
              settings: sanitizeRichtextSettings(blk.settings || {}, comp.componentId)
            };
            sectionObj.block_order.push(blkKey);
          });
        } else if (typeof section.blocks === "object") {
          sectionObj.blocks = {};
          sectionObj.block_order = Object.keys(section.blocks);
          for (const [bKey, bVal] of Object.entries(section.blocks as Record<string, any>)) {
            sectionObj.blocks[bKey] = {
              type: bVal?.type || "text",
              settings: sanitizeRichtextSettings(bVal?.settings || {}, comp.componentId)
            };
          }
        }
      }

      newSections[sectionKey] = sectionObj;
      newOrder.push(sectionKey);
    }

    templateJson.sections = newSections;
    templateJson.order = newOrder;

    try {
      validateTemplateStructure(templateJson);
      const availableSnippets = new Set(Object.keys(filesToUpload).filter(f => f.startsWith("snippets/")).map(f => path.basename(f, ".liquid")));
      validateSectionDependencies(templateJson, availableSnippets);
    } catch (valErr: any) {
      console.warn(`[TemplateGenerator] Template structural validation note for ${pageHandle}: ${valErr.message}`);
    }

    filesToUpload[templatePath] = JSON.stringify(templateJson, null, 2);
    console.log(`[TemplateGenerator] Built template ${templatePath} with ${templateJson.order.length} sections`);
  }

  return usedComponents;
}
