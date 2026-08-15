const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureAll() {
  const storeUrl = "https://peri-beauty-bcuauhsj.myshopify.com?preview_theme_id=162941599973";
  const collectionUrl = "https://peri-beauty-bcuauhsj.myshopify.com/collections/all?preview_theme_id=162941599973";
  const outputDir = "C:\\Users\\onwer\\.gemini\\antigravity-ide\\brain\\492dc3ab-68b6-4571-8ab6-2a6ebe951cf3";
  
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  
  try {
    // --- DESKTOP 1440px ---
    console.log("Capturing Desktop 1440px...");
    const contextDesktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pageDesktop = await contextDesktop.newPage();
    
    // Homepage
    await pageDesktop.goto(storeUrl, { waitUntil: "networkidle" });
    if (await pageDesktop.locator('input[type="password"]').count() > 0) {
      await pageDesktop.fill('input[type="password"]', 'uriepa');
      await pageDesktop.keyboard.press('Enter');
      await pageDesktop.waitForNavigation({ waitUntil: "networkidle" });
    }
    await pageDesktop.evaluate(() => { const adminBar = document.getElementById('preview-bar-iframe'); if (adminBar) adminBar.remove(); });
    await pageDesktop.waitForTimeout(2000);
    await pageDesktop.screenshot({ path: path.join(outputDir, "homepage_desktop_1440.png"), fullPage: true });

    // Capture testimonials specifically
    const testimonialsLoc = pageDesktop.locator('.testimonials-commerce-v2');
    if (await testimonialsLoc.count() > 0) {
      await testimonialsLoc.screenshot({ path: path.join(outputDir, "testimonials_desktop.png") });
    }

    // Capture footer specifically
    const footerLoc = pageDesktop.locator('.footer-commerce-v2');
    if (await footerLoc.count() > 0) {
      await footerLoc.screenshot({ path: path.join(outputDir, "footer_desktop.png") });
    }
    
    // Navigate to a product page via collection
    await pageDesktop.goto(collectionUrl, { waitUntil: "networkidle" });
    if (await pageDesktop.locator('a[href*="/products/"]').count() > 0) {
      let productHref = await pageDesktop.locator('a[href*="/products/"]').first().getAttribute('href');
      let finalUrl = productHref.startsWith('http') 
        ? `${productHref}${productHref.includes('?') ? '&' : '?'}preview_theme_id=162941599973`
        : `https://peri-beauty-bcuauhsj.myshopify.com${productHref}?preview_theme_id=162941599973`;
      await pageDesktop.goto(finalUrl, { waitUntil: "networkidle" });
      await pageDesktop.evaluate(() => { const adminBar = document.getElementById('preview-bar-iframe'); if (adminBar) adminBar.remove(); });
      await pageDesktop.waitForTimeout(2000);
      await pageDesktop.screenshot({ path: path.join(outputDir, "pdp_desktop_1440.png"), fullPage: true });

      const priceLoc = pageDesktop.locator('.sf-pdp-price-row');
      if (await priceLoc.count() > 0) {
        await priceLoc.screenshot({ path: path.join(outputDir, "pdp_price_desktop.png") });
      }
    } else {
      console.log("No product found on desktop!");
    }
    await contextDesktop.close();

    // --- MOBILE 390px ---
    console.log("Capturing Mobile 390px...");
    const contextMobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const pageMobile = await contextMobile.newPage();
    
    // Homepage
    await pageMobile.goto(storeUrl, { waitUntil: "networkidle" });
    if (await pageMobile.locator('input[type="password"]').count() > 0) {
      await pageMobile.fill('input[type="password"]', 'uriepa');
      await pageMobile.keyboard.press('Enter');
      await pageMobile.waitForNavigation({ waitUntil: "networkidle" });
    }
    await pageMobile.evaluate(() => { const adminBar = document.getElementById('preview-bar-iframe'); if (adminBar) adminBar.remove(); });
    await pageMobile.waitForTimeout(2000);
    await pageMobile.screenshot({ path: path.join(outputDir, "homepage_mobile_390.png"), fullPage: true });
    
    // Navigate to a product page via collection
    await pageMobile.goto(collectionUrl, { waitUntil: "networkidle" });
    if (await pageMobile.locator('a[href*="/products/"]').count() > 0) {
      let productHref = await pageMobile.locator('a[href*="/products/"]').first().getAttribute('href');
      let finalUrl = productHref.startsWith('http') 
        ? `${productHref}${productHref.includes('?') ? '&' : '?'}preview_theme_id=162941599973`
        : `https://peri-beauty-bcuauhsj.myshopify.com${productHref}?preview_theme_id=162941599973`;
      await pageMobile.goto(finalUrl, { waitUntil: "networkidle" });
      await pageMobile.evaluate(() => { const adminBar = document.getElementById('preview-bar-iframe'); if (adminBar) adminBar.remove(); });
      await pageMobile.waitForTimeout(2000);
      await pageMobile.screenshot({ path: path.join(outputDir, "pdp_mobile_390.png"), fullPage: true });
    } else {
      console.log("No product found on mobile!");
    }
    await contextMobile.close();

    console.log("All screenshots captured successfully!");
  } catch (err) {
    console.error("Error capturing screenshots:", err);
  } finally {
    await browser.close();
  }
}

captureAll();
