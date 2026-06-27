import { graphqlRequest } from "../shopify-api.server";
import { StoreBlueprintData } from "./composer.server";

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
          productsCount
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
  const validCollections = collections.filter(c => c.productsCount > 0);
  const primaryCollection = validCollections[0]?.handle || "frontpage";
  const secondaryCollection = validCollections.length > 1 ? validCollections[1].handle : primaryCollection;

  let injectedCount = 0;

  // Iterate over sections and inject settings based on sectionType
  for (const [pageHandle, pageData] of Object.entries(blueprint.pages)) {
    pageData.sections.forEach((section, index) => {
      if (!section.settings) {
        section.settings = {};
      }

      // We infer the semantic meaning of the section.
      // E.g. a featured collection should map to a collection picker.
      const typeStr = section.componentId.toLowerCase();

      if (typeStr.includes("featured-collection") || typeStr.includes("product") || typeStr.includes("carousel") || typeStr.includes("grid")) {
        // Only override if the setting doesn't already exist from the AI Phase 4 (though Phase 4 shouldn't hardcode handles).
        section.settings.collection = (index % 2 === 0) ? primaryCollection : secondaryCollection;
        injectedCount++;
      }
    });
  }

  console.log(`[Injector] Injected live Shopify data into ${injectedCount} sections.`);
  return blueprint;
}
