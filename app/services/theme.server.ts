// app/services/theme.server.ts

/**
 * Gets all assets for a given theme.
 */
export async function getThemeAssets(admin: any, themeId: string) {
  const response = await admin.graphql(`
    query($id: ID!) {
      theme(id: $id) {
        files(first: 250) {
          nodes {
            filename
          }
        }
      }
    }
  `, {
    variables: { id: themeId.startsWith("gid://") ? themeId : `gid://shopify/Theme/${themeId}` }
  });
  const data = await response.json();
  return data?.data?.theme?.files?.nodes || [];
}

/**
 * Uploads a single asset (liquid, json, css, js) to the theme.
 */
export async function uploadAsset(admin: any, themeId: string, asset: { key: string; value: string }) {
  const response = await admin.graphql(`
    mutation themeFilesUpsert($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
      themeFilesUpsert(themeId: $themeId, files: $files) {
        upsertedThemeFiles {
          filename
        }
        userErrors {
          message
        }
      }
    }
  `, {
    variables: {
      themeId: themeId.startsWith("gid://") ? themeId : `gid://shopify/Theme/${themeId}`,
      files: [{ filename: asset.key, body: { type: "TEXT", value: asset.value } }]
    }
  });
  const data = await response.json();
  if (data?.data?.themeFilesUpsert?.userErrors?.length > 0) {
    throw new Error(data.data.themeFilesUpsert.userErrors.map((e: any) => e.message).join(", "));
  }
  return data?.data?.themeFilesUpsert?.upsertedThemeFiles?.[0];
}

/**
 * Duplicates the merchant's live theme as a backup.
 */
export async function backupTheme(admin: any, currentThemeId: string, backupName: string) {
  const response = await admin.graphql(`
    mutation ThemeDuplicate($id: ID!, $name: String!) {
      themeDuplicate(id: $id, name: $name) {
        newTheme {
          id
          name
          role
        }
        userErrors {
          message
        }
      }
    }
  `, {
    variables: {
      id: currentThemeId.startsWith("gid://") ? currentThemeId : `gid://shopify/Theme/${currentThemeId}`,
      name: backupName
    }
  });
  
  const data = await response.json();
  if (data?.data?.themeDuplicate?.userErrors?.length > 0) {
    throw new Error(data.data.themeDuplicate.userErrors.map((e: any) => e.message).join(", "));
  }
  
  return data?.data?.themeDuplicate?.newTheme;
}

/**
 * Restores a backed up theme by setting its role to 'main'.
 */
export async function restoreTheme(admin: any, backupThemeId: string) {
  const response = await admin.graphql(`
    mutation ThemeUpdate($id: ID!, $role: ThemeRole!) {
      themeUpdate(id: $id, role: $role) {
        theme {
          id
          role
        }
        userErrors {
          message
        }
      }
    }
  `, {
    variables: {
      id: backupThemeId.startsWith("gid://") ? backupThemeId : `gid://shopify/Theme/${backupThemeId}`,
      role: "MAIN"
    }
  });
  const data = await response.json();
  if (data?.data?.themeUpdate?.userErrors?.length > 0) {
    throw new Error(data.data.themeUpdate.userErrors.map((e: any) => e.message).join(", "));
  }
  return data?.data?.themeUpdate?.theme;
}

/**
 * Get active theme
 */
export async function getActiveTheme(admin: any) {
  const response = await admin.graphql(`
    query {
      themes(first: 50, roles: [MAIN]) {
        nodes {
          id
          name
          role
        }
      }
    }
  `);
  const data = await response.json();
  return data?.data?.themes?.nodes?.[0];
}
