import { useState } from "react";
import { SECTION_TYPES, SECTION_CATEGORIES, SECTION_DEFAULTS, generateId } from "./sectionRegistry";

export default function AddSectionPanel({ onAdd, onClose, insertIndex }) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const entries = Object.entries(SECTION_TYPES).filter(([key, meta]) => {
    if (category !== "all" && meta.category !== category) return false;
    if (search && !meta.label.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAdd = (type) => {
    const defaults = SECTION_DEFAULTS[type];
    if (!defaults) return;
    const section = { ...defaults, id: generateId(), visible: true };
    onAdd(section, insertIndex);
    onClose();
  };

  return (
    <div className="asp-overlay" onClick={onClose}>
      <div className="asp-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="asp-head">
          <div>
            <h3 className="asp-title">Add Section</h3>
            <p className="asp-subtitle">Choose a section to add to your page</p>
          </div>
          <button className="asp-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Search */}
        <div className="asp-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input className="asp-search" placeholder="Search sections..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
        </div>

        {/* Category filter */}
        <div className="asp-cats">
          {SECTION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`asp-cat ${category === cat.id ? "asp-cat--active" : ""}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="asp-grid">
          {entries.map(([key, meta]) => (
            <button key={key} className="asp-item" onClick={() => handleAdd(key)}>
              <span className="asp-icon">{meta.icon}</span>
              <div className="asp-item-info">
                <span className="asp-label">{meta.label}</span>
                <span className="asp-desc">{meta.desc}</span>
              </div>
            </button>
          ))}
          {entries.length === 0 && (
            <div className="asp-empty">No sections match your search</div>
          )}
        </div>
      </div>
    </div>
  );
}

export const addSectionStyles = `
  .asp-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(6px); animation: asp-fade-in 0.15s ease; }
  @keyframes asp-fade-in { from { opacity: 0; } to { opacity: 1; } }
  .asp-modal { background: #0C1021; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; width: 520px; max-height: 80vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5); animation: asp-slide-up 0.2s ease; }
  @keyframes asp-slide-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .asp-head { display: flex; align-items: flex-start; justify-content: space-between; padding: 20px 24px 12px; }
  .asp-title { font-family: 'Rubik', sans-serif; font-size: 17px; font-weight: 700; color: #fff; margin: 0; }
  .asp-subtitle { font-size: 12px; color: #64748B; margin: 4px 0 0; }
  .asp-close { background: none; border: none; color: #475569; cursor: pointer; padding: 6px; border-radius: 8px; display: flex; transition: all 0.15s; }
  .asp-close:hover { color: #CBD5E1; background: rgba(255,255,255,0.06); }

  .asp-search-wrap { display: flex; align-items: center; gap: 10px; margin: 0 20px 12px; padding: 9px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #475569; }
  .asp-search { background: none; border: none; color: #CBD5E1; font-size: 13px; outline: none; width: 100%; font-family: 'Nunito Sans', sans-serif; }
  .asp-search::placeholder { color: #475569; }

  .asp-cats { display: flex; gap: 6px; padding: 0 20px 12px; overflow-x: auto; flex-shrink: 0; }
  .asp-cat { background: rgba(255,255,255,0.04); border: 1px solid transparent; border-radius: 8px; color: #94A3B8; font-size: 12px; font-weight: 600; padding: 5px 14px; cursor: pointer; transition: all 0.15s; white-space: nowrap; font-family: 'Nunito Sans', sans-serif; }
  .asp-cat:hover { color: #CBD5E1; border-color: rgba(255,255,255,0.1); }
  .asp-cat--active { background: rgba(16,185,129,0.1); color: #10B981; border-color: rgba(16,185,129,0.3); }

  .asp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 0 20px 20px; overflow-y: auto; flex: 1; }
  .asp-grid::-webkit-scrollbar { width: 4px; }
  .asp-grid::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

  .asp-item { background: #151B2E; border: 1.5px solid rgba(255,255,255,0.04); border-radius: 12px; padding: 14px; cursor: pointer; display: flex; align-items: flex-start; gap: 12px; transition: all 0.15s; text-align: left; }
  .asp-item:hover { border-color: #10B981; background: rgba(16,185,129,0.06); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
  .asp-icon { font-size: 22px; line-height: 1; flex-shrink: 0; margin-top: 2px; }
  .asp-item-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .asp-label { font-size: 13px; font-weight: 700; color: #CBD5E1; font-family: 'Nunito Sans', sans-serif; }
  .asp-desc { font-size: 11px; color: #475569; line-height: 1.4; }

  .asp-empty { grid-column: 1 / -1; text-align: center; color: #475569; font-size: 13px; padding: 32px 0; }
`;
