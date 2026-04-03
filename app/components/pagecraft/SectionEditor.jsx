import { useState } from "react";

export default function SectionEditor({ section, index, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  if (!section) return null;

  const update = (key, value) => {
    onChange(index, { ...section, [key]: value });
  };

  const updateNested = (key, subIdx, subKey, value) => {
    const arr = [...(section[key] || [])];
    arr[subIdx] = { ...arr[subIdx], [subKey]: value };
    onChange(index, { ...section, [key]: arr });
  };

  const addToArray = (key, defaultItem) => {
    const arr = [...(section[key] || []), defaultItem];
    onChange(index, { ...section, [key]: arr });
  };

  const removeFromArray = (key, subIdx) => {
    const arr = (section[key] || []).filter((_, i) => i !== subIdx);
    onChange(index, { ...section, [key]: arr });
  };

  return (
    <div className="se-panel">
      {/* Section Header */}
      <div className="se-header">
        <h3 className="se-title">{sectionLabel(section.type)}</h3>
        <div className="se-actions">
          <button className="se-icon-btn" onClick={() => onMoveUp(index)} disabled={isFirst} title="Move up">↑</button>
          <button className="se-icon-btn" onClick={() => onMoveDown(index)} disabled={isLast} title="Move down">↓</button>
          <button className="se-icon-btn se-icon-btn--danger" onClick={() => onDelete(index)} title="Delete">✕</button>
        </div>
      </div>

      <div className="se-fields">
        {/* HERO */}
        {section.type === "hero" && (<>
          <Field label="Headline" value={section.headline} onChange={v => update("headline", v)} />
          <Field label="Subtext" value={section.subtext} onChange={v => update("subtext", v)} multiline />
          <Field label="CTA Text" value={section.cta_text} onChange={v => update("cta_text", v)} />
          <ColorField label="CTA Color" value={section.cta_color || "#10B981"} onChange={v => update("cta_color", v)} />
          <ColorField label="Background" value={section.background_color || "#0F172A"} onChange={v => update("background_color", v)} />
        </>)}

        {/* PRODUCT SHOWCASE */}
        {section.type === "product_showcase" && (<>
          <Field label="Headline" value={section.headline} onChange={v => update("headline", v)} />
          <Field label="Subtext" value={section.subtext} onChange={v => update("subtext", v)} />
          <SelectField label="Columns" value={String(section.columns || 3)} options={["2","3","4"]} onChange={v => update("columns", Number(v))} />
        </>)}

        {/* TRUST BADGES */}
        {section.type === "trust_badges" && (<>
          <ColorField label="Background" value={section.background_color || "#F8FAFC"} onChange={v => update("background_color", v)} />
          <div className="se-sub-title">Badges</div>
          {(section.badges || []).map((b, i) => (
            <div key={i} className="se-sub-item">
              <Field label={`Badge ${i+1}`} value={b.label} onChange={v => updateNested("badges", i, "label", v)} />
              <button className="se-remove-btn" onClick={() => removeFromArray("badges", i)}>Remove</button>
            </div>
          ))}
          <button className="se-add-btn" onClick={() => addToArray("badges", { icon: "check", label: "New Badge" })}>+ Add Badge</button>
        </>)}

        {/* SOCIAL PROOF */}
        {section.type === "social_proof" && (<>
          <Field label="Headline" value={section.headline} onChange={v => update("headline", v)} />
          <div className="se-sub-title">Reviews</div>
          {(section.reviews || []).map((r, i) => (
            <div key={i} className="se-sub-item">
              <Field label="Name" value={r.name} onChange={v => updateNested("reviews", i, "name", v)} />
              <Field label="Review" value={r.text} onChange={v => updateNested("reviews", i, "text", v)} multiline />
              <SelectField label="Rating" value={String(r.rating || 5)} options={["1","2","3","4","5"]} onChange={v => updateNested("reviews", i, "rating", Number(v))} />
              <button className="se-remove-btn" onClick={() => removeFromArray("reviews", i)}>Remove</button>
            </div>
          ))}
          <button className="se-add-btn" onClick={() => addToArray("reviews", { name: "Customer", rating: 5, text: "Great product!", location: "" })}>+ Add Review</button>
        </>)}

        {/* FAQ */}
        {section.type === "faq" && (<>
          <Field label="Headline" value={section.headline} onChange={v => update("headline", v)} />
          <div className="se-sub-title">Questions</div>
          {(section.items || []).map((item, i) => (
            <div key={i} className="se-sub-item">
              <Field label="Question" value={item.question} onChange={v => updateNested("items", i, "question", v)} />
              <Field label="Answer" value={item.answer} onChange={v => updateNested("items", i, "answer", v)} multiline />
              <button className="se-remove-btn" onClick={() => removeFromArray("items", i)}>Remove</button>
            </div>
          ))}
          <button className="se-add-btn" onClick={() => addToArray("items", { question: "New question?", answer: "Answer here." })}>+ Add Question</button>
        </>)}

        {/* URGENCY BAR */}
        {section.type === "urgency_bar" && (<>
          <Field label="Message" value={section.message} onChange={v => update("message", v)} />
          <ColorField label="Background" value={section.background_color || "#DC2626"} onChange={v => update("background_color", v)} />
          <ColorField label="Text Color" value={section.text_color || "#FFFFFF"} onChange={v => update("text_color", v)} />
        </>)}

        {/* WHATSAPP */}
        {section.type === "whatsapp_widget" && (<>
          <Field label="Phone Number" value={section.phone} onChange={v => update("phone", v)} />
          <Field label="Default Message" value={section.message} onChange={v => update("message", v)} multiline />
        </>)}

        {/* FOOTER */}
        {section.type === "footer" && (<>
          <Field label="Copyright" value={section.copyright} onChange={v => update("copyright", v)} />
          <div className="se-sub-title">Columns</div>
          {(section.columns || []).map((col, i) => (
            <div key={i} className="se-sub-item">
              <Field label="Title" value={col.title} onChange={v => updateNested("columns", i, "title", v)} />
              <button className="se-remove-btn" onClick={() => removeFromArray("columns", i)}>Remove</button>
            </div>
          ))}
          <button className="se-add-btn" onClick={() => addToArray("columns", { title: "New Column", links: [] })}>+ Add Column</button>
        </>)}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, multiline }) {
  return (
    <div className="se-field">
      <label className="se-label">{label}</label>
      {multiline ? (
        <textarea className="se-textarea" value={value || ""} onChange={e => onChange(e.target.value)} rows={3} />
      ) : (
        <input className="se-input" type="text" value={value || ""} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div className="se-field se-field--color">
      <label className="se-label">{label}</label>
      <div className="se-color-row">
        <input type="color" value={value || "#000000"} onChange={e => onChange(e.target.value)} className="se-color-picker" />
        <input className="se-input se-input--short" type="text" value={value || ""} onChange={e => onChange(e.target.value)} />
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <div className="se-field">
      <label className="se-label">{label}</label>
      <select className="se-select" value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function sectionLabel(type) {
  const map = { hero: "Hero Section", product_showcase: "Product Showcase", trust_badges: "Trust Badges", social_proof: "Social Proof", faq: "FAQ", urgency_bar: "Urgency Bar", whatsapp_widget: "WhatsApp Widget", footer: "Footer" };
  return map[type] || type;
}

export const editorStyles = `
  .se-panel { padding: 0; }
  .se-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 16px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .se-title { font-family: 'Rubik', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin: 0; }
  .se-actions { display: flex; gap: 4px; }
  .se-icon-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid #334155; background: transparent; color: #94A3B8; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .se-icon-btn:hover:not(:disabled) { border-color: #10B981; color: #10B981; }
  .se-icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .se-icon-btn--danger:hover:not(:disabled) { border-color: #EF4444; color: #EF4444; }
  .se-fields { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
  .se-field { display: flex; flex-direction: column; gap: 4px; }
  .se-label { font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.06em; }
  .se-input, .se-textarea, .se-select { width: 100%; padding: 8px 12px; background: #151B2E; border: 1.5px solid #1E293B; border-radius: 8px; color: #fff; font-size: 13px; font-family: 'Nunito Sans', sans-serif; outline: none; transition: border-color 0.15s; box-sizing: border-box; }
  .se-input:focus, .se-textarea:focus, .se-select:focus { border-color: #10B981; }
  .se-textarea { resize: vertical; min-height: 60px; }
  .se-select { cursor: pointer; appearance: none; }
  .se-input--short { flex: 1; }
  .se-field--color .se-color-row { display: flex; gap: 8px; align-items: center; }
  .se-color-picker { width: 36px; height: 36px; border: 2px solid #334155; border-radius: 8px; cursor: pointer; padding: 0; background: none; }
  .se-sub-title { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.04); }
  .se-sub-item { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
  .se-remove-btn { align-self: flex-end; background: none; border: none; color: #EF4444; font-size: 11px; font-weight: 600; cursor: pointer; padding: 2px 8px; border-radius: 4px; transition: background 0.15s; }
  .se-remove-btn:hover { background: rgba(239,68,68,0.1); }
  .se-add-btn { background: rgba(16,185,129,0.08); border: 1.5px dashed #10B981; border-radius: 8px; color: #10B981; font-size: 12px; font-weight: 600; padding: 8px; cursor: pointer; transition: all 0.15s; text-align: center; }
  .se-add-btn:hover { background: rgba(16,185,129,0.15); }
`;
