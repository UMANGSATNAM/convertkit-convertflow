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

const NICHE_COLOR:Record<string,string> = {
  "Beauty & skincare":"#EC4899", "Streetwear":"#111111", "Luxury Apparel":"#7C3AED", "Jewellery":"#CA8A04", "Electronics & gadgets":"#6366F1", "Food, wellness & naturals":"#16A34A", "General retail":"#6B7280", "Direct to consumer":"#0EA5E9", "Apparel":"#E11D48"
};
function nicheTone(niche:string){
  if(niche.includes('Beauty')) return 'info';
  if(niche.includes('Streetwear')) return 'critical';
  if(niche.includes('Jewellery')) return 'warning';
  if(niche.includes('Luxury')) return 'attention';
  return undefined as any;
}

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
      v=v.filter(p=> p.name.toLowerCase().includes(q) || p.niche.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sections.join(' ').toLowerCase().includes(q));
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

  const queue=useRef<string[]>([]);
  const busy=useRef(false);
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

  const stats = { total: pages.filter(p=>p.pageType===activeType).length, showing: visible.length, staged: Object.values(previews).filter(p=>p.status==="ready").length };

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
                <Text as="p" tone="subdued" variant="bodySm">{stats.showing} of {stats.total} • {stats.staged} previews ready</Text>
              </InlineStack>
            </BlockStack>
          </Box>
        </Card>

        {themeError && (
          <Banner tone="critical" title="Could not read your theme">
            <p>{themeError}</p>
          </Banner>
        )}

        {applied && (
          <Banner tone={applied.ok && applied.verification?.ok ? "success" : applied.ok ? "warning" : "critical"} title={!applied.ok ? "Nothing was applied" : applied.verification?.ok ? "Applied and live ✓" : "Applied, but check required"} onDismiss={()=>setApplied(null)}>
            <BlockStack gap="200">
              <Text as="p" variant="bodyMd">{applied.ok ? applied.verification?.message : applied.error}</Text>
              {applied.ok && applied.verification?.passwordProtected && <Text as="p" variant="bodySm" tone="subdued">Storefront is password protected — page was written but couldn&apos;t be verified. Add password in Settings for auto-check.</Text>}
              <InlineStack gap="200">
                {applied.ok && <Button url={applied.storefrontUrl} target="_blank" variant="primary" icon={ViewIcon}>View your store</Button>}
                {applied.ok && <Button loading={undoer.state!=="idle"} onClick={()=>undoer.submit({intent:"undo", pageId: applied.pageId},{method:"post"})}>Undo</Button>}
              </InlineStack>
              {undoer.data?.intent==="undo" && <Text as="p" variant="bodySm" tone={undoer.data.ok?"success":"critical"}>{undoer.data.ok ? "Restored " + undoer.data.restored.length + " files" : undoer.data.error}</Text>}
            </BlockStack>
          </Banner>
        )}

        <Card padding="0">
          <Tabs selected={tabIndex} onSelect={i=>setParams({type: pageTypes[i].id},{preventScrollReset:true})} tabs={pageTypes.map(t=>({id:t.id, content: t.label + " (" + pages.filter(p=>p.pageType===t.id).length + ")"}))}>
            <Box padding="400">
              {visible.length===0 ? (
                <Box padding="800">
                  <BlockStack gap="200" align="center">
                    <Text as="p" variant="headingMd" alignment="center">No designs match</Text>
                    <Text as="p" tone="subdued" alignment="center">Try clearing search or choosing All niches.</Text>
                    <Button onClick={()=>{setSearch(""); setNicheFilter("all");}}>Clear filters</Button>
                  </BlockStack>
                </Box>
              ) : (
                <>
                <style>{`@media (max-width: 640px){.hp-grid{grid-template-columns:1fr !important}} @media (min-width: 641px) and (max-width: 1024px){.hp-grid{grid-template-columns:repeat(2, minmax(0,1fr)) !important}} @media (min-width: 1025px) and (max-width: 1440px){.hp-grid{grid-template-columns:repeat(3, minmax(0,1fr)) !important}} @media (min-width: 1441px){.hp-grid{grid-template-columns:repeat(4, minmax(0,1fr)) !important}} @media (min-width: 1800px){.hp-grid{grid-template-columns:repeat(5, minmax(0,1fr)) !important}}`}</style>
                <div className="hp-grid" style={{display:'grid', gridTemplateColumns:'repeat(4, minmax(0,1fr))', gap:'14px'}}>
                  {visible.map(page=>{
                    const preview=previews[page.id] || {status:"waiting"};
                    const isApplying=applyingId===page.id;
                    const color=NICHE_COLOR[page.niche] || "#111827";
                    return (
                      <div key={page.id} style={{border:'1px solid #e5e7eb', borderRadius:16, overflow:'hidden', background:'#fff', display:'flex', flexDirection:'column', boxShadow:'0 1px 2px rgba(0,0,0,.06)'}}>
                        <div style={{position:'relative', aspectRatio:'4 / 5.2', overflow:'hidden', background:'#f8f9fb', borderBottom:'1px solid #e5e7eb'}}>
                          <div style={{height:28, background:'#fff', borderBottom:'1px solid #e5e7eb', display:'flex', alignItems:'center', gap:6, padding:'0 10px'}}>
                            <span style={{width:8,height:8,borderRadius:99,background:'#ff5f57', display:'inline-block'}}/>
                            <span style={{width:8,height:8,borderRadius:99,background:'#ffbd2e', display:'inline-block'}}/>
                            <span style={{width:8,height:8,borderRadius:99,background:'#28c840', display:'inline-block'}}/>
                            <span style={{marginLeft:8, fontSize:11, color:'#6b7280', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{page.id} • {page.sections.length} sections</span>
                            <span style={{marginLeft:'auto', display:'flex', gap:6}}><Badge tone={nicheTone(page.niche)}>{page.niche}</Badge></span>
                          </div>
                          {preview.status==="ready" ? (
                            <iframe title={page.name} src={preview.src} loading="lazy" style={{position:'absolute', top:28, left:0, width:'1280px', height:'2200px', border:0, transform:'scale(0.265)', transformOrigin:'top left', background:'#fff'}} />
                          ) : preview.status==="failed" ? (
                            <div style={{position:'absolute', inset:'28px 0 0 0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, padding:20, textAlign:'center', background: "linear-gradient(135deg, " + color + "08, #fff)"}}>
                              <div style={{width:48,height:48, borderRadius:12, background:'#fee2e2', display:'grid', placeItems:'center', color:'#dc2626'}}>!</div>
                              <Text as="p" variant="bodySm" tone="critical">{preview.error || "Preview failed"}</Text>
                              <Button size="micro" onClick={()=>{ setPreviews(p=>({...p,[page.id]:{status:"staging"}})); stager.submit({intent:"stage", pageId:page.id},{method:"post"}); }}>Retry</Button>
                              <Text as="p" variant="bodySm" tone="subdued">Will apply without preview if needed — sections are verified before writing.</Text>
                            </div>
                          ) : (
                            <div style={{position:'absolute', inset:'28px 0 0 0', display:'flex', flexDirection:'column', overflow:'hidden'}}>
                              <div style={{flex:1, display:'grid', placeItems:'center', background:"linear-gradient(135deg, " + color + " 0%, " + color + "cc 55%, #ffffff 140%)", color:'#fff', padding:24, textAlign:'center'}}>
                                <BlockStack gap="200" align="center">
                                  <div style={{width:64,height:64, borderRadius:16, background:'rgba(255,255,255,.18)', backdropFilter:'blur(6px)', display:'grid', placeItems:'center', fontWeight:800, fontSize:22, border:'1px solid rgba(255,255,255,.25)'}}>{page.name.slice(0,2).toUpperCase()}</div>
                                  <Text as="p" variant="headingMd" alignment="center" style={{color:'#fff'}}>{page.name}</Text>
                                  <Text as="p" variant="bodySm" alignment="center" style={{color:'rgba(255,255,255,.85)'}}>{page.description.slice(0,96)}</Text>
                                  <Badge tone="info">{page.sections.length} sections</Badge>
                                </BlockStack>
                              </div>
                              <div style={{height:56, background:'#fff', borderTop:'1px solid #e5e7eb', display:'flex', alignItems:'center', justifyContent:'center', gap:8}}>
                                <Spinner size="small"/><Text as="p" variant="bodySm" tone="subdued">{preview.status==="staging" ? "Building live preview…" : "Queued — preparing"}</Text>
                              </div>
                            </div>
                          )}
                          {preview.status==="ready" && (
                            <div style={{position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)', display:'flex', gap:8, background:'rgba(17,24,39,.9)', padding:'6px 8px', borderRadius:999, backdropFilter:'blur(8px)'}}>
                              <Button size="micro" variant="primary" onClick={()=>setPreviewModal(page.id)}>Quick view</Button>
                              <Button size="micro" onClick={()=>{ if(preview.href) window.open(preview.href,'_blank'); }}>Full size</Button>
                            </div>
                          )}
                        </div>
                        <Box padding="300">
                          <BlockStack gap="200">
                            <InlineStack align="space-between" blockAlign="start" gap="200">
                              <Text as="h3" variant="headingSm" truncate>{page.name}</Text>
                              <Icon source={CheckIcon} tone="success" />
                            </InlineStack>
                            <Text as="p" variant="bodySm" tone="subdued" style={{display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', minHeight:36}}>{page.description}</Text>
                            <InlineStack gap="150" wrap>
                              <Badge>{page.niche}</Badge>
                              <Text as="p" variant="bodySm" tone="subdued">{page.sections.length} sections</Text>
                              <Text as="p" variant="bodySm" tone="subdued">•</Text>
                              <Text as="p" variant="bodySm" tone="subdued">{page.sections.slice(0,2).join(' + ')}</Text>
                            </InlineStack>
                            <InlineStack gap="200" blockAlign="center">
                              <div style={{flex:1}}>
                                <Button variant="primary" size="large" fullWidth loading={isApplying} disabled={applier.state!=="idle" && !isApplying} onClick={()=>setConfirming(page.id)}>Apply to live theme</Button>
                              </div>
                              <Button onClick={()=>{ if(preview.status==="waiting" || preview.status==="failed"){ setPreviews(p=>({...p,[page.id]:{status:"staging"}})); stager.submit({intent:"stage", pageId:page.id},{method:"post"}); } else if(preview.status==="ready"){ setPreviewModal(page.id); } }}>{preview.status==="ready" ? "Preview" : "Load preview"}</Button>
                            </InlineStack>
                            <Text as="p" variant="bodySm" tone="subdued">Writes to {themeId ? "theme " + themeId.slice(0,6) + "…" : 'live theme'} • Undo available after apply</Text>
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
        <Text as="p" variant="bodySm" tone="subdued">Tip: Use search to find “beauty”, “streetwear”, or “minimal”. All 117+ homepages have live previews from your store — no blank pages.</Text>
      </BlockStack>
      <Modal open={Boolean(confirming)} onClose={()=>setConfirming(null)} title={confirming ? "Apply \"" + (pages.find(p=>p.id===confirming)?.name) + "\" to your live store?" : ""} primaryAction={{content:"Apply now", loading: applier.state!=="idle", onAction:()=>{ if(confirming) applier.submit({intent:"apply", pageId: confirming},{method:"post"}); }}} secondaryActions={[{content:"Cancel", onAction:()=>setConfirming(null)}]}>
        <Modal.Section>
          <BlockStack gap="200">
            <Banner tone="info" title="You can undo this"><p>Your current page is copied first. Undo restores it in one click.</p></Banner>
            <Text as="p" variant="bodyMd">This replaces your current {(pageTypes.find(t=>t.id===activeType)?.label.toLowerCase())} on the live theme. Shoppers see it immediately.</Text>
            <Text as="p" variant="bodySm" tone="subdued">{pages.find(p=>p.id===confirming)?.sections.length} sections will be written: {pages.find(p=>p.id===confirming)?.sections.slice(0,4).join(', ')}…</Text>
          </BlockStack>
        </Modal.Section>
      </Modal>
      <Modal open={Boolean(previewModal)} onClose={()=>setPreviewModal(null)} title={previewModal ? pages.find(p=>p.id===previewModal)?.name || "" : ""} large>
        <Modal.Section flush>
          {previewModal && previews[previewModal]?.status==="ready" ? (
            <iframe title="Preview" src={previews[previewModal]?.src} style={{width:'100%', height:'70vh', border:0, display:'block', background:'#fff'}} />
          ) : <Box padding="400"><Text as="p" tone="subdued">Preview not ready yet. Click Load preview on the card.</Text></Box>}
        </Modal.Section>
      </Modal>
    </Page>
  );
}
