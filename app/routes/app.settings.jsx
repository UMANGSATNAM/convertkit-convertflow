import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  InlineStack,
  Badge,
  Divider,
  Box,
  Banner,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate, PLAN_PRO, PLAN_ENTERPRISE } from "../shopify.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState } from "react";

export const loader = async ({ request }) => {
  const { billing, admin } = await authenticate.admin(request);
  const billingCheck = await billing.check();

  // Check script tag status
  let scriptTagActive = false;
  try {
    const stResp = await admin.graphql(`
      query {
        scriptTags(first: 10) {
          edges {
            node {
              id
              src
            }
          }
        }
      }
    `);
    const stData = await stResp.json();
    const tags = stData.data?.scriptTags?.edges || [];
    scriptTagActive = tags.some((e) =>
      e.node.src.includes("convertkit-widget.min.js")
    );
  } catch (e) {
    // non-critical
  }

  return json({
    billingCheck,
    PLAN_PRO,
    PLAN_ENTERPRISE,
    scriptTagActive,
  });
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

export default function Settings() {
  const { billingCheck, PLAN_PRO, PLAN_ENTERPRISE, scriptTagActive } =
    useLoaderData();
  const fetcher = useFetcher();
  const scriptFetcher = useFetcher();
  const [scriptEnabled, setScriptEnabled] = useState(scriptTagActive);

  const activeSubs = billingCheck?.appSubscriptions || [];
  const currentPlan = activeSubs.length > 0 ? activeSubs[0]?.name : "Free";

  const upgradeToPro = () =>
    fetcher.submit({ plan: PLAN_PRO }, { method: "POST" });
  const upgradeToEnterprise = () =>
    fetcher.submit({ plan: PLAN_ENTERPRISE }, { method: "POST" });

  const toggleScript = () => {
    if (scriptEnabled) {
      // We'd need the scriptTagId — for now just toggle
      scriptFetcher.submit(
        { _method: "delete", scriptTagId: "" },
        { method: "POST", action: "/api/script-tag" }
      );
    } else {
      scriptFetcher.submit({}, { method: "POST", action: "/api/script-tag" });
    }
    setScriptEnabled(!scriptEnabled);
  };

  const isScriptLoading = scriptFetcher.state !== "idle";

  return (
    <Page title="Settings">
      <TitleBar title="Settings" />
      <BlockStack gap="500">
        <Layout>
          {/* ── Widget Script Section ── */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Storefront Widget
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  The ConvertKit widget script powers all storefront features
                  including sticky cart, urgency tools, and trust badges.
                </Text>
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <Text as="span" variant="bodyMd" fontWeight="semibold">
                      Widget Script
                    </Text>
                    <Badge tone={scriptEnabled ? "success" : "new"}>
                      {scriptEnabled ? "Active" : "Inactive"}
                    </Badge>
                  </InlineStack>
                  <Button
                    onClick={toggleScript}
                    loading={isScriptLoading}
                    variant={scriptEnabled ? "secondary" : "primary"}
                  >
                    {scriptEnabled ? "Disable" : "Enable"}
                  </Button>
                </InlineStack>
                {scriptEnabled && (
                  <Banner tone="success">
                    <p>
                      The ConvertKit widget is running on your storefront.
                      Features you enable will appear automatically.
                    </p>
                  </Banner>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* ── Sticky Cart Config Section ── */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Sticky Add to Cart
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  A persistent bar that follows customers as they scroll,
                  keeping the buy button always visible. Appears on product
                  pages when the native Add to Cart button scrolls out of view.
                </Text>
                <Divider />
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="span" variant="bodyMd">
                    Show on mobile devices
                  </Text>
                  <Badge>Off by default</Badge>
                </InlineStack>
                <Text as="p" variant="bodySm" tone="subdued">
                  The sticky cart is hidden on screens under 768px by default.
                  Enable mobile mode in the widget configuration to show it on
                  all devices.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Divider />
          </Layout.Section>

          {/* ── Billing Section ── */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Billing and Plan
                </Text>
                <InlineStack gap="200" blockAlign="center">
                  <Text as="p" variant="bodyMd">
                    Current plan:
                  </Text>
                  <Badge tone="success">{currentPlan}</Badge>
                </InlineStack>

                <BlockStack gap="300">
                  <Card>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingSm">Free</Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Sticky cart, 3 sections, 1 theme, basic analytics, 100
                        events/month
                      </Text>
                    </BlockStack>
                  </Card>

                  <Card>
                    <BlockStack gap="200">
                      <InlineStack align="space-between">
                        <Text as="h3" variant="headingSm">
                          Pro — $19/month
                        </Text>
                        <Button onClick={upgradeToPro} variant="primary">
                          Upgrade
                        </Button>
                      </InlineStack>
                      <Text as="p" variant="bodySm" tone="subdued">
                        All 30+ sections, all themes, all page templates,
                        urgency tools, AI reviews, upsell engine, ConvertFlow
                      </Text>
                    </BlockStack>
                  </Card>

                  <Card>
                    <BlockStack gap="200">
                      <InlineStack align="space-between">
                        <Text as="h3" variant="headingSm">
                          Enterprise — $49/month
                        </Text>
                        <Button onClick={upgradeToEnterprise}>Upgrade</Button>
                      </InlineStack>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Everything in Pro plus white-label, multi-store
                        management (up to 10 stores), custom CSS injection,
                        priority support
                      </Text>
                    </BlockStack>
                  </Card>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
