import { describe, it, expect } from 'vitest';
import { ResourceResolver, ResourceExistsChecker } from '../../app/services/theme-engine/compiler/resource-resolver';
import { ResolvedDependencies } from '../../app/services/theme-engine/compiler/dependency-resolver';

// Helper to mock resolved dependencies
const mockDeps = (overrides: any = {}): ResolvedDependencies => ({
  flat: {
    sections: [],
    snippets: [],
    assets: [],
    css: [],
    javascript: [],
    locales: [],
    settings: [],
    fonts: [],
    ...overrides
  },
  graph: {}
});

describe('Stage 4: Resource Resolver', () => {
  it('should categorize CSS, JS, fonts, SVG, and images correctly', async () => {
    const deps = mockDeps({
      css: ['main.css', 'hero.css'],
      javascript: ['app.js'],
      fonts: ['inter.woff2'],
      assets: ['icon.svg', 'bg.jpg', 'logo.png']
    });

    const mockExists: ResourceExistsChecker = async () => true;
    const resolver = new ResourceResolver(mockExists);
    const result = await resolver.resolve(deps);

    expect(result.css.required).toEqual(['hero.css', 'main.css']); // sorted
    expect(result.js.required).toEqual(['app.js']);
    expect(result.fonts.required).toEqual(['inter.woff2']);
    expect(result.svg.required).toEqual(['icon.svg']);
    expect(result.images.required).toEqual(['bg.jpg', 'logo.png']); // sorted
  });

  it('should track duplicates but still require them', async () => {
    const deps = mockDeps({
      css: ['main.css', 'main.css', 'hero.css']
    });

    const mockExists: ResourceExistsChecker = async () => true;
    const resolver = new ResourceResolver(mockExists);
    const result = await resolver.resolve(deps);

    expect(result.css.required).toEqual(['hero.css', 'main.css']);
    expect(result.css.duplicates).toEqual(['main.css']);
  });

  it('should throw an error if any required resource is missing', async () => {
    const deps = mockDeps({
      css: ['exists.css', 'missing.css']
    });

    const mockExists: ResourceExistsChecker = async (path) => path === 'exists.css';
    const resolver = new ResourceResolver(mockExists);
    
    await expect(resolver.resolve(deps)).rejects.toThrow(/Missing required resources: \nmissing.css/);
  });
});
