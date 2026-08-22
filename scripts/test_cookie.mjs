const shopDomain='peri-beauty-bcuauhsj.myshopify.com';
async function getCookie(){
  console.log('fetching',shopDomain);
  const res=await fetch(`https://${shopDomain}/password`,{
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body: new URLSearchParams({form_type:'storefront_password', utf8:'✓', password:'1234'}),
    redirect:'manual'
  });
  console.log('status',res.status);
  console.log('headers',res.headers.get('set-cookie'));
}
getCookie();
