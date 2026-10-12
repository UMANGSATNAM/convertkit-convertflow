# Task: ConvertFlow Pre-Built High-Converting Section Library

## 🎯 Objective
Transform the clean Shopify Remix app into **ConvertFlow**: A high-impact conversion suite offering 5 pre-built, battle-tested Shopify Theme 2.0 native sections that merchants can preview and install into their active Shopify theme with 1 click.

---

## 📐 Architecture & Standards
- **App Name**: `ConvertFlow` (updated in `shopify.app.toml`, `package.json`, and admin UI).
- **Design Philosophy**:
  - **Purple Ban Strictly Enforced**: Zero purple/violet/indigo. Curated obsidian/dark slate palette with emerald conversion accents and crisp typography.
  - **Zero Emojis in Storefront Sections**: 100% clean, inline vector SVGs.
  - **Zero-Bloat Liquid**: No external heavy JS libraries; standalone CSS + minimal vanilla JS.
  - **Full Theme 2.0 Schemas**: Every section contains schema settings so merchants can customize copy, images, colors, and layout directly inside Shopify's native Theme Customizer.
- **Shopify API**:
  - Theme detection: GraphQL / REST Themes query for active published theme (`role: "main"`).
  - Section push: Shopify Asset API (`sections/cf-*.liquid`).
  - Idempotent and conflict-free naming with `cf-` prefix.

---

## 📋 Sections to Build
1. **`cf-pdp-buybox.liquid`**: Signature 1000-Crore Luxury PDP Buy Box (sticky CTA, variant chips, live stock urgency, trust seals).
2. **`cf-hero-split.liquid`**: High-Impact Asymmetric Hero Banner (dual CTA, stats badge, responsive stack).
3. **`cf-comparison-matrix.liquid`**: "Us vs Them" Side-by-Side Comparison Matrix (crisp vector checks & crosses).
4. **`cf-faq-accordion.liquid`**: SEO-Optimized FAQ Accordion (Schema.org FAQPage rich data).
5. **`cf-trust-badges.liquid`**: Value Props & Trust Bar (monochrome vector icons, guarantee badges).

---

## 🛠️ Step-by-Step Implementation Breakdown

- [x] **Phase 1: Brand & Configuration Setup**
  - Update `shopify.app.toml` (`name = "ConvertFlow"`).
  - Update `package.json` (`name = "convertflow"`).
  - Update `app/routes/app.jsx` navigation bar.

- [x] **Phase 2: Liquid Section Templates Registry (`app/lib/sections/`)**
  - Create section data catalog with metadata (slug, title, category, CVR impact, description).
  - Implement full Liquid templates with Theme 2.0 schema settings and responsive CSS.

- [x] **Phase 3: Theme Installation Engine (`app/routes/api.sections.install.tsx`)**
  - Authenticate merchant request.
  - Query active theme ID.
  - Upload `sections/cf-[slug].liquid` via Shopify Asset API.
  - Return theme editor deep link (`https://admin.shopify.com/store/{shop}/themes/{theme_id}/editor`).

- [x] **Phase 4: ConvertFlow Admin Dashboard UI (`app/routes/app._index.tsx`)**
  - Polaris v12 interface with ConvertFlow branding.
  - Section cards with live preview dialog / modal.
  - 1-click Install button with optimistic loading and feedback banners.
  - Installed badge status checking against active theme.

- [x] **Phase 5: Verification & Quality Assurance**
  - Run build validation (`npm run build`) - Passed with code 0!
  - Verify Liquid schema validity.
  - Verify Purple Ban compliance.
