import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useSubmit, Form } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Grid,
  Box,
  Divider,
  Badge,
  ResourceList,
  ResourceItem,
  EmptySearchResult,
} from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { syncCroWidgetsToMetafield } from "../utils/metafields.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = await db.shop.findUnique({
    where: { shopDomain: session.shop },
  });
  if (!shop) return json({ widgets: [] });
  const widgets = await db.croWidget.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
  });
  return json({ widgets });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const shop = await db.shop.findUnique({
    where: { shopDomain: session.shop },
  });
  if (!shop) return json({ error: "Shop not found" }, { status: 404 });

  if (intent === "toggle") {
    const id = formData.get("id");
    const widget = await db.croWidget.findUnique({ where: { id } });
    await db.croWidget.update({
      where: { id },
      data: { status: widget.status === "active" ? "draft" : "active" },
    });
    await syncCroWidgetsToMetafield(request, session.shop);
    return json({ success: true });
  }
  if (intent === "delete") {
    const id = formData.get("id");
    await db.croWidget.delete({ where: { id } });
    await syncCroWidgetsToMetafield(request, session.shop);
    return json({ success: true });
  }
  return json({ error: "Unknown intent" }, { status: 400 });
};

const EXTENSION_LIBRARY = [
  {
    type: "popup",
    title: "Exit Intent Popup",
    desc: "Capture emails or offer last-minute discounts when users try to leave.",
    color: "#1A1A1A",
  },
  {
    type: "sticky_bar",
    title: "Sticky Add to Cart",
    desc: "Keep the ATC button visible at all times on product pages.",
    color: "#00C851",
  },
  {
    type: "countdown",
    title: "Countdown Timer",
    desc: "Create urgency on product pages or global headers.",
    color: "#FF4F00",
  },
  {
    type: "pincode",
    title: "Pincode Checker",
    desc: "Allow users to check delivery ETAs based on Indian pincodes.",
    color: "#8A2BE2",
  },
  {
    type: "free_shipping",
    title: "Free Shipping Bar",
    desc: "Motivate users to add more items to reach free shipping.",
    color: "#007BFF",
  },
  {
    type: "whatsapp",
    title: "WhatsApp Chat",
    desc: "Add a floating WhatsApp button for instant customer support.",
    color: "#25D366",
  },
];

export default function CROSuite() {
  const { widgets } = useLoaderData();
  const navigate = useNavigate();
  const submit = useSubmit();

  const handleToggle = (id) => {
    const formData = new FormData();
    formData.append("intent", "toggle");
    formData.append("id", id);
    submit(formData, { method: "post" });
  };

  const handleDelete = (id) => {
    if (confirm("Delete this extension?")) {
      const formData = new FormData();
      formData.append("intent", "delete");
      formData.append("id", id);
      submit(formData, { method: "post" });
    }
  };

  return (
    <Page
      fullWidth
      title="CRO Suite & Extensions"
      subtitle="Boost your store's conversion rate with standalone widgets."
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card padding="0">
              <Box padding="400">
                <Text variant="headingLg" as="h2">
                  Extension Library
                </Text>
              </Box>
              <Divider />
              <Box padding="400">
                <Grid>
                  {EXTENSION_LIBRARY.map((ext, idx) => (
                    <Grid.Cell
                      key={idx}
                      columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}
                    >
                      <div
                        style={{
                          padding: "24px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "12px",
                          cursor: "pointer",
                          backgroundColor: "#FAFAFA",
                          transition: "border-color 0.2s",
                        }}
                        onClick={() =>
                          navigate(`/app/cro/new?type=${ext.type}`)
                        }
                      >
                        <BlockStack gap="300">
                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              backgroundColor: ext.color,
                            }}
                          />
                          <Text variant="headingMd" as="h3">
                            {ext.title}
                          </Text>
                          <Text variant="bodySm" tone="subdued">
                            {ext.desc}
                          </Text>
                          <Button size="micro" icon={PlusIcon}>
                            Add
                          </Button>
                        </BlockStack>
                      </div>
                    </Grid.Cell>
                  ))}
                </Grid>
              </Box>
            </Card>

            <Card padding="0">
              <Box padding="400">
                <Text variant="headingLg" as="h2">
                  Active Extensions
                </Text>
              </Box>
              <Divider />
              <Box padding={widgets.length === 0 ? "800" : "0"}>
                {widgets.length === 0 ? (
                  <EmptySearchResult
                    title="No active extensions"
                    description="Add an extension from the library above to get started."
                    withIllustration
                  />
                ) : (
                  <ResourceList
                    resourceName={{
                      singular: "extension",
                      plural: "extensions",
                    }}
                    items={widgets}
                    renderItem={(widget) => (
                      <ResourceItem
                        id={widget.id}
                        accessibilityLabel={`Manage ${widget.name}`}
                      >
                        <InlineStack align="space-between" blockAlign="center">
                          <BlockStack gap="100">
                            <Text variant="headingMd" as="h3">
                              {widget.name}
                            </Text>
                            <Text variant="bodySm" tone="subdued">
                              {widget.type
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                              {" â€¢ "}
                              {widget.views.toLocaleString()} views â€¢{" "}
                              {widget.clicks.toLocaleString()} clicks
                            </Text>
                          </BlockStack>
                          <InlineStack gap="300" blockAlign="center">
                            <Badge
                              tone={
                                widget.status === "active" ? "success" : "new"
                              }
                            >
                              {widget.status === "active" ? "Active" : "Draft"}
                            </Badge>
                            <Button
                              variant="plain"
                              onClick={() => handleToggle(widget.id)}
                            >
                              {widget.status === "active"
                                ? "Pause"
                                : "Activate"}
                            </Button>
                            <Button
                              variant="plain"
                              tone="critical"
                              onClick={() => handleDelete(widget.id)}
                            >
                              Delete
                            </Button>
                          </InlineStack>
                        </InlineStack>
                      </ResourceItem>
                    )}
                  />
                )}
              </Box>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
