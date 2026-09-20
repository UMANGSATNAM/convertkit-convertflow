// app/builder/components/TopBar.tsx
import React from "react";
import type { DeviceViewport } from "../types";

interface TopBarProps {
  pageTitle: string;
  onPageTitleChange: (title: string) => void;
  status: "DRAFT" | "PUBLISHED";
  viewport: DeviceViewport;
  onViewportChange: (viewport: DeviceViewport) => void;
  isLivePreview: boolean;
  onToggleLivePreview: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  isSaving: boolean;
  onPublish: () => void;
  isPublishing: boolean;
  onBack: () => void;
  handle: string;
  shopDomain?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  pageTitle,
  onPageTitleChange,
  status,
  viewport,
  onViewportChange,
  isLivePreview,
  onToggleLivePreview,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  isSaving,
  onPublish,
  isPublishing,
  onBack,
  handle,
  shopDomain,
}) => {
  return (
    <header
      style={{
        height: "56px",
        backgroundColor: "#0f172a",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: "1px solid #1e293b",
        userSelect: "none",
        zIndex: 50,
      }}
    >
      {/* Left: Back + Title + Status */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "260px" }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "13px",
            padding: "6px 8px",
            borderRadius: "6px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
        >
          ← Pages
        </button>

        <div style={{ height: "18px", width: "1px", backgroundColor: "#334155" }} />

        <input
          type="text"
          value={pageTitle}
          onChange={(e) => onPageTitleChange(e.target.value)}
          placeholder="Untitled Page"
          style={{
            background: "transparent",
            border: "1px solid transparent",
            color: "#ffffff",
            fontWeight: "700",
            fontSize: "14px",
            padding: "4px 8px",
            borderRadius: "4px",
            outline: "none",
            maxWidth: "180px",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#38bdf8")}
          onBlur={(e) => (e.target.style.borderColor = "transparent")}
        />

        <span
          style={{
            fontSize: "11px",
            fontWeight: "700",
            padding: "2px 8px",
            borderRadius: "999px",
            backgroundColor: status === "PUBLISHED" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
            color: status === "PUBLISHED" ? "#34d399" : "#fbbf24",
            border: `1px solid ${status === "PUBLISHED" ? "rgba(16, 185, 129, 0.4)" : "rgba(245, 158, 11, 0.4)"}`,
          }}
        >
          {status}
        </span>
      </div>

      {/* Center: Responsive Viewport Switcher + Undo/Redo */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Undo/Redo */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            style={{
              background: "transparent",
              border: "none",
              color: canUndo ? "#cbd5e1" : "#475569",
              cursor: canUndo ? "pointer" : "default",
              padding: "6px 8px",
              borderRadius: "4px",
              fontSize: "13px",
            }}
          >
            ↩ Undo
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            style={{
              background: "transparent",
              border: "none",
              color: canRedo ? "#cbd5e1" : "#475569",
              cursor: canRedo ? "pointer" : "default",
              padding: "6px 8px",
              borderRadius: "4px",
              fontSize: "13px",
            }}
          >
            ↪ Redo
          </button>
        </div>

        {/* Viewport Tabs */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#1e293b",
            padding: "3px",
            borderRadius: "8px",
            border: "1px solid #334155",
          }}
        >
          <button
            type="button"
            onClick={() => onViewportChange("desktop")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              fontSize: "12px",
              fontWeight: "600",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              backgroundColor: viewport === "desktop" ? "#0284c7" : "transparent",
              color: viewport === "desktop" ? "#ffffff" : "#94a3b8",
              transition: "all 0.15s ease",
            }}
          >
            <span>🖥️</span> Desktop
          </button>
          <button
            type="button"
            onClick={() => onViewportChange("tablet")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              fontSize: "12px",
              fontWeight: "600",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              backgroundColor: viewport === "tablet" ? "#0284c7" : "transparent",
              color: viewport === "tablet" ? "#ffffff" : "#94a3b8",
              transition: "all 0.15s ease",
            }}
          >
            <span>💻</span> Tablet
          </button>
          <button
            type="button"
            onClick={() => onViewportChange("mobile")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              fontSize: "12px",
              fontWeight: "600",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              backgroundColor: viewport === "mobile" ? "#0284c7" : "transparent",
              color: viewport === "mobile" ? "#ffffff" : "#94a3b8",
              transition: "all 0.15s ease",
            }}
          >
            <span>📱</span> Mobile
          </button>
        </div>

        {/* Edit / Preview Mode */}
        <button
          type="button"
          onClick={onToggleLivePreview}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: "600",
            backgroundColor: isLivePreview ? "#10b981" : "#334155",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          <span>{isLivePreview ? "✏️ Edit Mode" : "👁️ Preview"}</span>
        </button>
      </div>

      {/* Right: Save Draft & Publish */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {status === "PUBLISHED" && shopDomain && (
          <a
            href={`https://${shopDomain}/pages/${handle}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#38bdf8",
              fontSize: "12px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 10px",
              borderRadius: "6px",
              backgroundColor: "rgba(56, 189, 248, 0.1)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
            }}
          >
            View Live Store ↗
          </a>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          style={{
            backgroundColor: "#334155",
            color: "#ffffff",
            border: "1px solid #475569",
            padding: "7px 14px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: isSaving ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>💾</span>
          <span>{isSaving ? "Saving..." : "Save Draft"}</span>
        </button>

        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          style={{
            backgroundColor: "#0284c7",
            color: "#ffffff",
            border: "none",
            padding: "8px 18px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "700",
            cursor: isPublishing ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 8px rgba(2, 132, 199, 0.4)",
          }}
        >
          <span>🚀</span>
          <span>{isPublishing ? "Publishing..." : "Publish to Shopify"}</span>
        </button>
      </div>
    </header>
  );
};
