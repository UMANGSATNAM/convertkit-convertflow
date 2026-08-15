const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const url = "https://peri-beauty-bcuauhsj.myshopify.com/pages/offers-preview-2?preview_theme_id=162937569509";
  console.log("Navigating to:", url);
  await page.goto(url, { waitUntil: "networkidle" });
  
  if (await page.locator('input[type="password"]').count() > 0) {
    await page.fill('input[type="password"]', 'uriepa');
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle" }),
      page.keyboard.press('Enter')
    ]);
  }
  
  await page.waitForTimeout(2000);
  const outPath = "C:\\Users\\onwer\\.gemini\\antigravity-ide\\brain\\282deb16-bf00-4309-ae52-c7936fdf1587\\offers_preview_2_verified.png";
  await page.screenshot({ path: outPath, fullPage: false });
  console.log("Screenshot saved to:", outPath);
  await browser.close();
}

main().catch(console.error);
