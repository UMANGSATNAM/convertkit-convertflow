# ShopForge — Project Workspace

**What it is:** an app that auto-generates complete, premium, CRO-ready Shopify stores. User picks a niche +
answers a few questions → the system assembles a real store from a large section library → shows 3 different
previews on the user's OWN products/images → user publishes the one they like.

**The goal (locked):**
- A big library of **premium, CRO-tested, mobile-first sections** — target **~30 variants per section type**.
- A single **base/skeleton (chassis) theme** that stays the same in every store (structure, cart, checkout,
  core JS, required templates). Only the **look-changing sections** get swapped per store.
- Every generated store looks **different + premium every time**, on the user's real content, and stays
  editable (theme editor + custom Liquid).

**This folder = the single source of truth.** Read in order:
- `01-FLOW.md` — the 5-stage generation flow + architecture (chassis, selection engine, blueprints).
- `02-PLAN-STATUS.md` — the phased plan + where we are now + what's done + what's next.
- `03-SECTION-LIST.md` — every section type to build, with the 30-variant target + CRO priority.
- `04-TRACKER.md` — build status per section/variant.
- `05-RULES.md` — the locked build rules (binding on every section — token-driven, real-data, premium bar, CRO, responsive).
- `06-ANTIGRAVITY-PROMPT.md` — the kickoff prompt for the coding agent.

**Non-negotiables (short):** structure niche-agnostic · all styles kept, engine matches style→niche ·
real-data only (no fabricated reviews/urgency) · token-driven (no hardcoded values) · mobile-first responsive ·
CRO-tested patterns · premium bar (must hold up next to CaratLane/GIVA/Sugar) · prove one, verify on real
render, then scale.
