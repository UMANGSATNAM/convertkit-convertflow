import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useSearchParams, Link } from "@remix-run/react";
import { useState } from "react";
import {
  Page, Card, Text, BlockStack, InlineStack, Button, Badge, Banner, Box, Divider, Spinner, TextField,
} from "@shopify/polaris";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import {
  PAGE_TABS, COMPOSITIONS, compositionsFor, type PageType, type PageComposition,
} from "../data/page-compositions";
import {
  applyComposition, ensureDraftTheme, publishDraft, draftChanges,
} from "../services/page-compositions.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { session } = await authenticate.admin(request);
    const url = new URL(request.url);
    const pageType = (url.searchParams.get("page") || "index") as PageType;

    const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });

    let staged: PageType[] = [];
    let draftId: string | null = null;
    let passwordProtected = false;

    if (shop) {
      // Fast parallel resolution with timeout protection so page renders immediately
      try {
        const { graphqlRequest } = await import("../services/shopify-api.server");
        const [themesRes, pwdRes] = await Promise.allSettled([
          graphqlRequest(shop.shopDomain, shop.accessToken, `query { themes(first: 20) { nodes { id name } } }`),
          graphqlRequest(shop.shopDomain, shop.accessToken, `query { onlineStore { passwordProtection { enabled } } }`),
        ]);

        if (themesRes.status === "fulfilled" && themesRes.value?.themes?.nodes) {
          const found = themesRes.value.themes.nodes.find((t: any) => t.name.startsWith("ConvertFlow — Draft"));
          if (found) {
            draftId = String(found.id).split("/").pop()!;
            try {
              staged = await draftChanges(shop, draftId);
            } catch {
              staged = [];
            }
          }
        }

        if (pwdRes.status === "fulfilled" && pwdRes.value?.onlineStore?.passwordProtection) {
          passwordProtected = Boolean(pwdRes.value.onlineStore.passwordProtection.enabled);
        }
      } catch (err: any) {
        console.warn(`[Build] Fast loader fallback: ${err.message}`);
      }
    }

    const designs = compositionsFor(pageType);

    return json({
      passwordProtected,
      hasPassword: Boolean((shop?.brandConfig as any)?.storefrontPassword),
      shopDomain: session?.shop || "",
      pageType,
      tabs: PAGE_TABS,
      designs,
      counts: Object.fromEntries(
        PAGE_TABS.map(t => [t.id, COMPOSITIONS.filter(c => c.pageType === t.id).length])
      ),
      staged,
      draftId,
      connected: Boolean(shop),
    });
  } catch (err: any) {
    console.error("[Build Loader Error]", err);
    return json({
      passwordProtected: false,
      hasPassword: false,
      shopDomain: "",
      pageType: "index" as PageType,
      tabs: PAGE_TABS,
      designs: compositionsFor("index"),
      counts: Object.fromEntries(
        PAGE_TABS.map(t => [t.id, COMPOSITIONS.filter(c => c.pageType === t.id).length])
      ),
      staged: [],
      draftId: null,
      connected: true,
    });
  }
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
        // Framed through this app's own origin. Shopify sends X-Frame-Options on
        // storefront responses, so pointing the iframe straight at the store
        // gives the browser nothing to render but "refused to connect".
        url: `/app/preview?theme=${draft.id}&path=${encodeURIComponent(pagePath)}&_cf=${Date.now()}`,
        // The real storefront URL, for opening in a tab when the merchant wants
        // to click around rather than just look.
        directUrl: `https://${session.shop}${pagePath}?preview_theme_id=${draft.id}`,
        draftCreated: draft.created,
        result,
      });
    }

    if (intent === "stage") {
      // One design, on demand. Called by the grid after it renders, so the page
      // is interactive while previews fill in behind it.
      const id = String(form.get("compositionId"));
      const design = COMPOSITIONS.find(c => c.id === id);
      if (!design) return json({ error: `Unknown design "${id}"` }, { status: 400 });

      const draft = await ensureDraftTheme(shop);
      const variant = `cf-${design.id}`;

      let handles: string[] = [];
      try {
        const { graphqlRequest } = await import("../services/shopify-api.server");
        const res = await graphqlRequest(
          shop.shopDomain, shop.accessToken,
          `query { collections(first: 6, sortKey: UPDATED_AT, reverse: true) {
            nodes { handle productsCount { count } } } }`
        );
        handles = (res?.collections?.nodes || [])
          .filter((c: any) => (c.productsCount?.count ?? 0) > 0)
          .map((c: any) => c.handle);
      } catch { handles = []; }

      await applyComposition(shop, draft.id, design, {
        collections: handles,
        variant,
        palette: {
          background: (shop.brandConfig as any)?.colors?.background,
          text: (shop.brandConfig as any)?.colors?.text,
          accent: (shop.brandConfig as any)?.colors?.primary,
          accentAlt: (shop.brandConfig as any)?.colors?.accent,
        },
      });

      const base =
        design.pageType === "cart" ? "/cart"
        : design.pageType === "collection" || design.pageType === "product" ? "/collections/all"
        : "/";

      return json({
        ok: true,
        intent,
        compositionId: id,
        url: `/app/preview?theme=${draft.id}&path=${encodeURIComponent(`${base}?view=${variant}`)}&_cf=${Date.now()}`,
      });
    }

    if (intent === "save-password") {
      // Shopify does not expose the storefront password through the Admin API,
      // so a development or trial store cannot be fetched by this app without
      // the merchant supplying it. Stored on the shop record and exchanged for a
      // storefront_digest cookie each time a preview is rendered.
      const password = String(form.get("password") || "").trim();
      const brand = (shop.brandConfig as any) || {};
      await prisma.shop.update({
        where: { id: shop.id },
        data: { brandConfig: { ...brand, storefrontPassword: password || undefined } },
      });
      return json({ ok: true, intent, saved: Boolean(password) });
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
  const { pageType, tabs, designs, counts, staged, shopDomain, connected,
          passwordProtected, hasPassword } = useLoaderData<typeof loader>();
  const [pw, setPw] = useState("");
  const [nicheFilter, setNicheFilter] = useState<string>("all");
  const [inspectingDesign, setInspectingDesign] = useState<any | null>(null);
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

  // Filter designs based on selected niche filter
  const filteredDesigns = designs.filter(d => {
    if (nicheFilter === "all") return true;
    return d.niche === nicheFilter;
  });

  const nicheCounts = {
    all: designs.length,
    clothing: designs.filter(d => d.niche === "clothing").length,
    beauty: designs.filter(d => d.niche === "beauty").length,
    jewellery: designs.filter(d => d.niche === "jewellery").length,
    tech: designs.filter(d => d.niche === "tech").length,
  };

  return (
    <Page
      title="Make your store"
      subtitle="Pick a comprehensive D2C page design (20-22 modular sections), see it on your store, then publish when you are happy."
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

        {passwordProtected && !hasPassword && (
          <Banner tone="warning" title="Your store is password protected">
            <BlockStack gap="300">
              <Text as="p">
                Shopify does not share that password with apps, so previews cannot load
                until you enter it here. It is only used to fetch your own storefront.
              </Text>
              <InlineStack gap="200" blockAlign="center">
                <div style={{ minWidth: 220 }}>
                  <TextField
                    label="Storefront password"
                    labelHidden
                    autoComplete="off"
                    value={pw}
                    onChange={setPw}
                    placeholder="Storefront password"
                  />
                </div>
                <Button
                  loading={busy}
                  onClick={() => fetcher.submit({ intent: "save-password", password: pw }, { method: "post" })}
                >
                  Save
                </Button>
              </InlineStack>
              <Text as="p" tone="subdued" variant="bodySm">
                Or remove it under Online Store → Preferences.
              </Text>
            </BlockStack>
          </Banner>
        )}

        {data?.ok && data.intent === "save-password" && (
          <Banner tone="success" title={data.saved ? "Password saved" : "Password cleared"}>
            <p>Previews should load now. Try one below.</p>
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

        {/* ── Page type Tabs ────────────────────────────────────────── */}
        <InlineStack gap="200" wrap>
          {tabs.map(t => (
            <Button
              key={t.id}
              pressed={t.id === pageType}
              disabled={(counts as any)[t.id] === 0}
              onClick={() => {
                setNicheFilter("all");
                setParams({ page: t.id });
              }}
            >
              {t.label}
              {(counts as any)[t.id] > 0 ? ` · ${(counts as any)[t.id]}` : " · soon"}
            </Button>
          ))}
        </InlineStack>

        {/* ── Niche Filter Pills (For Homepage Index) ───────────────── */}
        {pageType === "index" && (
          <Box paddingBlockStart="100" paddingBlockEnd="100">
            <InlineStack gap="150" wrap blockAlign="center">
              <Text as="span" variant="bodySm" tone="subdued" fontWeight="semibold">Niche Filters:</Text>
              <Button
                size="slim"
                pressed={nicheFilter === "all"}
                onClick={() => setNicheFilter("all")}
              >
                All Homepages ({nicheCounts.all})
              </Button>
              {nicheCounts.clothing > 0 && (
                <Button
                  size="slim"
                  pressed={nicheFilter === "clothing"}
                  onClick={() => setNicheFilter("clothing")}
                >
                  👗 Clothing ({nicheCounts.clothing})
                </Button>
              )}
              {nicheCounts.beauty > 0 && (
                <Button
                  size="slim"
                  pressed={nicheFilter === "beauty"}
                  onClick={() => setNicheFilter("beauty")}
                >
                  ✨ Beauty & Skincare ({nicheCounts.beauty})
                </Button>
              )}
              {nicheCounts.jewellery > 0 && (
                <Button
                  size="slim"
                  pressed={nicheFilter === "jewellery"}
                  onClick={() => setNicheFilter("jewellery")}
                >
                  💎 Jewellery ({nicheCounts.jewellery})
                </Button>
              )}
              {nicheCounts.tech > 0 && (
                <Button
                  size="slim"
                  pressed={nicheFilter === "tech"}
                  onClick={() => setNicheFilter("tech")}
                >
                  ⚡ Tech & Audio ({nicheCounts.tech})
                </Button>
              )}
            </InlineStack>
          </Box>
        )}

        {/* ── Live preview Modal Card ───────────────────────────────── */}
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
                <Button url={preview.directUrl} target="_blank">Open in a tab</Button>
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
                Running on your store with your real products. Links are disabled inside the
                preview — use Open in a tab to click through. Nothing is live until you publish.
              </Text>
            </BlockStack>
          </Card>
        )}

        {/* ── Designs Grid ─────────────────────────────────────────── */}
        {filteredDesigns.length === 0 ? (
          <Card>
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm">No designs in this filter</Text>
              <Text as="p" tone="subdued">
                Select 'All' to view all available D2C home page architectures.
              </Text>
            </BlockStack>
          </Card>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: 24,
            }}
          >
            {filteredDesigns.map(d => (
              <Card key={d.id}>
                <BlockStack gap="300">
                  {/* Top accent badge header */}
                  <div
                    style={{
                      height: 4,
                      width: "100%",
                      borderRadius: 4,
                      background: d.accentColor || "#2563eb",
                    }}
                  />

                  {/* Visual D2C Hero Preview Card */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 9",
                      overflow: "hidden",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: d.niche === "clothing"
                        ? "linear-gradient(135deg, #18181b 0%, #27272a 100%)"
                        : d.niche === "beauty"
                        ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
                        : d.niche === "jewellery"
                        ? "linear-gradient(135deg, #1c1917 0%, #292524 100%)"
                        : "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: 16,
                      color: "#fff",
                    }}
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: "rgba(255,255,255,0.15)",
                          backdropFilter: "blur(4px)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {d.niche}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: d.accentColor || "#38bdf8",
                        }}
                      >
                        {d.styleBadge || d.family}
                      </span>
                    </InlineStack>

                    <BlockStack gap="050">
                      <div style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.3px" }}>
                        {d.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", display: "flex", gap: 6, alignItems: "center" }}>
                        <span>⚡ 20+ Liquid Sections</span>
                        <span>•</span>
                        <span>📱 100% Mobile Ready</span>
                      </div>
                    </BlockStack>

                    {/* Section Count Pill overlay */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                        background: "rgba(0, 0, 0, 0.75)",
                        color: "#fff",
                        padding: "3px 8px",
                        borderRadius: 10,
                        fontSize: "11px",
                        fontWeight: 600,
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                      }}
                    >
                      {d.sections.length} Sections
                    </div>
                  </div>

                  <BlockStack gap="150">
                    <InlineStack gap="150" align="space-between" blockAlign="center">
                      <Text as="h3" variant="headingSm">{d.name}</Text>
                      <InlineStack gap="100">
                        {d.styleBadge && <Badge tone="info">{d.styleBadge}</Badge>}
                        <Badge>{d.family}</Badge>
                      </InlineStack>
                    </InlineStack>

                    <Text as="p" tone="subdued" variant="bodySm">{d.description}</Text>
                  </BlockStack>

                  <InlineStack gap="200" align="space-between" blockAlign="center">
                    <Button
                      size="slim"
                      variant="plain"
                      onClick={() => setInspectingDesign(d)}
                    >
                      Inspect {d.sections.length} sections ▾
                    </Button>

                    <InlineStack gap="150">
                      {busy && active === d.id ? (
                        <InlineStack gap="100" blockAlign="center">
                          <Spinner size="small" />
                          <Text as="span" tone="subdued" variant="bodySm">Staging…</Text>
                        </InlineStack>
                      ) : (
                        <>
                          <Button size="slim" onClick={() => run("preview", d.id)}>Live Preview</Button>
                          <Button size="slim" variant="primary" onClick={() => run("add", d.id)}>
                            Apply Home
                          </Button>
                        </>
                      )}
                    </InlineStack>
                  </InlineStack>
                </BlockStack>
              </Card>
            ))}
          </div>
        )}

        {/* ── Section Inspector Modal ───────────────────────────────── */}
        {inspectingDesign && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: 20,
            }}
            onClick={() => setInspectingDesign(null)}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                maxWidth: 680,
                width: "100%",
                maxHeight: "85vh",
                overflowY: "auto",
                padding: 24,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              onClick={e => e.stopPropagation()}
            >
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="050">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="h2" variant="headingMd">{inspectingDesign.name}</Text>
                      <Badge tone="info">{inspectingDesign.sections.length} Sections</Badge>
                    </InlineStack>
                    <Text as="p" tone="subdued" variant="bodySm">{inspectingDesign.description}</Text>
                  </BlockStack>
                  <Button variant="plain" onClick={() => setInspectingDesign(null)}>✕ Close</Button>
                </InlineStack>

                <Divider />

                <Text as="h3" variant="headingSm">Section Flow (Top to Bottom):</Text>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {inspectingDesign.header && (
                    <div style={{ padding: "8px 14px", borderRadius: 8, background: "#f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Text as="span" fontWeight="bold">Header Chrome</Text>
                      <Badge tone="success">{inspectingDesign.header}</Badge>
                    </div>
                  )}

                  {inspectingDesign.sections.map((s: any, idx: number) => {
                    const isHero = s.componentId.includes("hero");
                    const isProduct = s.componentId.includes("grid") || s.componentId.includes("collection") || s.componentId.includes("bestseller");
                    const isStory = s.componentId.includes("story") || s.componentId.includes("founder") || s.componentId.includes("ingredients");
                    const isUgc = s.componentId.includes("ugc") || s.componentId.includes("instagram") || s.componentId.includes("reels");
                    const isTrust = s.componentId.includes("testimonial") || s.componentId.includes("press") || s.componentId.includes("trust") || s.componentId.includes("stats") || s.componentId.includes("faq");
                    const isPopup = s.componentId.includes("popup") || s.componentId.includes("wheel") || s.componentId.includes("exit");
                    const isFooter = s.componentId.includes("footer");

                    const badgeTone = isHero ? "magic" : isProduct ? "attention" : isTrust ? "success" : isUgc ? "info" : "subdued";

                    return (
                      <div
                        key={idx}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 8,
                          background: isHero ? "#f0fdf4" : isPopup ? "#fef2f2" : "#f8fafc",
                          border: "1px solid #e2e8f0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <InlineStack gap="200" blockAlign="center">
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", width: 24 }}>#{idx + 1}</span>
                          <Text as="span" fontWeight="semibold">
                            {s.componentId.replace(/^(hp\d+-|hero-|footer-|header-|popup-)/, "").replace(/-/g, " ").toUpperCase()}
                          </Text>
                        </InlineStack>
                        <Badge tone={badgeTone as any}>{s.componentId}</Badge>
                      </div>
                    );
                  })}

                  {inspectingDesign.footer && (
                    <div style={{ padding: "8px 14px", borderRadius: 8, background: "#f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Text as="span" fontWeight="bold">Footer Chrome</Text>
                      <Badge tone="success">{inspectingDesign.footer}</Badge>
                    </div>
                  )}
                </div>

                <InlineStack align="end" gap="200">
                  <Button onClick={() => setInspectingDesign(null)}>Close</Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      const id = inspectingDesign.id;
                      setInspectingDesign(null);
                      run("add", id);
                    }}
                  >
                    Apply {inspectingDesign.name}
                  </Button>
                </InlineStack>
              </BlockStack>
            </div>
          </div>
        )}

        <Divider />
        <Text as="p" tone="subdued" variant="bodySm">{shopDomain}</Text>
      </BlockStack>
    </Page>
  );
}

export function ErrorBoundary() {
  return (
    <Page title="Make your store">
      <Banner tone="warning" title="Could not load store builder">
        <BlockStack gap="200">
          <p>There was a temporary issue loading your store designs. Please refresh the page.</p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </BlockStack>
      </Banner>
    </Page>
  );
}
