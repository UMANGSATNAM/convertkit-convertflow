import { describe, it, expect } from 'vitest';
import { ManifestBuilder, ManifestBuilderInput } from '../../app/services/theme-engine/compiler/manifest-builder';

const mockInput: ManifestBuilderInput = {
  buildId: 'bld_123',
  merchantId: 'merchant_123',
  blueprintId: 'bp_123',
  niche: 'jewellery',
  components: {
    componentIds: ['hero-luxury', 'footer-base'],
    blueprint: {}
  },
  dependencies: {
    flat: {
      sections: ['hero', 'footer'],
      snippets: ['button'],
      assets: [], css: [], javascript: [], locales: [], settings: [], fonts: []
    },
    graph: {}
  },
  resources: {
    css: { required: ['base.css'], optional: [], duplicates: [], missing: [] },
    js: { required: [], optional: [], duplicates: [], missing: [] },
    fonts: { required: [], optional: [], duplicates: [], missing: [] },
    svg: { required: [], optional: [], duplicates: [], missing: [] },
    images: { required: [], optional: [], duplicates: [], missing: [] }
  },
  settings: {
    settings_data: { color_primary: '#fff' },
    missing: [],
    unused: ['color_unused']
  },
  locales: {
    translations: { 'hero.title': 'Hero' }
  },
  css: {
    layers: [
      { name: 'base-tokens', order: 1, tokens: { '--color-primary': '#000' }, sourceFile: '' },
      { name: 'merchant-overrides', order: 4, tokens: { '--color-primary': '#fff' }, sourceFile: '' }
    ],
    composed: {
      '--color-primary': '#fff'
    },
    cssOutput: ':root {\n  --color-primary: #fff;\n}',
    conflicts: [
      {
        token: '--color-primary',
        original: { layer: 'base-tokens', value: '#000' },
        override: { layer: 'merchant-overrides', value: '#fff' }
      }
    ],
    stats: { totalTokens: 1, overrides: 1, layerBreakdown: { 'base-tokens': 1, 'theme-dna': 0, 'component-tokens': 0, 'merchant-overrides': 1 } }
  }
};

describe('Stage 8: Manifest Builder', () => {
  it('should generate a deterministic content hash', () => {
    const builder = new ManifestBuilder();
    const manifest1 = builder.build(mockInput);
    const manifest2 = builder.build(mockInput);

    expect(manifest1.contentHash).toBe(manifest2.contentHash);
    expect(manifest1.contentHash.length).toBe(64); // SHA-256 is 64 hex chars
  });

  it('should aggregate build summary accurately', () => {
    const builder = new ManifestBuilder();
    const manifest = builder.build(mockInput);

    expect(manifest.summary.components).toBe(2);
    expect(manifest.summary.dependencies).toBe(3); // 2 sections + 1 snippet
    expect(manifest.summary.localeKeys).toBe(1);
    expect(manifest.summary.cssTokens).toBe(1);
    expect(manifest.summary.isShippable).toBe(true);
    expect(manifest.summary.warnings).toHaveLength(2); // 1 unused setting, 1 css conflict
    expect(manifest.summary.errors).toHaveLength(0);
  });

  it('should structure upload bundle correctly for Shopify payload', () => {
    const builder = new ManifestBuilder();
    const manifest = builder.build(mockInput);

    expect(manifest.uploadBundle.sections).toEqual(['sections/footer.liquid', 'sections/hero.liquid']);
    expect(manifest.uploadBundle.snippets).toEqual(['snippets/button.liquid']);
    expect(manifest.uploadBundle.assets).toEqual(['assets/base.css']);
  });

  it('should build explain artifact for merchant transparency', () => {
    const builder = new ManifestBuilder();
    const manifest = builder.build(mockInput);

    expect(manifest.explain.niche).toBe('jewellery');
    expect(manifest.explain.designDNA['color primary']).toBe('#fff');
    expect(manifest.explain.merchantChoices).toContain('Your brand color primary (#fff) applied across 1 foundational element(s).');
  });

  it('should flag isShippable=false when errors exist', () => {
    const errorInput = {
      ...mockInput,
      resources: {
        ...mockInput.resources,
        css: { required: [], optional: [], duplicates: [], missing: ['critical.css'] }
      }
    };

    const builder = new ManifestBuilder();
    const manifest = builder.build(errorInput);

    expect(manifest.summary.isShippable).toBe(false);
    expect(manifest.summary.errors).toContain('Fatal: Missing required resource: "critical.css"');
  });
});
