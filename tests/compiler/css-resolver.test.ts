import { describe, it, expect } from 'vitest';
import { CSSTokenResolver, TokenFileFetcher, CSSResolverInput } from '../../app/services/theme-engine/compiler/css-resolver';

describe('Stage 7: CSS Token Resolver', () => {
  it('should merge tokens from 4 layers and prioritize correctly', () => {
    const fetcher: TokenFileFetcher = (layer) => {
      if (layer === 'base-tokens') return {
        '--color-text': '#000',
        '--color-bg': '#fff'
      };
      if (layer === 'theme-dna') return {
        '--color-primary': '#f00',
        '--font-base': 'Inter'
      };
      return {};
    };

    const resolver = new CSSTokenResolver(fetcher);
    
    const input: CSSResolverInput = {
      niche: 'default',
      themeDir: '',
      componentTokens: {
        '--color-bg': '#eee' // overrides base-tokens
      },
      merchantOverrides: {
        color_primary: '#00f' // Merchant override
      }
    };

    const result = resolver.resolve(input);
    
    // Merchant overrides everything
    expect(result.composed['--color-primary']).toBe('#00f');
    // Component overrides base
    expect(result.composed['--color-bg']).toBe('#eee');
    // DNA is preserved
    expect(result.composed['--font-base']).toBe('Inter');
    
    // Expect 2 overrides
    expect(result.stats.overrides).toBe(2);
    expect(result.conflicts).toHaveLength(2);
  });

  it('should fail if token does not start with --', () => {
    const fetcher: TokenFileFetcher = () => ({
      'invalid-token': '#000'
    });
    
    const resolver = new CSSTokenResolver(fetcher);
    const input = { niche: 'test', themeDir: '', componentTokens: {}, merchantOverrides: {} };
    
    expect(() => resolver.resolve(input)).toThrow(/Must start with "--"/);
  });

  it('should fail if token references an undefined variable', () => {
    const fetcher: TokenFileFetcher = () => ({
      '--button-bg': 'var(--missing-color)'
    });
    
    const resolver = new CSSTokenResolver(fetcher);
    const input = { niche: 'test', themeDir: '', componentTokens: {}, merchantOverrides: {} };
    
    expect(() => resolver.resolve(input)).toThrow(/references an undefined variable/);
  });
});
