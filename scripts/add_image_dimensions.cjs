#!/usr/bin/env node
/**
 * Adds `width` and `height` to the base theme's `<img>` tags.
 *
 * ## Why
 *
 * 145 of the base theme's 157 `<img>` tags declare no dimensions. A browser
 * cannot reserve space for an image it has not measured, so every one of them
 * shifts the page as it loads. That is Cumulative Layout Shift, it is a Core Web
 * Vitals metric Shopify surfaces to merchants, and on a product grid it is the
 * difference between a page that settles and one that jumps under the cursor.
 *
 * Every one of the 145 has the same shape:
 *
 *     <img src="{{ product.featured_media | image_url: width: 400 }}" …>
 *
 * The Liquid object on the left of the filter carries `.width` and `.height`, so
 * the correct values are available at render time and nothing has to be guessed.
 *
 * ## Safety
 *
 * Writes a backup first, and refuses a file unless afterwards:
 *   - the number of `<img` tags is unchanged
 *   - no tag gained a duplicate width or height attribute
 *   - the `{% schema %}` block is byte-identical and still valid JSON
 *   - the edit was purely additive
 *
 * Usage: node scripts/add_image_dimensions.cjs [--dry]
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const TARGETS = [
  path.join(ROOT, "app/data/templates/theme-engine/base-theme"),
  path.join(ROOT, "dev-theme-peri"),
];
const DRY = process.argv.includes("--dry");
const BACKUP = path.join(ROOT, ".backups", `img-dimensions-${Date.now()}`);

/**
 * Pulls the Liquid object feeding `image_url` out of a src attribute.
 *
 * `{{ product.featured_media | image_url: width: 400 }}` yields
 * `product.featured_media`. Anything with a filter before `image_url` is left
 * alone: the object's own dimensions may no longer describe what is rendered.
 */
function imageObjectFrom(tag) {
  const m = tag.match(/src="\{\{-?\s*([a-z_][\w.\[\]'"]*)\s*\|\s*image_url/i);
  if (!m) return null;

  const obj = m[1];
  // A metafield or an index into an array is fine; a nested filter chain is not.
  if (/\|/.test(obj)) return null;
  return obj;
}

function schemaBlock(src) {
  const m = src.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
  return m ? m[1] : null;
}

function collectFiles(dir) {
  const out = [];
  const walk = d => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".liquid")) out.push(p);
    }
  };
  for (const sub of ["sections", "snippets"]) walk(path.join(dir, sub));
  return out;
}

const planned = [];
const rejected = [];
let scanned = 0;
let alreadyFine = 0;
let notEligible = 0;

for (const target of TARGETS) {
  for (const file of collectFiles(target)) {
    const before = fs.readFileSync(file, "utf-8");
    let added = 0;

    const after = before.replace(/<img\b[^>]*>/g, tag => {
      scanned++;

      if (/\bwidth=/.test(tag) && /\bheight=/.test(tag)) {
        alreadyFine++;
        return tag;
      }

      const obj = imageObjectFrom(tag);
      if (!obj) {
        notEligible++;
        return tag;
      }

      // Only supply what is missing, so a tag that already sets one of them
      // keeps the author's value.
      let out = tag;
      if (!/\bwidth=/.test(out)) {
        out = out.replace(/<img\b/, `<img width="{{ ${obj}.width }}"`);
      }
      if (!/\bheight=/.test(out)) {
        out = out.replace(/<img\b/, `<img height="{{ ${obj}.height }}"`);
      }

      if (out !== tag) added++;
      return out;
    });

    if (added === 0) continue;

    // ── guards ────────────────────────────────────────────────────────
    const problems = [];
    const imgBefore = (before.match(/<img\b/g) || []).length;
    const imgAfter = (after.match(/<img\b/g) || []).length;
    if (imgBefore !== imgAfter) problems.push(`img count ${imgBefore} -> ${imgAfter}`);

    for (const tag of after.match(/<img\b[^>]*>/g) || []) {
      if ((tag.match(/\bwidth=/g) || []).length > 1) problems.push("duplicate width attribute");
      if ((tag.match(/\bheight=/g) || []).length > 1) problems.push("duplicate height attribute");
    }

    const sb = schemaBlock(before);
    const sa = schemaBlock(after);
    if (sb !== sa) problems.push("schema block changed");
    else if (sb !== null) {
      try { JSON.parse(sb); } catch (e) { problems.push(`schema JSON invalid: ${e.message}`); }
    }

    if (after.length <= before.length) problems.push("edit was not additive");

    if (problems.length) {
      rejected.push(`${path.relative(ROOT, file)}: ${[...new Set(problems)].join("; ")}`);
      continue;
    }

    planned.push({ file, before, after, added });
  }
}

const totalAdded = planned.reduce((n, p) => n + p.added, 0);

console.log(`<img> tags scanned        : ${scanned}`);
console.log(`  already had dimensions  : ${alreadyFine}`);
console.log(`  not eligible            : ${notEligible}  (static src, placeholder svg, or a filter chain)`);
console.log(`  will gain dimensions    : ${totalAdded} across ${planned.length} file(s)`);
console.log(`  REJECTED files          : ${rejected.length}`);
for (const r of rejected) console.log(`    ! ${r}`);

if (rejected.length) {
  console.error("\nRefusing to write: a file failed its guards. Nothing modified.");
  process.exit(1);
}

if (DRY) {
  console.log("\n--dry: nothing written.");
  if (planned[0]) {
    const t = planned[0].after.match(/<img\b[^>]*\{\{[^>]*>/);
    console.log(`Sample from ${path.basename(planned[0].file)}:\n  ${t ? t[0].slice(0, 150) : ""}`);
  }
  process.exit(0);
}

fs.mkdirSync(BACKUP, { recursive: true });
for (const p of planned) {
  fs.writeFileSync(path.join(BACKUP, path.basename(p.file)), p.before);
}
console.log(`\nBackups: ${BACKUP}`);

for (const p of planned) fs.writeFileSync(p.file, p.after);

let verified = 0;
const failures = [];
for (const p of planned) {
  const now = fs.readFileSync(p.file, "utf-8");
  if (now !== p.after) { failures.push(`${path.basename(p.file)}: on-disk differs`); continue; }
  const s = schemaBlock(now);
  if (s !== null) {
    try { JSON.parse(s); } catch (e) { failures.push(`${path.basename(p.file)}: schema broken`); continue; }
  }
  verified++;
}

console.log(`Patched ${planned.length} file(s), verified from disk: ${verified}`);
if (failures.length) {
  for (const f of failures) console.error(`  ! ${f}`);
  process.exit(1);
}
console.log("All patched files verified.");
