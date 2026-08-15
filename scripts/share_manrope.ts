import * as fs from 'fs/promises';
import * as path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const DEV_THEME = path.join(ROOT, 'dev-theme-peri');
const BASE = path.join(ROOT, 'app/data/templates/theme-engine/base-theme');
const COMP = path.join(ROOT, 'app/data/templates/theme-engine/components');

async function main() {
  console.log("Setting up dev-theme-peri for Manrope Share Link...");

  // Copy updated files back to dev-theme
  await fs.copyFile(path.join(BASE, 'assets/design-tokens-manrope.css'), path.join(DEV_THEME, 'assets/design-tokens-manrope.css'));
  await fs.copyFile(path.join(BASE, 'assets/design-tokens-poppins.css'), path.join(DEV_THEME, 'assets/design-tokens-poppins.css'));
  await fs.copyFile(path.join(BASE, 'snippets/token-loader.liquid'), path.join(DEV_THEME, 'snippets/token-loader.liquid'));
  
  const componentsToCopy = [
    { src: path.join(COMP, 'hero/hero-commerce-v2.liquid'), dest: path.join(DEV_THEME, 'sections/hero-commerce-v2.liquid') },
    { src: path.join(BASE, 'snippets/product-card.liquid'), dest: path.join(DEV_THEME, 'snippets/product-card.liquid') },
    { src: path.join(BASE, 'snippets/cod-badge.liquid'), dest: path.join(DEV_THEME, 'snippets/cod-badge.liquid') },
    { src: path.join(BASE, 'snippets/whatsapp-cta.liquid'), dest: path.join(DEV_THEME, 'snippets/whatsapp-cta.liquid') }
  ];
  for (const c of componentsToCopy) {
    await fs.copyFile(c.src, c.dest);
  }

  // Update settings to Manrope
  const settingsPath = path.join(DEV_THEME, 'config/settings_data.json');
  let settings = await fs.readFile(settingsPath, 'utf-8');
  settings = settings.replace(/"design_token":\s*"[^"]+"/, `"design_token": "design-tokens-manrope"`);
  await fs.writeFile(settingsPath, settings);

  console.log("Generating Manrope share link...");
  execSync(`npx shopify theme share --path dev-theme-peri`, { stdio: 'inherit' });
}

main().catch(console.error);
