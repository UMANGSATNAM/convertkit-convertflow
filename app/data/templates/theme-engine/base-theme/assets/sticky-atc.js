class StickyAddToCart {
  constructor() {
    this.stickyBar = document.querySelector(".sticky-atc-bar");
    this.mainAtcButton = document.querySelector(".product-form-main-submit");
    
    this.init();
  }

  init() {
    if (!this.stickyBar || !this.mainAtcButton) return;

    const observerOptions = {
      root: null,
      threshold: 0,
      rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // When main ATC button is NOT visible in the viewport, show sticky bar
        if (!entry.isIntersecting) {
          this.stickyBar.classList.add("sticky-atc-bar--visible");
          this.stickyBar.setAttribute("aria-hidden", "false");
        } else {
          this.stickyBar.classList.remove("sticky-atc-bar--visible");
          this.stickyBar.setAttribute("aria-hidden", "true");
        }
      });
    }, observerOptions);

    observer.observe(this.mainAtcButton);

    // Sync option selections in Sticky bar back to main options
    const stickySelect = this.stickyBar.querySelector(".sticky-atc-variant-select");
    if (stickySelect) {
      stickySelect.addEventListener("change", (e) => {
        const variantId = e.target.value;
        const mainSelect = document.querySelector("variant-selects select, variant-radios select");
        if (mainSelect) {
          mainSelect.value = variantId;
          mainSelect.dispatchEvent(new Event("change", { bubbles: true }));
        } else {
          // Fallback if radios are used, search for matches
          const variantDataBlock = document.querySelector('variant-radios [type="application/json"], variant-selects [type="application/json"]');
          if (variantDataBlock) {
            const data = JSON.parse(variantDataBlock.textContent);
            const matchedVariant = data.find(v => v.id.toString() === variantId);
            if (matchedVariant) {
              matchedVariant.options.forEach((optVal, index) => {
                const radio = document.querySelector(`variant-radios input[type="radio"][value="${optVal}"]`);
                if (radio) {
                  radio.checked = true;
                  radio.dispatchEvent(new Event("change", { bubbles: true }));
                }
              });
            }
          }
        }
      });
    }

    // Sync secondary ATC submit back to main form
    this.stickyBar.querySelector(".sticky-atc-submit")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.mainAtcButton.click();
    });
  }
}

window.domReady(() => {
  new StickyAddToCart();
});
