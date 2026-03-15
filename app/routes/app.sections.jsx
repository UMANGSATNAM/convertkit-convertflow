import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Grid,
  Badge,
  Button,
  Tabs,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useState, useCallback } from "react";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

const SECTIONS = [
  { name: "Split Layout Hero", type: "hero", description: "Left text + right image with animated entrance" },
  { name: "Video Background Hero", type: "hero", description: "Full-width video background with text overlay and CTA" },
  { name: "Countdown Announcement Bar", type: "hero", description: "Slim top bar with live countdown timer and CTA" },
  { name: "Social Proof Scroll Bar", type: "hero", description: "Auto-scrolling press logos and certification badges" },
  { name: "USP Icon Grid", type: "hero", description: "Four-column grid for free shipping, returns, checkout, etc." },
  { name: "Ingredients Breakdown", type: "product", description: "Accordion-style section for product ingredients" },
  { name: "Before and After Slider", type: "product", description: "Interactive image comparison slider for results" },
  { name: "Product Benefits Grid", type: "product", description: "Three/four-column benefits with icons" },
  { name: "Tabbed Product Info", type: "product", description: "Description, ingredients, how to use, FAQ tabs" },
  { name: "Size and Fit Guide", type: "product", description: "Size chart table with cm/inches unit toggle" },
  { name: "Complementary Products", type: "product", description: "Curated product grid with individual ATC buttons" },
  { name: "Star Rating Summary", type: "trust", description: "Aggregated review score with star breakdown chart" },
  { name: "Press and Media Logos", type: "trust", description: "As-seen-in logos with optional pull quotes" },
  { name: "Trust Badge Row", type: "trust", description: "Horizontal row of 40+ trust signal icons" },
  { name: "Customer Photo Reviews Grid", type: "trust", description: "Masonry grid of customer photos with ratings" },
  { name: "Real-Time Purchase Notification", type: "trust", description: "Toast popup showing real recent orders" },
  { name: "Standalone Countdown Timer", type: "conversion", description: "Full-width countdown to specific deadline" },
  { name: "Stock Scarcity Progress Bar", type: "conversion", description: "Real inventory count with color-coded bar" },
  { name: "Bulk Discount Tier Table", type: "conversion", description: "Quantity pricing tiers to encourage larger orders" },
  { name: "Guarantee Section", type: "conversion", description: "Full-width guarantee block with seal and terms" },
  { name: "FAQ Accordion with Schema", type: "conversion", description: "FAQ section with Google rich results schema markup" },
  { name: "Email Popup Capture", type: "conversion", description: "Exit-intent popup with discount for email signup" },
];

const TABS = [
  { id: "all", content: `All (${SECTIONS.length})` },
  { id: "hero", content: `Hero (${SECTIONS.filter((s) => s.type === "hero").length})` },
  { id: "product", content: `Product (${SECTIONS.filter((s) => s.type === "product").length})` },
  { id: "trust", content: `Trust (${SECTIONS.filter((s) => s.type === "trust").length})` },
  { id: "conversion", content: `Conversion (${SECTIONS.filter((s) => s.type === "conversion").length})` },
];

const TYPE_BADGE_TONE = {
  hero: "info",
  product: "success",
  trust: "warning",
  conversion: "critical",
};

export default function Sections() {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = useCallback((idx) => setSelectedTab(idx), []);

  const activeFilter = TABS[selectedTab].id;
  const filteredSections =
    activeFilter === "all"
      ? SECTIONS
      : SECTIONS.filter((s) => s.type === activeFilter);

  return (
    <Page title="Sections Library">
      <TitleBar title="Sections Library" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="p" variant="bodyMd">
                  Browse 30+ conversion-optimized sections. Add any section to
                  your store with one click. All sections work on all Shopify
                  themes.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        <Tabs tabs={TABS} selected={selectedTab} onSelect={handleTabChange}>
          <div style={{ paddingTop: "16px" }}>
            <Grid>
              {filteredSections.map((section) => (
                <Grid.Cell
                  key={section.name}
                  columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}
                >
                  <Card>
                    <BlockStack gap="300">
                      <InlineStack
                        align="space-between"
                        blockAlign="center"
                      >
                        <Text as="h3" variant="headingSm">
                          {section.name}
                        </Text>
                      </InlineStack>
                      <Badge tone={TYPE_BADGE_TONE[section.type] || "new"}>
                        {section.type}
                      </Badge>
                      <Text as="p" variant="bodySm" tone="subdued">
                        {section.description}
                      </Text>
                      <Button>Add to Store</Button>
                    </BlockStack>
                  </Card>
                </Grid.Cell>
              ))}
            </Grid>
          </div>
        </Tabs>
      </BlockStack>
    </Page>
  );
}
