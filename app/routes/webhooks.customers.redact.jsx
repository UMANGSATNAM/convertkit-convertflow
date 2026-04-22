import { json } from "@remix-run/node";
import prisma from "../db.server";

/**
 * POST /webhooks/customers/redact
 * GDPR: Customer Redact — delete all data associated with a customer.
 */
export const action = async ({ request }) => {
  try {
    const payload = await request.json();
    const shopDomain = payload.shop_domain;
    const customerId = String(payload.customer?.id || "");

    if (!shopDomain) {
      return json({ error: "Missing shop_domain" }, { status: 400 });
    }

    const shop = await prisma.shop.findUnique({
      where: { shopDomain },
      select: { id: true },
    });

    if (!shop) {
      return json({ message: "No data found for this shop" });
    }

    // Delete review requests for this customer
    await prisma.reviewRequest.deleteMany({
      where: { shopId: shop.id, customerId },
    });

    console.log(`GDPR: Redacted customer ${customerId} data for shop ${shopDomain}`);
    return json({ success: true });
  } catch (error) {
    console.error("GDPR customer redact error:", error);
    return json({ error: "Internal error" }, { status: 500 });
  }
};
