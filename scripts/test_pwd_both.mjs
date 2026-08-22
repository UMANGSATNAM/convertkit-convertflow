import { chromium } from 'playwright';
async function testPwd(pwd){
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage();
  await page.goto('https://peri-beauty-bcuauhsj.myshopify.com/',{waitUntil:'domcontentloaded'});
  console.log('before pwd', pwd, 'title', await page.title(), 'url', page.url());
  const hasPwd=await page.locator('input[type="password"]').count();
  console.log('has pwd input', hasPwd);
  if(hasPwd){
    await page.fill('input[type="password"]', pwd);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    console.log('after pwd', pwd, 'title', await page.title(), 'url', page.url());
    const content=await page.content();
    console.log('has shopify-section', content.includes('shopify-section'));
    console.log('has password again', content.includes('storefront_password'));
    console.log('snippet', content.slice(0,500));
  }
  await browser.close();
}
await testPwd('1234');
console.log('---');
await testPwd('uriepa');
