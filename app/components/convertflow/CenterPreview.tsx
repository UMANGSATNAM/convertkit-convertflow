import { useState, useCallback, useEffect } from "react";
import type { CenterPreviewProps } from "../../types/convertflow";

export default function CenterPreview({
  shopDomain, currentPath, viewport, passwordEnabled,
  iframeRef, iframeKey, iframeLoading, onIframeLoad,
}: CenterPreviewProps) {
  const proxyUrl = `/app/convertflow/proxy?shop=${encodeURIComponent(shopDomain)}&path=${encodeURIComponent(currentPath)}`;
  const vpWidth = viewport === "mobile" ? 390 : viewport === "tablet" ? 768 : "100%";
  const [loadError, setLoadError] = useState(false);

  // Reset error on new iframe load
  useEffect(() => { setLoadError(false); }, [iframeKey]);

  // Detect if iframe loaded a login/error page
  const handleLoad = useCallback(() => {
    onIframeLoad();
    try {
      const doc = (iframeRef as React.MutableRefObject<HTMLIFrameElement | null>).current?.contentDocument;
      if (doc) {
        const title = doc.title?.toLowerCase() || "";
        const body = doc.body?.innerText?.trim() || "";
        if (title.includes("log in") || title.includes("sign in") || title.includes("accounts") ||
            body.startsWith("{") && body.includes("PASSWORD_PROTECTED")) {
          setLoadError(true);
        }
      }
    } catch (_e) {
      // Cross-origin — iframe loaded from different domain, meaning proxy worked but store redirected
      // This is actually fine in many cases, but if we got here the proxy might have issues
    }
  }, [onIframeLoad, iframeRef]);

  // Password protected or load error — show fallback
  if (passwordEnabled || loadError) {
    return (
      <div style={{
        flex: 1, background: "#e8e8e8", display: "flex", alignItems: "center",
        justifyContent: "center", height: "calc(100vh - 52px)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        <div style={{ textAlign: "center", maxWidth: 420, padding: 40 }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" strokeWidth="1.2" style={{ marginBottom: 16 }}>
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M2 7h20" />
            <circle cx="5" cy="5" r="0.5" fill="#8a8a8a" />
            <circle cx="7.5" cy="5" r="0.5" fill="#8a8a8a" />
            <circle cx="10" cy="5" r="0.5" fill="#8a8a8a" />
            <path d="M8 13h8M10 16h4" strokeLinecap="round" />
          </svg>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#303030", margin: "0 0 8px" }}>
            {passwordEnabled ? "Store is password protected" : "Preview unavailable"}
          </h3>
          <p style={{ fontSize: 13, color: "#6b6b6b", margin: "0 0 6px", lineHeight: 1.6 }}>
            {passwordEnabled
              ? "Disable password protection in your store settings to preview your store here."
              : "The store preview couldn't load. You can still edit sections and settings using the left and right panels."}
          </p>
          <p style={{ fontSize: 12, color: "#8a8a8a", margin: "0 0 20px" }}>
            Section tree and settings work independently — no preview needed.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {passwordEnabled && (
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
            )}
            <a
              href={`https://${shopDomain}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-block", padding: "8px 16px", border: "1px solid #c9cccf",
                background: "#fff", color: "#303030", borderRadius: 6, textDecoration: "none", fontSize: 13, fontWeight: 600,
              }}
            >
              Open store ↗
            </a>
          </div>
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
              height: h, borderRadius: 8,
              background: "linear-gradient(90deg,#e5e5e5 25%,#f0f0f0 50%,#e5e5e5 75%)",
              backgroundSize: "400% 100%", animation: "cfShimmer 1.5s ease-in-out infinite",
            }} />
          ))}
          <style>{`@keyframes cfShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        </div>
      )}

      {/* Iframe */}
      <div style={{
        width: vpWidth, height: "100%", transition: "width 300ms ease", position: "relative",
        ...(viewport !== "desktop" ? { margin: "16px auto", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.12)", border: "2px solid #d4d4d4" } : {}),
      }}>
        <iframe
          ref={iframeRef as React.LegacyRef<HTMLIFrameElement>}
          key={iframeKey}
          src={proxyUrl}
          title="Store Preview"
          style={{ width: "100%", height: "100%", border: "none", background: "#fff" }}
          onLoad={handleLoad}
        />
      </div>
    </div>
  );
}
