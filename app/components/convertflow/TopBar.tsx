import { useState, useCallback } from "react";
import type { TopBarProps, ViewportMode } from "../../types/convertflow";

const PAGES = [
  { value: "/", label: "Home page" },
  { value: "/collections", label: "Collections" },
  { value: "/products", label: "Products" },
  { value: "/pages/about-us", label: "About us" },
  { value: "/pages/contact", label: "Contact" },
];

// SVG Icons
function DesktopIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="3" width="16" height="11" rx="1.5" stroke={active ? "#fff" : "#8a8a8a"} strokeWidth="1.5" />
      <path d="M7 17h6M10 14v3" stroke={active ? "#fff" : "#8a8a8a"} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TabletIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="1" width="14" height="18" rx="2" stroke={active ? "#fff" : "#8a8a8a"} strokeWidth="1.5" />
      <circle cx="10" cy="16" r="1" fill={active ? "#fff" : "#8a8a8a"} />
    </svg>
  );
}

function MobileIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="5" y="1" width="10" height="18" rx="2" stroke={active ? "#fff" : "#8a8a8a"} strokeWidth="1.5" />
      <path d="M8 16h4" stroke={active ? "#fff" : "#8a8a8a"} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function TopBar({
  currentPage, onPageChange, viewport, onViewportChange,
  hasChanges, saving, onSave,
}: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);

  const currentLabel = PAGES.find((p) => p.value === currentPage)?.label || "Home page";

  const handlePageSelect = useCallback((val: string) => {
    onPageChange(val);
    setPageDropdownOpen(false);
  }, [onPageChange]);

  const viewports: { id: ViewportMode; Icon: typeof DesktopIcon }[] = [
    { id: "desktop", Icon: DesktopIcon },
    { id: "tablet", Icon: TabletIcon },
    { id: "mobile", Icon: MobileIcon },
  ];

  return (
    <div style={{
      height: 52, background: "#1a1a1a", display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 12px", flexShrink: 0, position: "relative",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Left side */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, zIndex: 2 }}>
        {/* Three-dot menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            width: 32, height: 32, border: "none", background: "transparent",
            color: "#8a8a8a", cursor: "pointer", borderRadius: 6, fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          ⋯
        </button>
        {menuOpen && (
          <div style={{
            position: "absolute", top: 44, left: 8, background: "#fff", borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)",
            padding: "4px 0", minWidth: 200, zIndex: 100,
          }}>
            {["Preview store", "Keyboard shortcuts", "Contact support"].map((item) => (
              <div key={item}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "8px 14px", fontSize: 13, color: "#303030", cursor: "pointer",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f4f4"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {item}
              </div>
            ))}
          </div>
        )}

        {/* Page selector */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setPageDropdownOpen(!pageDropdownOpen)}
            style={{
              height: 32, padding: "0 10px", background: "transparent", border: "none",
              color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, borderRadius: 6,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            {currentLabel}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 4l3 3 3-3" stroke="#8a8a8a" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {pageDropdownOpen && (
            <div style={{
              position: "absolute", top: 36, left: 0, background: "#fff", borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)",
              padding: "4px 0", minWidth: 200, zIndex: 100,
            }}>
              {PAGES.map((page) => (
                <div key={page.value}
                  onClick={() => handlePageSelect(page.value)}
                  style={{
                    padding: "8px 14px", fontSize: 13, cursor: "pointer",
                    color: page.value === currentPage ? "#005bd3" : "#303030",
                    fontWeight: page.value === currentPage ? 600 : 400,
                    background: page.value === currentPage ? "#e8f0fe" : "transparent",
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
      </div>

      {/* Center — viewport toggles */}
      <div style={{
        position: "absolute", left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 2,
      }}>
        {viewports.map(({ id, Icon }) => (
          <button
            key={id}
            onClick={() => onViewportChange(id)}
            style={{
              width: 36, height: 36, border: "none", borderRadius: 6, cursor: "pointer",
              background: viewport === id ? "rgba(255,255,255,0.12)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Icon active={viewport === id} />
          </button>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, zIndex: 2 }}>
        {/* Undo */}
        <button style={iconBtnStyle} title="Undo">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M4 8l4-4M4 8l4 4M4 8h10a4 4 0 010 8H9" stroke="#8a8a8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {/* Redo */}
        <button style={iconBtnStyle} title="Redo">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M16 8l-4-4M16 8l-4 4M16 8H6a4 4 0 000 8h5" stroke="#8a8a8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {/* Preview (eye) */}
        <button style={iconBtnStyle} title="Preview">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" stroke="#8a8a8a" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="3" stroke="#8a8a8a" strokeWidth="1.5" />
          </svg>
        </button>
        {/* Save */}
        <button
          onClick={onSave}
          disabled={!hasChanges && !saving}
          style={{
            height: 32, padding: "0 14px", borderRadius: 6, border: "none", cursor: hasChanges ? "pointer" : "default",
            background: hasChanges ? "#fff" : "rgba(255,255,255,0.08)",
            color: hasChanges ? "#1a1a1a" : "#8a8a8a",
            fontSize: 13, fontWeight: 600, marginLeft: 4,
          }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  width: 32, height: 32, border: "none", background: "transparent",
  borderRadius: 6, cursor: "pointer", display: "flex",
  alignItems: "center", justifyContent: "center",
};
