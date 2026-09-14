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
import { ViewIcon } from "@shopify/polaris-icons";
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

  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) return json({ error: "Store not connected." }, { status: 400 });

  try {
    if (intent === "preview") {
      const theme = await ensurePreviewTheme(shop);

      const target =
        sectionType === "header" || sectionType.startsWith("header")
          ? ({ kind: "group", group: "header", replace: "header" } as const)
          : sectionType === "footer" || sectionType.startsWith("footer")
            ? ({ kind: "group", group: "footer", replace: "footer" } as const)
            : targetChoice === "product" || (!targetChoice && sectionType === "product-page")
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
      } else if (targetChoice === "product" || (!targetChoice && sectionType === "product-page")) {
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

    return json({ error: `Unknown intent "${intent}"` }, { status: 400 });
  } catch (err: any) {
    console.error(`[PreMadeSectionsStore] ${intent} failed:`, err);
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
  const [sectionDevice, setSectionDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

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

  const themeEditorUrl = `https://${shopDomain}/admin/themes/current/editor`;

  return (
    <Page
      title="Section Store"
      subtitle="Browse 1,650+ pre-made Shopify sections. Preview any design and add it directly to your store with 1 click."
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
        {/* Success Banner */}
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
                {data.previewUrl && (
                  <Button variant="primary" url={data.previewUrl} external>
                    Preview in Draft Theme
                  </Button>
                )}
                <Button url={data.editorUrl || themeEditorUrl} external>
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

                      {/* PageFly Flow: Preview First as Primary Action */}
                      <InlineStack align="space-between" blockAlign="center">
                        <Button
                          variant="primary"
                          icon={ViewIcon}
                          onClick={() => submitPreview(c)}
                          loading={isPreviewing}
                          disabled={busy}
                        >
                          Preview Section
                        </Button>
                        <Button
                          onClick={() => submitInstall(c, "draft")}
                          loading={isInstalling}
                          disabled={busy}
                        >
                          Quick Add
                        </Button>
                      </InlineStack>
                    </BlockStack>
                  </Card>
                </Layout.Section>
              );
            })}
          </Layout>
        )}

        {/* ── PageFly-Style Section Preview & Submit Modal ── */}
        {activePreview && (
          <Modal
            open={previewModalOpen}
            onClose={() => setPreviewModalOpen(false)}
            title={`Preview: ${activePreview.sectionName || activePreview.componentId}`}
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
                      >
                        Open Full Screen ↗
                      </Button>

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
                    </InlineStack>
                  </InlineStack>
                </Box>

                {/* Status Feedback Banner inside Preview Modal */}
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
