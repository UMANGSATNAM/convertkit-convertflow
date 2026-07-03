const fs = require('fs');
const path = require('path');

const THEME_PATH = 'app/data/templates/theme-engine/base-theme';
const enPath = path.join(THEME_PATH, 'locales/en.default.json');
const hiPath = path.join(THEME_PATH, 'locales/hi.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiJson = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

function syncKeys(source, target) {
  for (const key in source) {
    if (typeof source[key] === 'object' && !Array.isArray(source[key]) && source[key] !== null) {
      if (!target[key]) target[key] = {};
      syncKeys(source[key], target[key]);
    } else if (typeof source[key] === 'string') {
      if (target[key] === undefined) {
        // Just fallback to english string if hindi is missing, so structure matches
        target[key] = source[key];
      }
    }
  }
}

// Ensure hiJson has all keys from enJson
syncKeys(enJson, hiJson);

// Save back
fs.writeFileSync(hiPath, JSON.stringify(hiJson, null, 2));

console.log("Synchronized missing structure from EN to HI.");
