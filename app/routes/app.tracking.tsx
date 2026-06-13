import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, Banner, DataTable, Badge, Button, Icon } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { useEffect } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  
  const today = new Date().toISOString().split("T")[0];
  const metrics = await prisma.usageCounter.findMany({
    where: { shopId: shop!.id, period: today },
    orderBy: { count: "desc" }
  });

  return json({ metrics, shopDomain: session.shop });
};

export default function TrackingStatusBoard() {
  const { metrics, shopDomain } = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();

  // Poll for live events every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => revalidate(), 5000);
    return () => clearInterval(interval);
  }, [revalidate]);

  const totalEvents = metrics.reduce((sum, m) => sum + m.count, 0);

  const rows = metrics.map(m => [
    <Badge tone={m.metric.includes("checkout") ? "success" : "info"}>{m.metric}</Badge>,
    m.count.toString()
  ]);

  return (
    <Page title="Tracking & Analytics" subtitle="Live Web Pixel Event Stream">
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <InlineStack gap="400">
              <div style={{ flex: 1 }}>
                <Card>
                  <BlockStack gap="200" align="center">
                    <Text as="h3" variant="headingMd">Total Events Today</Text>
                    <div style={{ fontSize: "36px", fontWeight: "bold", color: "#008060" }}>
                      {totalEvents}
                    </div>
                  </BlockStack>
                </Card>
              </div>
              <div style={{ flex: 1 }}>
                <Card>
                  <BlockStack gap="200" align="center">
                    <Text as="h3" variant="headingMd">Pixel Status</Text>
                    <div style={{ marginTop: "8px" }}>
                      {totalEvents > 0 ? (
                        <Badge tone="success" size="large">Active & Receiving</Badge>
                      ) : (
                        <Badge tone="warning" size="large">Waiting for Events...</Badge>
                      )}
                    </div>
                  </BlockStack>
                </Card>
              </div>
            </InlineStack>

            <Card padding="0">
              <div style={{ padding: "16px", borderBottom: "1px solid #e1e3e5" }}>
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h3" variant="headingMd">Live Event Feed</Text>
                  <Button onClick={() => revalidate()}>Refresh Feed</Button>
                </InlineStack>
              </div>
              
              {metrics.length === 0 ? (
                <div style={{ padding: "32px", textAlign: "center" }}>
                  <Text as="p" tone="subdued">No tracking events received today.</Text>
                </div>
              ) : (
                <DataTable
                  columnContentTypes={["text", "numeric"]}
                  headings={["Event Name", "Count"]}
                  rows={rows}
                />
              )}
            </Card>
          </BlockStack>
        </Layout.Section>
        
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Setup Instructions</Text>
              <Text as="p">
                To start tracking events, you need to enable the **StoreForge Web Pixel** in your Shopify Admin.
              </Text>
              <ol style={{ paddingLeft: "20px", marginTop: "8px" }}>
                <li>Go to Shopify Admin &rarr; Settings</li>
                <li>Click on **Customer Events**</li>
                <li>Click **Add custom pixel** and select StoreForge</li>
                <li>Click **Connect**</li>
              </ol>
              <Banner tone="info">
                Once connected, visit your storefront and refresh this page. You should see events appear instantly!
              </Banner>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
