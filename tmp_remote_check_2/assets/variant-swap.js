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
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}, #sf-pdp-form-${this.dataset.section}`
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
    const productForm = document.querySelector(`#product-form-${this.dataset.section}, #sf-pdp-form-${this.dataset.section}`);
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');

    if (!addButton) return;

    if (disable) {
      addButton.setAttribute("disabled", "disabled");
      if (addButtonText) addButtonText.textContent = "Sold Out";
    } else {
      addButton.removeAttribute("disabled");
      if (addButtonText) addButtonText.textContent = text || "Add to Bag";
    }
  }

  updateStatus(isUnavailable) {
    const priceContainer = document.querySelector(`#price-${this.dataset.section}, #sf-pdp-price-${this.dataset.section}`);
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
    const sfPrice = document.getElementById(`sf-pdp-price-${sectionId}`);
    const sfCompare = document.getElementById(`sf-pdp-compare-price-${sectionId}`);
    const sfSave = document.getElementById(`sf-pdp-save-badge-${sectionId}`);
    const sfStickyPrice = document.getElementById(`sf-sticky-price-${sectionId}`);
    const addButton = document.querySelector(`#product-form-${sectionId} [name="add"], #sf-pdp-form-${sectionId} [name="add"]`);
    const addButtonText = document.querySelector(`#product-form-${sectionId} [name="add"] > span, #sf-pdp-form-${sectionId} [name="add"] > span`);

    if (this.currentVariant) {
      const formattedPrice = window.formatMoney ? window.formatMoney(this.currentVariant.price) : `${(this.currentVariant.price / 100).toFixed(2)}`;
      
      // 1. Update Price
      if (priceContainer) {
        const regularPrice = priceContainer.querySelector(".price-item--regular");
        const salePrice = priceContainer.querySelector(".price-item--sale");
        const comparePrice = priceContainer.querySelector(".price-item--compare");

        if (regularPrice) regularPrice.textContent = formattedPrice;
        if (salePrice) salePrice.textContent = formattedPrice;
        if (comparePrice && this.currentVariant.compare_at_price) {
          comparePrice.textContent = window.formatMoney ? window.formatMoney(this.currentVariant.compare_at_price) : `${(this.currentVariant.compare_at_price / 100).toFixed(2)}`;
        }
        priceContainer.classList.toggle("price--on-sale", !!this.currentVariant.compare_at_price && this.currentVariant.compare_at_price > this.currentVariant.price);
        priceContainer.classList.toggle("price--sold-out", !this.currentVariant.available);
      }

      if (sfPrice) sfPrice.textContent = formattedPrice;
      if (sfStickyPrice) sfStickyPrice.textContent = formattedPrice;

      if (sfCompare && this.currentVariant.compare_at_price > this.currentVariant.price) {
        sfCompare.textContent = window.formatMoney ? window.formatMoney(this.currentVariant.compare_at_price) : `${(this.currentVariant.compare_at_price / 100).toFixed(2)}`;
        sfCompare.style.display = 'inline';
        if (sfSave) {
          const diff = this.currentVariant.compare_at_price - this.currentVariant.price;
          const pct = Math.round((diff * 100) / this.currentVariant.compare_at_price);
          sfSave.textContent = `Save ${pct}%`;
          sfSave.style.display = 'inline-block';
        }
      } else {
        if (sfCompare) sfCompare.style.display = 'none';
        if (sfSave) sfSave.style.display = 'none';
      }

      // Update active state on option labels/swatches & option value display
      this.querySelectorAll("select, input[type='radio']:checked").forEach((el, idx) => {
        const optPosition = idx + 1;
        const valSpan = document.getElementById(`sf-opt-val-${sectionId}-${optPosition}`);
        if (valSpan && el.value) valSpan.textContent = el.value;
      });

      // 2. Update Add/Remove states
      if (addButton && addButtonText) {
        if (this.currentVariant.available) {
          addButton.removeAttribute("disabled");
          addButtonText.textContent = "Add to Bag";
        } else {
          addButton.setAttribute("disabled", "disabled");
          addButtonText.textContent = "Sold Out";
        }
      }
    }
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}

if (!customElements.get("variant-selects")) {
  customElements.define("variant-selects", VariantSelects);
}
if (!customElements.get("sf-variant-picker")) {
  class SfVariantPicker extends VariantSelects {}
  customElements.define("sf-variant-picker", SfVariantPicker);
}


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

if (!customElements.get("variant-radios")) {
  customElements.define("variant-radios", VariantRadios);
}

