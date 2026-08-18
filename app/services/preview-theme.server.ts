import { graphqlRequest } from "./shopify-api.server";

/**
 * Manages the unpublished theme used to preview sections.
 *
 * ## Why a separate theme
 *
 * A merchant needs to see a section rendered with their own products, fonts and
 * prices before they commit to it — a screenshot of someone else's store is what
 * makes an app feel like a template dump. But rendering it in their live theme
 * means every shopper sees the experiment.
 *
 * So sections are previewed in a duplicate of the live theme that is never
 * published. It is created once per shop and reused, because duplicating a theme
 * takes several seconds and doing it per preview would make browsing unusable.
 *
 * The preview URL is `?preview_theme_id=<id>`, which Shopify renders with real
 * store data.
 */

const PREVIEW_THEME_NAME = "ConvertFlow — Preview (do not publish)";

export interface PreviewTheme {
  id: string;
  name: string;
  /** True when this call created it rather than finding an existing one. */
  created: boolean;
}

function numericId(gid: string): string {
  return String(gid).split("/").pop() || String(gid);
}

async function listThemes(shop: any) {
  const res = await graphqlRequest(
    shop.shopDomain,
    shop.accessToken,
    `query { themes(first: 50) { nodes { id name role } } }`
  );
  return res?.themes?.nodes || [];
}

/**
 * Returns the shop's preview theme, creating it from the live theme if needed.
 *
 * Duplicating the *live* theme rather than starting from a blank one matters:
 * the preview then carries the merchant's real settings, fonts and colours, so
 * a section is judged in the context it will actually live in.
 */
export async function ensurePreviewTheme(shop: any): Promise<PreviewTheme> {
  const themes = await listThemes(shop);

  const existing = themes.find((t: any) => t.name === PREVIEW_THEME_NAME);
  if (existing) {
    return { id: numericId(existing.id), name: existing.name, created: false };
  }

  const live = themes.find((t: any) => t.role === "MAIN" || t.role === "main");
  if (!live) {
    throw new Error("This store has no published theme to preview against.");
  }

  const res = await graphqlRequest(
    shop.shopDomain,
    shop.accessToken,
    `
    mutation themeDuplicate($id: ID!, $name: String!) {
      themeDuplicate(id: $id, name: $name) {
        newTheme { id name }
        userErrors { field message }
      }
    }
    `,
    { id: live.id, name: PREVIEW_THEME_NAME }
  );

  const errs = res?.themeDuplicate?.userErrors || [];
  if (errs.length) {
    throw new Error(`Could not create the preview theme: ${errs.map((e: any) => e.message).join("; ")}`);
  }

  const created = res?.themeDuplicate?.newTheme;
  if (!created?.id) throw new Error("Shopify returned no theme when duplicating.");

  return { id: numericId(created.id), name: created.name, created: true };
}

/**
 * The URL to put in the preview iframe.
 *
 * `template` selects which page to render, so a header can be judged on the
 * homepage and a collection layout on a real collection.
 */
export function previewUrl(
  shopDomain: string,
  themeId: string,
  page: string = "/"
): string {
  const url = new URL(page, `https://${shopDomain}`);
  url.searchParams.set("preview_theme_id", themeId);
  return url.toString();
}

/**
 * Renders a single section's HTML via Shopify's Section Rendering API.
 *
 * Cheaper than loading a whole page in an iframe, so this is what a browse grid
 * should use. The section must already exist in the theme and be present on the
 * page named by `page`.
 */
export function sectionRenderUrl(
  shopDomain: string,
  themeId: string,
  sectionKey: string,
  page: string = "/"
): string {
  const url = new URL(page, `https://${shopDomain}`);
  url.searchParams.set("preview_theme_id", themeId);
  url.searchParams.set("section_id", sectionKey);
  return url.toString();
}

/**
 * Deletes the preview theme.
 *
 * Offered so a merchant is not left with a stray unpublished theme in their
 * admin after they stop using the section browser.
 */
export async function deletePreviewTheme(shop: any): Promise<boolean> {
  const themes = await listThemes(shop);
  const preview = themes.find((t: any) => t.name === PREVIEW_THEME_NAME);
  if (!preview) return false;

  const res = await graphqlRequest(
    shop.shopDomain,
    shop.accessToken,
    `
    mutation themeDelete($id: ID!) {
      themeDelete(id: $id) { deletedThemeId userErrors { field message } }
    }
    `,
    { id: preview.id }
  );

  const errs = res?.themeDelete?.userErrors || [];
  if (errs.length) {
    console.warn(`[PreviewTheme] Delete failed: ${errs.map((e: any) => e.message).join("; ")}`);
    return false;
  }
  return true;
}
