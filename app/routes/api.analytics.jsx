import { json } from "@remix-run/node";
import prisma from "../db.server";

// This is a public endpoint called from the storefront widget
// We rely on CORS from the Shopify store domain
export const action = async ({ request }) => {
  // We need to handle OPTIONS requests for CORS preflight
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

  try {
    const payload = await request.json();
    const { shop, eventType, value, featureName, sessionId } = payload;

    if (!shop || !eventType) {
      return json({ error: "Missing required fields" }, { 
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    // Lookup shop ID from domain
    const shopRecord = await prisma.shop.findUnique({
      where: { shopDomain: shop },
      select: { id: true }
    });

    if (!shopRecord) {
      return json({ error: "Store not found" }, { 
        status: 404,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    // Save the event
    await prisma.analyticsEvent.create({
      data: {
        shopId: shopRecord.id,
        eventType,
        value: value ? Number(value) : null,
        featureName,
        sessionId
      }
    });

    return json({ success: true }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });
  } catch (error) {
    console.error("Failed to ingest analytics event:", error);
    return json({ error: "Internal server error" }, { 
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }
};
