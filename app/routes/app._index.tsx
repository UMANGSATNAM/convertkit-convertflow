import { Page, Layout, Card, Text, BlockStack, InlineStack, Button } from "@shopify/polaris";
import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <Page title="StoreForge Dashboard">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingLg">Welcome to StoreForge</Text>
              <Text as="p">Your all-in-one platform for a completely code-free, highly converting Shopify store.</Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Generate Store</Text>
              <Text as="p">Build a complete store in minutes.</Text>
              <Link to="/app/generate"><Button fullWidth>Open Generator</Button></Link>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Design Studio</Text>
              <Text as="p">Customize your theme live.</Text>
              <Link to="/app/design"><Button fullWidth>Open Studio</Button></Link>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Campaign Builder</Text>
              <Text as="p">Launch festive & sale campaigns.</Text>
              <Link to="/app/campaigns"><Button fullWidth>Open Builder</Button></Link>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Conversion Toolkit</Text>
              <Text as="p">Boost sales with 8 premium tools.</Text>
              <Link to="/app/toolkit"><Button fullWidth>Open Toolkit</Button></Link>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">AI Assistant</Text>
              <Text as="p">Talk to StoreForge to get things done.</Text>
              <Link to="/app/assistant"><Button fullWidth>Chat Now</Button></Link>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Integrations & Billing</Text>
              <Text as="p">Manage plans and pixels.</Text>
              <Link to="/app/integrations"><Button fullWidth>Manage</Button></Link>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
