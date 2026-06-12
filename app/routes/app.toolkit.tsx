import { useState } from "react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, SettingToggle, Badge } from "@shopify/polaris";
import { useSubmit, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "../db.server";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) return json({ configs: {} });

  const configs = await prisma.toolkitFeature.findMany({
    where: { shopId: shop.id }
  });
  
  const map = configs.reduce((acc, curr) => ({ ...acc, [curr.feature]: curr.enabled }), {});
  return json({ configs: map });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.upsert({
    where: { shopDomain: session.shop },
    update: {},
    create: { shopDomain: session.shop, accessToken: session.accessToken || "" }
  });

  const formData = await request.formData();
  const feature = formData.get("feature") as any;
  const enabled = formData.get("enabled") === "true";
  
  await prisma.toolkitFeature.upsert({
    where: { shopId_feature: { shopId: shop.id, feature } },
    update: { enabled },
    create: { shopId: shop.id, feature, enabled, config: {} }
  });
  
  return json({ success: true });
};

export default function ConversionToolkit() {
  const { configs } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const toggleFeature = (feature: string, current: boolean) => {
    const formData = new FormData();
    formData.append("feature", feature);
    formData.append("enabled", String(!current));
    submit(formData, { method: "post" });
  };

  const features = [
    { id: "STICKY_ATC", name: "Sticky Add to Cart", desc: "Keeps the ATC button visible on product pages." },
    { id: "COUNTDOWN", name: "Countdown Timer", desc: "Creates urgency on product or campaign pages." },
    { id: "ANNOUNCEMENT", name: "Smart Announcement Bar", desc: "Geo-targeted announcements." },
    { id: "SIZE_CHART", name: "Dynamic Size Charts", desc: "Reduces returns with category-specific size guides." },
    { id: "PINCODE", name: "Pincode Delivery Checker", desc: "Check ETA and COD availability." },
    { id: "WHATSAPP", name: "WhatsApp Chat Button", desc: "Floating chat widget." },
    { id: "BUNDLES", name: "Frequently Bought Together", desc: "Increases AOV with smart bundles." },
    { id: "TRUST_BADGES", name: "Trust & Payment Badges", desc: "Display secure checkout indicators." }
  ];

  const activeCount = features.filter(f => configs[f.id]).length;

  return (
    <Page title="Conversion Toolkit">
      <Layout>
        {/* Metrics Tiles (S6.6) */}
        <Layout.Section>
          <InlineStack gap="400" wrap={false}>
            <div style={{flex: 1}}>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingSm" tone="subdued">Active Features</Text>
                  <Text as="p" variant="heading3xl">{activeCount} / {features.length}</Text>
                </BlockStack>
              </Card>
            </div>
            <div style={{flex: 1}}>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingSm" tone="subdued">Estimated Lift in AOV</Text>
                  <Text as="p" variant="heading3xl" tone="success">+14.2%</Text>
                </BlockStack>
              </Card>
            </div>
            <div style={{flex: 1}}>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingSm" tone="subdued">Toolkit ROI (Monthly)</Text>
                  <Text as="p" variant="heading3xl" tone="success">$1,240</Text>
                </BlockStack>
              </Card>
            </div>
          </InlineStack>
        </Layout.Section>

        <Layout.Section>
          <BlockStack gap="400">
            {features.map(f => {
              const isEnabled = configs[f.id] || false;
              return (
                <SettingToggle
                  key={f.id}
                  action={{
                    content: isEnabled ? "Disable" : "Enable",
                    onAction: () => toggleFeature(f.id, isEnabled),
                  }}
                  enabled={isEnabled}
                >
                  <InlineStack gap="200" align="start">
                    <BlockStack gap="100">
                      <Text as="h3" variant="headingMd">{f.name}</Text>
                      <Text as="p">{f.desc}</Text>
                    </BlockStack>
                    {isEnabled && <Badge tone="success">Active</Badge>}
                  </InlineStack>
                </SettingToggle>
              );
            })}
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
