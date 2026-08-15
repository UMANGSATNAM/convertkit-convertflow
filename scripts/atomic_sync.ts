import * as fs from 'fs/promises';
import * as path from 'path';

const ROOT = process.cwd();
const DEV_THEME = path.join(ROOT, 'dev-theme-peri');
const THEME_ENGINE = path.join(ROOT, 'app/data/templates/theme-engine');
const BASE_THEME = path.join(THEME_ENGINE, 'base-theme');
const COMPONENTS = path.join(THEME_ENGINE, 'components');
const TOKENS = path.join(THEME_ENGINE, 'tokens');

async function main() {
  console.log("Starting Atomic Sync...");

  // 1. Copy Components
  const copies = [
    { src: 'sections/main-product.liquid', dest: path.join(BASE_THEME, 'sections/main-product.liquid') },
    { src: 'snippets/block-pdp-quantity-selector.liquid', dest: path.join(BASE_THEME, 'snippets/block-pdp-quantity-selector.liquid') },
    { src: 'sections/testimonials-commerce-v2.liquid', dest: path.join(COMPONENTS, 'testimonials/testimonials-commerce-v2.liquid') },
    { src: 'sections/footer-commerce-v2.liquid', dest: path.join(COMPONENTS, 'footer/footer-commerce-v2.liquid') },
  ];

  for (const copy of copies) {
    const srcPath = path.join(DEV_THEME, copy.src);
    await fs.mkdir(path.dirname(copy.dest), { recursive: true });
    await fs.copyFile(srcPath, copy.dest);
    console.log(`Copied ${copy.src} to ${copy.dest}`);
  }

  // 2. Generate 5 Token Sets
  await fs.mkdir(TOKENS, { recursive: true });
  const freshCss = await fs.readFile(path.join(DEV_THEME, 'assets/design-language-fresh.css'), 'utf-8');

  const tokenSets = [
    { name: 'design-tokens-inter.css', primary: '#0F5132', font: "'Inter', sans-serif" },
    { name: 'design-tokens-poppins.css', primary: '#2A5C82', font: "'Poppins', sans-serif" },
    { name: 'design-tokens-montserrat.css', primary: '#5D4037', font: "'Montserrat', sans-serif" },
    { name: 'design-tokens-outfit.css', primary: '#00695C', font: "'Outfit', sans-serif" },
    { name: 'design-tokens-manrope.css', primary: '#4527A0', font: "'Manrope', sans-serif" }
  ];

  for (const token of tokenSets) {
    let content = freshCss.replace(/--primary: #[0-9A-Fa-f]+;/g, `--primary: ${token.primary};`);
    content = content.replace(/--font-family: [^;]+;/g, `--font-family: ${token.font};`);
    await fs.writeFile(path.join(TOKENS, token.name), content);
    console.log(`Generated token set: ${token.name}`);
  }

  // 3. Update chassis theme.liquid to use loader
  const themePath = path.join(BASE_THEME, 'layout/theme.liquid');
  let themeContent = await fs.readFile(themePath, 'utf-8');
  themeContent = themeContent.replace(/\{\{\s*'design-language-fresh\.css'\s*\|\s*asset_url\s*\|\s*stylesheet_tag\s*\}\}/g, "{% render 'token-loader' %}");
  await fs.writeFile(themePath, themeContent);
  console.log("Updated theme.liquid to use token-loader.");

  // 4. Create token-loader.liquid snippet
  const loaderPath = path.join(BASE_THEME, 'snippets/token-loader.liquid');
  const loaderContent = `{%- comment -%}
  Token Loader: Dynamically loads the selected token CSS based on settings.
{%- endcomment -%}
{%- assign token_file = settings.design_token | default: 'design-tokens-inter' | append: '.css' -%}
{{ token_file | asset_url | stylesheet_tag }}`;
  await fs.writeFile(loaderPath, loaderContent);
  console.log("Created token-loader.liquid snippet.");

  console.log("Atomic Sync completed successfully.");
}

main().catch(console.error);
