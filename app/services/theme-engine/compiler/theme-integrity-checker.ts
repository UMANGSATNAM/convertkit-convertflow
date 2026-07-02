import * as fs from 'fs/promises';
import * as path from 'path';

export interface IntegrityReport {
  passed: boolean;
  missingCriticalFiles: string[];
  jsonErrors: string[];
}

export class ThemeIntegrityChecker {
  async verify(themeDir: string): Promise<IntegrityReport> {
    const report: IntegrityReport = {
      passed: true,
      missingCriticalFiles: [],
      jsonErrors: []
    };

    const criticalPaths = [
      'layout/theme.liquid',
      'templates/index.json',
      'sections/header-group.json',
      'sections/footer-group.json',
      'config/settings_schema.json',
      'config/settings_data.json'
    ];

    // 1. Check for missing critical files
    for (const relativePath of criticalPaths) {
      try {
        await fs.access(path.join(themeDir, relativePath));
      } catch {
        report.missingCriticalFiles.push(relativePath);
        report.passed = false;
      }
    }

    // 2. Validate all JSON files for syntax errors
    const jsonDirs = ['templates', 'sections', 'config', 'locales'];
    for (const dir of jsonDirs) {
      try {
        const files = await fs.readdir(path.join(themeDir, dir));
        for (const file of files) {
          if (file.endsWith('.json')) {
            const content = await fs.readFile(path.join(themeDir, dir, file), 'utf-8');
            try {
              JSON.parse(content);
            } catch (err) {
              report.jsonErrors.push(`${dir}/${file} is not valid JSON`);
              report.passed = false;
            }
          }
        }
      } catch (err) {
        // Directory might not exist or be empty, which is fine unless caught by critical paths
      }
    }

    return report;
  }
}
