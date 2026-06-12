# DESIGN.md — StoreForge
## Design System & UI Specification

---

## 1. DESIGN PRINCIPLES

1. **Merchant never sees code.** No words like CSS, Liquid, JSON, schema anywhere in UI copy.
2. **One primary action per screen.** Every screen answers "what should I do next?"
3. **Show, don't describe.** Previews everywhere — sections, design changes, campaigns, AI actions all render visually before applying.
4. **Reversible by default.** Every mutating action shows Undo within reach. Confidence = adoption.
5. **India-native, not India-themed.** Hindi as a first-class locale, INR formatting (₹1,29,999), IST times, festival awareness — without stereotype visuals.
6. **Polaris-native.** The app must feel like Shopify built it. No custom design system fighting Polaris.

## 2. ADMIN APP (POLARIS) — VISUAL LANGUAGE

- **Components:** Polaris latest only. Page, Layout, Card, IndexTable, Banner, Modal, Toast, ProgressBar, Badge, EmptyState. Custom components only where Polaris has no primitive (score dial, live progress checklist, chat UI, before/after slider).
- **Brand accent (sparingly):** StoreForge saffron `#F46C38` (heritage from Sawad system) used ONLY for: logo, celebration moments (confetti, success illustrations), plan badges. All functional UI = Polaris tokens.
- **Typography:** Polaris defaults (Inter stack). Hindi UI: Noto Sans Devanagari fallback chain.
- **Iconography:** Polaris icons; custom icons (section category glyphs) as 20px inline SVG, 1.5px stroke, rounded caps.
- **Illustration:** flat, 2-color (saffron + slate), used in empty states + wizard success. No stocky 3D blobs.
- **Tone of voice:** warm, direct, zero jargon. ✅ "Your hero image is 2.4MB — that's why mobile feels slow." ❌ "Asset exceeds recommended payload threshold."
- **Hinglish copy register (hi locale):** natural Hinglish, not literal translation. "Store taiyaar ho raha hai…" not "भंडार उत्पन्न हो रहा है".

## 3. KEY SCREENS

### Dashboard
- Header: store name + niche badge + plan badge
- Row 1: Health score dial + "Fix 3 issues" CTA | Quick actions (Add section / New campaign / Ask AI)
- Row 2: Setup checklist (until 100%): Generate store → Enable 3 toolkit features → Connect pixel → First campaign
- Row 3: AI Assistant inline prompt box ("Try: 'homepage pe festive banner lagao'")
- Festival nudge banner when within 21 days of a retail-calendar event

### Generator Wizard
- Full-width focused flow (no app nav), step indicator 1–4, Back always available pre-generation
- Niche cards: 3:2 preview image, name (en+hi), "See live demo ↗"
- Brand step: two-column — controls left, live brand-preview card right (logo on color, font sample, button sample) updating instantly
- Progress screen: vertical checklist, each step icon: ⏳ spinner / ✓ green / ⚠ amber; sub-detail line ("Importing products… 18/24"); elapsed timer; "This takes about 6–8 minutes — you can leave, we'll email you" note
- Done: confetti (2s, once), screenshot thumbnail of THEIR homepage, three CTA cards

### Section Gallery
- Filter bar: Category pills + Goal dropdown + Search; plan-lock 🔒 overlay on gated cards
- Card: live-render thumbnail (not mockup), name, category tag, "Works with your theme ✓"
- Preview modal: full-width iframe (demo store + that section), mobile/desktop toggle, [Add to theme]

### Design Studio
- Split view: control panels left (340px), storefront preview iframe right (device toggle)
- Color controls: palette preset swatches row + custom pickers; live contrast badge (AA pass/fail)
- History drawer: right slide-in, timeline entries "Primary color → #8B0000 • 2:14 PM • [Restore]"

### Toolkit
- 8 cards grid (2×4 desktop, 1-col mobile): icon, name, one-line value, toggle, [Configure], ●Active badge
- Config drawers: defaults pre-filled, live mini-preview where feasible (badge strip, announcement bar)

### Campaigns
- Calendar view (month) with festival markers + list view toggle
- Builder: left form / right live preview iframe; publish button disabled until preview rendered once

### Health
- Score dial (donut, color-banded: red <50, amber 50–79, green 80+), sparkline 12 weeks
- Issue rows: severity dot, plain-language title, target thumbnail (image issues), [Fix] / [How to fix]
- Fix-all bar: "12 safe fixes available — [Fix all] (creates backup first)"

### AI Assistant
- Chat: merchant bubbles right, AI left; tool actions render as **Action Cards**: thumbnail/diff, summary lines, [Apply] [Discard]; applied card flips to result state with [View] [Undo]
- Batch review: table of per-item diffs with checkboxes, [Apply selected]
- Quota meter (GROWTH) subtle under input

## 4. STOREFRONT SECTIONS — DESIGN RULES (ALL 120)

- **Inherit-first theming:** default colors/typography from theme settings; explicit overrides optional per section. A section dropped into ANY theme must look native immediately.
- **Spacing system:** every section exposes top/bottom padding range (0–100px, step 4) mapped to CSS custom props; internal spacing on a 4px scale.
- **Type scale:** heading sizes via clamp() responsive scale; never fixed px headings.
- **Imagery:** aspect-ratio boxes always declared (CLS-safe); `image_url` srcset widths [360, 540, 720, 1080, 1440]; lazy by default, eager only for first hero.
- **Motion:** CSS-only, ≤300ms, transform/opacity only, fully disabled under `prefers-reduced-motion`; animation toggle in every schema.
- **Mobile-first:** designed at 360px first; desktop is the enhancement. Touch targets ≥44px.
- **India specifics:** INR formatting via `money` filter respect; Devanagari-safe line-heights (1.6 body); festival sections use tasteful palettes (deep maroon/gold for Diwali, pastel for Rakhi) — preset-driven, merchant-overridable.
- **Accessibility:** semantic headings hierarchy per section (schema heading-level selector), alt text fields mandatory in schema for every image picker, focus-visible styles, color contrast AA on defaults.

## 5. EMAIL DESIGN (RESEND)

- Single-column 600px, logo header, saffron accent buttons, system font stack
- Templates: Welcome, Generation complete (with homepage screenshot), Weekly health digest, Festival campaign nudge, Trial ending, Offboarding care guide
- All templates en + hi variants; merchant language from Shop.language

## 6. MARKETING SITE (storeforge.app) — DIRECTION ONLY

- Dark editorial base (Sawad lineage), saffron accent, big type, real product screen recordings (no fake mockups)
- Hero: the 90-sec generation video autoplaying muted
- Pricing in INR with "vs hiring a developer" comparison table
- 10 live demo stores linked (one per niche)
