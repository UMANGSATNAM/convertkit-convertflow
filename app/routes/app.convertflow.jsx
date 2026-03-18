import { useState, useCallback, useEffect, useRef } from "react";
import {
  Page,
  Badge,
  Banner,
  Spinner,
  Text,
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

export default function ConvertFlow() {
  const { shopDomain, themeId, productHandle } = useLoaderData();

  // ── State ──
  const [inspectorEnabled, setInspectorEnabled] = useState(true);
  const [currentPath, setCurrentPath] = useState("/");
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [clickedSection, setClickedSection] = useState(null);
  const [extraction, setExtraction] = useState(null);
  const [loadingCode, setLoadingCode] = useState(false);
  const [activeTab, setActiveTab] = useState("liquid");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [livePreviewLoading, setLivePreviewLoading] = useState(false);
  const [sectionsOnPage, setSectionsOnPage] = useState([]);
  const [error, setError] = useState("");
  const [monacoLoaded, setMonacoLoaded] = useState(false);
  const [storePasswordProtected, setStorePasswordProtected] = useState(false);

  const proxyIframeRef = useRef(null);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const editorContainerRef = useRef(null);
  const cssDebounceRef = useRef(null);
  const liquidDebounceRef = useRef(null);
  const currentCodeRef = useRef({ liquid: "", css: "", schema: "", combined: "" });

  // ── Proxy URL ──
  const proxyUrl = `/app/convertflow/proxy?shop=${encodeURIComponent(shopDomain)}&path=${encodeURIComponent(currentPath)}`;

  // ── Send message to proxy iframe ──
  const sendToIframe = useCallback((msg) => {
    if (proxyIframeRef.current?.contentWindow) {
      proxyIframeRef.current.contentWindow.postMessage(msg, "*");
    }
  }, []);

  // ── Toggle inspector ──
  const toggleInspector = useCallback(() => {
    const next = !inspectorEnabled;
    setInspectorEnabled(next);
    sendToIframe({ type: "CK_TOGGLE_INSPECTOR", enabled: next });
  }, [inspectorEnabled, sendToIframe]);

  // ── Navigate inside proxy iframe ──
  const navigateTo = useCallback((path) => {
    setCurrentPath(path);
    setIframeLoading(true);
    setStorePasswordProtected(false);
    setIframeKey((k) => k + 1);
  }, []);

  // ── Handle iframe load — check if proxy returned JSON error ──
  const handleIframeLoad = useCallback(() => {
    setIframeLoading(false);
    try {
      const iframeDoc = proxyIframeRef.current?.contentDocument;
      if (iframeDoc) {
        const bodyText = iframeDoc.body?.innerText?.trim() || "";
        if (bodyText.startsWith("{")) {
          const data = JSON.parse(bodyText);
          if (data.error === "PASSWORD_PROTECTED") {
            setStorePasswordProtected(true);
          }
        }
      }
    } catch (e) {
      // Cross-origin or parse error — ignore
    }
  }, []);

  // ── Fetch section code ──
  const fetchSectionCode = useCallback(async (sectionId) => {
    setLoadingCode(true);
    setError("");
    try {
      const res = await fetch("/api/convertflow-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeId,
          sectionKey: `sections/${sectionId}.liquid`,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const ext = data.extraction || {};
      const liquid = ext.processedLiquid || ext.rawLiquid || "";
      const css = ext.processedCSS || ext.rawCSS || "";
      const schema = ext.processedSchema || ext.rawSchema || "";
      const combined = css ? `<style>\n${css}\n</style>\n\n${liquid}` : liquid;

      setExtraction({ liquid, css, schema, combined, themeCheck: ext.themeCheckerPass });
      currentCodeRef.current = { liquid, css, schema, combined };
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCode(false);
    }
  }, [themeId]);

  // ── Handle messages from iframe ──
  useEffect(() => {
    const handler = (e) => {
      if (!e.data || typeof e.data.type !== "string") return;
      if (!e.data.type.startsWith("CK_")) return;

      switch (e.data.type) {
        case "CK_INSPECTOR_READY":
          sendToIframe({ type: "CK_GET_SECTIONS" });
          sendToIframe({ type: "CK_TOGGLE_INSPECTOR", enabled: inspectorEnabled });
          break;
        case "CK_SECTION_CLICKED":
          setClickedSection({ sectionId: e.data.sectionId, sectionType: e.data.sectionType });
          setIsEditing(false);
          setSaveSuccess(false);
          fetchSectionCode(e.data.sectionId);
          break;
        case "CK_SECTIONS_LIST":
          setSectionsOnPage(e.data.sections || []);
          break;
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [sendToIframe, fetchSectionCode, inspectorEnabled]);

  // ── Load Monaco from CDN ──
  useEffect(() => {
    if (monacoLoaded) return;
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js";
    script.onload = () => {
      window.require.config({
        paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs" },
      });
      window.require(["vs/editor/editor.main"], () => {
        // Register Liquid language
        window.monaco.languages.register({ id: "liquid" });
        window.monaco.languages.setMonarchTokensProvider("liquid", {
          tokenizer: {
            root: [
              [/\{%[-]?/, { token: "delimiter.liquid", next: "@liquidTag" }],
              [/\{\{[-]?/, { token: "delimiter.liquid", next: "@liquidOutput" }],
              [/<style[\s>]/, { token: "tag", next: "@css" }],
              [/<\/?[\w]+/, "tag"],
              [/[^<{]+/, ""],
            ],
            liquidTag: [
              [/[-]?%\}/, { token: "delimiter.liquid", next: "@pop" }],
              [/\b(if|else|elsif|endif|for|endfor|unless|endunless|case|when|endcase|capture|endcapture|assign|include|render|section|schema|endschema|comment|endcomment|raw|endraw)\b/, "keyword"],
              [/"[^"]*"/, "string"],
              [/'[^']*'/, "string"],
              [/\|/, "operator"],
              [/\b\d+\b/, "number"],
              [/./, ""],
            ],
            liquidOutput: [
              [/[-]?\}\}/, { token: "delimiter.liquid", next: "@pop" }],
              [/\|/, "operator"],
              [/"[^"]*"/, "string"],
              [/'[^']*'/, "string"],
              [/\b\d+\b/, "number"],
              [/./, "variable"],
            ],
            css: [
              [/<\/style>/, { token: "tag", next: "@pop" }],
              [/./, ""],
            ],
          },
        });
        setMonacoLoaded(true);
      });
    };
    document.head.appendChild(script);
  }, [monacoLoaded]);

  // ── Create/update Monaco editor ──
  useEffect(() => {
    if (!monacoLoaded || !extraction || !editorContainerRef.current) return;
    if (!window.monaco) return;

    const lang = activeTab === "css" ? "css" : activeTab === "schema" ? "json" : "liquid";
    const value = extraction[activeTab] || "";

    if (editorRef.current) {
      editorRef.current.dispose();
    }

    const editor = window.monaco.editor.create(editorContainerRef.current, {
      value,
      language: lang,
      theme: "vs-dark",
      readOnly: !isEditing,
      minimap: { enabled: false },
      fontSize: 13,
      lineNumbers: "on",
      wordWrap: "on",
      scrollBeyondLastLine: false,
      automaticLayout: true,
      padding: { top: 12 },
    });

    editor.onDidChangeModelContent(() => {
      if (!isEditing) return;
      const newValue = editor.getValue();
      currentCodeRef.current[activeTab] = newValue;

      if (activeTab === "css") {
        clearTimeout(cssDebounceRef.current);
        cssDebounceRef.current = setTimeout(() => {
          sendToIframe({ type: "CK_INJECT_CSS", css: newValue });
        }, 300);
      } else if (activeTab === "liquid" || activeTab === "combined") {
        clearTimeout(liquidDebounceRef.current);
        liquidDebounceRef.current = setTimeout(() => {
          previewLiquid(newValue);
        }, 800);
      }
    });

    editorRef.current = editor;

    return () => {
      clearTimeout(cssDebounceRef.current);
      clearTimeout(liquidDebounceRef.current);
    };
  }, [monacoLoaded, extraction, activeTab, isEditing]);

  // ── Live preview Liquid via server ──
  const previewLiquid = useCallback(async (code) => {
    if (!clickedSection) return;
    setLivePreviewLoading(true);
    try {
      const res = await fetch("/api/convertflow/preview-liquid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          liquidCode: code,
          cssCode: currentCodeRef.current.css,
          sectionId: clickedSection.sectionId,
          themeId,
        }),
      });
      const data = await res.json();
      if (data.success && data.html) {
        sendToIframe({
          type: "CK_INJECT_HTML",
          sectionId: clickedSection.sectionId,
          html: data.html,
        });
      }
    } catch (err) {
      console.error("Live preview error:", err);
    } finally {
      setLivePreviewLoading(false);
    }
  }, [clickedSection, themeId, sendToIframe]);

  // ── Save to live theme ──
  const handleSaveToTheme = useCallback(async () => {
    if (!clickedSection || !isEditing) return;
    setSaving(true);
    setError("");
    setSaveSuccess(false);
    try {
      // Save backup to library first
      await fetch("/api/convertflow-library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Backup: ${clickedSection.sectionId}`,
          description: `Auto-backup before save to live theme`,
          tags: "backup",
          liquidCode: extraction.liquid,
          cssCode: extraction.css,
          schemaCode: extraction.schema,
        }),
      });

      // Push to live theme
      const combined = currentCodeRef.current.css
        ? `<style>\n${currentCodeRef.current.css}\n</style>\n\n${currentCodeRef.current.liquid}`
        : currentCodeRef.current.liquid;

      const schemaBlock = currentCodeRef.current.schema
        ? `\n\n{% schema %}\n${currentCodeRef.current.schema}\n{% endschema %}`
        : "";

      const res = await fetch("/api/convertflow-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeId,
          sectionKey: `sections/${clickedSection.sectionId}.liquid`,
          code: combined + schemaBlock,
          sectionName: clickedSection.sectionId,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSaveSuccess(true);
      // Reload iframe after 1.5s to show live result
      setTimeout(() => setIframeKey((k) => k + 1), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [clickedSection, isEditing, themeId, extraction]);

  // ── Copy to clipboard ──
  const copyCode = useCallback(() => {
    const code = currentCodeRef.current[activeTab] || "";
    navigator.clipboard.writeText(code).catch(() => {});
  }, [activeTab]);

  // ── Tab data ──
  const TABS = [
    { id: "liquid", label: "Liquid" },
    { id: "css", label: "CSS" },
    { id: "schema", label: "Schema" },
    { id: "combined", label: "Combined" },
  ];

  return (
    <Page title="ConvertFlow" fullWidth>
      <TitleBar title="ConvertFlow — Visual Section Inspector" />

      {error && (
        <div style={{ padding: "0 0 12px" }}>
          <Banner tone="critical" onDismiss={() => setError("")}>
            <Text as="p">{error}</Text>
          </Banner>
        </div>
      )}

      {/* ── 2-Panel Layout ── */}
      <div style={{ display: "flex", height: "calc(100vh - 120px)", overflow: "hidden", borderRadius: 10, border: "1px solid #e5e7eb" }}>

        {/* ══════════ LEFT PANEL: Store Preview (60%) ══════════ */}
        <div style={{ width: "60%", display: "flex", flexDirection: "column", borderRight: "1px solid #e5e7eb" }}>

          {/* Browser toolbar */}
          <div style={{
            height: 44, borderBottom: "1px solid #e5e7eb", background: "#f9fafb",
            display: "flex", alignItems: "center", gap: 6, padding: "0 10px", flexShrink: 0,
          }}>
            {/* Nav buttons */}
            <button onClick={() => { try { proxyIframeRef.current?.contentWindow?.history.back(); } catch(e){} }} style={navBtnStyle} title="Back">←</button>
            <button onClick={() => { try { proxyIframeRef.current?.contentWindow?.history.forward(); } catch(e){} }} style={navBtnStyle} title="Forward">→</button>
            <button onClick={() => setIframeKey((k) => k + 1)} style={navBtnStyle} title="Refresh">↻</button>

            {/* URL bar */}
            <div style={{
              flex: 1, display: "flex", alignItems: "center", gap: 6,
              background: "#fff", border: "1px solid #d1d5db", borderRadius: 6,
              padding: "4px 10px", fontSize: 12, color: "#374151", overflow: "hidden",
            }}>
              <span style={{ color: "#059669", fontSize: 11 }}>🔒</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {shopDomain}{currentPath}
              </span>
            </div>

            {/* Quick nav */}
            <button onClick={() => navigateTo("/")} style={navBtnStyle}>Home</button>
            <button onClick={() => navigateTo("/collections")} style={navBtnStyle}>Collections</button>
            <button onClick={() => navigateTo("/products")} style={navBtnStyle}>Products</button>

            {/* Inspector toggle */}
            <button
              onClick={toggleInspector}
              style={{
                ...navBtnStyle,
                background: inspectorEnabled ? "#059669" : "#9ca3af",
                color: "#fff",
                fontWeight: 700,
                minWidth: 70,
              }}
            >
              {inspectorEnabled ? "Inspector ON" : "Inspector OFF"}
            </button>
          </div>

          {/* Hint banner */}
          {inspectorEnabled && !clickedSection && (
            <div style={{
              padding: "6px 14px", background: "#EEEDFE", color: "#4338CA",
              fontSize: 11, flexShrink: 0,
            }}>
              👆 Hover over any section to highlight it. Click to open its code in the editor.
            </div>
          )}

          {/* Proxy iframe */}
          <div style={{ flex: 1, position: "relative" }}>
            {iframeLoading && !storePasswordProtected && (
              <div style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center",
                justifyContent: "center", background: "#f3f4f6", zIndex: 5,
              }}>
                <div style={{ textAlign: "center" }}>
                  <Spinner size="large" />
                  <p style={{ marginTop: 12, color: "#6b7280", fontSize: 13 }}>Loading store preview…</p>
                </div>
              </div>
            )}

            {/* Password-protected error UI */}
            {storePasswordProtected && (
              <div style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center",
                justifyContent: "center", background: "#f9fafb", zIndex: 6,
              }}>
                <div style={{
                  textAlign: "center", padding: 40, background: "#FEF3C7",
                  borderRadius: 12, maxWidth: 420,
                }}>
                  <p style={{ fontSize: 32, margin: "0 0 8px" }}>🔒</p>
                  <h3 style={{ color: "#92400E", margin: "0 0 8px", fontSize: 16 }}>
                    Store is password protected
                  </h3>
                  <p style={{ color: "#92400E", fontSize: 13, margin: "0 0 20px", lineHeight: 1.5 }}>
                    Your store has password protection enabled. You need to disable it
                    temporarily to use the Visual Inspector.
                  </p>
                  <a
                    href={`https://${shopDomain}/admin/online_store/preferences`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block", background: "#92400E", color: "#fff",
                      padding: "10px 20px", borderRadius: 8, textDecoration: "none",
                      fontSize: 13, fontWeight: 600,
                    }}
                  >
                    Disable Password Protection →
                  </a>
                  <p style={{ fontSize: 11, color: "#B45309", marginTop: 12 }}>
                    After disabling, click the ↻ refresh button in the toolbar above.
                  </p>
                </div>
              </div>
            )}

            <iframe
              ref={proxyIframeRef}
              key={iframeKey}
              src={proxyUrl}
              title="Store Preview"
              style={{ width: "100%", height: "100%", border: "none" }}
              onLoad={handleIframeLoad}
            />
          </div>
        </div>

        {/* ══════════ RIGHT PANEL: Code Editor (40%) ══════════ */}
        <div style={{ width: "40%", display: "flex", flexDirection: "column", background: "#1E2530" }}>

          {/* Panel header */}
          <div style={{
            height: 44, borderBottom: "1px solid #374151", background: "#f9fafb",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 14px", flexShrink: 0,
          }}>
            {!clickedSection ? (
              <span style={{ color: "#9ca3af", fontSize: 13 }}>
                Click any section in the preview to see its code
              </span>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>
                  {clickedSection.sectionId}
                </span>
                <span style={{ fontSize: 11, color: "#6b7280" }}>
                  sections/{clickedSection.sectionId}.liquid
                </span>
                {extraction && (
                  <Badge tone={extraction.themeCheck ? "success" : "warning"}>
                    {extraction.themeCheck ? "PASS" : "WARN"}
                  </Badge>
                )}
                {livePreviewLoading && (
                  <span style={{ fontSize: 11, color: "#4F46E5" }}>Updating preview…</span>
                )}
              </div>
            )}
            {clickedSection && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  padding: "4px 12px", border: "1px solid #d1d5db", borderRadius: 4,
                  background: isEditing ? "#4F46E5" : "#fff",
                  color: isEditing ? "#fff" : "#374151",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}
              >
                {isEditing ? "Editing" : "Read Only"}
              </button>
            )}
          </div>

          {/* Tab bar */}
          <div style={{
            display: "flex", borderBottom: "1px solid #374151", flexShrink: 0,
          }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1, padding: "8px 0", border: "none", cursor: "pointer",
                  background: "transparent",
                  color: activeTab === tab.id ? "#fff" : "#9ca3af",
                  fontSize: 12, fontWeight: 600,
                  borderBottom: activeTab === tab.id ? "2px solid #4F46E5" : "2px solid transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Editor area */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {/* Empty state */}
            {!clickedSection && !loadingCode && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", height: "100%", gap: 12,
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="1.5">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                <span style={{ color: "#6b7280", fontSize: 14 }}>
                  Click any section to see its code
                </span>
              </div>
            )}

            {/* Loading state */}
            {loadingCode && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", height: "100%", gap: 12,
              }}>
                <Spinner size="large" />
                <span style={{ color: "#9ca3af", fontSize: 13 }}>Fetching section code…</span>
              </div>
            )}

            {/* Monaco container */}
            {extraction && !loadingCode && (
              <div ref={editorContainerRef} id="ck-monaco-container" style={{ width: "100%", height: "100%" }} />
            )}
          </div>

          {/* Bottom action bar */}
          <div style={{
            height: 52, borderTop: "1px solid #374151", background: "#f9fafb",
            display: "flex", alignItems: "center", justifyContent: "flex-end",
            gap: 8, padding: "0 14px", flexShrink: 0,
          }}>
            <button onClick={copyCode} style={actionBtnStyle}>
              Copy {activeTab}
            </button>
            <button
              onClick={async () => {
                if (!extraction) return;
                try {
                  await fetch("/api/convertflow-library", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: clickedSection?.sectionId || "untitled",
                      description: `Saved from visual inspector`,
                      tags: "inspector",
                      liquidCode: currentCodeRef.current.liquid,
                      cssCode: currentCodeRef.current.css,
                      schemaCode: currentCodeRef.current.schema,
                    }),
                  });
                } catch (e) { setError(e.message); }
              }}
              style={actionBtnStyle}
              disabled={!extraction}
            >
              Save to Library
            </button>
            <button
              onClick={handleSaveToTheme}
              disabled={!isEditing || !extraction || saving}
              style={{
                ...actionBtnStyle,
                background: !isEditing || !extraction ? "#d1d5db" : saveSuccess ? "#059669" : "#4F46E5",
                color: "#fff",
                cursor: !isEditing || !extraction ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving…" : saveSuccess ? "Saved! ✓" : "Save to Live Theme"}
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
}

// ── Shared button styles ──
const navBtnStyle = {
  padding: "4px 8px",
  border: "1px solid #d1d5db",
  borderRadius: 4,
  background: "#fff",
  fontSize: 12,
  cursor: "pointer",
  color: "#374151",
  fontWeight: 500,
};

const actionBtnStyle = {
  padding: "6px 14px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  background: "#fff",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  color: "#374151",
};
