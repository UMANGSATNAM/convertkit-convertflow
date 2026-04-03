import { Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate, PLAN_PRO, PLAN_ENTERPRISE } from "../shopify.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState } from "react";

export const loader = async ({ request }) => {
  const { billing, admin } = await authenticate.admin(request);
  const billingCheck = await billing.check();

  let scriptTagActive = false;
  try {
    const stResp = await admin.graphql(`query { scriptTags(first: 10) { edges { node { id src } } } }`);
    const stData = await stResp.json();
    const tags = stData.data?.scriptTags?.edges || [];
    scriptTagActive = tags.some(e => e.node.src.includes("convertkit-widget.min.js"));
  } catch {}

  return json({ billingCheck, PLAN_PRO, PLAN_ENTERPRISE, scriptTagActive });
};

export const action = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const formData = await request.formData();
  const plan = formData.get("plan");
  if (plan === PLAN_PRO || plan === PLAN_ENTERPRISE) {
    await billing.request({ plan, isTest: true });
  }
  return null;
};

const TABS = ["General", "Integrations", "Billing", "Advanced"];

const INTEGRATIONS = [
  {
    id: "klaviyo",
    name: "Klaviyo",
    desc: "Email flows triggered by urgency widget interactions and purchase events.",
    status: "connect",
    color: "#16C2A3",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>`,
  },
  {
    id: "ga4",
    name: "Google Analytics 4",
    desc: "Send PageCraft interaction events to GA4 for cross-platform attribution.",
    status: "connect",
    color: "#F9AB00",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>`,
  },
  {
    id: "meta",
    name: "Meta Pixel",
    desc: "Track add-to-cart and purchase events for Meta Ads optimization.",
    status: "connect",
    color: "#1877F2",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>`,
  },
];

export default function Settings() {
  const { billingCheck, PLAN_PRO, PLAN_ENTERPRISE, scriptTagActive } = useLoaderData();
  const fetcher = useFetcher();
  const scriptFetcher = useFetcher();

  const [activeTab, setActiveTab] = useState("General");
  const [scriptEnabled, setScriptEnabled] = useState(scriptTagActive);
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  const activeSubs = billingCheck?.appSubscriptions || [];
  const currentPlan = activeSubs.length > 0 ? activeSubs[0]?.name : "Free";

  const upgradeToPro = () => fetcher.submit({ plan: PLAN_PRO }, { method: "POST" });
  const upgradeToEnterprise = () => fetcher.submit({ plan: PLAN_ENTERPRISE }, { method: "POST" });

  const toggleScript = () => {
    if (scriptEnabled) {
      scriptFetcher.submit({ _method: "delete", scriptTagId: "" }, { method: "POST", action: "/api/script-tag" });
    } else {
      scriptFetcher.submit({}, { method: "POST", action: "/api/script-tag" });
    }
    setScriptEnabled(!scriptEnabled);
  };

  return (
    <Page>
      <TitleBar title="Settings" />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="st-wrapper">
        {/* Header */}
        <div className="st-header">
          <div className="st-eyebrow">Configuration</div>
          <h1 className="st-title">Settings</h1>
          <p className="st-subtitle">Manage your storefront widget, integrations, billing, and advanced configuration.</p>
        </div>

        {/* Tabs */}
        <div className="st-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`st-tab ${activeTab === tab ? "st-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab: General */}
        {activeTab === "General" && (
          <div className="st-section">
            <div className="st-card">
              <div className="st-card-header">
                <div className="st-card-icon st-card-icon--blue">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg>
                </div>
                <div>
                  <h2 className="st-card-title">Storefront Widget Script</h2>
                  <p className="st-card-sub">Powers sticky cart, urgency tools, trust badges, and upsell popups.</p>
                </div>
                <div className="st-card-actions">
                  <span className={`st-status-pill ${scriptEnabled ? "st-status-pill--on" : ""}`}>{scriptEnabled ? "Active" : "Inactive"}</span>
                  <button
                    className={`st-toggle ${scriptEnabled ? "st-toggle--on" : ""}`}
                    onClick={toggleScript}
                  >
                    <span className="st-toggle-thumb" />
                  </button>
                </div>
              </div>
              {scriptEnabled && (
                <div className="st-success-box">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  Widget is running on your storefront. Enabled features will appear automatically.
                </div>
              )}
            </div>

            <div className="st-card">
              <div className="st-card-header">
                <div className="st-card-icon st-card-icon--gray">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h3M6.75 21h10.5" /></svg>
                </div>
                <div>
                  <h2 className="st-card-title">Sticky Add to Cart</h2>
                  <p className="st-card-sub">Persistent buy button that follows customers as they scroll.</p>
                </div>
                <span className="st-badge">Off by Default</span>
              </div>
              <p className="st-card-hint">Hidden on screens under 768px by default. Enable mobile in widget config to show on all devices.</p>
            </div>
          </div>
        )}

        {/* Tab: Integrations */}
        {activeTab === "Integrations" && (
          <div className="st-section">
            <p className="st-section-desc">Connect third-party tools to extend PageCraft AI's capabilities across your marketing stack.</p>
            {INTEGRATIONS.map(intg => (
              <div key={intg.id} className="st-card">
                <div className="st-card-header">
                  <div className="st-card-icon" style={{ background: intg.color + "20", color: intg.color }}>
                    <span dangerouslySetInnerHTML={{ __html: intg.icon }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 className="st-card-title">{intg.name}</h2>
                    <p className="st-card-sub">{intg.desc}</p>
                  </div>
                  <button className="st-connect-btn">Connect</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Billing */}
        {activeTab === "Billing" && (
          <div className="st-section">
            <div className="st-current-plan-banner">
              <div>
                <div className="st-plan-label">Current Plan</div>
                <div className="st-plan-name">{currentPlan}</div>
              </div>
              <span className={`st-plan-badge ${currentPlan !== "Free" ? "st-plan-badge--pro" : ""}`}>{currentPlan}</span>
            </div>

            {[
              {
                name: "Free",
                price: "$0",
                features: ["Sticky cart widget", "3 sections", "1 theme", "Basic analytics", "100 events/month"],
                action: null,
              },
              {
                name: "Pro",
                price: "$19",
                period: "/mo",
                features: ["All 30+ sections", "All 3 themes", "Urgency tools (5 types)", "AI review writing", "Upsell engine", "PageCraft code extraction", "Unlimited events"],
                action: upgradeToPro,
                highlight: true,
              },
              {
                name: "Enterprise",
                price: "$49",
                period: "/mo",
                features: ["Everything in Pro", "White-label", "Multi-store (up to 10)", "Custom CSS injection", "Priority support", "API access"],
                action: upgradeToEnterprise,
              },
            ].map(plan => (
              <div key={plan.name} className={`st-plan-card ${plan.highlight ? "st-plan-card--highlight" : ""}`}>
                <div className="st-plan-header">
                  <div>
                    <div className="st-plan-card-name">{plan.name}</div>
                    <div className="st-plan-card-price">
                      <span className="st-plan-card-amount">{plan.price}</span>
                      {plan.period && <span className="st-plan-card-period">{plan.period}</span>}
                    </div>
                  </div>
                  {plan.action && (
                    <button className={`st-upgrade-btn ${plan.highlight ? "st-upgrade-btn--primary" : ""}`} onClick={plan.action}>
                      Upgrade
                    </button>
                  )}
                  {!plan.action && currentPlan === "Free" && <span className="st-current-badge">Current</span>}
                </div>
                <ul className="st-plan-features">
                  {plan.features.map(f => (
                    <li key={f}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Advanced */}
        {activeTab === "Advanced" && (
          <div className="st-section">
            <div className="st-card">
              <div className="st-card-header">
                <div className="st-card-icon st-card-icon--purple">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h2 className="st-card-title">Gemini API Key</h2>
                  <p className="st-card-sub">Required for AI review generation. Add to your Railway/server environment.</p>
                </div>
              </div>
              <div className="st-api-field-wrap">
                <input
                  className="st-api-input"
                  type={showGeminiKey ? "text" : "password"}
                  placeholder="GEMINI_API_KEY — set in .env"
                  readOnly
                  value="••••••••••••••••••••••••••••••"
                />
                <button className="st-api-toggle" onClick={() => setShowGeminiKey(!showGeminiKey)}>
                  {showGeminiKey ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  )}
                </button>
              </div>
              <p className="st-card-hint">Configure <code>GEMINI_API_KEY</code> in your server environment variables. Never commit API keys to version control.</p>
            </div>

            <div className="st-card st-card--danger">
              <div className="st-card-header">
                <div className="st-card-icon st-card-icon--red">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                </div>
                <div>
                  <h2 className="st-card-title">Danger Zone</h2>
                  <p className="st-card-sub">Irreversible actions. Proceed with extreme care.</p>
                </div>
              </div>
              <button className="st-danger-btn">Reset All Urgency Timer Configs</button>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&family=Nunito+Sans:wght@300;400;600&display=swap');

  .st-wrapper { font-family: 'Nunito Sans', sans-serif; padding: 0 0 80px; max-width: 900px; margin: 0 auto; }

  .st-header { padding: 48px 4px 36px; border-bottom: 1px solid #E2E8F0; margin-bottom: 32px; }
  .st-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #64748B; margin-bottom: 12px; }
  .st-title { font-family: 'Rubik', sans-serif; font-size: clamp(28px, 4vw, 38px); font-weight: 700; color: #1E293B; margin: 0 0 10px; letter-spacing: -0.02em; }
  .st-subtitle { font-size: 14px; font-weight: 300; color: #64748B; line-height: 1.65; margin: 0; }

  /* Tabs */
  .st-tabs { display: flex; gap: 2px; background: #F1F5F9; padding: 4px; border-radius: 14px; margin-bottom: 28px; }
  .st-tab { flex: 1; font-family: 'Nunito Sans', sans-serif; font-size: 13px; font-weight: 600; padding: 10px 16px; border-radius: 11px; border: none; background: transparent; color: #64748B; cursor: pointer; transition: all 0.2s ease; }
  .st-tab--active { background: #fff; color: #1E293B; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .st-tab:hover:not(.st-tab--active) { color: #1E293B; }

  /* Cards */
  .st-section { display: flex; flex-direction: column; gap: 16px; }
  .st-section-desc { font-size: 14px; color: #64748B; font-weight: 300; margin: 0 0 4px; }

  .st-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 24px; transition: all 0.2s ease; }
  .st-card--danger { border-color: #FECACA; background: #FFF5F5; }

  .st-card-header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 0; }
  .st-card-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .st-card-icon svg { width: 20px; height: 20px; }
  .st-card-icon span svg { width: 20px; height: 20px; }
  .st-card-icon--blue { background: #EFF6FF; color: #2563EB; }
  .st-card-icon--gray { background: #F1F5F9; color: #64748B; }
  .st-card-icon--purple { background: #F5F3FF; color: #7C3AED; }
  .st-card-icon--red { background: #FEF2F2; color: #DC2626; }
  .st-card-title { font-family: 'Rubik', sans-serif; font-size: 15px; font-weight: 600; color: #1E293B; margin: 0 0 3px; }
  .st-card-sub { font-size: 13px; color: #64748B; font-weight: 300; margin: 0; }
  .st-card-hint { font-size: 12px; color: #94A3B8; margin: 12px 0 0; line-height: 1.6; }
  .st-card-hint code { background: #F1F5F9; padding: 1px 6px; border-radius: 4px; font-size: 11px; }
  .st-card-actions { display: flex; align-items: center; gap: 10px; margin-left: auto; flex-shrink: 0; }

  .st-badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; background: #F1F5F9; color: #64748B; margin-left: auto; flex-shrink: 0; }

  /* Toggle */
  .st-toggle { width: 48px; height: 26px; background: #CBD5E1; border-radius: 999px; border: none; cursor: pointer; position: relative; transition: background 0.2s; padding: 0; }
  .st-toggle--on { background: #2563EB; }
  .st-toggle-thumb { display: block; width: 20px; height: 20px; background: #fff; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.2); position: absolute; top: 3px; left: 3px; transition: transform 0.2s ease; }
  .st-toggle--on .st-toggle-thumb { transform: translateX(22px); }

  .st-status-pill { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; background: #F1F5F9; color: #94A3B8; }
  .st-status-pill--on { background: #DCFCE7; color: #15803D; }

  .st-success-box { margin-top: 16px; background: #ECFDF5; border: 1px solid #86EFAC; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #15803D; font-weight: 400; display: flex; align-items: center; gap: 8px; }
  .st-success-box svg { width: 16px; height: 16px; flex-shrink: 0; }

  .st-connect-btn { font-family: 'Nunito Sans', sans-serif; font-size: 13px; font-weight: 600; padding: 8px 18px; border-radius: 10px; border: 1.5px solid #E2E8F0; background: #fff; color: #374151; cursor: pointer; transition: all 0.18s ease; flex-shrink: 0; margin-left: auto; }
  .st-connect-btn:hover { border-color: #2563EB; color: #2563EB; background: #EFF6FF; }

  /* Billing */
  .st-current-plan-banner { background: linear-gradient(135deg, #1E293B, #0F172A); border-radius: 16px; padding: 24px 28px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .st-plan-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); margin-bottom: 6px; }
  .st-plan-name { font-family: 'Rubik', sans-serif; font-size: 22px; font-weight: 700; color: #fff; }
  .st-plan-badge { font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 999px; background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.7); }
  .st-plan-badge--pro { background: #F97316; color: #fff; }

  .st-plan-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 24px; }
  .st-plan-card--highlight { border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  .st-plan-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
  .st-plan-card-name { font-family: 'Rubik', sans-serif; font-size: 16px; font-weight: 600; color: #1E293B; margin-bottom: 4px; }
  .st-plan-card-amount { font-family: 'Rubik', sans-serif; font-size: 28px; font-weight: 700; color: #1E293B; }
  .st-plan-card-period { font-size: 14px; color: #64748B; }
  .st-plan-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
  .st-plan-features li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #475569; }
  .st-plan-features li svg { width: 14px; height: 14px; color: #059669; flex-shrink: 0; }
  .st-upgrade-btn { font-family: 'Nunito Sans', sans-serif; font-size: 13px; font-weight: 600; padding: 9px 20px; border-radius: 10px; border: 1.5px solid #E2E8F0; background: #fff; color: #374151; cursor: pointer; transition: all 0.18s ease; flex-shrink: 0; }
  .st-upgrade-btn--primary { background: linear-gradient(135deg, #2563EB, #1D4ED8); color: #fff; border-color: transparent; box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
  .st-upgrade-btn--primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(37,99,235,0.4); }
  .st-upgrade-btn:hover:not(.st-upgrade-btn--primary) { border-color: #2563EB; color: #2563EB; }
  .st-current-badge { font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 999px; background: #ECFDF5; color: #15803D; }

  /* Advanced */
  .st-api-field-wrap { display: flex; gap: 8px; margin-top: 16px; }
  .st-api-input { flex: 1; font-family: 'Nunito Sans', sans-serif; font-size: 14px; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; color: #1E293B; background: #F8FAFC; outline: none; }
  .st-api-toggle { width: 40px; height: 40px; border: 1.5px solid #E2E8F0; border-radius: 10px; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #64748B; transition: all 0.18s ease; }
  .st-api-toggle:hover { border-color: #7C3AED; color: #7C3AED; }
  .st-api-toggle svg { width: 16px; height: 16px; }

  .st-danger-btn { font-family: 'Nunito Sans', sans-serif; font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: 10px; border: 1.5px solid #FECACA; background: #fff; color: #DC2626; cursor: pointer; transition: all 0.18s ease; margin-top: 16px; }
  .st-danger-btn:hover { background: #FEF2F2; border-color: #FCA5A5; }
`;
