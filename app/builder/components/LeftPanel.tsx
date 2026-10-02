import React, { useState } from "react";
import { ELEMENT_PALETTE, PREBUILT_SECTIONS, PREBUILT_URGENCY_SECTIONS } from "../default-templates";
import type { Block, Section, PageSchema } from "../types";

interface LeftPanelProps {
  onAddBlock: (block: Block) => void;
  onAddSection: (section: Section) => void;
  pageSchema: PageSchema;
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onDeleteBlock: (id: string) => void;
  onDeleteSection: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  onAddBlock,
  onAddSection,
  pageSchema,
  selectedBlockId,
  onSelectBlock,
  onDeleteBlock,
  onDeleteSection,
  isOpen,
  onToggle,
}) => {
  const [activeTab, setActiveTab] = useState<"elements" | "sections" | "urgency" | "layers">("elements");
  const [activeCategory, setActiveCategory] = useState<"all" | "basic" | "product" | "cro" | "layout">("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) {
    return (
      <div
        style={{
          width: "44px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "12px",
          gap: "12px",
        }}
      >
        <button
          type="button"
          onClick={onToggle}
          title="Open Library"
          style={{
            background: "none",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ▶
        </button>
      </div>
    );
  }

  const filteredElements = ELEMENT_PALETTE.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <aside
      style={{
        width: "320px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 56px)",
        boxSizing: "border-box",
        overflow: "hidden",
        zIndex: 40,
      }}
    >
      {/* Top Header & Tabs */}
      <div style={{ borderBottom: "1px solid #e2e8f0", padding: "12px 14px 0 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            PageFly Studio Library
          </span>
          <button
            type="button"
            onClick={onToggle}
            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "14px" }}
            title="Collapse Sidebar"
          >
            ◀
          </button>
        </div>

        {/* Tab navigation */}
        <div style={{ display: "flex", gap: "2px" }}>
          <button
            type="button"
            onClick={() => setActiveTab("elements")}
            style={{
              flex: 1,
              padding: "7px 0",
              border: "none",
              borderBottom: activeTab === "elements" ? "2px solid #0284c7" : "2px solid transparent",
              background: "none",
              fontSize: "12px",
              fontWeight: activeTab === "elements" ? "700" : "500",
              color: activeTab === "elements" ? "#0284c7" : "#64748b",
              cursor: "pointer",
            }}
          >
            🧱 Elements
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sections")}
            style={{
              flex: 1,
              padding: "7px 0",
              border: "none",
              borderBottom: activeTab === "sections" ? "2px solid #0284c7" : "2px solid transparent",
              background: "none",
              fontSize: "12px",
              fontWeight: activeTab === "sections" ? "700" : "500",
              color: activeTab === "sections" ? "#0284c7" : "#64748b",
              cursor: "pointer",
            }}
          >
            📦 Sections
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("urgency")}
            style={{
              flex: 1,
              padding: "7px 0",
              border: "none",
              borderBottom: activeTab === "urgency" ? "2px solid #e11d48" : "2px solid transparent",
              background: "none",
              fontSize: "12px",
              fontWeight: activeTab === "urgency" ? "700" : "500",
              color: activeTab === "urgency" ? "#e11d48" : "#64748b",
              cursor: "pointer",
            }}
          >
            ⚡ Urgency
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("layers")}
            style={{
              flex: 1,
              padding: "7px 0",
              border: "none",
              borderBottom: activeTab === "layers" ? "2px solid #0284c7" : "2px solid transparent",
              background: "none",
              fontSize: "12px",
              fontWeight: activeTab === "layers" ? "700" : "500",
              color: activeTab === "layers" ? "#0284c7" : "#64748b",
              cursor: "pointer",
            }}
          >
            🌲 Layers
          </button>
        </div>
      </div>

      {/* Tab 1: Elements */}
      {activeTab === "elements" && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          {/* Search bar */}
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #f1f5f9" }}>
            <input
              type="text"
              placeholder="Search elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "13px",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: "6px", padding: "8px 14px", overflowX: "auto", borderBottom: "1px solid #f1f5f9" }}>
            {(["all", "basic", "product", "cro", "layout"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: "600",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: activeCategory === cat ? "#0284c7" : "#f1f5f9",
                  color: activeCategory === cat ? "#ffffff" : "#475569",
                  whiteSpace: "nowrap",
                  textTransform: "capitalize",
                }}
              >
                {cat === "all" ? "All" : cat === "cro" ? "CRO / Boosters" : cat}
              </button>
            ))}
          </div>

          {/* Elements List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {filteredElements.map((item) => (
                <div
                  key={item.type}
                  onClick={() => onAddBlock(item.defaultBlock())}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "12px 10px",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "6px",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#0284c7";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 6px -1px rgb(0 0 0 / 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span style={{ fontSize: "24px" }}>{item.icon}</span>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{item.title}</span>
                  <span style={{ fontSize: "10px", color: "#64748b", lineHeight: "1.3" }}>{item.description}</span>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: "#0284c7", marginTop: "4px" }}>+ Click to Add</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Prebuilt Sections */}
      {activeTab === "sections" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "12px" }}>
            Click any high-converting section to insert it directly into your page layout:
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {PREBUILT_SECTIONS.map((sec) => (
              <div
                key={sec.id}
                onClick={() => onAddSection(sec.create())}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "14px",
                  backgroundColor: "#f8fafc",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#0284c7";
                  e.currentTarget.style.backgroundColor = "#f0f9ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                  {sec.title}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px" }}>
                  Category: <span style={{ textTransform: "uppercase", fontWeight: "600" }}>{sec.category}</span>
                </div>
                <div style={{ display: "inline-block", fontSize: "11px", fontWeight: "700", color: "#0284c7" }}>
                  + Insert Section Into Page →
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Urgency & Scarcity Boosters */}
      {activeTab === "urgency" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
          <div style={{
            background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
            border: "1px solid #fecdd3",
            borderRadius: "8px",
            padding: "10px 12px",
            marginBottom: "14px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <span style={{ fontSize: "14px" }}>⚡</span>
              <span style={{ fontSize: "12px", fontWeight: "800", color: "#9f1239", textTransform: "uppercase" }}>
                Emergency Urgency Suite
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "11px", color: "#881337", lineHeight: "1.4" }}>
              Insert high-converting urgency creators proven to reduce cart abandonment and increase conversion velocity.
            </p>
          </div>

          <div style={{ fontSize: "11px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
            Prebuilt Urgency Sections (1-Click Add):
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {PREBUILT_URGENCY_SECTIONS.map((sec) => (
              <div
                key={sec.id}
                onClick={() => onAddSection(sec.create())}
                style={{
                  border: "1px solid #fecdd3",
                  borderRadius: "8px",
                  padding: "12px",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#e11d48";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(225, 29, 72, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#fecdd3";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>
                    {sec.title}
                  </span>
                  <span style={{
                    fontSize: "9px",
                    fontWeight: "800",
                    background: "#ffe4e6",
                    color: "#e11d48",
                    padding: "2px 6px",
                    borderRadius: "999px",
                  }}>
                    HIGH CRO
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px" }}>
                  {sec.id === "sec_urgency_flash_bar"
                    ? "Sticky countdown bar with storewide discount and coupon code"
                    : sec.id === "sec_urgency_stock_scarcity"
                    ? "Live low-stock alert with real-time remaining inventory progress meter"
                    : sec.id === "sec_urgency_live_proof"
                    ? "Verified real-time customer purchase notification badge"
                    : sec.id === "sec_urgency_cart_timer"
                    ? "Locked cart reservation countdown timer banner"
                    : "Floating bottom sticky add-to-cart bar with 1-click checkout"}
                </div>
                <div style={{ display: "inline-block", fontSize: "11px", fontWeight: "700", color: "#e11d48" }}>
                  + Insert Section Into Canvas →
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: "11px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "16px", marginBottom: "8px" }}>
            Urgency Elements (Add to Selected Column):
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {ELEMENT_PALETTE.filter((el) => el.category === "cro").map((el) => (
              <div
                key={el.type}
                onClick={() => onAddBlock(el.defaultBlock())}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  padding: "10px 8px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "#ffffff",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#e11d48";
                  e.currentTarget.style.backgroundColor = "#fff1f2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.backgroundColor = "#ffffff";
                }}
              >
                <div style={{ fontSize: "20px", marginBottom: "4px" }}>{el.icon}</div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#0f172a" }}>{el.title}</div>
                <div style={{ fontSize: "10px", color: "#e11d48", fontWeight: "600", marginTop: "2px" }}>+ Add Element</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Layers / Tree */}
      {activeTab === "layers" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>
            Page Hierarchy Tree ({pageSchema.sections.length} Sections):
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {pageSchema.sections.map((section, sIdx) => (
              <div
                key={section.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  backgroundColor: "#ffffff",
                  overflow: "hidden",
                }}
              >
                {/* Section Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    backgroundColor: "#f8fafc",
                    borderBottom: "1px solid #f1f5f9",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#0f172a",
                  }}
                >
                  <span>📦 Section {sIdx + 1}: {section.title}</span>
                  <button
                    type="button"
                    onClick={() => onDeleteSection(section.id)}
                    title="Delete section"
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "12px" }}
                  >
                    🗑️
                  </button>
                </div>

                {/* Section Blocks */}
                <div style={{ padding: "6px 8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {section.columns.flatMap((col) => col.blocks).map((block) => {
                    const isSelected = selectedBlockId === block.id;
                    return (
                      <div
                        key={block.id}
                        onClick={() => onSelectBlock(block.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "6px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer",
                          backgroundColor: isSelected ? "#e0f2fe" : "#ffffff",
                          border: isSelected ? "1px solid #38bdf8" : "1px solid transparent",
                          color: isSelected ? "#0369a1" : "#334155",
                          fontWeight: isSelected ? "700" : "500",
                        }}
                      >
                        <span>• {block.label || block.type}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteBlock(block.id);
                          }}
                          style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "11px" }}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
