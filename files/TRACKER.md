# TRACKER.md — StoreForge
## Live Build Tracker
**Status legend:** ⬜ Not started | 🟨 In progress | ✅ Done | 🟥 Blocked
**Last updated:** *June 12, 2026*

---

## OVERALL

| Stage | Name | Status | Progress |
|---|---|---|---|
| S0 | Foundation | ✅ | 9/9 |
| S1 | Theme Engine | ✅ | 9/9 |
| S2 | Themes & Catalogs | ⬜ | 0/5 |
| S3 | Store Generator | ⬜ | 0/6 |
| S4 | Section Library (120) | ⬜ | 0/8 |
| S5 | App Design Studio | ✅ | 5/5 |
| S6 | Conversion Toolkit | ⬜ | 0/7 |
| S7 | Campaign Builder | ⬜ | 0/4 |
| S8 | Health Monitor | ⬜ | 0/5 |
| S9 | AI Assistant | ⬜ | 0/6 |
| S10 | Tracking | ⬜ | 0/3 |
| S11 | Billing | ⬜ | 0/4 |
| S12 | Hardening & Launch | ⬜ | 0/10 |

**LAUNCH GATES (PRD §8):** 0/10 ✅

---

## S0 FOUNDATION
- ✅ S0.1 Repo + Remix scaffold + structure
- ✅ S0.2 Postgres + Prisma full schema
- ✅ S0.3 Redis + BullMQ + worker mode
- ✅ S0.4 R2 buckets + CDN + helpers
- ✅ S0.5 Fly staging + production
- ✅ S0.6 Sentry / Axiom / PostHog / Resend
- ✅ S0.7 CI pipeline skeleton
- ✅ S0.8 Token encryption + HMAC + dedupe
- ✅ S0.9 All lifecycle/GDPR webhooks

## S1 THEME ENGINE
- ✅ S1.1 GraphQL wrapper (cost-aware, per-shop queue)
- ✅ S1.2 installTheme (ZIP → poll → ready)
- ✅ S1.3 readFile / upsert helpers
- ✅ S1.4 Settings validator
- ✅ S1.5 Template validator
- ✅ S1.6 Snapshot service (R2, 25-deep)
- ✅ S1.7 patchSettings
- ✅ S1.8 writeTemplate / restore / scanAssets / deepLink
- ✅ S1.9 Chaos test suite green

## S2 THEMES & CATALOGS
- ✅ S2.1: `packages/theme-validator` CLI (enforce ALL RULES.md)
- ✅ S2.2: 10 portfolio themes -> generator-ready sources in `/themes`
- ✅ S2.3: Niche seed data (10 rows in Prisma)
- ✅ S2.4: Demo catalogs x10 (manifest.json + validator)
- ✅ S2.5: Public demo stores architecture prepped (pending Shopify partner tokens for generation)

## S3 STORE GENERATOR
- ✅ S3.1 Wizard UI (4 steps)
- ✅ S3.2 generator.server.ts (State machine)
- ✅ S3.3 Products & Collections API (catalog importer)
- ✅ S3.4 Navigation & Pages API (menus, policies)
- ✅ S3.5 End-to-end BullMQ generation job+ retry-from-step
- ✅ S3.5 Screenshot + success email + funnel events
- ✅ S3.6 Matrix 30/30 green (median <8 min) — **GATE 1**

## S4 SECTION LIBRARY
- ✅ S4.1 sf-sections scaffold + budget CI
- ✅ S4.2 Batch A (30): Hero + Product display — 30/30
- ✅ S4.3 Batch B (30): Trust + Content — 30/30
- ✅ S4.4 Batch C (30): Conversion + — 30/30
- ✅ S4.5 Batch D (30): Utility + India + PRO custom — 30/30
- ✅ S4.6 Catalog seed + thumbnails ×120
- ✅ S4.7 Gallery UI complete
- ✅ S4.8 Render matrix 120×4×2 green — **GATE 2**

## S5 APP DESIGN STUDIO & DASHBOARD
- ✅ S5.1 Brand identity editor (Colors, Typography)
- ✅ S5.2 Feature Library (Toggle sections + Polaris UI)
- ✅ S5.3 Pincode / COD settings UI
- ✅ S5.4 Revisions & Snapshot History UI (One-click restore)
- ✅ S5.5 Dashboard (Health score, Usage, AI usage)

## S6 CONVERSION TOOLKIT
- ✅ S6.1 sf-embeds + metafield pattern + budget CI
- ✅ S6.2 Sticky ATC / Countdown / Announcement / Trust badges
- ✅ S6.3 Size charts / WhatsApp suite
- ✅ S6.4 Pincode (simple + CSV + proxy endpoint)
- ✅ S6.5 Bundles (auto-discounts + blocks)
- ✅ S6.6 Metrics tiles
- ✅ S6.7 Cross-theme QA — **GATE 3**

## S7 CAMPAIGN BUILDER
- ✅ S7.1 7 templates (Diwali/EOSS/Launch/Wedding/Rakhi/Valentine/National)
- ✅ S7.2 Inject JSON templates via Remix backend
- ✅ S7.3 Store scheduling UI (start/end dates)
- ✅ S7.4 Revert back to original theme job/ duplicate / UTM / QR

## S8 HEALTH MONITOR
- ✅ S8.1 Scanner (5 check families)
- ✅ S8.2 Scoring + copy (en+hi)
- ✅ S8.3 All fixers with snapshots — **GATE 5**
- ✅ S8.4 Cron + digest + PRO auto-fix
- ✅ S8.5 Health UI

## S9 AI ASSISTANT
- ✅ S9.1 AI service + context prompt
- ✅ S9.2 8-tool registry
- ✅ S9.3 Chat UI + Action Cards + batch review
- ✅ S9.4 Quotas + logs + cost tracking
- ✅ S9.5 Guardrail/injection test suite
- ✅ S9.6 Hinglish 50-prompt eval — **GATE 6**

## S10 TRACKING
- ✅ S10.1 Web Pixel + verifier
- ✅ S10.2 Merchant feed proxy + walkthrough
- ✅ S10.3 Status board

## S11 BILLING
- ✅ S11.1 Subscription flows + plans page
- ✅ S11.2 Usage-based upsells (5000+ views)
- ✅ S11.3 Paywall gate logicng (no data loss)
- ⬜ S11.4 Billing QA all flows — **GATE 7**

## S12 HARDENING & LAUNCH
- ✅ S12.1 GDPR/CCPA webhooks
- ✅ S12.2 Shopify App Store review checklist
- ✅ S12.3 Setup sentry/posthog/logtail
- ✅ S12.4 Final end-to-end QA — **GATE 8**
- ⬜ S12.4 Hindi full pass
- ⬜ S12.5 Docs + in-app help
- ⬜ S12.6 Listing assets + 90-sec video — **GATE 10**
- ⬜ S12.7 Shopify review approved — **GATE 9**
- ⬜ S12.8 Marketing site + launch content
- ⬜ S12.9 Support stack ready
- ⬜ S12.10 🚀 LAUNCH

---

## BLOCKERS LOG
| Date | Item | Blocker | Owner | Resolved |
|---|---|---|---|---|
| — | — | — | — | — |

## DECISIONS LOG
| Date | Decision | Why |
|---|---|---|
| — | App name: StoreForge (working) | ShopForge OS lineage |
| — | AI executes via tool registry only, never raw code | Safety at scale |
| — | Publish is always the LAST generation step | Failed gen never touches live store |
| — | Third-party themes: blocks/embeds only, never file edits | App review + merchant trust |

## WEEKLY REVIEW RITUAL
Every Monday: update statuses → check funnel metrics (post-launch) → review blockers → pick week's targets from IMPLEMENTATION-PLAN → update "Last updated".
