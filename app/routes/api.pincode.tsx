import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // App proxy requests should be validated by authenticate.public.appProxy
  // If not using the official appProxy authenticator due to limitations,
  // we can use standard CORS and shop query param for now.
  const url = new URL(request.url);
  const shopDomain = url.searchParams.get("shop");
  const pincode = url.searchParams.get("pincode");

  if (!shopDomain || !pincode) {
    return json({ error: "Missing shop or pincode" }, { status: 400 });
  }

  const shop = await prisma.shop.findUnique({ where: { shopDomain } });
  if (!shop) {
    return json({ error: "Shop not found" }, { status: 404 });
  }

  // Check if pincode feature is enabled
  const feature = await prisma.toolkitFeature.findUnique({
    where: { shopId_feature: { shopId: shop.id, feature: "PINCODE" } }
  });

  if (!feature || !feature.enabled) {
    return json({ error: "Pincode feature is not enabled" }, { status: 403 });
  }

  const zone = await prisma.pincodeZone.findUnique({
    where: { shopId_pincode: { shopId: shop.id, pincode } }
  });

  if (zone) {
    return json({
      available: true,
      cod: zone.cod,
      etaDays: zone.etaDays,
      message: `Delivery available. ETA: ${zone.etaDays} days.` + (zone.cod ? " COD Available." : " Prepaid only.")
    });
  } else {
    // Fallback logic could go here (e.g. general delivery rules)
    return json({
      available: false,
      message: "Delivery not available for this pincode."
    });
  }
}
