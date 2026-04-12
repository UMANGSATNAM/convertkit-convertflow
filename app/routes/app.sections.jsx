import {
  Page,
  Card,
  BlockStack,
  Text,
  Grid,
  Badge,
  Button,
  Tabs,
  InlineStack,
  Spinner,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useNavigate } from "@remix-run/react";
import { useState, useCallback, useEffect, useRef } from "react";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "../data/template-registry";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

// ── Iframe with loading/error fallback ──
function PreviewIframe({ src, title, style, onLoad }) {
  const [status, setStatus] = useState("loading"); // loading | loaded | error | timeout
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!src) return;
    setStatus("loading");
    const timer = setTimeout(() => {
      if (status === "loading") setStatus("timeout");
    }, 12000);
    return () => clearTimeout(timer);
  }, [src]);

  return (
    <div style={{ position: "relative", ...style }}>
      {status === "loading" && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center", background: "#f3f4f6", zIndex: 2,
        }}>
          <Spinner size="large" />
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        style={{
          width: "100%", height: "100%", border: "none",
          borderRadius: 8, background: "#fff",
        }}
        onLoad={() => { setStatus("loaded"); if (onLoad) onLoad(); }}
        onError={() => setStatus("error")}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}

// ── Preview Panel (slides in from right) ──
function PreviewPanel({ template, onClose, onUseTemplate }) {
  const [viewport, setViewport] = useState("desktop");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (template) {
      setPreviewUrl(`/app/preview/${template.id}`);
    }
  }, [template]);

  // Escape key closes
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!template) return null;

  const refreshPreview = () => {
    setPreviewUrl(`/app/preview/${template.id}?_t=${Date.now()}`);
  };

  const iframeWidth = viewport === "mobile" ? "390px" : "100%";

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          zIndex: 99998, animation: "ckFadeIn 200ms ease",
        }}
      />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "65vw",
        minWidth: 500, background: "#fff", zIndex: 99999,
        boxShadow: "-4px 0 32px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column",
        animation: "ckSlideIn 250ms ease",
      }}>
        <div style={{
          padding: "14px 20px", borderBottom: "1px solid #e5e7eb",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>{template.name}</span>
            <Badge tone="success">{template.sectionCount} Sections</Badge>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setViewport("desktop")}
              style={{
                padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: 6,
                background: viewport === "desktop" ? "#111827" : "#fff",
                color: viewport === "desktop" ? "#fff" : "#374151",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              Desktop
            </button>
            <button
              onClick={() => setViewport("mobile")}
              style={{
                padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: 6,
                background: viewport === "mobile" ? "#111827" : "#fff",
                color: viewport === "mobile" ? "#fff" : "#374151",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              Mobile
            </button>
            <button
              onClick={refreshPreview}
              title="Refresh preview"
              style={{
                padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: 6,
                background: "#f9fafb", cursor: "pointer", fontSize: 14,
              }}
            >
              ↻
            </button>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: 6,
                fontSize: 13, textDecoration: "none", color: "#4F46E5", fontWeight: 600,
              }}
            >
              Open fullscreen ↗
            </a>
            <button
              onClick={onClose}
              style={{
                background: "none", border: "none", fontSize: 24, color: "#9ca3af",
                cursor: "pointer", padding: "0 8px", lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>

        <div style={{
          flex: 1, padding: "24px 0", display: "flex", justifyContent: "center",
          background: "#f3f4f6", overflow: "auto",
        }}>
          <div style={{
            width: iframeWidth, maxWidth: "100%", height: "100%",
            border: viewport === "mobile" ? "4px solid #1f2937" : "none",
            borderRadius: viewport === "mobile" ? 24 : 0,
            overflow: "hidden",
            boxShadow: viewport === "mobile" ? "0 25px 50px -12px rgba(0,0,0,0.25)" : "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
            <PreviewIframe
              src={previewUrl}
              title={`Preview: ${template.name}`}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        <div style={{
          padding: "16px 24px", borderTop: "1px solid #e5e7eb",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0,
          background: "#fff"
        }}>
          <Text as="p" variant="bodySm" tone="subdued">
            Press Escape to close
          </Text>
          <div style={{ display: "flex", gap: 12 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={() => onUseTemplate(template.id)}>Use Template</Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ckFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ckSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}
