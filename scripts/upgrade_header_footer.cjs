#!/usr/bin/env node
/**
 * Makes the hp* header and footer sections merchant-editable.
 *
 * ## What is wrong today
 *
 * Across 29 header/footer sections:
 *   - 27 render navigation as hardcoded `<a href="#">` links. They are dead —
 *     every one goes nowhere — and they carry another store's words. A beauty
 *     store shipped a footer reading "All Furniture / Lighting / Objects" and a
 *     header reading "Collection / Objects / Spaces", because those sections
 *     were written against a furniture mock.
 *   - 25 have no logo picker, so the brand name renders as text or not at all.
 *   - 20 have no `link_list` setting, so a merchant cannot point the navigation
 *     at their own menu even from the theme editor.
 *   - 28 have no sticky-header control.
 *   - 17 expose fewer than five settings in total, most of them just two colours.
 *
 * ## What this does
 *
 * 1. Replaces each run of dead links with a Liquid loop over a menu the merchant
 *    chooses, falling back to the store's main menu. The markup emitted per link
 *    is identical to what was there — same tag, same classes — so the design is
 *    untouched and only the source of the links changes.
 * 2. Adds the settings those sections should always have had: menu picker, logo,
 *    sticky behaviour, border colour, padding, and mobile padding.
 *
 * ## Safety
 *
 * A bulk script has corrupted sections in this repo before, so this one backs up
 * first and refuses to write a file unless, afterwards:
 *   - `{% if %}`/`{% endif %}` and `{% for %}`/`{% endfor %}` are balanced
 *   - the `{% schema %}` block still parses as JSON
 *   - no setting id is duplicated
 *   - every `<a>` opened is closed
 * Run with --dry to preview.
 */

const fs = require("fs");
const path = require("path");

const SECTIONS = path.resolve(__dirname, "..", "..", "dev-theme-peri", "sections");
const DRY = process.argv.includes("--dry");
const BACKUP = path.resolve(__dirname, "..", ".backups", `header-footer-${Date.now()}`);

const isFooter = f => /footer/i.test(f);

function schemaOf(src) {
  const m = src.match(/(\{%-?\s*schema\s*-?%\})([\s\S]*?)(\{%-?\s*endschema\s*-?%\})/);
  if (!m) return null;
  try {
    return { open: m[1], json: JSON.parse(m[2]), close: m[3], raw: m[0], index: m.index };
  } catch {
    return null;
  }
}

function counts(s) {
  const c = re => (s.match(re) || []).length;
  return {
    if: c(/\{%-?\s*if\b/g), endif: c(/\{%-?\s*endif\s*-?%\}/g),
    for: c(/\{%-?\s*for\b/g), endfor: c(/\{%-?\s*endfor\s*-?%\}/g),
    aOpen: c(/<a\b/g), aClose: c(/<\/a>/g),
  };
}

/**
 * Settings every header or footer should carry. Only ids not already present
 * are added, so a section that already models something keeps its own version.
 */
function settingsFor(file) {
  const footer = isFooter(file);
  const out = [
    {
      type: "link_list",
      id: "menu",
      label: footer ? "Footer menu" : "Navigation menu",
      info: "Leave empty to use the store's main menu.",
      default: footer ? "footer" : "main-menu",
    },
    { type: "header", content: "Layout" },
    {
      type: "range", id: "padding_top", label: "Top padding", min: 0, max: 80, step: 4, unit: "px",
      default: footer ? 48 : 16,
    },
    {
      type: "range", id: "padding_bottom", label: "Bottom padding", min: 0, max: 80, step: 4, unit: "px",
      default: footer ? 32 : 16,
    },
    {
      type: "range", id: "padding_mobile", label: "Mobile padding", min: 0, max: 48, step: 4, unit: "px",
      default: footer ? 32 : 12,
    },
    { type: "color", id: "border_color", label: "Border colour", default: "#E5E7EB" },
  ];

  if (!footer) {
    out.push(
      { type: "header", content: "Brand" },
      { type: "image_picker", id: "logo", label: "Logo", info: "Falls back to the store name when empty." },
      {
        type: "range", id: "logo_width", label: "Logo width", min: 60, max: 260, step: 10, unit: "px",
        default: 120,
      },
      { type: "header", content: "Behaviour" },
      { type: "checkbox", id: "sticky", label: "Stick to the top on scroll", default: true },
      { type: "checkbox", id: "show_search", label: "Show search", default: true },
      { type: "checkbox", id: "show_account", label: "Show account link", default: true },
      { type: "checkbox", id: "show_cart", label: "Show cart", default: true },
    );
  } else {
    out.push(
      { type: "header", content: "Content" },
      { type: "image_picker", id: "logo", label: "Footer logo" },
      { type: "checkbox", id: "show_payment_icons", label: "Show payment icons", default: true },
      { type: "checkbox", id: "show_social", label: "Show social links", default: true },
      {
        type: "text", id: "copyright_note", label: "Copyright line",
        info: "The year and store name are added automatically.",
        default: "All rights reserved.",
      },
    );
  }

  return out;
}

/**
 * Swaps a run of dead links for a loop over the chosen menu.
 *
 * Only runs of two or more consecutive `<a href="#">` sharing one class are
 * touched — a single dead link is usually a real UI affordance (a menu toggle,
 * a "back to top") rather than navigation.
 */
function replaceDeadLinks(bodyInput, file) {
  const listVar = isFooter(file) ? "footer" : "main-menu";
  let replacements = 0;
  let body = bodyInput;

  // Two shapes occur in this library: bare links, and links wrapped one per
  // `<li>`. Footer column menus are almost always the second, which is why the
  // first pass replaced only 14 runs and left 115 dead links behind.
  const liRunRe = /(?:\s*<li[^>]*>\s*<a href="#"([^>]*)>([^<]{1,40})<\/a>\s*<\/li>){2,}/g;
  const bareRunRe = /(?:\s*<a href="#"([^>]*)>([^<]{1,40})<\/a>){2,}/g;

  const wrapLoop = (indent, inner, listVarName) =>
    `${indent}{%- assign cf_menu = section.settings.menu | default: linklists['${listVarName}'] -%}` +
    `\n${indent}{%- if cf_menu == blank -%}{%- assign cf_menu = linklists['main-menu'] -%}{%- endif -%}` +
    `\n${indent}{%- for link in cf_menu.links -%}` +
    `\n${indent}  ${inner}` +
    `\n${indent}{%- endfor -%}`;

  body = body.replace(liRunRe, match => {
    const links = [...match.matchAll(/<li([^>]*)>\s*<a href="#"([^>]*)>([^<]{1,40})<\/a>\s*<\/li>/g)];
    if (links.length < 2) return match;

    const liAttrs = links.map(l => l[1].trim());
    const aAttrs = links.map(l => l[2].trim());
    if (new Set(liAttrs).size !== 1 || new Set(aAttrs).size !== 1) return match;

    replacements++;
    const indent = (match.match(/^\s*/) || [""])[0];
    const li = liAttrs[0] ? `<li ${liAttrs[0]}>` : "<li>";
    const a = aAttrs[0] ? `<a href="{{ link.url }}" ${aAttrs[0]}>` : `<a href="{{ link.url }}">`;
    return wrapLoop(indent, `${li}${a}{{ link.title }}</a></li>`, listVar);
  });

  const out = body.replace(bareRunRe, match => {
    const links = [...match.matchAll(/<a href="#"([^>]*)>([^<]{1,40})<\/a>/g)];
    if (links.length < 2) return match;

    // Every link in the run must share one class list, or replacing them with a
    // single loop would flatten a deliberate visual difference.
    const attrs = links.map(l => l[1].trim());
    if (new Set(attrs).size !== 1) return match;

    replacements++;
    const attr = attrs[0];
    const indent = (match.match(/^\s*/) || [""])[0];

    return (
      `${indent}{%- assign cf_menu = section.settings.menu | default: linklists['${listVar}'] -%}` +
      `\n${indent}{%- if cf_menu == blank -%}{%- assign cf_menu = linklists['main-menu'] -%}{%- endif -%}` +
      `\n${indent}{%- for link in cf_menu.links -%}` +
      `\n${indent}  <a href="{{ link.url }}"${attr ? " " + attr : ""}>{{ link.title }}</a>` +
      `\n${indent}{%- endfor -%}`
    );
  });

  return { body: out, replacements };
}

const files = fs
  .readdirSync(SECTIONS)
  .filter(f => /^hp/.test(f) && /(header|footer)/i.test(f) && f.endsWith(".liquid"))
  .sort();

const planned = [];
const rejected = [];
const skipped = [];

for (const file of files) {
  const full = path.join(SECTIONS, file);
  const before = fs.readFileSync(full, "utf-8");

  const schema = schemaOf(before);
  if (!schema) {
    rejected.push(`${file}: no parseable {% schema %}`);
    continue;
  }

  const bodyBefore = before.slice(0, schema.index);
  const afterSchema = before.slice(schema.index + schema.raw.length);

  // ── markup ────────────────────────────────────────────────────────────
  const { body, replacements } = replaceDeadLinks(bodyBefore, file);

  // ── schema ────────────────────────────────────────────────────────────
  const existing = new Set(
    (schema.json.settings || []).map(s => (s && s.id) || null).filter(Boolean)
  );
  const toAdd = settingsFor(file).filter(s => s.type === "header" || !existing.has(s.id));

  // Drop a trailing/duplicated group header that ends up with nothing under it.
  const cleaned = [];
  for (let i = 0; i < toAdd.length; i++) {
    const s = toAdd[i];
    if (s.type === "header") {
      const next = toAdd[i + 1];
      if (!next || next.type === "header") continue;
    }
    cleaned.push(s);
  }

  if (replacements === 0 && cleaned.length === 0) {
    skipped.push(`${file}: already has menus and settings`);
    continue;
  }

  schema.json.settings = [...(schema.json.settings || []), ...cleaned];
  const newSchema = `${schema.open}\n${JSON.stringify(schema.json, null, 2)}\n${schema.close}`;
  const after = body + newSchema + afterSchema;

  // ── guards ────────────────────────────────────────────────────────────
  const problems = [];
  const c = counts(after);
  if (c.if !== c.endif) problems.push(`if/endif ${c.if}/${c.endif}`);
  if (c.for !== c.endfor) problems.push(`for/endfor ${c.for}/${c.endfor}`);
  if (c.aOpen !== c.aClose) problems.push(`<a> ${c.aOpen} open / ${c.aClose} closed`);

  const reparsed = schemaOf(after);
  if (!reparsed) problems.push("schema no longer parses");
  else {
    const ids = (reparsed.json.settings || []).map(s => s && s.id).filter(Boolean);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length) problems.push(`duplicate setting ids: ${[...new Set(dupes)].join(", ")}`);
    if (!reparsed.json.presets) problems.push("preset lost");
  }

  if (problems.length) {
    rejected.push(`${file}: ${problems.join("; ")}`);
    continue;
  }

  planned.push({ file, full, before, after, replacements, added: cleaned.filter(s => s.type !== "header").length });
}

console.log(`header/footer sections: ${files.length}`);
console.log(`  will upgrade : ${planned.length}`);
console.log(`  skipped      : ${skipped.length}`);
console.log(`  REJECTED     : ${rejected.length}`);
for (const s of skipped) console.log(`    - ${s}`);
for (const r of rejected) console.log(`    ! ${r}`);

if (rejected.length) {
  console.error("\nRefusing to write: a file failed its guards. Nothing modified.");
  process.exit(1);
}

const totalLinks = planned.reduce((n, p) => n + p.replacements, 0);
const totalSettings = planned.reduce((n, p) => n + p.added, 0);
console.log(`\n  dead-link runs replaced with a real menu : ${totalLinks}`);
console.log(`  settings added                          : ${totalSettings}`);

if (DRY) {
  console.log("\n--dry: nothing written.");
  process.exit(0);
}

fs.mkdirSync(BACKUP, { recursive: true });
for (const p of planned) fs.writeFileSync(path.join(BACKUP, p.file), p.before);
console.log(`\nBackups: ${BACKUP}`);

for (const p of planned) fs.writeFileSync(p.full, p.after);

// Re-read from disk rather than trusting the buffers.
let verified = 0;
const failures = [];
for (const p of planned) {
  const now = fs.readFileSync(p.full, "utf-8");
  const c = counts(now);
  const s = schemaOf(now);
  if (now !== p.after) failures.push(`${p.file}: on-disk differs`);
  else if (c.if !== c.endif || c.for !== c.endfor) failures.push(`${p.file}: unbalanced tags`);
  else if (!s) failures.push(`${p.file}: schema broken on disk`);
  else verified++;
}

console.log(`Patched ${planned.length}, verified from disk: ${verified}`);
if (failures.length) {
  for (const f of failures) console.error(`  ! ${f}`);
  console.error(`Restore: cp "${BACKUP}"/*.liquid "${SECTIONS}"/`);
  process.exit(1);
}
console.log("All upgraded files verified.");
