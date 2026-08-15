# ShopForge — Generation Flow & Architecture

The app runs this flow every time a user generates a store. Antigravity must build toward THIS flow — don't drift.

## The 5 stages

### 1. INPUT → Store DNA
User picks a **niche** + answers a short questionnaire (store type, vibe/personality, brand feel, catalog
size, primary goal). Answers become the **Store DNA** — the input that drives everything downstream.

### 2. SELECTION ENGINE  ← the real IP / moat
From the DNA, the system decides the whole store. NOT random — rule-driven:
- niche → **blueprint** (style family + palette + section-mix + copy tone)
- blueprint → pick section types + a **variant** for each slot from the library
- **coherence filter** — avoid clashing combos (no maximal-editorial hero + loud-busy grid + neon CTA together)
- **catalog-adapt** — read the merchant's real assets: few products / no good hero image → pick layouts that
  still look right (e.g. centered hero instead of full-bleed). The preview runs on real content, so selection
  must fit that content or the preview breaks.
- pick **one token set** (colour + type + radius) for the whole store.

### 3. ASSEMBLY
Chosen sections → assembled onto the **chassis**, all sharing the **same token set** (one coherent look) →
templates composed (index/product/collection/cart) → merchant products/images wired in via Liquid objects.

### 4. PREVIEW — 3 genuinely different options
Generate **3 stores**, 3 previews, on the user's OWN products/images/content. The 3 must differ
**structurally** (different section-mix + style), not just recolours — so the user has a real choice.
Reject → generate 3 more (unlimited).

### 5. PUBLISH
User taps publish on the chosen preview. Publish:
1. compiles the selection into real theme files (chassis + chosen sections + token set + templates + products),
2. pushes to the user's Shopify store **as a DRAFT** (Theme API),
3. user reviews in Shopify admin, then sets it live themselves.
(Optionally the button offers: Publish as draft / Publish live / Download ZIP.)

## Architecture pieces

- **Chassis (base/skeleton theme)** — the part that is the SAME in every store: layout/theme.liquid,
  config, locales, required page templates, core JS, cart drawer, token-loader, product-card + PDP plumbing.
  Versioned; changes need a reviewed diff; excluded from bulk generation. **Only look-changing sections get
  swapped per store — everything common lives here, untouched.**
- **Section library** — the swappable premium sections (~30 variants per type). The variety source.
- **Token engine** — applies one colour/type/radius set across all sections (already built: loader reads a
  setting, token CSS in assets, 404-safe). This is the "same colour to all sections" step.
- **Blueprints** — per-niche recipes (style + palette + section-mix + copy). One shared library, many niches.
- **Selection engine** — the rules that turn DNA + catalog into a coherent, non-colliding, fitting store.
  This is the hardest and most valuable part — invest here, not in raw section count.

## What's already built vs to build
- BUILT: chassis, token engine, and a large section library (hero/header/category/offer/cards + more).
- TO BUILD: questionnaire, **selection engine**, 3-preview generator, publish/draft pipeline, and the
  remaining CRO sections (PDP suite, cart, overlays — see 03-SECTION-LIST.md).
