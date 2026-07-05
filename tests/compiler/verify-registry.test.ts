import { describe, it, expect } from 'vitest';
import { verifyRegistry } from '../../app/services/theme-engine/verify-registry';
import * as path from 'path';
import * as fs from 'fs';

describe('verifyRegistry', () => {
  it('should successfully verify the current repository theme-engine registry', () => {
    const result = verifyRegistry(process.cwd());
    expect(result.errors).toEqual([]);
    expect(result.success).toBe(true);
    expect(result.stats.totalComponents).toBeGreaterThan(0);
    expect(result.stats.totalLiquidFiles).toBeGreaterThan(100);
  });

  it('should fail verification if an untracked file exists in base-theme', () => {
    const rogueFilePath = path.join(process.cwd(), 'app/data/templates/theme-engine/base-theme/assets/rogue.js');
    
    // 1. Create untracked file
    fs.writeFileSync(rogueFilePath, 'console.log("rogue");', 'utf-8');
    
    try {
      // 2. Verify registry must fail
      const result = verifyRegistry(process.cwd());
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.includes('Untracked chassis file on disk') && e.includes('rogue.js'))).toBe(true);
    } finally {
      // 3. Clean up
      if (fs.existsSync(rogueFilePath)) {
        fs.unlinkSync(rogueFilePath);
      }
    }

    // 4. Verify registry passes again
    const resultClean = verifyRegistry(process.cwd());
    expect(resultClean.success).toBe(true);
  });
});
