import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useSearchParams, Link } from "@remix-run/react";
import { useState, useMemo } from "react";
import {
  Page, Card, Text, BlockStack, InlineStack, Button, Badge, Banner, Box, Spinner, TextField, Modal,
} from "@shopify/polaris";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import { STORE_PAGE_TEMPLATES, type StorePageCategory, type StorePageTemplate } from "../data/page-templates";
import { applyComposition, ensureDraftTheme, publishDraft } from "../services/page-compositions.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });

  let staged: string[] = [];
  try {
    if (shop?.stagedPages) staged = JSON.parse(shop.stagedPages);
  } catch {
    staged = [];
  }

  return json({
    templates: STORE_PAGE_TEMPLATES,
    staged,
    shopDomain: session.shop,
    connected: Boolean(shop),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");
  const templateId = String(formData.get("templateId") || "");

  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) {
    return json({ error: "Store not found in database" }, { status: 400 });
  }

  try {
    if (intent === "apply" || intent === "preview") {
      const template = STORE_PAGE_TEMPLATES.find(t => t.id === templateId) || STORE_PAGE_TEMPLATES[0];
      const draft = await ensureDraftTheme(shop);

      // Read real merchant collection handles if available
      let handles: string[] = ["all"];
      try {
        const collections = await prisma.collection.findMany({
          where: { shopId: shop.id },
          take: 10,
          select: { handle: true },
        });
        if (collections.length > 0) {
          handles = collections.map(c => c.handle);
        }
      } catch {}

      // Convert StorePageTemplate to PageComposition format for applyComposition
      const composition: any = {
        id: template.id,
        name: template.name,
        pageType: template.pageType,
        niche: template.niche,
        family: template.family,
        archetype: template.styleTag,
        accentColor: template.accentColor,
        announcement: template.announcement,
        header: template.header,
        footer: template.footer,
        sections: template.sections,
      };

      // Apply composition to both draft theme and active theme so preview & live store are 100% in sync
      const result = await applyComposition(shop, draft.id, composition, {
        collections: handles,
        palette: {
          accent: template.accentColor,
        },
      });

      try {
        await applyComposition(shop, "active", composition, {
          collections: handles,
          palette: {
            accent: template.accentColor,
          },
        });
      } catch (activeErr) {
        console.warn("[BuildStore] Applying to active theme note:", activeErr);
      }


      const base =
        template.pageType === "cart" ? "/cart"
        : template.pageType === "collection" || template.pageType === "product" ? "/collections/all"
        : "/";

      const directUrl = `https://${shop.shopDomain}${base}`;

      return json({
        ok: true,
        intent,
        templateId,
        name: template.name,
        draftId: draft.id,
        directUrl,
        sectionsWritten: result.sectionsWritten,
        filesWritten: result.filesWritten,
        url: `/app/preview?theme=${draft.id}&_cf=${Date.now()}`,
      });
    }

    if (intent === "publish") {
      const draft = await ensureDraftTheme(shop);
      const theme = await publishDraft(shop, draft.id);
      return json({ ok: true, intent, theme });
    }

    return json({ error: `Unknown intent "${intent}"` }, { status: 400 });
  } catch (err: any) {
    console.error(`[BuildStore] ${intent} failed:`, err);
    return json({ error: err.message || String(err) }, { status: 500 });
  }
};

export default function BuildStore() {
  const { templates, staged, shopDomain, connected } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<StorePageCategory>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<StorePageTemplate | null>(null);
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeId, setActiveId] = useState<string | null>(null);

  const fetcher = useFetcher<any>();
  const busy = fetcher.state !== "idle";
  const data = fetcher.data;
  const published = data?.ok && data.intent === "publish";

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchCat = t.category === activeTab;
      const matchSearch =
        searchQuery.trim() === "" ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.styleTag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [templates, activeTab, searchQuery]);

  const handleApply = (id: string) => {
    setActiveId(id);
    fetcher.submit({ intent: "apply", templateId: id }, { method: "post" });
  };

  const getViewportWidth = () => {
    if (viewportMode === "mobile") return "375px";
    if (viewportMode === "tablet") return "768px";
    return "100%";
  };

  return (
    <Page
      fullWidth
      title="Build Your Store — PageFly Studio"
      subtitle="Select 100X CRO High-Converting Templates for Home, Product, Collection, Landing & Cart Pages"
      backAction={{ content: "Dashboard", url: "/app" }}
      primaryAction={
        staged.length > 0
          ? {
              content: `Publish Live (${staged.length})`,
              loading: busy,
              onAction: () => fetcher.submit({ intent: "publish" }, { method: "post" }),
            }
          : undefined
      }
    >
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 16px 60px" }}>
        <BlockStack gap="400">
          {!connected && (
            <Banner tone="warning" title="Finishing Store Setup">
              <p>This store is still connecting. Reload in a moment.</p>
            </Banner>
          )}

          {data?.error && (
            <Banner tone="critical" title="Operation Failed">
              <p>{data.error}</p>
            </Banner>
          )}

          {published && (
            <Banner tone="success" title="Published Live to Shopify Store!">
              <p>Your new high-converting page layout is now live on your active store theme!</p>
            </Banner>
          )}

          {data?.ok && data.intent === "apply" && !published && (
            <Banner
              tone="success"
              title={`⚡ "${data.name}" Applied to Theme! (${data.filesWritten} Files Uploaded)`}
              action={{
                content: "Open Theme Live Preview",
                onAction: () => window.open(data.directUrl, "_blank"),
              }}
            >
              <p>All liquid sections and JSON templates written cleanly into your draft theme.</p>
            </Banner>
          )}

          {/* PageFly-Style Tab Navigation Bar */}
          <div style={{ background: "#ffffff", borderRadius: 12, padding: 12, border: "1px solid #e1e3e5", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <InlineStack align="space-between" blockAlign="center" gap="400" wrap>
              <InlineStack gap="200" wrap>
                <Button
                  variant={activeTab === "home" ? "primary" : "tertiary"}
                  onClick={() => setActiveTab("home")}
                >
                  🏠 Home Pages
                </Button>
                <Button
                  variant={activeTab === "product" ? "primary" : "tertiary"}
                  onClick={() => setActiveTab("product")}
                >
                  🏷️ Product Pages (PDP)
                </Button>
                <Button
                  variant={activeTab === "collection" ? "primary" : "tertiary"}
                  onClick={() => setActiveTab("collection")}
                >
                  🛍️ Collection Pages (PLP)
                </Button>
                <Button
                  variant={activeTab === "landing" ? "primary" : "tertiary"}
                  onClick={() => setActiveTab("landing")}
                >
                  🚀 Landing Pages
                </Button>
                <Button
                  variant={activeTab === "cart" ? "primary" : "tertiary"}
                  onClick={() => setActiveTab("cart")}
                >
                  🛒 Cart Pages & Drawers
                </Button>
              </InlineStack>

              <div style={{ width: 280 }}>
                <TextField
                  label=""
                  labelHidden
                  placeholder="Search templates & tags..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  autoComplete="off"
                  clearButton
                  onClearButtonClick={() => setSearchQuery("")}
                />
              </div>
            </InlineStack>
          </div>

          {/* Template Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 24 }}>
            {filteredTemplates.map(tmpl => {
              const isBusyThis = busy && activeId === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: 16,
                    border: "1px solid #e1e3e5",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  {/* Card Media Header */}
                  <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "#0f172a" }}>
                    <img
                      src={tmpl.heroImg}
                      alt={tmpl.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
                      <Badge tone="info">{tmpl.styleTag}</Badge>
                      <Badge tone="success">{tmpl.sections.length} CRO SECTIONS</Badge>
                    </div>
                  </div>

                  {/* Card Info Body */}
                  <div style={{ padding: 20, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <Text as="span" variant="bodyXs" tone="subdued">{tmpl.usageCount}</Text>
                    <Text as="h3" variant="headingMd" style={{ margin: "4px 0 8px 0" }}>{tmpl.name}</Text>
                    <Text as="p" variant="bodySm" tone="subdued" style={{ lineHeight: 1.5, marginBottom: 16, flexGrow: 1 }}>
                      {tmpl.description}
                    </Text>

                    {/* Actions */}
                    <InlineStack gap="200" align="space-between">
                      <Button
                        size="medium"
                        onClick={() => setSelectedTemplate(tmpl)}
                      >
                        🔍 Live Device Preview
                      </Button>

                      <Button
                        variant="primary"
                        size="medium"
                        loading={isBusyThis}
                        onClick={() => handleApply(tmpl.id)}
                      >
                        ⚡ Apply to Theme
                      </Button>
                    </InlineStack>
                  </div>
                </div>
              );
            })}
          </div>
        </BlockStack>
      </div>

      {/* PageFly Live Device Preview Modal */}
      {selectedTemplate && (
        <Modal
          open={Boolean(selectedTemplate)}
          onClose={() => setSelectedTemplate(null)}
          title={`Live Device Preview — ${selectedTemplate.name}`}
          primaryAction={{
            content: "⚡ Apply Template to Store",
            loading: busy,
            onAction: () => {
              handleApply(selectedTemplate.id);
              setSelectedTemplate(null);
            },
          }}
          secondaryActions={[
            {
              content: "Close",
              onAction: () => setSelectedTemplate(null),
            },
          ]}
          large
        >
          <Modal.Section>
            <BlockStack gap="300">
              {/* Device Viewport Selector Bar */}
              <InlineStack align="center" gap="200">
                <Button
                  size="micro"
                  variant={viewportMode === "desktop" ? "primary" : "secondary"}
                  onClick={() => setViewportMode("desktop")}
                >
                  💻 Desktop (1280px)
                </Button>
                <Button
                  size="micro"
                  variant={viewportMode === "tablet" ? "primary" : "secondary"}
                  onClick={() => setViewportMode("tablet")}
                >
                  📱 Tablet (768px)
                </Button>
                <Button
                  size="micro"
                  variant={viewportMode === "mobile" ? "primary" : "secondary"}
                  onClick={() => setViewportMode("mobile")}
                >
                  📲 Mobile (375px)
                </Button>
              </InlineStack>

              {/* Iframe Viewport Container */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  background: "#f1f5f9",
                  padding: 20,
                  borderRadius: 12,
                  overflowX: "auto",
                }}
              >
                <div
                  style={{
                    width: getViewportWidth(),
                    maxWidth: "100%",
                    height: 640,
                    background: "#ffffff",
                    borderRadius: 12,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    overflow: "hidden",
                    transition: "width 0.3s ease",
                  }}
                >
                  <iframe
                    src={`/api/preview-composition?id=${selectedTemplate.id}`}
                    title={selectedTemplate.name}
                    style={{ width: "100%", height: "100%", border: "none" }}
                  />
                </div>
              </div>
            </BlockStack>
          </Modal.Section>
        </Modal>
      )}
    </Page>
  );
}
