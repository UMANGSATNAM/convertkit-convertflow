/**
 * upgrade-themes.cjs
 * Upgrades Luxe Fashion (Classic) and Velocity Streetwear (Modern) Shopify themes
 * to include a Schema-Driven Architecture with:
 *   - Global Design Tokens (settings_schema.json)
 *   - CSS Variable Bridge (layout/theme.liquid)
 *   - Hyper-Granular Section Controls (hero-slider, announcement-bar, promo-banners, featured-products)
 *
 * Asian Footwears theme is NOT touched.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const THEMES_DIR = path.join(__dirname, '..', 'public', 'themes');
const TEMP_BASE = path.join(os.tmpdir(), 'cf-theme-upgrade');

// ─────────────────────────────────────────────────────────────────────────────
// Theme Configurations
// ─────────────────────────────────────────────────────────────────────────────
const THEMES = {
  classic: {
    sourceZip: 'luxe-fashion-theme-v2.zip',
    outputZip: 'luxe-fashion-theme-v3.zip',
    globalDefaults: { bg_primary: '#faf8f4', accent_1: '#c9a84c', accent_2: '#1c2d4f', text_main: '#2c2c2c', button_radius: 2, border_style_preset: 'thin' },
    sectionDefaults: { font_family_preset: 'serif', heading_size: 40, heading_weight: '600', heading_letter_spacing: 0, body_size: 16, section_bg: '#faf8f4', section_text: '#2c2c2c', section_accent: '#c9a84c', padding_top: 64, padding_bottom: 64, inner_gap: 24 },
    cssRootExtra: `
  --global-font-display: 'Playfair Display', Georgia, serif;
  --global-font-body: 'DM Sans', sans-serif;
  --global-border: 1px solid #e0d8cc;
  --global-shadow: 0 2px 12px rgba(0,0,0,0.06);`
  },
  modern: {
    sourceZip: 'velocity-streetwear-theme-v2.zip',
    outputZip: 'velocity-streetwear-theme-v3.zip',
    globalDefaults: { bg_primary: '#0d0d0d', accent_1: '#39ff14', accent_2: '#ff3366', text_main: '#f5f5f5', button_radius: 0, border_style_preset: 'thick' },
    sectionDefaults: { font_family_preset: 'sans', heading_size: 48, heading_weight: '800', heading_letter_spacing: -1, body_size: 16, section_bg: '#0d0d0d', section_text: '#f5f5f5', section_accent: '#39ff14', padding_top: 64, padding_bottom: 64, inner_gap: 24 },
    cssRootExtra: `
  --global-font-display: 'Oswald', 'Space Grotesk', sans-serif;
  --global-font-body: 'Inter', sans-serif;
  --global-border: 2px solid #39ff14;
  --global-shadow: 0 0 20px rgba(57, 255, 20, 0.15);`
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Design Tokens settings group to inject into settings_schema.json
// ─────────────────────────────────────────────────────────────────────────────
function buildDesignTokensGroup(defaults) {
  return {
    name: 'Design Tokens',
    settings: [
      { type: 'header', content: 'Color Palette' },
      { type: 'color', id: 'bg_primary', label: 'Primary Background', default: defaults.bg_primary },
      { type: 'color', id: 'accent_1', label: 'Accent Color 1', default: defaults.accent_1 },
      { type: 'color', id: 'accent_2', label: 'Accent Color 2', default: defaults.accent_2 },
      { type: 'color', id: 'text_main', label: 'Main Text Color', default: defaults.text_main },
      { type: 'header', content: 'Shape & Buttons' },
      { type: 'range', id: 'button_radius', label: 'Button Corner Radius', min: 0, max: 30, step: 1, unit: 'px', default: defaults.button_radius },
      { type: 'select', id: 'border_style_preset', label: 'Border Thickness', options: [{ value: 'none', label: 'None' }, { value: 'thin', label: 'Thin (1px)' }, { value: 'thick', label: 'Thick (2–4px)' }], default: defaults.border_style_preset }
    ]
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Granular settings to inject into each section's schema
// ─────────────────────────────────────────────────────────────────────────────
function buildGranularSettings(sd, isMarquee = false) {
  const base = [
    { type: 'header', content: '🎨 Typography Overrides' },
    { type: 'select', id: 'font_family_preset', label: 'Section Font', options: [{ value: 'inherit', label: 'Theme Default' }, { value: 'serif', label: 'Serif (Playfair)' }, { value: 'sans', label: 'Sans (Inter)' }, { value: 'display', label: 'Display (Oswald)' }], default: sd.font_family_preset },
    { type: 'range', id: 'heading_size', label: 'Heading Size', min: 20, max: 100, step: 2, unit: 'px', default: sd.heading_size },
    { type: 'select', id: 'heading_weight', label: 'Heading Weight', options: [{ value: '300', label: 'Light' }, { value: '400', label: 'Regular' }, { value: '600', label: 'SemiBold' }, { value: '700', label: 'Bold' }, { value: '800', label: 'ExtraBold' }], default: sd.heading_weight },
    { type: 'range', id: 'heading_letter_spacing', label: 'Letter Spacing', min: -3, max: 12, step: 1, unit: 'px', default: sd.heading_letter_spacing },
    { type: 'range', id: 'body_size', label: 'Body Text Size', min: 12, max: 24, step: 1, unit: 'px', default: sd.body_size },
    { type: 'header', content: '🖌️ Color Overrides (override global)' },
    { type: 'color', id: 'section_bg', label: 'Background Color', default: sd.section_bg },
    { type: 'color', id: 'section_text', label: 'Text Color', default: sd.section_text },
    { type: 'color', id: 'section_accent', label: 'Accent / Highlight Color', default: sd.section_accent },
    { type: 'header', content: '📐 Spacing Controls' },
    { type: 'range', id: 'padding_top', label: 'Top Padding', min: 0, max: 120, step: 8, unit: 'px', default: sd.padding_top },
    { type: 'range', id: 'padding_bottom', label: 'Bottom Padding', min: 0, max: 120, step: 8, unit: 'px', default: sd.padding_bottom },
    { type: 'range', id: 'inner_gap', label: 'Inner Gap', min: 0, max: 64, step: 4, unit: 'px', default: sd.inner_gap }
  ];

  if (isMarquee) {
    base.push(
      { type: 'header', content: '🎬 Animation Controls' },
      { type: 'select', id: 'marquee_speed', label: 'Speed', options: [{ value: 'slow', label: 'Slow (30s)' }, { value: 'normal', label: 'Normal (20s)' }, { value: 'fast', label: 'Fast (10s)' }], default: 'normal' },
      { type: 'select', id: 'marquee_direction', label: 'Direction', options: [{ value: 'left', label: '← Left' }, { value: 'right', label: 'Right →' }], default: 'left' },
      { type: 'select', id: 'hover_effect', label: 'Item Hover Effect', options: [{ value: 'none', label: 'None' }, { value: 'scale', label: 'Scale Up' }, { value: 'lift', label: 'Lift' }, { value: 'glow', label: 'Glow' }], default: 'none' }
    );
  }
  return base;
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS Variable Bridge style block to prepend to each section
// ─────────────────────────────────────────────────────────────────────────────
function buildStyleBlock(isMarquee = false) {
  const marqueeExtra = isMarquee ? `
  {% assign marquee_dur = '20s' %}
  {% if section.settings.marquee_speed == 'slow' %}{% assign marquee_dur = '30s' %}{% elsif section.settings.marquee_speed == 'fast' %}{% assign marquee_dur = '10s' %}{% endif %}` : '';

  const marqueeStyle = isMarquee ? `
  #shopify-section-{{ section.id }} .marquee-track { animation-duration: {{ marquee_dur }};{% if section.settings.marquee_direction == 'right' %}animation-direction: reverse;{% endif %} }
  #shopify-section-{{ section.id }} .marquee-item { transition: transform 0.2s ease, filter 0.2s ease; }
  {% if section.settings.hover_effect == 'scale' %}#shopify-section-{{ section.id }} .marquee-item:hover { transform: scale(1.06); }{% elsif section.settings.hover_effect == 'lift' %}#shopify-section-{{ section.id }} .marquee-item:hover { transform: translateY(-4px); }{% elsif section.settings.hover_effect == 'glow' %}#shopify-section-{{ section.id }} .marquee-item:hover { filter: drop-shadow(0 0 10px var(--section-accent)); }{% endif %}` : '';

  return `{% comment %}── CSS Variable Bridge ──────────────────────────────────────────{% endcomment %}
${marqueeExtra}
{% style %}
  #shopify-section-{{ section.id }} {
    --section-bg: {{ section.settings.section_bg }};
    --section-text: {{ section.settings.section_text }};
    --section-accent: {{ section.settings.section_accent }};
    --section-heading-size: {{ section.settings.heading_size }}px;
    --section-heading-weight: {{ section.settings.heading_weight }};
    --section-letter-spacing: {{ section.settings.heading_letter_spacing }}px;
    --section-body-size: {{ section.settings.body_size }}px;
    --section-pt: {{ section.settings.padding_top }}px;
    --section-pb: {{ section.settings.padding_bottom }}px;
    --section-gap: {{ section.settings.inner_gap }}px;
    --section-font: {% if section.settings.font_family_preset == 'serif' %}'Playfair Display', Georgia, serif{% elsif section.settings.font_family_preset == 'sans' %}Inter, 'Helvetica Neue', sans-serif{% elsif section.settings.font_family_preset == 'display' %}Oswald, 'Space Grotesk', sans-serif{% else %}var(--global-font-body, inherit){% endif %};
    background-color: var(--section-bg, var(--global-bg-primary));
    color: var(--section-text, var(--global-text-main));
    font-family: var(--section-font);
    padding-top: var(--section-pt);
    padding-bottom: var(--section-pb);
  }
  #shopify-section-{{ section.id }} h1,
  #shopify-section-{{ section.id }} h2,
  #shopify-section-{{ section.id }} h3 {
    font-size: var(--section-heading-size);
    font-weight: var(--section-heading-weight);
    letter-spacing: var(--section-letter-spacing);
    color: var(--section-text, var(--global-text-main));
  }
  #shopify-section-{{ section.id }} p {
    font-size: var(--section-body-size);
    color: var(--section-text, var(--global-text-main));
  }
  #shopify-section-{{ section.id }} .btn,
  #shopify-section-{{ section.id }} button:not(.slider-btn) {
    border-radius: var(--global-button-radius, 4px);
    background: var(--section-accent, var(--global-accent-1));
  }
  ${marqueeStyle}
{% endstyle %}

`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Global :root CSS injection for layout/theme.liquid
// ─────────────────────────────────────────────────────────────────────────────
function buildRootCssBlock(config) {
  const d = config.globalDefaults;
  return `
  {%- comment -%}── ConvertFlow Global Design Tokens ──{%- endcomment -%}
  <style>
    :root {
      --global-bg-primary: {{ settings.bg_primary | default: '${d.bg_primary}' }};
      --global-accent-1: {{ settings.accent_1 | default: '${d.accent_1}' }};
      --global-accent-2: {{ settings.accent_2 | default: '${d.accent_2}' }};
      --global-text-main: {{ settings.text_main | default: '${d.text_main}' }};
      --global-button-radius: {{ settings.button_radius | default: ${d.button_radius} }}px;
      --global-border-width: {% if settings.border_style_preset == 'none' %}0px{% elsif settings.border_style_preset == 'thick' %}3px{% else %}1px{% endif %};${config.cssRootExtra}
    }
  </style>
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS variable fallback system to add to assets/theme.css
// ─────────────────────────────────────────────────────────────────────────────
const CSS_VAR_SYSTEM = `
/* ═══════════════════════════════════════════════════════════
   ConvertFlow CSS Variable Bridge — Fallback System
   Sections use their own vars, falling back to global tokens.
═══════════════════════════════════════════════════════════ */
*,
*::before,
*::after { box-sizing: border-box; }

body {
  background-color: var(--global-bg-primary);
  color: var(--global-text-main);
  font-family: var(--global-font-body, sans-serif);
}

a { color: var(--global-accent-1); }

.btn, button.btn {
  background: var(--global-accent-1);
  color: var(--global-bg-primary);
  border-radius: var(--global-button-radius, 4px);
  border: var(--global-border-width, 1px) solid transparent;
  transition: filter 0.2s ease, transform 0.2s ease;
}
.btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

.section-container {
  padding-top: var(--section-pt, 64px);
  padding-bottom: var(--section-pb, 64px);
}

/* Grid gap utility */
.grid-gap { gap: var(--section-gap, 24px); }

/* Heading utility — respects section overrides via CSS vars */
.section-heading {
  font-size: var(--section-heading-size, 2.5rem);
  font-weight: var(--section-heading-weight, 700);
  letter-spacing: var(--section-letter-spacing, 0px);
  color: var(--section-text, var(--global-text-main));
  font-family: var(--section-font, var(--global-font-display, inherit));
}

/* ─── No style leakage: all vars are scoped to #shopify-section-{id} ─── */
`;

// ─────────────────────────────────────────────────────────────────────────────
// Schema modifier — adds granular settings to existing section schema
// ─────────────────────────────────────────────────────────────────────────────
function modifySection(content, granularSettings) {
  const schemaStart = content.indexOf('{% schema %}');
  const schemaEnd = content.indexOf('{% endschema %}');
  if (schemaStart === -1 || schemaEnd === -1) return content;

  const before = content.slice(0, schemaStart);
  const schemaRaw = content.slice(schemaStart + '{% schema %}'.length, schemaEnd).trim();
  const after = content.slice(schemaEnd);

  let schema;
  try {
    schema = JSON.parse(schemaRaw);
  } catch (e) {
    console.warn('  ⚠️  Could not parse schema JSON, skipping schema modification.');
    return content;
  }

  if (!schema.settings) schema.settings = [];
  schema.settings = [...schema.settings, ...granularSettings];

  return before + '{% schema %}\n' + JSON.stringify(schema, null, 2) + '\n{% endschema %}';
}

// ─────────────────────────────────────────────────────────────────────────────
// settings_schema.json modifier — adds Design Tokens group
// ─────────────────────────────────────────────────────────────────────────────
function modifySettingsSchema(content, config) {
  let schema;
  try {
    schema = JSON.parse(content);
  } catch (e) {
    console.warn('  ⚠️  Could not parse settings_schema.json, skipping.');
    return content;
  }
  // Remove any existing Design Tokens group we may have added before
  schema = schema.filter(g => g.name !== 'Design Tokens');
  // Add Design Tokens as second-to-last group (before presets if any)
  schema.push(buildDesignTokensGroup(config.globalDefaults));
  return JSON.stringify(schema, null, 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sections to upgrade [filename, isMarquee]
// ─────────────────────────────────────────────────────────────────────────────
const SECTIONS_TO_UPGRADE = [
  ['sections/hero-slider.liquid', false],
  ['sections/announcement-bar.liquid', true],
  ['sections/promo-banners.liquid', false],
  ['sections/featured-products.liquid', false],
];

// ─────────────────────────────────────────────────────────────────────────────
// Main upgrade function
// ─────────────────────────────────────────────────────────────────────────────
function upgradeTheme(themeKey) {
  const config = THEMES[themeKey];
  const srcZip = path.join(THEMES_DIR, config.sourceZip);
  const outZip = path.join(THEMES_DIR, config.outputZip);
  const workDir = path.join(TEMP_BASE, themeKey);

  console.log(`\n═══ Upgrading ${themeKey.toUpperCase()} theme ═══`);
  console.log(`  Source: ${config.sourceZip}`);
  console.log(`  Output: ${config.outputZip}`);

  // 1. Extract
  if (fs.existsSync(workDir)) fs.rmSync(workDir, { recursive: true, force: true });
  fs.mkdirSync(workDir, { recursive: true });
  execSync(`tar -xf "${srcZip}" -C "${workDir}"`);
  console.log('  ✓ Extracted');

  // 2. Modify settings_schema.json
  const schemaPath = path.join(workDir, 'config', 'settings_schema.json');
  if (fs.existsSync(schemaPath)) {
    const modified = modifySettingsSchema(fs.readFileSync(schemaPath, 'utf8'), config);
    fs.writeFileSync(schemaPath, modified, 'utf8');
    console.log('  ✓ settings_schema.json — Design Tokens group added');
  }

  // 3. Modify layout/theme.liquid — inject :root CSS vars
  const layoutPath = path.join(workDir, 'layout', 'theme.liquid');
  if (fs.existsSync(layoutPath)) {
    let content = fs.readFileSync(layoutPath, 'utf8');
    const headTag = content.indexOf('<head>');
    if (headTag !== -1) {
      content = content.slice(0, headTag + '<head>'.length) + buildRootCssBlock(config) + content.slice(headTag + '<head>'.length);
      fs.writeFileSync(layoutPath, content, 'utf8');
      console.log('  ✓ layout/theme.liquid — :root CSS vars injected');
    }
  }

  // 4. Modify each section
  const granularSettings = buildGranularSettings(config.sectionDefaults);
  const granularSettingsMarquee = buildGranularSettings(config.sectionDefaults, true);

  for (const [sectionFile, isMarquee] of SECTIONS_TO_UPGRADE) {
    const sectionPath = path.join(workDir, sectionFile);
    if (!fs.existsSync(sectionPath)) {
      console.log(`  ⚠️  ${sectionFile} not found, skipping`);
      continue;
    }
    let content = fs.readFileSync(sectionPath, 'utf8');
    // Skip if already upgraded
    if (content.includes('CSS Variable Bridge')) {
      console.log(`  ↷  ${sectionFile} already upgraded`);
      continue;
    }
    // Prepend style block
    content = buildStyleBlock(isMarquee) + content;
    // Add granular schema settings
    content = modifySection(content, isMarquee ? granularSettingsMarquee : granularSettings);
    fs.writeFileSync(sectionPath, content, 'utf8');
    console.log(`  ✓ ${sectionFile} — {% style %} bridge + ${isMarquee ? 'marquee animation + ' : ''}granular schema added`);
  }

  // 5. Prepend CSS var system to assets/theme.css
  const cssPath = path.join(workDir, 'assets', 'theme.css');
  if (fs.existsSync(cssPath)) {
    const existing = fs.readFileSync(cssPath, 'utf8');
    if (!existing.includes('ConvertFlow CSS Variable Bridge')) {
      fs.writeFileSync(cssPath, CSS_VAR_SYSTEM + '\n' + existing, 'utf8');
      console.log('  ✓ assets/theme.css — CSS variable fallback system prepended');
    }
  }

  // 6. Remove old output zip if exists
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

  // 7. Re-pack
  execSync(`tar -a -c -f "${outZip}" *`, { cwd: workDir });
  console.log(`  ✓ Packed → ${config.outputZip}`);

  // Verify
  const listing = execSync(`tar -tf "${outZip}"`).toString();
  const hasThemeLiquid = listing.includes('layout/theme.liquid');
  const hasSchemaJson = listing.includes('config/settings_schema.json');
  console.log(`  ✓ Verify: theme.liquid=${hasThemeLiquid}, settings_schema=${hasSchemaJson}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────────────────────────
try {
  if (fs.existsSync(TEMP_BASE)) fs.rmSync(TEMP_BASE, { recursive: true, force: true });
  fs.mkdirSync(TEMP_BASE, { recursive: true });

  upgradeTheme('classic');
  upgradeTheme('modern');

  console.log('\n✅ Both themes upgraded successfully!');
  console.log('   Luxe Fashion  → luxe-fashion-theme-v3.zip');
  console.log('   Streetwear    → velocity-streetwear-theme-v3.zip');
} catch (err) {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
}
