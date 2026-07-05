const fs = require('fs');
const path = require('path');

const THEME_PATH = 'app/data/templates/theme-engine/base-theme';
const enPath = path.join(THEME_PATH, 'locales/en.default.json');
const hiPath = path.join(THEME_PATH, 'locales/hi.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiJson = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

let matchFailed = false;

function extractVariables(text) {
  if (typeof text !== 'string') return [];
  const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
  const vars = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    vars.push(match[1]);
  }
  return vars.sort();
}

function traverseAndCompare(enObj, hiObj, currentPath) {
  for (const key in enObj) {
    if (typeof enObj[key] === 'object' && !Array.isArray(enObj[key]) && enObj[key] !== null) {
      if (!hiObj || typeof hiObj[key] !== 'object') {
        console.error(`[FAIL] ${currentPath}.${key} is object in EN but not in HI`);
        matchFailed = true;
        continue;
      }
      traverseAndCompare(enObj[key], hiObj[key], currentPath ? `${currentPath}.${key}` : key);
    } else if (typeof enObj[key] === 'string') {
      if (!hiObj || typeof hiObj[key] !== 'string') {
        console.error(`[FAIL] ${currentPath}.${key} is string in EN but missing in HI`);
        matchFailed = true;
        continue;
      }
      const enVars = extractVariables(enObj[key]);
      const hiVars = extractVariables(hiObj[key]);
      
      if (JSON.stringify(enVars) !== JSON.stringify(hiVars)) {
        console.error(`[FAIL] Variables mismatch at ${currentPath}.${key}:`);
        console.error(`       EN: ${JSON.stringify(enVars)}`);
        console.error(`       HI: ${JSON.stringify(hiVars)}`);
        matchFailed = true;
      }
    }
  }
}

traverseAndCompare(enJson, hiJson, "");

if (matchFailed) {
  console.log("Variable parity check FAILED.");
  process.exit(1);
} else {
  console.log("Variable parity check PASSED! All interpolation variables match perfectly between en.default.json and hi.json.");
  process.exit(0);
}
