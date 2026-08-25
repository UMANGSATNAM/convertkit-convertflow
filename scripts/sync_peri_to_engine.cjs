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

// Style → design family. Sections in the same family are safe to combine,
// which is what lets a generated store read as one brand.
const FAMILY_OF = {
  luxury: 'Luxury',
  editorial: 'Editorial',
  minimal: 'Minimal',
  natural: 'Natural',
  bold: 'Bold',
  tech: 'Tech'
};

function roleOf(name) {
  let m = name.match(/^(pdp|pc|cl|cp|ab|cdr|popup)(?:-[a-z0-9-]+)?$/);
  if (m) return m[1];
  m = name.match(/^hp\d+-(?:\d+-)?(.+)$/);
  if (m) return m[1];
  m = name.match(/^([a-z-]+?)-v\d+$/);
  if (m) return m[1];
  return name;
}

// ── Metadata derivation ────────────────────────────────────────────────
// Read the section's own CSS and copy, not just its filename. The retrieval
// engine scores 20% on archetype match and filters on visualStyle, so if every
// section carries the same values the scoring goes flat and the engine ends up
// ignoring most of the library.

function signals(source) {
  const css = (source.match(/<style[^>]*>[\s\S]*?<\/style>/g) || []).join('\n') +
              (source.match(/{%-?\s*style\s*-?%}[\s\S]*?{%-?\s*endstyle\s*-?%}/g) || []).join('\n');
  const fonts = (css.match(/font-family:\s*([^;}]+)/g) || []).join(' ').toLowerCase();
  const radii = (css.match(/border-radius:\s*(\d+)px/g) || [])
    .map(r => parseInt(r.match(/(\d+)/)[1], 10));
  const weights = (css.match(/font-weight:\s*(\d{3})/g) || [])
    .map(w => parseInt(w.match(/(\d{3})/)[1], 10));
  return {
    css,
    fonts,
    avgRadius: radii.length ? radii.reduce((a, b) => a + b, 0) / radii.length : 0,
    maxWeight: weights.length ? Math.max(...weights) : 400,
    serif: /playfair|cormorant|garamond|georgia|baskerville|didot|serif/.test(fonts),
    mono: /courier|mono|space mono|ibm plex mono/.test(fonts),
    heavy: /impact|arial black|anton|bebas|oswald|orbitron|rajdhani/.test(fonts),
    uppercase: (css.match(/text-transform:\s*uppercase/g) || []).length,
    letterSpaced: (css.match(/letter-spacing:\s*[1-9]/g) || []).length,
    glass: /backdrop-filter/.test(css),
    heavyShadow: (css.match(/box-shadow:[^;}]*\b(1[5-9]|[2-9]\d)px/g) || []).length
  };
}

// Visual style drives the style-family lock, so it must reflect how the section
// actually looks — fonts and shape carry more signal than any keyword.
/**
 * Reads the palette a section was authored with.
 *
 * The colours that matter are the ones in the section's own `{% schema %}`
 * defaults — those are what the designer chose, and unlike the CSS they are not
 * mixed in with greys for borders and shadows.
 *
 * Returns average saturation and lightness plus a hue histogram, all on 0–1
 * except hue which is degrees.
 */
function paletteSignals(source) {
  const schemaMatch = source.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
  const hexes = [];
  if (schemaMatch) {
    for (const m of schemaMatch[1].matchAll(/"default"\s*:\s*"(#[0-9a-fA-F]{6})"/g)) hexes.push(m[1]);
  }
  // Fall back to literal hex in the CSS when a section hardcodes its palette.
  if (hexes.length < 3) {
    for (const m of source.matchAll(/#([0-9a-fA-F]{6})\b/g)) hexes.push('#' + m[1]);
  }

  const hsl = [];
  for (const hex of hexes.slice(0, 40)) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    let h = 0;
    if (d !== 0) {
      if (max === r) h = 60 * (((g - b) / d) % 6);
      else if (max === g) h = 60 * ((b - r) / d + 2);
      else h = 60 * ((r - g) / d + 4);
    }
    hsl.push({ h: (h + 360) % 360, s, l });
  }

  // Near-greys carry no hue information and would drag every average toward
  // zero, so hue statistics ignore them.
  const chromatic = hsl.filter(c => c.s > 0.15);
  const avg = (arr, key) => (arr.length ? arr.reduce((a, c) => a + c[key], 0) / arr.length : 0);
  const share = (lo, hi) =>
    chromatic.length
      ? chromatic.filter(c => (lo < hi ? c.h >= lo && c.h < hi : c.h >= lo || c.h < hi)).length / chromatic.length
      : 0;

  return {
    count: hsl.length,
    saturation: avg(chromatic, 's'),
    lightness: avg(hsl, 'l'),
    chromaticShare: hsl.length ? chromatic.length / hsl.length : 0,
    earthy: share(20, 60) + share(60, 160) * 0.9,   // terracotta, ochre, sage, forest
    cool: share(180, 260),                           // cyan through blue
    hot: share(340, 20) + share(0, 20),              // red / signal orange
  };
}

/**
 * Classifies a section into a style family.
 *
 * ## Why this is not font-based any more
 *
 * The first version keyed off font names and `backdrop-filter`. Both signals are
 * dead in this library:
 *
 *   - Sections declare `font-family: var(--font-body)` — correct practice, but it
 *     means the font tells you about the *theme*, not the section. Every serif
 *     and mono test silently returned false.
 *   - `backdrop-filter` appears on sticky filter bars and overlay headers, which
 *     is a functional touch, not a style statement. It was the only rule still
 *     firing, so it swept 66 of the 70 collection layouts into "tech" and left
 *     every other family with no collection page at all.
 *
 * What sections *do* author literally is colour and radius, so those lead now.
 * Fonts and glass remain, demoted to tie-breaks.
 */
function styleOf(name, source) {
  const s = signals(source);
  const p = paletteSignals(source);
  const text = (name + ' ' + source.slice(0, 600)).toLowerCase();

  // Explicit intent in the section's own name or header comment beats inference.
  if (/cyber|neon|hud|matrix|terminal|glitch/.test(text)) return 'tech';
  if (/brutal|hazard|graffiti|punk/.test(text)) return 'bold';
  if (/organic|botanic|eco|natural|clay|herbal|wellness|ayurved|artisan/.test(text)) return 'natural';
  if (/luxur|couture|atelier|heritage|bespoke/.test(text)) return 'luxury';
  if (/editorial|magazine|journal|lookbook/.test(text)) return 'editorial';

  // Real typographic evidence, when a section hardcodes a face rather than
  // inheriting the theme token.
  if (s.mono) return 'tech';
  if (s.heavy && s.uppercase >= 2) return 'bold';
  if (s.serif) return s.letterSpaced >= 1 ? 'luxury' : 'editorial';

  // Colour-led classification. Ordered most-distinctive first.
  if (p.count >= 3) {
    // Dark surfaces with cool accents read as tech regardless of type.
    if (p.lightness < 0.35 && p.cool > 0.3) return 'tech';
    // Loud and square is bold; loud and round is playful, which lives here too.
    if (p.saturation > 0.6 && p.hot > 0.35) return 'bold';
    // Greens and earths are the natural family's whole identity.
    if (p.earthy > 0.45 && p.saturation > 0.15) return 'natural';
    // Restrained palettes split on ornamentation: spaced-out capitals are
    // luxury, plain is minimal.
    if (p.saturation < 0.3 && p.chromaticShare < 0.5) {
      if (s.uppercase >= 2 && s.letterSpaced >= 1) return 'luxury';
      if (s.avgRadius <= 4) return 'editorial';
      return 'minimal';
    }
    if (p.cool > 0.5) return 'tech';
  }

  // Shape as a last resort.
  if (s.avgRadius >= 16) return 'natural';
  if (s.avgRadius <= 2 && s.maxWeight >= 700) return 'bold';
  if (s.glass) return 'tech';
  return 'minimal';
}

// Which industries this section reads as, taken from the words it ships with.
// A section defaulting to "Botanical Ritual" belongs to beauty; one defaulting
// to "Iberian Terracotta" belongs to home-decor.
// Word boundaries matter here. Without them "cat" matches inside "category" and
// "catalog", "pet" matches "competitor", and "ring" matches "during" — which is
// how a first pass tagged 239 sections as pet supplies.
const INDUSTRY_WORDS = {
  beauty: /\b(serum|skincare|botanical|dermatolog|cleanser|moisturis|moisturiz|cosmetic|fragrance|spf|k-beauty|complexion)\b/,
  fashion: /\b(apparel|denim|t-?shirt|kurta|saree|streetwear|wardrobe|size guide|selvedge|couture|outfit|footwear)\b/,
  jewellery: /\b(jewel(le)?ry|necklace|earring|carat|pendant|bangle|gemstone|18k|22k)\b/,
  electronics: /\b(keyboard|headphone|charger|gadget|battery|wireless|magsafe|earbud|smartwatch|processor)\b/,
  'home-decor': /\b(decor|vase|cushion|ceramic|terracotta|candle|furniture|bedding|homeware|tableware)\b/,
  food: /\b(coffee|espresso|snack|beverage|roast|gourmet|bakery|sourdough|gelato|chocolate|brew)\b/,
  wellness: /\b(supplement|vitamin|nutrition|protein|ayurved\w*|nootropic|electrolyte|probiotic|wellness)\b/,
  pets: /\b(dog|puppy|kibble|veterinar\w*|pet food|pet care)\b/
};

/**
 * Section types that are structurally the same whatever the store sells.
 *
 * A header is a header on a jewellery store and on a coffee store. But these
 * sections still ship *sample copy*, and one stray word in it was enough to
 * lock them to a niche: `hp11-header` was tagged fashion, `cdr-v19` fashion,
 * `footer-commerce-v2` beauty. On any other store those then scored 0 on the
 * 30-point compatibility axis and lost to worse components.
 *
 * They keep whatever affinity their copy suggests — that still earns the
 * 25-point exact match on a matching store — but `universal` is always added
 * so they are never disqualified elsewhere.
 */
const INDUSTRY_AGNOSTIC_TYPES = new Set([
  'header', 'footer', 'cart-drawer', 'announcement', 'popup',
  'collection-page', 'faq', 'contact', 'newsletter'
]);

function industriesOf(name, source, sectionType) {
  const text = (name + ' ' + source).toLowerCase();
  const hits = Object.entries(INDUSTRY_WORDS)
    .map(([ind, rx]) => [ind, (text.match(new RegExp(rx.source, 'g')) || []).length])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);

  // A section with no industry words is genuinely neutral and should be
  // available everywhere rather than scored against a niche it never mentions.
  if (!hits.length) return ['universal'];

  const out = hits.slice(0, 3).map(([i]) => i);

  if (INDUSTRY_AGNOSTIC_TYPES.has(sectionType)) {
    if (!out.includes('universal')) out.push('universal');
    return out;
  }

  // A single passing mention is not evidence of specialisation — one "necklace"
  // in placeholder copy should not stop a layout being used by a coffee brand.
  const strongest = hits[0][1];
  if (strongest < 2 && !out.includes('universal')) out.push('universal');

  return out;
}

// Archetypes describe brand feel. Derived from density and ornamentation so the
// scoring axis actually separates sections instead of returning a flat value.
/**
 * The only brand archetypes the ranking engine understands.
 *
 * `analyzeBrand` is constrained to return exactly one of these, and
 * retrieval.server.ts scores 20 of the 100 available points by comparing that
 * value against a component's archetype list.
 *
 * This list must stay in step with VALID_ARCHETYPES in
 * app/services/ai/brand-analyzer.server.ts.
 */
const VALID_ARCHETYPES = [
  'modern_minimal',
  'editorial_luxury',
  'playful_modern',
  'technical_performance',
  'heritage_classic',
  'bold_lifestyle',
  'natural_organic',
  'artisan_handcrafted'
];

/**
 * Archetypes for a section, ordered — the first is its primary specialisation.
 *
 * The previous version emitted words like 'premium', 'refined', 'clinical' and
 * 'organic'. None of those are brand archetypes, so for a store analysed as
 * `editorial_luxury` almost every synced component scored 0 on the archetype
 * axis. With the top achievable total sitting around 54 and the accept
 * threshold at 50, losing 20 points there was the difference between a section
 * being used and being dropped: one real run lost ugc, testimonials, faq and
 * newsletter from the homepage for exactly this reason.
 *
 * Order matters. retrieval.server.ts awards 20 points when a component's *first*
 * archetype matches, and only 12 for a match further down the list.
 */
function archetypesOf(style, s) {
  const map = {
    luxury:    ['editorial_luxury', 'heritage_classic', 'artisan_handcrafted'],
    editorial: ['editorial_luxury', 'modern_minimal', 'heritage_classic'],
    minimal:   ['modern_minimal', 'technical_performance', 'editorial_luxury'],
    natural:   ['natural_organic', 'artisan_handcrafted', 'heritage_classic'],
    bold:      ['bold_lifestyle', 'playful_modern', 'technical_performance'],
    tech:      ['technical_performance', 'modern_minimal', 'bold_lifestyle']
  };

  const out = [...(map[style] || ['modern_minimal'])];

  // Secondary affinities read off the section's own CSS. These land after the
  // primary entries so they can earn the 12-point secondary match without
  // displacing the specialisation the style family established.
  if (s.heavyShadow >= 2 && !out.includes('editorial_luxury')) out.push('editorial_luxury');
  if (s.avgRadius >= 20 && !out.includes('playful_modern')) out.push('playful_modern');
  if (s.uppercase >= 3 && !out.includes('bold_lifestyle')) out.push('bold_lifestyle');

  const cleaned = [...new Set(out)].filter(a => VALID_ARCHETYPES.includes(a));
  return cleaned.length ? cleaned : ['modern_minimal'];
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
  const compat = {};

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
    const sig = signals(source);
    const style = styleOf(id, source);
    const industries = industriesOf(id, source, type);
    const archetypes = archetypesOf(style, sig);

    // Sections that share a style AND a design family should be pickable
    // together, which is what the style-family lock relies on.
    const family = FAMILY_OF[style] || 'Universal';

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
      family,
      archetypes,
      industries,
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
      family,
      archetypes,
      industries,
      compatibleSlots: [],
      status: 'production',
      version: 1,
      sectionType: type,
      designDirection: style,
      layoutVariant: style,
      source: 'dev-theme-peri'
    });

    compat[id] = { archetypes, industries };
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

  // 2b. compatibility.json — the retrieval engine reads this for the 20%
  //     archetype axis. Without an entry a component scores 0 there and will
  //     lose every contest to one that has metadata.
  const compatPath = path.join(ENGINE, 'compatibility.json');
  if (!DRY && fs.existsSync(compatPath)) {
    const prevCompat = JSON.parse(fs.readFileSync(compatPath, 'utf-8'));
    fs.copyFileSync(compatPath, compatPath + '.bak');
    const merged = { ...prevCompat };
    for (const [id, entry] of Object.entries(compat)) merged[id] = entry;
    merged._lastUpdated = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(compatPath, JSON.stringify(merged, null, 2));
  }
  console.log(`compatibility: ${Object.keys(compat).length} entries written`);

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
