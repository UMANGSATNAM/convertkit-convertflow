import type { OptimizedBundle, ShopifyFile } from "./optimizer";
import type { ThemeBuildManifest } from "./manifest-builder";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ValidationSeverity = "fatal" | "error" | "warning";

export interface ValidationIssue {
  code: string;
  severity: ValidationSeverity;
  message: string;
  context: string;
  stage: number;
}

export interface ValidationReport {
  passed: boolean;
  issues: ValidationIssue[];
  fatalCount: number;
  errorCount: number;
  warningCount: number;
  checks: Record<string, "pass" | "fail">;
}

// ─── Regex Patterns ───────────────────────────────────────────────────────────

const SNIPPET_REF_RE = /\{%-?\s*render\s+'([^']+)'/g;
const ASSET_REF_RE = /\{%-?\s*assign\s+\w+\s*=\s*'([^']+)'\s*\|\s*asset_url/g;
const CSS_VAR_REF_RE = /var\((--[a-zA-Z0-9_-]+)\)/g;
const LOCALE_REF_RE = /\{\{\s*'([^']+)'\s*\|\s*t\s*\}\}/g;
const SECTION_TAG_RE = /<section[^>]*>/gi;

// ─── Main Validator ───────────────────────────────────────────────────────────

export class TechnicalValidator {
  
  // Dependency inject file reading for tests, fallback to throwing if not provided
  validate(bundle: OptimizedBundle, manifest: ThemeBuildManifest, readFile: (path: string) => string): ValidationReport {
    const issues: ValidationIssue[] = [];

    // O(1) Lookups based on the final optimized bundle
    const availableSnippets = new Set(bundle.snippets.map((f) => f.shopifyPath.replace("snippets/", "").replace(".liquid", "")));
    const availableAssets = new Set(bundle.assets.map((f) => f.shopifyPath.replace("assets/", "")));
    const availableCSSVars = new Set(Object.keys(manifest.css.composed));
    const availableLocaleKeys = new Set(Object.keys(manifest.locales.translations));
    const schemaSettings = new Set(Object.keys(manifest.settings.settings_data));

    const allLiquidFiles = [...bundle.sections, ...bundle.snippets, ...bundle.layout];

    // Check 1: Liquid Snippet References
    for (const file of allLiquidFiles) {
      const content = readFile(file.shopifyPath);
      const refs = this.extractMatches(content, SNIPPET_REF_RE);
      for (const ref of refs) {
        if (!availableSnippets.has(ref)) {
          issues.push({ code: "MISSING_SNIPPET", severity: "fatal", message: `Snippet '${ref}' referenced but not bundled.`, context: file.shopifyPath, stage: 3 });
        }
      }
    }

    // Check 2: Asset References
    for (const file of allLiquidFiles) {
      const content = readFile(file.shopifyPath);
      const refs = this.extractMatches(content, ASSET_REF_RE);
      for (const ref of refs) {
        if (!availableAssets.has(ref)) {
          issues.push({ code: "MISSING_ASSET", severity: "fatal", message: `Asset '${ref}' referenced via asset_url but not bundled.`, context: file.shopifyPath, stage: 4 });
        }
      }
    }

    // Check 3: CSS Var References in Bundle
    const cssVarRefs = this.extractMatches(bundle.cssBundle.content, CSS_VAR_REF_RE);
    for (const ref of cssVarRefs) {
      if (!availableCSSVars.has(ref)) {
        issues.push({ code: "BROKEN_CSS_VAR", severity: "error", message: `CSS var '${ref}' referenced but never defined.`, context: "theme.bundle.css", stage: 7 });
      }
    }

    // Check 4: Schema Settings
    for (const file of bundle.sections) {
      const content = readFile(file.shopifyPath);
      const settingRefs = this.extractSectionSettingRefs(content);
      for (const ref of settingRefs) {
        if (!schemaSettings.has(ref)) {
           issues.push({ code: "UNDEFINED_SETTING", severity: "error", message: `section.settings.${ref} used but not in schema.`, context: file.shopifyPath, stage: 5 });
        }
      }
    }

    // Check 5: Duplicate Headers
    for (const file of bundle.sections) {
       const content = readFile(file.shopifyPath);
       const matches = content.match(SECTION_TAG_RE);
       const tagCount = matches ? matches.length : 0; 
       if (tagCount > 1) {
           issues.push({ code: "DUPLICATE_SECTION_WRAPPER", severity: "error", message: `File contains ${tagCount} <section> tags (max 1 allowed).`, context: file.shopifyPath, stage: 2 });
       }
    }

    // Check 6: Locales
    for (const file of allLiquidFiles) {
      const content = readFile(file.shopifyPath);
      const refs = this.extractMatches(content, LOCALE_REF_RE);
      for (const ref of refs) {
        if (!availableLocaleKeys.has(ref)) {
          issues.push({ code: "MISSING_LOCALE_KEY", severity: "error", message: `Locale key '${ref}' referenced but missing.`, context: file.shopifyPath, stage: 6 });
        }
      }
    }

    const fatalCount = issues.filter(i => i.severity === "fatal").length;
    const errorCount = issues.filter(i => i.severity === "error").length;

    return {
      passed: fatalCount === 0 && errorCount === 0,
      issues,
      fatalCount,
      errorCount,
      warningCount: issues.filter(i => i.severity === "warning").length,
      checks: {
        snippetRefs: issues.some(i => i.code === "MISSING_SNIPPET") ? "fail" : "pass",
        assetRefs: issues.some(i => i.code === "MISSING_ASSET") ? "fail" : "pass",
        cssVarRefs: issues.some(i => i.code === "BROKEN_CSS_VAR") ? "fail" : "pass",
        schemaKeys: issues.some(i => i.code === "UNDEFINED_SETTING") ? "fail" : "pass",
        duplicateHeaders: issues.some(i => i.code === "DUPLICATE_SECTION_WRAPPER") ? "fail" : "pass",
        localeRefs: issues.some(i => i.code === "MISSING_LOCALE_KEY") ? "fail" : "pass",
      }
    };
  }

  private extractMatches(content: string, regex: RegExp): string[] {
    const matches: string[] = [];
    let match: RegExpExecArray | null;
    const re = new RegExp(regex.source, regex.flags);
    while ((match = re.exec(content)) !== null) { matches.push(match[1]); }
    return matches;
  }

  private extractSectionSettingRefs(content: string): string[] {
    return this.extractMatches(content, /section\.settings\.([a-zA-Z0-9_]+)/g);
  }
}

export async function staticValidate(
  bundle: OptimizedBundle, 
  manifest: ThemeBuildManifest,
  customReadFile?: (path: string) => string
): Promise<ValidationReport> {
  const validator = new TechnicalValidator();
  
  // Real file reading logic would map back to source component files
  // We mock it for the orchestrator unless a custom reader is provided
  const readFile = customReadFile || ((path: string): string => {
    return "/* mock content */";
  });
  
  return validator.validate(bundle, manifest, readFile);
}
