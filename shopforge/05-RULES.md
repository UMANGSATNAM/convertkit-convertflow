# ShopForge — Locked Build Rules

Binding on EVERY section/variant. A variant that breaks any rule is rejected.

## 0. Full design + architecture craft (above all)
Every variant is production-grade design, not a template fill. Apply full craft each time: exact design-system
values (not "make it nice"), deliberate typography/hierarchy/spacing, real restraint. If it would ship looking
generic/default-Shopify, it's NOT done. Must hold up next to CaratLane / GIVA / Sugar / Nykaa / Aesop.

## 1. Token-driven — no hardcoded values
Every colour, radius, shadow, spacing, font from `var(--...)` using the canonical token set. No hardcoded hex,
`border-radius: 8px`, or font-family. Text on a coloured background = `#fff` or `--text-on-accent`, NEVER
`--surface`. Luxury/blueprint-specific values (weight 400, radius 0, 700ms) are TOKENS so other blueprints override.

## 2. Structural variation, not cosmetic
Variants differ at layout level. Colour/spacing差 is the token layer's job — don't rebuild it as "variants".

## 3. Real data only — zero fabrication
Ratings, review counts, "Bestseller"/"New"/"Save ₹X", "X viewing", low-stock, scarcity render ONLY from real
merchant data (reviews metafield/app, compare_at_price, tags, inventory). Hidden if absent. Never fake trust
signals or urgency — it's a locked rule AND a trust-killer if caught.

## 4. Mobile-first responsive
Build mobile first, then desktop. Both crafted, not one squished. Tap targets ≥44px. Test on narrow width.

## 5. CRO-tested patterns
Where relevant: clear CTA (by intent — not loud-full-width by default), trust signals, hierarchy, sticky ATC
on PDP mobile, benefit-led copy, low friction. These are best-practice patterns; real lift is proven by live
A/B testing (don't claim guaranteed conversion).

## 6. Merchant content, catalog-adapt
Pull the merchant's own products/images live (Liquid objects). Missing image → neutral fallback (no dollar-art,
no client text). Section must adapt to real catalog (few products / no hero image → degrade gracefully).

## 7. Chassis discipline
The base/skeleton theme (layout, config, locales, required templates, core JS, cart, token-loader, PDP/card
plumbing) is the SAME in every store — versioned, changed only via reviewed diff, excluded from bulk generation.
Only look-changing sections get swapped. Common things stay in the chassis, untouched.

## 8. Prove one, then scale
Build ~2-3 variants of a section type, render-verify on a REAL preview link (Umang's eyes — not local-path
screenshots), confirm genuinely-distinct + premium, THEN scale to ~30. Count ≠ quality.

## 9. Editable output
Generated stores stay editable: proper `{% schema %}` with merchant-editable settings, theme-editor friendly,
and open to custom Liquid.
