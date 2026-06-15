# Shopify Integration Specs

## 1. Authentication & Session Management
- **OAuth Installation Flow**: Handled by `@shopify/shopify-app-remix`.
- **Session Storage**: Standardized using `PrismaSessionStorage` in `app/shopify.server.js`.
- **Offline Access Tokens**: Saved per store to allow background jobs (theme generation, sync) to execute without active user sessions.

## 2. API Integrations

### REST Admin API
- Used for reading and writing theme assets via `/admin/api/2025-10/themes/{theme_id}/assets.json`.
- Used to retrieve the active theme role and details.

### GraphQL Admin API
- Used for theme creations via the `themeCreate` mutation.
- Used for theme publishing via the `themePublish` mutation.
- Used to retrieve granular catalog information (products, collections).

### Script Tag / App Bridge
- Storefront features (Sticky Cart, Urgency Maker) are injected using theme app embeds or injected script tags to preserve storefront performance and keep the storefront bundle payload minimal (<40kb).

## 3. Webhook Subscriptions
All webhook triggers are configured in `app/shopify.server.js` and mapped to callbacks in `app/routes/webhooks.tsx`:
- `APP_UNINSTALLED`: Triggers data deletion to comply with Shopify requirements.
- `SHOP_UPDATE`: Synchronizes store metadata and details.
- `THEMES_PUBLISH`: Triggers background checks to re-verify section/widget integrations.
- GDPR Mandatory Webhooks:
  - `CUSTOMERS_DATA_REQUEST`
  - `CUSTOMERS_REDACT`
  - `SHOP_REDACT`
