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

/**
 * Saves a serializable artifact to the compilation directory.
 */
async function saveArtifact(compileDir: string, filename: string, data: any) {
  const filePath = path.join(compileDir, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`[Compiler] Saved artifact: ${filename}`);
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
    throw new Error(`Compiler Halted: Build failed Technical or Design Validation gates. Technical: ${validation.passed ? 'PASS' : 'FAIL'}, Design: ${lint.passed ? 'PASS' : 'FAIL'}`);
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

export const composeThemeFromBlueprint = compileTheme;

