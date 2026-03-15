/**
 * ConvertKit Analytics Tracker
 * Extremely lightweight event tracking for standard ecommerce actions
 */

const ConvertKitAnalytics = {
  endpoint: null,
  sessionId: null,
  shopDomain: null,

  init(config, appUrl) {
    this.shopDomain = window.Shopify?.shop || config.shop;
    if (!this.shopDomain || !appUrl) return;

    this.endpoint = `${appUrl}/api/analytics`;

    // Generate or retrieve session ID
    this.sessionId = sessionStorage.getItem('ck_session_id');
    if (!this.sessionId) {
      this.sessionId = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('ck_session_id', this.sessionId);
    }

    this.trackPageview();
    this.bindAddToCart();
  },

  trackEvent(eventType, value = null, featureName = null) {
    if (!this.shopDomain || !this.endpoint) return;

    // Fire and forget, don't block the main thread
    fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      keepalive: true, 
      body: JSON.stringify({
        shop: this.shopDomain,
        eventType,
        value,
        featureName,
        sessionId: this.sessionId
      })
    }).catch(e => {
        // Silently fail
    });
  },

  trackPageview() {
    this.trackEvent('pageview', null, window.location.pathname);
  },

  bindAddToCart() {
    // Intercept standard Shopify 'add to cart' forms
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.getAttribute('action') && form.getAttribute('action').includes('/cart/add')) {
        let price = null;
        const priceMeta = document.querySelector('meta[property="product:price:amount"]');
        if (priceMeta) price = parseFloat(priceMeta.getAttribute('content'));
        this.trackEvent('add_to_cart', price, null);
      }
    });

    // Handle AJAX fetches
    const originalFetch = window.fetch;
    const self = this;
    window.fetch = function() {
      let isCartAdd = false;
      if (arguments[0] && typeof arguments[0] === 'string' && arguments[0].includes('/cart/add.js')) {
          isCartAdd = true;
      } else if (arguments[0] && arguments[0].url && arguments[0].url.includes('/cart/add.js')) {
          isCartAdd = true;
      }
      
      if (isCartAdd) {
        self.trackEvent('add_to_cart', null, 'ajax');
      }
      return originalFetch.apply(this, arguments);
    };
  }
};

export default ConvertKitAnalytics;
