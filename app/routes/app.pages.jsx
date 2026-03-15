import {
  Page,
  Card,
  BlockStack,
  Text,
  Button,
  Grid,
  Box,
  InlineStack,
  Badge,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

const TEMPLATES = [
  { id: "about_us", title: "About Us", description: "Tell your brand story and build trust.", icon: "📝" },
  { id: "contact", title: "Contact Us", description: "Standard contact page with support details.", icon: "☎️" },
  { id: "faq", title: "FAQ", description: "Reduce support tickets with common questions.", icon: "❓" },
  { id: "shipping", title: "Shipping Policy", description: "Clear expectations on delivery times.", icon: "🚚" },
  { id: "track_order", title: "Track Your Order", description: "Embed a tracking widget for post-purchase.", icon: "📦" },
  { id: "returns", title: "Returns & Refunds", description: "Your 30-day money-back guarantee policy.", icon: "🔄" },
  { id: "size_guide", title: "Size Guide", description: "Sizing table to reduce apparel returns.", icon: "📏" },
  { id: "tos", title: "Terms of Service", description: "Standard legal boilerplate for ecommerce.", icon: "⚖️" }
];

export default function Pages() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        shopify.toast.show(`Page published: ${fetcher.data.page.title}`);
      } else if (fetcher.data.error) {
        shopify.toast.show(`Error: ${fetcher.data.error}`, { isError: true });
      }
    }
  }, [fetcher.state, fetcher.data, shopify]);

  const handlePublish = (templateId) => {
    fetcher.submit(
      { templateId },
      { method: "POST", action: "/api/page-publish" }
    );
  };

  return (
    <Page title="Pages">
      <TitleBar title="Prebuilt Pages" />
      <BlockStack gap="500">
        <Box paddingBlockEnd="400">
          <Text as="p" variant="bodyMd" tone="subdued">
            Instantly publish high-converting foundational pages to your Shopify store. These templates follow ecommerce best practices.
          </Text>
        </Box>

        <Grid>
          {TEMPLATES.map((template) => (
            <Grid.Cell key={template.id} columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3, xl: 3 }}>
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="span" variant="headingLg">{template.icon}</Text>
                    <Badge tone="success">Optimized</Badge>
                  </InlineStack>
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingMd">
                      {template.title}
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      {template.description}
                    </Text>
                  </BlockStack>
                  <Button
                    onClick={() => handlePublish(template.id)}
                    loading={fetcher.state !== "idle" && fetcher.formData?.get("templateId") === template.id}
                    fullWidth
                  >
                    Publish to Store
                  </Button>
                </BlockStack>
              </Card>
            </Grid.Cell>
          ))}
        </Grid>
      </BlockStack>
    </Page>
  );
}
