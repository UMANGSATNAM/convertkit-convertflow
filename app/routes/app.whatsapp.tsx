import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  TextField,
  Button,
  InlineStack,
  Badge,
  DataTable,
  Banner
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  
  const merchant = await prisma.merchant.findUnique({
    where: { shopDomain: session.shop }
  });

  if (!merchant) {
    throw new Response("Merchant not found", { status: 404 });
  }

  const messages = await prisma.whatsappMessage.findMany({
    where: { merchantId: merchant.id },
    orderBy: { sentAt: 'desc' },
    take: 20
  });

  const abandonedCarts = await prisma.abandonedCart.findMany({
    where: { merchantId: merchant.id },
    orderBy: { abandonedAt: 'desc' },
    take: 10
  });

  return json({
    merchantId: merchant.id,
    whatsappPhoneNumberId: merchant.whatsappPhoneNumberId || "",
    whatsappAccessToken: merchant.whatsappAccessToken ? "********" : "",
    messages,
    abandonedCarts
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const phoneId = formData.get("phoneId") as string;
  const accessToken = formData.get("accessToken") as string;

  if (!phoneId || !accessToken) {
    return json({ success: false, error: "Missing required fields" }, { status: 400 });
  }

  await prisma.merchant.update({
    where: { shopDomain: session.shop },
    data: {
      whatsappPhoneNumberId: phoneId,
      // Only update token if it's not the masked value
      ...(accessToken !== "********" ? { whatsappAccessToken: accessToken } : {})
    }
  });

  return json({ success: true });
};

export default function WhatsappConfigPage() {
  const { whatsappPhoneNumberId, whatsappAccessToken, messages, abandonedCarts } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<any>();
  
  const [phoneId, setPhoneId] = useState(whatsappPhoneNumberId);
  const [token, setToken] = useState(whatsappAccessToken);

  const handleSave = useCallback(() => {
    fetcher.submit(
      { phoneId, accessToken: token },
      { method: "post" }
    );
  }, [phoneId, token, fetcher]);

  const isConfigured = whatsappPhoneNumberId && whatsappAccessToken;

  return (
    <Page title="WhatsApp & Abandoned Cart Recovery">
      <Layout>
        <Layout.Section>
          {!isConfigured && (
            <Banner title="WhatsApp not configured" tone="warning">
              Please enter your Meta Cloud API credentials to enable automated abandoned cart recovery.
            </Banner>
          )}

          <div style={{ marginTop: '20px' }}>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Meta API Credentials</Text>
                <Text as="p" tone="subdued">
                  Connect your official WhatsApp Business API account to send automated recovery messages.
                </Text>
                
                <TextField
                  label="WhatsApp Phone Number ID"
                  value={phoneId}
                  onChange={setPhoneId}
                  autoComplete="off"
                  helpText="Found in your Meta App Dashboard under WhatsApp > Getting Started"
                />
                
                <TextField
                  label="Permanent Access Token"
                  value={token}
                  onChange={setToken}
                  type="password"
                  autoComplete="off"
                  helpText="Generate a system user token in Business Settings with whatsapp_business_messaging permissions"
                />

                <InlineStack align="end">
                  <Button 
                    variant="primary" 
                    onClick={handleSave} 
                    loading={fetcher.state === "submitting"}
                  >
                    Save Credentials
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </div>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Recent Abandoned Carts</Text>
              {abandonedCarts.length > 0 ? (
                <DataTable
                  columnContentTypes={['text', 'text', 'numeric', 'text']}
                  headings={['Customer', 'Phone', 'Cart Value', 'Status']}
                  rows={abandonedCarts.map(cart => [
                    cart.customerEmail || "Unknown",
                    cart.customerPhone || "N/A",
                    `₹${cart.cartTotal}`,
                    <Badge tone={cart.recovered ? "success" : "info"}>
                      {cart.recovered ? "Recovered" : `Stage ${cart.recoveryStage}`}
                    </Badge>
                  ])}
                />
              ) : (
                <Text as="p" tone="subdued">No abandoned carts tracked yet.</Text>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Message Log</Text>
              {messages.length > 0 ? (
                <DataTable
                  columnContentTypes={['text', 'text', 'text', 'text']}
                  headings={['Date', 'To', 'Template', 'Status']}
                  rows={messages.map(msg => [
                    new Date(msg.sentAt || new Date()).toLocaleString(),
                    msg.toPhone,
                    msg.templateName,
                    <Badge tone={msg.status === "failed" ? "critical" : "success"}>
                      {msg.status}
                    </Badge>
                  ])}
                />
              ) : (
                <Text as="p" tone="subdued">No messages sent yet.</Text>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
