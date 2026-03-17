import { useState, useCallback, useEffect } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Badge,
  Banner,
  Spinner,
  Tabs,
  Box,
  TextField,
  Modal,
  Select,
  Divider,
  EmptyState,
  Tag,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({});
};

export default function ConvertFlowLibrary() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showPushModal, setShowPushModal] = useState(false);
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [pushing, setPushing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [diffData, setDiffData] = useState(null);

  // Load library items
  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/convertflow-library");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  // Delete item
  const deleteItem = useCallback(async (id) => {
    if (!confirm("Delete this component?")) return;
    try {
      await fetch("/api/convertflow-library", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (err) {
      setError(err.message);
    }
  }, [selectedItem]);

  // Share item
  const shareItem = useCallback(async (id) => {
    try {
      const res = await fetch("/api/convertflow-share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ libraryItemId: id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const url = `${window.location.origin}/api/convertflow-share?token=${data.shareToken}`;
      setShareUrl(url);
      navigator.clipboard.writeText(url).catch(() => {});
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Load themes for push
  const openPushModal = useCallback(async (item) => {
    setSelectedItem(item);
    setShowPushModal(true);
    try {
      const res = await fetch("/api/convertflow-themes");
      const data = await res.json();
      setThemes(data.themes || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Push to theme
  const pushToTheme = useCallback(async () => {
    if (!selectedItem || !selectedTheme) return;
    setPushing(true);
    try {
      const res = await fetch("/api/convertflow-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          libraryItemId: selectedItem.id,
          themeId: selectedTheme,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setShowPushModal(false);
      setError("");
      loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setPushing(false);
    }
  }, [selectedItem, selectedTheme, loadItems]);

  // Simple diff computation
  const computeDiff = (oldText, newText) => {
    const oldLines = (oldText || "").split("\n");
    const newLines = (newText || "").split("\n");
    const result = [];
    const maxLen = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLen; i++) {
      const oldLine = oldLines[i] || "";
      const newLine = newLines[i] || "";
      if (oldLine === newLine) {
        result.push({ type: "same", content: oldLine });
      } else {
        if (oldLine) result.push({ type: "removed", content: oldLine });
        if (newLine) result.push({ type: "added", content: newLine });
      }
    }
    return result;
  };

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.tags || "").toLowerCase().includes(q) ||
      (item.description || "").toLowerCase().includes(q)
    );
  });

  const themeOptions = [
    { label: "Select a theme...", value: "" },
    ...themes.map((t) => ({
      label: `${t.name} ${t.role === "main" ? "(Live)" : `(${t.role})`}`,
      value: String(t.id),
    })),
  ];

  const tabs = [
    { id: "liquid", content: "Liquid", panelID: "liquid-panel" },
    { id: "css", content: "CSS", panelID: "css-panel" },
    { id: "schema", content: "Schema", panelID: "schema-panel" },
  ];

  const getTabContent = () => {
    if (!selectedItem) return "";
    switch (activeTab) {
      case 0: return selectedItem.liquidCode || "";
      case 1: return selectedItem.cssCode || "";
      case 2: return selectedItem.schemaCode || "";
      default: return "";
    }
  };

  return (
    <Page
      title="Component Library"
      backAction={{ content: "ConvertFlow", url: "/app/convertflow" }}
    >
      <TitleBar title="ConvertFlow - Component Library" />
      <BlockStack gap="500">
        {error && (
          <Banner tone="critical" onDismiss={() => setError("")}>
            <Text as="p">{error}</Text>
          </Banner>
        )}

        {shareUrl && (
          <Banner tone="success" onDismiss={() => setShareUrl("")}>
            <Text as="p">Share link copied: {shareUrl}</Text>
          </Banner>
        )}

        <Layout>
          {/* Component List */}
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Saved Components
                </Text>

                <TextField
                  label=""
                  labelHidden
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  autoComplete="off"
                  clearButton
                  onClearButtonClick={() => setSearchQuery("")}
                />

                <Divider />

                {loading && (
                  <Box padding="600">
                    <InlineStack align="center">
                      <Spinner size="small" />
                    </InlineStack>
                  </Box>
                )}

                {!loading && filteredItems.length === 0 && (
                  <Box padding="400">
                    <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                      No components saved yet. Extract a section from the ConvertFlow tab.
                    </Text>
                  </Box>
                )}

                {!loading &&
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => { setSelectedItem(item); setActiveTab(0); }}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        background:
                          selectedItem?.id === item.id
                            ? "var(--p-color-bg-surface-selected)"
                            : "transparent",
                        border: "1px solid var(--p-color-border-secondary)",
                        transition: "background 0.15s ease",
                      }}
                    >
                      <BlockStack gap="200">
                        <InlineStack align="space-between">
                          <Text as="span" variant="bodyMd" fontWeight="semibold">
                            {item.name}
                          </Text>
                          <Badge>{item.usageCount || 0} pushes</Badge>
                        </InlineStack>
                        {item.tags && (
                          <InlineStack gap="100">
                            {item.tags.split(",").map((tag) => (
                              <Tag key={tag.trim()}>{tag.trim()}</Tag>
                            ))}
                          </InlineStack>
                        )}
                      </BlockStack>
                    </div>
                  ))}
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Detail Panel */}
          <Layout.Section>
            <Card>
              {!selectedItem ? (
                <Box padding="800">
                  <BlockStack gap="300" inlineAlign="center">
                    <Text as="p" variant="bodyLg" tone="subdued">
                      Select a component to view its code, push to a theme, or share it.
                    </Text>
                  </BlockStack>
                </Box>
              ) : (
                <BlockStack gap="400">
                  <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="100">
                      <Text as="h2" variant="headingMd">
                        {selectedItem.name}
                      </Text>
                      {selectedItem.description && (
                        <Text as="p" variant="bodySm" tone="subdued">
                          {selectedItem.description}
                        </Text>
                      )}
                    </BlockStack>
                    <InlineStack gap="200">
                      <Button onClick={() => shareItem(selectedItem.id)}>
                        Share
                      </Button>
                      <Button onClick={() => openPushModal(selectedItem)} variant="primary">
                        Push to Theme
                      </Button>
                      <Button
                        onClick={() => deleteItem(selectedItem.id)}
                        tone="critical"
                      >
                        Delete
                      </Button>
                    </InlineStack>
                  </InlineStack>

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
                </BlockStack>
              )}
            </Card>
          </Layout.Section>
        </Layout>

        {/* Push to Theme Modal */}
        {showPushModal && (
          <Modal
            open={showPushModal}
            onClose={() => setShowPushModal(false)}
            title={`Push "${selectedItem?.name}" to Theme`}
            primaryAction={{
              content: pushing ? "Pushing..." : "Push to Theme",
              onAction: pushToTheme,
              loading: pushing,
              disabled: !selectedTheme,
            }}
            secondaryActions={[
              { content: "Cancel", onAction: () => setShowPushModal(false) },
            ]}
          >
            <Modal.Section>
              <BlockStack gap="400">
                <Banner tone="warning">
                  <Text as="p">
                    This will create or overwrite the section file on the selected theme.
                    A backup of the existing file will be saved automatically.
                  </Text>
                </Banner>
                <Select
                  label="Target Theme"
                  options={themeOptions}
                  value={selectedTheme}
                  onChange={setSelectedTheme}
                />
              </BlockStack>
            </Modal.Section>
          </Modal>
        )}
      </BlockStack>
    </Page>
  );
}
