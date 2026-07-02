import { describe, it, expect } from 'vitest';
import { resolveComponents } from '../../app/services/theme-engine/compiler/component-resolver';
import { StoreBlueprintData } from '../../app/services/theme-engine/compiler.server';

describe('Stage 2: Component Resolver', () => {
  it('should extract a unique list of component IDs from global and page sections', async () => {
    const blueprint: StoreBlueprintData = {
      globalComponents: ['header-luxury-v1', 'footer-luxury-v1', 'cart-drawer-v1'],
      pages: {
        index: {
          sections: [
            { componentId: 'hero-storytelling-v2' },
            { componentId: 'featured-collection-v1' },
            { componentId: 'hero-storytelling-v2' } // Duplicate on purpose
          ]
        },
        product: {
          sections: [
            { componentId: 'product-main-v1' },
            { componentId: 'featured-collection-v1' } // Duplicate from index
          ]
        }
      },
      settings: {}
    };

    const result = await resolveComponents(blueprint);
    
    expect(result.componentIds).toHaveLength(6);
    expect(result.componentIds).toContain('header-luxury-v1');
    expect(result.componentIds).toContain('footer-luxury-v1');
    expect(result.componentIds).toContain('cart-drawer-v1');
    expect(result.componentIds).toContain('hero-storytelling-v2');
    expect(result.componentIds).toContain('featured-collection-v1');
    expect(result.componentIds).toContain('product-main-v1');
  });

  it('should handle blueprints with missing globalComponents safely', async () => {
    const blueprint: StoreBlueprintData = {
      pages: {
        index: {
          sections: [
            { componentId: 'hero-storytelling-v2' }
          ]
        }
      },
      settings: {}
    };

    const result = await resolveComponents(blueprint);
    expect(result.componentIds).toEqual(['hero-storytelling-v2']);
  });
});
