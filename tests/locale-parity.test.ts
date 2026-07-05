import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Locale Parity', () => {
  const themeDir = path.resolve('app/data/templates/theme-engine/base-theme');
  const enPath = path.join(themeDir, 'locales', 'en.default.json');
  const hiPath = path.join(themeDir, 'locales', 'hi.json');

  it('should have exact same number of leaf keys in both locales', () => {
    const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
    const hi = JSON.parse(fs.readFileSync(hiPath, 'utf-8'));

    function countLeaves(obj: any): number {
      let count = 0;
      for (let k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null) {
          count += countLeaves(obj[k]);
        } else {
          count++;
        }
      }
      return count;
    }

    const enLeaves = countLeaves(en);
    const hiLeaves = countLeaves(hi);

    expect(hiLeaves).toBe(enLeaves);
  });

  it('should have identical interpolation variables across both locales', () => {
    const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
    const hi = JSON.parse(fs.readFileSync(hiPath, 'utf-8'));

    function getVariables(str: string): string[] {
      if (typeof str !== 'string') return [];
      const matches = str.match(/\{\{\s*[\w.]+\s*\}\}/g) || [];
      return matches.map(m => m.replace(/\{\{|\}\}/g, '').trim()).sort();
    }

    function checkVariables(obj1: any, obj2: any, prefix = '') {
      for (const key in obj1) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        // Key must exist in obj2 since we check parity, but lets just check if it exists first
        expect(obj2).toHaveProperty(key);

        if (typeof obj1[key] === 'object' && obj1[key] !== null) {
          checkVariables(obj1[key], obj2[key], fullKey);
        } else {
          const vars1 = getVariables(obj1[key]);
          const vars2 = getVariables(obj2[key]);
          expect(vars2).toEqual(vars1);
        }
      }
    }

    checkVariables(en, hi);
  });
});
