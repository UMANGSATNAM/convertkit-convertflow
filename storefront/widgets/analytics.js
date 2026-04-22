/**
 * ConvertKit Analytics — Event Tracking with sendBeacon
 * Queues events and flushes via navigator.sendBeacon for reliability.
 * Tracks: page_view, feature_impression, feature_interact, cart_add, purchase
 */

const ConvertKitAnalytics = {
  endpoint: null,
  sessionId: null,
  shopDomain: null,
  queue: [],
  flushTimer: null,

  init(config, appUrl) {
    this.shopDomain = window.Shopify?.shop || config.shop;
    if (!this.shopDomain || !appUrl) return;

    this.endpoint = `${appUrl}/api/analytics`;

    // Generate or retrieve session ID
    this.sessionId = sessionStorage.getItem('ck_session_id');
    if (!this.sessionId) {
      this.sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('ck_session_id', this.sessionId);
    }

    // Track page view
    this.trackEvent('page_view', null, window.location.pathname);

    // Bind form-based add-to-cart detection
    this.bindAddToCart();

    // Bind purchase detection on thank-you pages
    this.bindPurchase();

    // Flush queue periodically
    this.flushTimer = setInterval(() => this.flush(), 30000);

    // Flush on page hide (tab close, navigation)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this.flush();
    });
  },

  /**
   * Track an event. Queued and sent in batches.
   * @param {string} eventType - page_view | feature_impression | feature_interact | cart_add | purchase
   * @param {number|null} value - monetary value in dollars (e.g. 29.99)
   * @param {string|null} featureName - which feature triggered this
   */
  trackEvent(eventType, value, featureName) {
    if (!this.shopDomain || !this.endpoint) return;

    this.queue.push({
      eventType,
      value: value != null ? Number(value) : null,
      featureName: featureName || null,
      sessionId: this.sessionId,
      shopDomain: this.shopDomain,
      pageUrl: window.location.pathname,
      timestamp: Date.now(),
    });

    // Auto-flush if queue gets large
    if (this.queue.length >= 10) {
      this.flush();
    }
  },

  /**
   * Alias for backward compatibility
   */
  track(eventType, data) {
    this.trackEvent(
      eventType,
      data?.price ? data.price / 100 : data?.value || null,
      data?.feature || data?.action || null
    );
  },

  /**
   * Flush event queue to server using sendBeacon (non-blocking)
   */
  flush() {
    if (!this.queue.length || !this.endpoint) return;

    const payload = JSON.stringify(this.queue.splice(0));

    // Use sendBeacon for reliability (works even during page unload)
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(this.endpoint, blob);
    } else {
      // Fallback to fetch with keepalive
      fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => { /* silent */ });
    }
  },

  /**
   * Observe ConvertKit widgets entering the viewport for impression tracking
   */
  observeImpressions() {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const feature = entry.target.dataset.ckFeature;
            if (feature) {
              this.trackEvent('feature_impression', null, feature);
              observer.unobserve(entry.target);
            }
          }
        }
      },
      { threshold: 0.5 }
    );

    // Observe all ConvertKit feature elements
    document.querySelectorAll('[data-ck-feature]').forEach(el => observer.observe(el));
  },

  bindAddToCart() {
    // Intercept form-based cart adds
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.getAttribute('action')?.includes('/cart/add')) {
        let price = null;
        const priceMeta = document.querySelector('meta[property="product:price:amount"]');
        if (priceMeta) price = parseFloat(priceMeta.getAttribute('content'));
        this.trackEvent('cart_add', price, null);
      }
    });

    // Intercept AJAX fetch-based cart adds
    const originalFetch = window.fetch;
    const self = this;
    window.fetch = function (...args) {
      const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
      if (url && url.includes('/cart/add')) {
        self.trackEvent('cart_add', null, 'ajax');
      }
      return originalFetch.apply(this, args);
    };
  },

  bindPurchase() {
    // Detect Shopify thank-you / order confirmation page
    if (window.Shopify?.checkout) {
      const checkout = window.Shopify.checkout;
      this.trackEvent('purchase', checkout.total_price ? parseFloat(checkout.total_price) : null, 'checkout');
    }

    // Also check URL pattern for /checkouts/*/thank_you
    if (window.location.pathname.includes('/thank_you') || window.location.pathname.includes('/orders/')) {
      // Use Shopify's order data if available
      const orderValue = window.Shopify?.checkout?.total_price;
      if (orderValue) {
        this.trackEvent('purchase', parseFloat(orderValue), 'order_status');
      }
    }
  },
};

export default ConvertKitAnalytics;
