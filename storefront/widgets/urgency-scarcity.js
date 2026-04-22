/**
 * ConvertKit — Inventory Scarcity Counter Widget
 * Shows "Only X left in stock" with color-coded progress bar.
 * Uses REAL Shopify inventory via product.js endpoint.
 * Updates dynamically when variant changes.
 */

import scarcityCSS from './urgency-scarcity.css';

function injectStyles() {
  if (document.getElementById('ck-scarcity-styles')) return;
  const style = document.createElement('style');
  style.id = 'ck-scarcity-styles';
  style.textContent = scarcityCSS;
  document.head.appendChild(style);
}

const ScarcityWidget = {
  productData: null,
  threshold: 10,
  analytics: null,
  el: null,

  init(config, analytics) {
    if (!config || !config.threshold) return;
    this.threshold = config.threshold;
    this.analytics = analytics;

    const path = window.location.pathname;
    if (!path.includes('/products/')) return;

    injectStyles();
    this.fetchAndRender();
    this.listenForVariantChanges();
  },

  async fetchAndRender() {
    const path = window.location.pathname;
    try {
      const resp = await fetch(path + '.js');
      if (!resp.ok) return;
      this.productData = await resp.json();

      // Get initial variant from URL or first available
      const params = new URLSearchParams(window.location.search);
      const variantId = parseInt(params.get('variant'), 10);
      const variant = variantId
        ? this.productData.variants.find(v => v.id === variantId)
        : this.productData.variants.find(v => v.available) || this.productData.variants[0];

      if (variant) this.renderForVariant(variant);
    } catch (e) { /* silent — never break merchant page */ }
  },

  renderForVariant(variant) {
    // Only show for inventory-tracked variants
    if (!variant.inventory_management) {
      this.removeEl();
      return;
    }

    // Shopify's .js endpoint exposes inventory_quantity when
    // "Track quantity" is on. If it's null/undefined, we bail.
    const qty = variant.inventory_quantity;
    if (qty == null || qty > this.threshold) {
      this.removeEl();
      return;
    }

    if (qty <= 0) {
      // Show "Sold out" state
      this.renderBar(0, 'Sold Out', '#DC2626');
      return;
    }

    const color = qty <= 5 ? '#DC2626' : qty <= 10 ? '#D97706' : '#059669';
    this.renderBar(qty, `Only <strong>${qty}</strong> left in stock`, color);

    if (this.analytics) {
      this.analytics.trackEvent('feature_impression', null, 'urgency_scarcity');
    }
  },

  renderBar(qty, text, color) {
    const pct = Math.min((qty / this.threshold) * 100, 100);

    if (!this.el) {
      this.el = document.createElement('div');
      this.el.className = 'ck-scarcity';
      this.el.dataset.ckFeature = 'urgency_scarcity';

      // Insert near the ATC button
      const form = document.querySelector('form[action*="/cart/add"]');
      if (form) {
        form.parentNode.insertBefore(this.el, form);
      } else {
        return;
      }
    }

    this.el.innerHTML = `
      <p class="ck-scarcity__text">${text}</p>
      <div class="ck-scarcity__bar-bg">
        <div class="ck-scarcity__bar" style="width:${pct}%;background:${color}"></div>
      </div>
    `;
  },

  removeEl() {
    if (this.el) {
      this.el.remove();
      this.el = null;
    }
  },

  listenForVariantChanges() {
    // Listen for standard form changes
    const form = document.querySelector('form[action*="/cart/add"]');
    if (form) {
      form.addEventListener('change', () => {
        const idInput = form.querySelector('[name="id"]');
        if (idInput && this.productData) {
          const variantId = parseInt(idInput.value, 10);
          const variant = this.productData.variants.find(v => v.id === variantId);
          if (variant) this.renderForVariant(variant);
        }
      });
    }

    // Listen for URL-based variant changes
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        const params = new URLSearchParams(window.location.search);
        const variantId = parseInt(params.get('variant'), 10);
        if (variantId && this.productData) {
          const variant = this.productData.variants.find(v => v.id === variantId);
          if (variant) this.renderForVariant(variant);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Listen for custom variant:change events from sticky cart
    document.addEventListener('variant:change', (e) => {
      const variantId = e.detail?.variantId;
      if (variantId && this.productData) {
        const variant = this.productData.variants.find(v => v.id === variantId);
        if (variant) this.renderForVariant(variant);
      }
    });
  },
};

export default ScarcityWidget;
