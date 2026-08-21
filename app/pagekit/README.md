# PageKit

A self-contained tool for applying whole page designs to a merchant's live theme.

## Why this exists separately

The theme engine grew around one-shot store generation and accumulated a lot of
behaviour: retrieval scoring, style families, AI copy, niche profiles. Applying a
hand-authored page needs none of that, and inheriting it made failures hard to
locate — a page that came out as header-and-footer-only could have been a missing
section, a skipped write, a scoring fallback or an empty template, and nothing in
the pipeline said which.

PageKit does one job: take a list of section ids, put them on the live theme, and
tell you what actually rendered.

## The rule that shapes everything here

**Nothing fails silently.**

Three separate places used to swallow a failure, and between them they produced
the same symptom every time — a page with a header, a footer, and nothing in
between, with no error on screen and none in the log.

1. **Unresolved sections.** The old path called `known.get(componentId)`, pushed
   anything missing onto a `missingFiles` array, and wrote the template anyway.
   `hp-v1-home` had all nine of its sections missing and failed exactly this way.

2. **Sections that existed but were never synced.** The nine `hp1-fresh-*` files
   were sitting in `dev-theme-peri/sections/` the whole time. They were invisible
   to `registry.json` because `sync_peri_to_engine.cjs` had not been run, and a
   forgotten build step became a blank page.

3. **Writes Shopify refused.** `upsertThemeFilesBatched` prints
   `❌ Shopify user errors in batch` and then returns normally, so the caller
   cannot tell a rejected file from an accepted one. This is why
   *"Invalid schema: setting with id=`mobile_gap` default must be a step in the
   range"* appeared in the log while the apply reported success.

So in PageKit:

- **`resolveSections()`** checks the engine registry first, then
  `dev-theme-peri/sections/` — a section authored a minute ago works without a
  sync. Anything found in neither is returned as `unknown`, and `applyPage()`
  refuses the whole page rather than writing part of it.
- **`writeThemeFiles()`** throws on `userErrors` instead of logging them. PageKit
  has its own uploader for this reason; changing the shared one would touch every
  caller in the app.
- **`backup()`** copies every file an apply will overwrite into
  `assets/pagekit-backup.json` *before* writing, and is deliberately not wrapped
  in a `try`. If the backup fails, the apply does not happen. The existing
  `createSnapshot` helper is not used here: with `R2_ACCOUNT_ID` unset it logs a
  warning, returns `{ id: "dev-snapshot-id" }` and stores nothing.
- **`verifyPage()`** fetches the rendered storefront and reports, per section,
  whether it produced any markup. Every structural check in this project has
  passed at least once while the page was blank; the HTML is the only thing that
  can tell.

## Applying is immediate

Apply writes to the **published** theme. There is no draft and no second publish
step — the design is live when the request returns. That is why the backup and
the refusal above are not optional.

Preview is separate and non-destructive: a design is staged as
`templates/index.<variant>.json`, served at `?view=<variant>`, which shoppers
never see. Header and footer are section groups shared by every template, so a
preview never touches them.

Previews fill the grid on their own, one at a time, after the page loads.
Staging in the loader is what made the previous screen appear not to open at all
— a hundred-odd theme writes inside a Remix loader exceeds the request budget and
the merchant gets a blank tab with no error.

## Files

```
pagekit/
  pages.ts            page definitions — add designs here, nothing else
  registry.server.ts  resolves ids to Liquid (engine registry, then authoring)
  upload.server.ts    writes theme files, throws on userErrors
  apply.server.ts     backup → apply → undo; live apply and preview staging
  verify.server.ts    fetches the rendered page and reports what appeared
```

The UI is `app/routes/app.pagekit.tsx`, linked as "Build your store".

## Adding a page

Add an object to `PAGES` in `pages.ts`:

```ts
{
  id: "my-home",
  name: "My Home",
  pageType: "index",
  niche: "Streetwear",
  description: "One line a merchant can judge it by.",
  sections: ["hp51-hero-tabs", "hp51-new-drops", "hp51-newsletter"],
  header: "hp51-header",
  footer: "hp51-footer",
}
```

Section ids may live in `registry.json` **or** in `dev-theme-peri/sections/`.
Write a new `.liquid` file there and it is usable immediately.

## Checking

```
npm run pagekit:check
```

It runs over every page in `pages.ts` *and* the legacy `page-templates.ts`, and
fails with exit 1 on:

- a section id that resolves nowhere;
- a section whose schema is not valid JSON;
- a duplicate setting id within one schema or block;
- a `range` whose default is outside min–max, or is not `min + step·n`.

That last rule matters because Shopify rejects the file and the shared uploader
reports success anyway. `range.step` is optional and defaults to 1 — an earlier
version of this check treated a missing step as an error and flagged five valid
sections.

`npm run build` runs this first, so a page that cannot render never ships.
