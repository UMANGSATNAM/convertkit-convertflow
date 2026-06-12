# IMPLEMENTATION-PLAN.md — StoreForge
## Full Build Sequence to Launch (No MVP — Everything Ships)

This is a dependency-ordered build plan. Workstreams run in parallel where marked ∥.
Estimated total: 18–20 weeks solo, 12–14 weeks with one collaborator.

---

## STAGE 0 — FOUNDATION (Week 1)

- [ ] S0.1 Repo init: Shopify Remix template, TypeScript strict, ESLint/Prettier, monorepo layout per TECHSPEC §2.4
- [ ] S0.2 Railway PostgreSQL plugin + Prisma schema v1 (full SCHEMA.md), migrations in CI
- [ ] S0.3 Railway Redis plugin + BullMQ wiring (private network URL, maxRetriesPerRequest: null), worker process mode, queue dashboard (bull-board, dev-only)
- [ ] S0.4 R2 buckets (public+private) + CDN domain + upload helpers
- [ ] S0.5 Railway projects: storeforge-staging + storeforge-production (web + worker services, railway.toml, private networking, Singapore region)
- [ ] S0.6 Sentry + Axiom + PostHog + Resend keyed and verified
- [ ] S0.7 CI pipeline skeleton: lint → typecheck → test → migrate-diff → deploy(staging)
- [ ] S0.8 Token encryption (AES-256-GCM + KMS), webhook HMAC middleware, webhook dedupe table
- [ ] S0.9 GDPR + lifecycle webhooks registered & handlers stubbed→implemented: app/uninstalled, shop/update, themes/publish, app_subscriptions/update, customers/data_request, customers/redact, shop/redact

**Exit:** embedded app loads on dev store, session auth verified, a test job runs through BullMQ, webhooks verified with Shopify CLI triggers.

## STAGE 1 — THEME ENGINE (Weeks 2–3) ← everything depends on this

- [ ] S1.1 GraphQL client wrapper: cost-aware throttling, per-shop serial mutation queue, retry/jitter, circuit breaker
- [ ] S1.2 `installTheme`: themeCreate from R2 ZIP → processing poll → unpublished ready
- [ ] S1.3 `readFile` / `themeFilesUpsert` helpers with checksum capture
- [ ] S1.4 Settings validator: parse live settings_schema.json → validate patch types/options/ranges
- [ ] S1.5 Template validator: JSON template structure rules (sections/blocks/order integrity)
- [ ] S1.6 Snapshot service: pre-write snapshot → R2, ThemeSnapshot rows, 25-deep prune job
- [ ] S1.7 `patchSettings` (read → validate → snapshot → deep-merge → upsert → checksum verify)
- [ ] S1.8 `writeTemplate`, `restoreSnapshot`, `scanAssets`, `appBlockDeepLink`
- [ ] S1.9 Chaos tests: kill mid-write, concurrent writes, restore byte-equality (Vitest + dev store integration suite)

**Exit:** scripted demo — install ethnic-wear ZIP on dev store, patch brand colors, restore snapshot — all green in integration test.

## STAGE 2 — THEME & CATALOG CONTENT PIPELINE (Weeks 2–5, ∥ with Stage 1 after S1.2)

- [ ] S2.1 `packages/theme-validator` CLI: enforce ALL RULES.md theme rules; wire into CI
- [ ] S2.2 Convert 10 portfolio themes → generator-ready sources in /themes (validator-clean), versioned ZIP build in CI → R2
- [ ] S2.3 Niche seed data: 10 Niche rows (palettes, fontPairs, pagesPreset en+hi, menusPreset, settingsBase, campaignFit)
- [ ] S2.4 Demo catalogs ×10: 24–36 products each, licensed/original photography processed (Sharp pipeline → CDN), manifest.json per niche, catalog-validator CI script
- [ ] S2.5 10 public demo stores (dev stores) generated + linked (used for listing, gallery previews, marketing)

**Exit:** all 10 ZIPs validator-clean on R2; all 10 catalogs pass catalog-validator; demo stores live.

## STAGE 3 — STORE GENERATOR (Weeks 4–6)

- [ ] S3.1 Wizard UI: 4 steps per APPFLOW F2 + DESIGN.md specs (niche cards, brand step with live preview card, WCAG check, logo generate via Sharp 3-styles)
- [ ] S3.2 CSV importer: parser (papaparse server-side), column auto-map + manual mapper UI, validation report, bad-rows download
- [ ] S3.3 Generation job: 8 idempotent steps with stepState resumability (products batch import w/ stagedUploads, smart collections, 7 pages en/hi, menus update-not-duplicate, settings patch, publish-last)
- [ ] S3.4 Live progress: log polling endpoint + checklist UI + retry-from-step + failure messaging
- [ ] S3.5 Completion: puppeteer homepage screenshot job, success email, PostHog funnel events
- [ ] S3.6 Run full matrix: 10 niches × 3 catalog modes on fresh dev stores → fix until 30/30 green

**Exit:** 30/30 matrix green, median <8 min, demo video recordable.

## STAGE 4 — SECTION LIBRARY (Weeks 5–9, ∥)

- [ ] S4.1 `sf-sections` extension scaffold + shared CSS-var conventions + build tooling (per-block budgets enforced in CI)
- [ ] S4.2 Section batch A (30): Hero 14 + Product display 16 — build, schema, locales, thumbs
- [ ] S4.3 Section batch B (30): Trust 16 + Content first 14
- [ ] S4.4 Section batch C (30): Content rest 6 + Conversion 22 + utility start 2
- [ ] S4.5 Section batch D (30): Utility rest 12 + India-special 16 + PRO custom-liquid/HTML (sanitizer)
- [ ] S4.6 SectionCatalog seed (120 rows) + thumbnail generation pipeline (screenshot from demo store)
- [ ] S4.7 Gallery UI: filters/search/preview-modal/deep-link add, plan locks, recently-added, niche recommendations
- [ ] S4.8 Render matrix QA: 120 sections × 4 themes × 2 viewports (Playwright visual snapshots)

**Exit:** 120 in gallery, render matrix green, Lighthouse-delta CI passing.

## STAGE 5 — DESIGN STUDIO (Weeks 8–9)

- [ ] S5.1 Panels (Colors/Typography/Buttons/Spacing/Layout/Badges) + live preview iframe (preview_theme param) with debounced patch
- [ ] S5.2 History drawer (25 snapshots, labels, restore)
- [ ] S5.3 Third-party mapping layer: read settings_schema, map known key families, hide unmapped
- [ ] S5.4 Apply/undo toasts, PostHog events

## STAGE 6 — CONVERSION TOOLKIT (Weeks 9–11)

- [ ] S6.1 `sf-embeds` extension + app-data metafield read pattern + shared util module (≤60KB total budget CI check)
- [ ] S6.2 Features build (each: embed + config drawer + defaults): Sticky ATC → Countdown → Announcement → Trust badges
- [ ] S6.3 Size charts (template library + auto-attach rules) → WhatsApp suite
- [ ] S6.4 Pincode: simple mode + CSV bulk pipeline (1L+ rows) + app-proxy check endpoint (signed, cached, rate-limited)
- [ ] S6.5 Bundles: rule builder → automatic discounts API + display blocks
- [ ] S6.6 Feature metrics via Web Pixel custom events → PostHog → toolkit dashboard tiles
- [ ] S6.7 Cross-theme interaction QA (Playwright on 4 themes)

## STAGE 7 — CAMPAIGN BUILDER (Weeks 11–12)

- [ ] S7.1 7 campaign JSON templates (built from section library blocks, festive presets)
- [ ] S7.2 Builder flow: template→resources→offer(+discount code create)→hero→preview→publish (template+page+menu+announcement composite)
- [ ] S7.3 Calendar view + Indian retail calendar data + nudge engine (in-app + email, T-21 days)
- [ ] S7.4 Auto-archive job, duplicate action, UTM builder + QR generation

## STAGE 8 — HEALTH MONITOR (Weeks 12–14)

- [ ] S8.1 Scanner: images / weight / leftover-app-snippets signature DB (40 apps) / SEO checks / hygiene checks
- [ ] S8.2 Scoring model + plain-language issue copy (en+hi)
- [ ] S8.3 Fixers: image compress-reupload, AI alt-text batch, meta description batch, dead-snippet removal (StoreForge themes, diff+confirm), favicon/social-image
- [ ] S8.4 Weekly cron + digest email + PRO auto-fix mode
- [ ] S8.5 Health UI: dial, sparkline, issue rows, fix-all flow

## STAGE 9 — AI ASSISTANT (Weeks 13–16)

- [ ] S9.1 AI service: Claude client, system prompt builder (shop context injection), language detection
- [ ] S9.2 Tool registry (8 tools per SCHEMA.md shape) — every tool maps to EXISTING service functions only
- [ ] S9.3 Chat UI + Action Cards (preview/apply/discard/undo) + batch review table
- [ ] S9.4 Quota enforcement (UsageCounter), AiActionLog, token cost tracking
- [ ] S9.5 Guardrail tests: prompt-injection suite (merchant pastes malicious text), refusal cases, max-5-tools cap
- [ ] S9.6 Hinglish quality pass: 50 real-world prompts evaluated

## STAGE 10 — TRACKING & INTEGRATIONS (Week 15, ∥)

- [ ] S10.1 Web Pixel extension (standard events → Meta/GA4 endpoints) + webPixelCreate flow + test-event verifier
- [ ] S10.2 Merchant feed app proxy (XML, 6h cache) + GMC walkthrough content
- [ ] S10.3 Integration status board

## STAGE 11 — BILLING & PLAN GATES (Week 16)

- [ ] S11.1 appSubscriptionCreate flows (trial 14d), annual option, plans page
- [ ] S11.2 Plan-gate middleware + contextual upgrade modals on every locked surface
- [ ] S11.3 Subscription webhook handling (upgrade/downgrade/frozen), feature-lock without data loss
- [ ] S11.4 Full billing QA: upgrade/downgrade/trial-expiry/uninstall-reinstall

## STAGE 12 — HARDENING & LAUNCH (Weeks 17–20)

- [ ] S12.1 Full QA matrix per PRD §8 (all 10 gates)
- [ ] S12.2 Load test: 50 concurrent generations on staging
- [ ] S12.3 7-day staging burn-in, 20 test stores, Sentry-clean requirement
- [ ] S12.4 Hindi locale full pass (UI/emails/sections)
- [ ] S12.5 Docs site + in-app help content (top 20 articles, en+hi)
- [ ] S12.6 App Store listing: copy, 8 screenshots, 90-sec video, demo store links
- [ ] S12.7 Submit for review → address feedback → approved
- [ ] S12.8 Marketing site live (storeforge.app), launch content queued (YouTube Hindi walkthroughs, community posts, PH)
- [ ] S12.9 Support stack: helpdesk inbox, macros, PRO WhatsApp line
- [ ] S12.10 LAUNCH 🚀 → monitor SLOs daily for 2 weeks

---

## PARALLELIZATION MAP
```
W1   S0 ████
W2-3 S1 ████████   S2 ████████████████ (content track)
W4-6 S3 ████████████
W5-9        S4 ████████████████████ (sections track)
W8-9            S5 ████████
W9-11               S6 ████████████
W11-12                   S7 ████████
W12-14                      S8 ████████████
W13-16                         S9 ████████████████
W15                               S10 ████
W16                                  S11 ████
W17-20                                  S12 ████████████████
```

## DEFINITION OF DONE (EVERY TASK)
Code + tests + types clean • RULES.md compliant (CI-enforced where automatable) • PostHog events added • en+hi copy where user-facing • Sentry breadcrumbs on failure paths • documented in /docs if it changes behavior.