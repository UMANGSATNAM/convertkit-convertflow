import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Box,
  Badge,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({});
};

/**
 * Diff Visualizer
 * Shows side-by-side diff between existing theme section and library component.
 * Accessed via: /app/convertflow/diff?item=NAME
 * Used inline from the library push flow.
 */
export default function ConvertFlowDiff() {
  const [searchParams] = useSearchParams();
  const itemName = searchParams.get("item") || "Component";

  const [oldCode, setOldCode] = useState("");
  const [newCode, setNewCode] = useState("");

  // Compute line-by-line diff
  const computeDiff = (oldText, newText) => {
    const oldLines = (oldText || "").split("\n");
    const newLines = (newText || "").split("\n");
    const result = [];
    const maxLen = Math.max(oldLines.length, newLines.length);

    for (let i = 0; i < maxLen; i++) {
      const oldLine = i < oldLines.length ? oldLines[i] : null;
      const newLine = i < newLines.length ? newLines[i] : null;

      if (oldLine === newLine) {
        result.push({ type: "same", lineOld: i + 1, lineNew: i + 1, content: oldLine });
      } else {
        if (oldLine !== null && oldLine !== undefined) {
          result.push({ type: "removed", lineOld: i + 1, lineNew: null, content: oldLine });
        }
        if (newLine !== null && newLine !== undefined) {
          result.push({ type: "added", lineOld: null, lineNew: i + 1, content: newLine });
        }
      }
    }
    return result;
  };

  const diffLines = computeDiff(oldCode, newCode);

  const getLineStyle = (type) => {
    const base = {
      fontFamily: "'Fira Code', 'Cascadia Code', monospace",
      fontSize: "12px",
      lineHeight: "1.7",
      padding: "1px 8px",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    };
    switch (type) {
      case "added":
        return { ...base, background: "rgba(46, 160, 67, 0.15)", color: "#3fb950" };
      case "removed":
        return { ...base, background: "rgba(248, 81, 73, 0.15)", color: "#f85149" };
      default:
        return { ...base, background: "transparent", color: "#8b949e" };
    }
  };

  const getPrefix = (type) => {
    switch (type) {
      case "added": return "+";
      case "removed": return "-";
      default: return " ";
    }
  };

  return (
    <Page
      title="Diff Visualizer"
      backAction={{ content: "Library", url: "/app/convertflow/library" }}
    >
      <TitleBar title={`Diff - ${itemName}`} />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between">
                  <Text as="h2" variant="headingMd">Existing (Theme)</Text>
                  <Badge tone="critical">Old</Badge>
                </InlineStack>
                <textarea
                  value={oldCode}
                  onChange={(e) => setOldCode(e.target.value)}
                  placeholder="Paste existing theme section code here..."
                  style={{
                    width: "100%",
                    minHeight: "200px",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "12px",
                    padding: "12px",
                    borderRadius: "6px",
                    border: "1px solid var(--p-color-border-secondary)",
                    background: "#1e1e2e",
                    color: "#cdd6f4",
                    resize: "vertical",
                  }}
                />
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between">
                  <Text as="h2" variant="headingMd">New (Library)</Text>
                  <Badge tone="success">New</Badge>
                </InlineStack>
                <textarea
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Paste new library component code here..."
                  style={{
                    width: "100%",
                    minHeight: "200px",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "12px",
                    padding: "12px",
                    borderRadius: "6px",
                    border: "1px solid var(--p-color-border-secondary)",
                    background: "#1e1e2e",
                    color: "#cdd6f4",
                    resize: "vertical",
                  }}
                />
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between">
              <Text as="h2" variant="headingMd">Diff Output</Text>
              <InlineStack gap="200">
                <Badge tone="success">
                  +{diffLines.filter((l) => l.type === "added").length} added
                </Badge>
                <Badge tone="critical">
                  -{diffLines.filter((l) => l.type === "removed").length} removed
                </Badge>
              </InlineStack>
            </InlineStack>

            <div
              style={{
                background: "#0d1117",
                borderRadius: "8px",
                padding: "12px 0",
                overflow: "auto",
                maxHeight: "500px",
              }}
            >
              {(!oldCode && !newCode) ? (
                <Box padding="400">
                  <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                    Paste code above to see the diff
                  </Text>
                </Box>
              ) : (
                diffLines.map((line, idx) => (
                  <div key={idx} style={getLineStyle(line.type)}>
                    <span style={{ display: "inline-block", width: "40px", textAlign: "right", marginRight: "12px", opacity: 0.5 }}>
                      {line.lineOld || ""}
                    </span>
                    <span style={{ display: "inline-block", width: "16px", fontWeight: "bold" }}>
                      {getPrefix(line.type)}
                    </span>
                    {line.content}
                  </div>
                ))
              )}
            </div>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
