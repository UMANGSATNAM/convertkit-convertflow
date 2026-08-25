const fs=require('fs'), path=require('path');
const pagesPath=path.join(process.cwd(),'app/pagekit/pages.ts');
let txt=fs.readFileSync(pagesPath,'utf8');

// Extract pages array - find export const PAGES: ... = [ ... ]
// Instead, we'll use tsx to load ALL_PAGES directly via require, but simpler to parse
// Use dynamic import via tsx? We'll just use regex to find header/footer assignments and update

// For each page id, generate header/footer files
const pageIds=[...txt.matchAll(/\bid:\s*"([^"]+)"/g)].map(m=>m[1]);
// dedup and filter to index pages? Do all
const uniq=[...new Set(pageIds)];
console.log('found',uniq.length,'pages');

// Need to load full page objects to know niche
// Use npx tsx to get niche mapping via a temp file
const { execSync } = require('child_process');
const nicheMap = JSON.parse(execSync('npx tsx -e "import {ALL_PAGES} from \'./app/pagekit/pages.ts\'; console.log(JSON.stringify(Object.fromEntries(ALL_PAGES.map(p=>[p.id,p.niche]))))"', {encoding:'utf8', maxBuffer:10*1024*1024}));
console.log('nicheMap',Object.keys(nicheMap).length);

const headerStyles=[
  {name:'minimal', bg:'#ffffff', text:'#111827', accent:'#111827', font:'Inter'},
  {name:'luxury', bg:'#fdfbf7', text:'#1c1917', accent:'#7c3aed', font:'Playfair Display'},
  {name:'bold', bg:'#0a0a0a', text:'#ffffff', accent:'#facc15', font:'Anton'},
  {name:'natural', bg:'#f7fee7', text:'#14532d', accent:'#16a34a', font:'Plus Jakarta Sans'},
  {name:'tech', bg:'#0f172a', text:'#f8fafc', accent:'#38bdf8', font:'JetBrains Mono'},
];
function styleFor(niche, id){
  const h= [...id].reduce((a,c)=>a+c.charCodeAt(0),0);
  if(niche.toLowerCase().includes('beauty') || niche.toLowerCase().includes('luxury') || niche.toLowerCase().includes('jewellery')) return headerStyles[1];
  if(niche.toLowerCase().includes('streetwear') || niche.toLowerCase().includes('urban') || niche.toLowerCase().includes('apparel')) return headerStyles[2];
  if(niche.toLowerCase().includes('food') || niche.toLowerCase().includes('wellness') || niche.toLowerCase().includes('supplements')) return headerStyles[3];
  if(niche.toLowerCase().includes('electronics') || niche.toLowerCase().includes('tech')) return headerStyles[4];
  return headerStyles[h % headerStyles.length];
}

function headerLiquid(id, niche, style){
  const logoText = niche.split(' ')[0].toUpperCase() || id.toUpperCase();
  return `{%- style -%}
#shopify-section-{{ section.id }}{
  --hdr-bg: ${style.bg};
  --hdr-text: ${style.text};
  --hdr-accent: ${style.accent};
  background: var(--hdr-bg);
  border-bottom:1px solid rgba(0,0,0,.06);
  position:sticky; top:0; z-index:40; backdrop-filter:blur(8px);
}
.hdr-${id}{max-width:1280px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.hdr-${id}__logo{font-family:'${style.font}',sans-serif;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--hdr-text);font-size:16px;text-decoration:none}
.hdr-${id}__nav{display:flex;gap:18px;align-items:center}
.hdr-${id}__nav a{font-size:13px;font-weight:600;color:var(--hdr-text);text-decoration:none;opacity:.8}
.hdr-${id}__nav a:hover{opacity:1;color:var(--hdr-accent)}
.hdr-${id}__actions{display:flex;gap:10px;align-items:center}
.hdr-${id}__cart{background:var(--hdr-accent);color:${style.name==='bold'?'#111':'#fff'};padding:8px 14px;border-radius:999px;font-size:12px;font-weight:700;text-decoration:none}
@media(max-width:768px){.hdr-${id}__nav{display:none}}
{%- endstyle -%}
<header class="hdr-${id}">
  <a href="/" class="hdr-${id}__logo">${logoText} <span style="color:var(--hdr-accent)">•</span> ${id.toUpperCase()}</a>
  <nav class="hdr-${id}__nav">
    <a href="/collections/all">Shop</a>
    <a href="/collections/all">New</a>
    <a href="/pages/about">Story</a>
    <a href="/pages/contact">Contact</a>
  </nav>
  <div class="hdr-${id}__actions">
    <a href="/search" style="color:var(--hdr-text);opacity:.7">Search</a>
    <a href="{{ routes.cart_url }}" class="hdr-${id}__cart">Cart {{'{{ cart.item_count }}'}}</a>
  </div>
</header>
{% schema %}{"name":"Header ${id}","settings":[],"presets":[{"name":"Header ${id}"}]}{% endschema %}`;
}

function footerLiquid(id, niche, style){
  return `{%- style -%}
#shopify-section-{{ section.id }}{background:${style.name==='bold'?'#0a0a0a': style.name==='tech'?'#0f172a':'#111827'};color:#fff;padding:40px 0 24px}
.ftr-${id}{max-width:1280px;margin:0 auto;padding:0 24px}
.ftr-${id}__grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:24px}
@media(max-width:768px){.ftr-${id}__grid{grid-template-columns:1fr 1fr}}
.ftr-${id} a{color:#9ca3af;text-decoration:none;font-size:13px}
.ftr-${id} h4{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#fff;margin:0 0 10px}
{%- endstyle -%}
<footer class="ftr-${id}">
  <div class="ftr-${id}__grid">
    <div><h4>${niche.toUpperCase()}</h4><p style="color:#9ca3af;font-size:13px;line-height:1.6">Crafted for ${niche} — ${id}. Premium, fast, and built to convert.</p></div>
    <div><h4>Shop</h4><a href="/collections/all">All products</a><br><a href="/collections/all">Bestsellers</a><br><a href="/collections/all">New in</a></div>
    <div><h4>Help</h4><a href="/pages/faq">FAQ</a><br><a href="/pages/contact">Contact</a><br><a href="/policies/shipping-policy">Shipping</a></div>
    <div><h4>Stay in touch</h4><p style="color:#9ca3af;font-size:13px">Get 10% off your first order.</p><a href="/#newsletter" style="display:inline-block;margin-top:8px;background:#fff;color:#111;padding:8px 14px;border-radius:999px;font-weight:700;font-size:12px;text-decoration:none">Join newsletter</a></div>
  </div>
  <div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
    <span style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#6b7280">© 2026 ${niche} — ${id}</span>
    <span style="font-size:11px;color:#6b7280">Made with StoreForge</span>
  </div>
</footer>
{% schema %}{"name":"Footer ${id}","settings":[],"presets":[{"name":"Footer ${id}"}]}{% endschema %}`;
}

let updated=0;
for(const id of uniq){
  const niche=nicheMap[id] || 'General retail';
  const style=styleFor(niche, id);
  const hdrFile=path.join(process.cwd(),'dev-theme-peri','sections',`header-${id}.liquid`);
  const ftrFile=path.join(process.cwd(),'dev-theme-peri','sections',`footer-${id}.liquid`);
  // Only create if not exists or if it's a shared header (we want to overwrite to ensure uniqueness)
  // Always create/overwrite to ensure distinct
  fs.writeFileSync(hdrFile, headerLiquid(id, niche, style));
  fs.writeFileSync(ftrFile, footerLiquid(id, niche, style));
  updated++;
}
console.log('generated',updated,'headers/footers');

// Now update pages.ts to point each page to its unique header/footer
// Replace header: "xxx", with header: "header-<id>"
let newTxt=txt;
for(const id of uniq){
  const niche=nicheMap[id] || '';
  // Find the block for this id and replace header/footer
  // Use regex to find the page object for this id
  const re=new RegExp(`(\\bid:\\s*"${id}"[\\s\\S]*?)(header:\\s*"[^"]*"|header:\\s*undefined)`, 'g');
  // Instead, do a simpler replacement: for each page, replace its header line with header: "header-<id>"
  // We'll do a global replace for each page's header/footer specifically
  // Find the page's object slice
  const pageRe=new RegExp(`(\\bid:\\s*"${id}"[\\s\\S]{0,800}?)(header:\\s*"[^"]*")`, 'm');
  const match=newTxt.match(pageRe);
  if(match){
    newTxt=newTxt.replace(pageRe, `$1header: "header-${id}"`);
  } else {
    // If page had no header field, add it after id line? Check if header missing
    const pageBlockRe=new RegExp(`(\\bid:\\s*"${id}"[^}]*?)(\\n\\s*sections:)`, 's');
    if(pageBlockRe.test(newTxt)){
      newTxt=newTxt.replace(pageBlockRe, `$1\n    header: "header-${id}",$2`);
    }
  }
  const footerRe=new RegExp(`(\\bid:\\s*"${id}"[\\s\\S]{0,1200}?)(footer:\\s*"[^"]*")`, 'm');
  const fmatch=newTxt.match(footerRe);
  if(fmatch){
    newTxt=newTxt.replace(footerRe, `$1footer: "footer-${id}"`);
  } else {
    const pageBlockRe2=new RegExp(`(\\bid:\\s*"${id}"[^}]*?)(\\n\\s*sections:)`, 's');
    // Need to ensure footer added after header if header exists, else after id
    // Simpler: add footer after header line we just added
    const hdrAddedRe=new RegExp(`(header:\\s*"header-${id}"[^\\n]*)(\\n\\s*sections:)`, 'm');
    if(hdrAddedRe.test(newTxt)){
      newTxt=newTxt.replace(hdrAddedRe, `$1\n    footer: "footer-${id}",$2`);
    }
  }
}
fs.writeFileSync(pagesPath, newTxt);
console.log('pages.ts updated');
