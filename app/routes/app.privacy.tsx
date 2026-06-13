import { Page, Layout, Card, Text, BlockStack, List } from "@shopify/polaris";

export default function PrivacyPolicy() {
  return (
    <Page title="Privacy Policy & Terms of Service">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Privacy Policy</Text>
              <Text as="p">
                This Privacy Policy describes how StoreForge collects, uses, and shares information when you install or use the App in connection with your Shopify-supported store.
              </Text>
              <Text as="h3" variant="headingSm">Information We Collect</Text>
              <List type="bullet">
                <List.Item>Store Information (Domain, ID, Plan)</List.Item>
                <List.Item>Aggregated, anonymized tracking metrics for usage-based billing</List.Item>
              </List>
              <Text as="p">
                We do <strong>not</strong> collect or store Personally Identifiable Information (PII) of your customers.
              </Text>

              <Text as="h3" variant="headingSm">Data Redaction</Text>
              <Text as="p">
                Upon uninstallation of the app, all your store data, including generated campaigns and AI logs, are deleted from our servers within 48 hours to comply with GDPR requirements.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Terms of Service</Text>
              <Text as="p">
                By using StoreForge, you agree to our terms. StoreForge provides AI-generated theme modifications. You are responsible for reviewing all changes before publishing them to your live store.
              </Text>
              <Text as="p">
                Subscriptions are managed via the Shopify Billing API. Usage limits apply to the Free plan.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
