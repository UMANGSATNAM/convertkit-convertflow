import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Badge,
  Button,
  EmptyState,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function ConvertFlow() {
  return (
    <Page title="ConvertFlow">
      <TitleBar title="ConvertFlow - Liquid Extraction Engine" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <Badge tone="success">Pro Feature</Badge>
                <EmptyState
                  heading="Extract production-ready Liquid code"
                  image="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/empty-state-D_ciB4l_.svg"
                >
                  <Text as="p" variant="bodyMd">
                    ConvertFlow reads your connected Shopify theme via the Admin API. Select any section, click Extract, and get production-ready Liquid, CSS, and JSON schema in under 5 seconds.
                  </Text>
                  <Button variant="primary">Open ConvertFlow</Button>
                </EmptyState>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
