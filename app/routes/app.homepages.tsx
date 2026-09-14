import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useSearchParams } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Page, Card, Text, BlockStack, InlineStack, Button, Badge, Banner, Box, Spinner, Tabs, Select } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma, { getOrSyncShop } from "../db.server";
import { stagePreview, applyToLiveTheme, liveThemeId } from "../pagekit/apply.server";
import fs from "fs";
import path from "path";

type HpDef = { id:string, version:number, name:string, niche:string, sections:string[], path:string, heroStyle:string };

function nicheFromName(name:string){
  const n=name.toLowerCase();
  if(n.includes('streetwear')) return 'Streetwear';
  if(n.includes('luxury')||n.includes('polki')||n.includes('solitaire')||n.includes('silver')||n.includes('royal')) return 'Jewellery';
  if(n.includes('beauty')||n.includes('clinical')||n.includes('pure')||n.includes('pink')||n.includes('ayurveda')||n.includes('glam')) return 'Beauty';
  if(n.includes('audio')||n.includes('tech')) return 'Electronics';
  return 'Lifestyle';
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url=new URL(request.url);
  const filter=url.searchParams.get('niche')||'all';
  const periDir=path.join(process.cwd(), "dev-theme-peri", "templates");
  if(!fs.existsSync(periDir)) return json({ all:[], niches:[], activeNiche:filter });

  const files=fs.readdirSync(periDir).filter(f=> f.startsWith('index.hp-v') && f.endsWith('.json'));
  const all:HpDef[]=files.map(f=>{
    const m=f.match(/hp-v(\d+)/);
    const ver=m?parseInt(m[1]):0;
    const content=fs.readFileSync(path.join(periDir,f),'utf8');
    let name=`Homepage v${ver}`;
    let secs:string[]=[];
    let heroStyle='standard';
    try{
      const j=JSON.parse(content);
      if(j.name) name=j.name;
      if(j.order) secs=j.order.map((k:string)=> j.sections[k].type );
      const heroKey=j.order?.find((k:string)=>k.includes('hero'));
      if(heroKey && j.sections[heroKey]?.settings?.desktop_layout){
        heroStyle=j.sections[heroKey].settings.desktop_layout;
      }
    }catch{}
    return { id:f.replace('.json','').replace('index.',''), version:ver, name, niche: nicheFromName(name), sections: secs, path:`/?preview_theme_id=hp-${ver}`, heroStyle };
  });
  const niches=['all', ...Array.from(new Set(all.map(a=>a.niche))).sort()];
  const filtered= filter==='all'? all : all.filter(a=>a.niche===filter);
  return json({ all, filtered, niches, activeNiche:filter });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await getOrSyncShop(session.shop, session.accessToken);
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
    }
  },[fetcher.state, fetcher.data]);

  const lastApplied = fetcher.data?.intent === 'apply' && fetcher.data?.ok ? fetcher.data : null;

  return (
    <Page
      fullWidth
      title="Flagship Homepages Vault"
      subtitle="100+ production-grade niche homepages. Click Apply to compile directly to your live theme with automatic rollback protection."
    >
      <BlockStack gap="400">
        {lastApplied && (
          <Banner tone="success" title={`Successfully Applied ${lastApplied.hpId} to Live Store!`}>
            <p>
              Compiled {lastApplied.sectionCount} sections into your active theme. Your store was backed up before writing.
            </p>
          </Banner>
        )}

        <Card>
          <InlineStack gap="200" align="space-between" blockAlign="center">
            <BlockStack gap="050">
              <Text as="h2" variant="headingMd">Curated Niche Blueprints</Text>
              <Text as="p" tone="subdued">{filtered.length} Flagship Homepages across {niches.length - 1} niches</Text>
            </BlockStack>
            <Select label="" labelInline options={niches.map(n=>({label: n==='all'? 'All Niches': n, value:n}))} value={activeNiche} onChange={v=>setSearchParams({niche:v})} />
          </InlineStack>
        </Card>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:16}}>
          {filtered.map(hp=>{
            const pv=previews[hp.id] || {status:'waiting'};
            return (
              <Card key={hp.id} padding="0">
                <BlockStack gap="0">
                  {/* Minimal Top Browser Bar */}
                  <div style={{height:28, background:'#f9fafb', borderBottom:'1px solid #f3f4f6', display:'flex', alignItems:'center', gap:6, padding:'0 10px'}}>
                    <span style={{width:7,height:7,borderRadius:99,background:'#ff5f57', display:'inline-block'}}/>
                    <span style={{width:7,height:7,borderRadius:99,background:'#ffbd2e', display:'inline-block'}}/>
                    <span style={{width:7,height:7,borderRadius:99,background:'#28c840', display:'inline-block'}}/>
                    <span style={{marginLeft:6, fontSize:11, color:'#6b7280', fontWeight:600, fontFamily:'monospace'}}>hp-v{hp.version}</span>
                    <span style={{marginLeft:'auto'}}><Badge tone={hp.version>=65 && hp.version<=100 ? 'success' : 'info'}>{hp.niche}</Badge></span>
                  </div>

                  {/* Design Hero Visual Banner */}
                  <div style={{position:'relative', aspectRatio:'16/9', overflow:'hidden', background:'#111827', borderBottom:'1px solid #e3e3e3'}}>
                    <img 
                      src={`/thumbnails/hp-v${hp.version}.jpg`}
                      alt={hp.name} 
                      loading="lazy" 
                      style={{width:'100%', height:'100%', objectFit:'cover', objectPosition:'top'}}
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = hp.niche.includes('Beauty') ? 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80' : hp.niche.includes('Streetwear') ? 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80' : hp.niche.includes('Jewellery') ? 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80' : hp.niche.includes('Electronics') ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80' : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80';
                      }}
                    />
                    <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)'}} />
                    <div style={{position:'absolute', bottom:8, left:10, right:10, color:'#ffffff', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span style={{fontSize:13, fontWeight:700, textShadow:'0 1px 3px rgba(0,0,0,0.6)'}}>{hp.name}</span>
                      <span style={{fontSize:10, background:'rgba(255,255,255,0.25)', backdropFilter:'blur(4px)', padding:'2px 6px', borderRadius:4}}>{hp.sections.length} Sec</span>
                    </div>
                  </div>

                  {/* Section Breakdown List Below Card */}
                  <Box padding="300">
                    <BlockStack gap="200">
                      <InlineStack align="space-between" blockAlign="center">
                        <Text as="h3" variant="headingSm">{hp.name}</Text>
                        <Badge tone="attention">{hp.niche}</Badge>
                      </InlineStack>

                      {/* Clean Minimal Section List */}
                      <div style={{background:'#f9fafb', borderRadius:8, padding:'8px 10px', border:'1px solid #f3f4f6'}}>
                        <Text as="p" variant="bodySm" style={{fontSize:10, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4}}>
                          Sections Included ({hp.sections.length}):
                        </Text>
                        <div style={{display:'flex', flexWrap:'wrap', gap:'4px 6px', fontSize:10, color:'#374151'}}>
                          {hp.sections.map((sec, idx) => (
                            <span key={sec + idx} style={{display:'inline-flex', alignItems:'center', background:'#ffffff', padding:'2px 6px', borderRadius:4, border:'1px solid #e5e7eb', fontWeight:500}}>
                              <span style={{color:'#9ca3af', marginRight:3, fontWeight:600}}>{String(idx + 1).padStart(2, '0')}.</span>
                              {sec.replace(/^hp\d+-/, '').replace(/-/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <InlineStack gap="200" style={{marginTop:4}}>
                        <Button variant="primary" onClick={()=>setActiveApply(hp.id)} disabled={fetcher.state!=='idle'}>Apply to Live Theme</Button>
                        <Button onClick={() => {
                          if(pv.status==='ready' && pv.href) {
                            window.open(pv.href, '_blank');
                          } else {
                            fetcher.submit({ intent:'stage', hpId: hp.id }, {method:'post'});
                          }
                        }}>
                          {pv.status==='staging' ? 'Staging...' : pv.status==='ready' ? 'Open Preview' : 'Preview'}
                        </Button>
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
