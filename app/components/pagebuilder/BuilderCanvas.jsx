// BuilderCanvas — Central preview area with recursive node rendering
import { useCallback, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ElementRenderer from "./ElementRenderer";

export default function BuilderCanvas({ tree, selectedId, viewport, onSelect, onInlineEdit, zoom }) {
  const canvasRef = useRef(null);

  const viewportWidth = viewport === "mobile" ? 390 : viewport === "tablet" ? 768 : "100%";

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target.classList.contains("pbc-inner")) {
      onSelect(null);
    }
  };

  return (
    <div className="pbc-canvas" onClick={handleCanvasClick} ref={canvasRef}>
      <div className="pbc-inner" style={{ width: viewportWidth, maxWidth: "100%", transform: `scale(${zoom / 100})`, transformOrigin: "top center", margin: "0 auto" }}>
        {tree.nodes.length === 0 ? (
          <EmptyState />
        ) : (
          <SortableContext items={tree.nodes.map((n) => n.id)} strategy={verticalListSortingStrategy}>
            {tree.nodes.map((node) => (
              <SortableSection key={node.id} node={node} selectedId={selectedId} onSelect={onSelect} onInlineEdit={onInlineEdit} viewport={viewport} />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}

function SortableSection({ node, selectedId, onSelect, onInlineEdit, viewport }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: node.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {/* Drag handle */}
      <div className="pbc-drag-handle" {...listeners} title="Drag to reorder">⠿</div>
      <SectionRenderer node={node} selectedId={selectedId} onSelect={onSelect} onInlineEdit={onInlineEdit} viewport={viewport} />
    </div>
  );
}

function SectionRenderer({ node, selectedId, onSelect, onInlineEdit, viewport }) {
  const p = node.props || {};
  const isSelected = node.id === selectedId;

  if (node.type === "section") {
    return (
      <div
        className={`pbc-section ${isSelected ? "pbc-section--selected" : ""}`}
        style={{
          background: p.backgroundColor || "#FFFFFF",
          paddingTop: `${p.paddingTop || 0}px`,
          paddingBottom: `${p.paddingBottom || 0}px`,
        }}
        onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
        data-node-id={node.id}
      >
        {isSelected && <div className="pbc-section-label">Section</div>}
        <div style={{ maxWidth: `${p.maxWidth || 1200}px`, margin: "0 auto", padding: "0 24px" }}>
          {node.children.map((child) => (
            <NodeRenderer key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} onInlineEdit={onInlineEdit} viewport={viewport} />
          ))}
        </div>
      </div>
    );
  }

  return <NodeRenderer node={node} selectedId={selectedId} onSelect={onSelect} onInlineEdit={onInlineEdit} viewport={viewport} />;
}

function NodeRenderer({ node, selectedId, onSelect, onInlineEdit, viewport }) {
  const p = node.props || {};
  const isSelected = node.id === selectedId;

  if (node.type === "row") {
    const cols = parseInt(p.columns || "2", 10);
    const isMobile = viewport === "mobile";
    return (
      <div
        className={`pbc-row ${isSelected ? "pbc-row--selected" : ""}`}
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : (p.reverseOnMobile && isMobile ? "column-reverse" : "row"),
          gap: `${p.gap || 24}px`,
          alignItems: p.alignItems || "stretch",
        }}
        onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
        data-node-id={node.id}
      >
        {isSelected && <div className="pbc-section-label" style={{ background: "#8B5CF6" }}>Row</div>}
        {node.children.map((child) => (
          <NodeRenderer key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} onInlineEdit={onInlineEdit} viewport={viewport} />
        ))}
      </div>
    );
  }

  if (node.type === "column") {
    return (
      <div
        className={`pbc-column ${isSelected ? "pbc-column--selected" : ""}`}
        style={{
          flex: p.width === "auto" ? 1 : `0 0 ${p.width}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: p.verticalAlign || "flex-start",
          gap: 8,
          minHeight: 40,
        }}
        onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
        data-node-id={node.id}
      >
        {isSelected && <div className="pbc-section-label" style={{ background: "#F59E0B" }}>Column</div>}
        {node.children.length === 0 ? (
          <div className="pbc-empty-col">Drop elements here</div>
        ) : (
          node.children.map((child) => (
            <NodeRenderer key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} onInlineEdit={onInlineEdit} viewport={viewport} />
          ))
        )}
      </div>
    );
  }

  if (node.type === "container") {
    return (
      <div
        className={`pbc-container ${isSelected ? "pbc-container--selected" : ""}`}
        style={{
          display: "flex",
          flexDirection: p.direction || "column",
          alignItems: p.alignItems || "flex-start",
          justifyContent: p.justifyContent || "flex-start",
          maxWidth: p.maxWidth || "100%",
          background: p.backgroundColor !== "transparent" ? p.backgroundColor : undefined,
          padding: `${p.paddingTop || 0}px ${p.paddingRight || 0}px ${p.paddingBottom || 0}px ${p.paddingLeft || 0}px`,
          borderRadius: p.borderRadius ? `${p.borderRadius}px` : undefined,
          gap: 8,
          minHeight: 40,
        }}
        onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
        data-node-id={node.id}
      >
        {isSelected && <div className="pbc-section-label" style={{ background: "#06B6D4" }}>Container</div>}
        {node.children.length === 0 ? (
          <div className="pbc-empty-col">Drop elements here</div>
        ) : (
          node.children.map((child) => (
            <NodeRenderer key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} onInlineEdit={onInlineEdit} viewport={viewport} />
          ))
        )}
      </div>
    );
  }

  // Leaf element
  return <ElementRenderer node={node} isSelected={isSelected} onSelect={onSelect} onInlineEdit={onInlineEdit} viewport={viewport} />;
}

function EmptyState() {
  return (
    <div className="pbc-empty">
      <div className="pbc-empty-icon">📄</div>
      <h3 className="pbc-empty-title">Your page is empty</h3>
      <p className="pbc-empty-text">Drag elements from the left panel or choose a template to get started.</p>
    </div>
  );
}

export const canvasStyles = `
  .pbc-canvas { flex: 1; overflow-y: auto; overflow-x: hidden; background: #E8E8EC; padding: 24px; display: flex; justify-content: center; }
  .pbc-inner { background: #FFFFFF; min-height: calc(100vh - 100px); box-shadow: 0 0 40px rgba(0,0,0,0.08); transition: width 0.3s ease; }
  .pbc-section { position: relative; cursor: pointer; transition: outline 0.15s; }
  .pbc-section:hover { outline: 1px dashed rgba(59,130,246,0.3); outline-offset: -1px; }
  .pbc-section--selected { outline: 2px solid #3B82F6 !important; outline-offset: -2px; }
  .pbc-section-label { position: absolute; top: -20px; left: 8px; background: #3B82F6; color: #FFF; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px 4px 0 0; z-index: 10; pointer-events: none; letter-spacing: 0.03em; }
  .pbc-row { position: relative; }
  .pbc-row:hover { outline: 1px dashed rgba(139,92,246,0.3); outline-offset: 2px; }
  .pbc-row--selected { outline: 2px solid #8B5CF6 !important; outline-offset: 2px; }
  .pbc-column { position: relative; }
  .pbc-column:hover { outline: 1px dashed rgba(245,158,11,0.3); outline-offset: 1px; }
  .pbc-column--selected { outline: 2px solid #F59E0B !important; outline-offset: 1px; }
  .pbc-container { position: relative; }
  .pbc-container:hover { outline: 1px dashed rgba(6,182,212,0.3); outline-offset: 1px; }
  .pbc-container--selected { outline: 2px solid #06B6D4 !important; outline-offset: 1px; }
  .pbc-empty-col { border: 2px dashed #CBD5E1; border-radius: 8px; padding: 24px; text-align: center; color: #94A3B8; font-size: 13px; font-weight: 500; }
  .pbc-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 120px 40px; text-align: center; }
  .pbc-empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
  .pbc-empty-title { font-family: 'Rubik', sans-serif; font-size: 22px; font-weight: 700; color: #1E293B; margin: 0 0 8px; }
  .pbc-empty-text { font-size: 14px; color: #94A3B8; margin: 0; max-width: 320px; line-height: 1.6; }
  .pbc-drag-handle { position: absolute; top: 4px; right: 4px; z-index: 20; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #94A3B8; background: rgba(255,255,255,0.9); border-radius: 4px; cursor: grab; opacity: 0; transition: opacity 0.15s; border: 1px solid #E2E8F0; }
  .pbc-section:hover > .pbc-drag-handle, .pbc-drag-handle:hover { opacity: 1; }

  /* Animations */
  @keyframes pb-fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pb-slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pb-slideLeft { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes pb-slideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes pb-zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
  @keyframes pb-bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }
`;
