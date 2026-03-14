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

export default function Reviews() {
  return (
    <Page title="Reviews">
      <TitleBar title="AI Review Writing" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <EmptyState
                heading="Collect better reviews automatically"
                image="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/empty-state-D_ciB4l_.svg"
              >
                <Text as="p" variant="bodyMd">
                  Send automated review request emails after delivery. AI helps customers write better, more detailed reviews.
                </Text>
                <Button variant="primary">Set Up Review Requests</Button>
              </EmptyState>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
