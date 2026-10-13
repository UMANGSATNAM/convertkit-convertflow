# Task Plan: Section #1 — The Ultimate 1000-Crore PDP Buy Box (100% Production-Grade)

## 🎯 Goal
Engineer a master-grade, battle-tested Shopify Theme 2.0 Product Purchase Block (`cf-pdp-buybox.liquid`) with real Shopify data synchronization, real AJAX cart integration, dynamic client-side variant switching, live stock scarcity tracking, and sticky mobile conversion bar.

---

## 🏗️ Technical Specification

### 1. Shopify Data Contract
- **Target Product Handling**: Supports both Product Template context (`product`) and any Page context via `section.settings.product` picker with fallback.
- **Variant Options**: Real `product.options_with_values` loop rendering accessible radio swatches (Color, Size, Custom).
- **Variant JSON Payload**: `<script type="application/json">` storing variant inventory, pricing, compare-at pricing, image references, and availability.

### 2. Real Interactive Engine (Zero External Dependencies)
- **Vanilla JS Variant Controller**:
  - Intercepts radio swatch changes.
  - Resolves matching variant ID from options combination.
  - Updates hidden `<input name="id" value="...">`.
  - Live price recalculation with currency formatting and dynamic percentage savings badge (`SAVE $XX (YY% OFF)`).
  - Updates inventory urgency bar dynamically based on selected variant availability.
  - Syncs browser URL with `?variant={id}` without reloading (`history.replaceState`).
- **AJAX Cart Engine (`/cart/add.js`)**:
  - Intercepts form submission.
  - Posts payload to `/cart/add.js`.
  - Dispatches native Shopify cart update events (`cart:update`, `theme:cart:changed`) to trigger native theme cart drawers (Dawn, Prestige, Impulse).
  - Button state management (`Adding...` -> `✓ Added to Cart` -> Reset).
- **Sticky Mobile Conversion Bar**:
  - IntersectionObserver tracks the main CTA.
  - When scrolled past on mobile viewports (<768px), slides in an anchored bottom bar with Title, Active Price, and Instant ATC button.
- **Collapsible Information Tabs**:
  - Smooth animated native accordions for Shipping Estimates, Specs, and Guarantee.

### 3. Design & Quality Constraints
- **Purple Ban**: 100% strictly enforced. Obsidian slate palette (`#08090C`, `#11141A`, `#1E2530`) with Emerald Green (`#10B981`) conversion triggers.
- **Zero Emojis**: 100% inline, optimized SVG vector graphics.
- **Zero Heavy Libraries**: Pure lightweight CSS + vanilla JS (Lighthouse performance rating 98+).

---

## 📋 Implementation Checklist
- [x] Create `.planning/section-1-pdp-buybox.md`
- [x] Implement master-grade `cf-pdp-buybox.liquid` in `app/lib/sections/templates/` and update `registry.ts`
- [x] Verify Liquid schema validity and Theme 2.0 block support
- [x] Run build validation (`npm run build`) - Passed with code 0!
- [x] Commit progress to Git
