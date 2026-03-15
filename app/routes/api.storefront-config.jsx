import { json } from "@remix-run/node";
import prisma from "../db.server";

/**
 * API Route: /api/storefront-config
 * Public endpoint (no auth required) that returns the active widget
 * configuration for storefront scripts.
 *
 * Called by the storefront widget bundle to know which features to activate.
 * GET /api/storefront-config?shop=mystore.myshopify.com
 */

// Simple in-memory cache (60s TTL)
const cache = new Map();
const CACHE_TTL = 60_000;

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shopDomain = url.searchParams.get("shop");

  if (!shopDomain) {
    return json({ error: "Missing shop parameter" }, { status: 400 });
  }

  // Check cache
  const cached = getCached(`config:${shopDomain}`);
  if (cached) {
    return json(cached, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      },
    });
  }

  try {
    // Look up shop by domain
    const shop = await prisma.shop.findUnique({
      where: { shopDomain },
      select: { id: true, settings: true },
    });

    if (!shop) {
      throw new Error("Shop not found");
    }

    // Parse settings for upsell
    const settings = shop.settings ? JSON.parse(shop.settings) : {};
    const upsell = settings.upsell || { isActive: false };

    // Fetch urgency configs
    const timers = await prisma.urgencyTimer.findMany({
      where: { shopId: shop.id, isActive: true },
    });

    // Fetch active theme
    const activeTheme = await prisma.theme.findFirst({
      where: { shopId: shop.id, isActive: true },
      select: { name: true, cssVariables: true },
    });

    const config = {
      stickyCart: true, // Always enabled if script tag is present
      upsell,
      urgency: {
        scarcity: null,
        countdown: null,
        buyer: null,
        threshold: null,
        banner: null,
      },
      theme: activeTheme?.name || null,
    };

    for (const timer of timers) {
      switch (timer.displayType) {
        case "scarcity":
          config.urgency.scarcity = {
            threshold: parseInt(timer.message) || 10,
          };
          break;
        case "countdown":
          config.urgency.countdown = {
            deadline: timer.deadline?.toISOString() || null,
          };
          break;
        case "buyer":
          config.urgency.buyer = { minOrders: 5 };
          break;
        case "threshold":
          config.urgency.threshold = {
            amount: parseFloat(timer.message) || 50,
          };
          break;
        case "banner":
          config.urgency.banner = {
            message: timer.message || "",
          };
          break;
      }
    }

    setCache(`config:${shopDomain}`, config);

    return json(config, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (e) {
    return json(
      { stickyCart: true, urgency: {}, upsell: { isActive: false }, theme: null, error: e.message },
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
};
