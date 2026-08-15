import * as fs from "fs/promises";
import { existsSync, readFileSync } from "fs";
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
import {
  ValidationError,
  validateTemplateStructure,
  validateSectionDependencies,
  assertNoOrphanSectionRefs,
  validateProductTemplateBlocks,
  validateCollectionTemplate,
  assertNoForbiddenFilters,
  runStage3Gates
} from "./validators.server";
import { generateTemplates } from "./template-generator";
import { runThemeCheckStage } from "./compiler/theme-check";
import prisma from "../../db.server";

export class ChassisTamperError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChassisTamperError";
  }
}

/**
 * Manifest-driven clone of all chassis files with SHA-256 hash verification.
 */
export async function cloneChassis(themeEngineDir: string): Promise<Record<string, string>> {
  const manifestPath = path.join(themeEngineDir, "base-theme/chassis-manifest.json");
  if (!existsSync(manifestPath)) {
    throw new Error(`Chassis manifest not found at ${manifestPath}`);
  }

  let manifestRaw: string;
  try {
    manifestRaw = await fs.readFile(manifestPath, "utf-8");
  } catch (err: any) {
    throw new Error(`Failed to read chassis manifest: ${err.message}`);
  }

  const manifest = JSON.parse(manifestRaw);
  const files = manifest.files || [];
  const clonedFiles: Record<string, string> = {};

  for (const item of files) {
    const relPath = typeof item === "string" ? item : item.file;
    const expectedHash = typeof item === "string" ? null : item.hash;

    const fullPath = path.join(themeEngineDir, relPath);
    let content: string;
    try {
      content = await fs.readFile(fullPath, "utf-8");
    } catch (err: any) {
      throw new ChassisTamperError(`Chassis file missing: ${relPath}. Expected file to exist at ${fullPath}`);
    }

    if (expectedHash) {
      const normalizedContent = content.replace(/\r\n/g, "\n");
      const hash = crypto.createHash("sha256").update(normalizedContent).digest("hex");
      if (hash !== expectedHash) {
        throw new ChassisTamperError(`Hash mismatch for chassis file: ${relPath}. Expected ${expectedHash}, got ${hash}`);
      }
    }

    // Strip the 'base-theme/' prefix from relative path
    const targetPath = relPath.replace(/^base-theme\//, "");
    clonedFiles[targetPath] = content;
  }

  return clonedFiles;
}

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
  stage3?: Record<string, any>;
  themeCheck?: Record<string, any>;
  filesToUpload?: Record<string, string>;
  templates?: Record<string, any>;
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

// Note: uploadLiquidWithRetry has been superseded by upsertThemeFilesBatched.

/**
 * Validates theme integrity before uploading to prevent shipping broken or missing files to live storefronts.
 */
export function validateThemeIntegrity(
  filesToUpload: Record<string, string>,
  blueprint: StoreBlueprintData,
  components: ComponentRegistry[],
  nicheId?: string
) {
  // Preflight Registry Check: Per-Component integrity
  const missingInDb: string[] = [];
  const missingOnDisk: string[] = [];
  
  for (const [pageHandle, pageData] of Object.entries(blueprint.pages || {})) {
    for (const section of pageData.sections || []) {
      const compId = section.componentId;
      if (!compId) continue;
      const component = components.find(c => c.componentId === compId);
      if (!component) {
        missingInDb.push(compId);
      } else {
        const fullPath = path.resolve(process.cwd(), "app/data/templates/theme-engine", component.liquidPath);
        if (!existsSync(fullPath)) {
          missingOnDisk.push(`${compId} (${component.liquidPath})`);
        }
      }
    }
  }

  if (missingInDb.length > 0 || missingOnDisk.length > 0) {
    let errMsg = "PreflightRegistryMismatchError: Blueprint components drift detected.\n";
    if (missingInDb.length > 0) errMsg += `- Missing in DB: ${missingInDb.join(", ")}\n`;
    if (missingOnDisk.length > 0) errMsg += `- Missing on Disk: ${missingOnDisk.join(", ")}\n`;
    throw new ValidationError(errMsg);
  }

  const requiredKeys = [
    "layout/theme.liquid",
    "config/settings_schema.json",
    "config/settings_data.json",
    "locales/en.default.json"
  ];

  for (const key of requiredKeys) {
    if (filesToUpload[key] === undefined) {
      throw new ValidationError(`Missing required core theme file: ${key}`);
    }
  }

  if (nicheId && nicheId !== 'ai-custom') {
    const tokensContent = filesToUpload['assets/niche-tokens.css'];
    if (tokensContent === undefined || tokensContent.trim() === '') {
      throw new ValidationError('Niche tokens stylesheet is empty');
    }
  }

  // Ensure settings_schema.json font_picker defaults use valid Shopify font IDs
  try {
    const schemaContent = filesToUpload["config/settings_schema.json"];
    const schemaJson = JSON.parse(schemaContent);
    if (Array.isArray(schemaJson)) {
      for (const group of schemaJson) {
        if (Array.isArray(group.settings)) {
          for (const s of group.settings) {
            if (s && s.type === "font_picker" && s.default) {
              if (!/^[a-z0-9_]+_[ni]\d$/.test(s.default)) {
                throw new ValidationError(`Invalid Shopify font_picker default '${s.default}' for setting '${s.id}' in config/settings_schema.json`);
              }
            }
          }
        }
      }
    }
  } catch (err: any) {
    if (err instanceof ValidationError) throw err;
    throw new ValidationError(`Failed to validate config/settings_schema.json: ${err.message}`);
  }

  for (const [pageHandle, pageData] of Object.entries(blueprint.pages || {})) {
    for (const section of pageData.sections || []) {
      const component = components.find(c => c.componentId === section.componentId);
      if (component) {
        const sectionType = component.componentId;
        const targetKey = `sections/${sectionType}.liquid`;
        if (!filesToUpload[targetKey]) {
          console.warn(`[Validator] Section file missing in merged theme: ${targetKey}. Ensure file exists in components registry.`);
        }
      }
    }
  }
}

/**
 * Loads published components from the database while asserting Single Source of Truth (SSOT) integrity.
 * Checks on-disk registry.json SHA-256 against RegistryMeta table.
 */
export async function loadVerifiedComponents(): Promise<ComponentRegistry[]> {
  const registryJsonPath = path.resolve(process.cwd(), "app/data/templates/theme-engine/registry.json");
  let rawContent: string;
  try {
    rawContent = readFileSync(registryJsonPath, "utf-8");
  } catch (err: any) {
    throw new ValidationError(`Failed to read registry.json on disk: ${err.message}`);
  }
  const canonicalContent = rawContent.replace(/\r\n/g, "\n");
  const currentRegistryHash = crypto.createHash("sha256").update(canonicalContent).digest("hex");
  let registryData: any;
  try {
    registryData = JSON.parse(rawContent);
  } catch (e: any) {
    throw new ValidationError(`registry.json is not valid JSON: ${e.message}`);
  }
  const expectedCount = registryData.components.filter((c: any) => c.status === "production").length;
  const metaRecord = await prisma.registryMeta.findUnique({ where: { id: "singleton" } });
  if (!metaRecord) {
    throw new ValidationError("Registry cache stale — run seed. No RegistryMeta record found in database.");
  }
  if (metaRecord.registryHash !== currentRegistryHash) {
    throw new ValidationError(`Registry cache stale — run seed. DB hash: ${metaRecord.registryHash}, Disk hash: ${currentRegistryHash}`);
  }
  const components = await prisma.componentRegistry.findMany({
    where: { status: "PUBLISHED" }
  });
  if (components.length !== expectedCount) {
    throw new ValidationError(`SSOT drift detected: expected exactly ${expectedCount} published components in database, found ${components.length}. Run seed script.`);
  }

  // Drift guard: ensure sectionType matches registry.json
  const registryComponentMap = new Map<string, any>(registryData.components.map((c: any) => [c.componentId, c]));
  for (const dbComp of components) {
    const jsonEntry = registryComponentMap.get(dbComp.componentId);
    if (!jsonEntry) continue;
    const expectedSectionType = jsonEntry.sectionType || jsonEntry.componentId;
    if (dbComp.sectionType !== expectedSectionType) {
      throw new ValidationError(`SSOT drift detected: component "${dbComp.componentId}" has sectionType "${dbComp.sectionType}" in DB but expected "${expectedSectionType}" based on registry.json. Run seed script.`);
    }
  }

  console.log(`[RegistryLoader] Verified SSOT registry freshness (hash: ${currentRegistryHash.substring(0, 12)}...) and loaded ${components.length} components.`);
  return components;
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
  const componentsRegistryArray = Array.isArray(componentsRegistry)
    ? componentsRegistry
    : await loadVerifiedComponents();
  await saveArtifact(compileDir, "01-blueprint.json", blueprint);

  const { filesToUpload, templates, stage3Results } = await assembleThemeBundle(
    blueprint,
    componentsRegistryArray,
    brandProfile?.industry || 'default'
  );

  // Stage 1: Chassis Clone Stage (Manifest-driven Copy & Hash Verification)
  await saveArtifact(compileDir, "00-chassis.json", Object.keys(filesToUpload));

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
  
  // Inject generated tokens into the upload payload, overwriting the Stage 2 hardcoded placeholder
  filesToUpload["assets/niche-tokens.css"] = cssTokens.cssOutput;

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
    css: cssTokens,
    filesToUpload
  });
  await saveArtifact(compileDir, "08-manifest.json", manifest);

  // Stage 9: Build Optimizer
  const uploadBundle = await optimizeBundle(manifest);
  await saveArtifact(compileDir, "09-build.json", uploadBundle);

  // Stage 10a: Technical Validator + Unified Stage 3 Gates
  const validation = await staticValidate(uploadBundle, manifest);
  validation.checks = {
    ...validation.checks,
    ...stage3Results
  };
  await saveArtifact(compileDir, "10a-validation.json", validation);

  // Stage 10b: Design Linter
  const lint = await designLint(cssTokens);
  await saveArtifact(compileDir, "10b-lint.json", lint);

  // Stage 10c: Unified Stage 3 Gates Artifact
  await saveArtifact(compileDir, "10c-stage3.json", stage3Results);

  // Stage 11: Shopify Theme Check Linter Stage
  const themeCheck = await runThemeCheckStage(compileDir, filesToUpload, cssTokens.cssOutput);
  await saveArtifact(compileDir, "11-theme-check.json", themeCheck);

  const isDeployable = validation.passed && lint.passed && themeCheck.passed;
  if (!isDeployable) {
    const reasons = [
      !validation.passed ? "Technical Validation Failed" : "",
      !lint.passed ? "Design Lint Failed" : "",
      !themeCheck.passed ? "Shopify Theme Check Failed" : ""
    ].filter(Boolean).join(", ");
    throw new ValidationError(`[Compiler] Aborting compilation: Theme bundle is not deployable (${reasons}).`);
  }

  // Soft Warn Gate: Check for unfilled generic placeholders in compiled output
  try {
    let unfilledCount = 0;
    const nicheData = JSON.parse(readFileSync(path.resolve(process.cwd(), "app/data/niche-vocabulary.json"), "utf-8"));
    const placeholderPatterns = nicheData.placeholder_patterns || [];
    
    for (const [relPath, content] of Object.entries(filesToUpload)) {
      if (!relPath.endsWith('.liquid') && !relPath.endsWith('.json')) continue;
      
      let searchableContent = content;
      if (relPath.endsWith('.liquid')) {
        // Strip the {% schema %} block to avoid scanning default values like "Shop Now"
        searchableContent = content.replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g, '');
      }
      
      for (const placeholder of placeholderPatterns) {
        if (searchableContent.includes(placeholder)) {
          console.warn(`[WARNING] Unfilled placeholder found: "${placeholder}" in ${relPath}`);
          unfilledCount++;
        }
      }
    }
    
    if (unfilledCount > 0) {
      console.warn(`[Compiler] ⚠️ SOFT WARN: Found ${unfilledCount} instances of unfilled generic placeholders in the final compiled bundle. Content injection may have missed fields.`);
    }
  } catch (err: any) {
    console.warn(`[Compiler] Could not run placeholder scan: ${err.message}`);
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
    stage3: stage3Results,
    themeCheck,
    filesToUpload,
    templates,
    metrics
  };
}

function addShopifyFile(files: Record<string, string>, relPath: string, content: string) {
  const topLevelFolders = ["snippets/", "sections/", "assets/", "layout/", "locales/", "config/", "templates/"];
  for (const prefix of topLevelFolders) {
    if (relPath.startsWith(prefix)) {
      if (relPath.startsWith("templates/customers/")) {
        files[relPath] = content;
        return;
      }
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

export async function resolveComponentLiquidContent(component: any, customRegistryEntries?: any[], customRegistryPath?: string): Promise<string> {
  const componentId = component.componentId || component.id;
  if (!componentId) {
    throw new Error(`[Resolver] Cannot resolve liquid content: Component ID is missing.`);
  }

  // 1. Look up component strictly in registry to get its canonical liquidPath (ignoring passed-in component.liquidPath)
  let entries = customRegistryEntries;
  if (!entries) {
    const registryPath = customRegistryPath || path.resolve(process.cwd(), "app/data/templates/theme-engine/registry.json");
    try {
      const registryRaw = await fs.readFile(registryPath, "utf-8");
      const registryData = JSON.parse(registryRaw);
      entries = registryData.components || [];
    } catch (err: any) {
      throw new Error(`[Resolver] Failed to load registry.json at ${registryPath}: ${err.message}`);
    }
  }

  const matched = (entries || []).find((c: any) => c.componentId === componentId);
  if (!matched || !matched.liquidPath) {
    throw new Error(`[Resolver] Component "${componentId}" is not registered in registry.json (no liquidPath found).`);
  }
  const liquidPath = matched.liquidPath;

  // 2. Resolve exact absolute path from liquidPath and enforce path containment within theme-engine root or app/data root
  const themeEngineRoot = path.resolve(process.cwd(), "app/data/templates/theme-engine");
  const appDataRoot = path.resolve(process.cwd(), "app/data");
  let exactPath: string;
  if (liquidPath.startsWith("app/data/") || liquidPath.startsWith("..") || liquidPath.includes("_beauty") || liquidPath.includes("_luxury") || liquidPath.includes("_streetwear") || liquidPath.includes("_supplements") || liquidPath.includes("_electronics")) {
    const rel = liquidPath.replace(/^(\/?app\/data\/)+/, "").replace(/^(components\/[^\/]+\/)+/, "");
    exactPath = path.resolve(appDataRoot, rel);
  } else {
    const cleanRelPath = liquidPath.replace(/^(\/?app\/data\/templates\/theme-engine\/)+/, "");
    exactPath = path.resolve(themeEngineRoot, cleanRelPath);
  }

  if (!exactPath.startsWith(themeEngineRoot + path.sep) && !exactPath.startsWith(appDataRoot + path.sep) && exactPath !== themeEngineRoot && exactPath !== appDataRoot) {
    throw new Error(`[Resolver] Security Error: Path traversal attempt detected. Path "${exactPath}" escapes allowed roots.`);
  }

  // 3. Read file from exact path
  try {
    const content = await fs.readFile(exactPath, "utf-8");
    return content;
  } catch (err: any) {
    throw new Error(`[Resolver] Failed to read liquid file for component "${componentId}" at attempted path: ${exactPath}. Error: ${err.message}`);
  }
}

/**
 * Dynamic Google Fonts link generator for theme.liquid head injection.
 */
export function generateGoogleFontsHeadLinks(headingFontInput?: string, bodyFontInput?: string): string {
  const heading = (headingFontInput || 'Inter').trim().replace(/['"]/g, '').replace(/\s+/g, '+');
  const body = (bodyFontInput || 'Inter').trim().replace(/['"]/g, '').replace(/\s+/g, '+');
  let familiesQuery = '';
  if (heading === body) {
    familiesQuery = `family=${heading}:wght@400;500;600;700`;
  } else {
    familiesQuery = `family=${heading}:wght@400;500;700&family=${body}:wght@400;500;600`;
  }
  return `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?${familiesQuery}&display=swap">`;
}

/**
 * The Theme Composer takes the Store Blueprint and the matched components from the registry.
 * It compiles the core files, niche files, and database sections into a single merged theme map.
 * It executes the 10-stage deterministic compiler, validates the structure, and uploads files in batch to Shopify.
 */
export async function assembleThemeBundle(
  blueprint: StoreBlueprintData,
  components: ComponentRegistry[],
  nicheId: string
): Promise<{
  filesToUpload: Record<string, string>;
  assembledComponents: ComponentRegistry[];
  templates: Record<string, any>;
  stage3Results: Record<string, "pass" | "fail">;
}> {
  const filesToUpload: Record<string, string> = {};

  // Step 1: Clone read-only chassis files using hash verification
  const themeEngineDir = path.resolve(process.cwd(), "app/data/templates/theme-engine");
  const coreFiles = await cloneChassis(themeEngineDir);
  for (const [relPath, content] of Object.entries(coreFiles)) {
    addShopifyFile(filesToUpload, relPath, content);
  }

  // Step 1.1: Auto-bundle Indian & custom snippets from app/data/snippets
  const snippetsDir = path.resolve(process.cwd(), "app/data/snippets");
  if (existsSync(snippetsDir)) {
    const snippetFiles = await fs.readdir(snippetsDir);
    for (const file of snippetFiles) {
      if (file.endsWith(".liquid")) {
        const content = await fs.readFile(path.join(snippetsDir, file), "utf-8");
        addShopifyFile(filesToUpload, `snippets/${file}`, content);
      }
    }
  }

  // Step 1.2: Auto-bundle all real custom sections from app/data/*.liquid into filesToUpload['sections/']
  // [REMOVED] - We should NOT blindly bundle all files from app/data/.
  // Step 4 (resolveComponentLiquidContent) correctly resolves and bundles ONLY the components that are used in the blueprint.

  // Step 1.3: Bundle decoupled design tokens
  const tokensPath = path.resolve(themeEngineDir, "tokens/design-language-fresh.css");
  if (existsSync(tokensPath)) {
    const tokensContent = await fs.readFile(tokensPath, "utf-8");
    addShopifyFile(filesToUpload, "assets/design-language-fresh.css", tokensContent);
  }

  // Step 2: Generate Dynamic Niche Tokens CSS
  const settings = blueprint.settings || {};
  const isLuxury = settings.designDirection === 'LUXURY';
  const isBold = settings.designDirection === 'BOLD';
  const isMinimal = settings.designDirection === 'MINIMAL';
  const isPlayful = settings.designDirection === 'PLAYFUL';

  const fontHeading = settings.fontHeading || settings.font_heading || (isLuxury ? 'Playfair Display' : 'Inter');
  const fontBody = settings.fontBody || settings.font_body || 'Inter';
  
  const motionDuration = isLuxury ? '800ms' : isBold ? '250ms' : isMinimal ? '400ms' : isPlayful ? '500ms' : '600ms';
  const motionDistance = (isLuxury || settings.designDirection === 'EDITORIAL') ? '20px' : isMinimal ? '12px' : isBold ? '30px' : '20px';
  const motionZoom = isBold ? '2.0' : isLuxury ? '1.6' : '1.8';

  filesToUpload["assets/niche-tokens.css"] = `/* Dynamically Generated StoreForge Theme Tokens */
:root {
  --color-background: ${settings.colors_background_1 || '#ffffff'};
  --color-text: ${settings.colors_text_1 || '#1a1a1a'};
  --color-text-muted: #64748b;
  --color-text-secondary: #64748b;
  --color-accent: ${settings.colors_accent_1 || settings.colors_solid_button_labels || settings.colors_accent_2 || '#008060'};
  --color-border: #e2e8f0;
  --color-surface: ${settings.colors_surface || '#f8fafc'};
  --font-heading-family: '${fontHeading}', Georgia, serif;
  --font-body-family: '${fontBody}', -apple-system, sans-serif;
  --weight-display: ${isLuxury ? '400' : '700'};
  --weight-heading: ${isLuxury ? '500' : '600'};
  --weight-body: 400;
  --weight-emphasis: 600;
  --card-radius: ${settings.card_style === 'soft' ? '12px' : settings.card_style === 'rounded' ? '24px' : '0px'};
  --button-radius: ${settings.button_style === 'pill' ? '50px' : settings.button_style === 'rounded' ? '8px' : '0px'};
  --section-padding-y: ${settings.section_density === 'airy' ? '80px' : settings.section_density === 'tight' ? '40px' : '60px'};
  --font-display: ${isLuxury ? 'clamp(2.75rem, 5.5vw, 4.5rem)' : isBold ? 'clamp(3rem, 7vw, 6rem)' : 'clamp(2.5rem, 6vw, 5rem)'};
  --font-h1: ${isLuxury ? 'clamp(2rem, 4vw, 3rem)' : 'clamp(2rem, 4vw, 3.5rem)'};
  --font-h2: ${isLuxury ? 'clamp(1.5rem, 3vw, 2.25rem)' : 'clamp(1.5rem, 3vw, 2.5rem)'};
  --font-h3: 1.25rem;
  --font-body: 1rem;
  --font-small: ${isLuxury ? '0.8125rem' : '0.875rem'};
  --font-eyebrow: ${isLuxury ? '0.6875rem' : '0.75rem'};
  --tracking-eyebrow: ${isLuxury ? '0.2em' : '0.15em'};
  --tracking-display: ${isLuxury ? '-0.01em' : isBold ? '-0.04em' : '-0.02em'};
  --tracking-body: 0;
  --tracking-tight: ${isBold ? '-0.04em' : '-0.01em'};
  --tracking-wide: ${isLuxury ? '0.2em' : '0.15em'};
  --leading-display: ${isLuxury ? '1.1' : isBold ? '1.05' : '1.1'};
  --leading-tight: ${isBold ? '1.05' : isLuxury ? '1.1' : '1.1'};
  --leading-body: ${isLuxury ? '1.65' : '1.6'};
  
  /* Motion Tokens Layer */
  --motion-duration: ${motionDuration};
  --motion-easing: cubic-bezier(0.4, 0, 0.2, 1);
  --motion-distance: ${motionDistance};
  --motion-stagger: 60ms;
  --motion-zoom: ${motionZoom};
}`;

  const googleFontsLinks = generateGoogleFontsHeadLinks(fontHeading, fontBody);
  if (filesToUpload["layout/theme.liquid"]) {
    filesToUpload["layout/theme.liquid"] = filesToUpload["layout/theme.liquid"].replace(
      /<!-- Structural and Niche Styling Files -->/,
      `${googleFontsLinks}\n    <!-- Structural and Niche Styling Files -->`
    );
  }
  if (filesToUpload["layout/password.liquid"]) {
    filesToUpload["layout/password.liquid"] = filesToUpload["layout/password.liquid"].replace(
      /{{ 'base-tokens\.css' \| asset_url \| stylesheet_tag }}/,
      `${googleFontsLinks}\n    {{ 'base-tokens.css' | asset_url | stylesheet_tag }}`
    );
  }

  // Step 3: Build & Inject JSON Templates
  const assembledComponents: ComponentRegistry[] = [];
  const templates: Record<string, any> = {};

  if (blueprint.globalComponents && Array.isArray(blueprint.globalComponents)) {
    blueprint.globalComponents.forEach(componentId => {
      const component = components.find(c => c.componentId === componentId);
      if (component && !assembledComponents.some(c => c.componentId === component.componentId)) {
        assembledComponents.push(component);
      }
    });
  }

  const usedComponents = await generateTemplates(blueprint, filesToUpload, components);
  for (const comp of usedComponents) {
    if (!assembledComponents.some(c => c.componentId === comp.componentId)) {
      assembledComponents.push(comp);
    }
  }
  for (const [key, content] of Object.entries(filesToUpload)) {
    if (key.startsWith("templates/") && key.endsWith(".json")) {
      try {
        templates[key] = JSON.parse(content);
      } catch (e: any) {
        throw new ValidationError(`[Stage3] Template "${key}" is invalid JSON: ${e.message}`);
      }
    }
  }

  // Step 4: Read and inject Liquid files for all resolved components
  // Note: Passing components (Prisma DB rows) as registry entries uses the read-only DB cache,
  // whose freshness against registry.json is guaranteed by the Stage 2.2 SHA-256 freshness gate.
  for (const component of assembledComponents) {
    const liquidContent = await resolveComponentLiquidContent(component, components);
    const sectionType = component.componentId;
    filesToUpload[`sections/${sectionType}.liquid`] = liquidContent;
  }

  // Stage 2.1: Category-only slot detection + Symmetrical replacement loop
  const LAYOUT_SLOTS = ["header", "footer", "announcement"] as const;
  type LayoutSlot = typeof LAYOUT_SLOTS[number];

  const activeLayoutComponents: Partial<Record<LayoutSlot, ComponentRegistry>> = {};

  if (blueprint.globalComponents && Array.isArray(blueprint.globalComponents)) {
    for (const componentId of blueprint.globalComponents) {
      const component = components.find(c => c.componentId === componentId);
      if (!component) {
        console.log('DEBUG components array:', components.map(c => c.componentId));
        throw new ValidationError(
          `[Stage2] Global component "${componentId}" not found in registry.`
        );
      }
      const slot = component.category as LayoutSlot;
      if (LAYOUT_SLOTS.includes(slot)) {
        if (activeLayoutComponents[slot]) {
          throw new ValidationError(
            `[Stage2] Blueprint specifies multiple ${slot} components: ` +
            `"${activeLayoutComponents[slot]!.componentId}" and "${component.componentId}" — exactly one allowed.`
          );
        }
        activeLayoutComponents[slot] = component;
      }
    }
  }

  // Fallback filename = group JSON ka native section type (chassis convention)
  for (const slot of LAYOUT_SLOTS) {
    const active = activeLayoutComponents[slot];
    if (!active) continue;

    const groupPath = `sections/${slot === 'announcement' ? 'header' : slot}-group.json`;
    if (!filesToUpload[groupPath]) {
      throw new ValidationError(`[Stage2] Chassis group file "${groupPath}" missing from bundle.`);
    }
    const group = JSON.parse(filesToUpload[groupPath]);
    
    // For announcement, we inject it into the header-group.json if it's not already there
    if (slot === 'announcement') {
      if (!group.sections) group.sections = {};
      group.sections["announcement"] = {
        type: active.componentId,
        settings: {}
      };
      if (!group.order) group.order = [];
      if (!group.order.includes("announcement")) {
        group.order.unshift("announcement"); // put announcement at the top
      }
      filesToUpload[groupPath] = JSON.stringify(group, null, 2);
    } else {
      const slotEntry = group.sections?.[slot];
      if (!slotEntry) {
        throw new ValidationError(`[Stage2] "${groupPath}" has no "${slot}" section entry.`);
      }

      const fallbackType = slotEntry.type;
      const newType = active.componentId;
      slotEntry.type = newType;
      filesToUpload[groupPath] = JSON.stringify(group, null, 2);

      const fallbackFile = `sections/${fallbackType}.liquid`;
      if (!(fallbackFile in filesToUpload)) {
        throw new ValidationError(
          `[Stage2] Expected fallback "${fallbackFile}" in bundle before removal — chassis convention drifted.`
        );
      }
      delete filesToUpload[fallbackFile];
    }
  }

  // Stage 3: Unified Validation Gates
  const stage3Results = runStage3Gates(filesToUpload);

  // Validate Theme Integrity
  validateThemeIntegrity(filesToUpload, blueprint, components, nicheId);

  return { filesToUpload, assembledComponents, templates, stage3Results };
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
): Promise<{ templates: Record<string, any>; settingsPatch: Record<string, any>; filesToUpload: Record<string, string> }> {
  const startTime = Date.now();
  console.log(`[Composer] Starting theme composition and live Shopify upload for theme ${themeId} (Niche: ${nicheId})`);

  // Enforce SSOT freshness gate and verify RegistryMeta
  await loadVerifiedComponents();

  let filesToUpload: Record<string, string>;
  let templates: Record<string, any>;

  // Execute deterministic compiler for safety artifacts & design token generation
  try {
    const compileResult = await compileTheme(blueprint, components, { industry: nicheId });
    filesToUpload = compileResult.filesToUpload!;
    templates = compileResult.templates!;
  } catch (compilerErr: any) {
    if (compilerErr instanceof ValidationError || compilerErr.name === 'ValidationError' || compilerErr.name === 'ChassisTamperError') {
      throw compilerErr;
    }
    console.warn(`[Composer] Compiler stage generated warning/error: ${compilerErr.message}. Falling back to direct theme assembly.`);
    const assembled = await assembleThemeBundle(blueprint, components, nicheId);
    filesToUpload = assembled.filesToUpload;
    templates = assembled.templates;
  }

  // Single-Batch Priority Upload to Shopify using Graphql themeFilesUpsert
  const { upsertThemeFilesBatched } = await import("./index");
  
  await upsertThemeFilesBatched(shop, themeId, filesToUpload);

  const durationMs = Date.now() - startTime;
  console.log(`[Composer] Batched upload complete for theme ${themeId} in ${durationMs}ms.`);

  return { templates, settingsPatch: blueprint.settings, filesToUpload };
}
