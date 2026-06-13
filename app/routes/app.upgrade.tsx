import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, Button, List, Badge, Divider, Banner } from "@shopify/polaris";
import { authenticate, PLAN_PRO, PLAN_GROWTH, PLAN_ENTERPRISE } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing } = await authenticate.admin(request);
  
  // Check active plan
  const planCheck = await billing.check({
    plans: [PLAN_PRO, PLAN_GROWTH, PLAN_ENTERPRISE],
    isTest: true,
  });

  const hasActivePayment = planCheck.hasActivePayment;
  // If we wanted to get the exact plan, we'd query the GraphQL API, but this boolean is enough for the UI for now.
  
  return json({ hasActivePayment });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { billing } = await authenticate.admin(request);
  const formData = await request.formData();
  const plan = formData.get("plan") as string;

  if (plan === PLAN_PRO) {
    await billing.require({
      plans: [PLAN_PRO],
      isTest: true,
      onFailure: async () => billing.request({ plan: PLAN_PRO, isTest: true, returnUrl: "/app/upgrade" }),
    });
  }

  return null;
};

export default function UpgradePage() {
  const { hasActivePayment } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const nav = useNavigation();

  const handleUpgrade = (plan: string) => {
    submit({ plan }, { method: "post" });
  };

  return (
    <Page title="Plans & Pricing" subtitle="Unlock StoreForge's full conversion potential.">
      <Layout>
        {hasActivePayment && (
          <Layout.Section>
            <Banner tone="success" title="You are on a Premium Plan!">
              Thank you for subscribing to StoreForge. You have unlimited access to AI tokens and all campaign features.
            </Banner>
          </Layout.Section>
        )}
        
        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between">
                <Text as="h2" variant="headingLg">Free</Text>
                {!hasActivePayment && <Badge tone="success">Current Plan</Badge>}
              </InlineStack>
              <Text as="p" tone="subdued">Everything you need to get started.</Text>
              
              <div style={{ fontSize: "36px", fontWeight: "bold" }}>$0<span style={{ fontSize: "16px", color: "gray", fontWeight: "normal" }}>/mo</span></div>
              
              <Divider />
              
              <List type="bullet">
                <List.Item>1 Active Campaign Page</List.Item>
                <List.Item>Basic Section Library (5 sections)</List.Item>
                <List.Item>10,000 AI Tokens / month</List.Item>
                <List.Item>Basic Analytics</List.Item>
                <List.Item>Community Support</List.Item>
              </List>
              
              <Button disabled={!hasActivePayment} onClick={() => {}}>
                {hasActivePayment ? "Downgrade to Free" : "Current Plan"}
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>
        
        <Layout.Section variant="oneHalf">
          <div style={{ border: "2px solid #008060", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ backgroundColor: "#008060", color: "white", textAlign: "center", padding: "4px", fontSize: "12px", fontWeight: "bold" }}>
              MOST POPULAR
            </div>
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <Text as="h2" variant="headingLg">PRO</Text>
                  {hasActivePayment && <Badge tone="success">Current Plan</Badge>}
                </InlineStack>
                <Text as="p" tone="subdued">Unlimited power for growing brands.</Text>
                
                <div style={{ fontSize: "36px", fontWeight: "bold" }}>$24.99<span style={{ fontSize: "16px", color: "gray", fontWeight: "normal" }}>/mo</span></div>
                
                <Divider />
                
                <List type="bullet">
                  <List.Item><b>Unlimited</b> Campaign Pages</List.Item>
                  <List.Item><b>Full</b> Section Library (120+ sections)</List.Item>
                  <List.Item><b>Unlimited</b> AI Tokens</List.Item>
                  <List.Item>Advanced Analytics & Web Pixel</List.Item>
                  <List.Item>Priority 24/7 Support</List.Item>
                </List>
                
                <Button 
                  variant="primary" 
                  onClick={() => handleUpgrade('PRO')}
                  disabled={hasActivePayment}
                  loading={nav.state === "submitting"}
                >
                  {hasActivePayment ? "Current Plan" : "Upgrade to PRO"}
                </Button>
              </BlockStack>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
