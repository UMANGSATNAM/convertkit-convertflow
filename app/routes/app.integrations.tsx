import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  TextField,
  Button,
  InlineStack,
  FormLayout,
  Banner
} from "@shopify/polaris";
import { useLoaderData, useSubmit, useActionData, useNavigation } from "@remix-run/react";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useState, useCallback } from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const merchant = await prisma.merchant.findUnique({ 
    where: { shopDomain: session.shop },
    select: {
      razorpayKeyId: true,
      razorpayKeySecret: true,
      shiprocketEmail: true,
      shiprocketToken: true,
      facebookAccessToken: true,
      facebookAdAccountId: true
    }
  });

  return json({ merchant });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  
  const razorpayKeyId = formData.get("razorpayKeyId") as string;
  const razorpayKeySecret = formData.get("razorpayKeySecret") as string;
  const shiprocketEmail = formData.get("shiprocketEmail") as string;
  const shiprocketToken = formData.get("shiprocketToken") as string;
  const facebookAccessToken = formData.get("facebookAccessToken") as string;
  const facebookAdAccountId = formData.get("facebookAdAccountId") as string;

  try {
    await prisma.merchant.update({
      where: { shopDomain: session.shop },
      data: {
        razorpayKeyId: razorpayKeyId || null,
        razorpayKeySecret: razorpayKeySecret || null,
        shiprocketEmail: shiprocketEmail || null,
        shiprocketToken: shiprocketToken || null,
        facebookAccessToken: facebookAccessToken || null,
        facebookAdAccountId: facebookAdAccountId || null,
      }
    });

    return json({ success: true, message: "Integrations updated successfully!" });
  } catch (error) {
    console.error("Failed to update integrations", error);
    return json({ success: false, message: "Failed to update integrations." }, { status: 500 });
  }
};

export default function IntegrationsConfig() {
  const { merchant } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigation = useNavigation();

  const isSaving = navigation.state === "submitting";

  const [razorpayKeyId, setRazorpayKeyId] = useState(merchant?.razorpayKeyId || "");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState(merchant?.razorpayKeySecret || "");
  const [shiprocketEmail, setShiprocketEmail] = useState(merchant?.shiprocketEmail || "");
  const [shiprocketToken, setShiprocketToken] = useState(merchant?.shiprocketToken || "");
  const [facebookAccessToken, setFacebookAccessToken] = useState(merchant?.facebookAccessToken || "");
  const [facebookAdAccountId, setFacebookAdAccountId] = useState(merchant?.facebookAdAccountId || "");

  const handleSave = useCallback(() => {
    submit(
      {
        razorpayKeyId,
        razorpayKeySecret,
        shiprocketEmail,
        shiprocketToken,
        facebookAccessToken,
        facebookAdAccountId
      },
      { method: "post" }
    );
  }, [
    razorpayKeyId, razorpayKeySecret, 
    shiprocketEmail, shiprocketToken, 
    facebookAccessToken, facebookAdAccountId, 
    submit
  ]);

  return (
    <Page 
      title="Integrations & API Keys" 
      subtitle="Connect ConvertKit Pro to your external tools for live profit calculation."
      backAction={{ content: 'Profit Dashboard', url: '/app/profit' }}
    >
      <BlockStack gap="500">
        {actionData?.success === true && (
          <Banner title="Keys Saved" tone="success">
            <p>{actionData.message}</p>
          </Banner>
        )}
        
        {actionData?.success === false && (
          <Banner title="Error" tone="critical">
            <p>{actionData.message}</p>
          </Banner>
        )}

        <Layout>
          <Layout.AnnotatedSection
            title="Razorpay Settings"
            description="Enter your Razorpay Key ID and Secret to automatically sync exact PG fees per transaction."
          >
            <Card>
              <FormLayout>
                <TextField
                  label="Key ID"
                  value={razorpayKeyId}
                  onChange={setRazorpayKeyId}
                  autoComplete="off"
                  helpText="Found in Razorpay Dashboard > Settings > API Keys"
                />
                <TextField
                  label="Key Secret"
                  value={razorpayKeySecret}
                  onChange={setRazorpayKeySecret}
                  autoComplete="off"
                  type="password"
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>

          <Layout.AnnotatedSection
            title="Shiprocket Settings"
            description="Enter your Shiprocket API Token to pull live shipping and RTO costs for orders."
          >
            <Card>
              <FormLayout>
                <TextField
                  label="Registered Email"
                  value={shiprocketEmail}
                  onChange={setShiprocketEmail}
                  autoComplete="email"
                />
                <TextField
                  label="API Token"
                  value={shiprocketToken}
                  onChange={setShiprocketToken}
                  autoComplete="off"
                  type="password"
                  helpText="Found in Shiprocket Dashboard > API > Create Token"
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>

          <Layout.AnnotatedSection
            title="Facebook (Meta) Ads"
            description="Connect your Meta ad account to attribute live ad spend (CAC) to today's profit."
          >
            <Card>
              <FormLayout>
                <TextField
                  label="System User Access Token"
                  value={facebookAccessToken}
                  onChange={setFacebookAccessToken}
                  autoComplete="off"
                  type="password"
                  helpText="Needs ads_read permission"
                />
                <TextField
                  label="Ad Account ID"
                  value={facebookAdAccountId}
                  onChange={setFacebookAdAccountId}
                  autoComplete="off"
                  helpText="Example: act_1234567890"
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>

          <Layout.Section>
            <InlineStack align="end">
              <Button variant="primary" onClick={handleSave} loading={isSaving}>
                Save Integrations
              </Button>
            </InlineStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
