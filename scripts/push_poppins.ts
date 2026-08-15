import * as fs from 'fs/promises';
import * as path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const DEV_THEME = path.join(ROOT, 'dev-theme-peri');

async function main() {
  console.log("Setting up dev-theme-peri for Poppins variation...");

  // Update settings_data.json to use Poppins
  const settingsPath = path.join(DEV_THEME, 'config/settings_data.json');
  let settings = await fs.readFile(settingsPath, 'utf-8');
  settings = settings.replace(/"design_token":\s*"[^"]+"/, `"design_token": "design-tokens-poppins"`);
  await fs.writeFile(settingsPath, settings);
  console.log("Set to POPPINS.");

  // Push to Shopify
  console.log("Pushing Poppins variation...");
  execSync(`npx shopify theme push --path dev-theme-peri --theme 162937569509 --allow-live --json`, { stdio: 'inherit' });
  console.log("Poppins is live! Ready for subagent inspection.");
}

main().catch(console.error);
