import type { CSSTokenArtifact } from "./css-resolver";

export interface LintIssue {
  rule: string;
  severity: "error" | "warning" | "info";
  message: string;
  expected: string;
  actual: string;
}

export interface LintReport {
  passed: boolean;
  score: number;
  issues: LintIssue[];
}

export class DesignLinter {
  
  lint(css: CSSTokenArtifact): LintReport {
    const issues: LintIssue[] = [];
    const tokens = css.composed;

    // Rule 1: Typography Hierarchy (H1 must be > H2 > Body)
    const h1 = this.parseFontSize(tokens["--font-size-h1"]);
    const h2 = this.parseFontSize(tokens["--font-size-h2"]);
    
    if (h1 && h2 && h1 <= h2) {
      issues.push({ rule: "type-hierarchy", severity: "error", message: "H1 must be larger than H2", expected: "h1 > h2", actual: `${h1} <= ${h2}` });
    }
    
    // Rule 2: Button Consistency
    const btnPrimary = tokens["--btn-primary-bg"];
    const btnSecondary = tokens["--btn-secondary-bg"];
    if (btnPrimary && btnSecondary && btnPrimary === btnSecondary) {
      issues.push({ rule: "button-consistency", severity: "warning", message: "Primary and secondary buttons are identical", expected: "Distinct colors", actual: btnPrimary });
    }

    // Rule 3: Contrast Check (Simplified WCAG approximation)
    const textColor = tokens["--color-text"];
    const bgColor = tokens["--color-background"];
    if (textColor === bgColor && textColor !== undefined) {
       issues.push({ rule: "contrast-ratio", severity: "error", message: "Text color matches background color identically.", expected: "Contrasting hex codes", actual: textColor });
    }

    // Calculate Design Score
    const errorCount = issues.filter(i => i.severity === "error").length;
    const warningCount = issues.filter(i => i.severity === "warning").length;
    const score = Math.max(0, 100 - (errorCount * 20) - (warningCount * 8));

    return {
      passed: errorCount === 0,
      score,
      issues
    };
  }

  private parseFontSize(value: string | undefined): number | null {
    if (!value) return null;
    const pxMatch = value.match(/^(\d+(?:\.\d+)?)px$/);
    if (pxMatch) return parseFloat(pxMatch[1]);
    const remMatch = value.match(/^(\d+(?:\.\d+)?)rem$/);
    if (remMatch) return parseFloat(remMatch[1]) * 16;
    return null;
  }
}

export async function designLint(cssArtifact: CSSTokenArtifact): Promise<LintReport> {
  const linter = new DesignLinter();
  return linter.lint(cssArtifact);
}
