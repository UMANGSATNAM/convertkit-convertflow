import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  InlineStack,
  Badge,
  Button,
  InlineGrid,
  Box,
  Divider,
  Banner,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate, PLAN_PRO, PLAN_ENTERPRISE } from "../shopify.server";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const billingCheck = await billing.check();

  const activeSubs = billingCheck?.appSubscriptions || [];
  const currentPlan = activeSubs.length > 0 ? activeSubs[0]?.name : "Free";

  return json({ currentPlan, PLAN_PRO, PLAN_ENTERPRISE });
};

export const action = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const formData = await request.formData();
  const plan = formData.get("plan");

  if (plan === PLAN_PRO || plan === PLAN_ENTERPRISE) {
    await billing.request({
      plan: plan,
      isTest: true,
    });
  }

  return null;
};

const QUICK_ACTIONS = [
  {
    title: "Enable Sticky Cart",
    description: "Add a persistent buy button that follows customers as they scroll",
    badge: "High Impact",
    link: "/app/settings",
    badgeTone: "success",
  },
  {
    title: "Apply a Theme",
    description: "Transform your store's look with one click using 8 curated presets",
    badge: "Quick Win",
    link: "/app/themes",
    badgeTone: "info",
  },
  {
    title: "Browse Sections",
    description: "Add conversion-optimized sections like hero banners, trust badges, and more",
    badge: "30+ Available",
    link: "/app/sections",
    badgeTone: "new",
  },
  {
    title: "Run Setup Wizard",
    description: "Go through the 5-step interactive onboarding process to quickly configure the app",
    badge: "5 mins",
    link: "/app/onboarding",
    badgeTone: "info",
  },
  {
    title: "Set Up Urgency Tools",
    description: "Increase conversion with real inventory scarcity, countdowns, and live purchase alerts",
    badge: "Real Data",
    link: "/app/urgency",
    badgeTone: "warning",
  },
];

const FEATURE_STATUS = [
  { name: "Sticky Add to Cart", status: "inactive" },
  { name: "Theme Preset", status: "inactive" },
  { name: "Sections Installed", count: 0, of: 30 },
  { name: "Urgency Tools", status: "inactive" },
  { name: "AI Review Writing", status: "locked", plan: "Pro" },
  { name: "Upsell Engine", status: "locked", plan: "Pro" },
];

export default function Index() {
  const { currentPlan, PLAN_PRO, PLAN_ENTERPRISE } = useLoaderData();
  const fetcher = useFetcher();

  const upgradeToPro = () =>
    fetcher.submit({ plan: PLAN_PRO }, { method: "POST" });

  return (
    <Page>
      <TitleBar title="ConvertKit Dashboard" />
      <BlockStack gap="500">
        {/* ── Welcome / Overview ── */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="100">
                    <Text as="h2" variant="headingLg">
                      Welcome to ConvertKit
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Your all-in-one conversion toolkit for Shopify
                    </Text>
                  </BlockStack>
                  <Badge tone="success">{currentPlan}</Badge>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* ── Store Health Summary ── */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Store Health
                </Text>
                <InlineGrid columns={{ xs: 2, sm: 3, md: 3, lg: 6 }} gap="300">
                  {FEATURE_STATUS.map((feature) => (
                    <Box
                      key={feature.name}
                      padding="300"
                      background="bg-surface-secondary"
                      borderRadius="200"
                    >
                      <BlockStack gap="100">
                        <Text as="span" variant="bodySm" fontWeight="semibold">
                          {feature.name}
                        </Text>
                        {feature.status === "locked" ? (
                          <Badge tone="new">{feature.plan}</Badge>
                        ) : feature.count !== undefined ? (
                          <Text as="span" variant="bodySm" tone="subdued">
                            {feature.count} / {feature.of}
                          </Text>
                        ) : (
                          <Badge
                            tone={
                              feature.status === "active" ? "success" : "new"
                            }
                          >
                            {feature.status === "active"
                              ? "Active"
                              : "Not Set Up"}
                          </Badge>
                        )}
                      </BlockStack>
                    </Box>
                  ))}
                </InlineGrid>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* ── Quick Actions ── */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Get Started
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Each action below takes less than 60 seconds and makes a
                  measurable difference on your store.
                </Text>
                <BlockStack gap="300">
                  {QUICK_ACTIONS.map((action) => (
                    <Card key={action.title}>
                      <InlineStack
                        align="space-between"
                        blockAlign="center"
                        wrap={false}
                      >
                        <BlockStack gap="100">
                          <InlineStack gap="200" blockAlign="center">
                            <Text
                              as="h3"
                              variant="headingSm"
                            >
                              {action.title}
                            </Text>
                            <Badge tone={action.badgeTone}>
                              {action.badge}
                            </Badge>
                          </InlineStack>
                          <Text as="p" variant="bodySm" tone="subdued">
                            {action.description}
                          </Text>
                        </BlockStack>
                        <Link to={action.link}>
                          <Button>Set Up</Button>
                        </Link>
                      </InlineStack>
                    </Card>
                  ))}
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* ── Upgrade CTA (only on Free) ── */}
        {currentPlan === "Free" && (
          <Layout>
            <Layout.Section>
              <Banner
                title="Unlock all features with Pro"
                tone="info"
                action={{
                  content: "Upgrade to Pro — $19/month",
                  onAction: upgradeToPro,
                }}
              >
                <p>
                  Get all 30+ sections, all 8 themes, urgency tools, AI review
                  writing, upsell engine, and ConvertFlow code extraction.
                </p>
              </Banner>
            </Layout.Section>
          </Layout>
        )}
      </BlockStack>
    </Page>
  );
}
