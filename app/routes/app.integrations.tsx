import { useState } from "react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, TextField, Button, Badge, Tabs } from "@shopify/polaris";
import { useSubmit, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({
    pixels: { meta: "", ga4: "" },
    plan: "FREE"
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "pixel") {
    // Save to DB and configure Shopify Web Pixels API
    return json({ success: true, message: "Pixels configured" });
  }

  if (intent === "upgrade") {
    const plan = formData.get("plan");
    // Redirect to Shopify Billing URL
    return json({ success: true, redirect: `/api/billing/upgrade?plan=${plan}` });
  }

  return json({ error: "Invalid" });
};

export default function Integrations() {
  const { pixels, plan } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const [selectedTab, setSelectedTab] = useState(0);

  const [metaPixel, setMetaPixel] = useState(pixels.meta);
  const [ga4, setGa4] = useState(pixels.ga4);

  const handleSavePixels = () => {
    const formData = new FormData();
    formData.append("intent", "pixel");
    formData.append("meta", metaPixel);
    formData.append("ga4", ga4);
    submit(formData, { method: "post" });
  };

  const handleUpgrade = (targetPlan: string) => {
    const formData = new FormData();
    formData.append("intent", "upgrade");
    formData.append("plan", targetPlan);
    submit(formData, { method: "post" });
  };

  return (
    <Page title="Integrations & Billing">
      <Tabs
        tabs={[{ id: "pixels", content: "Tracking Pixels" }, { id: "billing", content: "Billing Plan" }]}
        selected={selectedTab}
        onSelect={setSelectedTab}
      >
        {selectedTab === 0 && (
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">One-Click Tracking Setup</Text>
                <Text as="p">Just paste your IDs. StoreForge handles standard events (Page View, Add to Cart, Purchase) automatically via the Web Pixels API.</Text>
                
                <TextField label="Meta Pixel ID" value={metaPixel} onChange={setMetaPixel} autoComplete="off" placeholder="e.g. 1234567890" />
                <TextField label="GA4 Measurement ID" value={ga4} onChange={setGa4} autoComplete="off" placeholder="e.g. G-XXXXXXX" />
                
                <Button variant="primary" onClick={handleSavePixels}>Save Configuration</Button>
              </BlockStack>
            </Card>
          </Layout.Section>
        )}

        {selectedTab === 1 && (
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Current Plan: <Badge tone="info">{plan}</Badge></Text>
                
                <InlineStack gap="400" wrap={false}>
                  <Card>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingMd">FREE</Text>
                      <Text as="p">$0/month</Text>
                      <Text as="p">- Basic Generation</Text>
                      <Button disabled={plan === "FREE"}>Current Plan</Button>
                    </BlockStack>
                  </Card>

                  <Card>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingMd">GROWTH</Text>
                      <Text as="p">$12.99/month</Text>
                      <Text as="p">- 120 Sections</Text>
                      <Text as="p">- Basic Toolkit</Text>
                      <Button variant={plan !== "GROWTH" ? "primary" : undefined} disabled={plan === "GROWTH"} onClick={() => handleUpgrade("GROWTH")}>Upgrade</Button>
                    </BlockStack>
                  </Card>

                  <Card>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingMd">PRO</Text>
                      <Text as="p">$24.99/month</Text>
                      <Text as="p">- Everything + AI Assistant</Text>
                      <Text as="p">- Full Conversion Toolkit</Text>
                      <Button variant={plan !== "PRO" ? "primary" : undefined} disabled={plan === "PRO"} onClick={() => handleUpgrade("PRO")}>Upgrade</Button>
                    </BlockStack>
                  </Card>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        )}
      </Tabs>
    </Page>
  );
}
