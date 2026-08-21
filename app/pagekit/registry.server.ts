import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";

/**
 * Resolves section ids to their Liquid, and refuses to guess.
 *
 * The old path treated a missing section as a warning: it collected the id into
 * an array, wrote the template anyway, and uploaded a theme with a hole in it.
 * The merchant saw a header, a footer, and nothing between them, with no error
 * on screen or in the log. `hp-v1-home` in `page-templates.ts` still fails this
 * way — all nine of its sections are absent from the registry.
 *
 * Everything here returns a result you have to look at.
 */

const ENGINE = path.resolve(process.cwd(), "app/data/templates/theme-engine");
const BASE = path.join(ENGINE, "base-theme");

/**
 * Where sections are authored, checked when the engine registry does not know an
 * id.
 *
 * The engine registry is written by `sync_peri_to_engine.cjs`. A section written
 * here and not yet synced is invisible to the registry, and the old apply path
 * skipped unknown ids silently — so a page built from freshly authored sections
 * applied as a header and a footer with nothing between them, and the only way
 * to know was to remember to run the sync.
 *
 * All nine sections of `hp-v1-home` are in this folder right now and in no
 * registry. Reading from here removes the whole failure rather than asking
 * everyone to remember a build step.
 */
const AUTHORING = path.resolve(process.cwd(), "dev-theme-peri");

export interface ResolvedSection {
  id: string;
  liquidPath: string;
  source: string;
}

export interface Resolution {
  ok: boolean;
  resolved: ResolvedSection[];
  /** Ids with no registry entry at all. */
  unknown: string[];
  /** Ids in the registry whose Liquid is not on disk. */
  fileMissing: string[];
}

let registryCache: Map<string, string> | null = null;

/** componentId → liquidPath, read once per process. */
export async function loadRegistry(force = false): Promise<Map<string, string>> {
  if (registryCache && !force) return registryCache;

  const raw = JSON.parse(await fs.readFile(path.join(ENGINE, "registry.json"), "utf-8"));
  const list = Array.isArray(raw) ? raw : raw.components || [];

  const map = new Map<string, string>();
  for (const c of list) {
    if (c?.componentId && c?.liquidPath) map.set(c.componentId, c.liquidPath);
  }
  registryCache = map;
  return map;
}

/**
 * Resolves every id, reading each section's Liquid.
 *
 * Reads eagerly rather than lazily so a page is either fully available or
 * rejected — a half-written theme is worse than a refused one.
 */
export async function resolveSections(ids: string[]): Promise<Resolution> {
  const registry = await loadRegistry();

  const resolved: ResolvedSection[] = [];
  const unknown: string[] = [];
  const fileMissing: string[] = [];

  for (const id of ids) {
    const liquidPath = registry.get(id);

    // The engine copy first — that is what a synced, published section looks
    // like.
    if (liquidPath) {
      const full = path.join(ENGINE, liquidPath);
      if (existsSync(full)) {
        resolved.push({ id, liquidPath, source: await fs.readFile(full, "utf-8") });
        continue;
      }
    }

    // Then the authoring folder. A section written a minute ago and not yet
    // synced is a real section; refusing it would mean every new design needs a
    // build step run before it can be used, and forgetting that step is exactly
    // what produced header-and-footer-only pages.
    const authored = path.join(AUTHORING, "sections", `${id}.liquid`);
    if (existsSync(authored)) {
      resolved.push({
        id,
        liquidPath: path.relative(ENGINE, authored),
        source: await fs.readFile(authored, "utf-8"),
      });
      continue;
    }

    if (liquidPath) fileMissing.push(id);
    else unknown.push(id);
  }

  return {
    ok: unknown.length === 0 && fileMissing.length === 0,
    resolved,
    unknown,
    fileMissing,
  };
}

export interface Bundle {
  /** Theme-relative path → contents. */
  files: Record<string, string>;
  /** Snippets or assets a section renders that are not in the library. */
  missing: string[];
}

/**
 * Collects everything the given sections need to render.
 *
 * Snippets are followed transitively because library snippets render other
 * snippets — a product card renders a price partial, which renders a badge.
 * Depth is capped so a snippet that renders itself cannot hang a request.
 */
export async function bundleFor(sections: ResolvedSection[]): Promise<Bundle> {
  const files: Record<string, string> = {};
  const missing: string[] = [];
  const seenSnippet = new Set<string>();
  const seenAsset = new Set<string>();

  const collect = async (src: string, depth: number) => {
    if (depth > 4) return;

    for (const m of src.matchAll(/\{%-?\s*(?:render|include)\s+'([^']+)'/g)) {
      const name = m[1];
      if (seenSnippet.has(name)) continue;
      seenSnippet.add(name);

      // Same two places, same reason: a snippet written alongside a new section
      // has not been synced into the base theme yet.
      let file = path.join(BASE, "snippets", `${name}.liquid`);
      if (!existsSync(file)) file = path.join(AUTHORING, "snippets", `${name}.liquid`);
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
      if (seenAsset.has(name)) continue;
      seenAsset.add(name);

      let file = path.join(BASE, "assets", name);
      if (!existsSync(file)) file = path.join(AUTHORING, "assets", name);
      if (!existsSync(file)) {
        missing.push(`assets/${name}`);
        continue;
      }
      files[`assets/${name}`] = await fs.readFile(file, "utf-8");
    }
  };

  for (const s of sections) {
    files[`sections/${s.id}.liquid`] = s.source;
    await collect(s.source, 0);
  }

  // A fifth of the library is written entirely in utility classes and renders as
  // unstyled text without this stylesheet.
  const utility = path.join(BASE, "assets/utility.css");
  if (existsSync(utility)) files["assets/utility.css"] = await fs.readFile(utility, "utf-8");

  return { files, missing };
}

/** Reads a section's `{% schema %}`, or null when it has none or it is invalid. */
export function schemaOf(source: string): any | null {
  const m = source.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

/**
 * The settings and blocks a section needs in order to render something.
 *
 * ## Why blocks have to be generated
 *
 * 721 sections in the library render their content inside
 * `{% for block in section.blocks %}`, and blocks do not exist unless the
 * template declares them — unlike settings, which fall back to the schema
 * default when omitted. 155 of those sections have no preset that defines
 * blocks, so writing `settings: {}` produces a section that uploads cleanly,
 * validates, and renders as an empty band. Every block-driven section in the
 * RAWBLOX page is one of those 155.
 *
 * The old apply path worked around this with `hydrateSectionEntry`, a hand-
 * written list of block content for `hp51-*` and `fb04-*` only. It fixed two
 * families and left the other sixty to render blank.
 *
 * This reads what the section itself declares instead, so it works for all of
 * them and stays correct when a section is edited.
 */
export interface SectionSeed {
  settings: Record<string, any>;
  blocks?: Record<string, any>;
  block_order?: string[];
}

/** How many blocks to create for a section that declares only one block type. */
const REPEATED_BLOCKS = 3;

export function seedFor(source: string): SectionSeed {
  const schema = schemaOf(source);
  if (!schema) return { settings: {} };

  const preset = (schema.presets || [])[0] || {};
  // Settings are only copied from the preset. A setting the template omits
  // already falls back to its schema default, so copying those would just
  // duplicate them into the file.
  const seed: SectionSeed = { settings: { ...(preset.settings || {}) } };

  const declared: any[] = [];  // TEMPORARY BREAK
  if (!declared.length) return seed;

  // A section that never loops its blocks does not need any.
  if (!/\{%-?\s*for\s+\w+\s+in\s+section\.blocks/.test(source)) return seed;

  const blocks: Record<string, any> = {};
  const order: string[] = [];
  const add = (type: string, settings: Record<string, any> = {}) => {
    if (typeof schema.max_blocks === "number" && order.length >= schema.max_blocks) return;
    const key = `b${order.length + 1}`;
    blocks[key] = { type, settings };
    order.push(key);
  };

  const presetBlocks = Array.isArray(preset.blocks) ? preset.blocks : [];
  if (presetBlocks.length) {
    // The section author already said what belongs here.
    for (const b of presetBlocks) {
      if (b?.type) add(b.type, b.settings || {});
    }
  } else {
    const types = declared.map((b: any) => b?.type).filter(Boolean);
    // One of each when the section mixes block types — that is what a preset
    // would normally do. When there is only one type, a few of them, because a
    // tab switcher or a marquee with a single item is not a design.
    if (types.length === 1) {
      for (let i = 0; i < REPEATED_BLOCKS; i++) add(types[0]);
    } else {
      for (const type of types) add(type);
    }
  }

  if (order.length) {
    seed.blocks = blocks;
    seed.block_order = order;
  }
  return seed;
}

/** True when the section declares a `collection` setting that needs pointing somewhere. */
export function wantsCollection(source: string): string | null {
  const schema = schemaOf(source);
  if (!schema) return null;
  const found = (schema.settings || []).find(
    (s: any) => s && s.type === "collection" && s.id
  );
  return found ? found.id : null;
}
