import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  Page, Card, Text, BlockStack, InlineStack, Button, Badge, Banner, Box,
} from "@shopify/polaris";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import { graphqlRequest } from "../services/shopify-api.server";

/**
 * Home. Greeting, a showcase, and one way forward.
 *
 * The previous version was a dashboard — health score, features enabled, recent
 * AI actions, an upsell — none of which told a merchant what to do next. This
 * puts a single button on the screen and shows what the app can produce.
 */

/**
 * Greeting for the merchant's local time.
 *
 * The server runs in UTC, so deriving this on the server would greet a merchant
 * in Mumbai with "Good evening" at lunchtime. The hour is read in the browser
 * and the greeting starts blank rather than wrong.
 */
const GREETING_SCRIPT = `
  (function () {
    var el = document.getElementById('cf-greeting');
    if (!el) return;
    var h = new Date().getHours();
    var word = h < 5 ? 'Good night'
             : h < 12 ? 'Good morning'
             : h < 17 ? 'Good afternoon'
             : h < 21 ? 'Good evening'
             : 'Good night';
    el.textContent = word + (el.dataset.name ? ', ' + el.dataset.name : '');
  })();
`;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });

  let shopName = session.shop.replace(".myshopify.com", "");
  let themeName: string | null = null;
  let productCount = 0;

  if (shop) {
    // Read live rather than trusting stored flags: a merchant can change their
    // theme or delete products outside the app, and a status card that lies is
    // worse than none.
    try {
      const res = await graphqlRequest(
        shop.shopDomain,
        shop.accessToken,
        `query {
          shop { name }
          themes(first: 20) { nodes { name role } }
          productsCount { count }
        }`
      );
      shopName = res?.shop?.name || shopName;
      const live = (res?.themes?.nodes || []).find((t: any) => String(t.role).toLowerCase() === "main");
      themeName = live?.name || null;
      productCount = res?.productsCount?.count ?? 0;
    } catch (err: any) {
      console.warn(`[Home] Could not read store state: ${err.message}`);
    }
  }

  let sectionsAdded = 0;
  try {
    if (shop) sectionsAdded = await prisma.installedSection.count({ where: { shopId: shop.id } });
  } catch {
    sectionsAdded = 0;
  }

  // Counts for the showcase, read from the registry so the numbers are real.
  const byType = await prisma.componentRegistry.groupBy({
    by: ["sectionType"],
    where: { status: "PUBLISHED" },
    _count: { sectionType: true },
  });
  const counts: Record<string, number> = {};
  for (const row of byType) counts[row.sectionType] = row._count.sectionType;

  return json({
    connected: Boolean(shop),
    shopDomain: session.shop,
    shopName,
    themeName,
    productCount,
    sectionsAdded,
    counts,
    totalDesigns: Object.values(counts).reduce((a, b) => a + b, 0),
  });
};

/** The showcase tiles. Sized so the grid reads as a composition, not a table. */
const TILES = [
  { key: "hero", label: "Hero banners", span: "span 2", rows: "span 2", tone: "dark" },
  { key: "product-grid", label: "Product grids", span: "span 2", rows: "span 1", tone: "light" },
  { key: "header", label: "Headers", span: "span 1", rows: "span 1", tone: "light" },
  { key: "announcement", label: "Announcement bars", span: "span 1", rows: "span 1", tone: "accent" },
  { key: "testimonials", label: "Testimonials", span: "span 2", rows: "span 1", tone: "light" },
  { key: "footer", label: "Footers", span: "span 1", rows: "span 1", tone: "light" },
  { key: "faq", label: "FAQ", span: "span 1", rows: "span 1", tone: "light" },
];

export default function Home() {
  const {
    connected, shopName, themeName, productCount, sectionsAdded, counts, totalDesigns, shopDomain,
  } = useLoaderData<typeof loader>();

  return (
    <Page>
      <BlockStack gap="500">
        {!connected && (
          <Banner tone="warning" title="Finishing setup">
            <p>This store is still being connected. Reload in a moment.</p>
          </Banner>
        )}

        {/* ── Greeting ─────────────────────────────────────────────────── */}
        <BlockStack gap="150">
          <Text as="h1" variant="heading2xl">
            <span id="cf-greeting" data-name={shopName}>Welcome</span>
          </Text>
          <Text as="p" tone="subdued">
            {sectionsAdded > 0
              ? `You have added ${sectionsAdded} section${sectionsAdded === 1 ? "" : "s"} so far.`
              : `${totalDesigns.toLocaleString()} designs ready to drop into your store.`}
          </Text>
        </BlockStack>
        <script dangerouslySetInnerHTML={{ __html: GREETING_SCRIPT }} />

        {/* ── Showcase ─────────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridAutoRows: "112px",
            gap: 12,
          }}
        >
          {TILES.map(t => {
            const n = counts[t.key] || 0;
            const bg =
              t.tone === "dark" ? "#1a1a1a" : t.tone === "accent" ? "#2b2b2b" : "#f6f6f7";
            const fg = t.tone === "light" ? "#1a1a1a" : "#ffffff";
            return (
              <Link
                key={t.key}
                to={`/app/sections?type=${t.key}`}
                style={{ gridColumn: t.span, gridRow: t.rows, textDecoration: "none" }}
              >
                <div
                  style={{
                    height: "100%",
                    background: bg,
                    color: fg,
                    borderRadius: 12,
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: t.tone === "light" ? "1px solid #e3e3e3" : "none",
                  }}
                >
                  <span style={{ fontSize: 13, opacity: 0.72 }}>{t.label}</span>
                  <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>
                    {n}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── The one action ───────────────────────────────────────────── */}
        <Card>
          <BlockStack gap="400">
            <BlockStack gap="150">
              <Text as="h2" variant="headingLg">Build your store</Text>
              <Text as="p" tone="subdued">
                Select 100X CRO High-Converting Templates for Home, Product, Collection, Landing & Cart Pages.
              </Text>
            </BlockStack>
            <Box>
              <Link to="/app/build-store" style={{ textDecoration: "none" }}>
                <Button variant="primary" size="large">Build your store</Button>
              </Link>
            </Box>
          </BlockStack>
        </Card>

        {/* ── Context, deliberately last ───────────────────────────────── */}
        <Card>
          <BlockStack gap="200">
            <Text as="h3" variant="headingSm">Your store</Text>
            <InlineStack gap="600" wrap>
              <BlockStack gap="050">
                <Text as="p" tone="subdued" variant="bodySm">Live theme</Text>
                <Text as="p" variant="bodyMd">{themeName || "—"}</Text>
              </BlockStack>
              <BlockStack gap="050">
                <Text as="p" tone="subdued" variant="bodySm">Products</Text>
                <InlineStack gap="150" blockAlign="center">
                  <Text as="p" variant="bodyMd">{productCount}</Text>
                  {productCount === 0 && <Badge tone="attention">Add products first</Badge>}
                </InlineStack>
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
    </Page>
  );
}
