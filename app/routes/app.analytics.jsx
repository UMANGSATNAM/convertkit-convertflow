import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Badge,
  DataTable,
  InlineGrid,
  Box
} from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  const shop = await prisma.shop.findUnique({
    where: { shopDomain },
    select: { id: true }
  });

  if (!shop) return { events: [], metrics: { views: 0, interactions: 0, carts: 0 } };

  // Fetch recent events
  const events = await prisma.analyticsEvent.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  // Calculate simple metrics using aggregation
  const viewCount = await prisma.analyticsEvent.count({
    where: { shopId: shop.id, eventType: 'pageview' }
  });
  
  const interactionCount = await prisma.analyticsEvent.count({
    where: { shopId: shop.id, eventType: 'feature_interact' }
  });

  const cartCount = await prisma.analyticsEvent.count({
    where: { shopId: shop.id, eventType: 'add_to_cart' }
  });

  return {
    events,
    metrics: {
      views: viewCount,
      interactions: interactionCount,
      carts: cartCount
    }
  };
};

export default function Analytics() {
  const { events, metrics } = useLoaderData();

  const rows = events.map(evt => [
    new Date(evt.createdAt).toLocaleString(),
    <Badge tone={evt.eventType === 'add_to_cart' ? 'success' : 'info'}>{evt.eventType}</Badge>,
    evt.featureName || '-',
    evt.value ? `$${evt.value}` : '-'
  ]);

  return (
    <Page title="Analytics">
      <TitleBar title="Revenue Attribution Analytics" />
      <BlockStack gap="500">
        
        {/* KPI Cards */}
        <InlineGrid columns={{ xs: 1, md: 3 }} gap="400">
          <Card>
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm" tone="subdued">Total Pageviews</Text>
              <Text as="p" variant="headingLg">{metrics.views}</Text>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm" tone="subdued">Widget Interactions</Text>
              <Text as="p" variant="headingLg">{metrics.interactions}</Text>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm" tone="subdued">Add to Carts tracked</Text>
              <Text as="p" variant="headingLg">{metrics.carts}</Text>
            </BlockStack>
          </Card>
        </InlineGrid>

        {/* Data Table */}
        <Card padding="0">
          <Box padding="400">
            <Text as="h2" variant="headingMd">Recent Activity</Text>
          </Box>
          <DataTable
            columnContentTypes={['text', 'text', 'text', 'numeric']}
            headings={['Date', 'Event Type', 'Feature Name', 'Value']}
            rows={rows.length > 0 ? rows : [['No data yet', '-', '-', '-']]}
          />
        </Card>

      </BlockStack>
    </Page>
  );
}
