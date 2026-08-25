const fs=require('fs'), path=require('path');
const { execSync } = require('child_process');

// Get all pages via tsx
const nicheMap = JSON.parse(execSync('npx tsx -e "import {ALL_PAGES} from \'./app/pagekit/pages.ts\'; console.log(JSON.stringify(Object.fromEntries(ALL_PAGES.map(p=>[p.id, p.niche]))))"', {encoding:'utf8'}));
const allIds=Object.keys(nicheMap);
console.log('allIds',allIds.length);

const headerStyles=[
  {name:'minimal', bg:'#ffffff', text:'#111827', accent:'#111827'},
  {name:'luxury', bg:'#fdfbf7', text:'#1c1917', accent:'#7c3aed'},
  {name:'bold', bg:'#0a0a0a', text:'#ffffff', accent:'#facc15'},
  {name:'natural', bg:'#f7fee7', text:'#14532d', accent:'#16a34a'},
  {name:'tech', bg:'#0f172a', text:'#f8fafc', accent:'#38bdf8'},
];
function styleFor(niche, id){
  const h=[...id].reduce((a,c)=>a+c.charCodeAt(0),0);
  if(niche.toLowerCase().includes('beauty') || niche.toLowerCase().includes('luxury') || niche.toLowerCase().includes('jewellery')) return headerStyles[1];
  if(niche.toLowerCase().includes('streetwear') || niche.toLowerCase().includes('urban') || niche.toLowerCase().includes('apparel')) return headerStyles[2];
  if(niche.toLowerCase().includes('food') || niche.toLowerCase().includes('wellness') || niche.toLowerCase().includes('supplements')) return headerStyles[3];
  if(niche.toLowerCase().includes('electronics') || niche.toLowerCase().includes('tech')) return headerStyles[4];
  return headerStyles[h % headerStyles.length];
}
function headerLiquid(id, niche, style){
  const logo=niche.split(' ')[0].toUpperCase();
  return `{%- style -%}
#shopify-section-{{ section.id }}{--hdr-bg:${style.bg};--hdr-text:${style.text};--hdr-accent:${style.accent};background:var(--hdr-bg);border-bottom:1px solid rgba(0,0,0,.06);position:sticky;top:0;z-index:40;backdrop-filter:blur(8px)}
.hdr-${id}{max-width:1280px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.hdr-${id}__logo{font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--hdr-text);font-size:16px;text-decoration:none}
.hdr-${id}__nav{display:flex;gap:18px}
.hdr-${id}__nav a{font-size:13px;font-weight:600;color:var(--hdr-text);text-decoration:none;opacity:.8}
.hdr-${id}__nav a:hover{opacity:1;color:var(--hdr-accent)}
.hdr-${id}__cart{background:var(--hdr-accent);color:${style.name==='bold'?'#111':'#fff'};padding:8px 14px;border-radius:999px;font-size:12px;font-weight:700;text-decoration:none}
@media(max-width:768px){.hdr-${id}__nav{display:none}}
{%- endstyle -%}
<header class="hdr-${id}"><a href="/" class="hdr-${id}__logo">${logo} • ${id.toUpperCase()}</a><nav class="hdr-${id}__nav"><a href="/collections/all">Shop</a><a href="/collections/all">New</a><a href="/pages/about">Story</a><a href="/pages/contact">Contact</a></nav><div><a href="{{ routes.cart_url }}" class="hdr-${id}__cart">Cart {{'{{ cart.item_count }}'}}</a></div></header>
{% schema %}{"name":"Header ${id}","settings":[],"presets":[{"name":"Header ${id}"}]}{% endschema %}`;
}
function footerLiquid(id, niche, style){
  return `{%- style -%}
#shopify-section-{{ section.id }}{background:${style.name==='bold'?'#0a0a0a': style.name==='tech'?'#0f172a':'#111827'};color:#fff;padding:40px 0 24px}
.ftr-${id}{max-width:1280px;margin:0 auto;padding:0 24px}
.ftr-${id}__grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:24px}
@media(max-width:768px){.ftr-${id}__grid{grid-template-columns:1fr 1fr}}
.ftr-${id} a{color:#9ca3af;text-decoration:none;font-size:13px}
{%- endstyle -%}
<footer class="ftr-${id}"><div class="ftr-${id}__grid"><div><h4 style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#fff;margin:0 0 10px">${niche.toUpperCase()}</h4><p style="color:#9ca3af;font-size:13px">Crafted for ${niche} — ${id}.</p></div><div><h4 style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#fff;margin:0 0 10px">Shop</h4><a href="/collections/all">All</a><br><a href="/collections/all">Bestsellers</a></div><div><h4 style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#fff;margin:0 0 10px">Help</h4><a href="/pages/faq">FAQ</a><br><a href="/pages/contact">Contact</a></div><div><h4 style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#fff;margin:0 0 10px">Newsletter</h4><a href="/#newsletter" style="display:inline-block;background:#fff;color:#111;padding:8px 14px;border-radius:999px;font-weight:700;font-size:12px">Join</a></div></div><div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between"><span style="font-size:11px;color:#6b7280">© 2026 ${niche} — ${id}</span><span style="font-size:11px;color:#6b7280">StoreForge</span></div></footer>
{% schema %}{"name":"Footer ${id}","settings":[],"presets":[{"name":"Footer ${id}"}]}{% endschema %}`;
}

// Generate headers/footers for all
for(const id of allIds){
  const niche=nicheMap[id]||'General retail';
  const style=styleFor(niche,id);
  fs.writeFileSync(path.join(process.cwd(),'dev-theme-peri','sections',`header-${id}.liquid`), headerLiquid(id,niche,style));
  fs.writeFileSync(path.join(process.cwd(),'dev-theme-peri','sections',`footer-${id}.liquid`), footerLiquid(id,niche,style));
}
console.log('generated headers/footers for',allIds.length);

// Update pages.ts
let txt=fs.readFileSync('app/pagekit/pages.ts','utf8');
// For hand-authored PAGES: ensure each has header/footer unique
// Replace any existing header: "..." with header: "header-<id>"
// We'll do a global replace for each id's block
for(const id of allIds){
  // Only process those that appear as id: "xxx" in the PAGES array section (hand-authored)
  // Find the hand-authored section: between export const PAGES: ... = [ and ]; // ── Product
  // Simpler: replace all occurrences of header: "something" that are within 500 chars after id: "xxx"
  // Use a function to process
}
// Approach: Use a regex to find each page object in PAGES array and ensure header/footer
// The PAGES array is from "export const PAGES: PageDefinition[] = [" to "]; // ── Product"
// Extract that section
const pagesStart=txt.indexOf('export const PAGES: PageDefinition[] = [');
const pagesEnd=txt.indexOf(']; // ── Product');
if(pagesStart!==-1 && pagesEnd!==-1){
  let pagesSection=txt.slice(pagesStart, pagesEnd+2);
  for(const id of allIds){
    if(!pagesSection.includes(`id: "${id}"`)) continue;
    // Find the object for this id
    // Replace header and footer within that object's scope (approx 800 chars after id)
    const reHeader=new RegExp(`(id:\\s*"${id}"[\\s\\S]{0,600}?)(header:\\s*"[^"]*")`, 'm');
    if(reHeader.test(pagesSection)){
      pagesSection=pagesSection.replace(reHeader, `$1header: "header-${id}"`);
    } else {
      // Add header if missing
      const reId=new RegExp(`(id:\\s*"${id}"[^\\n]*\\n)`, 'm');
      pagesSection=pagesSection.replace(reId, `$1    header: "header-${id}",\n`);
    }
    const reFooter=new RegExp(`(id:\\s*"${id}"[\\s\\S]{0,800}?)(footer:\\s*"[^"]*")`, 'm');
    if(reFooter.test(pagesSection)){
      pagesSection=pagesSection.replace(reFooter, `$1footer: "footer-${id}"`);
    } else {
      const reHeaderAdded=new RegExp(`(header:\\s*"header-${id}"[^\\n]*\\n)`, 'm');
      if(reHeaderAdded.test(pagesSection)){
        pagesSection=pagesSection.replace(reHeaderAdded, `$1    footer: "footer-${id}",\n`);
      }
    }
  }
  txt=txt.slice(0,pagesStart) + pagesSection + txt.slice(pagesEnd+2);
}

// For ADAPTED: ensure header/footer are set to header-<id> / footer-<id>
txt=txt.replace(
  /header:\s*t\.header\s*\|\|\s*undefined,/,
  'header: `header-${t.id}`,'
);
txt=txt.replace(
  /footer:\s*t\.footer\s*\|\|\s*undefined,/,
  'footer: `footer-${t.id}`,'
);
// If the above didn't match (maybe different spacing), try alternative
if(!txt.includes('header: `header-${t.id}`')){
  txt=txt.replace(/header:\s*t\.header[^,]*,/, 'header: `header-${t.id}`,');
}
if(!txt.includes('footer: `footer-${t.id}`')){
  txt=txt.replace(/footer:\s*t\.footer[^,]*,/, 'footer: `footer-${t.id}`,');
}

fs.writeFileSync('app/pagekit/pages.ts', txt);
console.log('pages.ts updated hand-authored + adapted');
