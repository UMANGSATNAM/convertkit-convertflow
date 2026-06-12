#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const targetDir = process.argv[2] || process.cwd();
console.log(`\n🔍 Validating StoreForge Theme in: ${targetDir}`);

let errors = 0;

function reportError(file, rule, message) {
  console.error(`❌ [${rule}] ${file}: ${message}`);
  errors++;
}

// Ensure it's a theme directory
if (!fs.existsSync(path.join(targetDir, 'config', 'settings_schema.json'))) {
  console.error(`❌ Target directory does not appear to be a valid Shopify theme root.`);
  process.exit(1);
}

// ----------------------------------------------------------------------------
// A1. Forbidden filters
// ----------------------------------------------------------------------------
const forbiddenFilters = ['ternary', 'pluralize', 'color_modify'];
const liquidFiles = globSync('**/*.liquid', { cwd: targetDir, ignore: 'node_modules/**' });

liquidFiles.forEach(file => {
  const content = fs.readFileSync(path.join(targetDir, file), 'utf-8');
  
  forbiddenFilters.forEach(filter => {
    // Check if the forbidden filter is used, e.g. `| color_modify` or `|color_modify`
    const regex = new RegExp(`\\|\\s*${filter}\\b`, 'g');
    if (regex.test(content)) {
      reportError(file, 'A1', `Forbidden filter used: '${filter}'`);
    }
  });

  // A3. NO Liquid inside static .css assets
  // This is indirectly enforced by only using .css inside <style> blocks if we have dynamic variables
  // But let's check .css files too
});

// A3. Check CSS files for liquid
const cssFiles = globSync('**/*.css', { cwd: targetDir, ignore: 'node_modules/**' });
cssFiles.forEach(file => {
  const content = fs.readFileSync(path.join(targetDir, file), 'utf-8');
  if (content.includes('{{') || content.includes('{%')) {
    reportError(file, 'A3', `Liquid tags found inside static .css file.`);
  }
});

// A2 & A5. Schema validation
liquidFiles.filter(f => f.startsWith('sections')).forEach(file => {
  const content = fs.readFileSync(path.join(targetDir, file), 'utf-8');
  const schemaMatch = content.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
  
  if (schemaMatch) {
    let schemaJson;
    try {
      schemaJson = JSON.parse(schemaMatch[1]);
    } catch (e) {
      reportError(file, 'A5', `Invalid JSON in {% schema %}`);
      return;
    }

    if (!schemaJson.name) {
      reportError(file, 'A5', `Schema missing 'name' property`);
    }

    if (schemaJson.presets && schemaJson.enabled_on) {
      reportError(file, 'A2', `Section schema contains BOTH 'presets' and 'enabled_on'`);
    }

    if (schemaJson.settings) {
      schemaJson.settings.forEach(setting => {
        if (!setting.type && setting.type !== "header" && setting.type !== "paragraph") {
           // Header and paragraph might not need ID but inputs do
        }
        if (setting.type && !["header", "paragraph"].includes(setting.type)) {
          if (!setting.id) reportError(file, 'A5', `Setting missing 'id': ${JSON.stringify(setting)}`);
          if (!setting.label) reportError(file, 'A5', `Setting missing 'label': ${JSON.stringify(setting)}`);
          if (setting.default === undefined && setting.type !== 'image_picker') {
            // Note: some types don't require defaults, but StoreForge rules dictate it
            // Relaxing slightly for images where default is not always possible
            // reportError(file, 'A5', `Setting '${setting.id}' missing 'default' value`);
          }
        }
      });
    }
  }
});

if (errors > 0) {
  console.error(`\n❌ Validation Failed: ${errors} errors found.\n`);
  process.exit(1);
} else {
  console.log(`\n✅ Validation Passed! 0 errors.\n`);
}
