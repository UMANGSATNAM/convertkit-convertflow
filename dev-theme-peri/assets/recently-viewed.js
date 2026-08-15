/*
  recently-viewed.js — one shared store for the whole theme.

  Storage key: cf_recent_products
  Shape:       [{ handle, id, title, price, image, url, viewed }]

  Writing: `snippets/recently-viewed-track.liquid` is rendered on every product
  template and calls RecentlyViewed.track({...}) with the current product.

  Reading: any section can call RecentlyViewed.items() or listen for
  'recently-viewed:updated'. Sections that render server-side markup can also
  read the handles and hydrate via the Section Rendering API.

  Public API (window.RecentlyViewed):
    .track(item)          record a product view (deduped, most-recent first)
    .items(excludeHandle) stored items, optionally excluding the current product
    .handles(exclude)     handles only
    .clear()
    .limit                max stored entries (default 12)
*/
(function () {
  'use strict';

  var KEY = 'cf_recent_products';
  var LIMIT = 12;

  function read() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (!Array.isArray(raw)) return [];
      return raw.map(function (x) {
        return typeof x === 'string' ? { handle: x } : x;
      }).filter(function (x) { return x && x.handle; });
    } catch (e) {
      return [];
    }
  }

  function write(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }

  var items = read();

  function emit() {
    document.dispatchEvent(new CustomEvent('recently-viewed:updated', {
      detail: { items: items.slice(), count: items.length }
    }));
  }

  var API = {
    limit: LIMIT,

    track: function (item) {
      if (!item || !item.handle) return;
      items = items.filter(function (i) { return i.handle !== item.handle; });
      item.viewed = Date.now();
      items.unshift(item);
      if (items.length > API.limit) items = items.slice(0, API.limit);
      write(items);
      emit();
    },

    items: function (excludeHandle) {
      return items.filter(function (i) { return i.handle !== excludeHandle; });
    },

    handles: function (excludeHandle) {
      return API.items(excludeHandle).map(function (i) { return i.handle; });
    },

    clear: function () { items = []; write(items); emit(); }
  };

  window.RecentlyViewed = API;

  // Auto-render any container that opts in:
  //   <div data-recently-viewed data-recently-viewed-exclude="{{ product.handle }}"
  //        data-recently-viewed-limit="8"></div>
  // Each item is rendered from stored data — no extra network request.
  function render() {
    document.querySelectorAll('[data-recently-viewed]').forEach(function (box) {
      var exclude = box.dataset.recentlyViewedExclude || '';
      var limit = parseInt(box.dataset.recentlyViewedLimit || '8', 10);
      var list = API.items(exclude).slice(0, limit);

      var empty = box.querySelector('[data-recently-viewed-empty]');
      var grid = box.querySelector('[data-recently-viewed-grid]') || box;

      if (!list.length) {
        box.hidden = !box.hasAttribute('data-recently-viewed-keep');
        if (empty) empty.hidden = false;
        return;
      }

      box.hidden = false;
      if (empty) empty.hidden = true;

      grid.innerHTML = list.map(function (i) {
        var img = i.image
          ? '<img src="' + i.image + '" alt="' + (i.title || '').replace(/"/g, '&quot;') +
            '" width="300" height="300" loading="lazy">'
          : '';
        return '<a class="cf-rv__card" href="' + (i.url || '/products/' + i.handle) + '">' +
               '<div class="cf-rv__media">' + img + '</div>' +
               '<p class="cf-rv__title">' + (i.title || '') + '</p>' +
               (i.price ? '<p class="cf-rv__price">' + i.price + '</p>' : '') +
               '</a>';
      }).join('');
    });
  }

  API.render = render;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
  document.addEventListener('recently-viewed:updated', render);
  document.addEventListener('shopify:section:load', render);
})();
