import {
  Page,
  Card,
  BlockStack,
  Text,
  Grid,
  Badge,
  Button,
  Tabs,
  InlineStack,
  Spinner,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState, useCallback, useEffect, useRef } from "react";

// ── Loader: fetch shop domain + active theme + product handle ──
export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  let themeId = "";
  let productHandle = "";

  try {
    const themesRes = await admin.graphql(`
      query { themes(first: 10) { edges { node { id name role } } } }
    `);
    const themesData = await themesRes.json();
    const activeTheme = themesData.data.themes.edges.find(
      (e) => e.node.role === "MAIN"
    )?.node;
    themeId = activeTheme?.id?.replace("gid://shopify/OnlineStoreTheme/", "") || "";
  } catch (e) { /* silent */ }

  try {
    const productsRes = await admin.graphql(`
      query { products(first: 1, query: "status:active") { edges { node { handle } } } }
    `);
    const productsData = await productsRes.json();
    productHandle = productsData.data.products.edges[0]?.node?.handle || "";
  } catch (e) { /* silent */ }

  return json({ shopDomain, themeId, productHandle });
};

// ── Section catalog with block file references ──
const PRODUCT_SECTIONS = [
  "inventory-scarcity", "star-rating-summary", "before-after-slider",
  "product-benefits-grid", "tabbed-product-info", "complementary-products",
  "size-guide",
];

const SECTIONS = [
  { name: "Trust Badge Row", slug: "trust-badges", type: "trust", description: "Horizontal row of 10+ trust signal SVG icons" },
  { name: "Stock Scarcity Bar", slug: "inventory-scarcity", type: "conversion", description: "Real inventory count with color-coded progress bar" },
  { name: "Star Rating Summary", slug: "star-rating-summary", type: "trust", description: "Aggregated review score from Shopify, Judge.me, or Okendo" },
  { name: "Before & After Slider", slug: "before-after-slider", type: "product", description: "Touch-enabled drag slider for before/after comparison" },
  { name: "Countdown Timer", slug: "countdown-timer", type: "conversion", description: "Real deadline countdown using requestAnimationFrame" },
  { name: "FAQ Accordion", slug: "faq-accordion", type: "conversion", description: "FAQ section with Schema.org structured data for SEO" },
  { name: "Product Benefits Grid", slug: "product-benefits-grid", type: "product", description: "3/4-column benefits grid with inline SVG icons" },
  { name: "Testimonials Grid", slug: "testimonials-grid", type: "trust", description: "Customer reviews grid with star ratings and avatars" },
  { name: "Email Popup", slug: "email-popup", type: "conversion", description: "Exit-intent or scroll-triggered email capture popup" },
  { name: "Split Layout Hero", slug: "split-hero", type: "hero", description: "Left text + right image with animated entrance" },
  { name: "Video Background Hero", slug: "video-hero", type: "hero", description: "Full-width video background with text overlay and CTA" },
  { name: "Countdown Announcement", slug: "countdown-announce", type: "hero", description: "Slim top bar with live countdown timer and CTA" },
  { name: "Social Proof Bar", slug: "social-proof", type: "hero", description: "Auto-scrolling press logos and certification badges" },
  { name: "USP Icon Grid", slug: "usp-grid", type: "hero", description: "Four-column grid for free shipping, returns, etc." },
  { name: "Ingredients Breakdown", slug: "ingredients", type: "product", description: "Accordion-style section for product ingredients" },
  { name: "Tabbed Product Info", slug: "tabbed-product-info", type: "product", description: "Description, ingredients, how-to-use, FAQ tabs" },
  { name: "Size & Fit Guide", slug: "size-guide", type: "product", description: "Size chart table with cm/inches unit toggle" },
  { name: "Complementary Products", slug: "complementary-products", type: "product", description: "Curated grid with individual add-to-cart buttons" },
  { name: "Press & Media Logos", slug: "press-logos", type: "trust", description: "As-seen-in logos with optional pull quotes" },
  { name: "Customer Photo Reviews", slug: "photo-reviews", type: "trust", description: "Masonry grid of customer photos with ratings" },
  { name: "Real-Time Purchase Notification", slug: "purchase-notif", type: "trust", description: "Toast popup showing recent real orders" },
  { name: "Bulk Discount Tiers", slug: "bulk-discount", type: "conversion", description: "Quantity pricing tiers to encourage larger orders" },
  { name: "Guarantee Section", slug: "guarantee", type: "conversion", description: "Full-width guarantee block with seal and terms" },
];

const TABS = [
  { id: "all", content: `All (${SECTIONS.length})` },
  { id: "hero", content: `Hero (${SECTIONS.filter((s) => s.type === "hero").length})` },
  { id: "product", content: `Product (${SECTIONS.filter((s) => s.type === "product").length})` },
  { id: "trust", content: `Trust (${SECTIONS.filter((s) => s.type === "trust").length})` },
  { id: "conversion", content: `Conversion (${SECTIONS.filter((s) => s.type === "conversion").length})` },
];

const TYPE_BADGE_TONE = {
  hero: "info",
  product: "success",
  trust: "warning",
  conversion: "critical",
};

// ── Build Shopify theme preview URL ──
function buildPreviewUrl(shopDomain, sectionSlug, themeId, productHandle) {
  const needsProduct = PRODUCT_SECTIONS.includes(sectionSlug);
  const base = `https://${shopDomain}`;
  const path = needsProduct && productHandle ? `/products/${productHandle}` : "/";
  const url = new URL(path, base);
  url.searchParams.set("section_id", sectionSlug);
  if (themeId) url.searchParams.set("preview_theme_id", themeId);
  url.searchParams.set("_ck_ts", Date.now().toString());
  return url.toString();
}

// ── Iframe with loading/error fallback ──
function PreviewIframe({ src, title, style, onLoad }) {
  const [status, setStatus] = useState("loading"); // loading | loaded | error | timeout
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!src) return;
    setStatus("loading");
    const timer = setTimeout(() => {
      if (status === "loading") setStatus("timeout");
    }, 12000);
    return () => clearTimeout(timer);
  }, [src]);

  if (!src) return null;

  if (status === "error" || status === "timeout") {
    return (
      <div style={{
        ...style,
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 10, background: "#fef3c7",
      }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#92400e" }}>
          {status === "timeout" ? "Preview timed out" : "Preview could not load"}
        </p>
        <a href={src} target="_blank" rel="noopener noreferrer" style={{
          padding: "7px 16px", borderRadius: 6, background: "#92400e",
          color: "#fff", textDecoration: "none", fontSize: 12, fontWeight: 600,
        }}>
          Open in store →
        </a>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", ...style }}>
      {status === "loading" && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center", background: "#f3f4f6", zIndex: 2,
        }}>
          <Spinner size="large" />
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        style={{
          width: "100%", height: "100%", border: "none",
          borderRadius: 8, background: "#fff",
        }}
        onLoad={() => { setStatus("loaded"); if (onLoad) onLoad(); }}
        onError={() => setStatus("error")}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}

// ── Preview Panel (slides in from right) ──
function PreviewPanel({ section, shopDomain, themeId, productHandle, onClose }) {
  const [viewport, setViewport] = useState("desktop");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (section && shopDomain) {
      setPreviewUrl(buildPreviewUrl(shopDomain, section.slug, themeId, productHandle));
    }
  }, [section, shopDomain, themeId, productHandle]);

  // Escape key closes
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!section) return null;

  const refreshPreview = () => {
    setPreviewUrl(buildPreviewUrl(shopDomain, section.slug, themeId, productHandle));
  };

  const iframeWidth = viewport === "mobile" ? "390px" : "100%";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          zIndex: 99998, animation: "ckFadeIn 200ms ease",
        }}
      />
      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "55vw",
        minWidth: 500, background: "#fff", zIndex: 99999,
        boxShadow: "-4px 0 32px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column",
        animation: "ckSlideIn 250ms ease",
      }}>
        {/* Header */}
        <div style={{
          padding: "14px 20px", borderBottom: "1px solid #e5e7eb",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{section.name}</span>
            <Badge tone={TYPE_BADGE_TONE[section.type]}>{section.type}</Badge>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Viewport toggle */}
            <button
              onClick={() => setViewport("desktop")}
              style={{
                padding: "5px 10px", border: "1px solid #d1d5db", borderRadius: 4,
                background: viewport === "desktop" ? "#111827" : "#fff",
                color: viewport === "desktop" ? "#fff" : "#374151",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              Desktop
            </button>
            <button
              onClick={() => setViewport("mobile")}
              style={{
                padding: "5px 10px", border: "1px solid #d1d5db", borderRadius: 4,
                background: viewport === "mobile" ? "#111827" : "#fff",
                color: viewport === "mobile" ? "#fff" : "#374151",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              Mobile
            </button>
            {/* Refresh */}
            <button
              onClick={refreshPreview}
              title="Refresh preview"
              style={{
                padding: "5px 10px", border: "1px solid #d1d5db", borderRadius: 4,
                background: "#fff", cursor: "pointer", fontSize: 14,
              }}
            >
              ↻
            </button>
            {/* Open in store */}
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "5px 10px", border: "1px solid #d1d5db", borderRadius: 4,
                fontSize: 12, textDecoration: "none", color: "#4F46E5",
              }}
            >
              Open in store ↗
            </a>
            {/* Close */}
            <button
              onClick={onClose}
              style={{
                background: "none", border: "none", fontSize: 22, color: "#6b7280",
                cursor: "pointer", padding: "2px 6px", lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Preview iframe */}
        <div style={{
          flex: 1, padding: 16, display: "flex", justifyContent: "center",
          background: "#f9fafb", overflow: "auto",
        }}>
          <div style={{
            width: iframeWidth, maxWidth: "100%", height: "100%",
            border: viewport === "mobile" ? "3px solid #1f2937" : "none",
            borderRadius: viewport === "mobile" ? 16 : 0,
            overflow: "hidden",
          }}>
            <PreviewIframe
              src={previewUrl}
              title={`Preview: ${section.name}`}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 20px", borderTop: "1px solid #e5e7eb",
          display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0,
        }}>
          <Button>Configure</Button>
          <Button variant="primary">Add to Store</Button>
        </div>
      </div>

      <style>{`
        @keyframes ckFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ckSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}

// ── Main page component ──
export default function Sections() {
  const { shopDomain, themeId, productHandle } = useLoaderData();
  const [selectedTab, setSelectedTab] = useState(0);
  const [previewSection, setPreviewSection] = useState(null);
  const handleTabChange = useCallback((idx) => setSelectedTab(idx), []);

  const activeFilter = TABS[selectedTab].id;
  const filteredSections =
    activeFilter === "all"
      ? SECTIONS
      : SECTIONS.filter((s) => s.type === activeFilter);

  return (
    <Page title="Sections Library">
      <TitleBar title="Sections Library" />
      <BlockStack gap="500">
        <Card>
          <BlockStack gap="200">
            <Text as="p" variant="bodyMd">
              Browse {SECTIONS.length} conversion-optimized sections. Click any section to
              see a live preview rendered inside your actual Shopify theme.
            </Text>
            {!shopDomain && (
              <Text as="p" variant="bodySm" tone="caution">
                Could not load shop data. Previews may not work.
              </Text>
            )}
          </BlockStack>
        </Card>

        <Tabs tabs={TABS} selected={selectedTab} onSelect={handleTabChange}>
          <div style={{ paddingTop: "16px" }}>
            <Grid>
              {filteredSections.map((section) => {
                const thumbUrl = shopDomain
                  ? buildPreviewUrl(shopDomain, section.slug, themeId, productHandle)
                  : null;
                return (
                  <Grid.Cell
                    key={section.slug}
                    columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}
                  >
                    <Card>
                      <BlockStack gap="300">
                        {/* Thumbnail preview */}
                        <div
                          onClick={() => setPreviewSection(section)}
                          style={{
                            position: "relative", height: 140, overflow: "hidden",
                            borderRadius: 8, background: "#f3f4f6", cursor: "pointer",
                          }}
                        >
                          {thumbUrl ? (
                            <iframe
                              src={thumbUrl}
                              title={section.name}
                              style={{
                                width: "250%", height: "250%",
                                transform: "scale(0.4)", transformOrigin: "top left",
                                border: "none", pointerEvents: "none",
                              }}
                              sandbox="allow-scripts allow-same-origin"
                              loading="lazy"
                              tabIndex={-1}
                            />
                          ) : (
                            <div style={{
                              display: "flex", alignItems: "center", justifyContent: "center",
                              height: "100%", color: "#9ca3af", fontSize: 13,
                            }}>
                              Preview unavailable
                            </div>
                          )}
                          {/* Hover overlay */}
                          <div
                            className="ck-thumb-overlay"
                            style={{
                              position: "absolute", inset: 0,
                              background: "rgba(0,0,0,0.5)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              opacity: 0, transition: "opacity 200ms",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0"; }}
                          >
                            <span style={{
                              color: "#fff", fontWeight: 600, fontSize: 13,
                              padding: "6px 14px", background: "rgba(255,255,255,0.15)",
                              borderRadius: 6, backdropFilter: "blur(4px)",
                            }}>
                              Open Preview
                            </span>
                          </div>
                        </div>

                        <InlineStack align="space-between" blockAlign="center">
                          <Text as="h3" variant="headingSm">
                            {section.name}
                          </Text>
                        </InlineStack>
                        <Badge tone={TYPE_BADGE_TONE[section.type] || "new"}>
                          {section.type}
                        </Badge>
                        <Text as="p" variant="bodySm" tone="subdued">
                          {section.description}
                        </Text>
                        <InlineStack gap="200">
                          <Button onClick={() => setPreviewSection(section)}>
                            Preview
                          </Button>
                          <Button variant="primary">Add to Store</Button>
                        </InlineStack>
                      </BlockStack>
                    </Card>
                  </Grid.Cell>
                );
              })}
            </Grid>
          </div>
        </Tabs>
      </BlockStack>

      {/* Preview Panel */}
      {previewSection && (
        <PreviewPanel
          section={previewSection}
          shopDomain={shopDomain}
          themeId={themeId}
          productHandle={productHandle}
          onClose={() => setPreviewSection(null)}
        />
      )}
    </Page>
  );
}
