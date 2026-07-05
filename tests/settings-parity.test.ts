import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('India-first Settings Parity', () => {
  const themeDir = path.resolve('app/data/templates/theme-engine/base-theme');
  const snippetsDir = path.join(themeDir, 'snippets');
  const schemaPath = path.join(themeDir, 'config', 'settings_schema.json');

  const indiaFirstSnippets = [
    'cod-badge.liquid',
    'pincode-checker.liquid',
    'whatsapp-cta.liquid',
    'upi-badge.liquid',
    'trust-strip.liquid',
    'gst-note.liquid'
  ];

  it('should ensure all settings referenced in India-first snippets exist in settings_schema.json and vice-versa', () => {
    // 1. Extract settings from schema
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    const schema = JSON.parse(schemaContent);
    const indiaFirstGroup = schema.find((g: any) => g.name === 'India-first Commerce');
    
    expect(indiaFirstGroup).toBeDefined();
    
    const schemaKeys = new Set(indiaFirstGroup.settings.map((s: any) => s.id));
    const snippetKeys = new Set<string>();

    // 2. Extract settings from snippets using regex
    const regex = /settings\.(enable_[a-zA-Z0-9_]+|show_[a-zA-Z0-9_]+|[a-zA-Z0-9_]+_note[a-zA-Z0-9_]*|whatsapp_number)/g;

    indiaFirstSnippets.forEach(snippet => {
      const snippetPath = path.join(snippetsDir, snippet);
      const content = fs.readFileSync(snippetPath, 'utf-8');
      
      let match;
      while ((match = regex.exec(content)) !== null) {
        snippetKeys.add(match[1]);
      }
    });

    // 3. Assert bidirectional parity
    // Check if every key in snippets exists in schema
    snippetKeys.forEach(key => {
      if (!schemaKeys.has(key)) {
        throw new Error(`Settings Parity Error: Key '${key}' is used in snippets but missing from settings_schema.json 'India-first Commerce' group.`);
      }
    });

    // Check if every key in schema exists in snippets
    schemaKeys.forEach(key => {
      // type "header" settings don't have IDs or we might have some informational settings, 
      // but in this group all settings should have IDs and be used
      if (key && !snippetKeys.has(key)) {
        throw new Error(`Settings Parity Error: Key '${key}' is defined in settings_schema.json but never used in the 6 India-first snippets.`);
      }
    });

    // Final assertion that they are exactly equal in size
    expect(snippetKeys.size).toBe(schemaKeys.size);
  });
});
