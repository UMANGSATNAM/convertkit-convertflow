import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
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

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = await db.shop.findUnique({
    where: { shopDomain: session.shop },
  });
  if (!shop) return json({ funnels: [] });
  const funnels = await db.funnel.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
  });
  return json({ funnels });
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
    const funnel = await db.funnel.findUnique({ where: { id } });
    await db.funnel.update({
      where: { id },
      data: { status: funnel.status === "active" ? "draft" : "active" },
    });
  }
  if (intent === "delete") {
    const id = formData.get("id");
    await db.funnel.delete({ where: { id } });
  }
  return json({ success: true });
};

export default function FunnelsBuilder() {
  const { funnels } = useLoaderData();
  const navigate = useNavigate();
  const submit = useSubmit();

  const handleToggle = (id) => {
    const fd = new FormData();
    fd.append("intent", "toggle");
    fd.append("id", id);
    submit(fd, { method: "post" });
  };

  const handleDelete = (id) => {
    if (confirm("Delete this funnel?")) {
      const fd = new FormData();
      fd.append("intent", "delete");
      fd.append("id", id);
      submit(fd, { method: "post" });
    }
  };

  return (
    <Page
      fullWidth
      title="Funnel Engine"
      subtitle="Design multi-step pre/post-purchase journeys to maximize AOV."
      primaryAction={{
        content: "Create Funnel",
        icon: PlusIcon,
        onAction: () => navigate("/app/funnels/new"),
      }}
    >
      <Layout>
        <Layout.Section>
          <Card padding="0">
            <Box padding={funnels.length === 0 ? "800" : "0"}>
              {funnels.length === 0 ? (
                <BlockStack gap="400" inlineAlign="center">
                  <Text variant="headingLg" as="h3">
                    No Active Funnels
                  </Text>
                  <Text variant="bodyMd" tone="subdued">
                    Create your first funnel to start upselling your customers.
                  </Text>
                  <Button
                    variant="primary"
                    icon={PlusIcon}
                    onClick={() => navigate("/app/funnels/new")}
                  >
                    Create New Funnel
                  </Button>
                </BlockStack>
              ) : (
                <ResourceList
                  resourceName={{ singular: "funnel", plural: "funnels" }}
                  items={funnels}
                  renderItem={(funnel) => (
                    <ResourceItem
                      id={funnel.id}
                      accessibilityLabel={`View ${funnel.name}`}
                    >
                      <InlineStack align="space-between" blockAlign="center">
                        <BlockStack gap="100">
                          <Text variant="bodyMd" fontWeight="semibold">
                            {funnel.name}
                          </Text>
                          <Text variant="bodySm" tone="subdued">
                            {funnel.type
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                            {funnel.generatedRevenue > 0 &&
                              ` â€¢ â‚¹${Number(funnel.generatedRevenue).toLocaleString("en-IN")} generated`}
                          </Text>
                        </BlockStack>
                        <InlineStack gap="300" blockAlign="center">
                          <Badge
                            tone={
                              funnel.status === "active" ? "success" : "new"
                            }
                          >
                            {funnel.status === "active" ? "Active" : "Draft"}
                          </Badge>
                          <Button
                            variant="plain"
                            onClick={() => handleToggle(funnel.id)}
                          >
                            {funnel.status === "active" ? "Pause" : "Activate"}
                          </Button>
                          <Button
                            variant="plain"
                            tone="critical"
                            onClick={() => handleDelete(funnel.id)}
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
        </Layout.Section>
      </Layout>
    </Page>
  );
}
