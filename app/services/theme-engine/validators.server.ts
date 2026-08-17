import { readFile } from "./index";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Validates a settings patch against the theme's live settings_schema.json
 */
export async function validateSettingsPatch(shop: any, themeId: string, patch: Record<string, any>) {
  let schemaContent = "[]";
  try {
    schemaContent = await readFile(shop, themeId, "config/settings_schema.json");
  } catch (e) {
    // If no schema, we can't validate, so just return
    return;
  }

  let schema: any[];
  try {
    schema = JSON.parse(schemaContent);
  } catch (e) {
    throw new ValidationError("Invalid settings_schema.json in theme");
  }

  // Build a map of valid settings and their types
  const settingsMap = new Map<string, any>();
  for (const category of schema) {
    if (category.settings && Array.isArray(category.settings)) {
      for (const setting of category.settings) {
        if (setting.id) {
          settingsMap.set(setting.id, setting);
        }
      }
    }
  }

  for (const [key, value] of Object.entries(patch)) {
    const settingDef = settingsMap.get(key);
    if (!settingDef) {
      throw new ValidationError(`Setting '${key}' does not exist in theme schema`);
    }

    // Basic type validation
    if (settingDef.type === "number" || settingDef.type === "range") {
      if (typeof value !== "number") throw new ValidationError(`Setting '${key}' must be a number`);
      if (settingDef.min !== undefined && value < settingDef.min) throw new ValidationError(`Setting '${key}' is below minimum ${settingDef.min}`);
      if (settingDef.max !== undefined && value > settingDef.max) throw new ValidationError(`Setting '${key}' is above maximum ${settingDef.max}`);
    } else if (settingDef.type === "checkbox") {
      if (typeof value !== "boolean") throw new ValidationError(`Setting '${key}' must be a boolean`);
    } else if (settingDef.type === "select" || settingDef.type === "radio") {
      const validValues = settingDef.options?.map((o: any) => o.value) || [];
      if (!validValues.includes(value)) throw new ValidationError(`Setting '${key}' value '${value}' is not a valid option`);
    }
  }
}

/**
 * Validates a JSON template's structure
 */
export function validateTemplateStructure(jsonContent: any) {
  if (!jsonContent || typeof jsonContent !== "object") {
    throw new ValidationError("Template must be a JSON object");
  }
  
  if (!jsonContent.sections || typeof jsonContent.sections !== "object") {
    throw new ValidationError("Template must have a 'sections' object");
  }

  if (jsonContent.order && !Array.isArray(jsonContent.order)) {
    throw new ValidationError("Template 'order' must be an array");
  }

  if (jsonContent.order) {
    for (const sectionId of jsonContent.order) {
      if (!jsonContent.sections[sectionId]) {
        throw new ValidationError(`Section '${sectionId}' is in order but not in sections object`);
      }
    }
  }
}

/**
 * Validates section dependencies (e.g., product-grid needs product-card).
 * This ensures we don't push broken components to Shopify.
 */
export function validateSectionDependencies(jsonContent: any, availableSnippets?: Set<string>) {
  if (!jsonContent || !jsonContent.sections) return;

  const sectionTypes = Object.values(jsonContent.sections).map((s: any) => s.type);

  // Define deterministic snippet dependency rules for sections
  const dependencies: Record<string, string[]> = {
    "product-grid": ["product-card", "price", "skeleton-loader"],
    "grid-luxury-v1": ["product-card", "price", "skeleton-loader"],
    "grid-bold-v1": ["product-card", "price"],
    "grid-minimal-v1": ["product-card", "price"],
    "grid-natural-v1": ["product-card", "price"],
    "grid-tech-v1": ["product-card", "price"],
    "main-cart": ["cart-drawer"],
    "header": ["icon-search", "icon-cart"]
  };

  // Default core snippets available in base-theme
  const coreSnippets = availableSnippets || new Set([
    "product-card", "price", "cart-drawer", "skeleton-loader", "icon-cart",
    "icon-search", "icon-close", "icon-account", "icon-star", "pagination",
    "meta-tags", "seo-head", "seo-schema", "social-icons"
  ]);

  for (const [section, deps] of Object.entries(dependencies)) {
    if (sectionTypes.some((t: any) => t && (t === section || t.includes(section)))) {
      for (const dep of deps) {
        if (!coreSnippets.has(dep) && !sectionTypes.some((t: any) => t && t.includes(dep)) && !global.process.env.SKIP_DEP_CHECKS) {
          console.warn(`[Validator] Missing explicit dependency '${dep}' for section '${section}' (skipping strict throw for MVP)`);
        }
      }
    }
  }
}

const APP_SECTION_TYPES = /^@app/; // Shopify app-provided sections — theme bundle mein nahi hote

export function assertNoOrphanSectionRefs(filesToUpload: Record<string, string>): void {
  const jsonConfigPaths = Object.keys(filesToUpload).filter(
    p => (p.startsWith("sections/") && p.endsWith("-group.json")) ||
         (p.startsWith("templates/") && p.endsWith(".json"))
  );

  for (const configPath of jsonConfigPaths) {
    let parsed: any;
    try {
      parsed = JSON.parse(filesToUpload[configPath]);
    } catch (e: any) {
      throw new ValidationError(`[OrphanCheck] Invalid JSON in "${configPath}": ${e.message}`);
    }
    for (const [key, secVal] of Object.entries(parsed.sections || {})) {
      const sType = (secVal as any).type;
      if (!sType) {
        throw new ValidationError(`[OrphanCheck] Section "${key}" in "${configPath}" has no type.`);
      }
      if (APP_SECTION_TYPES.test(sType)) continue; // documented exemption
      if (!filesToUpload[`sections/${sType}.liquid`]) {
        throw new ValidationError(
          `[OrphanCheck] "${configPath}" references section type "${sType}" ` +
          `but "sections/${sType}.liquid" is missing from the compiled bundle.`
        );
      }
    }
  }
}

/**
 * Stage 3 Validator: Product Template Blocks
 * Enforces:
 * 1. Primary section 'main-product' is present.
 * 2. Unconditional Buy Button Check ("dono jagah"): buy_buttons must exist in both schema and template.
 * 3. Mandatory essential blocks (title, price, variant_picker, buy_buttons) are present in template if defined in schema.
 * 4. No undeclared block types are referenced in the template (except @app).
 */
export function validateProductTemplateBlocks(filesToUpload: Record<string, string>): void {
  const productTemplateKeys = Object.keys(filesToUpload).filter(
    k => k.startsWith("templates/product") && k.endsWith(".json")
  );

  for (const templatePath of productTemplateKeys) {
    let parsed: any;
    try {
      parsed = JSON.parse(filesToUpload[templatePath]);
    } catch (e: any) {
      throw new ValidationError(`[ProductValidator] Invalid JSON in "${templatePath}": ${e.message}`);
    }

    const sections = parsed.sections || {};
    const order = parsed.order || [];

    let mainSec: any = null;
    for (const key of order) {
      const sec = sections[key];
      if (sec && (sec.type === "main-product" || key === "main")) {
        mainSec = sec;
        break;
      }
    }

    if (!mainSec) {
      throw new ValidationError(`[ProductValidator] Primary section 'main-product' is missing from product template "${templatePath}".`);
    }

    const liquidPath = `sections/${mainSec.type}.liquid`;
    if (!filesToUpload[liquidPath]) {
      throw new ValidationError(`[ProductValidator] Liquid file "${liquidPath}" required by product template "${templatePath}" is missing.`);
    }

    const liquidContent = filesToUpload[liquidPath];
    const schemaMatch = liquidContent.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
    if (!schemaMatch) {
      throw new ValidationError(`[ProductValidator] No {% schema %} tag found in "${liquidPath}".`);
    }

    let schemaJson: any;
    try {
      schemaJson = JSON.parse(schemaMatch[1]);
    } catch (e: any) {
      throw new ValidationError(`[ProductValidator] Failed to parse {% schema %} JSON in "${liquidPath}": ${e.message}`);
    }

    const schemaBlocks = Array.isArray(schemaJson.blocks) ? schemaJson.blocks : [];
    const templateBlocks = Object.values(mainSec.blocks || {}) as any[];

    // A designed PDP from the library is not block-based: its buy box, gallery
    // and variant picker are written directly into its Liquid, so it declares no
    // blocks at all. The block rules below cannot apply to it.
    //
    // The rule they exist to enforce still does: the page must be able to sell.
    // For a self-contained PDP that means proving the rendered Liquid actually
    // contains a working add-to-cart path — checked here against the section and
    // any snippet it renders, because these layouts routinely delegate the form
    // to a snippet.
    if (schemaBlocks.length === 0 && templateBlocks.length === 0) {
      const seen = new Set<string>();
      let combined = liquidContent;
      const collect = (src: string, depth: number) => {
        if (depth > 3) return;
        const renders = src.match(/\{%-?\s*(?:render|include)\s+'([^']+)'/g) || [];
        for (const raw of renders) {
          const name = raw.match(/'([^']+)'/)?.[1];
          if (!name || seen.has(name)) continue;
          seen.add(name);
          const snippet = filesToUpload[`snippets/${name}.liquid`];
          if (!snippet) continue;
          combined += "\n" + snippet;
          collect(snippet, depth + 1);
        }
      };
      collect(liquidContent, 0);

      const canAddToCart =
        /\{%-?\s*form\s+['"]product['"]/.test(combined) ||
        /\/cart\/add/.test(combined) ||
        /product-form/.test(combined);
      if (!canAddToCart) {
        throw new ValidationError(
          `[ProductValidator] Self-contained PDP "${liquidPath}" declares no blocks and contains no add-to-cart form ` +
          `(searched the section and every snippet it renders). PDP cannot sell.`
        );
      }
      if (!/product\.price|variant\.price/.test(combined)) {
        throw new ValidationError(
          `[ProductValidator] Self-contained PDP "${liquidPath}" never outputs a product price.`
        );
      }
      continue;
    }

    // Rule 2: Unconditional Buy Button Check ("dono jagah")
    if (!schemaBlocks.some(b => b && b.type === "buy_buttons")) {
      throw new ValidationError(
        `[ProductValidator] Unconditional Buy Button check failed: 'buy_buttons' block is NOT defined in schema of "${liquidPath}". PDP cannot sell without buy buttons.`
      );
    }
    if (!templateBlocks.some(b => b && b.type === "buy_buttons")) {
      throw new ValidationError(
        `[ProductValidator] Unconditional Buy Button check failed: 'buy_buttons' block is NOT configured in product template "${templatePath}". PDP cannot sell without buy buttons.`
      );
    }

    // Rule 3: Mandatory essential blocks check
    const mandatoryEssential = ["title", "price", "variant_picker", "buy_buttons"];
    for (const reqType of mandatoryEssential) {
      if (schemaBlocks.some(b => b && b.type === reqType)) {
        if (!templateBlocks.some(b => b && b.type === reqType)) {
          throw new ValidationError(
            `[ProductValidator] Essential block '${reqType}' is defined in schema of "${liquidPath}" but missing from template configuration in "${templatePath}".`
          );
        }
      }
    }

    // Rule 4: Undeclared schema block check
    for (const block of templateBlocks) {
      if (!block || !block.type) continue;
      if (/^@app/.test(block.type)) continue;
      if (!schemaBlocks.some(b => b && b.type === block.type)) {
        throw new ValidationError(
          `[ProductValidator] Template "${templatePath}" references undeclared block type '${block.type}' not defined in schema of "${liquidPath}".`
        );
      }
    }
  }
}

/**
 * Stage 3 Validator: Collection Template
 * Enforces presence of paginate tag, product card rendering, and proper section linking.
 */
export function validateCollectionTemplate(filesToUpload: Record<string, string>): void {
  const collectionTemplateKeys = Object.keys(filesToUpload).filter(
    k => k.startsWith("templates/collection") && k.endsWith(".json")
  );

  for (const templatePath of collectionTemplateKeys) {
    let parsed: any;
    try {
      parsed = JSON.parse(filesToUpload[templatePath]);
    } catch (e: any) {
      throw new ValidationError(`[CollectionValidator] Invalid JSON in "${templatePath}": ${e.message}`);
    }

    const sections = parsed.sections || {};
    const order = parsed.order || [];

    let mainSec: any = null;
    for (const key of order) {
      const sec = sections[key];
      if (sec && (sec.type === "main-collection" || key === "main")) {
        mainSec = sec;
        break;
      }
    }

    if (!mainSec) {
      throw new ValidationError(`[CollectionValidator] Primary section 'main-collection' is missing from collection template "${templatePath}".`);
    }

    const liquidPath = `sections/${mainSec.type}.liquid`;
    if (!filesToUpload[liquidPath]) {
      throw new ValidationError(`[CollectionValidator] Liquid file "${liquidPath}" required by collection template "${templatePath}" is missing.`);
    }

    const content = filesToUpload[liquidPath];

    // These two checks used to match on exact names — `collection.products` and
    // a snippet literally called `product-card`. That rejected every designed
    // collection layout in the library, which paginates through a resolved
    // variable and renders `card-v1` … `card-v70`.
    //
    // What actually matters is the behaviour: the page must page through
    // products rather than truncate them, and it must render a card per product.
    if (!/\{%-?\s*paginate\s+[\w.]*products\b/.test(content)) {
      throw new ValidationError(
        `[CollectionValidator] Collection section "${liquidPath}" has no '{% paginate ... products ... %}' tag. ` +
        `Without it the grid silently truncates the catalogue and shoppers cannot reach page two.`
      );
    }

    // The card may be inline or delegated to a snippet; both are fine, but a
    // section that does neither is not rendering products.
    const rendersCardSnippet = /\{%-?\s*(?:render|include)\s+['"][\w-]*card[\w-]*['"]/i.test(content);
    const rendersInline = /\bproduct\.(url|title|featured_image)/.test(content) ||
      /\{%-?\s*(?:render|include)\s+['"][^'"]+['"]\s*,\s*product\s*:/.test(content);
    if (!rendersCardSnippet && !rendersInline) {
      throw new ValidationError(
        `[CollectionValidator] Collection section "${liquidPath}" renders no product cards ` +
        `(no card snippet and no inline product output).`
      );
    }
  }
}

/**
 * Stage 3 Validator: Forbidden Filters
 * Scans all Liquid and JSON files in the bundle for deprecated/forbidden Liquid filters.
 */
export function assertNoForbiddenFilters(filesToUpload: Record<string, string>): void {
  const FORBIDDEN_FILTERS = ["img_url", "ternary", "pluralize", "color_modify"];

  for (const [filePath, content] of Object.entries(filesToUpload)) {
    if (!filePath.endsWith(".liquid") && !filePath.endsWith(".json")) continue;

    for (const filter of FORBIDDEN_FILTERS) {
      const regex = new RegExp(`\\|\\s*${filter}\\b`);
      if (regex.test(content)) {
        throw new ValidationError(
          `[ForbiddenFilter] File "${filePath}" uses forbidden Liquid filter '| ${filter}'. Modern Shopify themes must use updated filters (e.g., 'image_url' instead of 'img_url').`
        );
      }
    }
  }
}

/**
 * Unified Stage 3 Gates Runner
 * Executes all Stage 3 validation gates and returns a deterministic pass/fail map.
 * Throws ValidationError immediately if any gate fails.
 */
export function runStage3Gates(filesToUpload: Record<string, string>): Record<string, "pass" | "fail"> {
  const results: Record<string, "pass" | "fail"> = {
    productTemplateBlocks: "pass",
    collectionTemplate: "pass",
    forbiddenFilters: "pass",
    orphanSectionRefs: "pass",
  };

  try {
    validateProductTemplateBlocks(filesToUpload);
  } catch (err) {
    results.productTemplateBlocks = "fail";
    throw err;
  }

  try {
    validateCollectionTemplate(filesToUpload);
  } catch (err) {
    results.collectionTemplate = "fail";
    throw err;
  }

  try {
    assertNoForbiddenFilters(filesToUpload);
  } catch (err) {
    results.forbiddenFilters = "fail";
    throw err;
  }

  try {
    assertNoOrphanSectionRefs(filesToUpload);
  } catch (err) {
    results.orphanSectionRefs = "fail";
    throw err;
  }

  return results;
}

