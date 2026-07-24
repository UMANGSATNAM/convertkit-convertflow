const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureBatch2Screenshots() {
  const storeUrl = "https://peri-beauty-bcuauhsj.myshopify.com?preview_theme_id=162941599973";
  const outputDir = "C:\\Users\\onwer\\.gemini\\antigravity-ide\\brain\\beefebf0-39df-4fc0-a0b1-d8fb27483002";
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Launching browser for Batch 2 screenshots...");
  const browser = await chromium.launch({ headless: true });
  
  try {
    // --- DESKTOP 1440px ---
    console.log("Capturing Desktop 1440px...");
    const contextDesktop = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const pageDesktop = await contextDesktop.newPage();
    await pageDesktop.goto(storeUrl, { waitUntil: "networkidle" });
    
    if (await pageDesktop.locator('input[type="password"]').count() > 0) {
      await pageDesktop.fill('input[type="password"]', 'uriepa');
      await pageDesktop.keyboard.press('Enter');
      await pageDesktop.waitForNavigation({ waitUntil: "networkidle" });
    }

    await pageDesktop.evaluate(() => {
      const adminBar = document.getElementById('preview-bar-iframe');
      if (adminBar) adminBar.remove();
    });
    await pageDesktop.waitForTimeout(2000);

    // 1. Hero Viewport with new skincare image fallback
    await pageDesktop.screenshot({ path: path.join(outputDir, "hero_viewport_1440px_v2.png"), fullPage: false });
    
    // 2. Featured Categories V2
    const fcDesktop = pageDesktop.locator('.featured-categories-v2').first();
    if (await fcDesktop.count() > 0) {
      await fcDesktop.scrollIntoViewIfNeeded();
      await pageDesktop.waitForTimeout(600);
      await fcDesktop.screenshot({ path: path.join(outputDir, "featured_categories_1440px.png") });
    } else {
      console.warn("Could not find .featured-categories-v2 on desktop");
    }

    // 3. Deals V2
    const dealsDesktop = pageDesktop.locator('.deals-v2').first();
    if (await dealsDesktop.count() > 0) {
      await dealsDesktop.scrollIntoViewIfNeeded();
      await pageDesktop.waitForTimeout(600);
      await dealsDesktop.screenshot({ path: path.join(outputDir, "deals_1440px.png") });
    } else {
      console.warn("Could not find .deals-v2 on desktop");
    }

    // 4. Why Choose Us V2
    const whyDesktop = pageDesktop.locator('.why-choose-us-v2').first();
    if (await whyDesktop.count() > 0) {
      await whyDesktop.scrollIntoViewIfNeeded();
      await pageDesktop.waitForTimeout(600);
      await whyDesktop.screenshot({ path: path.join(outputDir, "why_choose_us_1440px.png") });
    } else {
      console.warn("Could not find .why-choose-us-v2 on desktop");
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

    // 1. Hero Viewport Mobile with new skincare image fallback
    await pageMobile.screenshot({ path: path.join(outputDir, "hero_viewport_390px_v2.png"), fullPage: false });

    // 2. Featured Categories V2 Mobile
    const fcMobile = pageMobile.locator('.featured-categories-v2').first();
    if (await fcMobile.count() > 0) {
      await fcMobile.scrollIntoViewIfNeeded();
      await pageMobile.waitForTimeout(600);
      await fcMobile.screenshot({ path: path.join(outputDir, "featured_categories_390px.png") });
    }

    // 3. Deals V2 Mobile
    const dealsMobile = pageMobile.locator('.deals-v2').first();
    if (await dealsMobile.count() > 0) {
      await dealsMobile.scrollIntoViewIfNeeded();
      await pageMobile.waitForTimeout(600);
      await dealsMobile.screenshot({ path: path.join(outputDir, "deals_390px.png") });
    }

    // 4. Why Choose Us V2 Mobile
    const whyMobile = pageMobile.locator('.why-choose-us-v2').first();
    if (await whyMobile.count() > 0) {
      await whyMobile.scrollIntoViewIfNeeded();
      await pageMobile.waitForTimeout(600);
      await whyMobile.screenshot({ path: path.join(outputDir, "why_choose_us_390px.png") });
    }

    await contextMobile.close();
    console.log("Batch 2 screenshots captured successfully!");
  } catch (error) {
    console.error("Error capturing Batch 2 screenshots:", error);
  } finally {
    await browser.close();
  }
}

captureBatch2Screenshots();
