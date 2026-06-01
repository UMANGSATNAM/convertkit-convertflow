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
  const { session } = await authenticate.admin(request);
  
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

  return json({ templates, injectedPages, merchantId: merchant.id });
};

export default function TemplatesPage() {
  const { templates, injectedPages, merchantId } = useLoaderData<typeof loader>();
  const injectFetcher = useFetcher<any>();
  const previewFetcher = useFetcher<any>();
  
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectModalOpen, setInjectModalOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<any>(null);
  const [customTitle, setCustomTitle] = useState("");
  
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
    setInjectModalOpen(true);
  };

  const handleConfirmInject = useCallback(() => {
    if (!activeTemplate || !customTitle) return;
    setIsInjecting(true);
    injectFetcher.submit(
      { templateId: activeTemplate.id, customTitle },
      { method: "post", action: "/api/templates/inject", encType: "application/json" }
    );
  }, [activeTemplate, customTitle, injectFetcher]);

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
        title="Inject Page to Store"
        primaryAction={{
          content: 'Inject Page',
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
              This will create a new page in your Shopify store using the <strong>{activeTemplate?.templateName}</strong> template.
            </Text>
            <TextField
              label="Page Title"
              value={customTitle}
              onChange={setCustomTitle}
              autoComplete="off"
            />
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
