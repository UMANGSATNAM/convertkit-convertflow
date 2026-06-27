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
  
  const indexSections: string[] = ["header"]; // Always start with header

  // 1. Hero Section (Always needed, but which type?)
  // We just request a 'hero' and let the ranking engine find the best fit.
  indexSections.push("hero");

  // 2. Immediate Trust / Value Proposition
  if (brandContext.trust_level === "high" || catalogContext.price_band === "high") {
    indexSections.push("logo-list"); // High-end brands show press/logos
  } else {
    indexSections.push("usp-bar"); // Standard brands show free shipping/returns
  }

  // 3. Catalog Display Strategy
  if (catalogContext.collection_count > 3) {
    // If they have a deep catalog, show collections first
    indexSections.push("collection-list");
    indexSections.push("featured-collection");
  } else if (catalogContext.product_count <= 5) {
    // Micro-catalog: highlight a single product immediately
    indexSections.push("featured-product");
    if (catalogContext.product_count > 1) {
      indexSections.push("featured-collection"); // Show the rest
    }
  } else {
    // Standard catalog
    indexSections.push("featured-collection");
    indexSections.push("collection-list");
  }

  // 4. Storytelling / Brand Depth
  if (
    brandContext.brand_archetype === "artisan_handcrafted" || 
    brandContext.brand_archetype === "heritage_classic" ||
    brandContext.brand_archetype === "natural_organic"
  ) {
    indexSections.push("brand-story"); // Origin story is critical for these
    indexSections.push("image-with-text");
  } else if (
    brandContext.brand_archetype === "technical_performance" || 
    brandContext.brand_archetype === "editorial_luxury"
  ) {
    indexSections.push("image-banner"); // High visual impact
    indexSections.push("rich-text"); // Manifesto
  }

  // 5. Social Proof
  if (catalogContext.catalog_strength > 60) {
    indexSections.push("testimonials");
  }

  // 6. Final Conversion Push
  if (catalogContext.product_count > 10) {
    indexSections.push("featured-collection"); // Another row of products
  }
  
  indexSections.push("newsletter");
  indexSections.push("footer");

  return {
    pages: {
      index: indexSections
    }
  };
}
