/**
 * ConvertKit — Sticky Add to Cart Widget
 * Vanilla JS, < 8kb target. No dependencies.
 *
 * Features:
 * - IntersectionObserver to detect native ATC button
 * - Two-way variant sync with main product form
 * - Shopify AJAX Cart API integration
 * - Check animation + View Cart link
 * - Hidden on mobile < 768px (configurable)
 * - 200ms ease-out slide-in, zero CLS
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
  // Try multiple common sources for product JSON
  const scriptTags = document.querySelectorAll('script[type="application/json"]');
  for (const tag of scriptTags) {
    try {
      const data = JSON.parse(tag.textContent);
      if (data?.product?.variants) return data.product;
      if (data?.variants) return data;
    } catch (e) { /* skip */ }
  }

  // Try window.product or meta tag
  if (window.product) return window.product;

  // Try Shopify's product JSON from the page URL
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
  }

  async init(options = {}, analytics = null) {
    this.options = options;
    this.analytics = analytics;

    injectStyles();

    // Get product data
    this.product = getProductData() || (await fetchProductData());
    if (!this.product || !this.product.variants) return;

    // Set initial variant
    this.selectedVariant =
      this.product.variants.find((v) => v.available) || this.product.variants[0];

    // Build the DOM
    this.render();

    // Set up IntersectionObserver on native ATC button
    this.observeNativeButton();

    // Listen for variant changes on the main product form
    this.syncVariants();

    // Track impression
    if (this.analytics) {
      this.analytics.track('feature_interact', {
        feature: 'sticky_cart',
        action: 'impression',
      });
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
    const image =
      v.featured_image?.src ||
      this.product.featured_image ||
      this.product.images?.[0] ||
      '';
    const title = truncate(this.product.title, 40);
    const variantTitle =
      v.title && v.title !== 'Default Title' ? v.title : '';
    const price = formatMoney(v.price);
    const comparePrice =
      v.compare_at_price && v.compare_at_price > v.price
        ? formatMoney(v.compare_at_price)
        : '';
    const isAvailable = v.available;
    const btnText = isAvailable ? 'Add to Cart' : 'Sold Out';

    this.el.innerHTML = `
      <div class="ck-sticky-cart__inner">
        ${image ? `<img class="ck-sticky-cart__image" src="${image}" alt="${title}" width="48" height="48" loading="lazy">` : ''}
        <div class="ck-sticky-cart__info">
          <p class="ck-sticky-cart__title">${title}</p>
          ${variantTitle ? `<p class="ck-sticky-cart__variant">${variantTitle}</p>` : ''}
        </div>
        <div class="ck-sticky-cart__price">
          ${price}
          ${comparePrice ? `<span class="ck-sticky-cart__price--compare">${comparePrice}</span>` : ''}
        </div>
        <button
          class="ck-sticky-cart__btn"
          ${!isAvailable ? 'disabled' : ''}
          aria-label="${btnText}"
        >
          ${CART_ICON} ${btnText}
        </button>
      </div>
    `;

    // Bind add to cart
    const btn = this.el.querySelector('.ck-sticky-cart__btn');
    if (btn && isAvailable) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.addToCart();
      });
    }
  }

  observeNativeButton() {
    // Find the native add-to-cart button — try common selectors
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
      // Fallback: show sticky after scrolling 600px
      this.fallbackScrollListener();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.hide();
          } else {
            // Only show when scrolled past (button above viewport)
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

  fallbackScrollListener() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 600) {
            this.show();
          } else {
            this.hide();
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
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
    // Listen for variant changes from the main product form
    // Works with most Shopify themes that use URL params or form inputs
    const productForm = document.querySelector(
      'form[action*="/cart/add"]'
    );
    if (!productForm) return;

    // Watch select/input changes
    productForm.addEventListener('change', (e) => {
      const input = e.target;
      if (
        input.name === 'id' ||
        input.name?.startsWith('option') ||
        input.dataset?.optionIndex !== undefined
      ) {
        this.handleVariantChange(productForm);
      }
    });

    // Also listen for URL changes (some themes use URL-based variant switching)
    let lastUrl = window.location.href;
    const urlObserver = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        this.handleUrlVariantChange();
      }
    });
    urlObserver.observe(document.body, { childList: true, subtree: true });
  }

  handleVariantChange(form) {
    // Try to get the selected variant ID from the form
    const idInput = form.querySelector('[name="id"]');
    if (idInput) {
      const variantId = parseInt(idInput.value, 10);
      const variant = this.product.variants.find(
        (v) => v.id === variantId
      );
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
      const variant = this.product.variants.find(
        (v) => v.id === variantId
      );
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
      const resp = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: this.selectedVariant.id,
          quantity: 1,
        }),
      });

      if (!resp.ok) throw new Error('Cart add failed');

      // Success state
      btn.classList.remove('ck-sticky-cart__btn--loading');
      btn.classList.add('ck-sticky-cart__btn--success');
      btn.innerHTML = `${CHECK_ICON} Added!`;

      // Track add to cart
      if (this.analytics) {
        this.analytics.track('feature_interact', {
          feature: 'sticky_cart',
          action: 'add_to_cart',
          variantId: this.selectedVariant.id,
          price: this.selectedVariant.price,
        });
      }

      // Show View Cart link after 1.5s
      setTimeout(() => {
        btn.classList.remove('ck-sticky-cart__btn--success');
        btn.innerHTML = `${CART_ICON} Add to Cart`;

        // Add a "View Cart" link
        const viewCart = document.createElement('a');
        viewCart.className = 'ck-sticky-cart__view-cart';
        viewCart.href = '/cart';
        viewCart.textContent = 'View Cart →';
        const inner = this.el.querySelector('.ck-sticky-cart__inner');
        if (inner && !inner.querySelector('.ck-sticky-cart__view-cart')) {
          inner.appendChild(viewCart);
        }
      }, 1500);

      // Update cart count in theme (common theme patterns)
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

      // Update common cart count selectors
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

      // Dispatch custom event for themes that listen
      document.dispatchEvent(
        new CustomEvent('cart:updated', { detail: cart })
      );
    } catch (e) { /* non-critical */ }
  }

  destroy() {
    if (this.observer) this.observer.disconnect();
    if (this.el) this.el.remove();
  }
}

export default new StickyCart();
