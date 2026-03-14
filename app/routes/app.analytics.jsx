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

export default function Analytics() {
  return (
    <Page title="Analytics">
      <TitleBar title="Revenue Attribution Analytics" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <EmptyState
                heading="Analytics will appear here"
                image="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/empty-state-D_ciB4l_.svg"
              >
                <Text as="p" variant="bodyMd">
                  Once your features are active, you will see conversion rate tracking, feature performance reports, and revenue attribution data.
                </Text>
              </EmptyState>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
