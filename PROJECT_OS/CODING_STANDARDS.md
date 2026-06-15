# Coding Standards

## 1. Storefront Performance Constraints
- **Zero React on Storefront**: All storefront widgets (e.g. Sticky Cart, countdowns, popups) must be written in pure Vanilla JavaScript.
- **Payload Budget**: The total compiled payload for storefront assets must stay under **40KB gzipped**.
- **esbuild Compilation**: Use `esbuild` for bundling storefront JS/CSS. Do not use heavy packages.

## 2. CSS Conventions
- **BEM (Block Element Modifier)**: All custom CSS classes injected into the merchant's theme must follow BEM naming conventions to prevent style bleeding.
  - Example: `.sf-sticky-atc` (block), `.sf-sticky-atc__button` (element), `.sf-sticky-atc__button--disabled` (modifier).
- **CSS Variables**: Use theme-provided CSS variables for colors, typography, and spacing to match the parent store's look and feel.

## 3. Database & Transactions
- **TypeScript Strictness**: Type checking must pass with zero errors before pushing changes to production.
- **Prisma Client Guidelines**:
  - Always handle database queries inside `*.server.ts` files.
  - Perform transactions using `prisma.$transaction` when doing multi-row updates or snapshots.
  - Safely type JSON columns using custom TypeScript type assertions.

## 4. Theme Engine Safeguards
- **Theme Snapshots**: Always create a theme file snapshot (`ThemeSnapshot` table) before patching or overwriting settings/templates.
- **Fallbacks**: Provide safe defaults when themes do not support specific settings schemas.
