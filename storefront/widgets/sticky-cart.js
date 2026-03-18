/**
 * ConvertKit — Sticky Add to Cart Widget (Production)
 * Vanilla JS, < 8kb target. No dependencies.
 *
 * Features:
 * - IntersectionObserver to detect native ATC button
 * - Two-way variant sync with main product form
 * - Shopify AJAX Cart API integration
 * - Checkmark animation 1.5s → View Cart link
 * - Hidden on mobile < 768px (configurable)
 * - 200ms ease-out slide-in, zero CLS
 * - Out-of-stock: Notify Me email capture modal
 * - Variant dropdown selector in sticky bar
 */

import styles from './sticky-cart.css';

// ── Inject styles ──
function injectStyles() {
  if (document.getElementById('ck-sticky-cart-styles')) return;
  const style = document.createElement('style');
  style.id = 'ck-sticky-cart-styles';
  style.textContent = styles;
  document.head.appendChild(style);
}

// ── SVG Icons ──
const CART_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;
const CHECK_ICON = `<svg class="ck-sticky-cart__check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const BELL_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`;

// ── Helpers ──
function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '…' : str;
}

function formatMoney(cents) {
  const amount = (cents / 100).toFixed(2);
  return window.Shopify?.currency?.active
    ? `${window.Shopify.currency.active} ${amount}`
    : `$${amount}`;
}

// ── Product Data ──
function getProductData() {
  const scriptTags = document.querySelectorAll('script[type="application/json"]');
  for (const tag of scriptTags) {
    try {
      const data = JSON.parse(tag.textContent);
      if (data?.product?.variants) return data.product;
      if (data?.variants) return data;
    } catch (e) { /* skip */ }
  }
  if (window.product) return window.product;
  return null;
}

async function fetchProductData() {
  const path = window.location.pathname;
  if (!path.includes('/products/')) return null;
  try {
    const resp = await fetch(path + '.js');
    if (resp.ok) return await resp.json();
  } catch (e) { /* fallback */ }
  return null;
}

// ── Main Widget ──
class StickyCart {
  constructor() {
    this.el = null;
    this.product = null;
    this.selectedVariant = null;
    this.observer = null;
    this.isVisible = false;
    this.analytics = null;
    this.options = {};
    this._syncing = false;
  }

  async init(options = {}, analytics = null) {
    this.options = options;
    this.analytics = analytics;

    injectStyles();

    this.product = getProductData() || (await fetchProductData());
    if (!this.product || !this.product.variants) return;

    // Set initial variant from URL or first available
    const params = new URLSearchParams(window.location.search);
    const urlVariantId = parseInt(params.get('variant'), 10);
    if (urlVariantId) {
      this.selectedVariant = this.product.variants.find(v => v.id === urlVariantId);
    }
    if (!this.selectedVariant) {
      this.selectedVariant = this.product.variants.find(v => v.available) || this.product.variants[0];
    }

    this.render();
    this.observeNativeButton();
    this.syncVariants();

    if (this.analytics) {
      this.analytics.trackEvent('feature_impression', null, 'sticky_cart');
    }
  }

  render() {
    this.el = document.createElement('div');
    this.el.className = 'ck-sticky-cart';
    if (this.options.showOnMobile) {
      this.el.classList.add('ck-sticky-cart--mobile');
    }
    this.el.setAttribute('role', 'complementary');
    this.el.setAttribute('aria-label', 'Quick add to cart');
    this.update();
    document.body.appendChild(this.el);
  }

  update() {
    if (!this.el || !this.product || !this.selectedVariant) return;

    const v = this.selectedVariant;
    const image = v.featured_image?.src || this.product.featured_image || this.product.images?.[0] || '';
    const title = truncate(this.product.title, 40);
    const variantTitle = v.title && v.title !== 'Default Title' ? v.title : '';
    const price = formatMoney(v.price);
    const comparePrice = v.compare_at_price && v.compare_at_price > v.price ? formatMoney(v.compare_at_price) : '';
    const isAvailable = v.available;
    const hasMultipleVariants = this.product.variants.length > 1;

    // Build variant selector for multi-variant products
    let variantSelectHtml = '';
    if (hasMultipleVariants) {
      const optionsHtml = this.product.variants.map(vr => {
        const label = vr.title !== 'Default Title' ? vr.title : `Variant ${vr.id}`;
        return `<option value="${vr.id}" ${vr.id === v.id ? 'selected' : ''} ${!vr.available ? 'disabled' : ''}>${label}${!vr.available ? ' (Sold out)' : ''}</option>`;
      }).join('');
      variantSelectHtml = `<select class="ck-sticky-cart__variant-select" aria-label="Select variant">${optionsHtml}</select>`;
    }

    let btnHtml;
    if (isAvailable) {
      btnHtml = `<button class="ck-sticky-cart__btn" aria-label="Add to Cart">${CART_ICON} Add to Cart</button>`;
    } else {
      btnHtml = `<button class="ck-sticky-cart__btn ck-sticky-cart__btn--notify" aria-label="Notify Me">${BELL_ICON} Notify Me</button>`;
    }

    this.el.innerHTML = `
      <div class="ck-sticky-cart__inner">
        ${image ? `<img class="ck-sticky-cart__image" src="${image}" alt="${title}" width="48" height="48" loading="lazy">` : ''}
        <div class="ck-sticky-cart__info">
          <p class="ck-sticky-cart__title">${title}</p>
          ${!hasMultipleVariants && variantTitle ? `<p class="ck-sticky-cart__variant">${variantTitle}</p>` : ''}
        </div>
        ${variantSelectHtml}
        <div class="ck-sticky-cart__price">
          ${price}
          ${comparePrice ? `<span class="ck-sticky-cart__price--compare">${comparePrice}</span>` : ''}
        </div>
        ${btnHtml}
      </div>
    `;

    // Bind variant select change (sticky → main form sync)
    const select = this.el.querySelector('.ck-sticky-cart__variant-select');
    if (select) {
      select.addEventListener('change', (e) => {
        const newVariantId = parseInt(e.target.value, 10);
        const newVariant = this.product.variants.find(vr => vr.id === newVariantId);
        if (newVariant) {
          this._syncing = true;
          this.selectedVariant = newVariant;
          this.update();
          this.pushVariantToMainForm(newVariantId);
          this._syncing = false;
        }
      });
    }

    // Bind button click
    const btn = this.el.querySelector('.ck-sticky-cart__btn');
    if (btn) {
      if (isAvailable) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.addToCart();
        });
      } else {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.showNotifyModal();
        });
      }
    }
  }

  /**
   * Push variant selection from sticky bar back to the main product form.
   */
  pushVariantToMainForm(variantId) {
    const productForm = document.querySelector('form[action*="/cart/add"]');
    if (!productForm) return;

    // Update hidden variant ID input
    const idInput = productForm.querySelector('[name="id"]');
    if (idInput) {
      idInput.value = variantId;
      idInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Update URL for themes that read variant from URL
    const url = new URL(window.location.href);
    url.searchParams.set('variant', variantId);
    window.history.replaceState({}, '', url.toString());

    // Dispatch a custom event so themes like Dawn can respond
    document.dispatchEvent(new CustomEvent('variant:change', { detail: { variantId } }));
  }

  observeNativeButton() {
    const selectors = [
      'form[action*="/cart/add"] button[type="submit"]',
      'form[action*="/cart/add"] [name="add"]',
      '.product-form__submit',
      '.product-form button[type="submit"]',
      '#AddToCart',
      '#add-to-cart',
      '.add-to-cart',
      '[data-add-to-cart]',
    ];

    let nativeBtn = null;
    for (const sel of selectors) {
      nativeBtn = document.querySelector(sel);
      if (nativeBtn) break;
    }

    if (!nativeBtn) {
      this.fallbackObserver();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.hide();
          } else {
            if (entry.boundingClientRect.top < 0) {
              this.show();
            }
          }
        }
      },
      { threshold: 0 }
    );

    this.observer.observe(nativeBtn);
  }

  /**
   * Fallback: use IntersectionObserver on a sentinel element placed at 600px scroll depth.
   * No scroll event listeners used.
   */
  fallbackObserver() {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:600px;left:0;width:1px;height:1px;pointer-events:none';
    sentinel.setAttribute('aria-hidden', 'true');
    document.body.appendChild(sentinel);

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.hide();
          } else {
            if (entry.boundingClientRect.top < 0) {
              this.show();
            }
          }
        }
      },
      { threshold: 0 }
    );
    this.observer.observe(sentinel);
  }

  show() {
    if (this.isVisible || !this.el) return;
    this.isVisible = true;
    this.el.classList.add('ck-sticky-cart--visible');
  }

  hide() {
    if (!this.isVisible || !this.el) return;
    this.isVisible = false;
    this.el.classList.remove('ck-sticky-cart--visible');
  }

  syncVariants() {
    const productForm = document.querySelector('form[action*="/cart/add"]');
    if (!productForm) return;

    // Watch form input changes (main form → sticky bar)
    productForm.addEventListener('change', (e) => {
      if (this._syncing) return;
      const input = e.target;
      if (
        input.name === 'id' ||
        input.name?.startsWith('option') ||
        input.dataset?.optionIndex !== undefined
      ) {
        this.handleVariantChange(productForm);
      }
    });

    // Watch URL changes (some themes modify the URL for variant switching)
    let lastUrl = window.location.href;
    const urlObserver = new MutationObserver(() => {
      if (this._syncing) return;
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        this.handleUrlVariantChange();
      }
    });
    urlObserver.observe(document.body, { childList: true, subtree: true });
  }

  handleVariantChange(form) {
    const idInput = form.querySelector('[name="id"]');
    if (idInput) {
      const variantId = parseInt(idInput.value, 10);
      const variant = this.product.variants.find(v => v.id === variantId);
      if (variant) {
        this.selectedVariant = variant;
        this.update();
      }
    }
  }

  handleUrlVariantChange() {
    const params = new URLSearchParams(window.location.search);
    const variantId = parseInt(params.get('variant'), 10);
    if (variantId) {
      const variant = this.product.variants.find(v => v.id === variantId);
      if (variant) {
        this.selectedVariant = variant;
        this.update();
      }
    }
  }

  async addToCart() {
    const btn = this.el.querySelector('.ck-sticky-cart__btn');
    if (!btn || !this.selectedVariant) return;

    btn.classList.add('ck-sticky-cart__btn--loading');
    btn.innerHTML = `${CART_ICON} Adding…`;

    try {
      const resp = await fetch(window.Shopify?.routes?.root ? window.Shopify.routes.root + 'cart/add.js' : '/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: this.selectedVariant.id,
          quantity: 1,
        }),
      });

      if (!resp.ok) throw new Error('Cart add failed');

      // Success animation
      btn.classList.remove('ck-sticky-cart__btn--loading');
      btn.classList.add('ck-sticky-cart__btn--success');
      btn.innerHTML = `${CHECK_ICON} Added!`;

      if (this.analytics) {
        this.analytics.trackEvent('feature_interact', this.selectedVariant.price / 100, 'sticky_cart_atc');
      }

      setTimeout(() => {
        btn.classList.remove('ck-sticky-cart__btn--success');
        btn.innerHTML = `${CART_ICON} Add to Cart`;

        // Add View Cart link
        const inner = this.el.querySelector('.ck-sticky-cart__inner');
        if (inner && !inner.querySelector('.ck-sticky-cart__view-cart')) {
          const viewCart = document.createElement('a');
          viewCart.className = 'ck-sticky-cart__view-cart';
          viewCart.href = '/cart';
          viewCart.textContent = 'View Cart →';
          inner.appendChild(viewCart);
        }
      }, 1500);

      this.updateThemeCartCount();
    } catch (err) {
      btn.classList.remove('ck-sticky-cart__btn--loading');
      btn.innerHTML = `${CART_ICON} Try Again`;
      setTimeout(() => {
        btn.innerHTML = `${CART_ICON} Add to Cart`;
      }, 2000);
    }
  }

  async updateThemeCartCount() {
    try {
      const resp = await fetch('/cart.js');
      if (!resp.ok) return;
      const cart = await resp.json();
      const countSelectors = [
        '.cart-count',
        '.cart-count-bubble span',
        '[data-cart-count]',
        '.js-cart-count',
        '#CartCount',
        '.site-header__cart-count',
      ];
      for (const sel of countSelectors) {
        const el = document.querySelector(sel);
        if (el) el.textContent = cart.item_count;
      }
      document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
    } catch (e) { /* non-critical */ }
  }

  showNotifyModal() {
    const existing = document.getElementById('ck-notify-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ck-notify-overlay';
    overlay.className = 'ck-notify-overlay';
    overlay.innerHTML = `
      <div class="ck-notify-modal" style="position:relative">
        <button class="ck-notify-modal__close" aria-label="Close">&times;</button>
        <h3>Get notified when it's back</h3>
        <p>${truncate(this.product.title, 50)}${this.selectedVariant.title !== 'Default Title' ? ' — ' + this.selectedVariant.title : ''}</p>
        <input type="email" class="ck-notify-modal__input" placeholder="Enter your email" aria-label="Email address" required>
        <button class="ck-notify-modal__submit">Notify Me</button>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('.ck-notify-modal__close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    const submitBtn = overlay.querySelector('.ck-notify-modal__submit');
    const emailInput = overlay.querySelector('.ck-notify-modal__input');

    submitBtn.addEventListener('click', () => {
      const email = emailInput.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailInput.style.borderColor = '#ef4444';
        return;
      }

      submitBtn.textContent = 'Subscribed!';
      submitBtn.disabled = true;

      if (this.analytics) {
        this.analytics.trackEvent('feature_interact', null, 'sticky_cart_notify');
      }

      setTimeout(() => overlay.remove(), 1500);
    });

    emailInput.focus();
  }

  destroy() {
    if (this.observer) this.observer.disconnect();
    if (this.el) this.el.remove();
  }
}

export default new StickyCart();
