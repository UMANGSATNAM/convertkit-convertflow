#!/usr/bin/env node
/**
 * Snaps `range` setting defaults onto a valid step.
 *
 * Shopify rejects a whole theme file when a range setting's default is not
 * reachable from `min` in increments of `step`:
 *
 *   Invalid schema: setting with id="mobile_gap" default must be a step in the range
 *
 * `mobile_gap` has min 20, step 5 and a default of 64. 64 is not 20 + 5n, so the
 * upload fails — and because uploads are batched, one bad default takes the
 * whole design with it.
 *
 * Each offending default is moved to the nearest valid value, preferring the
 * lower one on a tie so a padding never grows unexpectedly. The change is at
 * most half a step, which is below the threshold anyone would notice, and it is
 * the only correction that keeps the designer's intent.
 *
 * Usage: node scripts/fix_range_defaults.cjs [--dry]
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const ROOTS = [
  path.join(ROOT, "app/data/templates/theme-engine/components"),
  path.join(ROOT, "app/data/templates/theme-engine/base-theme/sections"),
  path.join(ROOT, "dev-theme-peri/sections"),
];
const DRY = process.argv.includes("--dry");
const BACKUP = path.join(ROOT, ".backups", `range-defaults-${Date.now()}`);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".liquid")) out.push(p);
  }
  return out;
}

/** Nearest value reachable as min + step·n, clamped to the range. */
function snap(min, max, step, value) {
  if (!step || step <= 0) return value;
  const steps = Math.round((value - min) / step);
  let snapped = min + steps * step;

  // Ties go down: a default that drifts upward turns into extra padding a
  // merchant did not ask for.
  if (Math.abs(snapped - value) === step / 2 && snapped > value) snapped -= step;

  snapped = Math.min(max, Math.max(min, snapped));
  // Guard against floating point noise from fractional steps.
  return Number(snapped.toFixed(6));
}

const planned = [];
const rejected = [];
let scanned = 0;

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const before = fs.readFileSync(file, "utf-8");
    const m = before.match(/(\{%-?\s*schema\s*-?%\})([\s\S]*?)(\{%-?\s*endschema\s*-?%\})/);
    if (!m) continue;

    let schema;
    try {
      schema = JSON.parse(m[2]);
    } catch {
      continue;
    }
    scanned++;

    const changes = [];
    const visit = node => {
      if (Array.isArray(node)) return node.forEach(visit);
      if (!node || typeof node !== "object") return;

      if (node.type === "range" && typeof node.default === "number") {
        const { min, max, step = 1, default: def, id } = node;
        if (typeof min === "number" && typeof max === "number") {
          const onStep = Math.abs(((def - min) / step) % 1) < 1e-9;
          const inRange = def >= min && def <= max;
          if (!onStep || !inRange) {
            const next = snap(min, max, step, def);
            if (next !== def) {
              node.default = next;
              changes.push({ id, from: def, to: next, min, max, step });
            }
          }
        }
      }
      for (const v of Object.values(node)) visit(v);
    };
    visit(schema);

    if (changes.length === 0) continue;

    const after = before.slice(0, m.index) + m[1] + "\n" + JSON.stringify(schema, null, 2) + "\n" + m[3] + before.slice(m.index + m[0].length);

    // ── guards ────────────────────────────────────────────────────────
    const problems = [];
    const reparsed = after.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
    if (!reparsed) problems.push("schema block lost");
    else {
      try {
        const j = JSON.parse(reparsed[1]);
        // Every default must now be valid, or the fix did not work.
        const stillBad = [];
        const check = n => {
          if (Array.isArray(n)) return n.forEach(check);
          if (!n || typeof n !== "object") return;
          if (n.type === "range" && typeof n.default === "number") {
            const st = n.step ?? 1;
            if (Math.abs(((n.default - n.min) / st) % 1) > 1e-9) stillBad.push(n.id);
          }
          for (const v of Object.values(n)) check(v);
        };
        check(j);
        if (stillBad.length) problems.push(`still invalid: ${stillBad.join(", ")}`);
      } catch (e) {
        problems.push(`schema JSON broken: ${e.message}`);
      }
    }

    const bodyBefore = before.slice(0, m.index);
    const bodyAfter = after.slice(0, after.indexOf(m[1]));
    if (bodyBefore !== bodyAfter) problems.push("markup changed");

    if (problems.length) {
      rejected.push(`${path.relative(ROOT, file)}: ${problems.join("; ")}`);
      continue;
    }

    planned.push({ file, before, after, changes });
  }
}

const totalChanges = planned.reduce((n, p) => n + p.changes.length, 0);
console.log(`sections scanned : ${scanned}`);
console.log(`  files to fix   : ${planned.length}`);
console.log(`  defaults moved : ${totalChanges}`);
console.log(`  REJECTED       : ${rejected.length}`);
for (const r of rejected) console.log(`    ! ${r}`);

if (rejected.length) {
  console.error("\nRefusing to write: a file failed its guards. Nothing modified.");
  process.exit(1);
}

for (const p of planned) {
  for (const c of p.changes) {
    console.log(`    ${path.basename(p.file).padEnd(32)} ${String(c.id).padEnd(16)} ${c.from} -> ${c.to}  (min ${c.min}, step ${c.step})`);
  }
}

if (DRY) {
  console.log("\n--dry: nothing written.");
  process.exit(0);
}

fs.mkdirSync(BACKUP, { recursive: true });
for (const p of planned) {
  fs.writeFileSync(path.join(BACKUP, `${Date.now()}-${path.basename(p.file)}`), p.before);
}
for (const p of planned) fs.writeFileSync(p.file, p.after);

let verified = 0;
for (const p of planned) {
  const now = fs.readFileSync(p.file, "utf-8");
  if (now === p.after) verified++;
}
console.log(`\nBackups: ${BACKUP}`);
console.log(`Patched ${planned.length}, verified from disk: ${verified}`);
if (verified !== planned.length) process.exit(1);
