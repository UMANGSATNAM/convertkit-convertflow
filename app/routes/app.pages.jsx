import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  EmptyState,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Pages() {
  return (
    <Page title="Pages">
      <TitleBar title="Pages" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <EmptyState
                heading="Create your first page"
                image="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/empty-state-D_ciB4l_.svg"
              >
                <Text as="p" variant="bodyMd">
                  Build conversion-optimized pages from 8 prebuilt templates. Each page is fully customizable and served through Shopify Online Store 2.0.
                </Text>
                <Button variant="primary">Create Page</Button>
              </EmptyState>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
