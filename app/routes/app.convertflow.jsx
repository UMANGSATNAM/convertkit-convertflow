import { useState, useCallback, useEffect, useRef } from "react";
import {
  Page,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Select,
  Button,
  Badge,
  Banner,
  Spinner,
  Tabs,
  Box,
  Divider,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

// ── Loader: fetch shop domain, active theme ID, product handle ──
export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shopDomain = session.shop;
  let themeId = "";
  let productHandle = "";

  try {
    const themesRes = await admin.graphql(`
      query { themes(first: 10) { edges { node { id name role } } } }
    `);
    const themesData = await themesRes.json();
    const activeTheme = themesData.data.themes.edges.find(
      (e) => e.node.role === "MAIN"
    )?.node;
    themeId = activeTheme?.id?.replace("gid://shopify/OnlineStoreTheme/", "") || "";
  } catch (e) { /* silent */ }

  try {
    const productsRes = await admin.graphql(`
      query { products(first: 1, query: "status:active") { edges { node { handle } } } }
    `);
    const productsData = await productsRes.json();
    productHandle = productsData.data.products.edges[0]?.node?.handle || "";
  } catch (e) { /* silent */ }

  return json({ shopDomain, themeId, productHandle });
};

// ── Sections that need product context ──
const PRODUCT_CONTEXT_SECTIONS = [
  "inventory-scarcity", "star-rating-summary", "before-after-slider",
  "product-benefits-grid", "tabbed-product-info", "complementary-products",
  "size-guide",
];

function buildPreviewUrl(shopDomain, sectionName, themeId, productHandle) {
  if (!shopDomain || !sectionName) return "";
  const cleanName = sectionName.replace("sections/", "").replace(".liquid", "");
  const needsProduct = PRODUCT_CONTEXT_SECTIONS.some((s) => cleanName.includes(s));
  const base = `https://${shopDomain}`;
  const path = needsProduct && productHandle ? `/products/${productHandle}` : "/";
  const url = new URL(path, base);
  url.searchParams.set("section_id", cleanName);
  if (themeId) url.searchParams.set("preview_theme_id", themeId);
  url.searchParams.set("_ck_ts", Date.now().toString());
  return url.toString();
}

// ── Iframe with loading/timeout fallback ──
function PreviewIframe({ src, label, labelColor, style }) {
  const [status, setStatus] = useState("loading");
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!src || src === "pending") { setStatus("loading"); return; }
    setStatus("loading");
    const timer = setTimeout(() => setStatus((s) => s === "loading" ? "timeout" : s), 12000);
    return () => clearTimeout(timer);
  }, [src]);

  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      {/* Label bar */}
      <div style={{
        padding: "8px 14px", background: labelColor || "#374151",
        color: "#fff", fontSize: 12, fontWeight: 600,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0, borderRadius: "8px 8px 0 0",
      }}>
        <span>{label}</span>
        {src && src !== "pending" && (
          <a href={src} target="_blank" rel="noopener noreferrer"
            style={{ color: "#d1d5db", fontSize: 11, textDecoration: "none" }}>
            Open ↗
          </a>
        )}
      </div>
      {/* Content */}
      <div style={{
        flex: 1, position: "relative", background: "#f9fafb",
        borderRadius: "0 0 8px 8px", overflow: "hidden",
        minHeight: 200,
      }}>
        {(!src || src === "pending") && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: "100%", color: "#9ca3af", fontSize: 13, padding: 20,
            textAlign: "center",
          }}>
            {src === "pending"
              ? "Push code to theme to see preview"
              : "Select a section to preview"
            }
          </div>
        )}

        {src && src !== "pending" && (status === "error" || status === "timeout") && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100%", gap: 10,
            padding: 20, background: "#fef3c7",
          }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#92400e" }}>
              {status === "timeout" ? "Preview timed out" : "Could not load"}
            </p>
            <a href={src} target="_blank" rel="noopener noreferrer" style={{
              padding: "6px 14px", borderRadius: 6, background: "#92400e",
              color: "#fff", textDecoration: "none", fontSize: 12, fontWeight: 600,
            }}>
              Open in store →
            </a>
          </div>
        )}

        {src && src !== "pending" && status === "loading" && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "#f3f4f6", zIndex: 2,
          }}>
            <Spinner size="large" />
          </div>
        )}

        {src && src !== "pending" && (
          <iframe
            ref={iframeRef}
            src={src}
            title={label}
            style={{
              width: "100%", height: "100%", border: "none",
              display: status === "loaded" || status === "loading" ? "block" : "none",
            }}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
            sandbox="allow-scripts allow-same-origin"
          />
        )}
      </div>
    </div>
  );
}

export default function ConvertFlow() {
  const { shopDomain, themeId, productHandle } = useLoaderData();

  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingThemes, setLoadingThemes] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [pushSuccess, setPushSuccess] = useState(false);

  // Preview state
  const [beforeUrl, setBeforeUrl] = useState("");
  const [afterUrl, setAfterUrl] = useState("");
  const [previewMode, setPreviewMode] = useState("split"); // split | before | after
  const [previewViewport, setPreviewViewport] = useState("desktop");

  // Load themes
  const loadThemes = useCallback(async () => {
    setLoadingThemes(true);
    setError("");
    try {
      const res = await fetch("/api/convertflow-themes");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setThemes(data.themes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingThemes(false);
    }
  }, []);

  // Load sections for selected theme
  const loadSections = useCallback(async (tid) => {
    setSelectedTheme(tid);
    setSelectedSection("");
    setExtractionResult(null);
    setBeforeUrl("");
    setAfterUrl("");
    if (!tid) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/convertflow-themes?themeId=${tid}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSections(data.sections || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // When section is selected, immediately set BEFORE preview
  const handleSectionSelect = useCallback((sectionKey) => {
    setSelectedSection(sectionKey);
    setExtractionResult(null);
    setAfterUrl("");
    setPushSuccess(false);

    if (sectionKey && shopDomain) {
      const sectionName = sectionKey.replace("sections/", "").replace(".liquid", "");
      const url = buildPreviewUrl(shopDomain, sectionName, themeId || selectedTheme, productHandle);
      setBeforeUrl(url);
    } else {
      setBeforeUrl("");
    }
  }, [shopDomain, themeId, selectedTheme, productHandle]);

  // Extract section
  const extractSection = useCallback(async () => {
    if (!selectedTheme || !selectedSection) return;

    setLoading(true);
    setError("");
    setExtractionResult(null);
    setAfterUrl("");
    setPushSuccess(false);
    try {
      const res = await fetch("/api/convertflow-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeId: selectedTheme,
          sectionKey: selectedSection,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setExtractionResult(data.extraction);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedTheme, selectedSection]);

  // Push to theme and set AFTER preview
  const pushToTheme = useCallback(async () => {
    if (!extractionResult || !selectedTheme || !selectedSection) return;

    setPushing(true);
    setError("");
    try {
      const res = await fetch("/api/convertflow-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeId: selectedTheme,
          sectionKey: selectedSection,
          liquidCode: extractionResult.processedLiquid || extractionResult.rawLiquid,
          cssCode: extractionResult.processedCSS || extractionResult.rawCSS,
          schemaCode: extractionResult.processedSchema || extractionResult.rawSchema,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setPushSuccess(true);

      // Wait 2 seconds for Shopify to process, then set AFTER URL
      setTimeout(() => {
        const sectionName = selectedSection.replace("sections/", "").replace(".liquid", "");
        setAfterUrl(buildPreviewUrl(shopDomain, sectionName, themeId || selectedTheme, productHandle));
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setPushing(false);
    }
  }, [extractionResult, selectedTheme, selectedSection, shopDomain, themeId, productHandle]);

  // Save to library
  const saveToLibrary = useCallback(async () => {
    if (!extractionResult) return;
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/convertflow-library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: extractionResult.sectionName,
          description: `Extracted from ${extractionResult.sectionKey}`,
          tags: "extracted",
          liquidCode: extractionResult.processedLiquid,
          cssCode: extractionResult.processedCSS,
          schemaCode: extractionResult.processedSchema,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSaveSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  }, [extractionResult]);

  const themeOptions = [
    { label: "Select a theme...", value: "" },
    ...themes.map((t) => ({
      label: `${t.name} ${t.role === "main" ? "(Live)" : `(${t.role})`}`,
      value: String(t.id),
    })),
  ];

  const sectionOptions = [
    { label: "Select a section...", value: "" },
    ...sections.map((s) => ({ label: s.name, value: s.key })),
  ];

  const tabs = [
    { id: "liquid", content: "Liquid", panelID: "liquid" },
    { id: "css", content: "CSS", panelID: "css" },
    { id: "schema", content: "Schema", panelID: "schema" },
  ];

  const getTabContent = () => {
    if (!extractionResult) return "";
    switch (activeTab) {
      case 0: return extractionResult.processedLiquid || extractionResult.rawLiquid || "";
      case 1: return extractionResult.processedCSS || extractionResult.rawCSS || "";
      case 2: return extractionResult.processedSchema || extractionResult.rawSchema || "";
      default: return "";
    }
  };

  const iframeContainerWidth = previewViewport === "mobile" ? "390px" : "100%";

  return (
    <Page title="ConvertFlow" fullWidth>
      <TitleBar title="ConvertFlow — Liquid Extraction Engine" />
      <BlockStack gap="400">
        {error && (
          <Banner tone="critical" onDismiss={() => setError("")}>
            <Text as="p">{error}</Text>
          </Banner>
        )}
        {saveSuccess && (
          <Banner tone="success" onDismiss={() => setSaveSuccess(false)}>
            <Text as="p">Component saved to library.</Text>
          </Banner>
        )}

        {/* 3-column layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "22% 40% 38%",
          gap: "16px",
          minHeight: "calc(100vh - 200px)",
        }}>

          {/* ── Column 1: Section List (22%) ── */}
          <div style={{ overflow: "auto" }}>
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">Theme Explorer</Text>
                  <Badge tone="info">Pro</Badge>
                </InlineStack>
                <Divider />

                <Button onClick={loadThemes} loading={loadingThemes} variant="primary" fullWidth>
                  {themes.length > 0 ? "Refresh Themes" : "Load Themes"}
                </Button>

                {themes.length > 0 && (
                  <Select label="Theme" options={themeOptions} value={selectedTheme} onChange={loadSections} />
                )}

                {loading && !extractionResult && (
                  <Box padding="400">
                    <InlineStack align="center"><Spinner size="small" /></InlineStack>
                  </Box>
                )}

                {/* Section list */}
                {sections.length > 0 && (
                  <>
                    <Divider />
                    <Text as="p" variant="bodySm" tone="subdued">
                      {sections.length} sections found
                    </Text>
                    <div style={{ maxHeight: 500, overflowY: "auto" }}>
                      {sections.map((s) => (
                        <div
                          key={s.key}
                          onClick={() => handleSectionSelect(s.key)}
                          style={{
                            padding: "10px 12px",
                            cursor: "pointer",
                            borderRadius: 6,
                            marginBottom: 2,
                            background: selectedSection === s.key ? "#EEF2FF" : "transparent",
                            borderLeft: selectedSection === s.key ? "3px solid #4F46E5" : "3px solid transparent",
                            fontSize: 13,
                            fontWeight: selectedSection === s.key ? 600 : 400,
                            transition: "all 100ms",
                          }}
                        >
                          {s.name}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {selectedSection && (
                  <>
                    <Divider />
                    <Button onClick={extractSection} loading={loading} variant="primary" tone="success" fullWidth>
                      Extract Section
                    </Button>
                  </>
                )}
              </BlockStack>
            </Card>
          </div>

          {/* ── Column 2: Code Editor (40%) ── */}
          <div style={{ overflow: "auto" }}>
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">Extraction Result</Text>
                  {extractionResult && (
                    <InlineStack gap="200">
                      {extractionResult.themeCheckerPass ? (
                        <Badge tone="success">Passed</Badge>
                      ) : (
                        <Badge tone="warning">Warnings</Badge>
                      )}
                      <Button onClick={saveToLibrary} size="slim">Save to Library</Button>
                      <Button onClick={pushToTheme} loading={pushing} variant="primary" size="slim">
                        Push to Theme
                      </Button>
                    </InlineStack>
                  )}
                </InlineStack>

                {pushSuccess && (
                  <Banner tone="success" onDismiss={() => setPushSuccess(false)}>
                    <Text as="p">Pushed to theme. After preview loading…</Text>
                  </Banner>
                )}

                {loading && (
                  <Box padding="800">
                    <BlockStack gap="300" inlineAlign="center">
                      <Spinner size="large" />
                      <Text as="p" variant="bodyMd" tone="subdued">
                        Extracting and processing with AI…
                      </Text>
                    </BlockStack>
                  </Box>
                )}

                {!loading && !extractionResult && (
                  <Box padding="800">
                    <Text as="p" variant="bodyLg" tone="subdued" alignment="center">
                      Select a section and click Extract to get production-ready code.
                    </Text>
                  </Box>
                )}

                {!loading && extractionResult && (
                  <Tabs tabs={tabs} selected={activeTab} onSelect={setActiveTab}>
                    <Box padding="200">
                      <div style={{
                        background: "#1e1e2e", borderRadius: 8, padding: 16,
                        overflow: "auto", maxHeight: 500,
                      }}>
                        <pre style={{
                          color: "#cdd6f4",
                          fontFamily: "'Fira Code','Cascadia Code',monospace",
                          fontSize: 13, lineHeight: 1.6, margin: 0,
                          whiteSpace: "pre-wrap", wordBreak: "break-word",
                        }}>
                          {getTabContent() || "(empty)"}
                        </pre>
                      </div>
                    </Box>
                  </Tabs>
                )}
              </BlockStack>
            </Card>
          </div>

          {/* ── Column 3: Before/After Preview (38%) ── */}
          <div style={{
            display: "flex", flexDirection: "column", gap: 12,
            overflow: "hidden",
          }}>
            {/* Preview controls */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 12px", background: "#f3f4f6", borderRadius: 8,
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", gap: 4 }}>
                {["split", "before", "after"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPreviewMode(mode)}
                    style={{
                      padding: "4px 10px", border: "1px solid #d1d5db", borderRadius: 4,
                      background: previewMode === mode ? "#111827" : "#fff",
                      color: previewMode === mode ? "#fff" : "#374151",
                      fontSize: 11, fontWeight: 600, cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => setPreviewViewport("desktop")}
                  style={{
                    padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: 4,
                    background: previewViewport === "desktop" ? "#111827" : "#fff",
                    color: previewViewport === "desktop" ? "#fff" : "#374151",
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  🖥
                </button>
                <button
                  onClick={() => setPreviewViewport("mobile")}
                  style={{
                    padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: 4,
                    background: previewViewport === "mobile" ? "#111827" : "#fff",
                    color: previewViewport === "mobile" ? "#fff" : "#374151",
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  📱
                </button>
              </div>
            </div>

            {/* Preview iframes */}
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", gap: 8,
              overflow: "hidden",
            }}>
              {(previewMode === "split" || previewMode === "before") && (
                <div style={{
                  flex: 1, display: "flex", justifyContent: "center",
                  overflow: "hidden",
                }}>
                  <div style={{
                    width: iframeContainerWidth, maxWidth: "100%", height: "100%",
                    border: previewViewport === "mobile" ? "3px solid #1f2937" : "none",
                    borderRadius: previewViewport === "mobile" ? 16 : 0,
                    overflow: "hidden",
                  }}>
                    <PreviewIframe
                      src={beforeUrl}
                      label="BEFORE — Original theme code"
                      labelColor="#374151"
                      style={{ height: "100%" }}
                    />
                  </div>
                </div>
              )}

              {(previewMode === "split" || previewMode === "after") && (
                <div style={{
                  flex: 1, display: "flex", justifyContent: "center",
                  overflow: "hidden",
                }}>
                  <div style={{
                    width: iframeContainerWidth, maxWidth: "100%", height: "100%",
                    border: previewViewport === "mobile" ? "3px solid #1f2937" : "none",
                    borderRadius: previewViewport === "mobile" ? 16 : 0,
                    overflow: "hidden",
                  }}>
                    <PreviewIframe
                      src={afterUrl || (extractionResult ? "pending" : "")}
                      label="AFTER — ConvertFlow extracted code"
                      labelColor="#059669"
                      style={{ height: "100%" }}
                    />
                  </div>
                </div>
              )}

              {!beforeUrl && !afterUrl && (
                <div style={{
                  flex: 1, display: "flex", alignItems: "center",
                  justifyContent: "center", color: "#9ca3af", fontSize: 14,
                  background: "#f9fafb", borderRadius: 8,
                }}>
                  Select a section to see a live preview
                </div>
              )}
            </div>
          </div>
        </div>
      </BlockStack>
    </Page>
  );
}
