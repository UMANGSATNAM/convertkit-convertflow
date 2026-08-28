import { Page, Layout, Card, Text, BlockStack, Button, FormLayout, TextField, DataTable, InlineStack, Banner } from "@shopify/polaris";
import { useSubmit, useLoaderData, useActionData } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useState, useEffect } from "react";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  
  if (!shop) return json({ pincodes: [], storefrontPassword: "" });

  const pincodes = await prisma.pincodeZone.findMany({
    where: { shopId: shop.id },
    take: 100 // Just load the first 100 for this UI
  });

  const storefrontPassword = (shop.brandConfig as any)?.storefrontPassword ?? "";

  return json({ pincodes, storefrontPassword });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) return json({ error: "Shop not found" }, { status: 404 });

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "save-password") {
    const password = (formData.get("storefrontPassword") as string) ?? "";
    const existing = (shop.brandConfig as Record<string, any>) ?? {};
    await prisma.shop.update({
      where: { id: shop.id },
      data: { brandConfig: { ...existing, storefrontPassword: password } },
    });
    return json({ success: true, intent: "save-password" });
  }

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
  const { pincodes, storefrontPassword: savedPassword } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  const [sfPassword, setSfPassword] = useState(savedPassword || "");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [newPincode, setNewPincode] = useState("");
  const [etaDays, setEtaDays] = useState("3");
  const [codEnabled, setCodEnabled] = useState(true);

  useEffect(() => {
    if ((actionData as any)?.intent === "save-password" && (actionData as any)?.success) {
      setPasswordSaved(true);
      const t = setTimeout(() => setPasswordSaved(false), 4000);
      return () => clearTimeout(t);
    }
  }, [actionData]);

  const handleSavePassword = () => {
    const formData = new FormData();
    formData.append("intent", "save-password");
    formData.append("storefrontPassword", sfPassword);
    submit(formData, { method: "post" });
  };

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
    <Page title="Settings" fullWidth>
      <Layout>
        {/* ── Storefront Password ── */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Storefront Password</Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                If your store is password-protected (development stores), enter the password here
                so that page previews can load correctly.
              </Text>
              {passwordSaved && (
                <Banner tone="success" onDismiss={() => setPasswordSaved(false)}>
                  Password saved! Previews will now work.
                </Banner>
              )}
              <FormLayout>
                <TextField
                  label="Store Password"
                  value={sfPassword}
                  onChange={setSfPassword}
                  autoComplete="off"
                  placeholder="Enter your storefront password"
                />
                <Button variant="primary" onClick={handleSavePassword}>Save Password</Button>
              </FormLayout>
            </BlockStack>
          </Card>
        </Layout.Section>
        {/* ── Add Pincode ── */}
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
                <Button variant="primary" onClick={handleAdd}>Add Pincode</Button>
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
