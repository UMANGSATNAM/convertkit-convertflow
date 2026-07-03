import { describe, it, expect } from 'vitest';
import { resolveComponentLiquidContent } from './compiler.server';
import * as path from 'path';

describe('resolveComponentLiquidContent (Registry-Direct Resolution & Defenses)', () => {
  it('case (a): valid registered ID resolves to correct file content', async () => {
    // Hero editorial v1 is a registered component with an existing liquid file
    const result = await resolveComponentLiquidContent({ componentId: 'hero-editorial-v1' });
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    expect(result).toContain('<section');
  });

  it('case (b): unregistered ID throws with ID in message', async () => {
    const fakeId = 'unregistered-fake-component-id-v99';
    await expect(
      resolveComponentLiquidContent({ componentId: fakeId })
    ).rejects.toThrow(new RegExp(fakeId));
    
    await expect(
      resolveComponentLiquidContent({ componentId: fakeId })
    ).rejects.toThrow(/not registered in registry\.json/i);
  });

  it('case (c): registered ID whose liquidPath is temporarily missing on disk throws with attempted path in message', async () => {
    const compId = 'hero-missing-disk-test-v1';
    const missingRelPath = 'components/hero/temporarily-missing-file.liquid';
    const expectedAbsolutePath = path.resolve(process.cwd(), 'app/data/templates/theme-engine', missingRelPath);

    const testRegistry = [
      { componentId: compId, liquidPath: missingRelPath }
    ];

    await expect(
      resolveComponentLiquidContent({ componentId: compId }, testRegistry)
    ).rejects.toThrow(new RegExp(compId));

    await expect(
      resolveComponentLiquidContent({ componentId: compId }, testRegistry)
    ).rejects.toThrow(new RegExp(expectedAbsolutePath.replace(/\\/g, '\\\\')));
  });

  it('case (d): path traversal attempt escaping theme-engine root throws security error', async () => {
    const compId = 'evil-traversal-v1';
    const evilRelPath = '../../../../etc/passwd';
    const testRegistry = [
      { componentId: compId, liquidPath: evilRelPath }
    ];

    await expect(
      resolveComponentLiquidContent({ componentId: compId }, testRegistry)
    ).rejects.toThrow(/Security Error: Path traversal attempt detected/i);
  });

  it('case (e): corrupt or unreadable registry throws distinct error message', async () => {
    const fakeRegistryPath = path.resolve(process.cwd(), 'app/data/templates/theme-engine/nonexistent-corrupt-registry.json');
    
    await expect(
      resolveComponentLiquidContent({ componentId: 'hero-editorial-v1' }, undefined, fakeRegistryPath)
    ).rejects.toThrow(new RegExp(`Failed to load registry\\.json at.*${path.basename(fakeRegistryPath)}`, 'i'));
  });
});
