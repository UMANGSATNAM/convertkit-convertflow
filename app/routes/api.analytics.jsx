import { json } from "@remix-run/node";
import prisma from "../db.server";

/**
 * API Route: /api/analytics
 * Handles both single event and batch event ingestion from storefront widgets.
 * Supports sendBeacon (Blob) and regular POST.
 * CORS enabled for cross-origin storefront calls.
 */

// OPTIONS handler for CORS preflight
export const loader = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  return json({ error: "Method not allowed" }, { status: 405 });
};

export const action = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const corsHeaders = { "Access-Control-Allow-Origin": "*" };

  try {
    const payload = await request.json();

    // Handle batch events (array from sendBeacon) or single event (object)
    const events = Array.isArray(payload) ? payload : [payload];

    if (events.length === 0) {
      return json({ error: "Empty payload" }, { status: 400, headers: corsHeaders });
    }

    // Group events by shop domain for efficient DB lookups
    const shopDomains = [...new Set(events.map(e => e.shop || e.shopDomain).filter(Boolean))];

    if (shopDomains.length === 0) {
      return json({ error: "Missing shop domain" }, { status: 400, headers: corsHeaders });
    }

    // Lookup shop IDs
    const shops = await prisma.shop.findMany({
      where: { shopDomain: { in: shopDomains } },
      select: { id: true, shopDomain: true },
    });

    const shopMap = new Map(shops.map(s => [s.shopDomain, s.id]));

    // Build valid events for insertion
    const validEvents = [];
    for (const event of events) {
      const domain = event.shop || event.shopDomain;
      const shopId = shopMap.get(domain);
      if (!shopId) continue;
      if (!event.eventType) continue;

      validEvents.push({
        shopId,
        eventType: event.eventType,
        value: event.value != null ? Number(event.value) : null,
        featureName: event.featureName || null,
        sessionId: event.sessionId || null,
      });
    }

    if (validEvents.length > 0) {
      // Use createMany for batch insert efficiency
      await prisma.analyticsEvent.createMany({
        data: validEvents,
        skipDuplicates: true,
      });
    }

    return json({ success: true, ingested: validEvents.length }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Analytics ingestion error:", error);
    return json({ error: "Internal server error" }, {
      status: 500,
      headers: corsHeaders,
    });
  }
};
