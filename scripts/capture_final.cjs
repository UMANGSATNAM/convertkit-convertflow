const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureScreenshots() {
  const storeUrl = "https://peri-beauty-bcuauhsj.myshopify.com?preview_theme_id=162941599973";
  const outputDir = "C:\\Users\\onwer\\.gemini\\antigravity-ide\\brain\\492dc3ab-68b6-4571-8ab6-2a6ebe951cf3";
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  
  try {
    // --- DESKTOP 1440px ---
    console.log("Capturing Desktop 1440px...");
    const contextDesktop = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const pageDesktop = await contextDesktop.newPage();
    await pageDesktop.goto(storeUrl, { waitUntil: "networkidle" });
    
    // Check password page bypass
    if (await pageDesktop.locator('input[type="password"]').count() > 0) {
      await pageDesktop.fill('input[type="password"]', 'uriepa');
      await pageDesktop.keyboard.press('Enter');
      await pageDesktop.waitForNavigation({ waitUntil: "networkidle" });
    }

    // Remove shopify admin preview bar if present
    await pageDesktop.evaluate(() => {
      const adminBar = document.getElementById('preview-bar-iframe');
      if (adminBar) adminBar.remove();
    });

    // Wait a brief moment for animations or fonts
    await pageDesktop.waitForTimeout(2000);

    await pageDesktop.screenshot({ path: path.join(outputDir, "homepage_desktop.png"), fullPage: true });
    
    await contextDesktop.close();

    // --- MOBILE 390px ---
    console.log("Capturing Mobile 390px...");
    const contextMobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });
    const pageMobile = await contextMobile.newPage();
    await pageMobile.goto(storeUrl, { waitUntil: "networkidle" });

    if (await pageMobile.locator('input[type="password"]').count() > 0) {
      await pageMobile.fill('input[type="password"]', 'uriepa');
      await pageMobile.keyboard.press('Enter');
      await pageMobile.waitForNavigation({ waitUntil: "networkidle" });
    }

    await pageMobile.evaluate(() => {
      const adminBar = document.getElementById('preview-bar-iframe');
      if (adminBar) adminBar.remove();
    });
    await pageMobile.waitForTimeout(2000);

    await pageMobile.screenshot({ path: path.join(outputDir, "homepage_mobile.png"), fullPage: true });

    await contextMobile.close();
    console.log("All screenshots captured successfully!");

  } catch (err) {
    console.error("Error capturing screenshots:", err);
  } finally {
    await browser.close();
  }
}

captureScreenshots();
