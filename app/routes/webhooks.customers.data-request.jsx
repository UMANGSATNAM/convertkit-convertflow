import { json } from "@remix-run/node";
import prisma from "../db.server";

/**
 * POST /webhooks/customers/data-request
 * GDPR: Customer Data Request — returns all data stored for a customer.
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

    // Find review requests for this customer
    const reviewRequests = await prisma.reviewRequest.findMany({
      where: { shopId: shop.id, customerId },
      select: {
        id: true,
        orderId: true,
        productId: true,
        status: true,
        generatedReview: true,
        sentAt: true,
        completedAt: true,
      },
    });

    // Find analytics events for this session (we don't store customer IDs in analytics)
    // Return what we have
    return json({
      customer_id: customerId,
      shop: shopDomain,
      data: {
        review_requests: reviewRequests,
        analytics_events: "Analytics events are anonymous (session-based, no PII stored)",
      },
    });
  } catch (error) {
    console.error("GDPR data request error:", error);
    return json({ error: "Internal error" }, { status: 500 });
  }
};
