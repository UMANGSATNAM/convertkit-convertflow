import { CatalogContext } from "../ai/catalog-analyzer.server";
import { BrandContext } from "../ai/brand-analyzer.server";

export interface StoreBlueprint {
  pages: {
    index: string[];
    product: string[];
    collection: string[];
  };
  /** Chrome and overlays rendered on every page, resolved once. */
  globals: string[];
}

/**
 * Phase 4: StoreBlueprint Engine
 *
 * Produces the structural blueprint — which section *types* each page needs —
 * from catalog and brand intelligence. The retrieval engine then picks a real
 * component for every type.
 *
 * Section types must exist as `sectionType` values in registry.json, or be
 * aliased in the typeMapping table inside retrieval.server.ts.
 */
export function generateStoreBlueprint(
  catalogContext: CatalogContext,
  brandContext: BrandContext
): StoreBlueprint {
  let indexSections: string[] = [];

  const isHighPrice = catalogContext.price_band === "high" || brandContext.brand_archetype === "editorial_luxury";
  const isSmallCatalog = catalogContext.product_count <= 15;
  const isLargeCatalog = catalogContext.product_count > 30;
  const isEstablished = catalogContext.catalog_strength > 70;
  const isNewStore = catalogContext.catalog_strength < 40;

  // ── Homepage recipes ─────────────────────────────────────────────────
  // Ordered for conversion: hook → shop → convince → capture.
  if (isSmallCatalog && isHighPrice) {
    // Few products, premium price → storytelling carries the sale
    indexSections = [
      "hero",
      "usp-bar",
      "brand-story",
      "craftsmanship",
      "featured-collection",
      "ugc",
      "testimonials",
      "press",
      "faq",
      "newsletter"
    ];
  } else if (isLargeCatalog) {
    // Deep catalog → help people find things fast
    indexSections = [
      "hero",
      "usp-bar",
      "collection-list",
      "featured-collection",
      "product_grid",
      "ugc",
      "testimonials",
      "faq",
      "newsletter"
    ];
  } else if (isNewStore) {
    // No track record yet → lead with reasons to trust
    indexSections = [
      "hero",
      "usp-bar",
      "featured-collection",
      "brand-story",
      "trust-pillars",
      "ugc",
      "faq",
      "newsletter"
    ];
  } else if (isEstablished) {
    // Proven demand → lead with proof
    indexSections = [
      "hero",
      "testimonials",
      "featured-collection",
      "usp-bar",
      "lookbook",
      "ugc",
      "press",
      "faq",
      "newsletter"
    ];
  } else {
    indexSections = [
      "hero",
      "usp-bar",
      "featured-collection",
      "brand-story",
      "testimonials",
      "ugc",
      "faq",
      "newsletter"
    ];
  }

  // ── Product page ─────────────────────────────────────────────────────
  // `product-page` components are full PDP layouts (gallery, buy box, sticky
  // ATC, bundles). Supporting sections sit below them.
  const productSections: string[] = ["product-page"];
  if (isHighPrice || isSmallCatalog) productSections.push("brand-story");
  productSections.push("ugc", "testimonials", "faq", "product_grid");

  // ── Collection page ──────────────────────────────────────────────────
  const collectionSections: string[] = ["collection-page"];
  if (isLargeCatalog) collectionSections.push("collection-list");
  collectionSections.push("trust-pillars", "faq");

  // ── Global chrome and overlays ───────────────────────────────────────
  const globals: string[] = ["announcement", "header", "footer", "cart-drawer"];
  // A popup earns its place when there is an incentive worth interrupting for.
  if (isNewStore || isLargeCatalog) globals.push("popup");

  return {
    pages: {
      index: indexSections,
      product: productSections,
      collection: collectionSections
    },
    globals
  };
}
