# HERO — Variant Specs (Section 1 of the library)

Plug this into ANTIGRAVITY_PROMPT_TEMPLATE.md as **PART A** + **PART C**. PART B (locked rules) still applies.
These are **structural** specs (layout skeletons). Styling is described by token ROLE, not exact values —
Antigravity binds them to the confirmed canonical token names (see "Tokens required" below).

---

## PART A — Target

- **Section type:** hero
- **Design reference:** LUXURY-DESIGN-SYSTEM.md is the aesthetic for the LUXURY/beauty blueprint.
  (Layouts below are design-language-agnostic — same skeletons work under any future blueprint;
  only the token values change.)
- **Base structural spec (shared hero anatomy — every variant uses these elements):**
  - `eyebrow` — short uppercase label (e.g. "NEW RITUAL"). Tracked, muted. Optional per variant.
  - `headline` — main hero line. Heading font, light weight.
  - `subtext` — 1–2 lines. Body font, muted.
  - `primary_cta` — button. Optional `secondary_cta` (outline).
  - `media` — merchant image, pulled live (`section.settings.image` or first product/collection image).
    If absent → **neutral branded fallback** (no dollar-sign line-art, no client text).
  - `trust_strip` — optional tiny row (rating / "Free shipping" / payment) — **default hidden**, only if merchant fills it.
  - Load reveal: staggered eyebrow → headline → subtext → CTA (motion tokens), once, on load.

---

## PART C — The 6 structural variants

Each is **layout-level distinct**. Antigravity: match each to an existing pool file, normalize per PART B;
any variant with no good match in the pool = a real GAP to build new. Report matches vs gaps.

### hero-v1 — Split classic
- **Desktop:** 2 columns 50/50. Copy block left (eyebrow, headline, subtext, CTAs, optional trust strip), media right (full-height, `4:5` or fills column).
- **Mobile:** stack — media top, copy below (or copy top / media below; pick one, keep consistent).
- **Distinct:** balanced editorial split, text-led left.

### hero-v2 — Split reversed
- **Desktop:** 2 columns 50/50, media LEFT, copy RIGHT.
- **Mobile:** stack — copy top, media below.
- **Distinct:** mirror of v1; on a page it reads clearly different (visual rhythm flips).

### hero-v3 — Full-bleed editorial
- **Desktop:** media fills the whole hero (full-viewport-width, tall). Copy overlaid — bottom-left aligned block, or centered — with a subtle scrim/gradient behind text for legibility (scrim uses a token, not hardcoded black).
- **Mobile:** shorter viewport height; overlay copy stays legible (increase scrim on small screens).
- **Distinct:** immersive image-first, no columns. Needs a strong merchant image; if none → fall back to v4 layout automatically (no image = don't force full-bleed).

### hero-v4 — Centered minimal (no image)
- **Desktop:** no hero image. Centered column, `container-narrow` width. Large light headline, small tracked eyebrow above, subtext below, single centered CTA. Huge vertical whitespace (generous section padding).
- **Mobile:** same, centered, comfortable padding.
- **Distinct:** Aesop/Byredo quiet-luxury type-only hero. Also the graceful fallback when a store has no hero image.

### hero-v5 — Product-forward
- **Desktop:** copy block (top or left, compact) + a row of 2–3 **featured products** rendered inside the hero (uses the product-card snippet / a mini card). Products pulled live from a chosen collection.
- **Mobile:** copy top, products below as a horizontal scroll (snap).
- **Distinct:** commercial hero — merchandising above the fold. Adapts to catalog: if <2 products available, degrade to v1.

### hero-v6 — Asymmetric editorial
- **Desktop:** offset layout — copy in a ~40% column (left or right), media bleeds off the opposite edge (extends past container to viewport edge, or overlaps top). Eyebrow can sit offset/rotated. Intentional imbalance.
- **Mobile:** stack — media top (edge-to-edge), copy below with a slight indent.
- **Distinct:** magazine/fashion asymmetry — most "designed" of the set.

---

## Tokens required (Antigravity: confirm each EXISTS in the canonical set, or add + tell me the name)

Layout binds to these ROLES. Give me the exact canonical name for each before/at build:

- **Color:** `--primary` (CTA bg + ≤2 accent uses per screen), `--bg-base`, `--surface`, `--text-main`,
  `--text-muted`, `--border`, on-accent text = `#fff` or `--text-on-accent` (NEVER `--surface`).
- **Type:** `--font-heading` (headline — LIGHT weight), `--font-body`. Need canonical names for: display/heading
  **size scale**, **heading weight** (light), body **line-height/leading**.
- **Tracking:** eyebrow uppercase tracking token (design system had `--tracking-eyebrow: 0.2em`).
- **Spacing:** section vertical padding token (design system `--section-padding-y`, clamp 64–120px),
  container max + `container-narrow` (~720px for v4), internal gap/space scale.
- **Radius:** button radius token (`--radius-btn`; luxury blueprint = sharp/0, but token-driven so other blueprints can round).
- **Shadow:** if used, a shadow token (not hardcoded).
- **Motion:** `--motion-duration`, `--motion-easing`, stagger token — for the load reveal.
- **Scrim (v3):** an overlay token for text-on-image legibility (not hardcoded rgba black).

**If any of these has no canonical token, that's a token GAP — surface it now; do not hardcode a fallback value.**

---

## Delivery / proof (per PART D of the template)

1. For each of the 6: the `.liquid` (matched-from-pool + normalized, or newly built if gap), + `{% schema %}` with merchant-editable settings.
2. Self-check per variant: grep clean (no hardcoded hex/radius), token names match canonical, responsive both breakpoints, neutral defaults, merchant image + fallback works.
3. **Render proof (Umang's eyes):** a real `theme dev` / `theme share` / admin-preview **link** (not local-path screenshots) showing at least the 2 most contrasting variants (e.g. hero-v3 full-bleed vs hero-v4 centered-minimal) so the structural difference is visibly proven.
4. Report per variant: **matched from pool** (which file) or **built new (gap)**.
