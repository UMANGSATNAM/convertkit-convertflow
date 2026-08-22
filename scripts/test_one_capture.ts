import { PrismaClient } from '@prisma/client';
import { stagePreview } from '../app/pagekit/apply.server';
import { ALL_PAGES } from '../app/pagekit/pages';
import { chromium } from 'playwright';
const prisma=new PrismaClient();
const STORE_PASSWORD='1234';
async function main(){
  const shop=await prisma.shop.findFirst({where:{shopDomain:{contains:'peri-beauty'}}});
  console.log('shop',shop?.shopDomain);
  const p=ALL_PAGES.find(x=>x.id==='peri-beauty');
  console.log('page',p?.id, p?.name);
  const result=await stagePreview(shop,p);
  console.log('stage',result.ok, result.previewPath);
  const browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:1280,height:900}});
  const page=await context.newPage();
  const url=`https://${shop.shopDomain}${result.previewPath}`;
  console.log('goto',url);
  await page.goto(url, {waitUntil:'domcontentloaded'});
  console.log('loaded', await page.title());
  let content=await page.content();
  console.log('has password input?', content.includes('password'));
  console.log('has shopify-section?', content.includes('shopify-section'));
  // try to handle password
  const pwd=page.locator('input[type="password"]');
  if(await pwd.count()>0){
    console.log('filling pwd');
    await pwd.first().fill(STORE_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForLoadState('networkidle');
    console.log('after pwd title', await page.title());
    content=await page.content();
    console.log('after has shopify-section?', content.includes('shopify-section'));
  }
  await page.screenshot({path:'public/thumbnails/test_one.jpg', fullPage:true});
  console.log('screenshot saved');
  await browser.close();
  await prisma.$disconnect();
}
main();
