import type { RightSettingsPanelProps } from "../../types/convertflow";
import SettingControl from "./SettingControl";

export default function RightSettingsPanel({ selectedSection, values, onChange, onBack }: RightSettingsPanelProps) {
  if (!selectedSection || !selectedSection.schema) {
    return (
      <div style={{
        width: 300, flexShrink: 0, borderLeft: "1px solid #e3e3e3", background: "#fff",
        height: "calc(100vh - 52px)", display: "flex", flexDirection: "column",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        <div style={{ height: 48, borderBottom: "1px solid #e3e3e3", display: "flex", alignItems: "center", padding: "0 16px" }}>
          <span style={{ color: "#6b6b6b", fontSize: 13 }}>Select a section to edit its settings</span>
        </div>
      </div>
    );
  }

  const schema = selectedSection.schema;
  const sectionName = selectedSection.key.replace("sections/", "").replace(".liquid", "");
  const sectionVals = (values[sectionName] || {}) as Record<string, unknown>;

  return (
    <div style={{
      width: 300, flexShrink: 0, borderLeft: "1px solid #e3e3e3", background: "#fff",
      height: "calc(100vh - 52px)", display: "flex", flexDirection: "column", overflow: "hidden",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        height: 48, borderBottom: "1px solid #e3e3e3", display: "flex", alignItems: "center",
        padding: "0 8px 0 4px", flexShrink: 0, gap: 4,
      }}>
        <button onClick={onBack} style={{
          width: 32, height: 32, border: "none", background: "transparent",
          cursor: "pointer", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f4f4"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {schema.name}
        </span>
        <button style={{
          width: 32, height: 32, border: "none", background: "transparent",
          cursor: "pointer", borderRadius: 6, color: "#8a8a8a", fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>⋯</button>
      </div>

      {/* Settings */}
      <div style={{ flex: 1, overflowY: "auto", padding: 0 }}>
        {schema.settings.map((setting, idx) => {
          if (setting.type === "header") {
            return (
              <div key={idx} style={{ padding: "20px 16px 8px 16px", fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
                {setting.content || setting.label}
              </div>
            );
          }
          if (setting.type === "paragraph") {
            return (
              <p key={idx} style={{ fontSize: 12, color: "#6b6b6b", padding: "0 16px 12px 16px", margin: 0, lineHeight: 1.5 }}>
                {setting.content || setting.info}
              </p>
            );
          }

          const val = setting.id ? (sectionVals[setting.id] ?? setting.default ?? "") : "";

          // Checkbox: label and toggle on same row
          if (setting.type === "checkbox") {
            return (
              <div key={idx} style={{ padding: "0 16px 16px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {setting.label && <span style={{ fontSize: 13, color: "#616161" }}>{setting.label}</span>}
                <SettingControl setting={setting} value={val} onChange={(v) => setting.id && onChange(setting.id, v)} />
              </div>
            );
          }

          return (
            <div key={idx} style={{ padding: "0 16px 16px 16px" }}>
              {setting.label && (
                <label style={{ display: "block", fontSize: 13, color: "#616161", marginBottom: 6 }}>
                  {setting.label}
                </label>
              )}
              <SettingControl setting={setting} value={val} onChange={(v) => setting.id && onChange(setting.id, v)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
