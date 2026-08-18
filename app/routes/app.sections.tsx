import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import {
  Page, Layout, Card, Button, Text, BlockStack, InlineStack, Badge,
  Banner, Select, Spinner, Box, Divider,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { installSection, describeSection } from "../services/section-install.server";
import { ensurePreviewTheme, previewUrl } from "../services/preview-theme.server";

/**
 * Section browser: pick a section, see it with your own products, install it.
 *
 * The generator builds a whole store in one pass, which means it has to get
 * everything right first time and gives a merchant no way to change one band
 * they dislike. This is the other half of the product — and it is what makes the
 * generator's mistakes survivable, because any section it chose can be swapped
 * here.
 *
 * Previews render in an unpublished duplicate of the live theme, so a merchant
 * judges a section against their real catalogue without shoppers seeing the
 * experiment.
 */

const BROWSABLE_TYPES = [
  { label: "Headers", value: "header", page: "/" },
  { label: "Announcement bars", value: "announcement", page: "/" },
  { label: "Heroes", value: "hero", page: "/" },
  { label: "Footers", value: "footer", page: "/" },
  { label: "Product grids", value: "product-grid", page: "/" },
  { label: "Testimonials", value: "testimonials", page: "/" },
  { label: "FAQ", value: "faq", page: "/" },
  { label: "Newsletter", value: "newsletter", page: "/" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "header";

  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });

  const components = await prisma.componentRegistry.findMany({
    where: { sectionType: type, status: "production" },
    orderBy: { componentId: "asc" },
    take: 60,
  });

  // The schema tells the merchant what they will be able to change. Reading it
  // here keeps that promise honest — it comes from the section itself, not from
  // a hand-maintained description that can drift.
  const described = await Promise.all(
    components.map(async (c: any) => ({
      componentId: c.componentId,
      family: c.family,
      visualStyle: c.visualStyle,
      liquidPath: c.liquidPath,
      sectionType: c.sectionType,
      detail: await describeSection(c.liquidPath),
    }))
  );

  return json({
    shopDomain: session.shop,
    type,
    types: BROWSABLE_TYPES,
    components: described,
    hasShop: Boolean(shop),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent"));

  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) return json({ error: "This store is not connected yet." }, { status: 400 });

  try {
    if (intent === "preview") {
      const componentId = String(form.get("componentId"));
      const liquidPath = String(form.get("liquidPath"));
      const sectionType = String(form.get("sectionType"));

      const theme = await ensurePreviewTheme(shop);

      // Headers and footers replace their counterpart rather than stacking, so a
      // preview never shows a page with two headers.
      const target =
        sectionType === "header" || sectionType === "footer"
          ? ({ kind: "group", group: sectionType, replace: sectionType } as const)
          : ({ kind: "template", template: "index", position: "top" } as const);

      const result = await installSection(
        shop,
        theme.id,
        { componentId, liquidPath, sectionType },
        target,
        {
          palette: {
            background: (shop.brandConfig as any)?.colors?.background,
            text: (shop.brandConfig as any)?.colors?.text,
            accent: (shop.brandConfig as any)?.colors?.primary,
            accentAlt: (shop.brandConfig as any)?.colors?.accent,
          },
        }
      );

      return json({
        ok: true,
        intent,
        componentId,
        url: previewUrl(session.shop, theme.id, "/"),
        themeCreated: theme.created,
        missing: result.missing,
      });
    }

    if (intent === "install") {
      const componentId = String(form.get("componentId"));
      const liquidPath = String(form.get("liquidPath"));
      const sectionType = String(form.get("sectionType"));

      const target =
        sectionType === "header" || sectionType === "footer"
          ? ({ kind: "group", group: sectionType, replace: sectionType } as const)
          : ({ kind: "template", template: "index", position: "top" } as const);

      // "active" resolves to the published theme inside the theme-engine helper.
      const result = await installSection(
        shop,
        "active",
        { componentId, liquidPath, sectionType },
        target,
        {
          palette: {
            background: (shop.brandConfig as any)?.colors?.background,
            text: (shop.brandConfig as any)?.colors?.text,
            accent: (shop.brandConfig as any)?.colors?.primary,
            accentAlt: (shop.brandConfig as any)?.colors?.accent,
          },
        }
      );

      return json({ ok: true, intent, componentId, result });
    }

    return json({ error: `Unknown intent "${intent}"` }, { status: 400 });
  } catch (err: any) {
    console.error(`[Sections] ${intent} failed:`, err);
    return json({ error: err.message || String(err) }, { status: 500 });
  }
}

export default function SectionBrowser() {
  const { type, types, components, shopDomain } = useLoaderData<typeof loader>();
  const [, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<any>();
  const [selected, setSelected] = useState<string | null>(null);

  const busy = fetcher.state !== "idle";
  const data = fetcher.data;
  const previewing = data?.ok && data.intent === "preview" ? data : null;
  const installed = data?.ok && data.intent === "install" ? data : null;

  const submit = (intent: string, c: any) => {
    setSelected(c.componentId);
    fetcher.submit(
      {
        intent,
        componentId: c.componentId,
        liquidPath: c.liquidPath,
        sectionType: c.sectionType || type,
      },
      { method: "post" }
    );
  };

  return (
    <Page
      title="Sections"
      subtitle="Preview a section with your own products, then add it to your theme."
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {data?.error && (
              <Banner tone="critical" title="That did not work">
                <p>{data.error}</p>
              </Banner>
            )}

            {previewing?.themeCreated && (
              <Banner tone="info" title="Preview theme created">
                <p>
                  Previews render in an unpublished copy of your live theme, so nothing
                  your shoppers see changes until you choose Add to theme.
                </p>
              </Banner>
            )}

            {previewing?.missing?.length > 0 && (
              <Banner tone="warning" title="This section is missing some files">
                <p>
                  {previewing.missing.length} file(s) it needs are not in the library, so
                  parts of it may not render: {previewing.missing.slice(0, 3).join(", ")}
                </p>
              </Banner>
            )}

            {installed && (
              <Banner tone="success" title="Added to your live theme">
                <p>
                  {installed.componentId} is now on {installed.result.target}. It was
                  written with {installed.result.paletteApplied} colour settings matched to
                  your store.
                </p>
              </Banner>
            )}

            <Card>
              <BlockStack gap="300">
                <Select
                  label="Section type"
                  options={types.map(t => ({ label: t.label, value: t.value }))}
                  value={type}
                  onChange={v => setSearchParams({ type: v })}
                />
                <Text as="p" tone="subdued">
                  {components.length} designs available
                </Text>
              </BlockStack>
            </Card>

            {previewing && (
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="h2" variant="headingMd">
                      Preview — {previewing.componentId}
                    </Text>
                    <Button
                      variant="primary"
                      loading={busy}
                      onClick={() => {
                        const c = components.find(x => x.componentId === previewing.componentId);
                        if (c) submit("install", c);
                      }}
                    >
                      Add to theme
                    </Button>
                  </InlineStack>
                  <Box borderColor="border" borderWidth="025" borderRadius="200" overflowX="hidden">
                    <iframe
                      title={`Preview of ${previewing.componentId}`}
                      src={previewing.url}
                      style={{ width: "100%", height: 620, border: 0, display: "block" }}
                    />
                  </Box>
                  <Text as="p" tone="subdued">
                    Rendered on your store with your real products. Nothing is live yet.
                  </Text>
                </BlockStack>
              </Card>
            )}

            <BlockStack gap="300">
              {components.map(c => (
                <Card key={c.componentId}>
                  <InlineStack align="space-between" blockAlign="start" gap="400">
                    <BlockStack gap="150">
                      <InlineStack gap="200" blockAlign="center">
                        <Text as="h3" variant="headingSm">
                          {c.detail?.name || c.componentId}
                        </Text>
                        {c.family && <Badge>{c.family}</Badge>}
                        {c.detail && !c.detail.hasPreset && (
                          <Badge tone="attention">No preset</Badge>
                        )}
                      </InlineStack>
                      <Text as="p" tone="subdued">
                        {c.componentId}
                        {c.detail ? ` · ${c.detail.settings.length} editable settings` : ""}
                      </Text>
                    </BlockStack>
                    <InlineStack gap="200">
                      {busy && selected === c.componentId ? (
                        <Spinner size="small" />
                      ) : (
                        <Button onClick={() => submit("preview", c)}>Preview</Button>
                      )}
                    </InlineStack>
                  </InlineStack>
                </Card>
              ))}
            </BlockStack>

            {components.length === 0 && (
              <Card>
                <Text as="p" tone="subdued">
                  No sections of this type are marked production-ready yet.
                </Text>
              </Card>
            )}

            <Divider />
            <Text as="p" tone="subdued">
              Previewing on {shopDomain}
            </Text>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
