import { register } from "@shopify/web-pixels-extension";

register(({ analytics, init }) => {
  // Use the host to determine the absolute endpoint or fallback
  const appEndpoint = `https://storeforge.localhost/api/tracking`;

  // Helper to send data
  const sendEvent = async (eventName: string, eventData: any) => {
    try {
      await fetch(appEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop: init.context.document.location.hostname,
          event_name: eventName,
          event_data: eventData
        }),
        keepalive: true
      });
    } catch (err) {
      console.warn("Failed to send tracking event", err);
    }
  };

  analytics.subscribe('page_viewed', (event) => {
    sendEvent('page_viewed', { url: event.context.document.location.href });
  });

  analytics.subscribe('product_viewed', (event) => {
    sendEvent('product_viewed', { 
      productId: event.data?.productVariant?.product?.id,
      variantId: event.data?.productVariant?.id
    });
  });

  analytics.subscribe('cart_viewed', (event) => {
    sendEvent('cart_viewed', { 
      cartId: event.data?.cart?.id,
      cost: event.data?.cart?.cost?.totalAmount?.amount
    });
  });

  analytics.subscribe('checkout_started', (event) => {
    sendEvent('checkout_started', { 
      checkoutId: event.data?.checkout?.token,
      cost: event.data?.checkout?.subtotalPrice?.amount
    });
  });
});
