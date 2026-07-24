const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureFreshScreenshots() {
  const storeUrl = "https://peri-beauty-bcuauhsj.myshopify.com?preview_theme_id=162941599973";
  const collectionUrl = "https://peri-beauty-bcuauhsj.myshopify.com/collections/all?preview_theme_id=162941599973";
  const outputDir = "C:\\Users\\onwer\\.gemini\\antigravity-ide\\brain\\beefebf0-39df-4fc0-a0b1-d8fb27483002";
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Launching browser for Fresh Commerce screenshots...");
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
    await pageDesktop.waitForTimeout(1500);

    // 1. Homepage Top Viewport (1440px)
    await pageDesktop.screenshot({ path: path.join(outputDir, "hero_viewport_1440px.png"), fullPage: false });
    
    // 2. Hero Commerce V2 Element (1440px)
    const heroElemDesktop = pageDesktop.locator('.hero-commerce-v2').first();
    if (await heroElemDesktop.count() > 0) {
      await heroElemDesktop.screenshot({ path: path.join(outputDir, "hero_element_1440px.png") });
    } else {
      console.warn("Could not find .hero-commerce-v2 element on desktop");
    }

    // 3. Collection Page / Product Card (1440px)
    console.log("Navigating to collections page (Desktop 1440px)...");
    await pageDesktop.goto(collectionUrl, { waitUntil: "networkidle" });
    await pageDesktop.evaluate(() => {
      const adminBar = document.getElementById('preview-bar-iframe');
      if (adminBar) adminBar.remove();
    });
    await pageDesktop.waitForTimeout(1500);

    await pageDesktop.screenshot({ path: path.join(outputDir, "collection_grid_1440px.png"), fullPage: false });
    const cardElemDesktop = pageDesktop.locator('.fresh-card').first();
    if (await cardElemDesktop.count() > 0) {
      await cardElemDesktop.screenshot({ path: path.join(outputDir, "product_card_1440px.png") });
    } else {
      console.warn("Could not find .fresh-card element on desktop");
    }

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

    // Check password page bypass on mobile if sessions didn't share
    if (await pageMobile.locator('input[type="password"]').count() > 0) {
      await pageMobile.fill('input[type="password"]', 'uriepa');
      await pageMobile.keyboard.press('Enter');
      await pageMobile.waitForNavigation({ waitUntil: "networkidle" });
    }

    await pageMobile.evaluate(() => {
      const adminBar = document.getElementById('preview-bar-iframe');
      if (adminBar) adminBar.remove();
    });
    await pageMobile.waitForTimeout(1500);

    // 4. Homepage Top Viewport (390px)
    await pageMobile.screenshot({ path: path.join(outputDir, "hero_viewport_390px.png"), fullPage: false });

    // 5. Hero Commerce V2 Element (390px)
    const heroElemMobile = pageMobile.locator('.hero-commerce-v2').first();
    if (await heroElemMobile.count() > 0) {
      await heroElemMobile.screenshot({ path: path.join(outputDir, "hero_element_390px.png") });
    } else {
      console.warn("Could not find .hero-commerce-v2 element on mobile");
    }

    // 6. Collection Page / Product Card (390px)
    console.log("Navigating to collections page (Mobile 390px)...");
    await pageMobile.goto(collectionUrl, { waitUntil: "networkidle" });
    await pageMobile.evaluate(() => {
      const adminBar = document.getElementById('preview-bar-iframe');
      if (adminBar) adminBar.remove();
    });
    await pageMobile.waitForTimeout(1500);

    await pageMobile.screenshot({ path: path.join(outputDir, "collection_grid_390px.png"), fullPage: false });
    const cardElemMobile = pageMobile.locator('.fresh-card').first();
    if (await cardElemMobile.count() > 0) {
      await cardElemMobile.screenshot({ path: path.join(outputDir, "product_card_390px.png") });
    } else {
      console.warn("Could not find .fresh-card element on mobile");
    }

    await contextMobile.close();
    console.log("All Fresh Commerce screenshots captured successfully!");

  } catch (err) {
    console.error("Error capturing screenshots:", err);
  } finally {
    await browser.close();
  }
}

captureFreshScreenshots();
