import { json } from "@remix-run/node";
import prisma from "../db.server";

/**
 * POST /webhooks/shop/redact
 * GDPR: Shop Redact — delete ALL data for a shop (48 hours after uninstall).
 * This is the nuclear option — removes everything.
 */
export const action = async ({ request }) => {
  try {
    const payload = await request.json();
    const shopDomain = payload.shop_domain;

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

    const shopId = shop.id;

    // Delete all related data in correct order (respecting foreign keys)
    await prisma.$transaction([
      prisma.analyticsEvent.deleteMany({ where: { shopId } }),
      prisma.reviewRequest.deleteMany({ where: { shopId } }),
      prisma.urgencyTimer.deleteMany({ where: { shopId } }),
      prisma.pushHistory.deleteMany({ where: { shopId } }),
      prisma.libraryItem.deleteMany({ where: { shopId } }),
      prisma.extraction.deleteMany({ where: { shopId } }),
      prisma.section.deleteMany({ where: { shopId } }),
      prisma.page.deleteMany({ where: { shopId } }),
      prisma.theme.deleteMany({ where: { shopId } }),
      prisma.shop.delete({ where: { id: shopId } }),
    ]);

    console.log(`GDPR: Fully redacted shop ${shopDomain} (${shopId})`);
    return json({ success: true });
  } catch (error) {
    console.error("GDPR shop redact error:", error);
    return json({ error: "Internal error" }, { status: 500 });
  }
};
