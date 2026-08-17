#!/usr/bin/env node
/**
 * Make cp-v* collection sections read the collection the shopper is actually on.
 *
 * ## The bug
 *
 * 68 of the 70 `cp-v*` sections source their grid like this:
 *
 *     {% assign target_coll = collections[section.settings.collection] %}
 *
 * That is correct for a homepage "featured collection" block, where a merchant
 * picks which collection to show. It is wrong for a *collection template*: on
 * /collections/skincare the page must show skincare, not whatever happens to be
 * saved in that setting. When the setting is unset — which it always is on a
 * freshly generated store — `target_coll` is empty and every one of these
 * sections falls through to its placeholder branch:
 *
 *     {% for i in (1..limit_num) %}{% render 'card-vN', product: nil %}{% endfor %}
 *
 * which renders a grid of empty cards. That is the placeholder grid seen on the
 * first generated store.
 *
 * ## The fix
 *
 * One line inserted after the existing assign: when the chosen collection is
 * empty, fall back to the collection in scope. On a collection template that is
 * the current collection. On the homepage `collection` is nil, so the behaviour
 * there is byte-for-byte what it was before — this cannot regress the homepage.
 *
 * ## Safety
 *
 * A previous bulk script corrupted 10 sections in this repo, so this one refuses
 * to write unless every file passes:
 *   - exactly one occurrence of the target line
 *   - line count grows by exactly 1
 *   - `{% if %}` / `{% endif %}` stay balanced
 *   - the `{% schema %}` block parses as JSON and is byte-identical afterwards
 *   - the rendered file still contains its original content, only added to
 * Backups are written before anything changes. Run with --dry to preview.
 */

const fs = require("fs");
const path = require("path");

const SECTIONS = path.resolve(__dirname, "..", "..", "dev-theme-peri", "sections");
const DRY = process.argv.includes("--dry");
const BACKUP_DIR = path.resolve(__dirname, "..", ".backups", `cp-collection-source-${Date.now()}`);

const TARGET = "{% assign target_coll = collections[section.settings.collection] %}";
const ADDITION =
  "{% if target_coll == blank or target_coll.products.size == 0 %}{% assign target_coll = collection %}{% endif %}";

/** Counts Liquid control tags so an edit that unbalances them is caught. */
function tagCounts(src) {
  const count = (re) => (src.match(re) || []).length;
  return {
    if: count(/\{%-?\s*if\b/g),
    endif: count(/\{%-?\s*endif\s*-?%\}/g),
    for: count(/\{%-?\s*for\b/g),
    endfor: count(/\{%-?\s*endfor\s*-?%\}/g),
    schema: count(/\{%-?\s*schema\s*-?%\}/g),
    endschema: count(/\{%-?\s*endschema\s*-?%\}/g),
  };
}

function schemaBlock(src) {
  const m = src.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
  return m ? m[1] : null;
}

const files = fs
  .readdirSync(SECTIONS)
  .filter((f) => /^cp-v\d+\.liquid$/.test(f))
  .sort();

const planned = [];
const skipped = [];
const rejected = [];

for (const file of files) {
  const full = path.join(SECTIONS, file);
  const before = fs.readFileSync(full, "utf-8");

  const occurrences = before.split(TARGET).length - 1;
  if (occurrences === 0) {
    skipped.push(`${file}: does not use the hardcoded-collection pattern`);
    continue;
  }
  if (occurrences > 1) {
    rejected.push(`${file}: ${occurrences} occurrences of the target line, expected 1`);
    continue;
  }
  if (before.includes(ADDITION)) {
    skipped.push(`${file}: already fixed`);
    continue;
  }

  // Preserve the indentation of the line being extended.
  const lineMatch = before.match(new RegExp(`^([ \\t]*)${TARGET.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "m"));
  const indent = lineMatch ? lineMatch[1] : "";
  const after = before.replace(TARGET, `${TARGET}\n${indent}${ADDITION}`);

  // ── Guards ───────────────────────────────────────────────────────────
  const problems = [];

  const linesBefore = before.split("\n").length;
  const linesAfter = after.split("\n").length;
  if (linesAfter !== linesBefore + 1) {
    problems.push(`line count went ${linesBefore} -> ${linesAfter}, expected +1`);
  }

  const tb = tagCounts(before);
  const ta = tagCounts(after);
  if (ta.if !== tb.if + 1 || ta.endif !== tb.endif + 1) {
    problems.push(`if/endif went ${tb.if}/${tb.endif} -> ${ta.if}/${ta.endif}, expected +1/+1`);
  }
  if (ta.if !== ta.endif) problems.push(`unbalanced if/endif after edit: ${ta.if}/${ta.endif}`);
  if (ta.for !== tb.for || ta.endfor !== tb.endfor) problems.push("for/endfor count changed");
  if (ta.schema !== tb.schema || ta.endschema !== tb.endschema) problems.push("schema tag count changed");

  const sb = schemaBlock(before);
  const sa = schemaBlock(after);
  if (sb === null) {
    problems.push("no {% schema %} block found");
  } else if (sa !== sb) {
    problems.push("schema block was modified");
  } else {
    try {
      JSON.parse(sa);
    } catch (e) {
      problems.push(`schema JSON does not parse: ${e.message}`);
    }
  }

  // Purely additive: everything that was there must still be there.
  if (after.length !== before.length + indent.length + ADDITION.length + 1) {
    problems.push("edit was not purely additive");
  }

  if (problems.length) {
    rejected.push(`${file}: ${problems.join("; ")}`);
    continue;
  }

  planned.push({ file, full, before, after });
}

console.log(`cp-v* sections scanned: ${files.length}`);
console.log(`  will fix : ${planned.length}`);
console.log(`  skipped  : ${skipped.length}`);
console.log(`  REJECTED : ${rejected.length}`);
for (const s of skipped) console.log(`    - ${s}`);
for (const r of rejected) console.log(`    ! ${r}`);

if (rejected.length > 0) {
  console.error("\nRefusing to write: at least one file failed its guards.");
  console.error("Nothing has been modified. Fix the listed files by hand first.");
  process.exit(1);
}

if (DRY) {
  console.log("\n--dry: nothing written. Sample of the change:");
  if (planned[0]) {
    const idx = planned[0].after.indexOf(TARGET);
    console.log(planned[0].after.slice(idx, idx + TARGET.length + ADDITION.length + 8));
  }
  process.exit(0);
}

fs.mkdirSync(BACKUP_DIR, { recursive: true });
for (const p of planned) fs.writeFileSync(path.join(BACKUP_DIR, p.file), p.before, "utf-8");
console.log(`\nBackups written to ${BACKUP_DIR}`);

for (const p of planned) fs.writeFileSync(p.full, p.after, "utf-8");
console.log(`Patched ${planned.length} files.`);

// ── Post-write verification: re-read from disk, do not trust the buffers ──
let verified = 0;
const failures = [];
for (const p of planned) {
  const now = fs.readFileSync(p.full, "utf-8");
  if (now !== p.after) {
    failures.push(`${p.file}: on-disk content differs from what was written`);
    continue;
  }
  if (!now.includes(ADDITION)) {
    failures.push(`${p.file}: fallback line missing after write`);
    continue;
  }
  const t = tagCounts(now);
  if (t.if !== t.endif || t.for !== t.endfor) {
    failures.push(`${p.file}: unbalanced tags on disk`);
    continue;
  }
  try {
    JSON.parse(schemaBlock(now));
  } catch (e) {
    failures.push(`${p.file}: schema JSON broken on disk: ${e.message}`);
    continue;
  }
  verified++;
}

console.log(`Verified from disk: ${verified}/${planned.length}`);
if (failures.length) {
  console.error("VERIFICATION FAILED:");
  for (const f of failures) console.error(`  ! ${f}`);
  console.error(`\nRestore with: cp ${BACKUP_DIR}/*.liquid ${SECTIONS}/`);
  process.exit(1);
}
console.log("All patched files verified.");
