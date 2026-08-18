import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  Page, Layout, Card, Text, BlockStack, InlineStack, Button, Badge, Banner, Box, Divider,
} from "@shopify/polaris";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import { graphqlRequest } from "../services/shopify-api.server";

/**
 * Home. Shows where the merchant is and the single next thing to do.
 *
 * The previous version was a dashboard: health score, features enabled, recent
 * AI actions, an upsell. All of it was information *about* the app rather than a
 * route through it, and a merchant who had just installed had to work out for
 * themselves which of fourteen menu items would give them a store.
 *
 * This asks three questions in order — is a theme installed, does it have
 * products, has anything been added — and then puts one button on the screen.
 */

interface Step {
  id: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  done: boolean;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });

  let themeName: string | null = null;
  let productCount = 0;
  let sectionsAdded = 0;

  if (shop) {
    // Read the live state rather than trusting a stored flag: a merchant may
    // have changed their theme or deleted products outside the app, and a
    // checklist that lies is worse than no checklist.
    try {
      const res = await graphqlRequest(
        shop.shopDomain,
        shop.accessToken,
        `query {
          themes(first: 20) { nodes { name role } }
          productsCount { count }
        }`
      );
      const live = (res?.themes?.nodes || []).find((t: any) => String(t.role).toLowerCase() === "main");
      themeName = live?.name || null;
      productCount = res?.productsCount?.count ?? 0;
    } catch (err: any) {
      console.warn(`[Home] Could not read store state: ${err.message}`);
    }

    try {
      sectionsAdded = await prisma.installedSection.count({ where: { shopId: shop.id } });
    } catch {
      // The table may not exist on older installs; the checklist still works.
      sectionsAdded = 0;
    }
  }

  const steps: Step[] = [
    {
      id: "products",
      title: "Add your products",
      body: "Sections preview with your real products, so this comes first.",
      cta: "Open products",
      href: `https://${session.shop}/admin/products`,
      done: productCount > 0,
    },
    {
      id: "sections",
      title: "Add sections to your store",
      body: "Browse designs, preview each one on your own store, then add the ones you like.",
      cta: "Browse sections",
      href: "/app/sections",
      done: sectionsAdded > 0,
    },
    {
      id: "review",
      title: "Review your theme",
      body: "See everything you have added and swap anything that is not working.",
      cta: "Open my theme",
      href: "/app/theme",
      done: false,
    },
  ];

  const next = steps.find(s => !s.done) || steps[steps.length - 1];

  return json({
    shopDomain: session.shop,
    connected: Boolean(shop),
    themeName,
    productCount,
    sectionsAdded,
    steps,
    nextStepId: next.id,
  });
};

export default function Home() {
  const { shopDomain, connected, themeName, productCount, sectionsAdded, steps, nextStepId } =
    useLoaderData<typeof loader>();

  const next = steps.find(s => s.id === nextStepId)!;
  const isExternal = next.href.startsWith("http");

  return (
    <Page title="ConvertFlow">
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {!connected && (
              <Banner tone="warning" title="Finishing setup">
                <p>This store is still being connected. Reload in a moment.</p>
              </Banner>
            )}

            {/* One card, one action. Everything else on this page is context. */}
            <Card>
              <BlockStack gap="400">
                <BlockStack gap="150">
                  <Text as="p" tone="subdued" variant="bodySm">
                    NEXT STEP
                  </Text>
                  <Text as="h2" variant="headingLg">
                    {next.title}
                  </Text>
                  <Text as="p" tone="subdued">
                    {next.body}
                  </Text>
                </BlockStack>
                <Box>
                  {isExternal ? (
                    <Button variant="primary" size="large" url={next.href} target="_blank">
                      {next.cta}
                    </Button>
                  ) : (
                    <Link to={next.href}>
                      <Button variant="primary" size="large">
                        {next.cta}
                      </Button>
                    </Link>
                  )}
                </Box>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="300">
                <Text as="h3" variant="headingSm">
                  Setup
                </Text>
                {steps.map((s, i) => (
                  <Box key={s.id}>
                    {i > 0 && <Box paddingBlockEnd="300"><Divider /></Box>}
                    <InlineStack align="space-between" blockAlign="center" gap="400">
                      <BlockStack gap="050">
                        <InlineStack gap="200" blockAlign="center">
                          <Text as="p" variant="bodyMd" fontWeight={s.id === nextStepId ? "semibold" : "regular"}>
                            {s.title}
                          </Text>
                          {s.done && <Badge tone="success">Done</Badge>}
                        </InlineStack>
                        <Text as="p" tone="subdued" variant="bodySm">
                          {s.body}
                        </Text>
                      </BlockStack>
                      {!s.done &&
                        (s.href.startsWith("http") ? (
                          <Button url={s.href} target="_blank">{s.cta}</Button>
                        ) : (
                          <Link to={s.href}>
                            <Button>{s.cta}</Button>
                          </Link>
                        ))}
                    </InlineStack>
                  </Box>
                ))}
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="200">
                <Text as="h3" variant="headingSm">
                  Your store
                </Text>
                <InlineStack gap="600" wrap>
                  <BlockStack gap="050">
                    <Text as="p" tone="subdued" variant="bodySm">Live theme</Text>
                    <Text as="p" variant="bodyMd">{themeName || "—"}</Text>
                  </BlockStack>
                  <BlockStack gap="050">
                    <Text as="p" tone="subdued" variant="bodySm">Products</Text>
                    <Text as="p" variant="bodyMd">{productCount}</Text>
                  </BlockStack>
                  <BlockStack gap="050">
                    <Text as="p" tone="subdued" variant="bodySm">Sections added</Text>
                    <Text as="p" variant="bodyMd">{sectionsAdded}</Text>
                  </BlockStack>
                  <BlockStack gap="050">
                    <Text as="p" tone="subdued" variant="bodySm">Store</Text>
                    <Text as="p" variant="bodyMd">{shopDomain}</Text>
                  </BlockStack>
                </InlineStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
