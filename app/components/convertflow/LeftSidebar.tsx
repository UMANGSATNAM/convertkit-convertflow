import type { LeftSidebarProps, ShopifySection } from "../../types/convertflow";
import SectionTreeItem from "./SectionTreeItem";

function AddSectionLink({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        height: 36, padding: "0 12px 0 16px", display: "flex", alignItems: "center",
        gap: 6, fontSize: 13, color: "#005bd3", cursor: "pointer", borderRadius: 6, margin: "1px 4px",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f4f4"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      <span style={{
        width: 18, height: 18, background: "#005bd3", color: "#fff", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, lineHeight: 1,
      }}>+</span>
      Add section
    </div>
  );
}

function SectionGroup({
  label, items, selectedKey, expandedSections, onSelect, onToggle, draggable, onAddSection,
}: {
  label: string; items: ShopifySection[]; selectedKey: string | null;
  expandedSections: Record<string, boolean>; onSelect: (key: string) => void;
  onToggle: (key: string) => void; draggable: boolean; onAddSection: () => void;
}) {
  return (
    <div>
      <div style={{
        padding: "12px 16px 4px 16px", fontSize: 11, fontWeight: 500, color: "#6b6b6b",
      }}>
        {label}
      </div>
      {items.map((item) => (
        <SectionTreeItem
          key={item.key}
          section={item}
          selected={item.key === selectedKey}
          expanded={!!expandedSections[item.key]}
          draggable={draggable}
          onSelect={onSelect}
          onToggle={onToggle}
        />
      ))}
      <AddSectionLink onClick={onAddSection} />
    </div>
  );
}

export default function LeftSidebar({
  headerSections, templateSections, footerSections,
  selectedSectionKey, expandedSections, onSelectSection, onToggleExpand,
  onAddSection, activeTab, onTabChange,
}: LeftSidebarProps) {
  return (
    <div style={{
      width: 280, flexShrink: 0, borderRight: "1px solid #e3e3e3", background: "#fff",
      height: "calc(100vh - 52px)", display: "flex", flexDirection: "column", overflow: "hidden",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Tab row */}
      <div style={{
        height: 40, borderBottom: "1px solid #e3e3e3", display: "flex", flexShrink: 0,
      }}>
        {(["sections", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{
              flex: 1, border: "none", background: "transparent", cursor: "pointer",
              fontSize: 13, color: activeTab === tab ? "#1a1a1a" : "#6b6b6b",
              fontWeight: activeTab === tab ? 600 : 400,
              borderBottom: activeTab === tab ? "2px solid #1a1a1a" : "2px solid transparent",
              fontFamily: "inherit",
            }}
          >
            {tab === "sections" ? "Sections" : "Theme settings"}
          </button>
        ))}
      </div>

      {/* Scrollable section tree */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        {activeTab === "sections" ? (
          <>
            <SectionGroup
              label="Header" items={headerSections} selectedKey={selectedSectionKey}
              expandedSections={expandedSections} onSelect={onSelectSection}
              onToggle={onToggleExpand} draggable={false}
              onAddSection={() => onAddSection(0, "header")}
            />
            <div style={{ height: 1, background: "#e3e3e3", margin: "4px 0" }} />
            <SectionGroup
              label="Template" items={templateSections} selectedKey={selectedSectionKey}
              expandedSections={expandedSections} onSelect={onSelectSection}
              onToggle={onToggleExpand} draggable={true}
              onAddSection={() => onAddSection(templateSections.length, "template")}
            />
            <div style={{ height: 1, background: "#e3e3e3", margin: "4px 0" }} />
            <SectionGroup
              label="Footer" items={footerSections} selectedKey={selectedSectionKey}
              expandedSections={expandedSections} onSelect={onSelectSection}
              onToggle={onToggleExpand} draggable={false}
              onAddSection={() => onAddSection(999, "footer")}
            />
          </>
        ) : (
          <div style={{ padding: "20px 16px", fontSize: 13, color: "#6b6b6b" }}>
            Theme settings will be available here.
          </div>
        )}
      </div>
    </div>
  );
}
