import fs from "fs";
import path from "path";

// ── Niche Vocabulary Registry ──
// Use the shared JSON file so compiler and tests are in sync
let nicheData: any = {};
try {
  const jsonPath = path.resolve(process.cwd(), "app/data/niche-vocabulary.json");
  nicheData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
} catch (e) {
  console.warn("⚠️ Could not load niche-vocabulary.json, using fallback patterns.");
  nicheData = {
    forbidden_niche_patterns: ["\\b1892\\b", "\\b2019\\b", "\\bclinical\\b"],
    niche_specific_directories: ["jewel-luxe", "organic-beauty", "grooming-studio"],
    niche_specific_suffixes: ["_beauty", "_supplements", "_electronics", "_streetwear", "_fashion"]
  };
}

const FORBIDDEN_NICHE_PATTERNS = nicheData.forbidden_niche_patterns.map((p: string) => new RegExp(p, "i"));

export interface LeakageViolation {
  file: string;
  line: number;
  match: string;
  content: string;
}

export function validateSourceComponents(dirPath: string): LeakageViolation[] {
  const violations: LeakageViolation[] = [];
  if (!fs.existsSync(dirPath)) return violations;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    // Ignore non-source dirs
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "placeholders") continue;
      // Skip explicitly allowed niche directories (they are allowed to have niche words)
      if (nicheData.niche_specific_directories.some((d: string) => fullPath.includes(path.sep + d) || fullPath.endsWith(d))) {
        continue;
      }
      violations.push(...validateSourceComponents(fullPath));
    } 
    // Process .liquid files
    else if (entry.name.endsWith(".liquid")) {
      // Skip explicitly allowed niche files
      if (nicheData.niche_specific_suffixes.some((s: string) => entry.name.includes(s))) {
        continue;
      }

      const content = fs.readFileSync(fullPath, "utf-8");
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const regex of FORBIDDEN_NICHE_PATTERNS) {
          const match = line.match(regex);
          if (match) {
            violations.push({
              file: fullPath,
              line: i + 1,
              match: match[0],
              content: line.trim()
            });
          }
        }
      }
    }
  }
  return violations;
}

// Allow running directly as CLI
const isMain = process.argv[1] && (process.argv[1] === import.meta.url || import.meta.url.endsWith(path.basename(process.argv[1])));
if (isMain || process.argv[1]?.includes('scan_domain_leakage.ts')) {
  console.log("================================================================================");
  console.log("  DOMAIN LEAKAGE SCAN (Source Level - Hard Fail)");
  console.log("================================================================================\n");

  const searchDirs = [
    path.resolve("app/data"),
    path.resolve("theme-template")
  ];

  const allViolations: LeakageViolation[] = [];
  for (const dir of searchDirs) {
    allViolations.push(...validateSourceComponents(dir));
  }

  if (allViolations.length === 0) {
    console.log("✅ 0 DOMAIN LEAKAGE VIOLATIONS FOUND across all shared liquid components!");
    process.exit(0);
  } else {
    console.warn(`🔴 FOUND ${allViolations.length} DOMAIN LEAKAGE VIOLATIONS across ${new Set(allViolations.map(v => v.file)).size} files:\n`);
    const byFile = new Map<string, typeof allViolations>();
    for (const v of allViolations) {
      if (!byFile.has(v.file)) byFile.set(v.file, []);
      byFile.get(v.file)!.push(v);
    }
    for (const [file, list] of byFile.entries()) {
      console.log(`\n📄 ${file} (${list.length} violations):`);
      for (const v of list) {
        console.log(`   L${v.line}: [matched "${v.match}"] -> ${v.content.substring(0, 100)}...`);
      }
    }
    console.log("\n❌ Source-level validation failed. These terms will leak into generic themes.");
    process.exit(1);
  }
}
