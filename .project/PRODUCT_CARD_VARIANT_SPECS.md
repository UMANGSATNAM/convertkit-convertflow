# PRODUCT CARD — Variant Specs (Section 2 of the library)

Plug into ANTIGRAVITY_PROMPT_TEMPLATE.md as **PART A** + **PART C**. PART B (locked rules) applies.
Structural specs (layout skeletons); styling by token ROLE, bound to the confirmed canonical token names.

> The product card is a **snippet consumed by other sections** (product grid, PDP related, featured grid,
> search). So it must: take a `product` object, render consistently at any column width, and never assume a
> fixed size. The card VARIANT is selected via a setting (store- or section-level).

---

## PART A — Target

- **Section type:** product-card (snippet)
- **Design reference:** LUXURY-DESIGN-SYSTEM.md for the luxury blueprint values (un-bolded price, sharp
  corners, restraint). Layouts are design-language-agnostic — token values change per blueprint.
- **Base structural spec (shared card anatomy — every variant uses these, shown/hidden per variant + settings):**
  - `media` — merchant product image, live (`product.featured_image` / first `product.media`). **Missing → neutral fallback** (clean, no dollar-sign art, no niche text). Fixed aspect ratio → zero CLS.
  - `title` — `product.title`. Clamp to 2 lines (long-title safe).
  - `price` — `product.price` via `money`. Compare-at (`product.compare_at_price`) optional, muted + struck. Price range if variants differ. NOT bold (luxury).
  - `quick_add` / CTA — add-to-cart or "View". Treatment varies per variant (inline / hover-reveal / none).
  - `badge` — sale / new / bestseller. **Settings-driven, default HIDDEN.** No fabricated "SALE" unless real.
  - `rating` — **default HIDDEN**; only renders if the merchant has real review data. No fake stars.
  - `swatch` — optional colour/variant swatches row.

---

## PART C — The 6 structural variants

Layout-level distinct. Antigravity: match each to a pool file, normalize per PART B; unmatched = GAP → build.
Report per variant: matched-from-`<file>` or built-new.

### card-v1 — Image-top, text below (classic vertical)
- **Layout:** media on top (aspect 4:5 or 1:1), then title, price, quick-add stacked below. Card is a vertical block.
- **Quick-add:** inline button below price, or icon button bottom-right of image.
- **Grid fit:** works 2/3/4-col. The safe default.

### card-v2 — Overlay
- **Layout:** media fills the card; title + price + CTA **overlaid** on the image — bottom-aligned block over a gradient scrim (token, not hardcoded), OR revealed on hover.
- **Quick-add:** appears on hover over the image.
- **Grid fit:** 2/3-col (needs image area). Legibility: scrim must guarantee text contrast on light images (same rule as hero-v3).

### card-v3 — Horizontal (image left, text right)
- **Layout:** media LEFT (~40%), content RIGHT (title, price, short meta, CTA). List/row style.
- **Grid fit:** best for 1–2 col, search results, editorial rows — NOT 4-col. Note this so the generation engine only uses v3 in wide/list contexts.
- **Mobile:** stays horizontal (compact) or stacks — pick one, keep consistent.

### card-v4 — Minimal, no background
- **Layout:** media + title + price only. No card bg, no border, no shadow. Generous whitespace between cards. Quick-add on hover or a plain text "Add" link.
- **Grid fit:** 2/3/4-col. Aesop/Byredo quiet-luxury grid.

### card-v5 — Bordered
- **Layout:** clear hairline border/frame around the whole card (border token). Structured, catalog feel. Media top, content below, optional divider between media and content.
- **Grid fit:** 2/3/4-col. Reads orderly/premium-retail.

### card-v6 — Floating (elevated)
- **Layout:** card sits on a surface with a shadow (shadow token); lifts on hover (translateY + stronger shadow). Quick-add reveals on hover. Rounded or sharp per radius token.
- **Grid fit:** 2/3/4-col. Modern/commerce feel.

---

## Tokens required (confirm each exists in canonical set, else it's a token GAP — do not hardcode)

Bind to the confirmed canonical names (the existing `--color-*` set, per the hero build):

- **Color:** accent (price/CTA/active — ≤ discipline), bg-base, surface, text-main, text-muted, border,
  on-accent text = `#fff` / `--text-on-accent` (never surface).
- **Type:** heading font (title), body font, price size (not bold — a weight token), title clamp.
- **Radius:** card radius token, button radius token (luxury = sharp; token-driven so blueprints vary).
- **Shadow:** card shadow + hover shadow tokens (v6).
- **Scrim (v2):** overlay/scrim token (reuse the hero-v3 gradient scrim, guaranteed contrast on light images).
- **Spacing:** internal card padding, grid gap, media aspect-ratio token.
- **Motion:** hover transition (duration/easing tokens); image hover scale (~1.03).

---

## Edge-case / fallback testing (REQUIRED per variant — the card is consumed everywhere)

Render-check each variant in ALL these states before it's library-final. These are where cards silently break:

| State | Expected behaviour |
|-------|--------------------|
| Missing product image | Neutral fallback (clean), card layout holds, no broken img / no CLS |
| Long title (>2 lines) | Clamp to 2 lines with ellipsis; card height stays consistent in the grid |
| No price / price range | Renders "From ₹X" or the range cleanly; never blank or "₹" alone |
| No compare-at price | Compare-at + save badge simply absent (not empty struck space) |
| Out of stock | Quick-add disabled / "Sold out" state; card still renders |
| Badge OFF (default) | No badge shown (default hidden — no fabricated SALE/NEW) |
| Rating with no reviews | No stars/count (default hidden — no fake rating) |
| Narrow column (mobile 2-col) | Card + text legible, tap targets ≥44px |

---

## Delivery / proof (per PART D of the template)

1. Each variant: the snippet `.liquid` (matched-from-pool + normalized, or built-new), consumable by a grid.
2. Self-check: grep clean (no hardcoded hex/radius), canonical token names, responsive, neutral defaults,
   merchant image + fallback, all edge-case states above pass.
3. **Render proof (Umang's eyes):** a real preview link showing a contrasting pair in a live grid — recommend
   **card-v2 (overlay)** vs **card-v4 (minimal-no-bg)** vs **card-v3 (horizontal)** — three clearly different
   card skeletons in one grid. Include one card in the **missing-image** state so the fallback is visible.
4. Report each variant: matched-from-`<file>` or built-new (gap).
