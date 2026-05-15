import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Banner,
  Box,
  Grid,
  Divider,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { getThemeEmbedStatus } from "../lib/theme-embed.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);

  const shop = await prisma.shop.findUnique({
    where: { shopifyDomain: session.shop },
    include: { _count: { select: { pages: { where: { deletedAt: null } } } } },
  });

  let embedStatus: { enableUrl: string; themeName: string } | null = null;
  try {
    embedStatus = await getThemeEmbedStatus(admin);
  } catch {
    // non-fatal
  }

  return json({
    pageCount: shop?._count.pages ?? 0,
    plan: shop?.plan ?? "FREE",
    embedStatus,
  });
};

export default function Index() {
  const { pageCount, plan, embedStatus } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Page
      title="OmniBuilder"
      subtitle="The all-in-one page & conversion builder for Shopify"
      primaryAction={{
        content: "Create Page",
        onAction: () => navigate("/app/pages/new"),
      }}
    >
      <BlockStack gap="500">
        {embedStatus && (
          <Banner
            title="Enable OmniBuilder on your store"
            action={{
              content: "Open Theme Editor",
              url: embedStatus.enableUrl,
              external: true,
            }}
            tone="info"
          >
            <Text as="p">
              Add the OmniBuilder app embed to{" "}
              <strong>{embedStatus.themeName}</strong> to display your published
              pages on the storefront.
            </Text>
          </Banner>
        )}

        <Layout>
          <Layout.Section>
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                <Card>
                  <BlockStack gap="200">
                    <Text variant="headingMd" as="h3">
                      Pages
                    </Text>
                    <Text variant="heading2xl" as="p" tone="success">
                      {pageCount}
                    </Text>
                    <Text as="p" tone="subdued">
                      Active pages in your store
                    </Text>
                    <Box paddingBlockStart="200">
                      <Button
                        variant="secondary"
                        onClick={() => navigate("/app/pages")}
                      >
                        Manage Pages
                      </Button>
                    </Box>
                  </BlockStack>
                </Card>
              </Grid.Cell>

              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                <Card>
                  <BlockStack gap="200">
                    <Text variant="headingMd" as="h3">
                      Current Plan
                    </Text>
                    <Text variant="heading2xl" as="p">
                      {plan}
                    </Text>
                    <Text as="p" tone="subdued">
                      {plan === "FREE"
                        ? "Up to 3 pages"
                        : "Unlimited features"}
                    </Text>
                    <Box paddingBlockStart="200">
                      <Button
                        variant="secondary"
                        onClick={() => navigate("/app/billing")}
                      >
                        Upgrade Plan
                      </Button>
                    </Box>
                  </BlockStack>
                </Card>
              </Grid.Cell>

              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                <Card>
                  <BlockStack gap="200">
                    <Text variant="headingMd" as="h3">
                      Quick Start
                    </Text>
                    <Divider />
                    <InlineStack gap="200" wrap={false}>
                      <Button
                        variant="primary"
                        onClick={() => navigate("/app/pages/new")}
                      >
                        New Landing Page
                      </Button>
                    </InlineStack>
                    <Text as="p" tone="subdued">
                      Build and publish in minutes
                    </Text>
                  </BlockStack>
                </Card>
              </Grid.Cell>
            </Grid>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
