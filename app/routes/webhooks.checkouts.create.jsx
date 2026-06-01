import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { whatsappQueue } from "../lib/queue.server";

export const action = async ({ request }) => {
  const { shop, payload, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Find merchant
  const merchant = await prisma.merchant.findUnique({
    where: { shopDomain: shop }
  });

  if (!merchant) return new Response();

  const checkoutToken = payload.token;
  const customerEmail = payload.email || payload.customer?.email;
  const customerPhone = payload.phone || payload.customer?.phone || payload.shipping_address?.phone || payload.billing_address?.phone;
  const cartTotal = payload.total_price;
  
  if (!customerPhone) {
    // We need a phone number to send WhatsApp
    return new Response();
  }

  // Create or update Abandoned Cart
  const cart = await prisma.abandonedCart.upsert({
    where: { shopifyCheckoutToken: checkoutToken },
    create: {
      merchantId: merchant.id,
      shopifyCheckoutToken: checkoutToken,
      customerEmail,
      customerPhone,
      cartTotal,
      cartItems: payload.line_items || [],
      abandonedAt: new Date(payload.created_at || new Date()),
      recoveryStage: 0,
      recovered: false
    },
    update: {
      cartTotal,
      cartItems: payload.line_items || [],
    }
  });

  // Enqueue WhatsApp Job (Stage 1) with 15 mins delay
  // But only if stage is 0 (haven't sent stage 1 yet)
  if (cart.recoveryStage === 0) {
    await whatsappQueue.add(
      "abandoned_cart_recovery",
      { cartId: cart.id, stage: 1 },
      { delay: 15 * 60 * 1000 } // 15 minutes
    );
  }

  return new Response();
};
