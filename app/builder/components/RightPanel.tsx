// app/builder/components/RightPanel.tsx
import React, { useState } from "react";
import type { Block, PageSchema, LayoutMode } from "../types";

interface RightPanelProps {
  selectedBlock: Block | null;
  onUpdateBlock: (updatedBlock: Block) => void;
  onDeleteBlock: (id: string) => void;
  onDeselectBlock: () => void;
  pageSchema: PageSchema;
  onUpdatePageSchema: (updatedSchema: PageSchema) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  onDeleteBlock,
  onDeselectBlock,
  pageSchema,
  onUpdatePageSchema,
  isOpen,
  onToggle,
}) => {
  const [activeTab, setActiveTab] = useState<"content" | "styles" | "visibility">("content");

  if (!isOpen) {
    return (
      <div
        style={{
          width: "40px",
          backgroundColor: "#ffffff",
          borderLeft: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "12px",
        }}
      >
        <button
          type="button"
          onClick={onToggle}
          title="Open Inspector"
          style={{
            background: "none",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            width: "30px",
            height: "30px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          ◀
        </button>
      </div>
    );
  }

  const updateSetting = (key: string, value: any) => {
    if (!selectedBlock) return;
    onUpdateBlock({
      ...selectedBlock,
      settings: {
        ...selectedBlock.settings,
        [key]: value,
      },
    });
  };

  const updateStyle = (key: string, value: any) => {
    if (!selectedBlock) return;
    onUpdateBlock({
      ...selectedBlock,
      styles: {
        ...selectedBlock.styles,
        [key]: value,
      },
    });
  };

  const updateVisibility = (key: "hideOnDesktop" | "hideOnMobile", value: boolean) => {
    if (!selectedBlock) return;
    onUpdateBlock({
      ...selectedBlock,
      visibility: {
        ...selectedBlock.visibility,
        [key]: value,
      },
    });
  };

  return (
    <aside
      style={{
        width: "320px",
        backgroundColor: "#ffffff",
        borderLeft: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 56px)",
        boxSizing: "border-box",
        overflow: "hidden",
        zIndex: 40,
      }}
    >
      {selectedBlock ? (
        /* BLOCK INSPECTOR */
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          {/* Header */}
          <div
            style={{
              padding: "12px 14px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f8fafc",
            }}
          >
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#0284c7", textTransform: "uppercase" }}>
                Selected Block
              </span>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>
                {selectedBlock.label || selectedBlock.type}
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                type="button"
                onClick={() => onDeleteBlock(selectedBlock.id)}
                title="Delete Block"
                style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "12px" }}
              >
                🗑️
              </button>
              <button
                type="button"
                onClick={onDeselectBlock}
                title="Deselect"
                style={{ background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "12px" }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Inspector Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
            {(["content", "styles", "visibility"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  border: "none",
                  borderBottom: activeTab === tab ? "2px solid #0284c7" : "2px solid transparent",
                  background: "none",
                  fontSize: "12px",
                  fontWeight: activeTab === tab ? "700" : "500",
                  color: activeTab === tab ? "#0284c7" : "#64748b",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {tab === "content" ? "⚙️ Content" : tab === "styles" ? "🎨 Design" : "👁️ Visibility"}
              </button>
            ))}
          </div>

          {/* Tab Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* CONTENT TAB */}
            {activeTab === "content" && (
              <>
                {/* Text / Title settings */}
                {selectedBlock.settings?.text !== undefined && (
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                      Text Content
                    </label>
                    <textarea
                      rows={3}
                      value={selectedBlock.settings.text}
                      onChange={(e) => updateSetting("text", e.target.value)}
                      style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
                    />
                  </div>
                )}

                {/* HTML Tag */}
                {selectedBlock.settings?.tag !== undefined && (
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                      HTML Heading Tag
                    </label>
                    <select
                      value={selectedBlock.settings.tag}
                      onChange={(e) => updateSetting("tag", e.target.value)}
                      style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" }}
                    >
                      <option value="h1">H1 - Main Page Title</option>
                      <option value="h2">H2 - Section Header</option>
                      <option value="h3">H3 - Subheader</option>
                      <option value="h4">H4 - Small Heading</option>
                      <option value="p">P - Standard Paragraph</option>
                    </select>
                  </div>
                )}

                {/* Button URL */}
                {selectedBlock.settings?.url !== undefined && (
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                      Destination URL / Link
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.settings.url}
                      onChange={(e) => updateSetting("url", e.target.value)}
                      placeholder="e.g. /collections/all or #buy-now"
                      style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
                    />
                  </div>
                )}

                {/* Image Source */}
                {selectedBlock.settings?.src !== undefined && (
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.settings.src}
                      onChange={(e) => updateSetting("src", e.target.value)}
                      style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", marginBottom: "8px" }}
                    />
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                      Alt Text (SEO & Accessibility)
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.settings.alt || ""}
                      onChange={(e) => updateSetting("alt", e.target.value)}
                      placeholder="Descriptive text"
                      style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
                    />
                  </div>
                )}

                {/* Video URL */}
                {selectedBlock.settings?.embedUrl !== undefined && (
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                      YouTube / Vimeo Embed URL
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.settings.embedUrl}
                      onChange={(e) => updateSetting("embedUrl", e.target.value)}
                      style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
                    />
                  </div>
                )}

                {/* Product Price Inputs */}
                {selectedBlock.type === "product_price" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>Selling Price</label>
                      <input
                        type="text"
                        value={selectedBlock.settings.price || ""}
                        onChange={(e) => updateSetting("price", e.target.value)}
                        style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>Compare Price</label>
                      <input
                        type="text"
                        value={selectedBlock.settings.comparePrice || ""}
                        onChange={(e) => updateSetting("comparePrice", e.target.value)}
                        style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>
                )}

                {/* Countdown Timer Settings */}
                {selectedBlock.type === "countdown_timer" && (
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                      Banner Title
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.settings.title || ""}
                      onChange={(e) => updateSetting("title", e.target.value)}
                      style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", marginBottom: "10px" }}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: "600" }}>Hours</label>
                        <input
                          type="number"
                          value={selectedBlock.settings.hours || 0}
                          onChange={(e) => updateSetting("hours", Number(e.target.value))}
                          style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: "600" }}>Minutes</label>
                        <input
                          type="number"
                          value={selectedBlock.settings.minutes || 0}
                          onChange={(e) => updateSetting("minutes", Number(e.target.value))}
                          style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: "600" }}>Seconds</label>
                        <input
                          type="number"
                          value={selectedBlock.settings.seconds || 0}
                          onChange={(e) => updateSetting("seconds", Number(e.target.value))}
                          style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* STYLES TAB */}
            {activeTab === "styles" && (
              <>
                {/* Typography */}
                <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "14px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                    Typography
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "8px" }}>
                    <div>
                      <label style={{ fontSize: "11px", color: "#64748b" }}>Font Size</label>
                      <input
                        type="text"
                        placeholder="e.g. 18px"
                        value={selectedBlock.styles?.fontSize || ""}
                        onChange={(e) => updateStyle("fontSize", e.target.value)}
                        style={{ width: "100%", padding: "6px 8px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "12px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", color: "#64748b" }}>Font Weight</label>
                      <select
                        value={selectedBlock.styles?.fontWeight || "400"}
                        onChange={(e) => updateStyle("fontWeight", e.target.value)}
                        style={{ width: "100%", padding: "6px 8px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "12px" }}
                      >
                        <option value="400">Regular (400)</option>
                        <option value="500">Medium (500)</option>
                        <option value="600">Semi-Bold (600)</option>
                        <option value="700">Bold (700)</option>
                        <option value="800">Extra Bold (800)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "4px" }}>
                    {(["left", "center", "right"] as const).map((align) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => updateStyle("textAlign", align)}
                        style={{
                          flex: 1,
                          padding: "6px 0",
                          border: "1px solid #cbd5e1",
                          borderRadius: "4px",
                          backgroundColor: selectedBlock.styles?.textAlign === align ? "#0284c7" : "#ffffff",
                          color: selectedBlock.styles?.textAlign === align ? "#ffffff" : "#475569",
                          fontSize: "12px",
                          cursor: "pointer",
                          textTransform: "capitalize",
                        }}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "14px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                    Colors
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ fontSize: "11px", color: "#64748b" }}>Text Color</label>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                        <input
                          type="color"
                          value={selectedBlock.styles?.textColor || "#0f172a"}
                          onChange={(e) => updateStyle("textColor", e.target.value)}
                          style={{ width: "32px", height: "32px", border: "none", cursor: "pointer", borderRadius: "4px" }}
                        />
                        <input
                          type="text"
                          value={selectedBlock.styles?.textColor || ""}
                          onChange={(e) => updateStyle("textColor", e.target.value)}
                          style={{ flex: 1, padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px" }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", color: "#64748b" }}>Background</label>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                        <input
                          type="color"
                          value={selectedBlock.styles?.backgroundColor || "#ffffff"}
                          onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                          style={{ width: "32px", height: "32px", border: "none", cursor: "pointer", borderRadius: "4px" }}
                        />
                        <input
                          type="text"
                          value={selectedBlock.styles?.backgroundColor || ""}
                          onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                          style={{ flex: 1, padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spacing (Padding & Margin) */}
                <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "14px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                    Spacing (px)
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                    <div>
                      <label style={{ fontSize: "11px", color: "#64748b" }}>Padding Top</label>
                      <input
                        type="number"
                        value={selectedBlock.styles?.paddingTop || 0}
                        onChange={(e) => updateStyle("paddingTop", Number(e.target.value))}
                        style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "12px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", color: "#64748b" }}>Padding Bottom</label>
                      <input
                        type="number"
                        value={selectedBlock.styles?.paddingBottom || 0}
                        onChange={(e) => updateStyle("paddingBottom", Number(e.target.value))}
                        style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "12px" }}
                      />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div>
                      <label style={{ fontSize: "11px", color: "#64748b" }}>Margin Top</label>
                      <input
                        type="number"
                        value={selectedBlock.styles?.marginTop || 0}
                        onChange={(e) => updateStyle("marginTop", Number(e.target.value))}
                        style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "12px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", color: "#64748b" }}>Margin Bottom</label>
                      <input
                        type="number"
                        value={selectedBlock.styles?.marginBottom || 0}
                        onChange={(e) => updateStyle("marginBottom", Number(e.target.value))}
                        style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "12px" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Border & Corner Radius */}
                <div>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                    Corners & Border
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ fontSize: "11px", color: "#64748b" }}>Corner Radius</label>
                      <input
                        type="number"
                        value={selectedBlock.styles?.borderRadius || 0}
                        onChange={(e) => updateStyle("borderRadius", Number(e.target.value))}
                        style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "12px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", color: "#64748b" }}>Border Width</label>
                      <input
                        type="number"
                        value={selectedBlock.styles?.borderWidth || 0}
                        onChange={(e) => updateStyle("borderWidth", Number(e.target.value))}
                        style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "12px" }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* VISIBILITY TAB */}
            {activeTab === "visibility" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  Control which devices this block appears on:
                </span>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={Boolean(selectedBlock.visibility?.hideOnDesktop)}
                    onChange={(e) => updateVisibility("hideOnDesktop", e.target.checked)}
                  />
                  <span>Hide on Desktop screens</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={Boolean(selectedBlock.visibility?.hideOnMobile)}
                    onChange={(e) => updateVisibility("hideOnMobile", e.target.checked)}
                  />
                  <span>Hide on Mobile screens</span>
                </label>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* PAGE SETTINGS (ROOT INSPECTOR) */
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", padding: "14px" }}>
          <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "16px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
              Page Settings
            </span>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>
              General & SEO
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Page Title */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                Page Name
              </label>
              <input
                type="text"
                value={pageSchema.title}
                onChange={(e) => onUpdatePageSchema({ ...pageSchema, title: e.target.value })}
                style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            {/* URL Handle */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                URL Handle (/pages/...)
              </label>
              <input
                type="text"
                value={pageSchema.handle}
                onChange={(e) => onUpdatePageSchema({ ...pageSchema, handle: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "-") })}
                style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
              />
              <span style={{ fontSize: "11px", color: "#64748b", marginTop: "2px", display: "block" }}>
                Will live at: /pages/{pageSchema.handle}
              </span>
            </div>

            {/* Layout Mode */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                Layout Mode
              </label>
              <select
                value={pageSchema.layoutMode}
                onChange={(e) => onUpdatePageSchema({ ...pageSchema, layoutMode: e.target.value as LayoutMode })}
                style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" }}
              >
                <option value="FULL_PAGE_NO_CHROME">Full-Width Clean Landing Page (No Header/Footer)</option>
                <option value="THEME_CHROME">Theme Chrome (Show Store Header & Footer)</option>
              </select>
            </div>

            {/* SEO Title */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                SEO Meta Title
              </label>
              <input
                type="text"
                placeholder="Google Search Title"
                value={pageSchema.seoTitle || ""}
                onChange={(e) => onUpdatePageSchema({ ...pageSchema, seoTitle: e.target.value })}
                style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            {/* SEO Description */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                SEO Meta Description
              </label>
              <textarea
                rows={3}
                placeholder="Google Search snippet description..."
                value={pageSchema.seoDesc || ""}
                onChange={(e) => onUpdatePageSchema({ ...pageSchema, seoDesc: e.target.value })}
                style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            {/* Custom CSS */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                Custom CSS Override
              </label>
              <textarea
                rows={4}
                placeholder="/* .my-custom-class { ... } */"
                value={pageSchema.customCss || ""}
                onChange={(e) => onUpdatePageSchema({ ...pageSchema, customCss: e.target.value })}
                style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontFamily: "monospace", boxSizing: "border-box" }}
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
