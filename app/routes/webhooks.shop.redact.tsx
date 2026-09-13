import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

/**
 * Mandatory GDPR: shop/redact
 *
 * 48 hours after a store uninstalls the app, Shopify sends this webhook.
 * The app must delete or anonymize store database records in compliance with data privacy regulations.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  console.log(`[GDPR] shop/redact received for shop: ${shop}`, payload);

  try {
    // 1. Mark or delete shop record
    await prisma.shop.updateMany({
      where: { shopDomain: shop },
      data: {
        uninstalledAt: new Date(),
        accessToken: "REDACTED",
      },
    });

    // 2. Clear any lingering sessions for this shop
    await prisma.session.deleteMany({
      where: { shop },
    });

    console.log(`[GDPR] shop/redact successfully completed for shop: ${shop}`);
  } catch (error) {
    console.error(`[GDPR] Error executing shop/redact for ${shop}:`, error);
  }

  return new Response("Shop data redaction acknowledged", { status: 200 });
};
