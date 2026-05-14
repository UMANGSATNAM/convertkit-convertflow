import { json, redirect } from "@remix-run/node";
import {
  useActionData,
  useNavigate,
  useSearchParams,
  Form,
} from "@remix-run/react";
import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  TextField,
  Select,
  Box,
  Divider,
  Badge,
  Icon,
  PageActions,
  Banner,
} from "@shopify/polaris";
import {
  PlusIcon,
  CashDollarFilledIcon,
  ArrowRightIcon,
} from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const name = formData.get("name");
  const type = formData.get("type") || "post_purchase";
  const trigger = formData.get("trigger");
  const status = formData.get("status");

  if (!name || name.trim() === "")
    return json({ error: "Funnel name is required." });

  const shop = await db.shop.findUnique({
    where: { shopDomain: session.shop },
  });
  if (!shop) return json({ error: "Shop not found" }, { status: 404 });

  await db.funnel.create({
    data: {
      shopId: shop.id,
      name: name.trim(),
      type,
      status: status || "draft",
      steps: JSON.stringify([{ step: 1, type: "upsell", configured: false }]),
    },
  });

  return redirect("/app/funnels");
};

export default function NewFunnel() {
  const navigate = useNavigate();
  const actionData = useActionData();
  const [funnelName, setFunnelName] = useState("");
  const [trigger, setTrigger] = useState("all_orders");
  const [type, setType] = useState("post_purchase");
  const [status, setStatus] = useState("active");

  return (
    <Page
      breadcrumbs={[
        { content: "Funnels", onAction: () => navigate("/app/funnels") },
      ]}
      title="Create Post-Purchase Funnel"
    >
      {actionData?.error && (
        <Box paddingBlockEnd="400">
          <Banner tone="critical">{actionData.error}</Banner>
        </Box>
      )}
      <Form method="post">
        <input type="hidden" name="type" value={type} />
        <Layout>
          <Layout.Section>
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Funnel Details
                  </Text>
                  <TextField
                    label="Funnel Name"
                    name="name"
                    value={funnelName}
                    onChange={setFunnelName}
                    placeholder="e.g., VIP Post-Purchase Upsell"
                    autoComplete="off"
                  />
                  <Select
                    label="Funnel Type"
                    options={[
                      {
                        label: "Post-Purchase (after checkout)",
                        value: "post_purchase",
                      },
                      { label: "Pre-Purchase (in cart)", value: "cart_upsell" },
                    ]}
                    value={type}
                    onChange={setType}
                  />
                  <Select
                    label="Trigger Condition"
                    name="trigger"
                    options={[
                      { label: "All Orders", value: "all_orders" },
                      { label: "Cart Value > â‚¹5,000", value: "high_value" },
                      { label: "Specific Collections", value: "collection" },
                    ]}
                    value={trigger}
                    onChange={setTrigger}
                  />
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="400" inlineAlign="center">
                  <Text variant="headingMd" as="h2">
                    Funnel Flow Preview
                  </Text>
                  <Text variant="bodyMd" tone="subdued">
                    You can configure each step in detail after saving.
                  </Text>

                  <BlockStack gap="200" inlineAlign="center">
                    <Badge tone="info">Customer Completes Checkout</Badge>
                    <Icon source={ArrowRightIcon} tone="subdued" />
                    <div
                      style={{
                        padding: "16px 24px",
                        border: "2px dashed #E5E7EB",
                        borderRadius: "12px",
                        textAlign: "center",
                        minWidth: "220px",
                      }}
                    >
                      <BlockStack gap="200" inlineAlign="center">
                        <Text variant="headingMd" as="h3">
                          Upsell Offer 1
                        </Text>
                        <Text variant="bodySm" tone="subdued">
                          Configure after saving
                        </Text>
                      </BlockStack>
                    </div>
                    <InlineStack gap="600" align="center">
                      <BlockStack gap="100" inlineAlign="center">
                        <Text variant="bodySm" tone="success">
                          Accepted â†’
                        </Text>
                        <div
                          style={{
                            padding: "8px 16px",
                            background: "#F0FFF4",
                            border: "1px solid #00C851",
                            borderRadius: "8px",
                          }}
                        >
                          <Text variant="bodySm" fontWeight="bold">
                            Thank You Page
                          </Text>
                        </div>
                      </BlockStack>
                      <BlockStack gap="100" inlineAlign="center">
                        <Text variant="bodySm" tone="critical">
                          Declined â†’
                        </Text>
                        <div
                          style={{
                            padding: "8px 16px",
                            background: "#FFF5F5",
                            border: "1px solid #FF4F00",
                            borderRadius: "8px",
                          }}
                        >
                          <Text variant="bodySm" fontWeight="bold">
                            Downsell Offer
                          </Text>
                        </div>
                      </BlockStack>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Status
                  </Text>
                  <Select
                    label="Funnel Status"
                    name="status"
                    labelHidden
                    options={[
                      { label: "Draft", value: "draft" },
                      { label: "Active (go live)", value: "active" },
                    ]}
                    value={status}
                    onChange={setStatus}
                  />
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="200">
                  <InlineStack gap="200" blockAlign="center">
                    <Icon source={CashDollarFilledIcon} />
                    <Text variant="headingSm" as="h3">
                      Revenue Potential
                    </Text>
                  </InlineStack>
                  <Text variant="bodySm" tone="subdued">
                    Post-purchase funnels typically increase AOV by 10â€“15%
                    with zero extra ad spend.
                  </Text>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
        <PageActions
          primaryAction={{ content: "Save Funnel", submit: true }}
          secondaryActions={[
            { content: "Cancel", onAction: () => navigate("/app/funnels") },
          ]}
        />
      </Form>
    </Page>
  );
}
