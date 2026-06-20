const fs = require('fs');
const path = require('path');

const SECTIONS_DIR = path.join(__dirname, '../theme-template/sections');

const VALID_CSS_VARS = new Set([
  '--color-background', '--color-surface', '--color-text', '--color-text-secondary',
  '--color-accent', '--color-accent-secondary', '--color-border', '--color-success', '--color-error',
  '--font-heading', '--font-body', '--font-size-h1', '--font-size-h2', '--font-size-h3',
  '--font-size-body', '--font-size-small', '--spacing-section-y', '--spacing-section-x',
  '--spacing-gap-sm', '--spacing-gap-md', '--spacing-gap-lg', '--radius-button', '--radius-card',
  '--radius-image', '--shadow-card', '--shadow-hover', '--transition-fast', '--transition-base',
  '--breakpoint-mobile', '--breakpoint-tablet'
]);

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.liquid')) {
      callback(dirPath);
    }
  });
}

function extractStyleBlocksAndAttributes(content) {
  let styleContent = '';
  // Extract <style>...</style> content
  const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  while ((match = styleTagRegex.exec(content)) !== null) {
    styleContent += match[1] + '\n';
  }
  
  // Extract style="..." attributes
  const styleAttrRegex = /style=(["'])(.*?)\1/gi;
  while ((match = styleAttrRegex.exec(content)) !== null) {
    styleContent += match[2] + '\n';
  }
  
  return styleContent;
}

function checkHardcodedColors(styleContent) {
  const errors = [];
  
  const hexRegex = /#([0-9a-fA-F]{3,8})\b/g;
  const rgbaRegex = /rgba?\([^)]+\)/gi;
  const hslRegex = /hsla?\([^)]+\)/gi;

  let match;
  while ((match = hexRegex.exec(styleContent)) !== null) {
    errors.push(`Hardcoded hex color found: ${match[0]}`);
  }
  while ((match = rgbaRegex.exec(styleContent)) !== null) {
    errors.push(`Hardcoded rgb/rgba color found: ${match[0]}`);
  }
  while ((match = hslRegex.exec(styleContent)) !== null) {
    errors.push(`Hardcoded hsl/hsla color found: ${match[0]}`);
  }

  return errors;
}

function checkValidCSSVariables(styleContent) {
  const errors = [];
  const varRegex = /var\((--[a-zA-Z0-9-]+)(,[^)]+)?\)/g;
  let match;
  while ((match = varRegex.exec(styleContent)) !== null) {
    const varName = match[1];
    if (!VALID_CSS_VARS.has(varName)) {
      errors.push(`Invalid CSS variable used: ${varName}`);
    }
  }
  return errors;
}

function checkSchemaValidity(content) {
  const errors = [];
  const schemaRegex = /{% schema %}([\s\S]*?){% endschema %}/i;
  const match = schemaRegex.exec(content);
  if (match) {
    try {
      JSON.parse(match[1]);
    } catch (err) {
      errors.push(`Invalid JSON in schema block: ${err.message}`);
    }
  } else {
    errors.push(`Missing {% schema %} block.`);
  }
  return errors;
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const styleContent = extractStyleBlocksAndAttributes(content);
  
  const errors = [
    ...checkHardcodedColors(styleContent),
    ...checkValidCSSVariables(styleContent),
    ...checkSchemaValidity(content)
  ];

  if (errors.length > 0) {
    console.error(`\n❌ Validation failed for ${path.relative(SECTIONS_DIR, filePath)}`);
    errors.forEach(err => console.error(`   - ${err}`));
    return false;
  }
  return true;
}

function run() {
  const args = process.argv.slice(2);
  let targetFiles = [];
  
  if (args.length > 0) {
    targetFiles = args.map(arg => path.resolve(arg));
  } else {
    walkDir(SECTIONS_DIR, (filePath) => targetFiles.push(filePath));
  }

  let totalFiles = 0;
  let failedFiles = 0;

  targetFiles.forEach((filePath) => {
    totalFiles++;
    if (!validateFile(filePath)) {
      failedFiles++;
    }
  });

  console.log(`\n--- Validation Summary ---`);
  console.log(`Total sections checked: ${totalFiles}`);
  if (failedFiles > 0) {
    console.error(`Failed sections: ${failedFiles}`);
    process.exit(1);
  } else {
    console.log(`All sections passed! ✅`);
    process.exit(0);
  }
}

run();
