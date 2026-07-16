import { CatalogContext } from "../ai/catalog-analyzer.server";
import { BrandContext } from "../ai/brand-analyzer.server";

export interface StoreBlueprint {
  pages: {
    index: string[];
    // Can expand to 'product', 'collection' later
  };
}

/**
 * Phase 4: StoreBlueprint Engine
 * Generates the structural blueprint (list of required section types) 
 * for a store based on its Catalog and Brand intelligence.
 * 
 * Instead of hardcoded generic profiles, this dynamically constructs the blueprint.
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

  // Decision #18 & PRO-STORE-MANIFEST.md DNA-Driven Order Recipes
  if (isSmallCatalog && isHighPrice) {
    // Small catalog + high price -> storytelling-first
    indexSections = [
      "hero",
      "brand-story",
      "craftsmanship",
      "featured-collection",
      "testimonials",
      "press",
      "newsletter"
    ];
  } else if (isLargeCatalog) {
    // Large catalog + mid/low price -> discovery-first
    indexSections = [
      "hero",
      "usp-bar",
      "collection-list",
      "featured-collection",
      "testimonials",
      "newsletter"
    ];
  } else if (isNewStore) {
    // New store, low reviews -> trust-compensating
    indexSections = [
      "hero",
      "usp-bar",
      "brand-story",
      "trust-pillars",
      "faq",
      "newsletter"
    ];
  } else if (isEstablished) {
    // Established, high reviews -> social-proof-first
    indexSections = [
      "hero",
      "testimonials",
      "featured-collection",
      "lookbook",
      "press",
      "newsletter"
    ];
  } else {
    // Standard balanced fallback
    indexSections = [
      "hero",
      "usp-bar",
      "featured-collection",
      "brand-story",
      "testimonials",
      "newsletter"
    ];
  }

  return {
    pages: {
      index: indexSections
    }
  };
}
