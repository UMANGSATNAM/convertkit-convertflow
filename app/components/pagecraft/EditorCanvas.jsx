import { useState, useCallback, useEffect, useRef } from "react";
import { getSectionMeta } from "./sectionRegistry";

export default function EditorCanvas({
  sections, selectedId, viewport, onSelect, onReorder,
  onInlineEdit, onAddBetween,
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const [dragIdx, setDragIdx] = useState(null);
  const [dropIdx, setDropIdx] = useState(null);
  const canvasRef = useRef(null);

  const handleDragStart = useCallback((e, idx) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(idx));
  }, []);

  const handleDragOver = useCallback((e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropIdx(idx);
  }, []);

  const handleDrop = useCallback((e, toIdx) => {
    e.preventDefault();
    if (dragIdx !== null && dragIdx !== toIdx) onReorder(dragIdx, toIdx);
    setDragIdx(null);
    setDropIdx(null);
  }, [dragIdx, onReorder]);

  const handleDragEnd = useCallback(() => { setDragIdx(null); setDropIdx(null); }, []);

  const vpWidth = viewport === "mobile" ? 375 : viewport === "tablet" ? 768 : "100%";

  return (
    <div className="pcc-canvas-wrap">
      <div className="pcc-canvas-scroll" ref={canvasRef}>
        <div className="pcc-canvas" style={{ maxWidth: vpWidth, margin: "0 auto", transition: "max-width 0.3s ease" }}>
          {sections.map((sec, idx) => {
            if (!sec.visible) return null;
            const meta = getSectionMeta(sec.type);
            const isSelected = sec.id === selectedId;
            const isHovered = sec.id === hoveredId;
            const isDragging = dragIdx === idx;

            return (
              <div key={sec.id}>
                {/* Drop zone above */}
                {dropIdx === idx && dragIdx !== null && dragIdx !== idx && (
                  <div className="pcc-drop-indicator" />
                )}
                {/* Add between button */}
                {idx > 0 && (
                  <div className="pcc-between-zone" onClick={() => onAddBetween(idx)}>
                    <div className="pcc-between-line" />
                    <button className="pcc-between-btn">+</button>
                    <div className="pcc-between-line" />
                  </div>
                )}
                <div
                  className={`pcc-section ${isSelected ? "pcc-section--selected" : ""}`}
                  onClick={() => onSelect(sec.id)}
                  onMouseEnter={() => setHoveredId(sec.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Hover/select overlay */}
                  {(isHovered || isSelected) && (
                    <div className="pcc-section-overlay">
                      <span className="pcc-section-tag">{meta.icon} {meta.label}</span>
                    </div>
                  )}
                  <SectionRenderer section={sec} onInlineEdit={onInlineEdit} />
                </div>
              </div>
            );
          })}
          {/* Final add button */}
          <div className="pcc-between-zone pcc-between-zone--end" onClick={() => onAddBetween(sections.length)}>
            <div className="pcc-between-line" />
            <button className="pcc-between-btn">+</button>
            <div className="pcc-between-line" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Renderer — renders visual preview of each section type
function SectionRenderer({ section: s, onInlineEdit }) {
  const editProps = (field) => ({
    suppressContentEditableWarning: true,
    contentEditable: true,
    onBlur: (e) => onInlineEdit(s.id, field, e.currentTarget.textContent),
    style: { outline: "none", cursor: "text" },
  });

  switch (s.type) {
    case "hero":
      return (
        <div style={{ background: s.background_gradient || s.background_color || "#0F172A", padding: `${s.padding_y || 80}px 32px`, textAlign: s.alignment || "center", color: s.text_color || "#fff", borderRadius: 10 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.15, fontFamily: "'Rubik', sans-serif" }} {...editProps("headline")}>{s.headline}</h2>
          <p style={{ fontSize: 16, opacity: 0.75, margin: "0 0 24px", maxWidth: 560, lineHeight: 1.6, ...(s.alignment === "center" ? { marginLeft: "auto", marginRight: "auto" } : {}) }} {...editProps("subtext")}>{s.subtext}</p>
          {s.cta_text && <span style={{ display: "inline-block", padding: "12px 32px", background: s.cta_color || "#10B981", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "default" }}>{s.cta_text}</span>}
        </div>
      );

    case "video_hero":
      return (
        <div style={{ background: s.background_color || "#000", padding: `${s.padding_y || 80}px 32px`, textAlign: "center", color: s.text_color || "#fff", borderRadius: 10, position: "relative" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 12px", fontFamily: "'Rubik', sans-serif", position: "relative", zIndex: 2 }} {...editProps("headline")}>{s.headline}</h2>
          <p style={{ fontSize: 15, opacity: 0.75, margin: "0 0 20px", position: "relative", zIndex: 2 }} {...editProps("subtext")}>{s.subtext}</p>
          <div style={{ background: "#1E293B", borderRadius: 8, height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", fontSize: 14, position: "relative", zIndex: 2 }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M8 5v14l11-7z"/></svg>
          </div>
          {s.cta_text && <span style={{ display: "inline-block", padding: "10px 28px", background: s.cta_color || "#3B82F6", borderRadius: 8, fontWeight: 700, fontSize: 14, marginTop: 20, position: "relative", zIndex: 2 }}>{s.cta_text}</span>}
        </div>
      );

    case "announcement_bar":
      return (
        <div style={{ background: s.background_color || "#1E293B", color: s.text_color || "#fff", padding: `${s.padding_y || 12}px 20px`, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
          <span {...editProps("message")}>{s.message}</span>
          {s.link_text && <span style={{ textDecoration: "underline", opacity: 0.85, cursor: "default", fontSize: 12 }}>{s.link_text} →</span>}
        </div>
      );

    case "product_showcase":
      return (
        <div style={{ padding: `${s.padding_y || 48}px 24px`, textAlign: "center", background: s.background_color || "#fff", borderRadius: 10 }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px", color: "#1E293B", fontFamily: "'Rubik', sans-serif" }} {...editProps("headline")}>{s.headline}</h3>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 28px" }} {...editProps("subtext")}>{s.subtext}</p>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${s.columns || 3}, 1fr)`, gap: 16, maxWidth: 720, margin: "0 auto" }}>
            {(s.products || [{ name: "Product 1", price: "$29" }, { name: "Product 2", price: "$39" }, { name: "Product 3", price: "$49" }]).map((p, i) => (
              <div key={i} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: 16, textAlign: "center" }}>
                <div style={{ height: 120, background: "linear-gradient(135deg, #E2E8F0, #CBD5E1)", borderRadius: 8, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 0 0 2.25-2.25V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 4 }}>{p.name}</div>
                {s.show_prices && <div style={{ fontSize: 14, fontWeight: 700, color: "#059669" }}>{p.price}</div>}
              </div>
            ))}
          </div>
        </div>
      );

    case "image_with_text":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, background: s.background_color || "#F8FAFC", borderRadius: 10, overflow: "hidden", minHeight: 260 }}>
          {s.image_position !== "right" && (
            <div style={{ background: "linear-gradient(135deg, #CBD5E1, #94A3B8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>
              {s.image_url ? <img src={s.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 0 0 2.25-2.25V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
              )}
            </div>
          )}
          <div style={{ padding: `${s.padding_y || 48}px 32px`, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
            <h3 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B", margin: 0, fontFamily: "'Rubik', sans-serif" }} {...editProps("headline")}>{s.headline}</h3>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }} {...editProps("text")}>{s.text}</p>
            {s.cta_text && <span style={{ display: "inline-block", padding: "10px 24px", background: s.cta_color || "#10B981", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "default", alignSelf: "flex-start" }}>{s.cta_text}</span>}
          </div>
          {s.image_position === "right" && (
            <div style={{ background: "linear-gradient(135deg, #CBD5E1, #94A3B8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 0 0 2.25-2.25V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
            </div>
          )}
        </div>
      );

    case "brand_logos":
      return (
        <div style={{ padding: `${s.padding_y || 32}px 24px`, textAlign: "center", background: s.background_color || "#fff", borderRadius: 10 }}>
          {s.headline && <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94A3B8", margin: "0 0 20px" }}>{s.headline}</p>}
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", alignItems: "center" }}>
            {(s.logos || []).map((l, i) => (
              <span key={i} style={{ fontSize: 16, fontWeight: 800, color: "#475569", letterSpacing: "0.05em", opacity: 0.5 }}>{l.text || l.name}</span>
            ))}
          </div>
        </div>
      );

    case "trust_badges":
      return (
        <div style={{ padding: `${s.padding_y || 24}px 20px`, background: s.background_color || "#F8FAFC", display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap", borderRadius: 10 }}>
          {(s.badges || []).map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#475569" }}>
              <span style={{ width: 28, height: 28, background: "rgba(16,185,129,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#10B981" }}>✓</span>
              {b.label}
            </div>
          ))}
        </div>
      );

    case "social_proof":
      return (
        <div style={{ padding: `${s.padding_y || 48}px 24px`, textAlign: "center", background: s.background_color || "#fff", borderRadius: 10 }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 24px", color: "#1E293B", fontFamily: "'Rubik', sans-serif" }} {...editProps("headline")}>{s.headline}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, maxWidth: 720, margin: "0 auto" }}>
            {(s.reviews || []).slice(0, 3).map((r, i) => (
              <div key={i} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20, textAlign: "left" }}>
                <div style={{ color: "#F59E0B", fontSize: 14, marginBottom: 10 }}>{"★".repeat(r.rating || 5)}{"☆".repeat(5 - (r.rating || 5))}</div>
                <p style={{ fontSize: 13, color: "#475569", margin: "0 0 12px", lineHeight: 1.6 }}>"{r.text}"</p>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{r.name}</div>
                {r.location && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{r.location}</div>}
              </div>
            ))}
          </div>
        </div>
      );

    case "faq":
      return (
        <div style={{ padding: `${s.padding_y || 48}px 24px`, maxWidth: 600, margin: "0 auto", background: s.background_color || "#fff", borderRadius: 10 }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, textAlign: "center", margin: "0 0 24px", color: "#1E293B", fontFamily: "'Rubik', sans-serif" }} {...editProps("headline")}>{s.headline}</h3>
          {(s.items || []).map((item, i) => (
            <div key={i} style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 18px", marginBottom: 8, background: "#F8FAFC" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {item.question}
                <span style={{ color: "#94A3B8", fontSize: 18 }}>+</span>
              </div>
              <p style={{ fontSize: 13, color: "#64748B", margin: "8px 0 0", lineHeight: 1.6 }}>{item.answer}</p>
            </div>
          ))}
        </div>
      );

    case "newsletter":
      return (
        <div style={{ background: s.background_color || "#0F172A", color: s.text_color || "#fff", padding: `${s.padding_y || 48}px 32px`, textAlign: "center", borderRadius: 10 }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", fontFamily: "'Rubik', sans-serif" }} {...editProps("headline")}>{s.headline}</h3>
          <p style={{ fontSize: 14, opacity: 0.7, margin: "0 0 24px" }} {...editProps("subtext")}>{s.subtext}</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", maxWidth: 420, margin: "0 auto" }}>
            <div style={{ flex: 1, padding: "12px 16px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#94A3B8", fontSize: 13 }}>{s.placeholder || "Enter your email"}</div>
            <span style={{ padding: "12px 24px", background: s.button_color || "#10B981", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "default" }}>{s.button_text || "Subscribe"}</span>
          </div>
        </div>
      );

    case "countdown_timer":
      return (
        <div style={{ background: s.background_color || "#0F172A", color: s.text_color || "#fff", padding: `${s.padding_y || 48}px 32px`, textAlign: "center", borderRadius: 10 }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", fontFamily: "'Rubik', sans-serif" }} {...editProps("headline")}>{s.headline}</h3>
          <p style={{ fontSize: 14, opacity: 0.7, margin: "0 0 24px" }} {...editProps("subtext")}>{s.subtext}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            {["Days", "Hours", "Mins", "Secs"].map((u, i) => (
              <div key={u} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "'Rubik', sans-serif", background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px", minWidth: 60, border: `2px solid ${s.accent_color || "#EF4444"}` }}>
                  {[3, 14, 27, 45][i]}
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 6, opacity: 0.6 }}>{u}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "urgency_bar":
      return (
        <div style={{ background: s.background_color || "#DC2626", color: s.text_color || "#fff", padding: `${s.padding_y || 12}px 20px`, textAlign: "center", borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
          <span {...editProps("message")}>{s.message}</span>
        </div>
      );

    case "cta_banner":
      return (
        <div style={{ background: s.background_color || "#10B981", color: s.text_color || "#fff", padding: `${s.padding_y || 48}px 32px`, textAlign: "center", borderRadius: 10 }}>
          <h3 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", fontFamily: "'Rubik', sans-serif" }} {...editProps("headline")}>{s.headline}</h3>
          <p style={{ fontSize: 15, opacity: 0.85, margin: "0 0 24px" }} {...editProps("subtext")}>{s.subtext}</p>
          {s.cta_text && <span style={{ display: "inline-block", padding: "12px 32px", background: s.cta_color || "rgba(255,255,255,0.2)", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "2px solid rgba(255,255,255,0.4)" }}>{s.cta_text}</span>}
        </div>
      );

    case "whatsapp_widget":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: "#25D366", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 600 }}>
          <svg viewBox="0 0 24 24" fill="#fff" width="24" height="24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.487l4.624-1.467A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.178-.594-5.918-1.627l-.424-.253-2.742.87.878-2.688-.278-.442A9.77 9.77 0 012.182 12c0-5.419 4.4-9.818 9.818-9.818S21.818 6.581 21.818 12 17.419 21.818 12 21.818z"/></svg>
          <div>
            <div>WhatsApp Chat Widget</div>
            <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 400 }}>{s.phone || "Configure phone number →"}</div>
          </div>
        </div>
      );

    case "footer":
      return (
        <div style={{ background: s.background_color || "#0F172A", color: s.text_color || "#94A3B8", padding: `${s.padding_y || 48}px 24px`, borderRadius: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${(s.columns || []).length || 3}, 1fr)`, gap: 32, maxWidth: 720, margin: "0 auto" }}>
            {(s.columns || []).map((col, i) => (
              <div key={i}>
                <h4 style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{col.title}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {(col.links || []).map((link, j) => (
                    <li key={j} style={{ marginBottom: 6 }}><span style={{ fontSize: 13, cursor: "default" }}>{link}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {s.copyright && <p style={{ textAlign: "center", margin: "28px 0 0", fontSize: 12, color: "#475569" }}>{s.copyright}</p>}
        </div>
      );

    default:
      return <div style={{ padding: 24, textAlign: "center", color: "#64748B", fontSize: 13 }}>Unknown section: {s.type}</div>;
  }
}

export const canvasStyles = `
  .pcc-canvas-wrap { flex: 1; background: #1A1D2E; display: flex; flex-direction: column; overflow: hidden; position: relative; }
  .pcc-canvas-scroll { flex: 1; overflow-y: auto; padding: 24px 32px; }
  .pcc-canvas-scroll::-webkit-scrollbar { width: 6px; }
  .pcc-canvas-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 6px; }

  .pcc-canvas { display: flex; flex-direction: column; gap: 0; }

  .pcc-section {
    position: relative; border-radius: 10px; overflow: hidden;
    border: 2px solid transparent; transition: border-color 0.15s, box-shadow 0.2s;
    cursor: pointer;
  }
  .pcc-section:hover { border-color: rgba(99,102,241,0.4); }
  .pcc-section--selected { border-color: #10B981 !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.15); }
  .pcc-section--dragging { opacity: 0.4; }

  .pcc-section-overlay {
    position: absolute; top: 0; left: 0; right: 0; z-index: 10;
    display: flex; justify-content: center; padding-top: 6px; pointer-events: none;
  }
  .pcc-section-tag {
    background: rgba(12,16,33,0.85); backdrop-filter: blur(8px);
    color: #CBD5E1; font-size: 11px; font-weight: 600; padding: 4px 12px;
    border-radius: 6px; display: flex; align-items: center; gap: 4px;
  }

  .pcc-between-zone {
    display: flex; align-items: center; gap: 0; padding: 4px 0; opacity: 0; transition: opacity 0.15s;
    cursor: pointer; margin: -2px 0;
  }
  .pcc-canvas:hover .pcc-between-zone,
  .pcc-between-zone--end { opacity: 1; }
  .pcc-between-zone:hover { opacity: 1; }
  .pcc-between-line { flex: 1; height: 1px; background: rgba(16,185,129,0.3); }
  .pcc-between-btn {
    width: 22px; height: 22px; border-radius: 50%; background: rgba(16,185,129,0.15);
    border: 1.5px solid rgba(16,185,129,0.4); color: #10B981; font-size: 14px;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
    transition: all 0.15s; font-weight: 700; line-height: 1; flex-shrink: 0;
  }
  .pcc-between-btn:hover { background: #10B981; color: #fff; border-color: #10B981; }

  .pcc-drop-indicator { height: 3px; background: #10B981; border-radius: 3px; margin: 4px 0; box-shadow: 0 0 10px rgba(16,185,129,0.5); }
`;
