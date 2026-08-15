# Theme Audit Report — dev-theme-peri
**Updated:** 13 Aug 2026 · **Scope:** 1,647 sections · 136 snippets · ~690 templates · assets · config

---

## FINAL VERIFICATION — ALL GREEN ✅

| Check | Result |
|---|---|
| Invalid schema JSON | **0** |
| Unbalanced Liquid tags | **0** |
| `<img>` without `alt` | **0** |
| Duplicate setting IDs | **0** |
| Schema names > 25 chars | **0** |
| Duplicate schema names | **0** |
| Broken template → section refs | **0** |
| Missing snippets | **0** |
| Missing assets | **0** |
| Unscoped global CSS selectors | **0** |
| Missing presets | 5 — `header`, `footer`, `main-cart`, `main-collection`, `main-search` (template-bound; presets correctly not applicable) |

---

## Everything that was fixed

### Repo hygiene
- Deleted `fix_errors.py` (the bulk-regex script that damaged files previously) and `check.log`

### Content bugs
- **3 placeholder leaks** — 2× lorem ipsum blog excerpts, 1× "IMAGE HERE" div → replaced with real Liquid fallbacks
- **Fake galleries in 7 PDPs** — `pdp-v6`, `v9`, `v11`, `v12`, `v18`, `v19`, `v20` were rendering `product.featured_media` **2–5 times in a row**, so every "gallery" showed the same photo repeated instead of the product's actual images. All rewritten to loop `product.media`
- **`pdp-v20` thumbnails were decorative** — clicking them did nothing. Added a working thumbnail → main-image swap with active state

### Schema / customizer
- **9 files had a duplicate `btn_text` ID** — Shopify keeps the first definition, so the CSS received the button's **label string** ("Subscribe") where a color was expected. Renamed to `btn_text_color` and rewired the CSS
- **23 schema names > 25 chars** shortened; **1 duplicate name** (hp29 pills vs tiles) made unique
- **29 sections were missing `presets`** — they never appeared in "Add section" and the generation engine could not add them. Added (`cdr-v1…v20`, `announcement-bar-v2`, `header-commerce-v2`, `hp12–hp16` footers, `newsletter-luxury-v1`, `whatsapp-widget`)

### Broken references (pages that could not render)
- **`product.json`** loaded `pdp-sticky-atc-v1/v2/v3` — none exist. Removed
- **`404.json`** loaded 20 non-existent `header-v*` sections. Reduced to `main-404`
- **`list-collections.json`** was fully dead — its `main` type didn't exist either. Built `sections/main-list-collections.liquid` (responsive grid, srcset, lazy loading, empty state, full schema) and rewrote the template
- **`cp-v1` / `cp-v2`** rendered `{% render 'pc-v1' %}` — but `pc-v1` is a **section**, not a snippet, so every product card rendered blank. Fixed to `card-v1` / `card-v2`
- **13 dead templates deleted** — `page.headers-new-age`, `page.categories-v2`, `page.categories-v3`, and 10× `product.adv-*`. Every section they referenced was never built

### Missing assets — 70 collection pages had dead filters
Every `cl-v*` file loads `facets.js` + `component-facets.css`. **Neither file existed**, so `<facet-filters-form>` was never defined — filtering did nothing and the UI was unstyled. Built both:
- **`assets/facets.js`** — AJAX filtering via the Section Rendering API: debounced input, `AbortController` for stale requests, `pushState` + `popstate` history, open `<details>` preserved across re-renders, `facets:updated` event, graceful fallback to a normal form submit if anything fails
- **`assets/component-facets.css`** — deliberately neutral so it inherits each of the 70 layouts' own colors and fonts; 44px tap targets, mobile full-width dropdown sheets (no clipping), reduced-motion support

### Mobile responsiveness
- **20 cart drawers** (`cdr-v1…v20`) had **zero** media queries. Added: full-width panel on mobile, 44px touch targets, `env(safe-area-inset-bottom)` footer padding, 16px textarea font (stops iOS auto-zoom), `prefers-reduced-motion`

### Images — performance & SEO (37 files, 56 images)
- `alt` on every image (`product.title`, with `media.alt` preferred where available)
- Explicit `width`/`height` on every image → **eliminates CLS**
- `loading` strategy corrected: gallery hero = `eager` + `fetchpriority="high"`, everything else = `lazy` → improves LCP
- 7 homepage files migrated from deprecated `img_url` to `image_url`

### Announcement bars
`ab-v4` → `ab-v40` were built with schema settings **declared but never wired** — colors hardcoded in CSS, message text hardcoded in HTML. Changing anything in the customizer did nothing.
- **`ab-v4`–`ab-v10` rebuilt** — colors/text/link/font-size/height all wired, promo-code chip with tap-to-copy, dismissible with localStorage, mobile `@media`
- **`AB-BARS-FIX-SPEC.md`** written for the rest, with a per-file design-DNA table so the original look is preserved exactly
- `ab-v28`, `ab-v29`, `ab-v30` (rebuilt by you) verified correct — only the schema names were over the 25-char limit, now shortened

---

## Remaining — optional

**`img_url` → `image_url` migration.** 159 occurrences across 146 files. The old filter is deprecated but still fully functional, so nothing is broken today; the gain is future-proofing plus better sizing control.

Hand-editing 146 files is a poor trade. If you want this done, the safe path is a **narrowly-scoped, tested script** that only rewrites the exact `img_url: 'WIDTHx'` and `img_url: 'WxH', crop: '…'` patterns, run on a git branch with a diff review — not a broad regex like the old `fix_errors.py`.

**`ab-v11`–`ab-v27`, `ab-v31`–`ab-v40`.** In progress by you, using `AB-BARS-FIX-SPEC.md`.

---

## Method note

All scanning was **read-only**. Every fix was applied file-by-file with targeted edits — no bulk find-and-replace scripts were run over the theme.
