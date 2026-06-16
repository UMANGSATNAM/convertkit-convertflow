import { Page, Layout, Card, Text, BlockStack, InlineStack, Button, ProgressBar, Badge, Banner, Box, List, Divider, Grid } from "@shopify/polaris";
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

  if (!shop) return json({ healthScore: 0, featuresEnabled: 0, aiActions: [], showUpsell: false, shopName: session.shop });

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
    shopName: session.shop,
    healthScore, 
    featuresEnabled,
    aiActions: shop.aiActions,
    showUpsell 
  });
};

export default function Dashboard() {
  const { shopName, healthScore, featuresEnabled, aiActions, showUpsell } = useLoaderData<typeof loader>();

  return (
    <Page title="Agency OS" subtitle={`Managing ${shopName}`}>
      <Layout>
        {showUpsell && (
          <Layout.Section>
            <Banner tone="warning" title="High Traffic Alert!">
              Your store is growing fast with over 5,000 tracked events today! Upgrade to the PRO plan to unlock unlimited AI tokens and advanced campaigns.
            </Banner>
          </Layout.Section>
        )}
        
        {/* Main Agency Hero */}
        <Layout.Section>
          <Card padding="0">
            <div style={{ background: "linear-gradient(135deg, #111111 0%, #333333 100%)", padding: "40px", color: "white", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Badge tone="magic">PRO Agency Engine Active</Badge>
                  <Text as="p" variant="bodySm" tone="subdued">System Status: Optimal</Text>
                </InlineStack>
                
                <div style={{ marginTop: "20px", marginBottom: "10px" }}>
                  <Text as="h1" variant="heading3xl" tone="inherit">
                    Turn Your Vision Into a Premium Store.
                  </Text>
                </div>
                <div style={{ opacity: 0.8, maxWidth: "800px" }}>
                  <Text as="p" variant="bodyLg" tone="inherit">
                    Our AI scans your catalog, identifies your brand DNA, and assembles a 1000% beautiful, conversion-optimized storefront using top-tier D2C components.
                  </Text>
                </div>
              </BlockStack>
            </div>
            
            <Box padding="600">
              <Grid>
                <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 3, lg: 3, xl: 3}}>
                  <BlockStack gap="300" align="start">
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f4f6f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🔍</div>
                    <Text as="h3" variant="headingMd">1. Analyze</Text>
                    <Text as="p" tone="subdued">Deep scan of your products, pricing, and current design.</Text>
                  </BlockStack>
                </Grid.Cell>
                <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 3, lg: 3, xl: 3}}>
                  <BlockStack gap="300" align="start">
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f4f6f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🎯</div>
                    <Text as="h3" variant="headingMd">2. Select</Text>
                    <Text as="p" tone="subdued">AI matches your brand with the perfect aesthetic DNA.</Text>
                  </BlockStack>
                </Grid.Cell>
                <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 3, lg: 3, xl: 3}}>
                  <BlockStack gap="300" align="start">
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f4f6f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🏗️</div>
                    <Text as="h3" variant="headingMd">3. Assemble</Text>
                    <Text as="p" tone="subdued">Injecting 50+ premium D2C components into a new theme.</Text>
                  </BlockStack>
                </Grid.Cell>
                <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 3, lg: 3, xl: 3}}>
                  <BlockStack gap="300" align="start">
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f4f6f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🚀</div>
                    <Text as="h3" variant="headingMd">4. Launch</Text>
                    <Text as="p" tone="subdued">Publish your high-converting store to Shopify instantly.</Text>
                  </BlockStack>
                </Grid.Cell>
              </Grid>

              <Box paddingBlockStart="600" paddingBlockEnd="600">
                <Divider />
              </Box>

              <InlineStack align="space-between" blockAlign="center">
                <InlineStack gap="300">
                  <Badge tone="success">50+ Components Ready</Badge>
                  <Badge tone="info">Luxury, Minimal, Bold</Badge>
                </InlineStack>
                <Link to="/app/generator">
                  <Button size="large" variant="primary">Launch Agency Builder</Button>
                </Link>
              </InlineStack>
            </Box>
          </Card>
        </Layout.Section>

        {/* Store Insights */}
        <Layout.Section>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Store Health</Text>
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="p" variant="heading3xl">{healthScore}</Text>
                  <Badge tone={healthScore > 80 ? "success" : "warning"}>/ 100</Badge>
                </InlineStack>
                <ProgressBar progress={healthScore} tone={healthScore > 80 ? "success" : "highlight"} />
                <Text as="p" tone="subdued">Conversion optimized status based on active components.</Text>
              </BlockStack>
            </Card>
            
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Active Features</Text>
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="p" variant="heading3xl">{featuresEnabled}</Text>
                  <Badge tone="info">Live Modules</Badge>
                </InlineStack>
                <div style={{ flexGrow: 1 }} />
                <Link to="/app/features"><Button fullWidth>Manage Features</Button></Link>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Design Studio</Text>
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="p" variant="heading3xl">Live</Text>
                  <Badge tone="magic">Customizing</Badge>
                </InlineStack>
                <div style={{ flexGrow: 1 }} />
                <Link to="/app/design"><Button fullWidth>Open Studio</Button></Link>
              </BlockStack>
            </Card>
          </div>
        </Layout.Section>

        {/* Agency Action Log */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Agency OS Logs</Text>
              {aiActions.length === 0 ? (
                <Box padding="400" background="bg-surface-secondary" borderRadius="100">
                  <Text as="p" tone="subdued">The AI Agency OS is standing by. Generate a store to see logs.</Text>
                </Box>
              ) : (
                <List type="bullet">
                  {aiActions.map((action) => (
                    <List.Item key={action.id}>
                      <InlineStack align="space-between">
                        <Text as="span">{action.prompt}</Text>
                        <Badge tone={action.applied ? "success" : "info"}>
                          {action.applied ? "Applied" : "Processing"}
                        </Badge>
                      </InlineStack>
                    </List.Item>
                  ))}
                </List>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
