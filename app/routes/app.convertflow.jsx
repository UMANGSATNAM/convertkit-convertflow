import { useState, useCallback, useEffect, useRef } from "react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { listThemeSections, fetchAsset } from "../lib/convertflow.server.js";
import { parseShopifySchema, sectionKeyToLabel } from "../utils/schema-parser";
import { shopifyFetchWithRetry } from "../lib/shopify-fetch.server.js";

// ── Loader: fetch theme data in parallel ──
export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shopDomain = session.shop;
  const token = session.accessToken;
  let themeId = "";
  let themeName = "";
  let passwordEnabled = false;
  let productHandle = "";
  let sections = [];
  let sectionSchemas = {};
  let settingsData = {};

  try {
    // Parallel fetch: theme + product
    const [themesRes, productsRes, shopRes] = await Promise.all([
      admin.graphql(`query { themes(first: 10) { edges { node { id name role } } } }`),
      admin.graphql(`query { products(first: 1, query: "status:active") { edges { node { handle } } } }`),
      shopifyFetchWithRetry(`https://${shopDomain}/admin/api/2025-01/shop.json`, {
        headers: { "X-Shopify-Access-Token": token },
      }),
    ]);

    const themesData = await themesRes.json();
    const activeTheme = themesData.data.themes.edges.find((e) => e.node.role === "MAIN")?.node;
    themeId = activeTheme?.id?.replace("gid://shopify/OnlineStoreTheme/", "") || "";
    themeName = activeTheme?.name || "Theme";

    const productsData = await productsRes.json();
    productHandle = productsData.data.products.edges[0]?.node?.handle || "";

    if (shopRes.ok) {
      const shopData = await shopRes.json();
      passwordEnabled = shopData.shop?.password_enabled || false;
    }
  } catch (e) {
    console.error("ConvertFlow loader error:", e.message);
  }

  // Fetch sections and their schemas
  if (themeId) {
    try {
      sections = await listThemeSections(admin, session, themeId);

      // Fetch settings_data.json
      try {
        const raw = await fetchAsset(admin, session, themeId, "config/settings_data.json");
        settingsData = JSON.parse(raw);
      } catch (e) { /* no settings data */ }

      // Fetch schemas for first 30 sections (limit API calls)
      const sectionFiles = sections.slice(0, 30);
      const schemaPromises = sectionFiles.map(async (s) => {
        try {
          const content = await fetchAsset(admin, session, themeId, s.key);
          const schema = parseShopifySchema(content);
          return { key: s.key, name: s.name, schema };
        } catch (e) {
          return { key: s.key, name: s.name, schema: { name: sectionKeyToLabel(s.key), settings: [], blocks: [] } };
        }
      });
      const results = await Promise.all(schemaPromises);
      results.forEach((r) => { sectionSchemas[r.key] = r.schema; });
    } catch (e) {
      console.error("Section fetch error:", e.message);
    }
  }

  return json({
    shopDomain, themeId, themeName, passwordEnabled,
    productHandle, sections, sectionSchemas, settingsData,
  });
};

// ── Section groups: header, template, footer ──
function categorizeSections(sections, schemas) {
  const header = [];
  const footer = [];
  const template = [];

  for (const s of sections) {
    const schema = schemas[s.key];
    const name = (schema?.name || s.name).toLowerCase();
    if (name.includes("header") || name.includes("announcement")) {
      header.push({ ...s, schema, group: "header" });
    } else if (name.includes("footer")) {
      footer.push({ ...s, schema, group: "footer" });
    } else {
      template.push({ ...s, schema, group: "template" });
    }
  }
  return { header, template, footer };
}

// ── MAIN COMPONENT ──
export default function ConvertFlowEditor() {
  const {
    shopDomain, themeId, themeName, passwordEnabled,
    productHandle, sections, sectionSchemas, settingsData,
  } = useLoaderData();

  // State
  const [selectedSectionKey, setSelectedSectionKey] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [currentPath, setCurrentPath] = useState("/");
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [viewport, setViewport] = useState("desktop");
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settingValues, setSettingValues] = useState({});
  const [sectionsOnPage, setSectionsOnPage] = useState([]);

  const proxyIframeRef = useRef(null);
  const settingsDebounceRef = useRef(null);

  const proxyUrl = `/app/convertflow/proxy?shop=${encodeURIComponent(shopDomain)}&path=${encodeURIComponent(currentPath)}`;
  const { header, template, footer } = categorizeSections(sections, sectionSchemas);
  const selectedSchema = selectedSectionKey ? sectionSchemas[selectedSectionKey] : null;

  // Initialize setting values from settingsData
  useEffect(() => {
    if (settingsData?.current?.sections) {
      setSettingValues(settingsData.current.sections);
    }
  }, []);

  // Send message to iframe
  const sendToIframe = useCallback((msg) => {
    proxyIframeRef.current?.contentWindow?.postMessage(msg, "*");
  }, []);

  // Handle iframe messages
  useEffect(() => {
    const handler = (e) => {
      if (!e.data?.type?.startsWith?.("CK_")) return;
      switch (e.data.type) {
        case "CK_INSPECTOR_READY":
          sendToIframe({ type: "CK_GET_SECTIONS" });
          sendToIframe({ type: "CK_TOGGLE_INSPECTOR", enabled: true });
          break;
        case "CK_SECTION_CLICKED":
          setSelectedSectionKey(`sections/${e.data.sectionId}.liquid`);
          break;
        case "CK_SECTIONS_LIST":
          setSectionsOnPage(e.data.sections || []);
          break;
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [sendToIframe]);

  // Handle iframe load
  const handleIframeLoad = useCallback(() => {
    setIframeLoading(false);
  }, []);

  // Handle setting change
  const handleSettingChange = useCallback((settingId, value) => {
    setHasChanges(true);
    setSettingValues((prev) => {
      const sectionName = selectedSectionKey?.replace("sections/", "").replace(".liquid", "") || "";
      return {
        ...prev,
        [sectionName]: { ...(prev[sectionName] || {}), [settingId]: value },
      };
    });

    // Debounced CSS injection for color/font settings
    clearTimeout(settingsDebounceRef.current);
    settingsDebounceRef.current = setTimeout(() => {
      sendToIframe({ type: "CK_INJECT_CSS", settingId, value });
    }, 300);
  }, [selectedSectionKey, sendToIframe]);

  // Toggle section expand
  const toggleExpand = useCallback((key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Viewport dimensions
  const vpStyle = viewport === "mobile"
    ? { width: 390, margin: "0 auto" }
    : viewport === "tablet"
    ? { width: 768, margin: "0 auto" }
    : { width: "100%" };

  // ──────── RENDER ────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: "hidden", margin: "-16px", position: "relative" }}>

      {/* ══ TOP BAR ══ */}
      <div style={{
        height: 52, background: "#1a1a1a", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 16px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/app" style={{ color: "#999", textDecoration: "none", fontSize: 18, lineHeight: 1 }}>←</a>
          <select
            style={{ background: "#333", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 4, fontSize: 13, fontWeight: 600 }}
            value={currentPath}
            onChange={(e) => { setCurrentPath(e.target.value); setIframeKey((k) => k + 1); setIframeLoading(true); }}
          >
            <option value="/">Home page</option>
            <option value="/collections">Collections</option>
            <option value="/products">Products</option>
            <option value="/cart">Cart</option>
            <option value="/pages/contact">Contact</option>
          </select>
        </div>

        {/* Viewport toggles */}
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { id: "desktop", icon: "🖥" },
            { id: "tablet", icon: "📱" },
            { id: "mobile", icon: "📲" },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setViewport(v.id)}
              style={{
                padding: "6px 10px", border: "none", borderRadius: 4, cursor: "pointer",
                background: viewport === v.id ? "#444" : "transparent",
                color: viewport === v.id ? "#fff" : "#888", fontSize: 14,
              }}
            >
              {v.icon}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {saving && <span style={{ color: "#999", fontSize: 12 }}>Saving...</span>}
          <button
            style={{
              padding: "7px 20px", borderRadius: 6, border: "none", cursor: "pointer",
              background: hasChanges ? "#fff" : "#555",
              color: hasChanges ? "#1a1a1a" : "#999",
              fontSize: 13, fontWeight: 600,
            }}
            disabled={!hasChanges}
          >
            Save
          </button>
        </div>
      </div>

      {/* ══ MAIN 3-PANEL LAYOUT ══ */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ─── LEFT PANEL: Section Tree (280px) ─── */}
        <div style={{
          width: 280, flexShrink: 0, borderRight: "1px solid #e3e3e3",
          background: "#fff", overflowY: "auto", fontSize: 13,
        }}>
          {/* Header group */}
          <SectionGroup label="Header" items={header} selectedKey={selectedSectionKey}
            expandedSections={expandedSections} onSelect={setSelectedSectionKey}
            onToggle={toggleExpand} draggable={false} />

          {/* Template group */}
          <SectionGroup label="Template" items={template} selectedKey={selectedSectionKey}
            expandedSections={expandedSections} onSelect={setSelectedSectionKey}
            onToggle={toggleExpand} draggable={true} />

          {/* Footer group */}
          <SectionGroup label="Footer" items={footer} selectedKey={selectedSectionKey}
            expandedSections={expandedSections} onSelect={setSelectedSectionKey}
            onToggle={toggleExpand} draggable={false} />
        </div>

        {/* ─── CENTER PANEL: Live Preview ─── */}
        <div style={{ flex: 1, background: "#e8e8e8", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {passwordEnabled ? (
            <PasswordProtectedUI shopDomain={shopDomain} />
          ) : (
            <div style={{ flex: 1, position: "relative", display: "flex", justifyContent: "center", overflow: "hidden" }}>
              {iframeLoading && <SkeletonOverlay />}
              <div style={{ ...vpStyle, height: "100%", position: "relative", transition: "width 300ms ease" }}>
                {viewport === "mobile" && <MobileFrame />}
                {viewport === "tablet" && <TabletFrame />}
                <iframe
                  ref={proxyIframeRef}
                  key={iframeKey}
                  src={proxyUrl}
                  title="Store Preview"
                  style={{
                    width: "100%", height: "100%", border: "none",
                    borderRadius: viewport !== "desktop" ? 8 : 0,
                    background: "#fff",
                  }}
                  onLoad={handleIframeLoad}
                />
              </div>
            </div>
          )}
        </div>

        {/* ─── RIGHT PANEL: Settings (300px) ─── */}
        <div style={{
          width: 300, flexShrink: 0, borderLeft: "1px solid #e3e3e3",
          background: "#fff", overflowY: "auto",
        }}>
          {selectedSchema ? (
            <SettingsPanel
              schema={selectedSchema}
              sectionKey={selectedSectionKey}
              values={settingValues}
              onChange={handleSettingChange}
            />
          ) : (
            <div style={{ padding: 20, textAlign: "center", color: "#616161", fontSize: 13 }}>
              <p style={{ margin: "40px 0 8px" }}>Select a section to edit its settings</p>
              <p style={{ fontSize: 12, color: "#999" }}>Click any section in the left panel or in the store preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════

function SectionGroup({ label, items, selectedKey, expandedSections, onSelect, onToggle, draggable }) {
  return (
    <div style={{ borderBottom: "1px solid #e3e3e3" }}>
      <div style={{ padding: "10px 16px 4px", fontSize: 11, fontWeight: 600, color: "#616161", textTransform: "uppercase", letterSpacing: 1 }}>
        {label}
      </div>
      {items.map((item) => {
        const isSelected = item.key === selectedKey;
        const isExpanded = expandedSections[item.key];
        const schema = item.schema;
        const hasBlocks = schema?.blocks?.length > 0;
        return (
          <div key={item.key}>
            <div
              onClick={() => onSelect(item.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", cursor: "pointer",
                background: isSelected ? "#e8f0fe" : "transparent",
                color: isSelected ? "#005bd3" : "#303030",
                fontSize: 13, fontWeight: isSelected ? 600 : 400,
                transition: "background 100ms",
              }}
              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#f1f1f1"; }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
            >
              {draggable && <span style={{ cursor: "grab", color: "#999", fontSize: 11, userSelect: "none" }}>⠿</span>}
              {hasBlocks && (
                <span
                  onClick={(e) => { e.stopPropagation(); onToggle(item.key); }}
                  style={{ fontSize: 10, color: "#999", cursor: "pointer", width: 14, textAlign: "center" }}
                >
                  {isExpanded ? "▼" : "▶"}
                </span>
              )}
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {schema?.name || sectionKeyToLabel(item.key)}
              </span>
            </div>
            {/* Blocks */}
            {isExpanded && hasBlocks && (
              <div>
                {schema.blocks.map((block, idx) => (
                  <div key={idx} style={{
                    padding: "6px 16px 6px 48px", fontSize: 12, color: "#616161", cursor: "pointer",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f1f1"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    {block.name}
                  </div>
                ))}
                <div style={{ padding: "6px 16px 6px 48px" }}>
                  <span style={{ fontSize: 12, color: "#005bd3", cursor: "pointer" }}>+ Add block</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div style={{ padding: "6px 16px 10px" }}>
        <span style={{ fontSize: 12, color: "#005bd3", cursor: "pointer" }}>+ Add section</span>
      </div>
    </div>
  );
}

function SettingsPanel({ schema, sectionKey, values, onChange }) {
  if (!schema?.settings?.length) {
    return <div style={{ padding: 20, color: "#616161", fontSize: 13 }}>No settings for this section</div>;
  }

  const sectionName = sectionKey?.replace("sections/", "").replace(".liquid", "") || "";
  const sectionVals = values[sectionName] || {};

  return (
    <div style={{ padding: "16px 20px" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>
        {schema.name}
      </div>
      {schema.settings.map((setting, idx) => {
        if (setting.type === "header") {
          return (
            <div key={idx} style={{
              fontWeight: 600, fontSize: 13, color: "#1a1a1a",
              borderBottom: "1px solid #e3e3e3", paddingBottom: 8,
              margin: "16px 0 8px",
            }}>
              {setting.content || setting.label}
            </div>
          );
        }
        if (setting.type === "paragraph") {
          return <p key={idx} style={{ fontSize: 12, color: "#616161", margin: "0 0 8px" }}>{setting.content || setting.info}</p>;
        }
        const val = sectionVals[setting.id] ?? setting.default ?? "";
        return (
          <div key={idx} style={{ marginBottom: 14 }}>
            {setting.label && (
              <label style={{ display: "block", fontSize: 13, color: "#616161", marginBottom: 4 }}>
                {setting.label}
              </label>
            )}
            <SettingInput setting={setting} value={val} onChange={(v) => onChange(setting.id, v)} />
          </div>
        );
      })}
    </div>
  );
}

function SettingInput({ setting, value, onChange }) {
  const baseInput = {
    width: "100%", height: 36, border: "1px solid #e3e3e3", borderRadius: 4,
    padding: "0 10px", fontSize: 13, color: "#303030", boxSizing: "border-box",
    outline: "none", fontFamily: "inherit",
  };

  switch (setting.type) {
    case "text":
    case "url":
    case "link_list":
    case "collection":
      return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={baseInput} placeholder={setting.placeholder || ""} />;

    case "textarea":
      return <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        style={{ ...baseInput, height: "auto", padding: "8px 10px", resize: "vertical" }} />;

    case "number":
      return <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} style={baseInput}
        min={setting.min} max={setting.max} step={setting.step} />;

    case "color":
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)}
            style={{ width: 36, height: 36, border: "1px solid #e3e3e3", borderRadius: 4, padding: 2, cursor: "pointer" }} />
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
            style={{ ...baseInput, flex: 1 }} />
        </div>
      );

    case "select":
    case "color_scheme":
      return (
        <select value={value} onChange={(e) => onChange(e.target.value)} style={baseInput}>
          {(setting.options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );

    case "radio":
      return (
        <div style={{ display: "flex", gap: 0 }}>
          {(setting.options || []).map((opt) => (
            <button key={opt.value} onClick={() => onChange(opt.value)}
              style={{
                flex: 1, padding: "6px 4px", border: "1px solid #e3e3e3", fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: value === opt.value ? "#005bd3" : "#fff",
                color: value === opt.value ? "#fff" : "#303030",
                borderRadius: 0,
              }}>
              {opt.label}
            </button>
          ))}
        </div>
      );

    case "range":
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="range" value={value} onChange={(e) => onChange(Number(e.target.value))}
            min={setting.min || 0} max={setting.max || 100} step={setting.step || 1}
            style={{ flex: 1, accentColor: "#005bd3" }} />
          <span style={{ fontSize: 12, color: "#303030", minWidth: 36, textAlign: "right" }}>
            {value}{setting.unit || ""}
          </span>
        </div>
      );

    case "checkbox":
      return (
        <button onClick={() => onChange(!value)} style={{
          width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
          background: value ? "#005bd3" : "#d1d5db", position: "relative", transition: "background 200ms",
        }}>
          <span style={{
            position: "absolute", top: 2, left: value ? 22 : 2,
            width: 20, height: 20, borderRadius: "50%", background: "#fff",
            transition: "left 200ms", boxShadow: "0 1px 3px rgba(0,0,0,.2)",
          }} />
        </button>
      );

    case "image_picker":
      return (
        <button style={{
          ...baseInput, cursor: "pointer", background: "#f9fafb", textAlign: "left",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ color: "#005bd3", fontSize: 13 }}>Select image</span>
        </button>
      );

    default:
      return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={baseInput} />;
  }
}

function PasswordProtectedUI({ shopDomain }) {
  return (
    <div style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb",
    }}>
      <div style={{ textAlign: "center", padding: 40, maxWidth: 420 }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="1.5" style={{ marginBottom: 12 }}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <h3 style={{ color: "#92400e", margin: "0 0 8px", fontSize: 16 }}>Store is password protected</h3>
        <p style={{ color: "#92400e", fontSize: 13, margin: "0 0 20px", lineHeight: 1.5 }}>
          Disable password protection to use the Visual Store Builder.
        </p>
        <a href={`https://${shopDomain}/admin/online_store/preferences`} target="_blank" rel="noopener noreferrer"
          style={{
            display: "inline-block", background: "#92400e", color: "#fff",
            padding: "10px 20px", borderRadius: 6, textDecoration: "none", fontSize: 13, fontWeight: 600,
          }}>
          Open Store Settings →
        </a>
      </div>
    </div>
  );
}

function SkeletonOverlay() {
  return (
    <div style={{
      position: "absolute", inset: 0, background: "#f3f4f6", zIndex: 5,
      display: "flex", flexDirection: "column", padding: 20, gap: 12,
    }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          height: i === 0 ? 60 : 40, borderRadius: 6,
          background: "linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 50%,#e5e7eb 75%)",
          backgroundSize: "400% 100%",
          animation: "skeletonShimmer 1.5s infinite",
        }} />
      ))}
      <style>{`@keyframes skeletonShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}

function MobileFrame() {
  return (
    <div style={{ position: "absolute", inset: -16, pointerEvents: "none", zIndex: 1 }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50)",
        width: 120, height: 24, background: "#1a1a1a", borderRadius: "0 0 16px 16px",
      }} />
      <div style={{
        position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)",
        width: 120, height: 4, background: "#1a1a1a", borderRadius: 2,
      }} />
    </div>
  );
}

function TabletFrame() {
  return (
    <div style={{
      position: "absolute", inset: -8, border: "3px solid #1a1a1a",
      borderRadius: 16, pointerEvents: "none", zIndex: 1,
    }} />
  );
}
