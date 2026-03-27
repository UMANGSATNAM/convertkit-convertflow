import { json } from "@remix-run/node";
import prisma from "../db.server";

/**
 * GET /api/upsell?product=<productHandle>&shop=<shopDomain>
 * Returns a matching upsell offer for the given trigger product.
 * Reads from settings.upsells (array) with settings.upsell (single) as fallback.
 */
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const productHandle = url.searchParams.get("product");
  const shopDomain = url.searchParams.get("shop");

  const corsHeaders = { "Access-Control-Allow-Origin": "*" };

  if (!productHandle || !shopDomain) {
    return json({ upsellProduct: null }, { headers: corsHeaders });
  }

  try {
    const shop = await prisma.shop.findUnique({
      where: { shopDomain },
      select: { settings: true },
    });

    if (!shop?.settings) {
      return json({ upsellProduct: null }, { headers: corsHeaders });
    }

    const settings = JSON.parse(shop.settings);

    // Support both array format (new) and singular object (legacy)
    let rules = settings.upsells || [];
    if (!Array.isArray(rules) || rules.length === 0) {
      if (settings.upsell) {
        rules = [settings.upsell];
      }
    }

    // Find a matching rule for the trigger product
    const matchedRule = rules.find(
      (r) => r.isActive !== false && r.triggerHandle === productHandle
    );

    if (!matchedRule?.offerHandle) {
      return json({ upsellProduct: null }, { headers: corsHeaders });
    }

    // Fetch the offer product from storefront
    const productUrl = `https://${shopDomain}/products/${matchedRule.offerHandle}.js`;
    const resp = await fetch(productUrl);

    if (!resp.ok) {
      return json({ upsellProduct: null }, { headers: corsHeaders });
    }

    const product = await resp.json();
    const firstAvailableVariant = product.variants.find((v) => v.available);

    if (!firstAvailableVariant) {
      return json({ upsellProduct: null }, { headers: corsHeaders });
    }

    return json(
      {
        upsellProduct: {
          title: product.title,
          image_url: product.images?.[0] || "",
          price: firstAvailableVariant.price,
          variant_id: firstAvailableVariant.id,
          handle: product.handle,
          discountText: matchedRule.discountText || "",
          popupTitle: matchedRule.title || "Complete your order",
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Upsell API error:", error);
    return json({ upsellProduct: null }, { headers: corsHeaders });
  }
};
