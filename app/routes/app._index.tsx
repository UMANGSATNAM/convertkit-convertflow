import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  InlineStack,
  CalloutCard
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }: any) => {
  const { session } = await authenticate.admin(request);
  const merchant = await prisma.merchant.findUnique({
    where: { shopDomain: session.shop }
  });

  return json({
    merchant,
    shop: session.shop
  });
};

export default function Dashboard() {
  const { merchant, shop } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section>
          <CalloutCard
            title="Transform Your Entire Store"
            illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10bf5acbd2df3fa8d40788339.svg"
            primaryAction={{
              content: 'Browse Templates',
              onAction: () => navigate("/app/templates"),
            }}
          >
            <p>
              Instantly apply premium, full-store templates that replace your homepage, 
              product pages, collections, headers, and footers—all editable directly in the Shopify Theme Editor.
            </p>
          </CalloutCard>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Active Template</Text>
              {merchant?.activeThemeId ? (
                <Text as="p">You have a custom template applied. Check your settings for backups.</Text>
              ) : (
                <Text as="p" tone="subdued">No full-store templates applied yet.</Text>
              )}
              <InlineStack>
                <Button onClick={() => navigate("/app/settings")}>Manage Theme Backups</Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
