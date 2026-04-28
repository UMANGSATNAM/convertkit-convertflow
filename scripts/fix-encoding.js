#!/usr/bin/env node
/**
 * fix-encoding.js
 * Fixes encoding corruption in Liquid section files.
 * Replaces known corrupted Unicode sequences with clean ASCII/Unicode equivalents.
 */

const fs = require('fs');
const path = require('path');

const SECTIONS_DIR = path.join(__dirname, '..', 'extensions', 'convertkit-sections', 'sections');

// Map of corrupted byte patterns (as buffer hex) to correct chars
// The corruption pattern: original em-dash (—) and arrow (→) chars 
// were triple-encoded. We fix by replacing with clean ASCII equivalents.
function fixContent(content) {
  // Remove BOM if present
  if (content.charCodeAt(0) === 0xFFFD || content.charCodeAt(0) === 0xEF) {
    content = content.replace(/^\uFFFD/, '');
  }
  
  // Replace all corrupted multi-byte sequences that represent:
  // em-dash (—), en-dash (–), arrow (→), minus (−)
  // These appear in comments and schema defaults
  
  // Strategy: use regex to find the corrupted segments and replace inline
  // Corrupted em-dash appears as: \u00E2\u0080\u0094 or similar corrupt sequences
  // after our latin1-decode pass, they appear as various garbage

  // Replace corrupted comment separator (was em-dash "—")
  content = content.replace(/â[^\x00-\x7F\u2000-\u206F]{0,5}(?=\s*(Landing|Cart|Product|Collection|Page))/g, '—');
  
  // Replace corrupted arrow in "Proceed to Checkout →"
  content = content.replace(/Proceed to Checkout [^\x20-\x7E\u2190-\u21FF]{0,8}/g, 'Proceed to Checkout →');
  
  // Replace corrupted minus in quantity buttons "−"
  content = content.replace(/<button>[^\x20-\x7E\u2190-\u2BFF]{0,5}<\/button>/g, '<button>−</button>');
  
  // Clean up BOM / replacement chars at start
  content = content.replace(/^\uFFFD+/, '').replace(/^\xEF\xBB\xBF/, '');
  
  // Clean residual garbage sequences before known keywords
  content = content.replace(/[^\x00-\x7F\u00A0-\u024F\u2000-\u2BFF\uFB00-\uFDFF]{2,}/g, (match) => {
    // Only replace if it's clearly garbage (not valid extended Latin or Unicode punctuation)
    return '';
  });

  return content;
}

const files = fs.readdirSync(SECTIONS_DIR).filter(f => f.endsWith('.liquid'));
let fixed = 0;

for (const file of files) {
  const fp = path.join(SECTIONS_DIR, file);
  const raw = fs.readFileSync(fp, 'utf8');
  
  // Only process files that have obvious corruption
  const hasCorruption = /[^\x00-\x7F\u00A0-\u024F\u2000-\u2BFF]{3,}/.test(raw.substring(0, 200));
  if (!hasCorruption) continue;
  
  const fixed_content = fixContent(raw);
  fs.writeFileSync(fp, fixed_content, 'utf8');
  fixed++;
  console.log(`Fixed: ${file}`);
}

console.log(`\nTotal: ${fixed} files fixed`);
