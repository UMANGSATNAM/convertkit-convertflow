import type { RightSettingsPanelProps } from "../../types/convertflow";
import SettingControl from "./SettingControl";

export default function RightSettingsPanel({ selectedSection, values, onChange, onBack, onRemoveSection }: RightSettingsPanelProps) {
  if (!selectedSection) {
    return (
      <div style={{
        width: 320, flexShrink: 0, borderLeft: "1px solid #E5E7EB", background: "#fff",
        height: "calc(100vh - 56px)", display: "flex", flexDirection: "column",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}>
        <div style={{ height: 56, borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", padding: "0 16px" }}>
          <span style={{ color: "#6B7280", fontSize: 13 }}>Select a section to edit its settings</span>
        </div>
      </div>
    );
  }

  if (!selectedSection.schema) {
    return (
      <div style={{
        width: 320, flexShrink: 0, borderLeft: "1px solid #E5E7EB", background: "#fff",
        height: "calc(100vh - 56px)", display: "flex", flexDirection: "column",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}>
        <div style={{ height: 56, borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
          <button onClick={onBack} style={{
            width: 32, height: 32, border: "none", background: "transparent",
            cursor: "pointer", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            marginLeft: -8, color: "#6B7280",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#111827" }}>
            {selectedSection.name || selectedSection.key}
          </span>
        </div>
        <div style={{ padding: 20, textAlign: "center", color: "#9CA3AF" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" style={{ margin: "24px auto 16px" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <p style={{ fontSize: 13, lineHeight: 1.5, margin: "0 0 8px" }}>This section's settings are managed by the theme</p>
          <p style={{ fontSize: 12, color: "#B0B0B0" }}>You can reorder, hide, or remove it from the sidebar</p>
        </div>
        {/* Remove section button */}
        <div style={{ padding: "24px 20px 8px 20px", marginTop: "auto", borderTop: "1px solid #E5E7EB" }}>
          <button
            onClick={() => onRemoveSection(selectedSection.key)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              color: "#DC2626", background: "transparent", border: "1px solid transparent", borderRadius: 6,
              padding: "10px 0", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 150ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#FEE2E2"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
            Remove section
          </button>
        </div>
      </div>
    );
  }

  const schema = selectedSection.schema;
  const sectionName = selectedSection.key;
  const sectionVals = (values[sectionName] || {}) as Record<string, unknown>;

  return (
    <div style={{
      width: 320, flexShrink: 0, borderLeft: "1px solid #E5E7EB", background: "#fff",
      height: "calc(100vh - 56px)", display: "flex", flexDirection: "column", overflow: "hidden",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        height: 56, borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center",
        padding: "0 16px", flexShrink: 0, gap: 12,
      }}>
        <button onClick={onBack} style={{
          width: 32, height: 32, border: "none", background: "transparent",
          cursor: "pointer", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
          marginLeft: -8, color: "#6B7280", transition: "background 150ms, color 150ms",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#F3F4F6"; e.currentTarget.style.color = "#111827"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6B7280"; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {schema.name}
        </span>
      </div>

      {/* Settings */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 0" }}>
        <div style={{ padding: "0 20px" }}>
          {schema.settings.map((setting, idx) => {
            if (setting.type === "header") {
              return (
                <div key={idx} style={{ padding: "16px 0 12px 0", fontSize: 13, fontWeight: 600, color: "#111827", borderTop: idx > 0 ? "1px solid #E5E7EB" : "none", marginTop: idx > 0 ? 16 : 0 }}>
                  {setting.content || setting.label}
                </div>
              );
            }
            if (setting.type === "paragraph") {
              return (
                <p key={idx} style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px 0", lineHeight: 1.5 }}>
                  {setting.content || setting.info}
                </p>
              );
            }

            const val = setting.id ? (sectionVals[setting.id] ?? setting.default ?? "") : "";

            if (setting.type === "checkbox") {
              return (
                <div key={idx} style={{ paddingBottom: 16, display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <SettingControl setting={setting} value={val} onChange={(v) => setting.id && onChange(setting.id, v)} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {setting.label && <span style={{ fontSize: 13, color: "#374151", fontWeight: 500, lineHeight: 1.4 }}>{setting.label}</span>}
                    {setting.info && <span style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{setting.info}</span>}
                  </div>
                </div>
              );
            }

            return (
              <div key={idx} style={{ paddingBottom: 16 }}>
                {setting.label && (
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                    {setting.label}
                  </label>
                )}
                <SettingControl setting={setting} value={val} onChange={(v) => setting.id && onChange(setting.id, v)} />
                {setting.info && (
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>{setting.info}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Remove section button */}
        <div style={{ padding: "24px 20px 8px 20px", marginTop: 8, borderTop: "1px solid #E5E7EB" }}>
          <button
            onClick={() => onRemoveSection(selectedSection.key)}
            style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            color: "#DC2626", background: "transparent", border: "1px solid transparent", borderRadius: 6,
            padding: "10px 0", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 150ms",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#FEE2E2"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
            Remove section
          </button>
        </div>
      </div>
    </div>
  );
}
