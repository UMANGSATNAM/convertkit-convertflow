import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  InlineStack,
  Banner,
  Badge,
  Divider,
  List,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  return json({
    shop: session.shop,
    installedAt: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  });
};

export default function Index() {
  const { shop, installedAt } = useLoaderData<typeof loader>();

  return (
    <Page>
      <TitleBar title="Hello World" />
      <BlockStack gap="500">
        <Banner
          title="Fresh Clean Shopify App Initialized"
          tone="success"
        >
          <p>
            Your Shopify Remix application is in a pristine, clean state.
            Legacy files, old database tables, and unused routes have been wiped.
          </p>
        </Banner>

        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <Text as="h2" variant="headingMd">
                    👋 Welcome to your Fresh Shopify App
                  </Text>
                  <Badge tone="success">Status: Healthy</Badge>
                </InlineStack>

                <Text as="p" variant="bodyMd" tone="subdued">
                  Connected Store: <strong>{shop}</strong> • Verified on {installedAt}
                </Text>

                <Divider />

                <Text as="h3" variant="headingSm">
                  Current Architecture:
                </Text>

                <List type="bullet">
                  <List.Item>
                    <strong>Shopify App Remix:</strong> Modern App Bridge v4 + Polaris v12 interface.
                  </List.Item>
                  <List.Item>
                    <strong>Fresh Database:</strong> Clean Prisma Session schema synced with MySQL.
                  </List.Item>
                  <List.Item>
                    <strong>Zero Bloat:</strong> All old templates, landing pages, and legacy scripts removed.
                  </List.Item>
                  <List.Item>
                    <strong>Ready for PageFly Builder:</strong> Clean foundation ready for your visual page builder implementation.
                  </List.Item>
                </List>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Store Context
                </Text>
                <Text as="p" variant="bodySm">
                  Store Domain:
                </Text>
                <Badge tone="info">{shop}</Badge>
                <Divider />
                <Text as="p" variant="bodySm" tone="subdued">
                  API Credentials (.env &amp; shopify.app.toml) are preserved and ready for live or local development.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
