import fs from 'fs/promises';
import path from 'path';

/**
 * Injects a Niche Bundle into the currently active Shopify theme.
 * Takes a backup of the existing index.json before overwriting.
 */
export async function injectNicheBundle(admin, session, nicheName) {
  try {
    console.log(`Starting injection for bundle: ${nicheName}`);
    
    // 1. Find the active theme
    // Since duplicating themes via API is extremely slow and rate-limited (requires downloading/uploading 1000+ files),
    // we inject into the active theme but take backups of key templates like index.json.
    const themesResponse = await admin.rest.resources.Theme.all({ session });
    const activeTheme = themesResponse.data.find(theme => theme.role === 'main');
    
    if (!activeTheme) {
      throw new Error('No active theme found.');
    }

    const themeId = activeTheme.id;
    console.log(`Active theme ID: ${themeId}`);

    // 2. Read all files from the requested bundle
    const bundleDir = path.resolve(process.cwd(), 'app', 'data', 'bundles', nicheName);
    
    async function getFiles(dir) {
      const dirents = await fs.readdir(dir, { withFileTypes: true });
      const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
      }));
      return Array.prototype.concat(...files);
    }

    let allFiles = [];
    try {
      allFiles = await getFiles(bundleDir);
    } catch (err) {
      throw new Error(`Bundle "${nicheName}" not found or empty.`);
    }

    // 3. Backup existing key templates before modifying
    const templatesToBackup = ['templates/index.json', 'templates/product.json'];
    for (const key of templatesToBackup) {
      try {
        const existingAsset = await admin.rest.resources.Asset.all({
          session,
          theme_id: themeId,
          asset: { key }
        });
        
        if (existingAsset.data && existingAsset.data.length > 0) {
          const assetObj = existingAsset.data[0];
          const backupKey = key.replace('.json', '.convertkit_backup.json');
          
          const backupAsset = new admin.rest.resources.Asset({ session });
          backupAsset.theme_id = themeId;
          backupAsset.key = backupKey;
          backupAsset.value = assetObj.value;
          await backupAsset.save({ update: true });
          console.log(`Backed up ${key} to ${backupKey}`);
        }
      } catch (e) {
        // Asset might not exist or other error, proceed
        console.warn(`Could not backup ${key}`, e.message);
      }
    }

    // 4. Upload bundle files
    for (const filePath of allFiles) {
      // Normalize path to relative Shopify asset key (e.g. "templates/index.json")
      const relativePath = path.relative(bundleDir, filePath).replace(/\\/g, '/');
      const fileContent = await fs.readFile(filePath, 'utf-8');

      const asset = new admin.rest.resources.Asset({ session });
      asset.theme_id = themeId;
      asset.key = relativePath;
      asset.value = fileContent;
      await asset.save({ update: true });
      console.log(`Uploaded ${relativePath} to theme ${themeId}`);
    }

    return { success: true, themeId: themeId, message: "Bundle applied successfully!" };
  } catch (error) {
    console.error('Error injecting bundle:', error);
    throw error;
  }
}
