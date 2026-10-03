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

// ── Premium Minimalist Vector Icons (1000cr Aesthetic, Zero Emojis) ──
function IconGem({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="6 3 18 3 22 9 12 22 2 9 6 3" />
      <polyline points="12 22 7 9 12 3 17 9 12 22" />
      <line x1="2" y1="9" x2="22" y2="9" />
    </svg>
  );
}

function IconSparkle({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3v18M3 12h18M6.5 6.5l11 11M6.5 17.5l11-11" />
    </svg>
  );
}

function IconBox({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function IconRocket({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-2 5-2" />
      <path d="M12 15v5s3.03-.55 4.5-2c1.63-1.62 2-5 2-5" />
    </svg>
  );
}

function IconLayers({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconFileText({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function IconCart({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function IconZap({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconTarget({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconMegaphone({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

function IconTag({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function IconShield({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconPalette({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

function IconEye({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconMonitor({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function IconLaptop({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

function IconTablet({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function IconSmartphone({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function renderNavIcon(iconKey: string, size = 14) {
  switch (iconKey) {
    case "flagship":
      return <IconGem size={size} />;
    case "archive":
      return <IconBox size={size} />;
    case "rocket":
      return <IconRocket size={size} />;
    case "file":
      return <IconFileText size={size} />;
    case "cart":
      return <IconCart size={size} />;
    case "zap":
      return <IconZap size={size} />;
    case "target":
      return <IconTarget size={size} />;
    case "announcement":
      return <IconMegaphone size={size} />;
    case "tag":
      return <IconTag size={size} />;
    case "layers":
      return <IconLayers size={size} />;
    default:
      return <IconBox size={size} />;
  }
}

const CATEGORIES = [
  { id: "1000cr-elite", label: "1000cr Flagship Suite (4 PDP Buy Boxes)" },
  { id: "legacy-all", label: "Legacy Archive (All)" },
  { id: "landing-page", label: "Landing Pages (D2C Home) (12)" },
  { id: "product-page", label: "Legacy PDP Variations (88)" },
  { id: "cart-drawer", label: "Cart & Slide Drawers (20)" },
  { id: "urgency", label: "Emergency & Urgency Boosters (5)" },
  { id: "hero", label: "Hero Banners (15)" },
  { id: "announcement", label: "Announcement Bars (10)" },
  { id: "product-card", label: "Product Cards & Grids (12)" },
  { id: "header", label: "Headers (10)" },
  { id: "footer", label: "Footers (10)" },
];

const CATEGORY_GROUPS = [
  {
    title: "FLAGSHIP ARCHITECTURE",
    items: [
      { id: "1000cr-elite", label: "1000cr Flagship Suite", iconKey: "flagship", count: "4 Active", desc: "Elite Conversion PDP Buy Boxes" },
    ],
  },
  {
    title: "LEGACY ARCHIVE",
    items: [
      { id: "legacy-all", label: "All Legacy Sections", iconKey: "archive", count: "120+", desc: "Old Section Library" },
      { id: "landing-page", label: "Home Landing Pages", iconKey: "rocket", count: "12", desc: "Complete D2C Home Stores" },
      { id: "product-page", label: "Legacy PDP Variations", iconKey: "file", count: "88", desc: "Old PDP Variations" },
      { id: "cart-drawer", label: "Cart & Slide Drawers", iconKey: "cart", count: "20", desc: "Drawers with Upsells" },
      { id: "urgency", label: "Urgency & Scarcity", iconKey: "zap", count: "5", desc: "Emergency Sales Boosters" },
      { id: "hero", label: "Hero Banners", iconKey: "target", count: "15", desc: "Visual Banners" },
      { id: "announcement", label: "Announcement Bars", iconKey: "announcement", count: "10", desc: "Tickers & Marquees" },
      { id: "product-card", label: "Product Cards & Grids", iconKey: "tag", count: "12", desc: "Collections & Swatches" },
      { id: "header", label: "Headers & Navbars", iconKey: "layers", count: "10", desc: "Navigation" },
      { id: "footer", label: "Footers", iconKey: "layers", count: "10", desc: "Trust & Legal Links" },
    ],
  },
];

const NICHE_FILTERS = [
  { id: "all", label: "All Niches" },
  { id: "streetwear", label: "Streetwear & Apparel" },
  { id: "beauty", label: "Beauty & Skincare" },
  { id: "luxury", label: "Luxury & Jewelry" },
  { id: "tech", label: "Tech & Audio" },
  { id: "wellness", label: "Health & Wellness" },
  { id: "coffee", label: "Food & Beverage" },
  { id: "dropship", label: "High-CRO Funnels" },
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

      const isPdp = sectionType === "product-page" || sectionType.startsWith("pdp") || componentId.includes("-pdp") || componentId.startsWith("pdp") || componentId.startsWith("elite-pdp") || sectionType.startsWith("product-card");
      const isCart = sectionType === "cart-drawer" || componentId.startsWith("cdr");
      const isUrgency = sectionType === "urgency" || componentId.startsWith("urgency");

      const target =
        sectionType === "header" || sectionType.startsWith("header")
          ? ({ kind: "group", group: "header", replace: "header" } as const)
          : sectionType === "footer" || sectionType.startsWith("footer")
            ? ({ kind: "group", group: "footer", replace: "footer" } as const)
            : targetChoice === "product" || (targetChoice === "auto" && isPdp) || (!targetChoice && isPdp)
              ? ({ kind: "template", template: "product", position: "top" } as const)
              : isCart
                ? ({ kind: "template", template: "index", position: "bottom" } as const)
                : isUrgency
                  ? (componentId.includes("sticky") || componentId.includes("stock")
                      ? ({ kind: "template", template: "product", position: "top" } as const)
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

      const isPdp = sectionType === "product-page" || sectionType.startsWith("pdp") || componentId.includes("-pdp") || componentId.startsWith("pdp") || componentId.startsWith("elite-pdp") || sectionType.startsWith("product-card");
      const isCart = sectionType === "cart-drawer" || componentId.startsWith("cdr");
      const isUrgency = sectionType === "urgency" || componentId.startsWith("urgency");

      let target: any;
      if (sectionType === "header" || sectionType.startsWith("header")) {
        target = { kind: "group", group: "header", replace: "header" };
      } else if (sectionType === "footer" || sectionType.startsWith("footer")) {
        target = { kind: "group", group: "footer", replace: "footer" };
      } else if (targetChoice === "product" || (targetChoice === "auto" && isPdp) || (!targetChoice && isPdp)) {
        target = { kind: "template", template: "product", position: "top" };
      } else if (isCart) {
        target = { kind: "template", template: "index", position: "bottom" };
      } else if (isUrgency) {
        if (componentId.includes("sticky") || componentId.includes("stock")) {
          target = { kind: "template", template: "product", position: "top" };
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

  const isElite = component.category === "1000cr-elite" || component.componentId.startsWith("elite-") || component.componentId.startsWith("atelier-") || component.componentId.startsWith("clinical-") || component.componentId.startsWith("titan-");
  const name = component.detail?.name || (isElite ? (component.name || component.componentId.replace(/[-_]/g, " ")) : component.componentId.replace(/[-_]/g, " "));
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
              flexShrink: 0,
            }}
          >
            {isElite ? <IconGem size={15} /> : <IconBox size={15} />}
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
            <IconEye size={14} />
            <span>Open Live Preview Studio</span>
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
            <IconEye size={13} />
            <span>Studio Preview</span>
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
            <IconShield size={13} />
            <span>Test in Draft</span>
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
            <IconZap size={13} />
            <span>Add to Live Store</span>
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
            <IconEye size={14} />
            <span>Click for Studio Preview</span>
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
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
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
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: 4 }}><polyline points="20 6 9 17 4 12"/></svg>
              {f}
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "#059669", fontWeight: 700 }}>
            <IconZap size={12} />
            <span>1-Click Shopify Theme Add</span>
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
            <IconEye size={13} />
            <span>Studio Preview</span>
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <IconShield size={12} />
            <span>Add Draft</span>
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              transition: "background 0.15s ease",
            }}
          >
            <IconZap size={12} />
            <span>Add Live</span>
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
            title={`Section Added: ${data.sectionName || data.componentId}`}
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
            title={`Shopify Landing Page Installed: ${data.pageName}`}
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
              title="Reconnect Store Needed (Session Expired)"
              action={{
                content: "Reconnect Store Now",
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
                <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#0f172a", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IconGem size={13} />
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
                    <IconSparkle size={14} />
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
                    4 Active
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
                    <IconBox size={13} />
                    <span>Legacy Archive (120+)</span>
                  </span>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {legacyOpen ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                    )}
                  </span>
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
                            {renderNavIcon((cat as any).iconKey || "archive", 13)}
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
                    <IconShield size={13} />
                    <span>Theme Assets</span>
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
                    <IconPalette size={13} />
                    <span>Custom Builder</span>
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
                    <IconRocket size={13} />
                    <span>Full Page Kits</span>
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
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <IconMonitor size={14} />
                          <span>Desktop</span>
                        </span>
                      </Button>
                      <Button
                        size="slim"
                        pressed={sectionDevice === "laptop"}
                        onClick={() => setSectionDevice("laptop")}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <IconLaptop size={14} />
                          <span>Laptop</span>
                        </span>
                      </Button>
                      <Button
                        size="slim"
                        pressed={sectionDevice === "tablet"}
                        onClick={() => setSectionDevice("tablet")}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <IconTablet size={14} />
                          <span>Tablet</span>
                        </span>
                      </Button>
                      <Button
                        size="slim"
                        pressed={sectionDevice === "mobile"}
                        onClick={() => setSectionDevice("mobile")}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <IconSmartphone size={14} />
                          <span>Mobile</span>
                        </span>
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
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                              <IconShield size={13} />
                              <span>Add Page to Draft Theme</span>
                            </span>
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
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                              <IconZap size={13} />
                              <span>Add Page to Live Theme</span>
                            </span>
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
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                              <IconShield size={13} />
                              <span>Submit to Draft Theme</span>
                            </span>
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
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                              <IconZap size={13} />
                              <span>Submit to Live Theme</span>
                            </span>
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
                        Successfully installed to {data.themeName} ({data.targetLabel})!
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
                        Successfully created template "{data.templateKey}" with {data.sectionCount} custom sections on {data.themeName}!
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
                      Live store preview. Shoppers won't see changes until you submit.
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
