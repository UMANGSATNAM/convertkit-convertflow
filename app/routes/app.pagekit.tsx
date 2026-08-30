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
import { applyToLiveTheme, stagePreview, stagePreviewBatch, restoreBackup, liveThemeId } from "../pagekit/apply.server";
import { verifyPage, describeVerification } from "../pagekit/verify.server";

/**
 * Is the storefront behind a password, and do we have it?
 *
 * A password-protected storefront returns the login form for every page, with a
 * 200 status. The preview proxy already detects that and renders an explanation
 * — but the explanation is drawn inside the preview frame, which is scaled to
 * 23% so a desktop page fits the card, so it comes out as unreadable specks.
 * The merchant sees twelve blank cards and no reason.
 *
 * Shopify does not expose the storefront password through the Admin API, so it
 * cannot be read; it has to be typed once in Settings. Detecting it here means
 * the screen can say that plainly instead of showing nothing.
 */
async function passwordState(shopDomain: string, saved: string | undefined) {
  try {
    const res = await fetch(`https://${shopDomain}/`, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" },
      redirect: "follow",
    });
    const html = await res.text();
    const locked = /name=["']password["']/.test(html) && /storefront_password|form_type/.test(html);
    return { locked, havePassword: Boolean(saved) };
  } catch {
    // A probe that cannot run is not evidence either way, so it claims nothing.
    return { locked: false, havePassword: Boolean(saved) };
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  let themeId: string | null = null;
  let themeError: string | null = null;
  if (shop) {
    try { themeId = await liveThemeId(shop); } catch (err:any){ themeError = err.message; }
  }

  const saved = (shop?.brandConfig as any)?.storefrontPassword as string | undefined;
  const { locked, havePassword } = await passwordState(session.shop, saved);

  return json({
    pages: ALL_PAGES, pageTypes: PAGE_TYPES, shopDomain: session.shop,
    connected: Boolean(shop), themeId, themeError,
    // Locked and no password saved means every preview will be blank.
    previewsBlocked: locked && !havePassword,
  });
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

    // Several cards at once, in a single upload. Designs mostly do not share
    // files, so this saves little bandwidth — what it saves is waiting: one
    // round trip instead of one per card.
    if (intent === "stage-batch") {
      const ids = String(form.get("pageIds") || "").split(",").filter(Boolean);
      const wanted = ids.map(pageById).filter(Boolean) as any[];
      if (!wanted.length) return json({ intent, ok: false, error: "No designs to stage.", results: [] });

      const { themeId, results } = await stagePreviewBatch(shop, wanted);
      return json({ intent, ok: true, themeId, results });
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

/**
 * A card's preview: the real storefront, rendered.
 *
 * The stored JPG is kept, but only as a placeholder while the live frame loads.
 * On its own it is the wrong thing to show — it is a snapshot of someone else's
 * store, so it cannot show the merchant their own products, prices or branding,
 * which is the only reason to look at a preview before applying.
 *
 * The frame is the storefront proxied through this app. Pointing an iframe
 * straight at the shop does not work: Shopify sends `X-Frame-Options` on
 * storefront responses and the browser refuses to render it.
 *
 * A desktop page is rendered at 1280px and scaled down to the card, so the
 * layout is the real one rather than the mobile breakpoint. The scale is
 * measured rather than assumed, because the grid columns are fluid.
 */
function getThumbnailUrl(pageId: string): string {
  const num = pageId.match(/\d+/)?.[0];
  if (num) {
    return `/thumbnails/hp-v${num}.jpg`;
  }
  return `/thumbnails/${pageId}.jpg`;
}

function LivePreview({
  pageId, poster, alt, onOpen,
}: {
  pageId: string;
  poster: string;
  alt: string;
  niche?: string;
  onOpen: () => void;
}) {
  const [imgSrc, setImgSrc] = useState(poster);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      onClick={onOpen}
      style={{
        position: "relative",
        aspectRatio: "16 / 9",
        overflow: "hidden",
        background: "#f3f4f6",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {hasError ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{alt}</span>
        </div>
      ) : (
        <img
          src={imgSrc}
          alt={alt}
          loading="lazy"
          style={{
            width: "100%", height: "100%", objectFit: "cover", objectPosition: "top",
            display: "block",
          }}
          onError={() => {
            const num = pageId.match(/\d+/)?.[0];
            if (num && !imgSrc.includes(`hp-v${num}.jpg`)) {
              setImgSrc(`/thumbnails/hp-v${num}.jpg`);
            } else if (num && !imgSrc.includes(`hp${num}.jpg`)) {
              setImgSrc(`/thumbnails/hp${num}.jpg`);
            } else {
              setHasError(true);
            }
          }}
        />
      )}

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(17, 24, 39, 0.8)", backdropFilter: "blur(4px)", padding: "6px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "80%" }}>
          {alt}
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, color: "#818cf8", textTransform: "uppercase" }}>
          {pageId.toUpperCase()}
        </span>
      </div>
    </div>
  );
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
      v=v.filter(p=> p.name.toLowerCase().includes(q) || p.niche.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if(nicheFilter!=="all") v=v.filter(p=>p.niche===nicheFilter);
    if(sortBy==="name") v.sort((a,b)=>a.name.localeCompare(b.name));
    else if(sortBy==="sections") v.sort((a,b)=>b.sections.length - a.sections.length);
    else v.sort((a,b)=>b.id.localeCompare(a.id));
    return v;
  },[visibleBase,search,nicheFilter,sortBy]);

  const [previews,setPreviews]=useState<Record<string,PreviewState>>({});
  const [confirming,setConfirming]=useState<string|null>(null);
  const [previewModal,setPreviewModal]=useState<string|null>(null);
  const [applied,setApplied]=useState<any|null>(null);

  const stager=useFetcher<any>();
  const applier=useFetcher<any>();
  const undoer=useFetcher<any>();

  const openPreview = useCallback((id: string) => {
    setPreviewModal(id);
    if (!previews[id] || previews[id].status === "failed") {
      setPreviews(p => ({ ...p, [id]: { status: "staging" } }));
      stager.submit({ intent: "stage", pageId: id }, { method: "post" });
    }
  }, [previews, stager]);

  useEffect(() => {
    if (stager.state !== "idle" || !stager.data) return;
    const d = stager.data;
    if (d.intent === "stage") {
      setPreviews(p => ({
        ...p,
        [d.pageId]: d.ok
          ? {
              status: "ready",
              src: `/app/preview?shop=${encodeURIComponent(shopDomain)}&theme=${encodeURIComponent(d.themeId)}&path=${encodeURIComponent(d.previewPath)}`,
              href: `https://${shopDomain}${d.previewPath}`,
            }
          : { status: "failed", error: d.error },
      }));
    }
  }, [stager.state, stager.data, shopDomain]);

  useEffect(()=>{
    if(applier.state==="idle" && applier.data?.intent==="apply"){ setApplied(applier.data); setConfirming(null); }
  },[applier.state, applier.data]);

  const applyingId = applier.state!=="idle" ? String(applier.formData?.get("pageId")||"") : "";

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
    <Page fullWidth title="Build your store" subtitle="Browse hand-authored homepage designs. Click Apply to write directly to your live theme.">
      <BlockStack gap="400">
        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="300">
              <InlineStack gap="300" align="space-between" blockAlign="center" wrap={false}>
                <div style={{flex:'1 1 280px', minWidth:240}}>
                  <TextField label="" placeholder="Search by name, niche, style…" value={search} onChange={setSearch} autoComplete="off" prefix={<Icon source={SearchIcon}/>} clearButton onClearButtonClick={()=>setSearch("")}/>
                </div>
                <Select label="" options={allNiches.map(n=>({label: n==='all'? 'All niches' : n + " (" + visibleBase.filter(p=>p.niche===n).length + ")", value:n}))} value={nicheFilter} onChange={setNicheFilter} />
                <Select label="" options={[{label:'Newest first',value:'newest'},{label:'Name A–Z',value:'name'},{label:'Most sections',value:'sections'}]} value={sortBy} onChange={setSortBy as any} />
                <Text as="p" tone="subdued" variant="bodySm">{visible.length} of {pages.filter(p=>p.pageType===activeType).length} designs</Text>
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
                <style>{`@media (max-width:640px){.hp-grid{grid-template-columns:1fr !important}} @media (min-width:641px) and (max-width:1024px){.hp-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important}} @media (min-width:1025px) and (max-width:1440px){.hp-grid{grid-template-columns:repeat(3,minmax(0,1fr)) !important}} @media (min-width:1441px){.hp-grid{grid-template-columns:repeat(4,minmax(0,1fr)) !important}} @media (min-width:1800px){.hp-grid{grid-template-columns:repeat(5,minmax(0,1fr)) !important}}`}</style>
                <div className="hp-grid" style={{display:'grid', gridTemplateColumns:'repeat(4,minmax(0,1fr))', gap:'16px'}}>
                  {visible.map(page=>{
                    const isApplying=applyingId===page.id;
                    const domainText = page.name.toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,18) + ".com";
                    return (
                      <div key={page.id} className="hp-card" style={{border:'1px solid #e5e7eb', borderRadius:16, overflow:'hidden', background:'#fff', display:'flex', flexDirection:'column', boxShadow:'0 4px 12px rgba(0,0,0,.04)', transition:'transform 0.2s ease, box-shadow 0.2s ease'}}>
                        <div style={{height:34, background:'#f9fafb', borderBottom:'1px solid #f3f4f6', display:'flex', alignItems:'center', gap:8, padding:'0 10px'}}>
                          <span style={{width:7,height:7,borderRadius:99,background:'#ff5f57', display:'inline-block'}}/>
                          <span style={{width:7,height:7,borderRadius:99,background:'#ffbd2e', display:'inline-block'}}/>
                          <span style={{width:7,height:7,borderRadius:99,background:'#28c840', display:'inline-block'}}/>
                          <div style={{flex:1, display:'flex', justifyContent:'center'}}>
                            <div style={{background:'#f3f4f6', borderRadius:999, padding:'4px 12px', fontSize:11, color:'#6b7280', fontWeight:500, minWidth:130, textAlign:'center', maxWidth:170, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{domainText}</div>
                          </div>
                          <span style={{fontSize:10, fontWeight:700, color:'#9ca3af', fontFamily:'monospace'}}>{page.id.startsWith('hp-v') ? page.id : 'hp-v1'}</span>
                        </div>

                        <LivePreview
                          pageId={page.id}
                          poster={getThumbnailUrl(page.id)}
                          alt={page.name}
                          niche={page.niche}
                          onOpen={() => openPreview(page.id)}
                        />

                        <Box padding="300">
                          <BlockStack gap="200">
                            <InlineStack align="space-between" blockAlign="center">
                              <span style={{color:'#6366f1', fontWeight:700, fontSize:11, letterSpacing:'.06em', textTransform:'uppercase'}}>{page.niche}</span>
                              <Badge tone="success">Ready</Badge>
                            </InlineStack>

                            <h3 style={{fontWeight:800, fontSize:15, lineHeight:1.2, margin:0, color:'#111827'}}>{page.name}</h3>
                            <p style={{display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', minHeight:34, fontSize:12, lineHeight:1.4, color:'#6b7280', margin:0}}>{page.description}</p>

                            <div style={{background:'#f9fafb', borderRadius:8, padding:'8px 10px', border:'1px solid #f3f4f6'}}>
                              <div style={{fontSize:10, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4}}>
                                Included Sections ({page.sections.length}):
                              </div>
                              <div style={{display:'flex', flexWrap:'wrap', gap:'4px 6px', maxHeight:44, overflow:'hidden'}}>
                                {page.sections.slice(0, 4).map((sec, idx) => (
                                  <span key={sec + idx} style={{display:'inline-flex', alignItems:'center', background:'#ffffff', padding:'2px 6px', borderRadius:4, border:'1px solid #e5e7eb', fontSize:10, color:'#374151', fontWeight:500}}>
                                    <span style={{color:'#9ca3af', marginRight:3, fontWeight:600}}>{String(idx + 1).padStart(2, '0')}.</span>
                                    {sec.replace(/^(hp\d*-|header-|footer-)/, '').replace(/-/g, ' ')}
                                  </span>
                                ))}
                                {page.sections.length > 4 && (
                                  <span style={{fontSize:10, color:'#6366f1', fontWeight:600, alignSelf:'center'}}>+{page.sections.length - 4} more</span>
                                )}
                              </div>
                            </div>

                            <InlineStack gap="200" blockAlign="center" style={{marginTop:4}}>
                              <Button variant="primary" size="medium" loading={isApplying} disabled={applier.state!=="idle" && !isApplying} onClick={()=>setConfirming(page.id)}>Apply to Store</Button>
                              <Button onClick={() => openPreview(page.id)}>Preview Store</Button>
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
      </BlockStack>
      <Modal open={Boolean(confirming)} onClose={()=>setConfirming(null)} title={confirming ? "Apply \"" + (pages.find(p=>p.id===confirming)?.name) + "\" to your live store?" : ""} primaryAction={{content:"Apply now", loading: applier.state!=="idle", onAction:()=>{ if(confirming) applier.submit({intent:"apply", pageId: confirming},{method:"post"}); }}} secondaryActions={[{content:"Cancel", onAction:()=>setConfirming(null)}]}>
        <Modal.Section>
          <BlockStack gap="200">
            <Banner tone="info" title="You can undo this"><p>Your current page is copied first. Undo restores it in one click.</p></Banner>
            <Text as="p" variant="bodyMd">This replaces your current {(pageTypes.find(t=>t.id===activeType)?.label.toLowerCase())} on the live theme. Shoppers see it immediately.</Text>
          </BlockStack>
        </Modal.Section>
      </Modal>
      <Modal open={Boolean(previewModal)} onClose={()=>setPreviewModal(null)} title={previewModal ? pages.find(p=>p.id===previewModal)?.name || "" : ""} size="large">
        <Modal.Section flush>
          {previewModal && previews[previewModal]?.status==="ready" ? (
            <BlockStack gap="0">
              <iframe title="Preview" src={previews[previewModal]?.src} style={{width:'100%', height:'70vh', border:0, display:'block', background:'#fff'}} />
              <Box padding="300">
                <InlineStack gap="200">
                  <Button url={previews[previewModal]?.href} target="_blank">Open on your storefront</Button>
                  <Button variant="primary" onClick={()=>{ const id=previewModal; setPreviewModal(null); setConfirming(id); }}>
                    Apply this page
                  </Button>
                </InlineStack>
              </Box>
            </BlockStack>
          ) : (
            <Box padding="400">
              <InlineStack gap="200" blockAlign="center">
                {previews[previewModal||""]?.status==="failed"
                  ? <Text as="p" tone="critical">{previews[previewModal||""]?.error || "This preview could not be built."}</Text>
                  : <><Spinner size="small" /><Text as="p" tone="subdued">Building this preview on your store…</Text></>}
              </InlineStack>
            </Box>
          )}
        </Modal.Section>
      </Modal>
    </Page>
  );
}
