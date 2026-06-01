# 06 IMPLEMENTATION PLAN — 6 MONTH ROADMAP

## PHASE 1: Foundation (Weeks 1–4)
- Shopify CLI + Remix scaffold on Railway (already started)
- Prisma schema with MySQL — all tables created and migrated
- BullMQ + Railway Redis connected
- Onboarding wizard UI — 5-step flow with niche selection
- 3 storefront blocks: Sticky ATC, Countdown Timer, Free Shipping Bar

## PHASE 2: Core CRO + India Features (Weeks 5–10)
- Reviews system: CSV import, manual add, storefront widget
- Trust badges, WhatsApp widget, Pincode checker
- Upsell engine: FBT, Bundle builder, Post-purchase upsell
- Abandoned cart recovery: WhatsApp + email 3-message sequence
- COD management dashboard + GST invoice generator
- Internal beta: 10 merchant stores testing

## PHASE 3: Live Integrations (Weeks 11–16)
- Facebook Ads OAuth + campaign data sync (Marketing API v20+)
- Razorpay Settlements API — actual PG fee per order
- Shiprocket full integration — rates, label generation, tracking
- Profit calculator — all data sources wired together with SSE
- Meta Cloud API (WhatsApp Business) — template approval
- Klaviyo + Mailchimp webhook for email sync

## PHASE 4: Page Injection + Launch (Weeks 17–24)
- 64 niche page templates built and seeded to MySQL
- Page injection engine (Assets API + Pages API)
- Template picker UI in dashboard with niche/type filters
- AI recommendations engine using Anthropic API
- Shopify App Store submission (`write_themes` + `write_pages` scope)
- Public launch — Product Hunt, Shopify India communities

---

# 8 MASTER AI BUILD PROMPTS

Use these sequentially to build the app module by module.

**PREFIX FOR EVERY PROMPT:** "Use TypeScript strict mode. MySQL via Prisma (Railway). Remix framework. Handle all errors. Keep storefront JS under 10KB per block. Test on development store before moving on."

1. **PROMPT 1: Project Scaffold + Railway/MySQL Auth**
   Initialize Shopify Remix app. Setup Prisma with MySQL (Railway). Shopify OAuth working. All env vars configured. BullMQ + Redis connected.
   
2. **PROMPT 2: Onboarding Wizard (5-Step Flow)**
   Build guided setup wizard with Polaris. Niche picker, feature toggles, integration setup. Saves to `merchants` + `feature_configs` tables in MySQL.
   
3. **PROMPT 3: Theme App Extension — All 9 Blocks**
   Build all 9 storefront app blocks: `sticky-atc`, `countdown-timer`, `stock-counter`, `free-shipping-bar`, `trust-badges`, `reviews-widget`, `whatsapp-widget`, `pincode-checker`, `sales-popup`. Vanilla JS only. Single bundle.
   
4. **PROMPT 4: Profit Calculator + All Live Integrations**
   SSE endpoint pulling live data from Razorpay (settlements), Shiprocket (costs), Facebook Ads API (CAC). Real-time profit dashboard with margin bar and verdict.
   
5. **PROMPT 5: Facebook Ads OAuth Complete Flow**
   Facebook OAuth → ad account selection → campaign insights sync. Saves token to MySQL (encrypted). Shows spend/CAC/ROAS in analytics.
   
6. **PROMPT 6: India Features — COD + GST + Shiprocket**
   COD confirmation flow via WhatsApp. NDR management. Fake order filter. GST invoice PDF generator (pdfkit). Shiprocket label generation.
   
7. **PROMPT 7: Upsell Engine — FBT + Bundle + Post-Purchase**
   Frequently bought together. Bundle builder (Shopify Discount API). Post-purchase upsell extension. In-cart upsell. All as Theme App Extension blocks.
   
8. **PROMPT 8: Page Injection System — 64 Templates**
   Template picker UI. Injection engine using Theme Assets API + Pages API. Seed 64 templates to MySQL. One-click inject creates live page in store.
