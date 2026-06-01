import { useState, useCallback } from "react";
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  ProgressBar,
  InlineStack,
  Select,
  TextField,
  Checkbox,
  Banner,
  Box
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, redirect } = await authenticate.admin(request);
  const merchant = await prisma.merchant.findUnique({
    where: { shopDomain: session.shop },
  });

  if (merchant?.onboardingCompleted) {
    return redirect("/app");
  }

  return json({ shopDomain: session.shop, step: merchant?.onboardingStep || 1 });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, redirect } = await authenticate.admin(request);
  const formData = await request.formData();
  
  const step = parseInt(formData.get("step") as string, 10);
  
  const merchant = await prisma.merchant.findUnique({
    where: { shopDomain: session.shop }
  });
  if (!merchant) throw new Error("Merchant not found");

  // If this is the final step
  if (step === 5) {
    const niche = formData.get("niche") as string;
    const aov = parseInt(formData.get("aov") as string, 10) || 0;
    const razorpayKeyId = formData.get("razorpayKeyId") as string;
    const shiprocketEmail = formData.get("shiprocketEmail") as string;
    const shiprocketPassword = formData.get("shiprocketPassword") as string;

    const useCountdown = formData.get("useCountdown") === "on";
    const useStockScarcity = formData.get("useStockScarcity") === "on";
    const useStickyAtc = formData.get("useStickyAtc") === "on";
    const useFreeShipping = formData.get("useFreeShipping") === "on";
    const useTrustBadges = formData.get("useTrustBadges") === "on";

    const primaryColor = formData.get("primaryColor") as string || "#000000";
    const secondaryColor = formData.get("secondaryColor") as string || "#ffffff";

    await prisma.$transaction([
      prisma.merchant.update({
        where: { shopDomain: session.shop },
        data: {
          niche,
          averageOrderValue: aov,
          razorpayKeyId,
          shiprocketEmail,
          shiprocketPassword,
          onboardingStep: 5,
          onboardingCompleted: true,
          themePrimaryColor: primaryColor,
          themeSecondaryColor: secondaryColor,
        },
      }),
      prisma.featureConfig.upsert({
        where: { merchantId_featureKey: { merchantId: merchant.id, featureKey: "countdown_timer" } },
        update: { enabled: useCountdown },
        create: { merchantId: merchant.id, featureKey: "countdown_timer", enabled: useCountdown, config: {} }
      }),
      prisma.featureConfig.upsert({
        where: { merchantId_featureKey: { merchantId: merchant.id, featureKey: "stock_scarcity" } },
        update: { enabled: useStockScarcity },
        create: { merchantId: merchant.id, featureKey: "stock_scarcity", enabled: useStockScarcity, config: {} }
      }),
      prisma.featureConfig.upsert({
        where: { merchantId_featureKey: { merchantId: merchant.id, featureKey: "sticky_atc" } },
        update: { enabled: useStickyAtc },
        create: { merchantId: merchant.id, featureKey: "sticky_atc", enabled: useStickyAtc, config: {} }
      }),
      prisma.featureConfig.upsert({
        where: { merchantId_featureKey: { merchantId: merchant.id, featureKey: "free_shipping" } },
        update: { enabled: useFreeShipping },
        create: { merchantId: merchant.id, featureKey: "free_shipping", enabled: useFreeShipping, config: {} }
      }),
      prisma.featureConfig.upsert({
        where: { merchantId_featureKey: { merchantId: merchant.id, featureKey: "trust_badges" } },
        update: { enabled: useTrustBadges },
        create: { merchantId: merchant.id, featureKey: "trust_badges", enabled: useTrustBadges, config: {} }
      })
    ]);

    return redirect("/app");
  }

  // Intermediate save (optional if we want to save state per step)
  await prisma.merchant.update({
    where: { shopDomain: session.shop },
    data: { onboardingStep: step },
  });

  return json({ success: true, step });
};

export default function Onboarding() {
  const { shop, step: initialStep } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const [step, setStep] = useState(initialStep);
  const isSubmitting = navigation.state === "submitting";

  // Step 1 State
  const [niche, setNiche] = useState("fashion");
  const [aov, setAov] = useState("1500");

  // Step 2 State (Auto-configured based on niche)
  const [useCountdown, setUseCountdown] = useState(true);
  const [useStockScarcity, setUseStockScarcity] = useState(true);
  const [useStickyAtc, setUseStickyAtc] = useState(true);
  const [useFreeShipping, setUseFreeShipping] = useState(true);
  const [useTrustBadges, setUseTrustBadges] = useState(true);

  // Step 3 State
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");

  // Step 4 State
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [shiprocketEmail, setShiprocketEmail] = useState("");
  const [shiprocketPassword, setShiprocketPassword] = useState("");

  const handleNext = () => setStep((s) => Math.min(5, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleFinish = () => {
    const formData = new FormData();
    formData.append("step", "5");
    formData.append("niche", niche);
    formData.append("aov", aov);
    if (useCountdown) formData.append("useCountdown", "on");
    if (useStockScarcity) formData.append("useStockScarcity", "on");
    if (useStickyAtc) formData.append("useStickyAtc", "on");
    if (useFreeShipping) formData.append("useFreeShipping", "on");
    if (useTrustBadges) formData.append("useTrustBadges", "on");
    formData.append("primaryColor", primaryColor);
    formData.append("secondaryColor", secondaryColor);
    formData.append("razorpayKeyId", razorpayKeyId);
    formData.append("shiprocketEmail", shiprocketEmail);
    formData.append("shiprocketPassword", shiprocketPassword);

    submit(formData, { method: "post" });
  };

  const progress = (step / 5) * 100;

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Box paddingBlockEnd="400">
            <BlockStack gap="200">
              <Text as="h1" variant="headingLg">Store Setup Checklist</Text>
              <ProgressBar progress={progress} size="small" tone="primary" />
              <Text as="p" variant="bodySm" tone="subdued">Step {step} of 5</Text>
            </BlockStack>
          </Box>

          <Card>
            <BlockStack gap="400">
              {step === 1 && (
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Welcome! Let's optimize your store.</Text>
                  <Select
                    label="What is your primary niche?"
                    options={[
                      { label: "Fashion & Apparel", value: "fashion" },
                      { label: "Jewellery", value: "jewellery" },
                      { label: "Beauty & Cosmetics", value: "beauty" },
                      { label: "Health & Supplements", value: "health" },
                      { label: "Home Decor", value: "home" },
                      { label: "Electronics", value: "electronics" },
                    ]}
                    value={niche}
                    onChange={(val) => {
                      setNiche(val);
                      if (val === "jewellery") {
                        setUseTrustBadges(true);
                      }
                    }}
                  />
                  <TextField
                    label="What is your Average Order Value (AOV) in INR?"
                    type="number"
                    value={aov}
                    onChange={setAov}
                    autoComplete="off"
                  />
                </BlockStack>
              )}

              {step === 2 && (
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">AI Feature Configuration</Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Based on your niche ({niche}), we've enabled the features that drive the highest conversions.
                  </Text>
                  <Checkbox
                    label="Enable Sticky Add To Cart"
                    checked={useStickyAtc}
                    onChange={setUseStickyAtc}
                    helpText="Keeps the Add to Cart button visible on mobile devices as users scroll."
                  />
                  <Checkbox
                    label="Enable Stock Scarcity"
                    checked={useStockScarcity}
                    onChange={setUseStockScarcity}
                    helpText="Shows 'Only X left' when inventory is low."
                  />
                  <Checkbox
                    label="Enable Free Shipping Progress Bar"
                    checked={useFreeShipping}
                    onChange={setUseFreeShipping}
                    helpText="Encourages users to add more to cart to unlock free shipping."
                  />
                  <Checkbox
                    label="Enable Trust Badges"
                    checked={useTrustBadges}
                    onChange={setUseTrustBadges}
                    helpText="Shows trusted payment and shipping badges below the ATC button."
                  />
                  <Checkbox
                    label="Enable Countdown Timers"
                    checked={useCountdown}
                    onChange={setUseCountdown}
                    helpText="Creates urgency on the product page."
                  />
                </BlockStack>
              )}

              {step === 3 && (
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Theme & Branding</Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Select the colors that match your store's theme. These will be used for all injected widgets.
                  </Text>
                  <TextField
                    label="Primary Color (Hex)"
                    value={primaryColor}
                    onChange={setPrimaryColor}
                    autoComplete="off"
                  />
                  <TextField
                    label="Secondary Color (Hex)"
                    value={secondaryColor}
                    onChange={setSecondaryColor}
                    autoComplete="off"
                  />
                </BlockStack>
              )}

              {step === 4 && (
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Integrations (Optional)</Text>
                  <Banner title="You can skip this and configure it later in Settings" tone="info" />
                  <TextField
                    label="Razorpay Key ID"
                    value={razorpayKeyId}
                    onChange={setRazorpayKeyId}
                    autoComplete="off"
                    helpText="Required for the Real-Time Profit Calculator."
                  />
                  <TextField
                    label="Shiprocket Email"
                    value={shiprocketEmail}
                    onChange={setShiprocketEmail}
                    autoComplete="email"
                  />
                  <TextField
                    label="Shiprocket Password"
                    type="password"
                    value={shiprocketPassword}
                    onChange={setShiprocketPassword}
                    autoComplete="current-password"
                  />
                </BlockStack>
              )}

              {step === 5 && (
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Ready to Launch!</Text>
                  <Text as="p" variant="bodyMd">
                    Your store is now configured for maximum conversions. Click below to complete setup and go to your dashboard.
                  </Text>
                </BlockStack>
              )}

              <InlineStack align="space-between">
                {step > 1 ? (
                  <Button onClick={handleBack}>Back</Button>
                ) : (
                  <div />
                )}
                {step < 5 ? (
                  <Button variant="primary" onClick={handleNext}>
                    Next Step
                  </Button>
                ) : (
                  <Button variant="primary" loading={isSubmitting} onClick={handleFinish}>
                    Complete Setup
                  </Button>
                )}
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
