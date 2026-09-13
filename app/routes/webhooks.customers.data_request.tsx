import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

/**
 * Mandatory GDPR: customers/data_request
 *
 * Fired when a store owner or customer requests a copy of the customer's data.
 * ConvertFlow does not store personal customer records outside of the merchant's theme settings.
 * Shopify requires returning a 200 response to acknowledge receipt.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  console.log(`[GDPR] customers/data_request received for shop: ${shop}`, {
    customerId: (payload as any)?.customer?.id,
    email: (payload as any)?.customer?.email,
  });

  // ConvertFlow stores no customer PII. If custom user data exists, package and fulfill here.
  return new Response("Customer data request received", { status: 200 });
};
