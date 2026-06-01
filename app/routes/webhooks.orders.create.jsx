import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  const { shop, payload, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

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
