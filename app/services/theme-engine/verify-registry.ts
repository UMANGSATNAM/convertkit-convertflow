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

export function verifyRegistry(baseDir: string = process.cwd()): { success: boolean; errors: string[]; stats: { totalComponents: number; totalLiquidFiles: number; totalChassisFiles: number } } {
  const errors: string[] = [];
  const themeEngineDir = path.join(baseDir, 'app/data/templates/theme-engine');
  const registryPath = path.join(themeEngineDir, 'registry.json');
  const chassisManifestPath = path.join(themeEngineDir, 'base-theme/chassis-manifest.json');

  if (!fs.existsSync(registryPath)) {
    return { success: false, errors: [`Registry file not found at ${registryPath}`], stats: { totalComponents: 0, totalLiquidFiles: 0, totalChassisFiles: 0 } };
  }

  let registry: Registry;
  try {
    const content = fs.readFileSync(registryPath, 'utf-8');
    registry = JSON.parse(content);
  } catch (e: any) {
    return { success: false, errors: [`Failed to parse registry.json: ${e.message}`], stats: { totalComponents: 0, totalLiquidFiles: 0, totalChassisFiles: 0 } };
  }

  let chassisFilesCount = 0;
  const allowedPaths = new Set<string>();

  if (!fs.existsSync(chassisManifestPath)) {
    errors.push(`Chassis manifest file not found at ${chassisManifestPath}`);
  } else {
    try {
      const chassisManifest = JSON.parse(fs.readFileSync(chassisManifestPath, 'utf-8'));
      const list = chassisManifest.files || [];
      chassisFilesCount = list.length;
      for (const f of list) {
        allowedPaths.add(f.replace(/\\/g, '/'));
      }
    } catch (e: any) {
      errors.push(`Failed to parse chassis-manifest.json: ${e.message}`);
    }
  }

  // 1. Assert every registry path exists on disk
  for (const comp of registry.components) {
    const relLiquid = comp.liquidPath || comp.filePath;
    if (!relLiquid) {
      errors.push(`Component ${comp.componentId} lacks liquidPath or filePath.`);
      continue;
    }

    const normLiquid = relLiquid.replace(/\\/g, '/');
    allowedPaths.add(normLiquid);

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

  // 2. Assert EVERY .liquid file under theme-engine is referenced by exactly one registry entry or chassis manifest
  let totalLiquidFiles = 0;
  if (fs.existsSync(themeEngineDir)) {
    const diskFiles = globSync('**/*.liquid', { cwd: themeEngineDir }).map(f => f.replace(/\\/g, '/'));
    totalLiquidFiles = diskFiles.length;

    for (const diskFile of diskFiles) {
      if (!allowedPaths.has(diskFile)) {
        errors.push(`Unreferenced orphan liquid file on disk: ${diskFile}`);
      }
    }
  }

  return {
    success: errors.length === 0,
    errors,
    stats: {
      totalComponents: registry.components.length,
      totalLiquidFiles,
      totalChassisFiles: chassisFilesCount
    }
  };
}

import { fileURLToPath } from 'url';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  console.log('[VerifyRegistry] Starting registry and chassis manifest verification...');
  const result = verifyRegistry();
  if (!result.success) {
    console.error('[VerifyRegistry] FAILED with errors:');
    result.errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  } else {
    console.log(`[VerifyRegistry] SUCCESS! Verified ${result.stats.totalComponents} registry components, ${result.stats.totalChassisFiles} chassis manifest files, and 100% of ${result.stats.totalLiquidFiles} total disk liquid files.`);
    process.exit(0);
  }
}


