const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  
  // Desktop
  const contextDesktop = await browser.newContext({ viewport: { width: 1440, height: 1080 } });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.goto('https://peri-beauty-bcuauhsj.myshopify.com?preview_theme_id=162941599973', { waitUntil: 'networkidle' });
  
  // Check if password page
  if (await pageDesktop.locator('input[type="password"]').count() > 0) {
    await pageDesktop.fill('input[type="password"]', 'uriepa');
    await pageDesktop.keyboard.press('Enter');
    await pageDesktop.waitForNavigation({ waitUntil: 'networkidle' });
  }

  // Remove the shopify admin bar if it appears
  await pageDesktop.evaluate(() => {
    const adminBar = document.getElementById('preview-bar-iframe');
    if (adminBar) adminBar.remove();
  });
  
  await pageDesktop.screenshot({ path: 'C:\\Users\\onwer\\.gemini\\antigravity-ide\\brain\\f27b8253-d194-457b-9ccb-e08d94cf68dd\\homepage_top_1440px_v2.png', fullPage: false });
  await pageDesktop.screenshot({ path: 'C:\\Users\\onwer\\.gemini\\antigravity-ide\\brain\\f27b8253-d194-457b-9ccb-e08d94cf68dd\\hero_full_1440px_v2.png', fullPage: true });

  // Mobile
  const contextMobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('https://peri-beauty-bcuauhsj.myshopify.com?preview_theme_id=162941599973', { waitUntil: 'networkidle' });
  
  await pageMobile.evaluate(() => {
    const adminBar = document.getElementById('preview-bar-iframe');
    if (adminBar) adminBar.remove();
  });
  await pageMobile.screenshot({ path: 'C:\\Users\\onwer\\.gemini\\antigravity-ide\\brain\\f27b8253-d194-457b-9ccb-e08d94cf68dd\\homepage_top_390px_v2.png', fullPage: false });

  await browser.close();
  console.log('Screenshots saved!');
})();
