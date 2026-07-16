# Shop Forge — Luxury Design System (Beauty/Jewellery direction)

> The reason the store looks generic isn't missing sections — it's imprecise design values. "Make it premium" produces generic results. Exact values produce premium results.
>
> Reference brands (study these, match the restraint): **Aesop, Byredo, Le Labo, Forest Essentials, Nykaa Luxe, GIVA**. Notice: huge whitespace, small refined type for UI, large light display type for headings, almost no color, one accent used sparingly.

---

## THE CORE PRINCIPLE OF LUXURY: RESTRAINT

Cheap stores are loud: big bold text everywhere, accent color on everything, tight spacing, many elements competing. Luxury stores are quiet: **one thing at a time, huge space around it, thin elegant type, color used once per screen.** Every change below moves toward restraint.

---

## 1. TYPOGRAPHY — the single biggest lever

The current PDP title is in a bold sans-serif. That alone makes it look like Amazon. Fix the type system:

```css
:root {
  /* Display — Playfair Display, LIGHT weight, large. This is the luxury signal. */
  --font-heading-family: 'Playfair Display', Georgia, serif;
  --font-body-family: 'Inter', -apple-system, sans-serif;

  /* Weights — luxury headings are LIGHT (400), never bold (700) */
  --weight-display: 400;
  --weight-heading: 500;
  --weight-body: 400;
  --weight-emphasis: 600;

  /* Scale — larger display, refined body */
  --font-display: clamp(2.75rem, 5.5vw, 4.5rem);   /* hero */
  --font-h1: clamp(2rem, 4vw, 3rem);               /* PDP title, section titles */
  --font-h2: clamp(1.5rem, 3vw, 2.25rem);
  --font-h3: 1.25rem;
  --font-body: 1rem;
  --font-small: 0.8125rem;
  --font-eyebrow: 0.6875rem;                        /* 11px — small, tracked */

  /* Tracking — THIS is what makes it feel expensive */
  --tracking-eyebrow: 0.2em;    /* uppercase labels — wide luxury spacing */
  --tracking-display: -0.01em;  /* large serif — slightly tight */
  --tracking-body: 0;

  /* Leading */
  --leading-display: 1.1;
  --leading-body: 1.65;         /* generous body leading = editorial feel */
}
```

**Rules:**
- **Product title, hero heading, section titles → Playfair Display, weight 400-500, NEVER 700.** Light large serif = luxury. Bold = mass-market.
- **Eyebrows/labels ("PERI BEAUTY", "THE RITUAL", "NEW ARRIVALS") → 11px, uppercase, `letter-spacing: 0.2em`, `--color-text-muted`.** The wide tracking is the entire trick.
- **Body → Inter 400, `line-height: 1.65`.** Generous leading reads as editorial.
- **Price → NOT bold.** `--font-h3`, weight 400, `--color-text`. A heavy price looks cheap. "₹145" should sit quietly.

---

## 2. SPACING — luxury = air

```css
:root {
  --space-2: 2px;  --space-4: 4px;   --space-8: 8px;
  --space-12: 12px; --space-16: 16px; --space-24: 24px;
  --space-32: 32px; --space-48: 48px; --space-64: 64px;
  --space-80: 80px; --space-96: 96px; --space-120: 120px;

  /* Section vertical padding — LUXURY is generous */
  --section-padding-y: clamp(64px, 10vw, 120px);   /* was 60px flat — too tight */

  /* Max content width — luxury never goes full 1400px edge to edge */
  --container-max: 1280px;
  --container-narrow: 720px;   /* for text-only sections — narrow = elegant */
  --gutter: clamp(20px, 5vw, 64px);
}
```

**Rules:**
- Section vertical padding minimum **80px desktop**, ideally 120px for hero-adjacent sections. The current cramped feel comes from 60px everywhere.
- Text blocks (brand story, etc.) constrained to `--container-narrow` (720px) and centered. Wide paragraphs read cheap; narrow columns read editorial.
- Space between PDP info blocks: **`--space-32` minimum.** Let each element breathe.

---

## 3. COLOR — one accent, used once

```css
:root {
  --color-background: #FAF9F6;   /* warm ivory, never pure white */
  --color-surface: #F4F2ED;      /* subtle warm surface */
  --color-text: #1A1A1A;         /* near-black, not pure black */
  --color-text-muted: #6B6B6B;   /* refined grey for eyebrows/meta */
  --color-border: #E5E1D8;       /* warm hairline border */
  --color-accent: #800020;       /* burgundy — used ONLY on: price, CTA, active states */

  /* Never: accent on body text, headings, labels, borders (except active) */
}
```

**The discipline:** on any given screen, the accent (burgundy) should appear on **at most 2-3 elements** — the primary CTA, the price, maybe an active swatch. Everything else is ivory/charcoal/grey. Right now accent is everywhere; that's why it looks busy.

---

## 4. ANNOUNCEMENT BAR — refined, not a sale banner

Current: looks like a generic sale strip. Luxury version:

```css
.sf-announcement {
  background: var(--color-text);        /* charcoal, not accent */
  color: var(--color-background);        /* ivory text */
  font-family: var(--font-body-family);
  font-size: var(--font-eyebrow);        /* 11px */
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-align: center;
  padding: var(--space-12) var(--gutter);
  font-weight: 500;
}
```

- Charcoal background + ivory text + tracked uppercase = quiet luxury. **Not** burgundy, not loud, not big.
- Content: "COMPLIMENTARY SHIPPING PAN-INDIA · COD AVAILABLE" — refined phrasing, not "BUY 4 GET 1 FREE!!!".
- If rotating, fade transition (not slide), 5s interval.

---

## 5. HEADER — transparent, minimal, elegant

```css
.sf-header {
  position: absolute;   /* overlays hero */
  top: var(--space-12); /* sits below announcement */
  width: 100%;
  padding: var(--space-24) var(--gutter);
  display: grid;
  grid-template-columns: 1fr auto 1fr;  /* nav | logo centered | actions */
  align-items: center;
  z-index: 100;
}
.sf-header__logo {
  font-family: var(--font-heading-family);
  font-size: 1.5rem;
  font-weight: 400;              /* light serif logo */
  letter-spacing: 0.05em;
  text-align: center;
}
.sf-header__nav a {
  font-size: var(--font-eyebrow);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-text);
  font-weight: 500;
  margin-right: var(--space-32);
}
/* On scroll: JS adds .is-scrolled */
.sf-header.is-scrolled {
  position: fixed;
  background: rgba(250, 249, 246, 0.92);
  backdrop-filter: blur(12px);
  top: 0;
  padding: var(--space-16) var(--gutter);
  box-shadow: 0 1px 0 var(--color-border);
  transition: all var(--motion-duration) var(--motion-easing);
}
```

- **Logo centered, serif, light.** Nav uppercase tracked on the left, cart/search on right. This 3-column centered-logo layout is the luxury standard (Aesop, Byredo).
- Transparent over hero → on scroll, frosted ivory with blur. Smooth.
- Nav items: uppercase, 11px, 0.15em tracking, generous gap.

---

## 6. PDP TITLE + PRICE — the fixes you saw

```css
.pdp-vendor {                    /* eyebrow */
  font-size: var(--font-eyebrow);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-12);
}
.ptitle {
  font-family: var(--font-heading-family);   /* PLAYFAIR — this was the bug */
  font-size: var(--font-h1);                  /* large */
  font-weight: 400;                           /* LIGHT, not bold */
  letter-spacing: -0.01em;
  line-height: 1.15;
  color: var(--color-text);
  margin-bottom: var(--space-16);
}
.pprice {
  font-family: var(--font-body-family);
  font-size: var(--font-h3);                  /* refined, not huge */
  font-weight: 400;                           /* NOT bold */
  color: var(--color-text);
  letter-spacing: 0;
}
.pprice__compare { color: var(--color-text-muted); text-decoration: line-through; margin-left: var(--space-8); }
.pprice__save { color: var(--color-accent); font-size: var(--font-small); margin-left: var(--space-8); }
```

---

## 7. BUTTONS — minimal luxury

```css
.btn-add {                       /* primary CTA */
  background: var(--color-accent);
  color: var(--color-background);
  font-family: var(--font-body-family);
  font-size: var(--font-small);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: var(--space-16) var(--space-32);
  border: none;
  border-radius: 0;              /* SHARP corners = luxury. Rounded = friendly/cheap */
  cursor: pointer;
  transition: opacity var(--motion-duration) var(--motion-easing);
  min-height: 52px;              /* generous, confident */
}
.btn-add:hover { opacity: 0.85; }
.btn-buy {                       /* secondary — outline */
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-text);
  border-radius: 0;
  /* same padding/type as .btn-add */
}
```

- **Sharp corners (radius 0 or 2px max).** Rounded buttons read as consumer-app; sharp reads as fashion/luxury.
- Uppercase, tracked, 52px tall. Confident, not cramped.
- Hover = subtle opacity shift, not a color change.

---

## 8. MOTION — one orchestrated reveal, not scattered

Per the design skill: high-impact staggered page-load reveal > scattered micro-interactions.

```css
:root {
  --motion-duration: 700ms;      /* LUXURY = slow, unhurried */
  --motion-easing: cubic-bezier(0.22, 1, 0.36, 1);   /* ease-out-expo — expensive feel */
  --motion-distance: 24px;
  --motion-stagger: 80ms;
}
```

- Hero content: staggered reveal on load — eyebrow, then title, then subtext, then CTA, each 80ms apart. This one orchestrated moment sells the whole page.
- Sections below: fade + rise on scroll, once.
- Product cards: image scale 1.03 on hover (subtle), card doesn't move.
- **Keep it slow.** 700ms. Luxury is never in a hurry.

---

## 9. IMAGES — editorial treatment

- **Aspect ratios:** hero 16:9 or full-viewport; product 4:5 (portrait, fashion standard); lookbook 3:4.
- **No pure-white product cutouts in editorial slots** — those go in the grid. Hero/story/lookbook get lifestyle/texture shots on warm backgrounds.
- Subtle treatment: `filter: saturate(0.95)` for a refined, less "stock photo" look (optional, test it).
- Fixed aspect ratio containers → zero CLS.

---

## PRIORITY ORDER (do in this sequence)

1. **Typography** (§1, §6) — title to Playfair light, eyebrows tracked, price un-bolded. **80% of the "premium" jump is here.**
2. **Spacing** (§2) — increase section padding to 80-120px, add air between PDP blocks.
3. **Buttons** (§7) — sharp corners, uppercase tracked, taller.
4. **Announcement + Header** (§4, §5) — charcoal bar, centered serif logo, scroll-frost.
5. **Color discipline** (§3) — audit that accent appears ≤3 times per screen.
6. **Motion** (§8) — slow the reveals to 700ms, add hero load stagger.
7. **Images** (§9) — fix PDP gallery pulling real product media; editorial aspect ratios.

Every value above is exact and copy-paste ready. Apply them as design tokens so all ~190 components inherit the system.
