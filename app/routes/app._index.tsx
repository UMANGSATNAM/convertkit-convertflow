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
  { id: "all", label: "All Sections (37)" },
  { id: "landing-page", label: "Landing Pages (11) 🔥" },
  { id: "announcement", label: "Announcement Bars (2)" },
  { id: "hero", label: "Hero Banners (5)" },
  { id: "product-page", label: "PDP & Sticky ATC (5)" },
  { id: "offer", label: "Offer & Poster Banners (5)" },
  { id: "categories", label: "Category & Collections (5)" },
  { id: "product-card", label: "Product Cards (5)" },
  { id: "header", label: "Headers (5)" },
  { id: "footer", label: "Footers (5)" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || "all";
  const q = (url.searchParams.get("q") || "").trim();

  const shop = await getOrSyncShop(session.shop, session.accessToken);

  const isLandingPageCategory = category === "landing-page";

  let filteredLandingPages: LandingPageDefinition[] = [];
  if (isLandingPageCategory) {
    filteredLandingPages = q
      ? D2C_LANDING_PAGES.filter(
          (lp) =>
            lp.name.toLowerCase().includes(q.toLowerCase()) ||
            lp.nicheLabel.toLowerCase().includes(q.toLowerCase()) ||
            lp.tagline.toLowerCase().includes(q.toLowerCase()) ||
            lp.description.toLowerCase().includes(q.toLowerCase()) ||
            lp.conversionFeatures.some((f) => f.toLowerCase().includes(q.toLowerCase()))
        )
      : D2C_LANDING_PAGES;

    return json({
      shopDomain: session.shop,
      category,
      q,
      totalCount: filteredLandingPages.length,
      components: [],
      landingPages: filteredLandingPages,
      isLandingPageCategory: true,
    });
  }

  // Build where clause according to category and search
  const where: any = { status: "PUBLISHED" };

  if (category && category !== "all") {
    where.category = category;
  }

  if (q) {
    where.AND = [
      {
        OR: [
          { componentId: { contains: q } },
          { family: { contains: q } },
          { visualStyle: { contains: q } },
          { category: { contains: q } },
        ],
      },
    ];
  }

  const [components, totalCount] = await Promise.all([
    prisma.componentRegistry.findMany({
      where,
      orderBy: { componentId: "asc" },
      take: 80,
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

      const target =
        sectionType === "header" || sectionType.startsWith("header")
          ? ({ kind: "group", group: "header", replace: "header" } as const)
          : sectionType === "footer" || sectionType.startsWith("footer")
            ? ({ kind: "group", group: "footer", replace: "footer" } as const)
            : targetChoice === "product" || (!targetChoice && (sectionType === "product-page" || sectionType.startsWith("pdp") || sectionType.startsWith("product-card")))
              ? ({ kind: "template", template: "product", position: "bottom" } as const)
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

      let target: any;
      if (sectionType === "header" || sectionType.startsWith("header")) {
        target = { kind: "group", group: "header", replace: "header" };
      } else if (sectionType === "footer" || sectionType.startsWith("footer")) {
        target = { kind: "group", group: "footer", replace: "footer" };
      } else if (targetChoice === "product" || (!targetChoice && (sectionType === "product-page" || sectionType.startsWith("pdp") || sectionType.startsWith("product-card")))) {
        target = { kind: "template", template: "product", position: "bottom" };
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

  const name = component.detail?.name || component.componentId.replace(/[-_]/g, " ");
  const settingsCount = component.detail?.settings?.length || 0;
  const previewUrl = `/preview?sectionId=${encodeURIComponent(component.componentId)}&shop=${encodeURIComponent(shopDomain)}&embed=1`;
  const containerHeight = isFeatured ? 290 : 210;

  return (
    <div className={`cf-bento-card ${isFeatured ? "cf-bento-featured" : ""}`}>
      {/* Top Browser Window Chrome */}
      <div
        style={{
          height: 34,
          background: "#0f172a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: "#ef4444" }} />
          <span style={{ width: 7, height: 7, borderRadius: 99, background: "#f59e0b" }} />
          <span style={{ width: 7, height: 7, borderRadius: 99, background: "#10b981" }} />
          <span
            style={{
              marginLeft: 8,
              fontSize: 10,
              fontWeight: 800,
              color: "#38bdf8",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {component.sectionType}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#94a3b8",
              fontFamily: "monospace",
              background: "rgba(255, 255, 255, 0.08)",
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            {settingsCount} settings
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#64748b",
              fontFamily: "monospace",
            }}
          >
            {component.componentId}
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
              background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
            }}
          >
            <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Loading live preview…</span>
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
            gap: 10,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.2s ease",
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: "#0284c7",
              color: "#ffffff",
              padding: "7px 18px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 8px 20px rgba(2, 132, 199, 0.4)",
            }}
          >
            👁️ Open Live Preview Studio
          </div>
          <span style={{ fontSize: 11, color: "#cbd5e1", fontWeight: 500 }}>
            Click to test viewports & 1-click submit
          </span>
        </div>
      </div>

      {/* Card Info & Quick Actions Footer */}
      <div style={{ padding: "12px 14px", background: "#ffffff", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <h3
              onClick={onPreview}
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.3,
                cursor: "pointer",
              }}
            >
              {name}
            </h3>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
            {component.visualStyle && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#059669",
                  background: "#ecfdf5",
                  padding: "2px 6px",
                  borderRadius: 4,
                  textTransform: "uppercase",
                }}
              >
                {component.visualStyle}
              </span>
            )}
            {component.family && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#475569",
                  background: "#f1f5f9",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                {component.family}
              </span>
            )}
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#6b7280",
                background: "#f3f4f6",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              Shopify 2.0 Native
            </span>
          </div>
        </div>

        {/* Action Button Strip */}
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          <button
            type="button"
            onClick={onPreview}
            disabled={isPreviewing}
            style={{
              flex: 1,
              background: "#0284c7",
              color: "#ffffff",
              border: "none",
              padding: "7px 10px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            👁️ Preview
          </button>
          <button
            type="button"
            onClick={onInstallDraft}
            disabled={isInstalling}
            title="Safe install to private preview theme"
            style={{
              background: "#f1f5f9",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              padding: "7px 10px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            🛡️ Draft
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
              padding: "7px 10px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            ⚡ Live
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
              background: "#0284c7",
              color: "#ffffff",
              border: "none",
              padding: "9px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
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
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              padding: "9px 10px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
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
              padding: "9px 10px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
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
  const { shopDomain, category, q, totalCount, components, landingPages, isLandingPageCategory } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<any>();

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activePreview, setActivePreview] = useState<any>(null);
  const [activeTarget, setActiveTarget] = useState<string>("auto");
  const [searchQuery, setSearchQuery] = useState(q);
  const [sectionDevice, setSectionDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

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
      title="Section Store"
      subtitle="Browse verified, production-grade Shopify 2.0 sections & 10 complete D2C landing pages. Preview live and add directly to your theme with 1 click."
      primaryAction={{
        content: "Open Theme Editor",
        url: themeEditorUrl,
        external: true,
      }}
      secondaryActions={[
        {
          content: "Full Page Kits",
          url: "/app/pagekit",
        },
        {
          content: "My Added Sections",
          url: "/app/theme",
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

        {/* Search & Placement Controls */}
        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between" blockAlign="center" gap="400">
              <Box minWidth="320px">
                <TextField
                  label="Search sections and landing pages"
                  labelHidden
                  placeholder={
                    isLandingPageCategory
                      ? "Search by brand, niche (e.g. skincare, streetwear, jewelry, audio)..."
                      : "Search by name, feature (e.g. hero, sticky, faq, reviews)..."
                  }
                  value={searchQuery}
                  onChange={handleSearchSubmit}
                  clearButton
                  onClearButtonClick={() => handleSearchSubmit("")}
                  autoComplete="off"
                />
              </Box>
              <InlineStack gap="300" blockAlign="center">
                <Text as="span" tone="subdued">Target Page:</Text>
                <Box minWidth="180px">
                  <Select
                    label="Target page"
                    labelHidden
                    options={[
                      { label: "Smart Placement (Recommended)", value: "auto" },
                      { label: "Homepage (index.json)", value: "index" },
                      { label: "Product Page (product.json)", value: "product" },
                    ]}
                    value={activeTarget}
                    onChange={setActiveTarget}
                    disabled={isLandingPageCategory}
                  />
                </Box>
              </InlineStack>
            </InlineStack>

            <Divider />

            {/* Category Pills */}
            <InlineStack gap="200" wrap>
              {CATEGORIES.map((cat) => {
                const isActive = category === cat.id;
                return (
                  <Button
                    key={cat.id}
                    size="medium"
                    variant={isActive ? "primary" : "secondary"}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    {cat.label}
                  </Button>
                );
              })}
            </InlineStack>
          </BlockStack>
        </Card>

        {/* Count Header */}
        <InlineStack align="space-between" blockAlign="center">
          <Text as="p" tone="subdued">
            {isLandingPageCategory ? (
              <span>
                Showing <strong>{landingPages.length}</strong> Complete D2C Landing Page Stores (11-13 Cohesive Sections Each)
                {q && ` matching "${q}"`}
              </span>
            ) : (
              <span>
                Showing <strong>{components.length}</strong> sections
                {category !== "all" ? ` in ${CATEGORIES.find((c) => c.id === category)?.label}` : " in Section Store"}
                {q && ` matching "${q}"`}
              </span>
            )}
          </Text>
          <Text as="p" tone="subdued">
            Active Store: <strong>{shopDomain}</strong>
          </Text>
        </InlineStack>

        {/* CSS for Bento & Landing Page Grids */}
        <style>{`
          .cf-bento-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 20px;
          }
          @media (max-width: 1200px) {
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
            border-radius: 16px;
            overflow: hidden;
            background: #ffffff;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
            transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s ease;
            display: flex;
            flex-direction: column;
            position: relative;
          }
          .cf-bento-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.12);
            border-color: #0284c7;
          }
          .cf-bento-featured {
            grid-column: span 2;
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
                  padding: sectionDevice === "mobile" ? "24px 0" : sectionDevice === "tablet" ? "16px 0" : "0",
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
                      width: sectionDevice === "mobile" ? "390px" : sectionDevice === "tablet" ? "768px" : "100%",
                      height: "70vh",
                      border: sectionDevice === "mobile" ? "8px solid #1E293B" : sectionDevice === "tablet" ? "4px solid #334155" : "0",
                      borderRadius: sectionDevice === "mobile" ? "28px" : sectionDevice === "tablet" ? "12px" : "0",
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
