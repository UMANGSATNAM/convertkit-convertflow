class PredictiveSearch {
  constructor() {
    this.drawer = document.getElementById("predictive-search-drawer");
    this.input = document.getElementById("SearchDrawerInput");
    this.resultsContainer = document.getElementById("predictive-search-results");
    
    this.init();
  }

  init() {
    if (!this.input || !this.resultsContainer) return;

    // Listen to open triggers (any button with js-search-trigger)
    document.querySelectorAll(".js-search-trigger").forEach(btn => {
      btn.addEventListener("click", () => this.open());
    });

    this.drawer?.querySelector(".search-drawer-close-btn")?.addEventListener("click", () => this.close());

    // Debounced query on input change
    this.input.addEventListener("input", window.debounce((e) => {
      this.onChange(e.target.value.trim());
    }, 300));

    // Keyboard navigation handlers
    this.input.addEventListener("keydown", (e) => this.onKeydown(e));
  }

  open() {
    if (!this.drawer) return;
    this.drawer.setAttribute("aria-hidden", "false");
    this.drawer.classList.add("predictive-search-drawer--open");
    setTimeout(() => this.input.focus(), 100);
  }

  close() {
    if (!this.drawer) return;
    this.drawer.setAttribute("aria-hidden", "true");
    this.drawer.classList.remove("predictive-search-drawer--open");
    this.input.value = "";
    this.resultsContainer.innerHTML = "";
  }

  async onChange(query) {
    if (!query) {
      this.resultsContainer.innerHTML = "";
      return;
    }

    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection,page&resources[limit]=5`);
      const data = await response.json();
      this.renderResults(data.resources.results);
    } catch (err) {
      console.error("[Search Suggest API Error]", err);
    }
  }

  renderResults(results) {
    const products = results.products || [];
    const collections = results.collections || [];
    const pages = results.pages || [];

    if (products.length === 0 && collections.length === 0 && pages.length === 0) {
      this.resultsContainer.innerHTML = `<div class="predictive-search-no-results">No results found for your query.</div>`;
      return;
    }

    let html = "";

    if (collections.length > 0) {
      html += `
        <div class="predictive-search-section">
          <h3 class="predictive-search-section-title">Collections</h3>
          <ul class="predictive-search-list" role="list">
            ${collections.map(col => `
              <li class="predictive-search-item" role="option">
                <a href="${col.url}" class="predictive-search-link">${escape(col.title)}</a>
              </li>
            `).join("")}
          </ul>
        </div>
      `;
    }

    if (products.length > 0) {
      html += `
        <div class="predictive-search-section">
          <h3 class="predictive-search-section-title">Products</h3>
          <ul class="predictive-search-list" role="list">
            ${products.map(prod => `
              <li class="predictive-search-item predictive-search-item--product" role="option">
                <a href="${prod.url}" class="predictive-search-link-product">
                  ${prod.image ? `<img src="${prod.image}" alt="${escape(prod.title)}" class="predictive-search-image" width="40" height="40">` : ""}
                  <div class="predictive-search-item-info">
                    <span class="predictive-search-item-title">${escape(prod.title)}</span>
                    <span class="predictive-search-item-price">${prod.price}</span>
                  </div>
                </a>
              </li>
            `).join("")}
          </ul>
        </div>
      `;
    }

    if (pages.length > 0) {
      html += `
        <div class="predictive-search-section">
          <h3 class="predictive-search-section-title">Pages</h3>
          <ul class="predictive-search-list" role="list">
            ${pages.map(page => `
              <li class="predictive-search-item" role="option">
                <a href="${page.url}" class="predictive-search-link">${escape(page.title)}</a>
              </li>
            `).join("")}
          </ul>
        </div>
      `;
    }

    this.resultsContainer.innerHTML = html;
  }

  onKeydown(e) {
    // Arrow down, Arrow up, Escape keys
    if (e.key === "Escape") {
      this.close();
    }
  }
}

window.domReady(() => {
  new PredictiveSearch();
});
