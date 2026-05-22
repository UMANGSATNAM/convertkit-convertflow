import { json } from "@remix-run/node";
import { useLoaderData, useSubmit, useActionData, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  InlineStack,
  Badge,
  Banner,
  Divider,
} from "@shopify/polaris";
import { authenticate, PLAN_PRO, PLAN_ENTERPRISE } from "../shopify.server";

const PLAN_PRO_CLIENT = 'Pro - $19/mo';
const PLAN_ENTERPRISE_CLIENT = 'Enterprise - $49/mo';

export const loader = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);
  
  // Try to check if user is on a paid plan
  const { hasActivePayment, appSubscriptions } = await billing.check({
    plans: [PLAN_PRO, PLAN_ENTERPRISE],
    isTest: true,
  });

  const activePlan = appSubscriptions && appSubscriptions.length > 0 
    ? appSubscriptions[0].name 
    : "Free";

  return json({ hasActivePayment, activePlan, appSubscriptions });
};

export const action = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const formData = await request.formData();
  const plan = formData.get("plan");

  if (!plan) return json({ error: "No plan selected" }, { status: 400 });

  if (plan === "Free") {
    // Attempting to cancel active plan
    const { appSubscriptions } = await billing.check({
      plans: [PLAN_PRO, PLAN_ENTERPRISE],
      isTest: true,
    });
    
    if (appSubscriptions.length > 0) {
      await billing.cancel({
        subscriptionId: appSubscriptions[0].id,
        isTest: true,
        prorate: true,
      });
    }
    return json({ success: true, canceled: true });
  }

  // Subscribe to requested plan
  await billing.require({
    plans: [plan],
    isTest: true,
    onFailure: async () => billing.request({ plan, isTest: true }),
  });

  return json({ success: true });
};

export default function BillingRoute() {
  const { hasActivePayment, activePlan, appSubscriptions } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const nav = useNavigation();

  const handleSubscribe = (planName) => {
    submit({ plan: planName }, { method: "POST" });
  };

  const isSubmitting = nav.state === "submitting";

  return (
    <Page title="Billing & Plans">
      <span aria-label="billing"></span>
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {actionData?.canceled && (
              <Banner title="Subscription canceled" tone="success">
                You have successfully moved to the Free plan.
              </Banner>
            )}
            
            <Text as="h2" variant="headingLg">Choose your plan</Text>
            
            <InlineStack gap="400" align="center" blockAlign="stretch">
              {/* Free Plan */}
              <Card roundedAbove="sm">
                <BlockStack gap="400">
                  <InlineStack align="space-between">
                    <Text as="h3" variant="headingMd">Free</Text>
                    {activePlan === "Free" && <Badge tone="success">Active</Badge>}
                  </InlineStack>
                  <Text as="p" variant="bodyLg" tone="subdued">
                    Perfect for trying out our template library.
                  </Text>
                  <Text as="p" variant="headingXl">$0<span style={{ fontSize: "14px", fontWeight: "normal" }}>/mo</span></Text>
                  <Divider />
                  <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
                    <li>Preview all templates</li>
                    <li>Basic sections</li>
                  </ul>
                  <Button 
                    disabled={activePlan === "Free"} 
                    loading={isSubmitting}
                    onClick={() => handleSubscribe("Free")}
                  >
                    {activePlan === "Free" ? "Current Plan" : "Downgrade"}
                  </Button>
                </BlockStack>
              </Card>

              {/* Pro Plan */}
              <Card roundedAbove="sm">
                <BlockStack gap="400">
                  <InlineStack align="space-between">
                    <Text as="h3" variant="headingMd">Pro</Text>
                    {activePlan === PLAN_PRO_CLIENT && <Badge tone="success">Active</Badge>}
                  </InlineStack>
                  <Text as="p" variant="bodyLg" tone="subdued">
                    Unlock premium sections and page templates.
                  </Text>
                  <Text as="p" variant="headingXl">$19<span style={{ fontSize: "14px", fontWeight: "normal" }}>/mo</span></Text>
                  <Divider />
                  <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
                    <li>All 25+ premium templates</li>
                    <li>Priority support</li>
                    <li>High-conversion section registry</li>
                  </ul>
                  <Button 
                    variant="primary" 
                    disabled={activePlan === PLAN_PRO_CLIENT}
                    loading={isSubmitting}
                    onClick={() => handleSubscribe(PLAN_PRO_CLIENT)}
                  >
                    {activePlan === PLAN_PRO_CLIENT ? "Current Plan" : "Upgrade to Pro"}
                  </Button>
                </BlockStack>
              </Card>

              {/* Enterprise/Agency Plan */}
              <Card roundedAbove="sm">
                <BlockStack gap="400">
                  <InlineStack align="space-between">
                    <Text as="h3" variant="headingMd">Enterprise</Text>
                    {activePlan === PLAN_ENTERPRISE_CLIENT && <Badge tone="success">Active</Badge>}
                  </InlineStack>
                  <Text as="p" variant="bodyLg" tone="subdued">
                    Full agency access with white-glove onboarding.
                  </Text>
                  <Text as="p" variant="headingXl">$49<span style={{ fontSize: "14px", fontWeight: "normal" }}>/mo</span></Text>
                  <Divider />
                  <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
                    <li>Everything in Pro</li>
                    <li>Custom template requests</li>
                    <li>API Access & Webhooks</li>
                  </ul>
                  <Button 
                    disabled={activePlan === PLAN_ENTERPRISE_CLIENT}
                    loading={isSubmitting}
                    onClick={() => handleSubscribe(PLAN_ENTERPRISE_CLIENT)}
                  >
                    {activePlan === PLAN_ENTERPRISE_CLIENT ? "Current Plan" : "Upgrade to Enterprise"}
                  </Button>
                </BlockStack>
              </Card>
            </InlineStack>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

{/* <label>Form</label> */}
