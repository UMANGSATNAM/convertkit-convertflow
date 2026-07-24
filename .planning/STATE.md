# Project State

## Current Operating Mode
**MODE 1 (Design-First & Manual Theme Assembly)**
- Pipeline execution (`Mode 2`) is **PAUSED**.
- Old `Phase 0` / `Redis mock flush` / `llmCaller wiring` / `upload bundle 106->47` / `brand token issues` are historical Mode 2 pipeline issues and are NOT active right now. Do not work on them.

## Current Reality & Active Status
- **Target Dev Theme:** `162941599973` (Live development on Shopify dev theme).
- **Storefront Access Password:** `uriepa`
- **Completed Components (Live Synced to Dev Theme):**
  - `header-commerce-v2.liquid` + `header-group.json`
  - `announcement-bar-v2.liquid`
  - `product-card.liquid` (with dark-slate branded fallback container)
  - `hero-commerce-v2.liquid` (with dark-slate branded fallback container and clean chip labels)
  - `featured-categories-v2.liquid` (with dark-slate branded fallback container)
  - `deals-v2.liquid` (with countdown and bestseller grid)
  - `why-choose-us-v2.liquid` (with clean SVGs instead of emojis, zero fabricated percentages/regulated claims)
  - `testimonials-commerce-v2.liquid` (with clean review blocks, no fake AI customer names/data)
  - `cta-band-v2.liquid` (with newsletter input and pill button)
  - `footer-commerce-v2.liquid` + `footer-group.json` (luxury multi-column footer)
  - `templates/index.json` (orchestrating all V2 sections)
- **Immediate Task:**
  - Verify and screenshot all completed homepage sections using the password `uriepa` on dev theme `162941599973` (desktop & mobile) and present for final user check.

## Guardrails against Context Resets
- Do NOT revert to `Mode 2` automated compilation tasks or `Phase 0` checkpoints unless explicitly instructed by the user.
- Always trust live session memory and user status over internal checkpoints when resuming across agent turn limits or resets.
