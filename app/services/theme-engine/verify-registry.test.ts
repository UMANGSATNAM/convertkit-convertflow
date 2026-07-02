import { describe, it, expect } from 'vitest';
import { verifyRegistry } from './verify-registry';
import * as path from 'path';

describe('verifyRegistry', () => {
  it('should successfully verify the current repository theme-engine registry', () => {
    const result = verifyRegistry(process.cwd());
    expect(result.errors).toEqual([]);
    expect(result.success).toBe(true);
    expect(result.stats.totalComponents).toBeGreaterThan(0);
    expect(result.stats.totalLiquidFiles).toBe(result.stats.totalComponents + result.stats.totalChassisFiles);
  });
});
