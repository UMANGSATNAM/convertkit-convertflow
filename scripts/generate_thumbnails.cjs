const fs=require('fs'), path=require('path');
const puppeteer=require('puppeteer');

const pagesPath=path.join(process.cwd(), 'app/pagekit/pages.ts');
// Instead of importing TS, parse manually: read dev-theme-peri templates + pages.ts? Simpler: use public data
// We'll generate from dev-theme-peri templates + pages.ts via reading pages.ts as text and extracting ids, or just scan registry
// Easier: scan app/pagekit/pages.ts for page ids via file parse and also include hp v52-100 templates
// For now generate for all ALL_PAGES by requiring via tsx - but we can just scan files

function loadPages(){
  // quick and dirty: require via dynamic import using tsx? Simpler to read pages.ts text
  const txt=fs.readFileSync(pagesPath,'utf8');
  // Find all id: "xxx"
  const ids=[...txt.matchAll(/\bid:\s*"([^"]+)"/g)].map(m=>m[1]);
  // dedup
  return [...new Set(ids)];
}

const NICHE_IMG={
  "Beauty & skincare":"https://images.unsplash.com/photo-1556228453-efd6c1ff04bf?w=1200&q=80&auto=format&fit=crop",
  "Streetwear":"https://images.unsplash.com/photo-1507680434567-71d70ed310cf?w=1200&q=80&auto=format&fit=crop",
  "Streetwear & Activewear":"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80&auto=format&fit=crop",
  "Luxury Apparel":"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80&auto=format&fit=crop",
  "Jewellery":"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&q=80&auto=format&fit=crop",
  "Electronics & gadgets":"https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80&auto=format&fit=crop",
  "Food, wellness & naturals":"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop",
  "General retail":"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80&auto=format&fit=crop",
  "Direct to consumer":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop",
  "Apparel":"https://images.unsplash.com/photo-1523381210434-f59b9f52bc13?w=1200&q=80&auto=format&fit=crop",
  "Urban Clothing":"https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=1200&q=80&auto=format&fit=crop",
  "Minimal Apparel":"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80&auto=format&fit=crop",
  "Denim & Apparel":"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=80&auto=format&fit=crop",
  "Lifestyle & homeware":"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80&auto=format&fit=crop",
  "Supplements & health":"https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80&auto=format&fit=crop",
  "Design-led brands":"https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop",
};
const HERO_POOL=[
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523381210434-f59b9f52bc13?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507680434567-71d70ed310cf?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556228453-efd6c1ff04bf?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80&auto=format&fit=crop"
];
const PRODUCT_IMGS=[
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507680434567-71d70ed310cf?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80&auto=format&fit=crop",
];

function esc(s){ return (s||'').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function hashStr(s){ let h=0; for(let i=0;i<s.length;i++) h=(h*31 + s.charCodeAt(i))>>>0; return h; }
function generateHTML(page){
  const heroImg = HERO_POOL[ hashStr(page.id) % HERO_POOL.length ];
  const accent = page.niche.includes('Beauty')? '#EC4899' : page.niche.includes('Streetwear')? '#111' : page.niche.includes('Jewellery')? '#CA8A04' : page.niche.includes('Electronics')? '#6366F1' : page.niche.includes('Luxury')? '#7C3AED' : '#111827';
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Playfair+Display:wght@700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',system-ui,sans-serif;color:#111;background:#fff}
.header{height:56px;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;padding:0 24px;font-size:14px}
.header b{letter-spacing:.08em;text-transform:uppercase}
.hero{position:relative;height:520px;overflow:hidden;background:#000;color:#fff;display:flex;align-items:center}
.hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.9}
.hero::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg, rgba(0,0,0,.65) 20%, rgba(0,0,0,.2) 70%)}
.hero-content{position:relative;z-index:1;max-width:560px;margin-left:48px}
.badge{display:inline-block;font-size:11px;letter-spacing:.18em;text-transform:uppercase;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);padding:6px 10px;border-radius:999px;backdrop-filter:blur(6px);margin-bottom:12px}
.hero h1{font-family:'Playfair Display',serif;font-size:42px;line-height:1;text-shadow:0 2px 12px rgba(0,0,0,.3);margin-bottom:10px}
.hero p{opacity:.9;line-height:1.6;margin-bottom:16px}
.btn{display:inline-block;background:${accent};color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:700;font-size:13px}
.grid{max-width:1280px;margin:0 auto;padding:28px 24px}
.grid h2{font-size:18px;font-weight:800;margin-bottom:12px}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.card{border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff}
.card img{width:100%;aspect-ratio:1;object-fit:cover}
.card-body{padding:10px}
.card-title{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.card-price{font-weight:700;color:${accent};margin-top:4px}
.strip{margin-top:18px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:18px;display:flex;gap:16px;align-items:center;justify-content:space-between}
.trust{display:flex;gap:12px;opacity:.6;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;justify-content:center;padding:16px}
.footer{margin-top:24px;background:#111;color:#9ca3af;padding:24px;text-align:center;font-size:12px}
@media(max-width:900px){.cards{grid-template-columns:repeat(2,1fr)}.hero-content{margin:0 auto;padding:24px;text-align:center}.hero{height:460px}}
</style></head><body>
<div class="header"><b>${esc(page.niche.toUpperCase())}</b><span style="opacity:.6">Free shipping over ₹999 • 4.8★ 50k reviews</span><span>Cart (0)</span></div>
<section class="hero"><img src="${heroImg}" alt=""><div class="hero-content"><div class="badge">${esc(page.niche)} • ${page.id}</div><h1>${esc(page.name)}</h1><p>${esc(page.description)}</p><a class="btn" href="#">Shop Now</a></div></section>
<div class="grid"><h2>Best Sellers</h2><div class="cards">
${[0,1,2,3].map(i=>`<div class="card"><img src="${PRODUCT_IMGS[i % PRODUCT_IMGS.length]}" alt=""><div class="card-body"><div class="card-title">Premium ${esc(page.niche)} Product ${i+1}</div><div class="card-price">₹1,999 <span style="opacity:.5;font-weight:400;text-decoration:line-through;font-size:12px">₹2,499</span></div></div></div>`).join('')}
</div>
<div class="strip"><strong>${esc(page.niche)} — Crafted for real life</strong><span style="opacity:.6">Easy returns • COD • Secure payments</span></div>
<div class="trust"><span>VOGUE</span><span>•</span><span>GQ</span><span>•</span><span>FORBES</span><span>•</span><span>ELLE</span></div>
</div>
<div class="footer">© 2026 ${esc(page.niche)} Store — Demo thumbnail • Sections: ${page.sections.slice(0,3).join(', ')}</div>
</body></html>`;
}

async function main(){
  const pages=loadPages();
  console.log('found ids',pages.length, pages.slice(0,5));
  // Need full page objects with niche/description/sections — load via parsing pages.ts more thoroughly, but quick: load from registry or generate mock for each id using niche guess
  // Instead, load from actual pages definitions by using tsx to import
  // Try to import via dynamic import with tsx loader: use node --loader tsx? Simpler: just read pages.ts and extract objects via regex for name/niche/description/sections
  const txt=fs.readFileSync(pagesPath,'utf8');
  const pageBlocks=[...txt.matchAll(/\{\s*id:\s*"([^"]+)"[\s\S]*?niche:\s*"([^"]+)"[\s\S]*?description:\s*"([\s\S]*?)"\s*,[\s\S]*?sections:\s*\[([\s\S]*?)\]/g)];
  const mapped=new Map();
  for(const m of pageBlocks){
    const id=m[1], niche=m[2], desc=m[3].replace(/\\n/g,' ').replace(/\s+/g,' ').trim(), secsRaw=m[4];
    const secs=[...secsRaw.matchAll(/"([^"]+)"/g)].map(x=>x[1]);
    mapped.set(id,{id, niche, description:desc, sections:secs, name:id});
    // try to find name
    const nameMatch=txt.slice(Math.max(0, m.index-300), m.index).match(/name:\s*"([^"]+)"/);
    // better search within block head
    const blockHead=txt.slice(m.index-500, m.index+800);
    const nm=blockHead.match(/name:\s*"([^"]+)"/);
    if(nm) mapped.get(id).name=nm[1];
  }
  console.log('parsed mapped',mapped.size);
  const outDir=path.join(process.cwd(),'public','thumbnails');
  const htmlDir=path.join(outDir,'html');
  fs.mkdirSync(htmlDir,{recursive:true});
  // Also create for hp v52-100 templates that may not be in pages.ts yet: include dev-theme-peri templates
  const periTemplates=path.join(process.cwd(),'dev-theme-peri','templates');
  if(fs.existsSync(periTemplates)){
    const tfiles=fs.readdirSync(periTemplates).filter(f=>f.startsWith('index.hp-v') && f.endsWith('.json'));
    for(const f of tfiles){
      try{
        const j=JSON.parse(fs.readFileSync(path.join(periTemplates,f),'utf8'));
        const id=f.replace('index.','').replace('.json','');
        if(!mapped.has(id)){
          const secs= j.order ? j.order.map(k=> j.sections[k].type) : Object.values(j.sections).map(s=>s.type);
          mapped.set(id,{id, name:j.name||id, niche: (j.name||'').includes('STREETWEAR')?'Streetwear': (j.name||'').includes('BEAUTY')?'Beauty & skincare': (j.name||'').includes('ELECTRONICS')?'Electronics & gadgets': (j.name||'').includes('GOURMET')?'Food, wellness & naturals': 'General retail', description: j.name||id, sections: secs});
        }
      }catch{}
    }
  }
  console.log('total to generate',mapped.size);
  // Generate HTML files
  for(const [id,page] of mapped){
    const html=generateHTML(page);
    fs.writeFileSync(path.join(htmlDir, id+'.html'), html);
  }
  console.log('html generated', fs.readdirSync(htmlDir).length);

  // Capture via puppeteer
  const browser=await puppeteer.launch({ headless:true, args:['--no-sandbox','--disable-setuid-sandbox']});
  const page=await browser.newPage();
  await page.setViewport({width:1280, height:800, deviceScaleFactor:2});
  let count=0;
  for(const [id] of mapped){
    const htmlPath=path.join(htmlDir, id+'.html');
    const fileUrl='file://' + htmlPath.replace(/\\/g,'/');
    try{
      await page.goto(fileUrl, {waitUntil:'networkidle0', timeout:15000});
      // wait for images
      await new Promise(r=>setTimeout(r, 600));
      const outPath=path.join(outDir, id+'.jpg');
      await page.screenshot({path: outPath, type:'jpeg', quality:82, fullPage:false, clip:{x:0,y:0,width:1280,height:960}});
      count++;
      if(count%20===0) console.log(`captured ${count}/${mapped.size}`);
    }catch(e){ console.log('fail',id,e.message); }
  }
  await browser.close();
  console.log('done captured',count, 'to', outDir);
}
main();
