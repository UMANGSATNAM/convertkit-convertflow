import { Page, Layout, Card, Text, BlockStack, Button, FormLayout, TextField, DataTable, InlineStack } from "@shopify/polaris";
import { useSubmit, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useState } from "react";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  
  if (!shop) return json({ pincodes: [] });

  const pincodes = await prisma.pincodeZone.findMany({
    where: { shopId: shop.id },
    take: 100 // Just load the first 100 for this UI
  });

  return json({ pincodes });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) return json({ error: "Shop not found" }, { status: 404 });

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "add") {
    const pincode = formData.get("pincode") as string;
    const etaDays = parseInt(formData.get("etaDays") as string, 10);
    const cod = formData.get("cod") === "true";

    if (pincode) {
      await prisma.pincodeZone.upsert({
        where: { shopId_pincode: { shopId: shop.id, pincode } },
        update: { cod, etaDays },
        create: { shopId: shop.id, pincode, cod, etaDays }
      });
    }
  } else if (intent === "delete") {
    const pincode = formData.get("pincode") as string;
    await prisma.pincodeZone.delete({
      where: { shopId_pincode: { shopId: shop.id, pincode } }
    });
  }

  return json({ success: true });
};

export default function PincodeSettings() {
  const { pincodes } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const [newPincode, setNewPincode] = useState("");
  const [etaDays, setEtaDays] = useState("3");
  const [codEnabled, setCodEnabled] = useState(true);

  const handleAdd = () => {
    const formData = new FormData();
    formData.append("intent", "add");
    formData.append("pincode", newPincode);
    formData.append("etaDays", etaDays);
    formData.append("cod", codEnabled.toString());
    submit(formData, { method: "post" });
    setNewPincode("");
  };

  const handleDelete = (pincode: string) => {
    const formData = new FormData();
    formData.append("intent", "delete");
    formData.append("pincode", pincode);
    submit(formData, { method: "post" });
  };

  const rows = pincodes.map((zone) => [
    zone.pincode,
    zone.etaDays ? `${zone.etaDays} Days` : "N/A",
    zone.cod ? "Yes" : "No",
    <Button size="micro" tone="critical" onClick={() => handleDelete(zone.pincode)}>Delete</Button>
  ]);

  return (
    <Page title="Pincode & Delivery Settings" fullWidth>
      <Layout>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Add Serviceable Pincode</Text>
              <FormLayout>
                <TextField label="Pincode" value={newPincode} onChange={setNewPincode} autoComplete="off" />
                <TextField label="Estimated Delivery (Days)" type="number" value={etaDays} onChange={setEtaDays} autoComplete="off" />
                <Button onClick={() => setCodEnabled(!codEnabled)}>
                  Cash on Delivery: {codEnabled ? "Enabled" : "Disabled"}
                </Button>
                <Button primary onClick={handleAdd}>Add Pincode</Button>
              </FormLayout>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between">
                <Text as="h2" variant="headingMd">Serviceable Zones</Text>
                <Button>Import CSV</Button>
              </InlineStack>
              {rows.length === 0 ? (
                <Text as="p">No pincodes configured. Add one or import a CSV.</Text>
              ) : (
                <DataTable
                  columnContentTypes={['text', 'text', 'text', 'text']}
                  headings={['Pincode', 'ETA', 'COD Available', 'Actions']}
                  rows={rows as any}
                />
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
