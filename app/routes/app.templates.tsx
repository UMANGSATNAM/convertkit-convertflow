import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  ResourceList,
  ResourceItem,
  Text,
  Badge,
  Button,
  InlineStack,
  BlockStack,
  Modal,
  TextField,
  Select,
  Grid
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }: any) => {
  const { admin, session } = await authenticate.admin(request);
  
  // Find merchant
  let merchant = await prisma.merchant.findUnique({
    where: { shopDomain: session.shop }
  });

  // Fallback for dev - auto create merchant if not exists
  if (!merchant) {
    merchant = await prisma.merchant.create({
      data: {
        shopDomain: session.shop,
        accessToken: session.accessToken || "",
      }
    });
  }

  const templates = await prisma.pageTemplate.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  const injectedPages = await prisma.injectedPage.findMany({
    where: { merchantId: merchant.id },
    include: { template: true },
    orderBy: { createdAt: 'desc' }
  });

  let themes = [];
  try {
    const themesResponse = await admin.rest.resources.Theme.all({ session });
    themes = themesResponse.data.map((t: any) => ({
      id: t.id,
      name: t.name,
      role: t.role
    }));
  } catch (error) {
    console.error("Failed to fetch themes", error);
  }

  return json({ templates, injectedPages, merchantId: merchant.id, themes });
};

export default function TemplatesPage() {
  const { templates, injectedPages, merchantId, themes } = useLoaderData<typeof loader>();
  const injectFetcher = useFetcher<any>();
  const previewFetcher = useFetcher<any>();
  
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectModalOpen, setInjectModalOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<any>(null);
  const [customTitle, setCustomTitle] = useState("");
  
  // Theme Injection states
  const [targetThemeId, setTargetThemeId] = useState<string>("");
  const [targetPageType, setTargetPageType] = useState<string>("custom");

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<any>(null);
  const [isPreviewGenerating, setIsPreviewGenerating] = useState(false);
  const [previewLiveUrl, setPreviewLiveUrl] = useState<string | null>(null);

  const handlePreviewClick = (template: any) => {
    setActivePreviewTemplate(template);
    setPreviewModalOpen(true);
    setIsPreviewGenerating(true);
    setPreviewLiveUrl(null);
    previewFetcher.submit(
      { templateId: template.id, customTitle: `Preview - ${template.templateName}` },
      { method: "post", action: "/api/templates/inject", encType: "application/json" }
    );
  };

  const filteredTemplates = templates.filter((t: any) => {
    if (selectedNiche !== "all" && t.niche !== selectedNiche) return false;
    if (selectedType !== "all" && t.pageType !== selectedType) return false;
    return true;
  });

  const niches = [
    { label: "All Niches", value: "all" },
    { label: "Jewellery", value: "jewellery" },
    { label: "Grooming", value: "grooming" },
    { label: "Fashion", value: "fashion" },
    { label: "Beauty", value: "beauty" },
    { label: "Food", value: "food" },
    { label: "Home Decor", value: "home-decor" },
    { label: "Fitness", value: "fitness" },
    { label: "Pets", value: "pets" },
  ];

  const types = [
    { label: "All Types", value: "all" },
    { label: "Homepage", value: "homepage" },
    { label: "Product Page", value: "product" },
    { label: "Collection Page", value: "collection" },
    { label: "About Page", value: "about" },
    { label: "Landing Page", value: "landing" },
  ];

  const handleInjectClick = (template: any) => {
    setActiveTemplate(template);
    setCustomTitle(template.templateName);
    
    // Default to the active theme if possible
    const activeTheme = themes?.find((t: any) => t.role === 'main');
    if (activeTheme) {
      setTargetThemeId(activeTheme.id.toString());
    } else if (themes?.length > 0) {
      setTargetThemeId(themes[0].id.toString());
    }
    setTargetPageType("custom");
    
    setInjectModalOpen(true);
  };

  const handleConfirmInject = useCallback(() => {
    if (!activeTemplate || !targetThemeId) return;
    setIsInjecting(true);
    injectFetcher.submit(
      { 
        templateId: activeTemplate.id, 
        customTitle: targetPageType === "custom" ? customTitle : "",
        targetThemeId,
        targetPageType
      },
      { method: "post", action: "/api/templates/inject", encType: "application/json" }
    );
  }, [activeTemplate, customTitle, targetThemeId, targetPageType, injectFetcher]);

  // Handle inject fetcher success
  if (injectFetcher.state === "idle" && injectFetcher.data && isInjecting) {
    setIsInjecting(false);
    setInjectModalOpen(false);
    if (injectFetcher.data.success) {
      shopify.toast.show("Page is live!");
    } else {
      shopify.toast.show(injectFetcher.data.error || "Injection failed", { isError: true });
    }
  }

  // Handle preview fetcher success
  if (previewFetcher.state === "idle" && previewFetcher.data && isPreviewGenerating) {
    setIsPreviewGenerating(false);
    if (previewFetcher.data.success) {
      setPreviewLiveUrl(previewFetcher.data.liveUrl);
    } else {
      shopify.toast.show("Preview generation failed: " + previewFetcher.data.error, { isError: true });
      setPreviewModalOpen(false);
    }
  }

  return (
    <Page title="Page Templates">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack gap="400">
                <Select
                  label="Filter by Niche"
                  options={niches}
                  onChange={setSelectedNiche}
                  value={selectedNiche}
                />
                <Select
                  label="Filter by Page Type"
                  options={types}
                  onChange={setSelectedType}
                  value={selectedType}
                />
              </InlineStack>

              <Grid>
                {filteredTemplates.map((template: any) => (
                  <Grid.Cell key={template.id} columnSpan={{xs: 6, sm: 6, md: 4, lg: 4, xl: 3}}>
                    <Card padding="0">
                      {template.previewImageUrl && (
                        <img 
                          src={template.previewImageUrl} 
                          alt={template.templateName} 
                          style={{width: '100%', height: '150px', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}} 
                        />
                      )}
                      <div style={{padding: '16px'}}>
                        <BlockStack gap="200">
                          <Text variant="headingMd" as="h3">{template.templateName}</Text>
                          <InlineStack gap="200">
                            <Badge tone="info">{template.niche}</Badge>
                            <Badge>{template.pageType}</Badge>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">{template.description}</Text>
                          <InlineStack gap="200" wrap={false}>
                            <div style={{ flex: 1 }}>
                              <Button fullWidth onClick={() => handlePreviewClick(template)}>Preview</Button>
                            </div>
                            <div style={{ flex: 1 }}>
                              <Button fullWidth variant="primary" onClick={() => handleInjectClick(template)}>Add to Store</Button>
                            </div>
                          </InlineStack>
                        </BlockStack>
                      </div>
                    </Card>
                  </Grid.Cell>
                ))}
              </Grid>
              {filteredTemplates.length === 0 && (
                <div style={{textAlign: 'center', padding: '40px'}}>
                  <Text variant="bodyMd" as="p" tone="subdued">No templates found for this filter.</Text>
                </div>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <Text variant="headingLg" as="h2">My Injected Pages</Text>
            {injectedPages.length > 0 ? (
              <ResourceList
                resourceName={{ singular: 'page', plural: 'pages' }}
                items={injectedPages}
                renderItem={(item: any) => {
                  const { id, pageTitle, status, shopifyPageHandle, template } = item;
                  return (
                    <ResourceItem
                      id={id}
                      url={`https://admin.shopify.com/store/placeholder/pages/${item.shopifyPageId}`} // Note: use actual admin url in prod
                      accessibilityLabel={`View details for ${pageTitle}`}
                    >
                      <InlineStack align="space-between">
                        <BlockStack gap="100">
                          <Text variant="bodyMd" fontWeight="bold" as="h3">
                            {pageTitle}
                          </Text>
                          <Text variant="bodySm" as="p" tone="subdued">
                            From template: {template.templateName}
                          </Text>
                        </BlockStack>
                        <InlineStack gap="200" align="center">
                          <Badge tone={status === 'published' ? 'success' : 'attention'}>{status}</Badge>
                          <Button url={`/pages/${shopifyPageHandle}`} external>View Live</Button>
                        </InlineStack>
                      </InlineStack>
                    </ResourceItem>
                  );
                }}
              />
            ) : (
              <div style={{padding: '20px 0'}}>
                <Text variant="bodyMd" as="p" tone="subdued">You haven't injected any pages yet.</Text>
              </div>
            )}
          </Card>
        </Layout.Section>
      </Layout>

      <Modal
        open={injectModalOpen}
        onClose={() => setInjectModalOpen(false)}
        title="Inject Template to Store"
        primaryAction={{
          content: 'Inject Template',
          onAction: handleConfirmInject,
          loading: isInjecting,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setInjectModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Text as="p" variant="bodyMd">
              You are about to inject the <strong>{activeTemplate?.templateName}</strong> template. Where should this template be injected?
            </Text>

            <Select
              label="Target Theme"
              options={(themes || []).map((t: any) => ({
                label: `${t.name} (${t.role})`,
                value: t.id.toString(),
              }))}
              onChange={setTargetThemeId}
              value={targetThemeId}
            />

            <Select
              label="Target Page"
              options={[
                { label: "Homepage (index.json)", value: "index" },
                { label: "Default Product (product.json)", value: "product" },
                { label: "Default Collection (collection.json)", value: "collection" },
                { label: "Custom Page (page.custom.json)", value: "custom" },
              ]}
              onChange={setTargetPageType}
              value={targetPageType}
            />

            {targetPageType === "custom" && (
              <TextField
                label="Custom Page Title"
                value={customTitle}
                onChange={setCustomTitle}
                autoComplete="off"
                helpText="This will create a brand new page rather than overwriting a core template."
              />
            )}
            
            {targetPageType !== "custom" && (
              <Banner tone="warning">
                This will safely back up and overwrite your existing {targetPageType}.json in the selected theme.
              </Banner>
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>
      <Modal
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title={activePreviewTemplate?.templateName || "Template Preview"}
        size="large"
      >
        <Modal.Section>
          {activePreviewTemplate && (
            <BlockStack gap="400">
              {isPreviewGenerating ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <Text variant="headingMd" as="h3">Generating your Live Preview...</Text>
                  <Text variant="bodyMd" as="p" tone="subdued">We are creating a real page on your store.</Text>
                </div>
              ) : previewLiveUrl ? (
                <div style={{ width: '100%', height: '70vh', borderRadius: '8px', overflow: 'hidden', border: '1px solid #dfe3e8' }}>
                  <iframe 
                    src={previewLiveUrl} 
                    title="Live Preview" 
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  />
                </div>
              ) : (
                <>
                  {activePreviewTemplate.previewImageUrl && (
                    <img 
                      src={activePreviewTemplate.previewImageUrl} 
                      alt="Preview" 
                      style={{ width: '100%', borderRadius: '8px', maxHeight: '400px', objectFit: 'cover' }} 
                    />
                  )}
                  <Text variant="headingMd" as="h3">Included Sections Layout</Text>
                  <ResourceList
                    resourceName={{ singular: 'section', plural: 'sections' }}
                    items={activePreviewTemplate.sectionsConfig?.order || []}
                    renderItem={(sectionId: string) => {
                      const sectionData = activePreviewTemplate.sectionsConfig?.sections?.[sectionId as any];
                      return (
                        <ResourceItem id={sectionId as string} url="#" onClick={() => {}}>
                          <Text variant="bodyMd" fontWeight="bold" as="h3">
                            {sectionData?.type ? sectionData.type.replace(/-/g, ' ').toUpperCase() : sectionId}
                          </Text>
                        </ResourceItem>
                      );
                    }}
                  />
                </>
              )}
            </BlockStack>
          )}
        </Modal.Section>
      </Modal>
    </Page>
  );
}
