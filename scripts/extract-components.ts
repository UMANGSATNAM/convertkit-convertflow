/**
 * Phase 1 — Component Extraction Script
 * Copies niche sections → components/ with canonical v2.0 names
 * Creates .meta.json sidecar for every component
 *
 * Run: npx tsx scripts/extract-components.ts
 */

import * as fs from "fs/promises";
import * as path from "path";

const ROOT = path.resolve(process.cwd());
const NICHES_DIR = path.join(ROOT, "app/data/templates/theme-engine/niches");
const COMPONENTS_DIR = path.join(ROOT, "app/data/templates/theme-engine/components");

interface ExtractionMap {
  source: string;        // relative from niches/
  dest: string;          // relative from components/
  componentId: string;
  type: string;
  visualStyle: string;
  family: string;
  archetypes: string[];
  compatibleSlots?: string[];
  isUniversal?: boolean;
  notes?: string;
}

const EXTRACTION_MAP: ExtractionMap[] = [
  // ─── HERO ────────────────────────────────────────────────────
  {
    source: "beauty/sections/hero-banner.liquid",
    dest: "hero/hero-editorial-beauty-v1.liquid",
    componentId: "hero-editorial-beauty-v1",
    type: "hero",
    visualStyle: "editorial",
    family: "Beauty",
    archetypes: ["premium", "organic", "clinical"],
    compatibleSlots: ["header-minimal-beauty-v1", "footer-minimal-beauty-v1"],
    notes: "Glass card left-aligned on warm blush bg. Beauty/Health brands."
  },
  {
    source: "jewellery/sections/hero-banner.liquid",
    dest: "hero/hero-luxury-jewellery-v1.liquid",
    componentId: "hero-luxury-jewellery-v1",
    type: "hero",
    visualStyle: "luxury",
    family: "Luxury",
    archetypes: ["luxury", "premium", "editorial"],
    compatibleSlots: ["header-luxury-jewellery-v1", "footer-luxury-jewellery-v1"],
    notes: "Dark luxury bg, centered, uppercase, weight 300, gold accent CTA."
  },
  {
    source: "streetwear/sections/hero-banner.liquid",
    dest: "hero/hero-bold-lifestyle-v1.liquid",
    componentId: "hero-bold-lifestyle-v1",
    type: "hero",
    visualStyle: "bold",
    family: "Lifestyle",
    archetypes: ["streetwear", "hype", "drop"],
    compatibleSlots: ["header-bold-lifestyle-v1", "footer-bold-lifestyle-v1"],
    notes: "Black bg, bottom-left box, weight 900, thick accent border, //slashes//."
  },
  {
    source: "electronics/sections/hero-banner.liquid",
    dest: "hero/hero-tech-electronics-v1.liquid",
    componentId: "hero-tech-electronics-v1",
    type: "hero",
    visualStyle: "tech",
    family: "Tech",
    archetypes: ["gaming", "gadgets", "performance"],
    compatibleSlots: ["header-tech-electronics-v1", "footer-tech-electronics-v1"],
    notes: "Near-black bg, centered, glow neon label above heading, futuristic."
  },
  {
    source: "home-decor/sections/hero-banner.liquid",
    dest: "hero/hero-natural-home-v1.liquid",
    componentId: "hero-natural-home-v1",
    type: "hero",
    visualStyle: "natural",
    family: "Home",
    archetypes: ["cozy", "artisanal", "minimal"],
    compatibleSlots: ["header-natural-home-v1", "footer-natural-home-v1"],
    notes: "Warm beige bg, centered, weight 400, calm earthy palette."
  },

  // ─── HEADER ──────────────────────────────────────────────────
  {
    source: "beauty/sections/header.liquid",
    dest: "header/header-minimal-beauty-v1.liquid",
    componentId: "header-minimal-beauty-v1",
    type: "header",
    visualStyle: "minimal",
    family: "Beauty",
    archetypes: ["premium", "organic", "clinical", "minimal"],
    notes: "Logo-Left NavCenter Icons-Right. Reusable across Beauty/Health/Home/Lifestyle."
  },
  {
    source: "jewellery/sections/header.liquid",
    dest: "header/header-luxury-jewellery-v1.liquid",
    componentId: "header-luxury-jewellery-v1",
    type: "header",
    visualStyle: "luxury",
    family: "Luxury",
    archetypes: ["luxury", "premium", "editorial"],
  },
  {
    source: "streetwear/sections/header.liquid",
    dest: "header/header-bold-lifestyle-v1.liquid",
    componentId: "header-bold-lifestyle-v1",
    type: "header",
    visualStyle: "bold",
    family: "Lifestyle",
    archetypes: ["streetwear", "hype"],
  },
  {
    source: "electronics/sections/header.liquid",
    dest: "header/header-tech-electronics-v1.liquid",
    componentId: "header-tech-electronics-v1",
    type: "header",
    visualStyle: "tech",
    family: "Tech",
    archetypes: ["gaming", "gadgets", "performance"],
  },
  {
    source: "home-decor/sections/header.liquid",
    dest: "header/header-natural-home-v1.liquid",
    componentId: "header-natural-home-v1",
    type: "header",
    visualStyle: "natural",
    family: "Home",
    archetypes: ["cozy", "artisanal", "minimal"],
  },

  // ─── FOOTER ──────────────────────────────────────────────────
  {
    source: "beauty/sections/footer.liquid",
    dest: "footer/footer-minimal-beauty-v1.liquid",
    componentId: "footer-minimal-beauty-v1",
    type: "footer",
    visualStyle: "minimal",
    family: "Beauty",
    archetypes: ["premium", "organic", "minimal"],
  },
  {
    source: "jewellery/sections/footer.liquid",
    dest: "footer/footer-luxury-jewellery-v1.liquid",
    componentId: "footer-luxury-jewellery-v1",
    type: "footer",
    visualStyle: "luxury",
    family: "Luxury",
    archetypes: ["luxury", "premium"],
  },
  {
    source: "streetwear/sections/footer.liquid",
    dest: "footer/footer-bold-lifestyle-v1.liquid",
    componentId: "footer-bold-lifestyle-v1",
    type: "footer",
    visualStyle: "bold",
    family: "Lifestyle",
    archetypes: ["streetwear", "hype"],
  },
  {
    source: "electronics/sections/footer.liquid",
    dest: "footer/footer-tech-electronics-v1.liquid",
    componentId: "footer-tech-electronics-v1",
    type: "footer",
    visualStyle: "tech",
    family: "Tech",
    archetypes: ["gaming", "gadgets"],
  },
  {
    source: "home-decor/sections/footer.liquid",
    dest: "footer/footer-natural-home-v1.liquid",
    componentId: "footer-natural-home-v1",
    type: "footer",
    visualStyle: "natural",
    family: "Home",
    archetypes: ["cozy", "artisanal", "minimal"],
  },

  // ─── TESTIMONIALS ────────────────────────────────────────────
  {
    source: "beauty/sections/testimonials.liquid",
    dest: "testimonials/testimonials-card-beauty-v1.liquid",
    componentId: "testimonials-card-beauty-v1",
    type: "testimonials",
    visualStyle: "soft",
    family: "Beauty",
    archetypes: ["organic", "premium", "cozy", "minimal"],
    notes: "Card-per-review with border+shadow. Reusable across Beauty/Health/Home/Lifestyle."
  },
  {
    source: "jewellery/sections/testimonials.liquid",
    dest: "testimonials/testimonials-editorial-luxury-v1.liquid",
    componentId: "testimonials-editorial-luxury-v1",
    type: "testimonials",
    visualStyle: "luxury",
    family: "Luxury",
    archetypes: ["luxury", "premium", "editorial"],
    notes: "Borderless quotes. Large font. Gold accent author. Luxury only."
  },
  {
    source: "streetwear/sections/testimonials.liquid",
    dest: "testimonials/testimonials-bold-lifestyle-v1.liquid",
    componentId: "testimonials-bold-lifestyle-v1",
    type: "testimonials",
    visualStyle: "bold",
    family: "Lifestyle",
    archetypes: ["streetwear", "hype"],
  },
  {
    source: "electronics/sections/testimonials.liquid",
    dest: "testimonials/testimonials-tech-electronics-v1.liquid",
    componentId: "testimonials-tech-electronics-v1",
    type: "testimonials",
    visualStyle: "tech",
    family: "Tech",
    archetypes: ["gaming", "gadgets"],
  },
  {
    source: "home-decor/sections/testimonials.liquid",
    dest: "testimonials/testimonials-natural-home-v1.liquid",
    componentId: "testimonials-natural-home-v1",
    type: "testimonials",
    visualStyle: "natural",
    family: "Home",
    archetypes: ["cozy", "artisanal"],
  },

  // ─── PRODUCT GRID (featured-collection) ──────────────────────
  {
    source: "beauty/sections/featured-collection.liquid",
    dest: "product-grid/grid-minimal-beauty-v1.liquid",
    componentId: "grid-minimal-beauty-v1",
    type: "product-grid",
    visualStyle: "minimal",
    family: "Beauty",
    archetypes: ["premium", "organic", "minimal"],
  },
  {
    source: "jewellery/sections/featured-collection.liquid",
    dest: "product-grid/grid-luxury-jewellery-v1.liquid",
    componentId: "grid-luxury-jewellery-v1",
    type: "product-grid",
    visualStyle: "luxury",
    family: "Luxury",
    archetypes: ["luxury", "premium"],
  },
  {
    source: "streetwear/sections/featured-collection.liquid",
    dest: "product-grid/grid-bold-lifestyle-v1.liquid",
    componentId: "grid-bold-lifestyle-v1",
    type: "product-grid",
    visualStyle: "bold",
    family: "Lifestyle",
    archetypes: ["streetwear", "hype"],
  },
  {
    source: "electronics/sections/featured-collection.liquid",
    dest: "product-grid/grid-tech-electronics-v1.liquid",
    componentId: "grid-tech-electronics-v1",
    type: "product-grid",
    visualStyle: "tech",
    family: "Tech",
    archetypes: ["gaming", "gadgets"],
  },
  {
    source: "home-decor/sections/featured-collection.liquid",
    dest: "product-grid/grid-natural-home-v1.liquid",
    componentId: "grid-natural-home-v1",
    type: "product-grid",
    visualStyle: "natural",
    family: "Home",
    archetypes: ["cozy", "artisanal"],
  },

  // ─── ANNOUNCEMENT BAR ────────────────────────────────────────
  {
    source: "beauty/sections/announcement-bar.liquid",
    dest: "announcement/announcement-minimal-beauty-v1.liquid",
    componentId: "announcement-minimal-beauty-v1",
    type: "announcement",
    visualStyle: "minimal",
    family: "Beauty",
    archetypes: ["premium", "organic", "minimal"],
  },
  {
    source: "jewellery/sections/announcement-bar.liquid",
    dest: "announcement/announcement-luxury-jewellery-v1.liquid",
    componentId: "announcement-luxury-jewellery-v1",
    type: "announcement",
    visualStyle: "luxury",
    family: "Luxury",
    archetypes: ["luxury", "premium"],
  },
  {
    source: "streetwear/sections/announcement-bar.liquid",
    dest: "announcement/announcement-bold-lifestyle-v1.liquid",
    componentId: "announcement-bold-lifestyle-v1",
    type: "announcement",
    visualStyle: "bold",
    family: "Lifestyle",
    archetypes: ["streetwear", "hype"],
  },
  {
    source: "electronics/sections/announcement-bar.liquid",
    dest: "announcement/announcement-tech-electronics-v1.liquid",
    componentId: "announcement-tech-electronics-v1",
    type: "announcement",
    visualStyle: "tech",
    family: "Tech",
    archetypes: ["gaming", "gadgets"],
  },
  {
    source: "home-decor/sections/announcement-bar.liquid",
    dest: "announcement/announcement-natural-home-v1.liquid",
    componentId: "announcement-natural-home-v1",
    type: "announcement",
    visualStyle: "natural",
    family: "Home",
    archetypes: ["cozy", "artisanal"],
  },

  // ─── NEWSLETTER ──────────────────────────────────────────────
  {
    source: "beauty/sections/newsletter.liquid",
    dest: "newsletter/newsletter-minimal-beauty-v1.liquid",
    componentId: "newsletter-minimal-beauty-v1",
    type: "newsletter",
    visualStyle: "minimal",
    family: "Beauty",
    archetypes: ["premium", "organic", "minimal"],
  },
  {
    source: "jewellery/sections/newsletter.liquid",
    dest: "newsletter/newsletter-luxury-jewellery-v1.liquid",
    componentId: "newsletter-luxury-jewellery-v1",
    type: "newsletter",
    visualStyle: "luxury",
    family: "Luxury",
    archetypes: ["luxury", "premium"],
  },
  {
    source: "streetwear/sections/newsletter.liquid",
    dest: "newsletter/newsletter-bold-lifestyle-v1.liquid",
    componentId: "newsletter-bold-lifestyle-v1",
    type: "newsletter",
    visualStyle: "bold",
    family: "Lifestyle",
    archetypes: ["streetwear", "hype"],
  },
  {
    source: "electronics/sections/newsletter.liquid",
    dest: "newsletter/newsletter-tech-electronics-v1.liquid",
    componentId: "newsletter-tech-electronics-v1",
    type: "newsletter",
    visualStyle: "tech",
    family: "Tech",
    archetypes: ["gaming", "gadgets"],
  },
  {
    source: "home-decor/sections/newsletter.liquid",
    dest: "newsletter/newsletter-natural-home-v1.liquid",
    componentId: "newsletter-natural-home-v1",
    type: "newsletter",
    visualStyle: "natural",
    family: "Home",
    archetypes: ["cozy", "artisanal"],
  },

  // ─── BRAND STORY (image-with-text) ───────────────────────────
  {
    source: "beauty/sections/image-with-text.liquid",
    dest: "brand-story/brand-story-minimal-beauty-v1.liquid",
    componentId: "brand-story-minimal-beauty-v1",
    type: "brand-story",
    visualStyle: "minimal",
    family: "Beauty",
    archetypes: ["premium", "organic"],
  },
  {
    source: "jewellery/sections/image-with-text.liquid",
    dest: "brand-story/brand-story-luxury-jewellery-v1.liquid",
    componentId: "brand-story-luxury-jewellery-v1",
    type: "brand-story",
    visualStyle: "luxury",
    family: "Luxury",
    archetypes: ["luxury", "premium"],
  },
  {
    source: "streetwear/sections/image-with-text.liquid",
    dest: "brand-story/brand-story-bold-lifestyle-v1.liquid",
    componentId: "brand-story-bold-lifestyle-v1",
    type: "brand-story",
    visualStyle: "bold",
    family: "Lifestyle",
    archetypes: ["streetwear"],
  },
  {
    source: "electronics/sections/image-with-text.liquid",
    dest: "brand-story/brand-story-tech-electronics-v1.liquid",
    componentId: "brand-story-tech-electronics-v1",
    type: "brand-story",
    visualStyle: "tech",
    family: "Tech",
    archetypes: ["gaming", "gadgets"],
  },
  {
    source: "home-decor/sections/image-with-text.liquid",
    dest: "brand-story/brand-story-natural-home-v1.liquid",
    componentId: "brand-story-natural-home-v1",
    type: "brand-story",
    visualStyle: "natural",
    family: "Home",
    archetypes: ["cozy", "artisanal"],
  },

  // ─── COLLECTION PAGE ─────────────────────────────────────────
  {
    source: "beauty/sections/main-collection.liquid",
    dest: "collections/collection-minimal-beauty-v1.liquid",
    componentId: "collection-minimal-beauty-v1",
    type: "collection",
    visualStyle: "minimal",
    family: "Beauty",
    archetypes: ["premium", "organic", "minimal"],
  },
  {
    source: "jewellery/sections/main-collection.liquid",
    dest: "collections/collection-luxury-jewellery-v1.liquid",
    componentId: "collection-luxury-jewellery-v1",
    type: "collection",
    visualStyle: "luxury",
    family: "Luxury",
    archetypes: ["luxury", "premium"],
  },
  {
    source: "streetwear/sections/main-collection.liquid",
    dest: "collections/collection-bold-lifestyle-v1.liquid",
    componentId: "collection-bold-lifestyle-v1",
    type: "collection",
    visualStyle: "bold",
    family: "Lifestyle",
    archetypes: ["streetwear", "hype"],
  },
  {
    source: "electronics/sections/main-collection.liquid",
    dest: "collections/collection-tech-electronics-v1.liquid",
    componentId: "collection-tech-electronics-v1",
    type: "collection",
    visualStyle: "tech",
    family: "Tech",
    archetypes: ["gaming", "gadgets"],
  },
  {
    source: "home-decor/sections/main-collection.liquid",
    dest: "collections/collection-natural-home-v1.liquid",
    componentId: "collection-natural-home-v1",
    type: "collection",
    visualStyle: "natural",
    family: "Home",
    archetypes: ["cozy", "artisanal"],
  },

  // ─── BUNDLE BUILDER (universal — use beauty as base) ─────────
  {
    source: "beauty/sections/bundle-builder.liquid",
    dest: "bundle-builder/bundle-builder-universal-v1.liquid",
    componentId: "bundle-builder-universal-v1",
    type: "bundle-builder",
    visualStyle: "universal",
    family: "Universal",
    archetypes: ["*"],
    isUniversal: true,
    notes: "Token-driven. Works across all families."
  },

  // ─── SPIN WHEEL POPUP (universal — use beauty as base) ───────
  {
    source: "beauty/sections/spin-wheel-popup.liquid",
    dest: "popup/popup-spin-wheel-universal-v1.liquid",
    componentId: "popup-spin-wheel-universal-v1",
    type: "popup",
    visualStyle: "universal",
    family: "Universal",
    archetypes: ["*"],
    isUniversal: true,
    notes: "Token-driven popup. Universal across all families."
  },
];

// ─── NICHE TOKENS EXTRACTION ─────────────────────────────────────
interface TokenMap {
  source: string;
  dest: string;
}

const TOKENS_MAP: TokenMap[] = [
  { source: "beauty/assets/niche-tokens.css",     dest: "niche-tokens/beauty/premium.css" },
  { source: "jewellery/assets/niche-tokens.css",  dest: "niche-tokens/jewellery/luxury.css" },
  { source: "streetwear/assets/niche-tokens.css", dest: "niche-tokens/lifestyle/streetwear.css" },
  { source: "electronics/assets/niche-tokens.css",dest: "niche-tokens/tech/electronics.css" },
  { source: "home-decor/assets/niche-tokens.css", dest: "niche-tokens/home/minimal.css" },
];

// ─── MAIN EXECUTION ──────────────────────────────────────────────

async function generateMeta(item: ExtractionMap): Promise<string> {
  return JSON.stringify({
    componentId: item.componentId,
    type: item.type,
    visualStyle: item.visualStyle,
    family: item.family,
    archetypes: item.archetypes,
    compatibleSlots: item.compatibleSlots || [],
    isUniversal: item.isUniversal || false,
    version: 1,
    status: "approved",
    notes: item.notes || "",
    extractedFrom: `niches/${item.source}`,
    createdAt: new Date().toISOString(),
  }, null, 2);
}

async function main() {
  console.log("\n🔧 StoreForge v2.0 — Phase 1: Component Extraction\n");

  let extracted = 0;
  let skipped = 0;
  let errors = 0;

  // Extract components
  for (const item of EXTRACTION_MAP) {
    const sourcePath = path.join(NICHES_DIR, item.source);
    const destPath = path.join(COMPONENTS_DIR, item.dest);
    const metaPath = destPath.replace(".liquid", ".meta.json");

    try {
      // Ensure dest directory exists
      await fs.mkdir(path.dirname(destPath), { recursive: true });

      // Copy liquid file
      const content = await fs.readFile(sourcePath, "utf-8");

      // Add v2.0 header comment
      const header = `{%- comment -%}\n  Component: ${item.componentId}\n  Family: ${item.family} | Style: ${item.visualStyle}\n  Archetypes: ${item.archetypes.join(", ")}\n  v2.0 — StoreForge Component Library\n{%- endcomment -%}\n`;
      await fs.writeFile(destPath, header + content, "utf-8");

      // Create meta.json sidecar
      await fs.writeFile(metaPath, await generateMeta(item), "utf-8");

      console.log(`  ✅ ${item.componentId}`);
      extracted++;
    } catch (err: any) {
      console.error(`  ❌ ${item.componentId}: ${err.message}`);
      errors++;
    }
  }

  // Extract niche tokens
  console.log("\n🎨 Extracting niche tokens...\n");
  const THEME_ENGINE = path.join(ROOT, "app/data/templates/theme-engine");

  for (const token of TOKENS_MAP) {
    const sourcePath = path.join(NICHES_DIR, token.source);
    const destPath = path.join(THEME_ENGINE, token.dest);

    try {
      await fs.mkdir(path.dirname(destPath), { recursive: true });
      const content = await fs.readFile(sourcePath, "utf-8");
      await fs.writeFile(destPath, content, "utf-8");
      console.log(`  ✅ ${token.dest}`);
    } catch (err: any) {
      console.error(`  ❌ ${token.dest}: ${err.message}`);
    }
  }

  console.log(`\n📦 Extraction complete:`);
  console.log(`   ✅ Extracted: ${extracted}`);
  console.log(`   ⏭️  Skipped:   ${skipped}`);
  console.log(`   ❌ Errors:    ${errors}`);
  console.log(`\n📁 Components dir: ${COMPONENTS_DIR}`);
  console.log(`\n⚠️  NOTE: niches/ folder kept intact. Run cleanup after Phase 3 testing.\n`);
}

main().catch(console.error);
