import { json, type ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

// CORS headers for the Web Pixel to be able to send data
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
  }

  try {
    const payload = await request.json();
    const shop = payload.shop;
    const eventName = payload.event_name;
    const eventData = payload.event_data;
    
    // In a real production app, we would verify the origin or use a HMAC token.
    console.log(`[TRACKING] Received event from ${shop}: ${eventName}`);

    // Log the event in UsageCounter for the Status Board
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    
    const dbShop = await prisma.shop.findUnique({ where: { shopDomain: shop } });
    
    if (dbShop && eventName) {
      await prisma.usageCounter.upsert({
        where: { shopId_metric_period: { shopId: dbShop.id, metric: eventName, period: today } },
        update: { count: { increment: 1 } },
        create: { shopId: dbShop.id, metric: eventName, period: today, count: 1 }
      });
    }

    return json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error("[TRACKING] Error processing event:", error);
    return json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
  }
};
