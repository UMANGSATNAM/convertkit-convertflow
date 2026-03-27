import { Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState } from "react";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  let timers = [];
  try {
    const shop = await prisma.shop.findUnique({
      where: { shopDomain: session.shop },
      select: { id: true },
    });
    if (shop) {
      timers = await prisma.urgencyTimer.findMany({ where: { shopId: shop.id } });
    }
  } catch {}
  const configMap = {};
  for (const t of timers) {
    configMap[t.displayType] = {
      id: t.id, isActive: t.isActive,
      message: t.message,
      deadline: t.deadline ? t.deadline.toISOString().slice(0, 16) : "",
      productId: t.productId, collectionId: t.collectionId,
    };
  }
  return json({ configMap });
};

const TOOLS = [
  {
    type: "scarcity",
    label: "Inventory Scarcity Counter",
    sub: `Shows "Only X left in stock" with a color-coded progress bar using real Shopify inventory data.`,
    color: "#DC2626",
    bg: "#FEF2F2",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" /></svg>`,
    fields: [{ id: "message", label: "Show when below (units)", type: "number", placeholder: "10", min: 1, max: 20, hint: "Color: green > 10, orange 5–10, red < 5" }],
  },
  {
    type: "countdown",
    label: "Sale Countdown Timer",
    sub: "Real deadline countdown that auto-hides when expired. Never resets on page refresh.",
    color: "#D97706",
    bg: "#FFFBEB",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
    fields: [{ id: "deadline", label: "Sale deadline", type: "datetime-local", hint: "Countdown hides automatically once this passes" }],
  },
  {
    type: "buyer",
    label: "Recent Buyer Notification",
    sub: `Toast notifications showing real orders — "Sarah from Mumbai bought this 2h ago". Requires 5+ real orders.`,
    color: "#2563EB",
    bg: "#EFF6FF",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>`,
    fields: [],
    info: "Requires a minimum of 5 real orders in the last 7 days before it displays.",
  },
  {
    type: "threshold",
    label: "Cart Threshold Progress Bar",
    sub: `Shows "Add $X more for free shipping" with a live progress bar. Updates in real time.`,
    color: "#059669",
    bg: "#ECFDF5",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>`,
    fields: [{ id: "message", label: "Free shipping threshold ($)", type: "number", placeholder: "50", prefix: "$", hint: "Customers see progress toward this amount" }],
  },
  {
    type: "banner",
    label: "Time-Sensitive Offer Banner",
    sub: "Dismissible top-of-page banner with embedded mini countdown. Does not reset on refresh.",
    color: "#7C3AED",
    bg: "#F5F3FF",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" /></svg>`,
    fields: [{ id: "message", label: "Banner message", type: "text", placeholder: "Order in the next {time} for same-day dispatch", hint: "Use {time} as countdown placeholder" }],
  },
];

const defaultConfig = () => ({ isActive: false, message: "", deadline: "", productId: "", collectionId: "" });

export default function UrgencyTools() {
  const { configMap } = useLoaderData();
  const fetcher = useFetcher();
  const isSaving = fetcher.state !== "idle";

  const getConfig = (type) => configMap[type] || defaultConfig();

  // Local state per tool
  const [localConfigs, setLocalConfigs] = useState(() =>
    TOOLS.reduce((acc, t) => { acc[t.type] = { ...getConfig(t.type) }; return acc; }, {})
  );

  const updateField = (type, field, value) =>
    setLocalConfigs((prev) => ({ ...prev, [type]: { ...prev[type], [field]: value } }));

  const toggleTool = (type) => {
    const newActive = !localConfigs[type].isActive;
    setLocalConfigs((prev) => ({ ...prev, [type]: { ...prev[type], isActive: newActive } }));
    saveConfig(type, { ...localConfigs[type], isActive: newActive });
  };

  const saveConfig = (toolType, data) => {
    fetcher.submit(
      { toolType, isActive: String(data.isActive), message: data.message || "", deadline: data.deadline || "" },
      { method: "POST", action: "/api/urgency" }
    );
  };

  return (
    <Page>
      <TitleBar title="Urgency Maker" />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="urg-wrapper">
        {/* Header */}
        <div className="urg-header">
          <div className="urg-eyebrow">Conversion Triggers</div>
          <h1 className="urg-title">Urgency Tools</h1>
          <p className="urg-subtitle">
            Every signal uses real data from your Shopify store. No fake timers. No fabricated counts. If the data doesn't qualify, the widget doesn't show.
          </p>
        </div>

        {fetcher.data?.success && (
          <div className="urg-toast">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
            Configuration saved successfully
          </div>
        )}

        <div className="urg-tools-grid">
          {TOOLS.map((tool) => {
            const config = localConfigs[tool.type];
            const active = config.isActive;
            return (
              <div key={tool.type} className={`urg-tool-card ${active ? "urg-tool-card--active" : ""}`} style={{ "--tool-color": tool.color, "--tool-bg": tool.bg }}>
                {/* Card Header */}
                <div className="urg-tool-header">
                  <div className="urg-tool-icon-wrap">
                    <span dangerouslySetInnerHTML={{ __html: tool.icon }} />
                  </div>
                  <div className="urg-tool-meta">
                    <div className="urg-tool-name">{tool.label}</div>
                    <div className="urg-tool-sub">{tool.sub}</div>
                  </div>
                  <div className="urg-tool-right">
                    <div className={`urg-status-pill ${active ? "urg-status-pill--active" : ""}`}>
                      {active ? "Active" : "Inactive"}
                    </div>
                    <button
                      className={`urg-toggle ${active ? "urg-toggle--on" : ""}`}
                      onClick={() => toggleTool(tool.type)}
                      style={{ "--toggle-on": tool.color }}
                    >
                      <span className="urg-toggle-thumb" />
                    </button>
                  </div>
                </div>

                {/* Fields */}
                {tool.fields.length > 0 && (
                  <div className="urg-tool-fields">
                    {tool.fields.map((field) => (
                      <div key={field.id} className="urg-field">
                        <label className="urg-label">{field.label}</label>
                        <div className="urg-input-wrap">
                          {field.prefix && <span className="urg-prefix">{field.prefix}</span>}
                          <input
                            className={`urg-input ${field.prefix ? "urg-input--prefixed" : ""}`}
                            type={field.type}
                            placeholder={field.placeholder}
                            min={field.min}
                            max={field.max}
                            value={field.id === "deadline" ? config.deadline : config.message}
                            onChange={(e) => updateField(tool.type, field.id === "deadline" ? "deadline" : "message", e.target.value)}
                          />
                        </div>
                        {field.hint && <span className="urg-hint">{field.hint}</span>}
                      </div>
                    ))}
                    <button
                      className="urg-save-btn"
                      onClick={() => saveConfig(tool.type, config)}
                      disabled={isSaving}
                    >
                      {isSaving ? <span className="urg-spinner" /> : null}
                      Save Settings
                    </button>
                  </div>
                )}

                {tool.info && (
                  <div className="urg-info-box">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
                    {tool.info}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Page>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&family=Nunito+Sans:wght@300;400;600&display=swap');

  .urg-wrapper { font-family: 'Nunito Sans', sans-serif; padding: 0 0 80px; max-width: 1140px; margin: 0 auto; }

  .urg-header { padding: 48px 4px 40px; border-bottom: 1px solid #E2E8F0; margin-bottom: 36px; }
  .urg-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #DC2626; margin-bottom: 12px; }
  .urg-title { font-family: 'Rubik', sans-serif; font-size: clamp(28px, 4vw, 42px); font-weight: 700; color: #1E293B; margin: 0 0 12px; letter-spacing: -0.02em; line-height: 1.15; }
  .urg-subtitle { font-size: 15px; font-weight: 300; color: #64748B; max-width: 600px; line-height: 1.65; margin: 0; }

  .urg-toast { background: #ECFDF5; border: 1px solid #86EFAC; border-radius: 10px; padding: 12px 16px; font-size: 13px; font-weight: 600; color: #15803D; display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
  .urg-toast svg { width: 16px; height: 16px; flex-shrink: 0; }

  .urg-tools-grid { display: flex; flex-direction: column; gap: 16px; }

  .urg-tool-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 24px 28px; transition: all 0.2s ease; }
  .urg-tool-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
  .urg-tool-card--active { border-color: var(--tool-color); background: var(--tool-bg); }

  .urg-tool-header { display: flex; align-items: flex-start; gap: 16px; }
  .urg-tool-icon-wrap {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--tool-bg, #EFF6FF);
    border: 1.5px solid var(--tool-color);
    display: flex; align-items: center; justify-content: center;
    color: var(--tool-color); flex-shrink: 0;
  }
  .urg-tool-icon-wrap svg { width: 22px; height: 22px; }
  .urg-tool-meta { flex: 1; }
  .urg-tool-name { font-family: 'Rubik', sans-serif; font-size: 16px; font-weight: 600; color: #1E293B; margin-bottom: 4px; }
  .urg-tool-sub { font-size: 13px; color: #64748B; font-weight: 300; line-height: 1.55; }

  .urg-tool-right { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; flex-shrink: 0; }
  .urg-status-pill { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; background: #F1F5F9; color: #94A3B8; transition: all 0.2s; }
  .urg-status-pill--active { background: var(--tool-color); color: #fff; }

  /* Toggle */
  .urg-toggle { width: 52px; height: 28px; background: #CBD5E1; border-radius: 999px; border: none; cursor: pointer; position: relative; transition: background 0.25s; padding: 0; }
  .urg-toggle--on { background: var(--toggle-on) !important; }
  .urg-toggle-thumb { display: block; width: 22px; height: 22px; background: #fff; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.2); position: absolute; top: 3px; left: 3px; transition: transform 0.25s cubic-bezier(0.4,0,0.2,1); }
  .urg-toggle--on .urg-toggle-thumb { transform: translateX(24px); }

  /* Fields */
  .urg-tool-fields { display: flex; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(0,0,0,0.06); }
  .urg-field { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 180px; }
  .urg-label { font-size: 12px; font-weight: 600; color: #475569; }
  .urg-input-wrap { position: relative; display: flex; align-items: center; }
  .urg-prefix { position: absolute; left: 12px; font-size: 14px; color: #94A3B8; pointer-events: none; }
  .urg-input { font-family: 'Nunito Sans', sans-serif; font-size: 14px; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; outline: none; color: #1E293B; transition: border-color 0.18s, box-shadow 0.18s; width: 100%; background: #fff; }
  .urg-input--prefixed { padding-left: 28px; }
  .urg-input:focus { border-color: var(--tool-color, #2563EB); box-shadow: 0 0 0 3px color-mix(in srgb, var(--tool-color, #2563EB) 12%, transparent); }
  .urg-hint { font-size: 11px; color: #94A3B8; }

  .urg-save-btn { font-family: 'Nunito Sans', sans-serif; font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: 10px; border: none; background: var(--tool-color); color: #fff; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 6px; white-space: nowrap; flex-shrink: 0; }
  .urg-save-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
  .urg-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .urg-spinner { width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: urg-spin 0.7s linear infinite; display: inline-block; }
  @keyframes urg-spin { to { transform: rotate(360deg); } }

  .urg-info-box { margin-top: 16px; padding: 12px 14px; background: rgba(255,255,255,0.7); border: 1px solid rgba(0,0,0,0.07); border-radius: 10px; font-size: 13px; color: #475569; font-weight: 300; display: flex; align-items: flex-start; gap: 8px; }
  .urg-info-box svg { width: 17px; height: 17px; flex-shrink: 0; color: #94A3B8; margin-top: 1px; }
`;
