import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { calculateOrderProfit } from "../services/profit.server";

export const action = async ({ request }) => {
  const { shop, payload, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Fetch merchant to calculate order profit asynchronously
  const merchant = await prisma.merchant.findUnique({
    where: { shopDomain: shop }
  });

  if (merchant && payload.id) {
    // We do not await this, so we can respond to the webhook quickly
    const sellingPrice = parseFloat(payload.total_price || payload.current_total_price || 0);
    calculateOrderProfit(BigInt(payload.id), sellingPrice, merchant)
      .then(() => console.log(`Profit calculated for order ${payload.id}`))
      .catch(e => console.error(`Failed to calculate profit for order ${payload.id}`, e));
  }

  const checkoutToken = payload.checkout_token;
  
  if (!checkoutToken) return new Response();

  // Find if there's an abandoned cart for this checkout
  const cart = await prisma.abandonedCart.findUnique({
    where: { shopifyCheckoutToken: checkoutToken }
  });

  if (cart) {
    // Mark as recovered
    await prisma.abandonedCart.update({
      where: { id: cart.id },
      data: {
        recovered: true,
        recoveredOrderId: BigInt(payload.id)
      }
    });
    
    // Note: In a production app, we would also remove any pending BullMQ jobs for this cart here.
    // That requires iterating over delayed jobs in BullMQ and removing those with matching data.cartId.
  }

  return new Response();
};
