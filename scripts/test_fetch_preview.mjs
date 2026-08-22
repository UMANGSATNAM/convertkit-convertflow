const shopDomain='peri-beauty-bcuauhsj.myshopify.com';
async function getCookies(pwd){
  const res=await fetch(`https://${shopDomain}/password`,{
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body: new URLSearchParams({form_type:'storefront_password', utf8:'✓', password:pwd}),
    redirect:'manual'
  });
  const cookies=res.headers.getSetCookie ? res.headers.getSetCookie() : [res.headers.get('set-cookie')].filter(Boolean);
  console.log('status',res.status, 'cookies',cookies);
  return cookies.map(c=>c.split(';')[0]).join('; ');
}
async function test(){
  for(const pwd of ['1234','uriepa']){
    console.log('--- pwd',pwd);
    const cookie=await getCookies(pwd);
    console.log('cookie header',cookie.slice(0,120));
    const res=await fetch(`https://${shopDomain}/?view=pk-peri-beauty`,{
      headers:{Cookie: cookie, 'User-Agent':'Mozilla/5.0'}
    });
    const txt=await res.text();
    console.log('has password',txt.includes('storefront_password'));
    console.log('has shopify-section',txt.includes('shopify-section'));
    console.log('title',txt.match(/<title>(.*?)<\/title>/)?.[1]);
    console.log('snippet',txt.slice(0,300));
  }
}
test();
