const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 1024 } });
  
  // Manrope
  const page1 = await context.newPage();
  await page1.goto('https://peri-beauty-bcuauhsj.myshopify.com?preview_theme_id=163187163365');
  await page1.waitForTimeout(5000); // Wait for animations
  await page1.screenshot({ path: path.join(__dirname, '../manrope.png') });
  
  // Poppins
  const page2 = await context.newPage();
  await page2.goto('https://peri-beauty-bcuauhsj.myshopify.com?preview_theme_id=163187228901');
  await page2.waitForTimeout(5000);
  await page2.screenshot({ path: path.join(__dirname, '../poppins.png') });

  await browser.close();
  console.log("Screenshots captured successfully.");
})();
