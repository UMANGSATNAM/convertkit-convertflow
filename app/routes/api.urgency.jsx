import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

/**
 * API Route: /api/urgency
 * Saves and loads urgency tool configurations.
 *
 * GET  → loads all urgency configs for the shop
 * POST → saves/updates an urgency tool config
 */

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  try {
    const shop = await prisma.shop.findUnique({
      where: { shopDomain: session.shop },
      select: { id: true },
    });

    if (!shop) return json({ timers: [], error: "Shop not found" });

    const timers = await prisma.urgencyTimer.findMany({
      where: { shopId: shop.id },
    });
    return json({ timers });
  } catch (e) {
    return json({ timers: [], error: e.message });
  }
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const toolType = formData.get("toolType");
  const isActive = formData.get("isActive") === "true";
  const message = formData.get("message") || null;
  const deadline = formData.get("deadline") || null;
  const displayType = formData.get("displayType") || toolType;
  const productId = formData.get("productId") || null;
  const collectionId = formData.get("collectionId") || null;

  if (!toolType) {
    return json({ error: "Missing toolType" }, { status: 400 });
  }

  try {
    // Look up shop by domain to get the cuid
    const shop = await prisma.shop.findUnique({
      where: { shopDomain: session.shop },
      select: { id: true },
    });

    if (!shop) {
      return json({ error: "Shop not found" }, { status: 404 });
    }

    const shopId = shop.id;

    // Upsert: one config per tool type per shop
    const existingTimer = await prisma.urgencyTimer.findFirst({
      where: { shopId, displayType: toolType },
    });

    let timer;
    if (existingTimer) {
      timer = await prisma.urgencyTimer.update({
        where: { id: existingTimer.id },
        data: {
          isActive,
          message,
          deadline: deadline ? new Date(deadline) : null,
          displayType,
          productId,
          collectionId,
        },
      });
    } else {
      timer = await prisma.urgencyTimer.create({
        data: {
          shopId,
          isActive,
          message,
          deadline: deadline ? new Date(deadline) : null,
          displayType: toolType,
          productId,
          collectionId,
        },
      });
    }

    return json({ success: true, timer });
  } catch (e) {
    return json({ error: e.message }, { status: 500 });
  }
};
