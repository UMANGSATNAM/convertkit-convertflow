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
import ConvertKitAnalytics from './widgets/analytics.js';
import UpsellIncartWidget from './widgets/upsell-incart.js';

(function () {
  'use strict';

  let config = window.__CONVERTKIT_CONFIG__ || {};
  const widgets = {};

  async function loadConfig() {
    if (!config.shop && window.Shopify?.shop) {
      config.shop = window.Shopify.shop;
    }

    if (config.shop && !config._fetched) {
      try {
        const scriptTag = document.currentScript || document.querySelector('script[src*="convertkit-widget"]');
        const appUrl = scriptTag ? scriptTag.src.split('/convertkit-widget')[0] : '';
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

    const scriptTag = document.currentScript || document.querySelector('script[src*="convertkit-widget"]');
    const appUrl = scriptTag ? scriptTag.src.split('/convertkit-widget')[0] : '';

    // Initialize Analytics Tracker
    ConvertKitAnalytics.init(config, appUrl);
    const analytics = ConvertKitAnalytics;

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

    // ── Upsell Engine ──
    const upsell = config.upsell || {};
    if (upsell.isActive) {
      widgets.upsellIncart = UpsellIncartWidget;
      UpsellIncartWidget.init(upsell, analytics);
    }

    // ── Observe feature impressions for analytics ──
    requestAnimationFrame(() => {
      ConvertKitAnalytics.observeImpressions();
    });
  }

  // ── Initialize when DOM is ready ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidgets);
  } else {
    initWidgets();
  }

  // ── Expose global API ──
  window.__CONVERTKIT__ = {
    analytics: ConvertKitAnalytics,
    widgets,
    version: '1.0.0',
  };

  // ── ConvertKit event bus ──
  window.ConvertKit = {
    config,
    events: new EventTarget(),
    emit(event, data) {
      this.events.dispatchEvent(new CustomEvent(event, { detail: data }));
    },
  };
})();
