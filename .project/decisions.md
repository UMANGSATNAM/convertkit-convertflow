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
- **Status:** **PENDING (Becomes LOCKED only after Gate 0 passes)**

## Decision #9 — Standing Rules for the Agent
- **Rule 1:** No tracker/percentage update without proof-of-work (test or command output) in the same message.
- **Rule 2:** No phase begins until the previous gate's proof is pasted and approved by Umang.
- **Rule 3:** "Frozen/Locked" may only be declared by Umang, never self-declared by the agent. Sign-off is a user-authored message. Any agent output containing the words "signed off" regarding a gate is itself a violation, even as a proposal.
  - *EOL Normalization Note:* EOL normalization means the hash guarantees content integrity modulo line endings — by design.
- **Rule 4:** Every new file ships with its Vitest file in the same commit.
- **Rule 5:** Docs (`decisions.md`, trackers) describe what HAS been verified, never what is planned.
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
