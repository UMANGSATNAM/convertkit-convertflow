// app/builder/components/BlockRenderer.tsx
import React, { useState } from "react";
import type { Block } from "../types";

interface BlockRendererProps {
  block: Block;
  isInteractive?: boolean;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, isInteractive = true }) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mainImage, setMainImage] = useState<string | null>(null);

  const styleObj: React.CSSProperties = {
    fontSize: block.styles?.fontSize,
    fontWeight: block.styles?.fontWeight,
    lineHeight: block.styles?.lineHeight,
    textAlign: block.styles?.textAlign,
    color: block.styles?.textColor,
    backgroundColor: block.styles?.backgroundColor,
    paddingTop: block.styles?.paddingTop !== undefined ? `${block.styles.paddingTop}px` : undefined,
    paddingBottom: block.styles?.paddingBottom !== undefined ? `${block.styles.paddingBottom}px` : undefined,
    paddingLeft: block.styles?.paddingLeft !== undefined ? `${block.styles.paddingLeft}px` : undefined,
    paddingRight: block.styles?.paddingRight !== undefined ? `${block.styles.paddingRight}px` : undefined,
    marginTop: block.styles?.marginTop !== undefined ? `${block.styles.marginTop}px` : undefined,
    marginBottom: block.styles?.marginBottom !== undefined ? `${block.styles.marginBottom}px` : undefined,
    borderRadius: block.styles?.borderRadius !== undefined ? `${block.styles.borderRadius}px` : undefined,
    borderWidth: block.styles?.borderWidth !== undefined ? `${block.styles.borderWidth}px` : undefined,
    borderColor: block.styles?.borderColor,
    borderStyle: block.styles?.borderStyle && block.styles.borderStyle !== "none" ? block.styles.borderStyle : undefined,
    width: block.styles?.width,
    maxWidth: block.styles?.maxWidth,
    boxSizing: "border-box",
  };

  switch (block.type) {
    case "heading": {
      const Tag = (block.settings?.tag || "h2") as any;
      return <Tag style={{ margin: 0, ...styleObj }}>{block.settings?.text || "Headline Text"}</Tag>;
    }

    case "paragraph": {
      return <p style={{ margin: 0, ...styleObj }}>{block.settings?.text || "Paragraph text goes here."}</p>;
    }

    case "button": {
      return (
        <a
          href={block.settings?.url || "#"}
          onClick={(e) => {
            if (!isInteractive) e.preventDefault();
          }}
          style={{
            display: "inline-block",
            textDecoration: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            ...styleObj,
          }}
        >
          {block.settings?.text || "Button"}
        </a>
      );
    }

    case "image": {
      return (
        <img
          src={block.settings?.src || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"}
          alt={block.settings?.alt || "Image"}
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block",
            ...styleObj,
          }}
        />
      );
    }

    case "video": {
      return (
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "12px", ...styleObj }}>
          <iframe
            src={block.settings?.embedUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
            allowFullScreen
            title="Video Embed"
          />
        </div>
      );
    }

    case "divider": {
      return (
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e2e8f0",
            margin: "16px 0",
            ...styleObj,
          }}
        />
      );
    }

    case "product_title": {
      const Tag = (block.settings?.tag || "h1") as any;
      return <Tag style={{ margin: 0, ...styleObj }}>{block.settings?.text || "Luminous Skincare Elixir"}</Tag>;
    }

    case "product_price": {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", ...styleObj }}>
          <span style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a" }}>
            {block.settings?.price || "₹1,499"}
          </span>
          <span style={{ textDecoration: "line-through", color: "#94a3b8", fontSize: "18px" }}>
            {block.settings?.comparePrice || "₹2,499"}
          </span>
          <span
            style={{
              backgroundColor: "#fef2f2",
              color: "#b91c1c",
              fontSize: "12px",
              fontWeight: "700",
              padding: "3px 8px",
              borderRadius: "4px",
            }}
          >
            {block.settings?.badgeText || "SAVE 40%"}
          </span>
        </div>
      );
    }

    case "product_gallery": {
      const images: string[] = block.settings?.images || [
        "https://images.unsplash.com/photo-1608248597359-251f5e8b39aa?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
      ];
      const activeSrc = mainImage || images[0];
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", ...styleObj }}>
          <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
            <img src={activeSrc} alt="Product view" style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
          {images.length > 1 && (
            <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Thumbnail ${i}`}
                  onClick={() => setMainImage(img)}
                  style={{
                    width: "64px",
                    height: "64px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: activeSrc === img ? "2px solid #0284c7" : "1px solid #e2e8f0",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    case "product_variants": {
      const options = block.settings?.options || [{ name: "Size", values: ["30ml (Trial)", "50ml (Popular)", "100ml"] }];
      return (
        <div style={{ ...styleObj }}>
          {options.map((opt: any, oIdx: number) => (
            <div key={oIdx} style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                Select {opt.name}:
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {opt.values.map((v: string, vIdx: number) => (
                  <button
                    key={vIdx}
                    type="button"
                    onClick={() => setSelectedVariant(vIdx)}
                    style={{
                      padding: "8px 16px",
                      border: selectedVariant === vIdx ? "1.5px solid #0284c7" : "1px solid #cbd5e1",
                      backgroundColor: selectedVariant === vIdx ? "#f0f9ff" : "#ffffff",
                      color: selectedVariant === vIdx ? "#0284c7" : "#334155",
                      fontWeight: selectedVariant === vIdx ? "700" : "500",
                      fontSize: "13px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    case "product_stock_urgency": {
      const pct = block.settings?.percentage || 85;
      return (
        <div style={{ backgroundColor: "#fff1f2", border: "1px solid #fecdd3", borderRadius: "8px", padding: "12px", ...styleObj }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "700", color: "#9f1239", marginBottom: "6px" }}>
            <span>{block.settings?.text || "⚡ High Demand: Only 6 units left in stock!"}</span>
            <span>Few Remaining</span>
          </div>
          <div style={{ backgroundColor: "#ffe4e6", height: "8px", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{ backgroundColor: "#e11d48", width: `${pct}%`, height: "100%", borderRadius: "999px" }} />
          </div>
        </div>
      );
    }

    case "product_rating": {
      const rating = block.settings?.rating || 4.9;
      const count = block.settings?.reviewsCount || 1842;
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", ...styleObj }}>
          <span style={{ fontSize: "16px" }}>⭐⭐⭐⭐⭐</span>
          <span style={{ fontWeight: "700", color: "#0f172a" }}>{rating}</span>
          <span style={{ color: "#64748b", fontSize: "13px" }}>({count.toLocaleString()} Reviews)</span>
          <span style={{ backgroundColor: "#ecfdf5", color: "#047857", fontSize: "11px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px" }}>
            ✓ Verified
          </span>
        </div>
      );
    }

    case "product_atc": {
      return (
        <div style={{ display: "flex", gap: "10px", ...styleObj }}>
          {block.settings?.showQuantity && (
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "8px", backgroundColor: "#f8fafc" }}>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{ padding: "10px 14px", border: "none", background: "transparent", fontSize: "16px", cursor: "pointer" }}
              >
                -
              </button>
              <span style={{ width: "32px", textAlign: "center", fontWeight: "700", fontSize: "14px" }}>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                style={{ padding: "10px 14px", border: "none", background: "transparent", fontSize: "16px", cursor: "pointer" }}
              >
                +
              </button>
            </div>
          )}
          <button
            type="button"
            style={{
              flex: 1,
              backgroundColor: block.styles?.backgroundColor || "#0284c7",
              color: block.styles?.textColor || "#ffffff",
              border: "none",
              borderRadius: block.styles?.borderRadius ? `${block.styles.borderRadius}px` : "8px",
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <span>🛒</span>
            <span>{block.settings?.text || "ADD TO CART"}</span>
          </button>
        </div>
      );
    }

    case "product_buynow": {
      return (
        <button
          type="button"
          style={{
            width: "100%",
            backgroundColor: block.styles?.backgroundColor || "#f59e0b",
            color: block.styles?.textColor || "#0f172a",
            border: "none",
            borderRadius: block.styles?.borderRadius ? `${block.styles.borderRadius}px` : "8px",
            padding: "15px 24px",
            fontSize: "15px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            ...styleObj,
          }}
        >
          {block.settings?.text || "⚡ BUY NOW WITH CASH ON DELIVERY"}
        </button>
      );
    }

    case "countdown_timer": {
      const h = block.settings?.hours || 3;
      const m = block.settings?.minutes || 45;
      const s = block.settings?.seconds || 20;
      return (
        <div style={{ textAlign: "center", ...styleObj }}>
          <div style={{ fontSize: "12px", fontWeight: "800", letterSpacing: "0.5px", color: "#b91c1c", marginBottom: "6px" }}>
            {block.settings?.title || "FLASH SALE ENDS IN:"}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
            <div style={{ backgroundColor: "#0f172a", color: "#ffffff", padding: "6px 12px", borderRadius: "6px", fontWeight: "800", fontSize: "18px" }}>
              {String(h).padStart(2, "0")}h
            </div>
            <div style={{ backgroundColor: "#0f172a", color: "#ffffff", padding: "6px 12px", borderRadius: "6px", fontWeight: "800", fontSize: "18px" }}>
              {String(m).padStart(2, "0")}m
            </div>
            <div style={{ backgroundColor: "#0f172a", color: "#ffffff", padding: "6px 12px", borderRadius: "6px", fontWeight: "800", fontSize: "18px" }}>
              {String(s).padStart(2, "0")}s
            </div>
          </div>
        </div>
      );
    }

    case "trust_badges": {
      const badges = block.settings?.badges || [
        { icon: "🚚", title: "Free Express Shipping", desc: "Across India" },
        { icon: "💵", title: "Cash on Delivery", desc: "Available at checkout" },
        { icon: "🛡️", title: "100% Clean Formula", desc: "Cruelty Free" },
        { icon: "🔄", title: "7-Day Returns", desc: "No questions asked" },
      ];
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "10px",
            ...styleObj,
          }}
        >
          {badges.map((b: any, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", backgroundColor: "#ffffff", borderRadius: "6px", border: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: "22px" }}>{b.icon}</span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{b.title}</div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    case "testimonial": {
      return (
        <div style={{ ...styleObj }}>
          <div style={{ color: "#d97706", marginBottom: "8px" }}>⭐⭐⭐⭐⭐</div>
          <p style={{ fontSize: "15px", fontStyle: "italic", color: "#334155", lineHeight: "1.5", marginBottom: "12px" }}>
            {block.settings?.quote || "“Remarkable results within just a few days. Customer service was top notch!”"}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#475569" }}>
              {(block.settings?.name || "A")[0]}
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{block.settings?.name || "Verified Customer"}</div>
              <div style={{ fontSize: "11px", color: "#059669", fontWeight: "600" }}>✓ Verified Purchase</div>
            </div>
          </div>
        </div>
      );
    }

    case "faq_accordion": {
      const faqs = block.settings?.faqs || [
        { q: "How soon do I receive my order?", a: "Dispatched within 24 hours. Delivery takes 2-4 business days." },
        { q: "Can I return the product?", a: "Yes, we offer a 100% money-back guarantee within 14 days." },
      ];
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", ...styleObj }}>
          {faqs.map((item: any, i: number) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#ffffff" }}>
                <div
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  style={{
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#0f172a",
                    userSelect: "none",
                  }}
                >
                  <span>{item.q}</span>
                  <span style={{ fontSize: "18px", color: "#94a3b8" }}>{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <div style={{ padding: "0 16px 14px 16px", fontSize: "13px", color: "#475569", lineHeight: "1.6", borderTop: "1px solid #f8fafc" }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    case "pincode_checker": {
      return (
        <div style={{ ...styleObj }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
            📍 Check Delivery & COD Availability
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder={block.settings?.placeholder || "Enter 6-digit Pincode"}
              maxLength={6}
              style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" }}
            />
            <button
              type="button"
              style={{ padding: "8px 16px", backgroundColor: "#0284c7", color: "#ffffff", border: "none", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
            >
              Check
            </button>
          </div>
        </div>
      );
    }

    case "whatsapp_chat": {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            ...styleObj,
          }}
        >
          <span>💬</span>
          <span>{block.settings?.text || "Chat with Us on WhatsApp"}</span>
        </div>
      );
    }

    default:
      return <div style={{ padding: "12px", background: "#f1f5f9", borderRadius: "6px", fontSize: "12px" }}>Block: {block.type}</div>;
  }
};
