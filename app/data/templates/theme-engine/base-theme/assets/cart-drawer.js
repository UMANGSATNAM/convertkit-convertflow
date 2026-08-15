/*
  cart-drawer.js — makes the cart drawer actually work.

  Problem it solves: 110 places in the theme call /cart/add.js directly and then
  do nothing else. The drawer is rendered server-side from `cart.items`, so after
  an AJAX add it still showed the *old* cart until a full page reload, and it
  never opened.

  This module wraps window.fetch once, so every existing add-to-cart call site
  keeps working untouched — no per-section edits needed.

  On a successful /cart/add.js, /cart/change.js or /cart/update.js it will:
    1. refresh the drawer markup from the server (so line items, subtotal,
       free-shipping progress and upsells are all correct)
    2. update every cart count element on the page
    3. open the drawer
    4. dispatch `cart:updated` (detail: the cart object)

  Public API (window.CartDrawer):
    .open()  .close()  .toggle()  .refresh()  .get()

  Count elements: anything matching [data-cart-count] or a class containing
  `cart-count` gets its text set to the live item count.
*/
(function () {
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

  // Re-render the drawer from the server so its Liquid-rendered contents match
  // the real cart. The drawer is rendered by the layout, so we refetch the
  // current page and swap just that node.
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

  // --- intercept cart mutations from any call site -------------------------
  var nativeFetch = window.fetch;
  if (typeof nativeFetch === 'function') {
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var isAdd = /\/cart\/add(\.js)?/.test(url);
      var isChange = /\/cart\/(change|update|clear)(\.js)?/.test(url);

      var result = nativeFetch.apply(this, arguments);

      if (isAdd || isChange) {
        result.then(function (res) {
          if (res && res.ok) scheduleRefresh(isAdd);
        }).catch(function () {});
      }
      return result;
    };
  }

  // --- open / close triggers ----------------------------------------------
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cart-open], .js-cart-open')) {
      e.preventDefault();
      open();
      return;
    }
    if (e.target.closest('[data-cart-close], .cf-drawer__close, .cf-drawer__overlay')) {
      e.preventDefault();
      close();
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

  // seed the count bubbles on first load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchCart);
  } else {
    fetchCart();
  }
})();
