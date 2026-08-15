const fs = require('fs');
const path = require('path');

console.log("🔍 Validating Theme Chassis JSON & Liquid Syntax...");

const themeDir = 'i:\\converflow app\\dev-theme-peri';
let jsonErrors = 0;
let liquidErrors = 0;

function validateJsonDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') validateJsonDir(fullPath);
    } else if (f.endsWith('.json')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        JSON.parse(content);
      } catch (e) {
        console.error(`❌ INVALID JSON in ${fullPath}:`, e.message);
        jsonErrors++;
      }
    } else if (f.endsWith('.liquid')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for unclosed schema tags
      const schemaStarts = (content.match(/\{%\s*schema\s*%\}/g) || []).length;
      const schemaEnds = (content.match(/\{%\s*endschema\s*%\}/g) || []).length;

      if (schemaStarts !== schemaEnds) {
        console.error(`❌ UNCLOSED SCHEMA in ${fullPath}`);
        liquidErrors++;
      }

      // Validate JSON inside schema tag if present
      const schemaMatch = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
      if (schemaMatch) {
        try {
          JSON.parse(schemaMatch[1]);
        } catch (e) {
          console.error(`❌ INVALID SCHEMA JSON in ${fullPath}:`, e.message);
          liquidErrors++;
        }
      }
    }
  }
}

validateJsonDir(themeDir);

if (jsonErrors === 0 && liquidErrors === 0) {
  console.log("✅ PERFECT! Zero JSON errors and zero Liquid schema errors found across the entire chassis theme!");
} else {
  console.error(`⚠️ Found ${jsonErrors} JSON errors and ${liquidErrors} Liquid errors.`);
  process.exit(1);
}
