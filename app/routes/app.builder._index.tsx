// app/routes/app.builder._index.tsx
import React, { useState } from "react";
import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useNavigate, Link } from "@remix-run/react";
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Badge,
  Modal,
  TextField,
  Select,
  Banner,
  Box,
  Divider,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma, { getOrSyncShop } from "../db.server";
import { PREBUILT_TEMPLATES, generateId } from "../builder/default-templates";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await getOrSyncShop(session.shop, session.accessToken);
  if (!shop) {
    return json({ pages: [], shopDomain: session.shop });
  }

  const pages = await prisma.page.findMany({
    where: { shopId: shop.id },
    orderBy: { updatedAt: "desc" },
  });

  return json({
    pages,
    shopDomain: session.shop,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await getOrSyncShop(session.shop, session.accessToken);
  if (!shop) return json({ ok: false, error: "Shop not authorized." });

  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");

  if (intent === "create") {
    const title = String(formData.get("title") || "Untitled Page");
    let handle = String(formData.get("handle") || "").toLowerCase().replace(/[^a-z0-9-_]/g, "-");
    if (!handle) handle = title.toLowerCase().replace(/[^a-z0-9-_]/g, "-") || "custom-page";

    // Ensure unique handle for this shop
    const existing = await prisma.page.findUnique({
      where: { shopId_handle: { shopId: shop.id, handle } },
    });
    if (existing) {
      handle = `${handle}-${Math.floor(Math.random() * 1000)}`;
    }

    const templateId = String(formData.get("templateId") || "blank_canvas");
    const chosenTemplate = PREBUILT_TEMPLATES.find((t) => t.id === templateId) || PREBUILT_TEMPLATES[0];
    const generatedSchema = chosenTemplate.generate();

    const newPage = await prisma.page.create({
      data: {
        id: generateId("p"),
        shopId: shop.id,
        title,
        handle,
        pageType: (formData.get("pageType") as any) || "LANDING",
        layoutMode: generatedSchema.layoutMode,
        sections: generatedSchema.sections as any,
        styles: { globalStyles: generatedSchema.globalStyles } as any,
        status: "DRAFT",
      },
    });

    return redirect(`/app/builder/${newPage.id}`);
  }

  if (intent === "duplicate") {
    const pageId = String(formData.get("pageId") || "");
    const source = await prisma.page.findUnique({ where: { id: pageId } });
    if (source) {
      await prisma.page.create({
        data: {
          id: generateId("p"),
          shopId: shop.id,
          title: `${source.title} (Copy)`,
          handle: `${source.handle}-copy-${Math.floor(Math.random() * 1000)}`,
          pageType: source.pageType,
          layoutMode: source.layoutMode,
          sections: source.sections as any,
          styles: source.styles as any,
          status: "DRAFT",
        },
      });
    }
    return json({ ok: true });
  }

  if (intent === "delete") {
    const pageId = String(formData.get("pageId") || "");
    if (pageId) {
      await prisma.page.delete({ where: { id: pageId } });
    }
    return json({ ok: true });
  }

  return json({ ok: false, error: "Invalid intent" });
};

export default function BuilderDashboardPage() {
  const { pages, shopDomain } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("Summer Flash Sale Landing Page");
  const [newHandle, setNewHandle] = useState("summer-sale");
  const [newPageType, setNewPageType] = useState("LANDING");
  const [selectedTemplateId, setSelectedTemplateId] = useState("d2c_skincare");
  const [filterType, setFilterType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPages = pages.filter((page: any) => {
    const matchesType = filterType === "ALL" || page.pageType === filterType;
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.handle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const publishedCount = pages.filter((p: any) => p.status === "PUBLISHED").length;
  const draftCount = pages.filter((p: any) => p.status === "DRAFT").length;

  return (
    <Page
      title="Visual Page Builder"
      subtitle="Design and publish custom landing pages, product funnels, and homepages with visual drag-and-drop."
      primaryAction={{
        content: "✨ Create New Page",
        onAction: () => setCreateModalOpen(true),
      }}
    >
      <BlockStack gap="500">
        {/* Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          <Card>
            <BlockStack gap="100">
              <Text as="p" tone="subdued" variant="bodySm">Total Pages</Text>
              <Text as="h2" variant="headingLg">{pages.length}</Text>
              <Text as="p" variant="bodyXs" tone="subdued">Custom visual pages created</Text>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="100">
              <Text as="p" tone="subdued" variant="bodySm">Published Live</Text>
              <Text as="h2" variant="headingLg" tone="success">{publishedCount}</Text>
              <Text as="p" variant="bodyXs" tone="success">Active on Shopify store</Text>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="100">
              <Text as="p" tone="subdued" variant="bodySm">Drafts in Progress</Text>
              <Text as="h2" variant="headingLg">{draftCount}</Text>
              <Text as="p" variant="bodyXs" tone="subdued">Ready to edit in Studio</Text>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="100">
              <Text as="p" tone="subdued" variant="bodySm">PageFly Compatibility</Text>
              <Text as="h2" variant="headingLg">100% OS 2.0</Text>
              <Text as="p" variant="bodyXs" tone="subdued">Native Liquid + Zero jQuery bloat</Text>
            </BlockStack>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between" blockAlign="center">
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { id: "ALL", label: "🌟 All Pages" },
                  { id: "LANDING", label: "🚀 Landing Pages" },
                  { id: "PRODUCT", label: "💎 Product Pages" },
                  { id: "COLLECTION", label: "🏷️ Collections" },
                  { id: "HOME", label: "🏠 Homepages" },
                ].map((t) => (
                  <Button
                    key={t.id}
                    size="slim"
                    variant={filterType === t.id ? "primary" : "secondary"}
                    onClick={() => setFilterType(t.id)}
                  >
                    {t.label}
                  </Button>
                ))}
              </div>

              <div style={{ width: "240px" }}>
                <TextField
                  label=""
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  autoComplete="off"
                  clearButton
                  onClearButtonClick={() => setSearchQuery("")}
                />
              </div>
            </InlineStack>
          </BlockStack>
        </Card>

        {/* Pages Grid */}
        {filteredPages.length === 0 ? (
          <Card>
            <Box padding="800">
              <BlockStack align="center" inlineAlign="center" gap="300">
                <Text as="h3" variant="headingMd">No pages found</Text>
                <Text as="p" tone="subdued">
                  {pages.length === 0
                    ? "You haven't built any custom pages yet. Click 'Create New Page' to launch the visual studio!"
                    : "No pages matched your filter."}
                </Text>
                <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
                  ✨ Create Your First Page
                </Button>
              </BlockStack>
            </Box>
          </Card>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {filteredPages.map((p: any) => (
              <Card key={p.id}>
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <Badge tone={p.status === "PUBLISHED" ? "success" : "attention"}>
                      {p.status}
                    </Badge>
                    <Badge tone="info">{p.pageType}</Badge>
                  </InlineStack>

                  <BlockStack gap="100">
                    <Text as="h3" variant="headingMd">
                      {p.title}
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      <code>/pages/{p.handle}</code>
                    </Text>
                  </BlockStack>

                  <Divider />

                  <InlineStack align="space-between" blockAlign="center">
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/app/builder/${p.id}`)}
                    >
                      🎨 Open in Studio
                    </Button>

                    <InlineStack gap="200">
                      {p.status === "PUBLISHED" && (
                        <Button
                          variant="plain"
                          url={`https://${shopDomain}/pages/${p.handle}`}
                          target="_blank"
                        >
                          👁️ View Live ↗
                        </Button>
                      )}

                      <Button
                        variant="plain"
                        onClick={() => {
                          fetcher.submit({ intent: "duplicate", pageId: p.id }, { method: "post" });
                        }}
                      >
                        Duplicate
                      </Button>

                      <Button
                        tone="critical"
                        variant="plain"
                        onClick={() => {
                          if (confirm(`Delete page "${p.title}"?`)) {
                            fetcher.submit({ intent: "delete", pageId: p.id }, { method: "post" });
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </InlineStack>
                  </InlineStack>
                </BlockStack>
              </Card>
            ))}
          </div>
        )}
      </BlockStack>

      {/* CREATE NEW PAGE MODAL */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Custom Page"
        primaryAction={{
          content: "🚀 Launch Visual Studio",
          onAction: () => {
            fetcher.submit(
              {
                intent: "create",
                title: newTitle,
                handle: newHandle,
                pageType: newPageType,
                templateId: selectedTemplateId,
              },
              { method: "post" }
            );
          },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setCreateModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <TextField
              label="Page Name"
              value={newTitle}
              onChange={(val) => {
                setNewTitle(val);
                setNewHandle(val.toLowerCase().replace(/[^a-z0-9-_]/g, "-"));
              }}
              autoComplete="off"
              helpText="e.g. Summer Glow Skincare Special"
            />

            <TextField
              label="URL Handle"
              value={newHandle}
              onChange={(val) => setNewHandle(val.toLowerCase().replace(/[^a-z0-9-_]/g, "-"))}
              autoComplete="off"
              prefix="https://your-store.myshopify.com/pages/"
            />

            <Select
              label="Page Type"
              options={[
                { label: "Landing Page (Direct Checkout / Funnel)", value: "LANDING" },
                { label: "Product Showcase Page", value: "PRODUCT" },
                { label: "Collection Campaign Page", value: "COLLECTION" },
                { label: "Custom Homepage", value: "HOME" },
              ]}
              value={newPageType}
              onChange={setNewPageType}
            />

            <Text as="h4" variant="headingSm">Select Starting Template:</Text>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              {PREBUILT_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  style={{
                    border: selectedTemplateId === tpl.id ? "2px solid #0284c7" : "1px solid #e2e8f0",
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                    backgroundColor: selectedTemplateId === tpl.id ? "#f0f9ff" : "#ffffff",
                    transition: "all 0.15s ease",
                  }}
                >
                  <img
                    src={tpl.thumbnail}
                    alt={tpl.name}
                    style={{ width: "100%", height: "90px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "8px 10px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", marginBottom: "2px" }}>
                      {tpl.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b", lineHeight: "1.3" }}>
                      {tpl.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
