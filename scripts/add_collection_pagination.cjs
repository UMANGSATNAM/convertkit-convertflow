#!/usr/bin/env node
/**
 * Give the cp-v* collection layouts real pagination.
 *
 * ## Why
 *
 * 68 of these sections cap their grid with `limit: limit_num` and have no
 * `{% paginate %}` at all. That is correct for a homepage "featured collection"
 * block, but as a collection template it silently truncates the catalogue: a
 * store with 200 products shows 12 and offers no way to reach the rest. That is
 * why the collection template was left on the plain `main-collection` chassis
 * and none of these designs could be used.
 *
 * ## The transformation
 *
 * Four edits per file:
 *
 *   1. After `assign limit_num`, clamp it. Shopify rejects `by:` outside 1–50,
 *      and `products_per_page` is merchant-editable.
 *   2. Fall back to `collections.all` when nothing else resolved, so
 *      `{% paginate %}` always receives a real collection. This also retires the
 *      placeholder-card branch that produced the empty grids.
 *   3. Open `{% paginate target_coll.products by: cf_per_page %}` before the
 *      grid and drop `limit:` from the loop — inside a paginate block, iterating
 *      the collection yields exactly the current page.
 *   4. Close with the shared `cf-pagination` snippet and `{% endpaginate %}`.
 *
 * Page links render only when the section is showing the collection the shopper
 * is on, so homepage use is visually unchanged: `by:` caps the grid at the same
 * number `limit:` did.
 *
 * ## Safety
 *
 * A previous bulk script corrupted 10 sections in this repo. This one locates
 * the closing `{% endif %}` by walking tags and tracking nesting depth rather
 * than by pattern-matching, and refuses to write unless every file passes:
 *   - exactly one occurrence of each anchor it edits
 *   - if/endif, for/endfor and paginate/endpaginate all balanced afterwards
 *   - schema block byte-identical and still valid JSON
 *   - no `limit:` left on the paginated loop
 * Backups are written first. Run with --dry to preview.
 */

const fs = require("fs");
const path = require("path");

const SECTIONS = path.resolve(__dirname, "..", "..", "dev-theme-peri", "sections");
const DRY = process.argv.includes("--dry");
const BACKUP_DIR = path.resolve(__dirname, "..", ".backups", `cp-pagination-${Date.now()}`);

const LIMIT_ASSIGN = /\{%-?\s*assign\s+limit_num\s*=\s*section\.settings\.products_per_page[^%]*%\}/;
const FALLBACK_LINE = "{% if target_coll == blank or target_coll.products.size == 0 %}{% assign target_coll = collection %}{% endif %}";
const GRID_IF = "{% if target_coll != blank and target_coll.products.size > 0 %}";
const LOOP = "{% for product in target_coll.products limit: limit_num %}";
const LOOP_NEW = "{% for product in target_coll.products %}";

/**
 * Finds the `{% endif %}` that closes the `{% if %}` starting at `fromIndex`.
 * Walks every Liquid tag and tracks depth, so a nested if/for inside the branch
 * cannot make it stop early — which a regex would.
 */
function findMatchingEndif(src, fromIndex) {
  const tagRe = /\{%-?\s*(if|unless|endif|endunless)\b/g;
  tagRe.lastIndex = fromIndex;
  let depth = 0;
  let m;
  while ((m = tagRe.exec(src)) !== null) {
    const tag = m[1];
    if (tag === "if" || tag === "unless") depth++;
    else if (tag === "endif" || tag === "endunless") {
      depth--;
      if (depth === 0) {
        const end = src.indexOf("%}", m.index);
        return end === -1 ? -1 : end + 2;
      }
    }
  }
  return -1;
}

function tagCounts(src) {
  const c = (re) => (src.match(re) || []).length;
  return {
    if: c(/\{%-?\s*if\b/g),
    endif: c(/\{%-?\s*endif\s*-?%\}/g),
    for: c(/\{%-?\s*for\b/g),
    endfor: c(/\{%-?\s*endfor\s*-?%\}/g),
    paginate: c(/\{%-?\s*paginate\b/g),
    endpaginate: c(/\{%-?\s*endpaginate\s*-?%\}/g),
    schema: c(/\{%-?\s*schema\s*-?%\}/g),
  };
}

function schemaBlock(src) {
  const m = src.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
  return m ? m[1] : null;
}

function indentOf(src, index) {
  const lineStart = src.lastIndexOf("\n", index) + 1;
  return (src.slice(lineStart, index).match(/^[ \t]*/) || [""])[0];
}

const files = fs.readdirSync(SECTIONS).filter((f) => /^cp-v\d+\.liquid$/.test(f)).sort();
const planned = [];
const skipped = [];
const rejected = [];

for (const file of files) {
  const full = path.join(SECTIONS, file);
  const before = fs.readFileSync(full, "utf-8");

  if (/\{%-?\s*paginate\b/.test(before)) {
    skipped.push(`${file}: already paginated`);
    continue;
  }

  const anchors = [
    ["limit_num assign", LIMIT_ASSIGN.test(before) ? 1 : 0],
    ["target_coll fallback", before.split(FALLBACK_LINE).length - 1],
    ["grid if", before.split(GRID_IF).length - 1],
    ["product loop", before.split(LOOP).length - 1],
  ];
  const missing = anchors.filter(([, n]) => n !== 1);
  if (missing.length) {
    skipped.push(`${file}: ${missing.map(([n, c]) => `${n} x${c}`).join(", ")} — not the expected shape`);
    continue;
  }

  let after = before;

  // 1 + 2: clamp the page size and guarantee a real collection to paginate.
  const limitMatch = after.match(LIMIT_ASSIGN);
  const limitIndent = indentOf(after, after.indexOf(limitMatch[0]));
  after = after.replace(
    limitMatch[0],
    `${limitMatch[0]}\n` +
      `${limitIndent}{% assign cf_per_page = limit_num | at_least: 1 | at_most: 50 %}`
  );

  const fbIndent = indentOf(after, after.indexOf(FALLBACK_LINE));
  after = after.replace(
    FALLBACK_LINE,
    `${FALLBACK_LINE}\n` +
      `${fbIndent}{% if target_coll == blank %}{% assign target_coll = collections.all %}{% endif %}\n` +
      `${fbIndent}{% assign cf_is_collection_page = false %}\n` +
      `${fbIndent}{% if collection != blank and target_coll.handle == collection.handle %}{% assign cf_is_collection_page = true %}{% endif %}`
  );

  // 3: open the paginate block just above the grid and un-limit the loop.
  const gridIfIndex = after.indexOf(GRID_IF);
  const gridIndent = indentOf(after, gridIfIndex);
  const endifEnd = findMatchingEndif(after, gridIfIndex);
  if (endifEnd === -1) {
    rejected.push(`${file}: could not find the {% endif %} closing the grid block`);
    continue;
  }

  const head = after.slice(0, gridIfIndex);
  const body = after.slice(gridIfIndex, endifEnd);
  const tail = after.slice(endifEnd);

  if (body.split(LOOP).length - 1 !== 1) {
    rejected.push(`${file}: product loop is not inside the grid block`);
    continue;
  }

  const newBody = body.replace(LOOP, LOOP_NEW);

  after =
    head +
    `{% paginate target_coll.products by: cf_per_page %}\n${gridIndent}` +
    newBody +
    `\n${gridIndent}  {% render 'cf-pagination', paginate: paginate, show: cf_is_collection_page %}` +
    `\n${gridIndent}{% endpaginate %}` +
    tail;

  // ── Guards ───────────────────────────────────────────────────────────
  const problems = [];
  const ta = tagCounts(after);
  const tb = tagCounts(before);

  if (ta.if !== ta.endif) problems.push(`unbalanced if/endif: ${ta.if}/${ta.endif}`);
  if (ta.for !== ta.endfor) problems.push(`unbalanced for/endfor: ${ta.for}/${ta.endfor}`);
  if (ta.paginate !== 1 || ta.endpaginate !== 1) {
    problems.push(`paginate/endpaginate = ${ta.paginate}/${ta.endpaginate}, expected 1/1`);
  }
  if (ta.for !== tb.for) problems.push("for-loop count changed");
  if (ta.schema !== tb.schema) problems.push("schema tag count changed");
  if (after.includes(LOOP)) problems.push("limit: still present on the paginated loop");
  if (!after.includes("cf-pagination")) problems.push("pagination control not rendered");

  const sb = schemaBlock(before);
  const sa = schemaBlock(after);
  if (sb === null) problems.push("no schema block");
  else if (sa !== sb) problems.push("schema block was modified");
  else {
    try { JSON.parse(sa); } catch (e) { problems.push(`schema JSON broken: ${e.message}`); }
  }

  // Everything before the grid, other than the two inserted assign lines, must
  // be untouched — this catches an accidental replace elsewhere in the file.
  if (after.length <= before.length) problems.push("edit was not additive");

  if (problems.length) {
    rejected.push(`${file}: ${problems.join("; ")}`);
    continue;
  }

  planned.push({ file, full, before, after });
}

console.log(`cp-v* sections scanned: ${files.length}`);
console.log(`  will paginate : ${planned.length}`);
console.log(`  skipped       : ${skipped.length}`);
console.log(`  REJECTED      : ${rejected.length}`);
for (const s of skipped) console.log(`    - ${s}`);
for (const r of rejected) console.log(`    ! ${r}`);

if (rejected.length > 0) {
  console.error("\nRefusing to write: at least one file failed its guards. Nothing modified.");
  process.exit(1);
}

if (DRY) {
  console.log("\n--dry: nothing written.");
  if (planned[0]) {
    const i = planned[0].after.indexOf("{% paginate");
    console.log(`\nSample from ${planned[0].file}:`);
    console.log(planned[0].after.slice(i - 320, i + 260));
  }
  process.exit(0);
}

fs.mkdirSync(BACKUP_DIR, { recursive: true });
for (const p of planned) fs.writeFileSync(path.join(BACKUP_DIR, p.file), p.before, "utf-8");
console.log(`\nBackups written to ${BACKUP_DIR}`);

for (const p of planned) fs.writeFileSync(p.full, p.after, "utf-8");
console.log(`Patched ${planned.length} files.`);

let verified = 0;
const failures = [];
for (const p of planned) {
  const now = fs.readFileSync(p.full, "utf-8");
  const t = tagCounts(now);
  if (now !== p.after) failures.push(`${p.file}: on-disk content differs`);
  else if (t.if !== t.endif) failures.push(`${p.file}: unbalanced if/endif on disk`);
  else if (t.for !== t.endfor) failures.push(`${p.file}: unbalanced for/endfor on disk`);
  else if (t.paginate !== 1 || t.endpaginate !== 1) failures.push(`${p.file}: paginate unbalanced on disk`);
  else {
    try { JSON.parse(schemaBlock(now)); verified++; }
    catch (e) { failures.push(`${p.file}: schema JSON broken on disk: ${e.message}`); }
  }
}

console.log(`Verified from disk: ${verified}/${planned.length}`);
if (failures.length) {
  console.error("VERIFICATION FAILED:");
  for (const f of failures) console.error(`  ! ${f}`);
  console.error(`\nRestore with: cp "${BACKUP_DIR}"/*.liquid "${SECTIONS}"/`);
  process.exit(1);
}
console.log("All patched files verified.");
