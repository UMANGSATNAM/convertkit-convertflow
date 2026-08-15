import * as fs from 'fs/promises';
import * as path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const DEV_THEME = path.join(ROOT, 'dev-theme-peri');
const BASE = path.join(ROOT, 'app/data/templates/theme-engine/base-theme');
const COMP = path.join(ROOT, 'app/data/templates/theme-engine/components');

async function main() {
  console.log("Setting up dev-theme-peri for live variation test...");

  // 1. Copy tokens and token-loader back to dev-theme
  await fs.copyFile(path.join(BASE, 'assets/design-tokens-manrope.css'), path.join(DEV_THEME, 'assets/design-tokens-manrope.css'));
  await fs.copyFile(path.join(BASE, 'assets/design-tokens-poppins.css'), path.join(DEV_THEME, 'assets/design-tokens-poppins.css'));
  await fs.copyFile(path.join(BASE, 'snippets/token-loader.liquid'), path.join(DEV_THEME, 'snippets/token-loader.liquid'));

  // 2. Update theme.liquid in dev-theme
  let themeContent = await fs.readFile(path.join(DEV_THEME, 'layout/theme.liquid'), 'utf-8');
  themeContent = themeContent.replace(/\{\{\s*'design-language-fresh\.css'\s*\|\s*asset_url\s*\|\s*stylesheet_tag\s*\}\}/g, "{% render 'token-loader' %}");
  await fs.writeFile(path.join(DEV_THEME, 'layout/theme.liquid'), themeContent);

  // 3. Overwrite sections/snippets in dev-theme with our neutralized components
  const componentsToCopy = [
    { src: path.join(COMP, 'hero/hero-commerce-v2.liquid'), dest: path.join(DEV_THEME, 'sections/hero-commerce-v2.liquid') },
    { src: path.join(BASE, 'snippets/product-card.liquid'), dest: path.join(DEV_THEME, 'snippets/product-card.liquid') },
  ];
  for (const c of componentsToCopy) {
    await fs.copyFile(c.src, c.dest);
  }

  // 4. Update settings_data.json to use Manrope
  const settingsPath = path.join(DEV_THEME, 'config/settings_data.json');
  let settings = JSON.parse(await fs.readFile(settingsPath, 'utf-8'));
  if (!settings.current) settings.current = {};
  settings.current.design_token = "design-tokens-manrope";
  await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
  console.log("Set to MANROPE.");

  // Push to Shopify
  console.log("Pushing Manrope variation...");
  execSync(`npx shopify theme push --path dev-theme-peri --theme 1785012826348 --json`, { stdio: 'inherit' });
  console.log("Manrope is live! Ready for subagent inspection.");
}

main().catch(console.error);
