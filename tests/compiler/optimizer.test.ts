import { describe, it, expect } from 'vitest';
import { BuildOptimizer, BuildOptimizerInput } from '../../app/services/theme-engine/compiler/optimizer';

const mockUploadBundle = {
  sections: ['sections/hero.liquid'],
  snippets: ['snippets/button.liquid'],
  assets: ['assets/base.css', 'assets/slider.js', 'assets/base.css'], // duplicates
  locales: ['locales/en.default.json'],
  config: ['config/settings_data.json'],
  templates: ['templates/index.json'],
  layout: ['layout/theme.liquid'],
  cssOutput: ':root {\n  --used: #000;\n  --unused: #fff;\n}'
};

const mockReadFile = (path: string) => {
  if (path === 'locales/en.default.json') return JSON.stringify({ 'hero.title': 'Hero' });
  if (path === 'assets/base.css') return '.base { color: red; }';
  if (path === 'assets/slider.js') return 'console.log("slider");';
  return 'mock content';
};

const mockUsedTokens = new Set(['--used']);

const mockInput: BuildOptimizerInput = {
  uploadBundle: mockUploadBundle,
  readFile: mockReadFile,
  usedCSSTokens: mockUsedTokens,
  options: { minify: true, treeshake: true }
};

describe('Stage 9: Build Optimizer', () => {
  it('should deduplicate assets', () => {
    const optimizer = new BuildOptimizer();
    const result = optimizer.optimize(mockInput);

    expect(result.stats.duplicatesRemoved).toBe(1);
    expect(result.assets.length).toBe(0); // css/js get bundled, other assets remain
  });

  it('should treeshake and minify CSS', () => {
    const optimizer = new BuildOptimizer();
    const result = optimizer.optimize(mockInput);

    expect(result.cssBundle.content).not.toContain('--unused');
    expect(result.cssBundle.content).toContain('--used:#000');
    expect(result.cssBundle.content).toContain('.base{color:red}');
    expect(result.stats.unusedAssetsRemoved).toBe(1);
  });

  it('should bundle and minify JS', () => {
    const optimizer = new BuildOptimizer();
    const result = optimizer.optimize(mockInput);

    expect(result.jsBundle.content).toBe('console.log("slider");');
    expect(result.jsBundle.sourceFiles).toContain('assets/slider.js');
  });

  it('should generate content hashes for incremental diffing', () => {
    const optimizer = new BuildOptimizer();
    const result = optimizer.optimize(mockInput);

    expect(result.sections[0].contentHash).toBeDefined();
    expect(result.cssBundle.contentHash).toBeDefined();
    expect(result.jsBundle.contentHash).toBeDefined();
  });

  it('should calculate compression ratio', () => {
    const optimizer = new BuildOptimizer();
    const result = optimizer.optimize(mockInput);

    expect(result.stats.compressionRatio).toBeLessThan(1);
    expect(result.stats.totalInputSizeBytes).toBeGreaterThan(result.stats.totalOutputSizeBytes);
  });
});
