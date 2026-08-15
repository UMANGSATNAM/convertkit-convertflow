/*
  predictive-search.js — live product suggestions using Shopify's
  /search/suggest.json endpoint. No dependencies, no libraries.

  Markup contract — add data-predictive-search to any search input:

    <form action="/search" method="get" role="search">
      <input type="search" name="q" data-predictive-search
             data-predictive-limit="6" autocomplete="off">
    </form>

  Everything else is created and positioned automatically, so every header
  keeps its own styling. The panel inherits the input's font and colours.

  Behaviour:
    - debounced 300ms, in-flight requests aborted (no stale results)
    - arrow keys + enter + escape, ARIA combobox roles
    - recent searches remembered in localStorage (last 4)
    - falls back to a normal form submit if the request fails
    - no layout shift: the panel is absolutely positioned
*/
(function () {
  'use strict';

  var RECENT_KEY = 'cf_recent_searches';
  var DEBOUNCE = 300;

  function readRecent() {
    try {
      var v = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
      return Array.isArray(v) ? v.slice(0, 4) : [];
    } catch (e) { return []; }
  }

  function pushRecent(term) {
    if (!term) return;
    var list = readRecent().filter(function (t) { return t !== term; });
    list.unshift(term);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 4))); } catch (e) {}
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function money(cents) {
    if (typeof cents !== 'number') return '';
    try {
      return new Intl.NumberFormat(document.documentElement.lang || 'en', {
        style: 'currency',
        currency: (window.Shopify && window.Shopify.currency && window.Shopify.currency.active) || 'INR',
        maximumFractionDigits: 0
      }).format(cents / 100);
    } catch (e) {
      return (cents / 100).toFixed(0);
    }
  }

  var uid = 0;

  function init(input) {
    if (input.dataset.psReady) return;
    input.dataset.psReady = '1';

    var id = 'ps-' + (++uid);
    var limit = parseInt(input.dataset.predictiveLimit || '6', 10);
    var form = input.closest('form');
    var controller = null;
    var timer = null;
    var activeIndex = -1;

    // wrapper so the panel can be positioned without touching header layout
    var host = input.parentElement;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';

    var panel = document.createElement('div');
    panel.className = 'cf-ps';
    panel.id = id;
    panel.setAttribute('role', 'listbox');
    panel.hidden = true;
    host.appendChild(panel);

    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', id);
    input.setAttribute('autocomplete', 'off');

    function items() { return panel.querySelectorAll('[role="option"]'); }

    function show() {
      panel.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    function hide() {
      panel.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      activeIndex = -1;
    }

    function highlight(i) {
      var list = items();
      if (!list.length) return;
      activeIndex = (i + list.length) % list.length;
      list.forEach(function (el, n) {
        var on = n === activeIndex;
        el.classList.toggle('is-active', on);
        el.setAttribute('aria-selected', on ? 'true' : 'false');
        if (on) el.scrollIntoView({ block: 'nearest' });
      });
    }

    function renderRecent() {
      var recent = readRecent();
      if (!recent.length) { hide(); return; }
      panel.innerHTML =
        '<p class="cf-ps__label">Recent searches</p>' +
        recent.map(function (t) {
          return '<a class="cf-ps__row cf-ps__row--text" role="option" aria-selected="false" ' +
                 'href="/search?q=' + encodeURIComponent(t) + '">' + esc(t) + '</a>';
        }).join('');
      show();
    }

    function renderResults(data, term) {
      var products = (data.resources && data.resources.results && data.resources.results.products) || [];

      if (!products.length) {
        panel.innerHTML =
          '<p class="cf-ps__empty">No matches for &ldquo;' + esc(term) + '&rdquo;</p>' +
          '<a class="cf-ps__row cf-ps__row--text" role="option" aria-selected="false" ' +
          'href="/search?q=' + encodeURIComponent(term) + '">Search all products</a>';
        show();
        return;
      }

      panel.innerHTML =
        products.slice(0, limit).map(function (p) {
          var img = p.featured_image && p.featured_image.url
            ? '<img src="' + esc(p.featured_image.url) + '" alt="" width="44" height="44" loading="lazy">'
            : '<span class="cf-ps__ph" aria-hidden="true"></span>';
          return '<a class="cf-ps__row" role="option" aria-selected="false" href="' + esc(p.url) + '">' +
                   '<span class="cf-ps__media">' + img + '</span>' +
                   '<span class="cf-ps__info">' +
                     '<span class="cf-ps__title">' + esc(p.title) + '</span>' +
                     '<span class="cf-ps__price">' + money(p.price) + '</span>' +
                   '</span>' +
                 '</a>';
        }).join('') +
        '<a class="cf-ps__row cf-ps__row--text" role="option" aria-selected="false" ' +
        'href="/search?q=' + encodeURIComponent(term) + '">See all results for &ldquo;' + esc(term) + '&rdquo;</a>';
      show();
    }

    function query(term) {
      if (controller) controller.abort();
      controller = typeof AbortController !== 'undefined' ? new AbortController() : null;

      var url = '/search/suggest.json?q=' + encodeURIComponent(term) +
                '&resources[type]=product&resources[limit]=' + limit +
                '&resources[options][unavailable_products]=last';

      fetch(url, { signal: controller ? controller.signal : undefined })
        .then(function (r) {
          if (!r.ok) throw new Error('bad response');
          return r.json();
        })
        .then(function (data) { renderResults(data, term); })
        .catch(function (err) {
          if (err && err.name === 'AbortError') return;
          hide(); // silent: the normal form submit still works
        });
    }

    input.addEventListener('input', function () {
      var term = input.value.trim();
      clearTimeout(timer);
      if (term.length < 2) { renderRecent(); return; }
      timer = setTimeout(function () { query(term); }, DEBOUNCE);
    });

    input.addEventListener('focus', function () {
      if (input.value.trim().length < 2) renderRecent();
    });

    input.addEventListener('keydown', function (e) {
      if (panel.hidden) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); highlight(activeIndex + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); highlight(activeIndex - 1); }
      else if (e.key === 'Escape') { hide(); }
      else if (e.key === 'Enter') {
        var list = items();
        if (activeIndex > -1 && list[activeIndex]) {
          e.preventDefault();
          pushRecent(input.value.trim());
          window.location.href = list[activeIndex].getAttribute('href');
        }
      }
    });

    if (form) {
      form.addEventListener('submit', function () { pushRecent(input.value.trim()); });
    }

    document.addEventListener('click', function (e) {
      if (!host.contains(e.target)) hide();
    });
  }

  function boot() {
    document.querySelectorAll('[data-predictive-search]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  document.addEventListener('shopify:section:load', boot);
})();
