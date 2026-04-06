// StylePanel — Right sidebar with all element editing controls
import { useState, useCallback } from "react";
import { ELEMENTS } from "../../data/element-registry";
import { findNode } from "../../data/page-tree";

const GOOGLE_FONTS = [
  "inherit", "Inter", "Roboto", "Poppins", "Montserrat", "Open Sans", "Lato", "Oswald",
  "Raleway", "Nunito Sans", "Rubik", "Work Sans", "Outfit", "DM Sans", "Space Grotesk",
  "Playfair Display", "Merriweather", "Lora", "Source Serif Pro", "Crimson Text",
  "Bebas Neue", "Anton", "Barlow", "Archivo", "Quicksand", "Manrope", "Sora", "Jost",
];

export default function StylePanel({ tree, selectedId, onUpdateProps, onDelete, onDuplicate }) {
  const [activeTab, setActiveTab] = useState("content");

  if (!selectedId) {
    return (
      <div className="pbsp-root">
        <div className="pbsp-empty">
          <div className="pbsp-empty-icon">🎨</div>
          <div className="pbsp-empty-title">No selection</div>
          <div className="pbsp-empty-text">Click any element on the canvas to edit its properties.</div>
        </div>
      </div>
    );
  }

  const node = findNode(tree.nodes, selectedId);
  if (!node) {
    return <div className="pbsp-root"><div className="pbsp-empty"><div className="pbsp-empty-text">Element not found</div></div></div>;
  }

  const def = ELEMENTS[node.type];
  const fields = def?.editableFields || [];
  const p = node.props || {};

  const groups = {
    content: fields.filter((f) => f.group === "content"),
    style: fields.filter((f) => f.group === "style"),
    spacing: fields.filter((f) => f.group === "spacing"),
    visibility: fields.filter((f) => f.group === "visibility"),
  };

  const handleChange = (fieldId, value) => {
    onUpdateProps(selectedId, { [fieldId]: value });
  };

  const tabs = [
    { id: "content", label: "Content", icon: "✏️" },
    { id: "style", label: "Style", icon: "🎨" },
    { id: "spacing", label: "Spacing", icon: "📐" },
    { id: "visibility", label: "Visibility", icon: "👁" },
  ].filter((t) => groups[t.id]?.length > 0);

  return (
    <div className="pbsp-root">
      {/* Header */}
      <div className="pbsp-header">
        <div className="pbsp-header-type">
          {def?.icon && <span className="pbsp-header-icon" dangerouslySetInnerHTML={{ __html: def.icon }} />}
          <span className="pbsp-header-name">{def?.name || node.type}</span>
        </div>
        <div className="pbsp-header-actions">
          <button className="pbsp-action-btn" onClick={() => onDuplicate(selectedId)} title="Duplicate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>
          </button>
          <button className="pbsp-action-btn pbsp-action-btn--danger" onClick={() => onDelete(selectedId)} title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="pbsp-tabs">
        {tabs.map((t) => (
          <button key={t.id} className={`pbsp-tab ${activeTab === t.id ? "pbsp-tab--active" : ""}`} onClick={() => setActiveTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div className="pbsp-fields">
        {(groups[activeTab] || []).map((field) => (
          <FieldControl key={field.id} field={field} value={p[field.id] ?? field.defaultValue} onChange={(val) => handleChange(field.id, val)} />
        ))}
      </div>
    </div>
  );
}

function FieldControl({ field, value, onChange }) {
  switch (field.type) {
    case "text":
      return (
        <div className="pbsp-field">
          <label className="pbsp-label">{field.label}</label>
          <input className="pbsp-input" type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} />
        </div>
      );

    case "textarea":
      return (
        <div className="pbsp-field">
          <label className="pbsp-label">{field.label}</label>
          <textarea className="pbsp-textarea" value={value || ""} onChange={(e) => onChange(e.target.value)} rows={3} />
        </div>
      );

    case "number":
      return (
        <div className="pbsp-field">
          <label className="pbsp-label">{field.label}</label>
          <div className="pbsp-number-wrap">
            <input className="pbsp-input pbsp-input--num" type="number" value={value ?? 0} min={field.min} max={field.max} step={field.step || 1} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} />
            {field.min != null && field.max != null && (
              <input className="pbsp-range" type="range" value={value ?? 0} min={field.min} max={field.max} step={field.step || 1} onChange={(e) => onChange(parseFloat(e.target.value))} />
            )}
          </div>
        </div>
      );

    case "range":
      return (
        <div className="pbsp-field">
          <label className="pbsp-label">{field.label} <span className="pbsp-range-val">{value}</span></label>
          <input className="pbsp-range" type="range" value={value ?? 0} min={field.min || 0} max={field.max || 100} step={field.step || 1} onChange={(e) => onChange(parseFloat(e.target.value))} />
        </div>
      );

    case "color":
      return (
        <div className="pbsp-field">
          <label className="pbsp-label">{field.label}</label>
          <div className="pbsp-color-wrap">
            <input className="pbsp-color-input" type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} />
            <input className="pbsp-input pbsp-input--color" type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} />
          </div>
        </div>
      );

    case "select":
      return (
        <div className="pbsp-field">
          <label className="pbsp-label">{field.label}</label>
          <select className="pbsp-select" value={value || ""} onChange={(e) => onChange(e.target.value)}>
            {(field.options || []).map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );

    case "toggle":
      return (
        <div className="pbsp-field pbsp-field--toggle">
          <label className="pbsp-label">{field.label}</label>
          <button className={`pbsp-toggle ${value ? "pbsp-toggle--on" : ""}`} onClick={() => onChange(!value)}>
            <span className="pbsp-toggle-thumb" />
          </button>
        </div>
      );

    case "alignment":
      return (
        <div className="pbsp-field">
          <label className="pbsp-label">{field.label}</label>
          <div className="pbsp-align-wrap">
            {["left", "center", "right"].map((a) => (
              <button key={a} className={`pbsp-align-btn ${value === a ? "pbsp-align-btn--active" : ""}`} onClick={() => onChange(a)}>
                {a === "left" ? "◀" : a === "center" ? "◆" : "▶"}
              </button>
            ))}
          </div>
        </div>
      );

    case "font":
      return (
        <div className="pbsp-field">
          <label className="pbsp-label">{field.label}</label>
          <select className="pbsp-select" value={value || "inherit"} onChange={(e) => onChange(e.target.value)}>
            {GOOGLE_FONTS.map((f) => (
              <option key={f} value={f === "inherit" ? "inherit" : `'${f}', sans-serif`}>{f}</option>
            ))}
          </select>
        </div>
      );

    case "image":
      return (
        <div className="pbsp-field">
          <label className="pbsp-label">{field.label}</label>
          <input className="pbsp-input" type="text" placeholder="Paste image URL..." value={value || ""} onChange={(e) => onChange(e.target.value)} />
          {value && <img src={value} alt="" style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 6, marginTop: 4 }} />}
        </div>
      );

    case "url":
      return (
        <div className="pbsp-field">
          <label className="pbsp-label">{field.label}</label>
          <input className="pbsp-input" type="url" placeholder="https://..." value={value || ""} onChange={(e) => onChange(e.target.value)} />
        </div>
      );

    case "code":
      return (
        <div className="pbsp-field">
          <label className="pbsp-label">{field.label}</label>
          <textarea className="pbsp-textarea pbsp-textarea--code" value={value || ""} onChange={(e) => onChange(e.target.value)} rows={6} spellCheck={false} />
        </div>
      );

    default:
      return (
        <div className="pbsp-field">
          <label className="pbsp-label">{field.label}</label>
          <input className="pbsp-input" type="text" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
  }
}

export const stylePanelStyles = `
  .pbsp-root { width: 280px; min-width: 280px; background: #12141C; border-left: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; overflow: hidden; }
  .pbsp-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 32px; }
  .pbsp-empty-icon { font-size: 32px; margin-bottom: 12px; opacity: 0.5; }
  .pbsp-empty-title { font-size: 14px; font-weight: 700; color: #CBD5E1; margin-bottom: 4px; }
  .pbsp-empty-text { font-size: 12px; color: #475569; line-height: 1.5; }

  .pbsp-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .pbsp-header-type { display: flex; align-items: center; gap: 6px; }
  .pbsp-header-icon { width: 18px; height: 18px; color: #10B981; }
  .pbsp-header-icon svg { width: 18px; height: 18px; }
  .pbsp-header-name { font-size: 13px; font-weight: 700; color: #CBD5E1; }
  .pbsp-header-actions { display: flex; gap: 4px; }
  .pbsp-action-btn { width: 28px; height: 28px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748B; transition: all 0.15s; }
  .pbsp-action-btn svg { width: 14px; height: 14px; }
  .pbsp-action-btn:hover { background: rgba(255,255,255,0.08); color: #CBD5E1; }
  .pbsp-action-btn--danger:hover { background: rgba(239,68,68,0.15); color: #EF4444; border-color: rgba(239,68,68,0.3); }

  .pbsp-tabs { display: flex; gap: 2px; padding: 4px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .pbsp-tab { flex: 1; padding: 6px 4px; background: none; border: none; border-radius: 4px; color: #64748B; font-size: 10px; font-weight: 600; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 3px; }
  .pbsp-tab--active { background: rgba(16,185,129,0.1); color: #10B981; }
  .pbsp-tab:hover { color: #CBD5E1; }

  .pbsp-fields { flex: 1; overflow-y: auto; padding: 12px 14px; display: flex; flex-direction: column; gap: 12px; }

  .pbsp-field { display: flex; flex-direction: column; gap: 4px; }
  .pbsp-field--toggle { flex-direction: row; align-items: center; justify-content: space-between; }
  .pbsp-label { font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; }
  .pbsp-range-val { color: #10B981; font-weight: 700; }

  .pbsp-input { width: 100%; padding: 7px 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; color: #CBD5E1; font-size: 12px; outline: none; box-sizing: border-box; transition: border-color 0.15s; }
  .pbsp-input:focus { border-color: #10B981; }
  .pbsp-input--num { width: 70px; text-align: center; }
  .pbsp-input--color { flex: 1; }
  .pbsp-textarea { width: 100%; padding: 7px 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; color: #CBD5E1; font-size: 12px; outline: none; resize: vertical; min-height: 50px; box-sizing: border-box; font-family: inherit; }
  .pbsp-textarea:focus { border-color: #10B981; }
  .pbsp-textarea--code { font-family: 'SFMono-Regular', Consolas, monospace; font-size: 11px; }
  .pbsp-select { width: 100%; padding: 7px 10px; background: #1A1D28; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; color: #CBD5E1; font-size: 12px; outline: none; cursor: pointer; }
  .pbsp-select:focus { border-color: #10B981; }
  .pbsp-number-wrap { display: flex; align-items: center; gap: 8px; }
  .pbsp-range { flex: 1; -webkit-appearance: none; height: 4px; background: #1E293B; border-radius: 2px; outline: none; }
  .pbsp-range::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #10B981; cursor: pointer; }
  .pbsp-color-wrap { display: flex; gap: 6px; align-items: center; }
  .pbsp-color-input { width: 32px; height: 32px; border: none; border-radius: 6px; cursor: pointer; padding: 0; background: none; }
  .pbsp-toggle { width: 36px; height: 20px; border-radius: 10px; background: #1E293B; border: none; cursor: pointer; position: relative; transition: background 0.2s; flex-shrink: 0; }
  .pbsp-toggle--on { background: #10B981; }
  .pbsp-toggle-thumb { position: absolute; width: 16px; height: 16px; border-radius: 50%; background: #FFF; top: 2px; left: 2px; transition: transform 0.2s; }
  .pbsp-toggle--on .pbsp-toggle-thumb { transform: translateX(16px); }
  .pbsp-align-wrap { display: flex; gap: 4px; }
  .pbsp-align-btn { width: 32px; height: 28px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; color: #64748B; cursor: pointer; font-size: 10px; transition: all 0.15s; display: flex; align-items: center; justify-content: center; }
  .pbsp-align-btn--active { background: rgba(16,185,129,0.15); border-color: #10B981; color: #10B981; }
`;
