import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin } = await authenticate.webhook(request);

  if (!admin && topic !== "APP_UNINSTALLED") {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response("Unauthorized", { status: 401 });
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await prisma.session.deleteMany({ where: { shop } });
        console.log(`[Webhook] Cleaned sessions for uninstalled shop: ${shop}`);
      }
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
      break;
    default:
      console.log(`[Webhook] Unhandled topic: ${topic}`);
      break;
  }

  return new Response(null, { status: 200 });
};
