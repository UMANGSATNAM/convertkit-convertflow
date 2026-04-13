import { Page, Layout, Card, Text, BlockStack } from "@shopify/polaris";

export default function Index() {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400" align="center">
              <Text as="h1" variant="headingXl" alignment="center">
                Welcome to ConvertFlow
              </Text>
              <Text as="p" variant="bodyLg" alignment="center" tone="subdued">
                Your landing page engine is ready. More features coming soon.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
