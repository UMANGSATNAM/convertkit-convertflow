// ElementRenderer — Maps node types to visual React components
import { ELEMENTS } from "../../data/element-registry";

export default function ElementRenderer({ node, isSelected, onSelect, onInlineEdit, viewport }) {
  const def = ELEMENTS[node.type];
  const p = node.props || {};

  const wrapStyle = {
    position: "relative",
    outline: isSelected ? "2px solid #3B82F6" : "none",
    outlineOffset: "2px",
    cursor: "pointer",
    marginTop: p.marginTop ? `${p.marginTop}px` : undefined,
    marginBottom: p.marginBottom ? `${p.marginBottom}px` : undefined,
    paddingTop: p.paddingTop ? `${p.paddingTop}px` : undefined,
    paddingBottom: p.paddingBottom ? `${p.paddingBottom}px` : undefined,
    paddingLeft: p.paddingLeft ? `${p.paddingLeft}px` : undefined,
    paddingRight: p.paddingRight ? `${p.paddingRight}px` : undefined,
    backgroundColor: p.backgroundColor !== "transparent" ? p.backgroundColor : undefined,
    borderRadius: p.borderRadius ? `${p.borderRadius}px` : undefined,
    borderWidth: p.borderWidth ? `${p.borderWidth}px` : undefined,
    borderStyle: p.borderWidth ? "solid" : undefined,
    borderColor: p.borderColor || undefined,
    boxShadow: p.boxShadow !== "none" ? p.boxShadow : undefined,
    animation: p.animation && p.animation !== "none" ? `pb-${p.animation} 0.6s ease forwards` : undefined,
    transition: "outline 0.15s ease",
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(node.id);
  };

  // Visibility check for device
  if (viewport === "mobile" && p.hideMobile) return null;
  if (viewport === "tablet" && p.hideTablet) return null;
  if (viewport === "desktop" && p.hideDesktop) return null;

  switch (node.type) {
    case "heading":
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Heading" />}
          <EditableTag
            tag={p.tag || "h2"}
            style={{ fontSize: `${p.fontSize || 36}px`, fontWeight: p.fontWeight || "700", color: p.color || "#1E293B", textAlign: p.textAlign || "left", fontFamily: p.fontFamily || "inherit", lineHeight: p.lineHeight || 1.2, letterSpacing: p.letterSpacing || "normal", margin: 0 }}
            value={p.text || "Heading"}
            onEdit={(val) => onInlineEdit(node.id, "text", val)}
            isSelected={isSelected}
          />
        </div>
      );

    case "paragraph":
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Text" />}
          <p
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={(e) => onInlineEdit(node.id, "text", e.target.innerText)}
            style={{ fontSize: `${p.fontSize || 16}px`, fontWeight: p.fontWeight || "400", color: p.color || "#64748B", textAlign: p.textAlign || "left", lineHeight: p.lineHeight || 1.7, fontFamily: p.fontFamily || "inherit", margin: 0, outline: "none" }}
          >
            {p.text || "Text paragraph"}
          </p>
        </div>
      );

    case "image":
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Image" />}
          {p.src ? (
            <img src={p.src} alt={p.alt || "Image"} style={{ width: p.width || "100%", height: p.height || "auto", objectFit: p.objectFit || "cover", borderRadius: p.borderRadius ? `${p.borderRadius}px` : "0", display: "block", maxWidth: "100%" }} />
          ) : (
            <div style={{ width: p.width || "100%", height: p.height || "200px", background: "linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)", borderRadius: p.borderRadius ? `${p.borderRadius}px` : "0", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", fontSize: "14px", fontWeight: "500" }}>
              <span>📷 Click to add image</span>
            </div>
          )}
        </div>
      );

    case "button":
      return (
        <div style={{ ...wrapStyle, textAlign: p.align || "left" }} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Button" />}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{ display: p.fullWidth ? "block" : "inline-block", background: p.backgroundColor || "#10B981", color: p.textColor || "#FFFFFF", fontSize: `${p.fontSize || 16}px`, fontWeight: p.fontWeight || "700", padding: `${p.paddingY || 14}px ${p.paddingX || 32}px`, borderRadius: `${p.borderRadius || 8}px`, textDecoration: "none", textAlign: "center", cursor: "pointer", border: "none", fontFamily: "inherit", letterSpacing: "0.01em", transition: "all 0.2s" }}
          >
            {p.text || "Button"}
          </a>
        </div>
      );

    case "video":
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Video" />}
          <div style={{ aspectRatio: p.aspectRatio || "16/9", background: "#0F172A", borderRadius: `${p.borderRadius || 0}px`, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", overflow: "hidden" }}>
            {p.src ? (
              <iframe src={p.src} style={{ width: "100%", height: "100%", border: "none" }} allow="autoplay; fullscreen" />
            ) : (
              <span style={{ fontSize: 48 }}>▶</span>
            )}
          </div>
        </div>
      );

    case "spacer":
      return (
        <div style={{ ...wrapStyle, height: `${p.height || 40}px`, background: isSelected ? "rgba(59,130,246,0.05)" : "transparent" }} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type={`Spacer ${p.height || 40}px`} />}
        </div>
      );

    case "divider":
      return (
        <div style={{ ...wrapStyle, display: "flex", justifyContent: "center" }} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Divider" />}
          <hr style={{ width: p.width || "100%", border: "none", borderTop: `${p.thickness || 1}px ${p.style || "solid"} ${p.color || "#E2E8F0"}`, margin: 0 }} />
        </div>
      );

    case "icon":
      return (
        <div style={{ ...wrapStyle, textAlign: p.align || "left" }} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Icon" />}
          <span style={{ fontSize: `${p.size || 24}px`, color: p.color || "#1E293B" }}>★</span>
        </div>
      );

    case "html_block":
    case "liquid_block":
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type={node.type === "liquid_block" ? "Liquid" : "HTML"} />}
          <div style={{ background: "#1E293B", color: "#94A3B8", fontFamily: "monospace", fontSize: 12, padding: "16px", borderRadius: 8, minHeight: 60, overflow: "hidden", whiteSpace: "pre-wrap" }}>
            {(p.code || "").substring(0, 200)}
          </div>
        </div>
      );

    // Shopify elements (render placeholders in editor)
    case "product_title":
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Product Title" />}
          <div style={{ fontSize: `${p.fontSize || 32}px`, fontWeight: p.fontWeight || "700", color: p.color || "#1E293B" }}>
            {"{{ product.title }}"}
          </div>
        </div>
      );

    case "product_price":
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Product Price" />}
          <div style={{ fontSize: `${p.fontSize || 24}px`, color: p.color || "#059669", fontWeight: "700" }}>
            $29.99 {p.showCompare && <span style={{ textDecoration: "line-through", color: p.compareColor || "#94A3B8", fontSize: "0.8em", marginLeft: 8 }}>$39.99</span>}
          </div>
        </div>
      );

    case "add_to_cart":
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Add to Cart" />}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {p.showQuantity && (
              <div style={{ display: "flex", border: "1.5px solid #E2E8F0", borderRadius: `${p.buttonRadius || 8}px`, overflow: "hidden" }}>
                <button style={{ width: 40, height: 44, border: "none", background: "#F8FAFC", cursor: "pointer", fontSize: 18 }}>−</button>
                <span style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 600 }}>1</span>
                <button style={{ width: 40, height: 44, border: "none", background: "#F8FAFC", cursor: "pointer", fontSize: 18 }}>+</button>
              </div>
            )}
            <button style={{ flex: 1, background: p.buttonColor || "#1E293B", color: p.textColor || "#FFFFFF", border: "none", padding: "14px 24px", borderRadius: `${p.buttonRadius || 8}px`, fontSize: `${p.buttonFontSize || 16}px`, fontWeight: 700, cursor: "pointer" }}>
              {p.buttonText || "Add to Cart"}
            </button>
          </div>
        </div>
      );

    case "product_images":
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Product Images" />}
          <div style={{ background: "#F1F5F9", borderRadius: `${p.borderRadius || 8}px`, aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
            📷 Product Gallery
          </div>
        </div>
      );

    case "collection_list":
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Collection" />}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${p.columns || 4}, 1fr)`, gap: 16 }}>
            {Array.from({ length: Math.min(p.limit || 4, 8) }).map((_, i) => (
              <div key={i} style={{ background: "#F1F5F9", borderRadius: 8, padding: 12 }}>
                <div style={{ aspectRatio: "1/1", background: "#E2E8F0", borderRadius: 6, marginBottom: 8 }} />
                {p.showTitle && <div style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Product {i + 1}</div>}
                {p.showPrice && <div style={{ fontSize: 13, color: "#059669" }}>$29.99</div>}
              </div>
            ))}
          </div>
        </div>
      );

    case "breadcrumb":
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Breadcrumb" />}
          <div style={{ fontSize: `${p.fontSize || 13}px`, color: p.color || "#64748B" }}>
            Home {p.separator || "/"} <span style={{ color: p.activeColor || "#1E293B" }}>Products</span> {p.separator || "/"} <span style={{ color: p.activeColor || "#1E293B" }}>Product Name</span>
          </div>
        </div>
      );

    // Marketing elements
    case "countdown_timer":
      return (
        <div style={{ ...wrapStyle, background: p.backgroundColor || "#0F172A", padding: "32px", borderRadius: 12, textAlign: "center" }} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Countdown" />}
          <div style={{ color: p.textColor || "#FFFFFF", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>{p.headline || "Sale Ends In"}</div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            {["23", "14", "52", "08"].map((v, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", minWidth: 60 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: p.accentColor || "#EF4444" }}>{v}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{["HRS", "MIN", "SEC", "MS"][i]}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "trust_badges":
      const badges = p.badges || [];
      return (
        <div style={{ ...wrapStyle, background: p.backgroundColor || "#F8FAFC", padding: 24, borderRadius: 12 }} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Trust Badges" />}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
            {badges.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#475569", fontWeight: 600 }}>
                <span style={{ fontSize: p.iconSize || 28 }}>
                  {b.icon === "shield" ? "🛡️" : b.icon === "truck" ? "🚚" : b.icon === "refresh" ? "🔄" : b.icon === "star" ? "⭐" : b.icon === "check" ? "✅" : b.icon === "lock" ? "🔒" : "💎"}
                </span>
                {b.label}
              </div>
            ))}
          </div>
        </div>
      );

    case "testimonial":
      const reviews = p.reviews || [];
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Testimonials" />}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${p.columns || 3}, 1fr)`, gap: 20 }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                <div style={{ color: "#F59E0B", marginBottom: 8 }}>{"★".repeat(r.rating || 5)}</div>
                <p style={{ fontSize: 14, color: "#475569", margin: "0 0 12px", lineHeight: 1.6 }}>{r.text}</p>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>{r.location}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "faq_accordion":
      const items = p.items || [];
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="FAQ" />}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 700, margin: "0 auto" }}>
            {items.map((item, i) => (
              <div key={i} style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px 20px", background: "#FFFFFF" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#1E293B" }}>{item.question}</span>
                  <span style={{ color: p.accentColor || "#10B981", fontSize: 18 }}>+</span>
                </div>
                {i === 0 && <p style={{ fontSize: 14, color: "#64748B", margin: "12px 0 0", lineHeight: 1.6 }}>{item.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      );

    case "newsletter":
      return (
        <div style={{ ...wrapStyle, background: p.backgroundColor || "#0F172A", padding: 48, borderRadius: 16, textAlign: "center" }} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Newsletter" />}
          <div style={{ color: p.textColor || "#FFFFFF", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{p.headline || "Stay in the Loop"}</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 24 }}>{p.subtext || "Get 10% off"}</div>
          <div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto" }}>
            <input placeholder={p.placeholder || "Email"} style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none" }} readOnly />
            <button style={{ background: p.buttonColor || "#10B981", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{p.buttonText || "Subscribe"}</button>
          </div>
        </div>
      );

    case "progress_bar":
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Progress Bar" />}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>{p.label || "Progress"}</span>
            {p.showPercent && <span style={{ fontSize: 13, color: "#64748B" }}>{p.percent || 0}%</span>}
          </div>
          <div style={{ height: `${p.height || 12}px`, background: p.trackColor || "#FEE2E2", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${p.percent || 0}%`, height: "100%", background: p.barColor || "#EF4444", borderRadius: 999, transition: "width 1s ease" }} />
          </div>
        </div>
      );

    case "social_share":
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Social Share" />}
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            {["f", "𝕏", "P", "W"].map((icon, i) => (
              <div key={i} style={{ width: p.size || 36, height: p.size || 36, borderRadius: "50%", background: p.style === "outline" ? "transparent" : p.color || "#1E293B", border: p.style === "outline" ? `2px solid ${p.color || "#1E293B"}` : "none", display: "flex", alignItems: "center", justifyContent: "center", color: p.style === "outline" ? p.color || "#1E293B" : "#FFFFFF", fontSize: 14, fontWeight: 700 }}>
                {icon}
              </div>
            ))}
          </div>
        </div>
      );

    case "table":
      const headers = p.headers || [];
      const rows = p.rows || [];
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Table" />}
          <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: 8, overflow: "hidden" }}>
            <thead>
              <tr>{headers.map((h, i) => <th key={i} style={{ background: p.headerBg || "#0F172A", color: p.headerColor || "#FFF", padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 600 }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ padding: "10px 16px", fontSize: 14, color: "#475569", background: p.striped && ri % 2 ? "#F8FAFC" : "#FFF", borderBottom: "1px solid #E2E8F0" }}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "tabs":
      const tabList = p.tabs || [];
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Tabs" />}
          <div style={{ borderBottom: "2px solid #E2E8F0", display: "flex", gap: 24, marginBottom: 16 }}>
            {tabList.map((tab, i) => (
              <div key={i} style={{ padding: "8px 0", fontSize: 14, fontWeight: 600, color: i === 0 ? p.accentColor || "#10B981" : "#94A3B8", borderBottom: i === 0 ? `2px solid ${p.accentColor || "#10B981"}` : "none", cursor: "pointer" }}>{tab.title}</div>
            ))}
          </div>
          {tabList[0] && <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{tabList[0].content}</p>}
        </div>
      );

    case "form":
      const fields = p.fields || [];
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Form" />}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {fields.map((f, i) => (
              <div key={i}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>{f.label}{f.required && " *"}</label>
                {f.type === "textarea" ? (
                  <textarea style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 14, minHeight: 80, resize: "vertical", boxSizing: "border-box" }} readOnly />
                ) : (
                  <input type={f.type} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} readOnly />
                )}
              </div>
            ))}
            <button style={{ background: p.submitColor || "#10B981", color: "#FFF", border: "none", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>{p.submitText || "Submit"}</button>
          </div>
        </div>
      );

    case "map":
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Map" />}
          <div style={{ height: `${p.height || 400}px`, background: "#E2E8F0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
            🗺️ Map — {p.address || "Address"}
          </div>
        </div>
      );

    case "slider":
      return (
        <div style={wrapStyle} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type="Slider" />}
          <div style={{ height: `${p.height || 400}px`, background: "linear-gradient(135deg, #0F172A, #1E293B)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", position: "relative" }}>
            <span style={{ fontSize: 36 }}>◀ Slide 1 of 3 ▶</span>
          </div>
        </div>
      );

    default:
      return (
        <div style={{ ...wrapStyle, padding: 16, background: "#FEF3C7", borderRadius: 8 }} onClick={handleClick} data-node-id={node.id}>
          {isSelected && <NodeLabel type={node.type} />}
          <div style={{ fontSize: 13, color: "#92400E" }}>⚠ Unknown element: <strong>{node.type}</strong></div>
        </div>
      );
  }
}

// ── Inline editable tag ──
function EditableTag({ tag, style, value, onEdit, isSelected }) {
  const Tag = tag;
  return (
    <Tag
      contentEditable={isSelected}
      suppressContentEditableWarning
      onBlur={(e) => onEdit(e.target.innerText)}
      style={{ ...style, margin: 0, outline: "none" }}
    >
      {value}
    </Tag>
  );
}

// ── Selection label badge ──
function NodeLabel({ type }) {
  return (
    <div style={{ position: "absolute", top: -22, left: 0, background: "#3B82F6", color: "#FFF", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: "4px 4px 0 0", zIndex: 10, whiteSpace: "nowrap", letterSpacing: "0.03em", pointerEvents: "none" }}>
      {type}
    </div>
  );
}
