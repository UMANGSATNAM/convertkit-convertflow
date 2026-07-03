import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Chassis Group Resolution', () => {
  const themeDir = path.resolve('app/data/templates/theme-engine/base-theme');
  const sectionsDir = path.join(themeDir, 'sections');
  const themeLiquidPath = path.join(themeDir, 'layout', 'theme.liquid');

  const groupFiles = fs.readdirSync(sectionsDir).filter(f => f.endsWith('-group.json'));

  it('should have valid section-group schema in all group JSONs', () => {
    groupFiles.forEach(file => {
      const content = JSON.parse(fs.readFileSync(path.join(sectionsDir, file), 'utf-8'));
      expect(content).toHaveProperty('name');
      expect(content).toHaveProperty('type');
      // A group JSON can optionally have a type? Actually standard Shopify section groups typically have type, sections, order.
      // E.g., { "type": "header", "sections": { "header": { "type": "header" } }, "order": ["header"] }
      // Or just "name", "type" maybe missing on root if it's a theme group, but "sections" and "order" are required
      expect(content).toHaveProperty('sections');
      expect(typeof content.sections).toBe('object');
      expect(content).toHaveProperty('order');
      expect(Array.isArray(content.order)).toBe(true);
    });
  });

  it('should reference existing section liquid files inside the group JSONs', () => {
    groupFiles.forEach(file => {
      const content = JSON.parse(fs.readFileSync(path.join(sectionsDir, file), 'utf-8'));
      const sections = content.sections;
      
      for (const sectionId in sections) {
        const sectionType = sections[sectionId].type;
        expect(sectionType).toBeDefined();
        
        // Ensure the section type exists as a .liquid file in base-theme/sections/, OR it's a compiler-injected component
        const liquidFile = path.join(sectionsDir, `${sectionType}.liquid`);
        const isCompilerInjected = ['header', 'footer'].includes(sectionType);
        expect(isCompilerInjected || fs.existsSync(liquidFile)).toBe(true);
      }
    });
  });

  it('should match theme.liquid {% sections "..." %} calls with existing group JSON filenames', () => {
    const themeLiquid = fs.readFileSync(themeLiquidPath, 'utf-8');
    const regex = /\{%\s*sections\s*['"]([^'"]+)['"]\s*%\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(themeLiquid)) !== null) {
      matches.push(match[1]);
    }

    expect(matches.length).toBeGreaterThan(0);

    matches.forEach(groupName => {
      const groupFile = `${groupName}.json`;
      expect(groupFiles).toContain(groupFile);
    });
  });
});
