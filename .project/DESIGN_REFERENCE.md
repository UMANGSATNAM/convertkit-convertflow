# DESIGN REFERENCE — Premium D2C Design Language

**Purpose:** the single source of premium design language for ALL product-facing sections (product-card,
product-grid, PDP, featured-grid, hero). Every section spec points here. This exists because "use design
craft" (abstract) produced generic output — this doc holds the EXACT patterns instead.

**Reference bar:** top Indian D2C — **CaratLane, GIVA, Bluestone, Sugar, Nykaa** — + quiet-luxury **Aesop, Byredo**.
Values come from LUXURY-DESIGN-SYSTEM.md (luxury blueprint). Other blueprints reuse the STRUCTURE, swap token values.

---

## Core premium principles (EXTRACT these)

- **Restraint + whitespace.** One thing at a time, air around it. Whitespace is the luxury signal, not decoration.
- **Refined typography.** Title = light/medium weight (not heavy bold). Vendor/category **eyebrow** — tiny, uppercase, tracked (`--tracking-eyebrow`), muted — above the title. Price quiet, un-bolded.
- **Restrained CTA.** Premium cards do NOT show a loud full-width button on every card. Instead: a subtle **wishlist heart** (always visible, top-right) + **add-to-bag revealed on hover** (or a small icon). The loud add-to-cart lives on the PDP, not the grid.
- **Image-dominant, consistent.** One aspect ratio across the grid (portrait `4:5` or `1:1`). Clean/lifestyle shots. **Hover = second-image swap or subtle zoom (~1.03)**, slow (700ms).
- **Subtle badges.** Small, corner, tiny uppercase tracked ("New"/"Bestseller"). Never a loud block. Default hidden unless real.
- **Rating subtle + REAL only.** Small stars, muted, only if the merchant has real review data. Never fabricated.
- **Colour restraint.** Neutral card; brand accent appears at most once per card (price OR CTA OR sale).
- **Motion as one moment.** A single orchestrated hover reveal, slow — not scattered micro-animations.

## Anti-patterns (AVOID — these make it look like a default template)

- ❌ Loud full-width always-visible button on every card (the #1 "template" tell)
- ❌ Heavy bold titles
- ❌ Accent colour on everything (busy)
- ❌ Cramped spacing / tight grid gaps
- ❌ Fabricated ratings/counts/badges (also breaks the locked no-fake-data rule)
- ❌ Coloured text floating on a photo with no scrim (illegible)
- ❌ Default-Dawn look: it must not read as an out-of-the-box theme

> Litmus test for any card/section: place it next to a real CaratLane / GIVA screen. If it looks like a
> default Shopify template beside it, it's not done — raise the craft until it holds up.

---

## Reference log (Umang's references → what to extract vs avoid)

As references come in, each is logged here: what's premium (extract) vs what's template-y (avoid). We copy
only the premium parts.

| # | Reference | EXTRACT (premium) | AVOID (template-y) |
|---|-----------|-------------------|--------------------|
| 1 | Plain t-shirt card (Dawn-style) | struck compare-at price, small sale badge | loud full-width black ADD TO CART; bold title; no vendor eyebrow; likely-hardcoded rating |

### 18 grid references (Jul 2026) — distilled by brand-type

- **Editorial minimal** (saree brand, polo brand, caps brand): tall/large imagery, title + price ONLY, NO button, wishlist heart only, huge whitespace. Highest-end. → extract: restraint, tall portrait imagery, no button.
- **Lifestyle + on-image badge** (linen brand): full lifestyle photo, rating pill + "Bestseller" badge ON the image, "+12 more colors" text, wishlist heart, no button. → extract: on-image rating pill + badge, colour-count text.
- **Cream floating card** (sneaker brand): warm cream card, "New" badge, rating, discount, OUTLINE pill button with cart icon (not filled). → extract: cream card, outline pill button.
- **Two-tone info card** (eyewear brand): grey rounded image area + WHITE info panel below, rating pill top-left, colour dots, "View Similar", delivery pill, promo-code line. → extract: two-tone card, colour dots, utility pills.
- **Benefit-led** (baby-care, herbs, shaving brands): white bordered card, benefit pipe-line under title ("pH 5.5 | Hypoallergenic"), rating stars+count, "Save ₹X" badge, variant/pack chips, compact Add. → extract: benefit pipe-line, save-amount badge, variant chips.
- **Swatch-forward** (two cosmetics brands): shade swatches + "+N Shades", uppercase title, rating, scarcity/new badge, add-to-cart. → extract: shade swatch row with count.
- **Discount-heavy** (activewear, value-fashion): prominent struck price + big % OFF highlight (green/yellow), bestseller badge. → extract: bold discount treatment.
- **Quick-shop hover** (ethnic-wear brand): SIZE chips inline (XS S M L), quick-view / "shop preview" on hover, add button. → extract: inline size chips, hover quick-view.
- **Compact dense** (electronics, bags brands): 5–6 col, small compact "Add" button, dense info, compare checkbox. → extract: compact button, dense catalog layout.
- **Editorial content card** (cosmetics "glam in action"): tall content/video-style card with a small product thumbnail inset, OOS state, button dropdown for options. → extract: content-forward card, product-thumbnail inset.

**Near-universal premium elements to bake in:** wishlist heart (subtle, circle, top corner) · rating pill/stars (REAL only) · small corner badge (New/Bestseller/Save — REAL only) · colour/shade swatches + "+N more" · consistent aspect-ratio imagery (lifestyle where possible) · hover quick-view / quick-add / image-swap · clean struck-price + % discount.

**Button spectrum (choose by grid intent, NOT default to loud):** none (editorial) → wishlist-heart-only → compact pill / small "Add" → outline pill w/ icon → full-width (value/conversion grids only). Full-width loud button is for value/discount grids, never editorial.

---

## Note on data integrity (overrides any reference)

Even if a reference shows ratings, review counts, "bestseller" badges, or urgency — those render ONLY from
real merchant data. If not real → hidden by default. A reference's visual pattern never overrides the
no-fabricated-data rule.
