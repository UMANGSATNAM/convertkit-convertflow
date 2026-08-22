const fs=require('fs'), path=require('path');
const puppeteer=require('puppeteer');

const pagesPath=path.join(process.cwd(),'app/pagekit/pages.ts');
const sectionsDir=path.join(process.cwd(),'dev-theme-peri','sections');
const outDir=path.join(process.cwd(),'public','thumbnails');
const htmlDir=path.join(outDir,'html_hero');
fs.mkdirSync(htmlDir,{recursive:true});
fs.mkdirSync(outDir,{recursive:true});

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
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80&auto=format&fit=crop"
];
function hash(s){ let h=0; for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; return h; }

function parsePages(){
  const txt=fs.readFileSync(pagesPath,'utf8');
  const blocks=[...txt.matchAll(/\{\s*id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?niche:\s*"([^"]+)"[\s\S]*?description:\s*"([\s\S]*?)"\s*,[\s\S]*?sections:\s*\[([\s\S]*?)\]/g)];
  const maps=[];
  for(const m of blocks){
    const id=m[1], name=m[2], niche=m[3], desc=m[4].replace(/\s+/g,' ').trim();
    const secsRaw=m[5];
    const secs=[...secsRaw.matchAll(/"([^"]+)"/g)].map(x=>x[1]);
    maps.push({id, name, niche, description:desc, sections:secs});
  }
  // also add hp v templates from dev-theme-peri
  const periTemplates=path.join(process.cwd(),'dev-theme-peri','templates');
  if(fs.existsSync(periTemplates)){
    const tfiles=fs.readdirSync(periTemplates).filter(f=>f.startsWith('index.hp-v') && f.endsWith('.json'));
    for(const f of tfiles){
      try{
        const j=JSON.parse(fs.readFileSync(path.join(periTemplates,f),'utf8'));
        const id=f.replace('index.','').replace('.json','');
        if(!maps.find(x=>x.id===id)){
          const secs= j.order ? j.order.map(k=> j.sections[k].type) : Object.values(j.sections).map(s=>s.type);
          maps.push({id, name:j.name||id, niche: j.name?.includes('STREETWEAR')?'Streetwear': j.name?.includes('BEAUTY')?'Beauty & skincare':'General retail', description:j.name||id, sections:secs});
        }
      }catch{}
    }
  }
  return maps;
}

function renderHero(page){
  const heroId=page.sections.find(s=>s.includes('hero')) || page.sections[0];
  if(!heroId) return null;
  const heroPath=path.join(sectionsDir, heroId+'.liquid');
  if(!fs.existsSync(heroPath)) return null;
  let liquid=fs.readFileSync(heroPath,'utf8');
  // extract schema to get defaults
  const schemaMatch=liquid.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  let defaults={};
  if(schemaMatch){
    try{
      const schema=JSON.parse(schemaMatch[1]);
      for(const s of schema.settings||[]){
        if(s.id && s.default!==undefined) defaults[s.id]=s.default;
      }
    }catch{}
  }
  // pick hero image distinct
  const heroImg=HERO_POOL[ hash(page.id) % HERO_POOL.length ];
  // provide sample values for common ids
  const samples={
    image: heroImg,
    bg_color: defaults.bg_color || '#ffffff',
    text_color: defaults.text_color || '#111827',
    badge: defaults.badge || page.niche + ' • ' + page.id,
    heading: defaults.heading || page.name,
    description: defaults.description || page.description,
    btn_text: defaults.btn_text || 'Shop Now',
    btn_url: '/collections/all',
    float_title: 'Trusted by 50k+',
    float_sub: '4.8 ★ rating'
  };
  // merge defaults
  for(const k in defaults) if(!(k in samples)) samples[k]=defaults[k];
  // replace Liquid variables
  // handle {{ section.settings.xxx | image_url: width: 1000 }} -> heroImg
  liquid=liquid.replace(/\{\{\s*section\.settings\.image\s*\|\s*image_url[^}]*\}\}/g, heroImg);
  // handle {{ section.settings.xxx | default: '...' }} -> sample or default
  liquid=liquid.replace(/\{\{\s*section\.settings\.(\w+)\s*\|\s*default:\s*'([^']*)'\s*\}\}/g, (m, id, def)=> samples[id] || def);
  liquid=liquid.replace(/\{\{\s*section\.settings\.(\w+)\s*\|\s*default:\s*"([^"]*)"\s*\}\}/g, (m, id, def)=> samples[id] || def);
  liquid=liquid.replace(/\{\{\s*section\.settings\.(\w+)\s*\|\s*default:[^}]*\}\}/g, (m, id)=> samples[id] || '');
  // handle {{ section.settings.xxx }}
  liquid=liquid.replace(/\{\{\s*section\.settings\.(\w+)\s*\}\}/g, (m, id)=> samples[id] || '');
  // handle {{ section.settings.xxx | strip_html }} etc.
  liquid=liquid.replace(/\{\{\s*section\.settings\.(\w+)[^}]*\}\}/g, (m, id)=> samples[id] || '');
  // handle {{ '...' | placeholder_svg_tag }} -> placeholder div
  liquid=liquid.replace(/\{\{\s*'[^']*'\s*\|\s*placeholder_svg_tag[^}]*\}\}/g, `<div style="width:100%;height:100%;background:#f3f4f6;display:grid;place-items:center;color:#9ca3af">Image</div>`);
  // remove all {% ... %} tags
  liquid=liquid.replace(/\{%[^%]*%\}/g, '');
  // handle remaining {{ ... }} (like section.id) -> empty or sample
  liquid=liquid.replace(/\{\{[^}]+\}\}/g, '');
  // extract style and html
  // keep as is, wrap in html
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body{margin:0;padding:0;background:#fff}</style>
</head><body>
${liquid}
</body></html>`;
  return html;
}

async function main(){
  const pages=parsePages();
  console.log('total pages',pages.length);
  // generate html for each hero
  for(const p of pages){
    const html=renderHero(p);
    if(!html){ console.log('no hero for',p.id); continue; }
    fs.writeFileSync(path.join(htmlDir, p.id+'.html'), html);
  }
  console.log('html generated', fs.readdirSync(htmlDir).length);
  const browser=await puppeteer.launch({headless:true, args:['--no-sandbox']});
  const page=await browser.newPage();
  await page.setViewport({width:1280, height:900, deviceScaleFactor:2});
  let count=0;
  for(const p of pages){
    const htmlPath=path.join(htmlDir, p.id+'.html');
    if(!fs.existsSync(htmlPath)) continue;
    const fileUrl='file://' + htmlPath.replace(/\\/g,'/');
    await page.goto(fileUrl, {waitUntil:'load', timeout:10000});
    await new Promise(r=>setTimeout(r,400));
    try{
      await page.screenshot({path: path.join(outDir, p.id+'.jpg'), type:'jpeg', quality:85, clip:{x:0,y:0,width:1280,height:700}});
      count++;
      if(count%20===0) console.log(`captured ${count}/${pages.length}`);
    }catch(e){ console.log('fail',p.id, e.message); }
  }
  await browser.close();
  console.log('done captured',count);
}
main();
