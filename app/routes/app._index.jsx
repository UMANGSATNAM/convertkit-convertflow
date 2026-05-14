import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Icon,
  Badge,
  Box,
  Divider,
  Grid,
} from "@shopify/polaris";
import {
  ViewIcon,
  CartIcon,
  CashDollarIcon,
  PlusIcon,
  LayoutBlockIcon,
  DomainLandingPageIcon,
} from "@shopify/polaris-icons";
import { useNavigate } from "@remix-run/react";

export default function DashboardHome() {
  const navigate = useNavigate();

  return (
    <Page fullWidth>
      <BlockStack gap="500">
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="200">
            <Text variant="heading3xl" as="h1">
              Welcome to ConvertFlow
            </Text>
            <Text variant="bodyLg" as="p" tone="subdued">
              Your complete OmniCommerce conversion engine. Let's build
              something beautiful today.
            </Text>
          </BlockStack>
          <InlineStack gap="300">
            <Button
              icon={PlusIcon}
              variant="primary"
              onClick={() => navigate("/app/pages")}
            >
              Create Page
            </Button>
            <Button icon={PlusIcon} onClick={() => navigate("/app/bundles")}>
              Create Bundle
            </Button>
          </InlineStack>
        </InlineStack>

        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card padding="400">
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <Text variant="headingSm" tone="subdued">
                    Total Views
                  </Text>
                  <Icon source={ViewIcon} tone="base" />
                </InlineStack>
                <Text variant="heading2xl" as="h2">
                  1.2M
                </Text>
                <Badge tone="success">+14% this week</Badge>
              </BlockStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card padding="400">
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <Text variant="headingSm" tone="subdued">
                    Added to Cart
                  </Text>
                  <Icon source={CartIcon} tone="base" />
                </InlineStack>
                <Text variant="heading2xl" as="h2">
                  84.2K
                </Text>
                <Badge tone="success">+8% this week</Badge>
              </BlockStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card padding="400">
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <Text variant="headingSm" tone="subdued">
                    Conversion Rate
                  </Text>
                  <Icon source={ViewIcon} tone="base" />
                </InlineStack>
                <Text variant="heading2xl" as="h2">
                  4.8%
                </Text>
                <Badge tone="success">+1.2% this week</Badge>
              </BlockStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card padding="400">
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <Text variant="headingSm" tone="subdued">
                    Extra Revenue
                  </Text>
                  <Icon source={CashDollarIcon} tone="base" />
                </InlineStack>
                <Text variant="heading2xl" as="h2">
                  ₹12.4L
                </Text>
                <Badge tone="success">+22% this week</Badge>
              </BlockStack>
            </Card>
          </Grid.Cell>
        </Grid>

        <Layout>
          <Layout.Section>
            <Card padding="0">
              <Box padding="400">
                <Text variant="headingLg" as="h3">
                  Quick Actions
                </Text>
              </Box>
              <Divider />
              <Box padding="400">
                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                    <div
                      onClick={() => navigate("/app/templates")}
                      style={{
                        padding: "24px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        backgroundColor: "#FAFAFA",
                      }}
                    >
                      <BlockStack gap="300">
                        <div
                          style={{
                            padding: "12px",
                            background: "#1A1A1A",
                            borderRadius: "8px",
                            width: "fit-content",
                            color: "white",
                          }}
                        >
                          <Icon source={DomainLandingPageIcon} />
                        </div>
                        <Text variant="headingMd" as="h4">
                          Explore Templates
                        </Text>
                        <Text variant="bodyMd" tone="subdued">
                          Browse 21+ niche-specific, high-conversion layouts.
                        </Text>
                      </BlockStack>
                    </div>
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                    <div
                      onClick={() => navigate("/app/funnels")}
                      style={{
                        padding: "24px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        backgroundColor: "#FAFAFA",
                      }}
                    >
                      <BlockStack gap="300">
                        <div
                          style={{
                            padding: "12px",
                            background: "#FF4F00",
                            borderRadius: "8px",
                            width: "fit-content",
                            color: "white",
                          }}
                        >
                          <Icon source={PlusIcon} />
                        </div>
                        <Text variant="headingMd" as="h4">
                          Build Funnel
                        </Text>
                        <Text variant="bodyMd" tone="subdued">
                          Setup pre/post-purchase upsells to maximize AOV.
                        </Text>
                      </BlockStack>
                    </div>
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                    <div
                      onClick={() => navigate("/app/cro")}
                      style={{
                        padding: "24px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        backgroundColor: "#FAFAFA",
                      }}
                    >
                      <BlockStack gap="300">
                        <div
                          style={{
                            padding: "12px",
                            background: "#00C851",
                            borderRadius: "8px",
                            width: "fit-content",
                            color: "white",
                          }}
                        >
                          <Icon source={ViewIcon} />
                        </div>
                        <Text variant="headingMd" as="h4">
                          CRO Extensions
                        </Text>
                        <Text variant="bodyMd" tone="subdued">
                          Add sticky carts, countdowns, and trust badges.
                        </Text>
                      </BlockStack>
                    </div>
                  </Grid.Cell>
                </Grid>
              </Box>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <Card padding="0">
              <Box padding="400">
                <Text variant="headingLg" as="h3">
                  Recent Activity
                </Text>
              </Box>
              <Divider />
              <Box padding="400">
                <BlockStack gap="400">
                  <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap="300" blockAlign="center">
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          background: "#E5E7EB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon source={LayoutBlockIcon} tone="subdued" />
                      </div>
                      <BlockStack gap="100">
                        <Text variant="bodyMd" fontWeight="semibold">
                          Diwali Sale Landing Page
                        </Text>
                        <Text variant="bodySm" tone="subdued">
                          Published 2 hours ago
                        </Text>
                      </BlockStack>
                    </InlineStack>
                    <Badge tone="success">Active</Badge>
                  </InlineStack>

                  <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap="300" blockAlign="center">
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          background: "#E5E7EB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon source={CartIcon} tone="subdued" />
                      </div>
                      <BlockStack gap="100">
                        <Text variant="bodyMd" fontWeight="semibold">
                          Skincare Routine Bundle
                        </Text>
                        <Text variant="bodySm" tone="subdued">
                          Updated yesterday
                        </Text>
                      </BlockStack>
                    </InlineStack>
                    <Badge tone="success">Active</Badge>
                  </InlineStack>
                </BlockStack>
              </Box>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
