import { useState, useCallback } from "react";
import type { LeftSidebarProps, ShopifySection } from "../../types/convertflow";
import SectionTreeItem from "./SectionTreeItem";
import ThemeSettingsPanel from "./ThemeSettingsPanel";

function AddSectionButton({ onClick }: { onClick: () => void }) {
  return (
    <div style={{ padding: 12, borderTop: "1px solid #2A2A35" }}>
      <button
        onClick={onClick}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, color: "#5C6AC4", padding: "8px 0", borderRadius: 4, fontSize: 12,
          fontWeight: 500, cursor: "pointer", border: "none", background: "transparent",
          transition: "background 150ms, color 150ms", fontFamily: "inherit",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#2E2E38"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5C6AC4"; }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" />
        </svg>
        Add section
      </button>
    </div>
  );
}

function SectionGroup({
  label, items, selectedKey, expandedSections, onSelect, onToggle, onToggleVisibility, draggable,
  onDragStart, onDragOver, onDragEnd, onDrop, dragOverIdx, onAddSection,
}: {
  label: string; items: ShopifySection[]; selectedKey: string | null;
  expandedSections: Record<string, boolean>; onSelect: (key: string) => void;
  onToggle: (key: string) => void; onToggleVisibility?: (key: string) => void; draggable: boolean;
  onDragStart?: (idx: number) => void;
  onDragOver?: (idx: number) => void;
  onDragEnd?: () => void;
  onDrop?: (idx: number) => void;
  dragOverIdx?: number | null;
  onAddSection?: (idx: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          padding: "6px 16px", fontSize: 11, fontWeight: 700, color: "#9CA3AF",
          textTransform: "uppercase", letterSpacing: "0.05em", display: "flex",
          alignItems: "center", justifyContent: "space-between", cursor: "pointer",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span>{label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 150ms" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      <div>
        {items.map((item, idx) => (
          <div
            key={item.key}
            draggable={draggable}
            onDragStart={(e) => {
              if (!draggable || !onDragStart) return;
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", String(idx));
              onDragStart(idx);
            }}
            onDragOver={(e) => {
              if (!draggable || !onDragOver) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              onDragOver(idx);
            }}
            onDrop={(e) => {
              if (!draggable || !onDrop) return;
              e.preventDefault();
              onDrop(idx);
            }}
            onDragEnd={() => { if (onDragEnd) onDragEnd(); }}
            onMouseEnter={() => setHoverIdx(idx)}
            onMouseLeave={() => setHoverIdx(null)}
            style={{ position: "relative" }}
          >
            {draggable && dragOverIdx === idx && (
              <div style={{
                position: "absolute", top: -1, left: 12, right: 12, height: 2,
                background: "#5C6AC4", borderRadius: 1, zIndex: 10,
                boxShadow: "0 0 4px rgba(92,106,196,0.5)",
              }} />
            )}
            <SectionTreeItem
              section={item}
              selected={item.key === selectedKey}
              expanded={!!expandedSections[item.key]}
              draggable={draggable}
              onSelect={onSelect}
              onToggle={onToggle}
              onToggleVisibility={onToggleVisibility ? onToggleVisibility : () => {}}
            />
            {draggable && onAddSection && hoverIdx === idx && (
              <div style={{
                position: "absolute", bottom: -8, left: 16, right: 16, height: 16, zIndex: 20,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <div 
                  onClick={(e) => { e.stopPropagation(); onAddSection(idx + 1); }}
                  style={{
                    width: 20, height: 20, background: "#5C6AC4", borderRadius: "50%", 
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                    boxShadow: "0 0 0 2px #1A1A1F"
                  }}
                  title="Add section here"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeftSidebar({
  headerSections, templateSections, footerSections,
  selectedSectionKey, expandedSections, onSelectSection, onToggleExpand,
  onAddSection, onReorderSections, onToggleVisibility, activeTab, onTabChange,
  themeSettings, onThemeSettingChange, settingsSchema,
}: LeftSidebarProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = useCallback((idx: number) => { setDragIdx(idx); }, []);
  const handleDragOver = useCallback((idx: number) => { setDragOverIdx(idx); }, []);
  const handleDragEnd = useCallback(() => { setDragIdx(null); setDragOverIdx(null); }, []);
  const handleDrop = useCallback((toIdx: number) => {
    if (dragIdx !== null && dragIdx !== toIdx) {
      onReorderSections(dragIdx, toIdx);
    }
    setDragIdx(null);
    setDragOverIdx(null);
  }, [dragIdx, onReorderSections]);

  return (
    <div style={{
      width: 280, flexShrink: 0, borderRight: "1px solid #2A2A35", background: "#1A1A1F",
      height: "calc(100vh - 56px)", display: "flex", flexDirection: "column", overflow: "hidden",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* Global Settings Header */}
      <div style={{ padding: 12, borderBottom: "1px solid #2A2A35" }}>
        <div
          onClick={() => onTabChange(activeTab === "sections" ? "settings" : "sections")}
          style={{
            display: "flex", alignItems: "center", gap: 12, padding: "8px",
            borderRadius: 4, cursor: "pointer", transition: "background 150ms",
            background: activeTab === "settings" ? "#2E2E38" : "transparent",
            color: activeTab === "settings" ? "#fff" : "#9CA3AF",
          }}
          onMouseEnter={(e) => { 
            e.currentTarget.style.background = "#2E2E38"; 
            e.currentTarget.style.color = "#fff"; 
          }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.background = activeTab === "settings" ? "#2E2E38" : "transparent"; 
            e.currentTarget.style.color = activeTab === "settings" ? "#fff" : "#9CA3AF"; 
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 500, color: activeTab === "settings" ? "#fff" : "#E3E3E3" }}>
            Theme settings
          </span>
        </div>
      </div>

      {/* Scrollable section tree or theme settings */}
      <div style={{ flex: 1, overflowY: "auto", padding: activeTab === "sections" ? "8px 0" : 0 }}>
        {activeTab === "sections" ? (
          <>
            <SectionGroup
              label="Header" items={headerSections} selectedKey={selectedSectionKey}
              expandedSections={expandedSections} onSelect={onSelectSection}
              onToggle={onToggleExpand} onToggleVisibility={onToggleVisibility} draggable={false}
            />
            <SectionGroup
              label="Template" items={templateSections} selectedKey={selectedSectionKey}
              expandedSections={expandedSections} onSelect={onSelectSection}
              onToggle={onToggleExpand} onToggleVisibility={onToggleVisibility} draggable={true}
              onDragStart={handleDragStart} onDragOver={handleDragOver}
              onDragEnd={handleDragEnd} onDrop={handleDrop} dragOverIdx={dragOverIdx}
              onAddSection={(idx) => onAddSection(idx, "template")}
            />
            <SectionGroup
              label="Footer" items={footerSections} selectedKey={selectedSectionKey}
              expandedSections={expandedSections} onSelect={onSelectSection}
              onToggle={onToggleExpand} onToggleVisibility={onToggleVisibility} draggable={false}
            />
          </>
        ) : (
          <ThemeSettingsPanel
            themeSettings={themeSettings}
            settingsSchema={settingsSchema}
            onChange={onThemeSettingChange}
            onBack={() => onTabChange("sections")}
          />
        )}
      </div>

      {activeTab === "sections" && (
        <AddSectionButton onClick={() => onAddSection(templateSections.length, "template")} />
      )}
    </div>
  );
}
