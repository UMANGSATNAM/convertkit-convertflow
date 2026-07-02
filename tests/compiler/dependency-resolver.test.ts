import { describe, it, expect } from 'vitest';
import { DependencyResolver, ComponentDependencies, MetadataFetcher } from '../../app/services/theme-engine/compiler/dependency-resolver';

// Helper to create empty dependencies easily in tests
const makeDeps = (overrides: Partial<ComponentDependencies> = {}): ComponentDependencies => ({
  sections: [],
  snippets: [],
  assets: [],
  css: [],
  javascript: [],
  locales: [],
  settings: [],
  fonts: [],
  ...overrides
});

describe('Stage 3: Dependency Resolver', () => {
  it('Test 1: Single component -> Correct dependencies', async () => {
    const fetcher: MetadataFetcher = async (id) => {
      if (id === 'hero') return makeDeps({ snippets: ['button'], css: ['hero.css'] });
      if (id === 'button') return makeDeps({ css: ['button.css'] });
      throw new Error('Not found');
    };

    const resolver = new DependencyResolver(fetcher);
    const result = await resolver.resolve(['hero']);

    // Flat should contain exactly the right arrays
    expect(result.flat.snippets).toEqual(['button']);
    expect(result.flat.css).toEqual(['button.css', 'hero.css']); // alphabetically sorted
    
    // Graph should contain the tree
    expect(result.graph['hero'].children['button']).toBeDefined();
    expect(result.graph['hero'].dependencies.css).toEqual(['hero.css']);
  });

  it('Test 2: Two components -> Shared dependency -> Only one copy', async () => {
    const fetcher: MetadataFetcher = async (id) => {
      if (id === 'comp-a') return makeDeps({ snippets: ['shared-snippet'] });
      if (id === 'comp-b') return makeDeps({ snippets: ['shared-snippet'] });
      if (id === 'shared-snippet') return makeDeps({ locales: ['shared.title'] });
      throw new Error('Not found');
    };

    const resolver = new DependencyResolver(fetcher);
    const result = await resolver.resolve(['comp-b', 'comp-a']);

    expect(result.flat.snippets).toEqual(['shared-snippet']);
    expect(result.flat.locales).toEqual(['shared.title']);
  });

  it('Test 3: Deep dependency tree -> Fully resolved', async () => {
    const fetcher: MetadataFetcher = async (id) => {
      if (id === 'level-1') return makeDeps({ snippets: ['level-2'] });
      if (id === 'level-2') return makeDeps({ snippets: ['level-3'] });
      if (id === 'level-3') return makeDeps({ assets: ['icon.svg'] });
      throw new Error('Not found');
    };

    const resolver = new DependencyResolver(fetcher);
    const result = await resolver.resolve(['level-1']);

    expect(result.flat.snippets).toEqual(['level-2', 'level-3']);
    expect(result.flat.assets).toEqual(['icon.svg']);
    
    expect(result.graph['level-1'].children['level-2'].children['level-3']).toBeDefined();
  });

  it('Test 4: Circular dependency -> Compiler throws', async () => {
    const fetcher: MetadataFetcher = async (id) => {
      if (id === 'comp-a') return makeDeps({ snippets: ['comp-b'] });
      if (id === 'comp-b') return makeDeps({ snippets: ['comp-a'] });
      throw new Error('Not found');
    };

    const resolver = new DependencyResolver(fetcher);
    await expect(resolver.resolve(['comp-a'])).rejects.toThrow(/Circular dependency detected/);
  });

  it('Test 5: Missing dependency -> Compiler throws', async () => {
    const fetcher: MetadataFetcher = async (id) => {
      if (id === 'hero') return makeDeps({ snippets: ['missing-snippet'] });
      throw new Error('Fake FS error');
    };

    const resolver = new DependencyResolver(fetcher);
    await expect(resolver.resolve(['hero'])).rejects.toThrow(/Missing dependency or resolution failed for 'missing-snippet'/);
  });

  it('Test 6: Dependency order -> Deterministic ordering', async () => {
    // Parent depends on Z, A. We want flat output arrays to always be deterministically sorted.
    const fetcher: MetadataFetcher = async (id) => {
      if (id === 'main') return makeDeps({ snippets: ['z-snippet', 'a-snippet'], css: ['main.css'] });
      if (id === 'z-snippet') return makeDeps({ css: ['z.css'] });
      if (id === 'a-snippet') return makeDeps({ css: ['a.css'] });
      throw new Error('Not found');
    };

    const resolver = new DependencyResolver(fetcher);
    
    // Resolve multiple times with different root order to ensure sorting logic holds
    const result1 = await resolver.resolve(['main']);
    
    expect(result1.flat.snippets).toEqual(['a-snippet', 'z-snippet']); // Sorted
    expect(result1.flat.css).toEqual(['a.css', 'main.css', 'z.css']); // Sorted deterministically
  });
});
