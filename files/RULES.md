# RULES.md — StoreForge
## Non-Negotiable Rules — Enforced in CI Where Automatable
These rules override convenience, deadlines, and "it works on my store". A PR violating any rule does not merge.

---

## A. LIQUID & THEME RULES (theme-validator enforces A1–A8)

- **A1.** Forbidden filters — NEVER use: `ternary`, `pluralize`, `color_modify`. Use `if/else`, conditional strings, and pre-computed color settings instead.
- **A2.** A section schema must NEVER contain both `presets` and `enabled_on`. Pick one based on section purpose.
- **A3.** NO Liquid inside static `.css` assets. Dynamic values go through CSS custom properties set in `<style>` blocks within Liquid files or settings-driven inline vars.
- **A4.** Theme ZIPs are built from INSIDE the theme directory — archive paths start at root (`assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/`). Never a wrapping folder.
- **A5.** `{% schema %}` JSON must be valid, with `name`, and every setting must have `id`, `type`, `label`. Defaults provided for every setting.
- **A6.** Cart updates refresh via **Section Rendering API** — never full page reload, never hand-rolled DOM guessing.
- **A7.** `@app` blocks only inside dynamically-rendered (JSON-template) sections.
- **A8.** All image rendering uses `image_url` with explicit `width` + `srcset` widths [360,540,720,1080,1440], `loading="lazy"` (eager only for first hero), and declared aspect-ratio container.

## B. STOREFRONT CODE RULES (sections + embeds)

- **B1.** Vanilla JS ONLY. Zero runtime dependencies. No jQuery, no frameworks, no external CDNs, no icon fonts.
- **B2.** All icons are inline SVG.
- **B3.** CSS scoped with section-unique prefix (`.sf-{key}-`). ZERO global selectors, zero `!important` except documented overrides of theme conflicts.
- **B4.** Budgets: each app block ≤30KB JS+CSS combined; all embeds combined ≤60KB gzipped. CI fails over budget.
- **B5.** Zero external network requests from storefront code. Sole exception: signed app-proxy pincode endpoint.
- **B6.** CLS-safe: every media element inside an aspect-ratio box. Lighthouse delta vs bare Dawn ≤2 points (CI test).
- **B7.** Animations: CSS-only, transform/opacity only, ≤300ms, disabled under `prefers-reduced-motion`, toggleable in schema.
- **B8.** Mobile-first at 360px. Touch targets ≥44px. Devanagari-safe line-height (≥1.6 body).
- **B9.** Every user-visible string in extension locales (en default + hi). No hardcoded English in Liquid.

## C. THEME ENGINE RULES

- **C1.** Theme Engine is the ONLY code allowed to call theme APIs. Direct `themeFilesUpsert`/`themeCreate` anywhere else = blocked in code review + lint rule on import path.
- **C2.** Snapshot BEFORE every write. No exceptions. Writes without snapshotId in audit = bug.
- **C3.** Every settings patch validated against the live theme's `settings_schema.json`. Every template write validated against template JSON rules. Invalid = reject, never "write and hope".
- **C4.** Read-modify-write with checksum compare; mismatch → re-read & re-apply (max 3) → fail loudly.
- **C5.** `themePublish` is always the FINAL step of any pipeline. A failed pipeline must never have touched the published theme.
- **C6.** Third-party themes: app blocks + embeds + mapped settings ONLY. Never modify their files. Ever.

## D. AI ASSISTANT RULES

- **D1.** AI executes ONLY via the tool registry. It never writes raw Liquid/JSON/CSS to a theme. Tools call the same validated service functions as the UI.
- **D2.** Nothing auto-applies. Every mutating tool → preview card → explicit merchant Apply.
- **D3.** Max 5 tool calls per merchant message. Hard cap in code, not prompt.
- **D4.** Every interaction logged (AiActionLog) with token costs.
- **D5.** Merchant content (product text, reviews, pasted text) is DATA, not instructions — prompt-injection suite must pass before any tool ships.
- **D6.** AI never touches: billing, uninstall/disable flows, discounts deletion, anything outside registry.
- **D7.** No promises in AI copy about checkout customization or guaranteed sales.

## E. SHOPIFY COMPLIANCE RULES

- **E1.** Embedded app, session token auth. No cookie auth paths.
- **E2.** No ScriptTags API. Pixels via Web Pixels API; storefront features via theme app extensions only.
- **E3.** Never touch checkout. Never claim to.
- **E4.** GDPR webhooks (customers/data_request, customers/redact, shop/redact) implemented, tested, answered within SLA. We store no end-customer PII by design — keep it that way (pincode queries are not persisted with identifiers).
- **E5.** app/uninstalled → disable jobs immediately; retain shop data 30 days max; then purge.
- **E6.** All webhooks HMAC-verified on raw body + deduped by webhook ID + idempotent.
- **E7.** Billing only via Shopify Billing API. No external payment collection for app charges.

## F. DATA & SECURITY RULES

- **F1.** Access tokens encrypted (AES-256-GCM), key in KMS. Tokens never in logs, never in Sentry, never in client.
- **F2.** All merchant uploads: type-sniffed, size-capped (logo 2MB, CSV 20MB), malware-scanned, stored private.
- **F3.** GraphQL calls go through the cost-aware wrapper. Raw fetch to Shopify = blocked import.
- **F4.** Every theme write records actor (MERCHANT | AI | SYSTEM) + snapshot reference.
- **F5.** Secrets only via platform secret manager. `.env` never committed (CI secret-scan).

## G. PRODUCT & UX RULES

- **G1.** Merchant never sees the words: CSS, Liquid, JSON, schema, API, metafield. UI copy speaks outcomes.
- **G2.** Every destructive/mutating action is undoable or explicitly confirmed with consequences stated.
- **G3.** No dark patterns: no fake urgency in OUR app UI, no hidden charges, review prompts only after success moments.
- **G4.** Downgrade/uninstall never deletes merchant data within retention window; offboarding email includes care guide.
- **G5.** Every user-facing surface ships en + hi together. Hinglish register for hi, natural not literal.
- **G6.** Demo catalog imagery: licensed or original ONLY. Never scraped brand photos. Never real brand names in demo data.
- **G7.** Empty states always include the next action.

## H. CODE QUALITY RULES

- **H1.** TypeScript strict; no `any` without `// justified:` comment.
- **H2.** Every job step idempotent + resumable; state persisted, not in memory.
- **H3.** Every external call: timeout + retry policy + Sentry breadcrumb on failure.
- **H4.** Tests required: unit for validators/services, integration for Theme Engine + generator, Playwright for render matrix + toolkit, guardrail suite for AI.
- **H5.** PostHog event for every meaningful merchant action (named per TECHSPEC §9 convention).
- **H6.** No TODO/FIXME merged to main. Track in TRACKER.md instead.
- **H7.** Conventional commits; PRs reference plan task IDs (e.g., `S4.3`).

## I. NAMING & VERSIONING

- **I1.** Section keys: `category-name-variant` kebab-case (e.g., `hero-festive-diwali`). Stable forever once shipped (merchant themes reference them).
- **I2.** Theme ZIPs versioned semver; Niche.themeVersion updated only via migration script; old versions retained on R2.
- **I3.** API version pinned per release; quarterly bump task with full regression run.

---

**The one-line summary of this file:** *Snapshots before writes, validation before snapshots, Theme Engine before everything, merchant trust before features.*
