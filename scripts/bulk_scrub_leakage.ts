/**
 * Bulk domain-leakage scrubber for final comopents directory.
 * Applies safe regex replacements for jewelry→beauty domain terminology.
 * Only touches user-facing content and defaults, not code identifiers.
 */
import fs from "fs";
import path from "path";

const DIR = path.resolve("app/data/final comopents");

// Replacement map: pattern → replacement
// Order matters: longer patterns first to avoid partial replacements
const REPLACEMENTS: [RegExp, string][] = [
  // Full phrases first
  [/master gemologist/gi, "lead research scientist"],
  [/salon acquisition/gi, "verified purchase"],
  [/doorstep inspection/gi, "contactless delivery"],
  [/BIS Hallmark(?:ed)?/gi, "Clinical Purity"],
  [/BIS hallmark(?:ed)?/gi, "clinical purity"],
  [/GIA Certified/gi, "Dermatologist Tested"],
  [/GIA certified/gi, "dermatologist tested"],
  [/GIA (?:&amp;|&) IGI/gi, "BIO-ASSAY"],
  [/GIA or IGI/gi, "independent clinical assay"],
  [/Kimberley Process/gi, "Ethical Botanical Sourcing"],
  [/Handcrafted since 1892/gi, "Formulated with precision"],
  [/12,400\+ pieces delivered/gi, "12,400+ formulations delivered"],
  
  // Noun phrases
  [/(?:natural )?diamond(?:s)? (?:and |& )?(?:precious )?metal(?:s)?/gi, "botanical formulations"],
  [/diamond facet(?:s)?/gi, "active ingredient"],
  [/Diamond Ring(?:s)?/gi, "Clinical Serum"],
  [/diamond ring(?:s)?/gi, "clinical serum"],
  [/Diamond Choker/gi, "Rejuvenation Set"],
  [/Solitaire Diamond/gi, "Botanical Recovery"],
  [/solitaire diamond/gi, "botanical recovery"],
  [/diamond(?:s)?/gi, (match: string) => match[0] === "D" ? "Formulation" : "formulation"],
  
  // Individual terms
  [/\bgemologist(?:s)?\b/gi, (match: string) => match[0] === "G" ? "Beauty consultant" : "beauty consultant"],
  [/\bHallmark(?:ed)?\b/g, "Certified"],
  [/\bhallmark(?:ed)?\b/g, "certified"],
  [/\bBridal\b/g, "Clinical"],
  [/\bbridal\b/g, "clinical"],
  [/\bBIS\b/g, "Clinical"],
  [/\bcarat(?:s)?\b/gi, "unit"],
  [/\bArchival\b/g, "Curated"],
  [/\barchival\b/g, "curated"],
  [/\bGIA\b/g, "BIO-ASSAY"],
  [/\b1892\b/g, "2019"],
];

function scrubFile(filepath: string): number {
  let content = fs.readFileSync(filepath, "utf-8");
  let changeCount = 0;
  
  for (const [pattern, replacement] of REPLACEMENTS) {
    const before = content;
    if (typeof replacement === "string") {
      content = content.replace(pattern, replacement);
    } else {
      content = content.replace(pattern, replacement as any);
    }
    if (content !== before) changeCount++;
  }
  
  if (changeCount > 0) {
    fs.writeFileSync(filepath, content, "utf-8");
  }
  return changeCount;
}

// Process all liquid files in directory
const files = fs.readdirSync(DIR).filter((f: string) => f.endsWith(".liquid"));
let totalChanges = 0;

for (const f of files) {
  const fp = path.join(DIR, f);
  const changes = scrubFile(fp);
  if (changes > 0) {
    console.log(`✅ ${f}: ${changes} patterns replaced`);
    totalChanges += changes;
  }
}

console.log(`\n=== Done: ${totalChanges} total pattern replacements across ${files.length} files ===`);
