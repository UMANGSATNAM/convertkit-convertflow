import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEV_THEME = path.join(__dirname, '../dev-theme-peri');

async function main() {
  console.log("Updating settings to Manrope...");
  const settingsPath = path.join(DEV_THEME, 'config/settings_data.json');
  let settings = await fs.readFile(settingsPath, 'utf-8');
  settings = settings.replace(/"design_token":\s*"[^"]+"/, `"design_token": "design-tokens-manrope"`);
  await fs.writeFile(settingsPath, settings);

  // Wait 5 seconds for Shopify CLI to hot-reload the changes
  console.log("Waiting for hot-reload...");
  await new Promise(r => setTimeout(r, 5000));

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 1024 } });
  
  console.log("Loading http://127.0.0.1:9292...");
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:9292');
  
  // Wait for any animations
  await page.waitForTimeout(5000); 
  
  await page.screenshot({ path: path.join(__dirname, '../local_dev_manrope.png'), fullPage: true });

  await browser.close();
  console.log("Screenshot captured successfully.");
}

main().catch(console.error);
