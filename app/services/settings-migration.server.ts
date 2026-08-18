import { readSchema } from "./theme-engine/palette.server";

/**
 * Carries a section's settings across when it is swapped for another design.
 *
 * ## Why this is the whole trick
 *
 * Swapping a section is only useful if the new one arrives showing the same
 * things. If a merchant has a featured-collection band pointed at "Bestsellers"
 * and swaps it for a different layout, the new band must already be pointed at
 * Bestsellers. Otherwise the swap produces an empty grid and a form to fill in,
 * which is slower than not swapping at all.
 *
 * ## Why matching by id is not enough
 *
 * Across the library, a collection picker is called `collection`, `feat_coll`,
 * `fbt_coll`, `target_collection` and more; a heading is `title`, `heading`, or
 * `hero_title`. Exact-id matching moves a fraction of the settings and silently
 * drops the rest.
 *
 * So matching runs in three passes, most confident first:
 *   1. same id and compatible type
 *   2. same *role* — a collection picker is a collection picker whatever it is
 *      called — matched in the order each side declares them
 *   3. text matched by what the field is for: a heading fills a heading
 *
 * ## What is deliberately not carried
 *
 * Padding, colours, column counts and section-specific toggles. Those describe
 * the old design, not the merchant's content: a `cols_mobile` of 2 that suited a
 * dense grid is wrong for a slider, and colours are set by the store palette
 * anyway. Carrying them across is how a swapped section ends up looking broken
 * in a way the merchant cannot explain.
 */

export type SettingRole =
  | "collection" | "product" | "blog" | "page" | "menu" | "image" | "video"
  | "heading" | "subheading" | "body" | "cta_label" | "cta_link"
  | "layout" | "colour" | "toggle" | "other";

interface Field {
  id: string;
  type: string;
  role: SettingRole;
  index: number;
}

/** Setting types whose value identifies *what content the section shows*. */
const DATA_TYPES: Record<string, SettingRole> = {
  collection: "collection",
  collection_list: "collection",
  product: "product",
  product_list: "product",
  blog: "blog",
  page: "page",
  link_list: "menu",
  image_picker: "image",
  video: "video",
  video_url: "video",
};

/**
 * Roles that are never carried across.
 *
 * `colour` is excluded because the palette engine writes every colour setting on
 * install; copying the old section's colours would immediately be overwritten,
 * or worse, survive and clash.
 */
const DO_NOT_CARRY: SettingRole[] = ["layout", "colour", "toggle", "other"];

function roleFor(setting: any): SettingRole {
  const type = String(setting.type || "");
  const id = String(setting.id || "").toLowerCase();

  const dataRole = DATA_TYPES[type];
  if (dataRole) return dataRole;

  if (type === "color" || type === "color_background") return "colour";
  if (type === "checkbox") return "toggle";
  if (type === "range" || type === "select") return "layout";

  if (type === "url") return "cta_link";

  if (type === "text" || type === "textarea" || type === "richtext" || type === "inline_richtext" || type === "html") {
    // A button label is text, but filling a heading with "Shop now" is worse
    // than leaving the heading empty, so labels are their own role.
    if (/(button|btn|cta|label|link_text|submit)/.test(id)) return "cta_label";
    if (/(subheading|subtitle|subtext|description|desc|caption|excerpt)/.test(id)) return "subheading";
    if (/(heading|title|headline)/.test(id)) return "heading";
    if (type === "textarea" || type === "richtext" || type === "html") return "body";
    return "body";
  }

  return "other";
}

function fieldsOf(schema: any): Field[] {
  const out: Field[] = [];
  const settings = Array.isArray(schema?.settings) ? schema.settings : [];
  settings.forEach((s: any, i: number) => {
    if (!s || typeof s !== "object" || !s.id) return;
    if (s.type === "header" || s.type === "paragraph") return;
    out.push({ id: String(s.id), type: String(s.type), role: roleFor(s), index: i });
  });
  return out;
}

/** Types that can hold each other's values without the value becoming invalid. */
function typesCompatible(a: string, b: string): boolean {
  if (a === b) return true;
  const textish = new Set(["text", "textarea", "richtext", "inline_richtext", "html"]);
  if (textish.has(a) && textish.has(b)) return true;
  if (a === "collection" && b === "collection_list") return true;
  if (a === "collection_list" && b === "collection") return true;
  if (a === "product" && b === "product_list") return true;
  if (a === "product_list" && b === "product") return true;
  return false;
}

export interface MigrationResult {
  settings: Record<string, any>;
  /** How each value found its new home, for the UI to explain the swap. */
  carried: Array<{ from: string; to: string; role: SettingRole; how: "id" | "role" | "text" }>;
  /** Old values with nowhere to go — usually copy the new design has no slot for. */
  dropped: Array<{ id: string; role: SettingRole }>;
}

/**
 * Maps one section's saved settings onto another section's schema.
 *
 * `fromSettings` is what the merchant currently has; `toSource` is the Liquid of
 * the section they are swapping to.
 */
export function migrateSettings(
  fromSettings: Record<string, any>,
  fromSource: string,
  toSource: string
): MigrationResult {
  const fromSchema = readSchema(fromSource);
  const toSchema = readSchema(toSource);

  if (!fromSchema || !toSchema) {
    return { settings: {}, carried: [], dropped: [] };
  }

  const fromFields = fieldsOf(fromSchema).filter(
    f => fromSettings[f.id] !== undefined && fromSettings[f.id] !== "" && fromSettings[f.id] !== null
  );
  const toFields = fieldsOf(toSchema);

  const settings: Record<string, any> = {};
  const carried: MigrationResult["carried"] = [];
  const usedFrom = new Set<string>();
  const filledTo = new Set<string>();

  const take = (from: Field, to: Field, how: "id" | "role" | "text") => {
    settings[to.id] = fromSettings[from.id];
    usedFrom.add(from.id);
    filledTo.add(to.id);
    carried.push({ from: from.id, to: to.id, role: to.role, how });
  };

  // ── Pass 1: same id, compatible type ─────────────────────────────────
  for (const to of toFields) {
    if (DO_NOT_CARRY.includes(to.role)) continue;
    const from = fromFields.find(f => f.id === to.id && !usedFrom.has(f.id));
    if (from && typesCompatible(from.type, to.type)) take(from, to, "id");
  }

  // ── Pass 2: same role, in declaration order ──────────────────────────
  // This is what moves a collection from `feat_coll` to `target_collection`.
  const dataRoles: SettingRole[] = ["collection", "product", "blog", "page", "menu", "image", "video"];
  for (const role of dataRoles) {
    const sources = fromFields.filter(f => f.role === role && !usedFrom.has(f.id));
    const targets = toFields.filter(f => f.role === role && !filledTo.has(f.id));
    for (let i = 0; i < Math.min(sources.length, targets.length); i++) {
      if (typesCompatible(sources[i].type, targets[i].type)) take(sources[i], targets[i], "role");
    }
  }

  // ── Pass 3: text by what the field is for ────────────────────────────
  const textRoles: SettingRole[] = ["heading", "subheading", "body", "cta_label", "cta_link"];
  for (const role of textRoles) {
    const sources = fromFields.filter(f => f.role === role && !usedFrom.has(f.id));
    const targets = toFields.filter(f => f.role === role && !filledTo.has(f.id));
    for (let i = 0; i < Math.min(sources.length, targets.length); i++) {
      take(sources[i], targets[i], "text");
    }
  }

  const dropped = fromFields
    .filter(f => !usedFrom.has(f.id) && !DO_NOT_CARRY.includes(f.role))
    .map(f => ({ id: f.id, role: f.role }));

  return { settings, carried, dropped };
}

/**
 * A short, honest sentence about what a swap will do, for the confirm step.
 *
 * Merchants approve a swap far more readily when they are told the collection is
 * coming with it, and complain far less about lost copy when they were warned.
 */
export function describeMigration(result: MigrationResult): string {
  const data = result.carried.filter(c =>
    ["collection", "product", "menu", "image", "blog", "page", "video"].includes(c.role)
  );
  const text = result.carried.filter(c => ["heading", "subheading", "body", "cta_label"].includes(c.role));

  const parts: string[] = [];
  if (data.length) parts.push(`${data.length} content selection${data.length === 1 ? "" : "s"}`);
  if (text.length) parts.push(`${text.length} piece${text.length === 1 ? "" : "s"} of copy`);

  if (parts.length === 0) return "Nothing carries over — the new design will use its own defaults.";

  let sentence = `Carries over ${parts.join(" and ")}.`;
  if (result.dropped.length) {
    sentence += ` ${result.dropped.length} setting${result.dropped.length === 1 ? " has" : "s have"} no equivalent and will be lost.`;
  }
  return sentence;
}
