import { CONVERTFLOW_SECTIONS, type SectionDefinition } from "./registry";

export interface ThemeInfo {
  id: string | number;
  name: string;
  role: string;
}

export interface InstallResult {
  success: boolean;
  sectionId: string;
  filename: string;
  themeId: string | number;
  themeName: string;
  editorUrl: string;
  message: string;
  error?: string;
}

/**
 * Retrieves the currently active published theme on the merchant's store.
 */
export async function getActiveTheme(admin: any, session: any): Promise<ThemeInfo | null> {
  try {
    // Attempt REST Theme.all first
    if (admin.rest?.resources?.Theme) {
      const themesResponse = await admin.rest.resources.Theme.all({ session });
      const themesList = themesResponse?.data || [];
      const mainTheme = themesList.find((t: any) => t.role === "main") || themesList[0];
      if (mainTheme) {
        return {
          id: mainTheme.id,
          name: mainTheme.name || "Active Theme",
          role: mainTheme.role || "main",
        };
      }
    }

    // GraphQL fallback
    const gqlRes = await admin.graphql(
      `#graphql
      query getActiveThemes {
        themes(first: 5, roles: [MAIN]) {
          nodes {
            id
            name
            role
          }
        }
      }`
    );
    const json = await gqlRes.json();
    const node = json.data?.themes?.nodes?.[0];
    if (node) {
      const numericId = node.id.split("/").pop();
      return {
        id: numericId || node.id,
        name: node.name,
        role: node.role,
      };
    }
  } catch (err: any) {
    console.error("[ConvertFlow] Failed to fetch active theme:", err);
  }
  return null;
}

/**
 * Checks which ConvertFlow sections are currently installed in the active theme.
 */
export async function checkInstalledSections(
  admin: any,
  session: any,
  themeId: string | number
): Promise<Record<string, boolean>> {
  const installedMap: Record<string, boolean> = {};

  try {
    if (admin.rest?.resources?.Asset) {
      // Query assets in the theme
      const assetsResponse = await admin.rest.resources.Asset.all({
        session,
        theme_id: themeId,
      });
      const assetKeys: string[] = (assetsResponse?.data || []).map((a: any) => a.key || "");

      for (const section of CONVERTFLOW_SECTIONS) {
        const expectedKey = `sections/${section.filename}`;
        installedMap[section.id] = assetKeys.includes(expectedKey);
      }
      return installedMap;
    }
  } catch (err: any) {
    console.warn("[ConvertFlow] Error checking installed assets, defaulting to uninstalled:", err?.message);
  }

  // If asset listing is restricted, mark as unknown/false
  for (const section of CONVERTFLOW_SECTIONS) {
    installedMap[section.id] = false;
  }
  return installedMap;
}

/**
 * Installs or updates a ConvertFlow section in the store's active theme.
 */
export async function installSectionToTheme(
  admin: any,
  session: any,
  sectionId: string
): Promise<InstallResult> {
  const section = CONVERTFLOW_SECTIONS.find((s) => s.id === sectionId);
  if (!section) {
    throw new Error(`Section with ID '${sectionId}' not found in ConvertFlow registry.`);
  }

  const activeTheme = await getActiveTheme(admin, session);
  if (!activeTheme) {
    throw new Error("Unable to locate active published theme on this Shopify store.");
  }

  const themeId = activeTheme.id;
  const assetKey = `sections/${section.filename}`;

  try {
    // Upload via Shopify REST Asset API
    const asset = new admin.rest.resources.Asset({ session });
    asset.theme_id = themeId;
    asset.key = assetKey;
    asset.value = section.liquidContent;
    await asset.save({ update: true });

    const editorUrl = `https://${session.shop}/admin/themes/${themeId}/editor`;

    return {
      success: true,
      sectionId: section.id,
      filename: section.filename,
      themeId,
      themeName: activeTheme.name,
      editorUrl,
      message: `Successfully installed '${section.title}' into ${activeTheme.name}!`,
    };
  } catch (error: any) {
    console.error(`[ConvertFlow] Failed to install section ${section.filename}:`, error);

    // Fallback attempt with direct REST PUT request if model helper has edge cases
    try {
      const response = await admin.rest.put({
        path: `themes/${themeId}/assets.json`,
        data: {
          asset: {
            key: assetKey,
            value: section.liquidContent,
          },
        },
      });

      if (response) {
        const editorUrl = `https://${session.shop}/admin/themes/${themeId}/editor`;
        return {
          success: true,
          sectionId: section.id,
          filename: section.filename,
          themeId,
          themeName: activeTheme.name,
          editorUrl,
          message: `Successfully installed '${section.title}' into ${activeTheme.name}!`,
        };
      }
    } catch (fallbackError: any) {
      return {
        success: false,
        sectionId: section.id,
        filename: section.filename,
        themeId,
        themeName: activeTheme.name,
        editorUrl: `https://${session.shop}/admin/themes/${themeId}/editor`,
        message: `Installation failed: ${fallbackError.message || error.message}`,
        error: fallbackError.message || error.message,
      };
    }

    return {
      success: false,
      sectionId: section.id,
      filename: section.filename,
      themeId,
      themeName: activeTheme.name,
      editorUrl: `https://${session.shop}/admin/themes/${themeId}/editor`,
      message: `Installation failed: ${error.message}`,
      error: error.message,
    };
  }
}
