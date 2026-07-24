import { chromium } from "playwright"; 
async function check() { 
  const b = await chromium.launch(); 
  const p = await b.newPage(); 
  await p.goto("https://peri-beauty-bcuauhsj.myshopify.com"); 
  const pw = await p.$("input[type=\"password\"]"); 
  if(pw){ 
    await pw.fill("uriepa"); 
    await Promise.all([p.waitForNavigation(), p.keyboard.press("Enter")]); 
  } 
  const text = await p.innerText("body"); 
  console.log(text.substring(0, 1500)); 
  await b.close(); 
} 
check();
