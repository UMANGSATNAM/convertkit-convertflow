import * as fs from 'fs';
import * as path from 'path';
import { globSync } from 'glob';
import * as crypto from 'crypto';

interface ComponentEntry {
  componentId: string;
  liquidPath?: string;
  filePath?: string;
  metaPath?: string;
  type?: string;
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
  let compatibilityData: Record<string, any> = {};
  let performanceData: Record<string, any> = {};
  try {
    const content = fs.readFileSync(registryPath, 'utf-8');
    registry = JSON.parse(content);
    const compPath = path.join(themeEngineDir, 'compatibility.json');
    const perfPath = path.join(themeEngineDir, 'performance.json');
    if (fs.existsSync(compPath)) compatibilityData = JSON.parse(fs.readFileSync(compPath, 'utf-8'));
    if (fs.existsSync(perfPath)) performanceData = JSON.parse(fs.readFileSync(perfPath, 'utf-8'));
  } catch (e: any) {
    return { success: false, errors: [`Failed to parse registry or data json: ${e.message}`], stats: { totalComponents: 0, totalLiquidFiles: 0, totalChassisFiles: 0 } };
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
      for (const item of list) {
        const f = typeof item === 'string' ? item : item.file;
        allowedPaths.add(f.replace(/\\/g, '/'));
        
        // Hash verification
        if (typeof item === 'object' && item.hash) {
          const fullPath = path.join(themeEngineDir, f);
          if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const normalizedContent = content.replace(/\r\n/g, '\n');
            const hash = crypto.createHash('sha256').update(normalizedContent).digest('hex');
            if (hash !== item.hash) {
              errors.push(`Hash mismatch for chassis file: ${f}. Expected ${item.hash}, got ${hash}`);
            }
          }
        }
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

    // Assert every component has a valid category type reachable by blueprint vocabulary
    const category = comp.type;
    const VALID_CATEGORIES = new Set([
      'custom', 'page', 'contact', 'blog', 'product-page', 'collection-page', 'cart-drawer', 'ugc',
      "header", "footer", "hero", "announcement", "product-grid",
      "collection", "trust", "testimonials", "faq", "newsletter",
      "brand-story", "popup", "bundle-builder"
    ]);
    if (!category || !VALID_CATEGORIES.has(category)) {
      errors.push(
        `Component "${comp.componentId}" has missing/invalid category type: "${category ?? "undefined"}"`
      );
    }

    // Assert sectionType rules for normal sections vs layout components
    const sectionType = comp.sectionType || comp.componentId;
    if (comp.type === 'header' || comp.type === 'footer') {
      if (sectionType === 'header' || sectionType === 'footer') {
        errors.push(`Component "${comp.componentId}" has illegal sectionType "${sectionType}". It cannot exactly match fallback layout types (header/footer).`);
      }
    } else {
      if (sectionType === comp.componentId) {
        errors.push(`Component "${comp.componentId}" has illegal sectionType "${sectionType}". Must be canonical section type from blueprint vocabulary ("${comp.type}"), never a component ID.`);
      }
      if (sectionType !== comp.type) {
        errors.push(`Component "${comp.componentId}" has sectionType "${sectionType}" mismatching its canonical type "${comp.type}".`);
      }
    }

    // Assert designDirection is exactly one of the 5 canonical values
    const VALID_DESIGN_DIRECTIONS = new Set(['luxury', 'minimal', 'bold', 'editorial', 'playful', 'tech', 'natural']);
    const designDir = (comp as any).designDirection;
    if (!designDir || !VALID_DESIGN_DIRECTIONS.has(designDir)) {
      errors.push(`Component "${comp.componentId}" has invalid or missing designDirection: "${designDir}". Must be one of: luxury, minimal, bold, editorial, playful.`);
    }

    // Assert mandatory performance.json and compatibility.json entries (Bug 2 Fix)
    if (!performanceData[comp.componentId]) {
      errors.push(`Component "${comp.componentId}" is missing mandatory entry in performance.json.`);
    }
    if (!compatibilityData[comp.componentId]) {
      errors.push(`Component "${comp.componentId}" is missing mandatory entry in compatibility.json.`);
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

  // 3. Assert EVERY file inside base-theme/ (except chassis-manifest.json) is tracked in chassis-manifest.json
  const baseThemeDirOnDisk = path.join(themeEngineDir, 'base-theme');
  if (fs.existsSync(baseThemeDirOnDisk)) {
    const allChassisFilesOnDisk = globSync('**/*', { cwd: baseThemeDirOnDisk, nodir: true }).map(f => `base-theme/${f.replace(/\\/g, '/')}`);
    for (const fileOnDisk of allChassisFilesOnDisk) {
      if (fileOnDisk === 'base-theme/chassis-manifest.json') continue;
      if (!allowedPaths.has(fileOnDisk)) {
        errors.push(`Untracked chassis file on disk: ${fileOnDisk}`);
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


