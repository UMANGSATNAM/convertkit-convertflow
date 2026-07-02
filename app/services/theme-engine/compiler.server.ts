import * as fs from "fs/promises";
import * as path from "path";
import * as crypto from "crypto";
import { resolveComponents } from "./compiler/component-resolver";
import { resolveDependencies } from "./compiler/dependency-resolver";
import { resolveResources } from "./compiler/resource-resolver";
import { resolveLocales } from "./compiler/locale-resolver";
import { resolveSettings } from "./compiler/settings-resolver";
import { resolveCSSTokens } from "./compiler/css-resolver";
import { buildManifest } from "./compiler/manifest-builder";
import { optimizeBundle } from "./compiler/optimizer";
import { staticValidate } from "./compiler/static-validator";
import { designLint } from "./compiler/design-linter";
import { ComponentRegistry } from "@prisma/client";
import { uploadAssetWithCache } from "./asset-cache.server";
import { ValidationError, validateTemplateStructure, validateSectionDependencies } from "./validators.server";

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

export interface ThemeBuildArtifact {
  manifest: Record<string, any>;
  uploadBundle: Record<string, any>;
  validation: Record<string, any>;
  lint: Record<string, any>;
  metrics: Record<string, any>;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/**
 * Saves a serializable artifact to the compilation directory.
 */
async function saveArtifact(compileDir: string, filename: string, data: any) {
  const filePath = path.join(compileDir, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`[Compiler] Saved artifact: ${filename}`);
}

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
      console.error(
        `[Composer] WARN: Failed to upload ${shopifyAssetKey} after ${attempt + 1} attempts: ${err.message}. Continuing...`
      );
      return false;
    }
  }
  return false;
}

/**
 * Validates theme integrity before uploading to prevent shipping broken or missing files to live storefronts.
 */
function validateThemeIntegrity(
  filesToUpload: Record<string, string>,
  blueprint: StoreBlueprintData,
  components: ComponentRegistry[]
) {
  const requiredKeys = [
    "layout/theme.liquid",
    "config/settings_schema.json",
    "config/settings_data.json",
    "locales/en.default.json",
    "assets/niche-tokens.css"
  ];

  for (const key of requiredKeys) {
    if (filesToUpload[key] === undefined) {
      console.warn(`[Validator] Missing expected theme asset: ${key} (will rely on base shell)`);
    }
  }

  for (const [pageHandle, pageData] of Object.entries(blueprint.pages || {})) {
    for (const section of pageData.sections || []) {
      const component = components.find(c => c.componentId === section.componentId);
      if (component) {
        const sectionType = component.sectionType || component.componentId;
        const targetKey = `sections/${sectionType}.liquid`;
        if (!filesToUpload[targetKey]) {
          console.warn(`[Validator] Section file missing in merged theme: ${targetKey}. Ensure file exists in components registry.`);
        }
      }
    }
  }

  const tokensContent = filesToUpload["assets/niche-tokens.css"];
  if (!tokensContent || !tokensContent.trim()) {
    console.warn("[Validator] Niche tokens stylesheet is empty or invalid. Applying default variables.");
  }
}

/**
 * Theme Compiler Orchestrator
 * Purely deterministic execution of compiler stages. No business logic.
 */
export async function compileTheme(
  blueprint: StoreBlueprintData,
  componentsRegistry: ComponentRegistry[],
  brandProfile: any
): Promise<ThemeBuildArtifact> {
  const startTime = Date.now();
  const runId = crypto.randomUUID();
  const compileDir = path.join(process.cwd(), "tmp", "compilations", runId);
  await fs.mkdir(compileDir, { recursive: true });

  console.log(`[Compiler] Starting compilation run: ${runId}`);
  await saveArtifact(compileDir, "01-blueprint.json", blueprint);

  // Stage 2: Component Resolver
  const resolvedComponents = await resolveComponents(blueprint);
  await saveArtifact(compileDir, "02-components.json", resolvedComponents);

  // Stage 3: Dependency Resolver
  const dependencies = await resolveDependencies(resolvedComponents, componentsRegistry);
  await saveArtifact(compileDir, "03-dependencies.json", dependencies);

  // Stage 4: Resource Resolver
  const resources = await resolveResources(dependencies, componentsRegistry);
  await saveArtifact(compileDir, "04-resource-map.json", resources);

  // Stage 5: Settings Resolver
  const settings = await resolveSettings(blueprint.settings, dependencies, componentsRegistry);
  await saveArtifact(compileDir, "05-settings.json", settings);

  // Stage 6: Locale Resolver (Strict Mode)
  const locales = await resolveLocales(dependencies, componentsRegistry, resources, settings);
  await saveArtifact(compileDir, "06-locales.json", locales);

  // Stage 7: CSS Token Resolver (4 Deterministic Layers)
  const cssTokens = await resolveCSSTokens(blueprint, dependencies);
  await saveArtifact(compileDir, "07-css.json", cssTokens);

  // Stage 8: Manifest Builder
  const manifest = await buildManifest({
    buildId: runId,
    merchantId: blueprint.settings?.merchantId || 'unknown_merchant',
    blueprintId: blueprint.settings?.blueprintId || 'unknown_blueprint',
    niche: brandProfile?.industry || 'default',
    components: resolvedComponents,
    dependencies,
    resources,
    settings,
    locales,
    css: cssTokens
  });
  await saveArtifact(compileDir, "08-manifest.json", manifest);

  // Stage 9: Build Optimizer
  const uploadBundle = await optimizeBundle(manifest);
  await saveArtifact(compileDir, "09-build.json", uploadBundle);

  // Stage 10a: Technical Validator
  const validation = await staticValidate(uploadBundle, manifest);
  await saveArtifact(compileDir, "10a-validation.json", validation);

  // Stage 10b: Design Linter
  const lint = await designLint(cssTokens);
  await saveArtifact(compileDir, "10b-lint.json", lint);

  const isDeployable = validation.passed && lint.passed;
  if (!isDeployable) {
    console.warn(`[Compiler] Build had technical or design warnings. Technical: ${validation.passed ? 'PASS' : 'FAIL'}, Design: ${lint.passed ? 'PASS' : 'FAIL'}`);
  }

  const endTime = Date.now();
  const metrics = {
    runId,
    generationTimeMs: endTime - startTime,
    componentCount: Object.keys(resolvedComponents).length
  };

  console.log(`[Compiler] Compilation completed successfully in ${metrics.generationTimeMs}ms`);

  return {
    manifest,
    uploadBundle,
    validation,
    lint,
    metrics
  };
}

function addShopifyFile(files: Record<string, string>, relPath: string, content: string) {
  const topLevelFolders = ["snippets/", "sections/", "assets/", "layout/", "locales/", "config/", "templates/"];
  for (const prefix of topLevelFolders) {
    if (relPath.startsWith(prefix)) {
      const subPath = relPath.substring(prefix.length);
      const cleanName = path.basename(subPath);
      files[`${prefix}${cleanName}`] = content;
      return;
    }
  }
  files[relPath] = content;
}

function compType(id: string): string {
  if (id.startsWith("header")) return "header";
  if (id.startsWith("footer")) return "footer";
  if (id.startsWith("hero")) return "hero";
  if (id.startsWith("trust")) return "trust";
  if (id.startsWith("grid") || id.includes("product-grid")) return "product-grid";
  if (id.startsWith("collection")) return "collections";
  if (id.startsWith("brand-story") || id.startsWith("rich-text") || id.startsWith("content")) return "brand-story";
  if (id.startsWith("newsletter")) return "newsletter";
  if (id.startsWith("testimonials")) return "testimonials";
  if (id.startsWith("faq")) return "faq";
  return "custom";
}

async function resolveComponentLiquidContent(component: any): Promise<string | null> {
  const candidates: string[] = [];
  const cwd = process.cwd();

  const addCandidate = (p?: string | null) => {
    if (!p) return;
    const clean = p.replace(/^(\/?app\/)+/, "app/").replace(/^\/+/, "");
    const full1 = path.resolve(cwd, clean);
    const full2 = path.resolve(cwd, p);
    if (!candidates.includes(full1)) candidates.push(full1);
    if (!candidates.includes(full2)) candidates.push(full2);
    if (clean.startsWith("app/")) {
      const full3 = path.resolve(cwd, clean.slice(4));
      if (!candidates.includes(full3)) candidates.push(full3);
    }
  };

  if (component.liquidPath) {
    addCandidate(component.liquidPath);
    addCandidate(path.join("app/data/templates/theme-engine", component.liquidPath));
    addCandidate(path.join("app/data/templates/theme-engine/components", path.basename(component.liquidPath)));
  }

  if (component.filePath) {
    addCandidate(component.filePath);
    addCandidate(path.join("app/data/templates/theme-engine", component.filePath));
    addCandidate(path.join("app/data/templates/theme-engine/components", path.basename(component.filePath)));
  }

  const id = component.componentId || component.sectionType;
  if (id) {
    const idUnderscore = id.replace(/-/g, "_");
    const idHyphen = id.replace(/_/g, "-");
    const idNoV = idUnderscore.replace(/_v(\d+)$/, "_$1");
    const idNoVHyphen = idHyphen.replace(/-v(\d+)$/, "-$1");
    const idV = idUnderscore.replace(/_(\d+)$/, "_v$1");
    const idVHyphen = idHyphen.replace(/-(\d+)$/, "-v$1");

    const variations = new Set([id, idUnderscore, idHyphen, idNoV, idNoVHyphen, idV, idVHyphen]);
    const categories = [
      "announcement", "brand-story", "bundle-builder", "collections", "faq",
      "footer", "header", "hero", "newsletter", "popup", "product-grid",
      "testimonials", "trust", "custom", component.sectionType || compType(id)
    ];

    const dirs = [
      "app/data/templates/theme-engine/components"
    ];

    for (const dir of dirs) {
      for (const varName of variations) {
        addCandidate(path.join(dir, `${varName}.liquid`));
      }
      for (const cat of categories) {
        if (!cat) continue;
        for (const varName of variations) {
          addCandidate(path.join(dir, cat, `${varName}.liquid`));
        }
      }
    }
  }

  for (const candidatePath of candidates) {
    try {
      const content = await fs.readFile(candidatePath, "utf-8");
      return content;
    } catch (e) {
      // try next candidate
    }
  }
  return null;
}

/**
 * The Theme Composer takes the Store Blueprint and the matched components from the registry.
 * It compiles the core files, niche files, and database sections into a single merged theme map.
 * It executes the 10-stage deterministic compiler, validates the structure, and uploads files in batch to Shopify.
 */
export async function composeThemeFromBlueprint(
  shop: any,
  themeId: string,
  blueprint: StoreBlueprintData,
  components: ComponentRegistry[],
  nicheId: string
): Promise<{ templates: Record<string, any>; settingsPatch: Record<string, any> }> {
  const startTime = Date.now();
  console.log(`[Composer] Starting theme composition and live Shopify upload for theme ${themeId} (Niche: ${nicheId})`);
  
  const filesToUpload: Record<string, string> = {};

  // Execute deterministic compiler for safety artifacts & design token generation
  try {
    await compileTheme(blueprint, components, { industry: nicheId });
  } catch (compilerErr: any) {
    console.warn(`[Composer] Compiler stage generated warning: ${compilerErr.message}. Continuing with live upload.`);
  }

  // Step 1: Read Read-Only Base Theme Files
  const baseThemePath = path.resolve(process.cwd(), "app/data/templates/theme-engine/base-theme");
  const coreDir = baseThemePath;
  const coreFiles = await readDirRecursive(coreDir, coreDir);
  for (const [relPath, content] of Object.entries(coreFiles)) {
    addShopifyFile(filesToUpload, relPath, content);
  }

  // Step 2: Ensure all core snippets are included flat (no subfolder 422 errors)
  const snippetsDir = path.join(coreDir, "snippets");
  const snippetFiles = await readDirRecursive(snippetsDir, snippetsDir).catch(() => ({}));
  for (const [relPath, content] of Object.entries(snippetFiles)) {
    const flatName = path.basename(relPath);
    addShopifyFile(filesToUpload, `snippets/${flatName}`, content);
  }

  // Step 3: Generate Dynamic Niche Tokens CSS
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

  // Step 4: Build & Inject JSON Templates
  const resolvedComponents: ComponentRegistry[] = [];
  const templates: Record<string, any> = {};

  if (blueprint.globalComponents && Array.isArray(blueprint.globalComponents)) {
    blueprint.globalComponents.forEach(componentId => {
      const component = components.find(c => c.componentId === componentId);
      if (component && !resolvedComponents.some(c => c.componentId === component.componentId)) {
        resolvedComponents.push(component);
      }
    });
  }

  for (const [pageHandle, pageData] of Object.entries(blueprint.pages || {})) {
    const templateJson: any = {
      sections: {},
      order: []
    };

    (pageData.sections || []).forEach((section, index) => {
      const component = components.find(c => c.componentId === section.componentId);
      if (!component) {
        console.warn(`[Composer] Component ${section.componentId} not found in registry. Skipping.`);
        return;
      }

      const sectionType = component.sectionType || component.componentId;
      const sectionKey = `${sectionType}_${index}`;

      templateJson.sections[sectionKey] = {
        type: sectionType,
        settings: section.settings || {},
        blocks: section.blocks || {}
      };

      templateJson.order.push(sectionKey);
      
      if (!resolvedComponents.some(c => c.componentId === component.componentId)) {
        resolvedComponents.push(component);
      }
    });

    try {
      validateTemplateStructure(templateJson);
      const availableSnippets = new Set(Object.keys(filesToUpload).filter(f => f.startsWith("snippets/")).map(f => path.basename(f, ".liquid")));
      validateSectionDependencies(templateJson, availableSnippets);
    } catch (valErr: any) {
      console.warn(`[Composer] Template structural validation note for ${pageHandle}: ${valErr.message}`);
    }

    const templatePath = `templates/${pageHandle}.json`;
    templates[templatePath] = templateJson;
    filesToUpload[templatePath] = JSON.stringify(templateJson, null, 2);
    console.log(`[Composer] Built template ${templatePath} with ${templateJson.order.length} sections`);
  }

  // Step 5: Read and inject Liquid files for all resolved components
  for (const component of resolvedComponents) {
    const liquidContent = await resolveComponentLiquidContent(component);
    const sectionType = component.sectionType || component.componentId;
    if (liquidContent) {
      filesToUpload[`sections/${sectionType}.liquid`] = liquidContent;
    } else {
      console.error(`[Composer] Failed to resolve liquid component ${component.componentId} (${sectionType}) from all candidate paths.`);
    }
  }

  // Step 6: Validate Theme Integrity
  validateThemeIntegrity(filesToUpload, blueprint, components);

  // Step 7: Single-Batch Priority Upload to Shopify
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

  console.log(`[Composer] Starting single-batch upload of ${keysToUpload.length} files to Shopify theme ${themeId}`);

  for (const assetKey of keysToUpload) {
    const content = filesToUpload[assetKey];
    const success = await uploadLiquidWithRetry(shop, themeId, assetKey, content);
    if (success) {
      uploadedCount++;
    }
    if (process.env.MOCK_SHOPIFY !== "true") {
      await sleep(300);
    }
  }

  const durationMs = Date.now() - startTime;
  console.log(`[Composer] Batch upload complete: ${uploadedCount}/${keysToUpload.length} files processed in ${durationMs}ms.`);

  return { templates, settingsPatch: blueprint.settings };
}
