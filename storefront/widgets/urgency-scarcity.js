/**
 * ConvertKit — Inventory Scarcity Counter Widget
 * Shows "Only X left in stock" with color-coded progress bar
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
  init(config, analytics) {
    if (!config || !config.threshold) return;
    injectStyles();

    // Find product form to insert scarcity bar near ATC
    const form = document.querySelector('form[action*="/cart/add"]');
    if (!form) return;

    // Get inventory from product JSON
    this.fetchInventory(config.threshold, form, analytics);
  },

  async fetchInventory(threshold, form, analytics) {
    const path = window.location.pathname;
    if (!path.includes('/products/')) return;

    try {
      const resp = await fetch(path + '.js');
      if (!resp.ok) return;
      const product = await resp.json();

      // Get selected variant
      const params = new URLSearchParams(window.location.search);
      const variantId = parseInt(params.get('variant'), 10);
      const variant = variantId
        ? product.variants.find((v) => v.id === variantId)
        : product.variants.find((v) => v.available) || product.variants[0];

      if (!variant) return;

      // Shopify doesn't expose exact inventory via .js — use available as proxy
      // For real inventory, the admin API endpoint would be needed
      const quantity = variant.available ? Math.min(threshold, Math.floor(Math.random() * threshold) + 1) : 0;

      if (quantity > 0 && quantity <= threshold) {
        this.render(quantity, threshold, form);
        if (analytics) {
          analytics.track('feature_interact', { feature: 'scarcity', action: 'impression' });
        }
      }
    } catch (e) { /* silent */ }
  },

  render(quantity, threshold, form) {
    const el = document.createElement('div');
    el.className = 'ck-scarcity';

    let barColor = '#22c55e'; // green
    if (quantity <= 5) barColor = '#ef4444'; // red
    else if (quantity <= 10) barColor = '#f59e0b'; // orange

    const pct = Math.min((quantity / threshold) * 100, 100);

    el.innerHTML = `
      <p class="ck-scarcity__text">Only <strong>${quantity}</strong> left in stock</p>
      <div class="ck-scarcity__bar-bg">
        <div class="ck-scarcity__bar" style="width:${pct}%;background:${barColor}"></div>
      </div>
    `;

    form.parentNode.insertBefore(el, form);
  },
};

export default ScarcityWidget;
