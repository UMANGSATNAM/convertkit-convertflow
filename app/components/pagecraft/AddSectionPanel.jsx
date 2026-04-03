export default function AddSectionPanel({ onAdd, onClose }) {
  const SECTIONS = [
    { type: "hero", icon: "🎯", label: "Hero", desc: "Headline + CTA" },
    { type: "product_showcase", icon: "🛍️", label: "Products", desc: "Product grid" },
    { type: "trust_badges", icon: "🛡️", label: "Trust Badges", desc: "Shipping, returns, etc" },
    { type: "social_proof", icon: "⭐", label: "Reviews", desc: "Customer reviews" },
    { type: "faq", icon: "❓", label: "FAQ", desc: "Accordion Q&A" },
    { type: "urgency_bar", icon: "⏰", label: "Urgency Bar", desc: "Limited stock alert" },
    { type: "whatsapp_widget", icon: "💬", label: "WhatsApp", desc: "Chat widget" },
    { type: "footer", icon: "📋", label: "Footer", desc: "Links & copyright" },
  ];

  const defaults = {
    hero: { type: "hero", headline: "Your headline here", subtext: "Add your subtext", cta_text: "Shop Now", cta_color: "#10B981", background_color: "#0F172A" },
    product_showcase: { type: "product_showcase", headline: "Our Products", subtext: "Handpicked for you", columns: 3 },
    trust_badges: { type: "trust_badges", badges: [{ icon: "shield", label: "Secure Checkout" }, { icon: "truck", label: "Free Shipping" }, { icon: "refresh", label: "30-Day Returns" }], background_color: "#F8FAFC" },
    social_proof: { type: "social_proof", headline: "What Customers Say", reviews: [{ name: "Customer", rating: 5, text: "Amazing product!", location: "" }] },
    faq: { type: "faq", headline: "FAQ", items: [{ question: "Your question?", answer: "Your answer here." }] },
    urgency_bar: { type: "urgency_bar", message: "🔥 Limited stock — order now!", background_color: "#DC2626", text_color: "#FFFFFF" },
    whatsapp_widget: { type: "whatsapp_widget", phone: "", message: "Hi! I'm interested in your products.", position: "bottom-right" },
    footer: { type: "footer", columns: [{ title: "Shop", links: ["All Products", "New Arrivals"] }], copyright: "© 2025 Your Store" },
  };

  return (
    <div className="asp-overlay" onClick={onClose}>
      <div className="asp-modal" onClick={e => e.stopPropagation()}>
        <div className="asp-head">
          <h3 className="asp-title">Add Section</h3>
          <button className="asp-close" onClick={onClose}>✕</button>
        </div>
        <div className="asp-grid">
          {SECTIONS.map(s => (
            <button key={s.type} className="asp-item" onClick={() => { onAdd(defaults[s.type]); onClose(); }}>
              <span className="asp-icon">{s.icon}</span>
              <span className="asp-label">{s.label}</span>
              <span className="asp-desc">{s.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export const addSectionStyles = `
  .asp-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
  .asp-modal { background: #0F1524; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; width: 420px; max-height: 80vh; overflow-y: auto; }
  .asp-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .asp-title { font-family: 'Rubik', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin: 0; }
  .asp-close { background: none; border: none; color: #64748B; font-size: 16px; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: all 0.15s; }
  .asp-close:hover { color: #fff; background: rgba(255,255,255,0.06); }
  .asp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 16px; }
  .asp-item { background: #151B2E; border: 1.5px solid transparent; border-radius: 10px; padding: 16px 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; transition: all 0.15s; text-align: center; }
  .asp-item:hover { border-color: #10B981; background: rgba(16,185,129,0.06); transform: translateY(-1px); }
  .asp-icon { font-size: 24px; }
  .asp-label { font-size: 13px; font-weight: 700; color: #CBD5E1; }
  .asp-desc { font-size: 11px; color: #475569; }
`;
