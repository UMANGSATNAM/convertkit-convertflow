import * as fs from 'fs/promises';
import * as path from 'path';

const ROOT = process.cwd();
const DEV_THEME = path.join(ROOT, 'dev-theme-peri');
const THEME_ENGINE = path.join(ROOT, 'app/data/templates/theme-engine');
const BASE_THEME = path.join(THEME_ENGINE, 'base-theme');
const COMPONENTS = path.join(THEME_ENGINE, 'components');
const TOKENS = path.join(THEME_ENGINE, 'tokens');
const ASSETS = path.join(BASE_THEME, 'assets');

async function processFile(srcFile: string, destFile: string) {
  let content = await fs.readFile(srcFile, 'utf-8');
  
  // Neutralize fallbacks
  content = content.replace(/AURELLE BEAUTY/g, 'YOUR BRAND');
  content = content.replace(/Botanical Formula Showcase/g, 'Signature Collection');
  content = content.replace(/Botanical Formula/g, 'Signature Collection');

  // Neutralize inline colors to use CSS vars where appropriate
  // (Specific to the fallback block in hero and product card)
  content = content.replace(/background:\s*linear-gradient\([^)]+#f8fafc\s*0%,\s*#f1f5f9\s*100%\)/g, 'background: linear-gradient(135deg, var(--surface) 0%, var(--bg-base) 100%)');
  content = content.replace(/background:\s*linear-gradient\([^)]+#ffffff\s*0%,\s*#f8fafc\s*100%\)/g, 'background: linear-gradient(135deg, var(--surface) 0%, var(--bg-base) 100%)');
  content = content.replace(/#f8fafc/g, 'var(--bg-base)');
  content = content.replace(/#f1f5f9/g, 'var(--border)');
  content = content.replace(/#ffffff/g, 'var(--surface)');
  
  await fs.mkdir(path.dirname(destFile), { recursive: true });
  await fs.writeFile(destFile, content);
}

async function main() {
  console.log("Starting Atomic Sync Phase 2...");

  // 1. Sync Missing Sections
  const sections = [
    { src: 'sections/announcement-bar-v2.liquid', dest: path.join(COMPONENTS, 'announcement/announcement-commerce-v2.liquid') },
    { src: 'sections/cta-band-v2.liquid', dest: path.join(COMPONENTS, 'trust/cta-band-commerce-v2.liquid') },
    { src: 'sections/deals-v2.liquid', dest: path.join(COMPONENTS, 'product-grid/deals-commerce-v2.liquid') },
    { src: 'sections/featured-categories-v2.liquid', dest: path.join(COMPONENTS, 'product-grid/featured-categories-commerce-v2.liquid') },
    { src: 'sections/header-commerce-v2.liquid', dest: path.join(COMPONENTS, 'header/header-commerce-v2.liquid') },
    { src: 'sections/hero-commerce-v2.liquid', dest: path.join(COMPONENTS, 'hero/hero-commerce-v2.liquid') },
    { src: 'sections/why-choose-us-v2.liquid', dest: path.join(COMPONENTS, 'trust/why-choose-us-commerce-v2.liquid') },
    // Also re-sync product and previous ones to apply neutralization
    { src: 'sections/main-product.liquid', dest: path.join(BASE_THEME, 'sections/main-product.liquid') },
    { src: 'sections/testimonials-commerce-v2.liquid', dest: path.join(COMPONENTS, 'testimonials/testimonials-commerce-v2.liquid') },
    { src: 'sections/footer-commerce-v2.liquid', dest: path.join(COMPONENTS, 'footer/footer-commerce-v2.liquid') }
  ];

  for (const s of sections) {
    try {
      await processFile(path.join(DEV_THEME, s.src), s.dest);
      console.log(`Synced & neutralized: ${s.src}`);
    } catch (e) {
      console.error(`Failed to process ${s.src}: ${e}`);
    }
  }

  // 2. Sync Snippets
  const snippets = [
    'product-card.liquid',
    'price.liquid',
    'cod-badge.liquid',
    'gst-note.liquid',
    'trust-strip.liquid',
    'upi-badge.liquid',
    'whatsapp-cta.liquid',
    'icon-account.liquid', 'icon-cart.liquid', 'icon-check.liquid', 'icon-chevron.liquid', 'icon-close.liquid',
    'icon-facebook.liquid', 'icon-heart.liquid', 'icon-instagram.liquid', 'icon-minus.liquid', 'icon-pinterest.liquid',
    'icon-plus.liquid', 'icon-search.liquid', 'icon-star.liquid', 'icon-tiktok.liquid', 'icon-twitter.liquid', 'icon-youtube.liquid'
  ];

  for (const snippet of snippets) {
    try {
      await processFile(path.join(DEV_THEME, 'snippets', snippet), path.join(BASE_THEME, 'snippets', snippet));
      console.log(`Synced snippet: ${snippet}`);
    } catch (e) {
      console.error(`Failed to process ${snippet}: ${e}`);
    }
  }

  // 3. Deepen Tokens
  await fs.mkdir(TOKENS, { recursive: true });
  await fs.mkdir(ASSETS, { recursive: true });

  const freshCss = await fs.readFile(path.join(DEV_THEME, 'assets/design-language-fresh.css'), 'utf-8');

  const tokenSets = [
    { name: 'design-tokens-inter.css', font: "'Inter', sans-serif", primary: '#0F5132', hover: '#146c43', bg: '#FDFBF7', surface: '#FFFFFF', border: '#EAEAEA', text: '#1C1C1C', textMuted: '#6B6B6B', card: '16px', pill: '999px', shadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' },
    { name: 'design-tokens-poppins.css', font: "'Poppins', sans-serif", primary: '#2A5C82', hover: '#1c3e58', bg: '#F4F7F6', surface: '#FFFFFF', border: '#DFE3E8', text: '#212B36', textMuted: '#637381', card: '24px', pill: '999px', shadow: '0 8px 16px 0 rgba(42,92,130,0.1)' },
    { name: 'design-tokens-montserrat.css', font: "'Montserrat', sans-serif", primary: '#8C5A40', hover: '#6e442f', bg: '#FAF7F2', surface: '#FFFDFC', border: '#E2D9C8', text: '#3A2A22', textMuted: '#7A6A62', card: '4px', pill: '4px', shadow: '0 2px 4px 0 rgba(140,90,64,0.1)' },
    { name: 'design-tokens-outfit.css', font: "'Outfit', sans-serif", primary: '#00695C', hover: '#004d40', bg: '#F8FAFC', surface: '#FFFFFF', border: '#E2E8F0', text: '#0F172A', textMuted: '#64748B', card: '8px', pill: '8px', shadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)' },
    { name: 'design-tokens-manrope.css', font: "'Manrope', sans-serif", primary: '#4527A0', hover: '#311b92', bg: '#FAFAFA', surface: '#F0F0F0', border: '#E0E0E0', text: '#212121', textMuted: '#757575', card: '0px', pill: '0px', shadow: 'none' }
  ];

  for (const token of tokenSets) {
    let content = freshCss;
    content = content.replace(/--primary: [^;]+;/g, `--primary: ${token.primary};`);
    content = content.replace(/--primary-hover: [^;]+;/g, `--primary-hover: ${token.hover};`);
    content = content.replace(/--bg-base: [^;]+;/g, `--bg-base: ${token.bg};`);
    content = content.replace(/--surface: [^;]+;/g, `--surface: ${token.surface};`);
    content = content.replace(/--border: [^;]+;/g, `--border: ${token.border};`);
    content = content.replace(/--text-main: [^;]+;/g, `--text-main: ${token.text};`);
    content = content.replace(/--text-muted: [^;]+;/g, `--text-muted: ${token.textMuted};`);
    content = content.replace(/--radius-card: [^;]+;/g, `--radius-card: ${token.card};`);
    content = content.replace(/--radius-pill: [^;]+;/g, `--radius-pill: ${token.pill};`);
    content = content.replace(/--shadow-md: [^;]+;/g, `--shadow-md: ${token.shadow};`);
    content = content.replace(/--font-family: [^;]+;/g, `--font-family: ${token.font};`);

    // Write to library tokens
    await fs.writeFile(path.join(TOKENS, token.name), content);
    // Write to base-theme assets so asset_url can resolve it
    await fs.writeFile(path.join(ASSETS, token.name), content);
    console.log(`Generated deepened token set: ${token.name}`);
  }

  // 4. Update Schema
  const schemaPath = path.join(BASE_THEME, 'config/settings_schema.json');
  let schemaData = JSON.parse(await fs.readFile(schemaPath, 'utf-8'));
  
  // Find or insert Design Token setting in the first block (Theme Info) or a new block
  let layoutBlock = schemaData.find((b: any) => b.name === "Layout");
  if (layoutBlock) {
    const hasToken = layoutBlock.settings.find((s: any) => s.id === "design_token");
    if (!hasToken) {
      layoutBlock.settings.unshift({
        "type": "select",
        "id": "design_token",
        "label": "Design Token Set",
        "options": [
          { "value": "design-tokens-inter", "label": "Inter (Natural)" },
          { "value": "design-tokens-poppins", "label": "Poppins (Modern)" },
          { "value": "design-tokens-montserrat", "label": "Montserrat (Warm)" },
          { "value": "design-tokens-outfit", "label": "Outfit (Tech)" },
          { "value": "design-tokens-manrope", "label": "Manrope (Luxury)" }
        ],
        "default": "design-tokens-inter"
      });
      await fs.writeFile(schemaPath, JSON.stringify(schemaData, null, 2));
      console.log("Updated settings_schema.json with design_token setting.");
      
      // Also update dev-theme-peri to keep in sync
      const devSchemaPath = path.join(DEV_THEME, 'config/settings_schema.json');
      if (fs.stat(devSchemaPath).catch(() => false)) {
        await fs.writeFile(devSchemaPath, JSON.stringify(schemaData, null, 2));
      }
    }
  }

  console.log("Phase 2 complete.");
}

main().catch(console.error);
