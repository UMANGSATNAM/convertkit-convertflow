import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { webhookQueue } from "../services/queue.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

  if (!admin && topic !== "APP_UNINSTALLED") {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response("Unauthorized", { status: 401 });
  }

  // Idempotency / Dedupe check
  // Some webhooks (like GDPR ones) don't have unique Shopify IDs, but we can generate one
  const webhookId = request.headers.get("X-Shopify-Webhook-Id") || `${topic}-${shop}-${Date.now()}`;

  const exists = await prisma.webhookEvent.findUnique({
    where: { id: webhookId },
  });

  if (exists) {
    console.log(`[Webhook] Duplicate event ignored: ${topic} for ${shop} (${webhookId})`);
    return new Response("Already processed", { status: 200 });
  }

  // Record it to prevent duplicates
  await prisma.webhookEvent.create({
    data: {
      id: webhookId,
      topic,
      shop,
    },
  });

  console.log(`[Webhook] Queueing ${topic} for ${shop}`);

  // Enqueue job for background processing
  await webhookQueue.add(topic, {
    topic,
    shop,
    payload,
    webhookId,
  }, {
    jobId: webhookId, // BullMQ level deduplication
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 }
  });

  return new Response("Webhook queued", { status: 200 });
};
