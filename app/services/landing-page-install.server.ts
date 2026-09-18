import { getLandingPageById } from "../data/landing-pages-registry";
import { resolveSections, bundleFor, seedFor } from "../pagekit/registry.server";
import { upsertThemeFilesBatched } from "./theme-engine/index";
import { previewUrl } from "./preview-theme.server";

export interface LandingPageInstallResult {
  landingPageId: string;
  templateKey: string;
  templateName: string;
  filesWritten: number;
  sectionCount: number;
  themeId: string;
  editorUrl: string;
  previewUrl?: string;
}

/**
 * Installs a complete 11-13 section D2C landing page into the merchant's theme as a
 * native Shopify JSON page template (`templates/page.{niche}.json`) with fully populated
 * settings, blocks, and block orders conforming to Shopify Online Store 2.0 standards.
 */
export async function installLandingPage(
  shop: any,
  themeId: string,
  landingPageId: string,
  options: { isDraftTheme?: boolean } = {}
): Promise<LandingPageInstallResult> {
  const lp = getLandingPageById(landingPageId);
  if (!lp) {
    throw new Error(`Landing page template "${landingPageId}" not found`);
  }

  // 1. Gather all section IDs in logical storefront order
  const allSectionIds = [
    ...(lp.announcement ? [lp.announcement] : []),
    ...(lp.header ? [lp.header] : []),
    ...lp.sections.map(s => s.componentId),
    ...(lp.footer ? [lp.footer] : [])
  ];

  // 2. Resolve sections and bundle all required snippets & assets
  const resolution = await resolveSections(allSectionIds);
  if (!resolution.ok && resolution.resolved.length === 0) {
    throw new Error(
      `Failed to resolve sections for "${landingPageId}": missing ${resolution.fileMissing.join(", ")}`
    );
  }

  const bundle = await bundleFor(resolution.resolved);

  const filesToWrite: Record<string, string> = {
    ...bundle.files
  };

  // Add individual section Liquid files
  for (const sec of resolution.resolved) {
    filesToWrite[`sections/${sec.id}.liquid`] = sec.source;
  }

  // 3. Build the Shopify JSON Page Template (Shopify Online Store 2.0 standard)
  const templateSections: Record<string, any> = {};
  const order: string[] = [];

  const roleMap: Record<string, string> = {
    "cf-hero-editorial": "hero",
    "cf-bundle-builder": "bundle",
    "cf-before-after-slider": "proof",
    "cf-comparison-matrix": "matrix",
    "cf-ugc-review-wall": "ugc",
    "cf-sticky-atc": "sticky",
  };

  resolution.resolved.forEach((sec, idx) => {
    const key = `section_${idx + 1}_${sec.id.replace(/[^a-zA-Z0-9_]/g, "_")}`;
    const seed = seedFor(sec.source);

    const mergedSettings: Record<string, any> = { ...(seed.settings || {}) };
    let mergedBlocks = { ...(seed.blocks || {}) };
    let mergedBlockOrder = [...(seed.block_order || [])];

    const role = roleMap[sec.id] || sec.id;
    const overrides = (lp.contentOverrides as any)?.[role] || (lp.contentOverrides as any)?.[sec.id];

    if (overrides && typeof overrides === "object") {
      for (const [k, v] of Object.entries(overrides)) {
        if (v !== undefined && v !== null && typeof v !== "object") {
          const snakeKey = k.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
          const snakeKeyWithNum = k.replace(/([A-Z]|\d+)/g, "_$1").toLowerCase().replace(/^_/, "");
          mergedSettings[k] = v;
          mergedSettings[snakeKey] = v;
          mergedSettings[snakeKeyWithNum] = v;
        }
      }

      const customItems = (overrides as any).steps || (overrides as any).cards || (overrides as any).rows;
      if (Array.isArray(customItems) && customItems.length > 0) {
        mergedBlocks = {};
        mergedBlockOrder = [];
        customItems.forEach((item: any, bIdx: number) => {
          const blockId = `block_${idx + 1}_${bIdx + 1}`;
          const blockSettings: Record<string, any> = {};
          for (const [bk, bv] of Object.entries(item)) {
            const bSnake = bk.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            blockSettings[bk] = bv;
            blockSettings[bSnake] = bv;
          }
          let blockType = "step";
          if (role === "ugc") blockType = "review";
          else if (role === "matrix") blockType = "row";
          else if (role === "bundle") blockType = "step";

          mergedBlocks[blockId] = {
            type: blockType,
            settings: blockSettings,
          };
          mergedBlockOrder.push(blockId);
        });
      }
    }

    templateSections[key] = {
      type: sec.id,
      settings: mergedSettings,
      ...(Object.keys(mergedBlocks).length ? { blocks: mergedBlocks } : {}),
      ...(mergedBlockOrder.length ? { block_order: mergedBlockOrder } : {}),
    };
    order.push(key);
  });

  const templateJson = {
    name: lp.name,
    wrapper: "main#MainContent",
    sections: templateSections,
    order
  };

  const suffix = lp.id.replace("landing-", "");
  const templateKey = `templates/page.${suffix}.json`;
  filesToWrite[templateKey] = JSON.stringify(templateJson, null, 2);

  // 4. Batched upload all Liquid, snippets, assets & the template JSON to the Shopify theme
  await upsertThemeFilesBatched(shop, themeId, filesToWrite);

  // 5. Generate direct links to Shopify theme editor & preview
  const shopSubdomain = (shop.shopDomain || "").replace(".myshopify.com", "");
  const editorUrl = options.isDraftTheme
    ? `https://admin.shopify.com/store/${shopSubdomain}/themes/${themeId}/editor?template=page.${suffix}`
    : `https://${shop.shopDomain}/admin/themes/current/editor?template=page.${suffix}`;

  const draftPreviewUrl = options.isDraftTheme
    ? previewUrl(shop.shopDomain, themeId, `/pages/${suffix}`)
    : undefined;

  return {
    landingPageId,
    templateKey,
    templateName: lp.name,
    filesWritten: Object.keys(filesToWrite).length,
    sectionCount: order.length,
    themeId,
    editorUrl,
    previewUrl: draftPreviewUrl,
  };
}
