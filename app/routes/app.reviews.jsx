import { Page, BlockStack } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState } from "react";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({ hasApiKey: !!process.env.GEMINI_API_KEY });
};

const CATEGORIES = [
  { label: "General", value: "general" },
  { label: "Skincare & Beauty", value: "skincare" },
  { label: "Fashion & Apparel", value: "fashion" },
  { label: "Electronics", value: "electronics" },
  { label: "Home & Garden", value: "home" },
  { label: "Food & Supplements", value: "food" },
  { label: "Fitness & Sports", value: "fitness" },
];

const DELAY_OPTIONS = [
  { label: "7 days after delivery", value: "7" },
  { label: "14 days after delivery", value: "14" },
  { label: "21 days after delivery", value: "21" },
  { label: "30 days after delivery", value: "30" },
];

const STAR_OPTIONS = [5, 4, 3, 2, 1];

export default function Reviews() {
  const { hasApiKey } = useLoaderData();
  const fetcher = useFetcher();

  // Automation settings
  const [delay, setDelay] = useState("14");
  const [automationActive, setAutomationActive] = useState(false);

  // AI Generator
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("general");
  const [stars, setStars] = useState(5);
  const [notes, setNotes] = useState("");

  // History
  const [history, setHistory] = useState([]);

  const isGenerating = fetcher.state !== "idle";
  const generatedReview = fetcher.data?.review || "";
  const genError = fetcher.data?.error || "";

  const handleGenerate = () => {
    fetcher.submit(
      { starRating: String(stars), productName, productCategory: category, answers: notes },
      { method: "POST", action: "/api/review-generate" }
    );
  };

  // When new review arrives, add to history
  if (generatedReview && !history.find((h) => h.text === generatedReview)) {
    setHistory((prev) => [
      { id: Date.now(), text: generatedReview, stars, product: productName, copied: false },
      ...prev,
    ]);
  }

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text);
    setHistory((prev) => prev.map((h) => h.id === id ? { ...h, copied: true } : h));
    setTimeout(() => setHistory((prev) => prev.map((h) => h.id === id ? { ...h, copied: false } : h)), 2000);
  };

  return (
    <Page>
      <TitleBar title="AI Review Writing" />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="rv-wrapper">
        {/* Header */}
        <div className="rv-header">
          <div className="rv-eyebrow">Social Proof Engine</div>
          <h1 className="rv-title">Reviews & AI Writing</h1>
          <p className="rv-subtitle">
            Automate post-purchase review requests and use Gemini AI to generate natural-sounding review drafts that convert.
          </p>
        </div>

        <div className="rv-layout">
          {/* Left: Automation + Generator */}
          <div className="rv-main">
            {/* Automation Card */}
            <div className="rv-card">
              <div className="rv-card-header">
                <div className="rv-card-title-row">
                  <div className="rv-card-icon rv-card-icon--blue">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
                  </div>
                  <div>
                    <h2 className="rv-card-title">Review Request Automation</h2>
                    <p className="rv-card-sub">Send review request emails automatically after delivery</p>
                  </div>
                </div>
                <button
                  className={`rv-toggle ${automationActive ? "rv-toggle--on" : ""}`}
                  onClick={() => setAutomationActive(!automationActive)}
                >
                  <span className="rv-toggle-thumb" />
                </button>
              </div>
              <div className="rv-divider" />
              <label className="rv-label">Send request email</label>
              <div className="rv-select-wrap">
                <select className="rv-select" value={delay} onChange={(e) => setDelay(e.target.value)}>
                  {DELAY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <svg className="rv-select-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
              </div>
              <p className="rv-hint">Emails delivered via Shopify Email. Connect Klaviyo in Settings for advanced flows.</p>
            </div>

            {/* AI Generator Card */}
            <div className="rv-card">
              <div className="rv-card-header">
                <div className="rv-card-title-row">
                  <div className="rv-card-icon rv-card-icon--purple">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>
                  </div>
                  <div>
                    <h2 className="rv-card-title">AI Review Generator</h2>
                    <p className="rv-card-sub">Powered by Google Gemini</p>
                  </div>
                </div>
                <span className={`rv-api-badge ${hasApiKey ? "rv-api-badge--ok" : "rv-api-badge--err"}`}>
                  {hasApiKey ? "Gemini Connected" : "API Key Missing"}
                </span>
              </div>
              <div className="rv-divider" />

              {!hasApiKey && (
                <div className="rv-warning-box">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                  Add <code>GEMINI_API_KEY</code> to your <code>.env</code> to enable this feature.
                </div>
              )}

              <div className="rv-fields">
                <div className="rv-field">
                  <label className="rv-label">Product Name</label>
                  <input className="rv-input" placeholder="e.g. Hydrating Face Serum" value={productName} onChange={(e) => setProductName(e.target.value)} />
                </div>
                <div className="rv-field-row">
                  <div className="rv-field">
                    <label className="rv-label">Category</label>
                    <div className="rv-select-wrap">
                      <select className="rv-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                        {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                      <svg className="rv-select-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                    </div>
                  </div>
                  <div className="rv-field">
                    <label className="rv-label">Star Rating</label>
                    <div className="rv-star-row">
                      {STAR_OPTIONS.map((s) => (
                        <button key={s} className={`rv-star-btn ${stars >= s ? "rv-star-btn--active" : ""}`} onClick={() => setStars(s)}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="rv-field">
                  <label className="rv-label">Customer Notes</label>
                  <textarea className="rv-textarea" rows={3} placeholder="What did you love most? What problem did it solve? Separate multiple points with |" value={notes} onChange={(e) => setNotes(e.target.value)} />
                  <span className="rv-hint">Separate multiple points with | for richer output</span>
                </div>
              </div>

              {genError && <div className="rv-error-box">{genError}</div>}

              <button
                className="rv-generate-btn"
                onClick={handleGenerate}
                disabled={isGenerating || !productName || !hasApiKey}
              >
                {isGenerating ? <span className="rv-spinner" /> : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>
                )}
                {isGenerating ? "Generating with Gemini…" : "Generate Review Draft"}
              </button>
            </div>
          </div>

          {/* Right: History */}
          <div className="rv-sidebar">
            <div className="rv-history-card">
              <h3 className="rv-history-title">Generated History</h3>
              {history.length === 0 ? (
                <div className="rv-history-empty">
                  <p>Generated review drafts will appear here.</p>
                </div>
              ) : (
                <div className="rv-history-list">
                  {history.map((h) => (
                    <div key={h.id} className="rv-history-item">
                      <div className="rv-history-meta">
                        <span className="rv-history-product">{h.product}</span>
                        <span className="rv-history-stars">{"★".repeat(h.stars)}</span>
                      </div>
                      <p className="rv-history-text">{h.text}</p>
                      <button className="rv-copy-btn" onClick={() => copyToClipboard(h.id, h.text)}>
                        {h.copied ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                            Copied
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&family=Nunito+Sans:wght@300;400;600&display=swap');

  .rv-wrapper { font-family: 'Nunito Sans', sans-serif; padding: 0 0 80px; max-width: 1140px; margin: 0 auto; }

  .rv-header { padding: 48px 4px 40px; border-bottom: 1px solid #E2E8F0; margin-bottom: 36px; }
  .rv-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #7C3AED; margin-bottom: 12px; }
  .rv-title { font-family: 'Rubik', sans-serif; font-size: clamp(28px, 4vw, 42px); font-weight: 700; color: #1E293B; margin: 0 0 12px; letter-spacing: -0.02em; line-height: 1.15; }
  .rv-subtitle { font-size: 15px; font-weight: 300; color: #64748B; max-width: 560px; line-height: 1.65; margin: 0; }

  .rv-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
  @media (max-width: 960px) { .rv-layout { grid-template-columns: 1fr; } }

  .rv-main { display: flex; flex-direction: column; gap: 20px; }

  .rv-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 28px; }
  .rv-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
  .rv-card-title-row { display: flex; align-items: center; gap: 14px; }
  .rv-card-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .rv-card-icon svg { width: 22px; height: 22px; }
  .rv-card-icon--blue { background: #EFF6FF; color: #2563EB; }
  .rv-card-icon--purple { background: #F5F3FF; color: #7C3AED; }
  .rv-card-title { font-family: 'Rubik', sans-serif; font-size: 16px; font-weight: 600; color: #1E293B; margin: 0 0 3px; }
  .rv-card-sub { font-size: 12px; color: #94A3B8; font-weight: 300; margin: 0; }
  .rv-divider { height: 1px; background: #F1F5F9; margin: 0 0 20px; }

  /* Toggle */
  .rv-toggle { width: 48px; height: 26px; background: #CBD5E1; border-radius: 999px; border: none; cursor: pointer; position: relative; transition: background 0.2s; padding: 0; flex-shrink: 0; }
  .rv-toggle--on { background: #2563EB; }
  .rv-toggle-thumb { display: block; width: 20px; height: 20px; background: #fff; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.2); position: absolute; top: 3px; left: 3px; transition: transform 0.2s ease; }
  .rv-toggle--on .rv-toggle-thumb { transform: translateX(22px); }

  .rv-api-badge { font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 999px; flex-shrink: 0; }
  .rv-api-badge--ok { background: #DCFCE7; color: #15803D; }
  .rv-api-badge--err { background: #FEF9C3; color: #A16207; }

  .rv-fields { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }
  .rv-field { display: flex; flex-direction: column; gap: 5px; }
  .rv-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 560px) { .rv-field-row { grid-template-columns: 1fr; } }

  .rv-label { font-size: 12px; font-weight: 600; color: #475569; }
  .rv-input, .rv-textarea { font-family: 'Nunito Sans', sans-serif; font-size: 14px; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; outline: none; color: #1E293B; transition: border-color 0.18s ease, box-shadow 0.18s ease; width: 100%; background: #fff; resize: vertical; }
  .rv-input:focus, .rv-textarea:focus { border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
  .rv-hint { font-size: 11px; color: #94A3B8; }

  .rv-select-wrap { position: relative; }
  .rv-select { font-family: 'Nunito Sans', sans-serif; font-size: 14px; padding: 10px 36px 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; background: #fff; color: #1E293B; width: 100%; outline: none; appearance: none; cursor: pointer; transition: border-color 0.18s; }
  .rv-select:focus { border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
  .rv-select-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: #94A3B8; pointer-events: none; }

  .rv-star-row { display: flex; gap: 4px; margin-top: 2px; }
  .rv-star-btn { width: 32px; height: 32px; border: none; background: transparent; cursor: pointer; padding: 0; color: #CBD5E1; transition: color 0.15s; }
  .rv-star-btn--active { color: #F59E0B; }
  .rv-star-btn svg { width: 24px; height: 24px; }

  .rv-warning-box { background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #92400E; display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .rv-warning-box svg { width: 18px; height: 18px; flex-shrink: 0; color: #D97706; }
  .rv-warning-box code { background: rgba(0,0,0,0.08); padding: 1px 6px; border-radius: 4px; font-size: 12px; }

  .rv-error-box { background: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #B91C1C; margin-bottom: 16px; }

  .rv-generate-btn { font-family: 'Nunito Sans', sans-serif; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 10px; border: none; background: linear-gradient(135deg, #7C3AED, #6D28D9); color: #fff; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 14px rgba(124,58,237,0.3); }
  .rv-generate-btn svg { width: 18px; height: 18px; }
  .rv-generate-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.4); }
  .rv-generate-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
  .rv-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: rv-spin 0.7s linear infinite; display: inline-block; }
  @keyframes rv-spin { to { transform: rotate(360deg); } }

  /* Sidebar */
  .rv-sidebar { position: sticky; top: 80px; }
  .rv-history-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 24px; max-height: 680px; overflow-y: auto; }
  .rv-history-title { font-family: 'Rubik', sans-serif; font-size: 15px; font-weight: 600; color: #1E293B; margin: 0 0 16px; }
  .rv-history-empty { text-align: center; padding: 32px 16px; }
  .rv-history-empty p { font-size: 13px; color: #94A3B8; font-weight: 300; margin: 0; }
  .rv-history-list { display: flex; flex-direction: column; gap: 12px; }
  .rv-history-item { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px; }
  .rv-history-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .rv-history-product { font-size: 12px; font-weight: 600; color: #1E293B; }
  .rv-history-stars { font-size: 12px; color: #F59E0B; letter-spacing: 1px; }
  .rv-history-text { font-size: 13px; color: #475569; font-weight: 300; line-height: 1.55; margin: 0 0 10px; }
  .rv-copy-btn { font-family: 'Nunito Sans', sans-serif; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 7px; border: 1.5px solid #E2E8F0; background: #fff; color: #64748B; cursor: pointer; transition: all 0.18s; }
  .rv-copy-btn:hover { border-color: #7C3AED; color: #7C3AED; background: #F5F3FF; }
  .rv-copy-btn svg { width: 13px; height: 13px; }
`;
