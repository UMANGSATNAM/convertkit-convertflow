import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { upsertThemeFilesBatched, readFile } from "./theme-engine/index";
import { buildStorePalette, applyStorePalette, readSchema } from "./theme-engine/palette.server";

/**
 * Installs one section from the library into a merchant's theme.
 *
 * ## Why this exists alongside the generator
 *
 * The generator builds a whole store in one pass. That means every part of it —
 * copy, images, colour, section choice — has to be right first time, and a
 * merchant who dislikes one band has no way to change it without regenerating
 * everything. This is the other half: pick one section, see it with your own
 * products, put it on the page.
 *
 * ## Why `injectSectionToTheme` was not enough
 *
 * The existing helper uploads `sections/<id>.liquid` and stops. That makes the
 * section *available* in Shopify's theme editor but does not put it on any page,
 * and it ships none of the snippets or assets the section renders — so even
 * after a merchant added it by hand it would render with missing partials.
 *
 * Installing a section properly means four things:
 *   1. the section's own Liquid
 *   2. every snippet and asset it renders, followed transitively
 *   3. an entry in the template JSON (or section group) so it appears on a page
 *   4. the store's palette applied, so it does not arrive in another brand's colours
 */

const ENGINE = path.resolve(process.cwd(), "app/data/templates/theme-engine");
const BASE = path.join(ENGINE, "base-theme");

export interface SectionBundle {
  /** `sections/<id>.liquid` → source, plus every snippet and asset it needs. */
  files: Record<string, string>;
  /** Snippets that could not be found. Installing anyway would render errors. */
  missing: string[];
}

/**
 * Collects a section's Liquid and everything it renders.
 *
 * Snippet references are followed transitively because library snippets render
 * other snippets — a product card renders a price partial, which renders a
 * badge. Depth is capped so a snippet that renders itself cannot hang the
 * request.
 */
export async function resolveSectionBundle(componentId: string, liquidPath: string): Promise<SectionBundle> {
  const files: Record<string, string> = {};
  const missing: string[] = [];

  const sectionFile = path.join(ENGINE, liquidPath);
  if (!existsSync(sectionFile)) {
    throw new Error(`Section "${componentId}" has no Liquid at ${liquidPath}`);
  }

  const source = await fs.readFile(sectionFile, "utf-8");
  files[`sections/${componentId}.liquid`] = source;

  const seenSnippets = new Set<string>();
  const seenAssets = new Set<string>();

  const collect = async (src: string, depth: number) => {
    if (depth > 4) return;

    for (const m of src.matchAll(/\{%-?\s*(?:render|include)\s+'([^']+)'/g)) {
      const name = m[1];
      if (seenSnippets.has(name)) continue;
      seenSnippets.add(name);

      const file = path.join(BASE, "snippets", `${name}.liquid`);
      if (!existsSync(file)) {
        missing.push(`snippets/${name}.liquid`);
        continue;
      }
      const snippet = await fs.readFile(file, "utf-8");
      files[`snippets/${name}.liquid`] = snippet;
      await collect(snippet, depth + 1);
    }

    for (const m of src.matchAll(/'([A-Za-z0-9_.\-]+\.(?:js|css|svg|png|jpg|woff2?))'\s*\|\s*asset_url/g)) {
      const name = m[1];
      if (seenAssets.has(name)) continue;
      seenAssets.add(name);

      const file = path.join(BASE, "assets", name);
      if (!existsSync(file)) {
        missing.push(`assets/${name}`);
        continue;
      }
      files[`assets/${name}`] = await fs.readFile(file, "utf-8");
    }
  };

  await collect(source, 0);

  // Every section in this library assumes the utility stylesheet exists; 20 of
  // them are written entirely in utility classes and render as unstyled text
  // without it.
  const utility = path.join(BASE, "assets/utility.css");
  if (existsSync(utility)) files["assets/utility.css"] = await fs.readFile(utility, "utf-8");

  return { files, missing };
}

export type InstallTarget =
  | { kind: "template"; template: string; position?: "top" | "bottom" }
  | { kind: "group"; group: "header" | "footer"; replace?: string };

export interface InstallResult {
  componentId: string;
  filesWritten: number;
  target: string;
  sectionKey: string;
  missing: string[];
  paletteApplied: number;
}

/**
 * Reads a JSON file from the theme, returning null when it does not exist yet.
 */
async function readThemeJson(shop: any, themeId: string, file: string): Promise<any | null> {
  try {
    const raw = await readFile(shop, themeId, file);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** A stable, collision-free key for the section inside the template JSON. */
function sectionKeyFor(existing: Record<string, any>, componentId: string): string {
  const base = componentId.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  if (!existing[base]) return base;
  let n = 2;
  while (existing[`${base}-${n}`]) n++;
  return `${base}-${n}`;
}

/**
 * Installs a section and places it on a page.
 *
 * `settings` from the caller win over anything derived here, so a merchant who
 * has already configured the section in a preview keeps their choices when they
 * install it for real.
 */
export async function installSection(
  shop: any,
  themeId: string,
  component: { componentId: string; liquidPath: string; sectionType?: string },
  target: InstallTarget,
  options: {
    settings?: Record<string, any>;
    palette?: { background?: string; text?: string; accent?: string; accentAlt?: string; surface?: string };
  } = {}
): Promise<InstallResult> {
  const { componentId, liquidPath } = component;

  const bundle = await resolveSectionBundle(componentId, liquidPath);
  const files = { ...bundle.files };

  // ── Place it on a page ────────────────────────────────────────────────
  let targetFile: string;
  let doc: any;

  if (target.kind === "group") {
    targetFile = `sections/${target.group}-group.json`;
    doc = (await readThemeJson(shop, themeId, targetFile)) || { type: target.group, sections: {}, order: [] };
  } else {
    targetFile = `templates/${target.template}.json`;
    doc = (await readThemeJson(shop, themeId, targetFile)) || { sections: {}, order: [] };
  }

  if (!doc.sections || typeof doc.sections !== "object") doc.sections = {};
  if (!Array.isArray(doc.order)) doc.order = [];

  let key: string;

  if (target.kind === "group" && target.replace) {
    // Swapping the existing header or footer rather than adding a second one.
    // A store with two headers is not a design choice.
    key = target.replace;
    const previous = doc.sections[key];
    doc.sections[key] = {
      type: componentId,
      settings: { ...(previous?.settings || {}), ...(options.settings || {}) },
    };
    if (!doc.order.includes(key)) doc.order.push(key);
  } else {
    key = sectionKeyFor(doc.sections, componentId);
    doc.sections[key] = { type: componentId, settings: options.settings || {} };
    if (target.kind === "template" && target.position === "top") doc.order.unshift(key);
    else doc.order.push(key);
  }

  files[targetFile] = JSON.stringify(doc, null, 2);

  // ── Match the store's colours ─────────────────────────────────────────
  // A section arriving in the palette it was authored with is the single most
  // obvious sign that it came from somewhere else.
  let paletteApplied = 0;
  if (options.palette) {
    const palette = buildStorePalette(options.palette);
    const stats = applyStorePalette(files, palette);
    paletteApplied = stats.settingsWritten;
  }

  await upsertThemeFilesBatched(shop, themeId, files);

  if (bundle.missing.length > 0) {
    // Shopify renders a missing snippet as a visible Liquid error on the page,
    // so this is worth surfacing rather than logging quietly.
    console.warn(
      `[SectionInstall] "${componentId}" references ${bundle.missing.length} file(s) not in the library: ` +
      bundle.missing.slice(0, 5).join(", ")
    );
  }

  return {
    componentId,
    filesWritten: Object.keys(files).length,
    target: targetFile,
    sectionKey: key,
    missing: bundle.missing,
    paletteApplied,
  };
}

/**
 * Removes a section from a page without deleting its Liquid.
 *
 * The file is left in place so re-adding it costs nothing and so a merchant who
 * removes a section by accident does not lose their settings for it.
 */
export async function removeSectionFromPage(
  shop: any,
  themeId: string,
  targetFile: string,
  sectionKey: string
): Promise<boolean> {
  const doc = await readThemeJson(shop, themeId, targetFile);
  if (!doc?.sections?.[sectionKey]) return false;

  delete doc.sections[sectionKey];
  doc.order = (doc.order || []).filter((k: string) => k !== sectionKey);

  await upsertThemeFilesBatched(shop, themeId, {
    [targetFile]: JSON.stringify(doc, null, 2),
  });
  return true;
}

/**
 * The settings a section exposes, read from its schema.
 *
 * Used by the browser UI to show what a merchant will be able to change before
 * they commit to installing it.
 */
export async function describeSection(liquidPath: string): Promise<{
  name: string;
  settings: Array<{ id: string; type: string; label?: string }>;
  hasPreset: boolean;
} | null> {
  const file = path.join(ENGINE, liquidPath);
  if (!existsSync(file)) return null;

  const schema = readSchema(await fs.readFile(file, "utf-8"));
  if (!schema) return null;

  return {
    name: schema.name || path.basename(liquidPath, ".liquid"),
    settings: (schema.settings || [])
      .filter((s: any) => s && s.id && s.type !== "header" && s.type !== "paragraph")
      .map((s: any) => ({ id: s.id, type: s.type, label: s.label })),
    hasPreset: Array.isArray(schema.presets) && schema.presets.length > 0,
  };
}
