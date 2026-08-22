import { PrismaClient } from '@prisma/client';
import { stagePreview } from '../app/pagekit/apply.server.ts';
import { ALL_PAGES } from '../app/pagekit/pages.ts';
const prisma=new PrismaClient();
async function main(){
const shop=await prisma.shop.findFirst({where:{shopDomain:{contains:'peri-beauty'}}});
console.log('shop',shop.shopDomain, 'pwd', shop.brandConfig?.storefrontPassword);
const p=ALL_PAGES.find(x=>x.id==='peri-beauty');
console.log('staging',p.id);
const result=await stagePreview(shop,p);
console.log('result',result.ok, result.previewPath, result.themeId);
if(!result.ok) { await prisma.$disconnect(); process.exit(0); }
// get cookie for storefront password 1234 (user said) and also try brandConfig pwd
async function getCookie(pwd){
  const res=await fetch(`https://${shop.shopDomain}/password`,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({form_type:'storefront_password',utf8:'✓',password:pwd}),redirect:'manual'});
  const cookies=res.headers.getSetCookie ? res.headers.getSetCookie() : [res.headers.get('set-cookie')].filter(Boolean);
  console.log('pwd',pwd,'status',res.status,'cookies',cookies.map(c=>c.split(';')[0].slice(0,40)));
  return cookies.map(c=>c.split(';')[0]).join('; ');
}
const pwdToTest = '1234';
const cookie=await getCookie(pwdToTest);
console.log('cookie header length',cookie.length);
const url=`https://${shop.shopDomain}${result.previewPath}&preview_theme_id=${result.themeId}`;
console.log('fetching',url);
const res2=await fetch(url,{headers:{Cookie: cookie, 'User-Agent':'Mozilla/5.0', Accept:'text/html'}});
const txt=await res2.text();
console.log('status',res2.status);
console.log('has shopify-section',txt.includes('shopify-section'));
console.log('has password',txt.includes('storefront_password'));
console.log('title',txt.match(/<title>(.*?)<\/title>/)?.[1]);
console.log(txt.slice(0,600));
await prisma.$disconnect();
}
main();
