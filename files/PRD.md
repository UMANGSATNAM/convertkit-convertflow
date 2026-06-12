# PRD.md — StoreForge
## Product Requirements Document — Final Launch Scope

**Product:** StoreForge — The Zero-Developer Shopify App
**Owner:** Umang | **Status:** LOCKED for build | **Version:** 1.0-FINAL

---

## 1. VISION

Any merchant in India builds, designs, optimizes, and runs a professional D2C Shopify store (Koskii / Snitch / Mamaearth quality) **without ever hiring a Shopify developer**. StoreForge is the only app they need.

**The contract:** After installing StoreForge, the merchant never needs Fiverr, Upwork, a freelancer, an agency, or any other storefront app.

## 2. PROBLEM

| Merchant pain | Today's cost | StoreForge answer |
|---|---|---|
| Store setup + theme + branding | ₹30,000–80,000 dev/agency | Store Generator — 10 min, free |
| Custom sections / landing pages | ₹2,000–10,000 per section | 120-section library, drag-drop |
| Design tweaks (colors, fonts, spacing) | ₹500–3,000 per tweak | Design Studio, no-code, undo history |
| Conversion features (sticky ATC, timers, size chart, WhatsApp...) | 5–6 apps × ₹800–1,200/mo | Built-in Conversion Toolkit |
| Festival sale pages | Dev gig every festival | Campaign Builder, 7 templates |
| "Site is slow" | ₹5,000–15,000 optimization gig | Health Monitor + one-click Auto-Fix |
| "Change this, add that" requests | Ongoing retainer | AI Assistant in Hindi/Hinglish |
| Pixel/GA4/Merchant Center setup | Dev gig | Tracking Wizard, paste-ID setup |

## 3. TARGET USERS

**Primary:** Indian D2C founders, non-technical, niches: ethnic wear, jewellery, grooming, beauty, streetwear, activewear, electronics, kids, home decor, food. Revenue ₹0–50L/mo. Comfortable with WhatsApp/Instagram, allergic to code.
**Secondary:** Freelancers/small agencies serving many small merchants (multi-store value later).
**Geography:** India-first (INR pricing anchor, COD/UPI/GST/pincode/WhatsApp/festival-native), global-compatible.

## 4. PRODUCT PILLARS (ALL SHIP AT LAUNCH)

1. **Store Generator** — niche → brand → catalog → live store in <10 min. 10 niches, demo catalogs (24–36 products each), 7 auto-created pages, menus, brand-patched settings, published theme.
2. **Section Library** — 120 sections via Theme App Extensions; works on StoreForge themes AND any OS 2.0 theme (Dawn etc.). Categories: Hero(14), Product display(18), Trust(16), Content(20), Conversion(22), Utility(14), India-special(16).
3. **Design Studio** — global colors/typography/buttons/spacing/layout, live preview, 25-snapshot undo history, third-party theme mapping layer.
4. **Conversion Toolkit** — 8 features replacing paid apps: Sticky ATC, Countdown, Announcement system, Size charts, Pincode checker, WhatsApp suite, Bundles & quantity offers (native automatic discounts), Trust badges.
5. **Campaign Page Builder** — 7 templates: Diwali, EOSS, New Launch, Wedding Season, Rakhi, Valentine's, National Sale. Calendar with festival auto-suggestions.
6. **Health Monitor & Auto-Fix** — weekly scan (images, weight, SEO, hygiene), score 0–100, one-click fixes with snapshots.
7. **AI Assistant** — Hindi/Hinglish/English chat that executes real changes through 8 validated tools. Preview → Apply → Undo. Never auto-applies.
8. **Tracking & Integrations** — Meta Pixel + GA4 via Web Pixels API, Google Merchant feed via app proxy, verification panel.

## 5. NON-GOALS (EXPLICIT)

- ❌ Checkout customization (Shopify Plus-only platform limitation — communicated honestly in-app)
- ❌ Modifying third-party themes' core files (app blocks/embeds only on non-StoreForge themes)
- ❌ ERP/warehouse/custom backend integrations
- ❌ Email marketing automation (recommend partners)
- ❌ Multi-storefront/headless

## 6. PLANS & PRICING

| | FREE | GROWTH $12.99/mo | PRO $24.99/mo |
|---|---|---|---|
| Generations | 1 | Unlimited | Unlimited |
| Niches | 3 | 10 | 10 |
| Sections | 15 | 120 | 120 + monthly drops |
| Toolkit | 2 features | All 8 | All 8 |
| Campaigns live | — | 3 | Unlimited |
| Health | Score only | + Fixes | + Weekly auto-fix |
| AI actions/mo | — | 50 | Unlimited (fair-use 1000) |
| Custom Liquid/HTML sections | — | — | ✅ |
| Support | Docs | Email 24h | WhatsApp priority |

14-day trial. Annual = 2 months free. Downgrade locks features, never deletes data.

## 7. SUCCESS METRICS

| Metric | Target |
|---|---|
| Activation (install → generation complete) | >60% |
| Median time-to-live-store | <10 min |
| Generation success rate | >97% |
| Free → paid conversion | 8–12% |
| App Store rating | ≥4.8★ |
| Churn (paid, monthly) | <5% |
| "Apps replaced" per merchant (survey) | ≥3 |

## 8. LAUNCH GATE (ALL MUST BE TRUE)

1. 30/30 generation matrix green (10 niches × 3 catalog modes), median <8 min
2. 120/120 sections passing render matrix (StoreForge + Dawn + 2 paid themes, mobile+desktop)
3. 8/8 toolkit features verified on Dawn + StoreForge themes
4. 7/7 campaign templates publish end-to-end
5. Health scan + all auto-fixes working with snapshot/undo
6. AI Assistant: 8 tools, preview→apply→undo, Hinglish verified
7. Billing flows + GDPR webhooks tested
8. 7-day clean Sentry burn-in on staging (20 test stores)
9. Shopify App Store review approved
10. 90-sec demo video complete

## 9. RISKS & MITIGATIONS

| Risk | Mitigation |
|---|---|
| Shopify API version breakage | All theme ops behind Theme Engine; quarterly API version bump task |
| Theme corruption blame | Validation layer + mandatory snapshots + one-click restore — corruption impossible by design |
| App review rejection | Compliance checklist in RULES.md enforced in CI; no ScriptTags, no checkout, embedded auth |
| Generation rate limits at scale | Cost-aware GraphQL client, per-shop queues, BullMQ concurrency caps |
| AI does something wrong | Tools-only execution, preview+confirm, action log, undo |
| Section conflicts with merchant theme CSS | Scoped class prefixes, zero global selectors, render matrix QA |
