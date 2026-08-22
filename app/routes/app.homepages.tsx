import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useSearchParams } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Page, Card, Text, BlockStack, InlineStack, Button, Badge, Banner, Box, Spinner, Tabs, Select } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { stagePreview, applyToLiveTheme, liveThemeId } from "../pagekit/apply.server";
import fs from "fs";
import path from "path";

type HpDef = { id:string, version:number, name:string, niche:string, sections:string[], path:string, heroStyle:string };

function nicheFromName(name:string){
  const n=name.toLowerCase();
  if(n.includes('streetwear')) return 'Streetwear';
  if(n.includes('activewear')) return 'Activewear';
  if(n.includes('beauty')) return 'Beauty';
  if(n.includes('electronics')) return 'Electronics';
  if(n.includes('ethnic')) return 'Ethnic Wear';
  if(n.includes('gourmet')||n.includes('food')) return 'Food';
  if(n.includes('grooming')) return 'Grooming';
  if(n.includes('home decor')) return 'Home Decor';
  if(n.includes('jewellery')) return 'Jewellery';
  if(n.includes('kids')) return 'Kids';
  if(n.includes('cyber')||n.includes('matrix')) return 'Streetwear';
  return 'General';
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  const url=new URL(request.url);
  const filter=url.searchParams.get('niche')||'all';
  const periDir=path.join(process.cwd(), "dev-theme-peri", "templates");
  let files: string[]=[];
  try{ files=fs.readdirSync(periDir).filter(f=>f.startsWith('index.hp-v') && f.endsWith('.json')).sort((a,b)=>{
    const na=parseInt(a.match(/v(\d+)/)?.[1]||"0",10);
    const nb=parseInt(b.match(/v(\d+)/)?.[1]||"0",10);
    return na-nb;
  }); } catch{}
  const all:HpDef[]=files.map(f=>{
    const p=path.join(periDir,f);
    let j:any={};
    try{ j=JSON.parse(fs.readFileSync(p,'utf8'));}catch{}
    const ver=parseInt(f.match(/v(\d+)/)?.[1]||"0",10);
    const name=j.name||f;
    // sections are object keys values type
    const secs= j.sections? Object.values(j.sections).map((s:any)=>s.type) : (j.order||[]);
    // hero style from first section
    const heroStyle= secs.find((s:string)=>s.includes('hero')) || secs[0]||'';
    return { id:f.replace('.json','').replace('index.',''), version:ver, name, niche: nicheFromName(name), sections: secs, path:`/?preview_theme_id=hp-${ver}`, heroStyle };
  });
  const niches=['all', ...Array.from(new Set(all.map(a=>a.niche))).sort()];
  const filtered= filter==='all'? all : all.filter(a=>a.niche===filter);
  return json({ all, filtered, niches, activeNiche:filter });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop=await prisma.shop.findUnique({ where:{ shopDomain: session.shop } });
  if(!shop) return json({ ok:false, error:'Shop not connected' }, {status:400});
  const form=await request.formData();
  const intent=String(form.get('intent'));
  const hpId=String(form.get('hpId')); // e.g. hp-v65
  // hpId maps to template file index.hp-v65.json
  // Build a temporary PageDefinition for pagekit helpers
  const periPath=path.join(process.cwd(), "dev-theme-peri", "templates", `index.${hpId}.json`);
  if(!fs.existsSync(periPath)) return json({ ok:false, error:'Template not found '+hpId });
  const j=JSON.parse(fs.readFileSync(periPath,'utf8'));
  const sections= j.order ? j.order.map((k:string)=> j.sections[k].type ) : Object.values(j.sections).map((s:any)=>s.type);
  const pageDef:any={ id: hpId, name: j.name||hpId, pageType:'index', niche:'HP', description: j.name||'', sections };
  try{
    if(intent==='stage'){
      const result=await stagePreview(shop, pageDef);
      if(!result.ok) return json({ ok:false, error: result.error });
      return json({ ok:true, intent, hpId, themeId: result.themeId, previewPath: result.previewPath });
    }
    if(intent==='apply'){
      const result=await applyToLiveTheme(shop, pageDef);
      if(!result.ok) return json({ ok:false, error: result.error });
      return json({ ok:true, intent, hpId, storefrontUrl: result.storefrontUrl, sectionCount: result.sectionKeys.length });
    }
  }catch(e:any){ return json({ ok:false, error: e.message });}
  return json({ ok:false, error:'unknown intent' });
};

export default function HomepagesGallery(){
  const { filtered, niches, activeNiche } = useLoaderData<typeof loader>();
  const [, setSearchParams]=useSearchParams();
  const fetcher=useFetcher<any>();
  const [previews,setPreviews]=useState<Record<string,{status:'waiting'|'staging'|'ready'|'failed', src?:string, href?:string, error?:string}>>({});
  const [activeApply,setActiveApply]=useState<string|null>(null);
  const queue=useRef<string[]>([]);
  const busy=useRef(false);
  const shopDomain = typeof window!=='undefined'? window.location.hostname : '';
  const stager=useFetcher<any>();

  const pump=useCallback(()=>{
    if(busy.current) return;
    const next=queue.current.shift();
    if(!next) return;
    busy.current=true;
    setPreviews(p=>({...p,[next]:{status:'staging'}}));
    fetcher.submit({ intent:'stage', hpId: next }, {method:'post'});
  },[fetcher]);

  // init queue for visible
  useEffect(()=>{
    queue.current=filtered.map(f=>f.id).filter(id=>!previews[id]);
    // limit to first 9 to avoid rate limit spamming, user can click load more? For now pump sequentially
    pump();
  },[filtered, activeNiche]);

  useEffect(()=>{
    if(fetcher.state!=='idle' || !fetcher.data) return;
    const d=fetcher.data;
    if(d.hpId){
      setPreviews(p=>({...p,[d.hpId]: d.ok? {status:'ready', src:`/app/preview?theme=${encodeURIComponent(d.themeId)}&path=${encodeURIComponent(d.previewPath)}`, href: `https://${shopDomain}${d.previewPath}`} : {status:'failed', error:d.error}}));
      busy.current=false;
      setTimeout(pump,400);
    }
    if(d.intent==='apply' && d.ok){
      setActiveApply(null);
      alert(`Applied ${d.hpId} live! ${d.sectionCount} sections`);
    }
  },[fetcher.state, fetcher.data]);

  return (
    <Page title="All Homepages (v1 - v100)" subtitle="Preview every homepage. v52-v100 are niche-specific, each with distinct layout.">
      <BlockStack gap="400">
        <Card>
          <InlineStack gap="200" align="space-between">
            <Text as="h2" variant="headingMd">Filter by niche</Text>
            <Select label="" labelInline options={niches.map(n=>({label: n==='all'? 'All niches': n, value:n}))} value={activeNiche} onChange={v=>setSearchParams({niche:v})} />
          </InlineStack>
          <Box paddingBlockStart="300">
            <Text as="p" tone="subdued">{filtered.length} homepages • Click Apply to write to live theme • Previews auto-stage (3/4 scaled)</Text>
          </Box>
        </Card>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:16}}>
          {filtered.map(hp=>{
            const pv=previews[hp.id] || {status:'waiting'};
            return (
              <Card key={hp.id} padding="0">
                <BlockStack gap="0">
                  <div style={{position:'relative', aspectRatio:'3/4', overflow:'hidden', background:'#f6f6f7', borderBottom:'1px solid #e3e3e3'}}>
                    {pv.status==='ready' ? (
                      <iframe title={hp.name} src={pv.src} loading="lazy" style={{position:'absolute', top:0,left:0,width:'1280px',height:'1707px',border:0, transform:'scale(0.25)', transformOrigin:'top left', pointerEvents:'none'}} />
                    ):(
                      <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, padding:16, textAlign:'center'}}>
                        {pv.status==='failed' ? <Text as="p" tone="critical" variant="bodySm">{pv.error}</Text> : <><Spinner size="small"/><Text as="p" tone="subdued" variant="bodySm">{pv.status==='staging'?'Building preview…':'Queued • will auto-stage'}</Text><Button size="micro" onClick={()=>{ if(pv.status==='waiting'){ setPreviews(p=>({...p,[hp.id]:{status:'staging'}})); fetcher.submit({intent:'stage', hpId:hp.id},{method:'post'}); }}}>Stage now</Button></>}
                      </div>
                    )}
                    <Badge tone={hp.version>=65 && hp.version<=100 ? 'success' : 'info'}>v{hp.version}</Badge>
                  </div>
                  <Box padding="300">
                    <BlockStack gap="200">
                      <InlineStack align="space-between"><Text as="h3" variant="headingSm">{hp.name}</Text><Badge>{hp.niche}</Badge></InlineStack>
                      <Text as="p" variant="bodySm" tone="subdued">{hp.sections.length} sections • {hp.sections.slice(0,3).join(', ')}</Text>
                      <InlineStack gap="200">
                        <Button variant="primary" onClick={()=>setActiveApply(hp.id)} disabled={fetcher.state!=='idle'}>Apply</Button>
                        {pv.status==='ready' && pv.href && <Button url={pv.href} target="_blank">Open full</Button>}
                        <Button onClick={()=>{
                          if(pv.status!=='ready'){
                            setPreviews(p=>({...p,[hp.id]:{status:'staging'}}));
                            fetcher.submit({intent:'stage', hpId:hp.id},{method:'post'});
                          }
                        }}>Preview</Button>
                      </InlineStack>
                      {activeApply===hp.id && (
                        <Card padding="200">
                          <BlockStack gap="200">
                            <Text as="p" variant="bodyMd">Apply {hp.name} to live theme?</Text>
                            <InlineStack gap="200">
                              <Button variant="primary" loading={fetcher.state!=='idle'} onClick={()=>fetcher.submit({intent:'apply', hpId:hp.id},{method:'post'})}>Confirm Apply</Button>
                              <Button onClick={()=>setActiveApply(null)}>Cancel</Button>
                            </InlineStack>
                          </BlockStack>
                        </Card>
                      )}
                    </BlockStack>
                  </Box>
                </BlockStack>
              </Card>
            );
          })}
        </div>
      </BlockStack>
    </Page>
  );
}
