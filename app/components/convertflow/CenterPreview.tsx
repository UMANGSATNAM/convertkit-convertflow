import { useState, useCallback, useEffect } from "react";
import type { CenterPreviewProps, ViewportMode } from "../../types/convertflow";

function DesktopIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#111827" : "#6B7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
}

function TabletIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#111827" : "#6B7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  );
}

function MobileIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#111827" : "#6B7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  );
}

export default function CenterPreview({
  shopDomain, currentPath, viewport, onViewportChange, passwordEnabled,
  iframeRef, iframeKey, iframeLoading, onIframeLoad,
}: CenterPreviewProps) {
  const proxyUrl = `/app/convertflow/proxy?shop=${encodeURIComponent(shopDomain)}&path=${encodeURIComponent(currentPath)}`;
  const vpWidth = viewport === "mobile" ? 390 : viewport === "tablet" ? 768 : "100%";
  const [loadError, setLoadError] = useState(false);

  useEffect(() => { setLoadError(false); }, [iframeKey]);

  const handleLoad = useCallback(() => {
    onIframeLoad();
    try {
      const doc = (iframeRef as React.MutableRefObject<HTMLIFrameElement | null>).current?.contentDocument;
      if (doc) {
        const title = doc.title?.toLowerCase() || "";
        const body = doc.body?.innerText?.trim() || "";
        if (title.includes("log in") || title.includes("sign in") || title.includes("accounts") ||
            (body.startsWith("{") && body.includes("PASSWORD_PROTECTED"))) {
          setLoadError(true);
        }
      }
    } catch (_e) { }
  }, [onIframeLoad, iframeRef]);

  const viewports: { id: ViewportMode; Icon: typeof DesktopIcon }[] = [
    { id: "desktop", Icon: DesktopIcon },
    { id: "tablet", Icon: TabletIcon },
    { id: "mobile", Icon: MobileIcon },
  ];

  if (passwordEnabled || loadError) {
    return (
      <div style={{ flex: 1, background: "#F4F6F8", display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
        <div style={{ textAlign: "center", maxWidth: 420, padding: 40, background: "#fff", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: "0 0 8px" }}>
            {passwordEnabled ? "Store is password protected" : "Preview unavailable"}
          </h3>
          <p style={{ fontSize: 13, color: "#6b6b6b", margin: "0 0 24px", lineHeight: 1.6 }}>
            {passwordEnabled ? "Disable password protection in your store settings." : "The store preview couldn't load. You can still edit using the sidebars."}
          </p>
          <a href={`https://${shopDomain}${passwordEnabled ? "/admin/online_store/preferences" : ""}`} target="_blank" rel="noopener noreferrer"
             style={{ display: "inline-block", padding: "8px 16px", background: "#008060", color: "#fff", borderRadius: 6, textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
             Open store
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1, background: "#F4F6F8", display: "flex", flexDirection: "column",
      height: "calc(100vh - 56px)", overflow: "hidden", position: "relative",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      
      {/* ── Canvas Toolbar ── */}
      <div style={{
        height: 56, background: "#fff", borderBottom: "1px solid #E5E7EB",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px",
        flexShrink: 0, zIndex: 10, width: "100%", borderTopLeftRadius: 8, borderTopRightRadius: 8,
      }}>
        {/* Left: URL */}
        <div style={{ display: "flex", alignItems: "center", width: "33%" }}>
          <div style={{
            background: "#F3F4F6", padding: "6px 12px", borderRadius: 6, display: "flex", alignItems: "center", gap: 8,
            color: "#6B7280", fontSize: 13, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", maxWidth: 300,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{shopDomain}/</span>
          </div>
        </div>

        {/* Center: Device Toggles */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: "#F3F4F6", padding: 4, borderRadius: 8 }}>
          {viewports.map(({ id, Icon }) => (
            <button
              key={id}
              onClick={() => onViewportChange(id)}
              style={{
                width: 32, height: 32, border: "none", borderRadius: 6, cursor: "pointer",
                background: viewport === id ? "#fff" : "transparent",
                boxShadow: viewport === id ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "background 150ms",
              }}
            >
              <Icon active={viewport === id} />
            </button>
          ))}
        </div>

        {/* Right: Zoom/Refresh */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, width: "33%" }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none",
            color: "#4B5563", fontSize: 13, fontWeight: 500, cursor: "pointer", padding: "6px 8px", borderRadius: 6,
          }} onMouseEnter={(e) => { e.currentTarget.style.background = "#F3F4F6"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
          <div style={{ height: 16, width: 1, background: "#E5E7EB", margin: "0 4px" }} />
          <button style={{
            display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none",
            color: "#4B5563", fontSize: 13, fontWeight: 500, cursor: "pointer", padding: "6px 8px", borderRadius: 6,
          }} onMouseEnter={(e) => { e.currentTarget.style.background = "#F3F4F6"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
            100%
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>
      </div>

      {/* ── Canvas Area ── */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 0" }}>
        
        {/* Skeleton loading */}
        {iframeLoading && (
          <div style={{
            position: "absolute", top: 88, left: 32, right: 32, bottom: 32, background: "#fff", zIndex: 5, borderRadius: 8,
            display: "flex", flexDirection: "column", padding: 24, gap: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}>
            {[80, 200, 120, 60, 160].map((h, i) => (
              <div key={i} style={{
                height: h, borderRadius: 8,
                background: "linear-gradient(90deg,#F3F4F6 25%,#E5E7EB 50%,#F3F4F6 75%)",
                backgroundSize: "400% 100%", animation: "cfShimmer 1.5s ease-in-out infinite",
              }} />
            ))}
            <style>{`@keyframes cfShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
          </div>
        )}

        {/* Iframe */}
        <div style={{
          width: vpWidth, height: viewport === "desktop" ? "100%" : "800px", minHeight: viewport === "desktop" ? "100%" : "auto", 
          maxWidth: 1200, transition: "width 300ms ease", position: "relative",
          background: "#fff", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          borderRadius: viewport === "desktop" ? 8 : 24, overflow: "hidden", border: viewport === "desktop" ? "none" : "8px solid #111827",
        }}>
          <iframe
            ref={iframeRef as React.LegacyRef<HTMLIFrameElement>}
            key={iframeKey} src={proxyUrl} title="Store Preview"
            style={{ width: "100%", height: "100%", border: "none", background: "#fff" }}
            onLoad={handleLoad}
          />
        </div>
      </div>
    </div>
  );
}
