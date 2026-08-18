import { ImageAssignmentService, type ClassifiedImage, type ImageRole } from "./image-assignment.server";
import { readSchema } from "./palette.server";

/**
 * Puts real photographs into the sections that have somewhere to put them.
 *
 * ## Why this exists
 *
 * The catalogue analyser already collects the merchant's product and lifestyle
 * images — a real run reported "imageUrls collected: 10" — and
 * `ImageAssignmentService` already knows how to classify them by role and pick
 * the best one for a slot. But nothing ever called it. The images were gathered,
 * analysed for brand colour, and then discarded.
 *
 * Every `image_picker` setting therefore stayed empty, and Shopify renders an
 * empty image picker as `placeholder_svg_tag` — the grey line drawings of a
 * handbag, a shoe and a pair of glasses. A beauty store shipped with sketches of
 * footwear on it. No amount of good copy or colour survives that.
 *
 * ## What it does
 *
 * For each section in each template, reads its `{% schema %}`, finds settings of
 * type `image_picker`, works out what kind of photograph belongs there from the
 * section's role, and writes the best available reference.
 *
 * The three-tier hierarchy is `ImageAssignmentService`'s: the merchant's own
 * catalogue first, then the niche placeholder pack, then nothing — and nothing
 * is deliberate. A section with no image falls back to its own typography-led
 * layout, which reads as a design choice. A section with a stock photo of the
 * wrong industry does not.
 */

/** Which kinds of photograph suit which section, most preferred first. */
const ROLE_INTENT: Record<string, ImageRole[]> = {
  hero: ["hero_lifestyle", "lookbook_editorial", "texture_ingredient"],
  "brand-story": ["lookbook_editorial", "hero_lifestyle", "texture_ingredient"],
  craftsmanship: ["texture_ingredient", "lookbook_editorial"],
  ugc: ["lookbook_editorial", "hero_lifestyle"],
  testimonials: ["portrait_avatar", "lookbook_editorial"],
  trust: ["texture_ingredient", "product_cutout"],
  "product-grid": ["product_cutout", "lookbook_editorial"],
  collection: ["lookbook_editorial", "hero_lifestyle"],
  "collection-page": ["hero_lifestyle", "lookbook_editorial"],
  "product-page": ["product_cutout", "lookbook_editorial"],
  newsletter: ["texture_ingredient", "hero_lifestyle"],
  popup: ["texture_ingredient", "product_cutout"],
  faq: ["texture_ingredient"],
  contact: ["hero_lifestyle"],
  blog: ["lookbook_editorial"],
  page: ["hero_lifestyle", "lookbook_editorial"],
};

/**
 * Settings that should be left alone even though they are image pickers.
 *
 * A logo is the merchant's mark, not a photograph — filling it with a product
 * shot puts a jar of moisturiser where the brand name belongs. Payment and
 * badge icons are the same kind of mistake.
 */
const SKIP_SETTING = /(logo|favicon|icon|badge|payment|flag|avatar_default|watermark)/i;

/** Mobile variants should echo their desktop counterpart, not fight it. */
const MOBILE_SETTING = /(mobile|_sm|_small)/i;

export interface ImageFillStats {
  filesTouched: number;
  sectionsTouched: number;
  imagesAssigned: number;
  slotsLeftEmpty: number;
  skipped: number;
}

function sectionRoleFor(sectionType: string, componentId: string): ImageRole[] {
  const direct = ROLE_INTENT[sectionType];
  if (direct) return direct;

  const id = componentId.toLowerCase();
  for (const [key, roles] of Object.entries(ROLE_INTENT)) {
    if (id.includes(key)) return roles;
  }
  return ["lookbook_editorial", "hero_lifestyle"];
}

/** Every `image_picker` setting in a schema, section-level and block-level. */
function collectImageFields(schema: any): Array<{ id: string; blockType?: string }> {
  const out: Array<{ id: string; blockType?: string }> = [];
  if (!schema || typeof schema !== "object") return out;

  const scan = (settings: any, blockType?: string) => {
    if (!Array.isArray(settings)) return;
    for (const s of settings) {
      if (s && typeof s === "object" && s.type === "image_picker" && s.id) {
        out.push({ id: String(s.id), blockType });
      }
    }
  };

  scan(schema.settings);
  if (Array.isArray(schema.blocks)) {
    for (const b of schema.blocks) if (b && typeof b === "object") scan(b.settings, b.type);
  }
  return out;
}

/**
 * Fills image slots across every template and section group in the bundle.
 *
 * `filesToUpload` is mutated. Must run after section Liquid is in the bundle,
 * because each section's schema is read from it.
 */
export function fillSectionImages(
  filesToUpload: Record<string, string>,
  classified: ClassifiedImage[],
  niche: string
): ImageFillStats {
  const stats: ImageFillStats = {
    filesTouched: 0,
    sectionsTouched: 0,
    imagesAssigned: 0,
    slotsLeftEmpty: 0,
    skipped: 0,
  };

  // Shared across the whole store so the same photograph does not appear in the
  // hero and again three sections later — the tell of an auto-built site.
  const usedUrls = new Set<string>();
  const schemaCache = new Map<string, Array<{ id: string; blockType?: string }> | null>();

  const fieldsFor = (sectionType: string) => {
    if (schemaCache.has(sectionType)) return schemaCache.get(sectionType)!;
    const source = filesToUpload[`sections/${sectionType}.liquid`];
    if (!source) {
      schemaCache.set(sectionType, null);
      return null;
    }
    const schema = readSchema(source);
    const fields = schema ? collectImageFields(schema) : [];
    const value = fields.length ? fields : null;
    schemaCache.set(sectionType, value);
    return value;
  };

  const jsonFiles = Object.keys(filesToUpload).filter(
    key =>
      (key.startsWith("templates/") && key.endsWith(".json")) ||
      (key.startsWith("sections/") && key.endsWith("-group.json"))
  );

  for (const key of jsonFiles) {
    let doc: any;
    try {
      doc = JSON.parse(filesToUpload[key]);
    } catch {
      continue;
    }
    if (!doc?.sections) continue;

    let fileChanged = false;

    for (const sectionKey of Object.keys(doc.sections)) {
      const entry = doc.sections[sectionKey];
      if (!entry || typeof entry !== "object" || !entry.type) continue;

      const fields = fieldsFor(String(entry.type));
      if (!fields) continue;

      const roles = sectionRoleFor(String(entry.sectionType || ""), String(entry.type));
      if (!entry.settings || typeof entry.settings !== "object") entry.settings = {};

      let assignedHere = 0;
      let lastAssigned = "";

      for (const field of fields) {
        if (field.blockType) continue; // block images are per-block content, not chrome

        if (SKIP_SETTING.test(field.id)) {
          stats.skipped++;
          continue;
        }

        // A merchant-set value always wins.
        if (entry.settings[field.id]) continue;

        if (MOBILE_SETTING.test(field.id) && lastAssigned) {
          entry.settings[field.id] = lastAssigned;
          assignedHere++;
          stats.imagesAssigned++;
          continue;
        }

        const ref = ImageAssignmentService.getBestMatchForRole(
          classified,
          roles,
          usedUrls,
          niche as any,
          `${key}:${sectionKey}:${field.id}`
        );

        if (ref) {
          entry.settings[field.id] = ref;
          lastAssigned = ref;
          assignedHere++;
          stats.imagesAssigned++;
        } else {
          stats.slotsLeftEmpty++;
        }
      }

      if (assignedHere > 0) {
        stats.sectionsTouched++;
        fileChanged = true;
      }
    }

    if (fileChanged) {
      filesToUpload[key] = JSON.stringify(doc, null, 2);
      stats.filesTouched++;
    }
  }

  return stats;
}
