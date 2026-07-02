import * as fs from 'fs/promises';
import * as path from 'path';
import crypto from 'crypto';

export interface PackagingInput {
  bundle: any;          // From BuildOptimizer (contains sections, snippets, assets)
  templates: any[];     // From TemplateAssemblyEngine
  layout: any;          // From LayoutAssemblyEngine
  sectionGroups: any[]; // From SectionGroupBuilder
}

export interface PackagedTheme {
  rootDir: string;
  totalFiles: number;
  sizeBytes: number;
  packageHash: string;
}

export class ThemePackagingEngine {
  async packageTheme(input: PackagingInput, outDir: string = './artifacts/CompiledTheme'): Promise<PackagedTheme> {
    // 1. Clean and prepare physical directories
    await fs.rm(outDir, { recursive: true, force: true });
    const dirs = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
    for (const dir of dirs) {
      await fs.mkdir(path.join(outDir, dir), { recursive: true });
    }

    let fileCount = 0;
    let totalSize = 0;
    const hashSum = crypto.createHash('sha256');

    // Helper to write file, track stats, and update hash
    const writeFile = async (shopifyPath: string, content: string) => {
      const fullPath = path.join(outDir, shopifyPath);
      await fs.writeFile(fullPath, content, 'utf-8');
      
      const size = Buffer.byteLength(content, 'utf8');
      fileCount++;
      totalSize += size;
      hashSum.update(shopifyPath + content);
    };

    // 2. Write Layout
    await writeFile(input.layout.shopifyPath, input.layout.content);

    // 3. Write Templates
    for (const tpl of input.templates) {
      await writeFile(tpl.shopifyPath, tpl.contentRaw || JSON.stringify(tpl.content, null, 2));
    }

    // 4. Write Section Groups (Header/Footer)
    for (const group of input.sectionGroups) {
      const contentStr = typeof group.content === 'object' ? JSON.stringify(group.content, null, 2) : group.content;
      await writeFile(group.shopifyPath, contentStr);
    }

    // 5. Write Bundle Assets (Sections, Snippets, Locales, Config, JS/CSS)
    const writeArray = async (items: any[]) => {
      for (const item of items) {
        if (item && item.shopifyPath && item.content) {
          await writeFile(item.shopifyPath, item.content);
        }
      }
    };

    await writeArray(input.bundle.sections || []);
    await writeArray(input.bundle.snippets || []);
    await writeArray(input.bundle.assets || []);
    await writeArray(input.bundle.locales || []);
    await writeArray(input.bundle.config || []);

    return {
      rootDir: outDir,
      totalFiles: fileCount,
      sizeBytes: totalSize,
      packageHash: hashSum.digest('hex')
    };
  }
}
