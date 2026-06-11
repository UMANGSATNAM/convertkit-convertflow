import { useState } from "react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, Button, ColorPicker, TextField } from "@shopify/polaris";
import { useSubmit, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "../db.server";
import { patchSettings, restoreSnapshot } from "../services/theme-engine/index";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) return json({ snapshots: [] });

  const snapshots = await prisma.themeSnapshot.findMany({
    where: { shopId: shop.id, kind: "SETTINGS" },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  return json({ snapshots });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  
  if (intent === "patch") {
    const primary = formData.get("primary");
    const font = formData.get("font");
    
    // In a real scenario, map this to Shopify's settings schema structure
    const patch = { colors_solid_button_labels: primary, type_header_family: font };
    
    // We would use the real shop/theme context here
    // await patchSettings(mockShop, "mock_theme_id", patch, "DESIGN_STUDIO");
    
    return json({ success: true });
  }
  
  if (intent === "restore") {
    const snapshotId = formData.get("snapshotId") as string;
    // await restoreSnapshot(mockShop, snapshotId);
    return json({ success: true });
  }

  return json({ error: "Invalid intent" }, { status: 400 });
};

export default function DesignStudio() {
  const { snapshots } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const [primaryColor, setPrimaryColor] = useState({ hue: 200, brightness: 1, saturation: 1 });
  const [font, setFont] = useState("Inter");

  const handleSave = () => {
    const formData = new FormData();
    formData.append("intent", "patch");
    // Convert HSB to Hex/RGB conceptually
    formData.append("primary", "#000000"); 
    formData.append("font", font);
    submit(formData, { method: "post" });
  };

  const handleRestore = (snapshotId: string) => {
    const formData = new FormData();
    formData.append("intent", "restore");
    formData.append("snapshotId", snapshotId);
    submit(formData, { method: "post" });
  };

  return (
    <Page title="Design Studio" fullWidth>
      <Layout>
        <Layout.Section>
          {/* Mock Iframe for Live Preview */}
          <div style={{ height: "600px", border: "1px solid #ddd", background: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Text as="p">Live Storefront Preview Iframe</Text>
          </div>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Brand Identity</Text>
              
              <BlockStack gap="200">
                <Text as="p">Primary Color</Text>
                <ColorPicker onChange={setPrimaryColor} color={primaryColor} />
              </BlockStack>

              <TextField label="Heading Font" value={font} onChange={setFont} autoComplete="off" />
              
              <Button primary onClick={handleSave}>Save & Publish</Button>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">History (Undo)</Text>
              {snapshots.length === 0 ? (
                <Text as="p">No snapshots yet.</Text>
              ) : (
                snapshots.map((s) => (
                  <InlineStack key={s.id} align="space-between">
                    <Text as="p">{new Date(s.createdAt).toLocaleString()}</Text>
                    <Button size="micro" onClick={() => handleRestore(s.id)}>Restore</Button>
                  </InlineStack>
                ))
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
