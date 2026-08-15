# ShopForge — Build Tracker

Antigravity keeps this updated as it works (repo-native, git-tracked). Umang + Claude = source of truth.

## Per-variant pipeline
`☐ Spec'd → ☐ Built → ☐ Render-verified (real link, Umang's eyes) → ☐ Token-verified (no hardcoded) →
☐ Responsive-verified (mobile-first) → ☐ CRO/edge-cases pass → ✅ In-library`

**Definition of Done** (all must tick before a variant counts as done):
- [ ] Structurally distinct from siblings (layout, not just colour)
- [ ] Fully token-driven — grep for hardcoded hex/radius = 0
- [ ] Real-data-only — ratings/badges/urgency from real merchant data, hidden if absent (no fabrication)
- [ ] Mobile-first responsive; tap targets ≥44px
- [ ] CRO patterns present where relevant (clear CTA, trust, hierarchy, sticky ATC on PDP)
- [ ] Edge cases pass (missing image, long title, no price, no reviews, out of stock, few products)
- [ ] Premium bar cleared (holds up next to CaratLane / GIVA / Sugar)
- [ ] Render-verified on a real preview link (NOT a local-path screenshot)

## Section status (target ~30 variants each)

| Section type | Priority | Target | Built | Render-verified premium | Status |
|---|---|---|---|---|---|
| Hero | P0 | 30 | 6 | 6 | 🟡 scaling |
| Product card | P0 | 30 | some | 0 | 🔴 re-style pending |
| Product grid | P0 | 30 | 0 | 0 | 🟡 12 specced |
| PDP: advanced sections | P0 | 30 | 10 | 0 | 🟡 built, pending verify |
| PDP: sticky ATC | P0 | 30 | 3 | 3 | 🟡 |
| PDP: reviews-with-photos | P0 | 30 | 0 | 0 | 🔴 |
| PDP: trust-near-ATC | P0 | 30 | 0 | 0 | 🔴 |
| PDP: benefits | P0 | 30 | 0 | 0 | 🔴 |
| PDP: related | P0 | 30 | 0 | 0 | 🔴 |
| PDP: swatches + size guide | P0 | 30 | 0 | 0 | 🔴 |
| Cart drawer + progress + upsell | P0 | 30 | 0 | 0 | 🔴 |
| Welcome popup | P0 | 30 | 0 | 0 | 🔴 |
| Exit-intent popup | P0 | 30 | 0 | 0 | 🔴 |
| Value-prop bar | P0 | 30 | 0 | 0 | 🔴 |
| Trust bar | P0 | 30 | 0 | 0 | 🔴 |
| Collection filters | P0 | 30 | 0 | 0 | 🔴 |
| Announcement bar | P0 | 30 | ~50 | 0 | 🟡 verify/level |
| Header | P0 | 30 | ~40 | 0 | 🟡 verify/level |
| Category grid | P1 | 30 | ~50 | 0 | 🟡 verify/level |
| Footer | P1 | 30 | some | 0 | 🟡 |
| _(add all remaining section types from 03-SECTION-LIST.md)_ | | | | | |

**Real metric = "Render-verified premium" column, NOT "Built".** A big Built number with 0 verified is not progress.

## Overall
- Section types with ≥1 verified-premium variant: **1 / ~45** (hero)
- Generation app (questionnaire / selection engine / preview / publish): **not started**
- Current focus: **PDP suite** (Phase A, Sticky Add-To-Cart Bar)
