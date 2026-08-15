import * as fs from 'fs/promises';
import * as path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const DEV_THEME = path.join(ROOT, 'dev-theme-peri');

async function main() {
  console.log("Setting up dev-theme-peri for Poppins Share Link...");

  // Update settings to Poppins
  const settingsPath = path.join(DEV_THEME, 'config/settings_data.json');
  let settings = await fs.readFile(settingsPath, 'utf-8');
  settings = settings.replace(/"design_token":\s*"[^"]+"/, `"design_token": "design-tokens-poppins"`);
  await fs.writeFile(settingsPath, settings);

  console.log("Generating Poppins share link...");
  execSync(`npx shopify theme share --path dev-theme-peri`, { stdio: 'inherit' });
}

main().catch(console.error);
