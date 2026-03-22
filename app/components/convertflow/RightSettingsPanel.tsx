import type { RightSettingsPanelProps } from "../../types/convertflow";
import SettingControl from "./SettingControl";

export default function RightSettingsPanel({ selectedSection, values, onChange, onBack }: RightSettingsPanelProps) {
  if (!selectedSection || !selectedSection.schema) {
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

  const schema = selectedSection.schema;
  const sectionName = selectedSection.key.replace("sections/", "").replace(".liquid", "");
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
          <button style={{
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
