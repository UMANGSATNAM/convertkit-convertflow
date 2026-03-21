import type { CenterPreviewProps } from "../../types/convertflow";

export default function CenterPreview({
  shopDomain, currentPath, viewport, passwordEnabled,
  iframeRef, iframeKey, iframeLoading, onIframeLoad,
}: CenterPreviewProps) {
  const proxyUrl = `/app/convertflow/proxy?shop=${encodeURIComponent(shopDomain)}&path=${encodeURIComponent(currentPath)}`;

  const vpWidth = viewport === "mobile" ? 390 : viewport === "tablet" ? 768 : "100%";

  if (passwordEnabled) {
    return (
      <div style={{
        flex: 1, background: "#e8e8e8", display: "flex", alignItems: "center",
        justifyContent: "center", height: "calc(100vh - 52px)",
      }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" strokeWidth="1.5" style={{ marginBottom: 16 }}>
            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#303030", margin: "0 0 8px" }}>
            Store is password protected
          </h3>
          <p style={{ fontSize: 13, color: "#6b6b6b", margin: "0 0 20px", lineHeight: 1.5 }}>
            Disable password protection to preview your store
          </p>
          <a
            href={`https://${shopDomain}/admin/online_store/preferences`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-block", padding: "8px 16px", background: "#1a1a1a",
              color: "#fff", borderRadius: 6, textDecoration: "none", fontSize: 13, fontWeight: 600,
            }}
          >
            Open preferences
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1, background: "#e8e8e8", display: "flex", flexDirection: "column",
      alignItems: "center", height: "calc(100vh - 52px)", overflow: "hidden", position: "relative",
    }}>
      {/* Skeleton loading */}
      {iframeLoading && (
        <div style={{
          position: "absolute", inset: 0, background: "#f0f0f0", zIndex: 5,
          display: "flex", flexDirection: "column", padding: 24, gap: 12,
        }}>
          {[80, 200, 120, 60, 160].map((h, i) => (
            <div key={i} style={{
              height: h, borderRadius: 8, background: "linear-gradient(90deg,#e5e5e5 25%,#f0f0f0 50%,#e5e5e5 75%)",
              backgroundSize: "400% 100%", animation: "cfShimmer 1.5s ease-in-out infinite",
            }} />
          ))}
          <style>{`@keyframes cfShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        </div>
      )}

      {/* Iframe container */}
      <div style={{
        width: vpWidth, height: "100%", transition: "width 300ms ease",
        position: "relative",
        ...(viewport !== "desktop" ? { margin: "16px auto", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.12)", border: "2px solid #d4d4d4" } : {}),
      }}>
        <iframe
          ref={iframeRef as React.LegacyRef<HTMLIFrameElement>}
          key={iframeKey}
          src={proxyUrl}
          title="Store Preview"
          style={{ width: "100%", height: "100%", border: "none", background: "#fff" }}
          onLoad={onIframeLoad}
        />
      </div>
    </div>
  );
}
