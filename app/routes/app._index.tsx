import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useSearchParams } from "@remix-run/react";
import { useState, useMemo } from "react";
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
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { installSection, describeSection } from "../services/section-install.server";
import { ensurePreviewTheme, previewUrl } from "../services/preview-theme.server";

/**
 * Pre-Made Sections Store
 *
 * Merchants browse pre-made sections (Hero, PDP, Trust, Reviews, FAQ, etc.),
 * preview them live on their store, and click "Add to Store" to inject them
 * straight into their active Shopify theme with 1 click.
 */

const CATEGORIES = [
  { id: "all", label: "All Sections" },
  { id: "hero", label: "Hero Banners" },
  { id: "product-page", label: "Product Page & Sticky ATC" },
  { id: "product-grid", label: "Product Grids & Bestsellers" },
  { id: "trust", label: "Trust & Badges" },
  { id: "testimonials", label: "Reviews & UGC" },
  { id: "faq", label: "FAQs & Accordions" },
  { id: "announcement", label: "Announcement Bars & Marquee" },
  { id: "brand-story", label: "Brand Story" },
  { id: "newsletter", label: "Newsletter" },
  { id: "header", label: "Headers" },
  { id: "footer", label: "Footers" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || "all";
  const q = (url.searchParams.get("q") || "").trim();

  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });

  // Build where clause according to category and search
  const where: any = { status: "PUBLISHED" };

  if (category === "hero") {
    where.sectionType = "hero";
  } else if (category === "product-page") {
    where.sectionType = {
      in: ["product-page", "caratlane-pdp-main", "caratlane-pdp-recommendations", "caratlane-pdp-reviews"],
    };
  } else if (category === "product-grid") {
    where.sectionType = {
      in: ["product-grid", "collection", "bestsellers-tabs", "category-tiles", "featured-drop", "lookbook"],
    };
  } else if (category === "trust") {
    where.sectionType = { in: ["trust", "trust-badges"] };
  } else if (category === "testimonials") {
    where.sectionType = { in: ["testimonials", "reviews", "ugc", "ugc-community"] };
  } else if (category === "faq") {
    where.sectionType = "faq";
  } else if (category === "announcement") {
    where.sectionType = { in: ["announcement", "marquee", "ticker"] };
  } else if (category === "brand-story") {
    where.sectionType = "brand-story";
  } else if (category === "newsletter") {
    where.sectionType = "newsletter";
  } else if (category === "header") {
    where.sectionType = { in: ["header", "header-minimal-v1", "header-luxury-v1", "header-bold-v1", "header-tech-v1"] };
  } else if (category === "footer") {
    where.sectionType = { in: ["footer", "footer-minimal-v1", "footer-luxury-v1", "footer-bold-v1", "footer-tech-v1"] };
  }

  if (q) {
    where.OR = [
      { componentId: { contains: q } },
      { family: { contains: q } },
      { visualStyle: { contains: q } },
    ];
  }

  const [components, totalCount] = await Promise.all([
    prisma.componentRegistry.findMany({
      where,
      orderBy: { componentId: "asc" },
      take: 80,
    }),
    prisma.componentRegistry.count({ where: { status: "PUBLISHED" } }),
  ]);

  const described = await Promise.all(
    components.map(async (c: any) => ({
      componentId: c.componentId,
      family: c.family,
      visualStyle: c.visualStyle,
      liquidPath: c.liquidPath,
      sectionType: c.sectionType,
      detail: await describeSection(c.liquidPath),
    }))
  );

  return json({
    shopDomain: session.shop,
    category,
    q,
    totalCount,
    components: described,
    hasShop: Boolean(shop),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent"));

  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) return json({ error: "Store connection not ready." }, { status: 400 });

  try {
    const componentId = String(form.get("componentId"));
    const liquidPath = String(form.get("liquidPath"));
    const sectionType = String(form.get("sectionType"));
    const sectionName = String(form.get("sectionName") || componentId);
    const targetChoice = String(form.get("targetChoice") || "auto");

    if (intent === "preview") {
      const theme = await ensurePreviewTheme(shop);

      const target =
        sectionType === "header" || sectionType.startsWith("header")
          ? ({ kind: "group", group: "header", replace: "header" } as const)
          : sectionType === "footer" || sectionType.startsWith("footer")
            ? ({ kind: "group", group: "footer", replace: "footer" } as const)
            : sectionType === "product-page" || targetChoice === "product"
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
      let target: any;
      if (sectionType === "header" || sectionType.startsWith("header")) {
        target = { kind: "group", group: "header", replace: "header" };
      } else if (sectionType === "footer" || sectionType.startsWith("footer")) {
        target = { kind: "group", group: "footer", replace: "footer" };
      } else if (targetChoice === "product" || (!targetChoice && sectionType === "product-page")) {
        target = { kind: "template", template: "product", position: "bottom" };
      } else {
        const topTypes = ["hero", "announcement", "marquee", "ticker"];
        const position = topTypes.includes(sectionType) ? "top" : "bottom";
        target = { kind: "template", template: "index", position };
      }

      const result = await installSection(
        shop,
        "active",
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

      return json({
        ok: true,
        intent,
        componentId,
        sectionName,
        targetLabel,
        result,
      });
    }

    return json({ error: `Unknown intent "${intent}"` }, { status: 400 });
  } catch (err: any) {
    console.error(`[Section Store] Error:`, err);
    return json({ error: err.message || String(err) }, { status: 500 });
  }
}

export default function PreMadeSectionsStore() {
  const { shopDomain, category, q, totalCount, components } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<any>();

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activePreview, setActivePreview] = useState<any>(null);
  const [activeTarget, setActiveTarget] = useState<string>("auto");
  const [searchQuery, setSearchQuery] = useState(q);

  const busy = fetcher.state !== "idle";
  const data = fetcher.data;
  const installingId = busy && fetcher.formData?.get("intent") === "install"
    ? String(fetcher.formData.get("componentId"))
    : null;
  const previewingId = busy && fetcher.formData?.get("intent") === "preview"
    ? String(fetcher.formData.get("componentId"))
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
    fetcher.submit(
      {
        intent: "preview",
        componentId: c.componentId,
        liquidPath: c.liquidPath,
        sectionType: c.sectionType,
        sectionName: c.detail?.name || c.componentId,
        targetChoice: activeTarget,
      },
      { method: "post" }
    );
  };

  const submitInstall = (c: any) => {
    fetcher.submit(
      {
        intent: "install",
        componentId: c.componentId,
        liquidPath: c.liquidPath,
        sectionType: c.sectionType,
        sectionName: c.detail?.name || c.componentId,
        targetChoice: activeTarget,
      },
      { method: "post" }
    );
  };

  const themeEditorUrl = `https://${shopDomain}/admin/themes/current/editor`;

  return (
    <Page
      title="Pre-Made Sections Library"
      subtitle="Browse pre-made Shopify sections. Preview any design and add it directly to your live store with 1 click."
      primaryAction={{
        content: "Open Theme Editor",
        url: themeEditorUrl,
        external: true,
      }}
      secondaryActions={[
        {
          content: "My Added Sections",
          url: "/app/theme",
        },
      ]}
    >
      <BlockStack gap="400">
        {/* Success Banner */}
        {data?.ok && data.intent === "install" && (
          <Banner
            tone="success"
            title={`🎉 Section Added: ${data.sectionName || data.componentId}`}
          >
            <BlockStack gap="200">
              <Text as="p">
                Successfully added to your live theme on the <strong>{data.targetLabel}</strong>.
                All Liquid code, styles, and settings are ready to customize.
              </Text>
              <InlineStack gap="300">
                <Button variant="primary" url={themeEditorUrl} external>
                  Customize in Shopify Theme Editor
                </Button>
                <Button url="/app/theme">
                  View My Added Sections
                </Button>
              </InlineStack>
            </BlockStack>
          </Banner>
        )}

        {/* Error Banner */}
        {data?.error && (
          <Banner tone="critical" title="Could not complete action">
            <p>{data.error}</p>
          </Banner>
        )}

        {/* Search & Placement Controls */}
        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between" blockAlign="center" gap="400">
              <Box minWidth="320px">
                <TextField
                  label="Search sections"
                  labelHidden
                  placeholder="Search by name, feature (e.g. hero, sticky, faq, reviews)..."
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

        {/* Section Count Header */}
        <InlineStack align="space-between" blockAlign="center">
          <Text as="p" tone="subdued">
            Showing <strong>{components.length}</strong> sections
            {category !== "all" && ` in ${CATEGORIES.find((c) => c.id === category)?.label}`}
            {q && ` matching "${q}"`} (from {totalCount} pre-made designs)
          </Text>
          <Text as="p" tone="subdued">
            Active Store: <strong>{shopDomain}</strong>
          </Text>
        </InlineStack>

        {/* Sections Grid */}
        {components.length === 0 ? (
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
          <Layout>
            {components.map((c) => {
              const isInstalling = installingId === c.componentId;
              const isPreviewing = previewingId === c.componentId;
              const name = c.detail?.name || c.componentId.replace(/[-_]/g, " ");
              const settingsCount = c.detail?.settings?.length || 0;

              return (
                <Layout.Section oneHalf key={c.componentId}>
                  <Card>
                    <BlockStack gap="300">
                      <InlineStack align="space-between" blockAlign="start" gap="200">
                        <BlockStack gap="100">
                          <Text as="h2" variant="headingMd" fontWeight="bold">
                            {name}
                          </Text>
                          <InlineStack gap="150" wrap>
                            <Badge tone="info">{c.sectionType}</Badge>
                            {c.visualStyle && <Badge tone="success">{c.visualStyle}</Badge>}
                            {c.family && <Badge>{c.family}</Badge>}
                          </InlineStack>
                        </BlockStack>

                        <Text as="span" variant="bodyXs" tone="subdued">
                          {settingsCount} settings
                        </Text>
                      </InlineStack>

                      <Box
                        background="bg-surface-secondary"
                        padding="300"
                        borderRadius="200"
                      >
                        <InlineStack align="space-between" blockAlign="center">
                          <Text as="span" variant="bodySm" tone="subdued">
                            Ready for Theme Editor customization
                          </Text>
                          <Badge tone="magic">1-Click Install</Badge>
                        </InlineStack>
                      </Box>

                      <Divider />

                      {/* Action Buttons */}
                      <InlineStack align="space-between" blockAlign="center">
                        <Button
                          onClick={() => submitPreview(c)}
                          loading={isPreviewing}
                          disabled={busy}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => submitInstall(c)}
                          loading={isInstalling}
                          disabled={busy}
                        >
                          Add to Store
                        </Button>
                      </InlineStack>
                    </BlockStack>
                  </Card>
                </Layout.Section>
              );
            })}
          </Layout>
        )}

        {/* Live Preview Modal */}
        {activePreview && (
          <Modal
            open={previewModalOpen}
            onClose={() => setPreviewModalOpen(false)}
            title={`Preview: ${activePreview.sectionName || activePreview.componentId}`}
            primaryAction={{
              content: "Add to Live Store",
              onAction: () => {
                setPreviewModalOpen(false);
                const c = components.find((x) => x.componentId === activePreview.componentId);
                if (c) submitInstall(c);
              },
            }}
            secondaryActions={[
              {
                content: "Close",
                onAction: () => setPreviewModalOpen(false),
              },
            ]}
            size="large"
          >
            <Modal.Section>
              <BlockStack gap="300">
                <Text as="p" tone="subdued">
                  Rendered live with your store's catalog in a private preview. Shoppers won't see it until you click "Add to Live Store".
                </Text>
                <Box
                  borderWidth="025"
                  borderColor="border"
                  borderRadius="200"
                  overflowX="hidden"
                >
                  <iframe
                    title="Section Preview"
                    src={activePreview.url}
                    style={{ width: "100%", height: "650px", border: 0, display: "block" }}
                  />
                </Box>
              </BlockStack>
            </Modal.Section>
          </Modal>
        )}
      </BlockStack>
    </Page>
  );
}
