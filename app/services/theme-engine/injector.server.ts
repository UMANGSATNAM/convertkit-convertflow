import { graphqlRequest } from "../shopify-api.server";
import { StoreBlueprintData } from "./compiler.server";

/**
 * Phase 7: Product Injection Engine
 * Auto-selects collections and products to inject into the generated Blueprint sections.
 */
export async function injectProductsIntoBlueprint(
  shopDomain: string,
  accessToken: string,
  blueprint: StoreBlueprintData
): Promise<StoreBlueprintData> {
  console.log(`[Injector] Running Phase 7 for ${shopDomain}...`);

  // Pull top 5 collections from the store
  const query = `
    query getStoreCollections {
      collections(first: 5, sortKey: UPDATED_AT) {
        nodes {
          handle
          title
          productsCount {
            count
          }
        }
      }
    }
  `;

  let collections: any[] = [];
  try {
    const response = await graphqlRequest(shopDomain, accessToken, query);
    collections = response?.collections?.nodes || [];
  } catch (err: any) {
    console.warn(`[Injector] Failed to fetch collections: ${err.message}`);
  }

  // Find collections that have products
  const validCollections = collections.filter(c => c.productsCount?.count > 0);
  const primaryCollection = validCollections[0]?.handle || "frontpage";
  const secondaryCollection = validCollections.length > 1 ? validCollections[1].handle : primaryCollection;

  let injectedCount = 0;

  // Iterate over sections and inject settings based on sectionType
  for (const [pageHandle, pageData] of Object.entries(blueprint.pages)) {
    pageData.sections.forEach((section, index) => {
      if (!section.settings) {
        section.settings = {};
      }

      // Which sections need a collection is decided by their `sectionType` —
      // the field the blueprint sets deliberately — not by whether their
      // filename happens to contain "grid" or "product".
      //
      // The name-matching version missed almost everything: `cp-v10` is a
      // collection page, `hp1-featured` is a featured collection, and neither
      // contains any of the matched substrings. On a real run it wired up 2
      // sections out of 23, so the rest rendered with no collection set — which
      // is what made grids come out empty or fall back to placeholder cards.
      const sectionType = String(section.sectionType || "").toLowerCase();
      const componentId = String(section.componentId || "").toLowerCase();

      const NEEDS_COLLECTION = new Set([
        "featured-collection",
        "collection",
        "collection-page",
        "collection-list",
        "product-grid",
        "product_grid",
        "collections"
      ]);

      // Name matching stays as a secondary signal, so a component whose type is
      // missing or unrecognised is still caught.
      const needsCollection =
        NEEDS_COLLECTION.has(sectionType) ||
        /(^|-)(cp|grid|collection|carousel|slider|shop)(-|$)/.test(componentId) ||
        componentId.includes("featured-collection") ||
        componentId.includes("product-grid");

      if (needsCollection) {
        // Alternating keeps two adjacent grids from showing the same products.
        // An explicit choice made earlier in the pipeline wins over this default.
        if (!section.settings.collection) {
          section.settings.collection = (index % 2 === 0) ? primaryCollection : secondaryCollection;
          injectedCount++;
        }
      }
    });
  }

  console.log(`[Injector] Injected live Shopify data into ${injectedCount} sections.`);
  return blueprint;
}
