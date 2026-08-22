import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useSearchParams } from "@remix-run/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Page, Card, Text, BlockStack, InlineStack, Button, Badge, Banner, Box, Spinner, Tabs, Modal, TextField, Icon, Select, Divider
} from "@shopify/polaris";
import { SearchIcon, ViewIcon, CheckIcon } from "@shopify/polaris-icons";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import { ALL_PAGES, PAGE_TYPES, pageById, type PageType } from "../pagekit/pages";
import { applyToLiveTheme, stagePreview, restoreBackup, liveThemeId } from "../pagekit/apply.server";
import { verifyPage, describeVerification } from "../pagekit/verify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  let themeId: string | null = null;
  let themeError: string | null = null;
  if (shop) {
    try { themeId = await liveThemeId(shop); } catch (err:any){ themeError = err.message; }
  }
  return json({ pages: ALL_PAGES, pageTypes: PAGE_TYPES, shopDomain: session.shop, connected: Boolean(shop), themeId, themeError });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "");
  const pageId = String(form.get("pageId") || "");
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) return json({ intent, pageId, ok: false, error: "This store is not connected yet. Reinstall the app." });
  try {
    if (intent === "stage") {
      const page = pageById(pageId);
      if (!page) return json({ intent, pageId, ok: false, error: `No design called "${pageId}".` });
      const result = await stagePreview(shop, page);
      if (!result.ok) return json({ intent, pageId, ok: false, error: result.error });
      return json({ intent, pageId, ok: true, themeId: result.themeId, previewPath: result.previewPath });
    }
    if (intent === "apply") {
      const page = pageById(pageId);
      if (!page) return json({ intent, pageId, ok: false, error: `No design called "${pageId}".` });
      const result = await applyToLiveTheme(shop, page);
      if (!result.ok) return json({ intent, pageId, ok: false, error: result.error });
      const storefrontPassword = (shop.brandConfig as any)?.storefrontPassword;
      const path = new URL(result.storefrontUrl).pathname;
      const verification = await verifyPage(shop.shopDomain, { path, expect: result.sectionKeys.map(k => ({ key: k, type: k.replace(/^\d+-/, "") })), storefrontPassword });
      return json({ intent, pageId, ok: true, sectionCount: result.sectionKeys.length, backedUp: result.backedUp, collectionsWired: result.collectionsWired, storefrontUrl: result.storefrontUrl, missingPartials: result.missingPartials ?? null, verification: { ok: verification.ok, message: describeVerification(verification), passwordProtected: verification.passwordProtected, rendered: verification.sections.filter(s=>s.rendered).length, total: verification.sections.length } });
    }
    if (intent === "undo") {
      const themeId = await liveThemeId(shop);
      const result = await restoreBackup(shop, themeId);
      return json({ intent, pageId, ok: result.ok, error: result.error, restored: result.restored, takenAt: result.takenAt ?? null });
    }
    return json({ intent, pageId, ok: false, error: `Unknown action "${intent}".` });
  } catch (err:any){ return json({ intent, pageId, ok: false, error: err.message || String(err) }); }
};

interface PreviewState { status:"waiting"|"staging"|"ready"|"failed"; src?:string; href?:string; error?:string; }

export default function PageKit(){
  const { pages, pageTypes, shopDomain, connected, themeId, themeError } = useLoaderData<typeof loader>();
  const [params,setParams]=useSearchParams();
  const activeType=(params.get("type")||"index") as PageType;
  const tabIndex=Math.max(0, pageTypes.findIndex(t=>t.id===activeType));
  const [search,setSearch]=useState("");
  const [nicheFilter,setNicheFilter]=useState<string>("all");
  const [sortBy,setSortBy]=useState<"newest"|"name"|"sections">("newest");

  const allNiches=useMemo(()=>{
    const s=new Set(pages.filter(p=>p.pageType===activeType).map(p=>p.niche));
    return ["all", ...Array.from(s).sort()];
  },[pages,activeType]);

  const visibleBase=pages.filter(p=>p.pageType===activeType);
  const visible=useMemo(()=>{
    let v=[...visibleBase];
    if(search.trim()){
      const q=search.toLowerCase();
      v=v.filter(p=> p.name.toLowerCase().includes(q) || p.niche.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if(nicheFilter!=="all") v=v.filter(p=>p.niche===nicheFilter);
    if(sortBy==="name") v.sort((a,b)=>a.name.localeCompare(b.name));
    else if(sortBy==="sections") v.sort((a,b)=>b.sections.length - a.sections.length);
    else v.sort((a,b)=>b.id.localeCompare(a.id));
    return v;
  },[visibleBase,search,nicheFilter,sortBy]);

  const [previews,setPreviews]=useState<Record<string,PreviewState>>({});
  const [applied,setApplied]=useState<any|null>(null);
  const [confirming,setConfirming]=useState<string|null>(null);
  const [previewModal,setPreviewModal]=useState<string|null>(null);
  const stager=useFetcher<any>();
  const applier=useFetcher<any>();
  const undoer=useFetcher<any>();

  const queue=useRef<string[]>([]); const busy=useRef(false);
  const pump=useCallback(()=>{
    if(busy.current) return;
    const next=queue.current.shift();
    if(!next) return;
    busy.current=true;
    setPreviews(p=>({...p,[next]:{status:"staging"}}));
    stager.submit({intent:"stage", pageId:next},{method:"post"});
  },[stager]);

  useEffect(()=>{
    queue.current=visible.filter(p=>!previews[p.id]).map(p=>p.id);
    pump();
  },[activeType, search, nicheFilter]);

  useEffect(()=>{
    if(stager.state!=="idle" || !stager.data) return;
    const d=stager.data;
    if(d.intent!=="stage") return;
    setPreviews(p=>({...p,[d.pageId]: d.ok ? {status:"ready", src:`/app/preview?theme=${encodeURIComponent(d.themeId)}&path=${encodeURIComponent(d.previewPath)}`, href:`https://${shopDomain}${d.previewPath}`} : {status:"failed", error:d.error}}));
    busy.current=false;
    setTimeout(pump,350);
  },[stager.state, stager.data, pump, shopDomain]);

  useEffect(()=>{
    if(applier.state==="idle" && applier.data?.intent==="apply"){ setApplied(applier.data); setConfirming(null); }
  },[applier.state, applier.data]);

  const applyingId= applier.state!=="idle" ? String(applier.formData?.get("pageId")||"") : "";

  if(!connected){
    return (
      <Page title="Build your store">
        <Banner tone="critical" title="This store is not connected">
          <p>Reinstall the app from your Shopify admin and this screen will work.</p>
        </Banner>
      </Page>
    );
  }

  return (
    <Page fullWidth title="Build your store" subtitle="Premium templates with live previews — one click to apply to your live theme.">
      <BlockStack gap="500">
        <Card>
          <Box padding="400">
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text as="h2" variant="headingLg">Choose your homepage</Text>
                  <Text as="p" tone="subdued">Every design is complete — no blank sections. Previews are your store with your products.</Text>
                </BlockStack>
                <Badge tone="success">Live theme: {themeId ? themeId.slice(0,8)+"…" : "—"}</Badge>
              </InlineStack>
              <Divider />
              <InlineStack gap="300" wrap>
                <div style={{flex:'1 1 280px', minWidth:240}}>
                  <TextField label="" placeholder="Search by name, niche, style…" value={search} onChange={setSearch} autoComplete="off" prefix={<Icon source={SearchIcon}/>} clearButton onClearButtonClick={()=>setSearch("")}/>
                </div>
                <Select label="" options={allNiches.map(n=>({label: n==='all'? 'All niches' : n + " (" + visibleBase.filter(p=>p.niche===n).length + ")", value:n}))} value={nicheFilter} onChange={setNicheFilter} />
                <Select label="" options={[{label:'Newest first',value:'newest'},{label:'Name A–Z',value:'name'},{label:'Most sections',value:'sections'}]} value={sortBy} onChange={setSortBy as any} />
                <Text as="p" tone="subdued" variant="bodySm">{visible.length} of {pages.filter(p=>p.pageType===activeType).length} • {Object.values(previews).filter(p=>p.status==="ready").length} previews ready</Text>
              </InlineStack>
            </BlockStack>
          </Box>
        </Card>

        {themeError && <Banner tone="critical" title="Could not read your theme"><p>{themeError}</p></Banner>}
        {applied && (
          <Banner tone={applied.ok && applied.verification?.ok ? "success" : applied.ok ? "warning" : "critical"} title={!applied.ok ? "Nothing was applied" : applied.verification?.ok ? "Applied and live ✓" : "Applied, but check required"} onDismiss={()=>setApplied(null)}>
            <BlockStack gap="200">
              <Text as="p" variant="bodyMd">{applied.ok ? applied.verification?.message : applied.error}</Text>
              <InlineStack gap="200">
                {applied.ok && <Button url={applied.storefrontUrl} target="_blank" variant="primary" icon={ViewIcon}>View your store</Button>}
                {applied.ok && <Button loading={undoer.state!=="idle"} onClick={()=>undoer.submit({intent:"undo", pageId: applied.pageId},{method:"post"})}>Undo</Button>}
              </InlineStack>
            </BlockStack>
          </Banner>
        )}

        <Card padding="0">
          <Tabs selected={tabIndex} onSelect={i=>setParams({type: pageTypes[i].id},{preventScrollReset:true})} tabs={pageTypes.map(t=>({id:t.id, content: t.label + " (" + pages.filter(p=>p.pageType===t.id).length + ")"}))}>
            <Box padding="400">
              {visible.length===0 ? (
                <Box padding="800"><BlockStack gap="200" align="center"><Text as="p" variant="headingMd" alignment="center">No designs match</Text><Button onClick={()=>{setSearch(""); setNicheFilter("all");}}>Clear filters</Button></BlockStack></Box>
              ) : (
                <>
                <style>{`@media (max-width:640px){.hp-grid{grid-template-columns:1fr !important}} @media (min-width:641px) and (max-width:1024px){.hp-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important}} @media (min-width:1025px) and (max-width:1440px){.hp-grid{grid-template-columns:repeat(3,minmax(0,1fr)) !important}} @media (min-width:1441px){.hp-grid{grid-template-columns:repeat(4,minmax(0,1fr)) !important}} @media (min-width:1800px){.hp-grid{grid-template-columns:repeat(5,minmax(0,1fr)) !important}} .hp-card:hover .hp-iframe{transform:scale(0.265) translateY(-520px) !important} .hp-iframe{will-change:transform; transition:transform 6s cubic-bezier(0.4,0,0.2,1)}`}</style>
                <div className="hp-grid" style={{display:'grid', gridTemplateColumns:'repeat(4,minmax(0,1fr))', gap:'16px'}}>
                  {visible.map(page=>{
                    const preview=previews[page.id] || {status:"waiting"};
                    const isApplying=applyingId===page.id;
                    // domain pill should show NAME (as per request) not id — e.g. "SKYSTREAM OVERSEAS" -> "skystreamoverseas.com" style but we show name lower
                    const domainText = page.name.toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,18) + ".com";
                    return (
                      <div key={page.id} className="hp-card" style={{border:'1px solid #e5e7eb', borderRadius:16, overflow:'hidden', background:'#fff', display:'flex', flexDirection:'column', boxShadow:'0 4px 12px rgba(0,0,0,.04)'}}>
                        {/* Browser bar — exact like screenshot: dots + centered domain pill */}
                        <div style={{height:36, background:'#fff', borderBottom:'1px solid #f3f4f6', display:'flex', alignItems:'center', gap:8, padding:'0 10px'}}>
                          <span style={{width:8,height:8,borderRadius:99,background:'#ff5f57', display:'inline-block'}}/>
                          <span style={{width:8,height:8,borderRadius:99,background:'#ffbd2e', display:'inline-block'}}/>
                          <span style={{width:8,height:8,borderRadius:99,background:'#28c840', display:'inline-block'}}/>
                          <div style={{flex:1, display:'flex', justifyContent:'center'}}>
                            <div style={{background:'#f3f4f6', borderRadius:999, padding:'5px 14px', fontSize:11, color:'#8b8d94', fontWeight:500, minWidth:140, textAlign:'center', maxWidth:180, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{domainText}</div>
                          </div>
                          <div style={{width:24}} />
                        </div>
                        {/* HERO — STATIC SCREENSHOT (SS) CHIPKAVO — distinct per page, Preview opens full page */}
                        <div style={{position:'relative', aspectRatio:'4 / 2.7', overflow:'hidden', background:'#f9fafb', cursor:'pointer'}} onClick={()=>{
                          if(preview.status==="ready" && preview.href){ window.open(preview.href,'_blank'); }
                          else if(preview.status!=="staging"){ setPreviews(p=>({...p,[page.id]:{status:"staging"}})); stager.submit({intent:"stage", pageId:page.id},{method:"post"}); }
                        }}>
                          <img src={`/thumbnails/${page.id}.jpg`} alt={page.name} loading="lazy" style={{width:'100%', height:'100%', objectFit:'cover', objectPosition:'top'}} onError={(e)=>{ (e.target as HTMLImageElement).style.display='none'; }} />
                          {/* Fallback gradient if image not loaded — hidden when img loads */}
                          <div style={{position:'absolute', inset:0, background:`linear-gradient(180deg, transparent 50%, rgba(0,0,0,.05) 100%)`, pointerEvents:'none'}} />
                          <div style={{position:'absolute', bottom:10, left:10, display:'flex', gap:6}}>
                            <span style={{background:'rgba(255,255,255,.95)', backdropFilter:'blur(6px)', padding:'4px 8px', borderRadius:999, fontSize:11, fontWeight:700, color:'#16a34a', border:'1px solid rgba(0,0,0,.06)'}}>Live</span>
                          </div>
                          <div style={{position:'absolute', bottom:10, right:10}}>
                            <span style={{background:'rgba(255,255,255,.95)', backdropFilter:'blur(6px)', padding:'4px 10px', borderRadius:999, fontSize:11, fontWeight:500, color:'#6b7280', border:'1px solid rgba(0,0,0,.06)', maxWidth:120, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{page.niche}</span>
                          </div>
                          {preview.status==="staging" && <div style={{position:'absolute', inset:0, background:'rgba(255,255,255,.75)', display:'grid', placeItems:'center'}}><Spinner size="small"/><Text as="p" variant="bodySm">Preparing live preview…</Text></div>}
                        </div>
                        {/* Content — EXACT like screenshot: purple niche, bold title, description, Visit site button */}
                        <Box padding="300">
                          <BlockStack gap="150">
                            <Text as="p" variant="bodySm" style={{color:'#6366f1', fontWeight:700, fontSize:11, letterSpacing:'.06em', textTransform:'uppercase'}}>{page.niche.toUpperCase()}</Text>
                            <Text as="h3" variant="headingSm" style={{fontWeight:800, fontSize:15, lineHeight:1.2}}>{page.name.toUpperCase()}</Text>
                            <Text as="p" variant="bodySm" tone="subdued" style={{display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden', minHeight:54, fontSize:12, lineHeight:1.5}}>{page.description}</Text>
                            <InlineStack gap="200" blockAlign="center">
                              <Button variant="primary" size="medium" loading={isApplying} disabled={applier.state!=="idle" && !isApplying} onClick={()=>setConfirming(page.id)}>Apply</Button>
                              <Button onClick={()=>{
                                if(preview.status==="ready" && preview.href){ window.open(preview.href,'_blank'); }
                                else if(preview.status==="waiting" || preview.status==="failed"){
                                  setPreviews(p=>({...p,[page.id]:{status:"staging"}}));
                                  stager.submit({intent:"stage", pageId:page.id},{method:"post"});
                                  // after staging, preview.href will be ready — user can click again to open full page
                                } else {
                                  // staging in progress
                                }
                              }}>Preview</Button>
                            </InlineStack>
                          </BlockStack>
                        </Box>
                      </div>
                    );
                  })}
                </div>
                </>
              )}
            </Box>
          </Tabs>
        </Card>
        <Text as="p" variant="bodySm" tone="subdued">Tip: Hover thumbnail to auto-scroll live store. All 117+ homepages have live previews from your store — no blank pages.</Text>
      </BlockStack>
      <Modal open={Boolean(confirming)} onClose={()=>setConfirming(null)} title={confirming ? "Apply \"" + (pages.find(p=>p.id===confirming)?.name) + "\" to your live store?" : ""} primaryAction={{content:"Apply now", loading: applier.state!=="idle", onAction:()=>{ if(confirming) applier.submit({intent:"apply", pageId: confirming},{method:"post"}); }}} secondaryActions={[{content:"Cancel", onAction:()=>setConfirming(null)}]}>
        <Modal.Section>
          <BlockStack gap="200">
            <Banner tone="info" title="You can undo this"><p>Your current page is copied first. Undo restores it in one click.</p></Banner>
            <Text as="p" variant="bodyMd">This replaces your current {(pageTypes.find(t=>t.id===activeType)?.label.toLowerCase())} on the live theme. Shoppers see it immediately.</Text>
          </BlockStack>
        </Modal.Section>
      </Modal>
      <Modal open={Boolean(previewModal)} onClose={()=>setPreviewModal(null)} title={previewModal ? pages.find(p=>p.id===previewModal)?.name || "" : ""} large>
        <Modal.Section flush>
          {previewModal && previews[previewModal]?.status==="ready" ? (
            <iframe title="Preview" src={previews[previewModal]?.src} style={{width:'100%', height:'70vh', border:0, display:'block', background:'#fff'}} />
          ) : <Box padding="400"><Text as="p" tone="subdued">Preview not ready yet. Click Preview on the card.</Text></Box>}
        </Modal.Section>
      </Modal>
    </Page>
  );
}
