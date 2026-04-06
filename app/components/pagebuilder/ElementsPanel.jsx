// ElementsPanel — Left panel element library + layers tree
import { useState, useCallback } from "react";
import { ELEMENTS, ELEMENT_CATEGORIES, getElementsByCategory } from "../../data/element-registry";
import { flattenNodes } from "../../data/page-tree";

export default function ElementsPanel({ tree, selectedId, onSelect, onAddElement, activeTab, onTabChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="pbep-root">
      {/* Tab switcher */}
      <div className="pbep-tabs">
        <button className={`pbep-tab ${activeTab === "elements" ? "pbep-tab--active" : ""}`} onClick={() => onTabChange("elements")}>Elements</button>
        <button className={`pbep-tab ${activeTab === "layers" ? "pbep-tab--active" : ""}`} onClick={() => onTabChange("layers")}>Layers</button>
      </div>

      {activeTab === "elements" ? (
        <ElementsLib searchQuery={searchQuery} onSearchChange={setSearchQuery} activeCategory={activeCategory} onCategoryChange={setActiveCategory} onAddElement={onAddElement} />
      ) : (
        <LayersTree tree={tree} selectedId={selectedId} onSelect={onSelect} />
      )}
    </div>
  );
}

function ElementsLib({ searchQuery, onSearchChange, activeCategory, onCategoryChange, onAddElement }) {
  const elements = getElementsByCategory(activeCategory).filter((el) =>
    !searchQuery || el.name.toLowerCase().includes(searchQuery.toLowerCase()) || el.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pbep-content">
      {/* Search */}
      <div className="pbep-search-wrap">
        <svg className="pbep-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input className="pbep-search" placeholder="Search elements..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} />
      </div>

      {/* Categories */}
      <div className="pbep-cats">
        <button className={`pbep-cat ${activeCategory === "all" ? "pbep-cat--active" : ""}`} onClick={() => onCategoryChange("all")}>All</button>
        {ELEMENT_CATEGORIES.map((cat) => (
          <button key={cat.id} className={`pbep-cat ${activeCategory === cat.id ? "pbep-cat--active" : ""}`} onClick={() => onCategoryChange(cat.id)}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Element grid */}
      <div className="pbep-grid">
        {elements.map((el) => (
          <button key={el.id} className="pbep-el" onClick={() => onAddElement(el.id)} title={el.description}>
            <div className="pbep-el-icon" dangerouslySetInnerHTML={{ __html: el.icon }} />
            <span className="pbep-el-name">{el.name}</span>
          </button>
        ))}
      </div>
      {elements.length === 0 && <div className="pbep-no-results">No elements found</div>}
    </div>
  );
}

function LayersTree({ tree, selectedId, onSelect }) {
  const nodes = tree.nodes;

  return (
    <div className="pbep-content" style={{ padding: "8px 0" }}>
      {nodes.length === 0 ? (
        <div className="pbep-no-results">No layers yet. Add elements to your page.</div>
      ) : (
        nodes.map((node) => (
          <LayerNode key={node.id} node={node} selectedId={selectedId} onSelect={onSelect} depth={0} />
        ))
      )}
    </div>
  );
}

function LayerNode({ node, selectedId, onSelect, depth }) {
  const [expanded, setExpanded] = useState(true);
  const isSelected = node.id === selectedId;
  const hasChildren = node.children && node.children.length > 0;
  const typeLabel = ELEMENTS[node.type]?.name || node.type;
  const typeIcon = ELEMENTS[node.type]?.icon;
  const isContainer = node.type === "section" || node.type === "row" || node.type === "column" || node.type === "container";

  const colors = { section: "#3B82F6", row: "#8B5CF6", column: "#F59E0B", container: "#06B6D4" };

  return (
    <div>
      <div
        className={`pbl-node ${isSelected ? "pbl-node--selected" : ""}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
      >
        {hasChildren && (
          <button className="pbl-expand" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
            {expanded ? "▾" : "▸"}
          </button>
        )}
        {!hasChildren && <span className="pbl-dot" />}
        {typeIcon && <span className="pbl-icon" dangerouslySetInnerHTML={{ __html: typeIcon }} />}
        <span className="pbl-label" style={{ color: isContainer ? colors[node.type] || "#CBD5E1" : "#CBD5E1" }}>
          {node.props?.text ? `${typeLabel}: ${String(node.props.text).slice(0, 20)}` : typeLabel}
        </span>
      </div>
      {expanded && hasChildren && node.children.map((child) => (
        <LayerNode key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} depth={depth + 1} />
      ))}
    </div>
  );
}

export const elementsPanelStyles = `
  .pbep-root { width: 260px; min-width: 260px; background: #12141C; border-right: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; overflow: hidden; }
  .pbep-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .pbep-tab { flex: 1; padding: 10px; background: none; border: none; color: #64748B; font-size: 12px; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 0.08em; transition: all 0.15s; }
  .pbep-tab--active { color: #10B981; box-shadow: inset 0 -2px 0 #10B981; }
  .pbep-tab:hover { color: #CBD5E1; }
  .pbep-content { flex: 1; overflow-y: auto; padding: 12px; }
  .pbep-search-wrap { position: relative; margin-bottom: 10px; }
  .pbep-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: #475569; pointer-events: none; }
  .pbep-search { width: 100%; padding: 8px 10px 8px 32px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #CBD5E1; font-size: 12px; outline: none; box-sizing: border-box; }
  .pbep-search:focus { border-color: #10B981; }
  .pbep-cats { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px; }
  .pbep-cat { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 4px 8px; font-size: 10px; font-weight: 600; color: #64748B; cursor: pointer; transition: all 0.15s; }
  .pbep-cat:hover { border-color: rgba(16,185,129,0.3); color: #94A3B8; }
  .pbep-cat--active { background: rgba(16,185,129,0.12); border-color: #10B981; color: #10B981; }
  .pbep-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .pbep-el { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px 4px; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; transition: all 0.15s; }
  .pbep-el:hover { background: rgba(16,185,129,0.06); border-color: rgba(16,185,129,0.3); transform: translateY(-1px); }
  .pbep-el-icon { width: 22px; height: 22px; color: #64748B; }
  .pbep-el-icon svg { width: 22px; height: 22px; }
  .pbep-el-name { font-size: 9px; font-weight: 600; color: #94A3B8; text-align: center; line-height: 1.2; }
  .pbep-no-results { text-align: center; color: #475569; font-size: 13px; padding: 32px 16px; }

  /* Layers */
  .pbl-node { display: flex; align-items: center; gap: 4px; padding: 5px 8px; cursor: pointer; border-radius: 4px; transition: background 0.1s; font-size: 12px; }
  .pbl-node:hover { background: rgba(255,255,255,0.04); }
  .pbl-node--selected { background: rgba(59,130,246,0.15) !important; }
  .pbl-expand { background: none; border: none; color: #475569; cursor: pointer; font-size: 10px; padding: 0; width: 14px; flex-shrink: 0; }
  .pbl-dot { width: 4px; height: 4px; border-radius: 50%; background: #334155; margin: 0 5px; flex-shrink: 0; }
  .pbl-icon { width: 14px; height: 14px; flex-shrink: 0; color: #475569; }
  .pbl-icon svg { width: 14px; height: 14px; }
  .pbl-label { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
`;
