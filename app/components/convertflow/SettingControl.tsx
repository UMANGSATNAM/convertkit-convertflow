import type { SettingControlProps } from "../../types/convertflow";

const inputStyle: React.CSSProperties = {
  height: 36, width: "100%", border: "1px solid #c9cccf", borderRadius: 6,
  padding: "0 10px", fontSize: 13, color: "#303030", background: "#fff",
  boxSizing: "border-box", outline: "none", fontFamily: "inherit",
};

const focusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#005bd3";
  e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0,91,211,0.2)";
};
const blurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#c9cccf";
  e.currentTarget.style.boxShadow = "none";
};

export default function SettingControl({ setting, value, onChange }: SettingControlProps) {
  const val = value ?? setting.default ?? "";

  switch (setting.type) {
    case "text":
    case "url":
    case "link_list":
    case "collection":
      return (
        <input type="text" value={String(val)} onChange={(e) => onChange(e.target.value)}
          style={inputStyle} placeholder={setting.placeholder || ""} onFocus={focusHandler} onBlur={blurHandler} />
      );

    case "textarea":
      return (
        <textarea value={String(val)} onChange={(e) => onChange(e.target.value)} rows={3}
          style={{ ...inputStyle, height: "auto", minHeight: 72, padding: "8px 10px", resize: "vertical" }}
          onFocus={focusHandler as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
          onBlur={blurHandler as unknown as React.FocusEventHandler<HTMLTextAreaElement>} />
      );

    case "number":
      return (
        <input type="number" value={Number(val)} onChange={(e) => onChange(Number(e.target.value))}
          style={inputStyle} min={setting.min} max={setting.max} step={setting.step}
          onFocus={focusHandler} onBlur={blurHandler} />
      );

    case "color":
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 4, border: "1px solid #c9cccf",
            background: String(val || "#000000"), cursor: "pointer", position: "relative", overflow: "hidden", flexShrink: 0,
          }}>
            <input type="color" value={String(val || "#000000")} onChange={(e) => onChange(e.target.value)}
              style={{ position: "absolute", inset: -4, width: 44, height: 44, cursor: "pointer", opacity: 0 }} />
          </div>
          <input type="text" value={String(val)} onChange={(e) => onChange(e.target.value)}
            style={{ ...inputStyle, flex: 1 }} onFocus={focusHandler} onBlur={blurHandler} />
        </div>
      );

    case "select":
    case "color_scheme":
      return (
        <select value={String(val)} onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, appearance: "none", paddingRight: 28, backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238a8a8a' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
          onFocus={focusHandler as unknown as React.FocusEventHandler<HTMLSelectElement>}
          onBlur={blurHandler as unknown as React.FocusEventHandler<HTMLSelectElement>}>
          {(setting.options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );

    case "radio":
      return (
        <div style={{ display: "inline-flex", border: "1px solid #c9cccf", borderRadius: 6, overflow: "hidden", width: "100%" }}>
          {(setting.options || []).map((opt, idx) => (
            <button key={opt.value} onClick={() => onChange(opt.value)}
              style={{
                flex: 1, height: 32, border: "none", cursor: "pointer", fontSize: 12,
                borderRight: idx < (setting.options?.length ?? 0) - 1 ? "1px solid #c9cccf" : "none",
                background: String(val) === opt.value ? "#f4f4f4" : "#fff",
                color: String(val) === opt.value ? "#1a1a1a" : "#303030",
                fontWeight: String(val) === opt.value ? 600 : 400,
                fontFamily: "inherit",
              }}>
              {opt.label}
            </button>
          ))}
        </div>
      );

    case "range":
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="range" value={Number(val)} onChange={(e) => onChange(Number(e.target.value))}
            min={setting.min || 0} max={setting.max || 100} step={setting.step || 1}
            style={{ flex: 1, accentColor: "#005bd3", height: 4 }} />
          <input type="number" value={Number(val)} onChange={(e) => onChange(Number(e.target.value))}
            style={{ ...inputStyle, width: 48, height: 32, textAlign: "center", padding: 0 }} />
          {setting.unit && <span style={{ fontSize: 12, color: "#6b6b6b", minWidth: 20 }}>{setting.unit}</span>}
        </div>
      );

    case "checkbox": {
      const checked = Boolean(val);
      return (
        <button onClick={() => onChange(!checked)} style={{
          width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer",
          background: checked ? "#005bd3" : "#c9cccf", position: "relative", transition: "background 200ms",
        }}>
          <span style={{
            position: "absolute", top: 2, left: checked ? 18 : 2,
            width: 16, height: 16, borderRadius: "50%", background: "#fff",
            transition: "left 200ms", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }} />
        </button>
      );
    }

    case "image_picker":
      return (
        <button style={{
          ...inputStyle, cursor: "pointer", background: "#fff", textAlign: "left",
          display: "flex", alignItems: "center", gap: 8, color: "#303030",
        }}>
          Select image
        </button>
      );

    default:
      return (
        <input type="text" value={String(val)} onChange={(e) => onChange(e.target.value)}
          style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
      );
  }
}
