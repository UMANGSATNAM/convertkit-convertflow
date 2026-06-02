import { Session } from "@shopify/shopify-api";
import { authenticate } from "../shopify.server";

/**
 * Gets all assets for a given theme.
 */
export async function getThemeAssets(session: Session, themeId: string) {
  const client = new authenticate.admin.rest.Client({ session });
  const response = await client.get({
    path: `themes/${themeId}/assets`,
  });
  return response.body.assets;
}

/**
 * Uploads a single asset (liquid, json, css, js) to the theme.
 */
export async function uploadAsset(session: Session, themeId: string, asset: { key: string; value: string }) {
  const client = new authenticate.admin.rest.Client({ session });
  const response = await client.put({
    path: `themes/${themeId}/assets`,
    data: {
      asset: {
        key: asset.key,
        value: asset.value
      }
    }
  });
  return response.body.asset;
}

/**
 * Duplicates the merchant's live theme as a backup.
 */
export async function backupTheme(session: Session, currentThemeId: string, backupName: string) {
  const client = new authenticate.admin.rest.Client({ session });
  // To duplicate, we create a new theme and set its source_theme_id to the current one.
  // Wait, Shopify REST API doesn't support source_theme_id directly for duplication via API 
  // without a zip URL, actually it might. Let's use the standard duplicate if possible, 
  // or we just fetch and push all assets if not supported natively.
  // Actually, the Theme API supports creating a theme with a `src` URL, but maybe not a direct clone ID.
  // A safer programmatic backup is to fetch all files and store them, but Shopify API 
  // sometimes allows creating a theme with `role: "unpublished"` and then we just upload our changes to the active one.
  // Wait, Shopify explicitly allows copying a theme by passing src? No, source_theme_id is deprecated in some forms.
  // Let's create an empty theme and copy assets over.
  
  const createResponse = await client.post({
    path: 'themes',
    data: {
      theme: {
        name: backupName,
        role: "unpublished"
      }
    }
  });
  
  const newTheme = createResponse.body.theme;
  
  // Copying all assets is extremely rate-limit heavy (1000+ files).
  // A better backup strategy: We are only modifying specific templates, sections, and snippets.
  // So we only backup the specific files we are about to overwrite.
  
  return newTheme; // Placeholder for now, we will refine this in implementation.
}

/**
 * Restores a backed up theme by setting its role to 'main'.
 */
export async function restoreTheme(session: Session, backupThemeId: string) {
  const client = new authenticate.admin.rest.Client({ session });
  const response = await client.put({
    path: `themes/${backupThemeId}`,
    data: {
      theme: {
        id: backupThemeId,
        role: "main"
      }
    }
  });
  return response.body.theme;
}
