import { describe, it, expect } from 'vitest';
import { SettingsResolver } from '../../app/services/theme-engine/compiler/settings-resolver';
import { ResolvedDependencies } from '../../app/services/theme-engine/compiler/dependency-resolver';

const mockDeps = (settings: string[]): ResolvedDependencies => ({
  flat: {
    sections: [],
    snippets: [],
    assets: [],
    css: [],
    javascript: [],
    locales: [],
    settings,
    fonts: []
  },
  graph: {}
});

describe('Stage 5: Settings Resolver', () => {
  it('should resolve settings correctly when all required settings are provided', () => {
    const deps = mockDeps(['color_primary', 'show_announcement']);
    const blueprintSettings = {
      color_primary: '#ff0000',
      show_announcement: true
    };

    const resolver = new SettingsResolver();
    const result = resolver.resolve(blueprintSettings, deps);

    expect(result.missing).toEqual([]);
    expect(result.unused).toEqual([]);
    expect(result.settings_data).toEqual(blueprintSettings);
  });

  it('should track unused settings but not fail', () => {
    const deps = mockDeps(['color_primary']);
    const blueprintSettings = {
      color_primary: '#ff0000',
      unused_setting: 'test'
    };

    const resolver = new SettingsResolver();
    const result = resolver.resolve(blueprintSettings, deps);

    expect(result.unused).toEqual(['unused_setting']);
    expect(result.settings_data).toEqual({ color_primary: '#ff0000' });
  });

  it('should throw an error if a required setting is missing', () => {
    const deps = mockDeps(['color_primary', 'missing_setting']);
    const blueprintSettings = {
      color_primary: '#ff0000'
    };

    const resolver = new SettingsResolver();
    expect(() => resolver.resolve(blueprintSettings, deps)).toThrow(/Missing required settings: \nmissing_setting/);
  });
});
