import { json, redirect } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
  useSubmit,
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
  Thumbnail,
  Badge,
  EmptySearchResult,
  PageActions,
  Banner,
} from "@shopify/polaris";
import { PlusIcon, ImageAltIcon } from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request, params }) => {
  const { session, admin } = await authenticate.admin(request);
  // Fetch products from Shopify via Admin API
  const response = await admin.graphql(`
    query { products(first: 20) { edges { node {
      id title featuredImage { url }
      priceRange { minVariantPrice { amount currencyCode } }
    }}}}
  `);
  const data = await response.json();
  const products = data.data.products.edges.map(({ node }) => ({
    id: node.id,
    name: node.title,
    price: `${node.priceRange.minVariantPrice.currencyCode} ${Number(node.priceRange.minVariantPrice.amount).toFixed(0)}`,
    image: node.featuredImage?.url || null,
  }));
  return json({ products });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const name = formData.get("name");
  const type = formData.get("type");
  const status = formData.get("status");
  const discountType = formData.get("discountType");
  const discountValue = formData.get("discountValue");
  const productIds = formData.getAll("productIds");

  if (!name || name.trim() === "") {
    return json({ error: "Bundle name is required." });
  }

  const shop = await db.shop.findUnique({
    where: { shopDomain: session.shop },
  });
  if (!shop) return json({ error: "Shop not found" }, { status: 404 });

  await db.bundle.create({
    data: {
      shopId: shop.id,
      name: name.trim(),
      type: type || "fixed",
      status: status || "draft",
      config: JSON.stringify({ discountType, discountValue, productIds }),
    },
  });

  return redirect("/app/bundles");
};

export default function NewBundle() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { products } = useLoaderData();
  const actionData = useActionData();
  const type = searchParams.get("type") || "fixed";

  const [bundleName, setBundleName] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [status, setStatus] = useState("active");
  const [selectedProducts, setSelectedProducts] = useState([]);

  const typeLabels = {
    fixed: "Fixed Bundle",
    mix_and_match: "Mix & Match",
    buy_x_get_y: "Buy X Get Y",
    volume_discount: "Volume Discount",
  };

  const toggleProduct = (product) => {
    setSelectedProducts((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product],
    );
  };

  return (
    <Page
      breadcrumbs={[
        { content: "Bundles", onAction: () => navigate("/app/bundles") },
      ]}
      title={`Create ${typeLabels[type] || "Bundle"}`}
    >
      {actionData?.error && (
        <Box paddingBlockEnd="400">
          <Banner tone="critical">{actionData.error}</Banner>
        </Box>
      )}
      <Form method="post">
        <input type="hidden" name="type" value={type} />
        {selectedProducts.map((p) => (
          <input key={p.id} type="hidden" name="productIds" value={p.id} />
        ))}
        <Layout>
          <Layout.Section>
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Bundle Details
                  </Text>
                  <TextField
                    label="Bundle Name"
                    name="name"
                    value={bundleName}
                    onChange={setBundleName}
                    placeholder="e.g., Ultimate Skincare Routine"
                    autoComplete="off"
                    helpText="This will be visible to customers on your storefront."
                  />
                </BlockStack>
              </Card>

              <Card padding="0">
                <Box padding="400">
                  <InlineStack align="space-between">
                    <Text variant="headingMd" as="h2">
                      Select Products
                    </Text>
                    <Text variant="bodySm" tone="subdued">
                      {selectedProducts.length} selected
                    </Text>
                  </InlineStack>
                </Box>
                <Divider />
                <Box padding="400">
                  <BlockStack gap="300">
                    {products.map((product) => {
                      const isSelected = selectedProducts.find(
                        (p) => p.id === product.id,
                      );
                      return (
                        <div
                          key={product.id}
                          onClick={() => toggleProduct(product)}
                          style={{
                            padding: "12px 16px",
                            border: `2px solid ${isSelected ? "#000" : "#E5E7EB"}`,
                            borderRadius: "8px",
                            cursor: "pointer",
                            backgroundColor: isSelected ? "#F9F9F9" : "white",
                            transition: "all 0.15s",
                          }}
                        >
                          <InlineStack
                            align="space-between"
                            blockAlign="center"
                          >
                            <InlineStack gap="300" blockAlign="center">
                              <Thumbnail
                                source={product.image || ImageAltIcon}
                                alt={product.name}
                                size="small"
                              />
                              <BlockStack gap="100">
                                <Text variant="bodyMd" fontWeight="semibold">
                                  {product.name}
                                </Text>
                                <Text variant="bodySm" tone="subdued">
                                  {product.price}
                                </Text>
                              </BlockStack>
                            </InlineStack>
                            {isSelected && (
                              <Badge tone="success">Selected</Badge>
                            )}
                          </InlineStack>
                        </div>
                      );
                    })}
                  </BlockStack>
                </Box>
              </Card>

              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Discount Structure
                  </Text>
                  <InlineStack gap="400" wrap={false}>
                    <Box width="30%">
                      <Select
                        label="Discount Type"
                        name="discountType"
                        options={[
                          { label: "Percentage (%)", value: "percentage" },
                          { label: "Fixed Amount (â‚¹)", value: "fixed" },
                        ]}
                        value={discountType}
                        onChange={setDiscountType}
                      />
                    </Box>
                    <Box width="70%">
                      <TextField
                        label="Discount Value"
                        name="discountValue"
                        value={discountValue}
                        onChange={setDiscountValue}
                        placeholder="e.g., 15"
                        type="number"
                        autoComplete="off"
                        prefix={discountType === "percentage" ? "" : "â‚¹"}
                        suffix={discountType === "percentage" ? "%" : ""}
                      />
                    </Box>
                  </InlineStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Status
                  </Text>
                  <Select
                    label="Bundle Status"
                    name="status"
                    labelHidden
                    options={[
                      { label: "Draft", value: "draft" },
                      { label: "Active", value: "active" },
                    ]}
                    value={status}
                    onChange={setStatus}
                  />
                </BlockStack>
              </Card>
              {selectedProducts.length > 0 && discountValue && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Summary
                    </Text>
                    <Text variant="bodySm" tone="subdued">
                      {selectedProducts.length} products selected with a{" "}
                      {discountValue}
                      {discountType === "percentage" ? "% " : "â‚¹ "} discount.
                    </Text>
                  </BlockStack>
                </Card>
              )}
            </BlockStack>
          </Layout.Section>
        </Layout>
        <PageActions
          primaryAction={{ content: "Save Bundle", submit: true }}
          secondaryActions={[
            { content: "Cancel", onAction: () => navigate("/app/bundles") },
          ]}
        />
      </Form>
    </Page>
  );
}
