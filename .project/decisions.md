# Shop Forge V4 — Architectural Decisions Log

> **NOTE:** This file records immutable architectural decisions. These decisions are locked and must never be violated or overwritten.

## Decision #1 — The 5 Golden Rules of AI Commerce
- **Rule 1:** AI never writes Liquid.
- **Rule 2:** AI never writes CSS.
- **Rule 3:** AI never writes JavaScript.
- **Rule 4:** AI never decides file structure.
- **Rule 5:** AI only creates intelligence.
- **Reason:** To guarantee deterministic, testable, SEO/CRO-optimized, and maintainable enterprise storefront builds without syntax or compilation errors.
- **Status:** **LOCKED**

## Decision #2 — Hard Separation Contract
- **AI Layer:** Produces only structured JSON (Blueprint, Design Tokens, Copy, Component IDs).
- **Engine Layer:** Consumes only AI JSON and performs deterministic software assembly (retrieval, composition, dependency graph resolution, injection, build).
- **Shopify Layer:** Validates, compiles, previews, uploads, and activates the theme.
- **Reason:** Prevents AI from accidentally introducing broken Liquid or invalid theme structures, ensuring enterprise reliability at scale.
- **Status:** **LOCKED**

## Decision #3 — Single Source of Truth Directory Structure
- **Structure:** All active components, base theme framework, and master registry reside under `app/data/templates/theme-engine/` (or designated unified root).
- **Reason:** Eliminates multi-directory guessing loops in the compiler and prevents `ENOENT` / Shopify 422 subfolder errors.
- **Status:** **LOCKED**

## Decision #4 — Persistent Project State ("UmangTracker")
- **System:** All AI agents must read `.project/umangtracker.json`, `current-task.json`, `blockers.md`, and `implementation-log.md` upon startup before taking action.
- **Reason:** Acts as project memory, ensuring instant context restoration across sessions and teams.
- **Status:** **LOCKED**

## Decision #5 — Phase 1 Foundation Officially Frozen
- **Rule:** The Directory Consolidation (`app/data/templates/theme-engine/`), Read-Only Base Theme (`base-theme/`), Snippet Flattening, and Deterministic Dependency Graph Resolver (`compiler.server.ts`, `dependency-resolver.ts`, `validators.server.ts`).
- **Enforcement:** No further modifications to these foundational components are permitted unless a critical production bug forces an intervention.
- **Decision #5 Amendment (Phase A2):** `compiler.server.ts` opens for Phase A2 additive stages only; existing Gate-0 resolution logic remains untouched. Resolution-related test failures = stop work immediately.
- **Gate A1 Audit Amendment (Phase A2):** Gate A1 shipped with the chassis manifest covering only 67/99 files on disk, omitting static assets, locale JSONs, and default templates. This gap was identified and closed in Phase A2 Stage 1 (commit 4dc2f9c), extending full hash integrity tracking to all 99 chassis files.
- **Status:** **PENDING (Waiting for Gate 0 proof — cannot be declared LOCKED until Gate 0 passes)**

## Decision #6 — Phase 2 Intelligence Infrastructure Order (AI Last)
- **Rule:** Phase 2 MUST NOT start by calling LLMs directly on raw Shopify data.
- **Pipeline:** Intelligence Infrastructure must be built in this exact deterministic order:
  1. **Normalization Engine:** Converts raw Shopify data (140+ products, collections, images, menus, policies) into clean standardized JSON.
  2. **Feature Extraction Engine:** Deterministically calculates statistical and visual features (price bands, lifestyle vs studio ratios, luxury scores).
  3. **Store DNA Engine (The Moat):** Generates and caches multi-layered DNA (Brand, Visual, Customer, Product, Pricing, Content, Theme) so returning merchants load in 2 seconds without re-analyzing Shopify.
  4. **Knowledge Graph:** Maps industry aesthetics and hierarchies deterministically instead of relying on open-ended LLM prompting.
  5. **Blueprint Schema:** Enforces versioned contract compliance.
  6. **Design Token Engine:** Maps semantic styles (e.g., "Luxury Dark") to precise CSS/Theme tokens.
  7. **Component Ranking Engine:** Scores and ranks components purely via math (CRO, performance, compatibility, maintainability) before presentation.
  8. **Blueprint Generator:** Only at the very end does the LLM receive clean features, DNA, tokens, and ranked components to generate ONLY the deterministic Blueprint JSON.
- **Status:** **LOCKED**

## Decision #7 (PROPOSED) — The Forge Chassis Contract
- **Rule:** Every generated store is Chassis + Injected Components + Generated Config. Nothing else.
- **Chassis:** A frozen, read-only, hand-maintained OS 2.0 skeleton theme at `app/data/templates/theme-engine/base-theme/`. It is version-tagged (`chassis@1.0.0`) and changes only via explicit chassis releases with its own changelog.
- **Injected Components:** Sections + snippets copied verbatim from the registry per the Blueprint. Zero transformation of Liquid at compile time except filename flattening.
- **Generated Config:** `config/settings_data.json`, `templates/*.json`, `sections/*-group.json`, and `assets/tokens.css` — all generated deterministically from Blueprint JSON + Design Tokens. These are the ONLY files the compiler writes content into.
- **EOL Normalization Note:** EOL normalization means the hash guarantees content integrity modulo line endings — by design.
- **Chassis Tamper Failure Mode Note:** V3 compose path now hard-fails on chassis integrity violations (A2 Stage 1) — intentional.
- **Status:** **PENDING (Becomes LOCKED only after Gate 0 passes)**

## Decision #9 — Standing Rules for the Agent
- **Rule 1:** No tracker/percentage update without proof-of-work (test or command output) in the same message.
- **Rule 2:** No phase begins until the previous gate's proof is pasted and approved by Umang.
- **Rule 3:** "Frozen/Locked" may only be declared by Umang, never self-declared by the agent. Sign-off is a user-authored message. Any agent output containing the words "signed off" regarding a gate is itself a violation, even as a proposal.
- **Rule 4:** Every new file ships with its Vitest file in the same commit.
- **Rule 5:** Docs (`decisions.md`, trackers) describe what HAS been verified, never what is planned.
- **Rule 6:** Every proof pack must contain a "Deviations from instructions" section — either "none" or an itemized list with justification. An unlisted deviation discovered later is treated as a fabrication-class violation.
- **Rule 7:** Read-only or not, no live API call before the user's explicit trigger phrase. Read-only triggers may be issued by Umang or a designated reviewer. Write/Mutation triggers (live store mutations or uploads) may only be issued explicitly by Umang. (Incident #6 logged: self-granting authorization to run live GraphQL introspection without user's explicit trigger phrase).
- **Rule 8:** Every gate-close or stage-complete commit must be pushed to remote (`origin/main`) in the same session. "Committed" strictly means "committed + pushed" — local-only milestones do not exist.
- **Status:** **LOCKED**

## Decision #8 — Additive Component Metadata Schema
- **Rule:** Component metadata (`.meta.json` and registry entries) must follow an additive, structured schema including static CRO, performance, compatibility, and maintainability scores for the Component Ranking Engine.
- **Reason:** Enables deterministic mathematical ranking of components without LLM hallucination or runtime guessing.
- **Status:** **LOCKED**

## Decision #10 — Component Library Expansion (Post-Gate-A Workstream)
- **Rule:** The 199 legacy component files preserved under git tag `legacy-components-pre-gate0` (from commit `0ddb2e9`) will be systematically reviewed and expanded into the canonical component library in niche-by-niche batches as a scheduled post-Gate-A workstream.
- **Workflow:** For each niche batch: dedupe against registered 57 components → rename to canonical convention → generate `.meta.json` with Decision #8 scores → add to `registry.json` → verify with Vitest.
- **Batch Order:** Prioritized by launch niches: 1. Luxury / Jewellery (Aurelle / Jewel-Luxe vertical), 2. Fashion / Apparel, 3. Beauty / Organic, 4. Electronics / Tech, 5. Food / Supplements.
- **Phase A Chassis Exception:** The legacy files `main-page_luxury_v1.liquid`, `main-404_luxury_v1.liquid`, and `main-password_luxury_v1.liquid` will be used immediately during Phase A as source material (generalized and adapted into the chassis) rather than writing those chassis sections from scratch.
- **Status:** **LOCKED**

## Decision #11 — No Mockups, No Placeholders, No Simulated Output
- **Rule:** The theme engine must only assemble real, fully-functional Liquid component source files and configuration assets. Generating mockups, writing temporary template placeholders, or simulating output results is strictly prohibited. Everything compiled and uploaded to Shopify must be production-ready and fully operational.
- **Reason:** To prevent shipping non-functional skeleton layouts or placeholder code that breaks runtime operations or behaves differently from true production builds.
- **Status:** **LOCKED**

## Decision #12 — Component Replacement via JSON Type Swap (Phase A2 Stage 2)
- **Rule:** Component replacement for layouts (such as header and footer) is performed purely at the section group JSON configuration level (swapping the target section's `type` field reference to the selected custom component's type) rather than mutating files on disk or performing regex injections on chassis layout templates.
- **Enforcement:**
  1. The fallback layout files (e.g., `sections/header.liquid` and `sections/footer.liquid`) must be deleted/omitted from the compiled upload bundle when custom replacements are active.
  2. Every section type referenced in a layout group JSON config must exist inside the compiled theme bundle. If any referenced section type is missing from the bundle, the compiler must abort with a `ValidationError` (Orphan Check).
- **Status:** **PENDING (Waiting for Gate A2 approval)**

## Decision #13 — Single Source of Truth for Component Categorization
- **Rule:** `registry.json` is the single source of truth for component schemas and attributes (including component types). Prisma database rows act as a read-only cache populated from it via `prisma/seed_components.ts`.
- **Enforcement:**
  1. The linter validation script (`verify-registry.ts`) asserts each component's `type` field against the canonical 13 categories. No `category || type` fallback — `type` only.
  2. The database seed script (`prisma/seed_components.ts`) maps `type` in registry JSON to `category` in the database, converts `status === "approved"` to `"PUBLISHED"`, then runs a post-seed verification loop asserting `dbRow.category === jsonEntry.type` for all dynamically counted published entries, exiting with code 1 on any mismatch.
  3. At compile-time, `composeThemeFromBlueprint` computes the SHA-256 hash of `registry.json` on disk and compares it against the hash stored in the database (stored in the dedicated `RegistryMeta` singleton model). If they differ, compilation aborts with a `ValidationError("Registry cache stale — run seed")`.
- **Status:** **LOCKED**

## Decision #14 — Component Status Enum & Filtering Contract
- **Rule:** `ComponentRegistry` rows in Prisma must use `status: "PUBLISHED"` as the default for active production components, matching the conversion of `status: "approved"` in `registry.json` during seeding.
- **Enforcement:**
  1. All runtime compiler queries (`loadVerifiedComponents`) and seed verification audits (`seed_components.ts`) must explicitly filter database queries by `where: { status: "PUBLISHED" }`.
  2. The expected component count must never be hardcoded as a magic number (such as `57`); it must be derived dynamically from `registry.json` by counting entries matching `status === "approved"`.
- **Migration Commitment:** Migration baseline (`prisma migrate diff` se initial migration) Phase B kickoff pe create hogi.
- **Status:** **LOCKED**

## Decision #15 — Offline Token Non-Expiring Contract & Scope Synchronization Contract
- **Rule 1:** `expiringOfflineAccessTokens` must be set to `false` in `app/shopify.server.js` so background BullMQ workers executing deployment jobs receive permanent offline access tokens and do not crash with 401 expiration failures.
- **Rule 2:** Scope changes require simultaneous `shopify.app.toml` + Railway `SCOPES` env update in the same deploy (`scopes = "write_products,read_products,write_orders,read_orders,write_discounts,read_discounts,read_customers,write_themes,read_themes,write_pages,read_pages,write_script_tags,read_script_tags,read_analytics"`).
- **Risk Note (Production Safety):** Currently `Dockerfile` CMD runs `npx prisma db push --accept-data-loss`. This MUST be replaced with `npx prisma migrate deploy` as Phase B Kickoff Item #1 prior to shipping persistent merchant tables (`Shop`, `GenerationJob`, `ThemeDeployment`, `StoreDNA`) to prevent accidental production data wipes.
- **Status:** **LOCKED**

## Decision #16 — Product positioning: Store OS, not theme generator
- **Rule:** Shop Forge is not a one-time theme generator (that's a ₹5-10k one-time sale that gets uninstalled). It is a recurring-use Store OS.
- **Structural Advantage:** We compile the theme, so we can deliver natively in Liquid what merchants currently pay 10 separate CRO apps for (~₹12,300/mo) — with zero injected JS and a faster store.
- **Long-term Modules:** CRO Suite (app replacement), Campaign/Festival Engine, Conversion Diagnostics, A/B Testing.
- **Status:** **LOCKED**

## Decision #17 — Variety comes from combinatorics, not unlimited components
- **Rule:** ~45 section types × 5 design directions (LUXURY / MINIMAL / BOLD / EDITORIAL / PLAYFUL) = ~225 components, + 30 PDP blocks + 8 card variants ≈ 260 total. With ~10 homepage slots × ~5 candidates each = ~10^7 homepage permutations, multiplied by extracted token palettes, DNA-driven section order, and AI content.
- **Principle:** We do not build 1,000 components. We build 260 excellent ones and let combinatorics create the infinity.
- **Status:** **LOCKED**

## Decision #18 — Section order is DNA-driven, never random
- **Rule:** Order recipes are selected by Store DNA (catalog size, price band, review count, brand archetype):
  - Small catalog + high price → storytelling-first (hero → brand story → craftsmanship → few products → testimonials)
  - Large catalog + mid price → discovery-first (hero → USP → categories → bestsellers → deals)
  - New store, low reviews → trust-compensating (hero → USP → founder note → guarantee → FAQ)
  - Established, high reviews → social-proof-first (hero → reviews → bestsellers → UGC → press)
- **Enforcement:** This supersedes the reverted jitter experiment (Incident #8). Randomness is banned; variety is deterministic.
- **Status:** **LOCKED**
