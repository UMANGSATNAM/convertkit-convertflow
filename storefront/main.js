/**
 * ConvertKit Storefront Widget Loader
 * Entry point for all storefront widgets.
 * Conditionally loads widgets based on config from the server.
 * Target: < 40kb gzipped total bundle.
 */

import StickyCart from './widgets/sticky-cart.js';
import ScarcityWidget from './widgets/urgency-scarcity.js';
import CountdownWidget from './widgets/urgency-countdown.js';
import BuyerNotificationWidget from './widgets/urgency-buyer-notification.js';
import CartThresholdWidget from './widgets/urgency-cart-threshold.js';
import OfferBannerWidget from './widgets/urgency-offer-banner.js';

(function () {
  'use strict';

  // Config injected by the script tag query params or fetched from server
  let config = window.__CONVERTKIT_CONFIG__ || {};

  // ── Analytics Event Tracker Stub ──
  const analytics = {
    _queue: [],
    track(eventType, data) {
      this._queue.push({ eventType, data, ts: Date.now() });
      if (this._queue.length >= 50) {
        this.flush();
      }
    },
    flush() {
      if (this._queue.length === 0) return;
      const payload = this._queue.splice(0, 50);
      if (config.analyticsEndpoint) {
        navigator.sendBeacon(
          config.analyticsEndpoint,
          JSON.stringify(payload)
        );
      }
    },
  };

  window.addEventListener('beforeunload', () => analytics.flush());

  // ── Widget Registry ──
  const widgets = {};

  // ── Fetch config from server if not inline ──
  async function loadConfig() {
    if (!config.shop && window.Shopify?.shop) {
      config.shop = window.Shopify.shop;
    }

    if (config.shop && !config._fetched) {
      try {
        const appUrl = document.currentScript?.src?.split('/convertkit-widget')[0] || '';
        const resp = await fetch(`${appUrl}/api/storefront-config?shop=${config.shop}`);
        if (resp.ok) {
          const serverConfig = await resp.json();
          config = { ...config, ...serverConfig, _fetched: true };
        }
      } catch (e) { /* use defaults */ }
    }

    return config;
  }

  async function initWidgets() {
    config = await loadConfig();

    // ── Sticky Add to Cart ──
    if (config.stickyCart !== false) {
      const isProductPage =
        window.location.pathname.includes('/products/') &&
        !window.location.pathname.includes('/collections/');

      if (isProductPage) {
        widgets.stickyCart = StickyCart;
        StickyCart.init(config.stickyCartOptions || {}, analytics);
      }
    }

    // ── Urgency Widgets ──
    const urgency = config.urgency || {};

    if (urgency.scarcity) {
      widgets.scarcity = ScarcityWidget;
      ScarcityWidget.init(urgency.scarcity, analytics);
    }

    if (urgency.countdown) {
      widgets.countdown = CountdownWidget;
      CountdownWidget.init(urgency.countdown, analytics);
    }

    if (urgency.buyer) {
      widgets.buyerNotification = BuyerNotificationWidget;
      BuyerNotificationWidget.init(urgency.buyer, analytics);
    }

    if (urgency.threshold) {
      widgets.cartThreshold = CartThresholdWidget;
      CartThresholdWidget.init(urgency.threshold, analytics);
    }

    if (urgency.banner) {
      widgets.offerBanner = OfferBannerWidget;
      OfferBannerWidget.init(urgency.banner, analytics);
    }
  }

  // ── Initialize when DOM is ready ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidgets);
  } else {
    initWidgets();
  }

  // ── Expose API ──
  window.__CONVERTKIT__ = {
    analytics,
    widgets,
    version: '1.0.0',
  };
})();
