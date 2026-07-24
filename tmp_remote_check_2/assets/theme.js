// Global Accordion Component
class AccordionSection {
  constructor(element) {
    this.container = element;
    this.triggers = element.querySelectorAll(".accordion-trigger");
    this.init();
  }

  init() {
    this.triggers.forEach(trigger => {
      trigger.addEventListener("click", () => {
        const content = trigger.nextElementSibling;
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";
        
        // Close other items if accordion has single-expand tag
        if (this.container.hasAttribute("data-single-expand")) {
          this.triggers.forEach(otherTrigger => {
            if (otherTrigger !== trigger) {
              otherTrigger.setAttribute("aria-expanded", "false");
              otherTrigger.nextElementSibling?.classList.remove("accordion-content--open");
            }
          });
        }

        trigger.setAttribute("aria-expanded", isExpanded ? "false" : "true");
        content?.classList.toggle("accordion-content--open", !isExpanded);
      });
    });
  }
}

// Global Drawer/Disclosure toggles helper
class DisclosureToggle {
  constructor(btn) {
    this.btn = btn;
    this.targetId = btn.getAttribute("aria-controls");
    this.target = document.getElementById(this.targetId);
    
    if (this.target) this.init();
  }

  init() {
    this.btn.addEventListener("click", () => {
      const isExpanded = this.btn.getAttribute("aria-expanded") === "true";
      this.btn.setAttribute("aria-expanded", isExpanded ? "false" : "true");
      this.target.classList.toggle("drawer-open", !isExpanded);
    });
  }
}

window.domReady(() => {
  // Init all accordions
  document.querySelectorAll(".theme-accordion").forEach(acc => {
    new AccordionSection(acc);
  });

  // Init all simple disclosures (like mobile menu toggle)
  document.querySelectorAll("[aria-controls][data-disclosure-btn]").forEach(btn => {
    new DisclosureToggle(btn);
  });
  
  console.log("ConvertFlow theme components initialized.");
});
