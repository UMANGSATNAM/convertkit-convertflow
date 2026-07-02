import * as fs from 'fs';
import * as path from 'path';
import { globSync } from 'glob';

interface ComponentEntry {
  componentId: string;
  liquidPath?: string;
  filePath?: string;
  metaPath?: string;
}

interface Registry {
  version: string;
  components: ComponentEntry[];
}

export function verifyRegistry(baseDir: string = process.cwd()): { success: boolean; errors: string[]; stats: { totalComponents: number; totalLiquidFiles: number } } {
  const errors: string[] = [];
  const themeEngineDir = path.join(baseDir, 'app/data/templates/theme-engine');
  const registryPath = path.join(themeEngineDir, 'registry.json');

  if (!fs.existsSync(registryPath)) {
    return { success: false, errors: [`Registry file not found at ${registryPath}`], stats: { totalComponents: 0, totalLiquidFiles: 0 } };
  }

  let registry: Registry;
  try {
    const content = fs.readFileSync(registryPath, 'utf-8');
    registry = JSON.parse(content);
  } catch (e: any) {
    return { success: false, errors: [`Failed to parse registry.json: ${e.message}`], stats: { totalComponents: 0, totalLiquidFiles: 0 } };
  }

  const registeredPaths = new Set<string>();

  // 1. Assert every registry path exists on disk
  for (const comp of registry.components) {
    const relLiquid = comp.liquidPath || comp.filePath;
    if (!relLiquid) {
      errors.push(`Component ${comp.componentId} lacks liquidPath or filePath.`);
      continue;
    }

    const normLiquid = relLiquid.replace(/\\/g, '/');
    registeredPaths.add(normLiquid);

    const fullLiquid = path.join(themeEngineDir, normLiquid);
    if (!fs.existsSync(fullLiquid)) {
      errors.push(`Component ${comp.componentId} references missing liquid file: ${normLiquid}`);
    }

    if (comp.metaPath) {
      const normMeta = comp.metaPath.replace(/\\/g, '/');
      const fullMeta = path.join(themeEngineDir, normMeta);
      if (!fs.existsSync(fullMeta)) {
        errors.push(`Component ${comp.componentId} references missing meta file: ${normMeta}`);
      }
    }
  }

  // 2. Assert every .liquid file in components/ is referenced by exactly one registry entry
  const componentsDir = path.join(themeEngineDir, 'components');
  let totalLiquidFiles = 0;
  if (fs.existsSync(componentsDir)) {
    const diskFiles = globSync('**/*.liquid', { cwd: componentsDir }).map(f => `components/${f.replace(/\\/g, '/')}`);
    totalLiquidFiles = diskFiles.length;

    for (const diskFile of diskFiles) {
      if (!registeredPaths.has(diskFile)) {
        errors.push(`Unreferenced liquid file on disk: ${diskFile}`);
      }
    }
  }

  // Optional: check chassis-manifest.json if exists
  const chassisManifestPath = path.join(themeEngineDir, 'base-theme/chassis-manifest.json');
  if (fs.existsSync(chassisManifestPath)) {
    try {
      const chassisManifest = JSON.parse(fs.readFileSync(chassisManifestPath, 'utf-8'));
      const allowedPaths = new Set<string>((chassisManifest.files || []).map((f: string) => f.replace(/\\/g, '/')));
      const baseThemeDir = path.join(themeEngineDir, 'base-theme');
      const chassisFiles = globSync('**/*.liquid', { cwd: baseThemeDir }).map(f => f.replace(/\\/g, '/'));
      for (const cf of chassisFiles) {
        if (!allowedPaths.has(cf)) {
          errors.push(`Unmanifested chassis file in base-theme: ${cf}`);
        }
      }
    } catch (e: any) {
      errors.push(`Failed to process chassis-manifest.json: ${e.message}`);
    }
  }

  return {
    success: errors.length === 0,
    errors,
    stats: {
      totalComponents: registry.components.length,
      totalLiquidFiles
    }
  };
}

import { fileURLToPath } from 'url';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  console.log('[VerifyRegistry] Starting registry verification...');
  const result = verifyRegistry();
  if (!result.success) {
    console.error('[VerifyRegistry] FAILED with errors:');
    result.errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  } else {
    console.log(`[VerifyRegistry] SUCCESS! Verified ${result.stats.totalComponents} components and ${result.stats.totalLiquidFiles} liquid files.`);
    process.exit(0);
  }
}

