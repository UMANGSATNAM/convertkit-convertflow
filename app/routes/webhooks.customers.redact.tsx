import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

/**
 * Mandatory GDPR: customers/redact
 *
 * Fired when a customer requests that their personal data be deleted from the store.
 * ConvertFlow does not retain end-consumer personal data.
 * Returns 200 OK as required by Shopify App Store compliance.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  console.log(`[GDPR] customers/redact received for shop: ${shop}`, {
    customerId: (payload as any)?.customer?.id,
    ordersToRedact: (payload as any)?.orders_to_redact,
  });

  return new Response("Customer redaction processed", { status: 200 });
};
