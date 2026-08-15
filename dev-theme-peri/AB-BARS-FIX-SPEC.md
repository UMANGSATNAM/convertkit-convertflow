# Spec — Fix Announcement Bars ab-v11 → ab-v40 (30 files)

## Problem

`ab-v4` to `ab-v40` were built with schema settings declared but **never wired into the markup or CSS**:

- Colors are hardcoded in `<style>` → changing `bg_color` / `text_color` in the customizer does nothing
- Message text is hardcoded in HTML → merchant cannot edit it at all
- No link, no promo code, no dismiss, no `@media` (broken on 375px)

**Already fixed (do not touch):** `ab-v4`, `ab-v5`, `ab-v6`, `ab-v7`, `ab-v8`, `ab-v9`, `ab-v10`
**Remaining:** `ab-v11` → `ab-v40` (30 files)

Reference implementation: **`sections/ab-v4.liquid`** — copy its structure exactly.

---

## Rules

1. **One file at a time.** Finish, verify, then next. **NEVER run a Python/regex script over multiple files.**
2. **Preserve the design DNA exactly** — the font family, weight, letter-spacing, text-transform, border style, and default colors listed in the table below must stay identical. Only wiring changes.
3. Every visual value comes from `section.settings`. Zero hardcoded colors, zero hardcoded text.
4. Class prefix stays `.abv{N}` (no dash) — do not rename, templates reference it.

---

## Required template (replace `{N}` with the version number)

```liquid
{% comment %}
  AB V{N} — {DESIGN NAME}
{% endcomment %}
{%- assign s = section.settings -%}
<style>
  .abv{N} {
    background: {{ s.bg_color }}; color: {{ s.text_color }};
    font-family: {FONT_STACK}; font-size: {{ s.font_size }}px; font-weight: {WEIGHT};
    {EXTRA_TYPE}
    min-height: {{ s.bar_height }}px; display: flex; align-items: center; justify-content: center;
    gap: 14px; padding: 6px 40px; text-align: center; position: relative; z-index: 100;
    border-bottom: {BORDER_STYLE} {{ s.accent_color }};
  }
  .abv{N}__msg { text-decoration: none; color: inherit; }
  .abv{N}__code { background: {{ s.text_color }}; color: {{ s.bg_color }}; padding: 3px 10px; border-radius: {RADIUS};
    font-size: 0.9em; font-weight: 800; font-family: inherit; border: none; cursor: pointer; white-space: nowrap; }
  .abv{N}__close { position: absolute; right: 8px; background: none; border: none; color: inherit;
    cursor: pointer; opacity: 0.6; font-size: 18px; line-height: 1; padding: 8px; }
  .abv{N}__close:hover { opacity: 1; }
  @media screen and (max-width: 749px) {
    .abv{N} { font-size: {{ s.font_size | minus: 1 }}px; padding: 8px 40px 8px 12px; flex-wrap: wrap; gap: 8px; }
    .abv{N}__close { min-width: 44px; min-height: 44px; right: 0; }
  }
</style>

{%- if s.enable -%}
<div class="abv{N}" id="abv{N}-{{ section.id }}" role="region" aria-label="Announcement">
  {%- if s.link != blank -%}
    <a class="abv{N}__msg" href="{{ s.link }}">{{ s.message }}</a>
  {%- else -%}
    <span class="abv{N}__msg">{{ s.message }}</span>
  {%- endif -%}
  {%- if s.promo_code != blank -%}
    <button class="abv{N}__code" type="button" data-code="{{ s.promo_code }}">{{ s.promo_code }}</button>
  {%- endif -%}
  {%- if s.dismissible -%}
    <button class="abv{N}__close" type="button" aria-label="Close announcement">&times;</button>
  {%- endif -%}
</div>
<script>
  (function () {
    var bar = document.getElementById('abv{N}-{{ section.id }}');
    if (!bar) return;
    var key = 'abv{N}-dismissed-{{ section.id }}';
    {%- if s.dismissible -%}
    try { if (localStorage.getItem(key) === '1') bar.style.display = 'none'; } catch (e) {}
    var close = bar.querySelector('.abv{N}__close');
    if (close) close.addEventListener('click', function () {
      bar.style.display = 'none';
      try { localStorage.setItem(key, '1'); } catch (e) {}
    });
    {%- endif -%}
    var chip = bar.querySelector('.abv{N}__code');
    if (chip && navigator.clipboard) chip.addEventListener('click', function () {
      var original = chip.textContent;
      navigator.clipboard.writeText(chip.getAttribute('data-code')).then(function () {
        chip.textContent = 'Copied!';
        setTimeout(function () { chip.textContent = original; }, 1500);
      });
    });
  })();
</script>
{%- endif -%}

{% schema %}
{
  "name": "{SCHEMA NAME — max 25 chars}",
  "settings": [
    { "type": "checkbox", "id": "enable", "label": "Show bar", "default": true },
    { "type": "text", "id": "message", "label": "Message", "default": "{ORIGINAL MESSAGE}" },
    { "type": "url", "id": "link", "label": "Message link" },
    { "type": "text", "id": "promo_code", "label": "Promo code chip (tap to copy)" },
    { "type": "checkbox", "id": "dismissible", "label": "Allow visitors to close", "default": false },
    { "type": "header", "content": "Style" },
    { "type": "color", "id": "bg_color", "label": "Background", "default": "{BG}" },
    { "type": "color", "id": "text_color", "label": "Text Color", "default": "{TEXT}" },
    { "type": "color", "id": "accent_color", "label": "Border", "default": "{ACCENT}" },
    { "type": "range", "id": "font_size", "min": 10, "max": 20, "step": 1, "unit": "px", "label": "Font size", "default": {FS} },
    { "type": "range", "id": "bar_height", "min": 30, "max": 70, "step": 2, "unit": "px", "label": "Bar height", "default": {H} }
  ],
  "presets": [{ "name": "{SCHEMA NAME}" }]
}
{% endschema %}
```

---

## Per-file values (do not change these — this is the existing design DNA)

| # | Design name | Font stack | Weight | Extra type CSS | Border | BG | Text | Accent | FS | H |
|---|---|---|---|---|---|---|---|---|---|---|
| 11 | Neo-Brutalist Hazard | `'Arial Black', sans-serif` | 900 | `text-transform: uppercase; letter-spacing: 1px;` | `3px solid` | `#FFE600` | `#000000` | `#000000` | 13 | 44 |
| 12 | Jewelry Atelier | `'Playfair Display', Georgia, serif` | 400 | `letter-spacing: 1px;` | `1px solid` | `#1E1B4B` | `#EEF2FF` | `#4338CA` | 13 | 42 |
| 13 | Eco Wool Footwear | `'Inter', sans-serif` | 600 | — | `1px solid` | `#EDF2F7` | `#1A202C` | `#CBD5E0` | 12 | 38 |
| 14 | Artisanal Espresso | `Georgia, serif` | 700 | — | `1px solid` | `#451A03` | `#FEF3C7` | `#78350F` | 13 | 40 |
| 15 | Tactical Expedition | `'Courier New', monospace` | 700 | `text-transform: uppercase;` | `2px solid` | `#1C1917` | `#E7E5E4` | `#44403C` | 12 | 42 |
| 16 | K-Beauty Dewy | `'Inter', sans-serif` | 700 | — | `1px solid` | `#FDF2F8` | `#DB2777` | `#F472B6` | 13 | 40 |
| 17 | Pet Nutrition | `'Inter', sans-serif` | 800 | — | `1px solid` | `#FFF7ED` | `#9A3412` | `#C86D51` | 13 | 42 |
| 18 | Smart Home IoT | `'Inter', sans-serif` | 700 | — | `1px solid` | `#ECFEFF` | `#0891B2` | `#06B6D4` | 12 | 40 |
| 19 | Sourdough Bakery | `Georgia, serif` | 700 | — | `1px dashed` | `#FFFBEB` | `#92400E` | `#78350F` | 13 | 40 |
| 20 | Retro 8-Bit Arcade | `'Courier New', monospace` | 900 | `text-transform: uppercase;` | `2px solid` | `#F5F3FF` | `#6D28D9` | `#8B5CF6` | 12 | 42 |
| 21 | Clinical Derma Lab | `'Inter', sans-serif` | 700 | — | `1px solid` | `#F0F9FF` | `#0369A1` | `#0284C7` | 13 | 40 |
| 22 | Pro Activewear | `'Inter', sans-serif` | 800 | `text-transform: uppercase;` | `1px solid` | `#FEF2F2` | `#991B1B` | `#7F1D1D` | 13 | 42 |
| 23 | Herbal Tea Infusions | `Georgia, serif` | 700 | — | `1px solid` | `#F0FDF4` | `#166534` | `#15803D` | 13 | 40 |
| 24 | Luxury Timepieces | `'Inter', sans-serif` | 700 | `letter-spacing: 1.5px; text-transform: uppercase;` | `1px solid` | `#0F172A` | `#F8FAFC` | `#1E293B` | 12 | 42 |
| 25 | Eco Refill Tablets | `'Inter', sans-serif` | 700 | — | `1px solid` | `#CCFBF1` | `#0F766E` | `#0D9488` | 13 | 40 |
| 26 | Gourmet Hot Sauce | `Impact, 'Arial Black', sans-serif` | 400 | `letter-spacing: 1px; text-transform: uppercase;` | `2px solid` | `#FEF2F2` | `#B91C1C` | `#991B1B` | 15 | 44 |
| 27 | Japanese Washi | `'Inter', sans-serif` | 600 | — | `1px solid` | `#F8FAFC` | `#334155` | `#CBD5E1` | 12 | 38 |
| 28 | Electrolyte Hydration | `'Inter', sans-serif` | 800 | — | `1px solid` | `#E0F2FE` | `#0369A1` | `#0284C7` | 13 | 40 |
| 29 | Handcrafted Leather | `Georgia, serif` | 700 | — | `1px solid` | `#FEF3C7` | `#78350F` | `#92400E` | 13 | 42 |
| 30 | Baby Organic Cotton | `'Inter', sans-serif` | 700 | — | `1px solid` | `#FFF1F2` | `#E11D48` | `#F472B6` | 13 | 40 |
| 31 | Running Performance | `'Inter', sans-serif` | 700 | — | `2px solid` | `#334155` | `#F8FAFC` | `#84CC16` | 13 | 42 |
| 32 | Artisanal Gelato | `'Inter', sans-serif` | 800 | — | `1px solid` | `#FDF2F8` | `#BE185D` | `#EC4899` | 13 | 40 |
| 33 | Cyberpunk Keyboards | `'Courier New', monospace` | 700 | `text-transform: uppercase;` | `2px solid` | `#18181B` | `#06B6D4` | `#0891B2` | 12 | 42 |
| 34 | Niche Perfumery | `'Playfair Display', Georgia, serif` | 400 | — | `1px solid` | `#EEF2FF` | `#3730A3` | `#312E81` | 13 | 40 |
| 35 | Tuscan Olive Oil | `Georgia, serif` | 700 | — | `1px solid` | `#F7FEE7` | `#4D7C0F` | `#65A30D` | 13 | 40 |
| 36 | Bamboo Eyewear | `'Inter', sans-serif` | 700 | — | `1px solid` | `#FEFCE8` | `#854D0E` | `#A16207` | 12 | 38 |
| 37 | Nootropics Focus | `'Inter', sans-serif` | 800 | — | `1px solid` | `#F5F3FF` | `#6D28D9` | `#7C3AED` | 13 | 40 |
| 38 | Craft Keyboards | `'Courier New', monospace` | 700 | — | `1px solid` | `#F1F5F9` | `#0F172A` | `#94A3B8` | 12 | 40 |
| 39 | Selvedge Denim | `'Inter', sans-serif` | 800 | — | `2px solid` | `#EFF6FF` | `#1E40AF` | `#1E3A8A` | 13 | 42 |
| 40 | Fitness Bio Ring | `'Inter', sans-serif` | 700 | — | `1px solid` | `#F8FAFC` | `#0F172A` | `#CBD5E1` | 12 | 40 |

### Chip `border-radius` per style family
- Monospace / brutalist (11, 15, 20, 33, 38): `4px`
- Serif / editorial (12, 14, 19, 23, 29, 34, 35): `3px`
- Impact (26): `0`
- Everything else: `99px`

### Mobile font reduction
- Versions with `letter-spacing` ≥ 1px (11, 12, 24) → use `{{ s.font_size | minus: 2 }}` and reset `letter-spacing` to a smaller value on mobile
- Impact version (26) → `{{ s.font_size | minus: 3 }}`
- All others → `{{ s.font_size | minus: 1 }}`

---

## Default message text (keep exactly as-is)

```
v11  ⚡ RAW DESIGN DROPS — FLAT ₹ 500 OFF WITH CODE: BRUTAL ⚡
v12  ✨ Complimentary Jewelry Cleaning Kit & Velvet Pouch with Every Order ✨
v13  🌱 Zero-Carbon Footprint Wool Shoes — Save ₹ 1,000 on your first pair
v14  ☕ Freshly Roasted Single-Origin Espresso Beans — Save 20% with Code: ROAST20
v15  [EXPEDITION GEAR] MILITARY-GRADE PACKS — 15% OFF WITH CODE: TACTICAL
v16  ✨ Dewy Hydration Sets — Free Essence Spray on Orders Over ₹1,499 ✨
v17  🐶 Human-Grade Vet Formulated Dog Meals — 50% Off Trial Box with Code: PUP50 🐶
v18  💡 Matter-Enabled Smart Ambient Light Kits — Save ₹1,500 with Code: SMARTKIT 💡
v19  🥖 Fresh Sourdough Bread Subscription — Get your 1st Box Free with Code: SOURDOUGH
v20  🕹️ RETRO PIXEL CONSOLES — FREE RETRO STICKER PACK WITH CODE: PIXEL8 🕹️
v21  🔬 Dermatologist Approved Clinical Serums — 20% Off with Code: DERMA20 🔬
v22  🔥 Sweat-Wicking Performance Gear — Buy 2 Items Get Extra 20% Off 🔥
v23  🍵 Organic Chamomile Tea Bundle — Free Glass Teapot with Code: HERBAL 🍵
v24  ⌚ Automatic Chronographs — Free Watch Winder Gift with Code: CHRONO ⌚
v25  🌱 Zero-Plastic Refill Starter Packs — Save ₹ 300 with Code: REFILL 🌱
v26  🌶️ FIERY TRIPLE PACK — FREE CHILI OIL BOTTLE WITH CODE: SPICY 🌶️
v27  ✏️ Minimalist Washi Paper Journals — Flat 15% Off with Code: WASHI15 ✏️
v28  💧 Electrolyte Multiplier Packs — 20% Off Your First Subscription: HYDRATE 💧
v29  💼 Full-Grain Cognac Wallets — Free Custom Monogramming with Code: LEATHER 💼
v30  👶 Newborn Organic Cotton Sets — 25% Off with Code: BABY25 👶
v31  🏃 Speedboard Cushioned Runners — Free Performance Socks with Code: RUNNER 🏃
v32  🍨 Fresh Artisanal Gelato Tubs — Buy 3 Get 1 Free Dessert with Code: GELATO 🍨
v33  ⌨️ RGB GASKET MOUNT BOARDS — FREE KEYCAP PULLER WITH CODE: RGBKEYS ⌨️
v34  ✨ Handmade Velvet Oud — Complimentary 10ml Spray Sample: VELVET ✨
v35  🫒 Cold-Pressed Extra Virgin Olive Oil — Free Ceramic Dipping Dish: OLIVEOIL 🫒
v36  🕶️ Polarized Eco Bamboo Frames — 20% Off with Code: BAMBOO 🕶️
v37  🧠 Brain Focus Nootropic Capsules — Buy 2 Get 1 Free with Code: FOCUS 🧠
v38  ⌨️ Gateron Mechanical Switches & Lubed Springs — 15% Off Code: GATERON ⌨️
v39  👖 Raw Japanese Selvedge Denim — Free Canvas Tote Bag with Code: SELVEDGE 👖
v40  💍 Titanium Sleep & HRV Bio Tracker Ring — Free Sizing Kit with Code: BIOFIT 💍
```

> Optional improvement: pull the promo code out of the message into the `promo_code` field so it renders as a tappable copy chip (e.g. v14 message becomes "☕ Freshly Roasted Single-Origin Espresso Beans — Save 20%" with `promo_code` = `ROAST20`). Recommended — a copyable chip converts better than plain text.

---

## Per-file QA checklist

- [ ] Schema JSON parses (no trailing commas)
- [ ] Schema `name` ≤ 25 characters, unique across the theme
- [ ] Every setting ID is used somewhere in the markup/CSS — no orphan settings
- [ ] No hardcoded hex colors or text left in `<style>` or HTML
- [ ] Renders correctly at 375 / 768 / 1440
- [ ] Text contrasts its background (WCAG AA); on light backgrounds text must be dark/colored, never white
- [ ] Close button ≥ 44×44px on mobile
- [ ] Dismiss persists across reloads; promo chip copies to clipboard
- [ ] `shopify theme check` reports zero errors for the file

## Final verification (after all 30)

```
# read-only checks — do NOT write files with a script
grep -c "section.settings" sections/ab-v*.liquid   # every file must be > 0
grep -n "@media" sections/ab-v*.liquid             # every file must have one
```
