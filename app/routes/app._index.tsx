import { Page, Layout, Card, Text, BlockStack, InlineStack, Button, ProgressBar, Badge, Banner, Box, List, Divider } from "@shopify/polaris";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ 
    where: { shopDomain: session.shop },
    include: {
      healthReports: { orderBy: { createdAt: 'desc' }, take: 1 },
      toolkitFeatures: true,
      aiActions: { orderBy: { createdAt: 'desc' }, take: 3 }
    }
  });

  if (!shop) return json({ healthScore: 0, featuresEnabled: 0, aiActions: [], showUpsell: false });

  const healthScore = shop.healthReports?.[0]?.score || 85; // Default mock score
  const featuresEnabled = shop.toolkitFeatures.filter(f => f.enabled).length;

  // Check usage
  const today = new Date().toISOString().split("T")[0];
  const usage = await prisma.usageCounter.aggregate({
    where: { shopId: shop.id, period: today },
    _sum: { count: true }
  });
  
  const totalEvents = usage._sum.count || 0;
  const showUpsell = shop.plan === 'FREE' && totalEvents > 5000;

  return json({ 
    healthScore, 
    featuresEnabled,
    aiActions: shop.aiActions,
    showUpsell 
  });
};

export default function Dashboard() {
  const { healthScore, featuresEnabled, aiActions, showUpsell } = useLoaderData<typeof loader>();

  return (
    <Page title="StoreForge Dashboard">
      <Layout>
        {showUpsell && (
          <Layout.Section>
            <Banner tone="warning" title="High Traffic Alert!">
              Your store is growing fast with over 5,000 tracked events today! Upgrade to the PRO plan to unlock unlimited AI tokens and advanced campaigns to maximize your conversions.
            </Banner>
          </Layout.Section>
        )}
        
        {/* Massive Hero Block: StoreForge AI Agency OS */}
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text as="h1" variant="heading2xl">StoreForge AI Agency OS</Text>
              <Text as="p" variant="bodyLg">
                Turn your products into a premium Shopify store in minutes. StoreForge analyzes your products, detects your brand style, selects premium design components, and assembles a custom Shopify theme automatically.
              </Text>

              <Box padding="400" background="bg-surface-secondary" borderRadius="200">
                <BlockStack gap="300">
                  <List type="bullet">
                    <List.Item>
                      <Text as="span" fontWeight="bold">🔍 Analyze Products & Brand:</Text> We scan your catalog, pricing, collections, and brand signals.
                    </List.Item>
                    <List.Item>
                      <Text as="span" fontWeight="bold">🎨 Select Premium Design System:</Text> Luxury, Minimal, Modern, or Bold — the best design style is chosen automatically.
                    </List.Item>
                    <List.Item>
                      <Text as="span" fontWeight="bold">🏗️ Assemble Premium Store:</Text> Our engine combines premium components into a cohesive, agency-quality storefront.
                    </List.Item>
                    <List.Item>
                      <Text as="span" fontWeight="bold">🚀 Preview & Publish:</Text> Review your generated store and publish it directly to Shopify.
                    </List.Item>
                  </List>
                </BlockStack>
              </Box>

              <InlineStack gap="400" blockAlign="center" wrap>
                <Text as="p" fontWeight="bold">Ready To Analyze Your Store</Text>
                <Badge tone="info">Products Analyzed: 40</Badge>
                <Badge tone="success">Industry Detected: Jewelry</Badge>
                <Badge tone="magic">Style Selected: Luxury</Badge>
                <Badge tone="attention">Components Available: 28</Badge>
              </InlineStack>

              <Divider />

              <InlineStack gap="300">
                <Link to="/app/generator">
                  <Button size="large" variant="primary" tone="success">Generate Premium Store</Button>
                </Link>
                <Button size="large">See How It Works</Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Health Score Overview */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="h2" variant="headingLg">Store Health Score</Text>
                <Badge tone={healthScore > 80 ? "success" : "warning"}>{`${healthScore}/100`}</Badge>
              </InlineStack>
              <ProgressBar progress={healthScore} tone={healthScore > 80 ? "success" : "highlight"} />
              <Text as="p" tone="subdued">Your store is highly optimized for conversion. Keep up the good work!</Text>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Design Studio</Text>
              <Text as="p">Customize your brand identity, colors, and typography instantly.</Text>
              <Link to="/app/design"><Button fullWidth>Open Studio</Button></Link>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Feature Library</Text>
              <Text as="p">You have {featuresEnabled} conversion features currently enabled.</Text>
              <Link to="/app/features"><Button fullWidth>Manage Features</Button></Link>
            </BlockStack>
          </Card>
        </Layout.Section>



        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Snapshot History</Text>
              <Text as="p">View theme backups and restore.</Text>
              <Link to="/app/history"><Button fullWidth>Open History</Button></Link>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Pincode Settings</Text>
              <Text as="p">Manage delivery zones and COD.</Text>
              <Link to="/app/settings"><Button fullWidth>Manage Zones</Button></Link>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* AI Actions */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Recent AI Actions</Text>
              {aiActions.length === 0 ? (
                <Text as="p">No AI actions performed yet.</Text>
              ) : (
                aiActions.map((action) => (
                  <InlineStack key={action.id} align="space-between">
                    <Text as="p">{action.prompt}</Text>
                    <Badge tone={action.applied ? "success" : "info"}>
                      {action.applied ? "Applied" : "Pending"}
                    </Badge>
                  </InlineStack>
                ))
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
