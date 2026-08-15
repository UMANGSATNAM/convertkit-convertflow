#!/usr/bin/env node
/**
 * sync_peri_to_engine.cjs
 *
 * Publishes every section in dev-theme-peri/ into the theme engine so the
 * generator can actually pick from them.
 *
 * What it does
 *   1. Copies dev-theme-peri/snippets + assets into the engine base-theme
 *      (sections render nothing without their shared snippets and JS).
 *   2. Copies each section into components/{engineType}/{id}.liquid
 *   3. Writes a {id}.meta.json next to it
 *   4. Rebuilds registry.json — existing hand-written entries are preserved,
 *      synced ones are marked status: "production" so retrieval will use them.
 *
 * Safe to re-run. Backs up registry.json before writing.
 *
 * Usage:  node scripts/sync_peri_to_engine.cjs [--dry]
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PERI = path.join(ROOT, 'dev-theme-peri');
const ENGINE = path.join(ROOT, 'app/data/templates/theme-engine');
const BASE = path.join(ENGINE, 'base-theme');
const COMPONENTS = path.join(ENGINE, 'components');
const REGISTRY = path.join(ENGINE, 'registry.json');

const DRY = process.argv.includes('--dry');

// ---------------------------------------------------------------- type map
// dev-theme-peri role  ->  engine sectionType
const TYPE_MAP = {
  // storefront pages
  pdp: 'product-page',
  pc: 'product-grid',
  cl: 'collection',
  cp: 'collection-page',
  cdr: 'cart-drawer',
  popup: 'popup',
  ab: 'announcement',

  // homepage roles
  hero: 'hero',
  'image-banner': 'hero',
  'video-banner': 'hero',
  video: 'hero',
  lookbook: 'product-grid',

  'featured-collection': 'product-grid',
  'featured-products': 'product-grid',
  bestsellers: 'product-grid',

  'collection-list': 'collection',
  'category-pills': 'collection',
  'category-tiles': 'collection',

  'announcement-bar': 'announcement',
  marquee: 'announcement',
  'scrolling-text': 'announcement',
  'offer-banner': 'announcement',

  faq: 'faq',
  testimonials: 'testimonials',
  testimonial: 'testimonials',

  'brand-story': 'brand-story',
  'image-with-text': 'brand-story',
  'rich-text': 'brand-story',
  'founder-note': 'brand-story',

  newsletter: 'newsletter',
  'bundle-offer': 'bundle-builder',

  'trust-badges': 'trust',
  usp: 'trust',
  'press-logos': 'trust',
  guarantee: 'trust',
  'features-grid': 'trust',
  'comparison-table': 'trust',

  header: 'header',
  footer: 'footer',

  'ugc-reels': 'ugc',
  instagram: 'ugc',
  'instashop-gallery': 'ugc',

  'blog-posts': 'blog',
  'featured-blog': 'blog',
  'contact-form': 'contact',
  'custom-html': 'custom',

  // one-off named sections
  hp: 'page',
  'hero-commerce': 'hero',
  'hero-storytelling-luxury': 'hero',
  'hero-editorial': 'hero',
  'parallax-image': 'hero',
  'video-modal': 'hero',

  'bento-tiles': 'collection',
  'featured-categories': 'collection',
  'collection-mosaic': 'collection',

  deals: 'product-grid',
  'product-spotlight': 'product-grid',
  'shoppable-lookbook': 'product-grid',

  'cta-band': 'announcement',
  'marquee-brutalist': 'announcement',
  countdown: 'announcement',
  'footer-promo': 'announcement',

  'logo-list': 'trust',
  'logo-ticker': 'trust',
  'stats-counter': 'trust',

  'testimonial-cards': 'testimonials',
  'faq-accordion': 'faq',
  'newsletter-editorial': 'newsletter',
  'editorial-columns': 'brand-story',

  'grid-masonry-gallery-luxury': 'ugc',
  'instagram-grid': 'ugc',
  gallery: 'ugc',

  'footer-commerce': 'footer',
  'header-commerce': 'header',

  map: 'contact',
  'custom-liquid': 'custom'
};

function roleOf(name) {
  let m = name.match(/^(pdp|pc|cl|cp|ab|cdr|popup)-v\d+$/);
  if (m) return m[1];
  m = name.match(/^hp\d+-(?:\d+-)?(.+)$/);
  if (m) return m[1];
  m = name.match(/^([a-z-]+?)-v\d+$/);
  if (m) return m[1];
  return name;
}

// visual style is only a hint for scoring; derive it from the section name
function styleOf(name, source) {
  const s = (name + ' ' + source.slice(0, 400)).toLowerCase();
  if (/luxur|couture|atelier|opulent/.test(s)) return 'luxury';
  if (/brutal|neo-?brutal|hazard/.test(s)) return 'bold';
  if (/cyber|neon|tech|hud|matrix/.test(s)) return 'tech';
  if (/organic|botanic|eco|natural|clay|herbal/.test(s)) return 'natural';
  if (/minimal|swiss|mono|nordic|japandi/.test(s)) return 'minimal';
  if (/editorial|magazine|serif/.test(s)) return 'editorial';
  return 'minimal';
}

function schemaOf(source) {
  const m = source.match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch (e) { return null; }
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return 0;
  fs.mkdirSync(dest, { recursive: true });
  let n = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) n += copyDir(s, d);
    else { if (!DRY) fs.copyFileSync(s, d); n++; }
  }
  return n;
}

// ------------------------------------------------------------------- run
function main() {
  if (!fs.existsSync(PERI)) throw new Error('dev-theme-peri not found at ' + PERI);
  if (!fs.existsSync(ENGINE)) throw new Error('theme-engine not found at ' + ENGINE);

  // 1. shared dependencies — sections are useless without these
  const nSnip = copyDir(path.join(PERI, 'snippets'), path.join(BASE, 'snippets'));
  const nAsset = copyDir(path.join(PERI, 'assets'), path.join(BASE, 'assets'));
  const nLocale = copyDir(path.join(PERI, 'locales'), path.join(BASE, 'locales'));
  for (const f of ['layout/theme.liquid', 'config/settings_schema.json']) {
    const s = path.join(PERI, f), d = path.join(BASE, f);
    if (fs.existsSync(s)) {
      fs.mkdirSync(path.dirname(d), { recursive: true });
      if (!DRY) fs.copyFileSync(s, d);
    }
  }
  console.log(`base-theme: ${nSnip} snippets, ${nAsset} assets, ${nLocale} locales, layout + settings_schema`);

  // 2. existing registry — keep hand-written entries we do not overwrite
  const prev = JSON.parse(fs.readFileSync(REGISTRY, 'utf-8'));
  if (!DRY) fs.copyFileSync(REGISTRY, REGISTRY + '.bak');

  const synced = [];
  const skipped = [];
  const byType = {};

  const files = fs.readdirSync(path.join(PERI, 'sections')).filter(f => f.endsWith('.liquid')).sort();

  for (const file of files) {
    const id = file.replace(/\.liquid$/, '');
    const source = fs.readFileSync(path.join(PERI, 'sections', file), 'utf-8');

    const schema = schemaOf(source);

    // A section with no preset cannot be added by the customizer or the engine,
    // but it may still be required — template-bound `main-*` sections, and
    // Section Rendering API endpoints that JS fetches by `?section_id=`.
    // Those belong in base-theme/sections/, not in the component registry.
    if (!schema || !schema.presets) {
      const reason = !schema ? 'no schema' : 'no preset';
      const dest = path.join(BASE, 'sections', file);
      if (!DRY) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(path.join(PERI, 'sections', file), dest);
      }
      skipped.push([id, `${reason} — copied to base-theme instead`]);
      continue;
    }

    const role = roleOf(id);
    const type = TYPE_MAP[role] || 'custom';
    const style = styleOf(id, source);

    const destDir = path.join(COMPONENTS, type);
    if (!DRY) {
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(path.join(PERI, 'sections', file), path.join(destDir, file));
    }

    const meta = {
      componentId: id,
      type,
      sectionType: type,
      visualStyle: style,
      family: 'Universal',
      archetypes: ['premium', 'modern', 'clinical', 'organic', 'bold'],
      compatibleSlots: [],
      status: 'production',
      version: 1,
      source: 'dev-theme-peri',
      schemaName: schema.name || id,
      settingsCount: (schema.settings || []).length,
      blocksCount: (schema.blocks || []).length
    };
    if (!DRY) {
      fs.writeFileSync(path.join(destDir, id + '.meta.json'), JSON.stringify(meta, null, 2));
    }

    synced.push({
      componentId: id,
      type,
      liquidPath: `components/${type}/${file}`,
      metaPath: `components/${type}/${id}.meta.json`,
      visualStyle: style,
      family: 'Universal',
      archetypes: meta.archetypes,
      compatibleSlots: [],
      status: 'production',
      version: 1,
      sectionType: type,
      designDirection: style,
      layoutVariant: style,
      source: 'dev-theme-peri'
    });

    byType[type] = (byType[type] || 0) + 1;
  }

  // keep any hand-written entry whose id we did not just sync
  const syncedIds = new Set(synced.map(c => c.componentId));
  const kept = (prev.components || []).filter(c => !syncedIds.has(c.componentId));

  const registry = {
    ...prev,
    lastUpdated: new Date().toISOString().slice(0, 10),
    components: [...kept, ...synced]
  };

  if (!DRY) fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 2));

  // 3. Rebuild chassis-manifest.json — verify-registry.ts treats any file in
  //    base-theme that is not listed here as untracked and fails the build.
  const crypto = require('crypto');
  const manifestPath = path.join(BASE, 'chassis-manifest.json');
  const manifestFiles = [];
  const walkBase = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walkBase(full); continue; }
      const rel = path.relative(ENGINE, full).replace(/\\/g, '/');
      if (rel.endsWith('chassis-manifest.json')) continue;
      const content = fs.readFileSync(full, 'utf-8').replace(/\r\n/g, '\n');
      manifestFiles.push({
        file: rel,
        hash: crypto.createHash('sha256').update(content).digest('hex')
      });
    }
  };
  if (fs.existsSync(BASE)) walkBase(BASE);
  if (!DRY) {
    const prevManifest = fs.existsSync(manifestPath)
      ? JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
      : { version: '1.0.0', description: 'Base chassis files tracked by verify-registry' };
    fs.writeFileSync(manifestPath, JSON.stringify({
      ...prevManifest,
      lastUpdated: new Date().toISOString().slice(0, 10),
      files: manifestFiles.sort((a, b) => a.file.localeCompare(b.file))
    }, null, 2));
  }
  console.log(`chassis-manifest: ${manifestFiles.length} files tracked`);

  console.log(`\nsynced   ${synced.length} sections`);
  console.log(`kept     ${kept.length} existing registry entries`);
  console.log(`skipped  ${skipped.length}`);
  console.log('\nby engine type:');
  Object.entries(byType).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => console.log(`   ${t.padEnd(18)} ${n}`));
  if (skipped.length) {
    console.log('\nskipped:');
    skipped.slice(0, 20).forEach(([id, why]) => console.log(`   ${id} — ${why}`));
    if (skipped.length > 20) console.log(`   …and ${skipped.length - 20} more`);
  }
  if (DRY) console.log('\n(dry run — nothing written)');
}

main();
