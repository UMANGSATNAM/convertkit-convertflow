/**
 * neutralize_defaults.ts
 * 
 * Round 2 Scrub: Replace ALL niche-specific vocabulary in shared components
 * with generic, niche-agnostic placeholder text.
 * 
 * RULE: Shared components must render safely for ANY niche.
 * Real copy comes from ContentGenerationService at compile time.
 * 
 * Outputs a change-diff audit report to stdout.
 */
import fs from "fs";
import path from "path";

// ── Niche vocabulary to neutralize (combined: jewelry + beauty + supplements) ──
const NICHE_VOCAB: [RegExp, string][] = [
  // ─── Full phrases first (longer → shorter) ───
  [/master gemologist/gi, "specialist"],
  [/salon acquisition/gi, "verified purchase"],
  [/doorstep inspection/gi, "contactless delivery"],
  [/lead research scientist/gi, "specialist"],
  [/beauty consultant[s]?/gi, "specialist"],
  [/patch testing/gi, "quality testing"],
  [/clinical purity/gi, "verified quality"],
  [/clinical dermatology assay/gi, "independent quality assay"],
  [/BIS Hallmark/gi, "Quality Certified"],
  [/bio-assay certified/gi, "independently verified"],
  [/bio-assay/gi, "quality assay"],

  // ─── Claims & regulated terms ───
  [/dermatologist[- ]?tested/gi, "quality tested"],
  [/dermatolog(ist|ical|y)/gi, "specialist"],
  [/hypoallergenic/gi, "gentle"],
  [/clinically (proven|tested|verified)/gi, "independently verified"],

  // ─── Beauty vocabulary ───
  [/botanical[- ]?recovery/gi, "premium recovery"],
  [/botanical[- ]?formulation[s]?/gi, "premium formulation"],
  [/botanical[- ]?ritual[s]?/gi, "premium ritual"],
  [/botanical[- ]?infusion/gi, "premium infusion"],
  [/botanical[- ]?extract[s]?/gi, "premium extract"],
  [/botanical[- ]?sourcing/gi, "ethical sourcing"],
  [/botanical/gi, "premium"],
  [/cellular absorption/gi, "deep absorption"],
  [/cellular recovery/gi, "intensive recovery"],
  [/cellular elixir/gi, "premium elixir"],
  [/cellular vitality/gi, "natural vitality"],
  [/cellular/gi, "intensive"],
  [/clinical serum[s]?/gi, "premium product"],
  [/clinical results/gi, "verified results"],
  [/clinical masterpiece/gi, "true masterpiece"],
  [/clinical promise/gi, "our promise"],
  [/clinical\b/gi, "verified"],
  [/\bserum[s]?\b/gi, "product"],
  [/\bformulation[s]?\b/gi, "creation"],
  [/\brejuvenation\b/gi, "renewal"],
  [/\bskincare\b/gi, "personal care"],
  [/\bpotency\b/gi, "efficacy"],
  [/\bantioxidant\b/gi, "protective"],

  // ─── Jewelry vocabulary (leftover from Round 1) ───
  [/\b1892\b/g, ""],
  [/\b2019\b/g, ""],
  [/\bgemologist[s]?\b/gi, "specialist"],
  [/\bhallmark[ed]*\b/gi, "certified"],
  [/\bdiamond[s]?\b/gi, "premium"],
  [/\bbridal\b/gi, "occasion"],
  [/\bcarat[s]?\b/gi, "unit"],
  [/\bBIS\b/g, "Quality"],
  [/\barchival\b/gi, "curated"],
  [/\bGIA\b/g, "QA"],
];

// Files/dirs that are legitimately niche-specific (skip them)
const NICHE_SUFFIXES = ["_beauty", "_supplements", "_electronics", "_streetwear", "_fashion"];
const NICHE_DIRS = ["jewel-luxe", "organic-beauty", "grooming-studio", "placeholders"];

function isNicheSpecific(filepath: string): boolean {
  const bn = path.basename(filepath);
  if (NICHE_SUFFIXES.some(s => bn.includes(s))) return true;
  if (NICHE_DIRS.some(d => filepath.includes(path.sep + d + path.sep) || filepath.includes("/" + d + "/"))) return true;
  return false;
}

interface ChangeRecord {
  file: string;
  pattern: string;
  count: number;
}

function neutralizeFile(filepath: string): ChangeRecord[] {
  let content = fs.readFileSync(filepath, "utf-8");
  const changes: ChangeRecord[] = [];

  for (const [pattern, replacement] of NICHE_VOCAB) {
    const before = content;
    content = content.replace(pattern, replacement);
    if (content !== before) {
      const matchCount = (before.match(pattern) || []).length;
      changes.push({
        file: path.relative(".", filepath),
        pattern: pattern.source,
        count: matchCount
      });
    }
  }

  if (changes.length > 0) {
    fs.writeFileSync(filepath, content, "utf-8");
  }
  return changes;
}

function walkDir(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      results.push(...walkDir(fp));
    } else if (entry.name.endsWith(".liquid") && !isNicheSpecific(fp)) {
      results.push(fp);
    }
  }
  return results;
}

// ── Main ──
const dirs = ["app/data", "app/data/final comopents", "app/data/templates/theme-engine"];
const allFiles = new Set<string>();
for (const dir of dirs) {
  if (fs.existsSync(dir)) {
    walkDir(dir).forEach(f => allFiles.add(f));
  }
}

console.log("══════════════════════════════════════════════════════════════");
console.log("  NEUTRALIZE DEFAULTS — Round 2 Niche-Agnostic Scrub");
console.log("══════════════════════════════════════════════════════════════\n");
console.log(`Scanning ${allFiles.size} shared .liquid files...\n`);

const allChanges: ChangeRecord[] = [];
let filesModified = 0;

for (const fp of allFiles) {
  const changes = neutralizeFile(fp);
  if (changes.length > 0) {
    filesModified++;
    allChanges.push(...changes);
    console.log(`✅ ${path.relative(".", fp)}: ${changes.length} pattern groups replaced`);
  }
}

// ── Audit Report ──
console.log("\n══════════════════════════════════════════════════════════════");
console.log("  AUDIT REPORT");
console.log("══════════════════════════════════════════════════════════════\n");

const byPattern = new Map<string, number>();
for (const c of allChanges) {
  byPattern.set(c.pattern, (byPattern.get(c.pattern) || 0) + c.count);
}

console.log("Pattern replacement counts:");
for (const [p, count] of [...byPattern.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${p}: ${count} replacements`);
}

console.log(`\n  Total: ${allChanges.reduce((s, c) => s + c.count, 0)} replacements across ${filesModified} files`);
console.log(`  Skipped: niche-specific files (${NICHE_SUFFIXES.join(", ")})`);
console.log(`  Skipped: niche template dirs (${NICHE_DIRS.join(", ")})\n`);

// Save audit log
const auditLog = {
  timestamp: new Date().toISOString(),
  filesScanned: allFiles.size,
  filesModified,
  totalReplacements: allChanges.reduce((s, c) => s + c.count, 0),
  changes: allChanges
};

const logPath = "scripts/neutralize_audit_log.json";
fs.writeFileSync(logPath, JSON.stringify(auditLog, null, 2));
console.log(`📋 Audit log saved to: ${logPath}`);
