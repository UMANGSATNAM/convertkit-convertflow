import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Grid,
  Badge,
  Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

const SECTION_CATEGORIES = [
  { label: "All", count: 30 },
  { label: "Hero", count: 5 },
  { label: "Product", count: 6 },
  { label: "Trust", count: 5 },
  { label: "Conversion", count: 6 },
  { label: "Social Proof", count: 5 },
  { label: "Other", count: 3 },
];

const SECTIONS = [
  { name: "Split Layout Hero", type: "hero", status: "inactive" },
  { name: "Video Background Hero", type: "hero", status: "inactive" },
  { name: "Countdown Announcement Bar", type: "hero", status: "inactive" },
  { name: "Social Proof Scroll Bar", type: "hero", status: "inactive" },
  { name: "USP Icon Grid", type: "hero", status: "inactive" },
  { name: "Ingredients Breakdown", type: "product", status: "inactive" },
  { name: "Before and After Slider", type: "product", status: "inactive" },
  { name: "Product Benefits Grid", type: "product", status: "inactive" },
  { name: "Tabbed Product Info", type: "product", status: "inactive" },
  { name: "Size and Fit Guide", type: "product", status: "inactive" },
  { name: "Complementary Products", type: "product", status: "inactive" },
  { name: "Star Rating Summary", type: "trust", status: "inactive" },
  { name: "Press and Media Logos", type: "trust", status: "inactive" },
  { name: "Trust Badge Row", type: "trust", status: "inactive" },
  { name: "Customer Photo Reviews Grid", type: "trust", status: "inactive" },
  { name: "Real-Time Purchase Notification", type: "trust", status: "inactive" },
  { name: "Standalone Countdown Timer", type: "conversion", status: "inactive" },
  { name: "Stock Scarcity Progress Bar", type: "conversion", status: "inactive" },
  { name: "Bulk Discount Tier Table", type: "conversion", status: "inactive" },
  { name: "Guarantee Section", type: "conversion", status: "inactive" },
  { name: "FAQ Accordion with Schema", type: "conversion", status: "inactive" },
  { name: "Email Popup Capture", type: "conversion", status: "inactive" },
];

export default function Sections() {
  return (
    <Page title="Sections Library">
      <TitleBar title="Sections Library" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="p" variant="bodyMd">
                  Browse 30+ conversion-optimized sections. Add any section to your store with one click.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
        <Grid>
          {SECTIONS.map((section) => (
            <Grid.Cell
              key={section.name}
              columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}
            >
              <Card>
                <BlockStack gap="300">
                  <Text as="h3" variant="headingSm">
                    {section.name}
                  </Text>
                  <Badge tone="info">{section.type}</Badge>
                  <Button>Add to Store</Button>
                </BlockStack>
              </Card>
            </Grid.Cell>
          ))}
        </Grid>
      </BlockStack>
    </Page>
  );
}
