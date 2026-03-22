import { useState, useCallback } from "react";
import type { ShopifySection } from "../../types/convertflow";

interface SectionTreeItemProps {
  section: ShopifySection;
  selected: boolean;
  expanded: boolean;
  draggable: boolean;
  onSelect: (key: string) => void;
  onToggle: (key: string) => void;
}

function SectionIcon({ name, active }: { name: string; active?: boolean }) {
  const n = name.toLowerCase();
  const c = active ? "#fff" : "#9CA3AF";
  
  if (n.includes("header") || n.includes("announcement")) {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m3 15 2 2 4-4"/></svg>;
  }
  if (n.includes("footer")) {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m3 15 2 2 4-4"/></svg>; /* Panel bottom equivalent */
  }
  if (n.includes("collection") || n.includes("product")) {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
  }
  if (n.includes("image") || n.includes("banner")) {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
  }
  if (n.includes("column") || n.includes("grid")) {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>;
  }
  
  // Default
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>;
}

function GripIcon({ visible }: { visible: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: visible ? 1 : 0, transition: "opacity 150ms", cursor: "grab" }}>
      <circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/>
      <circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>
    </svg>
  );
}

export default function SectionTreeItem({ section, selected, expanded, draggable, onSelect, onToggle }: SectionTreeItemProps) {
  const schema = section.schema;
  const hasBlocks = Boolean(schema?.blocks?.length);
  const displayName = schema?.name || section.name;
  
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback(() => { onSelect(section.key); }, [section.key, onSelect]);
  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(section.key);
  }, [section.key, onToggle]);

  return (
    <div style={{ marginBottom: 2 }}>
      {/* Section row */}
      <div
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          minHeight: 36, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8,
          cursor: "pointer", position: "relative",
          background: selected ? "#25252D" : hovered ? "#2E2E38" : "transparent",
          borderLeft: selected ? "3px solid #5C6AC4" : "3px solid transparent",
          color: selected ? "#fff" : "#E3E3E3",
          transition: "background 150ms",
        }}
      >
        {/* Expand/Collapse chevron if it has blocks, inside the left area */}
        <div style={{ display: "flex", alignItems: "center", width: 14 }} onClick={hasBlocks ? handleToggle : undefined}>
          {hasBlocks && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 150ms", cursor: "pointer" }}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          )}
        </div>

        {/* Drag handle */}
        {draggable && <GripIcon visible={hovered} />}

        {/* Section Icon */}
        <SectionIcon name={displayName} active={selected} />

        {/* Name */}
        <span style={{ flex: 1, fontSize: 13, fontWeight: selected ? 500 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {displayName}
        </span>

        {/* Actions on hover */}
        <div style={{ opacity: hovered ? 1 : 0, transition: "opacity 150ms", display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          {selected && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>}
        </div>
      </div>

      {/* Expanded blocks */}
      {expanded && hasBlocks && schema && (
        <div style={{ marginLeft: 28, paddingLeft: 12, borderLeft: "1px solid #2A2A35", margin: "4px 0" }}>
          {schema.blocks.map((block, idx) => {
            const isText = block.type.includes("text") || block.type.includes("heading");
            const isButton = block.type.includes("button");
            return (
              <div key={`${block.type}-${idx}`} 
                style={{
                  padding: "6px 8px", display: "flex", alignItems: "center", gap: 8,
                  fontSize: 12, color: "#E3E3E3", cursor: "pointer", borderRadius: 2, marginBottom: 2,
                  transition: "background 150ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#2E2E38"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <GripIcon visible={false} /> {/* Hover logic for children omitted for brevity, keeping space */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isText ? <><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></> 
                  : isButton ? <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>
                  : <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>}
                </svg>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {block.name}
                </span>
              </div>
            );
          })}
          <div style={{
            padding: "4px 8px", fontSize: 11, color: "#5C6AC4", cursor: "pointer", 
            display: "flex", alignItems: "center", gap: 4, marginTop: 4, transition: "color 150ms",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#5C6AC4"; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add block
          </div>
        </div>
      )}
    </div>
  );
}
