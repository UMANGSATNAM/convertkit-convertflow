import { redirect } from "@remix-run/node";
import { Page, Layout, Text, Card, BlockStack } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }: any) => {
  const { session, redirect } = await authenticate.admin(request);
  
  const merchant = await prisma.merchant.findUnique({
    where: { shopDomain: session.shop },
  });

  if (!merchant || !merchant.onboardingCompleted) {
    return redirect("/app/onboarding");
  }

  return { merchant };
};

export default function Index() {
  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h1" variant="headingLg">
                Welcome to ConvertKit Pro
              </Text>
              <Text as="p" variant="bodyMd">
                Your store is fully configured. Use the tabs above to manage your features.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
