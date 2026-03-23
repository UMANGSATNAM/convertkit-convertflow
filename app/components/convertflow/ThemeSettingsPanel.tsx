import { useState, useMemo } from "react";
import type { ShopifySetting } from "../../types/convertflow";
import SettingControl from "./SettingControl";

interface ThemeSettingGroup {
  name: string;
  settings: ShopifySetting[];
}

interface ThemeSettingsPanelProps {
  themeSettings: Record<string, unknown>;
  settingsSchema: ThemeSettingGroup[];
  onChange: (groupIdx: number, settingId: string, value: unknown) => void;
  onBack: () => void;
}

const FALLBACK_GROUPS: ThemeSettingGroup[] = [
  {
    name: "Colors",
    settings: [
      { type: "color", id: "colors_solid_button_labels", label: "Solid button label", default: "#ffffff" },
      { type: "color", id: "colors_accent_1", label: "Accent 1", default: "#121212" },
      { type: "color", id: "colors_accent_2", label: "Accent 2", default: "#334FB4" },
      { type: "color", id: "colors_text", label: "Text", default: "#121212" },
      { type: "color", id: "colors_outline_button_labels", label: "Outline button", default: "#121212" },
      { type: "color", id: "colors_background_1", label: "Background 1", default: "#FFFFFF" },
      { type: "color", id: "colors_background_2", label: "Background 2", default: "#F3F3F3" },
    ],
  },
  {
    name: "Typography",
    settings: [
      { type: "select", id: "type_header_font", label: "Heading font", options: [{ value: "assistant_n4", label: "Assistant" }, { value: "roboto_n4", label: "Roboto" }, { value: "inter_n4", label: "Inter" }] },
      { type: "range", id: "heading_scale", label: "Heading size scale", min: 80, max: 150, step: 5, unit: "%", default: 100 },
      { type: "select", id: "type_body_font", label: "Body font", options: [{ value: "assistant_n4", label: "Assistant" }, { value: "roboto_n4", label: "Roboto" }, { value: "inter_n4", label: "Inter" }] },
      { type: "range", id: "body_scale", label: "Body size scale", min: 80, max: 130, step: 5, unit: "%", default: 100 },
    ],
  },
  {
    name: "Layout",
    settings: [
      { type: "range", id: "page_width", label: "Page width", min: 1000, max: 1600, step: 100, unit: "px", default: 1200 },
      { type: "range", id: "spacing_sections", label: "Space between sections", min: 0, max: 100, step: 4, unit: "px", default: 0 },
      { type: "range", id: "spacing_grid_horizontal", label: "Horizontal space", min: 4, max: 40, step: 4, unit: "px", default: 8 },
      { type: "range", id: "spacing_grid_vertical", label: "Vertical space", min: 4, max: 40, step: 4, unit: "px", default: 8 },
    ],
  },
  {
    name: "Buttons",
    settings: [
      { type: "range", id: "buttons_border_thickness", label: "Border thickness", min: 0, max: 12, step: 1, unit: "px", default: 1 },
      { type: "range", id: "buttons_border_opacity", label: "Border opacity", min: 0, max: 100, step: 5, unit: "%", default: 100 },
      { type: "range", id: "buttons_radius", label: "Corner radius", min: 0, max: 40, step: 2, unit: "px", default: 0 },
      { type: "range", id: "buttons_shadow_opacity", label: "Shadow opacity", min: 0, max: 100, step: 5, unit: "%", default: 0 },
    ],
  },
  {
    name: "Inputs",
    settings: [
      { type: "range", id: "inputs_border_thickness", label: "Border thickness", min: 0, max: 12, step: 1, unit: "px", default: 1 },
      { type: "range", id: "inputs_border_opacity", label: "Border opacity", min: 0, max: 100, step: 5, unit: "%", default: 55 },
      { type: "range", id: "inputs_radius", label: "Corner radius", min: 0, max: 40, step: 2, unit: "px", default: 0 },
      { type: "range", id: "inputs_shadow_opacity", label: "Shadow opacity", min: 0, max: 100, step: 5, unit: "%", default: 0 },
    ],
  },
  {
    name: "Social media",
    settings: [
      { type: "text", id: "social_twitter_link", label: "X (Twitter)", placeholder: "https://x.com/shopify" },
      { type: "text", id: "social_facebook_link", label: "Facebook", placeholder: "https://facebook.com/shopify" },
      { type: "text", id: "social_instagram_link", label: "Instagram", placeholder: "https://instagram.com/shopify" },
      { type: "text", id: "social_tiktok_link", label: "TikTok", placeholder: "https://tiktok.com/@shopify" },
      { type: "text", id: "social_youtube_link", label: "YouTube", placeholder: "https://youtube.com/shopify" },
      { type: "text", id: "social_pinterest_link", label: "Pinterest", placeholder: "https://pinterest.com/shopify" },
    ],
  },
];

function GroupIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  const s = { flexShrink: 0 } as const;

  if (n.includes("color")) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s}>
        <circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12a10 10 0 005.012 8.66"/>
      </svg>
    );
  }
  if (n.includes("typo")) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s}>
        <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
      </svg>
    );
  }
  if (n.includes("layout")) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s}>
        <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
      </svg>
    );
  }
  if (n.includes("button")) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s}>
        <rect x="2" y="7" width="20" height="10" rx="2"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    );
  }
  if (n.includes("input")) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s}>
        <path d="M12 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.375 2.625a1 1 0 013 3l-9.013 9.014a2 2 0 01-.853.505l-2.873.84a.5.5 0 01-.62-.62l.84-2.873a2 2 0 01.506-.852z"/>
      </svg>
    );
  }
  if (n.includes("social")) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s}>
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s}>
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  );
}

export default function ThemeSettingsPanel({
  themeSettings,
  settingsSchema,
  onChange,
  onBack,
}: ThemeSettingsPanelProps) {
  const groups = settingsSchema.length > 0 ? settingsSchema : FALLBACK_GROUPS;
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  if (expandedGroup !== null) {
    const group = groups.find((g) => g.name === expandedGroup);
    if (!group) return null;

    return (
      <div style={{
        display: "flex", flexDirection: "column", height: "100%",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}>
        {/* Group header */}
        <div style={{
          height: 52, borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center",
          padding: "0 16px", flexShrink: 0, gap: 10, background: "#fff",
        }}>
          <button onClick={() => setExpandedGroup(null)} style={{
            width: 28, height: 28, border: "none", background: "transparent",
            cursor: "pointer", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#6B7280", transition: "background 150ms, color 150ms", marginLeft: -4,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#F3F4F6"; e.currentTarget.style.color = "#111827"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6B7280"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#111827" }}>{group.name}</span>
        </div>

        {/* Settings list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {group.settings.map((setting, idx) => {
            if (setting.type === "header") {
              return (
                <div key={idx} style={{
                  padding: "14px 0 10px 0", fontSize: 13, fontWeight: 600, color: "#111827",
                  borderTop: idx > 0 ? "1px solid #E5E7EB" : "none", marginTop: idx > 0 ? 12 : 0,
                }}>
                  {setting.content || setting.label}
                </div>
              );
            }
            if (setting.type === "paragraph") {
              return (
                <p key={idx} style={{ fontSize: 13, color: "#6B7280", margin: "0 0 14px 0", lineHeight: 1.5 }}>
                  {setting.content || setting.info}
                </p>
              );
            }

            const val = setting.id
              ? (themeSettings[setting.id] ?? setting.default ?? "")
              : "";
            const groupIdx = groups.indexOf(group);

            return (
              <div key={idx} style={{ paddingBottom: 14 }}>
                {setting.label && (
                  <label style={{
                    display: "block", fontSize: 11, fontWeight: 600, color: "#9CA3AF",
                    textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6,
                  }}>
                    {setting.label}
                  </label>
                )}
                <SettingControl setting={setting} value={val} onChange={(v) => setting.id && onChange(groupIdx, setting.id, v)} />
                {setting.info && (
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{setting.info}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        height: 52, borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center",
        padding: "0 16px", flexShrink: 0, gap: 10, background: "#fff",
      }}>
        <button onClick={onBack} style={{
          width: 28, height: 28, border: "none", background: "transparent",
          cursor: "pointer", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
          color: "#6B7280", transition: "background 150ms, color 150ms", marginLeft: -4,
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#F3F4F6"; e.currentTarget.style.color = "#111827"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6B7280"; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#111827" }}>Theme settings</span>
      </div>

      {/* Group list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {groups.map((group) => (
          <div
            key={group.name}
            onClick={() => setExpandedGroup(group.name)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
              cursor: "pointer", transition: "background 150ms", color: "#374151", fontSize: 14,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#F9FAFB"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <GroupIcon name={group.name} />
            <span style={{ flex: 1, fontWeight: 500 }}>{group.name}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
