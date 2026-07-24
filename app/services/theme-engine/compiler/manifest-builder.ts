import * as crypto from "crypto";

// ─── Input Types (outputs from previous stages) ───────────────────────────────
import type { ResolvedComponents } from "./component-resolver";
import type { ResolvedDependencies } from "./dependency-resolver";
import type { ResourceCategoryMap } from "./resource-resolver";
import type { SettingsArtifact } from "./settings-resolver";
import type { LocaleArtifact } from "./locale-resolver";
import type { CSSTokenArtifact, CSSLayerName } from "./css-resolver";

// ─── Manifest Types ───────────────────────────────────────────────────────────

export interface ThemeBuildManifest {
  manifestVersion: "1.0";
  buildId: string;           
  contentHash: string;       // SHA-256 of deterministic content
  generatedAt: string;       
  
  niche: string;
  blueprintId: string;
  merchantId: string;

  summary: BuildSummary;
  uploadBundle: UploadBundle;
  explain: ExplainArtifact;

  // Stage artifacts preserved for debugging and analytics
  components: ResolvedComponents;
  dependencies: ResolvedDependencies;
  resources: ResourceCategoryMap;
  settings: SettingsArtifact;
  locales: LocaleArtifact;
  css: CSSTokenArtifact;
}

export interface BuildSummary {
  components: number;
  dependencies: number;
  cssTokens: number;
  cssLayers: number;
  cssConflicts: number;
  localeKeys: number;
  requiredSettings: number;
  missingSettings: number;
  requiredResources: number;
  missingResources: number;
  warnings: string[];
  errors: string[];
  isShippable: boolean; // Fatal flag for the deployment pipeline
}

export interface UploadBundle {
  sections: string[];
  snippets: string[];
  assets: string[];
  locales: string[];
  config: string[];
  templates: string[];
  layout: string[];
  cssOutput: string; // The composed :root {} block ready for theme.liquid
}

export interface ExplainArtifact {
  niche: string;
  selectedComponents: ExplainedComponent[];
  designDNA: Record<string, string>;
  merchantChoices: string[];
}

export interface ExplainedComponent {
  slot: string;
  componentId: string;
  reason: string;
}

export interface ManifestBuilderInput {
  buildId: string;
  merchantId: string;
  blueprintId: string;
  niche: string;
  components: ResolvedComponents;
  dependencies: ResolvedDependencies;
  resources: ResourceCategoryMap;
  locales: LocaleArtifact;
  css: CSSTokenArtifact;
  filesToUpload: Record<string, string>;
}

// ─── Main Builder ─────────────────────────────────────────────────────────────

export class ManifestBuilder {
  
  build(input: ManifestBuilderInput): ThemeBuildManifest {
    const summary = this.buildSummary(input);
    const uploadBundle = this.buildUploadBundle(input);
    const explain = this.buildExplainArtifact(input);
    const contentHash = this.computeContentHash(input);

    return {
      manifestVersion: "1.0",
      buildId: input.buildId,
      contentHash,
      generatedAt: new Date().toISOString(),
      
      niche: input.niche,
      blueprintId: input.blueprintId,
      merchantId: input.merchantId,
      
      summary,
      uploadBundle,
      explain,
      
      components: input.components,
      dependencies: input.dependencies,
      resources: input.resources,
      settings: input.settings,
      locales: input.locales,
      css: input.css,
      // filesToUpload is intentionally excluded from the output manifest JSON
      // as it's too large, but we use it to build the uploadBundle
    };
  }

  // ─── Summary & Validation Builder ──────────────────────────────────────────

  private buildSummary(input: ManifestBuilderInput): BuildSummary {
    const warnings: string[] = [];
    const errors: string[] = [];

    for (const unused of input.settings.unused) {
      warnings.push(`Unused setting in blueprint: "${unused}"`);
    }

    const missingResources = [
      ...input.resources.css.missing,
      ...input.resources.js.missing,
      ...input.resources.fonts.missing,
      ...input.resources.svg.missing,
      ...input.resources.images.missing,
    ];

    for (const missing of missingResources) {
      errors.push(`Fatal: Missing required resource: "${missing}"`);
    }

    for (const conflict of input.css.conflicts) {
      warnings.push(
        `CSS Override: "${conflict.token}" changed from ${conflict.original.value} (${conflict.original.layer}) to ${conflict.override.value} (${conflict.override.layer})`
      );
    }

    const isShippable = errors.length === 0;
    const requiredResourcesCount = 
      input.resources.css.required.length +
      input.resources.js.required.length +
      input.resources.fonts.required.length +
      input.resources.svg.required.length +
      input.resources.images.required.length;

    return {
      components: input.components.componentIds.length,
      dependencies: input.dependencies.flat.sections.length + input.dependencies.flat.snippets.length,
      cssTokens: input.css.stats.totalTokens,
      cssLayers: input.css.layers.length,
      cssConflicts: input.css.conflicts.length,
      localeKeys: Object.keys(input.locales.translations).length,
      requiredSettings: Object.keys(input.settings.settings_data).length + input.settings.missing.length,
      missingSettings: input.settings.missing.length,
      requiredResources: requiredResourcesCount + missingResources.length,
      missingResources: missingResources.length,
      warnings,
      errors,
      isShippable,
    };
  }

  // ─── Upload Bundle Builder ─────────────────────────────────────────────────

  private buildUploadBundle(input: ManifestBuilderInput): UploadBundle {
    const { css, filesToUpload } = input;
    const allFiles = Object.keys(filesToUpload);

    return {
      sections: allFiles.filter(f => f.startsWith("sections/")).sort(),
      snippets: allFiles.filter(f => f.startsWith("snippets/")).sort(),
      assets: allFiles.filter(f => f.startsWith("assets/")).sort(),
      locales: allFiles.filter(f => f.startsWith("locales/")).sort(),
      config: allFiles.filter(f => f.startsWith("config/")).sort(),
      templates: allFiles.filter(f => f.startsWith("templates/")).sort(),
      layout: allFiles.filter(f => f.startsWith("layout/")).sort(),
      cssOutput: css.cssOutput,
    };
  }

  // ─── Explain Artifact Builder (Merchant Transparency) ──────────────────────

  private buildExplainArtifact(input: ManifestBuilderInput): ExplainArtifact {
    const { niche, components, css } = input;

    const selectedComponents: ExplainedComponent[] = components.componentIds.map((id) => {
      const slot = id.split("-")[0]; 
      return {
        slot,
        componentId: id,
        reason: `Selected to match ${niche} narrative and motion system.`,
      };
    });

    const keyTokens = ["--color-primary", "--color-background", "--font-heading"];
    const designDNA: Record<string, string> = {};
    
    for (const token of keyTokens) {
      if (css.composed[token]) {
        const label = token.replace("--", "").replace(/-/g, " ");
        designDNA[label] = css.composed[token];
      }
    }

    const merchantChoices: string[] = [];
    const merchantLayer = css.layers.find((l) => l.name === "merchant-overrides");
    
    if (merchantLayer) {
      for (const [token, value] of Object.entries(merchantLayer.tokens)) {
        const affected = Object.entries(css.composed).filter(([k]) => k === token).length;
        const label = token.replace("--", "").replace(/-/g, " ");
        merchantChoices.push(`Your brand ${label} (${value}) applied across ${affected} foundational element(s).`);
      }
    }

    return {
      niche,
      selectedComponents,
      designDNA,
      merchantChoices,
    };
  }

  // ─── Deterministic Content Hash ────────────────────────────────────────────

  private computeContentHash(input: ManifestBuilderInput): string {
    const deterministicPayload = JSON.stringify({
      niche: input.niche,
      blueprintId: input.blueprintId,
      componentIds: [...input.components.componentIds].sort(),
      cssComposed: Object.entries(input.css.composed).sort(),
      localeKeys: Object.keys(input.locales.translations).sort(),
    });

    return crypto
      .createHash("sha256")
      .update(deterministicPayload)
      .digest("hex");
  }
}

/**
 * Orchestrator integration function
 */
export async function buildManifest(input: ManifestBuilderInput): Promise<ThemeBuildManifest> {
  const builder = new ManifestBuilder();
  return builder.build(input);
}
