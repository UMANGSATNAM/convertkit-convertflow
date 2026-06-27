import { graphqlRequest } from "../shopify-api.server";
import { generateStructuredJson } from "./claude.server";

export interface CatalogContext {
  industry: string;
  positioning: string;
  style: string;
  price_band: string;
  catalog_strength: number;
  product_count: number;
  collection_count: number;
  dominant_categories: string[];
  catalog_depth: string;
  visual_complexity: string;
  hero_product_type: string;
  avgPrice: number;
  imagesPerProduct: number;
  tags: string[];
  vendors: string[];
  productTypes: string[];
  priceRange: { min: number, max: number };
  sampleImageUrls: string[];
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
          images(first: 20) {
            nodes {
              url
              altText
              width
              height
            }
          }
          variants(first: 10) {
            nodes {
              price
            }
          }
        }
      }
      collections(first: 50) {
        nodes {
          title
        }
      }
    }
  `;

  const response = await graphqlRequest(shopDomain, accessToken, query);

  const products = response.products?.nodes || [];
  const collections = response.collections?.nodes || [];
  const collectionCount = collections.length;
  
  const vendors = new Set<string>();
  const productTypes = new Set<string>();
  const tags = new Set<string>();
  const titles: string[] = [];
  const sampleImageUrls: string[] = [];
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
      product.images.nodes.forEach((img: any) => {
        // Collect real CDN URLs for the visual analyzer — skip blank/missing
        if (img.url && sampleImageUrls.length < 20) {
          sampleImageUrls.push(img.url);
        }
      });
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
    You are a Senior E-commerce Data Analyst for a premium AI agency.
    Your job is to analyze the compressed catalog data of a Shopify store and strictly categorize it for down-stream theme generation.
    
    You must output ONLY valid JSON matching this exact schema:
    {
      "industry": "string (e.g., fashion, beauty, home, electronics, jewelry, generic)",
      "positioning": "string (e.g., premium, luxury, budget, mid_market)",
      "style": "string (e.g., minimal, bold, trendy, heritage)",
      "price_band": "string (e.g., high, mid_high, mid, low)",
      "catalog_strength": "number (0-100 indicating quality/richness of data)",
      "product_count": "number",
      "collection_count": "number",
      "dominant_categories": ["string", "string"],
      "catalog_depth": "string (e.g., high, medium, low)",
      "visual_complexity": "string (e.g., high, medium, low)",
      "hero_product_type": "string (e.g., oversized_tshirts, gold_necklaces)"
    }

    Guidelines:
    - 'catalog_strength': Score higher if there are many products, multiple images, and robust tags.
    - 'visual_complexity': Guess based on tags and product types (e.g. multi-variant fashion vs single digital product).
    - 'hero_product_type': What is the most prominent product type they sell?
  `;

  // Compress the data to send to the LLM
  const userPrompt = JSON.stringify({
    shopDomain,
    productCount,
    collectionCount,
    avgPrice,
    imagesPerProduct,
    vendors: Array.from(vendors).slice(0, 10),
    productTypes: Array.from(productTypes).slice(0, 10),
    tags: Array.from(tags).slice(0, 20),
    sampleTitles: titles.slice(0, 10)
  });

  let aiResult = {
    industry: "generic",
    positioning: "mid_market",
    style: "minimal",
    price_band: "mid",
    catalog_strength: 50,
    product_count: productCount,
    collection_count: collectionCount,
    dominant_categories: ["general"],
    catalog_depth: "medium",
    visual_complexity: "medium",
    hero_product_type: "general_goods"
  };

  try {
    aiResult = await generateStructuredJson<typeof aiResult>(systemInstruction, userPrompt);
  } catch (err) {
    console.error("Claude failed in catalog analyzer, falling back to defaults.", err);
  }

  return {
    industry: aiResult.industry,
    positioning: aiResult.positioning,
    style: aiResult.style,
    price_band: aiResult.price_band,
    catalog_strength: aiResult.catalog_strength,
    product_count: aiResult.product_count,
    collection_count: aiResult.collection_count,
    dominant_categories: aiResult.dominant_categories,
    catalog_depth: aiResult.catalog_depth,
    visual_complexity: aiResult.visual_complexity,
    hero_product_type: aiResult.hero_product_type,
    avgPrice,
    imagesPerProduct,
    tags: Array.from(tags),
    vendors: Array.from(vendors),
    productTypes: Array.from(productTypes),
    priceRange: { min: minPrice, max: maxPrice },
    sampleImageUrls
  };
}
