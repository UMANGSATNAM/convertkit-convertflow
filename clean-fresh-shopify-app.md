# Task Plan: Clean Official Shopify Remix App (Fresh Hello World)

## Objective
Reset the codebase into a clean, standard, official Shopify Remix + Polaris application with a fresh database and zero clutter, while preserving `.env`, Shopify API credentials (`shopify.app.toml`), and version control history.

## Steps
1. **Safety Backup**: Create a Git branch `archive/legacy-backup` to ensure all historical code, sections, and landing pages can be restored at any time.
2. **Remove Extraneous Folders & Legacy Assets**:
   - Folders: `agency-agents`, `artifacts`, `beauty-product-landing`, `design-system`, `dev-theme-peri`, `files`, `indian-dress-landing`, `layout`, `packages`, `PROJECT_OS`, `shopforge`, `tmp`, `extensions`.
   - Root docs/temp files: `ConvertKit-ConvertFlow-Complete.pdf`, `Idea-Document.md`, `NEXT-STEPS.md`, `NICHE_DATA_CONTRACT.md`, `RUNBOOK.md`, `STORE-GENERATION-DESIGN.md`, `Shopify pagebuilder technical prompt`, `final_fix.cjs`, `hi-untranslated.md`.
3. **Database Clean Reset**:
   - Simplify `prisma/schema.prisma` to the official Shopify `Session` model.
   - Run `npx prisma db push --force-reset` to wipe legacy tables and generate fresh client.
4. **App Directory Clean Reset (`app/`)**:
   - Remove legacy internal directories: `All Codes`, `builder`, `data`, `lib`, `pagekit`, `services`, `templatesHtml.js`.
   - Simplify `app/routes/` to:
     - `app.jsx`: App Bridge wrapper with standard navigation.
     - `app._index.jsx`: Clean Polaris Hello World dashboard.
     - `auth.$.jsx` & `auth.login/`: Official OAuth handling.
     - `webhooks.jsx` + compliance webhooks.
     - `$.jsx`: Not found boundary.
5. **Clean `package.json`**:
   - Remove dead scripts (`pagekit:check`, `sync:engine`, `validate:theme`, etc.).
   - Ensure clean standard Remix + Vite build scripts.
6. **Build & Verify**:
   - Run `npm run build` to confirm zero compilation errors.
   - Verify ready for `npm run dev` / `shopify app dev`.
