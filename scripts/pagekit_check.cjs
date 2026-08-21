#!/usr/bin/env node
/**
 * Validates every PageKit page against the section registry.
 *
 * This is the check that was missing. `hp-v1-home` in `page-templates.ts` lists
 * nine sections, none of which have ever existed in the registry — and applying
 * it produced a header, a footer and nothing between them, with no error shown
 * anywhere. A page that cannot render should fail here, before a merchant ever
 * sees it.
 *
 * Also checks the old `page-templates.ts` so the existing designs are covered by
 * the same rule.
 *
 * Exit code 1 when any page is broken, so it can gate a build.
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const ENGINE = path.join(ROOT, "app/data/templates/theme-engine");
// Sections are authored here and synced into the engine registry later. PageKit
// reads both, so this check must too — otherwise it fails a page that applies
// perfectly well.
const AUTHORING = path.join(ROOT, "dev-theme-peri");

/** Mirrors resolveSections(): engine copy first, then the authoring folder. */
function resolveOne(registry, id) {
  const liquidPath = registry.get(id);
  if (liquidPath && fs.existsSync(path.join(ENGINE, liquidPath))) return "engine";
  if (fs.existsSync(path.join(AUTHORING, "sections", `${id}.liquid`))) return "authoring";
  return liquidPath ? "no-file" : "unknown";
}

function loadRegistry() {
  const raw = JSON.parse(fs.readFileSync(path.join(ENGINE, "registry.json"), "utf-8"));
  const list = Array.isArray(raw) ? raw : raw.components || [];
  const map = new Map();
  for (const c of list) if (c?.componentId && c?.liquidPath) map.set(c.componentId, c.liquidPath);
  return map;
}

/** Pulls page definitions out of a TypeScript source without compiling it. */
function readPages(file, shape) {
  if (!fs.existsSync(file)) return [];
  const src = fs.readFileSync(file, "utf-8");
  const pages = [];

  // page-templates.ts is read directly below as the legacy shape. PageKit now
  // adapts that same list, so validating both files covers every design offered
  // in the UI without parsing the adapter.
  if (shape === "pagekit") {
    // { id: "...", name: "...", ... sections: ["a", "b"] }
    for (const m of src.matchAll(/id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?sections:\s*\[([\s\S]*?)\]/g)) {
      const ids = [...m[3].matchAll(/"([^"]+)"/g)].map(x => x[1]);
      const header = (src.slice(m.index, m.index + m[0].length).match(/header:\s*"([^"]+)"/) || [])[1];
      pages.push({ id: m[1], name: m[2], sections: ids, header, file: path.basename(file) });
    }
  } else {
    // page-templates.ts: sections are objects with componentId
    const parts = src.split(/\n\s*\{\s*\n\s*id:\s*"/).slice(1);
    for (const p of parts) {
      const id = p.slice(0, p.indexOf('"'));
      const name = (p.match(/name:\s*"([^"]+)"/) || [])[1] || id;
      const ids = [...p.matchAll(/componentId:\s*"([^"]+)"/g)].map(x => x[1]);
      if (ids.length) pages.push({ id, name, sections: ids, file: path.basename(file) });
    }
  }
  return pages;
}

/**
 * Reads a section's schema.
 *
 * Returns the reason rather than null when it cannot, because "this section has
 * an unparseable schema" is a finding, not an absence.
 */
function schemaOf(src) {
  const m = src.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
  if (!m) return { schema: null, error: null }; // Not every section needs one.
  try {
    return { schema: JSON.parse(m[1]), error: null };
  } catch (e) {
    return { schema: null, error: `schema is not valid JSON (${e.message})` };
  }
}

/**
 * The schema rules Shopify enforces at upload time.
 *
 * These are the ones that have actually failed here, not a general audit. A
 * range whose default is not `min + step·n` is rejected with "default must be a
 * step in the range", and duplicate setting ids are rejected outright. Both
 * previously surfaced as a logged userError while the apply reported success.
 */
function schemaProblems(id, src) {
  const out = [];
  const { schema, error } = schemaOf(src);
  if (error) return [`${id}: ${error}`];
  if (!schema) return out;

  const groups = [{ where: "settings", list: schema.settings || [] }];
  for (const b of schema.blocks || []) {
    groups.push({ where: `block "${b.type}"`, list: b.settings || [] });
  }

  for (const g of groups) {
    const seen = new Set();
    for (const s of g.list) {
      if (!s || typeof s !== "object") continue;

      if (s.id) {
        if (seen.has(s.id)) out.push(`${id}: duplicate setting id "${s.id}" in ${g.where}`);
        seen.add(s.id);
      }

      if (s.type === "range") {
        const { min, max, default: def } = s;
        // `step` is optional and defaults to 1. Treating a missing step as an
        // error flagged five perfectly valid sections; min and max are the ones
        // Shopify actually requires.
        const step = typeof s.step === "number" ? s.step : 1;
        if ([min, max].some(v => typeof v !== "number")) {
          out.push(`${id}: range "${s.id}" is missing a numeric min or max`);
          continue;
        }
        if (step <= 0) { out.push(`${id}: range "${s.id}" has step ${step}`); continue; }
        if (typeof def !== "number") continue; // Shopify allows an absent default.

        if (def < min || def > max) {
          out.push(`${id}: range "${s.id}" default ${def} is outside ${min}–${max}`);
          continue;
        }
        // Compared by reconstruction rather than modulo: (0.3-0)/0.1 is
        // 2.9999999999999996 in floating point, and a modulo test calls a valid
        // default invalid.
        const n = Math.round((def - min) / step);
        if (Math.abs(min + n * step - def) > 1e-9) {
          out.push(`${id}: range "${s.id}" default ${def} is not a step of ${step} from ${min}`);
        }
      }
    }
  }
  return out;
}

const registry = loadRegistry();
const pages = [
  ...readPages(path.join(ROOT, "app/pagekit/pages.ts"), "pagekit"),
  ...readPages(path.join(ROOT, "app/data/page-templates.ts"), "legacy"),
];

let broken = 0;
let partial = 0;
const unsyncedPages = [];
const schemaCache = new Map();
const schemaIssues = new Set();
const report = [];

for (const page of pages) {
  const ids = [...page.sections, page.header].filter(Boolean);
  const unknown = [];
  const noFile = [];

  let unsynced = 0;
  for (const id of ids) {
    const where = resolveOne(registry, id);
    if (where === "unknown") { unknown.push(id); continue; }
    if (where === "no-file") { noFile.push(id); continue; }
    if (where === "authoring") unsynced++;

    // Reads once per id across all pages; families share sections heavily.
    if (!schemaCache.has(id)) {
      const rel = registry.get(id);
      const file = where === "authoring"
        ? path.join(AUTHORING, "sections", `${id}.liquid`)
        : path.join(ENGINE, rel);
      schemaCache.set(id, schemaProblems(id, fs.readFileSync(file, "utf-8")));
    }
    for (const problem of schemaCache.get(id)) schemaIssues.add(problem);
  }
  if (unsynced) unsyncedPages.push({ id: page.id, count: unsynced, total: ids.length });

  const bad = unknown.length + noFile.length;
  if (bad === 0) continue;

  if (bad === ids.length) broken++;
  else partial++;

  report.push({ page, unknown, noFile, total: ids.length, bad });
}

console.log(`pages checked          : ${pages.length}`);
console.log(`  every section resolves : ${pages.length - report.length}`);
console.log(`  PARTIALLY broken       : ${partial}`);
console.log(`  ENTIRELY broken        : ${broken}   (these render as header + footer only)`);

if (unsyncedPages.length) {
  console.log("");
  console.log(`  ${unsyncedPages.length} page(s) use sections read straight from dev-theme-peri`);
  console.log(`  (not yet in registry.json — PageKit applies them, the old path did not):`);
  for (const u of unsyncedPages) console.log(`     ${u.id}  ${u.count} of ${u.total}`);
}

if (report.length) {
  console.log("");
  for (const r of report) {
    const label = r.bad === r.total ? "ENTIRELY BROKEN" : "partial";
    console.log(`  ${label}  ${r.page.id}  (${r.page.file})`);
    console.log(`     "${r.page.name}"`);
    console.log(`     ${r.bad} of ${r.total} sections cannot render`);
    if (r.unknown.length) console.log(`     not in registry : ${r.unknown.join(", ")}`);
    if (r.noFile.length) console.log(`     no Liquid file  : ${r.noFile.join(", ")}`);
    console.log("");
  }
}

// ── Would any block-driven section render empty? ────────────────────────
//
// 721 sections in the library render inside `{% for block in section.blocks %}`
// and blocks do not exist unless the template declares them — unlike settings,
// which fall back to their schema default. A section like that with no blocks
// uploads, validates, and renders as an empty band.
//
// `seedFor` generates them from the section's own schema. This runs the real
// function rather than a copy of its rules, so the check cannot drift from the
// behaviour it is checking.
const blankSections = new Map();
{
  const ts = require(path.join(ROOT, "node_modules/typescript/lib/typescript.js"));
  require.extensions[".ts"] = function (mod, filename) {
    mod._compile(
      ts.transpileModule(fs.readFileSync(filename, "utf8"), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
        fileName: filename,
      }).outputText,
      filename
    );
  };

  const { seedFor } = require(path.join(ROOT, "app/pagekit/registry.server.ts"));

  for (const page of pages) {
    for (const id of [...page.sections, page.header].filter(Boolean)) {
      const where = resolveOne(registry, id);
      if (where === "unknown" || where === "no-file") continue;

      const file = where === "authoring"
        ? path.join(AUTHORING, "sections", `${id}.liquid`)
        : path.join(ENGINE, registry.get(id));
      const src = fs.readFileSync(file, "utf-8");

      if (!/\{%-?\s*for\s+\w+\s+in\s+section\.blocks/.test(src)) continue;
      if ((seedFor(src).block_order || []).length > 0) continue;

      blankSections.set(id, (blankSections.get(id) || 0) + 1);
    }
  }
}

if (blankSections.size) {
  console.log("");
  console.log(`  ${blankSections.size} section(s) would render as an empty band:`);
  for (const [id, n] of [...blankSections].sort((a, b) => b[1] - a[1])) {
    console.log(`     ${id}  (on ${n} page${n === 1 ? "" : "s"}) — loops section.blocks, and none get created`);
  }
}

if (schemaIssues.size) {
  console.log("");
  console.log(`  ${schemaIssues.size} schema problem(s) Shopify will reject at upload:`);
  for (const issue of [...schemaIssues].sort()) console.log(`     ${issue}`);
}

if (report.length || schemaIssues.size || blankSections.size) {
  console.error(
    "\nFix the above. A section Shopify refuses uploads as a userError, and the " +
    "shared uploader logs those and returns success — which is how a design " +
    "\"applies\" and renders blank."
  );
  process.exit(1);
}
console.log("\nAll pages resolve, and every section schema is valid.");
