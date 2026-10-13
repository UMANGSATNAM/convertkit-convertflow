# Task Plan: Luxury Beauty Brand Bento Grid Section with Interactive Iframe Preview

## 🎯 Goal
Build a world-class, high-converting **Luxury Beauty Brand Bento Grid Section** (`cf-beauty-bento.liquid`) engineered specifically for skincare, cosmetics, and beauty D2C brands. Upgrade ConvertFlow's dashboard to feature a **true Sandboxed Iframe Preview Engine** with Desktop, Tablet, and Mobile device breakpoint toggles.

---

## 🏛️ Beauty Bento Grid Architecture (5-Tile System)
1. **Tile 1 (Crown Hero Spotlight - 2-row span)**:
   - High-resolution luxury product presentation (e.g. Bio-Peptide Glass Skin Elixir).
   - Dynamic formula variant selector (e.g. 30ml Daily Elixir vs 50ml Jumbo).
   - Real AJAX Add-to-Bag CTA with live price sync.
   - Clinical efficacy badge: *"Dermatologist Tested • Non-Comedogenic"*.
2. **Tile 2 (Clinical Trial Data Matrix)**:
   - 94% Instant hydration boost.
   - 89% Skin barrier recovery within 7 days.
   - 98% Verified repurchase intent.
3. **Tile 3 (Clean Botanical Ingredient Architecture)**:
   - Pure Bio-Fermented Squalane + 5% Niacinamide + Centella Asiatica.
   - Zero synthetic fragrance, cruelty-free, 100% vegan certification marks.
4. **Tile 4 (Interactive Before & After Comparison Slider)**:
   - Real interactive touch/mouse drag handle comparing "Day 1 (Dull & Dehydrated)" vs "Day 28 (Luminous Glass Skin)".
5. **Tile 5 (Editorial Press & Verified Social Proof)**:
   - 4.9★ from 14,800+ beauty lovers + Vogue / Elle style editorial pull quote.

---

## 🖥️ Sandboxed Iframe Preview Engine in Dashboard
- Isolated sandboxed `<iframe>` preventing style collisions with Shopify Polaris.
- Interactive Device Switcher:
  - 🖥️ **Desktop** (100% width)
  - 📱 **Tablet** (768px width)
  - 📲 **Mobile** (375px iPhone viewport)
- Live interactive manipulation (drag Before/After slider, toggle swatches, test quantity).

---

## 📋 Implementation Checklist
- [x] Create `app/lib/sections/templates/cf-beauty-bento.liquid`
- [x] Register `cf-beauty-bento` in `app/lib/sections/registry.ts`
- [x] Upgrade `app/routes/app._index.tsx` with Iframe Sandbox & Device Breakpoint Bar
- [x] Run build validation (`npm run build`) - Passed with code 0!
- [x] Git commit & push to GitHub
