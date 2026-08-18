import { graphqlRequest } from "../shopify-api.server";

// Small delay helper to avoid Shopify rate limits
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function importCatalog(shop: any, catalogUrl: string, nicheId?: string) {
  // Load the catalogue belonging to the niche the merchant chose.
  //
  // This path used to be hardcoded to `themes/ethnic-wear/catalog.json`, so the
  // `catalogUrl` argument was accepted and ignored and every store — beauty,
  // electronics, food — was seeded with bridal lehengas. When the file was also
  // missing from the deployed image the import silently produced nothing, and
  // the sections fell back to their own demo markup: "Jewelry Item 1, $199.00".
  let products: any[] = [];
  const fs = await import('fs');
  const path = await import('path');

  const candidates = [
    nicheId ? path.resolve(process.cwd(), `themes/${nicheId}/catalog.json`) : null,
    // Named in the Niche record as a URL, but the filename still identifies it.
    catalogUrl ? path.resolve(process.cwd(), `themes/${path.basename(catalogUrl, '.json')}/catalog.json`) : null,
    path.resolve(process.cwd(), 'themes/ethnic-wear/catalog.json')
  ].filter(Boolean) as string[];

  let used = "";
  for (const candidate of candidates) {
    try {
      if (!fs.existsSync(candidate)) continue;
      products = JSON.parse(fs.readFileSync(candidate, 'utf-8'));
      used = candidate;
      break;
    } catch (err: any) {
      console.warn(`[Catalog] Could not read ${candidate}: ${err.message}`);
    }
  }

  if (!products.length) {
    console.error(
      `[Catalog] No demo catalogue found for niche "${nicheId || 'unknown'}". ` +
      `Looked in: ${candidates.join(', ')}. The store will be created with no products, ` +
      `and sections will render their placeholder grids.`
    );
    return;
  }

  console.log(`[Catalog] Importing ${products.length} product(s) for "${nicheId || 'default'}" from ${path.basename(path.dirname(used))}/catalog.json`);

  for (const product of products) {
    // 0. Check if product already exists (idempotency for retries)
    const searchResponse = await graphqlRequest(
      shop.shopDomain,
      shop.accessToken,
      `
      query findProduct($query: String!) {
        products(first: 1, query: $query) {
          edges { node { id title } }
        }
      }
      `,
      { query: `title:'${product.title.replace(/'/g, "\\'")}'` }
    );
    const existingProduct = searchResponse.products?.edges?.[0]?.node;
    if (existingProduct) {
      console.log(`[Catalog] Skipping duplicate product: "${product.title}"`);
      continue;
    }

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
      const uniqueVariantTitles = Array.from(new Set(product.variants.map((v: any) => v.title || "Default Title")));
      
      // 2a. Create the Option (Size) so variants can use it
      await graphqlRequest(
        shop.shopDomain,
        shop.accessToken,
        `
        mutation productOptionsCreate($productId: ID!, $options: [OptionCreateInput!]!) {
          productOptionsCreate(productId: $productId, options: $options) {
            userErrors { field message }
          }
        }
        `,
        {
          productId,
          options: [{
            // Each catalogue declares its own axis: sizes for apparel, colours
            // and capacities for electronics. Forcing "Size" onto a charger gave
            // merchants a size dropdown reading "Standard".
            name: product.option_name || "Size",
            values: uniqueVariantTitles.map(name => ({ name: String(name) }))
          }]
        }
      );

      const variantsInput = product.variants.map((variant: any) => ({
        price: variant.price,
        compareAtPrice: variant.compare_at_price || null,
        optionValues: [{ optionName: product.option_name || "Size", name: String(variant.title || "Default Title") }],
        inventoryItem: { sku: variant.sku, tracked: false }
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
    //
    // This was a comment saying "we would use productAppendImages here" and
    // nothing else, so demo products imported without a single photograph. The
    // storefront then rendered every product card as an empty grey box, which is
    // most of why a generated store looked unfinished.
    if (Array.isArray(product.images) && product.images.length > 0) {
      const media = product.images
        .filter((img: any) => img?.src)
        .slice(0, 6)   // enough for a gallery; more just slows the import
        .map((img: any) => ({
          originalSource: img.src,
          alt: img.alt || product.title,
          mediaContentType: "IMAGE"
        }));

      if (media.length > 0) {
        try {
          const mResponse = await graphqlRequest(
            shop.shopDomain,
            shop.accessToken,
            `
            mutation productCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
              productCreateMedia(productId: $productId, media: $media) {
                media { alt status }
                mediaUserErrors { field message }
              }
            }
            `,
            { productId, media }
          );

          const mediaErrors = mResponse.productCreateMedia?.mediaUserErrors || [];
          if (mediaErrors.length > 0) {
            // Shopify fetches these URLs itself and reports failures here, which
            // is the only place a dead image URL becomes visible.
            console.warn(
              `[Catalog] Image import issues for "${product.title}": ` +
              mediaErrors.map((e: any) => e.message).join("; ")
            );
          }
        } catch (mediaErr: any) {
          // A product without its photo is still a product worth having.
          console.warn(`[Catalog] Image import failed for "${product.title}": ${mediaErr.message}`);
        }
        await sleep(250);
      }
    }

    await sleep(500); // Rate limit backoff between products
  }
}
