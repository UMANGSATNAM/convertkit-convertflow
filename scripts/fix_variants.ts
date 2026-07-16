import { graphqlRequest } from "../app/services/shopify-api.server.js";
import prisma from "../app/db.server.js";

async function main() {
  const shop = await prisma.shop.findFirst({
    where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" }
  });
  if (!shop) throw new Error("Shop not found");

  console.log("Fetching product...");
  const query = `
    query {
      productByHandle(handle: "aurelle-celestial-radiance-serum") {
        id
        title
      }
    }
  `;
  const res = await graphqlRequest(shop.shopDomain, shop.accessToken, query);
  const product = res.productByHandle;
  if (!product) {
    console.log("Product not found");
    return;
  }
  console.log(`Found product: ${product.id}`);

  // We want to add Options: "Size"
  console.log("Updating options...");
  
  // Actually, we can use productOptionCreate
  const updateQuery = `
    mutation productOptionCreate($productId: ID!, $name: String!, $values: [OptionValueCreateInput!]!) {
      productOptionCreate(productId: $productId, name: $name, values: $values) {
        product { id options { name values } }
        userErrors { field message }
      }
    }
  `;
  
  const updateRes = await graphqlRequest(shop.shopDomain, shop.accessToken, updateQuery, {
    productId: product.id,
    name: "Size",
    values: [{ name: "30ml" }, { name: "50ml" }, { name: "100ml" }]
  });
  console.log("Product update (options):", JSON.stringify(updateRes.productOptionCreate?.userErrors || updateRes));

  // Now we need to create the variants. Wait, productOptionCreate automatically creates variants for the matrix!
  // If we just want to set prices for these variants, we can fetch the created variants and update them.
  console.log("Fetching new variants...");
  const fetchVars = `
    query { product(id: "${product.id}") { variants(first:10) { edges { node { id title } } } } }
  `;
  const varsRes = await graphqlRequest(shop.shopDomain, shop.accessToken, fetchVars);
  
  const variants = varsRes.product?.variants?.edges || [];
  console.log("Found variants:", variants.map((v:any) => v.node.title));


  // Add 3 extra media items so gallery works
  console.log("Adding extra media...");
  const createMediaQuery = `
    mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
      productCreateMedia(media: $media, productId: $productId) {
        media { id }
        userErrors { field message }
      }
    }
  `;
  const mediaRes = await graphqlRequest(shop.shopDomain, shop.accessToken, createMediaQuery, {
    productId: product.id,
    media: [
      { mediaContentType: "IMAGE", originalSource: "https://images.unsplash.com/photo-1608248593855-ed1ce7320074?q=80&w=800&auto=format&fit=crop" },
      { mediaContentType: "IMAGE", originalSource: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop" }
    ]
  });
  console.log("Media add errors:", JSON.stringify(mediaRes.productCreateMedia.userErrors));
  
  console.log("Done fixing variants and media!");
}

main().catch(console.error);
