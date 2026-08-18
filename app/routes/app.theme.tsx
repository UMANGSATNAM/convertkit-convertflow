import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useFetcher } from "@remix-run/react";
import {
  Page, Layout, Card, Text, BlockStack, InlineStack, Button, Badge, Banner, Box, Divider, Spinner,
} from "@shopify/polaris";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import { readFile } from "../services/theme-engine/index";
import { removeSectionFromPage } from "../services/section-install.server";
import { deletePreviewTheme } from "../services/preview-theme.server";

/**
 * What is actually on the merchant's storefront, read from the theme itself.
 *
 * The app previously had no screen that answered "what did I add?". A merchant
 * could install sections and then had to open Shopify's theme editor to see the
 * result, which defeats the point of the app being the place you build from.
 *
 * The list is read live from the theme's template JSON rather than from a table
 * of what the app believes it installed. Those two drift the moment a merchant
 * removes something in Shopify's editor, and the version that lies is the one
 * stored in our database.
 */

const PAGES = [
  { label: "Home", file: "templates/index.json" },
  { label: "Header", file: "sections/header-group.json" },
  { label: "Footer", file: "sections/footer-group.json" },
  { label: "Product", file: "templates/product.json" },
  { label: "Collection", file: "templates/collection.json" },
];

async function readSections(shop: any, file: string) {
  try {
    const raw = await readFile(shop, "active", file);
    const doc = JSON.parse(raw || "{}");
    const order: string[] = Array.isArray(doc.order) ? doc.order : Object.keys(doc.sections || {});
    return order
      .map(key => ({ key, type: doc.sections?.[key]?.type }))
      .filter(s => s.type);
  } catch {
    return [];
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) return json({ connected: false, pages: [], shopDomain: session.shop });

  const pages = await Promise.all(
    PAGES.map(async p => ({ ...p, sections: await readSections(shop, p.file) }))
  );

  // Which of these came from the library, so the UI can offer a swap rather
  // than treating a merchant's own section as ours to replace.
  const known = await prisma.componentRegistry.findMany({
    where: { componentId: { in: pages.flatMap(p => p.sections.map(s => s.type)) } },
    select: { componentId: true, sectionType: true, family: true },
  });
  const knownMap = Object.fromEntries(known.map(k => [k.componentId, k]));

  return json({
    connected: true,
    shopDomain: session.shop,
    pages: pages.map(p => ({
      ...p,
      sections: p.sections.map(s => ({ ...s, meta: knownMap[s.type!] || null })),
    })),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent"));

  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) return json({ error: "This store is not connected yet." }, { status: 400 });

  try {
    if (intent === "remove") {
      const file = String(form.get("file"));
      const key = String(form.get("key"));
      const removed = await removeSectionFromPage(shop, "active", file, key);
      return json({ ok: true, intent, removed, key });
    }

    if (intent === "cleanup-preview") {
      const deleted = await deletePreviewTheme(shop);
      return json({ ok: true, intent, deleted });
    }

    return json({ error: `Unknown intent "${intent}"` }, { status: 400 });
  } catch (err: any) {
    console.error(`[Theme] ${intent} failed:`, err);
    return json({ error: err.message || String(err) }, { status: 500 });
  }
};

export default function MyTheme() {
  const { connected, pages, shopDomain } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<any>();
  const busy = fetcher.state !== "idle";

  const total = pages.reduce((n, p) => n + p.sections.length, 0);

  return (
    <Page
      title="My theme"
      subtitle="Everything on your live storefront, read from the theme itself."
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {fetcher.data?.error && (
              <Banner tone="critical" title="That did not work">
                <p>{fetcher.data.error}</p>
              </Banner>
            )}

            {fetcher.data?.ok && fetcher.data.intent === "remove" && (
              <Banner tone="success" title="Removed">
                <p>
                  {fetcher.data.key} is off the page. Its file is still in your theme, so
                  adding it back keeps your settings.
                </p>
              </Banner>
            )}

            {!connected && (
              <Banner tone="warning" title="Finishing setup">
                <p>This store is still being connected. Reload in a moment.</p>
              </Banner>
            )}

            {connected && total === 0 && (
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">Nothing added yet</Text>
                  <Text as="p" tone="subdued">
                    Your theme is running its own sections. Browse the library to add one and
                    see it on your store first.
                  </Text>
                  <Box>
                    <Link to="/app/sections">
                      <Button variant="primary">Browse sections</Button>
                    </Link>
                  </Box>
                </BlockStack>
              </Card>
            )}

            {pages.map(page => (
              <Card key={page.file}>
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="h3" variant="headingSm">{page.label}</Text>
                    <Text as="p" tone="subdued" variant="bodySm">
                      {page.sections.length} section{page.sections.length === 1 ? "" : "s"}
                    </Text>
                  </InlineStack>

                  {page.sections.length === 0 ? (
                    <Text as="p" tone="subdued" variant="bodySm">
                      Nothing on this page yet.
                    </Text>
                  ) : (
                    page.sections.map((s, i) => (
                      <Box key={s.key}>
                        {i > 0 && <Box paddingBlockEnd="200"><Divider /></Box>}
                        <InlineStack align="space-between" blockAlign="center" gap="300">
                          <BlockStack gap="050">
                            <InlineStack gap="200" blockAlign="center">
                              <Text as="p" variant="bodyMd">{s.type}</Text>
                              {s.meta?.family && <Badge>{s.meta.family}</Badge>}
                              {!s.meta && <Badge tone="attention">Your theme's own</Badge>}
                            </InlineStack>
                            <Text as="p" tone="subdued" variant="bodySm">{s.key}</Text>
                          </BlockStack>

                          <InlineStack gap="200">
                            {s.meta && (
                              <Link to={`/app/sections?type=${s.meta.sectionType}`}>
                                <Button>Swap</Button>
                              </Link>
                            )}
                            {/* A section the merchant's own theme shipped is not
                                ours to remove — offering it invites breaking
                                their store from our UI. */}
                            {s.meta && (
                              <Button
                                tone="critical"
                                variant="tertiary"
                                loading={busy}
                                onClick={() =>
                                  fetcher.submit(
                                    { intent: "remove", file: page.file, key: s.key },
                                    { method: "post" }
                                  )
                                }
                              >
                                Remove
                              </Button>
                            )}
                          </InlineStack>
                        </InlineStack>
                      </Box>
                    ))
                  )}
                </BlockStack>
              </Card>
            ))}

            <Card>
              <BlockStack gap="300">
                <Text as="h3" variant="headingSm">Preview theme</Text>
                <Text as="p" tone="subdued" variant="bodySm">
                  Previews render in an unpublished copy of your live theme. Delete it when
                  you are finished so it does not sit in your theme list.
                </Text>
                <Box>
                  <Button
                    loading={busy}
                    onClick={() => fetcher.submit({ intent: "cleanup-preview" }, { method: "post" })}
                  >
                    Delete preview theme
                  </Button>
                </Box>
                {fetcher.data?.intent === "cleanup-preview" && (
                  <Text as="p" tone="subdued" variant="bodySm">
                    {fetcher.data.deleted ? "Deleted." : "There was no preview theme to delete."}
                  </Text>
                )}
              </BlockStack>
            </Card>

            {busy && (
              <InlineStack gap="200" blockAlign="center">
                <Spinner size="small" />
                <Text as="p" tone="subdued" variant="bodySm">Working…</Text>
              </InlineStack>
            )}

            <Text as="p" tone="subdued" variant="bodySm">{shopDomain}</Text>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
