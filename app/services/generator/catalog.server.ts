import { graphqlRequest } from "../shopify-api.server";

// Small delay helper to avoid Shopify rate limits
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function importCatalog(shop: any, catalogUrl: string) {
  // In a real environment, we would fetch the JSON from catalogUrl.
  // For this local simulation, we'll read the mock file directly.
  let products = [];
  try {
    const fs = await import('fs');
    const path = await import('path');
    const catalogPath = path.resolve(process.cwd(), 'themes/ethnic-wear/catalog.json');
    const content = fs.readFileSync(catalogPath, 'utf-8');
    products = JSON.parse(content);
  } catch (err) {
    console.error("Failed to read mock catalog, using empty array.", err);
  }

  for (const product of products) {
    // 1. Create the Product
    const pResponse = await graphqlRequest(
      shop.shopDomain,
      shop.accessToken,
      `
      mutation productCreate($input: ProductInput!) {
        productCreate(input: $input) {
          product { id }
          userErrors { field message }
        }
      }
      `,
      {
        input: {
          title: product.title,
          vendor: product.vendor,
          productType: product.product_type,
          tags: product.tags,
          descriptionHtml: product.body_html,
          seo: {
            title: product.seo_title,
            description: product.seo_description
          }
        }
      }
    );

    const productId = pResponse.productCreate?.product?.id;
    if (!productId) {
      console.error(`Failed to create product ${product.title}`, pResponse.productCreate?.userErrors);
      continue;
    }

    // 2. Add Variants
    if (product.variants && product.variants.length > 0) {
      const variantsInput = product.variants.map((variant: any) => ({
        price: variant.price,
        compareAtPrice: variant.compare_at_price || null,
        sku: variant.sku,
        optionValues: [{ optionName: "Size", name: variant.title || "Default Title" }],
        inventoryItem: { tracked: false }
      }));

      const vResponse = await graphqlRequest(
        shop.shopDomain,
        shop.accessToken,
        `
        mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
          productVariantsBulkCreate(productId: $productId, variants: $variants) {
            productVariants { id }
            userErrors { field message }
          }
        }
        `,
        {
          productId,
          variants: variantsInput
        }
      );
      
      if (vResponse.productVariantsBulkCreate?.userErrors?.length > 0) {
        console.error("Variant bulk create errors:", vResponse.productVariantsBulkCreate.userErrors);
      }

      await sleep(250); // Rate limit backoff
    }

    // 3. Add Images
    // We would use productAppendImages mutation here.
    
    await sleep(500); // Rate limit backoff between products
  }
}
