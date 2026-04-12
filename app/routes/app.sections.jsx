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

import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({ ok: true });
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

export default function TemplateLibrary() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [activePreview, setActivePreview] = useState(null);

  const activeCategory = TEMPLATE_CATEGORIES[selectedCategory];
  
  const filteredTemplates = TEMPLATES.filter(
    (t) => activeCategory.id === "all" || t.category === activeCategory.id
  );

  const tabs = TEMPLATE_CATEGORIES.map((cat, index) => ({
    id: cat.id,
    content: cat.label,
    accessibilityLabel: cat.label,
    panelID: `${cat.id}-panel`,
  }));

  const handleUseTemplate = (templateId) => {
    navigate(`/app/builder/new?templateId=${templateId}`);
  };

  return (
    <Page fullWidth>
      <TitleBar title="Template Library" />
      <BlockStack gap="500">
        <div style={{ padding: "0 10px" }}>
          <Text as="h1" variant="headingLg">PageCraft Template Library</Text>
          <Text as="p" tone="subdued">Select from our collection of high-converting, fully responsive landing page templates.</Text>
        </div>

        <Tabs tabs={tabs} selected={selectedCategory} onSelect={setSelectedCategory}>
          <div style={{ paddingTop: "20px" }}>
            {filteredTemplates.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", background: "#f9fafb", borderRadius: "12px", border: "1px dashed #d1d5db" }}>
                <Text as="p" tone="subdued">No templates found in this category yet. Check back soon!</Text>
              </div>
            ) : (
              <Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
                {filteredTemplates.map((template) => (
                  <Grid.Cell key={template.id}>
                    <div 
                      onClick={() => setActivePreview(template)}
                      style={{ 
                        cursor: "pointer", 
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        border: "1px solid #e5e7eb",
                        overflow: "hidden",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                      }}
                    >
                      {/* Visual Header */}
                      <div style={{ 
                        height: "140px", 
                        background: template.gradient || "#f3f4f6", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        fontSize: "48px"
                      }}>
                        {template.icon}
                      </div>

                      {/* Content */}
                      <div style={{ padding: "16px", display: "flex", flexDirection: "column", flexGrow: 1, gap: "10px" }}>
                        <div>
                          <Text as="h3" variant="headingMd" fontWeight="bold">
                            {template.name}
                          </Text>
                          <Text as="p" tone="subdued" variant="bodySm">
                            {template.description.slice(0, 80)}...
                          </Text>
                        </div>
                        
                        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Badge tone="success">{template.sectionCount} Sections</Badge>
                          <Text as="span" variant="bodySm" tone="subdued" fontWeight="medium">
                            {template.niche.toUpperCase()}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </Grid.Cell>
                ))}
              </Grid>
            )}
          </div>
        </Tabs>
      </BlockStack>

      <PreviewPanel 
        template={activePreview} 
        onClose={() => setActivePreview(null)}
        onUseTemplate={handleUseTemplate}
      />
    </Page>
  );
}
