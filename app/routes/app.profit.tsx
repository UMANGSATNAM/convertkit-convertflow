import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  IndexTable,
  Badge,
  Grid,
  Button
} from "@shopify/polaris";
import { useLoaderData, useSubmit } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { generateMockProfitData } from "../services/profit.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const merchant = await prisma.merchant.findUnique({ where: { shopDomain: session.shop } });
  
  if (!merchant) return { snapshots: [], stats: {} };

  const snapshots = await prisma.profitSnapshot.findMany({
    where: { merchantId: merchant.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  // Calculate Aggregates
  const totalRevenue = snapshots.reduce((acc, s) => acc + s.sellingPrice, 0);
  const totalProfit = snapshots.reduce((acc, s) => acc + s.netProfit, 0);
  const totalAdSpend = snapshots.reduce((acc, s) => acc + s.adSpendAttributed, 0);
  
  const averageMargin = snapshots.length > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const blendedRoas = totalAdSpend > 0 ? (totalRevenue / totalAdSpend) : 0;

  return {
    snapshots: snapshots.map(s => ({
      ...s,
      shopifyOrderId: s.shopifyOrderId.toString(), // Convert BigInt for JSON serialization
      createdAt: s.createdAt.toISOString()
    })),
    stats: {
      totalRevenue,
      totalProfit,
      totalAdSpend,
      averageMargin,
      blendedRoas
    },
    merchantId: merchant.id
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const merchant = await prisma.merchant.findUnique({ where: { shopDomain: session.shop } });
  
  if (merchant) {
    await generateMockProfitData(merchant.id);
  }
  return { success: true };
};

export default function ProfitDashboard() {
  const { snapshots, stats, merchantId } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const handleGenerateData = () => {
    submit({}, { method: "post" });
  };

  const formatMoney = (val: number) => `₹${val.toFixed(2)}`;

  return (
    <Page 
      title="Real-Time Profit Calculator" 
      subtitle="Connect Razorpay, Shiprocket, and Meta Ads to see your true bottom line."
      primaryAction={{
        content: "Integrations",
        onAction: () => console.log("Navigate to Integrations")
      }}
      secondaryActions={[
        {
          content: "Generate Mock Data",
          onAction: handleGenerateData
        }
      ]}
    >
      <BlockStack gap="500">
        <Grid>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 3, xl: 3}}>
            <Card>
              <BlockStack gap="200">
                <Text as="h3" variant="headingSm" tone="subdued">Total Revenue</Text>
                <Text as="p" variant="headingLg">{formatMoney(stats.totalRevenue || 0)}</Text>
              </BlockStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 3, xl: 3}}>
            <Card>
              <BlockStack gap="200">
                <Text as="h3" variant="headingSm" tone="subdued">True Net Profit</Text>
                <Text as="p" variant="headingLg" tone={stats.totalProfit > 0 ? "success" : "critical"}>
                  {formatMoney(stats.totalProfit || 0)}
                </Text>
              </BlockStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 3, xl: 3}}>
            <Card>
              <BlockStack gap="200">
                <Text as="h3" variant="headingSm" tone="subdued">Blended ROAS</Text>
                <Text as="p" variant="headingLg">{stats.blendedRoas?.toFixed(2) || "0.00"}x</Text>
              </BlockStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 3, xl: 3}}>
            <Card>
              <BlockStack gap="200">
                <Text as="h3" variant="headingSm" tone="subdued">Average Margin</Text>
                <Text as="p" variant="headingLg">{stats.averageMargin?.toFixed(1) || "0.0"}%</Text>
              </BlockStack>
            </Card>
          </Grid.Cell>
        </Grid>

        <Card padding="0">
          <IndexTable
            resourceName={{ singular: 'order', plural: 'orders' }}
            itemCount={snapshots.length}
            headings={[
              { title: 'Date' },
              { title: 'Selling Price' },
              { title: 'COGS' },
              { title: 'Shipping' },
              { title: 'PG Fee' },
              { title: 'Ad Spend (CAC)' },
              { title: 'Net Profit', alignment: 'end' },
              { title: 'Margin', alignment: 'end' },
            ]}
            selectable={false}
          >
            {snapshots.map(
              (
                { shopifyOrderId, createdAt, sellingPrice, cogs, shippingCost, pgFee, adSpendAttributed, netProfit, netMarginPct },
                index,
              ) => (
                <IndexTable.Row id={shopifyOrderId} key={shopifyOrderId} position={index}>
                  <IndexTable.Cell>{new Date(createdAt).toLocaleDateString()}</IndexTable.Cell>
                  <IndexTable.Cell>{formatMoney(sellingPrice)}</IndexTable.Cell>
                  <IndexTable.Cell tone="subdued">-{formatMoney(cogs)}</IndexTable.Cell>
                  <IndexTable.Cell tone="subdued">-{formatMoney(shippingCost)}</IndexTable.Cell>
                  <IndexTable.Cell tone="subdued">-{formatMoney(pgFee)}</IndexTable.Cell>
                  <IndexTable.Cell tone="subdued">-{formatMoney(adSpendAttributed)}</IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span" alignment="end" fontWeight="bold" tone={netProfit > 0 ? "success" : "critical"}>
                      {formatMoney(netProfit)}
                    </Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Badge tone={netMarginPct > 15 ? "success" : netMarginPct > 0 ? "warning" : "critical"}>
                        {netMarginPct.toFixed(1)}%
                      </Badge>
                    </div>
                  </IndexTable.Cell>
                </IndexTable.Row>
              ),
            )}
          </IndexTable>
        </Card>
      </BlockStack>
    </Page>
  );
}
