import { useState, useRef, useCallback } from "react";
import { getSectionMeta } from "./sectionRegistry";

export default function EditorSidebar({
  sections, selectedId, onSelect, onReorder, onToggleVisibility,
  onDuplicate, onDelete, onAddSection,
}) {
  const [dragIdx, setDragIdx] = useState(null);
  const [dropIdx, setDropIdx] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dragRef = useRef(null);

  const handleDragStart = useCallback((e, idx) => {
    setDragIdx(idx);
    dragRef.current = idx;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(idx));
    e.currentTarget.classList.add("pcs-item--dragging");
  }, []);

  const handleDragOver = useCallback((e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropIdx(idx);
  }, []);

  const handleDrop = useCallback((e, toIdx) => {
    e.preventDefault();
    const fromIdx = dragRef.current;
    if (fromIdx !== null && fromIdx !== toIdx) {
      onReorder(fromIdx, toIdx);
    }
    setDragIdx(null);
    setDropIdx(null);
  }, [onReorder]);

  const handleDragEnd = useCallback(() => {
    setDragIdx(null);
    setDropIdx(null);
    document.querySelectorAll(".pcs-item--dragging").forEach(el => el.classList.remove("pcs-item--dragging"));
  }, []);

  const filtered = searchTerm
    ? sections.filter((s) => {
        const meta = getSectionMeta(s.type);
        return meta.label.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : sections;

  return (
    <div className="pcs-sidebar">
      <div className="pcs-sidebar-head">
        <h3 className="pcs-sidebar-title">Layers</h3>
        <span className="pcs-sidebar-count">{sections.length}</span>
      </div>

      <div className="pcs-search-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
        <input
          className="pcs-search"
          placeholder="Search sections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="pcs-list">
        {filtered.map((sec, idx) => {
          const meta = getSectionMeta(sec.type);
          const isSelected = sec.id === selectedId;
          const isDragging = dragIdx === idx;
          const isDropTarget = dropIdx === idx && dragIdx !== idx;
          return (
            <div key={sec.id}>
              {isDropTarget && dragIdx !== null && dragIdx < idx && (
                <div className="pcs-drop-line" />
              )}
              <div
                className={`pcs-item ${isSelected ? "pcs-item--selected" : ""} ${isDragging ? "pcs-item--dragging" : ""} ${!sec.visible ? "pcs-item--hidden" : ""}`}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelect(sec.id)}
              >
                <div className="pcs-drag-handle" title="Drag to reorder">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
                </div>
                <span className="pcs-item-icon">{meta.icon}</span>
                <span className="pcs-item-label">{meta.label}</span>
                <div className="pcs-item-actions">
                  <button
                    className="pcs-vis-btn"
                    onClick={(e) => { e.stopPropagation(); onToggleVisibility(sec.id); }}
                    title={sec.visible ? "Hide" : "Show"}
                  >
                    {sec.visible ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    )}
                  </button>
                  <button
                    className="pcs-ctx-btn"
                    onClick={(e) => { e.stopPropagation(); onDuplicate(sec.id); }}
                    title="Duplicate"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75m11.25-1.5h-9.75A1.125 1.125 0 0 0 7.125 6.375v12.75c0 .621.504 1.125 1.125 1.125h9.75a1.125 1.125 0 0 0 1.125-1.125V6.375a1.125 1.125 0 0 0-1.125-1.125Z" /></svg>
                  </button>
                  <button
                    className="pcs-del-btn"
                    onClick={(e) => { e.stopPropagation(); onDelete(sec.id); }}
                    title="Delete"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                  </button>
                </div>
              </div>
              {isDropTarget && dragIdx !== null && dragIdx > idx && (
                <div className="pcs-drop-line" />
              )}
            </div>
          );
        })}
      </div>

      <button className="pcs-add-btn" onClick={onAddSection}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        Add Section
      </button>
    </div>
  );
}

export const sidebarStyles = `
  .pcs-sidebar {
    width: 260px; min-width: 260px; background: #0C1021; border-right: 1px solid rgba(255,255,255,0.06);
    display: flex; flex-direction: column; overflow: hidden; z-index: 50;
  }
  .pcs-sidebar-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 8px; }
  .pcs-sidebar-title { font-family: 'Rubik', sans-serif; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.1em; margin: 0; }
  .pcs-sidebar-count { font-size: 11px; font-weight: 700; color: #475569; background: rgba(255,255,255,0.06); padding: 2px 8px; border-radius: 10px; }

  .pcs-search-wrap { display: flex; align-items: center; gap: 8px; margin: 0 12px 10px; padding: 7px 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; color: #475569; }
  .pcs-search { background: none; border: none; color: #CBD5E1; font-size: 12px; outline: none; width: 100%; font-family: 'Nunito Sans', sans-serif; }
  .pcs-search::placeholder { color: #475569; }

  .pcs-list { flex: 1; overflow-y: auto; padding: 0 8px; }
  .pcs-list::-webkit-scrollbar { width: 4px; }
  .pcs-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

  .pcs-item {
    display: flex; align-items: center; gap: 8px; padding: 8px 8px; border-radius: 8px;
    cursor: pointer; transition: all 0.15s; margin-bottom: 2px; position: relative;
    border: 1px solid transparent;
  }
  .pcs-item:hover { background: rgba(255,255,255,0.04); }
  .pcs-item--selected { background: rgba(16,185,129,0.1) !important; border-color: rgba(16,185,129,0.3); }
  .pcs-item--dragging { opacity: 0.4; }
  .pcs-item--hidden { opacity: 0.5; }
  .pcs-item--hidden .pcs-item-label { text-decoration: line-through; }

  .pcs-drag-handle { color: #334155; cursor: grab; padding: 2px; display: flex; flex-shrink: 0; }
  .pcs-drag-handle:active { cursor: grabbing; }
  .pcs-item-icon { font-size: 14px; flex-shrink: 0; }
  .pcs-item-label { font-size: 12px; font-weight: 600; color: #CBD5E1; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pcs-item--selected .pcs-item-label { color: #10B981; }

  .pcs-item-actions { display: flex; gap: 2px; opacity: 0; transition: opacity 0.15s; }
  .pcs-item:hover .pcs-item-actions, .pcs-item--selected .pcs-item-actions { opacity: 1; }
  .pcs-vis-btn, .pcs-ctx-btn, .pcs-del-btn { background: none; border: none; color: #475569; cursor: pointer; padding: 3px; border-radius: 4px; display: flex; transition: all 0.1s; }
  .pcs-vis-btn:hover { color: #10B981; }
  .pcs-ctx-btn:hover { color: #3B82F6; }
  .pcs-del-btn:hover { color: #EF4444; }

  .pcs-drop-line { height: 2px; background: #10B981; margin: 0 12px; border-radius: 2px; box-shadow: 0 0 8px rgba(16,185,129,0.5); }

  .pcs-add-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin: 8px 12px 14px; padding: 10px; background: rgba(16,185,129,0.08);
    border: 1.5px dashed rgba(16,185,129,0.4); border-radius: 10px;
    color: #10B981; font-size: 13px; font-weight: 700; cursor: pointer;
    transition: all 0.15s; font-family: 'Nunito Sans', sans-serif; flex-shrink: 0;
  }
  .pcs-add-btn:hover { background: rgba(16,185,129,0.15); border-color: #10B981; }
`;
