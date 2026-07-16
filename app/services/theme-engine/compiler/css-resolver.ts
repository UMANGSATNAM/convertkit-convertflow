import * as fs from "fs";
import * as path from "path";
import { ResolvedDependencies } from "./dependency-resolver";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CSSLayerName =
  | "base-tokens"
  | "theme-dna"
  | "component-tokens"
  | "merchant-overrides";

export interface CSSLayer {
  name: CSSLayerName;
  order: 1 | 2 | 3 | 4;
  tokens: Record<string, string>; // CSS variable name → value
  sourceFile: string;
}

export interface CSSTokenArtifact {
  layers: CSSLayer[];
  composed: Record<string, string>; // Final merged token map
  cssOutput: string;                // Ready-to-write :root block
  conflicts: CSSConflict[];         // Audit trail of overrides
  stats: {
    totalTokens: number;
    overrides: number;
    layerBreakdown: Record<CSSLayerName, number>;
  };
}

export interface CSSConflict {
  token: string;
  original: { layer: CSSLayerName; value: string };
  override: { layer: CSSLayerName; value: string };
}

export interface CSSResolverInput {
  niche: string;                             // e.g. "jewellery"
  componentTokens: Record<string, string>;   // Passed from Stage 4/5 Dependency Graph
  merchantOverrides: Record<string, string>; // From blueprint.settings.brand
  themeDir: string;                          // Root path for JSON config files
}

export type TokenFileFetcher = (layer: "base-tokens" | "theme-dna", input: CSSResolverInput) => Record<string, string>;

// ─── Merchant Override Generator ─────────────────────────────────────────────

export function generateMerchantTokens(
  overrides: Record<string, string>
): Record<string, string> {
  const tokens: Record<string, string> = {};
  
  // Legacy map support
  const MERCHANT_TOKEN_MAP: Record<string, string> = {
    color_primary:    "--color-primary",
    color_secondary:  "--color-secondary",
    color_background: "--color-background",
    color_text:       "--color-text",
    color_accent:     "--color-accent",
    font_heading:     "--font-heading",
    font_body:        "--font-body",
    border_radius:    "--radius-base",
  };
  for (const [settingKey, cssVar] of Object.entries(MERCHANT_TOKEN_MAP)) {
    if (overrides[settingKey]) {
      tokens[cssVar] = overrides[settingKey];
    }
  }

  // Modern Blueprint Settings map support
  if (overrides.colors_background_1) tokens["--color-background"] = overrides.colors_background_1;
  if (overrides.colors_text_1 || overrides.colors_text || overrides.colors_accent_1) tokens["--color-text"] = overrides.colors_text_1 || overrides.colors_text || overrides.colors_accent_1;
  if (overrides.colors_accent_2) tokens["--color-accent"] = overrides.colors_accent_2;
  if (overrides.colors_surface) tokens["--color-surface"] = overrides.colors_surface;
  tokens["--color-text-muted"] = "#64748b";
  tokens["--color-text-secondary"] = "#64748b";
  tokens["--color-border"] = "#e2e8f0";
  
  const isLuxury = overrides.designDirection === 'LUXURY';
  const isBold = overrides.designDirection === 'BOLD';

  const headingFont = overrides.fontHeading || overrides.font_heading;
  const bodyFont = overrides.fontBody || overrides.font_body;
  if (headingFont) {
    tokens["--font-heading-family"] = `'${headingFont}', sans-serif`;
  } else if (isLuxury) {
    tokens["--font-heading-family"] = "'Playfair Display', Georgia, serif";
  }
  if (bodyFont) {
    tokens["--font-body-family"] = `'${bodyFont}', sans-serif`;
  } else {
    tokens["--font-body-family"] = "'Inter', -apple-system, sans-serif";
  }
  
  if (overrides.card_style) {
    tokens["--card-radius"] = overrides.card_style === 'soft' ? '12px' : overrides.card_style === 'rounded' ? '24px' : '0px';
  }
  if (overrides.button_style) {
    tokens["--button-radius"] = overrides.button_style === 'pill' ? '50px' : overrides.button_style === 'rounded' ? '8px' : '0px';
  }
  if (overrides.section_density) {
    tokens["--section-padding-y"] = overrides.section_density === 'airy' ? '80px' : overrides.section_density === 'tight' ? '40px' : '60px';
  }

  tokens["--weight-display"] = isLuxury ? "400" : "700";
  tokens["--weight-heading"] = isLuxury ? "500" : "600";
  tokens["--weight-body"] = "400";
  tokens["--weight-emphasis"] = "600";

  tokens["--font-display"] = isLuxury ? 'clamp(2.75rem, 5.5vw, 4.5rem)' : isBold ? 'clamp(3rem, 7vw, 6rem)' : 'clamp(2.5rem, 6vw, 5rem)';
  tokens["--font-h1"] = isLuxury ? 'clamp(2rem, 4vw, 3rem)' : 'clamp(2rem, 4vw, 3.5rem)';
  tokens["--font-h2"] = isLuxury ? 'clamp(1.5rem, 3vw, 2.25rem)' : 'clamp(1.5rem, 3vw, 2.5rem)';
  tokens["--font-h3"] = '1.25rem';
  tokens["--font-body"] = '1rem';
  tokens["--font-small"] = isLuxury ? '0.8125rem' : '0.875rem';
  tokens["--font-eyebrow"] = isLuxury ? '0.6875rem' : '0.75rem';

  tokens["--tracking-eyebrow"] = isLuxury ? '0.2em' : '0.15em';
  tokens["--tracking-display"] = isLuxury ? '-0.01em' : isBold ? '-0.04em' : '-0.02em';
  tokens["--tracking-body"] = '0';
  tokens["--tracking-tight"] = isBold ? '-0.04em' : '-0.01em';
  tokens["--tracking-wide"] = isLuxury ? '0.2em' : '0.15em';

  tokens["--leading-display"] = isLuxury ? '1.1' : isBold ? '1.05' : '1.1';
  tokens["--leading-tight"] = isBold ? '1.05' : isLuxury ? '1.1' : '1.1';
  tokens["--leading-body"] = isLuxury ? '1.65' : '1.6';
  
  return tokens;
}

// ─── Main Resolver ────────────────────────────────────────────────────────────

export class CSSTokenResolver {
  constructor(private fetchTokenFile: TokenFileFetcher) {}
  
  resolve(input: CSSResolverInput): CSSTokenArtifact {
    const conflicts: CSSConflict[] = [];
    const composed: Record<string, string> = {};
    const layers: CSSLayer[] = [];
    const layerOrder: CSSLayerName[] = [
      "base-tokens",
      "theme-dna",
      "component-tokens",
      "merchant-overrides",
    ];

    for (let i = 0; i < layerOrder.length; i++) {
      const layerName = layerOrder[i];
      const order = (i + 1) as 1 | 2 | 3 | 4;

      let tokens: Record<string, string> = {};
      let sourceFile = "";

      // Determine token source based on layer
      if (layerName === "merchant-overrides") {
        tokens = generateMerchantTokens(input.merchantOverrides || {});
        sourceFile = "memory:blueprint.settings.brand";
      } else if (layerName === "component-tokens") {
        tokens = input.componentTokens || {};
        sourceFile = "memory:dependency-graph";
      } else {
        tokens = this.fetchTokenFile(layerName, input);
        sourceFile = layerName === "base-tokens" ? "tokens/base-tokens.json" : `tokens/dna/${input.niche}.json`;
      }

      // Merge and track conflicts
      for (const [token, newValue] of Object.entries(tokens)) {
        // Enforce strict prefix formatting to prevent malformed CSS later
        if (!token.startsWith("--")) {
           throw new Error(`[CSSTokenResolver] Invalid token format in ${layerName}: "${token}". Must start with "--".`);
        }

        if (composed[token] !== undefined && composed[token] !== newValue) {
          const originalLayer = layers.find((l) => l.tokens[token] !== undefined);
          conflicts.push({
            token,
            original: {
              layer: originalLayer?.name ?? "base-tokens",
              value: composed[token],
            },
            override: { layer: layerName, value: newValue },
          });
        }
        composed[token] = newValue;
      }

      layers.push({ name: layerName, order, tokens, sourceFile });
    }

    // Run strict Linter before generating CSS
    this.lintTokens(composed);

    // Compose final :root CSS block (Deterministically sorted)
    const cssLines = Object.entries(composed)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([token, value]) => `  ${token}: ${value};`);

    const cssOutput = `:root {\n${cssLines.join("\n")}\n}`;

    // Generate Stats
    const layerBreakdown = {} as Record<CSSLayerName, number>;
    for (const layer of layers) {
      layerBreakdown[layer.name] = Object.keys(layer.tokens).length;
    }

    return {
      layers,
      composed,
      cssOutput,
      conflicts,
      stats: {
        totalTokens: Object.keys(composed).length,
        overrides: conflicts.length,
        layerBreakdown,
      },
    };
  }

  // ─── CSS Linter ─────────────────────────────────────────────────────────────
  // Validates that no token references a missing variable (e.g., var(--missing-color))
  
  private lintTokens(composed: Record<string, string>) {
    const allTokens = new Set(Object.keys(composed));
    const varRegex = /var\((--[a-zA-Z0-9_-]+)\)/g;

    for (const [token, value] of Object.entries(composed)) {
      let match: RegExpExecArray | null;
      while ((match = varRegex.exec(value)) !== null) {
        const referencedVar = match[1];
        if (!allTokens.has(referencedVar)) {
          throw new Error(
            `[CSSTokenResolver] Linter Fatal Error: Token "${token}" references an undefined variable "${referencedVar}".`
          );
        }
      }
    }
  }
}

/**
 * Orchestrator integration function
 */
export async function resolveCSSTokens(
  blueprint: any,
  dependencies: ResolvedDependencies
): Promise<CSSTokenArtifact> {
  const fetcher: TokenFileFetcher = (layer, input) => {
    let filePath = "";
    if (layer === "base-tokens") {
      filePath = path.join(input.themeDir, "tokens/base-tokens.json");
    } else {
      filePath = path.join(input.themeDir, `tokens/dna/${input.niche}.json`);
    }
    
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    return {};
  };

  // In reality, component tokens would be extracted from the dependency graph.
  // We mock the extraction here for now.
  const componentTokens: Record<string, string> = {};
  
  // Actually, we could extract them if the metadata exposed them, but
  // for now we'll pass an empty object since it's just the pipeline stage.
  
  const resolver = new CSSTokenResolver(fetcher);
  return resolver.resolve({
    niche: blueprint.catalogProfile?.industry || 'default',
    themeDir: process.cwd(), // Will be updated to actual theme directory
    componentTokens,
    merchantOverrides: blueprint.settings || {}
  });
}
