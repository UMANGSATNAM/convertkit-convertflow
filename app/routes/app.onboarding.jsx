import { authenticate } from "../shopify.server";
import { useFetcher, useNavigate, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState } from "react";
import { getThemeList } from "../lib/theme-presets";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const themes = getThemeList();
  return json({ themes, shop: session.shop });
};

const NICHES = [
  { id: "fashion", label: "Fashion", icon: "👗" },
  { id: "beauty", label: "Beauty", icon: "✨" },
  { id: "electronics", label: "Electronics", icon: "📱" },
  { id: "home", label: "Home & Living", icon: "🏠" },
  { id: "food", label: "Food & Drinks", icon: "🍕" },
  { id: "sports", label: "Sports & Fit", icon: "💪" },
  { id: "pets", label: "Pets", icon: "🐾" },
  { id: "other", label: "Other", icon: "🎯" },
];

const VIBES = [
  { id: "minimal", label: "Minimal", desc: "Clean and elegant", gradient: "linear-gradient(135deg, #F8FAFC, #E2E8F0)" },
  { id: "bold", label: "Bold", desc: "Vibrant and energetic", gradient: "linear-gradient(135deg, #0F172A, #EF4444)" },
  { id: "luxe", label: "Luxe", desc: "Dark and premium", gradient: "linear-gradient(135deg, #0A0A0A, #D4A574)" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState("");
  const [vibe, setVibe] = useState("");
  const [storeName, setStoreName] = useState("");
  const [product, setProduct] = useState("");

  const finish = () => {
    // Navigate to PageCraft builder with pre-filled params
    const params = new URLSearchParams({ niche, style: vibe, storeName, product });
    navigate(`/app/pagecraft?${params.toString()}`);
  };

  const progress = (step / 3) * 100;

  return (
    <div style={wrapperStyles}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Progress bar */}
      <div className="ob-progress">
        <div className="ob-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Dots */}
      <div className="ob-dots">
        {[1, 2, 3].map(i => (
          <div key={i} className={`ob-dot ${step >= i ? "ob-dot--active" : ""}`} />
        ))}
      </div>

      {/* Step 1: What do you sell? */}
      {step === 1 && (
        <div className="ob-center">
          <h1 className="ob-title">What do you sell?</h1>
          <p className="ob-sub">Pick your niche — we'll build the perfect page for it.</p>
          <div className="ob-niche-grid">
            {NICHES.map(n => (
              <button
                key={n.id}
                className={`ob-niche ${niche === n.id ? "ob-niche--active" : ""}`}
                onClick={() => setNiche(n.id)}
              >
                <span className="ob-niche-icon">{n.icon}</span>
                <span className="ob-niche-label">{n.label}</span>
              </button>
            ))}
          </div>
          <button className="ob-btn" disabled={!niche} onClick={() => setStep(2)}>
            Next
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </button>
        </div>
      )}

      {/* Step 2: What vibe? */}
      {step === 2 && (
        <div className="ob-center">
          <h1 className="ob-title">What vibe do you want?</h1>
          <p className="ob-sub">Choose a design style. You can always change it later.</p>
          <div className="ob-vibe-row">
            {VIBES.map(v => (
              <button
                key={v.id}
                className={`ob-vibe ${vibe === v.id ? "ob-vibe--active" : ""}`}
                onClick={() => setVibe(v.id)}
              >
                <div className="ob-vibe-preview" style={{ background: v.gradient }} />
                <div className="ob-vibe-name">{v.label}</div>
                <div className="ob-vibe-desc">{v.desc}</div>
              </button>
            ))}
          </div>
          <div className="ob-btn-row">
            <button className="ob-btn-back" onClick={() => setStep(1)}>Back</button>
            <button className="ob-btn" disabled={!vibe} onClick={() => setStep(3)}>
              Next
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Store details */}
      {step === 3 && (
        <div className="ob-center">
          <h1 className="ob-title">Almost there!</h1>
          <p className="ob-sub">Just two quick details and your AI-built page is ready.</p>
          <div className="ob-form">
            <div className="ob-field">
              <label className="ob-label">Store Name</label>
              <input
                className="ob-input"
                placeholder="e.g. GlowSkin, FitGear, PawPals…"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                maxLength={60}
                autoFocus
              />
            </div>
            <div className="ob-field">
              <label className="ob-label">Main Product</label>
              <input
                className="ob-input"
                placeholder="e.g. Organic face serum, Running shoes…"
                value={product}
                onChange={e => setProduct(e.target.value)}
                maxLength={80}
              />
            </div>
          </div>
          <div className="ob-btn-row">
            <button className="ob-btn-back" onClick={() => setStep(2)}>Back</button>
            <button className="ob-btn ob-btn--go" disabled={!storeName.trim()} onClick={finish}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
              Build My Page with AI
            </button>
          </div>
          <button className="ob-skip" onClick={() => navigate("/app")}>Skip for now</button>
        </div>
      )}

      {/* Brand footer */}
      <div className="ob-footer">
        <span className="ob-footer-text">Powered by PageCraft AI</span>
      </div>
    </div>
  );
}

const wrapperStyles = {
  position: "fixed", inset: 0, zIndex: 9999, background: "#0A0F1C",
  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  fontFamily: "'Nunito Sans', sans-serif",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&family=Nunito+Sans:wght@300;400;500;600;700&display=swap');

  .ob-progress { position: fixed; top: 0; left: 0; right: 0; height: 3px; background: #1E293B; z-index: 10; }
  .ob-progress-fill { height: 100%; background: linear-gradient(90deg, #10B981, #34D399); border-radius: 0 3px 3px 0; transition: width 0.5s ease; }

  .ob-dots { display: flex; gap: 8px; margin-bottom: 40px; }
  .ob-dot { width: 10px; height: 10px; border-radius: 50%; background: #1E293B; transition: all 0.3s; }
  .ob-dot--active { background: #10B981; box-shadow: 0 0 10px rgba(16,185,129,0.4); }

  .ob-center { display: flex; flex-direction: column; align-items: center; max-width: 660px; width: 100%; padding: 0 24px; }
  .ob-title { font-family: 'Rubik', sans-serif; font-size: clamp(28px, 5vw, 44px); font-weight: 800; color: #fff; margin: 0 0 12px; text-align: center; letter-spacing: -0.03em; }
  .ob-sub { font-size: 16px; color: #64748B; margin: 0 0 36px; text-align: center; line-height: 1.6; }

  /* Niche grid */
  .ob-niche-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; width: 100%; margin-bottom: 36px; }
  @media (max-width: 560px) { .ob-niche-grid { grid-template-columns: repeat(2, 1fr); } }
  .ob-niche {
    background: #151B2E; border: 2px solid transparent; border-radius: 14px; padding: 24px 12px;
    display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer;
    transition: all 0.2s; color: #CBD5E1;
  }
  .ob-niche:hover { border-color: #334155; transform: translateY(-2px); }
  .ob-niche--active { border-color: #10B981 !important; background: rgba(16,185,129,0.08); box-shadow: 0 0 16px rgba(16,185,129,0.15); }
  .ob-niche-icon { font-size: 32px; }
  .ob-niche-label { font-size: 14px; font-weight: 600; }

  /* Vibe row */
  .ob-vibe-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; width: 100%; margin-bottom: 36px; }
  @media (max-width: 560px) { .ob-vibe-row { grid-template-columns: 1fr; } }
  .ob-vibe {
    background: #151B2E; border: 2px solid transparent; border-radius: 16px; overflow: hidden;
    cursor: pointer; transition: all 0.2s; text-align: left;
  }
  .ob-vibe:hover { border-color: #334155; transform: translateY(-2px); }
  .ob-vibe--active { border-color: #10B981 !important; box-shadow: 0 0 16px rgba(16,185,129,0.2); }
  .ob-vibe-preview { height: 100px; }
  .ob-vibe-name { font-family: 'Rubik', sans-serif; font-size: 16px; font-weight: 700; color: #fff; padding: 14px 16px 4px; }
  .ob-vibe-desc { font-size: 13px; color: #64748B; padding: 0 16px 16px; }

  /* Form */
  .ob-form { width: 100%; max-width: 440px; margin-bottom: 32px; }
  .ob-field { margin-bottom: 18px; }
  .ob-label { display: block; font-size: 13px; font-weight: 600; color: #94A3B8; margin-bottom: 6px; }
  .ob-input {
    width: 100%; padding: 14px 16px; background: #151B2E; border: 2px solid #1E293B;
    border-radius: 10px; color: #fff; font-size: 15px; font-family: 'Nunito Sans', sans-serif;
    outline: none; transition: border-color 0.2s; box-sizing: border-box;
  }
  .ob-input:focus { border-color: #10B981; }
  .ob-input::placeholder { color: #475569; }

  /* Buttons */
  .ob-btn-row { display: flex; gap: 14px; align-items: center; }
  .ob-btn {
    display: flex; align-items: center; gap: 8px; padding: 14px 32px; background: #10B981;
    color: #fff; border: none; border-radius: 12px; font-size: 15px; font-weight: 700;
    cursor: pointer; font-family: 'Nunito Sans', sans-serif; transition: all 0.2s;
  }
  .ob-btn:hover:not(:disabled) { background: #059669; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(16,185,129,0.4); }
  .ob-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .ob-btn--go { padding: 16px 36px; font-size: 16px; background: linear-gradient(135deg, #10B981, #059669); }
  .ob-btn-back {
    background: transparent; border: 1.5px solid #334155; color: #94A3B8; padding: 12px 24px;
    border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;
    font-family: 'Nunito Sans', sans-serif; transition: all 0.15s;
  }
  .ob-btn-back:hover { border-color: #64748B; color: #CBD5E1; }

  .ob-skip { background: none; border: none; color: #475569; font-size: 13px; cursor: pointer; margin-top: 20px; font-family: 'Nunito Sans', sans-serif; transition: color 0.15s; }
  .ob-skip:hover { color: #94A3B8; }

  .ob-footer { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); }
  .ob-footer-text { font-size: 11px; color: #334155; font-weight: 500; letter-spacing: 0.05em; }
`;
