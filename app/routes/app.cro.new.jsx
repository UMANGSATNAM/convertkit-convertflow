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
  PageActions,
  Banner,
  ColorPicker,
  hsbToHex,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { syncCroWidgetsToMetafield } from "../utils/metafields.server";

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const name = formData.get("name");
  const type = formData.get("type");
  const status = formData.get("status");
  const headline = formData.get("headline");
  const bodyText = formData.get("bodyText");
  const buttonText = formData.get("buttonText");
  const primaryColor = formData.get("primaryColor");
  const displayOn = formData.get("displayOn");
  const trigger = formData.get("trigger");

  if (!name || name.trim() === "") {
    return json({ error: "Extension name is required." });
  }

  const shop = await db.shop.findUnique({
    where: { shopDomain: session.shop },
  });
  if (!shop) return json({ error: "Shop not found" }, { status: 404 });

  await db.croWidget.create({
    data: {
      shopId: shop.id,
      name: name.trim(),
      type: type || "popup",
      status: status || "draft",
      config: JSON.stringify({
        headline,
        bodyText,
        buttonText,
        primaryColor,
        displayOn,
        trigger,
      }),
    },
  });

  await syncCroWidgetsToMetafield(request, session.shop);

  return redirect("/app/cro");
};

const typeLabels = {
  popup: "Exit Intent Popup",
  sticky_bar: "Sticky Add to Cart",
  countdown: "Countdown Timer",
  pincode: "Pincode Checker",
  free_shipping: "Free Shipping Bar",
  whatsapp: "WhatsApp Chat",
};

export default function NewCroWidget() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const actionData = useActionData();
  const type = searchParams.get("type") || "popup";

  const [widgetName, setWidgetName] = useState("");
  const [status, setStatus] = useState("active");
  const [headline, setHeadline] = useState("Wait! Don't leave yet ðŸ‘‹");
  const [bodyText, setBodyText] = useState(
    "Get 10% off your first order by signing up today.",
  );
  const [buttonText, setButtonText] = useState("Claim My 10% Off");
  const [displayOn, setDisplayOn] = useState("all");
  const [trigger, setTrigger] = useState("exit");
  const [color, setColor] = useState({ hue: 0, brightness: 0, saturation: 0 });

  return (
    <Page
      breadcrumbs={[
        { content: "CRO Suite", onAction: () => navigate("/app/cro") },
      ]}
      title={`Create ${typeLabels[type] || "Extension"}`}
    >
      {actionData?.error && (
        <Box paddingBlockEnd="400">
          <Banner tone="critical">{actionData.error}</Banner>
        </Box>
      )}
      <Form method="post">
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="primaryColor" value={hsbToHex(color)} />
        <Layout>
          <Layout.Section>
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Extension Details
                  </Text>
                  <TextField
                    label="Name (internal)"
                    name="name"
                    value={widgetName}
                    onChange={setWidgetName}
                    placeholder={`e.g., Summer Campaign ${typeLabels[type]}`}
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Content & Design
                  </Text>
                  {(type === "popup" ||
                    type === "sticky_bar" ||
                    type === "free_shipping") && (
                    <BlockStack gap="300">
                      <TextField
                        label="Headline"
                        name="headline"
                        value={headline}
                        onChange={setHeadline}
                        autoComplete="off"
                      />
                      <TextField
                        label="Body Text"
                        name="bodyText"
                        value={bodyText}
                        onChange={setBodyText}
                        multiline={3}
                        autoComplete="off"
                      />
                      <TextField
                        label="Button Text"
                        name="buttonText"
                        value={buttonText}
                        onChange={setButtonText}
                        autoComplete="off"
                      />
                    </BlockStack>
                  )}
                  {type === "whatsapp" && (
                    <TextField
                      label="WhatsApp Phone Number"
                      name="buttonText"
                      value={buttonText}
                      onChange={setButtonText}
                      placeholder="+91 98765 43210"
                      autoComplete="off"
                      helpText="Include country code (e.g. +91 for India)"
                    />
                  )}
                  {type === "countdown" && (
                    <TextField
                      label="Countdown Headline"
                      name="headline"
                      value={headline}
                      onChange={setHeadline}
                      placeholder="ðŸ”¥ Sale ends in..."
                      autoComplete="off"
                    />
                  )}

                  <Divider />
                  <Text variant="bodyMd" fontWeight="semibold">
                    Primary Color
                  </Text>
                  <ColorPicker onChange={setColor} color={color} />
                  <Text variant="bodySm" tone="subdued">
                    Selected: {hsbToHex(color)}
                  </Text>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Targeting
                  </Text>
                  <Select
                    label="Display On"
                    name="displayOn"
                    options={[
                      { label: "All Pages", value: "all" },
                      { label: "Product Pages Only", value: "product" },
                      { label: "Cart Page Only", value: "cart" },
                      { label: "Specific Collections", value: "collection" },
                    ]}
                    value={displayOn}
                    onChange={setDisplayOn}
                  />
                  {type === "popup" && (
                    <Select
                      label="Trigger Condition"
                      name="trigger"
                      options={[
                        { label: "Exit Intent", value: "exit" },
                        { label: "Time on Page (10s)", value: "time" },
                        { label: "Scroll (50%)", value: "scroll" },
                      ]}
                      value={trigger}
                      onChange={setTrigger}
                    />
                  )}
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Status
                  </Text>
                  <Select
                    label="Status"
                    name="status"
                    labelHidden
                    options={[
                      {
                        label: "Draft (save without activating)",
                        value: "draft",
                      },
                      {
                        label: "Active (go live immediately)",
                        value: "active",
                      },
                    ]}
                    value={status}
                    onChange={setStatus}
                  />
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
        <PageActions
          primaryAction={{ content: "Save Extension", submit: true }}
          secondaryActions={[
            { content: "Cancel", onAction: () => navigate("/app/cro") },
          ]}
        />
      </Form>
    </Page>
  );
}
