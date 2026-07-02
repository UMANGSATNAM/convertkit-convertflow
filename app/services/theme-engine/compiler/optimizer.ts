import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { ThemeBuildManifest, UploadBundle } from "./manifest-builder";

// ─── Input / Output Types ─────────────────────────────────────────────────────

export interface OptimizedBundle {
  sections: ShopifyFile[];
  snippets: ShopifyFile[];
  assets: ShopifyFile[];
  locales: ShopifyFile[];
  config: ShopifyFile[];
  templates: ShopifyFile[];
  layout: ShopifyFile[];
  cssBundle: BundledAsset;
  jsBundle: BundledAsset;
  stats: OptimizerStats;
}

export interface ShopifyFile {
  shopifyPath: string;   
  contentHash: string;   // SHA-256 for incremental diffing (Upload only if changed)
  sizeBytes: number;
}

export interface BundledAsset {
  filename: string;   
  content: string;    
  contentHash: string;
  sizeBytes: number;
  sourceFiles: string[]; 
}

export interface OptimizerStats {
  inputFiles: number;
  outputFiles: number;
  duplicatesRemoved: number;
  cssBundleSizeBytes: number;
  jsBundleSizeBytes: number;
  totalInputSizeBytes: number;
  totalOutputSizeBytes: number;
  compressionRatio: number; 
  unusedAssetsRemoved: number;
  optimizationMs: number;
}

export interface BuildOptimizerInput {
  uploadBundle: UploadBundle;
  // Injected dependency: keeps the optimizer pure and highly testable
  readFile: (path: string) => string;
  // Set of CSS variables actually used by the resolved components
  usedCSSTokens: Set<string>;
  options?: {
    minify: boolean;     // default: true
    treeshake: boolean;  // default: true
  };
}

// ─── Utility Engines ──────────────────────────────────────────────────────────

function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*{\s*/g, "{")
    .replace(/\s*}\s*/g, "}")
    .replace(/\s*:\s*/g, ":")
    .replace(/\s*;\s*/g, ";")
    .replace(/;}/g, "}")
    .trim();
}

function minifyJS(js: string): string {
  return js
    .replace(/\/\/[^\n]*/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function treeshakeCSS(cssRoot: string, usedTokens: Set<string>): { css: string; removedCount: number } {
  const lines = cssRoot.split("\n");
  let removedCount = 0;
  
  const filtered = lines.filter((line) => {
    const tokenMatch = line.match(/^\s+(--[a-zA-Z0-9_-]+)\s*:/);
    if (!tokenMatch) return true; // Keep structural lines like `:root {`
    
    const token = tokenMatch[1];
    if (usedTokens.has(token)) return true;
    
    removedCount++;
    return false;
  });
  
  return { css: filtered.join("\n"), removedCount };
}

function hashContent(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex").slice(0, 16);
}

// ─── Main Optimizer ───────────────────────────────────────────────────────────

export class BuildOptimizer {
  
  optimize(input: BuildOptimizerInput): OptimizedBundle {
    const startMs = Date.now();
    const { uploadBundle, readFile, usedCSSTokens } = input;
    const opts = { minify: true, treeshake: true, ...input.options };

    let totalInputBytes = 0;
    let totalOutputBytes = 0;
    let unusedAssetsRemoved = 0;

    // 1. Deduplicate Assets
    const uniqueAssets = Array.from(new Set(uploadBundle.assets));
    const duplicatesRemoved = uploadBundle.assets.length - uniqueAssets.length;

    const cssFiles = uniqueAssets.filter((f) => f.endsWith(".css"));
    const jsFiles = uniqueAssets.filter((f) => f.endsWith(".js"));
    const otherAssets = uniqueAssets.filter((f) => !f.endsWith(".css") && !f.endsWith(".js"));

    // 2. CSS Bundle & Treeshake
    let rootCSS = uploadBundle.cssOutput;
    totalInputBytes += Buffer.byteLength(rootCSS, "utf-8");

    if (opts.treeshake) {
      const { css, removedCount } = treeshakeCSS(rootCSS, usedCSSTokens);
      rootCSS = css;
      unusedAssetsRemoved += removedCount;
    }

    const cssContents = [rootCSS, ...cssFiles.map(f => {
      const content = readFile(f);
      totalInputBytes += Buffer.byteLength(content, "utf-8");
      return content;
    })];

    let bundledCSS = cssContents.join("\n\n");
    if (opts.minify) bundledCSS = minifyCSS(bundledCSS);
    totalOutputBytes += Buffer.byteLength(bundledCSS, "utf-8");

    const cssBundle: BundledAsset = {
      filename: "theme.bundle.css",
      content: bundledCSS,
      contentHash: hashContent(bundledCSS),
      sizeBytes: Buffer.byteLength(bundledCSS, "utf-8"),
      sourceFiles: ["cssOutput", ...cssFiles],
    };

    // 3. JS Bundle & Minify
    const jsContents = jsFiles.map(f => {
      const content = readFile(f);
      totalInputBytes += Buffer.byteLength(content, "utf-8");
      return content;
    });

    let bundledJS = jsContents.join("\n\n");
    if (opts.minify) bundledJS = minifyJS(bundledJS);
    totalOutputBytes += Buffer.byteLength(bundledJS, "utf-8");

    const jsBundle: BundledAsset = {
      filename: "theme.bundle.js",
      content: bundledJS,
      contentHash: hashContent(bundledJS),
      sizeBytes: Buffer.byteLength(bundledJS, "utf-8"),
      sourceFiles: jsFiles,
    };

    // 4. Merge Locales (Safe due to Stage 6 Strict Locale Resolver)
    const mergedLocales: Record<string, string> = {};
    for (const file of uploadBundle.locales) {
      Object.assign(mergedLocales, JSON.parse(readFile(file)));
    }
    
    // Deterministic sorting of locale keys
    const sortedLocales = Object.fromEntries(Object.entries(mergedLocales).sort(([a], [b]) => a.localeCompare(b)));
    const mergedLocaleContent = JSON.stringify(sortedLocales, null, 2);
    totalOutputBytes += Buffer.byteLength(mergedLocaleContent, "utf-8");

    // 5. Build ShopifyFile Interfaces
    const toShopifyFile = (path: string): ShopifyFile => {
      const content = readFile(path);
      const bytes = Buffer.byteLength(content, "utf-8");
      totalInputBytes += bytes;
      totalOutputBytes += bytes;
      return { shopifyPath: path, contentHash: hashContent(content), sizeBytes: bytes };
    };

    const sections = uploadBundle.sections.map(toShopifyFile);
    const snippets = uploadBundle.snippets.map(toShopifyFile);
    const templates = uploadBundle.templates.map(toShopifyFile);
    const config = uploadBundle.config.map(toShopifyFile);
    const layout = uploadBundle.layout.map(toShopifyFile);
    const assets = otherAssets.map(toShopifyFile);
    
    const locales: ShopifyFile[] = [{
      shopifyPath: "locales/en.default.json",
      contentHash: hashContent(mergedLocaleContent),
      sizeBytes: Buffer.byteLength(mergedLocaleContent, "utf-8")
    }];

    // 6. Generate Stats
    const inputFiles = uploadBundle.sections.length + uploadBundle.snippets.length + uploadBundle.assets.length + uploadBundle.locales.length + uploadBundle.config.length + uploadBundle.templates.length + uploadBundle.layout.length;
    const outputFiles = sections.length + snippets.length + assets.length + locales.length + config.length + templates.length + layout.length + 2; // +2 for bundles
    
    const compressionRatio = totalInputBytes > 0 ? totalOutputBytes / totalInputBytes : 1;

    return {
      sections, snippets, assets, locales, config, templates, layout, cssBundle, jsBundle,
      stats: {
        inputFiles,
        outputFiles,
        duplicatesRemoved,
        cssBundleSizeBytes: cssBundle.sizeBytes,
        jsBundleSizeBytes: jsBundle.sizeBytes,
        totalInputSizeBytes: totalInputBytes,
        totalOutputSizeBytes: totalOutputBytes,
        compressionRatio: Math.round(compressionRatio * 100) / 100,
        unusedAssetsRemoved,
        optimizationMs: Date.now() - startMs,
      }
    };
  }
}

/**
 * Orchestrator integration function
 */
export async function optimizeBundle(manifest: ThemeBuildManifest): Promise<OptimizedBundle> {
  const uploadBundle = manifest.uploadBundle;
  
  // Real implementation scans all liquid files to find used CSS tokens
  // Mocking all tokens as used to avoid removing valid tokens during this stage
  const usedCSSTokens = new Set(Object.keys(manifest.css.composed));

  const readFile = (filePath: string): string => {
    if (filePath === "locales/en.default.json") {
      return JSON.stringify(manifest.locales.translations);
    }
    // We mock file reading for the orchestrator until real file system ties are built
    // Usually we would map Shopify paths back to their Component Registry source paths
    
    if (filePath.endsWith(".css")) {
      return "/* mocked css */";
    }
    if (filePath.endsWith(".js")) {
      return "// mocked js";
    }
    if (filePath.endsWith(".json")) {
      return "{}";
    }
    return "mocked content";
  };

  const optimizer = new BuildOptimizer();
  return optimizer.optimize({
    uploadBundle,
    readFile,
    usedCSSTokens
  });
}
