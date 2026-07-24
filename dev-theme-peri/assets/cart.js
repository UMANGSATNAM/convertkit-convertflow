class CartManager {
  constructor() {
    this.drawer = document.getElementById("CartDrawer");
    this.form = document.getElementById("CartDrawerForm");
    this.emptyState = document.querySelector(".cart-drawer-empty-state");
    this.listContainer = document.querySelector(".cart-drawer-items-list");
    this.subtotalElement = document.getElementById("CartDrawerSubtotal");
    this.shippingTracker = document.querySelector(".cart-drawer-shipping-tracker");
    this.shippingFill = document.querySelector(".shipping-tracker-bar-fill");
    this.shippingMsg = document.querySelector(".shipping-tracker-message");
    this.cartBubbles = document.querySelectorAll(".cart-count-bubble");

    this.init();
  }

  init() {
    if (!this.drawer) return;

    // Attach listeners
    this.drawer.querySelector(".cart-drawer-close-btn")?.addEventListener("click", () => this.close());
    this.drawer.querySelector(".cart-drawer-overlay")?.addEventListener("click", () => this.close());

    // Event Delegation for Line Quantity changes / Removals
    this.drawer.addEventListener("click", (e) => {
      const btn = e.target.closest(".quantity-stepper-btn");
      if (btn) {
        const input = btn.parentNode.querySelector(".quantity-stepper-input");
        const key = input.getAttribute("data-key");
        let val = parseInt(input.value, 10);
        if (btn.classList.contains("stepper-plus")) {
          val += 1;
        } else if (btn.classList.contains("stepper-minus") && val > 0) {
          val -= 1;
        }
        input.value = val;
        this.updateItem(key, val);
      }

      const removeBtn = e.target.closest(".cart-drawer-remove-btn");
      if (removeBtn) {
        const key = removeBtn.getAttribute("data-key");
        this.removeItem(key);
      }
    });

    this.drawer.addEventListener("change", (e) => {
      if (e.target.classList.contains("quantity-stepper-input")) {
        const key = e.target.getAttribute("data-key");
        const val = Math.max(0, parseInt(e.target.value, 10) || 0);
        this.updateItem(key, val);
      }
    });

    // Listen to global ATC events
    window.PubSub.subscribe("cart:add", (item) => this.addItem(item));
  }

  open() {
    this.drawer.setAttribute("aria-hidden", "false");
    this.drawer.classList.add("cart-drawer--open");
    document.body.classList.add("overflow-hidden");
  }

  close() {
    this.drawer.setAttribute("aria-hidden", "true");
    this.drawer.classList.remove("cart-drawer--open");
    document.body.classList.remove("overflow-hidden");
  }

  async fetchCart() {
    try {
      const cart = await window.fetchWrapper("/cart.js");
      this.renderCart(cart);
      return cart;
    } catch (err) {
      this.showToast("Failed to fetch cart details", "error");
    }
  }

  async addItem({ id, quantity = 1, options = {} }) {
    this.open();
    // Optimistic UI state could go here, but since adding items needs item details from server,
    // we fetch and refresh on success.
    try {
      await window.fetchWrapper("/cart/add.js", {
        method: "POST",
        body: JSON.stringify({ id, quantity, ...options })
      });
      const cart = await this.fetchCart();
      window.PubSub.publish("cart:updated", cart);
      this.showToast("Item added to cart successfully!", "success");
    } catch (err) {
      this.showToast(err.message || "Failed to add item to cart", "error");
    }
  }

  async updateItem(key, qty) {
    const originalContent = this.listContainer.innerHTML;
    const originalSubtotal = this.subtotalElement ? this.subtotalElement.textContent : "";

    // Optimistic Update
    if (qty === 0) {
      const itemRow = this.listContainer.querySelector(`[data-key="${key}"]`);
      itemRow?.remove();
    }

    try {
      const cart = await window.fetchWrapper("/cart/change.js", {
        method: "POST",
        body: JSON.stringify({ id: key, quantity: qty })
      });
      this.renderCart(cart);
      window.PubSub.publish("cart:updated", cart);
    } catch (err) {
      // Rollback
      this.listContainer.innerHTML = originalContent;
      if (this.subtotalElement) this.subtotalElement.textContent = originalSubtotal;
      this.showToast(err.message || "Failed to update item quantity", "error");
    }
  }

  async removeItem(key) {
    await this.updateItem(key, 0);
  }

  renderCart(cart) {
    // 1. Update Bubbles
    this.cartBubbles.forEach(bubble => {
      bubble.textContent = cart.item_count;
      if (cart.item_count > 0) {
        bubble.classList.remove("visually-hidden");
      } else {
        bubble.classList.add("visually-hidden");
      }
    });

    // 2. Toggles empty state
    if (cart.item_count === 0) {
      this.emptyState.classList.remove("visually-hidden");
      this.form.classList.add("visually-hidden");
      return;
    } else {
      this.emptyState.classList.add("visually-hidden");
      this.form.classList.remove("visually-hidden");
    }

    // 3. Render items
    this.listContainer.innerHTML = cart.items.map((item, index) => `
      <div class="cart-drawer-item" data-key="${item.key}" data-line="${index + 1}">
        <div class="cart-drawer-item-image-wrapper">
          ${item.image ? `<img src="${item.image}" alt="${escape(item.product_title)}" class="cart-drawer-item-image" loading="lazy" width="75" height="75">` : ""}
        </div>
        <div class="cart-drawer-item-details">
          <div class="cart-drawer-item-vendor">${item.vendor}</div>
          <a href="${item.url}" class="cart-drawer-item-title">${escape(item.product_title)}</a>
          ${item.variant_options && item.variant_options.length > 0 && item.variant_options[0] !== "Default Title" ? `
            <div class="cart-drawer-item-options">
              ${item.variant_options.map(opt => `<span class="cart-drawer-item-option-badge">${opt}</span>`).join(" ")}
            </div>
          ` : ""}
          <div class="cart-drawer-item-price-wrapper">
            ${item.original_line_price !== item.final_line_price ? `
              <s class="cart-drawer-item-price-compare">${window.formatMoney(item.original_line_price)}</s>
              <span class="cart-drawer-item-price">${window.formatMoney(item.final_line_price)}</span>
            ` : `
              <span class="cart-drawer-item-price">${window.formatMoney(item.original_line_price)}</span>
            `}
          </div>
          <div class="cart-drawer-item-actions">
            <div class="cart-drawer-quantity-stepper">
              <button type="button" class="quantity-stepper-btn stepper-minus" aria-label="Decrease quantity">
                <svg aria-hidden="true" class="icon icon-minus" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                </svg>
              </button>
              <input type="number" name="updates[]" value="${item.quantity}" min="0" class="quantity-stepper-input" data-key="${item.key}" aria-label="Item quantity">
              <button type="button" class="quantity-stepper-btn stepper-plus" aria-label="Increase quantity">
                <svg aria-hidden="true" class="icon icon-plus" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <button type="button" class="cart-drawer-remove-btn" aria-label="Remove item" data-key="${item.key}">
              Remove
            </button>
          </div>
        </div>
      </div>
    `).join("");

    // 4. Subtotal
    if (this.subtotalElement) {
      this.subtotalElement.textContent = window.formatMoney(cart.total_price);
    }

    // 5. Shipping Tracker
    if (this.shippingTracker) {
      const threshold = parseInt(this.shippingTracker.getAttribute("data-threshold"), 10);
      const remaining = threshold - cart.total_price;
      const percentage = Math.min(100, Math.max(0, (cart.total_price / threshold) * 100));

      if (this.shippingFill) this.shippingFill.style.width = `${percentage}%`;

      if (remaining > 0) {
        this.shippingMsg.innerHTML = `Spend <strong>${window.formatMoney(remaining)}</strong> more to unlock FREE shipping!`;
      } else {
        this.shippingMsg.innerHTML = `🎉 You have unlocked <strong>FREE SHIPPING</strong>!`;
      }
    }
  }

  showToast(message, type = "success") {
    // Simple DOM toast notification
    const toast = document.createElement("div");
    toast.className = `theme-toast theme-toast--${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add("theme-toast--visible");
    }, 100);

    setTimeout(() => {
      toast.classList.remove("theme-toast--visible");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

window.domReady(() => {
  window.Cart = new CartManager();
});
