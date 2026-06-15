import { Page, Layout, Card, Text, BlockStack, InlineStack, Badge, Button } from "@shopify/polaris";
import { useSubmit, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

// Define the available features
const AVAILABLE_FEATURES = [
  { key: "STICKY_ATC", name: "Sticky Add to Cart", description: "Keep the Add to Cart button visible at all times." },
  { key: "COUNTDOWN", name: "Countdown Timer", description: "Create urgency with a countdown on product pages." },
  { key: "ANNOUNCEMENT", name: "Announcement Bar", description: "Highlight promotions or free shipping thresholds." },
  { key: "SIZE_CHART", name: "Size Chart", description: "Reduce returns by showing a dynamic size guide." },
  { key: "PINCODE", name: "Pincode Checker", description: "Let users check delivery availability via pincode." },
  { key: "WHATSAPP", name: "WhatsApp Chat", description: "Provide direct support via WhatsApp float button." },
  { key: "BUNDLES", name: "Product Bundles", description: "Increase AOV by offering bundle discounts." },
  { key: "TRUST_BADGES", name: "Trust Badges", description: "Show secure checkout and payment icons." },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  
  if (!shop) return json({ activeFeatures: [] });

  const activeFeatures = await prisma.toolkitFeature.findMany({
    where: { shopId: shop.id }
  });

  return json({ activeFeatures: activeFeatures.map(f => ({ key: f.feature, enabled: f.enabled })) });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) return json({ error: "Shop not found" }, { status: 404 });

  const formData = await request.formData();
  const featureKey = formData.get("featureKey") as string;
  const enabled = formData.get("enabled") === "true";

  // In a real app, this would call Theme Engine to inject/remove the feature snippet from theme code
  await prisma.toolkitFeature.upsert({
    where: { shopId_feature: { shopId: shop.id, feature: featureKey as any } },
    update: { enabled },
    create: { shopId: shop.id, feature: featureKey as any, enabled }
  });

  return json({ success: true });
};

export default function FeatureLibrary() {
  const { activeFeatures } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const handleToggle = (featureKey: string, currentEnabled: boolean) => {
    const formData = new FormData();
    formData.append("featureKey", featureKey);
    formData.append("enabled", (!currentEnabled).toString());
    submit(formData, { method: "post" });
  };

  const getFeatureState = (key: string) => {
    const feature = activeFeatures.find((f: any) => f.key === key);
    return feature?.enabled || false;
  };

  return (
    <Page title="Feature Library" fullWidth>
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {AVAILABLE_FEATURES.map((feat) => {
              const isEnabled = getFeatureState(feat.key);
              return (
                <Card key={feat.key}>
                  <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="100">
                      <InlineStack gap="200" blockAlign="center">
                        <Text as="h3" variant="headingMd">{feat.name}</Text>
                        {isEnabled && <Badge tone="success">Active</Badge>}
                      </InlineStack>
                      <Text as="p" tone="subdued">{feat.description}</Text>
                    </BlockStack>
                    <Button 
                      tone={isEnabled ? "critical" : "success"}
                      onClick={() => handleToggle(feat.key, isEnabled)}
                    >
                      {isEnabled ? "Disable" : "Enable"}
                    </Button>
                  </InlineStack>
                </Card>
              );
            })}
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
