import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useSearchParams } from "@remix-run/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Page, Card, Text, BlockStack, InlineStack, Button, Badge, Banner, Box, Spinner, Tabs, Modal, TextField, Icon, Select, Divider
} from "@shopify/polaris";
import { SearchIcon, ViewIcon, CheckIcon } from "@shopify/polaris-icons";
import prisma, { getOrSyncShop } from "../db.server";
import { authenticate } from "../shopify.server";
import { ALL_PAGES, PAGE_TYPES, pageById, type PageType } from "../pagekit/pages";
import {
  applyToLiveTheme,
  applyToDraftTheme,
  publishTheme,
  stagePreview,
  stagePreviewBatch,
  restoreBackup,
  liveThemeId,
} from "../pagekit/apply.server";
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
  const shop = await getOrSyncShop(session.shop, session.accessToken);
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
  const shop = await getOrSyncShop(session.shop, session.accessToken);
  if (!shop) return json({ intent, pageId, ok: false, error: "This store is not connected yet. Please click Connect Store to authorize." });
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
    if (intent === "apply-draft") {
      const page = pageById(pageId);
      if (!page) return json({ intent, pageId, ok: false, error: `No design called "${pageId}".` });
      const result = await applyToDraftTheme(shop, page);
      if (!result.ok) return json({ intent, pageId, ok: false, error: result.error });
      return json({
        intent,
        pageId,
        ok: true,
        draftThemeId: result.draftThemeId,
        draftThemeName: result.draftThemeName,
        previewUrl: result.previewUrl,
        editorUrl: result.editorUrl,
        sectionCount: result.sectionKeys.length,
      });
    }
    if (intent === "publish-draft") {
      const draftThemeId = String(form.get("draftThemeId") || "");
      if (!draftThemeId) return json({ intent, ok: false, error: "No draft theme ID provided to publish." });
      const result = await publishTheme(shop, draftThemeId);
      if (!result.ok) return json({ intent, ok: false, error: result.error });
      return json({ intent, ok: true, publishedThemeId: draftThemeId });
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
  pageId,
  alt,
  shopDomain,
  onOpen,
}: {
  pageId: string;
  poster?: string;
  alt: string;
  niche?: string;
  shopDomain?: string;
  onOpen: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [scale, setScale] = useState(0.24);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "350px" }
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        if (w > 0) setScale(w / 1280);
      }
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const previewUrl = `/preview?id=${encodeURIComponent(pageId)}&shop=${encodeURIComponent(shopDomain || "")}&embed=1`;
  const containerHeight = 240;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpen}
      style={{
        position: "relative",
        width: "100%",
        height: containerHeight,
        overflow: "hidden",
        background: "#f8fafc",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {inView ? (
        <div
          style={{
            width: 1280,
            height: Math.round(containerHeight / scale),
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        >
          <iframe
            title={alt}
            src={previewUrl}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              background: "#ffffff",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
          }}
        >
          <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Loading template preview…</span>
        </div>
      )}

      {/* Hover Quick Action Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15, 23, 42, 0.68)",
          backdropFilter: "blur(3px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s ease",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "#0284c7",
            color: "#ffffff",
            padding: "6px 16px",
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 8px 20px rgba(2, 132, 199, 0.4)",
          }}
        >
          👁️ Live Preview Studio
        </div>
        <span style={{ fontSize: 11, color: "#cbd5e1", fontWeight: 500 }}>
          Click to inspect & 1-click submit to theme
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(4px)",
          padding: "5px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 5,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#ffffff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "80%",
          }}
        >
          {alt}
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, color: "#38bdf8", textTransform: "uppercase" }}>
          LIVE PREVIEW
        </span>
      </div>
    </div>
  );
}

export default function PageKit(){
  const { pages, pageTypes, shopDomain, connected, themeId, themeError, previewsBlocked } = useLoaderData<typeof loader>();
  const [params,setParams]=useSearchParams();
  const activeType=(params.get("type")||"index") as PageType;
  const tabIndex=Math.max(0, pageTypes.findIndex(t=>t.id===activeType));
  const [search,setSearch]=useState("");
  const [nicheFilter,setNicheFilter]=useState<string>("all");
  const [sortBy,setSortBy]=useState<"newest"|"name"|"sections">("newest");

  // ── Store DNA Wizard State ───────────────────────────────────────────────
  const [isDnaModalOpen, setIsDnaModalOpen] = useState(false);
  const [dnaNiche, setDnaNiche] = useState("Streetwear");
  const [dnaVibe, setDnaVibe] = useState("High-Impact Bold");
  const [dnaGoal, setDnaGoal] = useState("Fast Drop & Impulse Buy");
  const [dnaApplied, setDnaApplied] = useState(false);

  // ── Preview Viewport State ───────────────────────────────────────────────
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

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
  const [draftApplied,setDraftApplied]=useState<any|null>(null);
  const [published,setPublished]=useState<any|null>(null);

  const stager=useFetcher<any>();
  const applier=useFetcher<any>();
  const undoer=useFetcher<any>();
  const publisher=useFetcher<any>();

  const openPreview = useCallback((id: string) => {
    setPreviewModal(id);
    setPreviews(p => ({
      ...p,
      [id]: {
        status: "ready",
        src: `/preview?id=${encodeURIComponent(id)}&shop=${encodeURIComponent(shopDomain)}`,
        href: `/preview?id=${encodeURIComponent(id)}&shop=${encodeURIComponent(shopDomain)}`,
      },
    }));
  }, [shopDomain]);

  useEffect(()=>{
    if(applier.state==="idle" && applier.data?.intent==="apply"){ setApplied(applier.data); setConfirming(null); }
    if(applier.state==="idle" && applier.data?.intent==="apply-draft"){ setDraftApplied(applier.data); setConfirming(null); }
  },[applier.state, applier.data]);

  useEffect(()=>{
    if(publisher.state==="idle" && publisher.data?.intent==="publish-draft"){
      setPublished(publisher.data);
      if(publisher.data.ok){
        setDraftApplied(null);
      }
    }
  },[publisher.state, publisher.data]);

  const applyingId = applier.state!=="idle" ? String(applier.formData?.get("pageId")||"") : "";

  const runStoreDna = () => {
    setIsDnaModalOpen(false);
    setDnaApplied(true);
    // Map DNA selection to niche
    const matchedNiche = allNiches.find(n => n.toLowerCase().includes(dnaNiche.toLowerCase())) || "all";
    setNicheFilter(matchedNiche);
    setSearch("");
  };

  if(!connected){
    return (
      <Page title="Full Page Kits">
        <Banner
          tone="critical"
          title="This store is not connected yet"
          action={{
            content: "Connect Store & Authorize",
            url: `/auth?shop=${shopDomain}`,
            target: "_top",
          }}
        >
          <p>
            The app needs authorization for <b>{shopDomain}</b> to preview page kits with your products and apply designs to your theme.
          </p>
          <p style={{ marginTop: 8 }}>
            Click <b>Connect Store & Authorize</b> above to grant access, or reopen the app from your Shopify admin.
          </p>
        </Banner>
      </Page>
    );
  }

  return (
    <Page
      fullWidth
      title="Full Page Kits"
      subtitle="Preview any page design live on your store catalog, then submit directly to your theme with 1 click."
      primaryAction={{
        content: "⚡ Run Store DNA Generator",
        onAction: () => setIsDnaModalOpen(true),
      }}
    >
      <BlockStack gap="400">
        
        {/* ── Store DNA Active Banner ─────────────────────────────────── */}
        {dnaApplied && (
          <Banner
            tone="success"
            title={`Store DNA Matched: ${dnaNiche} (${dnaVibe})`}
            onDismiss={() => { setDnaApplied(false); setNicheFilter("all"); }}
          >
            <p>
              Displaying distinct architectural blueprints matching your <strong>{dnaNiche}</strong> catalog and <strong>{dnaGoal}</strong> conversion objective.
            </p>
          </Banner>
        )}

        {previewsBlocked && (
          <Banner
            tone="warning"
            title="Storefront password required"
            action={{ content: "Save Password in Settings", url: "/app/settings" }}
          >
            <p>
              Your store is password protected. Save your storefront password in Settings so preview cards can render your actual products.
            </p>
          </Banner>
        )}

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

        {draftApplied && (
          <Banner
            tone={draftApplied.ok ? "success" : "critical"}
            title={draftApplied.ok ? `🛡️ Page Installed to Draft Theme: ${draftApplied.draftThemeName}` : "Draft install failed"}
            onDismiss={() => setDraftApplied(null)}
          >
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd">
                {draftApplied.ok
                  ? `Your new page design is safely installed on your private draft theme with ${draftApplied.sectionCount} native sections. Your live store was untouched. You can preview it, customize settings in the theme editor, and publish when ready!`
                  : draftApplied.error}
              </Text>
              {draftApplied.ok && (
                <InlineStack gap="200">
                  <Button url={draftApplied.previewUrl} target="_blank" variant="primary" icon={ViewIcon}>
                    Preview Draft Storefront
                  </Button>
                  <Button url={draftApplied.editorUrl} target="_blank">
                    Customize in Shopify Editor
                  </Button>
                  <Button
                    loading={publisher.state !== "idle"}
                    variant="primary"
                    tone="success"
                    onClick={() =>
                      publisher.submit(
                        { intent: "publish-draft", draftThemeId: draftApplied.draftThemeId },
                        { method: "post" }
                      )
                    }
                  >
                    🚀 Publish Draft to Live Store
                  </Button>
                </InlineStack>
              )}
            </BlockStack>
          </Banner>
        )}

        {published && (
          <Banner
            tone={published.ok ? "success" : "critical"}
            title={published.ok ? "🎉 Your Store is Live!" : "Publish failed"}
            onDismiss={() => setPublished(null)}
          >
            <Text as="p" variant="bodyMd">
              {published.ok
                ? "The draft theme is now your live, published Shopify store theme! All your customers are now seeing the new high-converting design."
                : published.error}
            </Text>
          </Banner>
        )}

        <Card padding="0">
          <Tabs selected={tabIndex} onSelect={i=>setParams({type: pageTypes[i].id},{preventScrollReset:true})} tabs={pageTypes.map(t=>({id:t.id, content: t.label + " (" + pages.filter(p=>p.pageType===t.id).length + ")"}))}>
            <Box padding="400">
              {visible.length===0 ? (
                <Box padding="800"><BlockStack gap="200" align="center"><Text as="p" variant="headingMd" alignment="center">No designs match</Text><Button onClick={()=>{setSearch(""); setNicheFilter("all"); setDnaApplied(false);}}>Clear filters</Button></BlockStack></Box>
              ) : (
                <>
                <style>{`
                  .hp-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 20px;
                  }
                  @media (max-width: 1200px) {
                    .hp-grid {
                      grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                  }
                  @media (max-width: 768px) {
                    .hp-grid {
                      grid-template-columns: 1fr;
                    }
                  }
                  .hp-card {
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    overflow: hidden;
                    background: #ffffff;
                    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
                    transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s ease;
                    display: flex;
                    flex-direction: column;
                  }
                  .hp-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.12);
                    border-color: #0284c7;
                  }
                `}</style>
                <div className="hp-grid">
                  {visible.map(page=>{
                    const isApplying=applyingId===page.id;
                    const domainText = page.name.toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,18) + ".com";
                    return (
                      <div key={page.id} className="hp-card">
                        <div style={{height:34, background:'#0f172a', borderBottom:'1px solid #1e293b', display:'flex', alignItems:'center', gap:8, padding:'0 12px', cursor:'pointer'}} onClick={() => openPreview(page.id)}>
                          <span style={{width:7,height:7,borderRadius:99,background:'#ef4444', display:'inline-block'}}/>
                          <span style={{width:7,height:7,borderRadius:99,background:'#f59e0b', display:'inline-block'}}/>
                          <span style={{width:7,height:7,borderRadius:99,background:'#10b981', display:'inline-block'}}/>
                          <div style={{flex:1, display:'flex', justifyContent:'center'}}>
                            <div style={{background:'rgba(255,255,255,0.08)', borderRadius:999, padding:'2px 10px', fontSize:10, color:'#94a3b8', fontWeight:600, minWidth:110, textAlign:'center', maxWidth:160, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{domainText}</div>
                          </div>
                          <span style={{fontSize:9, fontWeight:700, color:'#38bdf8', fontFamily:'monospace'}}>{page.id.startsWith('hp-v') ? page.id : 'hp-v1'}</span>
                        </div>

                        <LivePreview
                          pageId={page.id}
                          poster={getThumbnailUrl(page.id)}
                          alt={page.name}
                          niche={page.niche}
                          shopDomain={shopDomain}
                          onOpen={() => openPreview(page.id)}
                        />

                        <Box padding="300">
                          <BlockStack gap="200">
                            <InlineStack align="space-between" blockAlign="center">
                              <span style={{color:'#0284c7', fontWeight:700, fontSize:11, letterSpacing:'.06em', textTransform:'uppercase'}}>{page.niche}</span>
                              <Badge tone="success">Verified</Badge>
                            </InlineStack>

                            <h3
                              onClick={() => openPreview(page.id)}
                              style={{fontWeight:800, fontSize:15, lineHeight:1.2, margin:0, color:'#111827', cursor:'pointer'}}
                            >
                              {page.name}
                            </h3>
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
                                  <span style={{fontSize:10, color:'#0284c7', fontWeight:600, alignSelf:'center'}}>+{page.sections.length - 4} more</span>
                                )}
                              </div>
                            </div>

                            {/* PageFly Flow: Preview First as Primary Action */}
                            <InlineStack gap="200" blockAlign="center" style={{marginTop:4}}>
                              <Button
                                variant="primary"
                                size="medium"
                                icon={ViewIcon}
                                onClick={() => openPreview(page.id)}
                              >
                                Preview Page
                              </Button>
                              <Button
                                size="medium"
                                loading={isApplying}
                                disabled={applier.state!=="idle" && !isApplying}
                                onClick={()=>setConfirming(page.id)}
                              >
                                Quick Submit
                              </Button>
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

      {/* ── Store DNA Modal ────────────────────────────────────────────── */}
      <Modal
        open={isDnaModalOpen}
        onClose={() => setIsDnaModalOpen(false)}
        title="Store DNA — AI Architectural Blueprint Matching"
        primaryAction={{
          content: "⚡ Synthesize 3 Blueprints",
          onAction: runStoreDna,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setIsDnaModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Text as="p" tone="subdued">
              Answer 3 fast questions. Our selection engine will configure your design token set and pick 3 genuinely distinct, CRO-tested store visions on your live products.
            </Text>

            <Select
              label="Primary Industry / Niche"
              options={[
                { label: "Streetwear & Fashion", value: "Streetwear" },
                { label: "Beauty & Skincare", value: "Beauty" },
                { label: "Luxury Jewellery & Gems", value: "Jewellery" },
                { label: "Electronics & Modern Gadgets", value: "Electronics" },
                { label: "Activewear & Performance", value: "Activewear" },
                { label: "Gourmet Food & Beverages", value: "Food" },
                { label: "General D2C Brand", value: "General" },
              ]}
              value={dnaNiche}
              onChange={setDnaNiche}
            />

            <Select
              label="Brand Aesthetic & Vibe"
              options={[
                { label: "High-Impact Bold (Heavy Typography, Contrast)", value: "High-Impact Bold" },
                { label: "Minimalist Luxury (Generous Spacing, Clean Serif)", value: "Minimalist Luxury" },
                { label: "Clinical & Organic (Warm Earthy, Ingredient Story)", value: "Clinical Clean" },
                { label: "Urban Drop (Countdown Urgency, Drop Banners)", value: "Urban Drop" },
              ]}
              value={dnaVibe}
              onChange={setDnaVibe}
            />

            <Select
              label="Primary Conversion Goal"
              options={[
                { label: "Fast Drop & Impulse Buy (Sticky ATC, Drop Grids)", value: "Fast Drop & Impulse Buy" },
                { label: "High-AOV Luxury (Storytelling, Curated Bento)", value: "High-AOV Luxury" },
                { label: "Single Hero Flagship (Deep PDP Funnel, Video UGC)", value: "Single Hero Flagship" },
              ]}
              value={dnaGoal}
              onChange={setDnaGoal}
            />
          </BlockStack>
        </Modal.Section>
      </Modal>

      {/* ── Quick Confirmation Modal (Option A: Safe Draft Theme vs Live Store) ── */}
      <Modal
        open={Boolean(confirming)}
        onClose={() => setConfirming(null)}
        title={confirming ? `Submit "${pages.find(p => p.id === confirming)?.name}" to Theme` : ""}
        primaryAction={{
          content: "🛡️ Submit to Draft Theme (Safe - Recommended)",
          loading: applier.state !== "idle" && applier.formData?.get("intent") === "apply-draft",
          onAction: () => {
            if (confirming) {
              applier.submit({ intent: "apply-draft", pageId: confirming }, { method: "post" });
            }
          },
        }}
        secondaryActions={[
          {
            content: "⚡ Submit to Live Theme",
            loading: applier.state !== "idle" && applier.formData?.get("intent") === "apply",
            onAction: () => {
              if (confirming) {
                applier.submit({ intent: "apply", pageId: confirming }, { method: "post" });
              }
            },
          },
          {
            content: "Cancel",
            onAction: () => setConfirming(null),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="300">
            <Banner tone="info" title="PageFly-Style Theme Submission">
              <p>
                <strong>Draft Theme (Recommended):</strong> Installs onto an unpublished duplicate theme. Your live shoppers see no changes until you test it and click <em>Publish</em>.
              </p>
            </Banner>
            <Text as="p" variant="bodyMd">
              Choose how you want to deploy this {pageTypes.find(t => t.id === activeType)?.label.toLowerCase()} design:
            </Text>
            <ul style={{ paddingLeft: "20px", fontSize: "13px", color: "#374151", margin: 0, lineHeight: 1.6 }}>
              <li>
                <strong>🛡️ Draft Theme (Safe):</strong> Installs to a duplicate preview theme. Verify your products, test responsive layouts, and publish whenever you are ready.
              </li>
              <li>
                <strong>⚡ Live Store:</strong> Writes directly to your published theme right now (includes 1-Click Rollback / Undo).
              </li>
            </ul>
          </BlockStack>
        </Modal.Section>
      </Modal>

      {/* ── PageFly-Style Interactive Preview Studio Modal ── */}
      <Modal
        open={Boolean(previewModal)}
        onClose={() => setPreviewModal(null)}
        title={previewModal ? `Live Preview: ${pages.find(p => p.id === previewModal)?.name || ""}` : ""}
        size="large"
      >
        <Modal.Section flush>
          {previewModal && previews[previewModal]?.status === "ready" ? (
            <BlockStack gap="0">
              {/* Top Studio Control Bar */}
              <Box padding="300" background="bg-surface-secondary" borderBlockEndWidth="025" borderColor="border">
                <InlineStack align="space-between" blockAlign="center" wrap>
                  {/* Viewport Switcher */}
                  <InlineStack gap="150" blockAlign="center">
                    <Text as="span" variant="bodySm" fontWeight="semibold" tone="subdued">
                      Viewport:
                    </Text>
                    <Button
                      size="slim"
                      pressed={previewDevice === "desktop"}
                      onClick={() => setPreviewDevice("desktop")}
                    >
                      🖥️ Desktop
                    </Button>
                    <Button
                      size="slim"
                      pressed={previewDevice === "tablet"}
                      onClick={() => setPreviewDevice("tablet")}
                    >
                      💻 Tablet
                    </Button>
                    <Button
                      size="slim"
                      pressed={previewDevice === "mobile"}
                      onClick={() => setPreviewDevice("mobile")}
                    >
                      📱 Mobile
                    </Button>
                  </InlineStack>

                  {/* Submission CTAs right in top toolbar */}
                  <InlineStack gap="200" blockAlign="center">
                    <Button
                      size="slim"
                      url={previews[previewModal]?.href}
                      target="_blank"
                      onClick={() => {
                        if (typeof window !== "undefined" && previewModal) {
                          const url = `/preview?id=${encodeURIComponent(previewModal)}&shop=${encodeURIComponent(shopDomain)}`;
                          window.open(url, "_blank", "noopener,noreferrer");
                        }
                      }}
                    >
                      Open Full Screen ↗
                    </Button>

                    <Button
                      size="slim"
                      variant="primary"
                      loading={applier.state !== "idle" && applier.formData?.get("intent") === "apply-draft"}
                      disabled={applier.state !== "idle"}
                      onClick={() => {
                        applier.submit({ intent: "apply-draft", pageId: previewModal }, { method: "post" });
                      }}
                    >
                      🛡️ Submit to Draft Theme
                    </Button>

                    <Button
                      size="slim"
                      loading={applier.state !== "idle" && applier.formData?.get("intent") === "apply"}
                      disabled={applier.state !== "idle"}
                      onClick={() => {
                        applier.submit({ intent: "apply", pageId: previewModal }, { method: "post" });
                      }}
                    >
                      ⚡ Submit to Live Store
                    </Button>
                  </InlineStack>
                </InlineStack>
              </Box>

              {/* Status Feedback Banners inside Preview Studio */}
              {draftApplied && draftApplied.pageId === previewModal && (
                <Box padding="300" background="bg-surface-success">
                  <InlineStack align="space-between" blockAlign="center" wrap>
                    <Text as="p" variant="bodyMd" fontWeight="semibold">
                      🎉 Successfully installed to Draft Theme ({draftApplied.draftThemeName})!
                    </Text>
                    <InlineStack gap="200">
                      <Button url={draftApplied.previewUrl} target="_blank" size="slim">
                        Preview Draft Store
                      </Button>
                      <Button url={draftApplied.editorUrl} target="_blank" size="slim">
                        Customize in Shopify Editor
                      </Button>
                      <Button
                        size="slim"
                        variant="primary"
                        loading={publisher.state !== "idle"}
                        onClick={() =>
                          publisher.submit(
                            { intent: "publish-draft", draftThemeId: draftApplied.draftThemeId },
                            { method: "post" }
                          )
                        }
                      >
                        🚀 Publish to Live Store Now
                      </Button>
                    </InlineStack>
                  </InlineStack>
                </Box>
              )}

              {applied && applied.pageId === previewModal && (
                <Box padding="300" background="bg-surface-success">
                  <InlineStack align="space-between" blockAlign="center" wrap>
                    <Text as="p" variant="bodyMd" fontWeight="semibold">
                      🚀 Page is now LIVE on your active store!
                    </Text>
                    <InlineStack gap="200">
                      <Button url={applied.storefrontUrl} target="_blank" size="slim" variant="primary">
                        View Live Store
                      </Button>
                      <Button
                        size="slim"
                        loading={undoer.state !== "idle"}
                        onClick={() => undoer.submit({ intent: "undo", pageId: applied.pageId }, { method: "post" })}
                      >
                        Undo
                      </Button>
                    </InlineStack>
                  </InlineStack>
                </Box>
              )}

              {applier.data?.error && (
                <Box padding="300" background="bg-surface-critical">
                  <Text as="p" tone="critical" variant="bodyMd">
                    {applier.data.error}
                  </Text>
                </Box>
              )}

              {/* Responsive Frame */}
              <div style={{
                background: "#0F172A",
                padding: previewDevice === "mobile" ? "24px 0" : previewDevice === "tablet" ? "16px 0" : "0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "68vh",
                overflow: "hidden"
              }}>
                <iframe
                  title="PageFly-Style Preview"
                  src={previews[previewModal]?.src}
                  style={{
                    width: previewDevice === "mobile" ? "390px" : previewDevice === "tablet" ? "768px" : "100%",
                    height: "70vh",
                    border: previewDevice === "mobile" ? "8px solid #1E293B" : previewDevice === "tablet" ? "4px solid #334155" : "0",
                    borderRadius: previewDevice === "mobile" ? "28px" : previewDevice === "tablet" ? "12px" : "0",
                    boxShadow: previewDevice !== "desktop" ? "0 25px 50px -12px rgba(0, 0, 0, 0.6)" : "none",
                    display: "block",
                    background: "#fff",
                    transition: "width 0.25s ease, border-radius 0.25s ease"
                  }}
                />
              </div>

              {/* Bottom Info Bar */}
              <Box padding="300" borderBlockStartWidth="025" borderColor="border">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="p" tone="subdued" variant="bodySm">
                    ⚡ Live store catalog preview. Shoppers see no changes until you click <strong>Submit to Theme</strong>.
                  </Text>
                  <Button onClick={() => setPreviewModal(null)}>
                    Close Preview
                  </Button>
                </InlineStack>
              </Box>
            </BlockStack>
          ) : (
            <Box padding="600">
              <InlineStack gap="300" align="center" blockAlign="center">
                {previews[previewModal||""]?.status==="failed"
                  ? <Text as="p" tone="critical">{previews[previewModal||""]?.error || "This preview could not be loaded."}</Text>
                  : <><Spinner size="small" /><Text as="p" tone="subdued">Building live preview with your store's real catalog…</Text></>}
              </InlineStack>
            </Box>
          )}
        </Modal.Section>
      </Modal>
    </Page>
  );
}
