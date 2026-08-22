import { PrismaClient } from '@prisma/client';
import { stagePreview, liveThemeId } from '../app/pagekit/apply.server';
import { ALL_PAGES } from '../app/pagekit/pages';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const STORE_PASSWORD = '1234';
const prisma = new PrismaClient();

async function main(){
  const shop = await prisma.shop.findFirst({ where:{ shopDomain:{ contains:'peri-beauty' } } });
  if(!shop) { console.log('no shop found'); process.exit(1); }
  console.log('shop',shop.shopDomain, 'pwd', STORE_PASSWORD);

  const outDir = path.join(process.cwd(), 'public', 'thumbnails');
  fs.mkdirSync(outDir,{recursive:true});

  const browser = await chromium.launch({ headless:true });
  const context = await browser.newContext({
    viewport:{ width:1280, height:900 }
  });
  const page = await context.newPage();

  // filter to index pages only
  const indexPages = ALL_PAGES.filter(p=>p.pageType==='index');
  console.log('total index',indexPages.length);

  for(let i=0;i<indexPages.length;i++){
    const p = indexPages[i];
    console.log(`[${i+1}/${indexPages.length}] staging ${p.id} ${p.name}...`);
    let result;
    try{
      result = await stagePreview(shop, p);
      if(!result.ok){ console.log(' stage failed', result.error); continue; }
    }catch(e){ console.log(' stage error',e.message); continue; }

    const previewUrl = `https://${shop.shopDomain}${result.previewPath}`;
    console.log('  -> goto', previewUrl);
    try{
      await page.goto(previewUrl, { waitUntil:'domcontentloaded', timeout:30000 });
      // Handle password page — fill 1234
      try{
        const pwdInput = page.locator('input[type="password"], input[name="password"]');
        if(await pwdInput.count() > 0){
          console.log('  password page detected, filling 1234...');
          await pwdInput.first().fill(STORE_PASSWORD);
          const btn = page.locator('button[type="submit"], input[type="submit"]').first();
          await btn.click();
          await page.waitForLoadState('networkidle', {timeout:15000});
          await page.waitForTimeout(1000);
        }
      }catch(e){ console.log('  pwd check err', e.message); }
      await page.waitForTimeout(1500);
      // try to find hero section - first section under main
      let heroHandle = null;
      // Try selectors in order
      const selectors = [
        'main [id*="shopify-section"]',
        'main section',
        '.hp45-hero, .hp1-hero, [class*="hero"]',
        '#MainContent'
      ];
      let el = null;
      for(const sel of selectors){
        const loc = page.locator(sel).first();
        try{
          await loc.waitFor({timeout:3000});
          el = loc;
          break;
        }catch{}
      }
      if(!el){
        console.log('  hero not found, shooting full page top');
        await page.screenshot({ path: path.join(outDir, `${p.id}.jpg`), type:'jpeg', quality:85, clip:{x:0,y:0,width:1280,height:700} });
      } else {
        // screenshot the hero element
        await el.screenshot({ path: path.join(outDir, `${p.id}.jpg`), type:'jpeg', quality:85 });
      }
      console.log('  saved', `${p.id}.jpg`);
      // small delay to avoid rate limit
      await new Promise(r=>setTimeout(r,800));
    }catch(e){
      console.log('  goto/screenshot failed', e.message);
    }
  }
  await browser.close();
  await prisma.$disconnect();
  console.log('done');
}
main();
