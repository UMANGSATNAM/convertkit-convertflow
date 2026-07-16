import { describe, it, expect } from 'vitest';
import { generateTemplates } from '../../app/services/theme-engine/template-generator';
import { StoreBlueprintData } from '../../app/services/theme-engine/compiler.server';
import { ComponentRegistry } from '@prisma/client';

describe('Decision #15: Section Naming & Template Type Collision Prevention', () => {
  it('must produce distinct section files and distinct template type values when two components share the same sectionType', async () => {
    // Two components that both belong to sectionType: "product-grid"
    const mockLookbookComp: ComponentRegistry = {
      id: '1',
      componentId: 'grid-featured-lookbook-v1',
      version: '1',
      status: 'approved',
      category: 'product-grid',
      visualStyle: 'lookbook',
      name: 'Featured Lookbook',
      filePath: 'components/product-grid/grid-featured-lookbook-v1.liquid',
      metaPath: 'components/product-grid/grid-featured-lookbook-v1.meta.json',
      schemaMap: null,
      tokensMap: null,
      archetypes: ['luxury'],
      compatibleSlots: [],
      nicheId: 'beauty',
      createdAt: new Date(),
      updatedAt: new Date(),
      sectionType: 'product-grid',
      designDirection: 'luxury',
      layoutVariant: 'lookbook'
    };

    const mockJewelleryGridComp: ComponentRegistry = {
      id: '2',
      componentId: 'grid-jewellery-showcase-v1',
      version: '1',
      status: 'approved',
      category: 'product-grid',
      visualStyle: 'luxury',
      name: 'Jewellery Showcase Grid',
      filePath: 'components/product-grid/grid-jewellery-showcase-v1.liquid',
      metaPath: 'components/product-grid/grid-jewellery-showcase-v1.meta.json',
      schemaMap: null,
      tokensMap: null,
      archetypes: ['luxury'],
      compatibleSlots: [],
      nicheId: 'beauty',
      createdAt: new Date(),
      updatedAt: new Date(),
      sectionType: 'product-grid',
      designDirection: 'luxury',
      layoutVariant: 'luxury'
    };

    const blueprint: StoreBlueprintData = {
      version: '1.0',
      storeName: 'Test Store',
      globalComponents: [],
      pages: {
        index: {
          sections: [
            { componentId: 'grid-featured-lookbook-v1' },
            { componentId: 'grid-jewellery-showcase-v1' }
          ]
        }
      }
    };

    const filesToUpload: Record<string, string> = {
      'templates/index.json': JSON.stringify({
        sections: {},
        order: []
      })
    };

    const usedComponents = await generateTemplates(blueprint, filesToUpload, [
      mockLookbookComp,
      mockJewelleryGridComp
    ]);

    expect(usedComponents).toHaveLength(2);

    const updatedIndexJson = JSON.parse(filesToUpload['templates/index.json']);
    const sections = updatedIndexJson.sections;

    const lookbookSection = sections['grid-featured-lookbook-v1-1'];
    const jewellerySection = sections['grid-jewellery-showcase-v1-1'];

    expect(lookbookSection).toBeDefined();
    expect(jewellerySection).toBeDefined();

    // Enforce Decision #15: Template section "type" = always componentId, NEVER sectionType
    expect(lookbookSection.type).toBe('grid-featured-lookbook-v1');
    expect(lookbookSection.type).not.toBe('product-grid');

    expect(jewellerySection.type).toBe('grid-jewellery-showcase-v1');
    expect(jewellerySection.type).not.toBe('product-grid');

    // Verify both have distinct template type values even though both share sectionType = "product-grid"
    expect(lookbookSection.type).not.toEqual(jewellerySection.type);
  });
});
