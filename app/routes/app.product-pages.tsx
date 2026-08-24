import { useState } from "react";
import { useLoaderData, useFetcher, useSearchParams } from "@remix-run/react";
import { type LoaderFunctionArgs, type ActionFunctionArgs, json } from "@remix-run/node";
import { Page, Card, Text, BlockStack, InlineStack, Button, Badge, Box, Select } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { PRODUCT_PAGES_CATALOG } from "../data/product-pages-catalog";
import { applyToLiveTheme } from "../pagekit/apply.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const niche = url.searchParams.get("niche") || "all";

  const filtered = niche === "all"
    ? PRODUCT_PAGES_CATALOG
    : PRODUCT_PAGES_CATALOG.filter(p => p.niche === niche);

  return json({
    productPages: filtered,
    totalCount: PRODUCT_PAGES_CATALOG.length,
    activeNiche: niche,
    shopDomain: session.shop
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const ppId = formData.get("ppId") as string;

  if (intent === "apply" && ppId) {
    const page = PRODUCT_PAGES_CATALOG.find(p => p.id === ppId);
    if (!page) return json({ ok: false, error: "Product Page definition not found" }, { status: 404 });
    
    // Apply product page template to live theme
    const result = await applyToLiveTheme(session.shop, page);
    return json({ ok: result.ok, error: result.error });
  }

  return json({ ok: false, error: "Unknown action" }, { status: 400 });
};

export default function ProductPagesCatalog() {
  const { productPages, totalCount, activeNiche, shopDomain } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<typeof action>();
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const niches = [
    "all", "beauty", "streetwear", "jewellery", "tech", "denim",
    "health", "activewear", "food", "decor", "eyewear",
    "fragrance", "footwear", "baby", "pet", "coffee"
  ];

  const handleApply = (ppId: string) => {
    setApplyingId(ppId);
    fetcher.submit({ intent: "apply", ppId }, { method: "post" });
  };

  return (
    <Page
      title="15 Global Niche CRO Product Pages"
      subtitle="Ultra-converting Product Page designs engineered for max AOV, variant swatches, sticky cart & editable schemas."
    >
      <BlockStack gap="400">
        {/* Niche Filter Header */}
        <Card padding="400">
          <InlineStack gap="200" align="space-between" blockAlign="center">
            <div>
              <Text as="h2" variant="headingMd">Filter by Global Niche</Text>
              <Text as="p" tone="subdued">Showing {productPages.length} of {totalCount} CRO Product Page templates</Text>
            </div>
            <Select
              label=""
              labelInline
              options={niches.map(n => ({ label: n === "all" ? "All Niches (15)" : n.toUpperCase(), value: n }))}
              value={activeNiche}
              onChange={v => setSearchParams({ niche: v })}
            />
          </InlineStack>
        </Card>

        {/* Product Pages Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {productPages.map(page => (
            <Card key={page.id} padding="0">
              <BlockStack gap="0">
                
                {/* Visual Header Banner */}
                <div style={{ position: "relative", height: 180, overflow: "hidden", background: "#0f172a", borderBottom: "1px solid #e2e8f0" }}>
                  <img
                    src={`/thumbnails/${page.id}.jpg`}
                    alt={page.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80";
                    }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)" }} />
                  <div style={{ position: "absolute", top: 10, left: 10 }}>
                    <Badge tone="success">CRO OPTIMIZED</Badge>
                  </div>
                  <div style={{ position: "absolute", bottom: 8, left: 10, right: 10, color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 800 }}>{page.niche.toUpperCase()}</span>
                    <span style={{ fontSize: 10, background: "rgba(255,255,255,0.25)", backdropFilter: "blur(4px)", padding: "2px 6px", borderRadius: 4 }}>Full Variant Swatches</span>
                  </div>
                </div>

                {/* Content Box */}
                <Box padding="300">
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingSm" style={{ fontWeight: 800, fontSize: 15 }}>
                      {page.name}
                    </Text>
                    
                    {/* CRO Features Tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      <span style={{ fontSize: 10, padding: "2px 6px", background: "#eff6ff", color: "#1d4ed8", borderRadius: 4, fontWeight: 700 }}>✓ Color Swatches</span>
                      <span style={{ fontSize: 10, padding: "2px 6px", background: "#f0fdf4", color: "#15803d", borderRadius: 4, fontWeight: 700 }}>✓ Size Pills</span>
                      <span style={{ fontSize: 10, padding: "2px 6px", background: "#fef2f2", color: "#b91c1c", borderRadius: 4, fontWeight: 700 }}>✓ Sticky Cart</span>
                      <span style={{ fontSize: 10, padding: "2px 6px", background: "#faf5ff", color: "#7e22ce", borderRadius: 4, fontWeight: 700 }}>✓ Bundle Upsell</span>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                      <Button
                        variant="primary"
                        loading={applyingId === page.id && fetcher.state !== "idle"}
                        disabled={fetcher.state !== "idle"}
                        onClick={() => handleApply(page.id)}
                      >
                        Apply to Live Theme
                      </Button>
                      <Button onClick={() => window.open(`/app/preview?hpId=${page.id}`, "_blank")}>
                        Preview Store ↗
                      </Button>
                      <a
                        href="https://peri-beauty-bcuauhsj.myshopify.com/?password=1234"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "6px 12px",
                          background: "#f1f5f9",
                          color: "#0f172a",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: 600,
                          textDecoration: "none",
                          border: "1px solid #cbd5e1"
                        }}
                      >
                        Live Store (Pass: 1234) ↗
                      </a>
                    </div>
                  </BlockStack>
                </Box>

              </BlockStack>
            </Card>
          ))}
        </div>
      </BlockStack>
    </Page>
  );
}
