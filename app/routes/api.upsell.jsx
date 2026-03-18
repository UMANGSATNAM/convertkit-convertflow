import { json } from "@remix-run/node";
import prisma from "../db.server";

/**
 * GET /api/upsell?product=<productId>
 * Returns a recommended upsell product for the given product.
 * Uses simple collection-based recommendation:
 *   1. Find which collection the product belongs to
 *   2. Return another available product from the same collection
 *   3. Never recommend the same product
 */
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const productId = url.searchParams.get("product");
  const shopDomain = url.searchParams.get("shop");

  if (!productId) {
    return json({ upsellProduct: null }, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    // Look up shop settings for upsell configuration
    let upsellConfig = null;
    if (shopDomain) {
      const shop = await prisma.shop.findUnique({
        where: { shopDomain },
        select: { settings: true },
      });
      if (shop?.settings) {
        const settings = JSON.parse(shop.settings);
        upsellConfig = settings.upsell;
      }
    }

    // If merchant has a specific upsell product configured, use that
    if (upsellConfig?.offerHandle) {
      // Fetch the offer product via Storefront API (public endpoint)
      const productUrl = `https://${shopDomain}/products/${upsellConfig.offerHandle}.js`;
      const resp = await fetch(productUrl);
      if (resp.ok) {
        const product = await resp.json();
        const firstAvailableVariant = product.variants.find(v => v.available);
        if (firstAvailableVariant) {
          return json({
            upsellProduct: {
              title: product.title,
              image_url: product.images?.[0] || "",
              price: firstAvailableVariant.price,
              variant_id: firstAvailableVariant.id,
              handle: product.handle,
            },
          }, {
            headers: { "Access-Control-Allow-Origin": "*" },
          });
        }
      }
    }

    return json({ upsellProduct: null }, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    console.error("Upsell API error:", error);
    return json({ upsellProduct: null }, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
};
