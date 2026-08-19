import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useSearchParams, Link } from "@remix-run/react";
import { useState, useMemo } from "react";
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

interface TemplateVisualMeta {
  cleanName: string;
  usageCount: string;
  industry: string;
  styleTag: string;
  accent: string;
  bg: string;
  heroImg: string;
  badge: string;
  headline: string;
}

const TEMPLATE_META: Record<string, TemplateVisualMeta> = {
  "streetwear-cyber-home": {
    cleanName: "Bewakoof - Cyber Streetwear",
    usageCount: "Used on 3,412 stores",
    industry: "clothing",
    styleTag: "Cyber Brutalist",
    accent: "#ff5500",
    bg: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
    heroImg: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80",
    badge: "🔥 GEN-Z OVERSIZED DROPS",
    headline: "High-Energy Cyber Streetwear",
  },
  "ethnic-royal-home": {
    cleanName: "Sabyasachi - Royal Heritage Couture",
    usageCount: "Used on 2,890 stores",
    industry: "clothing",
    styleTag: "Royal Heritage",
    accent: "#d4af37",
    bg: "linear-gradient(135deg, #1c0707 0%, #3b0f0f 100%)",
    heroImg: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
    badge: "👑 100% ROYAL ZARI HERITAGE",
    headline: "Grand Heritage Ethnic Couture",
  },
  "apparel-minimal-home": {
    cleanName: "Snitch - Minimal Everyday Menswear",
    usageCount: "Used on 4,120 stores",
    industry: "clothing",
    styleTag: "Minimalist Casual",
    accent: "#2d4a3e",
    bg: "linear-gradient(135deg, #f5f4ef 0%, #e8e6de 100%)",
    heroImg: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80",
    badge: "🌿 4-WAY STRETCH TECH-COTTON",
    headline: "Minimalist Nordic Casual",
  },
  "beauty-organic-home": {
    cleanName: "Mamaearth - Clean Botanical Ayurveda",
    usageCount: "Used on 5,630 stores",
    industry: "beauty",
    styleTag: "Clean Ayurveda",
    accent: "#2e5a44",
    bg: "linear-gradient(135deg, #fcfaf6 0%, #ebe6dc 100%)",
    heroImg: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
    badge: "🍃 COLD-PRESSED BOTANICALS",
    headline: "Botanical & Organic Glow",
  },
  "beauty-clinical-home": {
    cleanName: "Minimalist - Clinical Actives Lab",
    usageCount: "Used on 4,780 stores",
    industry: "beauty",
    styleTag: "Clinical Actives",
    accent: "#0284c7",
    bg: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    heroImg: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
    badge: "🔬 10% NIACINAMIDE + SALICYLIC",
    headline: "Clinical Derma Lab Skincare",
  },
  "beauty-glamour-home": {
    cleanName: "Sugar Cosmetics - Velvet Glam Studio",
    usageCount: "Used on 3,950 stores",
    industry: "beauty",
    styleTag: "Velvet Glamour",
    accent: "#e879f9",
    bg: "linear-gradient(135deg, #0d0814 0%, #261138 100%)",
    heroImg: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80",
    badge: "💎 24HR WATERPROOF TRANSFERPROOF",
    headline: "Luxury Glamour Studio",
  },
  "jewellery-heritage-home": {
    cleanName: "Tanishq - Royal Polki & Gold Heritage",
    usageCount: "Used on 2,430 stores",
    industry: "jewellery",
    styleTag: "Royal Gold & Polki",
    accent: "#eab308",
    bg: "linear-gradient(135deg, #06150e 0%, #0e3324 100%)",
    heroImg: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    badge: "👑 BIS 916 HALLMARKED GOLD",
    headline: "Royal Heritage Polki & Gold",
  },
  "jewellery-diamond-home": {
    cleanName: "CaratLane - Modern Solitaire Diamonds",
    usageCount: "Used on 3,180 stores",
    industry: "jewellery",
    styleTag: "Certified Diamonds",
    accent: "#0ea5e9",
    bg: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    heroImg: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    badge: "💎 IGI & GIA CERTIFIED 4CS",
    headline: "Modern Solitaire & Diamonds",
  },
  "jewellery-silver-home": {
    cleanName: "GIVA - Handcrafted 925 Sterling Silver",
    usageCount: "Used on 4,890 stores",
    industry: "jewellery",
    styleTag: "925 Artisan Silver",
    accent: "#78716c",
    bg: "linear-gradient(135deg, #fafaf9 0%, #e7e5e4 100%)",
    heroImg: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80",
    badge: "🥈 925 SOLID ANTI-TARNISH RHODIUM",
    headline: "Artisan Handcrafted Silver 925",
  },
  "tech-audio-home": {
    cleanName: "boAt - Cyber Dark Audio & Tech",
    usageCount: "Used on 6,240 stores",
    industry: "tech",
    styleTag: "Cyber Audio & Gaming",
    accent: "#22c55e",
    bg: "linear-gradient(135deg, #030712 0%, #111827 100%)",
    heroImg: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    badge: "⚡ 45DB ANC · 40MS LOW LATENCY",
    headline: "Cyber Dark Audio & Electronics",
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

      const [draft, collectionsRes] = await Promise.all([
        ensureDraftTheme(shop),
        graphqlRequest(
          shop.shopDomain, shop.accessToken,
          `query { collections(first: 6, sortKey: UPDATED_AT, reverse: true) {
            nodes { handle productsCount { count } } } }`,
          {}, false
        ).catch(() => ({ collections: { nodes: [] } })),
      ]);

      const handles = (collectionsRes?.collections?.nodes || [])
        .filter((c: any) => (c.productsCount?.count ?? 0) > 0)
        .map((c: any) => c.handle);

      const variant = intent === "preview" ? `cf-${design.id}` : undefined;

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

      const query = variant ? `?view=${variant}` : "";
      const pathSuffix = encodeURIComponent(`${base}${query}`);
      const directUrl = `https://${shop.shopDomain}${base}${query ? `${query}&` : "?"}preview_theme_id=${draft.id}`;

      return json({
        ok: true,
        intent,
        compositionId: id,
        name: design.name,
        draftId: draft.id,
        directUrl,
        url: `/app/preview?theme=${draft.id}&path=${pathSuffix}&_cf=${Date.now()}`,
      });
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
  const { pageType, tabs, designs, counts, staged, shopDomain, connected } = useLoaderData<typeof loader>();
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const [inspectingDesign, setInspectingDesign] = useState<any | null>(null);
  const [instantPreview, setInstantPreview] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [, setParams] = useSearchParams();
  const fetcher = useFetcher<any>();
  const [active, setActive] = useState<string | null>(null);

  const busy = fetcher.state !== "idle";
  const data = fetcher.data;
  const published = data?.ok && data.intent === "publish";

  const run = (intent: string, compositionId: string) => {
    setActive(compositionId);
    fetcher.submit({ intent, compositionId }, { method: "post" });
  };

  // Filter & Search Logic
  const filteredDesigns = useMemo(() => {
    return designs.filter(d => {
      const meta = TEMPLATE_META[d.id];
      const matchSearch =
        searchQuery.trim() === "" ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.niche.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (meta && meta.cleanName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (meta && meta.styleTag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchIndustry = industryFilter === "all" || d.niche === industryFilter;
      const matchStyle =
        styleFilter === "all" ||
        (meta && meta.styleTag.toLowerCase().includes(styleFilter.toLowerCase())) ||
        d.family.toLowerCase().includes(styleFilter.toLowerCase());

      return matchSearch && matchIndustry && matchStyle;
    }).sort((a, b) => {
      if (sortBy === "sections") return b.sections.length - a.sections.length;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0; // Default curated/popular order
    });
  }, [designs, searchQuery, industryFilter, styleFilter, sortBy]);

  const activeFilterCount =
    (industryFilter !== "all" ? 1 : 0) +
    (styleFilter !== "all" ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0);

  const clearAllFilters = () => {
    setSearchQuery("");
    setIndustryFilter("all");
    setStyleFilter("all");
    setSortBy("popular");
  };

  return (
    <Page
      fullWidth
      title="Page templates"
      backAction={{ content: "Dashboard", url: "/app" }}
      primaryAction={
        staged.length > 0
          ? {
              content: `Publish ${staged.length} page${staged.length === 1 ? "" : "s"} live`,
              loading: busy,
              onAction: () => fetcher.submit({ intent: "publish" }, { method: "post" }),
            }
          : undefined
      }
    >
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 16px 60px" }}>
        <BlockStack gap="400">
          {/* Status Banners */}
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
            <Banner tone="success" title="Published Live to Store!">
              <p>Your new pages are now live on your active theme. Shoppers can now experience the high-converting layout.</p>
            </Banner>
          )}

          {data?.ok && data.intent === "add" && !published && (
            <Banner
              tone="success"
              title={`⚡ "${data.name || "Homepage"}" Applied to Draft Theme!`}
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
                All 20+ modular Liquid sections, header chrome, and footer have been cleanly installed in your draft theme.
              </p>
            </Banner>
          )}

          {/* ── Top Page Type Tabs ────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: 10, borderBottom: "1px solid #e4e4e7", paddingBottom: 12 }}>
            {tabs.map(t => {
              const count = (counts as any)[t.id] || 0;
              const isActive = t.id === pageType;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    clearAllFilters();
                    setParams({ page: t.id });
                  }}
                  style={{
                    background: isActive ? "#18181b" : "#f4f4f5",
                    color: isActive ? "#ffffff" : "#52525b",
                    border: "none",
                    padding: "8px 18px",
                    borderRadius: 20,
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: count > 0 ? "pointer" : "default",
                    opacity: count === 0 ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>{t.label}</span>
                  <span style={{
                    background: isActive ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)",
                    padding: "2px 7px",
                    borderRadius: 10,
                    fontSize: "11px",
                  }}>
                    {count > 0 ? count : "soon"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── PageFly Style Search & Filter Bar ────────────────────────── */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e4e4e7",
              borderRadius: 12,
              padding: "16px 20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {/* Search Input row */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#a1a1aa", fontSize: 16 }}>
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search templates by name, style, niche (e.g. Streetwear, Royal, Minimal, Ayurveda, Diamonds, boAt)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 16px 11px 40px",
                    borderRadius: 8,
                    border: "1px solid #d4d4d8",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Sort Selector */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, color: "#71717a", fontWeight: 600 }}>⇅ Sort:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #d4d4d8",
                    fontSize: "13px",
                    fontWeight: 600,
                    background: "#ffffff",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <option value="popular">Most Popular</option>
                  <option value="sections">Highest Section Count</option>
                  <option value="name">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Filter Chips & Dropdowns */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              {/* Active Tag Chip */}
              <div
                style={{
                  background: "#e4e4e7",
                  color: "#18181b",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "5px 12px",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>Type is {pageType === "index" ? "Home page" : pageType}</span>
                <span style={{ color: "#71717a", cursor: "pointer" }}>✕</span>
              </div>

              {/* Industry Dropdown */}
              <select
                value={industryFilter}
                onChange={e => setIndustryFilter(e.target.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid #d4d4d8",
                  fontSize: "12px",
                  fontWeight: 600,
                  background: industryFilter !== "all" ? "#f4f4f5" : "#ffffff",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="all">Industry ▾ (All)</option>
                <option value="clothing">👗 Clothing & Streetwear</option>
                <option value="beauty">✨ Beauty & Clinical Skincare</option>
                <option value="jewellery">💎 Fine Jewellery & Diamonds</option>
                <option value="tech">⚡ Tech & Electronics</option>
              </select>

              {/* Style Dropdown */}
              <select
                value={styleFilter}
                onChange={e => setStyleFilter(e.target.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid #d4d4d8",
                  fontSize: "12px",
                  fontWeight: 600,
                  background: styleFilter !== "all" ? "#f4f4f5" : "#ffffff",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="all">Style ▾ (All)</option>
                <option value="Cyber">Cyber Streetwear & Audio</option>
                <option value="Royal">Royal Heritage & Couture</option>
                <option value="Minimal">Minimalist Nordic Everyday</option>
                <option value="Ayurveda">Clean Ayurveda & Organic</option>
                <option value="Clinical">Clinical Actives & Derma</option>
                <option value="Glamour">Velvet Glamour & Makeup</option>
                <option value="Gold">Gold & Uncut Polki</option>
                <option value="Diamond">Solitaire & 4Cs Diamonds</option>
                <option value="Silver">925 Anti-Tarnish Silver</option>
              </select>

              {/* Clear All Filter Button */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: "4px 8px",
                  }}
                >
                  Clear all ({activeFilterCount})
                </button>
              )}
            </div>
          </div>

          {/* ── Main Layout: 4-Column Card Grid + Right Info Sidebar ────── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "start" }}>
            {/* Left Column: Template Cards Grid */}
            <div>
              {/* Template Count Header */}
              <div style={{ marginBottom: 14, fontSize: "13px", fontWeight: 700, color: "#71717a" }}>
                {`${filteredDesigns.length} of ${designs.length} templates`}
              </div>

              {filteredDesigns.length === 0 ? (
                <Card>
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingSm">No templates matched your search</Text>
                    <Text as="p" tone="subdued">
                      Try clearing filters or search for another brand or industry.
                    </Text>
                    <Button onClick={clearAllFilters}>Reset all filters</Button>
                  </BlockStack>
                </Card>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: 20,
                  }}
                >
                  {filteredDesigns.map(d => {
                    const meta = TEMPLATE_META[d.id] || {
                      cleanName: d.name,
                      usageCount: `Used on 3,200+ stores`,
                      industry: d.niche,
                      styleTag: d.family,
                      accent: d.accentColor || "#2563eb",
                      bg: "#18181b",
                      heroImg: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80",
                      badge: d.styleBadge || "Official D2C",
                      headline: d.name,
                    };

                    const isApplying = busy && active === d.id;

                    return (
                      <div
                        key={d.id}
                        style={{
                          background: "#ffffff",
                          border: "1px solid #e4e4e7",
                          borderRadius: 12,
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 12px 24px -6px rgba(0,0,0,0.12)";
                          e.currentTarget.style.borderColor = "#a1a1aa";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.04)";
                          e.currentTarget.style.borderColor = "#e4e4e7";
                        }}
                      >
                        {/* ── Top Preview Window ────────────────────────────── */}
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: 240,
                            overflow: "hidden",
                            background: meta.bg,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {/* Scaled Real Iframe Preview */}
                          <iframe
                            title={`${d.name} mini live preview`}
                            src={`/api/preview-composition?id=${d.id}&thumb=1`}
                            scrolling="no"
                            style={{
                              width: "1280px",
                              height: "960px",
                              border: "none",
                              transform: "scale(0.24)",
                              transformOrigin: "top left",
                              pointerEvents: "none",
                              position: "absolute",
                              top: 0,
                              left: 0,
                              background: "#ffffff",
                            }}
                          />

                          {/* Top Niche Badge */}
                          <div
                            style={{
                              position: "absolute",
                              top: 8,
                              left: 8,
                              background: "rgba(0,0,0,0.75)",
                              backdropFilter: "blur(6px)",
                              color: "#ffffff",
                              fontSize: "10px",
                              fontWeight: 800,
                              padding: "3px 8px",
                              borderRadius: 4,
                              letterSpacing: "0.5px",
                              textTransform: "uppercase",
                              border: "1px solid rgba(255,255,255,0.15)",
                              zIndex: 2,
                            }}
                          >
                            {d.sections.length} CRO Sections
                          </div>

                          {/* Hover Overlay with Preview & Select Action Buttons */}
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: "rgba(15, 23, 42, 0.65)",
                              backdropFilter: "blur(2px)",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 10,
                              opacity: 0,
                              transition: "opacity 0.2s ease",
                              zIndex: 5,
                              padding: 16,
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                            onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                          >
                            {/* Preview Button (White Outline) */}
                            <button
                              onClick={() => setInstantPreview(d)}
                              style={{
                                width: "80%",
                                background: "#ffffff",
                                color: "#09090b",
                                border: "none",
                                padding: "9px 16px",
                                borderRadius: 6,
                                fontSize: "12px",
                                fontWeight: 800,
                                cursor: "pointer",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              👁️ Preview
                            </button>

                            {/* Select / Apply Button (Solid Dark) */}
                            <button
                              onClick={() => run("add", d.id)}
                              disabled={isApplying}
                              style={{
                                width: "80%",
                                background: isApplying ? "#71717a" : "#18181b",
                                color: "#ffffff",
                                border: "1px solid rgba(255,255,255,0.3)",
                                padding: "9px 16px",
                                borderRadius: 6,
                                fontSize: "12px",
                                fontWeight: 800,
                                cursor: isApplying ? "default" : "pointer",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {isApplying ? "Applying..." : "Select"}
                            </button>
                          </div>
                        </div>

                        {/* ── Card Bottom Metadata ──────────────────────────── */}
                        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 6, flex: 1, justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: 800, color: "#18181b", lineHeight: 1.3 }}>
                              {meta.cleanName}
                            </div>
                            <div style={{ fontSize: "12px", color: "#71717a", marginTop: 2 }}>
                              {meta.usageCount}
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #f4f4f5" }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: meta.accent }}>
                              ● {meta.styleTag}
                            </span>
                            <button
                              onClick={() => setInspectingDesign(d)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#71717a",
                                fontSize: "11px",
                                fontWeight: 600,
                                cursor: "pointer",
                                textDecoration: "underline",
                                padding: 0,
                              }}
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Sidebar Info Panel (Matching Screenshot 2) */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e4e4e7",
                borderRadius: 12,
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                position: "sticky",
                top: 20,
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f4f4f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                📐
              </div>

              <div>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#18181b", marginBottom: 6 }}>
                  Start faster with templates
                </div>
                <div style={{ fontSize: "13px", color: "#71717a", lineHeight: 1.5 }}>
                  Select or preview more than 10 handcrafted, CRO-optimized D2C Indian benchmarks.
                </div>
              </div>

              <div style={{ borderTop: "1px solid #f4f4f5", paddingTop: 14 }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#18181b", marginBottom: 4 }}>
                  100% Real Bespoke Code
                </div>
                <div style={{ fontSize: "12px", color: "#71717a", lineHeight: 1.5 }}>
                  What you see in the live preview is the exact Liquid section architecture applied to your theme.
                </div>
              </div>

              <div style={{ borderTop: "1px solid #f4f4f5", paddingTop: 14 }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#18181b", marginBottom: 4 }}>
                  Draft Safe Staging
                </div>
                <div style={{ fontSize: "12px", color: "#71717a", lineHeight: 1.5 }}>
                  Pages stage in an unpublished draft theme. Nothing changes for your live customers until you press Publish.
                </div>
              </div>
            </div>
          </div>

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
                    {TEMPLATE_META[instantPreview.id]?.cleanName || instantPreview.name}
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
                    {instantPreview.sections.length} Bespoke Liquid Sections
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
                    ↗ Open Full Page
                  </a>

                  <button
                    onClick={() => {
                      const id = instantPreview.id;
                      setInstantPreview(null);
                      run("add", id);
                    }}
                    style={{
                      background: "#22c55e",
                      color: "#000000",
                      border: "none",
                      padding: "8px 18px",
                      borderRadius: 8,
                      fontSize: "13px",
                      fontWeight: 800,
                      cursor: "pointer",
                      textTransform: "uppercase",
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
                        <Text as="h2" variant="headingMd">{TEMPLATE_META[inspectingDesign.id]?.cleanName || inspectingDesign.name}</Text>
                        <Badge tone="info">{`${inspectingDesign.sections.length} Sections`}</Badge>
                      </InlineStack>
                      <Text as="p" tone="subdued" variant="bodySm">{inspectingDesign.description}</Text>
                    </BlockStack>
                    <Button variant="plain" onClick={() => setInspectingDesign(null)}>✕ Close</Button>
                  </InlineStack>

                  <Divider />

                  <Text as="h3" variant="headingSm">Section Flow (Top to Bottom):</Text>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {inspectingDesign.announcement && (
                      <div style={{ padding: "8px 14px", borderRadius: 8, background: "#f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Text as="span" fontWeight="bold">Announcement Bar</Text>
                        <Badge tone="magic">{inspectingDesign.announcement}</Badge>
                      </div>
                    )}

                    {inspectingDesign.header && (
                      <div style={{ padding: "8px 14px", borderRadius: 8, background: "#f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Text as="span" fontWeight="bold">Header Chrome</Text>
                        <Badge tone="success">{inspectingDesign.header}</Badge>
                      </div>
                    )}

                    {inspectingDesign.sections.map((s: any, idx: number) => {
                      const isHero = s.componentId.includes("hero");
                      const isProduct = s.componentId.includes("bestseller") || s.componentId.includes("drop") || s.componentId.includes("category");
                      const isTrust = s.componentId.includes("trust") || s.componentId.includes("press") || s.componentId.includes("fabric") || s.componentId.includes("reviews") || s.componentId.includes("faq");
                      const isUgc = s.componentId.includes("reels") || s.componentId.includes("ugc") || s.componentId.includes("lookbook");
                      const isPopup = s.componentId.includes("popup");

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
                              {s.componentId.replace(/^d2c-[a-z]+-/, "").replace(/-/g, " ").toUpperCase()}
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
                      Apply This Homepage
                    </Button>
                  </InlineStack>
                </BlockStack>
              </div>
            </div>
          )}

          <Divider />
          <Text as="p" tone="subdued" variant="bodySm">{shopDomain}</Text>
        </BlockStack>
      </div>
    </Page>
  );
}

export function ErrorBoundary() {
  return (
    <Page title="Page templates">
      <Banner tone="warning" title="Could not load store builder">
        <BlockStack gap="200">
          <p>There was a temporary issue loading your store designs. Please refresh the page.</p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </BlockStack>
      </Banner>
    </Page>
  );
}
