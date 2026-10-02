// app/builder/components/Canvas.tsx
import React from "react";
import type { PageSchema, Block, Section, DeviceViewport } from "../types";
import { BlockRenderer } from "./BlockRenderer";

interface CanvasProps {
  pageSchema: PageSchema;
  viewport: DeviceViewport;
  isLivePreview: boolean;
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onMoveBlock: (blockId: string, direction: "up" | "down") => void;
  onDuplicateBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onOpenAddModal: (sectionId: string, columnId: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  pageSchema,
  viewport,
  isLivePreview,
  selectedBlockId,
  onSelectBlock,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onOpenAddModal,
}) => {
  // Determine width based on viewport
  const getContainerWidth = () => {
    switch (viewport) {
      case "mobile":
        return "390px";
      case "tablet":
        return "768px";
      case "laptop":
        return "1024px";
      case "desktop":
      default:
        return "100%";
    }
  };

  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";

  return (
    <main
      style={{
        flex: 1,
        height: "calc(100vh - 56px)",
        backgroundColor: "#f1f5f9",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: isMobile ? "32px 16px" : isTablet ? "24px 16px" : "0",
        boxSizing: "border-box",
        position: "relative",
      }}
      onClick={() => onSelectBlock(null)}
    >
      {/* Device frame container */}
      <div
        style={{
          width: getContainerWidth(),
          maxWidth: viewport === "desktop" ? "1200px" : undefined,
          backgroundColor: pageSchema.globalStyles?.backgroundColor || "#ffffff",
          fontFamily: pageSchema.globalStyles?.fontFamily || "inherit",
          color: pageSchema.globalStyles?.textColor || "#1e293b",
          boxShadow: isMobile || isTablet ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "none",
          borderRadius: isMobile ? "36px" : isTablet ? "16px" : "0",
          border: isMobile ? "8px solid #0f172a" : isTablet ? "4px solid #334155" : "none",
          minHeight: "100%",
          boxSizing: "border-box",
          position: "relative",
          overflow: isMobile ? "hidden" : "visible",
          transition: "all 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile speaker notch simulation */}
        {isMobile && !isLivePreview && (
          <div
            style={{
              height: "20px",
              backgroundColor: "#0f172a",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ width: "60px", height: "4px", backgroundColor: "#334155", borderRadius: "999px" }} />
          </div>
        )}

        {/* Page Content */}
        {pageSchema.sections.map((section, sIdx) => (
          <section
            key={section.id}
            style={{
              paddingTop: section.styles?.paddingTop !== undefined ? `${section.styles.paddingTop}px` : "32px",
              paddingBottom: section.styles?.paddingBottom !== undefined ? `${section.styles.paddingBottom}px` : "32px",
              backgroundColor: section.styles?.backgroundColor || "transparent",
              position: "relative",
              boxSizing: "border-box",
              borderBottom: !isLivePreview ? "1px dashed #e2e8f0" : "none",
            }}
          >
            {/* Section label in edit mode */}
            {!isLivePreview && (
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  left: "12px",
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  userSelect: "none",
                }}
              >
                Section {sIdx + 1}: {section.title}
              </div>
            )}

            <div
              style={{
                maxWidth: section.settings?.containerMaxWidth || "1140px",
                margin: "0 auto",
                padding: "0 16px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  margin: "0 -12px",
                  boxSizing: "border-box",
                }}
              >
                {section.columns.map((column) => {
                  const colWidthPct = viewport === "mobile" ? 100 : column.width ? (column.width / 12) * 100 : 100;
                  return (
                    <div
                      key={column.id}
                      style={{
                        flex: `0 0 ${colWidthPct}%`,
                        maxWidth: `${colWidthPct}%`,
                        boxSizing: "border-box",
                        padding: "0 12px",
                        position: "relative",
                      }}
                    >
                      {column.blocks.map((block) => {
                        const isSelected = selectedBlockId === block.id;
                        return (
                          <div
                            key={block.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectBlock(block.id);
                            }}
                            style={{
                              position: "relative",
                              cursor: !isLivePreview ? "pointer" : "default",
                              outline: isSelected && !isLivePreview ? "2px solid #0284c7" : "none",
                              outlineOffset: "2px",
                              borderRadius: "4px",
                              transition: "outline 0.1s ease",
                            }}
                            onMouseEnter={(e) => {
                              if (!isLivePreview && !isSelected) {
                                e.currentTarget.style.outline = "1px dashed #38bdf8";
                                e.currentTarget.style.outlineOffset = "2px";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isLivePreview && !isSelected) {
                                e.currentTarget.style.outline = "none";
                              }
                            }}
                          >
                            {/* Floating Toolbar when selected */}
                            {isSelected && !isLivePreview && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "-34px",
                                  right: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "2px",
                                  backgroundColor: "#0f172a",
                                  padding: "3px 6px",
                                  borderRadius: "6px",
                                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                                  zIndex: 30,
                                  userSelect: "none",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span style={{ fontSize: "11px", fontWeight: "700", color: "#38bdf8", paddingRight: "4px" }}>
                                  {block.label || block.type}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onMoveBlock(block.id, "up")}
                                  title="Move Up"
                                  style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", fontSize: "11px", padding: "2px 4px" }}
                                >
                                  ▲
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onMoveBlock(block.id, "down")}
                                  title="Move Down"
                                  style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", fontSize: "11px", padding: "2px 4px" }}
                                >
                                  ▼
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDuplicateBlock(block.id)}
                                  title="Duplicate"
                                  style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", fontSize: "11px", padding: "2px 4px" }}
                                >
                                  📋
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeleteBlock(block.id)}
                                  title="Delete"
                                  style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "11px", padding: "2px 4px" }}
                                >
                                  🗑️
                                </button>
                              </div>
                            )}

                            {/* Render Block */}
                            <BlockRenderer block={block} isInteractive={isLivePreview} />
                          </div>
                        );
                      })}

                      {/* Add Block button inside column */}
                      {!isLivePreview && (
                        <div style={{ textAlign: "center", margin: "10px 0" }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenAddModal(section.id, column.id);
                            }}
                            style={{
                              background: "transparent",
                              border: "1px dashed #cbd5e1",
                              borderRadius: "6px",
                              color: "#64748b",
                              padding: "6px 14px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#0284c7";
                              e.currentTarget.style.color = "#0284c7";
                              e.currentTarget.style.backgroundColor = "#f0f9ff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#cbd5e1";
                              e.currentTarget.style.color = "#64748b";
                              e.currentTarget.style.backgroundColor = "transparent";
                            }}
                          >
                            + Add Block
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};
