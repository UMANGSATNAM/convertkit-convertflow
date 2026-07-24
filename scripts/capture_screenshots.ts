import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function captureScreenshots() {
  const storeUrl = "https://peri-beauty-bcuauhsj.myshopify.com?preview_theme_id=162941599973";
  const outputDir = "C:\\Users\\onwer\\.gemini\\antigravity-ide\\brain\\098137be-6634-4c8b-a34e-f4a14e59c150\\screenshots";
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  
  try {
    // 1. Homepage & Password Bypass
    console.log(`Navigating to ${storeUrl}...`);
    await page.goto(storeUrl, { waitUntil: "networkidle" });
    
    // Check if we hit the password page and bypass it
    const isPasswordPage = await page.evaluate(() => document.body.classList.contains('template-password') || window.location.pathname.includes('/password'));
    if (isPasswordPage) {
      console.log("Password page detected, entering password...");
      // For Shopify storefront password
      const passwordInput = await page.$('input[type="password"]');
      if (passwordInput) {
        await passwordInput.fill("uriepa");
        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle" }),
          page.keyboard.press("Enter")
        ]);
        console.log("Password submitted successfully.");
      } else {
        console.warn("Could not find password input field!");
      }
    }

    await page.screenshot({ path: path.join(outputDir, "homepage_1440px.png"), fullPage: true });
    
    // Switch to mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(outputDir, "homepage_390px.png"), fullPage: true });
    
    // Switch back
    await page.setViewportSize({ width: 1440, height: 900 });
    console.log("Captured homepage screenshots (1440px and 390px)");

    // 2. Collection page
    const collectionUrl = `${storeUrl}/collections/all`;
    console.log(`Navigating to ${collectionUrl}...`);
    await page.goto(collectionUrl, { waitUntil: "networkidle" });
    
    await page.screenshot({ path: path.join(outputDir, "collection_1440px.png"), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(outputDir, "collection_390px.png"), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 900 });
    
    console.log("Captured collection screenshots");

    // 3. PDP (Assuming first product from collections)
    // 3. PDP (Assuming first product from collections)
    const pdpUrl = "https://peri-beauty-bcuauhsj.myshopify.com/products/aurelle-celestial-radiance-serum?preview_theme_id=162941599973";
    console.log(`Navigating to PDP ${pdpUrl}...`);
    await page.goto(pdpUrl, { waitUntil: "networkidle" });
    
    await page.screenshot({ path: path.join(outputDir, "pdp_1440px.png"), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(outputDir, "pdp_390px.png"), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 900 });
    
    console.log("Captured pdp screenshots");

  } catch (error) {
    console.error("Screenshot capture failed:", error);
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
