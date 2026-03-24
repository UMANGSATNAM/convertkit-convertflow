import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  Grid,
  Badge,
  InlineStack,
  Banner,
  Box,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getThemeList } from "../lib/theme-presets";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  const themes = getThemeList();

  // Check which theme is currently active
  let activeThemeName = null;
  try {
    const activeTheme = await prisma.theme.findFirst({
      where: { shopId: session.shop, isActive: true },
    });
    activeThemeName = activeTheme?.name || null;
  } catch (e) {
    // DB may not be set up yet — non-critical
  }

  return json({ themes, activeThemeName });
};

export default function Themes() {
  const { themes, activeThemeName } = useLoaderData();
  const fetcher = useFetcher();

  const isApplying = fetcher.state !== "idle";
  const applyingTheme = fetcher.formData?.get("themeName");
  const result = fetcher.data;

  const applyTheme = (name) => {
    fetcher.submit(
      { themeName: name },
      { method: "POST", action: "/api/theme-apply" }
    );
  };

  const readyThemeFetcher = useFetcher();
  const installingReadyTheme = readyThemeFetcher.state !== "idle";
  const readyThemeResult = readyThemeFetcher.data;

  const installReadyTheme = (path, name) => {
    readyThemeFetcher.submit(
      { themePath: path, themeName: name },
      { method: "POST", action: "/api/convertflow/install-ready-theme" }
    );
  };

  return (
    <Page title="Themes">
      <TitleBar title="Theme Presets" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <Text as="p" variant="bodyMd">
                  Choose a theme preset to transform your store's look in one
                  click. Each theme applies a coordinated set of colors,
                  typography, and styling to all ConvertKit widgets.
                </Text>
                {activeThemeName && (
                  <InlineStack gap="200" blockAlign="center">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Active theme:
                    </Text>
                    <Badge tone="success">{activeThemeName}</Badge>
                  </InlineStack>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {result?.success && (
          <Banner tone="success" onDismiss={() => {}}>
            <p>
              Theme <strong>{result.theme}</strong> applied to{" "}
              <strong>{result.appliedTo}</strong>. Visit your store to see the
              changes.
            </p>
          </Banner>
        )}

        {result?.error && (
          <Banner tone="critical" onDismiss={() => {}}>
            <p>{result.error}</p>
          </Banner>
        )}

        <Grid>
          {themes.map((theme) => {
            const isActive = activeThemeName === theme.name;
            const isThisApplying = isApplying && applyingTheme === theme.name;

            return (
              <Grid.Cell
                key={theme.name}
                columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}
              >
                <Card>
                  <BlockStack gap="300">
                    {/* Color preview swatches */}
                    <InlineStack gap="100">
                      {theme.previewColors.map((color, i) => (
                        <Box
                          key={i}
                          background="bg-surface"
                          borderRadius="100"
                          padding="0"
                        >
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              backgroundColor: color,
                              border: "1px solid rgba(0,0,0,0.1)",
                            }}
                          />
                        </Box>
                      ))}
                    </InlineStack>

                    <InlineStack align="space-between" blockAlign="center">
                      <Text as="h3" variant="headingMd">
                        {theme.name}
                      </Text>
                      {isActive && <Badge tone="success">Active</Badge>}
                    </InlineStack>

                    <Badge>{theme.bestFor}</Badge>

                    <Text as="p" variant="bodySm" tone="subdued">
                      {theme.character}
                    </Text>

                    <Button
                      variant={isActive ? "secondary" : "primary"}
                      onClick={() => applyTheme(theme.name)}
                      loading={isThisApplying}
                      disabled={isApplying}
                    >
                      {isActive ? "Reapply" : "Apply Theme"}
                    </Button>
                  </BlockStack>
                </Card>
              </Grid.Cell>
            );
          })}
        </Grid>

        <Box paddingBlockStart="800">
          <Text as="h2" variant="headingLg">Ready-Made Full Themes</Text>
          <Box paddingBlockStart="200">
            <Text as="p" variant="bodyMd" tone="subdued">
              Install a complete, structurally customized Shopify theme packed with ConvertFlow features natively built-in.
            </Text>
          </Box>
        </Box>

        {readyThemeResult?.success && (
          <Banner tone="success" onDismiss={() => {}}>
            <p>
              Theme <strong>{readyThemeResult.theme.name}</strong> has been successfully installed to your online store as a draft!
            </p>
          </Banner>
        )}
        
        {readyThemeResult?.error && (
          <Banner tone="critical" onDismiss={() => {}}>
            <p>{readyThemeResult.error}</p>
          </Banner>
        )}

        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card>
              <BlockStack gap="300">
                <Box
                  background="bg-surface"
                  borderRadius="200"
                  padding="400"
                  minHeight="120px"
                >
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1f2937, #111827)", borderRadius: "8px", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
                    <Text as="span" variant="headingLg" tone="textInverse">Asian Footwears</Text>
                  </div>
                </Box>

                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h3" variant="headingMd">
                    Asian Footwears v2
                  </Text>
                  <Badge tone="info">Premium</Badge>
                </InlineStack>

                <Badge>Apparel & Footwear</Badge>

                <Text as="p" variant="bodySm" tone="subdued">
                  A high-converting, modern storefront designed for dropshipping, apparel, and custom footwear brands. Powered natively by ConvertFlow UI blocks.
                </Text>

                <Button
                  variant="primary"
                  onClick={() => installReadyTheme("/themes/asian-footwears-shopify-theme-v2.zip", "Asian Footwears v2 - ConvertFlow")}
                  loading={installingReadyTheme}
                  disabled={installingReadyTheme}
                >
                  Install to Store
                </Button>
              </BlockStack>
            </Card>
          </Grid.Cell>

          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card>
              <BlockStack gap="300">
                <Box background="bg-surface" borderRadius="200" padding="400" minHeight="120px">
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #111111, #D4AF37)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Text as="span" variant="headingLg" tone="textInverse">Aura Luxe</Text>
                  </div>
                </Box>
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h3" variant="headingMd">Luxe Fashion</Text>
                  <Badge tone="success">50% CVR</Badge>
                </InlineStack>
                <Badge>High-End Apparel</Badge>
                <Text as="p" variant="bodySm" tone="subdued">
                  Minimalist high-end luxury theme featuring Playfair Display, Off-White palettes, and high-urgency layout triggers.
                </Text>
                <Button
                  variant="primary"
                  onClick={() => installReadyTheme("/themes/luxe-fashion-theme-v1.zip", "Aura Luxe Fashion - ConvertFlow")}
                  loading={installingReadyTheme}
                  disabled={installingReadyTheme}
                >
                  Install to Store
                </Button>
              </BlockStack>
            </Card>
          </Grid.Cell>

          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card>
              <BlockStack gap="300">
                <Box background="bg-surface" borderRadius="200" padding="400" minHeight="120px">
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #FF3366, #CCFF00)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Text as="span" variant="headingLg" style={{ color: "black" }}>Streetwear</Text>
                  </div>
                </Box>
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h3" variant="headingMd">Velocity Streetwear</Text>
                  <Badge tone="success">50% CVR</Badge>
                </InlineStack>
                <Badge>Sneakers & Hype</Badge>
                <Text as="p" variant="bodySm" tone="subdued">
                  Bold hypebeast theme built for velocity. Neon accents, aggressive Oswald font, and max-urgency conversion timers.
                </Text>
                <Button
                  variant="primary"
                  onClick={() => installReadyTheme("/themes/velocity-streetwear-theme-v1.zip", "Velocity Streetwear - ConvertFlow")}
                  loading={installingReadyTheme}
                  disabled={installingReadyTheme}
                >
                  Install to Store
                </Button>
              </BlockStack>
            </Card>
          </Grid.Cell>

        </Grid>

      </BlockStack>
    </Page>
  );
}
