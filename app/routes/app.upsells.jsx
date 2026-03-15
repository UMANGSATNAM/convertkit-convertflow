import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  TextField,
  FormLayout,
  InlineStack,
  Badge,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import { useState, useEffect } from "react";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({
    where: { shopDomain: session.shop },
    select: { settings: true }
  });

  const settings = shop?.settings ? JSON.parse(shop.settings) : {};
  return json({ upsell: settings.upsell || {} });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  
  const upsellConfig = {
    isActive: formData.get("isActive") === "true",
    triggerHandle: formData.get("triggerHandle"),
    offerHandle: formData.get("offerHandle"),
    title: formData.get("title") || "Wait! Add this to your order",
    discountText: formData.get("discountText") || "10% OFF"
  };

  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  const settings = shop?.settings ? JSON.parse(shop.settings) : {};
  settings.upsell = upsellConfig;

  await prisma.shop.update({
    where: { shopDomain: session.shop },
    data: { settings: JSON.stringify(settings) }
  });

  return json({ success: true });
};

export default function Upsells() {
  const { upsell } = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const shopify = useAppBridge();

  const [isActive, setIsActive] = useState(upsell.isActive || false);
  const [triggerHandle, setTriggerHandle] = useState(upsell.triggerHandle || "");
  const [offerHandle, setOfferHandle] = useState(upsell.offerHandle || "");
  const [title, setTitle] = useState(upsell.title || "Wait! Add this to your order");
  const [discountText, setDiscountText] = useState(upsell.discountText || "10% OFF");

  const isSaving = navigation.state === "submitting";

  useEffect(() => {
    if (navigation.state === "idle" && navigation.formMethod === "POST") {
      shopify.toast.show("Upsell rules saved successfully");
    }
  }, [navigation.state, navigation.formMethod, shopify]);

  const handleSave = () => {
    submit(
      {
        isActive: isActive.toString(),
        triggerHandle,
        offerHandle,
        title,
        discountText,
      },
      { method: "POST" }
    );
  };

  return (
    <Page 
      title="Upsells" 
      primaryAction={{
        content: "Save",
        loading: isSaving,
        onAction: handleSave,
      }}
    >
      <TitleBar title="Upsell Engine" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">In-Cart Upsell Popup</Text>
                  <Button 
                    onClick={() => setIsActive(!isActive)} 
                    tone={isActive ? "critical" : "success"}
                  >
                    {isActive ? "Disable" : "Enable"}
                  </Button>
                </InlineStack>
                {isActive && <Badge tone="success">Active</Badge>}

                <FormLayout>
                  <FormLayout.Group condensed>
                    <TextField
                      label="Trigger Product Handle"
                      value={triggerHandle}
                      onChange={setTriggerHandle}
                      autoComplete="off"
                      helpText="The product handle that triggers the popup when added to cart."
                    />
                    <TextField
                      label="Offer Product Handle"
                      value={offerHandle}
                      onChange={setOfferHandle}
                      autoComplete="off"
                      helpText="The product to offer as an upsell."
                    />
                  </FormLayout.Group>
                  <FormLayout.Group condensed>
                    <TextField
                      label="Modal Title"
                      value={title}
                      onChange={setTitle}
                      autoComplete="off"
                    />
                    <TextField
                      label="Badge / Discount Text"
                      value={discountText}
                      onChange={setDiscountText}
                      autoComplete="off"
                    />
                  </FormLayout.Group>
                </FormLayout>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <Text as="h3" variant="headingMd">How it works</Text>
                <Text as="p" tone="subdued">
                  When a customer adds the <strong>Trigger Product</strong> to their cart, our script intercepts the action and displays a beautiful modal offering the <strong>Offer Product</strong>.
                </Text>
                <Text as="p" tone="subdued">
                  If they accept, both products are added to the cart instantly. This drastically increases AOV.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
