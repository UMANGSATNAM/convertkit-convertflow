import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { composeThemeFromBlueprint } from '../../app/services/theme-engine/compiler.server';
import { ValidationError } from '../../app/services/theme-engine/validators.server';

// Mock Shopify upload cache to avoid network calls
vi.mock('../../app/services/theme-engine/asset-cache.server', () => {
  return {
    uploadAssetWithCache: vi.fn().mockResolvedValue(true)
  };
});

describe('Stage 2.1: Hardened Layout Swapping & Generic Orphan Checker', () => {
  const sandboxDir = path.join(process.cwd(), 'tmp', 'test-component-replacement');
  const themeEngineDir = path.join(sandboxDir, 'app/data/templates/theme-engine');
  const mockShop = { shopDomain: 'test.myshopify.com', accessToken: 'mock-token' };
  const mockThemeId = '99999';

  const mockRegistry = [
    {
      componentId: 'header-luxury-v1',
      category: 'header',
      sectionType: 'header-luxury-v1',
      liquidPath: 'components/header/header-luxury-v1.liquid',
      filePath: 'components/header/header-luxury-v1.liquid'
    },
    {
      componentId: 'header-bold-v1',
      category: 'header',
      sectionType: 'header-bold-v1',
      liquidPath: 'components/header/header-bold-v1.liquid',
      filePath: 'components/header/header-bold-v1.liquid'
    },
    {
      componentId: 'footer-luxury-v1',
      category: 'footer',
      sectionType: 'footer-luxury-v1',
      liquidPath: 'components/footer/footer-luxury-v1.liquid',
      filePath: 'components/footer/footer-luxury-v1.liquid'
    }
  ] as any[];

  beforeEach(async () => {
    process.env.MOCK_SHOPIFY = 'true';

    // Setup a clean sandboxed theme-engine directory
    if (existsSync(sandboxDir)) {
      await fs.rm(sandboxDir, { recursive: true, force: true });
    }
    await fs.mkdir(sandboxDir, { recursive: true });

    // Create base-theme directories under nested theme-engine path
    const baseThemeDir = path.join(themeEngineDir, 'base-theme');
    await fs.mkdir(baseThemeDir, { recursive: true });
    await fs.mkdir(path.join(baseThemeDir, 'layout'), { recursive: true });
    await fs.mkdir(path.join(baseThemeDir, 'sections'), { recursive: true });
    await fs.mkdir(path.join(baseThemeDir, 'config'), { recursive: true });
    await fs.mkdir(path.join(baseThemeDir, 'locales'), { recursive: true });
    await fs.mkdir(path.join(baseThemeDir, 'assets'), { recursive: true });

    // Write minimal chassis files on disk
    const themeContent = '<html>{{ content_for_header }}</html>';
    const fallbackHeaderContent = '<header>fallback header</header>';
    const fallbackFooterContent = '<footer>fallback footer</footer>';
    const headerGroupContent = JSON.stringify({
      name: "Header",
      type: "header",
      sections: { header: { type: "header", settings: {} } },
      order: ["header"]
    }, null, 2);
    const footerGroupContent = JSON.stringify({
      name: "Footer",
      type: "footer",
      sections: { footer: { type: "footer", settings: {} } },
      order: ["footer"]
    }, null, 2);

    await fs.writeFile(path.join(baseThemeDir, 'layout/theme.liquid'), themeContent, 'utf-8');
    await fs.writeFile(path.join(baseThemeDir, 'sections/header.liquid'), fallbackHeaderContent, 'utf-8');
    await fs.writeFile(path.join(baseThemeDir, 'sections/footer.liquid'), fallbackFooterContent, 'utf-8');
    await fs.writeFile(path.join(baseThemeDir, 'sections/header-group.json'), headerGroupContent, 'utf-8');
    await fs.writeFile(path.join(baseThemeDir, 'sections/footer-group.json'), footerGroupContent, 'utf-8');
    await fs.writeFile(path.join(baseThemeDir, 'config/settings_schema.json'), '[]', 'utf-8');
    await fs.writeFile(path.join(baseThemeDir, 'config/settings_data.json'), '{}', 'utf-8');
    await fs.writeFile(path.join(baseThemeDir, 'locales/en.default.json'), '{}', 'utf-8');
    await fs.writeFile(path.join(baseThemeDir, 'assets/niche-tokens.css'), '/* tokens */', 'utf-8');

    // Create manifest of the 9 files
    const manifestFiles = [
      'base-theme/layout/theme.liquid',
      'base-theme/sections/header.liquid',
      'base-theme/sections/footer.liquid',
      'base-theme/sections/header-group.json',
      'base-theme/sections/footer-group.json',
      'base-theme/config/settings_schema.json',
      'base-theme/config/settings_data.json',
      'base-theme/locales/en.default.json',
      'base-theme/assets/niche-tokens.css'
    ];

    const manifest: any = {
      version: '1.0.0',
      files: []
    };

    for (const file of manifestFiles) {
      const p = path.join(themeEngineDir, file);
      const c = await fs.readFile(p, 'utf-8');
      const hash = crypto.createHash('sha256').update(c.replace(/\r\n/g, '\n')).digest('hex');
      manifest.files.push({ file, hash });
    }

    await fs.writeFile(path.join(baseThemeDir, 'chassis-manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');

    // Setup custom headers and footers mock directories under nested theme-engine path
    await fs.mkdir(path.join(themeEngineDir, 'components/header'), { recursive: true });
    await fs.mkdir(path.join(themeEngineDir, 'components/footer'), { recursive: true });
    await fs.writeFile(path.join(themeEngineDir, 'components/header/header-luxury-v1.liquid'), '<header>luxury header</header>', 'utf-8');
    await fs.writeFile(path.join(themeEngineDir, 'components/header/header-bold-v1.liquid'), '<header>bold header</header>', 'utf-8');
    await fs.writeFile(path.join(themeEngineDir, 'components/footer/footer-luxury-v1.liquid'), '<footer>luxury footer</footer>', 'utf-8');

    // Mock process.cwd() to resolve paths correctly in our theme compiler server
    vi.spyOn(process, 'cwd').mockReturnValue(sandboxDir);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    delete process.env.MOCK_SHOPIFY;
    if (existsSync(sandboxDir)) {
      await fs.rm(sandboxDir, { recursive: true, force: true });
    }
  });

  it('Case A: custom component replacement swaps types, removes fallbacks, and keeps base-theme clean', async () => {
    const blueprint = {
      globalComponents: ['header-luxury-v1', 'footer-luxury-v1'],
      pages: {},
      settings: {}
    };

    const uploadMap: Record<string, string> = {};
    const { uploadAssetWithCache } = await import('../../app/services/theme-engine/asset-cache.server');
    vi.mocked(uploadAssetWithCache).mockImplementation(async (shop, themeId, key, content) => {
      uploadMap[key] = content;
      return true;
    });

    await composeThemeFromBlueprint(mockShop, mockThemeId, blueprint, mockRegistry, 'jewellery');

    // 1. Fallback files are ABSENT in output bundle
    expect(uploadMap['sections/header.liquid']).toBeUndefined();
    expect(uploadMap['sections/footer.liquid']).toBeUndefined();

    // 2. Custom liquid files are PRESENT in output bundle
    expect(uploadMap['sections/header-luxury-v1.liquid']).toBe('<header>luxury header</header>');
    expect(uploadMap['sections/footer-luxury-v1.liquid']).toBe('<footer>luxury footer</footer>');

    // 3. Group JSONs reference custom component type
    const headerGroup = JSON.parse(uploadMap['sections/header-group.json']);
    expect(headerGroup.sections.header.type).toBe('header-luxury-v1');

    const footerGroup = JSON.parse(uploadMap['sections/footer-group.json']);
    expect(footerGroup.sections.footer.type).toBe('footer-luxury-v1');

    // 4. Source base-theme remains completely untouched
    const originalHeader = await fs.readFile(path.join(themeEngineDir, 'base-theme/sections/header.liquid'), 'utf-8');
    expect(originalHeader).toBe('<header>fallback header</header>');

    const originalFooter = await fs.readFile(path.join(themeEngineDir, 'base-theme/sections/footer.liquid'), 'utf-8');
    expect(originalFooter).toBe('<footer>fallback footer</footer>');
  });

  it('Case B: fallback layout retention when blueprint does not specify custom components', async () => {
    const blueprint = {
      globalComponents: [],
      pages: {},
      settings: {}
    };

    const uploadMap: Record<string, string> = {};
    const { uploadAssetWithCache } = await import('../../app/services/theme-engine/asset-cache.server');
    vi.mocked(uploadAssetWithCache).mockImplementation(async (shop, themeId, key, content) => {
      uploadMap[key] = content;
      return true;
    });

    await composeThemeFromBlueprint(mockShop, mockThemeId, blueprint, mockRegistry, 'jewellery');

    // 1. Fallback files are PRESENT in output bundle
    expect(uploadMap['sections/header.liquid']).toBe('<header>fallback header</header>');
    expect(uploadMap['sections/footer.liquid']).toBe('<footer>fallback footer</footer>');

    // 2. Custom liquid files are ABSENT in output bundle
    expect(uploadMap['sections/header-luxury-v1.liquid']).toBeUndefined();
    expect(uploadMap['sections/footer-luxury-v1.liquid']).toBeUndefined();

    // 3. Group JSONs point to fallback types
    const headerGroup = JSON.parse(uploadMap['sections/header-group.json']);
    expect(headerGroup.sections.header.type).toBe('header');

    const footerGroup = JSON.parse(uploadMap['sections/footer-group.json']);
    expect(footerGroup.sections.footer.type).toBe('footer');
  });

  it('throws ValidationError when blueprint specifies two components for the same layout slot (multiple headers)', async () => {
    const blueprint = {
      globalComponents: ['header-luxury-v1', 'header-bold-v1'],
      pages: {},
      settings: {}
    };

    await expect(
      composeThemeFromBlueprint(mockShop, mockThemeId, blueprint, mockRegistry, 'jewellery')
    ).rejects.toThrow(ValidationError);

    await expect(
      composeThemeFromBlueprint(mockShop, mockThemeId, blueprint, mockRegistry, 'jewellery')
    ).rejects.toThrow(/multiple header components: "header-luxury-v1" and "header-bold-v1"/i);
  });

  it('throws ValidationError when blueprint specifies an unrecognized component ID', async () => {
    const blueprint = {
      globalComponents: ['header-unrecognized-v1'],
      pages: {},
      settings: {}
    };

    await expect(
      composeThemeFromBlueprint(mockShop, mockThemeId, blueprint, mockRegistry, 'jewellery')
    ).rejects.toThrow(ValidationError);

    await expect(
      composeThemeFromBlueprint(mockShop, mockThemeId, blueprint, mockRegistry, 'jewellery')
    ).rejects.toThrow(/Global component "header-unrecognized-v1" not found in registry/i);
  });

  it('Orphan Check: throws ValidationError if swapped section type liquid is missing from output bundle', async () => {
    const blueprint = {
      globalComponents: ['header-luxury-v1'],
      pages: {},
      settings: {}
    };

    // Overwrite the custom header liquid file with empty content so Step 5 loads it as falsy (not added to upload map)
    await fs.writeFile(path.join(themeEngineDir, 'components/header/header-luxury-v1.liquid'), '', 'utf-8');

    // Try composing, should throw ValidationError due to missing header-luxury-v1.liquid section file
    await expect(
      composeThemeFromBlueprint(mockShop, mockThemeId, blueprint, mockRegistry, 'jewellery')
    ).rejects.toThrow(ValidationError);

    await expect(
      composeThemeFromBlueprint(mockShop, mockThemeId, blueprint, mockRegistry, 'jewellery')
    ).rejects.toThrow(/references section type "header-luxury-v1" but "sections\/header-luxury-v1.liquid" is missing/i);
  });

  it('Orphan Check: @app block sections are exempted and pass validation', async () => {
    const blueprint = {
      globalComponents: [],
      pages: {},
      settings: {}
    };

    // Dynamically inject a custom header-group.json containing an app block reference ("@app")
    const headerGroupWithApp = JSON.stringify({
      name: "Header",
      type: "header",
      sections: {
        header: { type: "header", settings: {} },
        appSection: { type: "@app", settings: {} }
      },
      order: ["header", "appSection"]
    }, null, 2);

    // Overwrite the on-disk header-group.json to contain the app section reference
    const baseThemeDir = path.join(themeEngineDir, 'base-theme');
    await fs.writeFile(path.join(baseThemeDir, 'sections/header-group.json'), headerGroupWithApp, 'utf-8');

    // Recompute manifest hashes sync so cloneChassis won't throw ChassisTamperError
    const manifestFiles = [
      'base-theme/layout/theme.liquid',
      'base-theme/sections/header.liquid',
      'base-theme/sections/footer.liquid',
      'base-theme/sections/header-group.json',
      'base-theme/sections/footer-group.json',
      'base-theme/config/settings_schema.json',
      'base-theme/config/settings_data.json',
      'base-theme/locales/en.default.json',
      'base-theme/assets/niche-tokens.css'
    ];
    const manifest: any = { version: '1.0.0', files: [] };
    for (const file of manifestFiles) {
      const p = path.join(themeEngineDir, file);
      const c = await fs.readFile(p, 'utf-8');
      const hash = crypto.createHash('sha256').update(c.replace(/\r\n/g, '\n')).digest('hex');
      manifest.files.push({ file, hash });
    }
    await fs.writeFile(path.join(baseThemeDir, 'chassis-manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');

    // Should succeed because @app is exempted
    const uploadMap: Record<string, string> = {};
    const { uploadAssetWithCache } = await import('../../app/services/theme-engine/asset-cache.server');
    vi.mocked(uploadAssetWithCache).mockImplementation(async (shop, themeId, key, content) => {
      uploadMap[key] = content;
      return true;
    });

    await expect(
      composeThemeFromBlueprint(mockShop, mockThemeId, blueprint, mockRegistry, 'jewellery')
    ).resolves.toBeDefined();

    expect(uploadMap['sections/header.liquid']).toBe('<header>fallback header</header>');
  });
});
