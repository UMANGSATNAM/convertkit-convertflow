import { json } from "@remix-run/node";
import prisma from "../db.server";
import { rateLimit, truncate } from "../utils/security.server";

const MAX_BATCH_SIZE = 100;
const VALID_EVENT_TYPES = new Set([
  "pageview",
  "feature_interact",
  "feature_impression",
  "purchase",
  "add_to_cart",
]);

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
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const corsHeaders = { "Access-Control-Allow-Origin": "*" };

  try {
    const payload = await request.json();
    const events = Array.isArray(payload) ? payload : [payload];

    if (events.length === 0) {
      return json({ error: "Empty payload" }, { status: 400, headers: corsHeaders });
    }

    // Cap batch size to prevent abuse
    if (events.length > MAX_BATCH_SIZE) {
      return json(
        { error: `Batch too large. Max ${MAX_BATCH_SIZE} events.` },
        { status: 400, headers: corsHeaders }
      );
    }

    // Rate limit by shop domain
    const shopDomains = [
      ...new Set(events.map((e) => e.shop || e.shopDomain).filter(Boolean)),
    ];

    if (shopDomains.length === 0) {
      return json({ error: "Missing shop domain" }, { status: 400, headers: corsHeaders });
    }

    for (const domain of shopDomains) {
      const { allowed } = rateLimit(`analytics:${domain}`, 60, 60_000);
      if (!allowed) {
        return json(
          { error: "Rate limit exceeded. Try again later." },
          { status: 429, headers: corsHeaders }
        );
      }
    }

    // Lookup shop IDs
    const shops = await prisma.shop.findMany({
      where: { shopDomain: { in: shopDomains } },
      select: { id: true, shopDomain: true },
    });

    const shopMap = new Map(shops.map((s) => [s.shopDomain, s.id]));

    // Build valid events for insertion
    const validEvents = [];
    for (const event of events) {
      const domain = event.shop || event.shopDomain;
      const shopId = shopMap.get(domain);
      if (!shopId) continue;

      // Validate event type
      const eventType = truncate(event.eventType, 50);
      if (!eventType || !VALID_EVENT_TYPES.has(eventType)) continue;

      validEvents.push({
        shopId,
        eventType,
        value: event.value != null ? Number(event.value) || null : null,
        featureName: truncate(event.featureName, 100) || null,
        sessionId: truncate(event.sessionId, 100) || null,
      });
    }

    if (validEvents.length > 0) {
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
