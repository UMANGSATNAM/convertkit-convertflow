import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import {
  Page, Card, Text, BlockStack, InlineStack, Button, Badge, Banner, Box, Divider, Spinner,
} from "@shopify/polaris";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import {
  compositionsFor, applyComposition, ensureDraftTheme, publishDraft, draftChanges,
  COMPOSITIONS, type PageType,
} from "../services/page-compositions.server";

/**
 * Pick a whole page design, see it running on your store, add it, publish.
 *
 * Everything lands in an unpublished draft first. A merchant can add a home
 * page, then a product page, look at all of it against their real catalogue, and
 * only Publish makes any of it visible to shoppers. That is the difference
 * between a tool you can experiment with and one you have to be brave to open.
 */

const PAGE_TABS: Array<{ id: PageType; label: string }> = [
  { id: "index", label: "Home page" },
  { id: "product", label: "Product page" },
  { id: "collection", label: "Collection page" },
  { id: "cart", label: "Cart page" },
  { id: "cart-drawer", label: "Cart drawer" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const pageType = (url.searchParams.get("page") || "index") as PageType;

  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });

  let staged: PageType[] = [];
  let draftId: string | null = null;
  if (shop) {
    try {
      // Only report the draft if it already exists — creating one just to render
      // this page would duplicate a theme for a merchant who is only looking.
      const res = await import("../services/shopify-api.server").then(m =>
        m.graphqlRequest(shop.shopDomain, shop.accessToken, `query { themes(first: 50) { nodes { id name } } }`)
      );
      const found = (res?.themes?.nodes || []).find((t: any) => t.name.startsWith("ConvertFlow — Draft"));
      if (found) {
        draftId = String(found.id).split("/").pop()!;
        staged = await draftChanges(shop, draftId);
      }
    } catch (err: any) {
      console.warn(`[Build] Could not read draft state: ${err.message}`);
    }
  }

  return json({
    shopDomain: session.shop,
    pageType,
    tabs: PAGE_TABS,
    designs: compositionsFor(pageType),
    counts: Object.fromEntries(
      PAGE_TABS.map(t => [t.id, COMPOSITIONS.filter(c => c.pageType === t.id).length])
    ),
    staged,
    draftId,
    connected: Boolean(shop),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent"));

  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) return json({ error: "This store is not connected yet." }, { status: 400 });

  try {
    if (intent === "preview" || intent === "add") {
      const id = String(form.get("compositionId"));
      const design = COMPOSITIONS.find(c => c.id === id);
      if (!design) return json({ error: `Unknown design "${id}"` }, { status: 400 });

      const draft = await ensureDraftTheme(shop);

      // Real collections so the grids show the merchant's own products rather
      // than an empty placeholder branch.
      let handles: string[] = [];
      try {
        const { graphqlRequest } = await import("../services/shopify-api.server");
        const res = await graphqlRequest(
          shop.shopDomain,
          shop.accessToken,
          `query { collections(first: 6, sortKey: UPDATED_AT, reverse: true) {
            nodes { handle productsCount { count } } } }`
        );
        handles = (res?.collections?.nodes || [])
          .filter((c: any) => (c.productsCount?.count ?? 0) > 0)
          .map((c: any) => c.handle);
      } catch {
        handles = [];
      }

      const result = await applyComposition(shop, draft.id, design, {
        collections: handles,
        palette: {
          background: (shop.brandConfig as any)?.colors?.background,
          text: (shop.brandConfig as any)?.colors?.text,
          accent: (shop.brandConfig as any)?.colors?.primary,
          accentAlt: (shop.brandConfig as any)?.colors?.accent,
        },
      });

      const pagePath =
        design.pageType === "product" ? "/collections/all"
        : design.pageType === "collection" ? "/collections/all"
        : design.pageType === "cart" ? "/cart"
        : "/";

      return json({
        ok: true,
        intent,
        compositionId: id,
        name: design.name,
        // Cache-busting so the iframe reloads after a re-apply rather than
        // showing the previous design from cache.
        url: `https://${session.shop}${pagePath}?preview_theme_id=${draft.id}&_cf=${Date.now()}`,
        draftCreated: draft.created,
        result,
      });
    }

    if (intent === "publish") {
      const draft = await ensureDraftTheme(shop);
      const theme = await publishDraft(shop, draft.id);
      return json({ ok: true, intent, theme });
    }

    return json({ error: `Unknown intent "${intent}"` }, { status: 400 });
  } catch (err: any) {
    console.error(`[Build] ${intent} failed:`, err);
    return json({ error: err.message || String(err) }, { status: 500 });
  }
};

export default function Build() {
  const { pageType, tabs, designs, counts, staged, shopDomain, connected } =
    useLoaderData<typeof loader>();
  const [, setParams] = useSearchParams();
  const fetcher = useFetcher<any>();
  const [active, setActive] = useState<string | null>(null);

  const busy = fetcher.state !== "idle";
  const data = fetcher.data;
  const preview = data?.ok && (data.intent === "preview" || data.intent === "add") ? data : null;
  const published = data?.ok && data.intent === "publish";

  const run = (intent: string, compositionId: string) => {
    setActive(compositionId);
    fetcher.submit({ intent, compositionId }, { method: "post" });
  };

  return (
    <Page
      title="Make your store"
      subtitle="Pick a page design, see it on your store, then publish when you are happy."
      backAction={{ content: "Home", url: "/app" }}
      primaryAction={
        staged.length > 0
          ? {
              content: `Publish ${staged.length} page${staged.length === 1 ? "" : "s"}`,
              loading: busy,
              onAction: () => fetcher.submit({ intent: "publish" }, { method: "post" }),
            }
          : undefined
      }
    >
      <BlockStack gap="400">
        {!connected && (
          <Banner tone="warning" title="Finishing setup">
            <p>This store is still being connected. Reload in a moment.</p>
          </Banner>
        )}

        {data?.error && (
          <Banner tone="critical" title="That did not work">
            <p>{data.error}</p>
          </Banner>
        )}

        {published && (
          <Banner tone="success" title="Published">
            <p>Your new pages are live. Your previous theme is still in your theme list if you want it back.</p>
          </Banner>
        )}

        {staged.length > 0 && !published && (
          <Banner tone="info" title={`${staged.length} page${staged.length === 1 ? "" : "s"} waiting to publish`}>
            <p>
              {staged.join(", ")} — staged in an unpublished draft. Nothing your shoppers see
              has changed yet.
            </p>
          </Banner>
        )}

        {preview?.result?.missingFiles?.length > 0 && (
          <Banner tone="warning" title="Some files are missing">
            <p>
              {preview.result.missingFiles.slice(0, 4).join(", ")} — parts of this design may
              not render.
            </p>
          </Banner>
        )}

        {/* ── Page type ─────────────────────────────────────────────── */}
        <InlineStack gap="200" wrap>
          {tabs.map(t => (
            <Button
              key={t.id}
              pressed={t.id === pageType}
              disabled={(counts as any)[t.id] === 0}
              onClick={() => setParams({ page: t.id })}
            >
              {t.label}
              {(counts as any)[t.id] > 0 ? ` · ${(counts as any)[t.id]}` : " · soon"}
            </Button>
          ))}
        </InlineStack>

        {/* ── Live preview ──────────────────────────────────────────── */}
        {preview && (
          <Card>
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center" gap="300">
                <BlockStack gap="050">
                  <Text as="h2" variant="headingMd">{preview.name}</Text>
                  <Text as="p" tone="subdued" variant="bodySm">
                    {preview.result.sectionsWritten} sections ·{" "}
                    {preview.result.collectionsWired} wired to your collections ·{" "}
                    {preview.result.paletteApplied} colours matched
                  </Text>
                </BlockStack>
                {preview.intent === "preview" && (
                  <Button
                    variant="primary"
                    loading={busy}
                    onClick={() => run("add", preview.compositionId)}
                  >
                    Add this page
                  </Button>
                )}
                {preview.intent === "add" && <Badge tone="success">Added to draft</Badge>}
              </InlineStack>

              <Box borderColor="border" borderWidth="025" borderRadius="200" overflowX="hidden">
                <iframe
                  key={preview.url}
                  title={`Preview of ${preview.name}`}
                  src={preview.url}
                  style={{ width: "100%", height: 700, border: 0, display: "block" }}
                />
              </Box>

              <Text as="p" tone="subdued" variant="bodySm">
                Running on your store with your real products. Nothing is live until you publish.
              </Text>
            </BlockStack>
          </Card>
        )}

        {/* ── Designs ───────────────────────────────────────────────── */}
        {designs.length === 0 ? (
          <Card>
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm">Nothing here yet</Text>
              <Text as="p" tone="subdued">
                Designs for this page are being built. Home page designs are ready now.
              </Text>
            </BlockStack>
          </Card>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {designs.map(d => (
              <Card key={d.id}>
                <BlockStack gap="300">
                  <BlockStack gap="100">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="h3" variant="headingSm">{d.name}</Text>
                      <Badge>{d.family}</Badge>
                    </InlineStack>
                    <Text as="p" tone="subdued" variant="bodySm">{d.description}</Text>
                    <Text as="p" tone="subdued" variant="bodySm">
                      {d.sections.length} sections
                    </Text>
                  </BlockStack>
                  <InlineStack gap="200">
                    {busy && active === d.id ? (
                      <InlineStack gap="150" blockAlign="center">
                        <Spinner size="small" />
                        <Text as="span" tone="subdued" variant="bodySm">Building preview…</Text>
                      </InlineStack>
                    ) : (
                      <>
                        <Button onClick={() => run("preview", d.id)}>Preview</Button>
                        <Button variant="primary" onClick={() => run("add", d.id)}>
                          Add this page
                        </Button>
                      </>
                    )}
                  </InlineStack>
                </BlockStack>
              </Card>
            ))}
          </div>
        )}

        <Divider />
        <Text as="p" tone="subdued" variant="bodySm">{shopDomain}</Text>
      </BlockStack>
    </Page>
  );
}
