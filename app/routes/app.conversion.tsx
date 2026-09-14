import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { useState, useEffect } from "react";
import {
  Page,
  Layout,
  Card,
  Button,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Banner,
  TextField,
  Select,
  Checkbox,
  Box,
  Divider,
  ProgressBar,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma, { getOrSyncShop } from "../db.server";
import {
  getConversionConfig,
  saveConversionConfig,
  prepareAndInjectPreviewTheme,
  publishConversionSuiteToLive,
  rollbackLiveTheme,
  type ConversionSuiteConfig,
} from "../services/conversion-suite.server";
import { ensurePreviewTheme, previewUrl } from "../services/preview-theme.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const shop = await getOrSyncShop(session.shop, session.accessToken);

  const config = await getConversionConfig(session.shop);

  let previewThemeId = "";
  let previewLink = "";
  try {
    if (shop) {
      const preview = await ensurePreviewTheme(shop);
      previewThemeId = preview.id;
      previewLink = previewUrl(session.shop, previewThemeId);
    }
  } catch (err: any) {
    console.warn("[ConversionLoader] Could not fetch preview theme:", err.message);
  }

  return json({
    config,
    previewThemeId,
    previewLink,
    shopDomain: session.shop,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const shop = await getOrSyncShop(session.shop, session.accessToken);
  if (!shop) return json({ error: "Shop not found" }, { status: 404 });

  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  try {
    // 1. Build config from form values
    const currentConfig = await getConversionConfig(session.shop);
    const updatedConfig: ConversionSuiteConfig = {
      ...currentConfig,
      cartDrawer: {
        enabled: formData.get("cartDrawer_enabled") === "true",
        freeShippingThreshold: Number(formData.get("cartDrawer_threshold") || 999),
        offerBannerText: (formData.get("cartDrawer_banner") as string) || "",
        showUpsells: formData.get("cartDrawer_upsells") === "true",
        accentColor: (formData.get("cartDrawer_color") as string) || "#111827",
        overrideNativeDrawer: formData.get("cartDrawer_override") === "true",
      },
      backInStock: {
        enabled: formData.get("bis_enabled") === "true",
        heading: (formData.get("bis_heading") as string) || "Currently sold out",
        bodyText: (formData.get("bis_body") as string) || "",
        buttonLabel: (formData.get("bis_button") as string) || "Notify Me When Available",
        successMessage: (formData.get("bis_success") as string) || "",
        accentColor: (formData.get("bis_color") as string) || "#111827",
      },
      countdownTimer: {
        enabled: formData.get("cd_enabled") === "true",
        mode: (formData.get("cd_mode") as any) || "evergreen",
        hours: Number(formData.get("cd_hours") || 4),
        dailyTime: (formData.get("cd_daily") as string) || "23:59",
        expiredBehavior: "message",
        expiredText: (formData.get("cd_expired_text") as string) || "Special offer ended",
        prefix: (formData.get("cd_prefix") as string) || "⚡ Flash Offer Ends In: ",
      },
      stickyAtc: {
        enabled: formData.get("sticky_enabled") === "true",
        showOnMobile: formData.get("sticky_mobile") === "true",
        showOnDesktop: formData.get("sticky_desktop") === "true",
        buttonText: (formData.get("sticky_btn") as string) || "Add to Cart",
      },
      trustBadges: {
        enabled: formData.get("trust_enabled") === "true",
        showCod: formData.get("trust_cod") === "true",
        showUpi: formData.get("trust_upi") === "true",
        showSecureCheckout: formData.get("trust_secure") === "true",
        customText: (formData.get("trust_text") as string) || "Secure Checkout · COD · Fast Delivery",
      },
    };

    await saveConversionConfig(session.shop, updatedConfig);

    if (intent === "save_only") {
      return json({ success: true, message: "Settings saved successfully." });
    }

    if (intent === "inject_preview") {
      const res = await prepareAndInjectPreviewTheme(shop, updatedConfig);
      return json({
        success: true,
        message: "Injected into Preview Theme! Click 'Open Live Preview' below to test on your store with real products.",
        previewUrl: res.previewUrl,
      });
    }

    if (intent === "publish_live") {
      const res = await publishConversionSuiteToLive(shop, updatedConfig);
      return json({
        success: true,
        message: `🎉 Published Live! Automatic safety snapshot created (Theme: ${res.mainThemeId}).`,
      });
    }

    if (intent === "rollback") {
      await rollbackLiveTheme(shop);
      return json({
        success: true,
        message: "Live theme reverted. Conversion suite deactivated safely.",
      });
    }

    return json({ success: true });
  } catch (err: any) {
    console.error("[ConversionAction] Error:", err);
    return json({ error: err.message || "Failed to process request" }, { status: 500 });
  }
}

export default function ConversionSuitePage() {
  const { config: initialConfig, previewThemeId, previewLink, shopDomain } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<any>();
  const isLoading = fetcher.state !== "idle";

  // Form State
  const [cartDrawerEnabled, setCartDrawerEnabled] = useState(initialConfig.cartDrawer.enabled);
  const [threshold, setThreshold] = useState(String(initialConfig.cartDrawer.freeShippingThreshold));
  const [bannerText, setBannerText] = useState(initialConfig.cartDrawer.offerBannerText);
  const [showUpsells, setShowUpsells] = useState(initialConfig.cartDrawer.showUpsells);
  const [overrideNative, setOverrideNative] = useState(initialConfig.cartDrawer.overrideNativeDrawer);
  const [cartColor, setCartColor] = useState(initialConfig.cartDrawer.accentColor);

  const [bisEnabled, setBisEnabled] = useState(initialConfig.backInStock.enabled);
  const [bisHeading, setBisHeading] = useState(initialConfig.backInStock.heading);
  const [bisButton, setBisButton] = useState(initialConfig.backInStock.buttonLabel);

  const [cdEnabled, setCdEnabled] = useState(initialConfig.countdownTimer.enabled);
  const [cdMode, setCdMode] = useState(initialConfig.countdownTimer.mode);
  const [cdHours, setCdHours] = useState(String(initialConfig.countdownTimer.hours));
  const [cdPrefix, setCdPrefix] = useState(initialConfig.countdownTimer.prefix);

  const [stickyEnabled, setStickyEnabled] = useState(initialConfig.stickyAtc.enabled);
  const [stickyMobile, setStickyMobile] = useState(initialConfig.stickyAtc.showOnMobile);
  const [stickyDesktop, setStickyDesktop] = useState(initialConfig.stickyAtc.showOnDesktop);
  const [stickyBtn, setStickyBtn] = useState(initialConfig.stickyAtc.buttonText);

  const [trustEnabled, setTrustEnabled] = useState(initialConfig.trustBadges.enabled);
  const [trustText, setTrustText] = useState(initialConfig.trustBadges.customText);

  const isLive = initialConfig.isLive;

  const handleAction = (intent: string) => {
    const formData = new FormData();
    formData.append("intent", intent);

    formData.append("cartDrawer_enabled", String(cartDrawerEnabled));
    formData.append("cartDrawer_threshold", threshold);
    formData.append("cartDrawer_banner", bannerText);
    formData.append("cartDrawer_upsells", String(showUpsells));
    formData.append("cartDrawer_override", String(overrideNative));
    formData.append("cartDrawer_color", cartColor);

    formData.append("bis_enabled", String(bisEnabled));
    formData.append("bis_heading", bisHeading);
    formData.append("bis_button", bisButton);

    formData.append("cd_enabled", String(cdEnabled));
    formData.append("cd_mode", cdMode);
    formData.append("cd_hours", cdHours);
    formData.append("cd_prefix", cdPrefix);

    formData.append("sticky_enabled", String(stickyEnabled));
    formData.append("sticky_mobile", String(stickyMobile));
    formData.append("sticky_desktop", String(stickyDesktop));
    formData.append("sticky_btn", stickyBtn);

    formData.append("trust_enabled", String(trustEnabled));
    formData.append("trust_text", trustText);

    fetcher.submit(formData, { method: "post" });
  };

  return (
    <Page
      title="CRO & Conversion Booster Suite"
      subtitle="Supercharge your store's conversion rate with high-performing native e-commerce widgets."
      primaryAction={{
        content: isLive ? "Update Live Store" : "Publish to Live Store",
        loading: isLoading,
        onAction: () => handleAction("publish_live"),
      }}
      secondaryActions={[
        {
          content: "Save & Test in Preview Theme",
          loading: isLoading,
          onAction: () => handleAction("inject_preview"),
        },
      ]}
    >
      <BlockStack gap="500">
        {/* Alerts & Feedback */}
        {fetcher.data?.message && (
          <Banner tone="success" onDismiss={() => {}}>
            <p>{fetcher.data.message}</p>
          </Banner>
        )}
        {fetcher.data?.error && (
          <Banner tone="critical" onDismiss={() => {}}>
            <p>{fetcher.data.error}</p>
          </Banner>
        )}

        {/* Environment Status Card */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <BlockStack gap="100">
                <InlineStack gap="200" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    Deployment Status
                  </Text>
                  {isLive ? (
                    <Badge tone="success">Active on Live Main Store</Badge>
                  ) : (
                    <Badge tone="info">Preview Mode (Safe / Unpublished)</Badge>
                  )}
                </InlineStack>
                <Text as="p" tone="subdued">
                  {isLive
                    ? "Widgets are active for real shoppers on your live theme. Automatic backup is stored in Snapshots."
                    : "Widgets are ready in your private preview theme. Test them on your live catalogue before publishing."}
                </Text>
              </BlockStack>

              <InlineStack gap="200">
                {previewLink && (
                  <Button
                    url={previewLink}
                    target="_blank"
                    tone="magic"
                  >
                    Open Live Preview ↗
                  </Button>
                )}
                {isLive && (
                  <Button
                    tone="critical"
                    variant="plain"
                    loading={isLoading}
                    onClick={() => handleAction("rollback")}
                  >
                    Deactivate from Live
                  </Button>
                )}
              </InlineStack>
            </InlineStack>
          </BlockStack>
        </Card>

        {/* 1. Custom Cart Drawer */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="200" blockAlign="center">
                <Text as="h3" variant="headingMd">
                  🛒 Full Custom Cart Drawer
                </Text>
                {overrideNative && (
                  <Badge tone="attention">Auto-Overrides Theme Native Drawer</Badge>
                )}
              </InlineStack>
              <Checkbox
                label="Enable Cart Drawer"
                checked={cartDrawerEnabled}
                onChange={setCartDrawerEnabled}
              />
            </InlineStack>

            <Divider />

            {cartDrawerEnabled && (
              <BlockStack gap="400">
                <TextField
                  label="Free Shipping Goal Threshold (₹ / $)"
                  type="number"
                  value={threshold}
                  onChange={setThreshold}
                  helpText="Calculates real-time progress bar. Shows celebration message when unlocked."
                  autoComplete="off"
                />

                <TextField
                  label="Top Urgency / Offer Banner"
                  value={bannerText}
                  onChange={setBannerText}
                  placeholder="🔥 Free Express Shipping on all orders above ₹999!"
                  autoComplete="off"
                />

                <InlineStack gap="400">
                  <Checkbox
                    label="Show In-Cart 1-Click Upsell Recommendation"
                    checked={showUpsells}
                    onChange={setShowUpsells}
                    helpText="Suggests a top bestseller inside the drawer with a 1-click '+ Add' button."
                  />
                  <Checkbox
                    label="Force Suppress Native Theme Cart (Dawn / Prestige)"
                    checked={overrideNative}
                    onChange={setOverrideNative}
                    helpText="Hides the default theme drawer so only this high-converting drawer opens."
                  />
                </InlineStack>
              </BlockStack>
            )}
          </BlockStack>
        </Card>

        {/* 2. Variant-Aware Back-In-Stock */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="200" blockAlign="center">
                <Text as="h3" variant="headingMd">
                  📦 Variant-Aware Back-In-Stock
                </Text>
                <Badge tone="success">Captures leads in Shopify Customers</Badge>
              </InlineStack>
              <Checkbox
                label="Enable Back-In-Stock"
                checked={bisEnabled}
                onChange={setBisEnabled}
              />
            </InlineStack>

            <Divider />

            {bisEnabled && (
              <BlockStack gap="400">
                <Text as="p" tone="subdued">
                  Automatically replaces the "Sold Out" button with a sleek email capture box whenever an out-of-stock variant (like Size M or Color Gold) is selected.
                </Text>

                <TextField
                  label="Notification Title"
                  value={bisHeading}
                  onChange={setBisHeading}
                  autoComplete="off"
                />

                <TextField
                  label="CTA Button Label"
                  value={bisButton}
                  onChange={setBisButton}
                  autoComplete="off"
                />
              </BlockStack>
            )}
          </BlockStack>
        </Card>

        {/* 3. Countdown Urgency Bar */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h3" variant="headingMd">
                ⏳ Urgency Countdown Timer
              </Text>
              <Checkbox
                label="Enable Countdown"
                checked={cdEnabled}
                onChange={setCdEnabled}
              />
            </InlineStack>

            <Divider />

            {cdEnabled && (
              <BlockStack gap="400">
                <InlineStack gap="400">
                  <Box minWidth="240px">
                    <Select
                      label="Countdown Mode"
                      options={[
                        { label: "Evergreen (Resets per shopper session)", value: "evergreen" },
                        { label: "Daily (Resets every night at midnight)", value: "daily" },
                        { label: "Fixed Sale End Date", value: "fixed" },
                      ]}
                      value={cdMode}
                      onChange={(v) => setCdMode(v as any)}
                    />
                  </Box>
                  <TextField
                    label="Duration (Hours)"
                    type="number"
                    value={cdHours}
                    onChange={setCdHours}
                    autoComplete="off"
                  />
                </InlineStack>

                <TextField
                  label="Timer Prefix Headline"
                  value={cdPrefix}
                  onChange={setCdPrefix}
                  autoComplete="off"
                />
              </BlockStack>
            )}
          </BlockStack>
        </Card>

        {/* 4. Sticky Add-to-Cart Bar */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h3" variant="headingMd">
                ⚡ Sticky Add-to-Cart Bar
              </Text>
              <Checkbox
                label="Enable Sticky ATC"
                checked={stickyEnabled}
                onChange={setStickyEnabled}
              />
            </InlineStack>

            <Divider />

            {stickyEnabled && (
              <BlockStack gap="400">
                <Text as="p" tone="subdued">
                  Floats at the bottom on product pages once shoppers scroll past the main buy button, allowing effortless 1-click checkout.
                </Text>

                <InlineStack gap="400">
                  <Checkbox
                    label="Show on Mobile"
                    checked={stickyMobile}
                    onChange={setStickyMobile}
                  />
                  <Checkbox
                    label="Show on Desktop"
                    checked={stickyDesktop}
                    onChange={setStickyDesktop}
                  />
                </InlineStack>

                <TextField
                  label="Sticky Button Text"
                  value={stickyBtn}
                  onChange={setStickyBtn}
                  autoComplete="off"
                />
              </BlockStack>
            )}
          </BlockStack>
        </Card>

        {/* 5. Trust & Payment Badges */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h3" variant="headingMd">
                🛡️ Trust & Payment Conversion Badges
              </Text>
              <Checkbox
                label="Enable Trust Badges"
                checked={trustEnabled}
                onChange={setTrustEnabled}
              />
            </InlineStack>

            <Divider />

            {trustEnabled && (
              <BlockStack gap="400">
                <TextField
                  label="Trust Guarantee Text"
                  value={trustText}
                  onChange={setTrustText}
                  helpText="Renders high-resolution vector icons for Secure Checkout, Easy Returns, and COD."
                  autoComplete="off"
                />
              </BlockStack>
            )}
          </BlockStack>
        </Card>

        {/* Bottom Save bar */}
        <InlineStack align="end" gap="300">
          <Button loading={isLoading} onClick={() => handleAction("save_only")}>
            Save Draft
          </Button>
          <Button loading={isLoading} tone="magic" onClick={() => handleAction("inject_preview")}>
            Save & Test in Preview Theme
          </Button>
          <Button loading={isLoading} variant="primary" onClick={() => handleAction("publish_live")}>
            {isLive ? "Update Live Store" : "Publish to Live Store"}
          </Button>
        </InlineStack>
      </BlockStack>
    </Page>
  );
}
