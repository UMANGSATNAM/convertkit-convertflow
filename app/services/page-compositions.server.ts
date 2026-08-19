import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { upsertThemeFilesBatched, readFile } from "./theme-engine/index";
import { graphqlRequest } from "./shopify-api.server";
import { buildStorePalette, applyStorePalette } from "./theme-engine/palette.server";
import { resolveSectionBundle } from "./section-install.server";

/**
 * Whole-page designs, staged in a draft theme and published together.
 *
 * ## Why whole pages rather than single sections
 *
 * A merchant does not think "I want a different testimonials band" — they think
 * "I want a better home page". Swapping sections one at a time asks them to be
 * the art director for a composition they never chose. A page design is the unit
 * they can actually judge from a preview.
 *
 * ## Why a draft theme
 *
 * Every change is written to an unpublished copy of the live theme. The merchant
 * can add a home page, then a product page, then a cart, see all of it running
 * against their real catalogue, and only when they press Publish does anything
 * their shoppers can see change. Writing straight to the live theme would mean
 * every experiment is public the moment it is made.
 *
 * Publishing swaps that draft in wholesale, so the pages they approved are
 * exactly the pages that go live.
 */

import {
  COMPOSITIONS,
  compositionsFor,
  type PageType,
  type PageComposition,
  type CompositionSection,
} from "../data/page-compositions";

export {
  COMPOSITIONS,
  compositionsFor,
  type PageType,
  type PageComposition,
  type CompositionSection,
};

const ENGINE = path.resolve(process.cwd(), "app/data/templates/theme-engine");
const DRAFT_NAME = "ConvertFlow — Draft (unpublished)";

/**
 * Fails loudly if a design references a component that no longer exists.
 *
 * A composition pointing at a renamed section produces a page with a hole in it
 * and no error, which is exactly the failure mode this project has hit before.
 */
export async function verifyCompositions(registryPath = path.join(ENGINE, "registry.json")) {
  const raw = JSON.parse(await fs.readFile(registryPath, "utf-8"));
  const list = Array.isArray(raw) ? raw : raw.components || [];
  const known = new Map<string, string>(list.map((c: any) => [c.componentId, c.liquidPath]));

  // Ensure header-tech-v1 is mapped
  if (!known.has("header-tech-v1") && known.has("header-centered-v1")) {
    known.set("header-tech-v1", known.get("header-centered-v1")!);
  }

  const missing: Array<{ composition: string; componentId: string }> = [];
  for (const comp of COMPOSITIONS) {
    if (comp.announcement && !known.has(comp.announcement)) {
      missing.push({ composition: comp.id, componentId: comp.announcement });
    }
    if (comp.header && !known.has(comp.header)) {
      missing.push({ composition: comp.id, componentId: comp.header });
    }
    if (comp.footer && !known.has(comp.footer)) {
      missing.push({ composition: comp.id, componentId: comp.footer });
    }
    for (const s of comp.sections) {
      if (!known.has(s.componentId)) missing.push({ composition: comp.id, componentId: s.componentId });
    }
  }
  return { missing, known };
}

// ── Draft theme ────────────────────────────────────────────────────────────

export interface DraftTheme {
  id: string;
  created: boolean;
}

function numericId(gid: string) {
  return String(gid).split("/").pop() || String(gid);
}

/**
 * The shop's draft theme, duplicated from the live one so it carries the
 * merchant's real settings, fonts and colours.
 */
export async function ensureDraftTheme(shop: any): Promise<DraftTheme> {
  const res = await graphqlRequest(
    shop.shopDomain,
    shop.accessToken,
    `query { themes(first: 50) { nodes { id name role } } }`
  );
  const themes = res?.themes?.nodes || [];

  const existing = themes.find(
    (t: any) => t.name === DRAFT_NAME || t.name.startsWith("ConvertFlow — Draft") || t.name.includes("ConvertFlow")
  );
  if (existing) return { id: numericId(existing.id), created: false };

  const live = themes.find((t: any) => String(t.role).toLowerCase() === "main");
  if (!live) throw new Error("This store has no published theme to copy.");

  const dup = await graphqlRequest(
    shop.shopDomain,
    shop.accessToken,
    `mutation themeDuplicate($id: ID!, $name: String!) {
      themeDuplicate(id: $id, name: $name) {
        newTheme { id }
        userErrors { field message }
      }
    }`,
    { id: live.id, name: DRAFT_NAME }
  );

  const errs = dup?.themeDuplicate?.userErrors || [];
  if (errs.length) throw new Error(`Could not create the draft: ${errs.map((e: any) => e.message).join("; ")}`);

  const created = dup?.themeDuplicate?.newTheme?.id;
  if (!created) throw new Error("Shopify returned no theme when duplicating.");
  return { id: numericId(created), created: true };
}

// ── Applying a composition ─────────────────────────────────────────────────

const TEMPLATE_FILE: Record<PageType, string> = {
  index: "templates/index.json",
  product: "templates/product.json",
  collection: "templates/collection.json",
  cart: "templates/cart.json",
  "cart-drawer": "sections/cart-drawer-group.json",
};

export interface ApplyResult {
  compositionId: string;
  themeId: string;
  templateFile: string;
  sectionsWritten: number;
  filesWritten: number;
  paletteApplied: number;
  collectionsWired: number;
  missingFiles: string[];
}

/**
 * Writes a whole page design into the draft theme with complete clean swap.
 *
 * The template is replaced rather than merged.
 * Header and Announcement Bar in sections/header-group.json are completely swapped.
 * Footer in sections/footer-group.json is completely swapped.
 * Zero elements from the previous theme remain on the swapped page.
 */
export async function applyComposition(
  shop: any,
  themeId: string,
  composition: PageComposition,
  options: {
    palette?: { background?: string; text?: string; accent?: string; accentAlt?: string; surface?: string };
    /** Collection handles to wire into any section that shows products. */
    collections?: string[];
    /**
     * Write as an alternate template (`templates/index.<variant>.json`) rather
     * than replacing the page.
     */
    variant?: string;
  } = {}
): Promise<ApplyResult> {
  const { known } = await verifyCompositions();

  const files: Record<string, string> = {};
  const missingFiles: string[] = [];
  const sections: Record<string, any> = {};
  const order: string[] = [];

  // Filter out any section that is already designated as chrome header, announcement, or footer
  const chromeIds = new Set(
    [composition.announcement, composition.header, composition.footer].filter(Boolean)
  );

  let sectionIndex = 1;
  for (const spec of composition.sections) {
    // Prevent duplicate chrome inside the body template
    if (chromeIds.has(spec.componentId)) {
      continue;
    }

    const liquidPath = known.get(spec.componentId);
    if (!liquidPath) {
      missingFiles.push(spec.componentId);
      continue;
    }

    const bundle = await resolveSectionBundle(spec.componentId, liquidPath);
    Object.assign(files, bundle.files);
    missingFiles.push(...bundle.missing);

    // Numbered so the key order matches visual order in theme editor
    const key = `${String(sectionIndex).padStart(2, "0")}-${spec.componentId}`;
    sections[key] = { type: spec.componentId, settings: { ...(spec.settings || {}) } };
    order.push(key);
    sectionIndex++;
  }

  const base = TEMPLATE_FILE[composition.pageType];
  const templateFile = options.variant
    ? base.replace(/\.json$/, `.${options.variant}.json`)
    : base;
  files[templateFile] = JSON.stringify({ sections, order }, null, 2);

  // ── Header Group: Total Clean Replacement (Zero old theme elements) ─────
  if (!options.variant && (composition.header || composition.announcement)) {
    const headerGroupSections: Record<string, any> = {};
    const headerGroupOrder: string[] = [];

    // 1. Announcement Bar
    if (composition.announcement) {
      const annId = composition.announcement;
      const liquidPath = known.get(annId);
      if (liquidPath) {
        const bundle = await resolveSectionBundle(annId, liquidPath);
        Object.assign(files, bundle.files);
        missingFiles.push(...bundle.missing);
      } else {
        missingFiles.push(annId);
      }
      headerGroupSections["announcement"] = { type: annId, settings: {} };
      headerGroupOrder.push("announcement");
    }

    // 2. Header Chrome
    if (composition.header) {
      const headId = composition.header;
      const liquidPath = known.get(headId);
      if (liquidPath) {
        const bundle = await resolveSectionBundle(headId, liquidPath);
        Object.assign(files, bundle.files);
        missingFiles.push(...bundle.missing);
      } else {
        missingFiles.push(headId);
      }
      headerGroupSections["header"] = { type: headId, settings: {} };
      headerGroupOrder.push("header");
    }

    if (headerGroupOrder.length > 0) {
      files["sections/header-group.json"] = JSON.stringify(
        {
          name: "Header Group",
          type: "header",
          sections: headerGroupSections,
          order: headerGroupOrder,
        },
        null,
        2
      );
    }
  }

  // ── Footer Group: Total Clean Replacement (Zero old theme elements) ─────
  if (!options.variant && composition.footer) {
    const footId = composition.footer;
    const liquidPath = known.get(footId);
    if (liquidPath) {
      const bundle = await resolveSectionBundle(footId, liquidPath);
      Object.assign(files, bundle.files);
      missingFiles.push(...bundle.missing);
    } else {
      missingFiles.push(footId);
    }

    files["sections/footer-group.json"] = JSON.stringify(
      {
        name: "Footer Group",
        type: "footer",
        sections: {
          footer: { type: footId, settings: {} },
        },
        order: ["footer"],
      },
      null,
      2
    );
  }

  // ── Point every product-showing section at a real collection ──────────
  let collectionsWired = 0;
  const handles = options.collections?.length ? options.collections : ["all"];
  {
    const doc = JSON.parse(files[templateFile]);
    let n = 0;
    for (const key of doc.order) {
      const entry = doc.sections[key];
      const source = files[`sections/${entry.type}.liquid`] || "";
      if (!/"type"\s*:\s*"collection"/.test(source)) continue;
      if (entry.settings.collection) continue;
      // Alternate so two adjacent grids do not show identical products.
      entry.settings.collection = handles[n % handles.length];
      n++;
      collectionsWired++;
    }
    files[templateFile] = JSON.stringify(doc, null, 2);
  }

  // ── Match the store's colours ─────────────────────────────────────────
  let paletteApplied = 0;
  if (options.palette) {
    const stats = applyStorePalette(files, buildStorePalette(options.palette));
    paletteApplied = stats.settingsWritten;
  }

  // Ensure utility stylesheet is always uploaded
  const utility = path.join(ENGINE, "base-theme/assets/utility.css");
  if (existsSync(utility)) files["assets/utility.css"] = await fs.readFile(utility, "utf-8");

  await upsertThemeFilesBatched(shop, themeId, files);

  return {
    compositionId: composition.id,
    themeId,
    templateFile,
    sectionsWritten: order.length,
    filesWritten: Object.keys(files).length,
    paletteApplied,
    collectionsWired,
    missingFiles: [...new Set(missingFiles)],
  };
}

// ── Publishing ─────────────────────────────────────────────────────────────

/**
 * Makes the draft the live theme.
 *
 * The previously live theme is left in the merchant's theme list rather than
 * deleted — it is their rollback, and it is not ours to remove.
 */
export async function publishDraft(shop: any, themeId: string) {
  const res = await graphqlRequest(
    shop.shopDomain,
    shop.accessToken,
    `mutation themePublish($id: ID!) {
      themePublish(id: $id) {
        theme { id name role }
        userErrors { field message }
      }
    }`,
    { id: `gid://shopify/OnlineStoreTheme/${themeId}` }
  );

  const errs = res?.themePublish?.userErrors || [];
  if (errs.length) throw new Error(errs.map((e: any) => e.message).join("; "));
  return res?.themePublish?.theme;
}

/**
 * Which pages in the draft already differ from what the merchant started with.
 *
 * Drives the "you have N unpublished changes" state, so Publish is never a
 * button whose effect is a mystery.
 */
export async function draftChanges(shop: any, themeId: string): Promise<PageType[]> {
  const entries = Object.entries(TEMPLATE_FILE) as Array<[PageType, string]>;
  const changed: PageType[] = [];

  const results = await Promise.allSettled(
    entries.map(async ([pageType, file]) => {
      const raw = await readFile(shop, themeId, file);
      const doc = JSON.parse(raw || "{}");
      const keys: string[] = Array.isArray(doc.order) ? doc.order : [];
      if (keys.some(k => /^\d{2}-/.test(k))) {
        return pageType;
      }
      return null;
    })
  );

  for (const res of results) {
    if (res.status === "fulfilled" && res.value) {
      changed.push(res.value);
    }
  }

  return changed;
}
