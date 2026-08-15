/*
  wishlist.js — single source of truth for the whole theme.

  Storage key: cf_wishlist_items  (same key the wishlist drawer reads)
  Shape:       [{ handle, id, title, price, image, url, added }]

  Public API (window.Wishlist):
    .items()            -> array of stored item objects
    .handles()          -> array of handles
    .has(handle)        -> boolean
    .add(item)          -> add (item must at least have .handle)
    .remove(handle)     -> remove
    .toggle(item)       -> add/remove, returns true if now saved
    .count()            -> number
    .clear()            -> empty the list
    .refresh()          -> re-sync every button on the page

  Events (on document):
    'wishlist:updated'  detail: { items, count, handle, saved }

  Markup contract — any of these work, no per-section JS needed:
    <button data-wishlist-toggle
            data-wishlist-handle="{{ product.handle }}"
            data-wishlist-id="{{ product.id }}"
            data-wishlist-title="{{ product.title | escape }}"
            data-wishlist-price="{{ product.price | money }}"
            data-wishlist-image="{{ product.featured_image | image_url: width: 200 }}"
            data-wishlist-url="{{ product.url }}"
            aria-pressed="false" aria-label="Add to wishlist"></button>

  Legacy support: buttons using any `data-*-wish="handle"` attribute (the old
  pc-v pattern) and `.js-wishlist-toggle[data-product-handle]` are also handled.

  Active state: the script sets `aria-pressed`, adds `.active` and
  `.is-wishlisted` — existing per-section CSS keeps working untouched.
*/
(function () {
  'use strict';

  var KEY = 'cf_wishlist_items';
  var COUNT_SEL = '[data-wishlist-count]';
  var BTN_SEL = '[data-wishlist-toggle], .js-wishlist-toggle';

  function read() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (!Array.isArray(raw)) return [];
      // migrate legacy format: plain array of strings
      return raw.map(function (x) {
        return typeof x === 'string' ? { handle: x } : x;
      }).filter(function (x) { return x && x.handle; });
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
  }

  var items = read();

  function handleOf(btn) {
    if (!btn) return null;
    if (btn.dataset.wishlistHandle) return btn.dataset.wishlistHandle;
    if (btn.dataset.productHandle) return btn.dataset.productHandle;
    for (var i = 0; i < btn.attributes.length; i++) {
      var a = btn.attributes[i];
      if (/-wish$/.test(a.name) && a.value) return a.value;
    }
    return null;
  }

  function itemFrom(btn) {
    var d = btn.dataset || {};
    return {
      handle: handleOf(btn),
      id: d.wishlistId || null,
      title: d.wishlistTitle || '',
      price: d.wishlistPrice || '',
      image: d.wishlistImage || '',
      url: d.wishlistUrl || (d.wishlistHandle ? '/products/' + d.wishlistHandle : ''),
      added: Date.now()
    };
  }

  function emit(handle, saved) {
    document.dispatchEvent(new CustomEvent('wishlist:updated', {
      detail: { items: items.slice(), count: items.length, handle: handle, saved: saved }
    }));
    if (window.PubSub && typeof window.PubSub.publish === 'function') {
      window.PubSub.publish('wishlist:updated', items.slice());
    }
  }

  function paintCounts() {
    document.querySelectorAll(COUNT_SEL).forEach(function (el) {
      el.textContent = items.length;
      el.hidden = items.length === 0;
    });
  }

  function paintButtons() {
    var saved = {};
    items.forEach(function (i) { saved[i.handle] = true; });

    document.querySelectorAll(BTN_SEL).forEach(function (btn) {
      var h = handleOf(btn);
      if (!h) return;
      var on = !!saved[h];
      btn.classList.toggle('active', on);
      btn.classList.toggle('is-wishlisted', on);
      btn.classList.toggle('wishlist-toggle--active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (btn.hasAttribute('aria-label')) {
        btn.setAttribute('aria-label', on ? 'Remove from wishlist' : 'Add to wishlist');
      }
      var empty = btn.querySelector('.icon-heart--empty');
      var filled = btn.querySelector('.icon-heart--filled');
      if (empty && filled) {
        empty.classList.toggle('visually-hidden', on);
        filled.classList.toggle('visually-hidden', !on);
      }
    });
  }

  function refresh() { paintButtons(); paintCounts(); }

  var API = {
    items: function () { return items.slice(); },
    handles: function () { return items.map(function (i) { return i.handle; }); },
    count: function () { return items.length; },
    has: function (handle) {
      return items.some(function (i) { return i.handle === handle; });
    },
    add: function (item) {
      if (!item || !item.handle || API.has(item.handle)) return false;
      items.push(item);
      write(items); refresh(); emit(item.handle, true);
      return true;
    },
    remove: function (handle) {
      var before = items.length;
      items = items.filter(function (i) { return i.handle !== handle; });
      if (items.length === before) return false;
      write(items); refresh(); emit(handle, false);
      return true;
    },
    toggle: function (item) {
      if (!item || !item.handle) return false;
      return API.has(item.handle) ? (API.remove(item.handle), false) : (API.add(item), true);
    },
    clear: function () {
      items = []; write(items); refresh(); emit(null, false);
    },
    refresh: refresh
  };

  document.addEventListener('click', function (e) {
    var btn = e.target.closest(BTN_SEL) ||
              e.target.closest('button[aria-label="Add to wishlist"], button[aria-label="Remove from wishlist"]');
    if (!btn) return;
    var handle = handleOf(btn);
    if (!handle) return;

    e.preventDefault();
    e.stopPropagation();

    var saved = API.toggle(itemFrom(btn));

    var toast = document.getElementById('cf-toast');
    if (toast) {
      toast.textContent = saved ? 'Saved to wishlist' : 'Removed from wishlist';
      toast.classList.add('show');
      setTimeout(function () { toast.classList.remove('show'); }, 2500);
    }
  });

  // keep tabs in sync
  window.addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    items = read();
    refresh();
    emit(null, false);
  });

  window.Wishlist = API;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refresh);
  } else {
    refresh();
  }
  // re-paint after theme editor section reloads / AJAX grids
  document.addEventListener('shopify:section:load', refresh);
  document.addEventListener('facets:updated', refresh);
})();
