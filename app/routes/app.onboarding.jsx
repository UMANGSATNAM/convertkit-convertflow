import {
  Page,
  Card,
  BlockStack,
  Text,
  Button,
  InlineStack,
  Badge,
  Select,
  Grid,
  Box,
  Divider,
  ProgressBar,
  Banner,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState } from "react";
import { getThemeList } from "../lib/theme-presets";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const themes = getThemeList();
  return json({ themes, shop: session.shop });
};

const TOTAL_STEPS = 5;

// ── Store Audit Items ──
const AUDIT_ITEMS = [
  { feature: "Sticky cart button", status: "missing" },
  { feature: "Trust badges", status: "missing" },
  { feature: "Urgency signals", status: "missing" },
  { feature: "Review display", status: "missing" },
  { feature: "Theme optimization", status: "missing" },
  { feature: "Email capture", status: "missing" },
  { feature: "Mobile optimization", status: "partial" },
  { feature: "Page speed", status: "pass" },
];

export default function Onboarding() {
  const { themes } = useLoaderData();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [step, setStep] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [reviewDelay, setReviewDelay] = useState("14");

  const progress = (step / TOTAL_STEPS) * 100;
  const isApplying = fetcher.state !== "idle";

  const nextStep = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const applyTheme = (name) => {
    setSelectedTheme(name);
    fetcher.submit(
      { themeName: name },
      { method: "POST", action: "/api/theme-apply" }
    );
  };

  const enableScript = () => {
    fetcher.submit({}, { method: "POST", action: "/api/script-tag" });
  };

  const finishOnboarding = () => {
    navigate("/app");
  };

  return (
    <Page>
      <BlockStack gap="600">
        {/* ── Progress Bar ── */}
        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between">
              <Text as="h2" variant="headingMd">
                Set up your store — Step {step} of {TOTAL_STEPS}
              </Text>
              <Badge>{Math.round(progress)}% complete</Badge>
            </InlineStack>
            <ProgressBar progress={progress} size="small" tone="primary" />
            <InlineStack gap="100">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <Box
                  key={i}
                  background={
                    i < step ? "bg-fill-success" : "bg-surface-secondary"
                  }
                  borderRadius="full"
                  padding="050"
                  minWidth="10px"
                  minHeight="10px"
                />
              ))}
            </InlineStack>
          </BlockStack>
        </Card>

        {/* ── Step 1: Store Audit ── */}
        {step === 1 && (
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingLg">
                Your store health check
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                We scanned your store. Here is what we found:
              </Text>
              <Divider />
              <BlockStack gap="200">
                {AUDIT_ITEMS.map((item) => (
                  <InlineStack
                    key={item.feature}
                    align="space-between"
                    blockAlign="center"
                  >
                    <Text as="span" variant="bodyMd">
                      {item.feature}
                    </Text>
                    <Badge
                      tone={
                        item.status === "pass"
                          ? "success"
                          : item.status === "partial"
                          ? "warning"
                          : "critical"
                      }
                    >
                      {item.status === "pass"
                        ? "Good"
                        : item.status === "partial"
                        ? "Partial"
                        : "Missing"}
                    </Badge>
                  </InlineStack>
                ))}
              </BlockStack>
              <Divider />
              <InlineStack align="space-between">
                <Button variant="plain" onClick={nextStep}>
                  Set up later
                </Button>
                <Button variant="primary" onClick={nextStep}>
                  Fix all of these now
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        )}

        {/* ── Step 2: Theme Picker ── */}
        {step === 2 && (
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingLg">
                Pick a theme that fits your brand
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Choose your starting style. You can always change this later.
              </Text>

              {fetcher.data?.success && (
                <Banner tone="success">
                  <p>
                    Applied <strong>{fetcher.data.theme}</strong> to your store.
                  </p>
                </Banner>
              )}

              <Grid>
                {themes.map((theme) => (
                  <Grid.Cell
                    key={theme.name}
                    columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}
                  >
                    <Card>
                      <BlockStack gap="200">
                        <InlineStack gap="100">
                          {theme.previewColors.map((color, i) => (
                            <div
                              key={i}
                              style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: color,
                                border: "1px solid rgba(0,0,0,0.1)",
                              }}
                            />
                          ))}
                        </InlineStack>
                        <Text as="h3" variant="headingSm">
                          {theme.name}
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          {theme.bestFor}
                        </Text>
                        <Button
                          variant={
                            selectedTheme === theme.name
                              ? "secondary"
                              : "primary"
                          }
                          onClick={() => applyTheme(theme.name)}
                          loading={isApplying && selectedTheme === theme.name}
                        >
                          {selectedTheme === theme.name
                            ? "Selected"
                            : "Apply"}
                        </Button>
                      </BlockStack>
                    </Card>
                  </Grid.Cell>
                ))}
              </Grid>

              <InlineStack align="space-between">
                <Button variant="plain" onClick={nextStep}>
                  Set up later
                </Button>
                <Button variant="primary" onClick={nextStep}>
                  Continue
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        )}

        {/* ── Step 3: Quick Wins ── */}
        {step === 3 && (
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingLg">
                Turn on your three most important tools
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Each toggle activates instantly on your live store.
              </Text>
              <Divider />

              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text as="span" variant="bodyMd" fontWeight="semibold">
                    Sticky Add to Cart
                  </Text>
                  <Text as="span" variant="bodySm" tone="subdued">
                    Persistent buy button that follows customers
                  </Text>
                </BlockStack>
                <Button variant="primary" onClick={enableScript}>
                  Enable
                </Button>
              </InlineStack>

              <Divider />

              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text as="span" variant="bodyMd" fontWeight="semibold">
                    Inventory Scarcity Counter
                  </Text>
                  <Text as="span" variant="bodySm" tone="subdued">
                    Shows real stock level with color-coded bar
                  </Text>
                </BlockStack>
                <Button
                  variant="primary"
                  onClick={() =>
                    fetcher.submit(
                      { toolType: "scarcity", isActive: "true", message: "10" },
                      { method: "POST", action: "/api/urgency" }
                    )
                  }
                >
                  Enable
                </Button>
              </InlineStack>

              <Divider />

              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text as="span" variant="bodyMd" fontWeight="semibold">
                    Trust Badge Row
                  </Text>
                  <Text as="span" variant="bodySm" tone="subdued">
                    SSL, returns, guarantee badges near buy button
                  </Text>
                </BlockStack>
                <Button>Enable</Button>
              </InlineStack>

              <Divider />
              <InlineStack align="space-between">
                <Button variant="plain" onClick={nextStep}>
                  Set up later
                </Button>
                <Button variant="primary" onClick={nextStep}>
                  All set, continue
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        )}

        {/* ── Step 4: Review Setup ── */}
        {step === 4 && (
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingLg">
                Start collecting better reviews automatically
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Choose when to send review request emails after delivery.
              </Text>
              <Divider />

              <Select
                label="Send review request"
                options={[
                  { label: "7 days after delivery", value: "7" },
                  { label: "14 days after delivery", value: "14" },
                  { label: "21 days after delivery", value: "21" },
                ]}
                value={reviewDelay}
                onChange={setReviewDelay}
              />

              <Banner tone="info">
                <p>
                  <strong>AI review writing</strong> helps customers write
                  better reviews with one click.{" "}
                  <Badge tone="new">Pro feature</Badge>
                </p>
              </Banner>

              <InlineStack align="space-between">
                <Button variant="plain" onClick={nextStep}>
                  Set up later
                </Button>
                <Button variant="primary" onClick={nextStep}>
                  Activate review requests
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        )}

        {/* ── Step 5: Upgrade CTA ── */}
        {step === 5 && (
          <Card>
            <BlockStack gap="500">
              <Text as="h2" variant="headingLg" alignment="center">
                Your store is live
              </Text>

              <Box
                padding="600"
                background="bg-surface-secondary"
                borderRadius="300"
              >
                <BlockStack gap="200">
                  <Text
                    as="p"
                    variant="headingXl"
                    alignment="center"
                    fontWeight="bold"
                  >
                    $840
                  </Text>
                  <Text as="p" variant="bodyMd" alignment="center" tone="subdued">
                    Estimated new revenue / month from recovered lost sales
                  </Text>
                </BlockStack>
              </Box>

              <BlockStack gap="200">
                <Text
                  as="p"
                  variant="bodySm"
                  tone="subdued"
                  alignment="center"
                >
                  Unlock: AI reviews, post-purchase upsell, bundle builder,
                  ConvertFlow code extraction
                </Text>
              </BlockStack>

              <InlineStack align="center" gap="300">
                <Button variant="primary" size="large" onClick={finishOnboarding}>
                  Upgrade to Pro — $19/month
                </Button>
              </InlineStack>

              <InlineStack align="center">
                <Button variant="plain" onClick={finishOnboarding}>
                  Stay on Free
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        )}
      </BlockStack>
    </Page>
  );
}
