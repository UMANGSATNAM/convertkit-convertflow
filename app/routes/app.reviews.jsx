import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  TextField,
  Select,
  InlineStack,
  Badge,
  Divider,
  Banner,
  Box,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState, useCallback } from "react";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
};

export default function Reviews() {
  const { hasApiKey } = useLoaderData();
  const fetcher = useFetcher();

  const [delay, setDelay] = useState("14");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("general");
  const [starRating, setStarRating] = useState("5");
  const [answers, setAnswers] = useState("");

  const isGenerating = fetcher.state !== "idle";
  const generatedReview = fetcher.data?.review || "";
  const genError = fetcher.data?.error || "";

  const generateReview = () => {
    fetcher.submit(
      {
        starRating,
        productName,
        productCategory: category,
        answers,
      },
      { method: "POST", action: "/api/review-generate" }
    );
  };

  const delayOptions = [
    { label: "7 days after delivery", value: "7" },
    { label: "14 days after delivery", value: "14" },
    { label: "21 days after delivery", value: "21" },
  ];

  const categoryOptions = [
    { label: "General", value: "general" },
    { label: "Skincare & Beauty", value: "skincare" },
    { label: "Fashion & Apparel", value: "fashion" },
    { label: "Electronics", value: "electronics" },
    { label: "Home & Garden", value: "home" },
    { label: "Food & Supplements", value: "food" },
    { label: "Fitness", value: "fitness" },
  ];

  const starOptions = [
    { label: "5 Stars", value: "5" },
    { label: "4 Stars", value: "4" },
    { label: "3 Stars", value: "3" },
    { label: "2 Stars", value: "2" },
    { label: "1 Star", value: "1" },
  ];

  return (
    <Page title="Reviews">
      <TitleBar title="AI Review Writing" />
      <BlockStack gap="500">
        {/* ── Review Request Settings ── */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Automated Review Requests
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Automatically send review request emails after delivery. More
                  reviews mean better social proof and higher SEO rankings.
                </Text>
                <Divider />
                <Select
                  label="Send review request email"
                  options={delayOptions}
                  value={delay}
                  onChange={setDelay}
                />
                <Banner tone="info">
                  <p>
                    Review request emails will be sent automatically via Shopify
                    Email. Connect Klaviyo in Settings for advanced email flows.
                  </p>
                </Banner>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* ── AI Review Generator ── */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    AI Review Generator
                  </Text>
                  <Badge tone={hasApiKey ? "success" : "attention"}>
                    {hasApiKey ? "Gemini Connected" : "API Key Missing"}
                  </Badge>
                </InlineStack>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Test the AI review writing feature. Enter product details and
                  customer feedback to generate a natural-sounding review draft.
                </Text>

                {!hasApiKey && (
                  <Banner tone="warning">
                    <p>
                      Add <code>GEMINI_API_KEY</code> to your .env file to
                      enable AI review generation.
                    </p>
                  </Banner>
                )}

                <Divider />

                <TextField
                  label="Product name"
                  value={productName}
                  onChange={setProductName}
                  placeholder="e.g. Hydrating Face Serum"
                  autoComplete="off"
                />

                <InlineStack gap="300">
                  <div style={{ flex: 1 }}>
                    <Select
                      label="Product category"
                      options={categoryOptions}
                      value={category}
                      onChange={setCategory}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Select
                      label="Star rating"
                      options={starOptions}
                      value={starRating}
                      onChange={setStarRating}
                    />
                  </div>
                </InlineStack>

                <TextField
                  label="Customer notes"
                  value={answers}
                  onChange={setAnswers}
                  multiline={3}
                  placeholder="What did you love most? What problem did it solve? (separate with |)"
                  helpText="Use | to separate multiple answers"
                  autoComplete="off"
                />

                <Button
                  variant="primary"
                  onClick={generateReview}
                  loading={isGenerating}
                  disabled={!productName || !hasApiKey}
                >
                  Generate Review with AI
                </Button>

                {genError && (
                  <Banner tone="critical">
                    <p>{genError}</p>
                  </Banner>
                )}

                {generatedReview && (
                  <Card>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingSm">
                        Generated Review Draft
                      </Text>
                      <Box
                        padding="400"
                        background="bg-surface-secondary"
                        borderRadius="200"
                      >
                        <Text as="p" variant="bodyMd">
                          {generatedReview}
                        </Text>
                      </Box>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Customers can edit this draft before submitting.
                      </Text>
                    </BlockStack>
                  </Card>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
