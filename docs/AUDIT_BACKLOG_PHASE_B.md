# Phase B Audit Backlog & Decision-Level Notes

This document captures critical architectural and security/compliance findings identified during the GraphQL Introspection & Discovery Phase. These items must be systematically addressed during **Phase B Audit & Cleanup** before App Store submission.

---

## 0. PRODUCTION SAFETY CRITICAL: Replace `db push --accept-data-loss` with `prisma migrate deploy` (Top Priority — Kickoff Item #1)

### Finding & Risk
- Currently, `Dockerfile` CMD executes `npx prisma db push --accept-data-loss && npm start` on every container boot.
- While safe during Phase A (where `ComponentRegistry` and `RegistryMeta` are disposable caches re-populated via seed), this poses a severe production data-wipe hazard once persistent merchant data models (`Shop`, `GenerationJob`, `ThemeDeployment`, `StoreDNA`) ship in Phase B.
- Additionally, `prisma/seed_components.ts` executes `Cleared old ComponentRegistry`; once Phase B models ship, seeding scope must remain strictly locked to `ComponentRegistry` and `RegistryMeta`.

### Phase B Audit Action Item
1. **Replace Dockerfile CMD:** Replace `npx prisma db push --accept-data-loss` with `npx prisma migrate deploy` prior to shipping persistent merchant data models. This pairs directly with **Decision #14's migration-baseline commitment**.
2. **Lock Seed Scope:** Ensure any DB seed routines never truncate or drop merchant tables (`Shop`, `GenerationJob`, `ThemeDeployment`, `StoreDNA`).

---

## 1. Scope Drift & Scope Minimization Pass (High Priority — App Store Review Risk)

### Finding
An audit comparing `shopify.app.toml` against active granted session scopes revealed significant scope drift:
- **`shopify.app.toml` Scopes (14 total):**
  `write_products,read_products,write_orders,read_orders,write_discounts,read_discounts,read_customers,write_themes,read_themes,write_pages,read_pages,write_script_tags,read_script_tags,read_analytics`
- **Active Session Scopes vs Config Mismatches:**
  - Session contains `write_customers` (not explicitly in `shopify.app.toml`).
  - `shopify.app.toml` requests `read_orders` + `read_products`, while session reflects write versions.
  - Session includes `read_inventory` + `write_content` which are not reconciled in `shopify.app.toml`.

### Risk & Architectural Impact
- **App Store Review Flag:** Asking for 14 scopes—especially sensitive scopes like `write_orders` and `write_customers`—for an app whose core mission is **Theme & Page Generation** will trigger strict manual review scrutiny and likely rejection unless every scope is explicitly justified by a user-facing feature.
- **Immediate Action:** **Deferred (Do Not Block Phase D).** Triggering a re-authentication flow right now would disrupt ongoing dev and introspection workflows.

### Phase B Audit Action Item
1. **Scope Minimization Audit:** Conduct a full feature-to-scope mapping pass.
2. **Prune Unused Scopes:** Remove `write_orders`, `write_customers`, and any other non-essential scopes from `shopify.app.toml`. Core theme generation only requires `write_themes`, `read_themes`, and relevant storefront asset/content scopes.
3. **Controlled Re-Auth Flow:** Schedule a planned re-authentication migration for existing development/test stores once the minimal scope list is finalized.

---

## 2. Webhook Residue & BullMQ Infrastructure Audit

### Finding
`shopify.app.toml` registers several checkout and order webhooks:
- `checkouts/create`
- `checkouts/update`
- `orders/create`

### Analysis
- **Anomaly / Legacy Residue:** A theme-generation app does not typically need to subscribe to `checkouts/create` or `orders/create`. This appears to be legacy residue from earlier iterations (e.g., SpinBucks or conversion widget campaigns).
- **Positive Infrastructure Readiness:** The project already has **BullMQ + Idempotency Table** infrastructure set up and functional. This fulfills what was originally planned as a Phase B job queue requirement. The `GenerationJob` model will cleanly ride on this existing BullMQ worker infrastructure.

### Phase B Audit Action Item
1. **Worker Handler Inspection:** Inspect the BullMQ worker processors listening to `checkouts/create`, `checkouts/update`, and `orders/create`.
2. **Webhook Cleanup:** If these webhooks do not power an active core conversion/theme feature, unregister them from `shopify.app.toml` to reduce unnecessary background event processing and webhook delivery load.
3. **Queue Optimization:** Ensure `GenerationJob` task processing utilizes the existing idempotency table for safe retry semantics.

---

## 3. Chassis Quality & Compliance Gaps (Blocking "Pro" Quality / App Store Rejection Risk)

### Finding
An audit of the current chassis and generated theme bundle identified 8 blocking quality and compliance gaps that must be resolved:
1. **`templates/gift_card.liquid` MISSING:** Mandatory for Shopify OS 2.0 themes; absence causes automatic App Store / theme validation rejection.
2. **`assets/motion.js` MISSING:** Does not exist (~3KB). Required for scroll reveals, hover lift, image zoom, and smooth transitions (the single biggest visual-quality gap).
3. **Typography Scale missing in Token Engine:** While `Playfair Display` and body fonts are extracted, display hierarchy scales, tracking, and leading are not compiled into CSS tokens.
4. **Font Preload missing in `layout/theme.liquid`:** Causes Flash of Unstyled Text (FOUT) on storefront load.
5. **JSON-LD Structured Data Incomplete:** Must include `Organization`, `WebSite` + `SearchAction`, `Product` (with `offers` & `aggregateRating`), `BreadcrumbList`, `FAQPage`, `Article`, and `ItemList`.
6. **`sections/overlay-group.json` MISSING:** Popups and modals have no layout group to anchor to.
7. **`locales/en.default.schema.json` Verification:** Verify existence so theme editor renders human-readable labels instead of raw schema translation keys.
8. **`snippets/predictive-search.liquid` MISSING:** Required for instant search drawer and accessible search experience.

