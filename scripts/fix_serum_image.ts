import { graphqlRequest } from "../app/services/shopify-api.server.js";
import prisma from "../app/db.server.js";

async function main() {
  try {
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
      await graphqlRequest(shop.shopDomain, shop.accessToken, delQuery, {
        productId: product.id,
        mediaIds: mediaNodes.map((n: any) => n.id)
      });
    }

    console.log("Adding new luxury serum media...");
    const createQuery = `
      mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
        productCreateMedia(media: $media, productId: $productId) {
          media { id mediaErrors { code message } status }
          userErrors { field message }
        }
      }
    `;
    const createRes = await graphqlRequest(shop.shopDomain, shop.accessToken, createQuery, {
      productId: product.id,
      media: [
        {
          mediaContentType: "IMAGE",
          originalSource: "https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/public/images/avatar_v2.png"
        }
      ]
    });
    console.log("Create media result:", JSON.stringify(createRes, null, 2));
    
    // Wait for Shopify to process the media
    console.log("Waiting 3 seconds for Shopify Media API to process the image...");
    await new Promise(r => setTimeout(r, 3000));
    
    console.log("Done!");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
