import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  ResourceList,
  ResourceItem,
  Badge,
  Button
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }: any) => {
  const { session } = await authenticate.admin(request);
  const merchant = await prisma.merchant.findUnique({
    where: { shopDomain: session.shop },
    include: { backups: { orderBy: { createdAt: 'desc' } } }
  });

  return json({ backups: merchant?.backups || [] });
};

export default function Settings() {
  const { backups } = useLoaderData<typeof loader>();

  return (
    <Page title="Settings & Backups">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Theme Backups</Text>
              <Text as="p" tone="subdued">
                Every time you inject a template, we automatically duplicate your live theme 
                so you always have a safe restore point.
              </Text>

              {backups.length === 0 ? (
                <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                  <Text as="p" tone="subdued">No backups found. Apply a template to create one.</Text>
                </div>
              ) : (
                <ResourceList
                  resourceName={{ singular: 'backup', plural: 'backups' }}
                  items={backups.map((b: any) => ({
                    id: b.id,
                    name: b.backupName,
                    date: new Date(b.createdAt).toLocaleDateString(),
                    isRestored: b.isRestored
                  }))}
                  renderItem={(item) => (
                    <ResourceItem
                      id={item.id}
                      onClick={() => {}}
                      accessibilityLabel={`View details for ${item.name}`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <Text variant="bodyMd" fontWeight="bold" as="h3">
                            {item.name}
                          </Text>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Created on {item.date}
                          </Text>
                        </div>
                        <div>
                          {item.isRestored ? (
                            <Badge tone="success">Restored</Badge>
                          ) : (
                            <Button>Restore Theme</Button>
                          )}
                        </div>
                      </div>
                    </ResourceItem>
                  )}
                />
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
