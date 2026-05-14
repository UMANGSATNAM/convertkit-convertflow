import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  TextField,
  Select,
  Box,
  Divider,
  Badge,
} from "@shopify/polaris";

export default function Settings() {
  return (
    <Page
      fullWidth
      title="Settings"
      subtitle="Manage your ConvertFlow global preferences and configurations."
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  General
                </Text>
                <TextField
                  label="App Status"
                  value="Enabled"
                  disabled
                  helpText="Disable to temporarily hide all ConvertFlow widgets and pages from your storefront."
                />
                <Button tone="critical">Disable App</Button>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Theme Integration
                </Text>
                <Text variant="bodyMd" tone="subdued">
                  ConvertFlow injects its core CSS and JS variables into your
                  active theme automatically.
                </Text>
                <Divider />
                <InlineStack align="space-between" blockAlign="center">
                  <Text variant="bodyMd" fontWeight="semibold">
                    Dawn v12.0.0 (Active)
                  </Text>
                  <Badge tone="success">Connected</Badge>
                </InlineStack>
                <Button variant="plain">Force Sync Assets</Button>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Global Brand Styles
                </Text>
                <Text variant="bodyMd" tone="subdued">
                  These styles will be applied to all landing pages and CRO
                  widgets built with ConvertFlow.
                </Text>
                <Box paddingBlockStart="200">
                  <InlineStack gap="400">
                    <TextField
                      label="Primary Brand Color"
                      value="#000000"
                      autoComplete="off"
                    />
                    <TextField
                      label="Secondary Brand Color"
                      value="#FFFFFF"
                      autoComplete="off"
                    />
                  </InlineStack>
                </Box>
                <Box paddingBlockStart="200">
                  <Select
                    label="Primary Font Family"
                    options={[
                      { label: "Inter (Modern Sans-Serif)", value: "inter" },
                      { label: "Playfair Display (Serif)", value: "playfair" },
                      { label: "Roboto (Clean Sans)", value: "roboto" },
                    ]}
                    value="inter"
                  />
                </Box>
                <Button>Save Brand Styles</Button>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
