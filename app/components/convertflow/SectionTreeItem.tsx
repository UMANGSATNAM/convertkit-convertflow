import { useCallback } from "react";
import type { ShopifySection, ShopifySchema } from "../../types/convertflow";

interface SectionTreeItemProps {
  section: ShopifySection;
  selected: boolean;
  expanded: boolean;
  draggable: boolean;
  onSelect: (key: string) => void;
  onToggle: (key: string) => void;
}

function sectionIcon(name: string): JSX.Element {
  const n = name.toLowerCase();
  const c = "#8a8a8a";
  if (n.includes("header") || n.includes("footer") || n.includes("announcement")) {
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h8" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>;
  }
  if (n.includes("collection") || n.includes("product") || n.includes("featured")) {
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke={c} strokeWidth="1.2"/><rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke={c} strokeWidth="1.2"/><rect x="1.5" y="9.5" width="5" height="5" rx="1" stroke={c} strokeWidth="1.2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke={c} strokeWidth="1.2"/></svg>;
  }
  if (n.includes("image") || n.includes("slideshow") || n.includes("gallery") || n.includes("video") || n.includes("banner")) {
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke={c} strokeWidth="1.2"/><circle cx="5" cy="6" r="1.5" stroke={c} strokeWidth="1"/><path d="M1.5 11l3.5-3 3 2.5 2-1.5 4.5 3" stroke={c} strokeWidth="1" strokeLinecap="round"/></svg>;
  }
  // Default: document icon
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="1.5" width="10" height="13" rx="1.5" stroke={c} strokeWidth="1.2"/><path d="M6 5h4M6 8h4M6 11h2" stroke={c} strokeWidth="1" strokeLinecap="round"/></svg>;
}

export default function SectionTreeItem({ section, selected, expanded, draggable, onSelect, onToggle }: SectionTreeItemProps) {
  const schema = section.schema;
  const hasBlocks = Boolean(schema?.blocks?.length);
  const displayName = schema?.name || section.name;

  const handleClick = useCallback(() => { onSelect(section.key); }, [section.key, onSelect]);
  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(section.key);
  }, [section.key, onToggle]);

  return (
    <div>
      {/* Section row */}
      <div
        onClick={handleClick}
        style={{
          minHeight: 36, padding: "0 12px 0 8px", display: "flex", alignItems: "center",
          gap: 6, cursor: "pointer", borderRadius: 6, margin: "1px 4px", position: "relative",
          background: selected ? "#e8f0fe" : "transparent",
          color: selected ? "#005bd3" : "#303030",
          fontSize: 13,
        }}
        onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = "#f4f4f4"; }}
        onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = "transparent"; }}
      >
        {/* Drag handle */}
        {draggable && (
          <span style={{ width: 8, color: "#b5b5b5", fontSize: 10, cursor: "grab", userSelect: "none", lineHeight: 1, letterSpacing: "1px" }}>
            ⠿
          </span>
        )}

        {/* Expand arrow */}
        {hasBlocks ? (
          <span onClick={handleToggle} style={{
            width: 14, textAlign: "center", fontSize: 8, color: "#8a8a8a",
            cursor: "pointer", transition: "transform 150ms",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            ▶
          </span>
        ) : (
          <span style={{ width: 14, flexShrink: 0 }} />
        )}

        {/* Icon */}
        <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          {sectionIcon(displayName)}
        </span>

        {/* Name */}
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {displayName}
        </span>
      </div>

      {/* Expanded blocks */}
      {expanded && hasBlocks && schema && (
        <div>
          {schema.blocks.map((block, idx) => (
            <div key={`${block.type}-${idx}`} style={{
              minHeight: 32, padding: "0 12px 0 48px", display: "flex", alignItems: "center",
              gap: 6, fontSize: 13, color: "#303030", cursor: "pointer", borderRadius: 6, margin: "1px 4px",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f4f4"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ width: 14, fontSize: 8, color: "#8a8a8a", textAlign: "center" }}>▶</span>
              {block.name}
            </div>
          ))}
          <div style={{
            minHeight: 32, padding: "0 12px 0 48px", display: "flex", alignItems: "center",
            gap: 6, fontSize: 13, color: "#005bd3", cursor: "pointer", borderRadius: 6, margin: "1px 4px",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f4f4"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            + Add block
          </div>
        </div>
      )}
    </div>
  );
}
