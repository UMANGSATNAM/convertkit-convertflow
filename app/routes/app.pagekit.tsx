import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useSearchParams } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Page, Card, Text, BlockStack, InlineStack, Button, Badge, Banner, Box, Spinner, Tabs, Modal,
} from "@shopify/polaris";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import { PAGES, PAGE_TYPES, pageById, type PageType } from "../pagekit/pages";
import {
  applyToLiveTheme, stagePreview, restoreBackup, liveThemeId,
} from "../pagekit/apply.server";
import { verifyPage, describeVerification } from "../pagekit/verify.server";

/**
 * PageKit — whole pages, applied to the live theme.
 *
 * ## Why this screen exists separately
 *
 * The older builder staged designs onto a draft theme and asked the merchant to
 * publish afterwards, and it skipped any section it could not find. Those two
 * behaviours together produced the failure that has come up repeatedly: a design
 * "applied", and the store showed a header, a footer and nothing between them.
 *
 * Here, Apply writes to the published theme, so what the merchant sees in the
 * grid is the store a minute later. That makes two things non-negotiable, and
 * both are implemented rather than promised:
 *
 *   1. A page whose sections cannot all be resolved is refused before anything
 *      is written. Partial pages are the bug.
 *   2. Everything an apply overwrites is copied into the theme first, so Undo
 *      is a real button and not an instruction to restore from a backup that
 *      may never have been taken.
 *
 * ## Previews
 *
 * Previews fill the grid on their own — no button. Each design is staged as an
 * alternate template (`?view=pk-<id>`), which is invisible to shoppers, then
 * framed through this app's own origin because Shopify sends `X-Frame-Options`
 * on storefront responses and a direct iframe shows "refused to connect".
 *
 * Staging is sequential and starts after the page loads. Doing it in the loader
 * is what made the previous screen appear not to open at all: a hundred-odd
 * theme writes inside a loader exceeds the request budget, and the merchant sees
 * a blank tab with no error.
 */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });

  // One cheap call. Everything heavier happens in the action.
  let themeId: string | null = null;
  let themeError: string | null = null;
  if (shop) {
    try {
      themeId = await liveThemeId(shop);
    } catch (err: any) {
      themeError = err.message;
    }
  }

  return json({
    pages: PAGES,
    pageTypes: PAGE_TYPES,
    shopDomain: session.shop,
    connected: Boolean(shop),
    themeId,
    themeError,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "");
  const pageId = String(form.get("pageId") || "");

  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) {
    return json({ intent, pageId, ok: false, error: "This store is not connected yet. Reinstall the app." });
  }

  try {
    if (intent === "stage") {
      const page = pageById(pageId);
      if (!page) return json({ intent, pageId, ok: false, error: `No design called "${pageId}".` });

      const result = await stagePreview(shop, page);
      if (!result.ok) return json({ intent, pageId, ok: false, error: result.error });

      return json({
        intent, pageId, ok: true,
        themeId: result.themeId,
        previewPath: result.previewPath,
      });
    }

    if (intent === "apply") {
      const page = pageById(pageId);
      if (!page) return json({ intent, pageId, ok: false, error: `No design called "${pageId}".` });

      const result = await applyToLiveTheme(shop, page);
      if (!result.ok) {
        return json({ intent, pageId, ok: false, error: result.error });
      }

      // Read the page back and report what actually rendered. Every structural
      // check in this project has passed at least once while the page was
      // blank; this is the only check that can tell.
      const storefrontPassword = (shop.brandConfig as any)?.storefrontPassword;
      const path = new URL(result.storefrontUrl).pathname;
      const verification = await verifyPage(shop.shopDomain, {
        path,
        expect: result.sectionKeys.map(k => ({ key: k, type: k.replace(/^\d+-/, "") })),
        storefrontPassword,
      });

      return json({
        intent, pageId, ok: true,
        sectionCount: result.sectionKeys.length,
        backedUp: result.backedUp,
        collectionsWired: result.collectionsWired,
        storefrontUrl: result.storefrontUrl,
        missingPartials: result.missingPartials ?? null,
        verification: {
          ok: verification.ok,
          message: describeVerification(verification),
          passwordProtected: verification.passwordProtected,
          rendered: verification.sections.filter(s => s.rendered).length,
          total: verification.sections.length,
        },
      });
    }

    if (intent === "undo") {
      const themeId = await liveThemeId(shop);
      const result = await restoreBackup(shop, themeId);
      return json({
        intent, pageId, ok: result.ok,
        error: result.error,
        restored: result.restored,
        takenAt: result.takenAt ?? null,
      });
    }

    return json({ intent, pageId, ok: false, error: `Unknown action "${intent}".` });
  } catch (err: any) {
    return json({ intent, pageId, ok: false, error: err.message || String(err) });
  }
};

// ─────────────────────────────────────────────────────────────────────────

interface PreviewState {
  status: "waiting" | "staging" | "ready" | "failed";
  /** Proxied through this app, because a storefront cannot be framed directly. */
  src?: string;
  /** The same page on the real storefront, for opening in a new tab. */
  href?: string;
  error?: string;
}

export default function PageKit() {
  const { pages, pageTypes, shopDomain, connected, themeId, themeError } =
    useLoaderData<typeof loader>();

  const [params, setParams] = useSearchParams();
  const activeType = (params.get("type") || "index") as PageType;
  const tabIndex = Math.max(0, pageTypes.findIndex(t => t.id === activeType));

  const visible = pages.filter(p => p.pageType === activeType);

  const [previews, setPreviews] = useState<Record<string, PreviewState>>({});
  const [applied, setApplied] = useState<any | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  const stager = useFetcher<any>();
  const applier = useFetcher<any>();
  const undoer = useFetcher<any>();

  // ── Previews fill themselves in ──────────────────────────────────────
  // One at a time. Staging writes theme files, and a dozen of those at once
  // gets rate limited, which would leave most of the grid empty.
  const queue = useRef<string[]>([]);
  const busy = useRef(false);

  const pump = useCallback(() => {
    if (busy.current) return;
    const next = queue.current.shift();
    if (!next) return;
    busy.current = true;
    setPreviews(p => ({ ...p, [next]: { status: "staging" } }));
    stager.submit({ intent: "stage", pageId: next }, { method: "post" });
  }, [stager]);

  useEffect(() => {
    queue.current = visible.filter(p => !previews[p.id]).map(p => p.id);
    pump();
    // Re-queues when the tab changes. previews is deliberately not a dependency:
    // it changes on every response and would rebuild the queue mid-flight.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType]);

  useEffect(() => {
    if (stager.state !== "idle" || !stager.data) return;
    const d = stager.data;
    if (d.intent !== "stage") return;

    setPreviews(p => ({
      ...p,
      [d.pageId]: d.ok
        ? {
            status: "ready",
            src: `/app/preview?theme=${encodeURIComponent(d.themeId)}&path=${encodeURIComponent(d.previewPath)}`,
            href: `https://${shopDomain}${d.previewPath}`,
          }
        : { status: "failed", error: d.error },
    }));

    busy.current = false;
    pump();
  }, [stager.state, stager.data, pump, shopDomain]);

  useEffect(() => {
    if (applier.state === "idle" && applier.data?.intent === "apply") {
      setApplied(applier.data);
      setConfirming(null);
    }
  }, [applier.state, applier.data]);

  const applyingId =
    applier.state !== "idle" ? String(applier.formData?.get("pageId") || "") : "";

  if (!connected) {
    return (
      <Page title="Build your store">
        <Banner tone="critical" title="This store is not connected">
          <p>Reinstall the app from your Shopify admin and this screen will work.</p>
        </Banner>
      </Page>
    );
  }

  return (
    <Page
      title="Build your store"
      subtitle="Pick a page. Apply puts it on your live theme straight away."
    >
      <BlockStack gap="400">
        {themeError && (
          <Banner tone="critical" title="Could not read your theme">
            <p>{themeError}</p>
          </Banner>
        )}

        {applied && (
          <Banner
            tone={applied.ok && applied.verification?.ok ? "success" : applied.ok ? "warning" : "critical"}
            title={
              !applied.ok
                ? "Nothing was applied"
                : applied.verification?.ok
                ? "Applied and live"
                : "Applied, but the page did not fully render"
            }
            onDismiss={() => setApplied(null)}
          >
            <BlockStack gap="200">
              <Text as="p" variant="bodyMd">
                {applied.ok ? applied.verification?.message : applied.error}
              </Text>

              {applied.ok && applied.verification?.passwordProtected && (
                <Text as="p" variant="bodySm" tone="subdued">
                  Your storefront is password protected, so the page could not be read back to
                  check it. The design was still written to your theme. Add the password in
                  Settings to have this verified automatically.
                </Text>
              )}

              {applied.ok && applied.missingPartials?.length > 0 && (
                <Text as="p" variant="bodySm" tone="subdued">
                  {applied.missingPartials.length} snippet(s) these sections use are not in the
                  library: {applied.missingPartials.join(", ")}. Those parts of the page will be
                  blank.
                </Text>
              )}

              <InlineStack gap="200">
                {applied.ok && (
                  <Button url={applied.storefrontUrl} target="_blank" variant="primary">
                    View your store
                  </Button>
                )}
                {applied.ok && (
                  <Button
                    loading={undoer.state !== "idle"}
                    onClick={() =>
                      undoer.submit({ intent: "undo", pageId: applied.pageId }, { method: "post" })
                    }
                  >
                    Undo
                  </Button>
                )}
              </InlineStack>

              {undoer.state === "idle" && undoer.data?.intent === "undo" && (
                <Text as="p" variant="bodySm" tone={undoer.data.ok ? "success" : "critical"}>
                  {undoer.data.ok
                    ? `Restored ${undoer.data.restored.length} file(s) from the copy taken before you applied.`
                    : undoer.data.error}
                </Text>
              )}
            </BlockStack>
          </Banner>
        )}

        <Card padding="0">
          <Tabs
            selected={tabIndex}
            onSelect={i => setParams({ type: pageTypes[i].id }, { preventScrollReset: true })}
            tabs={pageTypes.map(t => ({
              id: t.id,
              content: `${t.label} (${pages.filter(p => p.pageType === t.id).length})`,
            }))}
          >
            <Box padding="400">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "16px",
                }}
              >
                {visible.map(page => {
                  const preview = previews[page.id] || { status: "waiting" as const };
                  const isApplying = applyingId === page.id;

                  return (
                    <Card key={page.id} padding="0">
                      <BlockStack gap="0">
                        {/* Preview. Fixed aspect so the grid does not jump as
                            each frame loads. */}
                        <div
                          style={{
                            position: "relative",
                            aspectRatio: "3 / 4",
                            overflow: "hidden",
                            background: "#f6f6f7",
                            borderBottom: "1px solid #e3e3e3",
                          }}
                        >
                          {preview.status === "ready" ? (
                            <iframe
                              title={page.name}
                              src={preview.src}
                              loading="lazy"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "1280px",
                                height: "1707px",
                                border: 0,
                                // Scaled so a desktop-width page fits the card.
                                transform: "scale(0.234)",
                                transformOrigin: "top left",
                                pointerEvents: "none",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                                padding: "16px",
                                textAlign: "center",
                              }}
                            >
                              {preview.status === "failed" ? (
                                <Text as="p" variant="bodySm" tone="critical">
                                  {preview.error || "This preview could not be built."}
                                </Text>
                              ) : (
                                <>
                                  <Spinner size="small" />
                                  <Text as="p" variant="bodySm" tone="subdued">
                                    {preview.status === "staging"
                                      ? "Building preview…"
                                      : "Queued"}
                                  </Text>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        <Box padding="300">
                          <BlockStack gap="200">
                            <InlineStack align="space-between" blockAlign="center" wrap={false}>
                              <Text as="h3" variant="headingSm">{page.name}</Text>
                              <Badge>{page.niche}</Badge>
                            </InlineStack>

                            <Text as="p" variant="bodySm" tone="subdued">
                              {page.description}
                            </Text>

                            <Text as="p" variant="bodySm" tone="subdued">
                              {page.sections.length} section{page.sections.length === 1 ? "" : "s"}
                            </Text>

                            <InlineStack gap="200">
                              <Button
                                variant="primary"
                                loading={isApplying}
                                disabled={applier.state !== "idle" && !isApplying}
                                onClick={() => setConfirming(page.id)}
                              >
                                Apply
                              </Button>
                              {preview.status === "ready" && preview.href && (
                                <Button url={preview.href} target="_blank">
                                  Open full size
                                </Button>
                              )}
                            </InlineStack>
                          </BlockStack>
                        </Box>
                      </BlockStack>
                    </Card>
                  );
                })}
              </div>
            </Box>
          </Tabs>
        </Card>

        <Text as="p" variant="bodySm" tone="subdued">
          Applying writes to your published theme{themeId ? ` (${themeId})` : ""}. A copy of every
          file it replaces is saved to the theme first, so Undo puts your previous page back.
        </Text>
      </BlockStack>

      <Modal
        open={Boolean(confirming)}
        onClose={() => setConfirming(null)}
        title={
          confirming
            ? `Apply "${pages.find(p => p.id === confirming)?.name}" to your live store?`
            : ""
        }
        primaryAction={{
          content: "Apply now",
          loading: applier.state !== "idle",
          onAction: () => {
            if (confirming) {
              applier.submit({ intent: "apply", pageId: confirming }, { method: "post" });
            }
          },
        }}
        secondaryActions={[{ content: "Cancel", onAction: () => setConfirming(null) }]}
      >
        <Modal.Section>
          <BlockStack gap="200">
            <Text as="p" variant="bodyMd">
              This replaces your current{" "}
              {pageTypes.find(t => t.id === activeType)?.label.toLowerCase()} page on the theme
              shoppers are seeing. It takes effect immediately.
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Your existing page is copied into the theme first. Undo appears straight after and
              puts it back.
            </Text>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
