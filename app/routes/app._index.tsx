import { useState } from "react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  InlineStack,
  Banner,
  Badge,
  Button,
  Divider,
  Modal,
  Box,
  ProgressBar,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { CONVERTFLOW_SECTIONS, type SectionDefinition } from "../lib/sections/registry";
import {
  getActiveTheme,
  checkInstalledSections,
  installSectionToTheme,
} from "../lib/sections/installer.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);

  const activeTheme = await getActiveTheme(admin, session);
  const themeId = activeTheme?.id || "";
  const themeName = activeTheme?.name || "Active Theme";

  let installedMap: Record<string, boolean> = {};
  if (themeId) {
    installedMap = await checkInstalledSections(admin, session, themeId);
  }

  return json({
    shop: session.shop,
    themeId,
    themeName,
    installedMap,
    editorUrl: themeId ? `https://${session.shop}/admin/themes/${themeId}/editor` : "",
    sections: CONVERTFLOW_SECTIONS.map((s) => ({
      id: s.id,
      slug: s.slug,
      filename: s.filename,
      title: s.title,
      tagline: s.tagline,
      category: s.category,
      cvrImpact: s.cvrImpact,
      badge: s.badge,
      description: s.description,
      features: s.features,
      previewHtml: s.previewHtml,
    })),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get("actionType")?.toString();
  const sectionId = formData.get("sectionId")?.toString();

  if (actionType === "installAll") {
    const results = [];
    for (const section of CONVERTFLOW_SECTIONS) {
      try {
        const res = await installSectionToTheme(admin, session, section.id);
        results.push(res);
      } catch (err: any) {
        results.push({
          success: false,
          sectionId: section.id,
          message: err.message,
        });
      }
    }
    const allSuccess = results.every((r) => r.success);
    return json({
      success: allSuccess,
      message: allSuccess
        ? "All 5 ConvertFlow sections successfully installed into your theme!"
        : "Sections installed with some notices.",
      installedAll: true,
    });
  }

  if (sectionId) {
    const result = await installSectionToTheme(admin, session, sectionId);
    return json(result);
  }

  return json({ success: false, message: "No action specified" });
};

export default function Index() {
  const { shop, themeId, themeName, editorUrl, sections, installedMap: initialInstalledMap } =
    useLoaderData<typeof loader>();

  const fetcher = useFetcher<any>();
  const [installedMap, setInstalledMap] = useState<Record<string, boolean>>(initialInstalledMap);
  const [previewSection, setPreviewSection] = useState<any | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "critical">("success");

  // Track installs dynamically from fetcher responses
  const isSubmitting = fetcher.state !== "idle";
  const submittingSectionId = fetcher.formData?.get("sectionId")?.toString();
  const isInstallingAll = fetcher.formData?.get("actionType")?.toString() === "installAll";

  // Handle fetcher action response
  if (fetcher.data && fetcher.state === "idle" && statusMessage !== fetcher.data.message) {
    if (fetcher.data.success) {
      setStatusMessage(fetcher.data.message);
      setStatusTone("success");
      if (fetcher.data.installedAll) {
        const updated: Record<string, boolean> = {};
        sections.forEach((s) => (updated[s.id] = true));
        setInstalledMap(updated);
      } else if (fetcher.data.sectionId) {
        setInstalledMap((prev) => ({ ...prev, [fetcher.data.sectionId]: true }));
      }
    } else if (fetcher.data.error || fetcher.data.message) {
      setStatusMessage(fetcher.data.error || fetcher.data.message);
      setStatusTone("critical");
    }
  }

  const installedCount = Object.values(installedMap).filter(Boolean).length;
  const progressPercent = Math.round((installedCount / sections.length) * 100);

  const handleInstallOne = (sectionId: string) => {
    fetcher.submit({ actionType: "installOne", sectionId }, { method: "post" });
  };

  const handleInstallAll = () => {
    fetcher.submit({ actionType: "installAll" }, { method: "post" });
  };

  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const constructIframeDoc = (html: string) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          margin: 0;
          padding: 20px 12px;
          background: #08090c;
          color: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
          -webkit-font-smoothing: antialiased;
          box-sizing: border-box;
        }
        * { box-sizing: border-box; }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `;

  return (
    <Page fullWidth>
      <TitleBar title="ConvertFlow • Section Library" />

      <BlockStack gap="500">
        {/* Status Feedback Banner */}
        {statusMessage && (
          <Banner
            title={statusTone === "success" ? "Installation Successful" : "Installation Notice"}
            tone={statusTone}
            onDismiss={() => setStatusMessage(null)}
          >
            <p>{statusMessage}</p>
            {editorUrl && statusTone === "success" && (
              <Box paddingBlockStart="200">
                <Button
                  url={editorUrl}
                  target="_blank"
                  variant="primary"
                  tone="success"
                  size="slim"
                >
                  Open in Shopify Theme Customizer →
                </Button>
              </Box>
            )}
          </Banner>
        )}

        {/* Hero Header Card */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <BlockStack gap="100">
                <InlineStack gap="200" blockAlign="center">
                  <Text as="h1" variant="headingLg">
                    ConvertFlow
                  </Text>
                  <Badge tone="success">Conversion Engine v1.0</Badge>
                </InlineStack>
                <Text as="p" variant="bodyMd" tone="subdued">
                  6 high-converting, battle-tested Shopify Theme 2.0 sections with real live Iframe preview and zero code bloat.
                </Text>
              </BlockStack>

              <InlineStack gap="300">
                {editorUrl && (
                  <Button url={editorUrl} target="_blank" variant="secondary">
                    Open Theme Editor
                  </Button>
                )}
                <Button
                  variant="primary"
                  tone="success"
                  loading={isInstallingAll && isSubmitting}
                  onClick={handleInstallAll}
                >
                  ⚡ Install All Sections
                </Button>
              </InlineStack>
            </InlineStack>

            <Divider />

            {/* Active Theme Integration Stats Bar */}
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="400">
                <div>
                  <Text as="span" variant="bodySm" tone="subdued">
                    Connected Store:
                  </Text>{" "}
                  <Text as="strong" variant="bodySm">
                    {shop}
                  </Text>
                </div>
                <div>
                  <Text as="span" variant="bodySm" tone="subdued">
                    Active Theme:
                  </Text>{" "}
                  <Badge tone="info">{themeName}</Badge>
                </div>
                <div>
                  <Text as="span" variant="bodySm" tone="subdued">
                    Installed in Theme:
                  </Text>{" "}
                  <Text as="strong" variant="bodySm">
                    {installedCount} of {sections.length} Ready
                  </Text>
                </div>
              </InlineStack>

              <Box minWidth="160px">
                <ProgressBar progress={progressPercent} tone="success" size="small" />
              </Box>
            </InlineStack>
          </BlockStack>
        </Card>

        {/* Section Cards Grid */}
        <Layout>
          {sections.map((section) => {
            const isInstalled = !!installedMap[section.id];
            const isInstallingThis = isSubmitting && submittingSectionId === section.id;

            return (
              <Layout.Section key={section.id}>
                <Card>
                  <BlockStack gap="400">
                    <InlineStack align="space-between" blockAlign="start">
                      <BlockStack gap="100">
                        <InlineStack gap="200" blockAlign="center">
                          <Text as="h2" variant="headingMd">
                            {section.title}
                          </Text>
                          <Badge tone="attention">{section.badge}</Badge>
                          <Badge tone="success">{section.cvrImpact}</Badge>
                        </InlineStack>
                        <Text as="p" variant="bodySm" tone="subdued">
                          {section.tagline}
                        </Text>
                      </BlockStack>

                      {isInstalled ? (
                        <Badge tone="success">✓ Installed on {themeName}</Badge>
                      ) : (
                        <Badge tone="subdued">Available to Install</Badge>
                      )}
                    </InlineStack>

                    <Text as="p" variant="bodyMd">
                      {section.description}
                    </Text>

                    {/* Features List */}
                    <Box background="bg-surface-secondary" padding="300" borderRadius="200">
                      <BlockStack gap="100">
                        <Text as="p" variant="headingXs" tone="subdued">
                          KEY ARCHITECTURAL HIGHLIGHTS:
                        </Text>
                        <InlineStack gap="300" wrap>
                          {section.features.map((feature: string, idx: number) => (
                            <Text key={idx} as="span" variant="bodySm">
                              • {feature}
                            </Text>
                          ))}
                        </InlineStack>
                      </BlockStack>
                    </Box>

                    <Divider />

                    <InlineStack align="space-between" blockAlign="center">
                      <InlineStack gap="200">
                        <Text as="span" variant="bodySm" tone="subdued">
                          Target File:
                        </Text>
                        <code>sections/{section.filename}</code>
                      </InlineStack>

                      <InlineStack gap="200">
                        <Button
                          variant="secondary"
                          size="slim"
                          onClick={() => {
                            setPreviewDevice("desktop");
                            setPreviewSection(section);
                          }}
                        >
                          👁️ Live Iframe Preview
                        </Button>

                        <Button
                          variant="primary"
                          tone={isInstalled ? "secondary" : "success"}
                          size="slim"
                          loading={isInstallingThis}
                          onClick={() => handleInstallOne(section.id)}
                        >
                          {isInstalled ? "🔄 Reinstall / Update" : "⚡ 1-Click Install to Theme"}
                        </Button>

                        {isInstalled && editorUrl && (
                          <Button
                            url={editorUrl}
                            target="_blank"
                            variant="plain"
                            size="slim"
                          >
                            Customize in Theme →
                          </Button>
                        )}
                      </InlineStack>
                    </InlineStack>
                  </BlockStack>
                </Card>
              </Layout.Section>
            );
          })}
        </Layout>
      </BlockStack>

      {/* Live Sandboxed Iframe Preview Modal */}
      {previewSection && (
        <Modal
          large
          open={Boolean(previewSection)}
          onClose={() => setPreviewSection(null)}
          title={`Live Iframe Preview: ${previewSection.title}`}
          primaryAction={{
            content: installedMap[previewSection.id] ? "Reinstall / Update" : "⚡ Install to Theme Now",
            onAction: () => {
              handleInstallOne(previewSection.id);
              setPreviewSection(null);
            },
          }}
          secondaryActions={[
            {
              content: "Close Preview",
              onAction: () => setPreviewSection(null),
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="400">
              {/* Header meta and device breakpoint toggles */}
              <InlineStack align="space-between" blockAlign="center">
                <Text as="p" variant="bodySm" tone="subdued">
                  Category: <strong>{previewSection.category}</strong> • Expected Impact:{" "}
                  <strong>{previewSection.cvrImpact}</strong>
                </Text>

                {/* Device Switcher Toolbar */}
                <div style={{ display: "inline-flex", background: "#1e2530", borderRadius: "6px", padding: "3px", gap: "4px" }}>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    style={{
                      background: previewDevice === "desktop" ? "#10b981" : "transparent",
                      color: previewDevice === "desktop" ? "#021a10" : "#94a3b8",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    🖥️ Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("tablet")}
                    style={{
                      background: previewDevice === "tablet" ? "#10b981" : "transparent",
                      color: previewDevice === "tablet" ? "#021a10" : "#94a3b8",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    📱 Tablet (768px)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    style={{
                      background: previewDevice === "mobile" ? "#10b981" : "transparent",
                      color: previewDevice === "mobile" ? "#021a10" : "#94a3b8",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    📲 Mobile (375px)
                  </button>
                </div>
              </InlineStack>

              {/* Sandboxed Iframe Container */}
              <div
                style={{
                  background: "#030406",
                  borderRadius: "8px",
                  border: "1px solid #1e2530",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  minHeight: "560px",
                  overflowX: "auto"
                }}
              >
                <div
                  style={{
                    width: previewDevice === "desktop" ? "100%" : previewDevice === "tablet" ? "768px" : "375px",
                    maxWidth: "100%",
                    transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: previewDevice !== "desktop" ? "2px solid #334155" : "none",
                    boxShadow: previewDevice !== "desktop" ? "0 20px 40px rgba(0,0,0,0.8)" : "none"
                  }}
                >
                  <iframe
                    title="Live Section Sandbox"
                    srcDoc={constructIframeDoc(previewSection.previewHtml)}
                    style={{
                      width: "100%",
                      height: "560px",
                      border: "none",
                      display: "block",
                      background: "#08090c"
                    }}
                    sandbox="allow-scripts"
                  />
                </div>
              </div>

              <Banner tone="info">
                <p>
                  This is a live, sandboxed rendering. When installed into your theme, you can customize all content, colors, and layout directly inside Shopify&apos;s native Theme Customizer under <strong>&quot;Add section&quot;</strong>.
                </p>
              </Banner>
            </BlockStack>
          </Modal.Section>
        </Modal>
      )}
    </Page>
  );
}
