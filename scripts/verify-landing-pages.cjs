const { D2C_LANDING_PAGES } = require('../app/data/landing-pages-registry.ts');
const { resolveSections, schemaOf, seedFor, bundleFor } = require('../app/pagekit/registry.server.ts');

async function testAll() {
  console.log('Testing all 10 landing pages resolution...');
  let hasErrors = false;
  const uniqueSections = new Map();

  for (const lp of D2C_LANDING_PAGES) {
    const ids = [
      ...(lp.announcement ? [lp.announcement] : []),
      ...(lp.header ? [lp.header] : []),
      ...lp.sections.map(s => s.componentId),
      ...(lp.footer ? [lp.footer] : [])
    ];
    const res = await resolveSections(ids);
    console.log(`[${lp.id}] Total: ${ids.length} | Resolved: ${res.resolved.length} | Unknown: ${JSON.stringify(res.unknown)} | Missing: ${JSON.stringify(res.fileMissing)}`);
    if (!res.ok) {
      hasErrors = true;
    }
    const bundle = await bundleFor(res.resolved);
    if (bundle.missing.length > 0) {
      console.error(`ERROR: [${lp.id}] missing snippets in bundle:`, bundle.missing);
      hasErrors = true;
    }
    for (const r of res.resolved) {
      if (!uniqueSections.has(r.id)) {
        uniqueSections.set(r.id, r);
      }
    }
  }

  console.log(`\nChecking schemas and snippet dependencies for ${uniqueSections.size} unique sections...`);
  for (const [id, sec] of uniqueSections.entries()) {
    const schema = schemaOf(sec.source);
    if (!schema) {
      console.error(`ERROR: [${id}] Invalid or missing schema!`);
      hasErrors = true;
    }
    const seed = seedFor(sec.source);
    const renderMatches = [...sec.source.matchAll(/\{%[-]?\s*render\s+['"]([^'"]+)['"]/g)].map(m => m[1]);
    if (renderMatches.length > 0) {
      console.warn(`NOTICE: [${id}] renders snippets:`, renderMatches);
    }
  }

  if (hasErrors) {
    console.error('\nFAILED: Some sections failed validation!');
    process.exit(1);
  } else {
    console.log('\nSUCCESS: All sections in all 10 landing pages resolved with valid schemas and zero missing bundle snippets!');
  }
}

testAll().catch(err => {
  console.error(err);
  process.exit(1);
});
