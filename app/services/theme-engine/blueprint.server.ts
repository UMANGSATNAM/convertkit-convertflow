import { CatalogContext } from "../ai/catalog-analyzer.server";
import { BrandContext } from "../ai/brand-analyzer.server";

export interface StoreBlueprint {
  pages: {
    index: string[];
    product: string[];
    collection: string[];
    /** Supporting pages. Each key becomes `templates/<key>.json`. */
    cart: string[];
    search: string[];
    "404": string[];
    "list-collections": string[];
    "page.about": string[];
    "page.contact": string[];
    "page.faq": string[];
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
  // A `product-page` component is a COMPLETE page, not a block: gallery, buy
  // box, variants, sticky add-to-cart, bundles, reviews, related products and
  // recently viewed are all inside it. Stacking further sections underneath
  // renders a second product page below the first — which is exactly what an
  // earlier version of this file did. Keep it exclusive.
  const productSections: string[] = ["product-page"];

  // ── Collection page ──────────────────────────────────────────────────
  // Same rule. A `collection-page` component already contains the banner,
  // filters, sort, paginated product grid and pagination controls.
  const collectionSections: string[] = ["collection-page"];

  // Note on how these two arrays are consumed: the component resolved here
  // replaces the chassis `main-product` / `main-collection` section rather than
  // being appended after it. Appending was what rendered two complete,
  // differently-designed pages stacked on one URL.

  // ── Supporting pages ─────────────────────────────────────────────────
  // These append *below* the chassis `main-*` section that each template
  // already carries, so the cart still has its line items and the search page
  // still has its results. They exist to stop the pages that a real shopper
  // reaches — empty cart, no results, mistyped URL — from being dead ends.

  // A shopper on the cart page has already decided. Reassure, then upsell.
  const cartSections: string[] = ["trust", "product-grid"];

  // Zero results is a bounce unless something else is offered.
  const searchSections: string[] = ["product-grid"];

  // The most recoverable page on the store — never leave it blank.
  const notFoundSections: string[] = ["product-grid", "newsletter"];

  const listCollectionsSections: string[] = ["collection", "newsletter"];

  // The pages that carry the brand rather than the catalogue.
  const aboutSections: string[] = ["brand-story", "ugc", "testimonials", "trust", "newsletter"];
  const contactSections: string[] = ["contact", "faq", "trust"];
  const faqSections: string[] = ["faq", "newsletter"];

  // ── Global chrome and overlays ───────────────────────────────────────
  const globals: string[] = ["announcement", "header", "footer", "cart-drawer"];
  // A popup earns its place when there is an incentive worth interrupting for.
  if (isNewStore || isLargeCatalog) globals.push("popup");

  return {
    pages: {
      index: indexSections,
      product: productSections,
      collection: collectionSections,
      cart: cartSections,
      search: searchSections,
      "404": notFoundSections,
      "list-collections": listCollectionsSections,
      "page.about": aboutSections,
      "page.contact": contactSections,
      "page.faq": faqSections
    },
    globals
  };
}
