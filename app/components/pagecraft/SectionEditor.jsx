import { useState } from "react";
import { getSectionMeta } from "./sectionRegistry";

export default function SectionEditor({ section, onChange, onDelete, onDuplicate, onClose }) {
  const [tab, setTab] = useState("content");
  if (!section) return <EmptyState />;

  const meta = getSectionMeta(section.type);
  const update = (key, value) => onChange(section.id, { [key]: value });
  const updateNested = (key, subIdx, subKey, value) => {
    const arr = [...(section[key] || [])];
    arr[subIdx] = { ...arr[subIdx], [subKey]: value };
    onChange(section.id, { [key]: arr });
  };
  const addToArray = (key, defaultItem) => {
    const arr = [...(section[key] || []), defaultItem];
    onChange(section.id, { [key]: arr });
  };
  const removeFromArray = (key, subIdx) => {
    const arr = (section[key] || []).filter((_, i) => i !== subIdx);
    onChange(section.id, { [key]: arr });
  };

  return (
    <div className="pci-panel">
      {/* Header */}
      <div className="pci-header">
        <button className="pci-back" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
        </button>
        <div className="pci-header-info">
          <span className="pci-header-icon">{meta.icon}</span>
          <h3 className="pci-header-title">{meta.label}</h3>
        </div>
        <div className="pci-header-actions">
          <button className="pci-action-btn" onClick={() => onDuplicate(section.id)} title="Duplicate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75m11.25-1.5h-9.75A1.125 1.125 0 0 0 7.125 6.375v12.75c0 .621.504 1.125 1.125 1.125h9.75a1.125 1.125 0 0 0 1.125-1.125V6.375a1.125 1.125 0 0 0-1.125-1.125Z" /></svg>
          </button>
          <button className="pci-action-btn pci-action-btn--danger" onClick={() => onDelete(section.id)} title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="pci-tabs">
        {["content", "style", "layout"].map((t) => (
          <button key={t} className={`pci-tab ${tab === t ? "pci-tab--active" : ""}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      <div className="pci-body">
        {tab === "content" && <ContentFields section={section} update={update} updateNested={updateNested} addToArray={addToArray} removeFromArray={removeFromArray} />}
        {tab === "style" && <StyleFields section={section} update={update} />}
        {tab === "layout" && <LayoutFields section={section} update={update} />}
      </div>
    </div>
  );
}

function ContentFields({ section: s, update, updateNested, addToArray, removeFromArray }) {
  const t = s.type;
  return (
    <div className="pci-fields">
      {/* Universal headline/subtext */}
      {["hero", "video_hero", "product_showcase", "social_proof", "faq", "newsletter", "countdown_timer", "cta_banner", "image_with_text"].includes(t) && (
        <Field label="Headline" value={s.headline} onChange={(v) => update("headline", v)} />
      )}
      {["hero", "video_hero", "product_showcase", "newsletter", "countdown_timer", "cta_banner"].includes(t) && (
        <Field label="Subtext" value={s.subtext} onChange={(v) => update("subtext", v)} multiline />
      )}

      {/* CTA fields */}
      {["hero", "video_hero", "cta_banner", "image_with_text"].includes(t) && (
        <Field label="CTA Text" value={s.cta_text} onChange={(v) => update("cta_text", v)} />
      )}
      {["image_with_text", "cta_banner"].includes(t) && (
        <Field label="CTA URL" value={s.cta_url} onChange={(v) => update("cta_url", v)} />
      )}

      {/* Section-specific */}
      {t === "announcement_bar" && <>
        <Field label="Message" value={s.message} onChange={(v) => update("message", v)} />
        <Field label="Link Text" value={s.link_text} onChange={(v) => update("link_text", v)} />
        <Field label="Link URL" value={s.link_url} onChange={(v) => update("link_url", v)} />
        <ToggleField label="Dismissible" value={s.dismissible} onChange={(v) => update("dismissible", v)} />
      </>}

      {t === "video_hero" && <>
        <Field label="Video URL" value={s.video_url} onChange={(v) => update("video_url", v)} />
        <RangeField label="Overlay Opacity" value={s.overlay_opacity} min={0} max={1} step={0.1} onChange={(v) => update("overlay_opacity", v)} />
      </>}

      {t === "image_with_text" && <>
        <Field label="Body Text" value={s.text} onChange={(v) => update("text", v)} multiline />
        <Field label="Image URL" value={s.image_url} onChange={(v) => update("image_url", v)} />
        <SelectField label="Image Position" value={s.image_position || "left"} options={["left", "right"]} onChange={(v) => update("image_position", v)} />
      </>}

      {t === "urgency_bar" && <Field label="Message" value={s.message} onChange={(v) => update("message", v)} />}

      {t === "newsletter" && <>
        <Field label="Placeholder Text" value={s.placeholder} onChange={(v) => update("placeholder", v)} />
        <Field label="Button Text" value={s.button_text} onChange={(v) => update("button_text", v)} />
      </>}

      {t === "countdown_timer" && <>
        <Field label="End Date/Time" value={s.end_date} onChange={(v) => update("end_date", v)} type="datetime-local" />
      </>}

      {t === "whatsapp_widget" && <>
        <Field label="Phone Number" value={s.phone} onChange={(v) => update("phone", v)} />
        <Field label="Default Message" value={s.message} onChange={(v) => update("message", v)} multiline />
        <SelectField label="Position" value={s.position || "bottom-right"} options={["bottom-right", "bottom-left"]} onChange={(v) => update("position", v)} />
      </>}

      {t === "footer" && <>
        <Field label="Copyright" value={s.copyright} onChange={(v) => update("copyright", v)} />
      </>}

      {/* Array fields */}
      {t === "trust_badges" && <>
        <Divider label="Badges" />
        {(s.badges || []).map((b, i) => (
          <SubItem key={i} onRemove={() => removeFromArray("badges", i)}>
            <Field label={`Badge ${i + 1}`} value={b.label} onChange={(v) => updateNested("badges", i, "label", v)} />
          </SubItem>
        ))}
        <AddButton label="+ Add Badge" onClick={() => addToArray("badges", { icon: "check", label: "New Badge" })} />
      </>}

      {t === "social_proof" && <>
        <Divider label="Reviews" />
        {(s.reviews || []).map((r, i) => (
          <SubItem key={i} onRemove={() => removeFromArray("reviews", i)}>
            <Field label="Name" value={r.name} onChange={(v) => updateNested("reviews", i, "name", v)} />
            <Field label="Review" value={r.text} onChange={(v) => updateNested("reviews", i, "text", v)} multiline />
            <SelectField label="Rating" value={String(r.rating || 5)} options={["1", "2", "3", "4", "5"]} onChange={(v) => updateNested("reviews", i, "rating", Number(v))} />
            <Field label="Location" value={r.location} onChange={(v) => updateNested("reviews", i, "location", v)} />
          </SubItem>
        ))}
        <AddButton label="+ Add Review" onClick={() => addToArray("reviews", { name: "Customer", rating: 5, text: "Great product!", location: "" })} />
      </>}

      {t === "faq" && <>
        <Divider label="Questions" />
        {(s.items || []).map((item, i) => (
          <SubItem key={i} onRemove={() => removeFromArray("items", i)}>
            <Field label="Question" value={item.question} onChange={(v) => updateNested("items", i, "question", v)} />
            <Field label="Answer" value={item.answer} onChange={(v) => updateNested("items", i, "answer", v)} multiline />
          </SubItem>
        ))}
        <AddButton label="+ Add Question" onClick={() => addToArray("items", { question: "New question?", answer: "Answer here." })} />
      </>}

      {t === "product_showcase" && <>
        <ToggleField label="Show Prices" value={s.show_prices} onChange={(v) => update("show_prices", v)} />
        <Divider label="Products" />
        {(s.products || []).map((p, i) => (
          <SubItem key={i} onRemove={() => removeFromArray("products", i)}>
            <Field label="Name" value={p.name} onChange={(v) => updateNested("products", i, "name", v)} />
            <Field label="Price" value={p.price} onChange={(v) => updateNested("products", i, "price", v)} />
          </SubItem>
        ))}
        <AddButton label="+ Add Product" onClick={() => addToArray("products", { name: "New Product", price: "$0.00" })} />
      </>}

      {t === "brand_logos" && <>
        <Divider label="Logos" />
        {(s.logos || []).map((l, i) => (
          <SubItem key={i} onRemove={() => removeFromArray("logos", i)}>
            <Field label="Name" value={l.name} onChange={(v) => updateNested("logos", i, "name", v)} />
            <Field label="Display Text" value={l.text} onChange={(v) => updateNested("logos", i, "text", v)} />
          </SubItem>
        ))}
        <AddButton label="+ Add Logo" onClick={() => addToArray("logos", { name: "Brand", text: "BRAND" })} />
      </>}

      {t === "footer" && <>
        <Divider label="Columns" />
        {(s.columns || []).map((col, i) => (
          <SubItem key={i} onRemove={() => removeFromArray("columns", i)}>
            <Field label="Title" value={col.title} onChange={(v) => updateNested("columns", i, "title", v)} />
          </SubItem>
        ))}
        <AddButton label="+ Add Column" onClick={() => addToArray("columns", { title: "New Column", links: [] })} />
      </>}
    </div>
  );
}

function StyleFields({ section: s, update }) {
  const t = s.type;
  return (
    <div className="pci-fields">
      <Divider label="Colors" />
      {["hero", "video_hero", "announcement_bar", "newsletter", "countdown_timer", "cta_banner", "footer", "urgency_bar", "trust_badges", "social_proof", "product_showcase", "image_with_text", "brand_logos"].includes(t) && (
        <ColorField label="Background Color" value={s.background_color} onChange={(v) => update("background_color", v)} />
      )}
      {["hero", "video_hero", "announcement_bar", "newsletter", "countdown_timer", "cta_banner", "urgency_bar", "footer"].includes(t) && (
        <ColorField label="Text Color" value={s.text_color || s.color} onChange={(v) => update("text_color", v)} />
      )}
      {["hero", "video_hero", "cta_banner", "image_with_text"].includes(t) && (
        <ColorField label="CTA Color" value={s.cta_color} onChange={(v) => update("cta_color", v)} />
      )}
      {t === "newsletter" && (
        <ColorField label="Button Color" value={s.button_color} onChange={(v) => update("button_color", v)} />
      )}
      {t === "countdown_timer" && (
        <ColorField label="Accent Color" value={s.accent_color} onChange={(v) => update("accent_color", v)} />
      )}

      <Divider label="Spacing" />
      <RangeField label="Vertical Padding" value={s.padding_y || 48} min={0} max={120} step={4} onChange={(v) => update("padding_y", v)} />

      <Divider label="Presets" />
      <div className="pci-preset-row">
        {PALETTE_PRESETS.map((p) => (
          <button key={p.name} className="pci-preset-swatch" title={p.name} style={{ background: p.bg }} onClick={() => {
            update("background_color", p.bg);
            if (p.text) update("text_color", p.text);
            if (p.accent) update("cta_color", p.accent);
          }} />
        ))}
      </div>
    </div>
  );
}

function LayoutFields({ section: s, update }) {
  const t = s.type;
  return (
    <div className="pci-fields">
      {["hero", "cta_banner"].includes(t) && (
        <SelectField label="Text Alignment" value={s.alignment || "center"} options={["left", "center", "right"]} onChange={(v) => update("alignment", v)} />
      )}
      {t === "product_showcase" && (
        <SelectField label="Columns" value={String(s.columns || 3)} options={["2", "3", "4"]} onChange={(v) => update("columns", Number(v))} />
      )}
      {t === "image_with_text" && (
        <SelectField label="Image Position" value={s.image_position || "left"} options={["left", "right"]} onChange={(v) => update("image_position", v)} />
      )}
      {t === "trust_badges" && (
        <SelectField label="Layout" value={s.layout || "horizontal"} options={["horizontal", "vertical", "grid"]} onChange={(v) => update("layout", v)} />
      )}
      {t === "brand_logos" && (
        <SelectField label="Scroll Speed" value={s.speed || "normal"} options={["slow", "normal", "fast"]} onChange={(v) => update("speed", v)} />
      )}
    </div>
  );
}

// Shared field components
function Field({ label, value, onChange, multiline, type }) {
  return (
    <div className="pci-field">
      <label className="pci-label">{label}</label>
      {multiline ? (
        <textarea className="pci-textarea" value={value || ""} onChange={(e) => onChange(e.target.value)} rows={3} />
      ) : (
        <input className="pci-input" type={type || "text"} value={value || ""} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div className="pci-field pci-field--color">
      <label className="pci-label">{label}</label>
      <div className="pci-color-row">
        <input type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} className="pci-color-picker" />
        <input className="pci-input pci-input--short" type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <div className="pci-field">
      <label className="pci-label">{label}</label>
      <select className="pci-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
      </select>
    </div>
  );
}

function RangeField({ label, value, min, max, step, onChange }) {
  return (
    <div className="pci-field">
      <label className="pci-label">{label} <span style={{ color: "#10B981", fontWeight: 700 }}>{value}</span></label>
      <input type="range" className="pci-range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function ToggleField({ label, value, onChange }) {
  return (
    <div className="pci-field pci-field--toggle">
      <label className="pci-label">{label}</label>
      <button className={`pci-toggle ${value ? "pci-toggle--on" : ""}`} onClick={() => onChange(!value)}>
        <span className="pci-toggle-dot" />
      </button>
    </div>
  );
}

function Divider({ label }) { return <div className="pci-divider"><span>{label}</span></div>; }
function SubItem({ children, onRemove }) {
  return (
    <div className="pci-sub-item">
      {children}
      <button className="pci-remove-btn" onClick={onRemove}>Remove</button>
    </div>
  );
}
function AddButton({ label, onClick }) { return <button className="pci-add-btn" onClick={onClick}>{label}</button>; }

function EmptyState() {
  return (
    <div className="pci-panel">
      <div className="pci-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40" style={{ color: "#334155", marginBottom: 12 }}><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" /></svg>
        <h4 style={{ color: "#64748B", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>No Section Selected</h4>
        <p style={{ color: "#475569", fontSize: 12, margin: 0 }}>Click a section in the canvas to edit it</p>
      </div>
    </div>
  );
}

const PALETTE_PRESETS = [
  { name: "Midnight", bg: "#0F172A", text: "#fff", accent: "#10B981" },
  { name: "Snow", bg: "#FFFFFF", text: "#1E293B", accent: "#3B82F6" },
  { name: "Slate", bg: "#1E293B", text: "#E2E8F0", accent: "#F59E0B" },
  { name: "Forest", bg: "#064E3B", text: "#ECFDF5", accent: "#34D399" },
  { name: "Ocean", bg: "#0C4A6E", text: "#E0F2FE", accent: "#38BDF8" },
  { name: "Ruby", bg: "#7F1D1D", text: "#FEF2F2", accent: "#FCA5A5" },
  { name: "Violet", bg: "#4C1D95", text: "#EDE9FE", accent: "#A78BFA" },
  { name: "Warm", bg: "#FFF7ED", text: "#431407", accent: "#F97316" },
];

export const inspectorStyles = `
  .pci-panel { width: 300px; min-width: 300px; background: #0C1021; border-left: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; overflow: hidden; z-index: 50; }
  .pci-header { display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .pci-back { background: none; border: none; color: #64748B; cursor: pointer; padding: 4px; border-radius: 6px; display: flex; transition: all 0.15s; }
  .pci-back:hover { color: #CBD5E1; background: rgba(255,255,255,0.06); }
  .pci-header-info { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; }
  .pci-header-icon { font-size: 16px; }
  .pci-header-title { font-family: 'Rubik', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pci-header-actions { display: flex; gap: 4px; }
  .pci-action-btn { background: none; border: 1px solid rgba(255,255,255,0.08); color: #64748B; cursor: pointer; padding: 5px; border-radius: 6px; display: flex; transition: all 0.15s; }
  .pci-action-btn:hover { color: #CBD5E1; border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); }
  .pci-action-btn--danger:hover { color: #EF4444; border-color: rgba(239,68,68,0.3); }

  .pci-tabs { display: flex; gap: 0; padding: 0 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .pci-tab { background: none; border: none; color: #475569; font-size: 12px; font-weight: 600; padding: 10px 14px; cursor: pointer; transition: all 0.15s; border-bottom: 2px solid transparent; font-family: 'Nunito Sans', sans-serif; }
  .pci-tab:hover { color: #94A3B8; }
  .pci-tab--active { color: #10B981; border-bottom-color: #10B981; }

  .pci-body { flex: 1; overflow-y: auto; }
  .pci-body::-webkit-scrollbar { width: 4px; }
  .pci-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
  .pci-fields { padding: 14px; display: flex; flex-direction: column; gap: 12px; }

  .pci-field { display: flex; flex-direction: column; gap: 4px; }
  .pci-field--color .pci-color-row { display: flex; gap: 8px; align-items: center; }
  .pci-field--toggle { flex-direction: row; align-items: center; justify-content: space-between; }
  .pci-label { font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.06em; }
  .pci-input, .pci-textarea, .pci-select { width: 100%; padding: 8px 12px; background: #151B2E; border: 1.5px solid #1E293B; border-radius: 8px; color: #fff; font-size: 13px; font-family: 'Nunito Sans', sans-serif; outline: none; transition: border-color 0.15s; box-sizing: border-box; }
  .pci-input:focus, .pci-textarea:focus, .pci-select:focus { border-color: #10B981; }
  .pci-textarea { resize: vertical; min-height: 60px; }
  .pci-select { cursor: pointer; appearance: none; }
  .pci-input--short { flex: 1; }

  .pci-color-picker { width: 34px; height: 34px; border: 2px solid #334155; border-radius: 8px; cursor: pointer; padding: 0; background: none; }
  .pci-range { width: 100%; accent-color: #10B981; cursor: pointer; }

  .pci-toggle { width: 38px; height: 20px; border-radius: 12px; background: #334155; border: none; cursor: pointer; position: relative; transition: background 0.2s; flex-shrink: 0; }
  .pci-toggle--on { background: #10B981; }
  .pci-toggle-dot { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform 0.2s; }
  .pci-toggle--on .pci-toggle-dot { transform: translateX(18px); }

  .pci-divider { display: flex; align-items: center; gap: 8px; padding-top: 6px; }
  .pci-divider span { font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.1em; white-space: nowrap; }
  .pci-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.06); }

  .pci-sub-item { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
  .pci-remove-btn { align-self: flex-end; background: none; border: none; color: #EF4444; font-size: 11px; font-weight: 600; cursor: pointer; padding: 2px 8px; border-radius: 4px; transition: background 0.15s; }
  .pci-remove-btn:hover { background: rgba(239,68,68,0.1); }
  .pci-add-btn { background: rgba(16,185,129,0.08); border: 1.5px dashed #10B981; border-radius: 8px; color: #10B981; font-size: 12px; font-weight: 600; padding: 8px; cursor: pointer; transition: all 0.15s; text-align: center; font-family: 'Nunito Sans', sans-serif; }
  .pci-add-btn:hover { background: rgba(16,185,129,0.15); }

  .pci-preset-row { display: flex; gap: 6px; flex-wrap: wrap; }
  .pci-preset-swatch { width: 28px; height: 28px; border-radius: 6px; border: 2px solid rgba(255,255,255,0.1); cursor: pointer; transition: all 0.15s; }
  .pci-preset-swatch:hover { transform: scale(1.15); border-color: rgba(255,255,255,0.3); }

  .pci-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; text-align: center; flex: 1; }
`;
