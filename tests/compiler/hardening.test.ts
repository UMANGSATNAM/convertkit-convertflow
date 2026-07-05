import { describe, it, expect, vi } from 'vitest';
import {
  resolveComponentLiquidContent,
  assembleThemeBundle,
  compileTheme
} from '../../app/services/theme-engine/compiler.server';
import { ValidationError } from '../../app/services/theme-engine/validators.server';
import * as templateGen from '../../app/services/theme-engine/template-generator';
import * as staticVal from '../../app/services/theme-engine/compiler/static-validator';
import * as themeCheckMod from '../../app/services/theme-engine/compiler/theme-check';

describe('Gate A2 Hardening & Negative Tests', () => {
  it('should throw an error in resolveComponentLiquidContent when component liquid file is missing (no soft fail)', async () => {
    const fakeComponent = {
      componentId: 'fake-missing-comp',
      sectionType: 'fake-section',
      liquidPath: 'sections/non-existent-12345.liquid'
    };

    await expect(
      resolveComponentLiquidContent(fakeComponent as any, [fakeComponent] as any)
    ).rejects.toThrow(/Failed to read liquid file for component/i);
  });

  it('should throw ValidationError in assembleThemeBundle when a template JSON file is malformed', async () => {
    const spy = vi.spyOn(templateGen, 'generateTemplates').mockImplementation(async (bp, files) => {
      files['templates/broken.json'] = '{ malformed_json_without_quotes: true ';
      return [];
    });

    const fakeBlueprint: any = {
      globalComponents: [],
      settings: {},
      pages: {
        index: { handle: 'index', sections: [] }
      }
    };

    try {
      await expect(
        assembleThemeBundle(fakeBlueprint, [], 'default')
      ).rejects.toThrow(/Template "templates\/broken\.json" is invalid JSON/i);
    } finally {
      spy.mockRestore();
    }
  });

  it('should abort compilation and throw ValidationError when isDeployable is false in compileTheme', async () => {
    const spy = vi.spyOn(staticVal, 'staticValidate').mockImplementation(async () => ({
      passed: false,
      errors: ['Simulated validation failure'],
      warnings: [],
      checks: {} as any
    }));
    const tcSpy = vi.spyOn(themeCheckMod, 'runThemeCheckStage').mockImplementation(async () => ({
      passed: true,
      errors: [],
      warnings: []
    }));

    const fakeBlueprint: any = {
      globalComponents: [],
      settings: {},
      pages: {
        index: { handle: 'index', sections: [] }
      }
    };

    try {
      await expect(
        compileTheme(fakeBlueprint, [], { industry: 'default' })
      ).rejects.toThrow(/Aborting compilation: Theme bundle is not deployable/i);
    } finally {
      spy.mockRestore();
      tcSpy.mockRestore();
    }
  }, 15000);
});
