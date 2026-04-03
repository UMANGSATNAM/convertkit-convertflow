import { useState, useCallback, useEffect } from "react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return json({ shopDomain: session.shop });
};

const NICHES = [
  { id: "fashion", label: "Fashion", icon: "👗", color: "#EC4899" },
  { id: "beauty", label: "Beauty", icon: "✨", color: "#F472B6" },
  { id: "electronics", label: "Electronics", icon: "📱", color: "#3B82F6" },
  { id: "home", label: "Home & Living", icon: "🏠", color: "#F59E0B" },
  { id: "food", label: "Food & Drinks", icon: "🍕", color: "#EF4444" },
  { id: "sports", label: "Sports & Fit", icon: "💪", color: "#10B981" },
  { id: "pets", label: "Pets", icon: "🐾", color: "#8B5CF6" },
  { id: "other", label: "Other", icon: "🎯", color: "#6B7280" },
];

const STYLES = [
  {
    id: "minimal",
    label: "Minimal",
    desc: "Clean, lots of whitespace, elegant",
    colors: ["#FFFFFF", "#F8FAFC", "#1E293B", "#64748B"],
    preview: "linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)",
  },
  {
    id: "bold",
    label: "Bold",
    desc: "Vibrant colors, strong typography",
    colors: ["#0F172A", "#EF4444", "#FBBF24", "#FFFFFF"],
    preview: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #EF4444 100%)",
  },
  {
    id: "luxe",
    label: "Luxe",
    desc: "Dark, premium, gold accents",
    colors: ["#0A0A0A", "#1C1917", "#D4A574", "#F5F0EB"],
    preview: "linear-gradient(135deg, #0A0A0A 0%, #1C1917 50%, #D4A574 100%)",
  },
];

export default function PageCraftBuilder() {
  const { shopDomain } = useLoaderData();
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState("");
  const [style, setStyle] = useState("");
  const [storeName, setStoreName] = useState("");
  const [product, setProduct] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedPage, setGeneratedPage] = useState(null);
  const [score, setScore] = useState(null);
  const [scoreBreakdown, setScoreBreakdown] = useState([]);
  const [improvements, setImprovements] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(null);
  const [error, setError] = useState("");
  const [activePreview, setActivePreview] = useState("desktop");
  const [selectedSection, setSelectedSection] = useState(null);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/pagecraft-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, style, storeName, product, whatsapp }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedPage(data.page);
        setScore(data.score);
        setScoreBreakdown(data.scoreBreakdown || []);
        setImprovements(data.improvements || []);
        setStep(4);
      } else {
        setError(data.error || "Generation failed. Please try again.");
      }
    } catch (e) {
      setError("Network error. Please check your connection.");
    } finally {
      setGenerating(false);
    }
  }, [niche, style, storeName, product, whatsapp]);

  const handlePublish = useCallback(async () => {
    if (!generatedPage) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/pagecraft-publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: generatedPage, storeName, whatsapp }),
      });
      const data = await res.json();
      if (data.success) {
        setPublished(data);
        setStep(5);
      } else {
        setError(data.error || "Publish failed.");
      }
    } catch (e) {
      setError("Network error during publish.");
    } finally {
      setPublishing(false);
    }
  }, [generatedPage, storeName]);

  const handleApplyFix = useCallback((fixType) => {
    if (!generatedPage) return;
    const sections = [...generatedPage.sections];
    const fixSections = {
      add_hero: { type: "hero", headline: "Welcome to " + (storeName || "Our Store"), subtext: "Discover premium products crafted just for you.", cta_text: "Shop Now", cta_color: "#10B981", background_color: "#0F172A" },
      add_trust: { type: "trust_badges", badges: [{ icon: "shield", label: "Secure Checkout" }, { icon: "truck", label: "Free Shipping" }, { icon: "refresh", label: "30-Day Returns" }, { icon: "star", label: "5-Star Rated" }], layout: "horizontal", background_color: "#F8FAFC" },
      add_social: { type: "social_proof", headline: "What Our Customers Say", reviews: [{ name: "Sarah M.", rating: 5, text: "Absolutely love this product! Fast shipping too.", location: "New York" }, { name: "James K.", rating: 5, text: "Best purchase I've made this year. Highly recommend!", location: "Los Angeles" }, { name: "Emily R.", rating: 4, text: "Great quality and the customer service is top notch.", location: "Chicago" }] },
      add_faq: { type: "faq", headline: "Frequently Asked Questions", items: [{ question: "How long does shipping take?", answer: "Standard shipping takes 3-5 business days. Express shipping is available at checkout for 1-2 day delivery." }, { question: "What is your return policy?", answer: "We offer a 30-day money-back guarantee. If you're not satisfied, return the product for a full refund." }, { question: "Do you ship internationally?", answer: "Yes! We ship to over 50 countries worldwide. International shipping typically takes 7-14 business days." }] },
      add_urgency: { type: "urgency_bar", message: "🔥 Limited stock — order in the next 2 hours for same-day dispatch!", background_color: "#DC2626", text_color: "#FFFFFF" },
      add_whatsapp: { type: "whatsapp_widget", phone: whatsapp || "1234567890", message: `Hi! I'm interested in your products at ${storeName || "your store"}.`, position: "bottom-right" },
    };
    if (fixSections[fixType]) {
      sections.push(fixSections[fixType]);
      setGeneratedPage({ ...generatedPage, sections });
      // Re-score
      const newImprovements = improvements.filter(imp => imp.fixType !== fixType);
      setImprovements(newImprovements);
      setScore(prev => Math.min(100, (prev || 0) + 10));
    }
  }, [generatedPage, storeName, improvements]);

  return (
    <div style={containerStyles}>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      {/* Sidebar */}
      <div className="pc-sidebar">
        <div className="pc-sidebar-brand">
          <div className="pc-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>
          </div>
          <span className="pc-brand-text">PageCraft AI</span>
        </div>

        {/* Progress Steps */}
        <div className="pc-steps">
          {[
            { num: 1, label: "Your Niche" },
            { num: 2, label: "Your Style" },
            { num: 3, label: "Your Store" },
            { num: 4, label: "Review & Score" },
            { num: 5, label: "Published!" },
          ].map((s) => (
            <div
              key={s.num}
              className={`pc-step ${step === s.num ? "pc-step--active" : ""} ${step > s.num ? "pc-step--done" : ""}`}
            >
              <div className="pc-step-dot">
                {step > s.num ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                ) : s.num}
              </div>
              <span className="pc-step-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Section tree (only on step 4) */}
        {step === 4 && generatedPage && (
          <div className="pc-section-tree">
            <div className="pc-tree-title">Page Sections</div>
            {generatedPage.sections.map((sec, idx) => (
              <div
                key={idx}
                className={`pc-tree-item ${selectedSection === idx ? "pc-tree-item--active" : ""}`}
                onClick={() => setSelectedSection(idx)}
              >
                <span className="pc-tree-icon">{sectionIcon(sec.type)}</span>
                <span className="pc-tree-label">{sectionLabel(sec.type)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Back to dashboard */}
        <a href="/app" className="pc-back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
          Back to Dashboard
        </a>
      </div>

      {/* Main Content */}
      <div className="pc-main">
        {/* Step 1: Niche */}
        {step === 1 && (
          <div className="pc-center-content">
            <div className="pc-step-header">
              <h1 className="pc-heading">What do you sell?</h1>
              <p className="pc-subtext">Pick your niche so we can build the perfect page for your store.</p>
            </div>
            <div className="pc-niche-grid">
              {NICHES.map((n) => (
                <button
                  key={n.id}
                  className={`pc-niche-btn ${niche === n.id ? "pc-niche-btn--active" : ""}`}
                  style={{ "--niche-color": n.color }}
                  onClick={() => setNiche(n.id)}
                >
                  <span className="pc-niche-icon">{n.icon}</span>
                  <span className="pc-niche-label">{n.label}</span>
                </button>
              ))}
            </div>
            <button
              className="pc-next-btn"
              disabled={!niche}
              onClick={() => setStep(2)}
            >
              Continue
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </button>
          </div>
        )}

        {/* Step 2: Style */}
        {step === 2 && (
          <div className="pc-center-content">
            <div className="pc-step-header">
              <h1 className="pc-heading">What vibe do you want?</h1>
              <p className="pc-subtext">Choose a design style. You can always change it later.</p>
            </div>
            <div className="pc-style-grid">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  className={`pc-style-card ${style === s.id ? "pc-style-card--active" : ""}`}
                  onClick={() => setStyle(s.id)}
                >
                  <div className="pc-style-preview" style={{ background: s.preview }} />
                  <div className="pc-style-info">
                    <div className="pc-style-name">{s.label}</div>
                    <div className="pc-style-desc">{s.desc}</div>
                    <div className="pc-style-colors">
                      {s.colors.map((c, i) => (
                        <div key={i} className="pc-style-swatch" style={{ background: c }} />
                      ))}
                    </div>
                  </div>
                  {style === s.id && <div className="pc-style-check">✓</div>}
                </button>
              ))}
            </div>
            <div className="pc-btn-row">
              <button className="pc-back-btn" onClick={() => setStep(1)}>Back</button>
              <button className="pc-next-btn" disabled={!style} onClick={() => setStep(3)}>
                Continue
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Store Details */}
        {step === 3 && (
          <div className="pc-center-content">
            <div className="pc-step-header">
              <h1 className="pc-heading">Tell us about your store</h1>
              <p className="pc-subtext">A few quick details so the AI can write perfect copy for you.</p>
            </div>
            <div className="pc-form">
              <div className="pc-field">
                <label className="pc-label">Store Name</label>
                <input
                  className="pc-input"
                  type="text"
                  placeholder="e.g. GlowSkin, FitGear, PawPals…"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  maxLength={60}
                />
              </div>
              <div className="pc-field">
                <label className="pc-label">Main Product or Category</label>
                <input
                  className="pc-input"
                  type="text"
                  placeholder="e.g. Organic face serum, Running shoes, Dog treats…"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  maxLength={80}
                />
              </div>
              <div className="pc-field">
                <label className="pc-label">WhatsApp Number <span style={{ fontWeight: 400, color: '#475569' }}>(optional)</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>📱</span>
                  <input
                    className="pc-input"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    maxLength={20}
                    style={{ paddingLeft: 42 }}
                  />
                </div>
                <span style={{ fontSize: 11, color: '#475569', marginTop: 4, display: 'block' }}>Adds a floating WhatsApp chat button to your page</span>
              </div>
              {error && <div className="pc-error">{error}</div>}
            </div>
            <div className="pc-btn-row">
              <button className="pc-back-btn" onClick={() => setStep(2)}>Back</button>
              <button
                className="pc-generate-btn"
                disabled={generating || !storeName.trim()}
                onClick={handleGenerate}
              >
                {generating ? (
                  <>
                    <span className="pc-spinner" />
                    Generating your page…
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                    Generate My Page
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review, Score & Preview */}
        {step === 4 && generatedPage && (
          <div className="pc-review-layout">
            {/* Preview Area */}
            <div className="pc-preview-area">
              <div className="pc-preview-toolbar">
                <div className="pc-viewport-btns">
                  <button className={`pc-vp-btn ${activePreview === "desktop" ? "pc-vp-btn--active" : ""}`} onClick={() => setActivePreview("desktop")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                  </button>
                  <button className={`pc-vp-btn ${activePreview === "mobile" ? "pc-vp-btn--active" : ""}`} onClick={() => setActivePreview("mobile")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>
                  </button>
                </div>
                <div className="pc-preview-label">Live Preview</div>
              </div>
              <div className="pc-preview-frame" style={{ maxWidth: activePreview === "mobile" ? 390 : "100%" }}>
                <PagePreview sections={generatedPage.sections} selectedIdx={selectedSection} />
              </div>
            </div>

            {/* Score Panel */}
            <div className="pc-score-panel">
              <div className="pc-score-ring-wrap">
                <ScoreRing score={score || 0} />
                <div className="pc-score-grade">
                  {score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 60 ? "C" : "D"}
                </div>
              </div>
              <h3 className="pc-score-title">Conversion Score</h3>

              {/* Breakdown */}
              <div className="pc-breakdown">
                {scoreBreakdown.map((item, i) => (
                  <div key={i} className={`pc-bd-item ${item.passed ? "pc-bd-item--pass" : "pc-bd-item--fail"}`}>
                    <span>{item.passed ? "✓" : "✗"}</span>
                    <span>{item.name}</span>
                    <span className="pc-bd-pts">+{item.points}/{item.maxPoints}</span>
                  </div>
                ))}
              </div>

              {/* Improvements */}
              {improvements.length > 0 && (
                <div className="pc-improvements">
                  <h4 className="pc-imp-title">Top Improvements</h4>
                  {improvements.slice(0, 3).map((imp, i) => (
                    <div key={i} className="pc-imp-item">
                      <span className="pc-imp-text">{typeof imp === "string" ? imp : imp.text || imp}</span>
                      {imp.fixType && (
                        <button className="pc-imp-fix" onClick={() => handleApplyFix(imp.fixType)}>
                          Fix
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {error && <div className="pc-error" style={{ marginTop: 16 }}>{error}</div>}

              {/* Actions */}
              <div className="pc-score-actions">
                <button className="pc-back-btn" onClick={() => { setStep(3); setGeneratedPage(null); }}>
                  Regenerate
                </button>
                <button className="pc-publish-btn" disabled={publishing} onClick={handlePublish}>
                  {publishing ? (
                    <><span className="pc-spinner" /> Publishing…</>
                  ) : (
                    <>Publish to Shopify</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Published! */}
        {step === 5 && published && (
          <div className="pc-center-content">
            <div className="pc-published-card">
              <div className="pc-published-icon">🎉</div>
              <h1 className="pc-heading">Your page is live!</h1>
              <p className="pc-subtext">
                "{published.title}" is now published on your Shopify store.
              </p>
              <a
                href={published.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pc-view-btn"
              >
                View Live Page
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              </a>
              <div className="pc-published-actions">
                <button className="pc-back-btn" onClick={() => { setStep(1); setGeneratedPage(null); setPublished(null); setScore(null); setNiche(""); setStyle(""); setStoreName(""); setProduct(""); setWhatsapp(""); }}>
                  Build Another Page
                </button>
                <a href="/app" className="pc-back-btn" style={{ textDecoration: "none", textAlign: "center" }}>
                  Back to Dashboard
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mini components
function ScoreRing({ score }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";
  return (
    <svg width="140" height="140" viewBox="0 0 120 120" className="pc-score-svg">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#1E293B" strokeWidth="8" />
      <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s ease", transform: "rotate(-90deg)", transformOrigin: "center" }} />
      <text x="60" y="60" textAnchor="middle" dy="0.35em" fill="#fff" fontSize="32" fontWeight="800" fontFamily="Rubik, sans-serif">{score}</text>
    </svg>
  );
}

function PagePreview({ sections, selectedIdx }) {
  return (
    <div className="pc-live-preview">
      {sections.map((sec, idx) => (
        <div key={idx} className={`pc-preview-section ${selectedIdx === idx ? "pc-preview-section--selected" : ""}`}
          style={{ outline: selectedIdx === idx ? "2px solid #10B981" : "none", borderRadius: 8 }}>
          {sec.type === "hero" && (
            <div style={{ background: sec.background_gradient || sec.background_color || "#0F172A", padding: "48px 20px", textAlign: "center", color: "#fff", borderRadius: 8 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 10px", lineHeight: 1.15 }}>{sec.headline}</h2>
              <p style={{ fontSize: 14, opacity: 0.75, margin: "0 0 20px" }}>{sec.subtext}</p>
              {sec.cta_text && <span style={{ display: "inline-block", padding: "10px 28px", background: sec.cta_color || "#10B981", borderRadius: 8, fontWeight: 700, fontSize: 14 }}>{sec.cta_text}</span>}
            </div>
          )}
          {sec.type === "product_showcase" && (
            <div style={{ padding: "32px 16px", textAlign: "center" }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 16px", color: "#1E293B" }}>{sec.headline}</h3>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${sec.columns || 3}, 1fr)`, gap: 12 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ background: "#F1F5F9", borderRadius: 8, padding: 16 }}>
                    <div style={{ height: 80, background: "#E2E8F0", borderRadius: 6, marginBottom: 8 }} />
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Product {i}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {sec.type === "trust_badges" && (
            <div style={{ padding: "20px 16px", background: sec.background_color || "#F8FAFC", display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", borderRadius: 8 }}>
              {(sec.badges || []).map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#475569" }}>
                  <span style={{ fontSize: 16 }}>✓</span> {b.label}
                </div>
              ))}
            </div>
          )}
          {sec.type === "social_proof" && (
            <div style={{ padding: "32px 16px", textAlign: "center" }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 16px", color: "#1E293B" }}>{sec.headline}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                {(sec.reviews || []).slice(0, 3).map((r, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: 14, textAlign: "left" }}>
                    <div style={{ color: "#F59E0B", fontSize: 12, marginBottom: 6 }}>{"★".repeat(r.rating || 5)}</div>
                    <p style={{ fontSize: 11, color: "#475569", margin: "0 0 8px", lineHeight: 1.5 }}>"{r.text}"</p>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#1E293B" }}>{r.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {sec.type === "faq" && (
            <div style={{ padding: "32px 16px", maxWidth: 500, margin: "0 auto" }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, textAlign: "center", margin: "0 0 16px", color: "#1E293B" }}>{sec.headline}</h3>
              {(sec.items || []).map((item, i) => (
                <div key={i} style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: "10px 14px", marginBottom: 8, background: "#fff" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{item.question}</div>
                </div>
              ))}
            </div>
          )}
          {sec.type === "urgency_bar" && (
            <div style={{ background: sec.background_color || "#DC2626", color: sec.text_color || "#fff", padding: "10px 16px", textAlign: "center", borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
              {sec.message}
            </div>
          )}
          {sec.type === "whatsapp_widget" && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#25D366", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600 }}>
              <svg viewBox="0 0 24 24" fill="#fff" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.487l4.624-1.467A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.178-.594-5.918-1.627l-.424-.253-2.742.87.878-2.688-.278-.442A9.77 9.77 0 012.182 12c0-5.419 4.4-9.818 9.818-9.818S21.818 6.581 21.818 12 17.419 21.818 12 21.818z"/></svg>
              WhatsApp Chat Widget — {sec.phone || "Click to chat"}
            </div>
          )}
          {sec.type === "footer" && (
            <div style={{ background: "#1E293B", color: "#94A3B8", padding: "24px 16px", borderRadius: 8, fontSize: 11, textAlign: "center" }}>
              Footer — {(sec.columns || []).map(c => c.title).join(" · ")}
              {sec.copyright && <div style={{ marginTop: 8, fontSize: 10 }}>{sec.copyright}</div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function sectionIcon(type) {
  const map = { hero: "🎯", product_showcase: "🛍️", trust_badges: "🛡️", social_proof: "⭐", faq: "❓", urgency_bar: "⏰", whatsapp_widget: "💬", footer: "📋" };
  return map[type] || "📄";
}
function sectionLabel(type) {
  const map = { hero: "Hero", product_showcase: "Products", trust_badges: "Trust Badges", social_proof: "Reviews", faq: "FAQ", urgency_bar: "Urgency", whatsapp_widget: "WhatsApp", footer: "Footer" };
  return map[type] || type;
}

const containerStyles = { width: "100vw", height: "100vh", display: "flex", position: "fixed", inset: 0, zIndex: 999, background: "#0A0F1C", fontFamily: "'Nunito Sans', sans-serif" };

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&family=Nunito+Sans:wght@300;400;500;600;700&display=swap');

  /* Sidebar */
  .pc-sidebar {
    width: 260px; min-width: 260px; background: #0F1524; border-right: 1px solid rgba(255,255,255,0.06);
    display: flex; flex-direction: column; padding: 24px 0; overflow-y: auto;
  }
  .pc-sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 0 20px 28px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .pc-logo-icon { width: 32px; height: 32px; color: #10B981; }
  .pc-logo-icon svg { width: 32px; height: 32px; }
  .pc-brand-text { font-family: 'Rubik', sans-serif; font-size: 16px; font-weight: 700; color: #fff; }

  /* Steps */
  .pc-steps { padding: 24px 20px; display: flex; flex-direction: column; gap: 4px; }
  .pc-step { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; transition: all 0.2s; }
  .pc-step--active { background: rgba(16,185,129,0.1); }
  .pc-step-dot {
    width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; background: #1E293B; color: #64748B; flex-shrink: 0; transition: all 0.3s;
  }
  .pc-step--active .pc-step-dot { background: #10B981; color: #fff; box-shadow: 0 0 14px rgba(16,185,129,0.4); }
  .pc-step--done .pc-step-dot { background: #059669; color: #fff; }
  .pc-step--done .pc-step-dot svg { width: 14px; height: 14px; }
  .pc-step-label { font-size: 13px; font-weight: 500; color: #64748B; }
  .pc-step--active .pc-step-label { color: #10B981; font-weight: 600; }
  .pc-step--done .pc-step-label { color: #94A3B8; }

  /* Section tree */
  .pc-section-tree { padding: 16px 16px; border-top: 1px solid rgba(255,255,255,0.06); flex: 1; overflow-y: auto; }
  .pc-tree-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #64748B; margin-bottom: 12px; padding: 0 4px; }
  .pc-tree-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 6px; cursor: pointer; transition: background 0.15s; }
  .pc-tree-item:hover { background: rgba(255,255,255,0.04); }
  .pc-tree-item--active { background: rgba(16,185,129,0.12) !important; }
  .pc-tree-icon { font-size: 14px; }
  .pc-tree-label { font-size: 13px; color: #CBD5E1; font-weight: 500; }
  .pc-tree-item--active .pc-tree-label { color: #10B981; }

  .pc-back-link { display: flex; align-items: center; gap: 8px; padding: 16px 20px; color: #64748B; text-decoration: none; font-size: 13px; font-weight: 500; border-top: 1px solid rgba(255,255,255,0.06); margin-top: auto; transition: color 0.15s; }
  .pc-back-link:hover { color: #CBD5E1; }

  /* Main */
  .pc-main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }

  /* Center content */
  .pc-center-content { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 40px; max-width: 800px; margin: 0 auto; width: 100%; }
  .pc-step-header { text-align: center; margin-bottom: 40px; }
  .pc-heading { font-family: 'Rubik', sans-serif; font-size: clamp(28px, 4vw, 42px); font-weight: 800; color: #fff; margin: 0 0 12px; letter-spacing: -0.025em; }
  .pc-subtext { font-size: 16px; color: #64748B; margin: 0; line-height: 1.6; }

  /* Niche grid */
  .pc-niche-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; width: 100%; margin-bottom: 40px; }
  @media (max-width: 640px) { .pc-niche-grid { grid-template-columns: repeat(2, 1fr); } }
  .pc-niche-btn {
    background: #151B2E; border: 2px solid transparent; border-radius: 14px; padding: 24px 16px;
    display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4,0,0.2,1); color: #CBD5E1;
  }
  .pc-niche-btn:hover { border-color: var(--niche-color); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
  .pc-niche-btn--active { border-color: var(--niche-color) !important; background: rgba(16,185,129,0.08); box-shadow: 0 0 20px rgba(16,185,129,0.15); }
  .pc-niche-icon { font-size: 32px; }
  .pc-niche-label { font-size: 14px; font-weight: 600; }

  /* Style cards */
  .pc-style-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; width: 100%; margin-bottom: 40px; }
  @media (max-width: 640px) { .pc-style-grid { grid-template-columns: 1fr; } }
  .pc-style-card {
    background: #151B2E; border: 2px solid transparent; border-radius: 16px; overflow: hidden;
    cursor: pointer; transition: all 0.2s; position: relative;
  }
  .pc-style-card:hover { border-color: #334155; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
  .pc-style-card--active { border-color: #10B981 !important; box-shadow: 0 0 20px rgba(16,185,129,0.2); }
  .pc-style-preview { height: 120px; }
  .pc-style-info { padding: 20px; }
  .pc-style-name { font-family: 'Rubik', sans-serif; font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .pc-style-desc { font-size: 13px; color: #64748B; margin-bottom: 12px; }
  .pc-style-colors { display: flex; gap: 6px; }
  .pc-style-swatch { width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.1); }
  .pc-style-check { position: absolute; top: 12px; right: 12px; width: 28px; height: 28px; background: #10B981; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; }

  /* Form */
  .pc-form { width: 100%; max-width: 480px; margin-bottom: 36px; }
  .pc-field { margin-bottom: 20px; }
  .pc-label { display: block; font-size: 13px; font-weight: 600; color: #94A3B8; margin-bottom: 8px; }
  .pc-input {
    width: 100%; padding: 14px 18px; background: #151B2E; border: 2px solid #1E293B; border-radius: 10px;
    color: #fff; font-size: 15px; font-family: 'Nunito Sans', sans-serif; outline: none; transition: border-color 0.2s;
    box-sizing: border-box;
  }
  .pc-input:focus { border-color: #10B981; }
  .pc-input::placeholder { color: #475569; }

  /* Buttons */
  .pc-btn-row { display: flex; gap: 14px; align-items: center; }
  .pc-next-btn, .pc-generate-btn, .pc-publish-btn {
    display: flex; align-items: center; gap: 8px; padding: 14px 32px; border-radius: 12px; border: none;
    font-family: 'Nunito Sans', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s;
  }
  .pc-next-btn { background: #10B981; color: #fff; }
  .pc-next-btn:hover:not(:disabled) { background: #059669; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(16,185,129,0.4); }
  .pc-next-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .pc-generate-btn { background: linear-gradient(135deg, #10B981, #059669); color: #fff; padding: 16px 36px; font-size: 16px; }
  .pc-generate-btn:hover:not(:disabled) { box-shadow: 0 6px 24px rgba(16,185,129,0.5); transform: translateY(-1px); }
  .pc-generate-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .pc-publish-btn { background: linear-gradient(135deg, #10B981, #059669); color: #fff; width: 100%; justify-content: center; font-size: 15px; padding: 14px; }
  .pc-publish-btn:hover:not(:disabled) { box-shadow: 0 6px 24px rgba(16,185,129,0.5); }
  .pc-publish-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .pc-back-btn { background: transparent; border: 1.5px solid #334155; color: #94A3B8; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Nunito Sans', sans-serif; transition: all 0.15s; }
  .pc-back-btn:hover { border-color: #64748B; color: #CBD5E1; }

  .pc-spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: pc-spin 0.7s linear infinite; display: inline-block; }
  @keyframes pc-spin { to { transform: rotate(360deg); } }

  .pc-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #FCA5A5; padding: 12px 16px; border-radius: 8px; font-size: 13px; width: 100%; text-align: center; }

  /* Review Layout */
  .pc-review-layout { display: flex; flex: 1; overflow: hidden; }
  .pc-preview-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .pc-preview-toolbar { padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; }
  .pc-viewport-btns { display: flex; gap: 4px; }
  .pc-vp-btn { background: #151B2E; border: 1px solid #1E293B; border-radius: 6px; padding: 6px 10px; color: #64748B; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; }
  .pc-vp-btn--active { background: #10B981; border-color: #10B981; color: #fff; }
  .pc-preview-label { font-size: 12px; color: #475569; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
  .pc-preview-frame { flex: 1; overflow-y: auto; padding: 20px; margin: 0 auto; width: 100%; transition: max-width 0.3s; }
  .pc-live-preview { display: flex; flex-direction: column; gap: 12px; }
  .pc-preview-section { transition: outline 0.15s; }
  .pc-preview-section--selected { outline: 2px solid #10B981; border-radius: 8px; }

  /* Score Panel */
  .pc-score-panel { width: 320px; min-width: 320px; background: #0F1524; border-left: 1px solid rgba(255,255,255,0.06); padding: 28px 20px; overflow-y: auto; display: flex; flex-direction: column; align-items: center; }
  .pc-score-ring-wrap { position: relative; margin-bottom: 8px; }
  .pc-score-grade { position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); background: #10B981; color: #fff; font-family: 'Rubik', sans-serif; font-size: 11px; font-weight: 800; padding: 2px 10px; border-radius: 999px; }
  .pc-score-title { font-family: 'Rubik', sans-serif; font-size: 14px; font-weight: 700; color: #CBD5E1; margin: 8px 0 20px; }
  .pc-breakdown { width: 100%; margin-bottom: 20px; }
  .pc-bd-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; font-size: 12px; color: #64748B; }
  .pc-bd-item--pass span:first-child { color: #10B981; }
  .pc-bd-item--fail span:first-child { color: #EF4444; }
  .pc-bd-pts { margin-left: auto; font-weight: 600; font-size: 11px; }
  .pc-improvements { width: 100%; margin-bottom: 20px; }
  .pc-imp-title { font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 10px; }
  .pc-imp-item { background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.15); border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; display: flex; align-items: flex-start; gap: 10px; }
  .pc-imp-text { font-size: 12px; color: #CBD5E1; line-height: 1.5; flex: 1; }
  .pc-imp-fix { background: #10B981; color: #fff; border: none; border-radius: 6px; padding: 4px 12px; font-size: 11px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.15s; }
  .pc-imp-fix:hover { background: #059669; }
  .pc-score-actions { width: 100%; display: flex; flex-direction: column; gap: 10px; margin-top: auto; }

  /* Published */
  .pc-published-card { text-align: center; }
  .pc-published-icon { font-size: 64px; margin-bottom: 20px; animation: pc-bounce 0.6s ease; }
  @keyframes pc-bounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); } }
  .pc-view-btn {
    display: inline-flex; align-items: center; gap: 8px; padding: 14px 36px; background: #10B981; color: #fff;
    text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; margin: 24px 0 32px; transition: all 0.2s;
  }
  .pc-view-btn:hover { background: #059669; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(16,185,129,0.4); }
  .pc-published-actions { display: flex; gap: 14px; justify-content: center; }
`;
