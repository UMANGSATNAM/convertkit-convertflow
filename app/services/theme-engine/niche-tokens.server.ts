import { existsSync, readFileSync } from "fs";
import * as path from "path";

/**
 * Design tokens carried by a niche profile.
 *
 * These are the colours and type a store falls back to when the merchant has
 * supplied no logo and the catalogue gives no strong brand signal. Before they
 * existed, that case produced plain white with near-black text for every niche,
 * which is why generated stores looked like the same blank template regardless
 * of what they sold.
 */
export interface NicheDesignTokens {
  background: string;
  text: string;
  accent: string;
  surface: string;
  fontHeading: string;
  fontBody: string;
  button_style: string;
  card_style: string;
  section_density: string;
  /** Which profile these came from — for logging. */
  source: string;
}

const PROFILE_DIR = path.resolve(process.cwd(), "app/data/templates/theme-engine/niche-profiles");

/**
 * Maps the many ways a niche is named to a profile filename.
 *
 * `nicheId` comes from the merchant's selection and `industry` from catalogue
 * analysis, and neither is guaranteed to match a filename — "jewelry" and
 * "jewellery" are both in use, as are "tech" and "electronics".
 */
const ALIASES: Record<string, string> = {
  jewelry: "jewellery",
  jewellery: "jewellery",
  beauty: "beauty",
  skincare: "beauty",
  cosmetics: "beauty",
  electronics: "electronics",
  tech: "electronics",
  gadgets: "electronics",
  "home-decor": "home-decor",
  home: "home-decor",
  homeware: "home-decor",
  decor: "home-decor",
  furniture: "home-decor",
  streetwear: "streetwear",
  fashion: "streetwear",
  apparel: "streetwear",
  clothing: "streetwear",
};

function normalize(value: unknown): string {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-");
}

const cache = new Map<string, NicheDesignTokens | null>();

/**
 * Returns the design tokens for a niche, or null when no profile matches.
 *
 * Candidates are tried in order of specificity: the merchant's explicit niche
 * first, then the industry inferred from their catalogue.
 */
export function loadNicheDesignTokens(
  nicheId?: string | null,
  industry?: string | null
): NicheDesignTokens | null {
  const candidates = [normalize(nicheId), normalize(industry)].filter(Boolean);
  const cacheKey = candidates.join("|");
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  let result: NicheDesignTokens | null = null;

  for (const candidate of candidates) {
    const profileName = ALIASES[candidate] || candidate;
    const file = path.join(PROFILE_DIR, `${profileName}.json`);
    if (!existsSync(file)) continue;

    try {
      const profile = JSON.parse(readFileSync(file, "utf-8"));
      const tokens = profile?.designTokens;
      if (!tokens || typeof tokens !== "object") continue;

      // A profile missing the three colours cannot be used as a fallback —
      // partial tokens would mix a niche background with a generic accent.
      if (!tokens.background || !tokens.text || !tokens.accent) {
        console.warn(`[Design Tokens] "${profileName}" has designTokens but is missing a required colour — ignoring.`);
        continue;
      }

      result = {
        background: tokens.background,
        text: tokens.text,
        accent: tokens.accent,
        surface: tokens.surface || tokens.background,
        fontHeading: tokens.fontHeading || "Inter",
        fontBody: tokens.fontBody || "Inter",
        button_style: tokens.button_style || "rounded",
        card_style: tokens.card_style || "soft",
        section_density: tokens.section_density || "airy",
        source: profileName,
      };
      break;
    } catch (err: any) {
      console.warn(`[Design Tokens] Could not read niche profile "${profileName}": ${err.message}`);
    }
  }

  cache.set(cacheKey, result);
  return result;
}
