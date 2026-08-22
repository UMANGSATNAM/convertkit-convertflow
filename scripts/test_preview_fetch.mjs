const shopDomain='peri-beauty-bcuauhsj.myshopify.com';
const password='1234';
async function getCookie(){
  const res=await fetch(`https://${shopDomain}/password`,{
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body: new URLSearchParams({form_type:'storefront_password', utf8:'✓', password}),
    redirect:'manual'
  });
  const raw=res.headers.get('set-cookie')||'';
  console.log('raw cookie',raw.slice(0,200));
  const m1=raw.match(/storefront_digest=([^;]+)/);
  if(m1) return `storefront_digest=${m1[1]}`;
  const m2=raw.match(/_shopify_essential=([^;]+)/);
  if(m2) return `_shopify_essential=${m2[1]}`;
  return raw.split(';')[0];
}
async function test(){
  const cookie=await getCookie();
  console.log('cookie',cookie?.slice(0,80));
  const res=await fetch(`https://${shopDomain}/`,{
    headers:{Cookie: cookie, 'User-Agent':'Mozilla/5.0'}
  });
  const txt=await res.text();
  console.log('has password', txt.includes('storefront_password'));
  console.log('has shopify-section', txt.includes('shopify-section'));
  console.log('title', txt.match(/<title>(.*?)<\/title>/)?.[1]);
  console.log('snippet', txt.slice(0,800));
}
test();
