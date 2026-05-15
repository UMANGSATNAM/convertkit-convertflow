import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

type CompliancePayload = {
  customer?: { id: number | string };
  orders_to_redact?: number[];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, payload } = await authenticate.webhook(request);
  const data = payload as CompliancePayload;

  switch (topic) {
    case "CUSTOMERS_DATA_REQUEST":
      // Log compliance data request — no PII stored yet, but handler is real
      console.log("[gdpr] customers/data_request", {
        shop,
        customerId: data.customer?.id,
      });
      break;

    case "CUSTOMERS_REDACT":
      // Log compliance redact request — no customer PII stored in our DB
      console.log("[gdpr] customers/redact", {
        shop,
        customerId: data.customer?.id,
      });
      break;

    case "SHOP_REDACT":
      // Fires 48h after uninstall. Hard-delete everything for the shop.
      await prisma.shop
        .delete({ where: { shopifyDomain: shop } })
        .catch(() => null); // shop may already be deleted
      break;

    default:
      console.warn("[gdpr] unknown compliance topic", topic);
  }

  return new Response();
};
