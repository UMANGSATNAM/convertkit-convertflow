import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import prisma from "../db.server";
import { ensurePreviewTheme, previewUrl } from "./preview-theme.server";
import { upsertThemeFilesBatched, readFile, uploadAsset } from "./theme-engine/index";
import { createSnapshot } from "./theme-engine/snapshot.server";
import { restRequest } from "./shopify-api.server";
import { SnapReason } from "@prisma/client";

export interface ConversionSuiteConfig {
  isLive?: boolean;
  lastPublishedAt?: string;
  cartDrawer: {
    enabled: boolean;
    freeShippingThreshold: number;
    offerBannerText: string;
    showUpsells: boolean;
    accentColor: string;
    overrideNativeDrawer: boolean;
  };
  backInStock: {
    enabled: boolean;
    heading: string;
    bodyText: string;
    buttonLabel: string;
    successMessage: string;
    accentColor: string;
  };
  countdownTimer: {
    enabled: boolean;
    mode: "evergreen" | "daily" | "fixed";
    hours: number;
    dailyTime: string;
    fixedDate?: string;
    expiredBehavior: "hide" | "message";
    expiredText: string;
    prefix: string;
  };
  stickyAtc: {
    enabled: boolean;
    showOnMobile: boolean;
    showOnDesktop: boolean;
    buttonText: string;
  };
  trustBadges: {
    enabled: boolean;
    showCod: boolean;
    showUpi: boolean;
    showSecureCheckout: boolean;
    customText: string;
  };
}

export function getDefaultConversionConfig(): ConversionSuiteConfig {
  return {
    isLive: false,
    cartDrawer: {
      enabled: true,
      freeShippingThreshold: 999,
      offerBannerText: "🔥 Free Express Shipping on orders above ₹999!",
      showUpsells: true,
      accentColor: "#111827",
      overrideNativeDrawer: true,
    },
    backInStock: {
      enabled: true,
      heading: "Currently sold out",
      bodyText: "Leave your email and we'll notify you the moment this variant is restocked.",
      buttonLabel: "Notify Me When Available",
      successMessage: "You're on the priority restock list! We'll email you as soon as it's back.",
      accentColor: "#111827",
    },
    countdownTimer: {
      enabled: true,
      mode: "evergreen",
      hours: 4,
      dailyTime: "23:59",
      expiredBehavior: "message",
      expiredText: "Limited stock remaining at regular price",
      prefix: "⚡ Flash Offer Ends In: ",
    },
    stickyAtc: {
      enabled: true,
      showOnMobile: true,
      showOnDesktop: true,
      buttonText: "Add to Cart",
    },
    trustBadges: {
      enabled: true,
      showCod: true,
      showUpi: true,
      showSecureCheckout: true,
      customText: "Secure Checkout · Cash on Delivery · Instant UPI",
    },
  };
}

export async function getConversionConfig(shopDomain: string): Promise<ConversionSuiteConfig> {
  const shop = await prisma.shop.findUnique({ where: { shopDomain } });
  const brandConfig = (shop?.brandConfig as any) || {};
  const saved = brandConfig.conversionSuite;
  if (!saved) return getDefaultConversionConfig();
  return {
    ...getDefaultConversionConfig(),
    ...saved,
    cartDrawer: { ...getDefaultConversionConfig().cartDrawer, ...(saved.cartDrawer || {}) },
    backInStock: { ...getDefaultConversionConfig().backInStock, ...(saved.backInStock || {}) },
    countdownTimer: { ...getDefaultConversionConfig().countdownTimer, ...(saved.countdownTimer || {}) },
    stickyAtc: { ...getDefaultConversionConfig().stickyAtc, ...(saved.stickyAtc || {}) },
    trustBadges: { ...getDefaultConversionConfig().trustBadges, ...(saved.trustBadges || {}) },
  };
}

export async function saveConversionConfig(
  shopDomain: string,
  config: ConversionSuiteConfig
): Promise<ConversionSuiteConfig> {
  const shop = await prisma.shop.findUnique({ where: { shopDomain } });
  if (!shop) throw new Error(`Shop not found: ${shopDomain}`);

  const brandConfig = (shop.brandConfig as any) || {};
  const updatedBrandConfig = {
    ...brandConfig,
    conversionSuite: config,
  };

  await prisma.shop.update({
    where: { shopDomain },
    data: { brandConfig: updatedBrandConfig },
  });

  return config;
}

const PERI_DIR = path.resolve(process.cwd(), "dev-theme-peri");

async function loadTemplateFile(relPath: string): Promise<string> {
  const fullPath = path.join(PERI_DIR, relPath);
  if (existsSync(fullPath)) {
    return await fs.readFile(fullPath, "utf-8");
  }
  return "";
}

/**
 * Builds the customized Cart Drawer Liquid with the merchant's live settings.
 */
function buildCartDrawerLiquid(config: ConversionSuiteConfig): string {
  const { cartDrawer, trustBadges } = config;
  return `{% comment %}
  ConvertFlow CRO Suite — Custom High-Converting Cart Drawer
  Generated dynamically with merchant configuration.
{% endcomment %}

<div id="cf-cart-drawer" class="cf-drawer cdr-v1" aria-hidden="true">
  <div class="cf-drawer__overlay" onclick="window.CartDrawer && window.CartDrawer.close ? window.CartDrawer.close() : document.getElementById('cf-cart-drawer').setAttribute('aria-hidden', 'true')"></div>

  <div class="cf-drawer__panel">
    ${
      cartDrawer.offerBannerText
        ? `<div class="cf-drawer__offer-banner">${cartDrawer.offerBannerText}</div>`
        : ""
    }

    <!-- Header -->
    <div class="cf-drawer__header">
      <h3>Your Cart (<span data-cart-count>{{ cart.item_count }}</span>)</h3>
      <button type="button" class="cf-drawer__close" onclick="window.CartDrawer && window.CartDrawer.close ? window.CartDrawer.close() : document.getElementById('cf-cart-drawer').setAttribute('aria-hidden', 'true')" aria-label="Close cart drawer">
        {% render 'icon', icon: 'close' %}
      </button>
    </div>

    <!-- Free Shipping Progress Bar -->
    {% assign free_shipping_threshold = ${cartDrawer.freeShippingThreshold} %}
    {% assign cart_total_rupees = cart.total_price | divided_by: 100 %}
    <div class="cf-drawer__shipping">
      {% if cart_total_rupees >= free_shipping_threshold %}
        <div class="shipping-success">🎉 Congratulations! You unlocked FREE Shipping!</div>
        <div class="shipping-bar-container">
          <div class="shipping-bar-fill" style="width: 100%;"></div>
        </div>
      {% else %}
        {% assign needed = free_shipping_threshold | minus: cart_total_rupees %}
        {% assign percentage = cart_total_rupees | times: 100 | divided_by: free_shipping_threshold %}
        <div class="shipping-pending">Add <b>{{ needed | times: 100 | money }}</b> more for FREE Shipping!</div>
        <div class="shipping-bar-container">
          <div class="shipping-bar-fill" style="width: {{ percentage }}%;"></div>
        </div>
      {% endif %}
    </div>

    <!-- Cart Line Items Loop -->
    <div class="cf-drawer__items">
      {% if cart.item_count > 0 %}
        {% for item in cart.items %}
          {% render 'cart-drawer-item', item: item %}
        {% endfor %}

        ${
          cartDrawer.showUpsells
            ? `<!-- Recommended Upsell -->
        <div class="cf-drawer__fbt">
          <div class="fbt-header">
            <strong>Recommended for you</strong>
          </div>
          {% assign upsell_prod = collections.all.products.first %}
          {% if upsell_prod != blank and upsell_prod.available %}
            <div class="fbt-card" style="display: flex; gap: 12px; align-items: center; margin-top: 10px;">
              <img src="{{ upsell_prod.featured_image | image_url: width: 100 }}" alt="{{ upsell_prod.title | escape }}" width="50" height="50" style="border-radius: 6px; object-fit: cover;">
              <div style="flex-grow: 1;">
                <div style="font-size: 12px; font-weight: 600; color: #111;">{{ upsell_prod.title | truncate: 25 }}</div>
                <div style="font-size: 12px; font-weight: 700; color: #111;">{{ upsell_prod.price | money }}</div>
              </div>
              <button type="button" class="cf-upsell-btn" data-variant-id="{{ upsell_prod.selected_or_first_available_variant.id }}" style="padding: 6px 12px; background: ${cartDrawer.accentColor}; color: #fff; border: none; border-radius: 4px; font-size: 12px; font-weight: 700; cursor: pointer;">+ Add</button>
            </div>
          {% endif %}
        </div>`
            : ""
        }
      {% else %}
        <div class="cf-drawer__empty" style="text-align: center; padding: 48px 20px;">
          <p style="font-size: 16px; color: #666; margin-bottom: 16px;">Your cart is currently empty</p>
          <a href="/collections/all" class="cf-drawer__btn" style="display: inline-block; padding: 12px 24px; background: ${cartDrawer.accentColor}; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;">Continue Shopping</a>
        </div>
      {% endif %}
    </div>

    <!-- Footer Checkout CTA -->
    {% if cart.item_count > 0 %}
      <div class="cf-drawer__footer" style="padding: 16px 20px; border-top: 1px solid #e5e7eb; background: #fafafa;">
        ${
          trustBadges.enabled
            ? `{% render 'trust-badges' %}`
            : ""
        }

        <div class="cf-drawer__subtotal" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 16px; font-weight: 700; color: #111;">
          <span>Subtotal</span>
          <span>{{ cart.total_price | money }}</span>
        </div>

        <form action="/cart" method="post" id="cart-drawer-form">
          <button type="submit" name="checkout" class="cf-drawer__checkout" style="width: 100%; padding: 14px; background: ${cartDrawer.accentColor}; color: #ffffff; border: none; border-radius: 6px; font-size: 15px; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            Proceed to Checkout →
          </button>
        </form>
      </div>
    {% endif %}
  </div>
</div>

<style>
  .cdr-v1[aria-hidden="false"] { visibility: visible !important; }
  .cdr-v1[aria-hidden="false"] .cf-drawer__overlay { opacity: 1 !important; }
  .cdr-v1[aria-hidden="false"] .cf-drawer__panel { transform: translateX(0) !important; }

  .cdr-v1 {
    position: fixed; inset: 0; z-index: 9999999; visibility: hidden; transition: visibility 0.3s ease;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  .cdr-v1 .cf-drawer__overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.55); opacity: 0; transition: opacity 0.3s ease;
  }
  .cdr-v1 .cf-drawer__panel {
    position: absolute; top: 0; right: 0; bottom: 0; width: 100%; max-width: 420px; 
    background: #ffffff; color: #111827; display: flex; flex-direction: column; 
    transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
    box-shadow: -4px 0 24px rgba(0,0,0,0.15);
  }
  .cdr-v1 .cf-drawer__offer-banner {
    background: ${cartDrawer.accentColor}; color: #ffffff; text-align: center; padding: 10px;
    font-size: 12px; font-weight: 700;
  }
  .cdr-v1 .cf-drawer__header {
    display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; 
    border-bottom: 1px solid #e5e7eb;
  }
  .cdr-v1 .cf-drawer__header h3 { margin: 0; font-size: 17px; font-weight: 700; color: #111827; }
  .cdr-v1 .cf-drawer__close { background: none; border: none; cursor: pointer; padding: 4px; color: #111827; }
  .cdr-v1 .cf-drawer__shipping { padding: 12px 20px; border-bottom: 1px solid #e5e7eb; background: #f9fafb; }
  .cdr-v1 .shipping-success { font-size: 13px; font-weight: 700; color: #047857; text-align: center; margin-bottom: 6px; }
  .cdr-v1 .shipping-pending { font-size: 13px; font-weight: 600; color: #374151; text-align: center; margin-bottom: 6px; }
  .cdr-v1 .shipping-bar-container { width: 100%; height: 8px; background: #e5e7eb; border-radius: 99px; overflow: hidden; }
  .cdr-v1 .shipping-bar-fill { height: 100%; background: #059669; transition: width 0.3s ease; }
  .cdr-v1 .cf-drawer__items { flex-grow: 1; overflow-y: auto; padding: 0 20px; }
  .cdr-v1 .cf-drawer__fbt { margin: 16px 0; padding: 12px; border: 1px dashed #d1d5db; border-radius: 8px; background: #fdfdfd; }
  .cdr-v1 .fbt-header { font-size: 13px; color: #111827; }

  /* Native Cart Drawer Suppression */
  ${
    cartDrawer.overrideNativeDrawer
      ? `cart-drawer:not(#cf-cart-drawer),
  cart-notification,
  .cart-drawer:not(#cf-cart-drawer),
  #CartDrawer:not(#cf-cart-drawer) {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }`
      : ""
  }
</style>
`;
}

/**
 * Enhanced cart-drawer.js with:
 * 1. Native drawer suppression.
 * 2. AJAX fetch interception.
 * 3. Form submission interception.
 * 4. In-drawer quantity increment/decrement (+ / -).
 * 5. Cart link interception (a[href="/cart"]).
 * 6. Upsell one-click add to cart.
 */
function buildCartDrawerScript(): string {
  return `(function () {
  'use strict';

  var DRAWER_ID = 'cf-cart-drawer';
  var COUNT_SEL = '[data-cart-count], [class*="cart-count"], [class*="cart_count"]';
  var refreshTimer = null;
  var cart = null;

  function drawer() { return document.getElementById(DRAWER_ID); }

  function isOpen() {
    var d = drawer();
    return !!d && d.getAttribute('aria-hidden') === 'false';
  }

  function open() {
    var d = drawer();
    if (!d) return;
    d.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    var close = d.querySelector('.cf-drawer__close, [data-cart-close]');
    if (close && close.focus) close.focus();
  }

  function close() {
    var d = drawer();
    if (!d) return;
    d.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  }

  function onKey(e) { if (e.key === 'Escape') close(); }

  function paintCounts(count) {
    document.querySelectorAll(COUNT_SEL).forEach(function (el) {
      el.textContent = count;
    });
  }

  function fetchCart() {
    return fetch(window.Shopify && window.Shopify.routes
      ? window.Shopify.routes.root + 'cart.js'
      : '/cart.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (c) {
        cart = c;
        paintCounts(c.item_count);
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: c }));
        return c;
      })
      .catch(function () { return null; });
  }

  function refresh() {
    var d = drawer();
    if (!d) return Promise.resolve();

    return fetch(window.location.pathname + window.location.search, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var fresh = doc.getElementById(DRAWER_ID);
        var current = drawer();
        if (!fresh || !current) return;
        var wasOpen = isOpen();
        current.innerHTML = fresh.innerHTML;
        current.setAttribute('aria-hidden', wasOpen ? 'false' : 'true');
      })
      .catch(function () {});
  }

  function scheduleRefresh(shouldOpen) {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      Promise.all([fetchCart(), refresh()]).then(function () {
        if (shouldOpen) open();
      });
    }, 60);
  }

  // Intercept fetch mutations
  var nativeFetch = window.fetch;
  if (typeof nativeFetch === 'function') {
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var isAdd = /\\/cart\\/add(\\.js)?/.test(url);
      var isChange = /\\/cart\\/(change|update|clear)(\\.js)?/.test(url);

      var result = nativeFetch.apply(this, arguments);

      if (isAdd || isChange) {
        result.then(function (res) {
          if (res && res.ok) scheduleRefresh(isAdd);
        }).catch(function () {});
      }
      return result;
    };
  }

  // Intercept standard form submissions to /cart/add
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form && form.action && form.action.indexOf('/cart/add') !== -1) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      var formData = new FormData(form);
      fetch('/cart/add.js', {
        method: 'POST',
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }
      })
        .then(function (res) { return res.json(); })
        .then(function () {
          scheduleRefresh(true);
        })
        .catch(function (err) {
          console.error('[CartDrawer] Error adding item:', err);
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    }
  });

  // Open / close triggers & In-drawer interactions
  document.addEventListener('click', function (e) {
    // Open trigger
    var openBtn = e.target.closest('[data-cart-open], .js-cart-open, a[href="/cart"], .header__icon--cart');
    if (openBtn && !openBtn.closest('#cf-cart-drawer')) {
      e.preventDefault();
      open();
      return;
    }

    // Close trigger
    if (e.target.closest('[data-cart-close], .cf-drawer__close, .cf-drawer__overlay')) {
      e.preventDefault();
      close();
      return;
    }

    // In-drawer quantity plus/minus
    var plus = e.target.closest('.cf-qty-btn--plus');
    var minus = e.target.closest('.cf-qty-btn--minus');
    if (plus || minus) {
      var itemEl = (plus || minus).closest('.cf-cart-item');
      if (itemEl && itemEl.dataset.key) {
        var input = itemEl.querySelector('.cf-qty-input');
        var currentQty = parseInt(input.value, 10) || 1;
        var newQty = plus ? currentQty + 1 : Math.max(0, currentQty - 1);
        input.value = newQty;

        fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ id: itemEl.dataset.key, quantity: newQty })
        }).then(function () {
          scheduleRefresh(false);
        });
      }
      return;
    }

    // Upsell button inside drawer
    var upsellBtn = e.target.closest('.cf-upsell-btn');
    if (upsellBtn && upsellBtn.dataset.variantId) {
      e.preventDefault();
      upsellBtn.disabled = true;
      upsellBtn.textContent = 'Adding...';

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: upsellBtn.dataset.variantId, quantity: 1 })
      }).then(function () {
        scheduleRefresh(true);
      }).finally(function () {
        upsellBtn.disabled = false;
        upsellBtn.textContent = '+ Add';
      });
    }
  });

  document.addEventListener('cart:added', function () { scheduleRefresh(true); });
  document.addEventListener('cart:refresh', function () { scheduleRefresh(false); });

  window.CartDrawer = {
    open: open,
    close: close,
    toggle: function () { isOpen() ? close() : open(); },
    refresh: refresh,
    get: function () { return cart; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchCart);
  } else {
    fetchCart();
  }
})();
`;
}

/**
 * Builds the Sticky Add-to-Cart bar snippet.
 */
function buildStickyAtcLiquid(config: ConversionSuiteConfig): string {
  const { stickyAtc } = config;
  if (!stickyAtc.enabled) return "";

  return `{% if template contains 'product' and product.available %}
<div id="cf-sticky-atc" class="cf-sticky-atc" aria-hidden="true">
  <div class="cf-sticky-atc__inner">
    <div class="cf-sticky-atc__media">
      <img src="{{ product.featured_image | image_url: width: 120 }}" alt="{{ product.title | escape }}" width="48" height="48" loading="lazy">
    </div>
    <div class="cf-sticky-atc__info">
      <div class="cf-sticky-atc__title">{{ product.title }}</div>
      <div class="cf-sticky-atc__price">{{ product.selected_or_first_available_variant.price | money }}</div>
    </div>
    <div class="cf-sticky-atc__action">
      <form action="/cart/add" method="post" class="cf-sticky-form">
        <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" data-cf-sticky-variant-id>
        <button type="submit" name="add" class="cf-sticky-btn">
          ${stickyAtc.buttonText}
        </button>
      </form>
    </div>
  </div>
</div>

<style>
  .cf-sticky-atc {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    border-top: 1px solid #e5e7eb;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
    z-index: 999999;
    transform: translateY(110%);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: inherit;
    padding: 10px 16px;
  }
  .cf-sticky-atc[aria-hidden="false"] {
    transform: translateY(0);
  }
  .cf-sticky-atc__inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .cf-sticky-atc__media img {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    object-fit: cover;
  }
  .cf-sticky-atc__info {
    flex-grow: 1;
    min-width: 0;
  }
  .cf-sticky-atc__title {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cf-sticky-atc__price {
    font-size: 14px;
    font-weight: 700;
    color: #111827;
    margin-top: 2px;
  }
  .cf-sticky-btn {
    padding: 12px 24px;
    background: #111827;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s ease;
  }
  .cf-sticky-btn:hover {
    background: #000000;
  }
  @media screen and (max-width: 749px) {
    ${!stickyAtc.showOnMobile ? `.cf-sticky-atc { display: none !important; }` : ""}
    .cf-sticky-btn { padding: 10px 16px; }
  }
  @media screen and (min-width: 750px) {
    ${!stickyAtc.showOnDesktop ? `.cf-sticky-atc { display: none !important; }` : ""}
  }
</style>

<script>
(function() {
  var bar = document.getElementById('cf-sticky-atc');
  if (!bar) return;

  var mainAtc = document.querySelector('form[action*="/cart/add"] button[type="submit"], .product-form__buttons, .sf-pdp-buy-buttons');
  if (!mainAtc) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
        bar.setAttribute('aria-hidden', 'false');
      } else {
        bar.setAttribute('aria-hidden', 'true');
      }
    });
  }, { threshold: 0.1 });

  observer.observe(mainAtc);

  // Sync variant id changes from main form
  document.addEventListener('change', function(e) {
    var idInput = e.target.closest('form[action*="/cart/add"]')?.querySelector('input[name="id"]');
    var stickyIdInput = bar.querySelector('[data-cf-sticky-variant-id]');
    if (idInput && stickyIdInput) {
      stickyIdInput.value = idInput.value;
    }
  });
})();
</script>
{% endif %}
`;
}

/**
 * Builds the universal runner snippet cf-conversion-scripts.liquid
 */
function buildConversionRunnerLiquid(config: ConversionSuiteConfig): string {
  return `{% comment %}
  ConvertFlow — Conversion Suite Runtime Scripts
{% endcomment %}

{{ 'cart-drawer.js' | asset_url | script_tag }}
${config.countdownTimer.enabled ? `{{ 'countdown.js' | asset_url | script_tag }}` : ""}

{% if template contains 'product' %}
  ${config.stickyAtc.enabled ? `{% render 'cf-sticky-atc' %}` : ""}
{% endif %}
`;
}

/**
 * Gathers all Liquid, CSS, and JS files required for the conversion suite.
 */
export async function buildSuiteFiles(config: ConversionSuiteConfig): Promise<Record<string, string>> {
  const files: Record<string, string> = {};

  // 1. Cart Drawer section & script
  files["sections/cf-cart-drawer.liquid"] = buildCartDrawerLiquid(config);
  files["assets/cart-drawer.js"] = buildCartDrawerScript();

  // 2. Shared snippets
  const iconSnippet = await loadTemplateFile("snippets/icon.liquid");
  if (iconSnippet) files["snippets/icon.liquid"] = iconSnippet;

  const itemSnippet = await loadTemplateFile("snippets/cart-drawer-item.liquid");
  if (itemSnippet) files["snippets/cart-drawer-item.liquid"] = itemSnippet;

  const qtySnippet = await loadTemplateFile("snippets/quantity-input.liquid");
  if (qtySnippet) files["snippets/quantity-input.liquid"] = qtySnippet;

  const trustSnippet = await loadTemplateFile("snippets/trust-badges.liquid");
  if (trustSnippet) files["snippets/trust-badges.liquid"] = trustSnippet;

  // 3. Variant-Aware Back-In-Stock
  if (config.backInStock.enabled) {
    const bisSnippet = await loadTemplateFile("snippets/back-in-stock.liquid");
    if (bisSnippet) files["snippets/back-in-stock.liquid"] = bisSnippet;
  }

  // 4. Countdown Urgency
  if (config.countdownTimer.enabled) {
    const cdSnippet = await loadTemplateFile("snippets/countdown-timer.liquid");
    if (cdSnippet) files["snippets/countdown-timer.liquid"] = cdSnippet;

    const cdScript = await loadTemplateFile("assets/countdown.js");
    if (cdScript) files["assets/countdown.js"] = cdScript;
  }

  // 5. Sticky Add-to-Cart
  if (config.stickyAtc.enabled) {
    files["snippets/cf-sticky-atc.liquid"] = buildStickyAtcLiquid(config);
  }

  // 6. Global Runner snippet
  files["snippets/cf-conversion-scripts.liquid"] = buildConversionRunnerLiquid(config);

  return files;
}

/**
 * Injects the conversion suite into a target theme (Preview or Live).
 */
export async function injectConversionSuite(
  shop: any,
  targetThemeId: string,
  config: ConversionSuiteConfig
): Promise<{ filesCount: number; layoutPatched: boolean }> {
  // 1. Build and upload all widget assets & snippets
  const files = await buildSuiteFiles(config);
  await upsertThemeFilesBatched(shop, targetThemeId, files);

  // 2. Safely patch layout/theme.liquid to include the drawer and scripts
  let layoutPatched = false;
  try {
    const themeLiquid = await readFile(shop, targetThemeId, "layout/theme.liquid");
    if (themeLiquid && !themeLiquid.includes("cf-cart-drawer")) {
      const hookTag = `\n  {% comment %} ConvertFlow Conversion Suite {% endcomment %}\n  {% section 'cf-cart-drawer' %}\n  {% render 'cf-conversion-scripts' %}\n</body>`;
      if (themeLiquid.includes("</body>")) {
        const updatedThemeLiquid = themeLiquid.replace("</body>", hookTag);
        await uploadAsset(shop, targetThemeId, "layout/theme.liquid", updatedThemeLiquid);
        layoutPatched = true;
      }
    }
  } catch (err: any) {
    console.warn(`[ConversionSuite] Note on layout/theme.liquid patching:`, err.message);
  }

  return {
    filesCount: Object.keys(files).length,
    layoutPatched,
  };
}

/**
 * Gets the shop's active published theme ID.
 */
export async function getActiveMainThemeId(shop: any): Promise<string> {
  const data = await restRequest(shop.shopDomain, shop.accessToken, "GET", "themes.json");
  const mainTheme = data.themes?.find((t: any) => t.role === "main");
  if (!mainTheme) throw new Error("No active published theme found on this store.");
  return mainTheme.id.toString();
}

/**
 * Prepares the preview theme and injects the conversion suite into it.
 */
export async function prepareAndInjectPreviewTheme(
  shop: any,
  config: ConversionSuiteConfig
): Promise<{ previewThemeId: string; previewThemeName: string; previewUrl: string }> {
  const preview = await ensurePreviewTheme(shop);
  await injectConversionSuite(shop, preview.id, config);
  const url = previewUrl(shop.shopDomain, preview.id);
  return {
    previewThemeId: preview.id,
    previewThemeName: preview.name,
    previewUrl: url,
  };
}

/**
 * Promotes verified widgets from Preview Theme to the Live Main Theme with automated snapshot backup.
 */
export async function publishConversionSuiteToLive(
  shop: any,
  config: ConversionSuiteConfig
): Promise<{ mainThemeId: string; snapshotId: string; filesCount: number }> {
  const mainThemeId = await getActiveMainThemeId(shop);

  // 1. Create a safety snapshot of the live layout/theme.liquid
  const existingLayout = await readFile(shop, mainThemeId, "layout/theme.liquid");
  const snapshot = await createSnapshot(
    shop.id,
    mainThemeId,
    "TEMPLATE",
    "layout/theme.liquid",
    existingLayout,
    SnapReason.HEALTH_FIX
  );

  // 2. Inject suite into live main theme
  const result = await injectConversionSuite(shop, mainThemeId, config);

  // 3. Mark live in DB
  const updatedConfig = {
    ...config,
    isLive: true,
    lastPublishedAt: new Date().toISOString(),
  };
  await saveConversionConfig(shop.shopDomain, updatedConfig);

  return {
    mainThemeId,
    snapshotId: snapshot.id,
    filesCount: result.filesCount,
  };
}

/**
 * Safely removes the suite injection from the live theme.
 */
export async function rollbackLiveTheme(shop: any): Promise<boolean> {
  const mainThemeId = await getActiveMainThemeId(shop);
  const themeLiquid = await readFile(shop, mainThemeId, "layout/theme.liquid");

  if (themeLiquid && themeLiquid.includes("cf-cart-drawer")) {
    const cleaned = themeLiquid
      .replace(
        /\n?\s*\{%\s*comment\s*%\}\s*ConvertFlow Conversion Suite\s*\{%\s*endcomment\s*%\}\s*\{%\s*section\s*'cf-cart-drawer'\s*%\}\s*\{%\s*render\s*'cf-conversion-scripts'\s*%\}/g,
        ""
      )
      .replace(/\{%\s*section\s*'cf-cart-drawer'\s*%\}/g, "")
      .replace(/\{%\s*render\s*'cf-conversion-scripts'\s*%\}/g, "");

    await uploadAsset(shop, mainThemeId, "layout/theme.liquid", cleaned);
  }

  const config = await getConversionConfig(shop.shopDomain);
  await saveConversionConfig(shop.shopDomain, { ...config, isLive: false });
  return true;
}
