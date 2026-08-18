import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { upsertThemeFilesBatched, readFile } from "./theme-engine/index";
import { graphqlRequest } from "./shopify-api.server";
import { buildStorePalette, applyStorePalette } from "./theme-engine/palette.server";
import { resolveSectionBundle } from "./section-install.server";

/**
 * Whole-page designs, staged in a draft theme and published together.
 *
 * ## Why whole pages rather than single sections
 *
 * A merchant does not think "I want a different testimonials band" — they think
 * "I want a better home page". Swapping sections one at a time asks them to be
 * the art director for a composition they never chose. A page design is the unit
 * they can actually judge from a preview.
 *
 * ## Why a draft theme
 *
 * Every change is written to an unpublished copy of the live theme. The merchant
 * can add a home page, then a product page, then a cart, see all of it running
 * against their real catalogue, and only when they press Publish does anything
 * their shoppers can see change. Writing straight to the live theme would mean
 * every experiment is public the moment it is made.
 *
 * Publishing swaps that draft in wholesale, so the pages they approved are
 * exactly the pages that go live.
 */

const ENGINE = path.resolve(process.cwd(), "app/data/templates/theme-engine");
const DRAFT_NAME = "ConvertFlow — Draft (unpublished)";

export type PageType = "index" | "product" | "collection" | "cart" | "cart-drawer";

export interface CompositionSection {
  componentId: string;
  /** Written into the template as-is. Palette and product wiring run after. */
  settings?: Record<string, any>;
}

export interface PageComposition {
  id: string;
  name: string;
  pageType: PageType;
  niche: string;
  family: string;
  archetype?: string;
  styleBadge?: string;
  accentColor?: string;
  /** One line a merchant can judge the design by before previewing it. */
  description: string;
  sections: CompositionSection[];
  /**
   * Chrome that lives in a section group rather than the page template.
   * A home page design that leaves the merchant's old header in place is only
   * two thirds of a design.
   */
  header?: string;
  footer?: string;
}

/**
 * The catalogue of page designs.
 *
 * 10 Curated, Top-Tier D2C Homepages (20-22 modular mobile-responsive sections each)
 * covering 3 Clothing, 3 Beauty, 3 Jewellery, and 1 Tech archetypes.
 */
export const COMPOSITIONS: PageComposition[] = [
  // ── 1. CLOTHING (3 D2C Archetypes) ───────────────────────────────────────
  {
    id: "streetwear-cyber-home",
    name: "Cyber Streetwear D2C",
    pageType: "index",
    niche: "clothing",
    family: "Streetwear",
    archetype: "cyber-brutalist",
    styleBadge: "High Energy Drops",
    accentColor: "#f59e0b",
    description:
      "21 high-energy cyber streetwear sections: drop countdown ticker, bold hero, shoppable reels, lookbook grid, VIP rewards, and dark brutalist typography.",
    header: "header-bold-v1",
    footer: "footer-bold-v1",
    sections: [
      { componentId: "announcement-bold-v1" },
      { componentId: "hp22-marquee" },
      { componentId: "hero-bold-v1" },
      { componentId: "hp22-usp" },
      { componentId: "hp22-category-tiles" },
      { componentId: "hp22-bestsellers" },
      { componentId: "hp22-offer-banner" },
      { componentId: "hp22-ugc-reels" },
      { componentId: "hp22-brand-story" },
      { componentId: "hp22-instagram" },
      { componentId: "grid-featured-lookbook-v1" },
      { componentId: "hp22-press-logos" },
      { componentId: "hp22-testimonials" },
      { componentId: "hp22-bundle-offer" },
      { componentId: "hp22-founder-note" },
      { componentId: "hp22-faq" },
      { componentId: "hp22-newsletter" },
      { componentId: "hp20-18-footer-promo" },
      { componentId: "popup-spin-wheel-v1" },
      { componentId: "newsletter-bold-v1" },
      { componentId: "footer-bold-v1" },
    ],
  },
  {
    id: "ethnic-royal-home",
    name: "Royal Heritage & Ethnic Luxe",
    pageType: "index",
    niche: "clothing",
    family: "Luxury",
    archetype: "royal-heritage",
    styleBadge: "Royal Heritage Couture",
    accentColor: "#d97706",
    description:
      "22 grand ethnic couture sections: gold announcement, royal marquee, craftsmanship story, bridal lookbook, artisan press, and heritage mega footer.",
    header: "hp7-header",
    footer: "hp7-footer",
    sections: [
      { componentId: "announcement-luxury-v1" },
      { componentId: "hp7-marquee" },
      { componentId: "hp7-hero" },
      { componentId: "hp7-usp" },
      { componentId: "collection-luxury-v1" },
      { componentId: "hp7-bestsellers" },
      { componentId: "hp7-brand-story" },
      { componentId: "hp7-offer-banner" },
      { componentId: "hp7-15-instagram-grid" },
      { componentId: "grid-luxury-v1" },
      { componentId: "hp7-testimonials" },
      { componentId: "hp7-press-logos" },
      { componentId: "hp7-faq" },
      { componentId: "hp7-18-mega-footer" },
      { componentId: "hp20-18-footer-promo" },
      { componentId: "popup-spin-wheel-v1" },
      { componentId: "story-materials-showcase-v1" },
      { componentId: "banner-countdown-luxury-v1" },
      { componentId: "trust-before-after-luxury-v1" },
      { componentId: "instagram-feed-luxury-v1" },
      { componentId: "newsletter-minimal-v1" },
      { componentId: "footer-luxury-mega-v1" },
    ],
  },
  {
    id: "apparel-minimal-home",
    name: "Minimalist Nordic Casual",
    pageType: "index",
    niche: "clothing",
    family: "Minimal",
    archetype: "nordic-clean",
    styleBadge: "Sustainable Clean",
    accentColor: "#059669",
    description:
      "20 clean Scandinavian sections: split hero, eco-fabric badges, bestseller tabs, founder note, and editorial high-whitespace lookbook.",
    header: "hp10-header",
    footer: "hp10-footer",
    sections: [
      { componentId: "announcement-minimal-v1" },
      { componentId: "hp10-marquee" },
      { componentId: "hp10-hero" },
      { componentId: "hp10-usp" },
      { componentId: "hp10-bestsellers" },
      { componentId: "hp10-image-with-text" },
      { componentId: "hp10-brand-story" },
      { componentId: "hp10-comparison-table" },
      { componentId: "hp10-instagram" },
      { componentId: "hp10-testimonials" },
      { componentId: "hp10-press-logos" },
      { componentId: "hp10-faq" },
      { componentId: "hp10-newsletter" },
      { componentId: "collection-minimal-v1" },
      { componentId: "grid-minimal-v1" },
      { componentId: "brand-story-minimal-v1" },
      { componentId: "trust-badges-v1" },
      { componentId: "popup-exit-intent-luxury-v1" },
      { componentId: "hp10-featured-blog" },
      { componentId: "footer-minimal-v1" },
    ],
  },

  // ── 2. BEAUTY (3 D2C Archetypes) ─────────────────────────────────────────
  {
    id: "beauty-organic-home",
    name: "Botanical & Organic Glow",
    pageType: "index",
    niche: "beauty",
    family: "Natural",
    archetype: "organic-glow",
    styleBadge: "100% Clean Botanical",
    accentColor: "#10b981",
    description:
      "21 earth-toned organic beauty sections: clean ingredient matrix, routine builder, real customer before/afters, and dermatologist approval.",
    header: "header-natural-v1",
    footer: "footer-natural-v1",
    sections: [
      { componentId: "announcement-natural-v1" },
      { componentId: "hp1-marquee" },
      { componentId: "hp1-hero" },
      { componentId: "hp1-usp" },
      { componentId: "hp1-featured-collection" },
      { componentId: "hp1-category-tiles" },
      { componentId: "hp1-bestsellers" },
      { componentId: "hp1-brand-story" },
      { componentId: "hp1-ugc-reels" },
      { componentId: "hp1-instagram" },
      { componentId: "hp1-founder-note" },
      { componentId: "hp1-testimonials" },
      { componentId: "hp1-press-logos" },
      { componentId: "hp1-faq" },
      { componentId: "hp1-newsletter" },
      { componentId: "hp1-bundle-offer" },
      { componentId: "trust-before-after-luxury-v1" },
      { componentId: "collection-natural-v1" },
      { componentId: "grid-natural-v1" },
      { componentId: "popup-exit-intent-luxury-v1" },
      { componentId: "footer-natural-v1" },
    ],
  },
  {
    id: "beauty-clinical-home",
    name: "Clinical Derma Lab Skincare",
    pageType: "index",
    niche: "beauty",
    family: "Tech",
    archetype: "clinical-derma",
    styleBadge: "Medical Dermatologist",
    accentColor: "#2563eb",
    description:
      "22 high-credibility clinical skincare sections: active ingredient matrix, dermatologist endorsements, clinical trial statistics, and routine quiz.",
    header: "header-tech-v1",
    footer: "footer-tech-v1",
    sections: [
      { componentId: "announcement-tech-v1" },
      { componentId: "hp14-marquee" },
      { componentId: "hp14-hero" },
      { componentId: "hp14-usp" },
      { componentId: "hp14-featured-products" },
      { componentId: "hp14-bestsellers" },
      { componentId: "hp14-comparison-table" },
      { componentId: "hp14-brand-story" },
      { componentId: "hp14-instagram" },
      { componentId: "hp14-testimonial" },
      { componentId: "hp14-faq" },
      { componentId: "hp14-newsletter" },
      { componentId: "trust-stats-v1" },
      { componentId: "trust-badges-v1" },
      { componentId: "grid-tech-v1" },
      { componentId: "collection-tech-v1" },
      { componentId: "hp20-18-footer-promo" },
      { componentId: "popup-spin-wheel-v1" },
      { componentId: "banner-countdown-luxury-v1" },
      { componentId: "hp14-custom-html" },
      { componentId: "hp14-blog-posts" },
      { componentId: "footer-tech-v1" },
    ],
  },
  {
    id: "beauty-glamour-home",
    name: "Luxury Glamour Studio",
    pageType: "index",
    niche: "beauty",
    family: "Luxury",
    archetype: "glamour-editorial",
    styleBadge: "Editorial Haute Parfumerie",
    accentColor: "#ec4899",
    description:
      "21 ultra-luxury cosmetics and perfumery sections: fragrance notes pyramid, high-fashion visual assets, VIP unboxing, and press acclaim.",
    header: "hp19-header",
    footer: "footer-luxury-mega-v1",
    sections: [
      { componentId: "announcement-luxury-v1" },
      { componentId: "hp19-marquee" },
      { componentId: "hp19-hero" },
      { componentId: "hp19-usp" },
      { componentId: "hp19-category-tiles" },
      { componentId: "hp19-featured-collection" },
      { componentId: "hp19-offer-banner" },
      { componentId: "hp19-brand-story" },
      { componentId: "hp19-bestsellers" },
      { componentId: "hp19-founder-note" },
      { componentId: "hp19-instagram" },
      { componentId: "hp19-testimonials" },
      { componentId: "hp19-press-logos" },
      { componentId: "hp19-faq" },
      { componentId: "hp19-newsletter" },
      { componentId: "hp19-bundle-offer" },
      { componentId: "collection-slider-luxury-v1" },
      { componentId: "grid-luxury-v1" },
      { componentId: "modal-shoppable-video-luxury-v1" },
      { componentId: "popup-exit-intent-luxury-v1" },
      { componentId: "footer-luxury-mega-v1" },
    ],
  },

  // ── 3. JEWELLERY (3 D2C Archetypes) ──────────────────────────────────────
  {
    id: "jewellery-heritage-home",
    name: "Royal Heritage Polki & Gold",
    pageType: "index",
    niche: "jewellery",
    family: "Luxury",
    archetype: "heritage-polki-gold",
    styleBadge: "Bridal Heirloom Polki",
    accentColor: "#b45309",
    description:
      "22 exquisite heritage bridal gold & polki jewellery sections: BIS hallmark certification, trousseau guide, and artisan video showcases.",
    header: "hp8-header",
    footer: "hp8-footer",
    sections: [
      { componentId: "announcement-luxury-v1" },
      { componentId: "hp8-marquee" },
      { componentId: "hp8-hero" },
      { componentId: "hp8-usp" },
      { componentId: "hp8-bestsellers" },
      { componentId: "hp8-brand-story" },
      { componentId: "hp8-offer-banner" },
      { componentId: "hp8-instagram" },
      { componentId: "hp8-testimonials" },
      { componentId: "hp8-press-logos" },
      { componentId: "hp8-faq" },
      { componentId: "collection-luxury-v1" },
      { componentId: "grid-jewellery-showcase-v1" },
      { componentId: "story-materials-showcase-v1" },
      { componentId: "trust-before-after-luxury-v1" },
      { componentId: "hp20-18-footer-promo" },
      { componentId: "popup-exit-intent-luxury-v1" },
      { componentId: "banner-countdown-luxury-v1" },
      { componentId: "instagram-feed-luxury-v1" },
      { componentId: "newsletter-minimal-v1" },
      { componentId: "hp8-footer" },
      { componentId: "footer-luxury-mega-v1" },
    ],
  },
  {
    id: "jewellery-diamond-home",
    name: "Modern Solitaire & Fine Diamond",
    pageType: "index",
    niche: "jewellery",
    family: "Luxury",
    archetype: "modern-solitaire",
    styleBadge: "Certified Lab Diamonds",
    accentColor: "#0284c7",
    description:
      "21 contemporary diamond jewellery sections: interactive 4Cs guide, lab certification trust badges, sparkle video gallery, and lifetime warranty.",
    header: "hp9-header",
    footer: "hp9-footer",
    sections: [
      { componentId: "announcement-luxury-v1" },
      { componentId: "hp9-marquee" },
      { componentId: "hp9-hero" },
      { componentId: "hp9-usp" },
      { componentId: "hp9-bestsellers" },
      { componentId: "hp9-brand-story" },
      { componentId: "hp9-comparison-table" },
      { componentId: "hp9-instagram" },
      { componentId: "hp9-testimonials" },
      { componentId: "hp9-press-logos" },
      { componentId: "hp9-faq" },
      { componentId: "hp9-image-banner" },
      { componentId: "hp9-collection-list" },
      { componentId: "hp9-featured-blog" },
      { componentId: "grid-jewellery-showcase-v1" },
      { componentId: "collection-slider-luxury-v1" },
      { componentId: "trust-stats-v1" },
      { componentId: "trust-badges-v1" },
      { componentId: "popup-exit-intent-luxury-v1" },
      { componentId: "hp9-footer" },
      { componentId: "footer-luxury-v1" },
    ],
  },
  {
    id: "jewellery-silver-home",
    name: "Artisan Handcrafted Silver 925",
    pageType: "index",
    niche: "jewellery",
    family: "Natural",
    archetype: "artisan-silver",
    styleBadge: "925 Pure Silver",
    accentColor: "#64748b",
    description:
      "20 bohemian artisan 925 silver sections: craftsman masterclass, stacking guide carousel, community styling, and sustainable silver promise.",
    header: "hp11-header",
    footer: "hp11-footer",
    sections: [
      { componentId: "announcement-natural-v1" },
      { componentId: "hp11-marquee" },
      { componentId: "hp11-hero" },
      { componentId: "hp11-usp" },
      { componentId: "hp11-bestsellers" },
      { componentId: "hp11-brand-story" },
      { componentId: "hp11-comparison-table" },
      { componentId: "hp11-instagram" },
      { componentId: "hp11-testimonials" },
      { componentId: "hp11-press-logos" },
      { componentId: "hp11-faq" },
      { componentId: "hp11-newsletter" },
      { componentId: "hp11-featured-blog" },
      { componentId: "hp11-contact-form" },
      { componentId: "grid-jewellery-showcase-v1" },
      { componentId: "collection-natural-v1" },
      { componentId: "story-brand-editorial-v1" },
      { componentId: "trust-badges-v1" },
      { componentId: "popup-exit-intent-luxury-v1" },
      { componentId: "hp11-footer" },
    ],
  },

  // ── 4. TECH / GADGETS (1 D2C Archetype) ──────────────────────────────────
  {
    id: "tech-cyber-home",
    name: "Cyber Dark Minimal Electronics",
    pageType: "index",
    niche: "tech",
    family: "Tech",
    archetype: "cyber-minimal-audio",
    styleBadge: "Pro Audio & Gear",
    accentColor: "#10b981",
    description:
      "21 high-performance tech sections: technical spec comparison matrix, sound frequency breakdown, 360-view teaser, and unboxing reel grid.",
    header: "hp12-header",
    footer: "hp12-footer",
    sections: [
      { componentId: "announcement-tech-v1" },
      { componentId: "hp12-marquee" },
      { componentId: "hp12-hero" },
      { componentId: "hp12-usp" },
      { componentId: "hp12-bestsellers" },
      { componentId: "hp12-brand-story" },
      { componentId: "hp12-lookbook" },
      { componentId: "hp12-comparison-table" },
      { componentId: "hp12-instagram" },
      { componentId: "testimonials-tech-v1" },
      { componentId: "social-proof-press-v1" },
      { componentId: "hp12-faq" },
      { componentId: "hp12-newsletter" },
      { componentId: "hp12-blog-posts" },
      { componentId: "hp12-custom-html" },
      { componentId: "grid-tech-v1" },
      { componentId: "collection-tech-v1" },
      { componentId: "trust-stats-v1" },
      { componentId: "trust-badges-v1" },
      { componentId: "popup-spin-wheel-v1" },
      { componentId: "hp12-footer" },
    ],
  },
];

export function compositionsFor(pageType: PageType, niche?: string): PageComposition[] {
  return COMPOSITIONS.filter(
    c => c.pageType === pageType && (!niche || c.niche === niche || c.niche === "universal")
  );
}

/**
 * Fails loudly if a design references a component that no longer exists.
 *
 * A composition pointing at a renamed section produces a page with a hole in it
 * and no error, which is exactly the failure mode this project has hit before.
 */
export async function verifyCompositions(registryPath = path.join(ENGINE, "registry.json")) {
  const raw = JSON.parse(await fs.readFile(registryPath, "utf-8"));
  const list = Array.isArray(raw) ? raw : raw.components || [];
  const known = new Map<string, string>(list.map((c: any) => [c.componentId, c.liquidPath]));

  const missing: Array<{ composition: string; componentId: string }> = [];
  for (const comp of COMPOSITIONS) {
    for (const s of comp.sections) {
      if (!known.has(s.componentId)) missing.push({ composition: comp.id, componentId: s.componentId });
    }
  }
  return { missing, known };
}

// ── Draft theme ────────────────────────────────────────────────────────────

export interface DraftTheme {
  id: string;
  created: boolean;
}

function numericId(gid: string) {
  return String(gid).split("/").pop() || String(gid);
}

/**
 * The shop's draft theme, duplicated from the live one so it carries the
 * merchant's real settings, fonts and colours.
 */
export async function ensureDraftTheme(shop: any): Promise<DraftTheme> {
  const res = await graphqlRequest(
    shop.shopDomain,
    shop.accessToken,
    `query { themes(first: 50) { nodes { id name role } } }`
  );
  const themes = res?.themes?.nodes || [];

  const existing = themes.find((t: any) => t.name === DRAFT_NAME);
  if (existing) return { id: numericId(existing.id), created: false };

  const live = themes.find((t: any) => String(t.role).toLowerCase() === "main");
  if (!live) throw new Error("This store has no published theme to copy.");

  const dup = await graphqlRequest(
    shop.shopDomain,
    shop.accessToken,
    `mutation themeDuplicate($id: ID!, $name: String!) {
      themeDuplicate(id: $id, name: $name) {
        newTheme { id }
        userErrors { field message }
      }
    }`,
    { id: live.id, name: DRAFT_NAME }
  );

  const errs = dup?.themeDuplicate?.userErrors || [];
  if (errs.length) throw new Error(`Could not create the draft: ${errs.map((e: any) => e.message).join("; ")}`);

  const created = dup?.themeDuplicate?.newTheme?.id;
  if (!created) throw new Error("Shopify returned no theme when duplicating.");
  return { id: numericId(created), created: true };
}

// ── Applying a composition ─────────────────────────────────────────────────

const TEMPLATE_FILE: Record<PageType, string> = {
  index: "templates/index.json",
  product: "templates/product.json",
  collection: "templates/collection.json",
  cart: "templates/cart.json",
  "cart-drawer": "sections/cart-drawer-group.json",
};

export interface ApplyResult {
  compositionId: string;
  themeId: string;
  templateFile: string;
  sectionsWritten: number;
  filesWritten: number;
  paletteApplied: number;
  collectionsWired: number;
  missingFiles: string[];
}

/**
 * Writes a whole page design into the draft theme.
 *
 * The template is replaced rather than merged. A page design is a composition —
 * appending it to whatever was already there produces two half-pages, which is a
 * mistake this project has already shipped once.
 */
export async function applyComposition(
  shop: any,
  themeId: string,
  composition: PageComposition,
  options: {
    palette?: { background?: string; text?: string; accent?: string; accentAlt?: string; surface?: string };
    /** Collection handles to wire into any section that shows products. */
    collections?: string[];
    /**
     * Write as an alternate template (`templates/index.<variant>.json`) rather
     * than replacing the page.
     *
     * A theme has one `index.json`, so staging four designs for side-by-side
     * preview is impossible without this — each would overwrite the last.
     * Shopify serves an alternate template at `?view=<variant>`, so every design
     * can sit in the same draft theme at once and be previewed independently.
     */
    variant?: string;
  } = {}
): Promise<ApplyResult> {
  const { known } = await verifyCompositions();

  const files: Record<string, string> = {};
  const missingFiles: string[] = [];
  const sections: Record<string, any> = {};
  const order: string[] = [];

  for (const [i, spec] of composition.sections.entries()) {
    const liquidPath = known.get(spec.componentId);
    if (!liquidPath) {
      missingFiles.push(spec.componentId);
      continue;
    }

    const bundle = await resolveSectionBundle(spec.componentId, liquidPath);
    Object.assign(files, bundle.files);
    missingFiles.push(...bundle.missing);

    // Numbered so the key order matches the visual order in the theme editor,
    // which is where a merchant will look to reorder them later.
    const key = `${String(i + 1).padStart(2, "0")}-${spec.componentId}`;
    sections[key] = { type: spec.componentId, settings: { ...(spec.settings || {}) } };
    order.push(key);
  }

  const base = TEMPLATE_FILE[composition.pageType];
  const templateFile = options.variant
    ? base.replace(/\.json$/, `.${options.variant}.json`)
    : base;
  files[templateFile] = JSON.stringify({ sections, order }, null, 2);

  // Header and footer live in section groups, which are shared across every
  // page. Replacing the entry rather than adding one keeps a store from ending
  // up with two headers — a mistake this project has already shipped once.
  for (const [slot, componentId] of [["header", composition.header], ["footer", composition.footer]] as const) {
    if (!componentId) continue;
    // Section groups are shared across every template, so a variant staged only
    // for preview must leave them alone. Otherwise previewing four designs would
    // leave the header belonging to whichever was staged last.
    if (options.variant) continue;
    const liquidPath = known.get(componentId);
    if (!liquidPath) {
      missingFiles.push(componentId);
      continue;
    }
    const bundle = await resolveSectionBundle(componentId, liquidPath);
    Object.assign(files, bundle.files);
    missingFiles.push(...bundle.missing);

    const groupFile = `sections/${slot}-group.json`;
    let group: any;
    try {
      group = JSON.parse((await readFile(shop, themeId, groupFile)) || "{}");
    } catch {
      group = {};
    }
    if (!group.sections || typeof group.sections !== "object") group.sections = {};
    if (!Array.isArray(group.order)) group.order = [];
    if (!group.type) group.type = slot;

    const existingSettings = group.sections[slot]?.settings || {};
    group.sections[slot] = { type: componentId, settings: existingSettings };
    if (!group.order.includes(slot)) group.order.push(slot);

    files[groupFile] = JSON.stringify(group, null, 2);
  }

  // ── Point every product-showing section at a real collection ──────────
  // A grid with no collection set renders its placeholder branch, which is what
  // put "Jewelry Item 1 — $199.00" on a generated store.
  let collectionsWired = 0;
  const handles = options.collections?.length ? options.collections : ["all"];
  {
    const doc = JSON.parse(files[templateFile]);
    let n = 0;
    for (const key of doc.order) {
      const entry = doc.sections[key];
      const source = files[`sections/${entry.type}.liquid`] || "";
      if (!/"type"\s*:\s*"collection"/.test(source)) continue;
      if (entry.settings.collection) continue;
      // Alternate so two adjacent grids do not show identical products.
      entry.settings.collection = handles[n % handles.length];
      n++;
      collectionsWired++;
    }
    files[templateFile] = JSON.stringify(doc, null, 2);
  }

  // ── Match the store's colours ─────────────────────────────────────────
  let paletteApplied = 0;
  if (options.palette) {
    const stats = applyStorePalette(files, buildStorePalette(options.palette));
    paletteApplied = stats.settingsWritten;
  }

  // The utility stylesheet is assumed by a fifth of the library.
  const utility = path.join(ENGINE, "base-theme/assets/utility.css");
  if (existsSync(utility)) files["assets/utility.css"] = await fs.readFile(utility, "utf-8");

  await upsertThemeFilesBatched(shop, themeId, files);

  return {
    compositionId: composition.id,
    themeId,
    templateFile,
    sectionsWritten: order.length,
    filesWritten: Object.keys(files).length,
    paletteApplied,
    collectionsWired,
    missingFiles: [...new Set(missingFiles)],
  };
}

// ── Publishing ─────────────────────────────────────────────────────────────

/**
 * Makes the draft the live theme.
 *
 * The previously live theme is left in the merchant's theme list rather than
 * deleted — it is their rollback, and it is not ours to remove.
 */
export async function publishDraft(shop: any, themeId: string) {
  const res = await graphqlRequest(
    shop.shopDomain,
    shop.accessToken,
    `mutation themePublish($id: ID!) {
      themePublish(id: $id) {
        theme { id name role }
        userErrors { field message }
      }
    }`,
    { id: `gid://shopify/OnlineStoreTheme/${themeId}` }
  );

  const errs = res?.themePublish?.userErrors || [];
  if (errs.length) throw new Error(errs.map((e: any) => e.message).join("; "));
  return res?.themePublish?.theme;
}

/**
 * Which pages in the draft already differ from what the merchant started with.
 *
 * Drives the "you have N unpublished changes" state, so Publish is never a
 * button whose effect is a mystery.
 */
export async function draftChanges(shop: any, themeId: string): Promise<PageType[]> {
  const entries = Object.entries(TEMPLATE_FILE) as Array<[PageType, string]>;
  const changed: PageType[] = [];

  const results = await Promise.allSettled(
    entries.map(async ([pageType, file]) => {
      const raw = await readFile(shop, themeId, file);
      const doc = JSON.parse(raw || "{}");
      const keys: string[] = Array.isArray(doc.order) ? doc.order : [];
      if (keys.some(k => /^\d{2}-/.test(k))) {
        return pageType;
      }
      return null;
    })
  );

  for (const res of results) {
    if (res.status === "fulfilled" && res.value) {
      changed.push(res.value);
    }
  }

  return changed;
}
