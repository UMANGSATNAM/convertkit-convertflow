# PRODUCT GRID — Variant Specs (Section 3 of the library)

Plug into ANTIGRAVITY_PROMPT_TEMPLATE.md as **PART A** + **PART C**. PART B (incl. Rule 0 craft) applies.
**Read DESIGN_REFERENCE.md first** — this spec uses its element taxonomy + premium bar. Distilled from 18
real Indian D2C grid references (linen/polo/caps/saree editorial, sneaker, eyewear, baby-care, herbs,
shaving, cosmetics, activewear, electronics, bags).

> A product grid = a SECTION that lays out product cards + an optional header + section-level treatment
> (columns, gap, carousel vs static, badge system, hover). It consumes the product-card variants. A "grid
> design" = layout archetype × card treatment × column count → this is how we reach 20+ distinct grids.

---

## PART A — Target

- **Section type:** product-grid
- **Reference:** DESIGN_REFERENCE.md (premium element taxonomy + button spectrum + data-integrity).
  Design-language-agnostic layouts; token values per blueprint.
- **Base structural spec (shared grid anatomy):**
  - `header` — optional: eyebrow + title (e.g. "BESTSELLERS") + "View All" link, or none (bare grid).
  - `layout` — CSS grid, N columns desktop / responsive down to 2 (or 1) on mobile; consistent gap (token).
  - `cards` — renders product-card variant (from section 2). Products from a chosen collection (live).
  - `section badges / trust` — rating, badge, discount, swatches — **all REAL merchant data only, default hidden.**
  - `carousel?` — some archetypes are horizontal-scroll with arrows + "View All" instead of a static grid.
  - `hover` — quick-view / quick-add / image-swap per archetype.

---

## PART C — 12 grid archetypes (each a complete premium look)

Antigravity: match each to the pool + normalize per PART B; build gaps. Each must clear the DESIGN_REFERENCE
premium bar (no default-Dawn look). Report matched-from-`<file>` or built-new.

1. **grid-editorial-minimal** — tall portrait imagery, title + price only, NO button, wishlist heart, huge whitespace. 3–4 col. (saree/polo/caps refs)
2. **grid-lifestyle-badge** — full lifestyle photos, on-image rating pill + Bestseller badge, "+N colors" text, wishlist heart, no button. 4 col. (linen ref)
3. **grid-cream-floating** — warm cream cards, New badge, rating, discount, outline pill button w/ cart icon, hover lift. 4 col. (sneaker ref)
4. **grid-two-tone-info** — image area + white info panel, rating pill, colour dots, View Similar, delivery/promo pills. 3–4 col. (eyewear ref)
5. **grid-benefit-led** — white bordered cards, benefit pipe-line under title, rating stars+count, Save-₹ badge, variant chips, compact Add. 4 col. (baby/herbs/shaving refs)
6. **grid-swatch-forward** — shade swatches + "+N Shades", uppercase title, rating, badge, add-to-cart. 4–5 col. (cosmetics refs)
7. **grid-discount-value** — prominent struck price + big % OFF highlight, Bestseller badge, tighter layout, full-width button OK here. 4–5 col. (activewear/value refs)
8. **grid-quick-shop** — inline size chips (XS–XL), quick-view/shop-preview on hover, add button. 2–4 col. (ethnic-wear ref)
9. **grid-compact-dense** — 5–6 col, small compact "Add", dense info, optional compare checkbox. (electronics/bags refs)
10. **grid-content-editorial** — tall content/story cards with small product-thumbnail inset, carousel. (cosmetics "glam" ref)
11. **grid-carousel** — horizontal scroll + arrows + "View All" header, any card style; for bestsellers/bundles. (bags/cosmetics refs)
12. **grid-classic-clean** — refined standard: image-top card, vendor eyebrow, light title, quiet price, wishlist heart, hover quick-add. 3–4 col. (the premium version of the default)

**20+ distinct grids** = these 12 archetypes × column counts (2/3/4/5/6) × card variants (section 2). Build the
12 archetypes well first; combinations are configuration, not new code.

---

## PREMIUM DESIGN BAR (from DESIGN_REFERENCE.md — every grid must clear it)

- Refined typography (light title, tracked eyebrow, quiet price); generous whitespace; consistent aspect-ratio imagery.
- Wishlist heart subtle top-corner; badges small + corner; swatches clean.
- **Button by intent, not default-loud:** editorial = none/heart; DTC = compact/outline pill on hover; value = full-width. NEVER a loud full-width button on an editorial grid.
- Hover as one slow moment (image-swap / quick-view / quick-add). Accent ≤ restraint.
- Litmus: place beside CaratLane/GIVA/Sugar/Nykaa — must not read as default Shopify.

---

## DATA INTEGRITY (critical here — references are full of trust signals)

Every rating, review count, "Bestseller"/"New"/"Save ₹X" badge, discount, scarcity ("LAST 50 PIECES"),
"verified", shade-count renders ONLY from real merchant data:
- rating/count → reviews metafield/app; hidden if none
- discount/% off → computed from real `compare_at_price`; hidden if none
- Bestseller/New → real tag/metafield; never hardcoded
- scarcity/stock → real inventory; never faked
No fabricated trust signals, ever — copy the references' LOOK, never their invented numbers.

---

## Edge cases (test per archetype)

Missing image (neutral fallback) · long title (clamp) · no price / range · no discount (no empty struck) ·
no rating (hidden, layout holds) · no swatches (row hidden) · out of stock · few products (grid doesn't
break with 2–3 items) · narrow mobile (2-col, tap targets ≥44px, carousel swipes).

---

## Delivery / proof

1. Each archetype: section `.liquid` + `{% schema %}` (columns, header, card-style, badge toggles all editable).
2. Self-check: token-driven, real-data-only trust signals, responsive, edge cases pass, premium bar cleared.
3. **Render proof (Umang's eyes):** real preview link showing 3–4 clearly-different archetypes in one page —
   recommend **editorial-minimal vs two-tone-info vs benefit-led vs swatch-forward** — plus one grid with a
   product in the missing-image / no-rating state so fallbacks are visible.
4. Report each: matched-from-`<file>` or built-new.
