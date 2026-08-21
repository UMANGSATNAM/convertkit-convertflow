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

/** True when the section declares a `collection` setting that needs pointing somewhere. */
export function wantsCollection(source: string): string | null {
  const schema = schemaOf(source);
  if (!schema) return null;
  const found = (schema.settings || []).find(
    (s: any) => s && s.type === "collection" && s.id
  );
  return found ? found.id : null;
}
