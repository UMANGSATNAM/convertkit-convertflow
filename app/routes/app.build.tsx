import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useFetcher, useSearchParams } from "@remix-run/react";
import {
  Page, Card, Text, BlockStack, InlineStack, Button, Badge, Banner, Box, Divider, Spinner,
} from "@shopify/polaris";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import { readFile } from "../services/theme-engine/index";

/**
 * The build flow: choose a starting point, then choose what to change.
 *
 * Step one is a real fork, not a formality. Installing our base theme replaces
 * the whole storefront; keeping the merchant's theme and swapping sections into
 * it does not. Merchants with an established store will not accept the first,
 * and merchants starting out get a better result from it, so both have to be
 * offered plainly and the consequence of each stated.
 */

/** Pages a merchant thinks in terms of, and where their sections live. */
const PAGES = [
  { id: "index", label: "Home page", file: "templates/index.json", blurb: "Hero, product grids, story, reviews" },
  { id: "product", label: "Product page", file: "templates/product.json", blurb: "Gallery, buy box, related products" },
  { id: "collection", label: "Collection page", file: "templates/collection.json", blurb: "Banner, filters, product grid" },
  { id: "cart", label: "Cart page", file: "templates/cart.json", blurb: "Line items, totals, upsells" },
  { id: "header", label: "Header", file: "sections/header-group.json", blurb: "Logo, menu, search, cart" },
  { id: "footer", label: "Footer", file: "sections/footer-group.json", blurb: "Menus, newsletter, payment icons" },
];

/** Section types a merchant can add, grouped so the list is scannable. */
const SECTION_GROUPS = [
  {
    title: "Store chrome",
    types: [
      { key: "header", label: "Headers" },
      { key: "footer", label: "Footers" },
      { key: "announcement", label: "Announcement bars" },
      { key: "cart-drawer", label: "Cart drawers" },
    ],
  },
  {
    title: "Selling",
    types: [
      { key: "hero", label: "Hero banners" },
      { key: "product-grid", label: "Product grids" },
      { key: "collection", label: "Collection showcases" },
      { key: "product-page", label: "Product page layouts" },
      { key: "collection-page", label: "Collection page layouts" },
      { key: "bundle-builder", label: "Bundles" },
    ],
  },
  {
    title: "Persuasion",
    types: [
      { key: "trust", label: "Trust & USP bars" },
      { key: "testimonials", label: "Testimonials" },
      { key: "ugc", label: "Instagram & UGC" },
      { key: "brand-story", label: "Brand story" },
      { key: "faq", label: "FAQ" },
      { key: "newsletter", label: "Newsletter" },
      { key: "popup", label: "Popups" },
    ],
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const step = url.searchParams.get("step") || "start";
  const page = url.searchParams.get("page");

  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });

  // How many designs exist per type, so a merchant is never sent to an empty list.
  const rows = await prisma.componentRegistry.groupBy({
    by: ["sectionType"],
    where: { status: "PUBLISHED" },
    _count: { sectionType: true },
  });
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.sectionType] = r._count.sectionType;

  // On the page step, read what is actually on that page right now.
  let current: Array<{ key: string; type: string; known: boolean }> = [];
  if (step === "page" && page && shop) {
    const spec = PAGES.find(p => p.id === page);
    if (spec) {
      try {
        const raw = await readFile(shop, "active", spec.file);
        const doc = JSON.parse(raw || "{}");
        const order: string[] = Array.isArray(doc.order) ? doc.order : Object.keys(doc.sections || {});
        const types = order.map(k => ({ key: k, type: doc.sections?.[k]?.type })).filter(s => s.type);

        const known = await prisma.componentRegistry.findMany({
          where: { componentId: { in: types.map(t => t.type!) } },
          select: { componentId: true },
        });
        const knownSet = new Set(known.map(k => k.componentId));
        current = types.map(t => ({ key: t.key, type: t.type!, known: knownSet.has(t.type!) }));
      } catch {
        current = [];
      }
    }
  }

  return json({
    step,
    page,
    pages: PAGES,
    groups: SECTION_GROUPS,
    counts,
    current,
    connected: Boolean(shop),
    shopDomain: session.shop,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent"));

  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) return json({ error: "This store is not connected yet." }, { status: 400 });

  if (intent === "install-base") {
    // Deliberately not implemented inline. Installing a whole theme is a long
    // job that belongs on the queue, and pretending otherwise here would leave a
    // merchant on a spinner with no way to tell whether it worked.
    return json({
      error:
        "Base theme install runs as a background job. Use Generate for now — this button is wired next.",
    });
  }

  return json({ error: `Unknown intent "${intent}"` }, { status: 400 });
};

export default function Build() {
  const { step, page, pages, groups, counts, current, shopDomain } = useLoaderData<typeof loader>();
  const [, setParams] = useSearchParams();
  const fetcher = useFetcher<any>();
  const busy = fetcher.state !== "idle";

  const go = (next: Record<string, string>) => setParams(next);

  // ── Step 1: where to start ──────────────────────────────────────────
  if (step === "start") {
    return (
      <Page
        title="Make your store"
        subtitle="Two ways in. Both let you swap any section afterwards."
        backAction={{ content: "Home", url: "/app" }}
      >
        <BlockStack gap="400">
          {fetcher.data?.error && (
            <Banner tone="warning" title="Not ready yet">
              <p>{fetcher.data.error}</p>
            </Banner>
          )}

          <Card>
            <BlockStack gap="300">
              <InlineStack gap="200" blockAlign="center">
                <Text as="h2" variant="headingMd">Install our base theme</Text>
                <Badge tone="info">Best for a new store</Badge>
              </InlineStack>
              <Text as="p" tone="subdued">
                A complete theme with every page built — home, product, collection, cart,
                search and the customer pages. This replaces your storefront, so it suits a
                store that has not been designed yet.
              </Text>
              <Box>
                <Button
                  variant="primary"
                  loading={busy}
                  onClick={() => fetcher.submit({ intent: "install-base" }, { method: "post" })}
                >
                  Install base theme
                </Button>
              </Box>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="300">
              <InlineStack gap="200" blockAlign="center">
                <Text as="h2" variant="headingMd">Keep your current theme</Text>
                <Badge>Nothing is replaced</Badge>
              </InlineStack>
              <Text as="p" tone="subdued">
                Your theme stays exactly as it is. You pick a page, see what is on it, and
                swap individual sections for ones you like better. Everything you preview
                runs in an unpublished copy first.
              </Text>
              <Box>
                <Button variant="primary" onClick={() => go({ step: "pages" })}>
                  Continue with my theme
                </Button>
              </Box>
            </BlockStack>
          </Card>
        </BlockStack>
      </Page>
    );
  }

  // ── Step 2: which page ──────────────────────────────────────────────
  if (step === "pages") {
    return (
      <Page
        title="What do you want to change?"
        backAction={{ content: "Back", onAction: () => go({ step: "start" }) }}
      >
        <BlockStack gap="400">
          <Card>
            <BlockStack gap="300">
              <Text as="h3" variant="headingSm">Pages</Text>
              {pages.map((p, i) => (
                <Box key={p.id}>
                  {i > 0 && <Box paddingBlockEnd="300"><Divider /></Box>}
                  <InlineStack align="space-between" blockAlign="center" gap="400">
                    <BlockStack gap="050">
                      <Text as="p" variant="bodyMd" fontWeight="medium">{p.label}</Text>
                      <Text as="p" tone="subdued" variant="bodySm">{p.blurb}</Text>
                    </BlockStack>
                    <Button onClick={() => go({ step: "page", page: p.id })}>Open</Button>
                  </InlineStack>
                </Box>
              ))}
            </BlockStack>
          </Card>

          {groups.map(g => (
            <Card key={g.title}>
              <BlockStack gap="300">
                <Text as="h3" variant="headingSm">{g.title}</Text>
                <InlineStack gap="200" wrap>
                  {g.types.map(t => {
                    const n = counts[t.key] || 0;
                    if (n === 0) return null;
                    return (
                      <Link key={t.key} to={`/app/sections?type=${t.key}`}>
                        <Button>
                          {t.label} · {n}
                        </Button>
                      </Link>
                    );
                  })}
                </InlineStack>
              </BlockStack>
            </Card>
          ))}

          <Text as="p" tone="subdued" variant="bodySm">{shopDomain}</Text>
        </BlockStack>
      </Page>
    );
  }

  // ── Step 3: what is on this page ────────────────────────────────────
  const spec = pages.find(p => p.id === page);
  return (
    <Page
      title={spec?.label || "Page"}
      subtitle="What is on this page right now. Swap anything that came from the library."
      backAction={{ content: "Back", onAction: () => go({ step: "pages" }) }}
    >
      <BlockStack gap="400">
        {current.length === 0 && (
          <Card>
            <Text as="p" tone="subdued">
              Nothing readable on this page yet, or your theme stores it differently.
            </Text>
          </Card>
        )}

        {current.map((s, i) => (
          <Card key={s.key}>
            <InlineStack align="space-between" blockAlign="center" gap="400">
              <BlockStack gap="050">
                <InlineStack gap="200" blockAlign="center">
                  <Text as="p" variant="bodyMd">{s.type}</Text>
                  {!s.known && <Badge tone="attention">Your theme's own</Badge>}
                </InlineStack>
                <Text as="p" tone="subdued" variant="bodySm">
                  Position {i + 1} · {s.key}
                </Text>
              </BlockStack>
              <Link
                to={`/app/sections?swapFile=${encodeURIComponent(spec?.file || "")}&swapKey=${encodeURIComponent(s.key)}&current=${encodeURIComponent(s.type)}`}
              >
                <Button variant="primary">Swap this</Button>
              </Link>
            </InlineStack>
          </Card>
        ))}

        {busy && (
          <InlineStack gap="200" blockAlign="center">
            <Spinner size="small" />
            <Text as="p" tone="subdued" variant="bodySm">Working…</Text>
          </InlineStack>
        )}
      </BlockStack>
    </Page>
  );
}
