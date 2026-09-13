/**
 * Verification test for Conversion Suite bundling and Liquid syntax.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

async function runTests() {
  console.log('--- Starting Conversion Suite Verification Tests ---');

  // Test 1: Check source template files in dev-theme-peri
  const requiredTemplates = [
    'dev-theme-peri/sections/cdr-v1.liquid',
    'dev-theme-peri/snippets/cart-drawer-item.liquid',
    'dev-theme-peri/snippets/icon.liquid',
    'dev-theme-peri/snippets/quantity-input.liquid',
    'dev-theme-peri/snippets/trust-badges.liquid',
    'dev-theme-peri/snippets/back-in-stock.liquid',
    'dev-theme-peri/snippets/countdown-timer.liquid',
    'dev-theme-peri/assets/cart-drawer.js',
    'dev-theme-peri/assets/countdown.js',
  ];

  let missing = 0;
  for (const rel of requiredTemplates) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) {
      console.error(`❌ MISSING SOURCE FILE: ${rel}`);
      missing++;
    } else {
      console.log(`✅ FOUND: ${rel}`);
    }
  }

  if (missing > 0) {
    console.error(`FAILED: ${missing} required source files missing.`);
    process.exit(1);
  }

  // Test 2: Check Liquid syntax tag balance in cdr-v1
  const cdrSource = fs.readFileSync(path.join(ROOT, 'dev-theme-peri/sections/cdr-v1.liquid'), 'utf-8');
  const ifCount = (cdrSource.match(/\{%\s*if\b/g) || []).length;
  const endifCount = (cdrSource.match(/\{%\s*endif\s*%\}/g) || []).length;
  console.log(`Checking cdr-v1.liquid tags: {% if %} = ${ifCount}, {% endif %} = ${endifCount}`);
  if (ifCount !== endifCount) {
    console.error(`❌ Tag mismatch in cdr-v1.liquid!`);
    process.exit(1);
  } else {
    console.log(`✅ cdr-v1.liquid has balanced if/endif tags.`);
  }

  // Test 3: Check back-in-stock.liquid tag balance
  const bisSource = fs.readFileSync(path.join(ROOT, 'dev-theme-peri/snippets/back-in-stock.liquid'), 'utf-8');
  const bisIf = (bisSource.match(/\{%\s*if\b/g) || []).length;
  const bisEndif = (bisSource.match(/\{%\s*endif\s*%\}/g) || []).length;
  console.log(`Checking back-in-stock.liquid tags: {% if %} = ${bisIf}, {% endif %} = ${bisEndif}`);
  if (bisIf !== bisEndif) {
    console.error(`❌ Tag mismatch in back-in-stock.liquid!`);
    process.exit(1);
  } else {
    console.log(`✅ back-in-stock.liquid has balanced if/endif tags.`);
  }

  console.log('--- ALL CONVERSION SUITE ASSET TESTS PASSED ✅ ---');
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
