import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  InlineStack,
  Badge,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate, PLAN_PRO, PLAN_ENTERPRISE } from "../shopify.server";
import { useFetcher, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const billingCheck = await billing.check();

  return { billingCheck, PLAN_PRO, PLAN_ENTERPRISE };
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
  const { billingCheck, PLAN_PRO, PLAN_ENTERPRISE } = useLoaderData();
  const fetcher = useFetcher();

  const activeSubs = billingCheck?.appSubscriptions || [];
  const currentPlan = activeSubs.length > 0 ? activeSubs[0]?.name : "Free";

  const upgradeToPro = () =>
    fetcher.submit({ plan: PLAN_PRO }, { method: "POST" });
  const upgradeToEnterprise = () =>
    fetcher.submit({ plan: PLAN_ENTERPRISE }, { method: "POST" });

  return (
    <Page title="Settings">
      <TitleBar title="Settings" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Billing and Plan
                </Text>
                <InlineStack gap="200" align="center">
                  <Text as="p" variant="bodyMd">
                    Current plan:
                  </Text>
                  <Badge tone="success">{currentPlan}</Badge>
                </InlineStack>

                <BlockStack gap="300">
                  <Card>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingSm">Free</Text>
                      <Text as="p" variant="bodySm">Sticky cart, 3 sections, 1 theme, basic analytics, 100 events/month</Text>
                    </BlockStack>
                  </Card>

                  <Card>
                    <BlockStack gap="200">
                      <InlineStack align="space-between">
                        <Text as="h3" variant="headingSm">Pro - $19/month</Text>
                        <Button onClick={upgradeToPro} variant="primary">Upgrade</Button>
                      </InlineStack>
                      <Text as="p" variant="bodySm">All 30+ sections, all themes, all page templates, urgency tools, AI reviews, upsell engine, ConvertFlow</Text>
                    </BlockStack>
                  </Card>

                  <Card>
                    <BlockStack gap="200">
                      <InlineStack align="space-between">
                        <Text as="h3" variant="headingSm">Enterprise - $49/month</Text>
                        <Button onClick={upgradeToEnterprise}>Upgrade</Button>
                      </InlineStack>
                      <Text as="p" variant="bodySm">Everything in Pro plus white-label, multi-store management (up to 10 stores), custom CSS injection, priority support</Text>
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
