class WishlistManager {
  constructor() {
    this.storageKey = "shopify_wishlist_items";
    this.items = this.loadItems();
    this.init();
  }

  loadItems() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveItems() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.error("[Wishlist storage save failed]", e);
    }
  }

  init() {
    this.updateButtonsUI();

    // Event delegation on clicks
    document.body.addEventListener("click", (e) => {
      const toggleBtn = e.target.closest(".js-wishlist-toggle");
      if (toggleBtn) {
        e.preventDefault();
        const handle = toggleBtn.getAttribute("data-product-handle");
        if (handle) this.toggle(handle);
      }
    });

    // Listen to changes to keep pages aligned
    window.addEventListener("storage", (e) => {
      if (e.key === this.storageKey) {
        this.items = this.loadItems();
        this.updateButtonsUI();
        window.PubSub.publish("wishlist:updated", this.items);
      }
    });
  }

  toggle(handle) {
    const idx = this.items.indexOf(handle);
    if (idx > -1) {
      this.items.splice(idx, 1);
    } else {
      this.items.push(handle);
    }
    this.saveItems();
    this.updateButtonsUI();
    window.PubSub.publish("wishlist:updated", this.items);
  }

  updateButtonsUI() {
    const toggles = document.querySelectorAll(".js-wishlist-toggle");
    toggles.forEach(btn => {
      const handle = btn.getAttribute("data-product-handle");
      const isStarred = this.items.includes(handle);
      
      btn.classList.toggle("wishlist-toggle--active", isStarred);
      btn.setAttribute("aria-pressed", isStarred ? "true" : "false");
      
      // Update heart icon if inside
      const svgEmpty = btn.querySelector(".icon-heart--empty");
      const svgFilled = btn.querySelector(".icon-heart--filled");
      if (svgEmpty && svgFilled) {
        if (isStarred) {
          svgEmpty.classList.add("visually-hidden");
          svgFilled.classList.remove("visually-hidden");
        } else {
          svgEmpty.classList.remove("visually-hidden");
          svgFilled.classList.add("visually-hidden");
        }
      }
    });
  }
}

window.domReady(() => {
  window.Wishlist = new WishlistManager();
});
