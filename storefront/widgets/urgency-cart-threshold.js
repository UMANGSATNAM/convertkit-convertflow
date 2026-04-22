/**
 * ConvertKit — Cart Threshold Progress Bar Widget
 * Shows "Add $X more for free shipping" with live progress bar
 */

const CartThresholdWidget = {
  init(config, analytics) {
    if (!config || !config.amount) return;
    this.threshold = config.amount * 100; // convert to cents
    this.analytics = analytics;
    this.injectStyles();
    this.fetchCart();

    // Listen for cart updates
    document.addEventListener('cart:updated', (e) => {
      if (e.detail) this.update(e.detail.total_price);
    });
  },

  injectStyles() {
    if (document.getElementById('ck-threshold-styles')) return;
    const style = document.createElement('style');
    style.id = 'ck-threshold-styles';
    style.textContent = `
      .ck-threshold{padding:12px 16px;background:var(--ck-bg-alt,#f9fafb);border:1px solid var(--ck-border,#e5e7eb);border-radius:8px;margin:12px 0;font-family:var(--ck-body-font,-apple-system,sans-serif)}
      .ck-threshold__text{font-size:13px;color:var(--ck-text,#111);margin:0 0 8px;text-align:center}
      .ck-threshold__bar-bg{height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden}
      .ck-threshold__bar{height:100%;background:var(--ck-accent,#22c55e);border-radius:4px;transition:width 400ms ease}
      .ck-threshold--complete .ck-threshold__bar{background:#22c55e}
      .ck-threshold--complete .ck-threshold__text{color:#22c55e;font-weight:600}
    `;
    document.head.appendChild(style);
  },

  async fetchCart() {
    try {
      const resp = await fetch('/cart.js');
      if (resp.ok) {
        const cart = await resp.json();
        this.update(cart.total_price);
      }
    } catch (e) { /* silent */ }
  },

  update(totalCents) {
    const remaining = Math.max(0, this.threshold - totalCents);
    const pct = Math.min((totalCents / this.threshold) * 100, 100);
    const isComplete = remaining <= 0;

    if (!this.el) {
      this.el = document.createElement('div');
      this.el.className = 'ck-threshold';

      // Try to insert near the cart or form
      const target = document.querySelector('.cart-drawer, .cart__items, form[action*="/cart"]');
      if (target) {
        target.parentNode.insertBefore(this.el, target);
      } else {
        return; // No good insertion point
      }

      if (this.analytics) {
        this.analytics.track('feature_interact', { feature: 'cart_threshold', action: 'impression' });
      }
    }

    const remainingFormatted = (remaining / 100).toFixed(2);
    this.el.className = `ck-threshold${isComplete ? ' ck-threshold--complete' : ''}`;
    this.el.innerHTML = `
      <p class="ck-threshold__text">${isComplete
        ? 'You qualify for free shipping!'
        : `Add $${remainingFormatted} more for free shipping`
      }</p>
      <div class="ck-threshold__bar-bg">
        <div class="ck-threshold__bar" style="width:${pct}%"></div>
      </div>
    `;
  },
};

export default CartThresholdWidget;
