import { graphqlRequest } from "../app/services/shopify-api.server.js";
import prisma from "../app/db.server.js";

async function main() {
  const shop = await prisma.shop.findFirst({
    where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" }
  });
  if (!shop) throw new Error("Shop not found");

  const query = `
    query {
      productByHandle(handle: "aurelle-celestial-radiance-serum") {
        id
        title
        media(first: 10) {
          edges {
            node {
              id
              ... on MediaImage {
                image {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;
  const res = await graphqlRequest(shop.shopDomain, shop.accessToken, query);
  const product = res.productByHandle;
  if (!product) {
    console.log("Product not found by handle.");
    return;
  }
  
  console.log(`Found product: ${product.title} (ID: ${product.id})`);
  const mediaNodes = product.media.edges.map((e: any) => e.node);

  if (mediaNodes.length > 1) {
    console.log("Deleting second media item...");
    const delQuery = `
      mutation productDeleteMedia($productId: ID!, $mediaIds: [ID!]!) {
        productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
          deletedMediaIds
          userErrors { field message }
        }
      }
    `;
    await graphqlRequest(shop.shopDomain, shop.accessToken, delQuery, {
      productId: product.id,
      mediaIds: [mediaNodes[1].id]
    });
    console.log("Deleted media ID:", mediaNodes[1].id);
  } else {
    console.log("Product does not have a second image.");
  }
  console.log("Done!");
}

main().catch(console.error);
