# ConvertFlow — Runbook to Live

Work top to bottom. Tick each box only after its **Proof** command prints what it should.

Rule for the whole document: **never accept "done" from an AI without running the Proof command yourself.** A confident summary is not evidence. The Proof commands are chosen so their output cannot be faked by a description.

---

## Phase 0 — Before you touch anything

- [x] **0.1 Know your git situation**

  ```bash
  git branch --show-current
  git status --short | wc -l
  ```

  You are on `main` with roughly **4,863 changed files**. Do not commit that in one go — you will not be able to review or revert it.

- [x] **0.2 Create a working branch**

  ```bash
  git checkout -b theme-engine-integration
  ```

  Proof: `git branch --show-current` prints `theme-engine-integration`.

- [x] **0.3 Check what is actually junk before committing**

  ```bash
  git status --short | grep -E "output\.txt|output2\.txt|tmp/|\.pyc|preview.*\.html" | wc -l
  ```

  If this is large, do Phase 1 first — otherwise you commit 116 MB of logs.

---

## Phase 1 — Clean the folder

Do this before any commit. It is the difference between a reviewable diff and an unreviewable one.

- [x] **1.1 Delete the log dumps**

  ```bash
  rm -f output.txt output2.txt output3.txt build.log build_output.txt build_output_utf8.txt
  rm -f preview.html preview-homepages.html preview-elite.html preview_niches.html
  rm -f test.jsx app._index_backup.jsx
  ```

  Proof: `ls -la | awk '$5>5000000'` prints nothing.

- [x] **1.2 Delete the one-off scripts that break things**

  These are the same family as `fix_errors.py`, which corrupted the theme's encoding. Leaving them where someone can run them is the risk.

  ```bash
  rm -f fix_*.py clean_*.py check_and_fix_placeholders.py extract.py
  rm -f generate_*.py rebuild_*.py build_*_pdps.py build_international_pdps.py
  rm -f fix-encoding.ps1 inject-offer-banners.ps1 generate-json-templates.ps1
  rm -f temp-*.ts temp_*.ts tmp-*.ts tmp-*.json trigger_gen*.ts
  rm -f test-*.ts test-*.cjs test-*.mjs test_*.ts test_*.js check_*.ts check_*.cjs
  rm -f test-output.txt test-output-2.txt src.html src_utf8.html test_hp63.html
  ```

  Proof: `ls fix_*.py generate_v*.py 2>&1 | head -1` prints "No such file".

- [x] **1.3 Remove duplicate theme copies**

  Keep `dev-theme-peri` only. The rest are stale pulls and backups.

  ```bash
  rm -rf dev-theme-peri-remote remote_theme tmp_theme_pull tmp_remote_check_2 tmp_remote_check_3
  rm -rf theme-extension-backup sf-embeds-backup dist-themes themes scratch tmp
  ```

  Proof:

  ```bash
  ls -d *theme* 2>/dev/null
  ```

  Should list only `dev-theme-peri`, `theme-template` (keep if the engine references it — check first with `grep -rl theme-template app/`).

- [x] **1.4 Confirm you did not break the app**

  ```bash
  npm run build
  ```

  Proof: build completes. If it fails, the error names the file you deleted — restore just that one with `git checkout -- <file>`.

- [ ] **1.5 Commit the cleanup on its own**

  ```bash
  git add -A
  git commit -m "chore: remove log dumps, one-off scripts and duplicate theme copies"
  ```

  Keep this commit separate. If cleanup broke something, you can revert it without losing the engine work.

---

## Phase 2 — Sync the theme into the engine

The engine reads `app/data/templates/theme-engine/`, **not** `dev-theme-peri/`. Every theme change needs a sync.

- [ ] **2.1 Dry run first**

  ```bash
  node scripts/sync_peri_to_engine.cjs --dry
  ```

  Proof — expect roughly:

  ```
  synced   1641 sections
  kept     70 existing registry entries
  skipped  6
  ```

  Six skips are correct: `header`, `footer`, `main-cart`, `main-collection`, `main-search` (template-bound, no preset) and `product-card-api` (no schema).

- [ ] **2.2 Run it**

  ```bash
  node scripts/sync_peri_to_engine.cjs
  ```

- [ ] **2.3 Prove the registry is real**

  ```bash
  node -e "
  const r=require('./app/data/templates/theme-engine/registry.json');
  const fs=require('fs'), p=require('path');
  const E='app/data/templates/theme-engine';
  const usable=r.components.filter(c=>['approved','production','PUBLISHED'].includes(c.status));
  const missing=r.components.filter(c=>c.liquidPath&&!fs.existsSync(p.join(E,c.liquidPath)));
  console.log('total:',r.components.length,'usable:',usable.length,'missing liquid:',missing.length);
  "
  ```

  Proof: `usable: 1657`, `missing liquid: 0`.

  **This is the anti-hallucination check.** If an AI says the sync worked, this command either agrees or it does not.

- [ ] **2.4 Prove every blueprint type resolves**

  ```bash
  node -e "
  const r=require('./app/data/templates/theme-engine/registry.json');
  const have={};
  r.components.filter(c=>['approved','production','PUBLISHED'].includes(c.status))
   .forEach(c=>have[c.sectionType]=(have[c.sectionType]||0)+1);
  ['hero','product-grid','collection','collection-page','product-page','trust','testimonials',
   'faq','newsletter','brand-story','ugc','announcement','header','footer','cart-drawer','popup']
   .forEach(t=>console.log((have[t]?'ok  ':'ZERO'), t, have[t]||0));
  "
  ```

  Proof: no line starts with `ZERO`.

---

## Phase 3 — Local test before anything goes near a store

- [ ] **3.1 Unit tests**

  ```bash
  npm run test
  ```

  Proof: vitest reports pass. Record the failing count if any — do not proceed with new failures you did not have before.

- [ ] **3.2 Theme validator**

  ```bash
  npm run validate:theme
  ```

- [ ] **3.3 Shopify Theme Check on the theme itself**

  ```bash
  cd dev-theme-peri && shopify theme check ; cd ..
  ```

  Proof: zero errors. Warnings are acceptable; errors are not.

- [ ] **3.4 Start the app locally**

  ```bash
  npm run dev
  ```

  Proof: the CLI prints a preview URL and the app loads in the Shopify admin.

---

## Phase 4 — First real generation

This is the step that has never been run. Everything before this was static verification.

- [ ] **4.1 Generate a store from the app UI**, on a development store — never a live one.

- [ ] **4.2 Watch the pipeline log for these exact lines**

  ```
  [Phase 5] Resolved hero -> …
  [Phase 5] Resolved PRODUCT product-page -> …
  [Phase 5] Resolved COLLECTION collection-page -> …
  [Phase 5] Resolved GLOBAL announcement -> …
  [Phase 5] Resolved GLOBAL header -> …
  [Phase 5] Resolved GLOBAL footer -> …
  [Phase 5] Resolved GLOBAL cart-drawer -> …
  ```

  The `PRODUCT`, `COLLECTION` and `cart-drawer` lines are new. If they are missing, the blueprint change did not take effect.

  If you see `[Phase 5] No component found for sectionType=X`, note X — it means the type is missing from `typeMapping` in `app/services/theme-engine/retrieval.server.ts`.

- [ ] **4.3 Confirm the templates were written**

  In the generated theme, these must exist:
  - `templates/index.json`
  - `templates/product.json`
  - `templates/collection.json`

  If `product.json` and `collection.json` are missing, `resolvePage()` returned empty — check the warnings from 4.2.

- [ ] **4.4 Open the generated store and check by eye**

  | Page | What to check |
  | :--- | :--- |
  | Home | Sections render, no blank gaps, no stock photos of a business that is not yours |
  | Product | Gallery shows the product's own images, price matches the cart, add to cart opens the drawer |
  | Collection | Filters work and do not reload the page |
  | Any page | Cart drawer does **not** open on its own after ~half a second |
  | Mobile 375px | Nothing overflows sideways, sticky bar does not cover the popup |

- [ ] **4.5 Check the browser console**

  Proof: no red errors. `404` on an asset means the sync missed a file — re-run Phase 2.

---

## Phase 5 — Commit and push

Only after Phase 4 passes.

- [ ] **5.1 Review the diff in parts**

  ```bash
  git status --short | wc -l
  git diff --stat app/services/
  ```

  Read the `app/services/` diff properly — that is the engine logic. The theme and registry diffs are bulk and can be skimmed.

- [ ] **5.2 Commit in three logical pieces**

  ```bash
  git add dev-theme-peri/
  git commit -m "fix(theme): repair encoding, cart drawer, wishlist, countdowns, external images"

  git add app/data/templates/theme-engine/ scripts/sync_peri_to_engine.cjs
  git commit -m "feat(engine): sync 1641 theme sections into the component registry"

  git add app/services/
  git commit -m "feat(engine): blueprint generates product and collection pages, cart drawer added to globals"
  ```

- [ ] **5.3 Push the branch, not main**

  ```bash
  git push -u origin theme-engine-integration
  ```

- [ ] **5.4 Merge to main only after a second successful generation**

---

## Phase 6 — Deploy and live test

- [ ] **6.1 Deploy the app**

  ```bash
  npm run deploy
  ```

- [ ] **6.2 Confirm Railway picked up the build** — check the deployment log for a successful build, not just a green tick.

- [ ] **6.3 Generate one store on the live app, still on a development store.**

- [ ] **6.4 Run Phase 4.4 and 4.5 again** against that store.

- [ ] **6.5 Lighthouse on mobile** for the generated homepage.

  Targets: LCP under 2.5s, CLS under 0.1, performance 85 or better. If LCP is poor, the hero image is not preloading.

- [ ] **6.6 Only now, a real merchant store.**

---

## How to check Antigravity is not making things up

Three habits, in order of usefulness.

**1. Ask for the count, then count it yourself.**

Not "did you fix the sections?" but "how many files did you change?" — then:

```bash
git status --short | wc -l
git diff --stat | tail -1
```

If it says 40 files and git says 3, the summary was optimistic.

**2. Grep for the thing that should no longer exist.**

Every claim of removal has a matching search. Examples that apply right now:

```bash
# claim: "removed all external images"
grep -rn "unsplash.com" dev-theme-peri/sections/ | wc -l          # must be 0

# claim: "fixed the hardcoded currency"
grep -rn '₹\s*{{' dev-theme-peri/sections/ | wc -l                # must be 0

# claim: "every section has a preset"
node -e "
const fs=require('fs');let n=0;
for (const f of fs.readdirSync('dev-theme-peri/sections')) {
  if(!f.endsWith('.liquid'))continue;
  const t=fs.readFileSync('dev-theme-peri/sections/'+f,'utf8');
  const m=t.match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/);
  if(m&&!JSON.parse(m[1]).presets)n++;
}
console.log('sections without preset:',n);"   # 5 is correct, more is not
```

**3. Never accept a bulk find-and-replace across the theme.**

This is what corrupted the encoding the first time. If a script must touch many files, it has to refuse to write a file unless all three still hold:

- line count unchanged
- Liquid tag count unchanged
- schema JSON still parses

And it must back up before writing. If a proposed script does not do this, it is not safe to run.

**One more thing worth knowing:** a verification script can be wrong in the same direction as the fix. During this work, one scan reported "0 mojibake remaining" while broken characters were still visibly on the page — because the detector and the fix shared the same faulty assumption. So for anything that a person can see, **look at the rendered page**, not only at a script's output.

---

## Reference

| File | What it is |
| :--- | :--- |
| `dev-theme-peri/THEME-ARCHITECTURE.md` | The contract for building new sections — shared JS, DOM events, markup attributes, universal snippets |
| `dev-theme-peri/AUDIT-REPORT.md` | Everything found and fixed in the theme |
| `dev-theme-peri/AB-BARS-FIX-SPEC.md` | Spec format that worked well for delegating repetitive section work |
| `scripts/sync_peri_to_engine.cjs` | Theme → engine sync, re-runnable, `--dry` supported |
| `NEXT-STEPS.md` | Shorter handoff summary |

**The one rule that matters most:** the engine reads `app/data/templates/theme-engine/`. Any change to `dev-theme-peri/` is invisible to the engine until you re-run the sync script.
