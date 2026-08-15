import { chromium } from 'playwright';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 1024 } });
  
  console.log("Loading http://127.0.0.1:9292...");
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:9292');
  
  // Wait for any animations
  await page.waitForTimeout(5000); 
  
  await page.screenshot({ path: path.join(__dirname, '../local_dev_poppins.png'), fullPage: true });

  await browser.close();
  console.log("Screenshot captured successfully.");
})();
