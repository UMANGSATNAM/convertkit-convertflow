import { describe, it, expect, vi, beforeEach } from 'vitest';
import { composeThemeFromBlueprint } from '../app/services/theme-engine/compiler.server';
import { ValidationError } from '../app/services/theme-engine/validators.server';
import * as fs from 'fs/promises';
import * as path from 'path';

function getDirName(dirPath: any): string {
  const normalized = String(dirPath).replace(/\\/g, '/');
  const parts = normalized.split('/');
  return parts[parts.length - 1];
}

// Mock Redis to prevent real connection attempts during tests
vi.mock('../app/services/redis.server', () => {
  let lockMap = new Map();
  return {
    redis: {
      set: vi.fn(async (key, value, px, expiry, nx) => {
        if (lockMap.has(key)) return null;
        lockMap.set(key, value);
        return "OK";
      }),
      eval: vi.fn(async (script, numKeys, key, value) => {
        if (lockMap.get(key) === value) {
          lockMap.delete(key);
          return 1;
        }
        return 0;
      })
    }
  };
});


// Mock validators.server to break the transitive dependency on theme-engine/index.ts and Redis.
vi.mock('../app/services/theme-engine/validators.server', () => {
  class ValidationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "ValidationError";
    }
  }
  return {
    ValidationError,
    validateSettingsPatch: vi.fn(),
    validateTemplateStructure: vi.fn(),
    validateSectionDependencies: vi.fn(),
    assertNoOrphanSectionRefs: vi.fn(),
    validateProductTemplateBlocks: vi.fn(),
    validateCollectionTemplate: vi.fn(),
    assertNoForbiddenFilters: vi.fn(),
    runStage3Gates: vi.fn().mockReturnValue({})
  };
});

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

// Mock db.server (prisma) to avoid real DB calls for registry cache freshness check
vi.mock('../app/db.server', () => {
  const path = require('path');
  const fs = require('fs');
  const crypto = require('crypto');
  return {
    default: {
      registryMeta: {
        findUnique: vi.fn(async ({ where }: any) => {
          if (where.id === 'singleton') {
            const registryPath = path.join(process.cwd(), 'app/data/templates/theme-engine/registry.json');
            try {
              const content = fs.readFileSync(registryPath, 'utf-8');
              return { id: 'singleton', registryHash: crypto.createHash('sha256').update(content).digest('hex') };
            } catch {
              return null;
            }
          }
          return null;
        })
      },
      componentRegistry: {
        findUnique: vi.fn(async ({ where }: any) => {
          if (where.componentId === 'registry-metadata-hash') {
            const registryPath = path.join(process.cwd(), 'app/data/templates/theme-engine/registry.json');
            try {
              const content = fs.readFileSync(registryPath, 'utf-8');
              return { componentId: 'registry-metadata-hash', version: crypto.createHash('sha256').update(content).digest('hex') };
            } catch {
              return null;
            }
          }
          return null;
        }),
        findMany: vi.fn(async () => Array(57).fill({ status: 'PUBLISHED', componentId: 'mock' }))
      }
    }
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
      family: "", metaPath: "", archetypes: [], visualStyle: "", compatibleSlots: [], industryTags: [],
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
      family: "", metaPath: "", archetypes: [], visualStyle: "", compatibleSlots: [], industryTags: [],
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
      const dirName = getDirName(dirPath);
      if (dirName === 'core' || dirName === 'base-theme') {
        return [
          { name: 'layout', isDirectory: () => true },
          { name: 'config', isDirectory: () => true },
          { name: 'locales', isDirectory: () => true },
          { name: 'assets', isDirectory: () => true }
        ] as any;
      }
      if (dirName === 'layout') {
        return [
          { name: 'theme.liquid', isDirectory: () => false },
          { name: 'password.liquid', isDirectory: () => false }
        ] as any;
      }
      if (dirName === 'config') {
        return [
          { name: 'settings_schema.json', isDirectory: () => false },
          { name: 'settings_data.json', isDirectory: () => false }
        ] as any;
      }
      if (dirName === 'locales') {
        return [
          { name: 'en.default.json', isDirectory: () => false }
        ] as any;
      }
      if (dirName === 'assets') {
        return [
          { name: 'cart.js', isDirectory: () => false },
          { name: 'variant-swap.js', isDirectory: () => false },
          { name: 'theme.js', isDirectory: () => false }
        ] as any;
      }
      if (dirName === 'niches') {
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
      if (fileStr.includes('chassis-manifest.json')) {
        return JSON.stringify({
          files: [
            "base-theme/layout/theme.liquid",
            "base-theme/layout/password.liquid",
            "base-theme/config/settings_schema.json",
            "base-theme/config/settings_data.json",
            "base-theme/locales/en.default.json",
            "base-theme/assets/cart.js",
            "base-theme/assets/variant-swap.js",
            "base-theme/assets/theme.js"
          ]
        });
      }
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
  }, 15000);

  it('should throw ValidationError if a required core file is missing', async () => {
    vi.mocked(fs.readdir).mockImplementation(async (dirPath: any) => {
      const dirName = getDirName(dirPath);
      if (dirName === 'core' || dirName === 'base-theme') {
        return [{ name: 'layout', isDirectory: () => true }] as any;
      }
      if (dirName === 'layout') {
        // theme.liquid is missing!
        return [{ name: 'password.liquid', isDirectory: () => false }] as any;
      }
      return [];
    });

    vi.mocked(fs.stat).mockImplementation(async () => {
      return { isDirectory: () => true } as any;
    });

    vi.mocked(fs.readFile).mockImplementation(async (filePath: any) => {
      const fileStr = String(filePath);
      if (fileStr.includes('chassis-manifest.json')) {
        return JSON.stringify({
          files: [
            "base-theme/layout/password.liquid",
            "base-theme/config/settings_schema.json",
            "base-theme/config/settings_data.json",
            "base-theme/locales/en.default.json",
            "base-theme/assets/cart.js"
          ]
        });
      }
      return 'content';
    });

    await expect(
      composeThemeFromBlueprint(mockShop, mockThemeId, mockBlueprint, mockRegistry, 'jewellery')
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError if niche-tokens.css is empty in niche mode', async () => {
    vi.mocked(fs.readdir).mockImplementation(async (dirPath: any) => {
      const dirName = getDirName(dirPath);
      if (dirName === 'core' || dirName === 'base-theme' || dirName === 'niches') {
        return [
          { name: 'layout', isDirectory: () => true },
          { name: 'config', isDirectory: () => true },
          { name: 'locales', isDirectory: () => true },
          { name: 'assets', isDirectory: () => true }
        ] as any;
      }
      if (dirName === 'layout') {
        return [
          { name: 'theme.liquid', isDirectory: () => false },
          { name: 'password.liquid', isDirectory: () => false }
        ] as any;
      }
      if (dirName === 'config') {
        return [
          { name: 'settings_schema.json', isDirectory: () => false },
          { name: 'settings_data.json', isDirectory: () => false }
        ] as any;
      }
      if (dirName === 'locales') {
        return [{ name: 'en.default.json', isDirectory: () => false }] as any;
      }
      if (dirName === 'assets') {
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
      if (fileStr.includes('chassis-manifest.json')) {
        return JSON.stringify({
          files: [
            "base-theme/layout/theme.liquid",
            "base-theme/layout/password.liquid",
            "base-theme/config/settings_schema.json",
            "base-theme/config/settings_data.json",
            "base-theme/locales/en.default.json",
            "base-theme/assets/niche-tokens.css"
          ]
        });
      }
      if (fileStr.includes('niche-tokens.css')) {
        return '   '; // only whitespace
      }
      return 'some file content';
    });

    const emptyBlueprint = {
      ...mockBlueprint,
      settings: {
        __empty_tokens: true
      }
    };

    await expect(
      composeThemeFromBlueprint(mockShop, mockThemeId, emptyBlueprint, mockRegistry, 'jewellery')
    ).rejects.toThrow(/niche tokens stylesheet is empty/i);
  }, 15000);

  it('should skip niche-tokens.css validation and empty validation in ai-custom mode', async () => {
    vi.mocked(fs.readdir).mockImplementation(async (dirPath: any) => {
      const dirName = getDirName(dirPath);
      if (dirName === 'core' || dirName === 'base-theme') {
        return [
          { name: 'layout', isDirectory: () => true },
          { name: 'config', isDirectory: () => true },
          { name: 'locales', isDirectory: () => true },
          { name: 'assets', isDirectory: () => true }
        ] as any;
      }
      if (dirName === 'layout') {
        return [
          { name: 'theme.liquid', isDirectory: () => false },
          { name: 'password.liquid', isDirectory: () => false }
        ] as any;
      }
      if (dirName === 'config') {
        return [
          { name: 'settings_schema.json', isDirectory: () => false },
          { name: 'settings_data.json', isDirectory: () => false }
        ] as any;
      }
      if (dirName === 'locales') {
        return [{ name: 'en.default.json', isDirectory: () => false }] as any;
      }
      if (dirName === 'assets') {
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
      if (fileStr.includes('chassis-manifest.json')) {
        return JSON.stringify({
          files: [
            "base-theme/layout/theme.liquid",
            "base-theme/layout/password.liquid",
            "base-theme/config/settings_schema.json",
            "base-theme/config/settings_data.json",
            "base-theme/locales/en.default.json"
          ]
        });
      }
      if (fileStr.includes('hero-banner.liquid')) return 'hero liquid';
      if (fileStr.includes('featured-collection.liquid')) return 'featured collection liquid';
      return 'generic core content';
    });

    // Run in ai-custom mode
    const result = await composeThemeFromBlueprint(mockShop, mockThemeId, mockBlueprint, mockRegistry, 'ai-custom');

    expect(result).toBeDefined();
    // It should have injected the default fallback token content
    expect(result.templates['templates/index.json']).toBeDefined();
  }, 15000);
});
