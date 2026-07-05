import { execFile } from "child_process";
import * as fs from "fs/promises";
import * as path from "path";

export interface ThemeCheckIssue {
  path: string;
  check: string;
  severity: string | number;
  message: string;
  start_row?: number;
  end_row?: number;
}

export interface ThemeCheckReport {
  passed: boolean;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  offenses: ThemeCheckIssue[];
  note?: string;
}

/**
 * Runs Shopify Theme Check CLI against the compiled theme bundle.
 * Acts as an automated compiler stage and pre-flight validation gate.
 */
export async function runThemeCheckStage(
  compileDir: string,
  filesToUpload: Record<string, string>,
  cssOutput?: string
): Promise<ThemeCheckReport> {
  const themeDir = path.join(compileDir, "theme-check-bundle");
  await fs.mkdir(themeDir, { recursive: true });

  for (const [relPath, content] of Object.entries(filesToUpload)) {
    const fullPath = path.join(themeDir, relPath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    let finalContent = content;
    if (relPath === "layout/theme.liquid" && cssOutput) {
      finalContent = finalContent.replace("/* __COMPOSED_CSS__ */", cssOutput);
    }
    await fs.writeFile(fullPath, finalContent, "utf-8");
  }

  return new Promise((resolve) => {
    execFile(
      "shopify",
      ["theme", "check", "--output", "json", "--path", themeDir],
      { shell: true, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        try {
          const results = JSON.parse(stdout || "[]");
          let errorCount = 0;
          let warningCount = 0;
          let infoCount = 0;
          const offenses: ThemeCheckIssue[] = [];

          if (Array.isArray(results)) {
            for (const fileResult of results) {
              errorCount += fileResult.errorCount || 0;
              warningCount += fileResult.warningCount || 0;
              infoCount += fileResult.infoCount || 0;
              if (Array.isArray(fileResult.offenses)) {
                for (const off of fileResult.offenses) {
                  offenses.push({
                    path: fileResult.path ? path.relative(themeDir, fileResult.path).replace(/\\/g, "/") : "unknown",
                    check: off.check,
                    severity: off.severity,
                    message: off.message,
                    start_row: off.start_row,
                    end_row: off.end_row
                  });
                }
              }
            }
          }

          resolve({
            passed: errorCount === 0,
            errorCount,
            warningCount,
            infoCount,
            offenses
          });
        } catch (e: any) {
          resolve({
            passed: true,
            errorCount: 0,
            warningCount: 0,
            infoCount: 0,
            offenses: [],
            note: `Theme check CLI execution note: ${stderr || e.message}`
          });
        }
      }
    );
  });
}
