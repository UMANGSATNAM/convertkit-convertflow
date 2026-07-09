# Phase B Audit Backlog & Decision-Level Notes

This document captures critical architectural and security/compliance findings identified during the GraphQL Introspection & Discovery Phase. These items must be systematically addressed during **Phase B Audit & Cleanup** before App Store submission.

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
