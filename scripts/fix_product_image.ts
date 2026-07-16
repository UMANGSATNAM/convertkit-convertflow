import { graphqlRequest } from "../app/services/shopify-api.server.js";
import prisma from "../app/db.server.js";

async function main() {
  const shop = await prisma.shop.findFirst({
    where: { shopDomain: "peri-beauty-bcuauhsj.myshopify.com" }
  });
  if (!shop) throw new Error("Shop not found");

  const query = `
    query {
      productByHandle(handle: "lumiere-bio-active-peptide-face-cream") {
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
  console.log("Current media:", JSON.stringify(mediaNodes, null, 2));

  // Let's delete all existing media and add a luxury face cream product cutout!
  if (mediaNodes.length > 0) {
    console.log("Deleting existing media...");
    const delQuery = `
      mutation productDeleteMedia($productId: ID!, $mediaIds: [ID!]!) {
        productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
          deletedMediaIds
          userErrors { field message }
        }
      }
    `;
    const delRes = await graphqlRequest(shop.shopDomain, shop.accessToken, delQuery, {
      productId: product.id,
      mediaIds: mediaNodes.map((n: any) => n.id)
    });
    console.log("Delete result:", JSON.stringify(delRes, null, 2));
  }

  console.log("Adding new luxury face cream media...");
  const createQuery = `
    mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
      productCreateMedia(media: $media, productId: $productId) {
        media { id }
        userErrors { field message }
      }
    }
  `;
  const createRes = await graphqlRequest(shop.shopDomain, shop.accessToken, createQuery, {
    productId: product.id,
    media: [
      {
        mediaContentType: "IMAGE",
        originalSource: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop" // Beautiful luxury cream jar
      }
    ]
  });
  console.log("Create media result:", JSON.stringify(createRes, null, 2));
  console.log("Done!");
}

main().catch(console.error);
