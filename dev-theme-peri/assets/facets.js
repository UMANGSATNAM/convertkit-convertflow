/*
  facets.js — AJAX collection filtering + sorting via the Section Rendering API.
  Used by every cl-v* collection template. Progressive enhancement: if JS fails
  or the custom element is unsupported, the plain <form> still submits normally.
*/
(function () {
  'use strict';

  if (customElements.get('facet-filters-form')) return;

  var GRID_SELECTORS = [
    '[data-facet-grid]',
    '#ProductGridContainer',
    '.collection-grid',
    '[id^="product-grid"]'
  ];

  function findGrid(root) {
    for (var i = 0; i < GRID_SELECTORS.length; i++) {
      var el = (root || document).querySelector(GRID_SELECTORS[i]);
      if (el) return el;
    }
    return null;
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  var FacetFiltersForm = /*@__PURE__*/ (function (HTMLElementBase) {
    function FacetFiltersForm() {
      var el = HTMLElementBase.call(this) || this;
      return el;
    }

    if (HTMLElementBase) FacetFiltersForm.__proto__ = HTMLElementBase;
    FacetFiltersForm.prototype = Object.create(HTMLElementBase && HTMLElementBase.prototype);
    FacetFiltersForm.prototype.constructor = FacetFiltersForm;

    FacetFiltersForm.prototype.connectedCallback = function () {
      var self = this;
      this.sectionId = this.dataset.sectionId || null;
      this.controller = null;

      this.onChange = debounce(function (event) {
        self.applyFilters(event);
      }, 250);

      this.addEventListener('input', function (e) {
        if (e.target.matches('input[type="checkbox"], input[type="radio"], input[type="number"], input[type="range"]')) {
          self.onChange(e);
        }
      });

      this.addEventListener('change', function (e) {
        if (e.target.matches('select[name="sort_by"]')) self.applyFilters(e);
      });

      this.addEventListener('submit', function (e) {
        e.preventDefault();
        self.applyFilters(e);
      });

      // "Clear all" / individual remove chips
      this.addEventListener('click', function (e) {
        var clear = e.target.closest('[data-facet-clear]');
        if (!clear) return;
        e.preventDefault();
        self.navigate(clear.getAttribute('href') || window.location.pathname);
      });

      window.addEventListener('popstate', function () {
        self.render(window.location.href, false);
      });
    };

    FacetFiltersForm.prototype.applyFilters = function () {
      var form = this.querySelector('form');
      if (!form) return;
      var params = new URLSearchParams(new FormData(form));
      // strip empty values so the URL stays clean
      var clean = new URLSearchParams();
      params.forEach(function (v, k) { if (v !== '') clean.append(k, v); });
      var url = window.location.pathname + (clean.toString() ? '?' + clean.toString() : '');
      this.navigate(url);
    };

    FacetFiltersForm.prototype.navigate = function (url) {
      this.render(url, true);
    };

    FacetFiltersForm.prototype.render = function (url, push) {
      var self = this;
      var grid = findGrid(document);
      if (!grid) { window.location.href = url; return; }

      grid.setAttribute('aria-busy', 'true');
      grid.style.opacity = '0.5';
      grid.style.pointerEvents = 'none';

      if (this.controller) this.controller.abort();
      this.controller = typeof AbortController !== 'undefined' ? new AbortController() : null;

      var fetchUrl = url + (url.indexOf('?') > -1 ? '&' : '?') + 'section_id=' + (this.sectionId || '');

      fetch(this.sectionId ? fetchUrl : url, {
        signal: this.controller ? this.controller.signal : undefined
      })
        .then(function (r) {
          if (!r.ok) throw new Error('Bad response');
          return r.text();
        })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var newGrid = findGrid(doc);
          if (newGrid) grid.innerHTML = newGrid.innerHTML;

          // refresh the filter form itself (counts / active states change)
          var newForm = doc.querySelector('facet-filters-form form');
          var oldForm = self.querySelector('form');
          if (newForm && oldForm) {
            var openIds = [];
            oldForm.querySelectorAll('details[open]').forEach(function (d, i) { openIds.push(i); });
            oldForm.innerHTML = newForm.innerHTML;
            oldForm.querySelectorAll('details').forEach(function (d, i) {
              if (openIds.indexOf(i) > -1) d.setAttribute('open', '');
            });
          }

          if (push) window.history.pushState({ facets: true }, '', url);
          document.dispatchEvent(new CustomEvent('facets:updated', { detail: { url: url } }));
        })
        .catch(function (err) {
          if (err && err.name === 'AbortError') return;
          window.location.href = url;
        })
        .finally(function () {
          grid.removeAttribute('aria-busy');
          grid.style.opacity = '';
          grid.style.pointerEvents = '';
        });
    };

    return FacetFiltersForm;
  })(HTMLElement);

  customElements.define('facet-filters-form', FacetFiltersForm);
})();
