# ShopForge — Antigravity Kickoff Prompt

Copy-paste this to Antigravity. (The `shopforge/` folder must be added into the app's codebase first.)

```
Focus: the shopforge/ folder now lives in our app codebase. Read ALL of it, in order, before doing anything:
  00-README.md, 01-FLOW.md, 02-PLAN-STATUS.md, 03-SECTION-LIST.md, 04-TRACKER.md, 05-RULES.md.
This folder is the single source of truth for ShopForge. Do not drift from it.

After reading, give me a 5-line confirmation: (goal, the 5-stage flow, chassis vs swappable sections,
the locked rules, current phase). Then STOP — do not build yet.

WHAT WE ARE BUILDING (don't forget):
- An app that auto-generates premium, CRO-ready Shopify stores. User picks a niche + answers questions
  (Store DNA) → selection engine picks sections + one token set → assembles on the chassis → shows 3
  DIFFERENT previews on the user's OWN products/images → user publishes (as draft) the one they like.
- A base/skeleton CHASSIS theme that stays the SAME in every store (structure, cart, checkout, core JS,
  required templates, token-loader, PDP/card plumbing). ONLY look-changing sections get swapped per store.
- Goal: ~30 variants PER SECTION TYPE — every variant CRO-tested, mobile-first responsive, token-driven,
  real-data-only, premium bar (holds up next to CaratLane/GIVA/Sugar).

BUILD RULES: obey 05-RULES.md on every section (Rule 0 craft, token-driven, structural-not-cosmetic,
real-data-only/no fabrication, mobile-first, CRO patterns, catalog-adapt, chassis discipline, prove-then-scale).

START HERE (Phase A, in this order — PDP first, it's the biggest conversion gap):
1. Update the tracker: set current focus = "PDP suite".
2. Take the FIRST PDP section = STICKY ADD-TO-CART BAR. Build 3 structurally-different, premium, CRO-tested,
   mobile-first variants (real product/price/variant, real-data-only). Match from the existing pool where
   possible + normalize per 05-RULES.md; build gaps fresh.
3. Render-verify: give me ONE real theme-dev / share / admin-preview link (NOT local-path screenshots)
   showing the 3 sticky-ATC variants on a real product, mobile + desktop. Report each: matched-from-<file>
   or built-new. Then STOP for my verify.
4. Only after I verify: scale that section toward ~30, then move to the next PDP section (reviews-with-photos,
   trust-near-ATC, benefits, FBT, related, swatches), same prove-then-scale loop.

Keep 04-TRACKER.md + the project brain files updated as you go — I want to see progress live.
Do NOT mass-generate 30 unverified variants. Prove 2-3 on a real render first, every section.
```

## Notes for Umang
- Add the `shopforge/` folder into the app repo first, then send the prompt above.
- The prompt starts with **PDP → sticky add-to-cart** because that's the highest-conversion gap. If you'd
  rather start elsewhere, change step 2's section.
- Every output cycle ends the same way: **a real preview link for your eyes** (not local-path screenshots),
  then verify, then scale. That discipline is what keeps the library premium instead of just big.
