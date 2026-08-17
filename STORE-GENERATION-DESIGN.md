# Store Generation — how it should work

The goal: a merchant picks a niche, and the engine assembles a complete store —
home, product, collection, cart, and supporting pages — that reads as one designed
brand rather than a pile of sections.

This document describes the gap between that and today, and the order to close it.

---

## The core problem right now

All 1,641 sections synced from `dev-theme-peri` carry identical metadata:

```json
{ "family": "Universal",
  "archetypes": ["premium","modern","clinical","organic","bold"],
  "visualStyle": "<guessed from filename>" }
```

The retrieval engine scores on four axes — compatibility 30, performance 30,
archetype match 20, diversity 20. With identical archetypes on every synced
section, the archetype axis returns a flat score for all of them. The 70
hand-written components have real metadata and win every time:

```
hero-storytelling-luxury-v2   79   (archetype = 20)   hand-written
hp1-brand-story               63   (archetype =  0)   synced
```

So the engine picks from 70 components while 1,641 sit unused. That is why the
first generated store looked generic. **Everything below depends on fixing this
first.**

---

## Phase A — Give every section real metadata

Nothing else matters until this is done.

Each section needs three things derived from what it actually contains, not from
its filename:

| Field | How to derive it | Used for |
| :--- | :--- | :--- |
| `visualStyle` | Fonts, border radius, colour palette, casing in the section's own CSS | Style coherence |
| `industries` | Default copy and imagery it ships with, e.g. "botanical serum" → beauty | Niche match |
| `archetypes` | Density, contrast, ornamentation — luxury is airy and serif; bold is tight and heavy | Brand fit |

A practical way to derive these without hand-tagging 1,641 files:

1. **Extract signals per section** — font families, border-radius values, colour
   hex values, text-transform, animation presence, spacing scale.
2. **Cluster into style families.** Sections sharing a font pairing and radius
   scale belong together. This is what makes a generated store look coherent —
   picking a hero and a footer from the same cluster.
3. **Read the schema defaults for industry words.** A section defaulting to
   "Shop Iberian Terracotta" is home-decor; "Botanical Ritual" is beauty.
4. **Write the result into both `registry.json` and `compatibility.json`.**
   The retrieval engine reads compatibility for the archetype axis.

The sync script should do this automatically so it never drifts again.

**Done when:** the same query returns different winners for a beauty store and a
streetwear store, and the archetype axis is non-zero for synced sections.

---

## Phase B — Style family lock

A store that picks a luxury hero, a brutalist footer and a playful product grid
looks broken even when every section is individually good.

Rule: **once the hero is chosen, every other section for that store must come from
the same style family.** The retrieval engine already supports exclusion; it needs
a positive constraint too.

Implementation: after the hero resolves, pass its `visualStyle` and `family` as a
hard filter for every subsequent lookup on that store. Fall back to the next
closest family only when a slot has no candidate in the locked family.

This single rule is the difference between "AI-generated" and "designed".

---

## Phase C — Complete page coverage

Today the blueprint produces three templates. A real store needs more.

| Template | Status | What it needs |
| :--- | :--- | :--- |
| `index` | done | already 11 sections |
| `product` | done | 7 sections |
| `collection` | done | 4 sections |
| `cart` | base only | upsells, trust, free-shipping progress |
| `search` | base only | results grid + no-results recovery |
| `404` | base only | bestsellers grid to recover the visit |
| `page.about` | missing | brand story, founder, stats |
| `page.contact` | missing | form, WhatsApp, support hours |
| `page.faq` | missing | searchable accordion |
| `blog` / `article` | base only | in-article product CTA |
| `list-collections` | done | built this session |

Each of these is a small blueprint addition — an array of section types — plus the
same `resolvePage()` call the product and collection pages already use.

---

## Phase D — Design tokens per niche

Sections read colours and fonts from theme settings. Those settings should come
from the niche profile, not from defaults.

`app/data/templates/theme-engine/niche-profiles/` already holds beauty,
electronics, home-decor, jewellery and streetwear. Each should define:

- colour roles: background, surface, text, accent, sale, star, border
- font pairing: heading and body
- radius scale and shadow depth
- section density: airy for luxury, tight for value

The pipeline already has a contrast guard that falls back to white/black when the
derived pair fails 4.5:1. Keep it — but the niche profile should rarely trigger it.

---

## Phase E — Content that is actually about the store

Two failures showed up in the first run:

1. **AI copy returned 404** — the model string was dead. Fixed; the fallback path
   is what produced "Jane Doe", "Eleanor Vance" and "@yourbrand".
2. **The fallback is too thin.** When AI copy fails, niche copy should still fill
   every visible field. Any field it does not cover shows the section's schema
   default, which is placeholder text.

The compiler already warns about this:

```
[WARNING] Unfilled placeholder found: "YOUR BRAND" in sections/main-product.liquid
```

Treat that warning as a build failure, not a soft warn. A store that ships with
"YOUR BRAND" visible is worse than one that fails loudly.

---

## Phase F — Verify what a person would see

The lesson from the `color_modify` incident applies to the whole pipeline:
structural checks pass while the rendered page is broken.

After each generation, check the rendered store for:

- placeholder names: "Jane Doe", "Eleanor Vance", "@yourbrand", "YOUR BRAND",
  "Jewelry Item", "Lorem"
- prices in the wrong currency, or prices that do not match the cart
- stock illustrations where product images should be
- sections that render empty because their collection setting is unset
- a homepage where the hero and footer clearly belong to different brands

A script can catch the first four by fetching the storefront HTML and grepping.
The fifth needs eyes.

---

## Order of work

```
A  metadata           ← nothing works without this
B  style family lock  ← what makes it look designed
C  page coverage      ← what makes it a store, not a homepage
D  niche tokens       ← colour and type coherence
E  content quality    ← removes the last placeholders
F  rendered checks    ← keeps it honest
```

A and B together are the difference between the current output and something that
reads like a real brand. C, D and E are additive. F is what stops a regression
from reaching a merchant.

---

## Known open items from the first generation run

- `themes/` was deleted during cleanup and held `ethnic-wear/catalog.json`, which
  the demo product import needs. Restored — do not delete it again.
- `ANTHROPIC_MODEL` default was a dead model string. Now `claude-sonnet-5`. Set
  `ANTHROPIC_MODEL` in `.env` to pin it explicitly.
- 1,045 images across the theme still lack `width`/`height`, which causes layout
  shift. Not a blocker for generation, but it will show up in Lighthouse CLS.
- One `LiquidHTMLSyntaxError` reported by Theme Check was never located.
- The storefront screenshot taken during upload showed no CSS because only 3 of 6
  file batches had uploaded. Re-check after upload completes before treating it
  as a bug.
