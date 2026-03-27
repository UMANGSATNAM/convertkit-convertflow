import { Page, BlockStack } from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import { useState, useEffect } from "react";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findUnique({
    where: { shopDomain: session.shop },
    select: { settings: true },
  });
  const settings = shop?.settings ? JSON.parse(shop.settings) : {};
  // Support both legacy single object and new array format
  let rules = settings.upsells || [];
  if (!Array.isArray(rules) && settings.upsell) {
    rules = [settings.upsell];
  }
  return json({ rules });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const rulesJson = formData.get("rules");
  let rules = [];
  try { rules = JSON.parse(rulesJson); } catch {}

  const shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  const settings = shop?.settings ? JSON.parse(shop.settings) : {};
  settings.upsells = rules;

  await prisma.shop.update({
    where: { shopDomain: session.shop },
    data: { settings: JSON.stringify(settings) },
  });

  return json({ success: true });
};

const emptyRule = () => ({
  id: Date.now(),
  isActive: true,
  triggerHandle: "",
  offerHandle: "",
  title: "Wait! Add this to your order",
  discountText: "10% OFF",
});

export default function Upsells() {
  const { rules: initialRules } = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const shopify = useAppBridge();

  const [rules, setRules] = useState(
    initialRules.length > 0 ? initialRules : []
  );
  const isSaving = navigation.state === "submitting";

  useEffect(() => {
    if (navigation.state === "idle" && navigation.formMethod === "POST") {
      shopify.toast.show("Upsell rules saved");
    }
  }, [navigation.state, navigation.formMethod, shopify]);

  const addRule = () => setRules((prev) => [...prev, emptyRule()]);

  const removeRule = (id) => setRules((prev) => prev.filter((r) => r.id !== id));

  const updateRule = (id, field, value) =>
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const toggleRule = (id) =>
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)));

  const handleSave = () => {
    submit({ rules: JSON.stringify(rules) }, { method: "POST" });
  };

  return (
    <Page>
      <TitleBar title="Upsell Engine" />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="upsell-wrapper">
        {/* Header */}
        <div className="upsell-header">
          <div className="upsell-eyebrow">Conversion Engine</div>
          <h1 className="upsell-title">In-Cart Upsell Rules</h1>
          <p className="upsell-subtitle">
            When a customer adds a trigger product, show a targeted offer popup. Each rule increases Average Order Value with zero code.
          </p>
        </div>

        <div className="upsell-layout">
          {/* Rules Column */}
          <div className="upsell-rules-col">
            {rules.length === 0 && (
              <div className="upsell-empty">
                <div className="upsell-empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                </div>
                <p className="upsell-empty-text">No rules yet. Create your first upsell rule to start boosting AOV.</p>
              </div>
            )}

            {rules.map((rule, idx) => (
              <div key={rule.id} className={`upsell-rule-card ${rule.isActive ? "upsell-rule-card--active" : ""}`}>
                <div className="upsell-rule-header">
                  <div className="upsell-rule-index">Rule {idx + 1}</div>
                  <div className="upsell-rule-actions">
                    <button
                      className={`upsell-toggle ${rule.isActive ? "upsell-toggle--on" : ""}`}
                      onClick={() => toggleRule(rule.id)}
                      title={rule.isActive ? "Deactivate" : "Activate"}
                    >
                      <span className="upsell-toggle-thumb" />
                    </button>
                    <span className="upsell-rule-status">{rule.isActive ? "Active" : "Inactive"}</span>
                    <button className="upsell-delete-btn" onClick={() => removeRule(rule.id)} title="Delete rule">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                    </button>
                  </div>
                </div>

                <div className="upsell-rule-fields">
                  <div className="upsell-field-group">
                    <label className="upsell-label">Trigger Product Handle</label>
                    <input
                      className="upsell-input"
                      placeholder="e.g. blue-sneakers-xl"
                      value={rule.triggerHandle}
                      onChange={(e) => updateRule(rule.id, "triggerHandle", e.target.value)}
                    />
                    <span className="upsell-hint">When this product is added to cart</span>
                  </div>
                  <div className="upsell-field-group">
                    <label className="upsell-label">Offer Product Handle</label>
                    <input
                      className="upsell-input"
                      placeholder="e.g. shoe-cleaning-kit"
                      value={rule.offerHandle}
                      onChange={(e) => updateRule(rule.id, "offerHandle", e.target.value)}
                    />
                    <span className="upsell-hint">This product is offered in the popup</span>
                  </div>
                  <div className="upsell-field-group">
                    <label className="upsell-label">Popup Title</label>
                    <input
                      className="upsell-input"
                      placeholder="Wait! Add this to your order"
                      value={rule.title}
                      onChange={(e) => updateRule(rule.id, "title", e.target.value)}
                    />
                  </div>
                  <div className="upsell-field-group">
                    <label className="upsell-label">Discount Badge Text</label>
                    <input
                      className="upsell-input"
                      placeholder="10% OFF"
                      value={rule.discountText}
                      onChange={(e) => updateRule(rule.id, "discountText", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="upsell-rule-footer-actions">
              <button className="upsell-add-btn" onClick={addRule}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Add Rule
              </button>
              <button className="upsell-save-btn" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <span className="upsell-spinner" /> : null}
                {isSaving ? "Saving…" : "Save All Rules"}
              </button>
            </div>
          </div>

          {/* How It Works Sidebar */}
          <div className="upsell-sidebar">
            <div className="upsell-howto">
              <h3 className="upsell-howto-title">How It Works</h3>
              {[
                { step: "01", title: "Trigger detected", body: "Customer adds the trigger product to their cart." },
                { step: "02", title: "Popup appears", body: "A beautiful modal shows the offer product with your discount badge." },
                { step: "03", title: "One-click accept", body: "Both products are added to the cart instantly — no page reload." },
                { step: "04", title: "AOV increases", body: "Average order value increases by 15–30% with a single rule." },
              ].map(({ step, title, body }) => (
                <div key={step} className="upsell-step">
                  <div className="upsell-step-num">{step}</div>
                  <div>
                    <div className="upsell-step-title">{title}</div>
                    <div className="upsell-step-body">{body}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="upsell-stat-card">
              <div className="upsell-stat-value">+23%</div>
              <div className="upsell-stat-label">Average AOV lift for stores using 2+ rules</div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&family=Nunito+Sans:wght@300;400;600&display=swap');

  .upsell-wrapper {
    font-family: 'Nunito Sans', sans-serif;
    padding: 0 0 80px;
    max-width: 1140px;
    margin: 0 auto;
  }

  /* Header */
  .upsell-header { padding: 48px 4px 40px; border-bottom: 1px solid #E2E8F0; margin-bottom: 36px; }
  .upsell-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #F97316; margin-bottom: 12px; }
  .upsell-title { font-family: 'Rubik', sans-serif; font-size: clamp(28px, 4vw, 42px); font-weight: 700; color: #1E293B; margin: 0 0 12px; letter-spacing: -0.02em; line-height: 1.15; }
  .upsell-subtitle { font-size: 15px; font-weight: 300; color: #64748B; max-width: 540px; line-height: 1.65; margin: 0; }

  /* Layout */
  .upsell-layout { display: grid; grid-template-columns: 1fr 300px; gap: 28px; align-items: start; }
  @media (max-width: 900px) { .upsell-layout { grid-template-columns: 1fr; } }

  /* Empty */
  .upsell-empty { text-align: center; padding: 60px 24px; border: 2px dashed #E2E8F0; border-radius: 16px; background: #F8FAFC; margin-bottom: 20px; }
  .upsell-empty-icon { width: 56px; height: 56px; background: #EFF6FF; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #2563EB; margin: 0 auto 16px; }
  .upsell-empty-icon svg { width: 28px; height: 28px; }
  .upsell-empty-text { font-size: 14px; color: #64748B; font-weight: 300; line-height: 1.6; max-width: 280px; margin: 0 auto; }

  /* Rule Card */
  .upsell-rule-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 24px; margin-bottom: 16px; transition: all 0.2s ease; }
  .upsell-rule-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); }
  .upsell-rule-card--active { border-color: #BFDBFE; background: rgba(239,246,255,0.5); }

  .upsell-rule-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .upsell-rule-index { font-family: 'Rubik', sans-serif; font-size: 13px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.08em; }
  .upsell-rule-actions { display: flex; align-items: center; gap: 12px; }
  .upsell-rule-status { font-size: 12px; font-weight: 600; color: #64748B; }

  /* Toggle */
  .upsell-toggle { width: 44px; height: 24px; background: #CBD5E1; border-radius: 999px; border: none; cursor: pointer; position: relative; transition: background 0.2s ease; padding: 0; }
  .upsell-toggle--on { background: #2563EB; }
  .upsell-toggle-thumb { display: block; width: 18px; height: 18px; background: #fff; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.2); position: absolute; top: 3px; left: 3px; transition: transform 0.2s ease; }
  .upsell-toggle--on .upsell-toggle-thumb { transform: translateX(20px); }

  .upsell-delete-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #FECACA; background: #FEF2F2; color: #DC2626; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.18s ease; }
  .upsell-delete-btn:hover { background: #FEE2E2; border-color: #FCA5A5; }
  .upsell-delete-btn svg { width: 15px; height: 15px; }

  /* Fields */
  .upsell-rule-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 640px) { .upsell-rule-fields { grid-template-columns: 1fr; } }

  .upsell-field-group { display: flex; flex-direction: column; gap: 5px; }
  .upsell-label { font-size: 12px; font-weight: 600; color: #475569; }
  .upsell-input { font-family: 'Nunito Sans', sans-serif; font-size: 14px; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; outline: none; color: #1E293B; transition: border-color 0.18s ease, box-shadow 0.18s ease; background: #fff; }
  .upsell-input:focus { border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  .upsell-hint { font-size: 11px; color: #94A3B8; }

  /* Footer actions */
  .upsell-rule-footer-actions { display: flex; gap: 12px; align-items: center; padding-top: 4px; }

  .upsell-add-btn { display: flex; align-items: center; gap: 7px; font-family: 'Nunito Sans', sans-serif; font-size: 14px; font-weight: 600; padding: 11px 22px; border-radius: 10px; border: 1.5px solid #E2E8F0; background: #fff; color: #374151; cursor: pointer; transition: all 0.18s ease; }
  .upsell-add-btn:hover { border-color: #2563EB; color: #2563EB; background: #EFF6FF; }
  .upsell-add-btn svg { width: 16px; height: 16px; }

  .upsell-save-btn { display: flex; align-items: center; gap: 8px; font-family: 'Nunito Sans', sans-serif; font-size: 14px; font-weight: 600; padding: 11px 28px; border-radius: 10px; border: none; background: linear-gradient(135deg, #2563EB, #1D4ED8); color: #fff; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 14px rgba(37,99,235,0.3); }
  .upsell-save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.4); }
  .upsell-save-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

  .upsell-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: upspin 0.7s linear infinite; display: inline-block; }
  @keyframes upspin { to { transform: rotate(360deg); } }

  /* Sidebar */
  .upsell-sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 80px; }

  .upsell-howto { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 24px; }
  .upsell-howto-title { font-family: 'Rubik', sans-serif; font-size: 15px; font-weight: 600; color: #1E293B; margin: 0 0 20px; }
  .upsell-step { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 18px; }
  .upsell-step:last-child { margin-bottom: 0; }
  .upsell-step-num { font-family: 'Rubik', sans-serif; font-size: 11px; font-weight: 700; color: #2563EB; background: #EFF6FF; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .upsell-step-title { font-size: 13px; font-weight: 600; color: #1E293B; margin-bottom: 3px; }
  .upsell-step-body { font-size: 12px; color: #64748B; font-weight: 300; line-height: 1.55; }

  .upsell-stat-card { background: linear-gradient(135deg, #1E293B, #0F172A); border-radius: 16px; padding: 24px; text-align: center; }
  .upsell-stat-value { font-family: 'Rubik', sans-serif; font-size: 42px; font-weight: 700; color: #F97316; line-height: 1; margin-bottom: 8px; }
  .upsell-stat-label { font-size: 13px; color: rgba(255,255,255,0.6); font-weight: 300; line-height: 1.5; }
`;
