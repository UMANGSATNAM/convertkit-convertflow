import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

function getAllLiquidFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllLiquidFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.liquid') || file.endsWith('.css')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

describe('Colour Role Guard: Prevent var(--color-accent) on text elements', () => {
  it('should not allow color: var(--color-accent) on text elements across base-theme and components', () => {
    const baseThemeDir = path.resolve(__dirname, '../../app/data/templates/theme-engine/base-theme');
    const componentsDir = path.resolve(__dirname, '../../app/data/templates/theme-engine/components');

    const files = [
      ...getAllLiquidFiles(baseThemeDir),
      ...getAllLiquidFiles(componentsDir)
    ];

    const violations: string[] = [];

    files.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Skip hover styles or explicit allowed accent elements (price tags, rating stars, newsletter success messages, checkmarks, icons)
        if (
          filePath.endsWith('base-tokens.css') ||
          filePath.endsWith('animations.css') ||
          (index > 0 && lines[index - 1].includes(':hover')) ||
          line.includes('price') ||
          line.includes('.pr b') ||
          line.includes('testimonial-rating') ||
          line.includes('newsletter-success-msg') ||
          line.includes(':hover') ||
          line.includes('hover:') ||
          line.includes('accent-color: var(--color-accent)') ||
          line.includes('stroke="currentColor"') ||
          line.includes('trust-item svg') ||
          line.includes('button type="submit"') ||
          line.includes('header-')
        ) {
          return;
        }

        // Check for color: var(--color-accent) or text-[var(--color-accent)]
        if (
          line.match(/(^|\s|;)color:\s*var\(--color-accent\)/i) ||
          line.match(/text-\[var\(--color-accent\)\]/i)
        ) {
          const relPath = path.relative(path.resolve(__dirname, '../../'), filePath);
          violations.push(`${relPath}:${index + 1} -> ${line.trim()}`);
        }
      });
    });

    expect(violations, `Found var(--color-accent) misused as text color on elements:\n${violations.join('\n')}`).toEqual([]);
  });
});
