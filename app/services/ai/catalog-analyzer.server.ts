import { graphqlRequest } from "../shopify-api.server";
import { generateStructuredJson } from "./claude.server";

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
 * It uses Anthropic Claude to determine the true industry, subcategory, price tier, and a qualitative catalog score.
 */
export async function analyzeCatalog(
  shopDomain: string,
  accessToken: string
): Promise<CatalogContext> {
  const query = `
    query getCatalogData {
      products(first: 100) {
        nodes {
          title
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
  const titles: string[] = [];
  let minPrice = Infinity;
  let maxPrice = -Infinity;

  let totalImages = 0;

  for (const product of products) {
    if (product.title) titles.push(product.title);
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

  if (minPrice === Infinity) minPrice = 0;
  if (maxPrice === -Infinity) maxPrice = 0;

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
  const productCount = products.length;
  const imagesPerProduct = productCount > 0 ? totalImages / productCount : 0;

  // --- AI ENGINE (CLAUDE) ---
  
  const systemInstruction = `
    You are a Senior E-commerce Data Analyst.
    Your job is to analyze the compressed catalog data of a Shopify store and categorize it.
    
    You must output ONLY valid JSON matching this schema:
    {
      "industry": "string (e.g., fashion, beauty, jewelry, home, electronics, generic)",
      "subcategory": "string (e.g., streetwear, skincare, luxury, general)",
      "priceTier": "string (e.g., Premium, Standard, Value)",
      "catalogScore": "number (0-100 indicating quality/richness of the catalog data)"
    }

    Guidelines:
    - Determine 'industry' and 'subcategory' from the product titles, tags, vendors, and types.
    - 'priceTier': 'Premium' if avg price is very high relative to the niche, 'Standard' for average, 'Value' if very cheap.
    - 'catalogScore': Score higher if there are many products, multiple images, and robust tagging/typing.
  `;

  // Compress the data to send to the LLM (to save tokens)
  const userPrompt = JSON.stringify({
    shopDomain,
    productCount,
    avgPrice,
    imagesPerProduct,
    vendors: Array.from(vendors).slice(0, 10),
    productTypes: Array.from(productTypes).slice(0, 10),
    tags: Array.from(tags).slice(0, 20),
    sampleTitles: titles.slice(0, 5) // Just a few titles to give context
  });

  let aiResult = {
    industry: "generic",
    subcategory: "general",
    priceTier: "Standard",
    catalogScore: 50
  };

  try {
    aiResult = await generateStructuredJson<typeof aiResult>(systemInstruction, userPrompt);
  } catch (err) {
    console.error("Claude failed in catalog analyzer, falling back to defaults.", err);
  }

  return {
    industry: aiResult.industry,
    subcategory: aiResult.subcategory,
    priceTier: aiResult.priceTier,
    catalogScore: aiResult.catalogScore,
    avgPrice,
    productCount,
    imagesPerProduct,
    tags: Array.from(tags),
    vendors: Array.from(vendors),
    productTypes: Array.from(productTypes),
    priceRange: { min: minPrice, max: maxPrice }
  };
}
