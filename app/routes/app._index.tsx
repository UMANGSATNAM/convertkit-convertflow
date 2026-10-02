import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useSearchParams } from "@remix-run/react";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Page,
  Layout,
  Card,
  Button,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Banner,
  TextField,
  Box,
  Divider,
  Modal,
  Select,
  EmptyState,
} from "@shopify/polaris";
import { ViewIcon } from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import prisma, { getOrSyncShop } from "../db.server";
import { installSection, describeSection } from "../services/section-install.server";
import { ensurePreviewTheme, previewUrl } from "../services/preview-theme.server";
import { D2C_LANDING_PAGES, type LandingPageDefinition } from "../data/landing-pages-registry";
import { installLandingPage } from "../services/landing-page-install.server";

/**
 * Pre-Made Sections Store
 *
 * Merchants browse pre-made sections (Hero, PDP, Trust, Reviews, FAQ, etc.),
 * preview them live on their store, and click "Add to Store" to inject them
 * straight into their active Shopify theme with 1 click.
 */

const CATEGORIES = [
  { id: "1000cr-elite", label: "✨ 1000cr Flagship Suite (New)" },
  { id: "legacy-all", label: "📦 Legacy Archive (All)" },
  { id: "landing-page", label: "🚀 Landing Pages (D2C Home) (12)" },
  { id: "product-page", label: "📄 Legacy PDP Variations (88)" },
  { id: "cart-drawer", label: "🛒 Cart & Slide Drawers (20)" },
  { id: "urgency", label: "⚡ Emergency & Urgency Boosters (5)" },
  { id: "hero", label: "🎯 Hero Banners (15)" },
  { id: "announcement", label: "📢 Announcement Bars (10)" },
  { id: "product-card", label: "🏷️ Product Cards & Grids (12)" },
  { id: "header", label: "🔝 Headers (10)" },
  { id: "footer", label: "🔻 Footers (10)" },
];

const CATEGORY_GROUPS = [
  {
    title: "FLAGSHIP ARCHITECTURE",
    items: [
      { id: "1000cr-elite", label: "1000cr Flagship Suite", icon: "✨", count: "1", desc: "Signature Minimal Luxury PDP Showcase" },
    ],
  },
  {
    title: "📦 LEGACY ARCHIVE (DEPRECATED)",
    items: [
      { id: "legacy-all", label: "All Legacy Sections", icon: "📦", count: "120+", desc: "Old Section Library" },
      { id: "landing-page", label: "Home Landing Pages", icon: "🚀", count: "12", desc: "Complete D2C Home Stores" },
      { id: "product-page", label: "Legacy PDP Variations", icon: "📄", count: "88", desc: "Old PDP Variations" },
      { id: "cart-drawer", label: "Cart & Slide Drawers", icon: "🛒", count: "20", desc: "Drawers with Upsells" },
      { id: "urgency", label: "Urgency & Scarcity", icon: "⚡", count: "5", desc: "Emergency Sales Boosters" },
      { id: "hero", label: "Hero Banners", icon: "🎯", count: "15", desc: "Visual Banners" },
      { id: "announcement", label: "Announcement Bars", icon: "📢", count: "10", desc: "Tickers & Marquees" },
      { id: "product-card", label: "Product Cards & Grids", icon: "🏷️", count: "12", desc: "Collections & Swatches" },
      { id: "header", label: "Headers & Navbars", icon: "🔝", count: "10", desc: "Navigation" },
      { id: "footer", label: "Footers", icon: "🔻", count: "10", desc: "Trust & Legal Links" },
    ],
  },
];

const NICHE_FILTERS = [
  { id: "all", label: "✨ All Niches" },
  { id: "streetwear", label: "👗 Streetwear & Urban" },
  { id: "beauty", label: "💄 Beauty & Skincare" },
  { id: "luxury", label: "✨ Luxury & Jewelry" },
  { id: "tech", label: "🎧 Tech & Audio" },
  { id: "wellness", label: "🌿 Health & Wellness" },
  { id: "coffee", label: "☕ Food & Artisanal" },
  { id: "dropship", label: "⚡ High-CRO Dropship" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || "1000cr-elite";
  const niche = (url.searchParams.get("niche") || "all").toLowerCase();
  const q = (url.searchParams.get("q") || "").trim();

  const shop = await getOrSyncShop(session.shop, session.accessToken);

  const isLandingPageCategory = category === "landing-page";

  let filteredLandingPages: LandingPageDefinition[] = [];
  if (isLandingPageCategory) {
    filteredLandingPages = D2C_LANDING_PAGES;

    if (q) {
      filteredLandingPages = filteredLandingPages.filter(
        (lp) =>
          lp.name.toLowerCase().includes(q.toLowerCase()) ||
          lp.nicheLabel.toLowerCase().includes(q.toLowerCase()) ||
          lp.tagline.toLowerCase().includes(q.toLowerCase()) ||
          lp.description.toLowerCase().includes(q.toLowerCase()) ||
          lp.conversionFeatures.some((f) => f.toLowerCase().includes(q.toLowerCase()))
      );
    }

    if (niche !== "all") {
      filteredLandingPages = filteredLandingPages.filter(lp => {
        const text = `${lp.name} ${lp.nicheLabel} ${lp.tagline} ${lp.description}`.toLowerCase();
        if (niche === "streetwear") return text.includes("streetwear") || text.includes("urban") || text.includes("heavyweight");
        if (niche === "beauty") return text.includes("beauty") || text.includes("skin") || text.includes("cosmetic") || text.includes("ayurveda");
        if (niche === "luxury") return text.includes("luxury") || text.includes("jewelry") || text.includes("couture") || text.includes("solitaire");
        if (niche === "tech") return text.includes("audio") || text.includes("tech") || text.includes("headphone") || text.includes("flagship");
        if (niche === "wellness") return text.includes("wellness") || text.includes("clinical") || text.includes("supplement");
        if (niche === "coffee") return text.includes("coffee") || text.includes("roastery") || text.includes("artisanal");
        if (niche === "dropship") return text.includes("conversion") || text.includes("dropship") || text.includes("funnel");
        return text.includes(niche);
      });
    }

    return json({
      shopDomain: session.shop,
      category,
      niche,
      q,
      totalCount: filteredLandingPages.length,
      components: [],
      landingPages: filteredLandingPages,
      isLandingPageCategory: true,
    });
  }

  // Build where clause according to category, niche, and search
  const where: any = { status: "PUBLISHED" };

  if (category === "1000cr-elite") {
    where.category = "1000cr-elite";
  } else if (category === "legacy-all") {
    where.category = { not: "1000cr-elite" };
  } else if (category && category !== "all") {
    where.category = category;
  }

  const conditions: any[] = [];

  if (niche && niche !== "all") {
    const keywordMap: Record<string, string[]> = {
      streetwear: ["streetwear", "urban", "hype", "drop", "apparel", "Streetwear", "Urban", "Hype", "Bold"],
      beauty: ["beauty", "skin", "cosmetics", "glow", "lumiere", "serum", "Beauty", "Glamour", "Editorial"],
      luxury: ["luxury", "jewelry", "gem", "couture", "atelier", "caratlane", "solitaire", "gold", "polki", "royal", "Luxury", "Heritage"],
      tech: ["tech", "audio", "cyber", "specs", "flagship", "Tech", "Cyber"],
      wellness: ["wellness", "clinical", "health", "supplement", "ayurveda", "organic", "natural", "Organic", "Clinical", "Natural"],
      coffee: ["coffee", "roast", "beverage", "artisanal", "tea", "Coffee", "Food"],
      dropship: ["urgency", "countdown", "atc", "bundle", "flash", "scarcity", "timer", "proof", "fbt"],
    };
    const keywords = keywordMap[niche] || [niche];
    conditions.push({
      OR: keywords.flatMap((kw) => [
        { componentId: { contains: kw } },
        { family: { contains: kw } },
        { visualStyle: { contains: kw } },
      ]),
    });
  }

  if (q) {
    conditions.push({
      OR: [
        { componentId: { contains: q } },
        { family: { contains: q } },
        { visualStyle: { contains: q } },
        { category: { contains: q } },
      ],
    });
  }

  if (conditions.length > 0) {
    where.AND = conditions;
  }

  const [components, totalCount] = await Promise.all([
    prisma.componentRegistry.findMany({
      where,
      orderBy: { componentId: "asc" },
      take: 120,
    }),
    prisma.componentRegistry.count({ where }),
  ]);

  const described = await Promise.all(
    components.map(async (c: any) => ({
      ...c,
      detail: await describeSection(c.liquidPath),
    }))
  );

  return json({
    shopDomain: session.shop,
    category,
    niche,
    q,
    totalCount,
    components: described,
    landingPages: [],
    isLandingPageCategory: false,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "");
  const componentId = String(form.get("componentId") || "");
  const liquidPath = String(form.get("liquidPath") || "");
  const sectionType = String(form.get("sectionType") || "");
  const sectionName = String(form.get("sectionName") || "");
  const targetChoice = String(form.get("targetChoice") || "auto");

  const shop = await getOrSyncShop(session.shop, session.accessToken);
  if (!shop) return json({ error: "Store not connected." }, { status: 400 });

  try {
    if (intent === "preview") {
      const theme = await ensurePreviewTheme(shop);

      const isPdp = sectionType === "product-page" || sectionType.startsWith("pdp") || componentId.startsWith("pdp") || componentId.startsWith("elite-pdp") || sectionType.startsWith("product-card");
      const isCart = sectionType === "cart-drawer" || componentId.startsWith("cdr");
      const isUrgency = sectionType === "urgency" || componentId.startsWith("urgency");

      const target =
        sectionType === "header" || sectionType.startsWith("header")
          ? ({ kind: "group", group: "header", replace: "header" } as const)
          : sectionType === "footer" || sectionType.startsWith("footer")
            ? ({ kind: "group", group: "footer", replace: "footer" } as const)
            : targetChoice === "product" || (!targetChoice && isPdp)
              ? ({ kind: "template", template: "product", position: "bottom" } as const)
              : isCart
                ? ({ kind: "template", template: "index", position: "bottom" } as const)
                : isUrgency
                  ? (componentId.includes("sticky") || componentId.includes("stock")
                      ? ({ kind: "template", template: "product", position: "bottom" } as const)
                      : ({ kind: "template", template: "index", position: "top" } as const))
                  : ({ kind: "template", template: "index", position: "top" } as const);

      const result = await installSection(
        shop,
        theme.id,
        { componentId, liquidPath, sectionType },
        target,
        {
          palette: {
            background: (shop.brandConfig as any)?.colors?.background,
            text: (shop.brandConfig as any)?.colors?.text,
            accent: (shop.brandConfig as any)?.colors?.primary,
            accentAlt: (shop.brandConfig as any)?.colors?.accent,
          },
        }
      );

      const previewPage =
        target.kind === "template" && target.template === "product" ? "/products" : "/";

      return json({
        ok: true,
        intent,
        componentId,
        sectionName,
        url: previewUrl(session.shop, theme.id, previewPage),
        themeCreated: theme.created,
        missing: result.missing,
      });
    }

    if (intent === "install") {
      const targetThemeChoice = String(form.get("targetThemeChoice") || "draft");
      const useDraft = targetThemeChoice === "draft";
      let themeToInstall = "active";
      let themeName = "Live Store Theme";

      if (useDraft) {
        const theme = await ensurePreviewTheme(shop);
        themeToInstall = theme.id;
        themeName = theme.name;
      }

      const isPdp = sectionType === "product-page" || sectionType.startsWith("pdp") || componentId.startsWith("pdp") || componentId.startsWith("elite-pdp") || sectionType.startsWith("product-card");
      const isCart = sectionType === "cart-drawer" || componentId.startsWith("cdr");
      const isUrgency = sectionType === "urgency" || componentId.startsWith("urgency");

      let target: any;
      if (sectionType === "header" || sectionType.startsWith("header")) {
        target = { kind: "group", group: "header", replace: "header" };
      } else if (sectionType === "footer" || sectionType.startsWith("footer")) {
        target = { kind: "group", group: "footer", replace: "footer" };
      } else if (targetChoice === "product" || (!targetChoice && isPdp)) {
        target = { kind: "template", template: "product", position: "bottom" };
      } else if (isCart) {
        target = { kind: "template", template: "index", position: "bottom" };
      } else if (isUrgency) {
        if (componentId.includes("sticky") || componentId.includes("stock")) {
          target = { kind: "template", template: "product", position: "bottom" };
        } else {
          target = { kind: "template", template: "index", position: "top" };
        }
      } else {
        const topTypes = ["hero", "announcement", "marquee", "ticker"];
        const position = topTypes.includes(sectionType) ? "top" : "bottom";
        target = { kind: "template", template: "index", position };
      }

      const result = await installSection(
        shop,
        themeToInstall,
        { componentId, liquidPath, sectionType },
        target,
        {
          palette: {
            background: (shop.brandConfig as any)?.colors?.background,
            text: (shop.brandConfig as any)?.colors?.text,
            accent: (shop.brandConfig as any)?.colors?.primary,
            accentAlt: (shop.brandConfig as any)?.colors?.accent,
          },
        }
      );

      const targetLabel =
        target.kind === "group"
          ? `${target.group.toUpperCase()} Group`
          : target.template === "product"
            ? "Product Page"
            : "Homepage";

      const previewPage =
        target.kind === "template" && target.template === "product" ? "/products" : "/";
      const draftPreviewUrl = useDraft
        ? previewUrl(session.shop, themeToInstall, previewPage)
        : undefined;

      const shopSubdomain = session.shop.replace(".myshopify.com", "");
      const editorUrl = useDraft
        ? `https://admin.shopify.com/store/${shopSubdomain}/themes/${themeToInstall}/editor`
        : `https://${session.shop}/admin/themes/current/editor`;

      return json({
        ok: true,
        intent,
        componentId,
        sectionName,
        targetLabel,
        isDraftTheme: useDraft,
        themeName,
        previewUrl: draftPreviewUrl,
        editorUrl,
        result,
      });
    }

    if (intent === "install-landing-page") {
      const landingPageId = String(form.get("landingPageId") || "");
      const targetThemeChoice = String(form.get("targetThemeChoice") || "draft");
      const useDraft = targetThemeChoice === "draft";
      let themeToInstall = "active";
      let themeName = "Live Store Theme";

      if (useDraft) {
        const theme = await ensurePreviewTheme(shop);
        themeToInstall = theme.id;
        themeName = theme.name;
      }

      const result = await installLandingPage(shop, themeToInstall, landingPageId, {
        isDraftTheme: useDraft,
      });

      return json({
        ok: true,
        intent,
        landingPageId,
        pageName: result.templateName,
        templateKey: result.templateKey,
        isDraftTheme: useDraft,
        themeName,
        previewUrl: result.previewUrl,
        editorUrl: result.editorUrl,
        filesWritten: result.filesWritten,
        sectionCount: result.sectionCount,
      });
    }

    return json({ error: `Unknown intent "${intent}"` }, { status: 400 });
  } catch (err: any) {
    console.error(`[PreMadeSectionsStore] ${intent} failed:`, err);
    return json({ error: err.message || String(err) }, { status: 500 });
  }
}

function BentoSectionCard({
  component,
  shopDomain,
  isFeatured,
  isInstalling,
  isPreviewing,
  onPreview,
  onInstallDraft,
  onInstallLive,
}: {
  component: any;
  shopDomain: string;
  isFeatured?: boolean;
  isInstalling: boolean;
  isPreviewing: boolean;
  onPreview: () => void;
  onInstallDraft: () => void;
  onInstallLive: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [scale, setScale] = useState(0.28);
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

  const isElite = component.category === "1000cr-elite" || component.componentId.startsWith("elite-");
  const name = component.detail?.name || (isElite ? "Signature Minimal Luxury PDP Showcase" : component.componentId.replace(/[-_]/g, " "));
  const settingsCount = component.detail?.settings?.length || 23;
  const previewUrl = `/preview?sectionId=${encodeURIComponent(component.componentId)}&shop=${encodeURIComponent(shopDomain)}&embed=1`;
  const containerHeight = isElite ? 380 : (isFeatured ? 290 : 210);

  return (
    <div className={`cf-bento-card ${isFeatured ? "cf-bento-featured" : ""} ${isElite ? "cf-elite-card" : ""}`}>
      {/* Sleek Minimal Header */}
      <div
        style={{
          padding: "14px 18px",
          background: "#ffffff",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
          <span
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: isElite ? "#0f172a" : "#f1f5f9",
              color: isElite ? "#ffffff" : "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              flexShrink: 0,
            }}
          >
            {isElite ? "✨" : "📦"}
          </span>
          <div style={{ minWidth: 0 }}>
            <h3
              onClick={onPreview}
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.2px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {name}
            </h3>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "1px" }}>
              {isElite ? "Flagship Product Page Buy Box" : component.sectionType}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#475569",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              padding: "3px 8px",
              borderRadius: "6px",
            }}
          >
            {settingsCount} settings • Liquid 2.0
          </span>
        </div>
      </div>

      {/* Live Scaled Preview Frame */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onPreview}
        style={{
          position: "relative",
          width: "100%",
          height: containerHeight,
          overflow: "hidden",
          background: "#f8fafc",
          cursor: "pointer",
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
              title={name}
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
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            }}
          >
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Loading preview…</span>
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(2px)",
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
              background: "#0f172a",
              color: "#ffffff",
              padding: "8px 20px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
            }}
          >
            👁️ Open Live Preview Studio
          </div>
          <span style={{ fontSize: 11, color: "#e2e8f0", fontWeight: 500 }}>
            Click to test responsive mobile & desktop viewports
          </span>
        </div>
      </div>

      {/* Card Info & Quick Actions Footer */}
      <div style={{ padding: "14px 18px", background: "#ffffff", borderTop: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: "12px" }}>
        <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: 1.5 }}>
          {component.detail?.description || component.description || "Signature 1000cr brand PDP buy box with dual-variant swatches, real-time stock scarcity counter, delivery pincode estimator, and high-conversion sticky ATC."}
        </p>

        {/* Action Button Strip */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            type="button"
            onClick={onPreview}
            disabled={isPreviewing}
            style={{
              flex: "1 1 auto",
              background: "#ffffff",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
          >
            👁️ Studio Preview
          </button>
          <button
            type="button"
            onClick={onInstallDraft}
            disabled={isInstalling}
            title="Safe install to private preview theme"
            style={{
              background: "#f8fafc",
              color: "#475569",
              border: "1px solid #e2e8f0",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
          >
            🛡️ Test in Draft
          </button>
          <button
            type="button"
            onClick={onInstallLive}
            disabled={isInstalling}
            title="Direct install to published live store"
            style={{
              background: "#0f172a",
              color: "#ffffff",
              border: "none",
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              boxShadow: "0 1px 3px rgba(15, 23, 42, 0.2)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1e293b")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#0f172a")}
          >
            ⚡ Add to Live Store
          </button>
        </div>
      </div>
    </div>
  );
}

function LandingPageCard({
  landingPage,
  shopDomain,
  isInstalling,
  onPreview,
  onInstallDraft,
  onInstallLive,
}: {
  landingPage: LandingPageDefinition;
  shopDomain: string;
  isInstalling: boolean;
  onPreview: () => void;
  onInstallDraft: () => void;
  onInstallLive: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [scale, setScale] = useState(0.26);

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

  const previewSrc = `/preview?id=${encodeURIComponent(landingPage.id)}&shop=${encodeURIComponent(shopDomain)}&embed=1`;
  const totalSections = landingPage.sections.length + (landingPage.announcement ? 1 : 0) + (landingPage.header ? 1 : 0) + (landingPage.footer ? 1 : 0);

  return (
    <div className="cf-landing-card">
      {/* Top Browser Window Chrome */}
      <div
        style={{
          height: 36,
          background: "#0f172a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8, fontFamily: "monospace" }}>
            templates/page.{landingPage.id.replace("landing-", "")}.json
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.05em",
              color: "#ffffff",
              background: landingPage.accentColor,
              padding: "2px 8px",
              borderRadius: 12,
              textTransform: "uppercase",
            }}
          >
            {landingPage.nicheLabel}
          </span>
        </div>
      </div>

      {/* Mini-Browser Live Preview */}
      <div
        ref={containerRef}
        style={{
          height: 280,
          position: "relative",
          overflow: "hidden",
          background: landingPage.palette.background || "#f8fafc",
          cursor: "pointer",
        }}
        onClick={onPreview}
      >
        {inView ? (
          <div
            style={{
              width: 1280,
              height: 1280 / (scale > 0 ? scale : 0.26),
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              pointerEvents: "none",
            }}
          >
            <iframe
              title={`Preview ${landingPage.name}`}
              src={previewSrc}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                background: landingPage.palette.background || "#ffffff",
              }}
              loading="lazy"
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
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            <span>Loading live storefront preview...</span>
          </div>
        )}

        {/* Hover overlay hint */}
        <div className="cf-landing-hover-overlay">
          <button
            type="button"
            style={{
              background: "#ffffff",
              color: "#0f172a",
              border: "none",
              padding: "9px 18px",
              borderRadius: 30,
              fontSize: 13,
              fontWeight: 800,
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            👁️ Click for Studio Preview
          </button>
        </div>
      </div>

      {/* Landing Page Details Body */}
      <div
        style={{
          padding: "16px 18px",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
        }}
      >
        {/* Title, Badge & Tagline */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: landingPage.accentColor,
                background: `${landingPage.accentColor}18`,
                padding: "3px 8px",
                borderRadius: 6,
                letterSpacing: "0.04em",
              }}
            >
              {landingPage.badge}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>
              {totalSections} Cohesive Sections
            </span>
          </div>

          <h3
            onClick={onPreview}
            style={{
              margin: "8px 0 4px 0",
              fontSize: 16,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.3,
              cursor: "pointer",
            }}
          >
            {landingPage.name}
          </h3>
          <p style={{ margin: 0, fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>
            {landingPage.tagline}
          </p>
        </div>

        {/* Stats Callout Bar */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: "8px 10px",
            fontSize: 11,
            color: "#334155",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>📊</span>
          <span>{landingPage.stats}</span>
        </div>

        {/* Conversion Features Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {landingPage.conversionFeatures.slice(0, 4).map((f, i) => (
            <span
              key={i}
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#1e293b",
                background: "#f1f5f9",
                padding: "3px 8px",
                borderRadius: 6,
              }}
            >
              ✓ {f}
            </span>
          ))}
        </div>

        {/* Color Palette Swatches & Storefront Note */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Palette:</span>
            <div style={{ display: "flex", gap: 4 }}>
              <div
                title={`Primary: ${landingPage.palette.primary}`}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: landingPage.palette.primary,
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
              <div
                title={`Accent: ${landingPage.palette.accent}`}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: landingPage.palette.accent,
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
              <div
                title={`Background: ${landingPage.palette.background}`}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: landingPage.palette.background,
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
              <div
                title={`Text: ${landingPage.palette.text}`}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: landingPage.palette.text,
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
            </div>
          </div>
          <span style={{ fontSize: 11, color: "#059669", fontWeight: 700 }}>
            ⚡ 1-Click Shopify Theme Add
          </span>
        </div>

        {/* Action Button Strip */}
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <button
            type="button"
            onClick={onPreview}
            style={{
              flex: 1.2,
              background: "#ffffff",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              padding: "8px 12px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              transition: "all 0.15s ease",
            }}
          >
            👁️ Studio Preview
          </button>
          <button
            type="button"
            onClick={onInstallDraft}
            disabled={isInstalling}
            title="Safe install into private draft theme"
            style={{
              flex: 1,
              background: "#f8fafc",
              color: "#475569",
              border: "1px solid #e2e8f0",
              padding: "8px 10px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            🛡️ Add Draft
          </button>
          <button
            type="button"
            onClick={onInstallLive}
            disabled={isInstalling}
            title="Direct install to published live store theme"
            style={{
              flex: 1,
              background: "#0f172a",
              color: "#ffffff",
              border: "none",
              padding: "8px 10px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "background 0.15s ease",
            }}
          >
            ⚡ Add Live
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PreMadeSectionsStore() {
  const { shopDomain, category, niche, q, totalCount, components, landingPages, isLandingPageCategory } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<any>();

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activePreview, setActivePreview] = useState<any>(null);
  const [activeTarget, setActiveTarget] = useState<string>("auto");
  const [searchQuery, setSearchQuery] = useState(q);
  const [sectionDevice, setSectionDevice] = useState<"desktop" | "laptop" | "tablet" | "mobile">("desktop");
  const [legacyOpen, setLegacyOpen] = useState(category !== "1000cr-elite");

  const busy = fetcher.state !== "idle";
  const data = fetcher.data;
  const isInstalling = busy && fetcher.formData?.get("intent") === "install";
  const isInstallingLanding = busy && fetcher.formData?.get("intent") === "install-landing-page";
  const isPreviewing = busy && fetcher.formData?.get("intent") === "preview";
  const installingId = isInstalling
    ? String(fetcher.formData?.get("componentId"))
    : null;
  const previewingId = isPreviewing
    ? String(fetcher.formData?.get("componentId"))
    : null;

  // Watch for preview response to open modal
  useMemo(() => {
    if (data?.ok && data.intent === "preview" && data.url) {
      setActivePreview(data);
      setPreviewModalOpen(true);
    }
  }, [data]);

  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", newCategory);
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");
    setSearchParams(params);
  };

  const handleNicheChange = (newNiche: string) => {
    const params = new URLSearchParams(searchParams);
    if (newNiche === "all") params.delete("niche");
    else params.set("niche", newNiche);
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");
    setSearchParams(params);
  };

  const handleSearchSubmit = (val: string) => {
    setSearchQuery(val);
    const params = new URLSearchParams(searchParams);
    if (val.trim()) params.set("q", val.trim());
    else params.delete("q");
    setSearchParams(params);
  };

  const submitPreview = (c: any) => {
    setActivePreview({
      componentId: c.componentId,
      sectionName: c.detail?.name || c.componentId,
      url: `/preview?sectionId=${encodeURIComponent(c.componentId)}&shop=${encodeURIComponent(shopDomain)}`,
    });
    setPreviewModalOpen(true);
  };

  const submitInstall = (c: any, targetTheme: "draft" | "live" = "draft") => {
    fetcher.submit(
      {
        intent: "install",
        componentId: c.componentId,
        liquidPath: c.liquidPath,
        sectionType: c.sectionType,
        sectionName: c.detail?.name || c.componentId,
        targetChoice: activeTarget,
        targetThemeChoice: targetTheme,
      },
      { method: "post" }
    );
  };

  const submitLandingPreview = (lp: LandingPageDefinition) => {
    setActivePreview({
      isLandingPage: true,
      landingPageId: lp.id,
      sectionName: lp.name,
      url: `/preview?id=${encodeURIComponent(lp.id)}&shop=${encodeURIComponent(shopDomain)}`,
    });
    setPreviewModalOpen(true);
  };

  const submitLandingInstall = (lp: LandingPageDefinition, targetTheme: "draft" | "live" = "draft") => {
    fetcher.submit(
      {
        intent: "install-landing-page",
        landingPageId: lp.id,
        targetThemeChoice: targetTheme,
      },
      { method: "post" }
    );
  };

  const themeEditorUrl = `https://${shopDomain}/admin/themes/current/editor`;

  return (
    <Page
      fullWidth
      title="Converflow Studio"
      subtitle="Crafting 1000cr storefront sections with zero-defect Liquid code and live interactive preview."
      primaryAction={{
        content: "Open Theme Editor ↗",
        url: themeEditorUrl,
        external: true,
      }}
      secondaryActions={[
        {
          content: "Theme Assets",
          url: "/app/theme",
        },
        {
          content: "Full Page Kits",
          url: "/app/pagekit",
        },
      ]}
    >
      <BlockStack gap="400">
        {/* Section Success Banner */}
        {data?.ok && data.intent === "install" && (
          <Banner
            tone="success"
            title={`🎉 Section Added: ${data.sectionName || data.componentId}`}
          >
            <BlockStack gap="200">
              <Text as="p">
                {data.isDraftTheme
                  ? `Successfully installed into your safe Draft Theme (${data.themeName}) on the ${data.targetLabel}. Your live store was not touched!`
                  : `Successfully added to your live theme on the ${data.targetLabel}. All Liquid code, styles, and settings are ready to customize.`}
              </Text>
              <InlineStack gap="300">
                <Button variant="primary" url={data.previewUrl || themeEditorUrl} external>
                  Preview Changes
                </Button>
                <Button url={data.editorUrl || themeEditorUrl} external>
                  Customize in Theme Editor
                </Button>
                <Button url="/app/theme">
                  View My Added Sections
                </Button>
              </InlineStack>
            </BlockStack>
          </Banner>
        )}

        {/* Landing Page Success Banner */}
        {data?.ok && data.intent === "install-landing-page" && (
          <Banner
            tone="success"
            title={`🎉 Shopify Landing Page Installed: ${data.pageName}`}
          >
            <BlockStack gap="200">
              <Text as="p">
                {data.isDraftTheme
                  ? `Successfully generated native Shopify template "${data.templateKey}" with ${data.sectionCount} custom sections in your safe Draft Theme (${data.themeName}). Your live store was not touched!`
                  : `Successfully published native Shopify template "${data.templateKey}" with ${data.sectionCount} custom sections directly into your live theme.`}
              </Text>
              <InlineStack gap="300">
                <Button variant="primary" url={data.editorUrl || themeEditorUrl} external>
                  Customize in Shopify Theme Editor ↗
                </Button>
                {data.previewUrl && (
                  <Button url={data.previewUrl} external>
                    Preview Draft Page ↗
                  </Button>
                )}
                <Button url="/app/theme">
                  View Added Theme Assets
                </Button>
              </InlineStack>
            </BlockStack>
          </Banner>
        )}

        {/* Error Banner with 401 Reconnect Flow */}
        {data?.error && (
          data.error.includes("401") || data.error.includes("Invalid API key") || data.error.includes("access token") ? (
            <Banner
              tone="warning"
              title="⚡ Reconnect Store Needed (Session Expired)"
              action={{
                content: "⚡ Reconnect Store Now",
                url: `/auth?shop=${encodeURIComponent(shopDomain)}`,
                target: "_top",
              }}
            >
              <p>
                The Shopify Theme API access token for <strong>{shopDomain}</strong> is expired or needs permission refresh. Click <strong>Reconnect Store Now</strong> above to re-authorize in 1 click and install your sections seamlessly.
              </p>
            </Banner>
          ) : (
            <Banner tone="critical" title="Could not complete action">
              <p>{data.error}</p>
            </Banner>
          )
        )}

        {/* ── Minimalist Studio Master Layout (Sidebar + Workspace) ── */}
        <div className="cf-pagefly-layout">
          {/* ── Minimalist Left Navigation Rail ── */}
          <aside className="cf-pagefly-sidebar">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", paddingBottom: "10px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#0f172a", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800" }}>
                  💎
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>Converflow</div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>1000cr Architecture</div>
                </div>
              </div>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "#059669", background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "1px 6px", borderRadius: "999px" }}>
                Active
              </span>
            </div>

            {/* Navigation Sections */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <div style={{ fontSize: "10px", fontWeight: "800", color: "#94a3b8", letterSpacing: "0.5px", marginBottom: "6px", paddingLeft: "6px" }}>
                  FLAGSHIP SUITE
                </div>
                <button
                  type="button"
                  onClick={() => handleCategoryChange("1000cr-elite")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    borderRadius: "7px",
                    border: "none",
                    background: category === "1000cr-elite" ? "#0f172a" : "transparent",
                    color: category === "1000cr-elite" ? "#ffffff" : "#334155",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.12s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (category !== "1000cr-elite") e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    if (category !== "1000cr-elite") e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px" }}>✨</span>
                    <span style={{ fontSize: "12px", fontWeight: category === "1000cr-elite" ? 700 : 500 }}>
                      1000cr Flagship Suite
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: "999px",
                      background: category === "1000cr-elite" ? "rgba(255, 255, 255, 0.2)" : "#f1f5f9",
                      color: category === "1000cr-elite" ? "#ffffff" : "#64748b",
                    }}
                  >
                    1 Active
                  </span>
                </button>
              </div>

              {/* Collapsible Legacy Sections Archive */}
              <div style={{ paddingTop: "8px", borderTop: "1px solid #f1f5f9" }}>
                <button
                  type="button"
                  onClick={() => setLegacyOpen(!legacyOpen)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    background: legacyOpen ? "#f8fafc" : "#ffffff",
                    color: "#64748b",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: "600",
                    transition: "all 0.12s ease",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>📦</span>
                    <span>Legacy Archive (120+)</span>
                  </span>
                  <span style={{ fontSize: "9px" }}>{legacyOpen ? "▲" : "▼"}</span>
                </button>

                {legacyOpen && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "6px" }}>
                    {CATEGORY_GROUPS[1]?.items.map((cat) => {
                      const isActive = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategoryChange(cat.id)}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "6px 8px",
                            borderRadius: "5px",
                            border: "none",
                            background: isActive ? "#f1f5f9" : "transparent",
                            color: isActive ? "#0f172a" : "#64748b",
                            cursor: "pointer",
                            textAlign: "left",
                            fontSize: "11px",
                            fontWeight: isActive ? 700 : 500,
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontSize: "12px" }}>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </span>
                          <span style={{ fontSize: "10px", color: "#94a3b8" }}>{cat.count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Utilities */}
              <div style={{ paddingTop: "8px", borderTop: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: "10px", fontWeight: "800", color: "#94a3b8", letterSpacing: "0.5px", marginBottom: "6px", paddingLeft: "6px" }}>
                  UTILITIES
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <a
                    href="/app/theme"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      color: "#475569",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    <span>🛡️</span> Theme Assets
                  </a>
                  <a
                    href="/app/builder"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      color: "#475569",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    <span>🎨</span> Custom Builder
                  </a>
                  <a
                    href="/app/pagekit"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      color: "#475569",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    <span>🚀</span> Full Page Kits
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Right Content Area ── */}
          <div className="cf-pagefly-content">
            {/* Unified Minimal Search & Placement Toolbar */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "12px 16px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "240px" }}>
                  <TextField
                    label="Search"
                    labelHidden
                    placeholder={
                      isLandingPageCategory
                        ? "Search landing pages by brand, niche..."
                        : "Search sections by name, feature (e.g. swatches, sticky atc, pincode)..."
                    }
                    value={searchQuery}
                    onChange={handleSearchSubmit}
                    clearButton
                    onClearButtonClick={() => handleSearchSubmit("")}
                    autoComplete="off"
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", whiteSpace: "nowrap" }}>
                    Target:
                  </span>
                  <div style={{ width: "175px" }}>
                    <Select
                      label="Target page"
                      labelHidden
                      options={[
                        { label: "Smart Placement", value: "auto" },
                        { label: "Homepage (index.json)", value: "index" },
                        { label: "Product Page (product.json)", value: "product" },
                      ]}
                      value={activeTarget}
                      onChange={setActiveTarget}
                      disabled={isLandingPageCategory}
                    />
                  </div>
                </div>

                <div style={{ fontSize: "12px", color: "#475569", fontWeight: "600", whiteSpace: "nowrap" }}>
                  {isLandingPageCategory ? (
                    <span>Showing <strong>{landingPages.length}</strong> Landing Pages</span>
                  ) : (
                    <span>
                      Showing <strong>{components.length}</strong> {category === "1000cr-elite" ? "Flagship Section" : "sections"}
                    </span>
                  )}
                </div>
              </div>

              {/* Minimal Niche Filter Chips - Only shown for legacy archive / landing pages */}
              {category !== "1000cr-elite" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexWrap: "wrap",
                    paddingTop: "10px",
                    borderTop: "1px solid #f1f5f9",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginRight: "4px",
                    }}
                  >
                    Niche:
                  </span>
                  {NICHE_FILTERS.map((nf) => {
                    const isActive = niche === nf.id || (niche === "" && nf.id === "all");
                    return (
                      <button
                        key={nf.id}
                        type="button"
                        onClick={() => handleNicheChange(nf.id)}
                        style={{
                          border: isActive ? "1px solid #0284c7" : "1px solid #e2e8f0",
                          background: isActive ? "#f0f9ff" : "#ffffff",
                          color: isActive ? "#0284c7" : "#475569",
                          borderRadius: "999px",
                          padding: "3px 10px",
                          fontSize: "11px",
                          fontWeight: isActive ? "700" : "500",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {nf.label}
                      </button>
                    );
                  })}
                  {niche !== "all" && (
                    <button
                      type="button"
                      onClick={() => handleNicheChange("all")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#e11d48",
                        fontSize: "11px",
                        fontWeight: "600",
                        cursor: "pointer",
                        textDecoration: "underline",
                        marginLeft: "6px",
                      }}
                    >
                      Clear niche
                    </button>
                  )}
                </div>
              )}
            </div>

        {/* CSS for Bento & Landing Page Grids & PageFly Studio Layout */}
        <style>{`
          .cf-pagefly-layout {
            display: flex;
            gap: 20px;
            align-items: flex-start;
            width: 100%;
          }
          .cf-pagefly-sidebar {
            width: 250px;
            flex-shrink: 0;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 14px 10px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
            position: sticky;
            top: 14px;
            box-sizing: border-box;
          }
          .cf-pagefly-content {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          @media (max-width: 1024px) {
            .cf-pagefly-layout {
              flex-direction: column;
            }
            .cf-pagefly-sidebar {
              width: 100%;
              position: static;
            }
          }
          .cf-bento-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }
          @media (max-width: 1280px) {
            .cf-bento-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }
          @media (max-width: 768px) {
            .cf-bento-grid {
              grid-template-columns: 1fr;
            }
          }
          .cf-bento-card {
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            overflow: hidden;
            background: #ffffff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
            transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
            display: flex;
            flex-direction: column;
            position: relative;
          }
          .cf-bento-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 22px -4px rgba(0, 0, 0, 0.08);
            border-color: #cbd5e1;
          }
          .cf-bento-featured {
            grid-column: span 2;
          }
          .cf-elite-card {
            grid-column: 1 / -1;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
            border: 1px solid #e2e8f0;
          }
          @media (max-width: 768px) {
            .cf-bento-featured {
              grid-column: span 1;
            }
          }

          /* Landing Page Grid & Cards */
          .cf-landing-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px;
          }
          @media (max-width: 1024px) {
            .cf-landing-grid {
              grid-template-columns: 1fr;
            }
          }
          .cf-landing-card {
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            overflow: hidden;
            background: #ffffff;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
            transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.24s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.24s ease;
            display: flex;
            flex-direction: column;
            position: relative;
          }
          .cf-landing-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 24px 45px -10px rgba(0, 0, 0, 0.14);
            border-color: #0284c7;
          }
          .cf-landing-hover-overlay {
            position: absolute;
            inset: 0;
            background: rgba(15, 23, 42, 0.35);
            backdrop-filter: blur(2px);
            opacity: 0;
            transition: opacity 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
          }
          .cf-landing-card:hover .cf-landing-hover-overlay {
            opacity: 1;
          }
        `}</style>

        {/* ── Main Content Grid ── */}
        {isLandingPageCategory ? (
          landingPages.length === 0 ? (
            <Card>
              <EmptyState
                heading="No matching landing pages found"
                action={{
                  content: "Reset Search",
                  onAction: () => {
                    setSearchQuery("");
                    setSearchParams({ category: "landing-page" });
                  },
                }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2760/files/emptystate-files.png"
              >
                <p>Try searching for a different keyword like "skincare", "streetwear", "coffee", or "audio".</p>
              </EmptyState>
            </Card>
          ) : (
            <div className="cf-landing-grid">
              {landingPages.map((lp) => {
                const isThisInstalling = isInstallingLanding && fetcher.formData?.get("landingPageId") === lp.id;
                return (
                  <LandingPageCard
                    key={lp.id}
                    landingPage={lp}
                    shopDomain={shopDomain}
                    isInstalling={isThisInstalling}
                    onPreview={() => submitLandingPreview(lp)}
                    onInstallDraft={() => submitLandingInstall(lp, "draft")}
                    onInstallLive={() => submitLandingInstall(lp, "live")}
                  />
                );
              })}
            </div>
          )
        ) : components.length === 0 ? (
          <Card>
            <EmptyState
              heading="No matching sections found"
              action={{
                content: "Reset Filters",
                onAction: () => {
                  setSearchQuery("");
                  setSearchParams({ category: "all" });
                },
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2760/files/emptystate-files.png"
            >
              <p>Try searching for a different keyword or choose another category.</p>
            </EmptyState>
          </Card>
        ) : (
          <div className="cf-bento-grid">
            {components.map((c, idx) => {
              const isHero = c.sectionType === "hero" || c.sectionType?.includes("hero");
              const isFeatured = isHero || (idx % 7 === 0);
              const isThisInstalling = installingId === c.componentId;
              const isThisPreviewing = previewingId === c.componentId;

              return (
                <BentoSectionCard
                  key={c.componentId}
                  component={c}
                  shopDomain={shopDomain}
                  isFeatured={isFeatured}
                  isInstalling={isThisInstalling}
                  isPreviewing={isThisPreviewing}
                  onPreview={() => submitPreview(c)}
                  onInstallDraft={() => submitInstall(c, "draft")}
                  onInstallLive={() => submitInstall(c, "live")}
                />
              );
            })}
          </div>
        )}
          </div>
        </div>

        {/* ── PageFly-Style Section Preview & Submit Modal ── */}
        {activePreview && (
          <Modal
            open={previewModalOpen}
            onClose={() => setPreviewModalOpen(false)}
            title={
              activePreview.isLandingPage
                ? `Storefront Preview: ${activePreview.sectionName}`
                : `Preview: ${activePreview.sectionName || activePreview.componentId}`
            }
            size="large"
          >
            <Modal.Section flush>
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
                        pressed={sectionDevice === "desktop"}
                        onClick={() => setSectionDevice("desktop")}
                      >
                        🖥️ Desktop
                      </Button>
                      <Button
                        size="slim"
                        pressed={sectionDevice === "laptop"}
                        onClick={() => setSectionDevice("laptop")}
                      >
                        💻 Laptop
                      </Button>
                      <Button
                        size="slim"
                        pressed={sectionDevice === "tablet"}
                        onClick={() => setSectionDevice("tablet")}
                      >
                        💻 Tablet
                      </Button>
                      <Button
                        size="slim"
                        pressed={sectionDevice === "mobile"}
                        onClick={() => setSectionDevice("mobile")}
                      >
                        📱 Mobile
                      </Button>
                    </InlineStack>

                    {/* Direct Submission Buttons inside top toolbar */}
                    <InlineStack gap="200" blockAlign="center">
                      <Button
                        size="slim"
                        url={activePreview.url}
                        target="_blank"
                        onClick={() => {
                          if (typeof window !== "undefined" && activePreview?.url) {
                            window.open(activePreview.url, "_blank", "noopener,noreferrer");
                          }
                        }}
                      >
                        Open Full Screen ↗
                      </Button>

                      {activePreview?.isLandingPage ? (
                        <>
                          <Button
                            size="slim"
                            variant="primary"
                            loading={isInstallingLanding && fetcher.formData?.get("targetThemeChoice") === "draft"}
                            disabled={busy}
                            onClick={() => {
                              const lp = landingPages.find((x) => x.id === activePreview.landingPageId);
                              if (lp) submitLandingInstall(lp, "draft");
                            }}
                          >
                            🛡️ Add Page to Draft Theme
                          </Button>

                          <Button
                            size="slim"
                            loading={isInstallingLanding && fetcher.formData?.get("targetThemeChoice") === "live"}
                            disabled={busy}
                            onClick={() => {
                              const lp = landingPages.find((x) => x.id === activePreview.landingPageId);
                              if (lp) submitLandingInstall(lp, "live");
                            }}
                          >
                            ⚡ Add Page to Live Theme
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="slim"
                            variant="primary"
                            loading={isInstalling && fetcher.formData?.get("targetThemeChoice") === "draft"}
                            disabled={busy}
                            onClick={() => {
                              const c = components.find((x) => x.componentId === activePreview.componentId);
                              if (c) submitInstall(c, "draft");
                            }}
                          >
                            🛡️ Submit to Draft Theme
                          </Button>

                          <Button
                            size="slim"
                            loading={isInstalling && fetcher.formData?.get("targetThemeChoice") === "live"}
                            disabled={busy}
                            onClick={() => {
                              const c = components.find((x) => x.componentId === activePreview.componentId);
                              if (c) submitInstall(c, "live");
                            }}
                          >
                            ⚡ Submit to Live Theme
                          </Button>
                        </>
                      )}
                    </InlineStack>
                  </InlineStack>
                </Box>

                {/* Status Feedback Banner inside Preview Modal (Section) */}
                {data?.ok && data.intent === "install" && data.componentId === activePreview.componentId && (
                  <Box padding="300" background="bg-surface-success">
                    <InlineStack align="space-between" blockAlign="center" wrap>
                      <Text as="p" variant="bodyMd" fontWeight="semibold">
                        🎉 Successfully installed to {data.themeName} ({data.targetLabel})!
                      </Text>
                      <InlineStack gap="200">
                        {data.previewUrl && (
                          <Button url={data.previewUrl} target="_blank" size="slim">
                            Preview in Draft Theme
                          </Button>
                        )}
                        <Button url={data.editorUrl} target="_blank" size="slim" variant="primary">
                          Customize in Theme Editor
                        </Button>
                        <Button url="/app/theme" size="slim">
                          View My Added Sections
                        </Button>
                      </InlineStack>
                    </InlineStack>
                  </Box>
                )}

                {/* Status Feedback Banner inside Preview Modal (Landing Page) */}
                {data?.ok && data.intent === "install-landing-page" && data.landingPageId === activePreview.landingPageId && (
                  <Box padding="300" background="bg-surface-success">
                    <InlineStack align="space-between" blockAlign="center" wrap>
                      <Text as="p" variant="bodyMd" fontWeight="semibold">
                        🎉 Successfully created template "{data.templateKey}" with {data.sectionCount} custom sections on {data.themeName}!
                      </Text>
                      <InlineStack gap="200">
                        {data.previewUrl && (
                          <Button url={data.previewUrl} target="_blank" size="slim">
                            Preview in Draft Theme
                          </Button>
                        )}
                        <Button url={data.editorUrl} target="_blank" size="slim" variant="primary">
                          Customize in Theme Editor
                        </Button>
                        <Button url="/app/theme" size="slim">
                          View My Added Sections
                        </Button>
                      </InlineStack>
                    </InlineStack>
                  </Box>
                )}

                {/* Responsive Viewport Frame */}
                <div style={{
                  background: "#0F172A",
                  padding: sectionDevice === "mobile" ? "24px 0" : sectionDevice === "tablet" ? "16px 0" : sectionDevice === "laptop" ? "12px 0" : "0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "68vh",
                  overflow: "hidden"
                }}>
                  <iframe
                    title="Section Live Preview"
                    src={activePreview.url}
                    style={{
                      width: sectionDevice === "mobile" ? "390px" : sectionDevice === "tablet" ? "768px" : sectionDevice === "laptop" ? "1024px" : "100%",
                      height: "70vh",
                      border: sectionDevice === "mobile" ? "8px solid #1E293B" : sectionDevice === "tablet" ? "4px solid #334155" : sectionDevice === "laptop" ? "3px solid #475569" : "0",
                      borderRadius: sectionDevice === "mobile" ? "28px" : sectionDevice === "tablet" ? "12px" : sectionDevice === "laptop" ? "8px" : "0",
                      boxShadow: sectionDevice !== "desktop" ? "0 25px 50px -12px rgba(0, 0, 0, 0.6)" : "none",
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
                      ⚡ Live store preview. Shoppers won't see changes until you submit.
                    </Text>
                    <Button onClick={() => setPreviewModalOpen(false)}>
                      Close Preview
                    </Button>
                  </InlineStack>
                </Box>
              </BlockStack>
            </Modal.Section>
          </Modal>
        )}
      </BlockStack>
    </Page>
  );
}
