import { CatalogContext } from "./catalog-analyzer.server";

export interface CROContext {
  trustLevel: "low" | "medium" | "high";
  socialProofNeeded: boolean;
  faqNeeded: boolean;
}

/**
 * Analyzes the required CRO elements purely deterministically 
 * based on the Catalog Analysis.
 */
export async function analyzeCRO(catalogData: CatalogContext): Promise<CROContext> {
  let trustLevel: "low" | "medium" | "high" = "medium";
  let socialProofNeeded = false;
  let faqNeeded = false;

  // Premium items require high trust and FAQs
  if (catalogData.priceTier === "Premium") {
    trustLevel = "high";
    faqNeeded = true;
    socialProofNeeded = true;
  }

  // Certain industries always need social proof
  if (catalogData.industry === "beauty" || catalogData.industry === "health" || catalogData.industry === "fashion") {
    socialProofNeeded = true;
  }

  // If the catalog score is low (lack of data/images), we must compensate with heavy social proof
  if (catalogData.catalogScore < 70) {
    trustLevel = "high";
    socialProofNeeded = true;
  }

  // Value tier might not need as much trust overhead to convert
  if (catalogData.priceTier === "Value" && catalogData.catalogScore > 80) {
    trustLevel = "low";
  }

  return {
    trustLevel,
    socialProofNeeded,
    faqNeeded
  };
}
