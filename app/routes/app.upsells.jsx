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

export default function Upsells() {
  return (
    <Page title="Upsells">
      <TitleBar title="Upsell Engine" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <EmptyState
                heading="Set up your upsell engine"
                image="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/empty-state-D_ciB4l_.svg"
              >
                <Text as="p" variant="bodyMd">
                  Configure in-cart upsell popups, post-purchase pages, bundle builders, and frequently bought together widgets.
                </Text>
                <Button variant="primary">Create Upsell Rule</Button>
              </EmptyState>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
