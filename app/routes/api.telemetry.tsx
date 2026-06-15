import { json, type ActionFunctionArgs } from "@remix-run/node";
import prisma from "../db.server";

// Public endpoint (CORS enabled) so storefronts can send telemetry via a pixel.
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST" && request.method !== "OPTIONS") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const data = await request.json();
    const { componentId, industry, eventType, value } = data;

    if (!componentId || !industry || !eventType) {
      return json({ error: "Missing fields" }, { status: 400 });
    }

    // In a production app, we would push to a queue (e.g. BullMQ) 
    // to avoid locking the DB on high traffic storefronts.
    // For MVP, we update ComponentPerformance synchronously.
    
    // Upsert the performance record
    const perf = await prisma.componentPerformance.upsert({
      where: { componentId },
      update: {},
      create: {
        componentId,
        industry,
        storesUsed: 1,
        avgConversion: 0,
        avgTimeOnPage: 0,
        bounceRate: 0,
      }
    });

    if (eventType === "CONVERSION") {
      // Very naive rolling average calculation for MVP simulation
      const newConv = ((perf.avgConversion * perf.storesUsed) + (value || 1)) / (perf.storesUsed + 1);
      await prisma.componentPerformance.update({
        where: { componentId },
        data: { 
          avgConversion: newConv,
          storesUsed: { increment: 1 } 
        }
      });
    } else if (eventType === "TIME_ON_PAGE") {
      const newTime = ((perf.avgTimeOnPage * perf.storesUsed) + (value || 0)) / (perf.storesUsed + 1);
      await prisma.componentPerformance.update({
        where: { componentId },
        data: { avgTimeOnPage: newTime }
      });
    }

    return json({ success: true }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });
  } catch (err: any) {
    console.error("Telemetry error:", err);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
}
