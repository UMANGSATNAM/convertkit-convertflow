/**
 * ConvertKit In-Cart Upsell Widget
 * Intercepts add-to-cart on trigger product and offers a 1-click bundle.
 */

import cssString from './upsell-incart.css';

const UpsellIncart = {
  init(config, analytics) {
    if (!config || !config.isActive || !config.triggerHandle || !config.offerHandle) return;

    this.config = config;
    this.analytics = analytics;
    
    // In MVP, we only trigger on the actual product page of the trigger product
    if (!window.location.pathname.includes(`/products/${this.config.triggerHandle}`)) {
      return;
    }

    this.injectStyles();
    this.bindForms();
  },

  injectStyles() {
    if (document.getElementById('ck-upsell-styles')) return;
    const style = document.createElement('style');
    style.id = 'ck-upsell-styles';
    style.textContent = cssString;
    document.head.appendChild(style);
  },

  bindForms() {
    document.addEventListener('submit', (e) => {
      const form = e.target;
      const action = form.getAttribute('action');
      if (action && action.includes('/cart/add')) {
        // Only intercept if we haven't already accepted/declined the upsell for this specific click
        if (form.dataset.upsellHandled) return;

        e.preventDefault();
        this.fetchOfferAndShowModal(form);
      }
    });

    // Handle AJAX fetch /cart/add.js that might bypass form submit in some themes
    // For simplicity and safety across millions of custom themes, we focus on the form submit interception first.
    // If a theme relies purely on fetch without a submit event, they might bypass the modal.
  },

  async fetchOfferAndShowModal(originalForm) {
    try {
      const resp = await fetch(`/products/${this.config.offerHandle}.js`);
      if (!resp.ok) {
        // If offer product is missing, just submit original form
        return this.continueOriginalSubmit(originalForm);
      }
      
      const offerProduct = await resp.json();
      this.showModal(originalForm, offerProduct);
      
      if (this.analytics) {
        this.analytics.trackEvent('feature_interact', null, 'upsell_modal_view');
      }
    } catch (err) {
      this.continueOriginalSubmit(originalForm);
    }
  },

  showModal(originalForm, offerProduct) {
    const overlay = document.createElement('div');
    overlay.className = 'ck-upsell-overlay';
    
    const price = (offerProduct.price / 100).toFixed(2);
    const image = offerProduct.images && offerProduct.images[0] ? offerProduct.images[0] : '';
    const variantId = offerProduct.variants[0].id;

    overlay.innerHTML = `
      <div class="ck-upsell-modal">
        <div class="ck-upsell-header">
          <h3>\${this.config.title}</h3>
          <span class="ck-badge">\${this.config.discountText}</span>
        </div>
        <div class="ck-upsell-body">
          \${image ? \`<img src="\${image}" alt="Offer" />\` : ''}
          <div class="ck-upsell-details">
            <h4>\${offerProduct.title}</h4>
            <p>\$\${price}</p>
          </div>
        </div>
        <div class="ck-upsell-actions">
          <button class="ck-btn-primary" id="ck-upsell-accept">Add Both to Cart</button>
          <button class="ck-btn-secondary" id="ck-upsell-decline">No thanks, just add my item</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('ck-upsell-accept').addEventListener('click', () => {
      this.acceptUpsell(originalForm, variantId);
    });

    document.getElementById('ck-upsell-decline').addEventListener('click', () => {
      document.body.removeChild(overlay);
      this.continueOriginalSubmit(originalForm);
    });
  },

  async acceptUpsell(originalForm, offerVariantId) {
    // 1. Get the original variant ID from the form
    const formData = new FormData(originalForm);
    const originalVariantId = formData.get('id');
    const originalQty = formData.get('quantity') || 1;

    // 2. Add both via AJAX
    try {
      await fetch(window.Shopify?.routes?.root + 'cart/add.js' || '/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            { id: originalVariantId, quantity: parseInt(originalQty) },
            { id: offerVariantId, quantity: 1 }
          ]
        })
      });

      if (this.analytics) {
        this.analytics.trackEvent('feature_interact', null, 'upsell_accepted');
      }

      // 3. Redirect to cart or let theme handle it by reloading
      window.location.href = '/cart';
    } catch (e) {
      this.continueOriginalSubmit(originalForm);
    }
  },

  continueOriginalSubmit(form) {
    // Mark as handled so we don't infinitely loop if the theme intercepts the programmatic submit
    form.dataset.upsellHandled = "true";
    form.submit();
  }
};

export default UpsellIncart;
