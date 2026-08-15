# Next steps — picked up from the theme + engine session

## Done in this session

**dev-theme-peri (1,647 sections)** — audited and repaired:
- Deleted `fix_errors.py` (the bulk-regex script that corrupted files)
- 561 mojibake sequences fixed (₹, —, emojis) across 70 files, in two passes — the second pass caught a `latin-1` class the first missed
- Cart drawer was force-opening on **every page load** (leftover preview script) — removed
- Add-to-cart never refreshed or opened the drawer across 110 call sites — new `assets/cart-drawer.js` wraps `fetch` once, no per-section changes
- 70 collection pages had dead filters — `facets.js` and `component-facets.css` did not exist, now built
- Wishlist was 76 separate localStorage keys and the drawer read a key nobody wrote — now one shared store, header count, working drawer
- Back-in-stock was product-level, so a sold-out size showed nothing — now variant-aware across all 70 PDPs
- 58 of 69 countdown timers were frozen at `4h 00m 00s` — one shared engine, schema-controlled (evergreen / fixed / daily)
- Predictive search built; 6 orphaned JS files deleted (762 lines, zero matching markup)
- All external images removed: 263 Unsplash + 78 from two *other stores'* Shopify CDNs
- 5 fake ratings ("4.9/5 (2,304 Reviews)") turned into empty-by-default settings
- 8 static mockup sections rebuilt with real schema, blocks and store data

**Engine** — connected to the theme:
- `scripts/sync_peri_to_engine.cjs` publishes all sections into the engine registry (re-runnable, `--dry` supported)
- Usable components: **25 → 1,657**
- Blueprint extended: product page + collection page blueprints added, cart-drawer and popup added to globals, homepage stack widened
- Retrieval type aliases added for the new types
- Pipeline now resolves product and collection templates

Verified: every blueprint section type resolves to at least one component. Zero broken template refs, zero invalid schema JSON, zero unbalanced Liquid tags, zero images without alt.

---

## What is left

### 1. Run one real generation and check the output
Nothing here has been through a live generate. Confirm that `templates/product.json` and `templates/collection.json` are actually produced and that the chosen PDP renders.

```bash
node scripts/sync_peri_to_engine.cjs --dry   # confirm counts first
node scripts/sync_peri_to_engine.cjs
```

Then generate a store and check the pipeline log for:
- `[Phase 5] Resolved PRODUCT product-page -> …`
- `[Phase 5] Resolved COLLECTION collection-page -> …`
- `[Phase 5] Resolved GLOBAL cart-drawer -> …`

### 2. Folder cleanup (not started)
| Item | Size |
| :--- | :--- |
| `output.txt` + `output2.txt` | 116 MB of log dumps |
| `tmp/` | 16,330 files |
| `preview-homepages.html`, `preview.html` | 8 MB |
| `dev-theme-peri-remote`, `remote_theme`, `theme-template`, `themes`, `dist-themes`, `theme-extension-backup`, `sf-embeds-backup` | 7 duplicate theme copies |
| `fix_*.py`, `generate_v*.py`, `rebuild_v*.py` at root | ~40 one-off scripts |
| `temp-*`, `tmp-*`, `test-*`, `check_*` at root | ~45 scratch scripts |

The `fix_*.py` family is the same kind of script that broke the encoding. Worth deleting rather than leaving where someone can run them.

### 3. Smaller items
- 54 registry entries still `status: "stub"` — they are the old hand-written components and are skipped by retrieval. Either finish or remove them.
- `app/services/redis.server.ts` has a pre-existing TS error (`dotenv` has no default export). Unrelated to this work but it will fail a strict build.
- Social proof popup defaults to `aggregate` mode now (honest). Switch to `simulated` in theme settings if you want the invented-names version.
- Countdown defaults to `evergreen`. If you have a real sale deadline, `fixed` converts better because it matches your emails and ads.

---

## Key contracts to remember

- Engine reads `app/data/templates/theme-engine/`, **not** `dev-theme-peri/`. Run the sync script after any theme change.
- `THEME-ARCHITECTURE.md` in `dev-theme-peri/` documents the shared JS modules, DOM events, markup attributes and universal snippets. That is the contract for new sections.
- Never run a bulk find-and-replace across the theme. Every fix in this session was guarded: line count, Liquid tag count and schema JSON had to stay valid or the file was skipped.
