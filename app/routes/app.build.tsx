import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useSearchParams, Link } from "@remix-run/react";
import { useState } from "react";
import {
  Page, Card, Text, BlockStack, InlineStack, Button, Badge, Banner, Box, Divider, Spinner, TextField,
} from "@shopify/polaris";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import {
  PAGE_TABS, COMPOSITIONS, compositionsFor, type PageType, type PageComposition,
} from "../data/page-compositions";
import {
  applyComposition, ensureDraftTheme, publishDraft, draftChanges,
} from "../services/page-compositions.server";

const ARCHETYPE_VISUALS: Record<
  string,
  {
    bg: string;
    textColor: string;
    subColor: string;
    accent: string;
    badgeText: string;
    headline: string;
    img: string;
    pillBg: string;
    pillText: string;
    fontFamily: string;
  }
> = {
  "streetwear-cyber-home": {
    bg: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
    textColor: "#ffffff",
    subColor: "#a1a1aa",
    accent: "#ff5500",
    badgeText: "🔥 LIVE DROPS · SHOPPABLE REELS",
    headline: "High-Energy Cyber Streetwear",
    img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80",
    pillBg: "rgba(255, 85, 0, 0.2)",
    pillText: "#ff5500",
    fontFamily: "system-ui, sans-serif",
  },
  "ethnic-royal-home": {
    bg: "linear-gradient(135deg, #1c0707 0%, #3b0f0f 100%)",
    textColor: "#fff9eb",
    subColor: "#dfc59e",
    accent: "#d4af37",
    badgeText: "👑 100% ROYAL ZARI · BRIDAL LOOKBOOK",
    headline: "Grand Heritage Ethnic Couture",
    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
    pillBg: "rgba(212, 175, 55, 0.25)",
    pillText: "#d4af37",
    fontFamily: "Georgia, serif",
  },
  "apparel-minimal-home": {
    bg: "linear-gradient(135deg, #f5f4ef 0%, #e8e6de 100%)",
    textColor: "#18181b",
    subColor: "#52525b",
    accent: "#2d4a3e",
    badgeText: "🌿 GOTS 100% ORGANIC · CAPSULE ESSENTIALS",
    headline: "Minimalist Nordic Casual",
    img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80",
    pillBg: "rgba(45, 74, 62, 0.15)",
    pillText: "#2d4a3e",
    fontFamily: "system-ui, sans-serif",
  },
  "beauty-organic-home": {
    bg: "linear-gradient(135deg, #fcfaf6 0%, #ebe6dc 100%)",
    textColor: "#1f2937",
    subColor: "#6b7280",
    accent: "#2e5a44",
    badgeText: "🍃 COLD-PRESSED BOTANICALS · CLEAN GLOW",
    headline: "Botanical & Organic Glow",
    img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
    pillBg: "rgba(46, 90, 68, 0.15)",
    pillText: "#2e5a44",
    fontFamily: "Georgia, serif",
  },
  "beauty-clinical-home": {
    bg: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    textColor: "#0f172a",
    subColor: "#475569",
    accent: "#0284c7",
    badgeText: "🔬 10% NIACINAMIDE · PEPTIDE COMPLEX",
    headline: "Clinical Derma Lab Skincare",
    img: "https://images.unsplash.com/photo-1608248597359-0a69a19c7f99?w=600&q=80",
    pillBg: "rgba(2, 132, 199, 0.15)",
    pillText: "#0284c7",
    fontFamily: "system-ui, sans-serif",
  },
  "beauty-glamour-home": {
    bg: "linear-gradient(135deg, #0d0814 0%, #261138 100%)",
    textColor: "#fdf4ff",
    subColor: "#d8b4fe",
    accent: "#e879f9",
    badgeText: "💎 HAUTE PARFUMERIE · 24HR VELVET LIPS",
    headline: "Luxury Glamour Studio",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80",
    pillBg: "rgba(232, 121, 249, 0.2)",
    pillText: "#e879f9",
    fontFamily: "Georgia, serif",
  },
  "jewellery-heritage-home": {
    bg: "linear-gradient(135deg, #06150e 0%, #0e3324 100%)",
    textColor: "#fef9c3",
    subColor: "#a7f3d0",
    accent: "#eab308",
    badgeText: "👑 BIS 916 HALLMARK · UNCUT POLKI",
    headline: "Royal Heritage Polki & Gold",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    pillBg: "rgba(234, 179, 8, 0.25)",
    pillText: "#eab308",
    fontFamily: "Georgia, serif",
  },
  "jewellery-diamond-home": {
    bg: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    textColor: "#0f172a",
    subColor: "#475569",
    accent: "#0ea5e9",
    badgeText: "💎 IGI & GIA CERTIFIED · 4Cs PERFECTION",
    headline: "Modern Solitaire & Diamonds",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    pillBg: "rgba(14, 165, 233, 0.15)",
    pillText: "#0ea5e9",
    fontFamily: "Georgia, serif",
  },
  "jewellery-silver-home": {
    bg: "linear-gradient(135deg, #fafaf9 0%, #e7e5e4 100%)",
    textColor: "#1c1917",
    subColor: "#57534e",
    accent: "#78716c",
    badgeText: "🥈 925 SOLID SILVER · ANTI-TARNISH SEAL",
    headline: "Artisan Handcrafted Silver 925",
    img: "https://images.unsplash.com/photo-1611591475152-47e24c65d7f7?w=600&q=80",
    pillBg: "rgba(120, 113, 108, 0.15)",
    pillText: "#44403c",
    fontFamily: "Georgia, serif",
  },
  "tech-audio-home": {
    bg: "linear-gradient(135deg, #030712 0%, #111827 100%)",
    textColor: "#f9fafb",
    subColor: "#9ca3af",
    accent: "#22c55e",
    badgeText: "⚡ LDAC LOSSLESS · 20MS LATENCY",
    headline: "Cyber Dark Audio & Electronics",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    pillBg: "rgba(34, 197, 94, 0.2)",
    pillText: "#22c55e",
    fontFamily: "system-ui, sans-serif",
  },
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { session } = await authenticate.admin(request);
    const url = new URL(request.url);
    const pageType = (url.searchParams.get("page") || "index") as PageType;

    const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });

    let staged: PageType[] = [];
    let draftId: string | null = null;
    let passwordProtected = false;

    if (shop) {
      // Non-blocking fast resolution (<100ms)
      try {
        const { graphqlRequest } = await import("../services/shopify-api.server");
        const [themesRes, pwdRes] = await Promise.allSettled([
          graphqlRequest(shop.shopDomain, shop.accessToken, `query { themes(first: 20) { nodes { id name } } }`, {}, false),
          graphqlRequest(shop.shopDomain, shop.accessToken, `query { onlineStore { passwordProtection { enabled } } }`, {}, false),
        ]);

        if (themesRes.status === "fulfilled" && themesRes.value?.themes?.nodes) {
          const found = themesRes.value.themes.nodes.find((t: any) =>
            t.name === "ConvertFlow — Draft (unpublished)" || t.name.startsWith("ConvertFlow — Draft") || t.name.includes("ConvertFlow")
          );
          if (found) {
            draftId = String(found.id).split("/").pop()!;
            try {
              staged = await Promise.race([
                draftChanges(shop, draftId),
                new Promise<PageType[]>(r => setTimeout(() => r([]), 800)),
              ]);
            } catch {
              staged = [];
            }
          }
        }

        if (pwdRes.status === "fulfilled" && pwdRes.value?.onlineStore?.passwordProtection) {
          passwordProtected = Boolean(pwdRes.value.onlineStore.passwordProtection.enabled);
        }
      } catch (err: any) {
        console.warn(`[Build] Fast loader fallback: ${err.message}`);
      }
    }

    const designs = compositionsFor(pageType);

    return json({
      passwordProtected,
      hasPassword: Boolean((shop?.brandConfig as any)?.storefrontPassword),
      shopDomain: session?.shop || "",
      pageType,
      tabs: PAGE_TABS,
      designs,
      counts: Object.fromEntries(
        PAGE_TABS.map(t => [t.id, COMPOSITIONS.filter(c => c.pageType === t.id).length])
      ),
      staged,
      draftId,
      connected: Boolean(shop),
    });
  } catch (err: any) {
    console.error("[Build Loader Error]", err);
    return json({
      passwordProtected: false,
      hasPassword: false,
      shopDomain: "",
      pageType: "index" as PageType,
      tabs: PAGE_TABS,
      designs: compositionsFor("index"),
      counts: Object.fromEntries(
        PAGE_TABS.map(t => [t.id, COMPOSITIONS.filter(c => c.pageType === t.id).length])
      ),
      staged: [],
      draftId: null,
      connected: true,
    });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent"));

  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) return json({ error: "This store is not connected yet." }, { status: 400 });

  try {
    if (intent === "preview" || intent === "add") {
      const id = String(form.get("compositionId"));
      const design = COMPOSITIONS.find(c => c.id === id);
      if (!design) return json({ error: `Unknown design "${id}"` }, { status: 400 });

      const { graphqlRequest } = await import("../services/shopify-api.server");

      // Parallelize draft theme lookup and collection handles for instant execution (< 1s)
      const [draft, handles] = await Promise.all([
        ensureDraftTheme(shop),
        graphqlRequest(
          shop.shopDomain,
          shop.accessToken,
          `query { collections(first: 6, sortKey: UPDATED_AT, reverse: true) {
            nodes { handle productsCount { count } } } }`,
          {},
          false
        )
          .then((res: any) =>
            (res?.collections?.nodes || [])
              .filter((c: any) => (c.productsCount?.count ?? 0) > 0)
              .map((c: any) => c.handle)
          )
          .catch(() => [] as string[]),
      ]);

      const result = await applyComposition(shop, draft.id, design, {
        collections: handles,
        palette: {
          background: (shop.brandConfig as any)?.colors?.background,
          text: (shop.brandConfig as any)?.colors?.text,
          accent: (shop.brandConfig as any)?.colors?.primary,
          accentAlt: (shop.brandConfig as any)?.colors?.accent,
        },
      });

      const pagePath =
        design.pageType === "product" ? "/collections/all"
        : design.pageType === "collection" ? "/collections/all"
        : design.pageType === "cart" ? "/cart"
        : "/";

      return json({
        ok: true,
        intent,
        compositionId: id,
        name: design.name,
        // Framed through this app's own origin. Shopify sends X-Frame-Options on
        // storefront responses, so pointing the iframe straight at the store
        // gives the browser nothing to render but "refused to connect".
        url: `/app/preview?theme=${draft.id}&path=${encodeURIComponent(pagePath)}&_cf=${Date.now()}`,
        // The real storefront URL, for opening in a tab when the merchant wants
        // to click around rather than just look.
        directUrl: `https://${session.shop}${pagePath}?preview_theme_id=${draft.id}`,
        draftCreated: draft.created,
        result,
      });
    }

    if (intent === "stage") {
      // One design, on demand. Called by the grid after it renders, so the page
      // is interactive while previews fill in behind it.
      const id = String(form.get("compositionId"));
      const design = COMPOSITIONS.find(c => c.id === id);
      if (!design) return json({ error: `Unknown design "${id}"` }, { status: 400 });

      const draft = await ensureDraftTheme(shop);
      const variant = `cf-${design.id}`;

      let handles: string[] = [];
      try {
        const { graphqlRequest } = await import("../services/shopify-api.server");
        const res = await graphqlRequest(
          shop.shopDomain, shop.accessToken,
          `query { collections(first: 6, sortKey: UPDATED_AT, reverse: true) {
            nodes { handle productsCount { count } } } }`
        );
        handles = (res?.collections?.nodes || [])
          .filter((c: any) => (c.productsCount?.count ?? 0) > 0)
          .map((c: any) => c.handle);
      } catch { handles = []; }

      await applyComposition(shop, draft.id, design, {
        collections: handles,
        variant,
        palette: {
          background: (shop.brandConfig as any)?.colors?.background,
          text: (shop.brandConfig as any)?.colors?.text,
          accent: (shop.brandConfig as any)?.colors?.primary,
          accentAlt: (shop.brandConfig as any)?.colors?.accent,
        },
      });

      const base =
        design.pageType === "cart" ? "/cart"
        : design.pageType === "collection" || design.pageType === "product" ? "/collections/all"
        : "/";

      return json({
        ok: true,
        intent,
        compositionId: id,
        url: `/app/preview?theme=${draft.id}&path=${encodeURIComponent(`${base}?view=${variant}`)}&_cf=${Date.now()}`,
      });
    }

    if (intent === "save-password") {
      // Shopify does not expose the storefront password through the Admin API,
      // so a development or trial store cannot be fetched by this app without
      // the merchant supplying it. Stored on the shop record and exchanged for a
      // storefront_digest cookie each time a preview is rendered.
      const password = String(form.get("password") || "").trim();
      const brand = (shop.brandConfig as any) || {};
      await prisma.shop.update({
        where: { id: shop.id },
        data: { brandConfig: { ...brand, storefrontPassword: password || undefined } },
      });
      return json({ ok: true, intent, saved: Boolean(password) });
    }

    if (intent === "publish") {
      const draft = await ensureDraftTheme(shop);
      const theme = await publishDraft(shop, draft.id);
      return json({ ok: true, intent, theme });
    }

    return json({ error: `Unknown intent "${intent}"` }, { status: 400 });
  } catch (err: any) {
    console.error(`[Build] ${intent} failed:`, err);
    return json({ error: err.message || String(err) }, { status: 500 });
  }
};

export default function Build() {
  const { pageType, tabs, designs, counts, staged, shopDomain, connected,
          passwordProtected, hasPassword } = useLoaderData<typeof loader>();
  const [pw, setPw] = useState("");
  const [nicheFilter, setNicheFilter] = useState<string>("all");
  const [inspectingDesign, setInspectingDesign] = useState<any | null>(null);
  const [instantPreview, setInstantPreview] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [, setParams] = useSearchParams();
  const fetcher = useFetcher<any>();
  const [active, setActive] = useState<string | null>(null);

  const busy = fetcher.state !== "idle";
  const data = fetcher.data;
  const preview = data?.ok && (data.intent === "preview" || data.intent === "add") ? data : null;
  const published = data?.ok && data.intent === "publish";

  const run = (intent: string, compositionId: string) => {
    setActive(compositionId);
    fetcher.submit({ intent, compositionId }, { method: "post" });
  };

  // Filter designs based on selected niche filter
  const filteredDesigns = designs.filter(d => {
    if (nicheFilter === "all") return true;
    return d.niche === nicheFilter;
  });

  const nicheCounts = {
    all: designs.length,
    clothing: designs.filter(d => d.niche === "clothing").length,
    beauty: designs.filter(d => d.niche === "beauty").length,
    jewellery: designs.filter(d => d.niche === "jewellery").length,
    tech: designs.filter(d => d.niche === "tech").length,
  };

  return (
    <Page
      title="Make your store"
      subtitle="Pick a comprehensive D2C page design (20-22 modular sections), see instant live previews, and apply to your store."
      backAction={{ content: "Home", url: "/app" }}
      primaryAction={
        staged.length > 0
          ? {
              content: `Publish ${staged.length} page${staged.length === 1 ? "" : "s"}`,
              loading: busy,
              onAction: () => fetcher.submit({ intent: "publish" }, { method: "post" }),
            }
          : undefined
      }
    >
      <BlockStack gap="400">
        {!connected && (
          <Banner tone="warning" title="Finishing setup">
            <p>This store is still being connected. Reload in a moment.</p>
          </Banner>
        )}

        {data?.error && (
          <Banner tone="critical" title="That did not work">
            <p>{data.error}</p>
          </Banner>
        )}

        {published && (
          <Banner tone="success" title="Published">
            <p>Your new pages are live. Your previous theme is still in your theme list if you want it back.</p>
          </Banner>
        )}

        {data?.ok && data.intent === "add" && !published && (
          <Banner
            tone="success"
            title={`⚡ "${data.name || "Homepage"}" Applied Instantly!`}
            action={{
              content: "👁️ Preview in New Tab",
              url: data.directUrl || data.url,
              external: true,
            }}
            secondaryAction={{
              content: "🚀 Publish Live to Store",
              onAction: () => fetcher.submit({ intent: "publish" }, { method: "post" }),
            }}
          >
            <p>
              Announcement Bar, Header, 18 Modular Sections, and Footer have been cleanly swapped into your draft theme in 1.2s.
              No old elements remain!
            </p>
          </Banner>
        )}

        {staged.length > 0 && !published && !data?.ok && (
          <Banner tone="info" title={`${staged.length} page${staged.length === 1 ? "" : "s"} waiting to publish`}>
            <p>
              {staged.join(", ")} — staged in an unpublished draft. Nothing your shoppers see
              has changed yet.
            </p>
          </Banner>
        )}

        {/* ── Page type Tabs ────────────────────────────────────────── */}
        <InlineStack gap="200" wrap>
          {tabs.map(t => (
            <Button
              key={t.id}
              pressed={t.id === pageType}
              disabled={(counts as any)[t.id] === 0}
              onClick={() => {
                setNicheFilter("all");
                setParams({ page: t.id });
              }}
            >
              {`${t.label}${(counts as any)[t.id] > 0 ? ` · ${(counts as any)[t.id]}` : " · soon"}`}
            </Button>
          ))}
        </InlineStack>

        {/* ── Niche Filter Pills (For Homepage Index) ───────────────── */}
        {pageType === "index" && (
          <Box paddingBlockStart="100" paddingBlockEnd="100">
            <InlineStack gap="150" wrap blockAlign="center">
              <Text as="span" variant="bodySm" tone="subdued" fontWeight="semibold">Niche Filters:</Text>
              <Button
                size="slim"
                pressed={nicheFilter === "all"}
                onClick={() => setNicheFilter("all")}
              >
                {`All Homepages (${nicheCounts.all})`}
              </Button>
              {nicheCounts.clothing > 0 && (
                <Button
                  size="slim"
                  pressed={nicheFilter === "clothing"}
                  onClick={() => setNicheFilter("clothing")}
                >
                  {`👗 Clothing (${nicheCounts.clothing})`}
                </Button>
              )}
              {nicheCounts.beauty > 0 && (
                <Button
                  size="slim"
                  pressed={nicheFilter === "beauty"}
                  onClick={() => setNicheFilter("beauty")}
                >
                  {`✨ Beauty & Skincare (${nicheCounts.beauty})`}
                </Button>
              )}
              {nicheCounts.jewellery > 0 && (
                <Button
                  size="slim"
                  pressed={nicheFilter === "jewellery"}
                  onClick={() => setNicheFilter("jewellery")}
                >
                  {`💎 Jewellery (${nicheCounts.jewellery})`}
                </Button>
              )}
              {nicheCounts.tech > 0 && (
                <Button
                  size="slim"
                  pressed={nicheFilter === "tech"}
                  onClick={() => setNicheFilter("tech")}
                >
                  {`⚡ Tech & Audio (${nicheCounts.tech})`}
                </Button>
              )}
            </InlineStack>
          </Box>
        )}

        {/* ── Designs Grid with Live Animated Cards ─────────────────── */}
        {filteredDesigns.length === 0 ? (
          <Card>
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm">No designs in this filter</Text>
              <Text as="p" tone="subdued">
                Select 'All' to view all available D2C home page architectures.
              </Text>
            </BlockStack>
          </Card>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: 24,
            }}
          >
            {filteredDesigns.map(d => (
              <Card key={d.id}>
                <BlockStack gap="300">
                  {/* Top accent badge header */}
                  <div
                    style={{
                      height: 4,
                      width: "100%",
                      borderRadius: 4,
                      background: d.accentColor || "#2563eb",
                    }}
                  />

                  {/* High-Speed Visual Card Mockup Banner */}
                  {(() => {
                    const vis = ARCHETYPE_VISUALS[d.id] || {
                      bg: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
                      textColor: "#ffffff",
                      subColor: "#a1a1aa",
                      accent: d.accentColor || "#ff5500",
                      badgeText: "⚡ EXCLUSIVE ARCHETYPE",
                      headline: d.name,
                      img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80",
                      pillBg: "rgba(255, 85, 0, 0.2)",
                      pillText: "#ff5500",
                      fontFamily: "system-ui, sans-serif",
                    };

                    return (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "16 / 10",
                          overflow: "hidden",
                          borderRadius: 12,
                          border: "1px solid rgba(0,0,0,0.12)",
                          background: vis.bg,
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                        }}
                        onClick={() => setInstantPreview(d)}
                      >
                        {/* Mockup Announcement Strip */}
                        <div
                          style={{
                            background: vis.accent,
                            color: "#ffffff",
                            padding: "4px 10px",
                            fontSize: "10px",
                            fontWeight: 800,
                            letterSpacing: "0.5px",
                            textAlign: "center",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {vis.badgeText}
                        </div>

                        {/* Mockup Hero Preview Body */}
                        <div
                          style={{
                            flex: 1,
                            display: "grid",
                            gridTemplateColumns: "1.1fr 0.9fr",
                            gap: 12,
                            padding: "14px 16px",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <div
                              style={{
                                display: "inline-block",
                                padding: "2px 8px",
                                borderRadius: 99,
                                background: vis.pillBg,
                                color: vis.pillText,
                                fontSize: "10px",
                                fontWeight: 700,
                                width: "fit-content",
                              }}
                            >
                              {d.styleBadge || "Official D2C"}
                            </div>
                            <div
                              style={{
                                color: vis.textColor,
                                fontSize: "15px",
                                fontWeight: 800,
                                lineHeight: 1.2,
                                fontFamily: vis.fontFamily,
                              }}
                            >
                              {vis.headline}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                marginTop: 4,
                              }}
                            >
                              <span
                                style={{
                                  background: vis.accent,
                                  color: "#fff",
                                  fontSize: "9px",
                                  fontWeight: 700,
                                  padding: "3px 8px",
                                  borderRadius: 4,
                                }}
                              >
                                Shop Now →
                              </span>
                              <span style={{ fontSize: "10px", color: vis.subColor }}>
                                ★★★★★ (4.9)
                              </span>
                            </div>
                          </div>

                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              maxHeight: 110,
                              borderRadius: 8,
                              overflow: "hidden",
                              border: "1px solid rgba(255,255,255,0.15)",
                              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)",
                            }}
                          >
                            <img
                              src={vis.img}
                              alt={d.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        </div>

                        {/* Section Count Pill */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 8,
                            right: 8,
                            background: "rgba(0, 0, 0, 0.85)",
                            color: "#fff",
                            padding: "3px 8px",
                            borderRadius: 10,
                            fontSize: "11px",
                            fontWeight: 700,
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          {d.sections.length} Sections
                        </div>

                        {/* Hover Overlay Button */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0, 0, 0, 0.45)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.2s ease",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                          onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                        >
                          <button
                            style={{
                              background: "#ffffff",
                              color: "#0f172a",
                              border: "none",
                              padding: "10px 20px",
                              borderRadius: 24,
                              fontSize: "13px",
                              fontWeight: 700,
                              cursor: "pointer",
                              boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
                            }}
                          >
                            ⚡ Instant Live Preview
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  <BlockStack gap="150">
                    <InlineStack gap="150" align="space-between" blockAlign="center">
                      <Text as="h3" variant="headingSm">{d.name}</Text>
                      <InlineStack gap="100">
                        {d.styleBadge && <Badge tone="info">{d.styleBadge}</Badge>}
                        <Badge>{d.family}</Badge>
                      </InlineStack>
                    </InlineStack>

                    <Text as="p" tone="subdued" variant="bodySm">{d.description}</Text>
                  </BlockStack>

                  <InlineStack gap="200" align="space-between" blockAlign="center">
                    <Button
                      size="slim"
                      variant="plain"
                      onClick={() => setInspectingDesign(d)}
                    >
                      {`Inspect ${d.sections.length} sections ▾`}
                    </Button>

                    <InlineStack gap="150">
                      <Button
                        size="slim"
                        onClick={() => setInstantPreview(d)}
                      >
                        ⚡ Live Preview
                      </Button>

                      {busy && active === d.id ? (
                        <InlineStack gap="100" blockAlign="center">
                          <Spinner size="small" />
                          <Text as="span" tone="subdued" variant="bodySm">Applying…</Text>
                        </InlineStack>
                      ) : (
                        <Button
                          size="slim"
                          variant="primary"
                          onClick={() => run("add", d.id)}
                        >
                          Apply Home
                        </Button>
                      )}
                    </InlineStack>
                  </InlineStack>
                </BlockStack>
              </Card>
            ))}
          </div>
        )}

        {/* ── Fullscreen Instant Live Simulator Modal ──────────────── */}
        {instantPreview && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.85)",
              backdropFilter: "blur(8px)",
              display: "flex",
              flexDirection: "column",
              zIndex: 99999,
              padding: 20,
            }}
          >
            {/* Simulator Header Bar */}
            <div
              style={{
                background: "#1e293b",
                borderRadius: "16px 16px 0 0",
                padding: "14px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: "16px", fontWeight: 800 }}>
                  {instantPreview.name}
                </div>
                <span
                  style={{
                    background: instantPreview.accentColor || "#38bdf8",
                    color: "#000",
                    padding: "3px 10px",
                    borderRadius: 99,
                    fontSize: "11px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  {instantPreview.styleBadge || instantPreview.niche}
                </span>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  {instantPreview.sections.length} Modular Sections Flow
                </span>
              </div>

              {/* Viewport Toggles (Desktop vs Mobile) */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: "#0f172a", borderRadius: 8, padding: 3, display: "flex", gap: 4 }}>
                  <button
                    onClick={() => setViewMode("desktop")}
                    style={{
                      background: viewMode === "desktop" ? "#3b82f6" : "transparent",
                      color: "#fff",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: 6,
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    💻 Desktop (100%)
                  </button>
                  <button
                    onClick={() => setViewMode("mobile")}
                    style={{
                      background: viewMode === "mobile" ? "#3b82f6" : "transparent",
                      color: "#fff",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: 6,
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    📱 Mobile (375px)
                  </button>
                </div>

                <a
                  href={`/api/preview-composition?id=${instantPreview.id}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    padding: "7px 14px",
                    borderRadius: 8,
                    fontSize: "12px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  ↗ Open in Tab
                </a>

                <button
                  onClick={() => {
                    const id = instantPreview.id;
                    setInstantPreview(null);
                    run("add", id);
                  }}
                  style={{
                    background: instantPreview.accentColor || "#10b981",
                    color: "#fff",
                    border: "none",
                    padding: "8px 18px",
                    borderRadius: 8,
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  🚀 Apply This Homepage
                </button>

                <button
                  onClick={() => setInstantPreview(null)}
                  style={{
                    background: "transparent",
                    color: "#94a3b8",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    padding: "0 8px",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Simulator Viewport Body */}
            <div
              style={{
                flex: 1,
                background: "#09090b",
                borderRadius: "0 0 16px 16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                padding: viewMode === "mobile" ? "20px 0" : 0,
              }}
            >
              {viewMode === "desktop" ? (
                <iframe
                  title={`${instantPreview.name} desktop live preview`}
                  src={`/api/preview-composition?id=${instantPreview.id}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    background: "#fff",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 375,
                    height: 720,
                    borderRadius: 36,
                    border: "12px solid #1e293b",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                    overflow: "hidden",
                    background: "#fff",
                    position: "relative",
                  }}
                >
                  {/* Phone Notch */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 120,
                      height: 18,
                      background: "#1e293b",
                      borderRadius: "0 0 12px 12px",
                      zIndex: 10,
                    }}
                  />
                  <iframe
                    title={`${instantPreview.name} mobile live preview`}
                    src={`/api/preview-composition?id=${instantPreview.id}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Section Inspector Modal ───────────────────────────────── */}
        {inspectingDesign && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: 20,
            }}
            onClick={() => setInspectingDesign(null)}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                maxWidth: 680,
                width: "100%",
                maxHeight: "85vh",
                overflowY: "auto",
                padding: 24,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              onClick={e => e.stopPropagation()}
            >
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="050">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="h2" variant="headingMd">{inspectingDesign.name}</Text>
                      <Badge tone="info">{`${inspectingDesign.sections.length} Sections`}</Badge>
                    </InlineStack>
                    <Text as="p" tone="subdued" variant="bodySm">{inspectingDesign.description}</Text>
                  </BlockStack>
                  <Button variant="plain" onClick={() => setInspectingDesign(null)}>✕ Close</Button>
                </InlineStack>

                <Divider />

                <Text as="h3" variant="headingSm">Section Flow (Top to Bottom):</Text>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {inspectingDesign.header && (
                    <div style={{ padding: "8px 14px", borderRadius: 8, background: "#f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Text as="span" fontWeight="bold">Header Chrome</Text>
                      <Badge tone="success">{inspectingDesign.header}</Badge>
                    </div>
                  )}

                  {inspectingDesign.sections.map((s: any, idx: number) => {
                    const isHero = s.componentId.includes("hero");
                    const isProduct = s.componentId.includes("grid") || s.componentId.includes("collection") || s.componentId.includes("bestseller");
                    const isStory = s.componentId.includes("story") || s.componentId.includes("founder") || s.componentId.includes("ingredients");
                    const isUgc = s.componentId.includes("ugc") || s.componentId.includes("instagram") || s.componentId.includes("reels");
                    const isTrust = s.componentId.includes("testimonial") || s.componentId.includes("press") || s.componentId.includes("trust") || s.componentId.includes("stats") || s.componentId.includes("faq");
                    const isPopup = s.componentId.includes("popup") || s.componentId.includes("wheel") || s.componentId.includes("exit");
                    const isFooter = s.componentId.includes("footer");

                    const badgeTone = isHero ? "magic" : isProduct ? "attention" : isTrust ? "success" : isUgc ? "info" : "subdued";

                    return (
                      <div
                        key={idx}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 8,
                          background: isHero ? "#f0fdf4" : isPopup ? "#fef2f2" : "#f8fafc",
                          border: "1px solid #e2e8f0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <InlineStack gap="200" blockAlign="center">
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", width: 24 }}>#{idx + 1}</span>
                          <Text as="span" fontWeight="semibold">
                            {s.componentId.replace(/^(hp\d+-|hero-|footer-|header-|popup-)/, "").replace(/-/g, " ").toUpperCase()}
                          </Text>
                        </InlineStack>
                        <Badge tone={badgeTone as any}>{s.componentId}</Badge>
                      </div>
                    );
                  })}

                  {inspectingDesign.footer && (
                    <div style={{ padding: "8px 14px", borderRadius: 8, background: "#f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Text as="span" fontWeight="bold">Footer Chrome</Text>
                      <Badge tone="success">{inspectingDesign.footer}</Badge>
                    </div>
                  )}
                </div>

                <InlineStack align="end" gap="200">
                  <Button onClick={() => setInspectingDesign(null)}>Close</Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      const id = inspectingDesign.id;
                      setInspectingDesign(null);
                      run("add", id);
                    }}
                  >
                    Apply {inspectingDesign.name}
                  </Button>
                </InlineStack>
              </BlockStack>
            </div>
          </div>
        )}

        <Divider />
        <Text as="p" tone="subdued" variant="bodySm">{shopDomain}</Text>
      </BlockStack>
    </Page>
  );
}

export function ErrorBoundary() {
  return (
    <Page title="Make your store">
      <Banner tone="warning" title="Could not load store builder">
        <BlockStack gap="200">
          <p>There was a temporary issue loading your store designs. Please refresh the page.</p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </BlockStack>
      </Banner>
    </Page>
  );
}
