# Design System: 1000cr Elite (D2C Brand Standard)
**Project:** Converflow Shopify Theme (Dev-Theme-Peri)

## 1. Visual Theme & Atmosphere
The store must exude extreme trust, premium quality, and hyper-optimization (CRO).
- **Atmosphere:** Clean, breathable, ultra-premium, yet heavily focused on conversion. 
- **Density:** High information density handled gracefully through collapsible accordions, sticky elements, and clear typographic hierarchy.
- **Micro-interactions:** Snappy but smooth. Hover states, active states, and scrolling animations must feel native and app-like.

## 2. Color Palette & Roles
Instead of hardcoding colors, the theme uses CSS variables injected via Shopify Schema. However, the *defaults* and *principles* are:
- **Primary Action (Brand Context):** Always a high-contrast color (e.g., `#000000` or `#FF4500`). Used exclusively for "Add to Cart", "Checkout", and Primary CTAs.
- **Secondary Action:** Ghost buttons with thin strokes, or soft muted backgrounds (e.g., `#F4F4F4`).
- **Surface / Background:** `#FFFFFF` or `#FAFAFA` to ensure product imagery pops.
- **Text Primary:** `#111111` for stark readability.
- **Text Secondary:** `#666666` for meta-text, reviews, and subtle info.
- **Urgency/Destructive:** `#D32F2F` (Deep Red) for "Only X left!" or Sale prices.

## 3. Typography Rules
- **Font Families:** Managed via Shopify schema (`font_picker`), falling back to clean sans-serifs (Inter, Poppins, Manrope).
- **Hierarchy:** 
  - `H1` (Product Title): Bold, tight leading (1.1), tracking slightly negative (-0.02em).
  - `Body`: 14px-16px, relaxed leading (1.5) for high legibility.
  - `Meta/Badges`: 11px-12px, UPPERCASE, wide tracking (0.1em), Bold.

## 4. Component Stylings
* **Buttons:** 
  - Shape: Configurable (Pill, Rounded, Sharp).
  - Interaction: Hover state must slightly lift or darken. Disabled state must look distinct.
  - Mobile: Full-width sticky behavior on PDPs.
* **Cards/Containers:** 
  - Borders: Thin `1px solid rgba(0,0,0,0.08)` rather than heavy box-shadows.
  - Roundness: Configurable via schema (Sharp `0px`, Subtle `4px`, Modern `12px`).
* **Inputs/Forms:** 
  - Style: Floating labels or very clean boxed inputs. Focus states must have a clear `2px` ring (accessibility).
* **Badges/Tags:**
  - High contrast. e.g., Black bg with White text for "BEST SELLER". Red bg with White text for "SALE".

## 5. Layout Principles & Mobile Responsiveness
- **Mobile-First:** 80% of D2C traffic is mobile. 
  - Touch targets MUST be at least `44x44px`.
  - Galleries on mobile must be swipeable with visible pagination dots.
  - "Add to Cart" must ALWAYS be visible (via Sticky ATC) when the user scrolls past the main form.
- **Grid Alignment:** 
  - Margins: Mobile `16px` or `20px` edges. Desktop `MAX-WIDTH: 1440px` with fluid scaling.
  - Spacing: Use mathematical scales (e.g., 4, 8, 16, 24, 32, 48, 64px).

## 6. Shopify Editor Configuration (The "No Generic" Rule)
Every section must expose the following to the merchant in the Theme Editor:
- **Colors:** Background, Text, Primary Button, Secondary Button.
- **Spacing:** `padding_top`, `padding_bottom` (with desktop/mobile scaling logic).
- **Toggles:** Turn specific features on/off (e.g., "Show Vendor", "Show Urgency", "Show Sticky Cart").
- **Content:** All text must be dynamic (no hardcoded "Buy Now" if the merchant wants "Add to Bag").
