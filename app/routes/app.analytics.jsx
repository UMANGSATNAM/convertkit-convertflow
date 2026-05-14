import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Box,
  Grid,
  Divider,
  Badge,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = await db.shop.findUnique({
    where: { shopDomain: session.shop },
  });
  if (!shop) return json({ stats: null });

  const bundles = await db.bundle.findMany({ where: { shopId: shop.id } });
  const funnels = await db.funnel.findMany({ where: { shopId: shop.id } });
  const croWidgets = await db.croWidget.findMany({
    where: { shopId: shop.id },
  });

  const totalBundleRevenue = bundles.reduce(
    (acc, b) => acc + Number(b.generatedRevenue || 0),
    0,
  );
  const totalFunnelRevenue = funnels.reduce(
    (acc, f) => acc + Number(f.generatedRevenue || 0),
    0,
  );
  const totalRevenue = totalBundleRevenue + totalFunnelRevenue;

  const totalCroViews = croWidgets.reduce(
    (acc, w) => acc + Number(w.views || 0),
    0,
  );
  const totalCroClicks = croWidgets.reduce(
    (acc, w) => acc + Number(w.clicks || 0),
    0,
  );

  const activeAssets =
    bundles.filter((b) => b.status === "active").length +
    funnels.filter((f) => f.status === "active").length +
    croWidgets.filter((w) => w.status === "active").length;

  return json({
    stats: {
      totalRevenue,
      totalCroViews,
      totalCroClicks,
      activeAssets,
    },
  });
};

export default function Analytics() {
  const { stats } = useLoaderData();

  if (!stats) {
    return (
      <Page title="Analytics">
        <Card padding="400">
          <Text variant="bodyMd">Loading stats...</Text>
        </Card>
      </Page>
    );
  }

  return (
    <Page
      fullWidth
      title="Analytics Dashboard"
      subtitle="Track the performance and ROI of your active conversion assets."
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card padding="0">
              <Box padding="400">
                <Text variant="headingLg" as="h2">
                  Overview (All Time)
                </Text>
              </Box>
              <Divider />
              <Box padding="400">
                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                    <BlockStack gap="200">
                      <Text variant="bodyMd" tone="subdued">
                        ConvertFlow Revenue Generated
                      </Text>
                      <Text variant="heading3xl" as="h2">
                        ₹{stats.totalRevenue.toLocaleString("en-IN")}
                      </Text>
                      <Text variant="bodySm" tone="success">
                        Attributed directly to bundles & funnels
                      </Text>
                    </BlockStack>
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                    <BlockStack gap="200">
                      <Text variant="bodyMd" tone="subdued">
                        CRO Widget Views
                      </Text>
                      <Text variant="heading3xl" as="h2">
                        {stats.totalCroViews.toLocaleString()}
                      </Text>
                      <Text variant="bodySm" tone="subdued">
                        Total impressions across all widgets
                      </Text>
                    </BlockStack>
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                    <BlockStack gap="200">
                      <Text variant="bodyMd" tone="subdued">
                        CRO Widget Clicks
                      </Text>
                      <Text variant="heading3xl" as="h2">
                        {stats.totalCroClicks.toLocaleString()}
                      </Text>
                      <Text variant="bodySm" tone="subdued">
                        Interactions from widgets
                      </Text>
                    </BlockStack>
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                    <BlockStack gap="200">
                      <Text variant="bodyMd" tone="subdued">
                        Active Assets
                      </Text>
                      <Text variant="heading3xl" as="h2">
                        {stats.activeAssets}
                      </Text>
                      <Text variant="bodySm" tone="subdued">
                        Running campaigns
                      </Text>
                    </BlockStack>
                  </Grid.Cell>
                </Grid>
              </Box>
            </Card>

            <Card padding="0">
              <Box padding="400">
                <Text variant="headingLg" as="h2">
                  Performance Details
                </Text>
              </Box>
              <Divider />
              <Box padding="800">
                <BlockStack gap="400" inlineAlign="center">
                  <Text variant="headingMd" tone="subdued">
                    Advanced Reporting
                  </Text>
                  <Text variant="bodyMd" tone="subdued">
                    More detailed charts and date-range filtering are being
                    generated as your traffic scales.
                  </Text>
                </BlockStack>
              </Box>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
