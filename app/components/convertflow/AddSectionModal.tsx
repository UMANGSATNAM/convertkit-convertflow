import { useState, useMemo } from "react";
import type { AddSectionModalProps, ConvertKitTemplate, ShopifySection } from "../../types/convertflow";

const CATEGORIES: Array<{ key: string; label: string }> = [
  { key: "header", label: "Headers" },
  { key: "hero", label: "Hero and banners" },
  { key: "banner", label: "Promotional" },
  { key: "collection", label: "Collections" },
  { key: "social-proof", label: "Social proof" },
  { key: "footer", label: "Footers" },
];

export default function AddSectionModal({
  visible, position, sections, templates, onClose, onSelectTemplate, onSelectSection,
}: AddSectionModalProps) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"theme" | "convertkit">("theme");

  const filteredSections = useMemo(() => {
    if (!search) return sections;
    const q = search.toLowerCase();
    return sections.filter((s) => s.name.toLowerCase().includes(q) || s.schema?.name?.toLowerCase().includes(q));
  }, [sections, search]);

  const filteredTemplates = useMemo(() => {
    if (!search) return templates;
    const q = search.toLowerCase();
    return templates.filter((t) => t.name.toLowerCase().includes(q) || t.category.includes(q) || t.niche.toLowerCase().includes(q));
  }, [templates, search]);

  const groupedTemplates = useMemo(() => {
    const groups: Record<string, ConvertKitTemplate[]> = {};
    for (const t of filteredTemplates) {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    }
    return groups;
  }, [filteredTemplates]);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 999 }} />

      {/* Modal */}
      <div style={{
        position: "fixed", top: Math.min(position.top, window.innerHeight - 500),
        left: Math.min(position.left, window.innerWidth - 380),
        width: 360, maxHeight: 480, background: "#fff", borderRadius: 8,
        boxShadow: "0 4px 16px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)",
        zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Search */}
        <div style={{ padding: "8px 10px", borderBottom: "1px solid #e3e3e3", flexShrink: 0 }}>
          <div style={{ position: "relative" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: "absolute", left: 10, top: 10 }}>
              <circle cx="7" cy="7" r="5" stroke="#8a8a8a" strokeWidth="1.3" />
              <path d="M11 11l3 3" stroke="#8a8a8a" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sections"
              style={{
                width: "100%", height: 36, border: "none", background: "#f4f4f4", borderRadius: 6,
                padding: "0 10px 0 32px", fontSize: 13, outline: "none", boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #e3e3e3", flexShrink: 0 }}>
          {(["theme", "convertkit"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "8px 0", border: "none", background: "transparent", cursor: "pointer",
              fontSize: 13, fontFamily: "inherit",
              color: tab === t ? "#1a1a1a" : "#6b6b6b",
              fontWeight: tab === t ? 600 : 400,
              borderBottom: tab === t ? "2px solid #1a1a1a" : "2px solid transparent",
            }}>
              {t === "theme" ? "Theme sections" : "ConvertKit"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {tab === "theme" ? (
            filteredSections.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", color: "#6b6b6b", fontSize: 13 }}>No sections found</div>
            ) : (
              filteredSections.map((s) => (
                <div key={s.key} onClick={() => { onSelectSection(s.key); onClose(); }}
                  style={{ height: 40, padding: "0 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: "#303030" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f4f4"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ width: 40, height: 32, borderRadius: 4, background: "#f4f4f4", flexShrink: 0 }} />
                  {s.schema?.name || s.name}
                </div>
              ))
            )
          ) : (
            Object.entries(groupedTemplates).length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", color: "#6b6b6b", fontSize: 13 }}>No templates found</div>
            ) : (
              CATEGORIES.map((cat) => {
                const items = groupedTemplates[cat.key];
                if (!items?.length) return null;
                return (
                  <div key={cat.key}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#6b6b6b", padding: "12px 14px 6px 14px" }}>
                      {cat.label}
                    </div>
                    {items.map((t) => (
                      <div key={t.id} onClick={() => { onSelectTemplate(t.id); onClose(); }}
                        style={{ height: 40, padding: "0 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: "#303030" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f4f4"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <div style={{ width: 40, height: 32, borderRadius: 4, background: "#f4f4f4", flexShrink: 0 }} />
                        <span style={{ flex: 1 }}>{t.name}</span>
                        <span style={{
                          fontSize: 10, padding: "2px 6px", borderRadius: 4,
                          background: "#f0f0f0", color: "#6b6b6b", textTransform: "capitalize",
                        }}>{t.niche}</span>
                      </div>
                    ))}
                  </div>
                );
              })
            )
          )}
        </div>
      </div>
    </>
  );
}
