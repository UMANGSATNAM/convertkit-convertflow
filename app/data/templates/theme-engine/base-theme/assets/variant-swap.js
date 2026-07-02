class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", this.onVariantChange.bind(this));
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, "", false);
    this.updatePickupAvailability();
    this.removeErrorMessage();

    if (!this.currentVariant) {
      this.toggleAddButton(true, "", true);
      this.updateStatus(true);
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
    }
  }

  updateOptions() {
    this.options = Array.from(this.querySelectorAll("select, input[type='radio']:checked")).map(
      (element) => element.value
    );
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => this.options[index] === option)
        .includes(false);
    });
  }

  updateMedia() {
    if (!this.currentVariant || !this.currentVariant.featured_media) return;

    // Dispatch media updates to PDP gallery component via EventBus
    window.PubSub.publish("variant:media-change", {
      mediaId: this.currentVariant.featured_media.id,
      mediaSrc: this.currentVariant.featured_image ? this.currentVariant.featured_image.src : null
    });
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === "false") return;
    window.history.replaceState({}, "", `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`
    );
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      if (input) {
        input.value = this.currentVariant.id;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  }

  updatePickupAvailability() {
    // Standard layout hook placeholder if pick-up is used in niche layouts
  }

  removeErrorMessage() {
    const section = this.closest("section");
    if (section) {
      const errorWrapper = section.querySelector(".product-form__error-message-wrapper");
      if (errorWrapper) errorWrapper.setAttribute("hidden", "true");
    }
  }

  toggleAddButton(disable = true, text = "", modifyClass = true) {
    const productForm = document.getElementById(`product-form-${this.dataset.section}`);
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');

    if (!addButton) return;

    if (disable) {
      addButton.setAttribute("disabled", "disabled");
      if (addButtonText) addButtonText.textContent = "Unavailable";
    } else {
      addButton.removeAttribute("disabled");
      if (addButtonText) addButtonText.textContent = text || "Add to cart";
    }
  }

  updateStatus(isUnavailable) {
    const priceContainer = document.getElementById(`price-${this.dataset.section}`);
    if (priceContainer) {
      if (isUnavailable) {
        priceContainer.classList.add("visibility-hidden");
      } else {
        priceContainer.classList.remove("visibility-hidden");
      }
    }
  }

  renderProductInfo() {
    const sectionId = this.dataset.section;
    const priceContainer = document.getElementById(`price-${sectionId}`);
    const addButton = document.querySelector(`#product-form-${sectionId} [name="add"]`);
    const addButtonText = document.querySelector(`#product-form-${sectionId} [name="add"] > span`);

    if (this.currentVariant) {
      // 1. Update Price
      if (priceContainer) {
        const regularPrice = priceContainer.querySelector(".price-item--regular");
        const salePrice = priceContainer.querySelector(".price-item--sale");
        const comparePrice = priceContainer.querySelector(".price-item--compare");

        if (regularPrice) regularPrice.textContent = window.formatMoney(this.currentVariant.price);
        if (salePrice) salePrice.textContent = window.formatMoney(this.currentVariant.price);
        if (comparePrice && this.currentVariant.compare_at_price) {
          comparePrice.textContent = window.formatMoney(this.currentVariant.compare_at_price);
        }

        // Toggles classes
        priceContainer.classList.toggle("price--on-sale", !!this.currentVariant.compare_at_price && this.currentVariant.compare_at_price > this.currentVariant.price);
        priceContainer.classList.toggle("price--sold-out", !this.currentVariant.available);
      }

      // 2. Update Add/Remove states
      if (addButton && addButtonText) {
        if (this.currentVariant.available) {
          addButton.removeAttribute("disabled");
          addButtonText.textContent = "Add to cart";
        } else {
          addButton.setAttribute("disabled", "disabled");
          addButtonText.textContent = "Sold out";
        }
      }
    }
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}

customElements.define("variant-selects", VariantSelects);

class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find((radio) => radio.checked)?.value;
    });
  }
}

customElements.define("variant-radios", VariantRadios);
