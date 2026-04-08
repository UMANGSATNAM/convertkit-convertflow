import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useFetcher } from "@remix-run/react";
import { useState, useCallback } from "react";
import {
  Page as PolarisPage,
  Layout,
  Card,
  Text,
  Button,
  Icon,
  Badge,
  InlineStack,
  BlockStack,
  Box,
  EmptyState,
  Modal,
  TextField,
  Select,
  Tabs,
  Spinner,
} from "@shopify/polaris";
import {
  PlusIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
  ExternalIcon,
} from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "../data/template-registry";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopRecord = await prisma.shop.findUnique({
    where: { shopDomain: session.shop },
  });
  if (!shopRecord) return json({ pages: [], shop: session.shop });

  const pages = await prisma.page.findMany({
    where: { shopId: shopRecord.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      pageType: true,
      templateId: true,
      status: true,
      shopifyPageId: true,
      publishedAt: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return json({ pages, shop: session.shop });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  let shopRecord = await prisma.shop.findUnique({
    where: { shopDomain: session.shop },
  });
  if (!shopRecord) {
    shopRecord = await prisma.shop.create({
      data: {
        shopDomain: session.shop,
        accessToken: session.accessToken || "",
      },
    });
  }

  if (intent === "create") {
    const title = formData.get("title") || "Untitled Page";
    const templateId = formData.get("templateId") || null;
    const pageType = formData.get("pageType") || "landing";
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let content = null;
    let globalStyles = null;

    if (templateId) {
      const template = TEMPLATES.find((t) => t.id === templateId);
      if (template) {
        content = JSON.stringify(template.data.sections);
        globalStyles = JSON.stringify({
          fonts: template.data.fonts,
          colors: template.data.colors,
        });
      }
    }

    const page = await prisma.page.create({
      data: {
        shopId: shopRecord.id,
        title,
        slug,
        pageType,
        templateId,
        content,
        globalStyles,
        seoTitle: title,
        status: "draft",
      },
    });

    return redirect(`/app/builder/${page.id}`);
  }

  if (intent === "delete") {
    const pageId = formData.get("pageId");
    if (pageId) {
      await prisma.page.delete({ where: { id: pageId } });
    }
    return json({ success: true });
  }

  if (intent === "duplicate") {
    const pageId = formData.get("pageId");
    const original = await prisma.page.findUnique({ where: { id: pageId } });
    if (original) {
      await prisma.page.create({
        data: {
          shopId: shopRecord.id,
          title: `${original.title} (Copy)`,
          slug: `${original.slug}-copy-${Date.now()}`,
          pageType: original.pageType,
          templateId: original.templateId,
          content: original.content,
          globalStyles: original.globalStyles,
          seoTitle: original.seoTitle,
          seoDescription: original.seoDescription,
          status: "draft",
        },
      });
    }
    return json({ success: true });
  }

  return json({ error: "Unknown intent" }, { status: 400 });
};

export default function BuilderDashboard() {
  const { pages, shop } = useLoaderData();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [showCreate, setShowCreate] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPageType, setNewPageType] = useState("landing");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [templateFilter, setTemplateFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const tabs = [
    { id: "all", content: "All Pages", badge: pages.length },
    {
      id: "published",
      content: "Published",
      badge: pages.filter((p) => p.status === "published").length,
    },
    {
      id: "draft",
      content: "Drafts",
      badge: pages.filter((p) => p.status === "draft").length,
    },
  ];

  const filteredPages =
    selectedTab === 0
      ? pages
      : pages.filter(
          (p) => p.status === (selectedTab === 1 ? "published" : "draft")
        );

  const filteredTemplates =
    templateFilter === "all"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === templateFilter);

  const handleCreateBlank = useCallback(() => {
    setSelectedTemplate(null);
    setShowTemplates(false);
    setShowCreate(true);
  }, []);

  const handleSelectTemplate = useCallback(
    (template) => {
      setSelectedTemplate(template);
      setNewTitle(template.name);
      setShowTemplates(false);
      setShowCreate(true);
    },
    []
  );

  const handleConfirmCreate = useCallback(() => {
    const form = new FormData();
    form.set("intent", "create");
    form.set("title", newTitle || "Untitled Page");
    form.set("pageType", newPageType);
    if (selectedTemplate) form.set("templateId", selectedTemplate.id);
    fetcher.submit(form, { method: "POST" });
    setShowCreate(false);
  }, [newTitle, newPageType, selectedTemplate, fetcher]);

  const statusBadge = (status) => {
    const map = {
      published: { tone: "success", label: "Published" },
      draft: { tone: "attention", label: "Draft" },
      scheduled: { tone: "info", label: "Scheduled" },
    };
    const s = map[status] || map.draft;
    return <Badge tone={s.tone}>{s.label}</Badge>;
  };

  const pageTypeIcon = (type) => {
    const icons = {
      landing: "🚀",
      product: "🛍️",
      collection: "📁",
      homepage: "🏠",
      blog: "📝",
      "404": "🔍",
      coming_soon: "⏳",
    };
    return icons[type] || "📄";
  };

  const timeSince = (date) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <PolarisPage
      title="Page Builder"
      subtitle="Create, customize, and publish landing pages"
      primaryAction={{
        content: "Create Page",
        icon: PlusIcon,
        onAction: () => setShowTemplates(true),
      }}
    >
      {/* Template Picker Modal */}
      <Modal
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        title="Choose a Starting Point"
        large
      >
        <Modal.Section>
          <BlockStack gap="400">
            {/* Blank Page Option */}
            <div
              onClick={handleCreateBlank}
              style={{
                border: "2px dashed #D0D5DD",
                borderRadius: 12,
                padding: 28,
                cursor: "pointer",
                textAlign: "center",
                transition: "all .2s",
                background: "#FAFBFC",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.borderColor = "#2563EB")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.borderColor = "#D0D5DD")
              }
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>✨</div>
              <Text as="h3" variant="headingMd">
                Start from Scratch
              </Text>
              <Text tone="subdued">
                Build your page from a blank canvas
              </Text>
            </div>

            {/* Category Filters */}
            <InlineStack gap="200">
              {TEMPLATE_CATEGORIES.map((cat) => (
                <Button
                  key={cat.id}
                  variant={
                    templateFilter === cat.id ? "primary" : "secondary"
                  }
                  size="slim"
                  onClick={() => setTemplateFilter(cat.id)}
                >
                  {cat.label}
                </Button>
              ))}
            </InlineStack>

            {/* Template Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {filteredTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  style={{
                    border: "1px solid #E5E7EB",
                    borderRadius: 12,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all .2s",
                    background: "#fff",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(0,0,0,.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      height: 140,
                      background: tmpl.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 48 }}>{tmpl.icon}</span>
                  </div>
                  <div style={{ padding: 16 }}>
                    <Text as="h3" variant="headingSm">
                      {tmpl.name}
                    </Text>
                    <Text
                      tone="subdued"
                      variant="bodySm"
                    >
                      {tmpl.description}
                    </Text>
                    <InlineStack gap="100" wrap>
                      {tmpl.tags.map((tag) => (
                        <Badge key={tag} tone="info">
                          {tag}
                        </Badge>
                      ))}
                    </InlineStack>
                  </div>
                </div>
              ))}
            </div>
          </BlockStack>
        </Modal.Section>
      </Modal>

      {/* Create Page Dialog */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title={
          selectedTemplate
            ? `Create from: ${selectedTemplate.name}`
            : "Create Blank Page"
        }
        primaryAction={{
          content: "Create Page",
          onAction: handleConfirmCreate,
          loading: fetcher.state === "submitting",
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setShowCreate(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <TextField
              label="Page Title"
              placeholder="My Landing Page"
              value={newTitle}
              onChange={setNewTitle}
              autoComplete="off"
            />
            <Select
              label="Page Type"
              options={[
                { label: "🚀 Landing Page", value: "landing" },
                { label: "🛍️ Product Page", value: "product" },
                { label: "📁 Collection Page", value: "collection" },
                { label: "🏠 Home Page", value: "homepage" },
                { label: "📝 Blog Page", value: "blog" },
                { label: "⏳ Coming Soon", value: "coming_soon" },
              ]}
              value={newPageType}
              onChange={setNewPageType}
            />
            {selectedTemplate && (
              <div
                style={{
                  background: "#F9FAFB",
                  borderRadius: 8,
                  padding: 16,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 8,
                    background: selectedTemplate.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    flexShrink: 0,
                  }}
                >
                  {selectedTemplate.icon}
                </div>
                <div>
                  <Text variant="headingSm">
                    Using template: {selectedTemplate.name}
                  </Text>
                  <Text tone="subdued" variant="bodySm">
                    {selectedTemplate.sectionCount} pre-built sections
                  </Text>
                </div>
              </div>
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Page?"
        primaryAction={{
          content: "Delete",
          destructive: true,
          onAction: () => {
            const form = new FormData();
            form.set("intent", "delete");
            form.set("pageId", deleteTarget);
            fetcher.submit(form, { method: "POST" });
            setDeleteTarget(null);
          },
        }}
        secondaryActions={[
          { content: "Cancel", onAction: () => setDeleteTarget(null) },
        ]}
      >
        <Modal.Section>
          <Text>
            This will permanently delete the page and remove it from your
            Shopify store. This action cannot be undone.
          </Text>
        </Modal.Section>
      </Modal>

      <Layout>
        <Layout.Section>
          {/* Tabs */}
          <Card>
            <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
              <Box padding="400">
                {filteredPages.length === 0 ? (
                  <EmptyState
                    heading="No pages yet"
                    image=""
                    action={{
                      content: "Create your first page",
                      onAction: () => setShowTemplates(true),
                    }}
                  >
                    <p>
                      Start building high-converting landing pages for your
                      Shopify store.
                    </p>
                  </EmptyState>
                ) : (
                  <BlockStack gap="300">
                    {filteredPages.map((page) => (
                      <div
                        key={page.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "16px 20px",
                          borderRadius: 12,
                          border: "1px solid #E5E7EB",
                          background: "#FFFFFF",
                          transition: "all .15s",
                          cursor: "pointer",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.boxShadow =
                            "0 2px 12px rgba(0,0,0,.06)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.boxShadow = "none")
                        }
                        onClick={() => navigate(`/app/builder/${page.id}`)}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                          }}
                        >
                          <div
                            style={{
                              width: 42,
                              height: 42,
                              borderRadius: 8,
                              background: "#F1F5F9",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 22,
                            }}
                          >
                            {pageTypeIcon(page.pageType)}
                          </div>
                          <div>
                            <Text variant="headingSm">{page.title}</Text>
                            <Text
                              tone="subdued"
                              variant="bodySm"
                            >
                              /{page.slug} · Updated {timeSince(page.updatedAt)}
                            </Text>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          {statusBadge(page.status)}
                          {page.shopifyPageId && (
                            <Button
                              icon={ExternalIcon}
                              variant="plain"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  `https://${shop}/pages/${page.slug}`,
                                  "_blank"
                                );
                              }}
                            />
                          )}
                          <Button
                            icon={EditIcon}
                            variant="plain"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/app/builder/${page.id}`);
                            }}
                          />
                          <Button
                            icon={DeleteIcon}
                            variant="plain"
                            tone="critical"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(page.id);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </BlockStack>
                )}
              </Box>
            </Tabs>
          </Card>
        </Layout.Section>
      </Layout>
    </PolarisPage>
  );
}
