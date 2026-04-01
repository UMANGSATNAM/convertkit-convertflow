import { useState, useCallback, useEffect, useRef } from "react";
import type { TopBarProps } from "../../types/convertflow";

const PAGES = [
  { value: "/", label: "Home page" },
  { value: "/collections", label: "Collections" },
  { value: "/products", label: "Products" },
  { value: "/pages/about-us", label: "About us" },
  { value: "/pages/contact", label: "Contact" },
];

export default function TopBar({
  shopDomain, themeName,
  currentPage, onPageChange,
  hasChanges, saving, onSave,
  canUndo, canRedo, onUndo, onRedo,
  isPreviewMode, onTogglePreview
}: TopBarProps) {
  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLabel = PAGES.find((p) => p.value === currentPage)?.label || "Home page";
  const storeName = shopDomain ? shopDomain.replace(".myshopify.com", "").replace(/-/g, " ") : "My Store";
  const themeLabel = themeName || "Theme";

  const handlePageSelect = useCallback((val: string) => {
    onPageChange(val);
    setPageDropdownOpen(false);
  }, [onPageChange]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!pageDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pageDropdownOpen]);

  return (
    <header style={{
      height: 56, background: "#0F0F13", borderBottom: "1px solid #2A2A35",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 16px", flexShrink: 0, position: "relative", zIndex: 50,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* ── Left: Logo & Store ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, width: "33.33%" }}>
        {/* Store badge */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
            padding: "6px 8px", borderRadius: 6, transition: "background 150ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#2E2E38"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <div style={{
            width: 24, height: 24, background: "#008060", borderRadius: 4,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const }}>
            <span style={{ color: "#fff", fontWeight: 500, fontSize: 12, lineHeight: "1.2", textTransform: "capitalize" }}>{storeName}</span>
            <span style={{ color: "#9CA3AF", fontSize: 10, lineHeight: "1.2" }}>{themeLabel} — Live</span>
          </div>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 5l3 3 3-3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", color: "#9CA3AF", fontSize: 12 }}>
          <span>Themes</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ margin: "0 4px" }}>
            <path d="M4 3l3 3-3 3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ color: "#fff" }}>Customize</span>
        </div>
      </div>

      {/* ── Center: Page Selector ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "33.33%" }}>
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            onClick={() => setPageDropdownOpen(!pageDropdownOpen)}
            style={{
              background: "#2E2E38", padding: "6px 12px", borderRadius: 4,
              fontSize: 12, fontWeight: 500, color: "#fff", border: "1px solid #2A2A35",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              fontFamily: "inherit",
            }}
          >
            <span>{currentLabel}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 5l3 3 3-3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {pageDropdownOpen && (
            <div style={{
              position: "absolute", top: 36, left: "50%", transform: "translateX(-50%)",
              background: "#fff", borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)",
              padding: "4px 0", minWidth: 200, zIndex: 100,
            }}>
              {PAGES.map((page) => (
                <div key={page.value}
                  onClick={() => handlePageSelect(page.value)}
                  style={{
                    padding: "8px 14px", fontSize: 13, cursor: "pointer",
                    color: page.value === currentPage ? "#5C6AC4" : "#303030",
                    fontWeight: page.value === currentPage ? 600 : 400,
                    background: page.value === currentPage ? "#f0f0ff" : "transparent",
                  }}
                  onMouseEnter={(e) => { if (page.value !== currentPage) e.currentTarget.style.background = "#f4f4f4"; }}
                  onMouseLeave={(e) => { if (page.value !== currentPage) e.currentTarget.style.background = "transparent"; }}
                >
                  {page.label}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Unsaved changes indicator */}
        {hasChanges && (
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", marginLeft: 12,
          }} title="Unsaved changes" />
        )}
      </div>

      {/* ── Right: Actions ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, width: "33.33%" }}>
        {/* Undo */}
        <button style={{ ...iconBtnStyle, opacity: canUndo ? 1 : 0.3, cursor: canUndo ? "pointer" : "not-allowed" }}
          title="Undo" onClick={canUndo ? onUndo : undefined}
          onMouseEnter={(e) => { if (canUndo) e.currentTarget.style.background = "#2E2E38"; }}
          onMouseLeave={(e) => { if (canUndo) e.currentTarget.style.background = "transparent"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
          </svg>
        </button>
        {/* Redo */}
        <button style={{ ...iconBtnStyle, opacity: canRedo ? 1 : 0.3, cursor: canRedo ? "pointer" : "not-allowed" }}
          title="Redo" onClick={canRedo ? onRedo : undefined}
          onMouseEnter={(e) => { if (canRedo) e.currentTarget.style.background = "#2E2E38"; }}
          onMouseLeave={(e) => { if (canRedo) e.currentTarget.style.background = "transparent"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 7v6h-6" /><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13" />
          </svg>
        </button>

        <div style={{ height: 16, width: 1, background: "#2A2A35", margin: "0 4px" }} />

        {/* Preview */}
        <button 
          onClick={onTogglePreview}
          style={{
            ...iconBtnStyle, padding: "0 12px", gap: 8, fontSize: 12, fontWeight: 500, color: isPreviewMode ? "#fff" : "#9CA3AF",
            width: "auto", fontFamily: "inherit", background: isPreviewMode ? "#5C6AC4" : "transparent"
          }}
          onMouseEnter={(e) => { if (!isPreviewMode) { e.currentTarget.style.background = "#2E2E38"; e.currentTarget.style.color = "#fff"; } }}
          onMouseLeave={(e) => { if (!isPreviewMode) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9CA3AF"; } }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
          </svg>
          {isPreviewMode ? "Exit Preview" : "Preview"}
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          disabled={!hasChanges && !saving}
          style={{
            height: 32, padding: "0 16px", borderRadius: 8, border: "none", cursor: hasChanges ? "pointer" : "default",
            background: hasChanges ? "#008060" : "rgba(0,128,96,0.3)",
            color: "#fff", fontSize: 12, fontWeight: 500,
            boxShadow: hasChanges ? "0 1px 2px rgba(0,0,0,0.15)" : "none",
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "inherit", transition: "background 150ms",
          }}
          onMouseEnter={(e) => { if (hasChanges) e.currentTarget.style.background = "#006e52"; }}
          onMouseLeave={(e) => { if (hasChanges) e.currentTarget.style.background = "#008060"; }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </header>
  );
}

const iconBtnStyle: React.CSSProperties = {
  width: 32, height: 32, border: "none", background: "transparent",
  borderRadius: 6, cursor: "pointer", display: "flex",
  alignItems: "center", justifyContent: "center", transition: "background 150ms, color 150ms",
};
