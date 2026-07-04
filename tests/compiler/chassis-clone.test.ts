import { describe, it, expect } from 'vitest';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { cloneChassis, ChassisTamperError } from '../../app/services/theme-engine/compiler.server';

describe('Stage 1: Chassis Clone Stage & Tamper Verification', () => {
  const tmpTestRoot = path.join(process.cwd(), 'tmp', 'test-chassis-clone');

  const setupTempChassisDir = async () => {
    await fs.mkdir(tmpTestRoot, { recursive: true });
    
    // Create base-theme structure
    const baseThemeDir = path.join(tmpTestRoot, 'base-theme');
    await fs.mkdir(baseThemeDir, { recursive: true });
    await fs.mkdir(path.join(baseThemeDir, 'layout'), { recursive: true });
    await fs.mkdir(path.join(baseThemeDir, 'snippets'), { recursive: true });

    // Define dummy file contents
    const themeContent = '<html>{{ content_for_header }}</html>';
    const snippetContent = '{%- comment -%}GST note{%- endcomment -%}';

    // Normalize hashes matching our normalization function (\r\n -> \n)
    const hashTheme = crypto.createHash('sha256').update(themeContent.replace(/\r\n/g, '\n')).digest('hex');
    const hashSnippet = crypto.createHash('sha256').update(snippetContent.replace(/\r\n/g, '\n')).digest('hex');

    // Create chassis files
    await fs.writeFile(path.join(baseThemeDir, 'layout/theme.liquid'), themeContent, 'utf-8');
    await fs.writeFile(path.join(baseThemeDir, 'snippets/gst-note.liquid'), snippetContent, 'utf-8');

    // Create manifest JSON
    const manifest = {
      version: '1.0.0',
      files: [
        {
          file: 'base-theme/layout/theme.liquid',
          hash: hashTheme
        },
        {
          file: 'base-theme/snippets/gst-note.liquid',
          hash: hashSnippet
        }
      ]
    };

    await fs.writeFile(path.join(baseThemeDir, 'chassis-manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');

    return {
      hashTheme,
      hashSnippet,
      baseThemeDir
    };
  };

  const cleanTempChassisDir = async () => {
    if (existsSync(tmpTestRoot)) {
      await fs.rm(tmpTestRoot, { recursive: true, force: true });
    }
  };

  it('Case (a): Positive - cloneChassis reads files and verifies hashes cleanly', async () => {
    await setupTempChassisDir();
    try {
      const cloned = await cloneChassis(tmpTestRoot);
      expect(Object.keys(cloned).sort()).toEqual([
        'layout/theme.liquid',
        'snippets/gst-note.liquid'
      ]);
      expect(cloned['layout/theme.liquid']).toBe('<html>{{ content_for_header }}</html>');
      expect(cloned['snippets/gst-note.liquid']).toBe('{%- comment -%}GST note{%- endcomment -%}');
    } finally {
      await cleanTempChassisDir();
    }
  });

  it('Case (b): Negative - ChassisTamperError thrown when file is missing from disk', async () => {
    const { baseThemeDir } = await setupTempChassisDir();
    try {
      // Remove a file
      await fs.unlink(path.join(baseThemeDir, 'snippets/gst-note.liquid'));

      await expect(
        cloneChassis(tmpTestRoot)
      ).rejects.toThrow(ChassisTamperError);

      await expect(
        cloneChassis(tmpTestRoot)
      ).rejects.toThrow(/Chassis file missing: base-theme\/snippets\/gst-note\.liquid/);
    } finally {
      await cleanTempChassisDir();
    }
  });

  it('Case (c): Negative - ChassisTamperError thrown when file is modified/tampered', async () => {
    const { baseThemeDir } = await setupTempChassisDir();
    try {
      // Modify a file
      await fs.writeFile(path.join(baseThemeDir, 'layout/theme.liquid'), '<html>modified</html>', 'utf-8');

      await expect(
        cloneChassis(tmpTestRoot)
      ).rejects.toThrow(ChassisTamperError);

      await expect(
        cloneChassis(tmpTestRoot)
      ).rejects.toThrow(/Hash mismatch for chassis file: base-theme\/layout\/theme\.liquid/);
    } finally {
      await cleanTempChassisDir();
    }
  });
});
