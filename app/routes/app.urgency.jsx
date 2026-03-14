import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Badge,
  Button,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

const URGENCY_TOOLS = [
  {
    name: "Inventory Scarcity Counter",
    description: "Displays 'Only X left in stock' when inventory falls below a threshold. Uses real Shopify Inventory API data.",
    status: "inactive",
  },
  {
    name: "Sale Countdown Timer",
    description: "Real deadline countdown showing days, hours, minutes, seconds. Automatically hides when deadline passes.",
    status: "inactive",
  },
  {
    name: "Recent Buyer Notification",
    description: "Toast notification showing real recent orders. Requires minimum 5 real orders before activating.",
    status: "inactive",
  },
  {
    name: "Cart Threshold Progress Bar",
    description: "Progress bar showing how close the customer is to free shipping or a discount tier.",
    status: "inactive",
  },
  {
    name: "Time-Sensitive Offer Banner",
    description: "Dismissible banner with embedded mini countdown. Does not reset on refresh.",
    status: "inactive",
  },
];

export default function UrgencyTools() {
  return (
    <Page title="Urgency Tools">
      <TitleBar title="Urgency Maker" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <Text as="p" variant="bodyMd">
                  All urgency signals use real data from your Shopify store. No fake timers. No fabricated data.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
        {URGENCY_TOOLS.map((tool) => (
          <Card key={tool.name}>
            <BlockStack gap="300">
              <InlineStack align="space-between">
                <Text as="h3" variant="headingSm">
                  {tool.name}
                </Text>
                <Badge tone={tool.status === "active" ? "success" : "attention"}>
                  {tool.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </InlineStack>
              <Text as="p" variant="bodyMd">
                {tool.description}
              </Text>
              <InlineStack gap="300">
                <Button>Configure</Button>
                <Button variant="primary">Activate</Button>
              </InlineStack>
            </BlockStack>
          </Card>
        ))}
      </BlockStack>
    </Page>
  );
}
