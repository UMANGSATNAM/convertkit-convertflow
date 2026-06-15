import { graphqlRequest } from "../shopify-api.server";

export interface CatalogContext {
  industry: string;
  subcategory: string;
  priceTier: string;
  catalogScore: number;
  avgPrice: number;
  productCount: number;
  imagesPerProduct: number;
  tags: string[];
  vendors: string[];
  productTypes: string[];
  priceRange: { min: number, max: number };
}

/**
 * Analyzes the Shopify catalog to extract a compressed context for the AI engines.
 * This prevents blowing up LLM token limits by summarizing the catalog instead of
 * passing raw product JSONs.
 */
export async function analyzeCatalog(
  shopDomain: string,
  accessToken: string
): Promise<CatalogContext> {
  const query = `
    query getCatalogData {
      products(first: 100) {
        nodes {
          vendor
          productType
          tags
          images(first: 5) {
            nodes {
              id
            }
          }
          variants(first: 10) {
            nodes {
              price
            }
          }
        }
      }
    }
  `;

  const response = await graphqlRequest(shopDomain, accessToken, query);

  const products = response.products?.nodes || [];
  
  const vendors = new Set<string>();
  const productTypes = new Set<string>();
  const tags = new Set<string>();
  let minPrice = Infinity;
  let maxPrice = -Infinity;

  let totalImages = 0;

  for (const product of products) {
    if (product.vendor) vendors.add(product.vendor);
    if (product.productType) productTypes.add(product.productType);
    
    if (Array.isArray(product.tags)) {
      product.tags.forEach((tag: string) => tags.add(tag));
    }

    if (product.images?.nodes) {
      totalImages += product.images.nodes.length;
    }

    const variants = product.variants?.nodes || [];
    for (const variant of variants) {
      const price = parseFloat(variant.price);
      if (!isNaN(price)) {
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      }
    }
  }

  // Handle edge cases where no valid prices exist
  if (minPrice === Infinity) minPrice = 0;
  if (maxPrice === -Infinity) maxPrice = 0;

  // Calculate Average Price deterministically
  let totalPrice = 0;
  let priceCount = 0;
  for (const product of products) {
    const variants = product.variants?.nodes || [];
    for (const variant of variants) {
      const p = parseFloat(variant.price);
      if (!isNaN(p)) {
        totalPrice += p;
        priceCount++;
      }
    }
  }
  const avgPrice = priceCount > 0 ? totalPrice / priceCount : 0;

  // --- DETERMINISTIC RULES ENGINE ---
  
  // 1. Price Tier
  let priceTier = "Standard";
  if (avgPrice > 1500) priceTier = "Premium";
  if (avgPrice < 500) priceTier = "Value";

  // 2. Industry & Subcategory
  let industry = "generic";
  let subcategory = "general";
  const allText = [...Array.from(productTypes), ...Array.from(tags), ...Array.from(vendors)].join(" ").toLowerCase();

  if (allText.includes("shirt") || allText.includes("fashion") || allText.includes("apparel") || allText.includes("clothing")) {
    industry = "fashion";
    if (allText.includes("streetwear") || allText.includes("oversize")) subcategory = "streetwear";
    else if (allText.includes("luxury")) subcategory = "luxury";
  } else if (allText.includes("jewelry") || allText.includes("ring") || allText.includes("necklace")) {
    industry = "jewelry";
  } else if (allText.includes("beauty") || allText.includes("cosmetics") || allText.includes("skincare")) {
    industry = "beauty";
  } else if (allText.includes("furniture") || allText.includes("home") || allText.includes("decor")) {
    industry = "home";
  } else if (allText.includes("electronics") || allText.includes("gadget") || allText.includes("tech")) {
    industry = "electronics";
  }

  // 3. Catalog Score (Mock calculation based on product count and variants)
  // E.g., if they have products and prices, they get a decent score.
  let catalogScore = 50;
  if (products.length > 10) catalogScore += 20;
  if (priceCount > products.length) catalogScore += 20; // Multiple variants
  if (vendors.size > 1) catalogScore += 10;
  
  // Cap at 100
  catalogScore = Math.min(catalogScore, 100);

  // If deterministic classification fails (industry is still 'generic'), 
  // we would normally trigger an LLM fallback here passing the compressed data.
  // For the MVP, we assume the deterministic rules catch the primary targets.

  return {
    industry,
    subcategory,
    priceTier,
    catalogScore,
    avgPrice,
    productCount: products.length,
    imagesPerProduct: products.length > 0 ? totalImages / products.length : 0,
    tags: Array.from(tags),
    vendors: Array.from(vendors),
    productTypes: Array.from(productTypes),
    priceRange: { min: minPrice, max: maxPrice }
  };
}
