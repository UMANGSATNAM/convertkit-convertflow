import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  ResourceList,
  ResourceItem,
  Badge,
  Avatar,
} from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";

export default function PagesManager() {
  return (
    <Page
      fullWidth
      title="Pages"
      primaryAction={{ content: "Create Page", icon: PlusIcon }}
    >
      <Layout>
        <Layout.Section>
          <Card padding="0">
            <ResourceList
              resourceName={{ singular: "page", plural: "pages" }}
              items={[
                {
                  id: "1",
                  name: "Diwali Mega Sale",
                  type: "Landing Page",
                  status: "Published",
                  views: "24.5k",
                  date: "Oct 12, 2026",
                },
                {
                  id: "2",
                  name: "About Us - Our Heritage",
                  type: "Standard Page",
                  status: "Published",
                  views: "12.1k",
                  date: "Sep 28, 2026",
                },
                {
                  id: "3",
                  name: "Winter Collection Launch",
                  type: "Landing Page",
                  status: "Draft",
                  views: "-",
                  date: "Nov 01, 2026",
                },
              ]}
              renderItem={(item) => {
                const { id, name, type, status, views, date } = item;
                return (
                  <ResourceItem id={id} onClick={() => {}}>
                    <InlineStack
                      align="space-between"
                      blockAlign="center"
                      wrap={false}
                    >
                      <InlineStack gap="400" blockAlign="center">
                        <Avatar customer size="md" name={name} source="" />
                        <BlockStack gap="100">
                          <Text variant="bodyLg" fontWeight="bold" as="h3">
                            {name}
                          </Text>
                          <Text variant="bodySm" tone="subdued">
                            {type} • Last edited {date}
                          </Text>
                        </BlockStack>
                      </InlineStack>
                      <InlineStack gap="400" blockAlign="center">
                        <Text variant="bodyMd" tone="subdued">
                          {views} views
                        </Text>
                        <Badge
                          tone={status === "Published" ? "success" : "info"}
                        >
                          {status}
                        </Badge>
                      </InlineStack>
                    </InlineStack>
                  </ResourceItem>
                );
              }}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
