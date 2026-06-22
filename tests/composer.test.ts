import { describe, it, expect, vi, beforeEach } from 'vitest';
import { composeThemeFromBlueprint } from '../app/services/theme-engine/composer.server';
import { ValidationError } from '../app/services/theme-engine/validators.server';
import * as fs from 'fs/promises';
import * as path from 'path';

vi.mock('fs/promises', () => {
  return {
    default: {
      readdir: vi.fn(),
      readFile: vi.fn(),
      stat: vi.fn()
    },
    readdir: vi.fn(),
    readFile: vi.fn(),
    stat: vi.fn()
  };
});

// Mock the cache and upload services to avoid making real calls
vi.mock('../app/services/theme-engine/asset-cache.server', () => {
  return {
    uploadAssetWithCache: vi.fn().mockResolvedValue(true)
  };
});

describe('Theme Composer Merging and Validation (Phase 2)', () => {
  const mockShop = { shopDomain: 'test.myshopify.com', accessToken: 'mock-token' };
  const mockThemeId = '12345';
  
  const mockBlueprint = {
    pages: {
      index: {
        sections: [
          { componentId: 'jewellery-hero-banner', settings: {} },
          { componentId: 'jewellery-featured-collection', settings: {} }
        ]
      }
    },
    settings: {
      color_bg: '#ffffff'
    }
  };

  const mockRegistry = [
    {
      id: '1',
      componentId: 'jewellery-hero-banner',
      category: 'hero',
      niche: 'jewellery',
      sectionType: 'hero-banner',
      liquidPath: 'app/data/templates/theme-engine/niches/jewellery/sections/hero-banner.liquid',
      filePath: 'app/data/templates/theme-engine/niches/jewellery/sections/hero-banner.liquid',
      industryTags: [],
      styleTags: [],
      searchKeywords: [],
      croScore: 90,
      mobileScore: 90,
      version: '1.0.0',
      status: 'PUBLISHED',
      isUniversal: false,
      performanceScore: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      componentId: 'jewellery-featured-collection',
      category: 'featured-collection',
      niche: 'jewellery',
      sectionType: 'featured-collection',
      liquidPath: 'app/data/templates/theme-engine/niches/jewellery/sections/featured-collection.liquid',
      filePath: 'app/data/templates/theme-engine/niches/jewellery/sections/featured-collection.liquid',
      industryTags: [],
      styleTags: [],
      searchKeywords: [],
      croScore: 90,
      mobileScore: 90,
      version: '1.0.0',
      status: 'PUBLISHED',
      isUniversal: false,
      performanceScore: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully compose and merge core and niche folders when all files are valid', async () => {
    // Setup directory structure mocks
    vi.mocked(fs.readdir).mockImplementation(async (dirPath: any) => {
      const dirStr = String(dirPath);
      if (dirStr.includes('core')) {
        return [
          { name: 'layout', isDirectory: () => true },
          { name: 'config', isDirectory: () => true },
          { name: 'locales', isDirectory: () => true },
          { name: 'assets', isDirectory: () => true }
        ] as any;
      }
      if (dirStr.endsWith('layout')) {
        return [
          { name: 'theme.liquid', isDirectory: () => false },
          { name: 'password.liquid', isDirectory: () => false }
        ] as any;
      }
      if (dirStr.endsWith('config')) {
        return [
          { name: 'settings_schema.json', isDirectory: () => false },
          { name: 'settings_data.json', isDirectory: () => false }
        ] as any;
      }
      if (dirStr.endsWith('locales')) {
        return [
          { name: 'en.default.json', isDirectory: () => false }
        ] as any;
      }
      if (dirStr.endsWith('assets')) {
        return [
          { name: 'cart.js', isDirectory: () => false },
          { name: 'variant-swap.js', isDirectory: () => false },
          { name: 'theme.js', isDirectory: () => false }
        ] as any;
      }
      if (dirStr.includes('niches')) {
        return [
          { name: 'assets', isDirectory: () => true }
        ] as any;
      }
      return [];
    });

    vi.mocked(fs.stat).mockImplementation(async () => {
      return { isDirectory: () => true } as any;
    });

    vi.mocked(fs.readFile).mockImplementation(async (filePath: any) => {
      const fileStr = String(filePath);
      if (fileStr.includes('theme.liquid')) return '<html>{{ content_for_header }}{{ content_for_layout }}</html>';
      if (fileStr.includes('password.liquid')) return 'password page';
      if (fileStr.includes('settings_schema.json')) return '[]';
      if (fileStr.includes('settings_data.json')) return '{}';
      if (fileStr.includes('en.default.json')) return '{}';
      if (fileStr.includes('niche-tokens.css')) return ':root { --color-primary: #123456; }';
      if (fileStr.includes('hero-banner.liquid')) return 'hero liquid';
      if (fileStr.includes('featured-collection.liquid')) return 'featured collection liquid';
      return 'generic js or css content';
    });

    const result = await composeThemeFromBlueprint(mockShop, mockThemeId, mockBlueprint, mockRegistry, 'jewellery');

    expect(result).toBeDefined();
    expect(result.templates['templates/index.json']).toBeDefined();
    expect(result.settingsPatch).toEqual(mockBlueprint.settings);
  });

  it('should throw ValidationError if a required core file is missing', async () => {
    vi.mocked(fs.readdir).mockImplementation(async (dirPath: any) => {
      const dirStr = String(dirPath);
      if (dirStr.includes('core')) {
        return [{ name: 'layout', isDirectory: () => true }] as any;
      }
      if (dirStr.endsWith('layout')) {
        // theme.liquid is missing!
        return [{ name: 'password.liquid', isDirectory: () => false }] as any;
      }
      return [];
    });

    vi.mocked(fs.stat).mockImplementation(async () => {
      return { isDirectory: () => true } as any;
    });

    vi.mocked(fs.readFile).mockResolvedValue('content');

    await expect(
      composeThemeFromBlueprint(mockShop, mockThemeId, mockBlueprint, mockRegistry, 'jewellery')
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError if niche-tokens.css is empty in niche mode', async () => {
    vi.mocked(fs.readdir).mockImplementation(async (dirPath: any) => {
      const dirStr = String(dirPath);
      if (dirStr.includes('core') || dirStr.includes('niches')) {
        return [
          { name: 'layout', isDirectory: () => true },
          { name: 'config', isDirectory: () => true },
          { name: 'locales', isDirectory: () => true },
          { name: 'assets', isDirectory: () => true }
        ] as any;
      }
      if (dirStr.endsWith('layout')) {
        return [
          { name: 'theme.liquid', isDirectory: () => false },
          { name: 'password.liquid', isDirectory: () => false }
        ] as any;
      }
      if (dirStr.endsWith('config')) {
        return [
          { name: 'settings_schema.json', isDirectory: () => false },
          { name: 'settings_data.json', isDirectory: () => false }
        ] as any;
      }
      if (dirStr.endsWith('locales')) {
        return [{ name: 'en.default.json', isDirectory: () => false }] as any;
      }
      if (dirStr.endsWith('assets')) {
        return [
          { name: 'cart.js', isDirectory: () => false },
          { name: 'variant-swap.js', isDirectory: () => false },
          { name: 'theme.js', isDirectory: () => false },
          { name: 'niche-tokens.css', isDirectory: () => false }
        ] as any;
      }
      return [];
    });

    vi.mocked(fs.stat).mockImplementation(async () => {
      return { isDirectory: () => true } as any;
    });

    vi.mocked(fs.readFile).mockImplementation(async (filePath: any) => {
      const fileStr = String(filePath);
      if (fileStr.includes('niche-tokens.css')) {
        return '   '; // only whitespace
      }
      return 'some file content';
    });

    await expect(
      composeThemeFromBlueprint(mockShop, mockThemeId, mockBlueprint, mockRegistry, 'jewellery')
    ).rejects.toThrow(/niche tokens stylesheet is empty/i);
  });

  it('should skip niche-tokens.css validation and empty validation in ai-custom mode', async () => {
    vi.mocked(fs.readdir).mockImplementation(async (dirPath: any) => {
      const dirStr = String(dirPath);
      if (dirStr.includes('core')) {
        return [
          { name: 'layout', isDirectory: () => true },
          { name: 'config', isDirectory: () => true },
          { name: 'locales', isDirectory: () => true },
          { name: 'assets', isDirectory: () => true }
        ] as any;
      }
      if (dirStr.endsWith('layout')) {
        return [
          { name: 'theme.liquid', isDirectory: () => false },
          { name: 'password.liquid', isDirectory: () => false }
        ] as any;
      }
      if (dirStr.endsWith('config')) {
        return [
          { name: 'settings_schema.json', isDirectory: () => false },
          { name: 'settings_data.json', isDirectory: () => false }
        ] as any;
      }
      if (dirStr.endsWith('locales')) {
        return [{ name: 'en.default.json', isDirectory: () => false }] as any;
      }
      if (dirStr.endsWith('assets')) {
        // niche-tokens.css is missing in core assets!
        return [
          { name: 'cart.js', isDirectory: () => false },
          { name: 'variant-swap.js', isDirectory: () => false },
          { name: 'theme.js', isDirectory: () => false }
        ] as any;
      }
      return [];
    });

    vi.mocked(fs.stat).mockImplementation(async () => {
      return { isDirectory: () => true } as any;
    });

    vi.mocked(fs.readFile).mockImplementation(async (filePath: any) => {
      const fileStr = String(filePath);
      if (fileStr.includes('hero-banner.liquid')) return 'hero liquid';
      if (fileStr.includes('featured-collection.liquid')) return 'featured collection liquid';
      return 'generic core content';
    });

    // Run in ai-custom mode
    const result = await composeThemeFromBlueprint(mockShop, mockThemeId, mockBlueprint, mockRegistry, 'ai-custom');

    expect(result).toBeDefined();
    // It should have injected the default fallback token content
    expect(result.templates['templates/index.json']).toBeDefined();
  });
});
