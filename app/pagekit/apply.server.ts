import { readFile } from "../services/theme-engine/index";
import { writeThemeFiles, ThemeWriteError } from "./upload.server";
import { graphqlRequest } from "../services/shopify-api.server";
import { resolveSections, bundleFor, wantsCollection } from "./registry.server";
import type { PageDefinition } from "./pages";

/**
 * Writes a page onto a theme, or refuses and says why.
 *
 * The behaviour that matters is the refusal. The previous implementation
 * collected missing sections into an array and wrote the template regardless,
 * which is how a design applies "successfully" and renders as a header and a
 * footer with nothing between them.
 */

const TEMPLATE_FILE: Record<string, string> = {
  index: "templates/index.json",
  product: "templates/product.json",
  collection: "templates/collection.json",
  cart: "templates/cart.json",
};

export interface ApplyOptions {
  /** Write as `templates/index.<variant>.json` for previewing without replacing the page. */
  variant?: string;
  /** Collection handles for any section that shows products. */
  collections?: string[];
}

export interface ApplyResult {
  ok: boolean;
  pageId: string;
  themeId: string;
  templateFile: string;
  /** Section keys written, in page order. */
  sectionKeys: string[];
  filesWritten: number;
  collectionsWired: number;
  /** Populated only when ok is false. */
  error?: string;
  unknownSections?: string[];
  missingFiles?: string[];
  /** Snippets or assets a section renders that are not in the library. */
  missingPartials?: string[];
  /** Files Shopify refused, with its reason for each. */
  rejectedFiles?: Array<{ file: string; message: string }>;
}

/** A stable key that preserves page order in the theme editor's section list. */
function keyFor(index: number, id: string) {
  return `${String(index + 1).padStart(2, "0")}-${id}`;
}

async function readJson(shop: any, themeId: string, file: string): Promise<any> {
  try {
    const raw = await readFile(shop, themeId, file);
    const doc = raw ? JSON.parse(raw) : {};
    return doc && typeof doc === "object" ? doc : {};
  } catch {
    return {};
  }
}

export async function applyPage(
  shop: any,
  themeId: string,
  page: PageDefinition,
  options: ApplyOptions = {}
): Promise<ApplyResult> {
  const wanted = [...page.sections, page.header, page.footer].filter(Boolean) as string[];
  const resolution = await resolveSections(wanted);

  // Refuse rather than write a partial page.
  if (!resolution.ok) {
    const parts: string[] = [];
    if (resolution.unknown.length) {
      parts.push(`${resolution.unknown.length} section(s) are not in the registry: ${resolution.unknown.join(", ")}`);
    }
    if (resolution.fileMissing.length) {
      parts.push(`${resolution.fileMissing.length} section(s) have no Liquid on disk: ${resolution.fileMissing.join(", ")}`);
    }
    return {
      ok: false,
      pageId: page.id,
      themeId,
      templateFile: "",
      sectionKeys: [],
      filesWritten: 0,
      collectionsWired: 0,
      error: `"${page.name}" cannot be applied. ${parts.join(". ")}. Nothing was written.`,
      unknownSections: resolution.unknown,
      missingFiles: resolution.fileMissing,
    };
  }

  const bySectionId = new Map(resolution.resolved.map(r => [r.id, r]));
  const pageSections = page.sections.map(id => bySectionId.get(id)!);

  const bundle = await bundleFor(resolution.resolved);
  const files = { ...bundle.files };

  // ── The page template ──────────────────────────────────────────────
  const sections: Record<string, any> = {};
  const order: string[] = [];
  let collectionsWired = 0;
  const handles = options.collections?.length ? options.collections : ["all"];

  pageSections.forEach((s, i) => {
    const key = keyFor(i, s.id);
    const settings: Record<string, any> = {};

    // Point product-showing sections at a real collection. Without this they
    // fall through to their placeholder branch, which is what puts empty cards
    // or invented product names on a freshly applied page.
    const collectionSetting = wantsCollection(s.source);
    if (collectionSetting) {
      settings[collectionSetting] = handles[collectionsWired % handles.length];
      collectionsWired++;
    }

    sections[key] = { type: s.id, settings };
    order.push(key);
  });

  const base = TEMPLATE_FILE[page.pageType] || TEMPLATE_FILE.index;
  const templateFile = options.variant ? base.replace(/\.json$/, `.${options.variant}.json`) : base;
  files[templateFile] = JSON.stringify({ sections, order }, null, 2);

  // ── Header and footer ──────────────────────────────────────────────
  // Section groups are shared by every template, so a variant staged only for
  // preview must not touch them — otherwise previewing one design changes the
  // header for all of them.
  if (!options.variant) {
    for (const [slot, id] of [["header", page.header], ["footer", page.footer]] as const) {
      if (!id) continue;
      const groupFile = `sections/${slot}-group.json`;
      const group = await readJson(shop, themeId, groupFile);
      if (!group.sections || typeof group.sections !== "object") group.sections = {};
      if (!Array.isArray(group.order)) group.order = [];
      if (!group.type) group.type = slot;

      // Replace the existing entry. A store with two headers is not a design.
      const previous = group.sections[slot]?.settings || {};
      group.sections[slot] = { type: id, settings: previous };
      if (!group.order.includes(slot)) group.order.push(slot);

      files[groupFile] = JSON.stringify(group, null, 2);
    }
  }

  try {
    await writeThemeFiles(shop, themeId, files);
  } catch (err: any) {
    // Reported rather than logged. The shared uploader prints userErrors and
    // returns success, which is how a rejected template became a blank page.
    return {
      ok: false,
      pageId: page.id,
      themeId,
      templateFile,
      sectionKeys: order,
      filesWritten: 0,
      collectionsWired,
      error:
        err instanceof ThemeWriteError
          ? err.message
          : `The theme files could not be written: ${err.message}`,
      rejectedFiles: err instanceof ThemeWriteError ? err.failures : undefined,
    };
  }

  return {
    ok: true,
    pageId: page.id,
    themeId,
    templateFile,
    sectionKeys: order,
    filesWritten: Object.keys(files).length,
    collectionsWired,
    missingPartials: bundle.missing.length ? [...new Set(bundle.missing)] : undefined,
  };
}

// ── Themes ───────────────────────────────────────────────────────────────

function numericId(gid: string) {
  return String(gid).split("/").pop() || String(gid);
}

export async function liveThemeId(shop: any): Promise<string> {
  const res = await graphqlRequest(
    shop.shopDomain,
    shop.accessToken,
    `query { themes(first: 50) { nodes { id name role } } }`
  );
  const live = (res?.themes?.nodes || []).find(
    (t: any) => String(t.role).toLowerCase() === "main"
  );
  if (!live) throw new Error("This store has no published theme.");
  return numericId(live.id);
}

/**
 * Collections with products, most recently updated first.
 *
 * Used to point grids at something real. A grid with no collection renders its
 * placeholder branch, and that is what puts invented products on a new page.
 */
export async function collectionHandles(shop: any): Promise<string[]> {
  try {
    const res = await graphqlRequest(
      shop.shopDomain,
      shop.accessToken,
      `query { collections(first: 8, sortKey: UPDATED_AT, reverse: true) {
        nodes { handle productsCount { count } } } }`
    );
    return (res?.collections?.nodes || [])
      .filter((c: any) => (c.productsCount?.count ?? 0) > 0)
      .map((c: any) => c.handle);
  } catch {
    return [];
  }
}

/**
 * A published product's handle.
 *
 * A product design cannot be looked at on `/products` — that path is not a
 * product page. Previewing one needs an actual product, and a store with none
 * cannot preview a product page at all, which is worth saying rather than
 * showing a 404.
 */
export async function sampleProductHandle(shop: any): Promise<string | null> {
  try {
    const res = await graphqlRequest(
      shop.shopDomain,
      shop.accessToken,
      `query { products(first: 1, query: "status:active") { nodes { handle } } }`
    );
    return res?.products?.nodes?.[0]?.handle || null;
  } catch {
    return null;
  }
}

// ── Undo ─────────────────────────────────────────────────────────────────

/**
 * A copy of every file an apply is about to overwrite, kept in the theme itself.
 *
 * Applying writes straight onto the published theme, which is what the merchant
 * asked for — instant, no draft, no second step. That makes an undo mandatory,
 * and it has to be one that works on every install.
 *
 * The existing `createSnapshot` helper is not that: when `R2_ACCOUNT_ID` is
 * unset it logs a warning, returns `{ id: "dev-snapshot-id" }` and stores
 * nothing, so the caller believes it has a backup and does not. An asset file in
 * the same theme has no such dependency — writing it uses the same API call the
 * apply already makes, and if that call fails the apply fails too.
 */
const BACKUP_FILE = "assets/pagekit-backup.json";

interface Backup {
  takenAt: string;
  pageId: string;
  files: Record<string, string>;
}

async function backup(shop: any, themeId: string, paths: string[], pageId: string) {
  const files: Record<string, string> = {};
  for (const p of paths) {
    try {
      const raw = await readFile(shop, themeId, p);
      // readFile returns "{}" for a file that does not exist. Recording that
      // would make a restore create an empty template where there was none, so
      // it is skipped instead.
      if (raw && raw !== "{}") files[p] = raw;
    } catch {
      // A path that cannot be read cannot be restored either. Better to know
      // which ones those are than to record a placeholder for them.
    }
  }
  const doc: Backup = { takenAt: new Date().toISOString(), pageId, files };
  // Not wrapped in try/catch on purpose. If the backup cannot be written, the
  // apply must not proceed — an undo that does not exist is worse than a design
  // that did not apply.
  await writeThemeFiles(shop, themeId, { [BACKUP_FILE]: JSON.stringify(doc) });
  return Object.keys(files).length;
}

export interface RestoreResult {
  ok: boolean;
  restored: string[];
  takenAt?: string;
  error?: string;
}

/** Puts back whatever the last apply overwrote. */
export async function restoreBackup(shop: any, themeId: string): Promise<RestoreResult> {
  let doc: Backup;
  try {
    const raw = await readFile(shop, themeId, BACKUP_FILE);
    doc = JSON.parse(raw);
  } catch {
    return { ok: false, restored: [], error: "There is no backup on this theme to restore." };
  }

  const files = doc?.files || {};
  if (!Object.keys(files).length) {
    return { ok: false, restored: [], error: "The backup on this theme is empty." };
  }

  await writeThemeFiles(shop, themeId, files);
  return { ok: true, restored: Object.keys(files), takenAt: doc.takenAt };
}

// ── The one call the UI makes ────────────────────────────────────────────

export interface LiveApplyResult extends ApplyResult {
  /** How many files were copied before anything was overwritten. */
  backedUp: number;
  /** Where the merchant can go and look at it. */
  storefrontUrl: string;
}

/**
 * Applies a page to the published theme, so it is live the moment this returns.
 *
 * Order matters: resolve, back up, then write. Resolution happens inside
 * `applyPage` and refuses the whole page if any section is missing, so a page
 * that cannot render never gets as far as touching the theme.
 */
export async function applyToLiveTheme(
  shop: any,
  page: PageDefinition,
  opts: { collections?: string[] } = {}
): Promise<LiveApplyResult> {
  const themeId = await liveThemeId(shop);

  const handles = opts.collections?.length ? opts.collections : await collectionHandles(shop);

  const willTouch = [TEMPLATE_FILE[page.pageType] || TEMPLATE_FILE.index];
  if (page.header) willTouch.push("sections/header-group.json");
  if (page.footer) willTouch.push("sections/footer-group.json");
  const backedUp = await backup(shop, themeId, willTouch, page.id);

  const result = await applyPage(shop, themeId, page, { collections: handles });

  let path = "/";
  if (page.pageType === "collection") path = "/collections/all";
  else if (page.pageType === "cart") path = "/cart";
  else if (page.pageType === "product") {
    const handle = await sampleProductHandle(shop);
    path = handle ? `/products/${handle}` : "/collections/all";
  }

  return {
    ...result,
    themeId,
    backedUp,
    storefrontUrl: `https://${shop.shopDomain}${path}`,
  };
}

/**
 * Stages a page as an alternate template so it can be looked at without
 * replacing anything.
 *
 * `templates/index.<variant>.json` is served at `?view=<variant>` and is
 * invisible to shoppers, so this is safe to run against the live theme. Header
 * and footer are deliberately not written — they are shared by every template,
 * and a preview that changed them would change the real store.
 */
export async function stagePreview(
  shop: any,
  page: PageDefinition,
  opts: { collections?: string[] } = {}
): Promise<ApplyResult & { previewPath: string; themeId: string }> {
  const themeId = await liveThemeId(shop);
  const handles = opts.collections?.length ? opts.collections : await collectionHandles(shop);
  const variant = `pk-${page.id}`.slice(0, 45);

  const result = await applyPage(shop, themeId, page, { collections: handles, variant });

  let base = "/";
  if (page.pageType === "collection") base = "/collections/all";
  else if (page.pageType === "product") {
    const handle = await sampleProductHandle(shop);
    if (!handle) {
      return {
        ...result,
        ok: false,
        themeId,
        previewPath: "",
        error: "This store has no active products, so a product page cannot be previewed.",
      };
    }
    base = `/products/${handle}`;
  }

  return { ...result, themeId, previewPath: `${base}?view=${variant}` };
}
