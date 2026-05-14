import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
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
  Spinner,
} from "@shopify/polaris";
import { PlusIcon, CartIcon, AppsIcon } from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = await db.shop.findUnique({
    where: { shopDomain: session.shop },
  });
  if (!shop) return json({ bundles: [] });
  const bundles = await db.bundle.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
  });
  return json({ bundles });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const shop = await db.shop.findUnique({
    where: { shopDomain: session.shop },
  });
  if (!shop) return json({ error: "Shop not found" }, { status: 404 });

  if (intent === "delete") {
    const id = formData.get("id");
    await db.bundle.delete({ where: { id } });
    return json({ success: true });
  }
  if (intent === "toggle") {
    const id = formData.get("id");
    const bundle = await db.bundle.findUnique({ where: { id } });
    await db.bundle.update({
      where: { id },
      data: { status: bundle.status === "active" ? "draft" : "active" },
    });
    return json({ success: true });
  }
  return json({ error: "Unknown intent" }, { status: 400 });
};

export default function BundlesBuilder() {
  const { bundles } = useLoaderData();
  const navigate = useNavigate();

  const bundleTypeItems = [
    {
      type: "fixed",
      title: "Fixed Bundle",
      desc: "Sell a specific set of products together for a fixed price or discount.",
      icon: CartIcon,
      color: "#1A1A1A",
    },
    {
      type: "mix_and_match",
      title: "Mix & Match",
      desc: "Let customers choose products from specific collections.",
      icon: AppsIcon,
      color: "#00C851",
    },
    {
      type: "buy_x_get_y",
      title: "Buy X Get Y",
      desc: "Offer a free or discounted product when customers buy a specific item.",
      icon: PlusIcon,
      color: "#FF4F00",
    },
    {
      type: "volume_discount",
      title: "Volume Discount",
      desc: "Offer tiered discounts based on the quantity purchased.",
      icon: CartIcon,
      color: "#8A2BE2",
    },
  ];

  return (
    <Page
      fullWidth
      title="Bundle Builder"
      primaryAction={{
        content: "Create Bundle",
        icon: PlusIcon,
        onAction: () => navigate("/app/bundles/new"),
      }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {bundles.length === 0 && (
              <Card padding="0">
                <Box padding="400">
                  <Text variant="headingLg" as="h2">
                    Select Bundle Type
                  </Text>
                  <Text variant="bodyMd" tone="subdued">
                    Choose the pricing structure that best fits your strategy.
                  </Text>
                </Box>
                <Divider />
                <Box padding="400">
                  <Grid>
                    {bundleTypeItems.map((type, idx) => (
                      <Grid.Cell
                        key={idx}
                        columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}
                      >
                        <div
                          style={{
                            padding: "24px",
                            border: "1px solid #E5E7EB",
                            borderRadius: "12px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            backgroundColor: "#FAFAFA",
                          }}
                          onClick={() =>
                            navigate(`/app/bundles/new?type=${type.type}`)
                          }
                        >
                          <BlockStack gap="300">
                            <div
                              style={{
                                padding: "8px",
                                background: type.color,
                                borderRadius: "8px",
                                width: "fit-content",
                                color: "white",
                              }}
                            >
                              <Button
                                icon={type.icon}
                                variant="monochromePlain"
                              />
                            </div>
                            <Text variant="headingMd" as="h3">
                              {type.title}
                            </Text>
                            <Text variant="bodySm" tone="subdued">
                              {type.desc}
                            </Text>
                          </BlockStack>
                        </div>
                      </Grid.Cell>
                    ))}
                  </Grid>
                </Box>
              </Card>
            )}

            <Card padding="0">
              <Box padding="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text variant="headingLg" as="h2">
                    Active Bundles
                  </Text>
                  <Button
                    variant="plain"
                    icon={PlusIcon}
                    onClick={() => navigate("/app/bundles/new")}
                  >
                    New
                  </Button>
                </InlineStack>
              </Box>
              <Divider />
              <Box padding={bundles.length === 0 ? "800" : "0"}>
                {bundles.length === 0 ? (
                  <EmptySearchResult
                    title="No bundles yet"
                    description="Create your first bundle to start boosting your AOV."
                    withIllustration
                  />
                ) : (
                  <ResourceList
                    resourceName={{ singular: "bundle", plural: "bundles" }}
                    items={bundles}
                    renderItem={(bundle) => (
                      <ResourceItem
                        id={bundle.id}
                        accessibilityLabel={`View ${bundle.name}`}
                        onClick={() => navigate(`/app/bundles/${bundle.id}`)}
                      >
                        <InlineStack align="space-between" blockAlign="center">
                          <BlockStack gap="100">
                            <Text variant="bodyMd" fontWeight="semibold">
                              {bundle.name}
                            </Text>
                            <Text variant="bodySm" tone="subdued">
                              {bundle.type
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </Text>
                          </BlockStack>
                          <InlineStack gap="300" blockAlign="center">
                            {bundle.generatedRevenue > 0 && (
                              <Text variant="bodyMd" fontWeight="semibold">
                                â‚¹
                                {Number(bundle.generatedRevenue).toLocaleString(
                                  "en-IN",
                                )}{" "}
                                generated
                              </Text>
                            )}
                            <Badge
                              tone={
                                bundle.status === "active" ? "success" : "new"
                              }
                            >
                              {bundle.status === "active" ? "Active" : "Draft"}
                            </Badge>
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
