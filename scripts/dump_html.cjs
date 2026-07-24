const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function checkOverlay() {
  const pdpUrl = "https://peri-beauty-bcuauhsj.myshopify.com/products/aurelle-celestial-radiance-serum?preview_theme_id=162941599973";
  const outputDir = "C:\\Users\\onwer\\.gemini\\antigravity-ide\\brain\\5ab32e02-86ab-441c-843c-0693c2aa2e87";
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Launching browser for overlay diagnosis...");
  const browser = await chromium.launch({ headless: true });
  
  try {
    const contextDesktop = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const pageDesktop = await contextDesktop.newPage();
    
    // Capture console logs
    const consoleLogs = [];
    pageDesktop.on('console', msg => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    console.log("Navigating to PDP...");
    await pageDesktop.goto(pdpUrl, { waitUntil: "networkidle" });
    
    // Check password page bypass
    if (await pageDesktop.locator('input[type="password"]').count() > 0) {
      await pageDesktop.fill('input[type="password"]', 'uriepa');
      await pageDesktop.keyboard.press('Enter');
      await pageDesktop.waitForNavigation({ waitUntil: "networkidle" });
    }

    // Wait a brief moment
    await pageDesktop.waitForTimeout(1500);

    // 1. Check if content exists (Ctrl+A equivalent)
    const bodyText = await pageDesktop.evaluate(() => document.body.innerText);
    console.log(`Body text length: ${bodyText.length} characters.`);
    if (bodyText.length > 100) {
      console.log("Content exists on the page (text highlight check PASSED).");
    }

    // 2. Find overlay culprits
    const culprits = await pageDesktop.evaluate(() => {
      const els = Array.from(document.querySelectorAll('[class*="popup"],[class*="modal"],[class*="overlay"],[class*="spin"]'));
      return els.map(e => ({
        tagName: e.tagName,
        className: e.className,
        style: window.getComputedStyle(e).position
      }));
    });
    console.log("Potential overlay culprits found:");
    console.dir(culprits);

    // 3. Remove them
    await pageDesktop.evaluate(() => {
      document.querySelectorAll('[class*="popup"],[class*="modal"],[class*="overlay"],[class*="spin"]').forEach(e => e.remove());
    });
    console.log("Removed overlays.");

    await pageDesktop.waitForTimeout(1000);

    // Capture Full Page Desktop to verify it worked
    await pageDesktop.screenshot({ path: path.join(outputDir, "pdp_after_overlay_removal.png"), fullPage: true });
    console.log("Saved pdp_after_overlay_removal.png");

    console.log("--- CONSOLE LOGS ---");
    consoleLogs.forEach(log => console.log(log));
    console.log("--------------------");

    await contextDesktop.close();

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await browser.close();
  }
}

checkOverlay();
