import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  Grid,
  Badge,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

const THEMES = [
  { name: "Luxe", bestFor: "Jewelry, fashion, beauty", character: "Dark background, gold accents, serif headings" },
  { name: "Fresh", bestFor: "Health, wellness, organic food", character: "White background, sage green accents, rounded corners" },
  { name: "Bold", bestFor: "Streetwear, sneakers, apparel", character: "Black background, red/yellow accents, condensed bold type" },
  { name: "Clean", bestFor: "Electronics, tech accessories", character: "Light gray background, blue accents, precise grid layout" },
  { name: "Warm", bestFor: "Home goods, candles, gifts", character: "Cream background, terracotta accents, soft drop shadows" },
  { name: "Sport", bestFor: "Fitness, supplements, activewear", character: "Dark navy background, bright lime accents, impact type" },
  { name: "Minimal", bestFor: "Skincare, cosmetics, DTC beauty", character: "Pure white background, single muted accent color" },
  { name: "Artisan", bestFor: "Handmade, craft, specialty food", character: "Textured off-white background, earthy brown and olive tones" },
];

export default function Themes() {
  return (
    <Page title="Themes">
      <TitleBar title="Theme Presets" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <Text as="p" variant="bodyMd">
                  Choose a theme preset to transform your store's look in one click. Each theme applies a coordinated set of colors, typography, and styling.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
        <Grid>
          {THEMES.map((theme) => (
            <Grid.Cell
              key={theme.name}
              columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}
            >
              <Card>
                <BlockStack gap="300">
                  <Text as="h3" variant="headingMd">
                    {theme.name}
                  </Text>
                  <Badge>{theme.bestFor}</Badge>
                  <Text as="p" variant="bodySm" tone="subdued">
                    {theme.character}
                  </Text>
                  <Button variant="primary">Apply Theme</Button>
                </BlockStack>
              </Card>
            </Grid.Cell>
          ))}
        </Grid>
      </BlockStack>
    </Page>
  );
}
