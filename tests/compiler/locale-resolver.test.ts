import { describe, it, expect } from 'vitest';
import { LocaleResolver, LocaleFetcher } from '../../app/services/theme-engine/compiler/locale-resolver';
import { ResolvedDependencies } from '../../app/services/theme-engine/compiler/dependency-resolver';

const mockDeps: ResolvedDependencies = {
  flat: {
    sections: [], snippets: [], assets: [], css: [], javascript: [], locales: [], settings: [], fonts: []
  },
  graph: {
    'hero-component': {
      id: 'hero-component',
      dependencies: { sections: [], snippets: [], assets: [], css: [], javascript: [], locales: [], settings: [], fonts: [] },
      children: {
        'button-snippet': {
          id: 'button-snippet',
          dependencies: { sections: [], snippets: [], assets: [], css: [], javascript: [], locales: [], settings: [], fonts: [] },
          children: {}
        }
      }
    },
    'footer-component': {
      id: 'footer-component',
      dependencies: { sections: [], snippets: [], assets: [], css: [], javascript: [], locales: [], settings: [], fonts: [] },
      children: {}
    }
  }
};

describe('Stage 6: Locale Resolver', () => {
  it('should merge unique locales from all components in the graph', async () => {
    const fetcher: LocaleFetcher = async (id) => {
      if (id === 'hero-component') return { 'hero.title': 'Hero' };
      if (id === 'button-snippet') return { 'button.text': 'Click' };
      if (id === 'footer-component') return { 'footer.text': 'Footer' };
      return {};
    };

    const resolver = new LocaleResolver(fetcher);
    const result = await resolver.resolve(mockDeps);

    expect(result.translations).toEqual({
      'hero.title': 'Hero',
      'button.text': 'Click',
      'footer.text': 'Footer'
    });
  });

  it('should throw error on conflicting locales', async () => {
    const fetcher: LocaleFetcher = async (id) => {
      if (id === 'hero-component') return { 'shared.text': 'Hero Value' };
      if (id === 'footer-component') return { 'shared.text': 'Footer Value' };
      return {};
    };

    const resolver = new LocaleResolver(fetcher);
    await expect(resolver.resolve(mockDeps)).rejects.toThrow(/Conflicting locale key 'shared.text'/);
  });

  it('should throw error on duplicate locales even if values match', async () => {
    const fetcher: LocaleFetcher = async (id) => {
      if (id === 'hero-component') return { 'shared.text': 'Same Value' };
      if (id === 'footer-component') return { 'shared.text': 'Same Value' };
      return {};
    };

    const resolver = new LocaleResolver(fetcher);
    await expect(resolver.resolve(mockDeps)).rejects.toThrow(/Duplicate locale key 'shared.text'/);
  });
});
