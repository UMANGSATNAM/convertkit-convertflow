import { useState, useCallback } from "react";
import {
  Page,
  Layout,
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
  ResourceList,
  ResourceItem,
  Divider,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({});
};

export default function ConvertFlow() {
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
  const loadSections = useCallback(async (themeId) => {
    setSelectedTheme(themeId);
    setSelectedSection("");
    setExtractionResult(null);
    if (!themeId) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/convertflow-themes?themeId=${themeId}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSections(data.sections || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Extract section
  const extractSection = useCallback(async () => {
    if (!selectedTheme || !selectedSection) return;

    setLoading(true);
    setError("");
    setExtractionResult(null);
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
    ...sections.map((s) => ({
      label: s.name,
      value: s.key,
    })),
  ];

  const tabs = [
    { id: "liquid", content: "Liquid", panelID: "liquid-panel" },
    { id: "css", content: "CSS", panelID: "css-panel" },
    { id: "schema", content: "Schema", panelID: "schema-panel" },
  ];

  const getTabContent = () => {
    if (!extractionResult) return "";
    switch (activeTab) {
      case 0:
        return extractionResult.processedLiquid || extractionResult.rawLiquid || "";
      case 1:
        return extractionResult.processedCSS || extractionResult.rawCSS || "";
      case 2:
        return extractionResult.processedSchema || extractionResult.rawSchema || "";
      default:
        return "";
    }
  };

  return (
    <Page title="ConvertFlow">
      <TitleBar title="ConvertFlow - Liquid Extraction Engine" />
      <BlockStack gap="500">
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

        <Layout>
          {/* Controls Panel */}
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    Theme Explorer
                  </Text>
                  <Badge tone="info">Pro</Badge>
                </InlineStack>

                <Divider />

                <Button
                  onClick={loadThemes}
                  loading={loadingThemes}
                  variant="primary"
                  fullWidth
                >
                  {themes.length > 0 ? "Refresh Themes" : "Load Themes"}
                </Button>

                {themes.length > 0 && (
                  <Select
                    label="Theme"
                    options={themeOptions}
                    value={selectedTheme}
                    onChange={loadSections}
                  />
                )}

                {sections.length > 0 && (
                  <Select
                    label="Section"
                    options={sectionOptions}
                    value={selectedSection}
                    onChange={setSelectedSection}
                  />
                )}

                {selectedSection && (
                  <Button
                    onClick={extractSection}
                    loading={loading}
                    variant="primary"
                    tone="success"
                    fullWidth
                  >
                    Extract Section
                  </Button>
                )}

                {sections.length > 0 && (
                  <>
                    <Divider />
                    <Text as="p" variant="bodySm" tone="subdued">
                      {sections.length} sections found
                    </Text>
                  </>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Results Panel */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    Extraction Result
                  </Text>
                  {extractionResult && (
                    <InlineStack gap="200">
                      {extractionResult.themeCheckerPass ? (
                        <Badge tone="success">Passed</Badge>
                      ) : (
                        <Badge tone="warning">Has Warnings</Badge>
                      )}
                      <Button onClick={saveToLibrary} variant="primary">
                        Save to Library
                      </Button>
                    </InlineStack>
                  )}
                </InlineStack>

                {loading && (
                  <Box padding="800">
                    <InlineStack align="center">
                      <BlockStack gap="300" inlineAlign="center">
                        <Spinner size="large" />
                        <Text as="p" variant="bodyMd" tone="subdued">
                          Extracting and processing with AI...
                        </Text>
                      </BlockStack>
                    </InlineStack>
                  </Box>
                )}

                {!loading && !extractionResult && (
                  <Box padding="800">
                    <BlockStack gap="300" inlineAlign="center">
                      <Text as="p" variant="bodyLg" tone="subdued">
                        Select a theme and section, then click Extract to get production-ready code.
                      </Text>
                    </BlockStack>
                  </Box>
                )}

                {!loading && extractionResult && (
                  <>
                    <Tabs tabs={tabs} selected={activeTab} onSelect={setActiveTab}>
                      <Box padding="400">
                        <div
                          style={{
                            background: "#1e1e2e",
                            borderRadius: "8px",
                            padding: "16px",
                            overflow: "auto",
                            maxHeight: "500px",
                          }}
                        >
                          <pre
                            style={{
                              color: "#cdd6f4",
                              fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                              fontSize: "13px",
                              lineHeight: "1.6",
                              margin: 0,
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {getTabContent() || "(empty)"}
                          </pre>
                        </div>
                      </Box>
                    </Tabs>
                  </>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
