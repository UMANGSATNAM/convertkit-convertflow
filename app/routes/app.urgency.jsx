import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Badge,
  Button,
  InlineStack,
  TextField,
  Divider,
  Banner,
  Select,
  Box,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState, useCallback } from "react";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  let timers = [];
  try {
    timers = await prisma.urgencyTimer.findMany({
      where: { shopId: session.shop },
    });
  } catch (e) {
    // DB may not be pushed yet
  }

  // Convert to a map by displayType for easy lookup
  const configMap = {};
  for (const t of timers) {
    configMap[t.displayType] = {
      id: t.id,
      isActive: t.isActive,
      message: t.message,
      deadline: t.deadline ? t.deadline.toISOString().slice(0, 16) : "",
      productId: t.productId,
      collectionId: t.collectionId,
    };
  }

  return json({ configMap });
};

const defaultConfig = (type) => ({
  isActive: false,
  message: "",
  deadline: "",
  productId: "",
  collectionId: "",
});

export default function UrgencyTools() {
  const { configMap } = useLoaderData();
  const fetcher = useFetcher();

  const getConfig = (type) => configMap[type] || defaultConfig(type);
  const isSaving = fetcher.state !== "idle";

  const saveConfig = (toolType, data) => {
    fetcher.submit(
      { toolType, ...data },
      { method: "POST", action: "/api/urgency" }
    );
  };

  return (
    <Page title="Urgency Tools">
      <TitleBar title="Urgency Maker" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <Text as="p" variant="bodyMd">
                  All urgency signals use real data from your Shopify store. No
                  fake timers. No fabricated purchase notifications. If the real
                  data does not meet the threshold, the feature does not show.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {fetcher.data?.success && (
          <Banner tone="success" onDismiss={() => {}}>
            <p>Configuration saved successfully.</p>
          </Banner>
        )}

        {/* ── 1. Inventory Scarcity Counter ── */}
        <ScarcityTool
          config={getConfig("scarcity")}
          onSave={saveConfig}
          isSaving={isSaving}
        />

        {/* ── 2. Sale Countdown Timer ── */}
        <CountdownTool
          config={getConfig("countdown")}
          onSave={saveConfig}
          isSaving={isSaving}
        />

        {/* ── 3. Recent Buyer Notification ── */}
        <BuyerNotificationTool
          config={getConfig("buyer")}
          onSave={saveConfig}
          isSaving={isSaving}
        />

        {/* ── 4. Cart Threshold Progress Bar ── */}
        <CartThresholdTool
          config={getConfig("threshold")}
          onSave={saveConfig}
          isSaving={isSaving}
        />

        {/* ── 5. Time-Sensitive Offer Banner ── */}
        <OfferBannerTool
          config={getConfig("banner")}
          onSave={saveConfig}
          isSaving={isSaving}
        />
      </BlockStack>
    </Page>
  );
}

// ── Tool Components ──

function ScarcityTool({ config, onSave, isSaving }) {
  const [threshold, setThreshold] = useState(
    config.message || "10"
  );
  const [active, setActive] = useState(config.isActive);

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="100">
            <Text as="h3" variant="headingMd">
              Inventory Scarcity Counter
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Shows "Only X left in stock" with a color-coded progress bar.
              Pulls real inventory from Shopify.
            </Text>
          </BlockStack>
          <Badge tone={active ? "success" : "attention"}>
            {active ? "Active" : "Inactive"}
          </Badge>
        </InlineStack>
        <Divider />
        <TextField
          label="Show when inventory falls below (units)"
          type="number"
          value={threshold}
          onChange={setThreshold}
          min={1}
          max={20}
          helpText="Progress bar: green above 10, orange 5–10, red below 5"
          autoComplete="off"
        />
        <InlineStack gap="300">
          <Button
            variant="primary"
            loading={isSaving}
            onClick={() =>
              onSave("scarcity", {
                isActive: String(!active),
                message: threshold,
              })
            }
          >
            {active ? "Deactivate" : "Activate"}
          </Button>
          <Button
            loading={isSaving}
            onClick={() =>
              onSave("scarcity", {
                isActive: String(active),
                message: threshold,
              })
            }
          >
            Save Settings
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

function CountdownTool({ config, onSave, isSaving }) {
  const [deadline, setDeadline] = useState(config.deadline || "");
  const [active, setActive] = useState(config.isActive);

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="100">
            <Text as="h3" variant="headingMd">
              Sale Countdown Timer
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Real deadline countdown. Automatically hides when deadline
              passes. Does not reset.
            </Text>
          </BlockStack>
          <Badge tone={active ? "success" : "attention"}>
            {active ? "Active" : "Inactive"}
          </Badge>
        </InlineStack>
        <Divider />
        <TextField
          label="Sale deadline"
          type="datetime-local"
          value={deadline}
          onChange={setDeadline}
          helpText="The countdown hides automatically once this time passes"
          autoComplete="off"
        />
        <InlineStack gap="300">
          <Button
            variant="primary"
            loading={isSaving}
            onClick={() =>
              onSave("countdown", {
                isActive: String(!active),
                deadline,
              })
            }
          >
            {active ? "Deactivate" : "Activate"}
          </Button>
          <Button
            loading={isSaving}
            onClick={() =>
              onSave("countdown", {
                isActive: String(active),
                deadline,
              })
            }
          >
            Save Settings
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

function BuyerNotificationTool({ config, onSave, isSaving }) {
  const [active, setActive] = useState(config.isActive);

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="100">
            <Text as="h3" variant="headingMd">
              Recent Buyer Notification
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Toast notifications showing real recent orders ("Sarah from Austin
              bought this 2 hours ago"). Requires minimum 5 real orders.
            </Text>
          </BlockStack>
          <Badge tone={active ? "success" : "attention"}>
            {active ? "Active" : "Inactive"}
          </Badge>
        </InlineStack>
        <Divider />
        <Banner tone="info">
          <p>
            This tool requires at least 5 real orders in the last 7 days before
            it shows. It never displays fabricated data.
          </p>
        </Banner>
        <Button
          variant="primary"
          loading={isSaving}
          onClick={() =>
            onSave("buyer", {
              isActive: String(!active),
              message: "5",
            })
          }
        >
          {active ? "Deactivate" : "Activate"}
        </Button>
      </BlockStack>
    </Card>
  );
}

function CartThresholdTool({ config, onSave, isSaving }) {
  const [amount, setAmount] = useState(config.message || "50");
  const [active, setActive] = useState(config.isActive);

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="100">
            <Text as="h3" variant="headingMd">
              Cart Threshold Progress Bar
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Shows "Add $X more for free shipping" with a live progress bar.
              Updates in real time.
            </Text>
          </BlockStack>
          <Badge tone={active ? "success" : "attention"}>
            {active ? "Active" : "Inactive"}
          </Badge>
        </InlineStack>
        <Divider />
        <TextField
          label="Free shipping threshold ($)"
          type="number"
          value={amount}
          onChange={setAmount}
          prefix="$"
          helpText="Customers see how close they are to this amount"
          autoComplete="off"
        />
        <InlineStack gap="300">
          <Button
            variant="primary"
            loading={isSaving}
            onClick={() =>
              onSave("threshold", {
                isActive: String(!active),
                message: amount,
              })
            }
          >
            {active ? "Deactivate" : "Activate"}
          </Button>
          <Button
            loading={isSaving}
            onClick={() =>
              onSave("threshold", {
                isActive: String(active),
                message: amount,
              })
            }
          >
            Save Settings
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

function OfferBannerTool({ config, onSave, isSaving }) {
  const [message, setMessage] = useState(
    config.message || "Order in the next {time} for same-day dispatch"
  );
  const [active, setActive] = useState(config.isActive);

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="100">
            <Text as="h3" variant="headingMd">
              Time-Sensitive Offer Banner
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Dismissible top banner with embedded mini countdown. Does not
              reset on page refresh.
            </Text>
          </BlockStack>
          <Badge tone={active ? "success" : "attention"}>
            {active ? "Active" : "Inactive"}
          </Badge>
        </InlineStack>
        <Divider />
        <TextField
          label="Banner message"
          value={message}
          onChange={setMessage}
          helpText="Use {time} as placeholder for the countdown"
          autoComplete="off"
        />
        <InlineStack gap="300">
          <Button
            variant="primary"
            loading={isSaving}
            onClick={() =>
              onSave("banner", {
                isActive: String(!active),
                message,
              })
            }
          >
            {active ? "Deactivate" : "Activate"}
          </Button>
          <Button
            loading={isSaving}
            onClick={() =>
              onSave("banner", {
                isActive: String(active),
                message,
              })
            }
          >
            Save Settings
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}
