import { Page, Layout, Card, Text, BlockStack, List } from "@shopify/polaris";

export default function HelpCenter() {
  return (
    <Page title="Help & Documentation" subtitle="Learn how to make the most out of StoreForge">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Frequently Asked Questions</Text>
              
              <div style={{ marginTop: "1rem" }}>
                <BlockStack gap="400">
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingSm">How do I generate my first store design?</Text>
                    <Text as="p" tone="subdued">
                      Navigate to the <b>Generator</b> tab on the sidebar. Follow the 4-step wizard to select a niche, choose a base theme (e.g. Minimal, Aggressive), and customize your layout. Once finished, StoreForge will construct your theme entirely in the background.
                    </Text>
                  </BlockStack>
                  
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingSm">How does the AI Assistant work?</Text>
                    <Text as="p" tone="subdued">
                      Our AI Assistant has deep integration into your store's theme engine. You can ask it to <i>"change primary color to blue"</i> or <i>"run a health scan"</i>, and the AI will invoke the appropriate internal tools to execute your request instantly.
                    </Text>
                  </BlockStack>

                  <BlockStack gap="200">
                    <Text as="h3" variant="headingSm">Can I schedule a flash sale?</Text>
                    <Text as="p" tone="subdued">
                      Yes! Head over to the <b>Campaigns</b> tab. Select a template (like Diwali or End of Season Sale) and set your Start and End dates. The app will automatically inject the promotional sections when the sale begins, and revert them when it ends.
                    </Text>
                  </BlockStack>

                  <BlockStack gap="200">
                    <Text as="h3" variant="headingSm">What is the Store Health Score?</Text>
                    <Text as="p" tone="subdued">
                      The Health Monitor analyzes your theme across 5 axes: Performance, SEO, Compliance, Conversion, and Accessibility. If any issues are found (e.g., missing Trust Badges), the app provides a one-click <b>Fix It</b> button to instantly resolve the issue!
                    </Text>
                  </BlockStack>
                </BlockStack>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Need more help?</Text>
              <Text as="p" tone="subdued">
                If you encounter any issues not covered here, feel free to reach out to our dedicated support team.
              </Text>
              <List type="bullet">
                <List.Item>Email: support@storeforge.ai</List.Item>
                <List.Item>Hours: Mon-Fri, 9am - 6pm (IST)</List.Item>
              </List>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
